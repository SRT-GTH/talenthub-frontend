import { useId } from 'react';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import {
  SkillsLabCheckCircleGlyph,
  SkillsLabLogOutGlyph,
  SkillsLabRefreshGlyph,
} from './SkillsLabDialogIcons.jsx';
import {
  ButtonRow,
  DialogHeader,
  DialogShell,
  PrimaryButton,
  SecondaryButton,
} from './SkillsLabDialogParts.jsx';
import { SKILLS_LAB_LEAVE, SKILLS_LAB_RESTART } from './skillsLabData.js';
import { fill, unitFor } from './skillsLabDialogUtils.js';

const log = debug('SkillsLabLabDialogs');

/*
 * Lab-play confirmations, mounted by the lab flow (they are not part of SkillsLabDialogs).
 * Both take `{ onClose, onConfirm }`: `onClose` = dismiss (X, Esc, scrim, the secondary button), `onConfirm` = the primary action.
 * Optional copy props default to the Figma frames (Python, challenge 5 of 8, 3 correct answers).
 */

/* SL-M5 · Start over · Confirm (Playful 7854:14117 / Focused 8110:491350). */
export const RestartLabDialog = ({ onClose, onConfirm, lab = 'Python', correct = 3 }) => {
  const titleId = useId();
  const { uiStyle } = useUiStyle();
  const copy = SKILLS_LAB_RESTART;
  return (
    <DialogShell width={500} onClose={onClose} labelId={titleId}>
      <DialogHeader
        id={titleId}
        title={fill(copy.title, { lab })}
        tileClass="bg-[#faf4e8]"
        icon={<SkillsLabRefreshGlyph className="size-[21px] text-[#463409]" />}
        onClose={onClose}
      />
      <p className="m-0 font-sans text-[15px] leading-[22px] text-[#1c2a21]">
        {fill(copy.body, { n: correct, unit: unitFor(uiStyle) })}
      </p>
      <ButtonRow a={230} b={198}>
        <SecondaryButton onClick={onClose}>{copy.keep}</SecondaryButton>
        <PrimaryButton
          onClick={() => {
            log('restart confirmed', lab);
            onConfirm?.();
          }}
        >
          {copy.confirm}
        </PrimaryButton>
      </ButtonRow>
    </DialogShell>
  );
};

/* SL-M6 · Leave lab · Confirm (Playful 7854:14622 / Focused 8110:491736). */
export const LeaveLabDialog = ({ onClose, onConfirm, challenge = 5, total = 8 }) => {
  const titleId = useId();
  const copy = SKILLS_LAB_LEAVE;
  return (
    <DialogShell width={500} onClose={onClose} labelId={titleId}>
      <DialogHeader
        id={titleId}
        title={copy.title}
        tileClass="bg-[#ffd86b]"
        icon={<SkillsLabLogOutGlyph className="size-[21px]" />}
        onClose={onClose}
      />
      <p className="m-0 font-sans text-[15px] leading-[22px] text-[#1c2a21]">
        {fill(copy.body, { challenge, total })}
      </p>
      <div className="flex items-center gap-[10px] rounded-[12px] bg-[#ebf1ec] p-[12px]">
        <SkillsLabCheckCircleGlyph className="size-[18px] shrink-0 text-[#387440]" />
        <span className="min-w-0 flex-1 font-sans text-[13.5px] font-medium leading-[16px] text-[#2a5730]">
          {copy.note}
        </span>
      </div>
      <ButtonRow a={230} b={198}>
        <SecondaryButton onClick={onClose}>{copy.keep}</SecondaryButton>
        <PrimaryButton
          onClick={() => {
            log('leave confirmed');
            onConfirm?.();
          }}
        >
          {copy.confirm}
        </PrimaryButton>
      </ButtonRow>
    </DialogShell>
  );
};
