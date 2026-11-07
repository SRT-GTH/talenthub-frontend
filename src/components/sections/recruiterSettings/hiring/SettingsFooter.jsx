import Button from '../../../ui/Button.jsx';
import LiveSaveStatus from '../../talentSettings/LiveSaveStatus.jsx';
import { FOOTER_COPY } from './hiringData.js';

/*
 * SettingsFooter - the Cancel / Save changes row under the recruiter Settings cards (Figma "Footer": 10161:80080 with the hint, 10161:80827 disabled).
 * Right aligned, gap 12: the hint "You have unsaved changes" (12/20 500 #463409) while `dirty`, a white Cancel (lg tertiary) and "Save changes".
 * Save is the sm primary (139px) while enabled and the md grey disabled button (159px) when nothing can be saved, as drawn in SR-10 / SR-12.
 * Props: dirty, saveDisabled, onCancel, onSave, status ({ tone, text } shown in the hint's place after a save, via talent LiveSaveStatus), leading (node pinned to the left).
 */
const SettingsFooter = ({ dirty, saveDisabled = false, onCancel, onSave, status, leading }) => (
  <div className="flex flex-wrap items-center justify-end gap-x-[12px] gap-y-[10px] pb-[6px]">
    {leading ? <div className="mr-auto">{leading}</div> : null}
    {dirty ? (
      <p className="m-0 text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#463409]">
        {FOOTER_COPY.unsaved}
      </p>
    ) : (
      <LiveSaveStatus status={status} className="!text-[12px] !leading-[20px]" />
    )}
    <Button variant="tertiary" size="lg" onClick={onCancel}>
      {FOOTER_COPY.cancel}
    </Button>
    <Button
      variant="primary"
      size={saveDisabled ? 'md' : 'sm'}
      disabled={saveDisabled}
      onClick={onSave}
    >
      {FOOTER_COPY.save}
    </Button>
  </div>
);

export default SettingsFooter;
