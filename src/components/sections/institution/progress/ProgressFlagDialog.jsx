import { useId } from 'react';
import Button from '../../../ui/Button.jsx';
import AgencyDialogShell from '../../agency/queries/AgencyDialogShell.jsx';
import { ProgressArrowrightIcon } from './ProgressIcons.jsx';
import { FLAG_COPY } from './data/progressData.js';

/*
 * ProgressFlagDialog — 11.3.2c "Flag for coaching" (Figma 8595:1413, card 528x296 "div.vid-card": white, r24, p 64/48, on the #1c2a21 scrim at 70 %):
 * title 32/40 600 centred · sentence 16/24 #575755 centred · green "Flag for coaching →" and the white "Cancel". Role alertdialog: focus starts on Cancel
 * (the safe choice), Esc = cancel, Tab trapped, focus returns to the opener. Props: first (student's first name), onConfirm(), onCancel().
 */

const ProgressFlagDialog = ({ first, onConfirm, onCancel }) => {
  const descId = useId();
  return (
    <AgencyDialogShell
      title={FLAG_COPY.title(first)}
      onClose={onCancel}
      scrim="bg-[#1c2a21]/70"
      role="alertdialog"
      describedBy={descId}
      className="mx-auto"
    >
      <div className="mx-auto flex max-w-[528px] flex-col items-center gap-[24px] rounded-[24px] bg-white px-[clamp(20px,2.8vw,48px)] py-[clamp(32px,3.7vw,64px)] shadow-[0_4px_0_rgba(0,0,0,0),0_40px_100px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-[10px] text-center">
          <h2 className="m-0 font-sans text-[26px] leading-[34px] font-semibold text-[#1c2a21] md:text-[32px] md:leading-[40px]">
            {FLAG_COPY.title(first)}
          </h2>
          <p id={descId} className="m-0 font-sans text-[16px] leading-[24px] text-[#575755]">
            {FLAG_COPY.body(first)}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-[8px]">
          <Button
            type="button"
            variant="primary"
            size="sm"
            rightIcon={<ProgressArrowrightIcon className="size-[16px]" />}
            className="!px-[16px] !py-[8.5px] !text-[14px]"
            onClick={onConfirm}
          >
            {FLAG_COPY.confirm}
          </Button>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            data-autofocus=""
            className="!rounded-[14px] !px-[16px] !py-[8.5px] !text-[14px]"
            onClick={onCancel}
          >
            {FLAG_COPY.cancel}
          </Button>
        </div>
      </div>
    </AgencyDialogShell>
  );
};

export default ProgressFlagDialog;
