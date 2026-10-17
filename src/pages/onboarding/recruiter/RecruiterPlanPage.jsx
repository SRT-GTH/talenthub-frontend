import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterOnboardingShell from '../../../components/sections/recruiterOnboarding/RecruiterOnboardingShell.jsx';
import BillingHeading from '../../../components/sections/recruiterOnboarding/billing/BillingHeading.jsx';
import BillingToggle from '../../../components/sections/recruiterOnboarding/billing/BillingToggle.jsx';
import PlanCard from '../../../components/sections/recruiterOnboarding/billing/PlanCard.jsx';
import {
  ArrowRightIcon,
  ShieldIcon,
} from '../../../components/sections/recruiterOnboarding/billing/billingIcons.jsx';
import {
  PLANS,
  formatAmount,
  getPeriod,
  normaliseBilling,
  normaliseTier,
  planPrice,
} from '../../../components/sections/recruiterOnboarding/billing/billingData.js';
import Button from '../../../components/ui/Button.jsx';
import { RECRUITER_ROUTES } from '../../../components/shared/recruiterOnboardingSteps.js';
import { useRecruiterOnboarding } from '../../../hooks/useRecruiterOnboarding.js';
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterPlanPage');

/*
 * RecruiterPlanPage - /onboarding/recruiter/plan  (routeKey `plan`, R05, 56%)
 * Figma frames (rec_6.json), all STATES of this one page:
 *   7374:6764  Free selected (monthly)          CTA "Continue With Free"
 *   7374:7012  Professional selected (monthly)  CTA "Continue To Payment · $50/month"
 *   7374:7258  Enterprise selected (annual)     CTA "Continue To Payment · $2,000/year"
 * The frames have NO right panel (full-width step) -> `panel={false}`.
 *
 * Behaviour: plan cards are a native radio group (arrow keys); the toggle
 * switches every price + unit between monthly and annual; the summary CTA
 * reflects the selection. Free skips payment -> /preferences, paid ->
 * /payment.
 *
 * Mock state written on Continue (and on every change, so the Payment step
 * always reads the latest choice):
 *   setSection('plan', { tier: 'free' | 'professional' | 'enterprise',
 *                        billing: 'monthly' | 'annual' })
 * Demo-safe default: Free + monthly when nothing was chosen yet.
 *
 * Copy note: the Figma subtitle / privacy note differ between frames - 7374:6764
 * has "first  you" with the em dash missing, 7012/7258 have it ("first — you");
 * the em-dash version is used (obvious typo in the Free frame).
 */
const RecruiterPlanPage = () => {
  const navigate = useNavigate();
  const { data, setSection } = useRecruiterOnboarding();
  const [tier, setTier] = useState(() => normaliseTier(data.plan?.tier));
  const [billing, setBilling] = useState(() => normaliseBilling(data.plan?.billing));

  useEffect(() => {
    log('mount', { tier, billing });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (nextTier, nextBilling) => {
    log('persist', { tier: nextTier, billing: nextBilling });
    setSection('plan', { tier: nextTier, billing: nextBilling });
  };

  const handleSelect = (nextTier) => {
    setTier(nextTier);
    persist(nextTier, billing);
  };

  const handleBilling = (nextBilling) => {
    setBilling(nextBilling);
    persist(tier, nextBilling);
  };

  const period = getPeriod(billing);
  const free = tier === 'free';
  const ctaLabel = free
    ? 'Continue With Free'
    : `Continue To Payment · $${formatAmount(planPrice(tier, billing))}/${period.unitShort}`;

  const handleContinue = () => {
    persist(tier, billing);
    const next = free ? RECRUITER_ROUTES.preferences.path : RECRUITER_ROUTES.payment.path;
    log('continue', { tier, billing, next });
    navigate(next);
  };

  return (
    <RecruiterOnboardingShell routeKey="plan" panel={false}>
      <main className="flex w-full max-w-[897px] flex-col items-center gap-4 max-md:gap-3">
        <BillingHeading
          number="05"
          label="Choose a Plan"
          title="Pick your plan."
          subtitle="Simple pricing like any subscription — pay by card or Mobile Money. No PO, VAT or paperwork. Upgrade, downgrade or cancel anytime."
          subtitleClassName="max-w-[980px]"
        />

        <div className="flex w-full flex-col items-center gap-3">
          <BillingToggle value={billing} onChange={handleBilling} />

          <div
            role="radiogroup"
            aria-label="Plan"
            className="grid w-full grid-cols-1 gap-4 max-md:mx-auto max-md:max-w-[440px] md:grid-cols-3"
          >
            {PLANS.map((p) => (
              <PlanCard
                key={p.tier}
                plan={p}
                billing={billing}
                selected={p.tier === tier}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <div className="flex w-full items-center gap-[10px] rounded-[10px] border border-[#387440]/30 bg-[#ebf1ec]/50 px-4 py-3">
            <ShieldIcon className="size-[18px] shrink-0 text-[#387440]" />
            <p className="text-[14px] leading-6 tracking-[0.2px] text-[#2a5730]">
              Talent privacy always comes first — you only see what each talent allows, on any plan.
            </p>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleContinue}
          rightIcon={<ArrowRightIcon />}
          className="mt-1 w-full justify-center"
        >
          {ctaLabel}
        </Button>
      </main>
    </RecruiterOnboardingShell>
  );
};

export default RecruiterPlanPage;
