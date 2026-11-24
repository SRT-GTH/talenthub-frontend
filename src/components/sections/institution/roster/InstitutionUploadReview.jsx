import { classNames } from '../../../../utils/classNames.js';
import InstitutionDialogActions from './InstitutionDialogActions.jsx';
import InstitutionDialogHeader from './InstitutionDialogHeader.jsx';
import { formatRosterCount } from './rosterFormat.js';
import { Roster20DownloadIcon, Roster20ShieldIcon } from './rosterIcons.jsx';
import { downloadCheckReport } from './uploadReport.js';

/*
 * InstitutionUploadReview — "Ready to add 298 students" (Figma 11.2.2h 8744:431402): four stat tiles (176 x 77, r14, p 14/16: Ready to add #ebf1ec / Duplicates skipped
 * #faf4e8 / Need a fix #f9ebea / At another institution #f8f8f4; value 26/31 600, label 12/14 500 #575755). Each row of the file is in exactly one tile, so the tiles add
 * up to the file. Under them: who gets what (new accounts by email or SMS, students already on GTH asked to confirm, under-18s and their parents' opt-out notices,
 * levels), then every row that needs a fix with ALL its problems, the skipped rows (duplicates, other institutions) and the rows to double-check (possible
 * duplicates, minors without a guardian contact: still added). "Download report" saves them as a CSV. "Back" + "Add N students →".
 * Props: result (the server's check: ready, duplicates, failing, elsewhere, newAccounts, links, byEmail, bySms, minors, parentNotices, minorsNoGuardian, levels,
 * smsAvailable, fixes[{row, student, problems}], skipped[{row, student, problem, kind}], warnings[{row, student, warnings}], fileName), onBack, onAdd, onFix, busy, error.
 */

const TILES = [
  { id: 'ready', label: 'Ready to add', bg: 'bg-[#ebf1ec]', ink: 'text-[#387440]' },
  { id: 'duplicates', label: 'Duplicates skipped', bg: 'bg-[#faf4e8]', ink: 'text-[#967014]' },
  { id: 'failing', label: 'Need a fix', bg: 'bg-[#f9ebea]', ink: 'text-[#c0392b]' },
  { id: 'elsewhere', label: 'At another institution', bg: 'bg-[#f8f8f4]', ink: 'text-[#1c2a21]' },
];

const n = formatRosterCount;

const RowTable = ({ title, rows, render }) =>
  rows.length ? (
    <section className="flex flex-col gap-[8px]">
      <h3 className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
        {title} ({rows.length})
      </h3>
      <div className="max-h-[240px] overflow-auto rounded-[12px] border border-solid border-[#efefea]">
        <table className="w-full min-w-[520px] border-collapse font-sans text-[13px] leading-[17px] text-[#1c2a21]">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-solid border-[#e7e7e7] text-left text-[12px] leading-[14px] font-medium text-[#575755]">
              <th scope="col" className="w-[56px] px-[10px] py-[8px] font-medium">
                Row
              </th>
              <th scope="col" className="w-[180px] px-[10px] py-[8px] font-medium">
                Student
              </th>
              <th scope="col" className="px-[10px] py-[8px] font-medium">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={`${title}-${r.row}`}
                className="border-b border-solid border-[#f1f1f1] align-top last:border-b-0"
              >
                <td className="px-[10px] py-[8px] font-medium">{r.row}</td>
                <td className="px-[10px] py-[8px]">{r.student}</td>
                <td className="px-[10px] py-[8px]">{render(r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  ) : null;

const list = (items) =>
  items.length === 1 ? (
    items[0]
  ) : (
    <ul className="m-0 list-disc pl-[16px]">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );

const InstitutionUploadReview = ({ result, onBack, onAdd, onFix, busy = false, error }) => {
  const levels = Object.entries(result.levels || {});
  const smsOff = result.smsAvailable === false;
  return (
    <>
      <InstitutionDialogHeader
        chip="Upload a class list"
        title={`Ready to add ${n(result.ready)} students`}
        text={`${result.fileName} is checked. Rows that need attention are listed below; the rest are added when you continue.`}
      />
      <div className="flex flex-col gap-[14px]">
        <ul className="m-0 grid list-none grid-cols-2 gap-[12px] p-0 md:grid-cols-4">
          {TILES.map((t) => (
            <li
              key={t.id}
              className={classNames(
                'flex flex-col gap-[4px] rounded-[14px] px-[16px] py-[14px]',
                t.bg
              )}
            >
              <span
                className={classNames('font-sans text-[26px] leading-[31px] font-semibold', t.ink)}
              >
                {n(result[t.id])}
              </span>
              <span className="font-sans text-[12px] leading-[14px] font-medium text-[#575755]">
                {t.label}
              </span>
            </li>
          ))}
        </ul>
        {result.ready ? (
          <ul className="m-0 flex list-disc flex-col gap-[4px] pl-[20px] font-sans text-[13px] leading-[18px] text-[#1c2a21]">
            {result.newAccounts ? (
              <li>
                {n(result.newAccounts)} new to GTH: {n(result.byEmail)} get an invite by email
                {result.bySms
                  ? smsOff
                    ? `; ${n(result.bySms)} with only a phone are added without an invite until SMS is switched on`
                    : `, ${n(result.bySms)} by SMS`
                  : ''}
                .
              </li>
            ) : null}
            {result.links ? (
              <li>{n(result.links)} already on GTH: they are asked to confirm your school.</li>
            ) : null}
            {result.minors ? (
              <li>
                {n(result.minors)} under 18: active straight away. {n(result.parentNotices)} parent
                {result.parentNotices === 1 ? '' : 's'} get a notice with an opt-out link
                {result.minorsNoGuardian
                  ? `; ${n(result.minorsNoGuardian)} without a guardian contact are added and flagged for you to complete`
                  : ''}
                .
              </li>
            ) : null}
            {levels.length ? <li>{levels.map(([k, v]) => `${k} ${n(v)}`).join(' · ')}</li> : null}
          </ul>
        ) : null}
        <RowTable
          title="Needs a fix"
          rows={result.fixes || []}
          render={(r) => list(r.problems || [r.problem])}
        />
        <RowTable title="Skipped" rows={result.skipped || []} render={(r) => r.problem} />
        <RowTable
          title="Added, but check"
          rows={result.warnings || []}
          render={(r) => list(r.warnings)}
        />
        {result.elsewhere > 0 ? (
          <p className="m-0 flex items-start gap-[8px] font-sans text-[13px] leading-[16px] text-[#575755]">
            <Roster20ShieldIcon className="mt-px size-[16px] shrink-0" />
            {result.elsewhere} students are already enrolled at another institution. They need a
            transfer from that school first, so they are not added.
          </p>
        ) : null}
      </div>
      <p role="alert" className="m-0 font-sans text-[14px] leading-[20px] text-danger empty:hidden">
        {error}
      </p>
      <InstitutionDialogActions
        left={
          (result.fixes || []).length ||
          (result.skipped || []).length ||
          (result.warnings || []).length ? (
            <button
              type="button"
              onClick={() => downloadCheckReport(result)}
              className="inline-flex min-h-[24px] cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <Roster20DownloadIcon className="size-[16px]" />
              Download report
            </button>
          ) : null
        }
        cancelLabel={(result.fixes || []).length ? 'Fix the file' : 'Back'}
        onCancel={(result.fixes || []).length ? onFix : onBack}
        primaryLabel={busy ? 'Adding…' : `Add ${n(result.ready)} students`}
        onPrimary={onAdd}
        primaryDisabled={busy || result.ready === 0}
      />
    </>
  );
};

export default InstitutionUploadReview;
