import { useState } from 'react';
import { SettingsCloseXIcon, SettingsTrashIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import { SettingsDialog } from '../../talentSettings/SettingsBDialogs.jsx';
import InstitutionSettingsInfoBox from './InstitutionSettingsInfoBox.jsx';
import { InstitutionSettingsInfoIcon } from './institutionSettingsIcons.jsx';

/*
 * InstitutionRemoveStaffDialog — Figma 11.6.1f "Remove Kwame Asante’s access?" (8746:917, 520 wide, r24, p28): red trash tile, title, "What happens:" list
 * with red crosses, cream info box, Cancel / "Remove access". For a pending invite it cancels the invite instead. Focus is trapped, Esc closes.
 * The Figma lines about draft credentials and revocations are left out until credentials are live.
 * Props: member (a /institution/staff item), onClose, onConfirm() -> Promise (throws on failure).
 */
const InstitutionRemoveStaffDialog = ({ member, onClose, onConfirm }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!member) return null;
  const invite = member.status === 'invited';
  const items = invite
    ? ['The link in their email stops working', 'This frees 1 staff seat']
    : [
        'They’re signed out of the school portal right away',
        'Their own GTH account is not deleted',
        'This frees 1 staff seat',
      ];
  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Something went wrong.');
      setBusy(false);
    }
  };
  return (
    <SettingsDialog
      open
      title={invite ? `Cancel ${member.email}’s invite?` : `Remove ${member.name}’s access?`}
      icon={<SettingsTrashIcon className="size-[20px] text-[#902b20]" />}
      iconTone="bg-[#f9ebea]"
      onClose={onClose}
      widthClass="w-[520px]"
    >
      <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">What happens:</p>
      <ul className="m-0 flex list-none flex-col gap-[20px] p-0">
        {items.map((t) => (
          <li
            key={t}
            className="flex items-center gap-[10px] text-[14px] leading-[17px] text-[#1c2a21]"
          >
            <SettingsCloseXIcon className="size-[16px] shrink-0 text-[#902b20]" />
            {t}
          </li>
        ))}
      </ul>
      <InstitutionSettingsInfoBox icon={<InstitutionSettingsInfoIcon className="size-[18px]" />}>
        {invite ? 'You can invite them again later.' : 'What they did stays in the audit log.'}
      </InstitutionSettingsInfoBox>
      {error ? (
        <p role="alert" className="m-0 text-[14px] text-[#902b20]">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-[12px] pt-[8px]">
        <Button variant="tertiary" size="lg" className="min-w-[120px] flex-1" onClick={onClose}>
          Cancel
        </Button>
        <button
          type="button"
          onClick={confirm}
          disabled={busy}
          className="inline-flex h-[46px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-white px-[20px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#c0392b] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:opacity-60"
        >
          <SettingsTrashIcon className="size-[20px] shrink-0 text-[#387440]" />
          {busy ? 'Working…' : invite ? 'Cancel invite' : 'Remove access'}
        </button>
      </div>
    </SettingsDialog>
  );
};

export default InstitutionRemoveStaffDialog;
