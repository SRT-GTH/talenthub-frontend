import avatar from '../../../../assets/institution/records/abena-mahama-avatar.png';
import Button from '../../../ui/Button.jsx';
import InstitutionButton from '../InstitutionButton.jsx';
import RecordChip from './RecordChip.jsx';
import RecordIcon from './RecordIcon.jsx';
import { RecordsIconCheck13, RecordsIconGhanaFlag } from './recordsIcons.jsx';

/*
 * RecordHero — the profile header of the record (Figma "hero" 8593:595, 1329x322, r24): green cover 150 with the "Open to scholarships" sticker, avatar 132, name 37/44 + Verified chip,
 * tagline, "Form 3 · General Science · …" + flag, three chips, the Reject / Approve record buttons, the three stats and the "Your actions" sticker.
 * ⚠️ ASSUMPTION: only Abena has a photo; other records show the green monogram.
 * Props: detail (RECORD_DETAIL), record, onReject, onApprove.
 */
const RecordHero = ({ detail, record, onReject, onApprove }) => (
  <section
    aria-label="Student"
    className="relative rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white font-sans shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06)]"
  >
    <div className="h-[150px] rounded-t-[24px] bg-[#387440] px-[32px] pt-[24px]">
      <span className="inline-flex h-[26px] items-center rounded-full bg-[#ebf1ec] px-[10px] text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
        {detail.heading}
      </span>
    </div>
    <div className="relative px-[32px] pb-[32px]">
      <div className="absolute -top-[66px] left-[32px] flex size-[132px] items-center justify-center overflow-hidden rounded-full border border-solid border-[#1c2a21]/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06)]">
        {record.id === 'rec-1' ? (
          <img src={avatar} alt="" className="size-[118px] rounded-full object-cover" />
        ) : (
          <span className="flex size-[118px] items-center justify-center rounded-full bg-[#387440] text-[40px] font-semibold text-white">
            {record.initials}
          </span>
        )}
      </div>
      <span className="absolute -top-[17px] right-[32px] hidden h-[23px] items-center rounded-full bg-[#ebf1ec] px-[10px] text-[11px] max-lg:text-[12px] leading-[13px] font-bold text-[#1f4a2b] lg:inline-flex xl:right-[194px]">
        Your actions
      </span>
      <div className="flex flex-col gap-[20px] pt-[76px] lg:flex-row lg:justify-between lg:pt-[10px] lg:pl-[156px]">
        <div className="flex min-w-0 flex-col gap-[6px]">
          <div className="flex flex-wrap items-center gap-[10px]">
            <h1 className="m-0 text-[30px] leading-[36px] font-semibold text-[#1c2a21] md:text-[37px] md:leading-[44px]">
              {record.student}
            </h1>
            <span className="inline-flex h-[22px] items-center gap-[4px] rounded-full bg-[#ebf1ec] py-[4px] pr-[9px] pl-[7px] text-[12px] leading-[14px] font-semibold text-[#2d5d33]">
              <RecordsIconCheck13 className="size-[13px] text-[#387440]" />
              Verified
            </span>
          </div>
          <p className="m-0 text-[13px] leading-[16px] text-[#737373]">
            {record.id === 'rec-1'
              ? detail.tagline
              : `${record.pronounLower}/${record.pronounPossessive} · joined Sep 2024`}
          </p>
          <p className="m-0 flex items-center gap-[6px] text-[16px] leading-[19px] font-medium text-[#1c2a21]">
            {detail.location}
            <RecordsIconGhanaFlag className="size-[18px] shrink-0" />
          </p>
          <div className="flex flex-wrap gap-[8px] pt-[6px]">
            {detail.chips.map((c) => (
              <RecordChip key={c.id} tone={c.tone} icon={<RecordIcon name={c.icon} size="chip" />}>
                {c.label}
              </RecordChip>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[26px] lg:items-end">
          <div className="flex flex-wrap gap-[10px]">
            <InstitutionButton
              size="md"
              className="!h-[48px] !rounded-[10px] !px-[18px] !text-[16px] !font-bold"
              onClick={onReject}
            >
              Reject record
            </InstitutionButton>
            <Button
              variant="primary"
              size="md"
              className="!px-[18px] !py-[12px]"
              onClick={onApprove}
            >
              Approve record
            </Button>
          </div>
          <dl className="m-0 flex gap-[22px]">
            {detail.stats.map((s) => (
              <div key={s.id} className="flex flex-col-reverse">
                <dd className="m-0 text-[23px] leading-[29px] font-semibold text-[#1c2a21]">
                  {s.value}
                </dd>
                <dt className="text-[11px] max-lg:text-[12px] leading-[13px] font-medium text-[#737373]">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  </section>
);

export default RecordHero;
