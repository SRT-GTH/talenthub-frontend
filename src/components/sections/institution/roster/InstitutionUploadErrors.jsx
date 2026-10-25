import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Checkbox from '../../../ui/form/Checkbox.jsx';
import InstitutionDialogActions from './InstitutionDialogActions.jsx';
import InstitutionDialogHeader from './InstitutionDialogHeader.jsx';
import { SAMPLE_ERRORS } from './data/rosterData.js';
import { formatRosterCount } from './rosterFormat.js';
import {
  Roster20CheckCircleFillIcon,
  Roster20DownloadIcon,
  Roster20FileIcon,
  RosterArrowheadDownIcon,
} from './rosterIcons.jsx';

const log = debug('InstitutionUploadErrors');

/*
 * InstitutionUploadErrors — "Fix 14 rows first" (Figma 11.2.2d 8590:385302): nothing is added yet. File card (#f8f8f4, 1px #e7e7e7, r16: file tile, "form1-2026-intake.csv · 312 rows",
 * "298 ready · 14 need fixing" in green with a check-circle, "Re-upload" button), the first rows to fix as labelled read-only fields ("Row 18 · Ghana Card" → "GHA-71203 is too short" ...,
 * "+ 9 more rows" → "Download the error report to see them all"), the "Skip the 14 rows and add the rest" checkbox (ticked), the green "298 students are ready to add" banner,
 * "Download error report" (saves a real CSV with every row number and problem) and Cancel + "Add 298 students →" (disabled while the skip box is unticked).
 * For a real file the fields are built from its first 7 failing rows.
 * Props: result ({ fileName, fileRows, ready, failing, fixes, sample }), onReupload, onCancel, onAdd.
 */

const fieldsFor = (result) => {
  if (result.sample === 'errors') return SAMPLE_ERRORS.fields;
  const shown = result.fixes.slice(0, 7).map((f) => ({
    id: `r${f.row}`,
    label: `Row ${f.row} · ${f.student}`,
    required: true,
    value: f.problem,
  }));
  const more = result.failing - shown.length;
  return more > 0
    ? [
        ...shown,
        {
          id: 'more',
          label: `+ ${more} more rows`,
          placeholder: 'Download the error report to see them all',
        },
      ]
    : shown;
};

const downloadReport = (result) => {
  const lines = ['row,problem'];
  if (result.sample === 'errors') {
    SAMPLE_ERRORS.fields
      .filter((f) => f.id.startsWith('r'))
      .forEach((f) => lines.push(`"${f.label}","${f.value ?? f.placeholder}"`));
  } else {
    result.fixes.forEach((f) => lines.push(`${f.row},"${f.student}: ${f.problem}"`));
  }
  const url = URL.createObjectURL(new Blob([`${lines.join('\n')}\n`], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'error-report.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const InstitutionUploadErrors = ({ result, onReupload, onCancel, onAdd }) => {
  const [skip, setSkip] = useState(true);
  const fields = fieldsFor(result);
  return (
    <>
      <InstitutionDialogHeader
        chip={`Fix ${result.failing} rows first`}
        title={[`Fix ${result.failing} rows `, 'first']}
        text={`Nothing is added yet. Fix these rows in your file and upload again, or add the ${formatRosterCount(result.ready)} good rows now.`}
      />
      <div className="flex flex-wrap items-center gap-[14px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] py-[14px] pr-[16px] pl-[14px]">
        <span className="grid size-[44px] shrink-0 place-items-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
          <Roster20FileIcon className="size-[22px]" />
        </span>
        <div className="flex min-w-[180px] flex-1 flex-col gap-[2px]">
          <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            {result.fileName} · {formatRosterCount(result.fileRows)} rows
          </span>
          <span className="inline-flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#387440]">
            <Roster20CheckCircleFillIcon className="size-[13px]" />
            {formatRosterCount(result.ready)} ready · {result.failing} need fixing
          </span>
        </div>
        <button
          type="button"
          onClick={onReupload}
          className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#165d3a] shadow-[0_1px_2px_rgba(15,15,10,0.05)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          Re-upload
        </button>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-x-[16px] gap-y-[20px] p-0 md:grid-cols-2">
        {fields.map((f) => (
          <li key={f.id} className="flex flex-col gap-[8px]">
            <label
              htmlFor={`fix-${f.id}`}
              className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
            >
              {f.label}
              {f.required ? <span className="ml-[1px] font-semibold text-[#2e8b57]">*</span> : null}
            </label>
            <div className="relative">
              <input
                id={`fix-${f.id}`}
                readOnly
                disabled={f.disabled}
                defaultValue={f.value}
                placeholder={f.placeholder}
                className={`h-[51px] w-full rounded-[10px] border border-solid border-[#cccccc] px-[20px] font-sans text-[14px] leading-[24px] tracking-[0.2px] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)] outline-none placeholder:text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] ${f.disabled ? 'bg-[#e1eae2] opacity-55' : 'bg-white'} ${f.value ? 'font-medium text-[#1c2a21]' : 'text-[#595959]'}`}
              />
              {f.chevron ? (
                <RosterArrowheadDownIcon className="pointer-events-none absolute top-[17px] right-[16px] size-[16px] text-[#1c2a21]" />
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      <Checkbox
        label={`Skip the ${result.failing} rows and add the rest`}
        checked={skip}
        onChange={(e) => setSkip(e.target.checked)}
      />
      <div className="flex items-center gap-[10px] rounded-[14px] border border-solid border-[#1c2a21]/10 bg-[#e8f2ed] px-[14px] py-[12px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]">
        <Roster20CheckCircleFillIcon className="size-[18px] shrink-0 text-[#1d7c4d]" />
        <p
          role="status"
          className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#165d3a]"
        >
          {formatRosterCount(result.ready)} students are ready to add
        </p>
      </div>
      <InstitutionDialogActions
        left={
          <button
            type="button"
            onClick={() => {
              log('download report');
              downloadReport(result);
            }}
            className="inline-flex min-h-[24px] cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <Roster20DownloadIcon className="size-[16px]" />
            Download error report
          </button>
        }
        cancelLabel="Cancel"
        onCancel={onCancel}
        primaryLabel={`Add ${formatRosterCount(result.ready)} students`}
        onPrimary={onAdd}
        primaryDisabled={!skip}
      />
    </>
  );
};

export default InstitutionUploadErrors;
