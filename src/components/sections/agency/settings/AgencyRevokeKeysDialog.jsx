import { SettingsTrashIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import { SettingsDialog } from '../../talentSettings/SettingsBDialogs.jsx';

/*
 * AgencyRevokeKeysDialog — confirmation for "Revoke all keys" (Figma 11.6.1e danger card, 8597:397938; the dialog is not drawn).
 * Copy is the card's own: "Use this if a key leaks. Every system using GTH data stops at once." / "This can’t be undone". ⚠️ ASSUMPTION: the dialog layout
 * reuses the remove-access dialog (11.6.1d). Focus trapped, Esc closes, focus returns to the opener.
 * Props: onClose, onConfirm.
 */
const AgencyRevokeKeysDialog = ({ onClose, onConfirm }) => (
  <SettingsDialog
    open
    title="Revoke all keys?"
    icon={<SettingsTrashIcon className="size-[20px] text-[#902b20]" />}
    iconTone="bg-[#f9ebea]"
    onClose={onClose}
    widthClass="w-[520px]"
  >
    <p className="m-0 text-[14px] leading-[20px] text-[#595959]">
      Use this if a key leaks. Every system using GTH data stops at once.
    </p>
    <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
      This can’t be undone
    </p>
    <p className="m-0 -mt-[8px] text-[13.5px] leading-[20px] text-[#595959]">
      You’ll need new keys and to update your systems.
    </p>
    <div className="flex flex-wrap items-center justify-end gap-[12px] pt-[8px]">
      <Button variant="tertiary" size="lg" onClick={onClose}>
        Cancel
      </Button>
      <button
        type="button"
        onClick={onConfirm}
        className="inline-flex h-[47px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-[#c0392b] px-[20px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-white shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <SettingsTrashIcon className="size-[20px] shrink-0" />
        Revoke all keys
      </button>
    </div>
  </SettingsDialog>
);

export default AgencyRevokeKeysDialog;
