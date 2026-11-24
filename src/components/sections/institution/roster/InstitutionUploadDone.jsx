import { classNames } from '../../../../utils/classNames.js';
import InstitutionDialogActions from './InstitutionDialogActions.jsx';
import InstitutionDialogHeader from './InstitutionDialogHeader.jsx';
import { formatRosterCount } from './rosterFormat.js';
import { Roster20DownloadIcon } from './rosterIcons.jsx';
import { downloadRunReport } from './uploadReport.js';

/*
 * InstitutionUploadDone — the processing summary after "Add N students" (US-1.1.3-01 "upload report"; no Figma frame, built on the review tiles):
 * six tiles (Invited · Linked · Skipped · Not added · Under 18 · Parent notices sent), the follow-ups in plain words (invites not sent, minors without a
 * guardian contact, notices that couldn't be delivered), "Download report" (every row with its outcome) and "Done".
 * While a big file is still processed in the background the header says so and the dialog asks for news every few seconds.
 * Props: summary (GET /institution/roster/imports/:id: { status, fileName, counts, processed, rows }), onDone.
 */

const n = formatRosterCount;

const InstitutionUploadDone = ({ summary, onDone }) => {
  const c = summary.counts || {};
  const processing = summary.status === 'processing';
  const failed = summary.status === 'failed';
  const tiles = [
    { id: 'created', label: 'Invited', value: c.created, tone: 'bg-[#ebf1ec] text-[#387440]' },
    {
      id: 'linked',
      label: 'Linked or asked to confirm',
      value: (c.linked || 0) + (c.requested || 0),
      tone: 'bg-[#ebf1ec] text-[#387440]',
    },
    {
      id: 'skipped',
      label: 'Skipped (duplicates, other schools)',
      value: c.skipped,
      tone: 'bg-[#faf4e8] text-[#967014]',
    },
    {
      id: 'failed',
      label: 'Not added (need a fix)',
      value: c.failed,
      tone: 'bg-[#f9ebea] text-[#c0392b]',
    },
    { id: 'minors', label: 'Under 18', value: c.minors, tone: 'bg-[#f8f8f4] text-[#1c2a21]' },
    {
      id: 'notices',
      label: 'Parent notices sent',
      value: c.parentNoticesSent,
      tone: 'bg-[#f8f8f4] text-[#1c2a21]',
    },
  ];
  const follow = [
    c.notInvited
      ? `${n(c.notInvited)} added without an invite (you chose not to send invites). Send them from Students › Remind.`
      : null,
    c.inviteFailed
      ? `${n(c.inviteFailed)} added but their invite wasn’t sent (see the report). Send it later from Students › Remind.`
      : null,
    c.minorsFlagged
      ? `${n(c.minorsFlagged)} under-18s have no parent or guardian contact. They are active and flagged: add a contact, then send the guardian notice from Students.`
      : null,
    c.parentNoticesFailed
      ? `${n(c.parentNoticesFailed)} parent notices couldn’t be delivered yet (see the report). Send them again from Students › Guardian notices.`
      : null,
  ].filter(Boolean);
  return (
    <>
      <InstitutionDialogHeader
        chip="Upload a class list"
        title={
          processing
            ? 'Adding your students…'
            : failed
              ? 'The upload stopped'
              : [`${n(c.added)} students `, 'added']
        }
        text={
          processing
            ? `${summary.fileName || 'Your file'}: ${n(summary.processed)} of ${n(c.added)} done. You can close this; the rest carries on and shows on your roster.`
            : failed
              ? `Something went wrong after ${n(summary.processed)} of ${n(c.added)} students. The students already added stay on your roster; use Students › Remind for their invites.`
              : `${summary.fileName || 'Your file'} is done. Download the report for every row and what happened to it.`
        }
      />
      <ul className="m-0 grid list-none grid-cols-2 gap-[12px] p-0 md:grid-cols-3">
        {tiles.map((t) => (
          <li
            key={t.id}
            className={classNames(
              'flex flex-col gap-[4px] rounded-[14px] px-[16px] py-[14px]',
              t.tone
            )}
          >
            <span className="font-sans text-[26px] leading-[31px] font-semibold">{n(t.value)}</span>
            <span className="font-sans text-[12px] leading-[14px] font-medium text-[#575755]">
              {t.label}
            </span>
          </li>
        ))}
      </ul>
      {follow.length ? (
        <ul className="m-0 flex list-disc flex-col gap-[4px] pl-[20px] font-sans text-[13px] leading-[18px] text-[#1c2a21]">
          {follow.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      ) : null}
      <InstitutionDialogActions
        left={
          (summary.rows || []).length ? (
            <button
              type="button"
              onClick={() => downloadRunReport(summary)}
              className="inline-flex min-h-[24px] cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <Roster20DownloadIcon className="size-[16px]" />
              Download report
            </button>
          ) : null
        }
        primaryLabel="Done"
        onPrimary={onDone}
        arrow={false}
      />
    </>
  );
};

export default InstitutionUploadDone;
