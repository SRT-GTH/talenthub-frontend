import Button from '../../../ui/Button.jsx';
import RecordCard from './RecordCard.jsx';
import RecordIcon from './RecordIcon.jsx';
import { RecordsIconCheck13, RecordsIconEye14 } from './recordsIcons.jsx';

const STATUS = {
  pending: { label: 'Waiting', className: 'bg-[#faf4e8] text-[#7a5a12]' },
  'needs-info': { label: 'Needs info', className: 'bg-[#eaeffb] text-[#27408b]' },
  approved: { label: 'Approved', className: 'bg-[#ebf1ec] text-[#2d5d33]' },
  rejected: { label: 'Rejected', className: 'bg-[#fbeceb] text-[#902b20]' },
};

const sizeLabel = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/*
 * RecordSideRail — the right column of the record (Figma "right rail" 8593:857): the dark "Verify this record" card (what was sent, the attached copy,
 * Approve record / Ask for more while open), "What to check" (each check ticked when the platform could confirm it, "check by hand" otherwise),
 * "Other records from <first name>" (replaces the drawn Badges card, which has no data behind it) and the record's history.
 * Props: detail, record, onApprove, onAsk, onOpenFile, onOpenRecord(id).
 */
const RecordSideRail = ({ detail, record, onApprove, onAsk, onOpenFile, onOpenRecord }) => {
  const first = record.student.split(' ')[0];
  return (
    <div className="flex flex-col gap-[20px] font-sans">
      <section
        aria-label="Verify this record"
        className="flex flex-col gap-[12px] rounded-[20px] bg-[#1c2a21] p-[24px] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06)]"
      >
        <span className="inline-flex h-[24px] w-fit items-center gap-[6px] rounded-full bg-[#ebf1ec] px-[10px] text-[12px] leading-[14px] font-bold text-[#1f4a2b]">
          Verify this record
          <RecordsIconEye14 className="size-[14px]" />
        </span>
        <h2 className="m-0 text-[22px] leading-[28px] font-semibold text-white">
          {detail.summaryTitle}
        </h2>
        <p className="m-0 text-[14px] leading-[21px] whitespace-pre-line text-[#bfbfbf]">
          {detail.summaryBody}
        </p>
        {record.file ? (
          <button
            type="button"
            onClick={onOpenFile}
            className="flex w-full cursor-pointer items-center gap-[10px] rounded-[12px] border border-solid border-white/15 bg-white/5 px-[14px] py-[10px] text-left text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#ffd86b]"
          >
            <RecordIcon name="file" size="row" className="size-[16px] shrink-0" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[14px] leading-[18px] font-semibold">
                {record.file.name}
              </span>
              <span className="text-[12px] leading-[14px] text-[#bfbfbf]">
                {sizeLabel(record.file.size)} · download the copy
              </span>
            </span>
          </button>
        ) : (
          <p className="m-0 text-[13px] leading-[18px] text-[#bfbfbf]">No copy attached.</p>
        )}
        {detail.open ? (
          <div className="flex flex-wrap gap-[8px]">
            <Button
              variant="primary"
              size="md"
              className="!px-[18px] !py-[12px]"
              onClick={onApprove}
            >
              Approve record
            </Button>
            {record.status === 'pending' ? (
              <button
                type="button"
                onClick={onAsk}
                className="cursor-pointer rounded-[10px] border border-solid border-white/30 bg-transparent px-[16px] py-[11px] text-[14px] leading-[18px] font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#ffd86b]"
              >
                Ask for more
              </button>
            ) : null}
          </div>
        ) : null}
      </section>
      <RecordCard title="What to check">
        <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
          {detail.checks.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-[10px] text-[14px] leading-[18px] font-medium text-[#595959]"
            >
              <span className="size-[15px] shrink-0 text-[#595959]">
                {c.icon ? <RecordIcon name={c.icon} size="row" className="size-full" /> : null}
              </span>
              <span className="flex-1">{c.label}</span>
              {c.ok === true ? (
                <span className="inline-flex items-center gap-[4px] text-[12px] font-semibold text-[#2d5d33]">
                  <RecordsIconCheck13 className="size-[13px] text-[#387440]" />
                  Confirmed
                </span>
              ) : c.ok === false ? (
                <span className="text-[12px] font-semibold text-[#902b20]">Doesn’t match</span>
              ) : (
                <span className="text-[12px] font-semibold text-[#7a5a12]">Check by hand</span>
              )}
            </li>
          ))}
        </ul>
        <p className="m-0 text-[13px] leading-[18px] text-[#737373]">
          “Confirmed” checks come from your roster and the student’s GTH profile. Compare the copy
          with your own mark sheets before you approve.
        </p>
      </RecordCard>
      {record.others?.length ? (
        <RecordCard title={`Other records from ${first}`}>
          <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
            {record.others.map((o) => {
              const s = STATUS[o.status] ?? STATUS.pending;
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => onOpenRecord(o.id)}
                    className="flex w-full cursor-pointer items-center gap-[10px] rounded-[10px] border-0 bg-transparent p-[4px] text-left hover:bg-[#f5f5f5] focus-visible:outline-2 focus-visible:outline-[#387440]"
                  >
                    <span className="flex-1 text-[14px] leading-[18px] font-medium text-[#1c2a21]">
                      {o.title}
                    </span>
                    <span
                      className={`rounded-full px-[8px] py-[2px] text-[12px] leading-[16px] font-semibold ${s.className}`}
                    >
                      {s.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </RecordCard>
      ) : null}
      {record.history?.length ? (
        <RecordCard title="History">
          <ol className="m-0 flex list-none flex-col gap-[10px] p-0">
            {record.history.map((h, i) => (
              <li key={`${h.at}-${i}`} className="text-[13px] leading-[18px] text-[#595959]">
                <span className="font-semibold text-[#1c2a21]">
                  {h.what.charAt(0).toUpperCase() + h.what.slice(1)}
                </span>
                {h.by ? ` · ${h.by}` : ''} ·{' '}
                {new Intl.DateTimeFormat('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(h.at))}
              </li>
            ))}
          </ol>
        </RecordCard>
      ) : null}
    </div>
  );
};

export default RecordSideRail;
