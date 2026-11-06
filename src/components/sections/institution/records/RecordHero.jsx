import Button from '../../../ui/Button.jsx';
import InstitutionButton from '../InstitutionButton.jsx';
import RecordChip from './RecordChip.jsx';
import RecordIcon from './RecordIcon.jsx';
import { RecordsIconCheck13, RecordsIconGhanaFlag } from './recordsIcons.jsx';

/*
 * RecordHero — the profile header of the record (Figma "hero" 8593:595, 1329x322, r24): green cover 150 with the "<kind> to verify" sticker, avatar 132
 * (the student's GTH photo, else the green monogram), name 37/44 + "On GTH" chip, tagline, "Form 2 · General Science · <school>" + flag, profile chips,
 * the Reject / Approve record buttons (only while the record is open), the stats and the "Your actions" sticker.
 * Props: detail (buildRecordDetail), record (GET /records/:id), onReject, onApprove.
 */
const RecordHero = ({ detail, record, onReject, onApprove }) => {
  const photo = detail.onGth ? record.profile?.avatar || record.profile?.profile?.avatar : null;
  return (
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
          {photo ? (
            <img src={photo} alt="" className="size-[118px] rounded-full object-cover" />
          ) : (
            <span className="flex size-[118px] items-center justify-center rounded-full bg-[#387440] text-[40px] font-semibold text-white">
              {record.initials}
            </span>
          )}
        </div>
        {detail.open ? (
          <span className="absolute -top-[17px] right-[32px] hidden h-[23px] items-center rounded-full bg-[#ebf1ec] px-[10px] text-[11px] leading-[13px] font-bold text-[#1f4a2b] max-lg:text-[12px] lg:inline-flex xl:right-[194px]">
            Your actions
          </span>
        ) : null}
        <div className="flex flex-col gap-[20px] pt-[76px] lg:flex-row lg:justify-between lg:pt-[10px] lg:pl-[156px]">
          <div className="flex min-w-0 flex-col gap-[6px]">
            <div className="flex flex-wrap items-center gap-[10px]">
              <h1 className="m-0 text-[30px] leading-[36px] font-semibold text-[#1c2a21] md:text-[37px] md:leading-[44px]">
                {record.student}
              </h1>
              {detail.onGth ? (
                <span className="inline-flex h-[22px] items-center gap-[4px] rounded-full bg-[#ebf1ec] py-[4px] pr-[9px] pl-[7px] text-[12px] leading-[14px] font-semibold text-[#2d5d33]">
                  <RecordsIconCheck13 className="size-[13px] text-[#387440]" />
                  On GTH
                </span>
              ) : null}
            </div>
            {detail.tagline ? (
              <p className="m-0 text-[13px] leading-[16px] text-[#737373]">{detail.tagline}</p>
            ) : null}
            <p className="m-0 flex items-center gap-[6px] text-[16px] leading-[19px] font-medium text-[#1c2a21]">
              {detail.location}
              <RecordsIconGhanaFlag className="size-[18px] shrink-0" />
            </p>
            {detail.chips.length ? (
              <div className="flex flex-wrap gap-[8px] pt-[6px]">
                {detail.chips.map((c) => (
                  <RecordChip
                    key={c.id}
                    tone={c.tone}
                    icon={<RecordIcon name={c.icon} size="chip" />}
                  >
                    {c.label}
                  </RecordChip>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-[26px] lg:items-end">
            {detail.open ? (
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
            ) : null}
            <dl className="m-0 flex gap-[22px]">
              {detail.stats.map((s) => (
                <div key={s.id} className="flex flex-col-reverse">
                  <dd className="m-0 text-[23px] leading-[29px] font-semibold text-[#1c2a21]">
                    {s.value}
                  </dd>
                  <dt className="text-[11px] leading-[13px] font-medium text-[#737373] max-lg:text-[12px]">
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
};

export default RecordHero;
