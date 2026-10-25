import { classNames } from '../../../../utils/classNames.js';
import InstitutionDialogActions from './InstitutionDialogActions.jsx';
import InstitutionDialogHeader from './InstitutionDialogHeader.jsx';
import { formatRosterCount } from './rosterFormat.js';
import {
  Roster20CheckCircleIcon,
  Roster20FileIcon,
  Roster20HourglassIcon,
  Roster20ShieldIcon,
  Roster20WarningIcon,
} from './rosterIcons.jsx';

/*
 * InstitutionUploadChecking — "Checking form3_2026.csv" (Figma 11.2.2g 8744:431110): file card (#f8f8f4, r14, file glyph, name 14/17 600, "312 rows · 41 KB · uploaded just now",
 * amber "Checking" pill), progress ("184 of 312 rows checked" 14/17 600 + "59%" #387440, 8 high #efefea track, #387440 fill), four steps (Ghana Card format · Duplicates on your roster ·
 * Already at another institution · Guardian details for under-18s: icon 18, label 14/17 500, status 13/16 500: green Done / amber Done with a count / grey Checking… / Waiting),
 * the shield note, "Cancel upload" + "Run in background →".
 * Props: name, rows (total), size ('41 KB'), progress (0..1), result (counts, shown once a step is done), onCancel, onBackground. The steps complete at 25 / 50 / 75 / 100 %;
 * at the Figma frame (59 %) the first two are done, "Already at another institution" is Checking… and "Guardian details" Waiting.
 */

const STEPS = ['card', 'dup', 'elsewhere', 'guardian'];

const stepState = (i, progress) => {
  const done = progress >= (i + 1) / 4;
  const active = !done && progress >= i / 4;
  return done ? 'done' : active ? 'active' : 'wait';
};

const InstitutionUploadChecking = ({
  name,
  rows,
  size,
  progress,
  result,
  onCancel,
  onBackground,
}) => {
  const checked = Math.min(rows, Math.round(rows * progress));
  const pct = Math.round(progress * 100);
  const labels = {
    card: 'Ghana Card format',
    dup: 'Duplicates on your roster',
    elsewhere: 'Already at another institution',
    guardian: 'Guardian details for under-18s',
  };
  const doneText = {
    card: `Done · ${formatRosterCount(result.okCards)} OK`,
    dup: `Done · ${formatRosterCount(result.duplicates)} found`,
    elsewhere: `Done · ${formatRosterCount(result.elsewhere)} found`,
    guardian: 'Done',
  };
  return (
    <>
      <InstitutionDialogHeader
        chip="Upload a class list"
        title={`Checking ${name}`}
        text="We check every row before anything is added. You can leave this page; we’ll tell you in the bell when it’s done."
      />
      <div className="flex flex-col gap-[14px]">
        <div className="flex items-center gap-[12px] rounded-[14px] bg-[#f8f8f4] px-[16px] py-[14px]">
          <Roster20FileIcon className="size-[22px] shrink-0 text-[#387440]" />
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
              {name}
            </span>
            <span className="font-sans text-[12px] leading-[14px] text-[#575755]">
              {formatRosterCount(rows)} rows · {size} · uploaded just now
            </span>
          </div>
          <span className="inline-flex items-center rounded-full bg-[#faf4e8] px-[8px] py-[3px] font-sans text-[12px] leading-[14px] font-semibold text-[#967014]">
            {progress >= 1 ? 'Checked' : 'Checking'}
          </span>
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between font-sans text-[14px] leading-[17px] font-semibold">
            <span className="text-[#1c2a21]" aria-live="polite">
              {formatRosterCount(checked)} of {formatRosterCount(rows)} rows checked
            </span>
            <span className="text-[#387440]">{pct}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Rows checked"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            className="h-[8px] overflow-hidden rounded-[4px] bg-[#efefea]"
          >
            <div className="h-full rounded-[4px] bg-[#387440]" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <ul className="m-0 flex list-none flex-col p-0">
          {STEPS.map((id, i) => {
            const st = stepState(i, progress);
            const warn = id === 'dup' && st === 'done' && result.duplicates > 0;
            return (
              <li
                key={id}
                className="flex items-center gap-[10px] border-b border-solid border-[#f1f1f1] py-[10px] last:border-b-0"
              >
                {st === 'done' ? (
                  warn ? (
                    <Roster20WarningIcon className="size-[18px] shrink-0 text-[#967014]" />
                  ) : (
                    <Roster20CheckCircleIcon className="size-[18px] shrink-0 text-[#387440]" />
                  )
                ) : (
                  <Roster20HourglassIcon className="size-[18px] shrink-0 text-[#999999]" />
                )}
                <span className="flex-1 font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
                  {labels[id]}
                </span>
                <span
                  className={classNames(
                    'font-sans text-[13px] leading-[16px] font-medium',
                    st !== 'done' ? 'text-[#575755]' : warn ? 'text-[#967014]' : 'text-[#387440]'
                  )}
                >
                  {st === 'done' ? doneText[id] : st === 'active' ? 'Checking…' : 'Waiting'}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="m-0 flex items-center gap-[8px] font-sans text-[13px] leading-[16px] text-[#575755]">
          <Roster20ShieldIcon className="size-[16px] shrink-0" />
          Nothing is added to your roster until you review the results.
        </p>
      </div>
      <InstitutionDialogActions
        cancelLabel="Cancel upload"
        onCancel={onCancel}
        primaryLabel="Run in background"
        onPrimary={onBackground}
      />
    </>
  );
};

export default InstitutionUploadChecking;
