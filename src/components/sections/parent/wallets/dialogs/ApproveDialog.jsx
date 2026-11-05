import { debug } from '../../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../../ui/DialogCard.jsx';
import ParentButton from '../../ParentButton.jsx';
import shieldRed from '../../../../../assets/parent/link-shield-red.svg';
import { APPROVE_COPY as C, ghs, ghsShort } from '../data/walletsData.js';
import { paymentSplit } from '../walletsStore.js';

const log = debug('ApproveDialog');

/*
 * ApproveDialog — PWa-02 "Approve GHS 90.00 for Abena?" (Figma 10034:152108) and its error state PWa-02c (10077:19347): 560 wide, p32, gap16, r24; 26/600 title over a 15 line and the grey 36px close;
 * a #f8f8f4 summary (r14, p16, gap16: label 14 #575755, value 14/600 #387440) — Paid to / From / Left after / This month — then "<ward> is told straight away…" 14, "Decline" (secondary) + "Approve payment" (primary).
 * The error adds the red callout (#fcece9, 1px #c0392b at 25 %, 18px shield, title 14/600 #c0392b, body 13 ink at 85 %) and the primary becomes "Try again".
 * Props: ward ({ firstName }), wallet (walletsStore entry), error (bool), onApprove, onDecline, onClose.
 * ⚠️ ASSUMPTION: the error is only reached from its frame URL (the mock never fails); "Try again" approves like "Approve payment".
 */
const Row = ({ label, value }) => (
  <div className="flex items-start justify-between gap-[16px] max-sm:flex-col max-sm:gap-[2px]">
    <dt className="text-[14px] leading-[20px] text-[#575755]">{label}</dt>
    <dd className="m-0 text-[14px] leading-[20px] font-semibold text-[#387440] sm:text-right">
      {value}
    </dd>
  </div>
);

const ApproveDialog = ({ ward, wallet, error = false, onApprove, onDecline, onClose }) => {
  const r = wallet.request;
  const { cash, cycles } = paymentSplit(wallet, r.amount);
  log('render', { error });
  const title = C.title(r, ward);

  return (
    <DialogCard
      label={title}
      onClose={onClose}
      width={560}
      padding={32}
      gap={16}
      className="items-start max-sm:!p-[20px]"
    >
      <div className="flex w-full items-start justify-between gap-[16px]">
        <div className="flex min-w-0 flex-col gap-[4px]">
          <h2 className="m-0 text-[26px] leading-[normal] font-semibold text-[#1c2a21] max-sm:text-[22px]">
            {title}
          </h2>
          <p className="m-0 text-[15px] leading-[normal] text-[#575755]">{C.sub(r)}</p>
        </div>
        <DialogCloseButton tone="grey" onClose={onClose} />
      </div>
      <dl className="m-0 flex w-full flex-col gap-[16px] rounded-[14px] bg-[#f8f8f4] p-[16px]">
        <Row label={C.paidTo} value={C.paidToValue(r)} />
        <Row
          label={C.from}
          value={`${ward.firstName}’s balance ${ghs(cash)}${cycles ? ` + ${cycles} Cycles` : ''}`}
        />
        <Row
          label={C.left}
          value={`${ghs(wallet.balance - cash)} · ${wallet.cycles - cycles} Cycles`}
        />
        <Row
          label={C.month}
          value={`${ghsShort(wallet.spent + r.amount)} of ${ghsShort(wallet.limits.monthly)}`}
        />
      </dl>
      {error ? (
        <div
          role="alert"
          className="flex w-full items-start gap-[12px] rounded-[12px] border border-solid border-[#c0392b]/25 bg-[#fcece9] px-[16px] py-[14px]"
        >
          <img src={shieldRed} alt="" aria-hidden="true" className="mt-[1px] size-[18px]" />
          <div className="flex min-w-0 flex-col gap-[2px]">
            <p className="m-0 text-[14px] leading-[17px] font-semibold text-[#c0392b]">
              {C.error.title}
            </p>
            <p className="m-0 text-[13px] leading-[16px] text-[#1c2a21]/85">{C.error.body}</p>
          </div>
        </div>
      ) : (
        <p className="m-0 text-[14px] leading-[normal] text-[#575755]">{C.told(ward)}</p>
      )}
      <div className="flex w-full flex-wrap items-center justify-end gap-[12px]">
        <ParentButton variant="secondary" onClick={onDecline}>
          {C.decline}
        </ParentButton>
        <ParentButton
          onClick={() => {
            log('approve');
            onApprove?.();
          }}
        >
          {error ? C.retry : C.approve}
        </ParentButton>
      </div>
    </DialogCard>
  );
};

export default ApproveDialog;
