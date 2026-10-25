import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { SettingsCloseXIcon, SettingsTrashIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import { Select, TextInput } from '../../../ui/form';
import AgencySettingsInfoBox from '../../agency/settings/AgencySettingsInfoBox.jsx';
import { AgencySettingsInfoIcon } from '../../agency/settings/agencySettingsIcons.jsx';
import { SettingsDialog } from '../../talentSettings/SettingsBDialogs.jsx';
import { SUSPEND } from './data/adminAccountDetailData.js';

const log = debug('AccountSuspendDialog');

/*
 * AccountSuspendDialog — "Suspend Kofi Agyekum’s account?" (Figma 7.1.3a 8625:8, the talent "Delete account" modal: 520 wide, r24, p28, 1px ink): red trash tile ·
 * 24/600 title · "What happens:" with four red-cross lines · cream info box · Duration (select, required) + Reason (logged) · Cancel / "Suspend for 7 days".
 * Indefinite needs a second approver, so choosing it sends the talent to the "Send for a second approval?" card (onIndefinite) instead of suspending.
 * Props: onClose, onSuspend(duration), onIndefinite().
 */

const AccountSuspendDialog = ({ onClose, onSuspend, onIndefinite }) => {
  const [duration, setDuration] = useState(SUSPEND.durations[0]);
  const [reason, setReason] = useState('');
  const indefinite = duration === 'Indefinite';
  const label = indefinite ? 'Send for approval' : `Suspend for ${duration}`;

  const submit = (e) => {
    e.preventDefault();
    log('submit', { duration, reasonLength: reason.length });
    if (indefinite) onIndefinite();
    else onSuspend(duration);
  };

  return (
    <SettingsDialog
      open
      title={SUSPEND.title}
      icon={<SettingsTrashIcon className="size-[20px] text-[#902b20]" />}
      iconTone="bg-[#f9ebea]"
      onClose={onClose}
      widthClass="w-[520px]"
    >
      <form onSubmit={submit} className="flex flex-col gap-[16px]">
        <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">What happens:</p>
        <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
          {SUSPEND.happens.map((t) => (
            <li
              key={t}
              className="flex items-center gap-[10px] text-[14px] leading-[17px] text-[#1c2a21]"
            >
              <SettingsCloseXIcon className="size-[16px] shrink-0 text-[#902b20]" />
              {t}
            </li>
          ))}
        </ul>
        <AgencySettingsInfoBox icon={<AgencySettingsInfoIcon className="size-[18px]" />}>
          {SUSPEND.info}
        </AgencySettingsInfoBox>
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <Select
            label="Duration"
            required
            options={SUSPEND.durations}
            value={duration}
            onChange={setDuration}
          />
          <TextInput
            label="Reason (logged)"
            placeholder={SUSPEND.reasonPlaceholder}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-[12px] pt-[8px]">
          <Button
            type="button"
            variant="tertiary"
            size="lg"
            className="min-w-[120px] flex-1"
            onClick={onClose}
          >
            {SUSPEND.cancel}
          </Button>
          <button
            type="submit"
            className="inline-flex h-[46px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-white px-[20px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <SettingsTrashIcon className="size-[20px] shrink-0 text-[#387440]" />
            {label}
          </button>
        </div>
      </form>
    </SettingsDialog>
  );
};

export default AccountSuspendDialog;
