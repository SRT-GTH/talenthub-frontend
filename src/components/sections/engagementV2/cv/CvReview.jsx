import { useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import {
  CvCheckbox,
  CvCallout,
  CvDialog,
  CvGroup,
  CvPill,
  CvPrimaryButton,
  CvSecondaryButton,
  CvWarningText,
} from './CvParts.jsx';
import { CvCheckCircleIcon, CvEditIcon, CvToastEyeIcon, CvWarningIcon } from './cvIcons.jsx';
import { countChecked, formatRoleMeta } from './cvData.js';

const log = debug('CvReview');

const ItemRow = ({ checked, onToggle, title, meta, muted = false, pill, onEdit, editLabel }) => (
  <div className="flex items-center gap-[12px] py-[10px]">
    <CvCheckbox checked={checked} onChange={onToggle} label={title} />
    <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
      <p
        className={classNames(
          'm-0 font-sans text-[14px] leading-[19px] font-semibold playful:leading-[17px]',
          muted ? 'text-[#737373]' : 'text-[#1c2a21]'
        )}
      >
        {title}
      </p>
      <p className="m-0 font-sans text-[12.5px] leading-[15px] text-[#737373] max-lg:text-[12.5px]">
        {meta}
      </p>
    </div>
    {pill}
    <button
      type="button"
      aria-label={editLabel}
      onClick={onEdit}
      className="inline-flex size-[24px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      <CvEditIcon size={18} />
    </button>
  </div>
);

const Chip = ({ on, label, onToggle }) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={onToggle}
    className={classNames(
      'inline-flex min-h-[32px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      on ? 'border-[#1c2a21] bg-[#1c2a21] text-white' : 'border-[#e1eae2] bg-white text-[#595959]'
    )}
  >
    {label}
  </button>
);

/* CV-04 Check what we found (8966:4928 / 8966:510604). */
export const CvReviewDialog = ({ file, result, onToggle, onEdit, onStartOver, onAdd, onClose }) => {
  const count = countChecked(result);
  const edit = (what) => () => log('edit (not drawn)', what);
  return (
    <CvDialog
      title="Check what we found"
      onClose={onClose}
      wide
      noteIcon={CvCheckCircleIcon}
      note="Ticked items go to Work, Skills and Certifications"
      buttons={
        <>
          <CvSecondaryButton onClick={onStartOver}>Start over</CvSecondaryButton>
          <CvPrimaryButton onClick={onAdd} disabled={count === 0}>
            {`Add ${count} item${count === 1 ? '' : 's'}`}
          </CvPrimaryButton>
        </>
      }
    >
      <p className="m-0 font-sans text-[14px] leading-[20px] text-[#737373]">
        {`We found 15 things in ${file.name}. Untick anything that’s wrong and fix what we flagged. Nothing goes on your card until you say so.`}
      </p>
      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 md:items-start">
        <div className="flex flex-col gap-[16px]">
          <CvGroup title={`Work · ${result.roles.length} roles`}>
            {result.roles.map((r) => (
              <ItemRow
                key={r.id}
                checked={r.checked}
                onToggle={() => onToggle('roles', r.id)}
                title={`${r.title} · ${r.employer}`}
                meta={formatRoleMeta(r)}
                pill={r.flagged ? <CvPill>Check end date</CvPill> : null}
                onEdit={() => onEdit(r.id)}
                editLabel={`Fix ${r.title}`}
              />
            ))}
          </CvGroup>
          <CvGroup title={`Education · ${result.education.length}`}>
            {result.education.map((e) => (
              <ItemRow
                key={e.id}
                checked={e.checked}
                onToggle={() => onToggle('education', e.id)}
                title={`${e.title} · ${e.institution}`}
                meta={`${e.period} · ${e.detail}`}
                onEdit={edit(e.id)}
                editLabel={`Edit ${e.title}`}
              />
            ))}
          </CvGroup>
        </div>
        <div className="flex flex-col gap-[16px]">
          <CvGroup title={`Skills · ${result.skills.length} found`}>
            <div className="mt-[0px] flex flex-wrap gap-[8px] pt-[0px]">
              {result.skills.map((s) => (
                <Chip
                  key={s.id}
                  on={s.checked}
                  label={s.label}
                  onToggle={() => onToggle('skills', s.id)}
                />
              ))}
            </div>
            <p className="m-0 mt-[0px] pt-[0px] font-sans text-[12px] leading-[14px] text-[#737373]">
              Tap to remove. Skills you keep can be verified in Skills Lab.
            </p>
          </CvGroup>
          <CvGroup title={`Certificates · ${result.certificates.length}`}>
            {result.certificates.map((c) => (
              <ItemRow
                key={c.id}
                checked={c.checked}
                onToggle={() => onToggle('certificates', c.id)}
                title={c.title}
                muted={!c.checked}
                meta={c.note ? `${c.year} · ${c.note}` : `${c.issuer} · ${c.year}`}
                pill={c.note ? <CvPill tone="plain">Add proof later</CvPill> : null}
                onEdit={edit(c.id)}
                editLabel={`Edit ${c.title}`}
              />
            ))}
          </CvGroup>
        </div>
      </div>
    </CvDialog>
  );
};

const Field = ({ label, value, onChange, className, inputRef, helper, disabled }) => (
  <label className={classNames('flex flex-col gap-[8px]', className)}>
    <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]">
      {label}
      <span
        aria-hidden="true"
        className="ml-[1px] font-[Instrument_Sans] font-semibold text-[#2e8b57]"
      >
        *
      </span>
    </span>
    <input
      ref={inputRef}
      value={value}
      disabled={disabled}
      required
      aria-required="true"
      onChange={(e) => onChange(e.target.value)}
      className="h-[51px] w-full rounded-[10px] border border-solid border-[#ccc] bg-white px-[16px] pl-[20px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2.5px_0_rgba(191,191,191,0.8)] outline-none focus:border-2 focus:border-[#c1d4c4] focus:bg-[#fffefc] focus:shadow-[0_2.5px_0_rgba(34,70,38,0.8)] disabled:opacity-60"
    />
    {helper}
  </label>
);

/* CV-04b Fix a role (8966:5612 / 8966:511243). `initial` = draft; role = the parsed role being fixed. */
export const CvFixRoleDialog = ({ role, initial, onSave, onCancel }) => {
  const [d, setD] = useState(initial);
  const endRef = useRef(null);
  const set = (patch) => setD((prev) => ({ ...prev, ...patch }));
  const valid =
    d.title.trim() && d.employer.trim() && d.start.trim() && (d.current || d.end.trim());
  const addedByYou = !d.current && d.end.trim() !== '' && !role.end;
  return (
    <CvDialog
      title="Fix a role"
      onClose={onCancel}
      initialFocus={() => endRef.current}
      noteIcon={CvEditIcon}
      note="Changes only apply to this role"
      buttons={
        <>
          <CvSecondaryButton onClick={onCancel}>Cancel</CvSecondaryButton>
          <CvPrimaryButton
            disabled={!valid}
            onClick={() => {
              log('save role', role.id);
              onSave(d);
            }}
          >
            Save role
          </CvPrimaryButton>
        </>
      }
    >
      <CvCallout tone="warn" title="We couldn’t find an end date">
        Your CV says “Sep 2022 –”. Add the month you finished, or tick “I still work here”.
      </CvCallout>
      <Field label="Job title" value={d.title} onChange={(v) => set({ title: v })} />
      <Field label="Employer" value={d.employer} onChange={(v) => set({ employer: v })} />
      <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
        <Field label="Start" value={d.start} onChange={(v) => set({ start: v })} />
        <Field
          label="End"
          value={d.current ? 'now' : d.end}
          disabled={d.current}
          inputRef={endRef}
          onChange={(v) => set({ end: v })}
          helper={
            addedByYou ? (
              <span className="flex items-center gap-[8px] px-[8px]">
                <CvWarningIcon className="shrink-0 text-[#387440]" />
                <CvWarningText>Not in your CV · added by you</CvWarningText>
              </span>
            ) : null
          }
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        {[
          ['current', 'I still work here'],
          ['nationalService', 'This was national service'],
        ].map(([key, label]) => (
          <div key={key} className="flex items-center gap-[10px]">
            <CvCheckbox
              checked={d[key]}
              onChange={(v) => set({ [key]: v })}
              labelledBy={`cv-fix-${key}`}
            />
            <span
              id={`cv-fix-${key}`}
              className="font-sans text-[13px] leading-[19px] text-[#1c2a21]"
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </CvDialog>
  );
};

/* Toast "13 items added from your CV · +60 XP" (8966:6787), top-centre above the scrim. */
export const CvToast = ({ count, onUndo }) => (
  <div
    role="status"
    className="pointer-events-auto fixed top-[clamp(12px,8.7vh,150px)] left-1/2 z-[70] flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-[10px] rounded-full bg-[#1c2a21] py-[12px] pr-[18px] pl-[14px] shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
  >
    <span className="inline-flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#c8951a]">
      <CvToastEyeIcon />
    </span>
    <span className="font-sans text-[14px] leading-[17px] font-semibold text-white">
      {`${count} items added from your CV · +60 XP`}
    </span>
    <button
      type="button"
      onClick={onUndo}
      className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#ffd86b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd86b]"
    >
      Undo
    </button>
  </div>
);
