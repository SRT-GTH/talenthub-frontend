import Button from '../../../ui/Button.jsx';
import { debug } from '../../../../utils/debug.js';
import BillingDialog from './BillingDialog.jsx';
import {
  ArrowRightIcon,
  CalendarDialogIcon,
  CardIcon,
  CheckCircleFillSmallIcon,
  CheckCircleSmallIcon,
  CheckTileIcon,
  PhoneIcon,
  ShieldSmallIcon,
} from './billingIcons.jsx';

const log = debug('PaymentDialogs');

/*
 * PaymentDialogs - the two result cards of the Payment step.
 *   AwaitingApprovalDialog  Figma 7374:8437 "MoMo awaiting approval"
 *   PaymentSuccessDialog    Figma 7374:8715 "Successful"
 * Both: 64px green check tile (#e1eae2 r10), status pill (24px, r6, #ebf1ec@50
 * border #c1d4c4, dot + 12px #999), Bricolage 29/600 headline, 12/18 #959592
 * description, summary box (#ebf1ec@30, border #e1eae2, r16, rows 12px), 4px
 * #ebf1ec progress track, 56px primary CTA, 10px footer note with shield.
 * "Coming soon" / "Get Assessed" / "Get Matched" strings inside the Figma pill
 * are leftover template layers (not visible) and are intentionally not built.
 *
 * Props (Awaiting): open, onClose (cancel the prompt), networkLabel, maskedNumber,
 *   amountLabel, planName, secondsLeft.
 * Props (Success):  open, onContinue, planLabel, planName, amountLabel,
 *   methodLabel, reference, nextBilling, email.
 */

const Pill = ({ children }) => (
  <span className="inline-flex h-6 items-center gap-[6px] rounded-md border border-[#c1d4c4] bg-[#ebf1ec]/50 px-8 py-0 max-sm:px-4">
    <span
      aria-hidden="true"
      className="size-2 shrink-0 rounded-full border-[1.5px] border-[#1d7c4d] bg-[#c1d4c4]"
      style={{ boxShadow: '0 0 4px 0 #387440' }}
    />
    <span className="text-[12px] leading-[18px] tracking-[0.2px] text-[#999999]">{children}</span>
  </span>
);

const Hero = ({ pill }) => (
  <div className="flex flex-col items-center gap-5">
    <CheckTileIcon className="size-16 shrink-0" />
    <Pill>{pill}</Pill>
  </div>
);

const Headline = ({ id, title, children }) => (
  <div className="flex flex-col items-center gap-1 text-center">
    <h2
      id={id}
      className="font-heading text-[29px] font-semibold leading-[35px] tracking-[-0.58px] text-[#1c2a21] max-sm:text-[26px]"
    >
      {title}
    </h2>
    <p className="max-w-[324px] text-[12px] leading-[18px] tracking-[0.2px] text-[#959592]">
      {children}
    </p>
  </div>
);

const Row = ({ icon, label, value, check, last }) => (
  <div
    className={`flex items-center justify-between gap-3 py-2 ${last ? '' : 'border-b border-[#e1eae2]'}`}
  >
    <span className="flex items-center gap-3 text-[12px] leading-[18px] tracking-[0.2px] text-[#575755]">
      <span className="inline-flex size-4 shrink-0 text-[#387440]">{icon}</span>
      {label}
    </span>
    <span className="flex items-center gap-2 text-right text-[12px] font-semibold leading-5 tracking-[0.2px] text-[#387440]">
      {check && <CheckCircleSmallIcon className="size-3 shrink-0" />}
      {value}
    </span>
  </div>
);

const Footer = () => (
  <p className="flex items-center justify-center gap-1 text-[10px] leading-4 tracking-[0.2px] text-[#959592]">
    <ShieldSmallIcon className="size-3 shrink-0" />
    Data encrypted at rest · Ghana Data Protection Act compliant
  </p>
);

const formatClock = (seconds) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export const AwaitingApprovalDialog = ({
  open,
  onClose,
  networkLabel,
  maskedNumber,
  amountLabel,
  planName,
  secondsLeft,
}) => {
  log('render awaiting', { open, secondsLeft });
  return (
    <BillingDialog open={open} onClose={onClose} labelledBy="momo-approval-title">
      <div className="flex flex-col gap-4">
        <Hero pill="Waiting for approval" />
        <Headline id="momo-approval-title" title="Approve on your phone.">
          We sent a payment prompt to your phone. Enter your MoMo PIN to approve {amountLabel} for
          GTH {planName}.
        </Headline>
        <div className="flex flex-col gap-1 rounded-2xl border border-[#e1eae2] bg-[#ebf1ec]/30 px-[17px] py-5">
          <Row icon={<CardIcon className="size-4" />} label="Network" value={networkLabel} />
          <Row icon={<PhoneIcon className="size-4" />} label="Number" value={maskedNumber} last />
        </div>
        <div className="flex flex-col gap-4">
          <div aria-hidden="true" className="h-1 w-full rounded bg-[#ebf1ec]" />
          <div className="flex flex-col gap-[14px]">
            <Button
              size="lg"
              aria-disabled="true"
              rightIcon={<ArrowRightIcon />}
              onClick={(e) => e.preventDefault()}
              className="w-full cursor-default justify-center bg-[#2d5d33]! border-[#224626]! drop-shadow-none! active:translate-y-0!"
            >
              <span role="timer">Waiting for approval · {formatClock(secondsLeft)}</span>
            </Button>
            <Footer />
          </div>
        </div>
      </div>
    </BillingDialog>
  );
};

export const PaymentSuccessDialog = ({
  open,
  onContinue,
  planLabel,
  planName,
  amountLabel,
  methodLabel,
  reference,
  nextBilling,
  email,
}) => {
  log('render success', { open });
  return (
    <BillingDialog open={open} onClose={onContinue} labelledBy="payment-success-title">
      <div className="flex flex-col gap-4">
        <Hero pill="Plan activated" />
        <Headline id="payment-success-title" title="Payment successful.">
          Your {planName} plan is active. A receipt has been sent to {email}.
        </Headline>
        <div className="flex flex-col rounded-2xl border border-[#e1eae2] bg-[#ebf1ec]/30 px-[14px] py-[6px]">
          <Row
            icon={<CheckCircleFillSmallIcon className="size-4" />}
            label="Plan"
            value={planLabel}
          />
          <Row icon={<CardIcon className="size-4" />} label="Amount paid" value={amountLabel} />
          <Row icon={<CardIcon className="size-4" />} label="Method" value={methodLabel} />
          <Row
            icon={<CheckCircleSmallIcon className="size-4" />}
            label="Reference"
            value={reference}
            check
          />
          <Row
            icon={<CalendarDialogIcon className="size-4" />}
            label="Next billing"
            value={nextBilling}
            check
            last
          />
        </div>
        <div className="flex flex-col gap-4">
          <div aria-hidden="true" className="h-1 w-full rounded bg-[#ebf1ec]" />
          <div className="flex flex-col gap-[14px]">
            <Button
              size="lg"
              onClick={onContinue}
              rightIcon={<ArrowRightIcon />}
              className="w-full justify-center"
            >
              Continue To Preferences
            </Button>
            <Footer />
          </div>
        </div>
      </div>
    </BillingDialog>
  );
};
