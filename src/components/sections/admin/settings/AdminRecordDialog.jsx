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

const log = debug('AdminRecordDialog');

/*
 * AdminRecordDialog — the large "record" dialog of the admin settings and audit screens (Figma 7.5.2b "Change a setting" 8639:3123 and 7.5.3b "Event detail" 8639:4848, the
 * talent "Edit certification" modal: 820 wide, r28, p 40/36/40/32, 1px ink, scrim #0b1a0f at 55 %): chip · title 32/38 600 (last word green) · 15/22 #595959 sub · file strip
 * (#f8f8f4, r16: tile, title, green check meta, action button) · rows of two fields · checkbox · green notice · red link, then the mint secondary and green primary buttons.
 * Props: chip, title [plain, green], sub, file { title, meta, action }, rows (field specs: id, label, value, ro, tint, select [options], required, optional, placeholder),
 * checkbox { label, checked }, notice, link { label, onClick }, secondary, primary, onSubmit, onClose, label.
 * ⚠️ ASSUMPTION: read-only fields are drawn as filled boxes; the file-strip action only logs (no history / JSON screen is drawn).
 */

const AdminRecordDialog = ({
  chip,
  title,
  sub,
  file,
  rows,
  checkbox,
  notice,
  link,
  secondary,
  primary,
  onSubmit,
  onClose,
  label,
  children,
  busy = false,
  error = '',
}) => {
  const [values, setValues] = useState(() =>
    Object.fromEntries(rows.flat().map((f) => [f.id, f.select ? f.select[0] : (f.value ?? '')]))
  );
  const [checked, setChecked] = useState(checkbox?.checked ?? true);
  const set = (id) => (e) => setValues((v) => ({ ...v, [id]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    log('submit', { primary });
    if (busy) return;
    onSubmit?.({ values, checked });
  };

  return (
    <AgencyDialog
      label={label ?? `${title[0]} ${title[1]}`}
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
            {chip}
          </span>
          <h2 className="m-0 font-sans text-[32px] leading-[38px] font-semibold text-[#1c2a21]">
            {title[0]} <span className="text-[#387440]">{title[1]}</span>
          </h2>
          <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{sub}</p>
        </header>

        <div className="flex flex-wrap items-center gap-[14px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] py-[14px] pr-[16px] pl-[14px]">
          <span className="grid size-[44px] shrink-0 place-items-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
            <AdminFile22Icon className="size-[22px]" />
          </span>
          <div className="flex min-w-[200px] flex-1 flex-col gap-[2px]">
            <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {file.title}
            </p>
            <p className="m-0 flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#387440]">
              <AdminCheckCircleFillIcon className="size-[13px]" />
              {file.meta}
            </p>
          </div>
          <button
            type="button"
            onClick={() => (file.onAction ? file.onAction() : log('file action (no screen drawn)', file.action))}
            className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {file.action}
          </button>
        </div>

        <div className="flex flex-col gap-[24px]">
          {rows.map((row) => (
            <div key={row[0].id} className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
              {row.map((f) =>
                f.select ? (
                  <Select
                    key={f.id}
                    label={f.label}
                    required={f.required}
                    options={f.select}
                    value={values[f.id]}
                    onChange={(v) => setValues((s) => ({ ...s, [f.id]: v }))}
                  />
                ) : (
                  <TextInput
                    key={f.id}
                    label={f.label}
                    required={f.required}
                    optional={f.optional}
                    placeholder={f.placeholder}
                    value={f.ro ? (f.value ?? '') : values[f.id]}
                    readOnly={f.ro}
                    onChange={f.ro ? undefined : set(f.id)}
                    className={f.tint ? '[&_input]:bg-[#ebf1ec]' : undefined}
                  />
                )
              )}
            </div>
          ))}
        </div>

        {children}

        {error ? (
          <p role="alert" className="m-0 font-sans text-[14px] leading-[20px] font-semibold text-[#902b20]">
            {error}
          </p>
        ) : null}

        {checkbox ? (
          <Checkbox
            label={checkbox.label}
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            labelClassName="text-[14px] font-medium text-[#1c2a21]"
          />
        ) : null}

        {notice ? (
          <p className="m-0 flex items-center gap-[10px] rounded-[14px] border border-solid border-[#1c2a21] bg-[#e8f2ed] px-[14px] py-[12px] font-sans text-[14px] leading-[17px] font-semibold text-[#165d3a]">
            <AdminCheckCircleFillIcon className="size-[18px] shrink-0" />
            {notice}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-[12px] pt-[8px]">
          {link ? (
          <button
            type="button"
            onClick={link.onClick ?? onClose}
            className="inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#902b20] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#902b20]"
          >
            <AdminDeleteIcon className="size-[16px]" />
            {link.label}
          </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {secondary}
            </button>
            <button
              type="submit"
              data-autofocus
              className="inline-flex h-[52px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[28px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {busy ? 'Saving…' : primary}
              <AdminArrowRightIcon className="size-[20px]" />
            </button>
          </div>
        </div>
      </form>
    </AgencyDialog>
  );
};

export default AdminRecordDialog;
