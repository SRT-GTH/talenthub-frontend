import { SettingsTrashIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import { SettingsDialog } from '../../talentSettings/SettingsBDialogs.jsx';
import InstitutionSettingsInfoBox from './InstitutionSettingsInfoBox.jsx';
import { InstitutionSettingsInfoIcon } from './institutionSettingsIcons.jsx';

/*
 * InstitutionCloseAccountDialog — confirmation of "Close account" on the Data tab. ⚠️ ASSUMPTION: no frame draws it; the copy reuses the sentences of
 * 11.6.1d ("This closes the institution account for all your staff.", "Students keep their verified records and credentials.", "Download your audit log
 * first if you need it.") and the layout of the remove-staff dialog (11.6.1f). Focus is trapped, Esc closes, focus returns to the opener (SettingsDialog).
 * Props: onClose, onConfirm.
 */
const InstitutionCloseAccountDialog = ({ onClose, onConfirm }) => (
  <SettingsDialog
    open
    title="Close the institution account?"
    icon={<SettingsTrashIcon className="size-[20px] text-[#902b20]" />}
    iconTone="bg-[#f9ebea]"
    onClose={onClose}
    widthClass="w-[520px]"
  >
    <p className="m-0 text-[14px] leading-[20px] text-[#1c2a21]">
      This closes the institution account for all your staff.
    </p>
    <InstitutionSettingsInfoBox icon={<InstitutionSettingsInfoIcon className="size-[18px]" />}>
      Students keep their verified records and credentials. Download your audit log first if you
      need it.
    </InstitutionSettingsInfoBox>
    <div className="flex flex-wrap items-center gap-[12px] pt-[8px]">
      <Button variant="tertiary" size="lg" className="min-w-[120px] flex-1" onClick={onClose}>
        Cancel
      </Button>
      <button
        type="button"
        onClick={onConfirm}
        className="inline-flex h-[46px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-[#c0392b] px-[20px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-white shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <SettingsTrashIcon className="size-[20px] shrink-0 text-[#387440]" />
        Close account
      </button>
    </div>
  </SettingsDialog>
);

export default InstitutionCloseAccountDialog;
