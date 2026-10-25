import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { SettingsCloseXIcon, SettingsTrashIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import { TextInput } from '../../../ui/form';
import AgencySettingsInfoBox from '../../agency/settings/AgencySettingsInfoBox.jsx';
import { AgencySettingsInfoIcon } from '../../agency/settings/agencySettingsIcons.jsx';
import { SettingsDialog } from '../../talentSettings/SettingsBDialogs.jsx';

const log = debug('AccountDeleteDialog');

/*
 * AccountDeleteDialog — "Permanently delete <name>’s account?" (Figma 7.1.4a, Super Admin only: 520 wide, r24, p28).
 * Backend: POST /api/admin/lifecycle/:id/delete { reason }. The backend soft-deletes and signs the user out straight away, opens a second-approval
 * request for the hard delete, and keeps the account restorable with "Cancel deletion". There is no approver picker or legal-hold option in the backend.
 * The submit stays disabled until the full name is typed exactly and a reason is given.
 * Props: name, busy, error, onClose, onSubmit(reason).
 */

const HAPPENS = [
  'They’re signed out and the account is hidden right away',
  'A second Super Admin must approve the permanent purge',
  'Until then you can cancel the deletion from this page',
  'Every step is kept in the audit log',
];

const AccountDeleteDialog = ({ name, busy, error, onClose, onSubmit }) => {
  const [typed, setTyped] = useState('');
  const [reason, setReason] = useState('');
  const ready = typed.trim() === name && reason.trim().length >= 3 && !busy;

  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    log('delete requested');
    onSubmit(reason.trim());
  };

  return (
    <SettingsDialog
      open
      title={`Permanently delete ${name}’s account?`}
      icon={<SettingsTrashIcon className="size-[20px] text-[#902b20]" />}
      iconTone="bg-[#f9ebea]"
      onClose={onClose}
      widthClass="w-[520px]"
    >
      <form onSubmit={submit} className="flex flex-col gap-[16px]">
        <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">What happens:</p>
        <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
          {HAPPENS.map((t) => (
            <li key={t} className="flex items-center gap-[10px] text-[14px] leading-[17px] text-[#1c2a21]">
              <SettingsCloseXIcon className="size-[16px] shrink-0 text-[#902b20]" />
              {t}
            </li>
          ))}
        </ul>
        <AgencySettingsInfoBox icon={<AgencySettingsInfoIcon className="size-[18px]" />}>
          Super Admin only. The purge itself needs a second Super Admin.
        </AgencySettingsInfoBox>
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <TextInput
            label="Type the full name to confirm"
            placeholder={name}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
          />
          <TextInput
            label="Reason (logged)"
            required
            placeholder="User asked for deletion"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={error || undefined}
          />
        </div>
        <div className="flex flex-wrap items-center gap-[12px] pt-[8px]">
          <Button type="button" variant="tertiary" size="lg" className="min-w-[120px] flex-1" onClick={onClose}>
            Cancel
          </Button>
          <button
            type="submit"
            disabled={!ready}
            className="inline-flex h-[46px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-white px-[20px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none"
          >
            <SettingsTrashIcon className="size-[20px] shrink-0 text-[#387440]" />
            {busy ? 'Deleting…' : 'Delete and request approval'}
          </button>
        </div>
      </form>
    </SettingsDialog>
  );
};

export default AccountDeleteDialog;
