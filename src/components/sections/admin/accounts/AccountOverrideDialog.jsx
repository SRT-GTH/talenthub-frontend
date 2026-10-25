import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { Checkbox, Select, TextInput } from '../../../ui/form';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import {
  AdminArrowRightIcon,
  AdminCheckCircleFillIcon,
  AdminClose16Icon,
  AdminDeleteIcon,
  AdminFile22Icon,
} from '../adminIcons.jsx';
import { OVERRIDE_FIELDS } from './adminAccountModel.js';

const log = debug('AccountOverrideDialog');

/*
 * AccountOverrideDialog — "Date of birth" override (Figma 7.1.6a 8625:4223, the talent "Edit certification" modal: 820 wide, r28, p 40/36/40/32, 1px ink, scrim
 * #0b1a0f at 55 %): chip "Override a profile field" · title 32/38 600 ("birth" green) · 15/22 #595959 sub · file strip (#f8f8f4, r16: tile, "Kofi Agyekum · TAL-204-8812",
 * "Overrides on this account: 1 (Aug)", "View history") · four rows of two fields (Field · Current value / New value · Reference document / Reason · Effective /
 * Ticket reference · Notify user) · "Tell the user what changed and why" · green notice "This field can be overridden by Senior Admins" · "Cancel override" (red link),
 * Cancel and "Review change →". 40 round close top right.
 * Backend: POST /api/admin/lifecycle/:id/override { fieldName, newValue, reason, silent } writes a field of the user record. There is no document upload,
 * effective date or ticket reference in the backend, so those fields are not drawn. Props: account (accountView), busy, error, onClose, onSubmit(p), onHistory().
 */

const fmt = (v) => (v === null || v === undefined || v === '' ? '(empty)' : String(v));

const AccountOverrideDialog = ({ account, busy, error, onClose, onSubmit, onHistory }) => {
  const raw = account.raw;
  const [fieldName, setFieldName] = useState(OVERRIDE_FIELDS[0].value);
  const [newValue, setNewValue] = useState('');
  const [reason, setReason] = useState('');
  const [tell, setTell] = useState(true);
  const current = fmt(raw[fieldName]);
  const ready = newValue.trim() !== '' && reason.trim().length >= 3 && !busy;

  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    log('override', { fieldName, tell });
    onSubmit({ fieldName, newValue: newValue.trim(), reason: reason.trim(), silent: !tell });
  };

  return (
    <AgencyDialog
      label="Override a profile field"
      onClose={onClose}
      scrimClassName="bg-[#0b1a0f]/55"
      panelClassName="w-[min(820px,calc(100vw-32px))]"
    >
      <form
        onSubmit={submit}
        className="relative flex flex-col gap-[24px] rounded-[28px] border border-solid border-[#1c2a21] bg-white px-[clamp(18px,2.1vw,36px)] pt-[clamp(24px,2.3vw,40px)] pb-[clamp(18px,1.85vw,32px)] shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-[24px] right-[24px] grid size-[40px] cursor-pointer place-items-center rounded-full border-0 bg-[#f3f3ef] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AdminClose16Icon className="size-[16px]" />
        </button>

        <header className="flex flex-col items-start gap-[8px] pr-[48px]">
          <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#387440]">
            Override a profile field
          </span>
          <h2 className="m-0 font-sans text-[32px] leading-[38px] font-semibold text-[#1c2a21]">
            Correct a <span className="text-[#387440]">field</span>
          </h2>
          <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">Use this only to correct a mistake. The old value is archived, the change is logged under your name, and you can reverse it for 90 days.</p>
        </header>

        <div className="flex flex-wrap items-center gap-[14px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] py-[14px] pr-[16px] pl-[14px]">
          <span className="grid size-[44px] shrink-0 place-items-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
            <AdminFile22Icon className="size-[22px]" />
          </span>
          <div className="flex min-w-[200px] flex-1 flex-col gap-[2px]">
            <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {account.name} · {account.shortId}
            </p>
            <p className="m-0 flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#387440]">
              <AdminCheckCircleFillIcon className="size-[13px]" />
              Overrides on this account: {account.overrides.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onHistory}
            className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            View history
          </button>
        </div>

        <div className="flex flex-col gap-[24px]">
          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
            <Select
              label="Field"
              required
              options={OVERRIDE_FIELDS}
              value={fieldName}
              onChange={(v) => setFieldName(v?.value ?? v)}
            />
            <TextInput label="Current value" value={current} readOnly className="[&_input]:bg-[#f8f8f4]" />
          </div>
          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
            <TextInput
              label="New value"
              required
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              autoComplete="off"
            />
            <TextInput
              label="Reason"
              required
              placeholder="Birth certificate shows a different name"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={error || undefined}
            />
          </div>
        </div>

        <Checkbox
          label="Email the user what changed and why"
          checked={tell}
          onChange={(e) => setTell(e.target.checked)}
          labelClassName="text-[14px] font-medium text-[#1c2a21]"
        />

        <p className="m-0 flex items-center gap-[10px] rounded-[14px] border border-solid border-[#1c2a21] bg-[#e8f2ed] px-[14px] py-[12px] font-sans text-[14px] leading-[17px] font-semibold text-[#165d3a]">
          <AdminCheckCircleFillIcon className="size-[18px] shrink-0" />
          Senior Admins and Super Admins can override these fields
        </p>

        <div className="flex flex-wrap items-center justify-between gap-[12px] pt-[8px]">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#902b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#902b20]"
          >
            <AdminDeleteIcon className="size-[16px]" />
            Cancel override
          </button>
          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!ready}
              className="disabled:cursor-not-allowed disabled:opacity-55 inline-flex h-[52px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[28px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {busy ? 'Saving…' : 'Save change'}
              <AdminArrowRightIcon className="size-[20px]" />
            </button>
          </div>
        </div>
      </form>
    </AgencyDialog>
  );
};

export default AccountOverrideDialog;
