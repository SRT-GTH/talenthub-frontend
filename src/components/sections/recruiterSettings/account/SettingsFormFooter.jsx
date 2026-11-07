import Button from '../../../ui/Button.jsx';
import { FOOTER_ACTIONS } from './accountData.js';

/*
 * SettingsFormFooter - "Cancel" + "Save changes" under the Account and Organisation cards (Figma "Footer" 10161:77569: right-aligned, gap 12, both buttons 48px).
 * "Save changes" is the disabled grey button (#bfbfbf, white label) until something changed and the form is valid; Cancel always looks live and resets to the saved values.
 */
const DIALOG_BUTTON = '!h-[48px] !py-0';

const SettingsFormFooter = ({ canSave, onCancel, onSave, saved = false }) => (
  <div className="flex flex-wrap items-center justify-end gap-[12px]">
    {saved ? (
      <p role="status" className="m-0 mr-auto font-sans text-[14px] font-medium text-[#387440]">
        Changes saved
      </p>
    ) : null}
    <Button variant="tertiary" className={DIALOG_BUTTON} onClick={onCancel}>
      {FOOTER_ACTIONS.cancel}
    </Button>
    <Button
      variant="primary"
      size="sm"
      className={DIALOG_BUTTON}
      disabled={!canSave}
      onClick={onSave}
    >
      {FOOTER_ACTIONS.save}
    </Button>
  </div>
);

export default SettingsFormFooter;
