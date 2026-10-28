import { useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../../ui/DialogCard.jsx';
import ParentButton from '../../ParentButton.jsx';
import ParentTextField from '../../ParentTextField.jsx';
import shield from '../../../../../assets/parent/link-shield-red.svg';
import { LIMITS_DIALOG as C } from '../data/walletsData.js';

const log = debug('LimitsDialog');

/*
 * LimitsDialog — PWa-05 "Abena’s limits" (Figma 10042:2958): 520 wide, p28, gap16, r24; 24/600 title + green-tone close, 14 intro, two fields side by side (225 each, gap 12: "Ask me above (GHS)" 50 /
 * "Monthly limit (GHS)" 200, helpers "Most parents use GHS 50" / "Resets on the 1st"), a #f8f8f4 info card (r14, p14, 18px shield, 12.5/500) "Withdrawals to mobile money unlock at 18…", "Cancel" + "Save limits".
 * Props: ward, limits { askAbove, monthly }, onClose, onSave({ askAbove, monthly }).
 * Validation (⚠️ ASSUMPTION, not drawn): both amounts must be above 0 and the monthly limit may not be below the ask-above amount; the message sits in the field's error state.
 */
const toNumber = (s) => (s.trim() === '' ? NaN : Number(s));

const LimitsDialog = ({ ward, limits, onClose, onSave }) => {
  const [askAbove, setAskAbove] = useState(String(limits.askAbove));
  const [monthly, setMonthly] = useState(String(limits.monthly));
  const [tried, setTried] = useState(false);
  const a = toNumber(askAbove);
  const m = toNumber(monthly);
  const aBad = !(a > 0);
  const mBad = !(m > 0);
  const orderBad = !aBad && !mBad && m < a;
  const title = C.title(ward);
  log('render', { askAbove, monthly });

  const save = () => {
    setTried(true);
    if (aBad || mBad || orderBad) return;
    log('save', { askAbove: a, monthly: m });
    onSave?.({ askAbove: a, monthly: m });
  };

  return (
    <DialogCard label={title} onClose={onClose} width={520} gap={16} className="items-start">
      <div className="flex w-full items-start justify-between gap-[16px]">
        <h2 className="m-0 text-[24px] leading-[normal] font-semibold text-[#1c2a21]">{title}</h2>
        <DialogCloseButton onClose={onClose} />
      </div>
      <p className="m-0 text-[14px] leading-[20px] text-[#575755]">{C.intro(ward)}</p>
      <div className="flex w-full items-start gap-[12px] max-sm:flex-col">
        <div className="min-w-0 flex-1 max-sm:w-full">
          <ParentTextField
            label={C.askAbove}
            required
            inputMode="decimal"
            value={askAbove}
            onChange={(e) => setAskAbove(e.target.value)}
            error={tried && (aBad ? C.errorAmount : orderBad ? C.errorOrder : undefined)}
            helperText={C.askAboveHelper}
          />
        </div>
        <div className="min-w-0 flex-1 max-sm:w-full">
          <ParentTextField
            label={C.monthly}
            required
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            error={tried && mBad ? C.errorAmount : undefined}
            helperText={C.monthlyHelper}
          />
        </div>
      </div>
      <div className="flex w-full items-start gap-[10px] rounded-[14px] bg-[#f8f8f4] p-[14px]">
        <img src={shield} alt="" aria-hidden="true" className="size-[18px] shrink-0" />
        <p className="m-0 text-[12.5px] leading-[18px] font-medium text-[#575755]">{C.info}</p>
      </div>
      <div className="flex w-full flex-wrap items-center justify-end gap-[12px]">
        <ParentButton variant="secondary" onClick={onClose}>
          {C.cancel}
        </ParentButton>
        <ParentButton onClick={save}>{C.save}</ParentButton>
      </div>
    </DialogCard>
  );
};

export default LimitsDialog;
