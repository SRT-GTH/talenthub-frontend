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
import { OVERRIDE } from './data/adminAccountDetailData.js';

const log = debug('AccountOverrideDialog');

/*
 * AccountOverrideDialog — "Date of birth" override (Figma 7.1.6a 8625:4223, the talent "Edit certification" modal: 820 wide, r28, p 40/36/40/32, 1px ink, scrim
 * #0b1a0f at 55 %): chip "Override a profile field" · title 32/38 600 ("birth" green) · 15/22 #595959 sub · file strip (#f8f8f4, r16: tile, "Kofi Agyekum · TAL-204-8812",
 * "Overrides on this account: 1 (Aug)", "View history") · four rows of two fields (Field · Current value / New value · Reference document / Reason · Effective /
 * Ticket reference · Notify user) · "Tell the user what changed and why" · green notice "This field can be overridden by Senior Admins" · "Cancel override" (red link),
 * Cancel and "Review change →". 40 round close top right.
 * ⚠️ ASSUMPTION: the field, current value, reference document, effective and notify fields are drawn as read-only values; the new value (a select), reason and ticket
 * are editable; "View history" and "Cancel override" only log / close. Props: onClose, onReview().
 */

const FIELD_ROWS = [
  [
    { id: 'field', label: 'Field', value: OVERRIDE.fields.field, ro: true, required: true },
    {
      id: 'current',
      label: 'Current value',
      value: OVERRIDE.fields.current,
      ro: true,
      required: true,
    },
  ],
  [
    { id: 'new', label: 'New value', select: true, required: true },
    { id: 'doc', label: 'Reference document', placeholder: OVERRIDE.fields.document, ro: true },
  ],
  [
    { id: 'reason', label: 'Reason', required: true, value: OVERRIDE.fields.reason },
    { id: 'effective', label: 'Effective', value: OVERRIDE.fields.effective, ro: true, tint: true },
  ],
  [
    { id: 'ticket', label: 'Ticket reference', optional: true, value: OVERRIDE.fields.ticket },
    { id: 'notify', label: 'Notify user', optional: true, value: OVERRIDE.fields.notify, ro: true },
  ],
];

const AccountOverrideDialog = ({ onClose, onReview }) => {
  const [values, setValues] = useState({
    reason: OVERRIDE.fields.reason,
    ticket: OVERRIDE.fields.ticket,
  });
  const [newValue, setNewValue] = useState(OVERRIDE.fields.newValue);
  const [tell, setTell] = useState(true);
  const set = (id) => (e) => setValues((v) => ({ ...v, [id]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    log('review change', { newValue, tell });
    onReview();
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
            {OVERRIDE.chip}
          </span>
          <h2 className="m-0 font-sans text-[32px] leading-[38px] font-semibold text-[#1c2a21]">
            Date of <span className="text-[#387440]">birth</span>
          </h2>
          <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{OVERRIDE.sub}</p>
        </header>

        <div className="flex flex-wrap items-center gap-[14px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] py-[14px] pr-[16px] pl-[14px]">
          <span className="grid size-[44px] shrink-0 place-items-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
            <AdminFile22Icon className="size-[22px]" />
          </span>
          <div className="flex min-w-[200px] flex-1 flex-col gap-[2px]">
            <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {OVERRIDE.file.title}
            </p>
            <p className="m-0 flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#387440]">
              <AdminCheckCircleFillIcon className="size-[13px]" />
              {OVERRIDE.file.meta}
            </p>
          </div>
          <button
            type="button"
            onClick={() => log('view history (no screen drawn)')}
            className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {OVERRIDE.file.action}
          </button>
        </div>

        <div className="flex flex-col gap-[24px]">
          {FIELD_ROWS.map((row) => (
            <div key={row[0].id} className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
              {row.map((f) =>
                f.select ? (
                  <Select
                    key={f.id}
                    label={f.label}
                    required={f.required}
                    options={[OVERRIDE.fields.newValue]}
                    value={newValue}
                    onChange={setNewValue}
                  />
                ) : (
                  <TextInput
                    key={f.id}
                    label={f.label}
                    required={f.required}
                    optional={f.optional}
                    placeholder={f.placeholder}
                    value={f.ro ? f.value : (values[f.id] ?? '')}
                    readOnly={f.ro}
                    onChange={f.ro ? undefined : set(f.id)}
                    className={f.tint ? '[&_input]:bg-[#ebf1ec]' : undefined}
                  />
                )
              )}
            </div>
          ))}
        </div>

        <Checkbox
          label={OVERRIDE.tell}
          checked={tell}
          onChange={(e) => setTell(e.target.checked)}
          labelClassName="text-[14px] font-medium text-[#1c2a21]"
        />

        <p className="m-0 flex items-center gap-[10px] rounded-[14px] border border-solid border-[#1c2a21] bg-[#e8f2ed] px-[14px] py-[12px] font-sans text-[14px] leading-[17px] font-semibold text-[#165d3a]">
          <AdminCheckCircleFillIcon className="size-[18px] shrink-0" />
          {OVERRIDE.allowed}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-[12px] pt-[8px]">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#902b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#902b20]"
          >
            <AdminDeleteIcon className="size-[16px]" />
            {OVERRIDE.cancelOverride}
          </button>
          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {OVERRIDE.cancel}
            </button>
            <button
              type="submit"
              className="inline-flex h-[52px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[28px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {OVERRIDE.review}
              <AdminArrowRightIcon className="size-[20px]" />
            </button>
          </div>
        </div>
      </form>
    </AgencyDialog>
  );
};

export default AccountOverrideDialog;
