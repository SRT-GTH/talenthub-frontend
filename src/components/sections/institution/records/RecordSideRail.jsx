import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import RecordCard from './RecordCard.jsx';
import RecordIcon from './RecordIcon.jsx';
import { RecordsIconEye14, RecordsIconLock } from './recordsIcons.jsx';

const TONES = { cream: 'bg-[#faf4e8]', green: 'bg-[#ebf1ec]', blue: 'bg-[#eaeffb]' };

/*
 * RecordSideRail — the right column of the record (Figma "right rail" 8593:857): the dark "Verify this record" card with Approve record, "What to check" (six rows with a lock) and "Badges".
 * The first check row draws an empty icon instance in Figma (icon/video): nothing is drawn, the 15px slot is kept. Props: detail, onApprove.
 */
const RecordSideRail = ({ detail, onApprove }) => (
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
      <p className="m-0 text-[14px] leading-[21px] text-[#bfbfbf]">{detail.summaryBody}</p>
      <div>
        <Button variant="primary" size="md" className="!px-[18px] !py-[12px]" onClick={onApprove}>
          Approve record
        </Button>
      </div>
    </section>
    <RecordCard title="What to check">
      <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
        {detail.checks.map((c) => (
          <li
            key={c.id}
            className="flex items-center gap-[10px] text-[14px] leading-[17px] font-medium text-[#595959]"
          >
            <span className="size-[15px] shrink-0 text-[#595959]">
              {c.icon ? <RecordIcon name={c.icon} size="row" className="size-full" /> : null}
            </span>
            <span className="flex-1">{c.label}</span>
            <RecordsIconLock className="size-[14px] shrink-0 text-[#1c2a21]" />
          </li>
        ))}
      </ul>
      <span className="text-[13px] leading-[16px] font-semibold text-[#387440]">
        How record checks work →
      </span>
    </RecordCard>
    <RecordCard title="Badges" link="All 9 →">
      <ul className="m-0 flex list-none gap-[6px] p-0">
        {detail.badges.map((b) => (
          <li key={b.id} className="flex w-[88px] flex-col items-center gap-[6px]">
            <span
              className={classNames(
                'flex size-[56px] items-center justify-center rounded-full border border-solid border-[#1c2a21]/10 text-[#1c2a21] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06)]',
                TONES[b.tone]
              )}
            >
              <RecordIcon name={b.icon} size="badge" className="size-[25px]" />
            </span>
            <span className="text-[11px] max-lg:text-[12px] leading-[13px] font-medium text-[#595959]">
              {b.label}
            </span>
          </li>
        ))}
      </ul>
    </RecordCard>
  </div>
);

export default RecordSideRail;
