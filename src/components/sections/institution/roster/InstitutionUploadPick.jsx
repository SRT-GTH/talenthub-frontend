import { useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Checkbox from '../../../ui/form/Checkbox.jsx';
import Select from '../../../ui/form/Select.jsx';
import InstitutionDialogActions from './InstitutionDialogActions.jsx';
import InstitutionDialogHeader from './InstitutionDialogHeader.jsx';
import InstitutionUploadBar from './InstitutionUploadBar.jsx';
import { FIELDS } from './csvImport.js';
import { formatRosterCount } from './rosterFormat.js';
import { downloadTemplate } from './rosterTemplate.js';

const log = debug('InstitutionUploadPick');

/*
 * InstitutionUploadPick — step 1 of the class-list dialog (Figma 11.2.2c 8590:384612, reworked for every education level, ADR-11/12/13):
 * "Education level of this file" (a level from the platform config, or "From the Level column of my file") with "Download template" for
 * that level; the drop zone (CSV or Excel .xlsx; up to the Admin "Bulk upload max rows"); "Match your columns" once a file is chosen (each
 * student field -> a column of the file, filled in from the template's headers and spellings); the rules in plain words (email or phone,
 * the Ghana Card rule, guardians of under-18s get an opt-out notice); "Send every new student an invite" + "Check file →".
 * Props: rules (GET /institution/roster/upload-rules, may be null), level ('' = from the file), onLevel, file, onFile, headers, mapping,
 * onMapping(next), required (field keys still missing), invite, onInvite, onCheck, error.
 */

const NONE = '__none__';

const InstitutionUploadPick = ({
  rules,
  level,
  onLevel,
  file,
  onFile,
  headers,
  mapping,
  onMapping,
  required = [],
  invite,
  onInvite,
  onCheck,
  error,
}) => {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);
  const maxRows = rules?.maxRows ?? 10000;
  const levels = rules?.levels ?? [];
  const card = rules?.identity?.ghanaCard ?? 'optional';
  const template = rules?.templates?.[level || 'default'] || rules?.templates?.default;
  const custom = (template?.columns ?? []).filter((c) => c.custom);
  const fields = [
    ...FIELDS.filter((f) => !(f.key === 'ghanaCard' && card === 'off')),
    ...custom.map((c) => ({ key: c.key, label: c.label || c.header })),
  ];
  const choose = (f) => {
    if (!f) return;
    log('file', f.name, f.size);
    onFile(f);
  };
  const levelLabel = levels.find((l) => l.key === level)?.label;
  return (
    <>
      <InstitutionDialogHeader
        chip="Upload a class list"
        title={['Class list. ', `Up to ${formatRosterCount(maxRows)} rows.`]}
        text="We check every row before anything is added: names, dates of birth, level and year group, an email or phone for each student, duplicates, students at another institution, and parent or guardian contacts for under-18s."
      />
      {levels.length ? (
        <div className="grid grid-cols-1 gap-x-[16px] gap-y-[12px] md:grid-cols-2">
          <Select
            label="Education level of this file"
            options={[
              { value: NONE, label: 'From the Level column of my file' },
              ...levels.map((l) => ({ value: l.key, label: l.label })),
            ]}
            value={level || NONE}
            onChange={(v) => onLevel(v === NONE ? '' : v)}
          />
          <p className="m-0 self-end pb-[6px] font-sans text-[13px] leading-[18px] text-[#595959]">
            {level
              ? `Rows without a Level are taken as ${levelLabel}. Year groups: ${levels
                  .find((l) => l.key === level)
                  ?.grades.map((g) => g.label)
                  .join(', ')}.`
              : 'Each row says its level (JHS, SHS, TVET, University …) and year group.'}
          </p>
        </div>
      ) : null}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          choose(e.dataTransfer.files?.[0]);
        }}
        className={over ? 'rounded-[16px] outline-2 outline-offset-2 outline-[#387440]' : undefined}
      >
        <InstitutionUploadBar
          title={file ? file.name : 'Drop your class list here'}
          hint={
            file
              ? `${Math.max(1, Math.round(file.size / 1024))} KB · ${headers.length} columns · ready to check`
              : `CSV or Excel (.xlsx) · up to ${formatRosterCount(maxRows)} rows · download the template first`
          }
          action="Browse files"
          onAction={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="sr-only"
            tabIndex={-1}
            aria-label="Choose a CSV or Excel file"
            data-testid="roster-csv-input"
            onChange={(e) => choose(e.target.files?.[0])}
          />
        </InstitutionUploadBar>
      </div>
      {file && headers.length ? (
        <>
          <div
            role="separator"
            aria-label="Match your columns"
            className="flex items-center gap-[12px]"
          >
            <span aria-hidden="true" className="h-px flex-1 bg-[#e7e7e7]" />
            <span className="font-sans text-[12px] leading-[14px] font-semibold text-[#595959]">
              Match your columns
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-[#e7e7e7]" />
          </div>
          <div className="grid grid-cols-1 gap-x-[16px] gap-y-[16px] md:grid-cols-3">
            {fields.map((f) => (
              <Select
                key={f.key}
                label={f.label}
                required={required.includes(f.key)}
                error={
                  required.includes(f.key) && !mapping[f.key] ? 'Not found in the file' : undefined
                }
                options={[
                  { value: NONE, label: '— not in my file —' },
                  ...headers.map((h) => ({ value: h, label: h })),
                ]}
                value={mapping[f.key] || NONE}
                onChange={(v) => onMapping({ ...mapping, [f.key]: v === NONE ? '' : v })}
              />
            ))}
          </div>
        </>
      ) : null}
      <ul className="m-0 flex list-disc flex-col gap-[4px] pl-[20px] font-sans text-[13px] leading-[18px] text-[#575755]">
        <li>
          Every student needs an email or a phone number (or both). Each one must be new on GTH, or
          the student’s own account.
        </li>
        <li>
          {card === 'required'
            ? `Ghana Card: required${rules?.identity?.studentIdAlternative ? ' (or the Student ID instead)' : ''}. We keep only a fingerprint of the number and its last 3 digits.`
            : card === 'off'
              ? 'Ghana Card numbers are not collected; a Ghana Card column is ignored.'
              : 'Ghana Card: optional. We keep only a fingerprint of the number and its last 3 digits, to spot duplicates.'}
        </li>
        <li>
          Under 18: add a parent or guardian email or phone. Students are active straight away; the
          parent gets a notice with a link to opt out
          {rules?.optOutWindowDays ? ` (valid ${rules.optOutWindowDays} days)` : ''}.
        </li>
      </ul>
      <div>
        <Checkbox
          label="Send every new student an invite to set up their account (by email, or by SMS when there’s only a phone)"
          checked={invite}
          onChange={(e) => onInvite(e.target.checked)}
        />
        {rules && !rules.smsAvailable ? (
          <p className="m-0 mt-[6px] font-sans text-[13px] leading-[18px] text-[#967014]">
            SMS isn’t switched on yet: students with only a phone are added without an invite, and
            parents with only a phone aren’t notified until it is. You can send both later from
            Students.
          </p>
        ) : null}
      </div>
      <p role="alert" className="m-0 font-sans text-[14px] leading-[20px] text-danger empty:hidden">
        {error}
      </p>
      <InstitutionDialogActions
        cancelLabel={level ? `Download ${levelLabel} template` : 'Download template'}
        onCancel={() => {
          log('template', level || 'default');
          downloadTemplate(level || 'default');
        }}
        primaryLabel="Check file"
        onPrimary={onCheck}
        primaryDisabled={!file}
      />
    </>
  );
};

export default InstitutionUploadPick;
