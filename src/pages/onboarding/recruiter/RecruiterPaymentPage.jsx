import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterOnboardingShell from '../../../components/sections/recruiterOnboarding/RecruiterOnboardingShell.jsx';
import RecruiterOnboardingPanel from '../../../components/sections/recruiterOnboarding/RecruiterOnboardingPanel.jsx';
import BillingHeading from '../../../components/sections/recruiterOnboarding/billing/BillingHeading.jsx';
import OrderSummary from '../../../components/sections/recruiterOnboarding/billing/OrderSummary.jsx';
import MethodTabs from '../../../components/sections/recruiterOnboarding/billing/MethodTabs.jsx';
import CardForm from '../../../components/sections/recruiterOnboarding/billing/CardForm.jsx';
import MomoForm from '../../../components/sections/recruiterOnboarding/billing/MomoForm.jsx';
import {
  AwaitingApprovalDialog,
  PaymentSuccessDialog,
} from '../../../components/sections/recruiterOnboarding/billing/PaymentDialogs.jsx';
import { ArrowRightIcon } from '../../../components/sections/recruiterOnboarding/billing/billingIcons.jsx';
import {
  createPayment,
  MOMO_PROMPT_TTL_SECONDS,
  pollMomoApproval,
} from '../../../components/sections/recruiterOnboarding/billing/paymentApi.js';
import {
  BRAND_LABELS,
  detectBrand,
  formatExpiry,
  isCardComplete,
  isMomoNumberValid,
  lastFour,
  maskCardNumber,
  maskMomoNumber,
} from '../../../components/sections/recruiterOnboarding/billing/cardUtils.js';
import {
  formatUsdFull,
  formatUsdShort,
  getNetwork,
  getPlan,
  normaliseBilling,
  normaliseTier,
  panelId,
  planLabel,
  planPrice,
  renewalDate,
  tabId,
} from '../../../components/sections/recruiterOnboarding/billing/billingData.js';
import Button from '../../../components/ui/Button.jsx';
import { RECRUITER_ROUTES } from '../../../components/shared/recruiterOnboardingSteps.js';
import { useRecruiterOnboarding } from '../../../hooks/useRecruiterOnboarding.js';
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterPaymentPage');

/*
 * RecruiterPaymentPage - /onboarding/recruiter/payment (routeKey `payment`, R06, 67%)
 * Figma frames (rec_7.json), all STATES of this one page:
 *   7374:7507 card default (CTA disabled)   7374:7738 card filled (CTA "Pay $50.00")
 *   7374:7969 card declined (CTA "Try Again")
 *   7374:8197 Mobile Money filled ("Send Payment Prompt")
 *   7374:8437 MoMo awaiting approval (dialog, countdown)   7374:8715 successful (dialog)
 *
 * UI ONLY - NO REAL PAYMENT. Demo behaviour:
 *   - DECLINED DEMO CARD: any card number ENDING IN 0002 is declined
 *     (e.g. 4084 0840 8408 0002). Every other number succeeds after ~1.2 s.
 *     "Try Again" clears the error and puts the cursor in the card number field.
 *   - Mobile Money: "Send Payment Prompt" -> ~0.9 s -> "Approve on your phone"
 *     dialog (2:00 countdown) -> auto-approved after ~5 s -> success dialog.
 *     Closing the dialog / Esc cancels the prompt. If the countdown hits 0:00 the
 *     prompt expires and the form is shown again.
 *   - Success dialog: Continue / close / Esc -> /onboarding/recruiter/preferences.
 *   - Validation is Luhn-free (demo numbers work): name >= 2 chars, 13-19 digit
 *     number, future expiry, 3-digit CVV; MoMo needs a 9-digit Ghana number.
 *
 * SECURITY: the raw card number / CVV exist ONLY in this component's state while
 * typing. They are never put in the provider, localStorage, a URL, or any
 * debug() call (logs carry booleans/lengths/last4 only) and are cleared as soon
 * as the payment succeeds (the form then shows read-only masked placeholders).
 * The provider slice is just:
 *   setSection('payment', { method: 'card' | 'momo', status: 'declined' | 'paid',
 *                           brand: 'visa' | 'mastercard' | 'card' | 'mtn' | ..., last4 })
 * All "provider-shaped" work is in billing/paymentApi.js (createPayment,
 * pollMomoApproval - Promise-returning) so a hosted provider is a swap.
 *
 * Copy typos in Figma: 7374:8197 subtitle lacks the em dash ("Money  no PO");
 * the em-dash version (7374:7507) is used. Renewal / next-billing dates are
 * computed from today (Figma sample "12 Nov 2026"). Receipt e-mail comes from the
 * profile step, else the Figma sample address.
 */
const DECLINED_MESSAGE = 'Your bank declined this card. Try another card or pay with Mobile Money.';
const DEMO_EMAIL = 'k.asante@mtn.com.gh';
const EMPTY_CARD = { name: '', number: '', expiry: '', cvc: '' };
const EMPTY_MOMO = { network: 'mtn', number: '' };

const RecruiterPaymentPage = () => {
  const navigate = useNavigate();
  const { data, setSection } = useRecruiterOnboarding();

  // Demo-safe: a visitor who skipped the Plan step (or chose Free) is billed Professional.
  const storedTier = normaliseTier(data.plan?.tier);
  const tier = storedTier === 'free' ? 'professional' : storedTier;
  const billing = normaliseBilling(data.plan?.billing);
  const plan = getPlan(tier);
  const amount = planPrice(tier, billing);
  const renewal = useMemo(() => renewalDate(billing), [billing]);

  const [method, setMethod] = useState('card');
  const [card, setCard] = useState(EMPTY_CARD);
  const [momo, setMomo] = useState(EMPTY_MOMO);
  const [status, setStatus] = useState('idle'); // idle | processing | declined | awaiting | success
  const [secondsLeft, setSecondsLeft] = useState(MOMO_PROMPT_TTL_SECONDS);
  const [settled, setSettled] = useState(null); // display-only masked card snapshot
  const [receipt, setReceipt] = useState(null);

  const numberRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    log('mount', { tier, billing, amount });
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardReady = isCardComplete(card);
  const momoReady = isMomoNumberValid(momo.number);
  const busy = status === 'processing' || status === 'awaiting' || status === 'success';
  const ready = method === 'card' ? cardReady : momoReady;

  const changeMethod = (next) => {
    if (busy || next === method) return;
    log('method', next);
    setMethod(next);
    if (status === 'declined') setStatus('idle');
  };

  const changeCard = (patch) => {
    if (status === 'declined') setStatus('idle');
    setCard((prev) => ({ ...prev, ...patch }));
  };

  const finishPayment = useCallback(
    ({ methodLabel, reference, brand, last4, usedMethod }) => {
      log('payment success', { method: usedMethod, brand, last4 });
      setReceipt({ methodLabel, reference });
      setSection('payment', { method: usedMethod, status: 'paid', brand, last4 });
      setStatus('success');
    },
    [setSection]
  );

  const handlePay = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus('processing');
    log('pay start', { method, tier, billing, amount });

    try {
      if (method === 'card') {
        const brand = detectBrand(card.number);
        const result = await createPayment(
          { method: 'card', tier, billing, amount, card },
          { signal: controller.signal }
        );
        if (result.status === 'declined') {
          log('payment declined', { last4: result.last4 });
          setSection('payment', {
            method: 'card',
            status: 'declined',
            brand,
            last4: result.last4,
          });
          setStatus('declined');
          return;
        }
        // Success: keep only a masked, display-only snapshot, then wipe the inputs.
        setSettled({
          name: card.name.trim(),
          masked: maskCardNumber(card.number),
          expiry: formatExpiry(card.expiry),
        });
        setCard(EMPTY_CARD);
        finishPayment({
          usedMethod: 'card',
          brand,
          last4: result.last4,
          reference: result.reference,
          methodLabel: `${BRAND_LABELS[brand]} •••• ${result.last4}`,
        });
        return;
      }

      const network = getNetwork(momo.network);
      const created = await createPayment(
        { method: 'momo', tier, billing, amount, momo },
        { signal: controller.signal }
      );
      setSecondsLeft(MOMO_PROMPT_TTL_SECONDS);
      setStatus('awaiting');
      await pollMomoApproval({ reference: created.reference }, { signal: controller.signal });
      const last4 = lastFour(momo.number);
      setMomo((prev) => ({ ...prev, number: '' }));
      finishPayment({
        usedMethod: 'momo',
        brand: network.key,
        last4,
        reference: created.reference,
        methodLabel: `${network.label} •••• ${last4}`,
      });
    } catch (err) {
      if (err?.name === 'AbortError') {
        log('payment aborted');
        return;
      }
      log.error('payment failed unexpectedly', err?.name);
      setStatus('idle');
    }
  };

  const cancelMomoPrompt = useCallback(() => {
    log('momo prompt cancelled');
    abortRef.current?.abort();
    setStatus('idle');
  }, []);

  // MoMo prompt countdown (Figma "Waiting for approval · 1:42"); expiry returns to the form.
  useEffect(() => {
    if (status !== 'awaiting') return undefined;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          log('momo prompt expired');
          abortRef.current?.abort();
          setStatus('idle');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  const handleTryAgain = () => {
    log('try again');
    setStatus('idle');
    requestAnimationFrame(() => {
      numberRef.current?.focus();
      numberRef.current?.select?.();
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === 'declined') {
      handleTryAgain();
      return;
    }
    if (!ready || busy) return;
    handlePay();
  };

  const goNext = () => {
    log('continue to preferences');
    navigate(RECRUITER_ROUTES.preferences.path);
  };

  const ctaLabel =
    method === 'momo'
      ? 'Send Payment Prompt'
      : status === 'declined'
        ? 'Try Again'
        : `Pay ${formatUsdFull(amount)}`;
  const ctaDisabled = status === 'declined' ? false : !ready || busy;

  const summarySubtitle =
    method === 'momo'
      ? `≈ GH₵ at checkout rate · renews ${renewal}`
      : `Billed today · renews ${renewal} · cancel anytime`;

  const network = getNetwork(momo.network);

  return (
    <RecruiterOnboardingShell
      routeKey="payment"
      // Figma 7374:8437 / 8715 (MoMo awaiting + successful) show the "Secured by Paystack" chips.
      panel={
        <RecruiterOnboardingPanel
          variant={status === 'awaiting' || status === 'success' ? 'paystack' : 'profile'}
        />
      }
    >
      <main className="flex w-full max-w-[699px] flex-col items-center gap-4 max-md:gap-3">
        <BillingHeading
          number="06"
          label="Payment"
          title="One quick payment."
          subtitle="Pay by card or Mobile Money — no PO, VAT or tax ID. Your plan activates the moment payment goes through."
          subtitleClassName="max-w-[482px]"
        />

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex w-full flex-col gap-4 max-md:gap-3"
        >
          <OrderSummary
            title={planLabel(tier, billing)}
            subtitle={summarySubtitle}
            price={formatUsdShort(amount)}
          />

          <MethodTabs value={method} onChange={changeMethod} disabled={busy} />

          <div
            role="tabpanel"
            id={panelId('pay-method', method)}
            aria-labelledby={tabId('pay-method', method)}
            className="flex flex-col gap-4"
          >
            {method === 'card' ? (
              <CardForm
                card={card}
                onChange={changeCard}
                declined={status === 'declined'}
                declinedMessage={DECLINED_MESSAGE}
                settled={settled}
                disabled={busy}
                numberRef={numberRef}
              />
            ) : (
              <MomoForm
                momo={momo}
                onChange={(patch) => setMomo((prev) => ({ ...prev, ...patch }))}
                disabled={busy}
              />
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={ctaDisabled}
            aria-busy={status === 'processing' || undefined}
            rightIcon={status === 'processing' ? undefined : <ArrowRightIcon />}
            className="mt-2 w-full justify-center max-md:mt-0"
          >
            {ctaLabel}
          </Button>
          <span role="status" className="sr-only">
            {status === 'processing' ? 'Processing payment' : ''}
          </span>
        </form>
      </main>

      <AwaitingApprovalDialog
        open={status === 'awaiting'}
        onClose={cancelMomoPrompt}
        networkLabel={network.label}
        maskedNumber={maskMomoNumber(momo.number)}
        amountLabel={formatUsdFull(amount)}
        planName={plan.name}
        secondsLeft={secondsLeft}
      />
      <PaymentSuccessDialog
        open={status === 'success'}
        onContinue={goNext}
        planLabel={planLabel(tier, billing)}
        planName={plan.name}
        amountLabel={formatUsdFull(amount)}
        methodLabel={receipt?.methodLabel ?? ''}
        reference={receipt?.reference ?? ''}
        nextBilling={renewal}
        email={data.profile?.email || DEMO_EMAIL}
      />
    </RecruiterOnboardingShell>
  );
};

export default RecruiterPaymentPage;
