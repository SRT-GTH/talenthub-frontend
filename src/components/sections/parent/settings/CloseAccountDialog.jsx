import { debug } from '../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import ParentButton from '../ParentButton.jsx';
import ParentTextField from '../ParentTextField.jsx';
import spotWrong from '../../../../assets/parent/settings-spot-wrong.svg';
import warning from '../../../../assets/parent/settings-warning.svg';
import { CLOSE } from './data/settingsData.js';

const log = debug('SettingsCloseAccountDialog');

/*
 * CloseAccountDialog — PS-07 "Close parent account (confirm)" (Figma 10053:4444, modal 10053:4766): 560 wide, p28, gap16; the 80px spot and the close button, a 24/600 title, the intro line, an
 * info card (#f8f8f4, r24, p18) with four warning rows (13.5/500), a required "Type CLOSE to confirm" field and Keep my account / Close parent account. `?modal=close-account&confirm=<text>`.
 * The red button stays disabled (Figma draws it grey with "CLO" typed) until the box reads CLOSE.
 * Props: value, onChange(text), onKeep (close, Esc and the X too), onConfirm.
 * ⚠️ ASSUMPTION: the enabled button is the standard green primary (only the disabled look is drawn) and the match is exact, upper case.
 */
const CloseAccountDialog = ({ value, onChange, onKeep, onConfirm }) => {
  const ready = value.trim() === CLOSE.word;
  log('render', { typed: value.length, ready });

  return (
    <DialogCard
      label={CLOSE.title}
      onClose={onKeep}
      width={560}
      gap={16}
      focusCard={false}
      className="max-h-[calc(100dvh-32px)] overflow-y-auto"
    >
      <div className="flex items-start justify-between gap-[16px]">
        <img src={spotWrong} alt="" aria-hidden="true" className="size-[80px] shrink-0" />
        <DialogCloseButton onClose={onKeep} />
      </div>
      <h2 className="m-0 text-[24px] leading-[29px] font-semibold text-[#1c2a21]">{CLOSE.title}</h2>
      <p className="m-0 text-[14px] leading-[20px] text-[#575755]">{CLOSE.intro}</p>
      <ul className="m-0 flex list-none flex-col gap-[16px] rounded-[24px] bg-[#f8f8f4] p-[18px]">
        {CLOSE.points.map((p) => (
          <li key={p} className="flex items-start gap-[10px]">
            <img src={warning} alt="" aria-hidden="true" className="size-[18px] shrink-0" />
            <span className="text-[13.5px] leading-[16px] font-medium text-[#1c2a21]">{p}</span>
          </li>
        ))}
      </ul>
      <ParentTextField
        id="settings-close-confirm"
        label={CLOSE.label}
        required
        value={value}
        data-autofocus=""
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex flex-wrap items-center justify-end gap-[12px] py-[6px]">
        <ParentButton variant="secondary" onClick={onKeep}>
          {CLOSE.keep}
        </ParentButton>
        <ParentButton disabled={!ready} onClick={onConfirm}>
          {CLOSE.confirm}
        </ParentButton>
      </div>
    </DialogCard>
  );
};

export default CloseAccountDialog;
