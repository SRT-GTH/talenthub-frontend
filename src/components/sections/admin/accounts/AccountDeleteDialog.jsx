import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { SettingsCloseXIcon, SettingsTrashIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import { Select, TextInput } from '../../../ui/form';
import AgencySettingsInfoBox from '../../agency/settings/AgencySettingsInfoBox.jsx';
import { AgencySettingsInfoIcon } from '../../agency/settings/agencySettingsIcons.jsx';
import { SettingsDialog } from '../../talentSettings/SettingsBDialogs.jsx';
import { ACCOUNT, DELETE } from './data/adminAccountDetailData.js';

const log = debug('AccountDeleteDialog');

/*
 * AccountDeleteDialog — "Permanently delete Kofi Agyekum’s account?" (Figma 7.1.4a 8625:3389, Super Admin only: 520 wide, r24, p28): red trash tile · title · "What
 * happens:" with four red-cross lines · cream info box · "Type the full name to confirm" + "Second approver" (select, required) · Cancel / "Send to second approver".
 * The submit stays disabled until the full name is typed exactly (⚠️ ASSUMPTION: the check is the visible field label's job, no error copy is drawn).
 * Props: onClose, onSubmit().
 */

const AccountDeleteDialog = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [approver, setApprover] = useState(DELETE.approvers[0]);
  const ready = name.trim() === ACCOUNT.name && Boolean(approver);

  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    log('send to second approver', { approver });
    onSubmit();
  };

  return (
    <SettingsDialog
      open
      title={DELETE.title}
      icon={<SettingsTrashIcon className="size-[20px] text-[#902b20]" />}
      iconTone="bg-[#f9ebea]"
      onClose={onClose}
      widthClass="w-[520px]"
    >
      <form onSubmit={submit} className="flex flex-col gap-[16px]">
        <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">What happens:</p>
        <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
          {DELETE.happens.map((t) => (
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
          {DELETE.info}
        </AgencySettingsInfoBox>
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <TextInput
            label={DELETE.confirmLabel}
            placeholder={ACCOUNT.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
          <Select
            label={DELETE.approverLabel}
            required
            options={DELETE.approvers}
            value={approver}
            onChange={setApprover}
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
            {DELETE.cancel}
          </Button>
          <button
            type="submit"
            disabled={!ready}
            className="inline-flex h-[46px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-white px-[20px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none"
          >
            <SettingsTrashIcon className="size-[20px] shrink-0 text-[#387440]" />
            {DELETE.submit}
          </button>
        </div>
      </form>
    </SettingsDialog>
  );
};

export default AccountDeleteDialog;
