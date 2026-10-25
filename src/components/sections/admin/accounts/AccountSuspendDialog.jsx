import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { SettingsCloseXIcon, SettingsTrashIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import { Checkbox, Select, TextInput } from '../../../ui/form';
import AgencySettingsInfoBox from '../../agency/settings/AgencySettingsInfoBox.jsx';
import { AgencySettingsInfoIcon } from '../../agency/settings/agencySettingsIcons.jsx';
import { SettingsDialog } from '../../talentSettings/SettingsBDialogs.jsx';

const log = debug('AccountSuspendDialog');

/*
 * AccountSuspendDialog — "Suspend <name>’s account?" (Figma 7.1.3a, the talent "Delete account" modal: 520 wide, r24, p28, 1px ink).
 * Backend: POST /api/admin/lifecycle/:id/suspend { reason, suspendUntil, silent }. Senior and Super Admins suspend straight away (any duration);
 * a Support Agent's request goes to a Senior Admin for approval (the page shows that result).
 * Props: name, busy, error, onClose, onSubmit({ duration, reason, silent }).
 */

const DURATIONS = ['7 days', '30 days', 'Indefinite'];
const HAPPENS = [
  'They’re signed out on every device right away',
  'They can’t sign in until the suspension ends or is lifted',
  'They get an email with your reason, unless you send it silently',
];

const AccountSuspendDialog = ({ name, busy, error, onClose, onSubmit }) => {
  const [duration, setDuration] = useState(DURATIONS[0]);
  const [reason, setReason] = useState('');
  const [silent, setSilent] = useState(false);
  const ready = reason.trim().length >= 3 && !busy;

  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    log('submit', { duration, reasonLength: reason.length, silent });
    onSubmit({ duration, reason: reason.trim(), silent });
  };

  return (
    <SettingsDialog
      open
      title={`Suspend ${name}’s account?`}
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
          7 days, 30 days or indefinite. A Support Agent’s suspension waits for a Senior Admin to approve it.
        </AgencySettingsInfoBox>
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <Select label="Duration" required options={DURATIONS} value={duration} onChange={setDuration} />
          <TextInput
            label="Reason (logged)"
            required
            placeholder="Repeated harassment in messages"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={error || undefined}
          />
        </div>
        <Checkbox
          label="Suspend silently (no email to the user)"
          checked={silent}
          onChange={(e) => setSilent(e.target.checked)}
          labelClassName="text-[14px] font-medium text-[#1c2a21]"
        />
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
            {busy ? 'Suspending…' : duration === 'Indefinite' ? 'Suspend indefinitely' : `Suspend for ${duration}`}
          </button>
        </div>
      </form>
    </SettingsDialog>
  );
};

export default AccountSuspendDialog;
