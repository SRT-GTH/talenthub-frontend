import Button from '../../../ui/Button.jsx';
import { formatCount } from '../agencyFormat.js';
import {
  JobDetailBuddySparkIcon,
  JobDetailChatIcon,
  JobDetailClockIcon,
  JobDetailSendIcon,
  JobDetailTickIcon,
} from '../../talentJobs/JobDetailIcons.jsx';
import { PUBLISHED } from '../data/programmesData.js';
import AgencyDialogShell from '../queries/AgencyDialogShell.jsx';

/*
 * ProgrammePublishedDialog — "Programme published!" (Figma 11.5.2c, 8597:395xxx over the preview: 560 wide, white, r24; green celebration header 200 high with
 * confetti, the yellow disc with the tick and the white "Live now" sticker; title 32/600 · "9,870 matched talents will see YouthStart Digital Grant in their
 * feed today." · three "what next" rows · "Back to programmes" + "View applicants"). Same construction as the Talent Jobs "application sent" dialog (JobApplyDialogs),
 * Focused only. The count goes through formatCount(). Focus trap, Esc (= back to programmes) and focus return from AgencyDialogShell.
 * Props: count (matching talents), onBack(), onView().
 */

const CONFETTI = [
  [40, 25, 15, 10, '#ffd86b', -20],
  [86, 160, 15, 12, '#ffffff', 30],
  [470, 21, 15, 14, '#ffffff', -40],
  [498, 150, 15, 9, '#ffd86b', 15],
  [180, 157, 12, 15, '#ebf1ec', -60],
  [350, 167, 15, 8, '#ffd86b', -10],
  [16, 120, 15, 14, '#ebf1ec', 40],
  [520, 84, 15, 11, '#ebf1ec', -25],
];

const ICONS = [JobDetailClockIcon, JobDetailChatIcon, JobDetailBuddySparkIcon];

const ProgrammePublishedDialog = ({ count, onBack, onView }) => (
  <AgencyDialogShell title={PUBLISHED.title} onClose={onBack} className="mx-auto max-w-[560px]">
    <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.2)]">
      <div className="relative h-[200px] overflow-hidden bg-[#387440]" aria-hidden="true">
        <div className="absolute top-0 left-1/2 h-[200px] w-[557px] -translate-x-1/2">
          {CONFETTI.map(([x, y, w, h, bg, rot]) => (
            <span
              key={`${x}-${y}`}
              className="absolute rounded-[2px] border border-solid border-[rgba(28,42,33,0.12)]"
              style={{
                left: x,
                top: y,
                width: w,
                height: h,
                background: bg,
                transform: `rotate(${rot}deg)`,
              }}
            />
          ))}
          <span className="absolute top-[44px] left-[calc(50%-55px)] flex size-[110px] items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-[#ffd86b] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]">
            <JobDetailTickIcon className="size-[52px] text-[#1c2a21]" />
          </span>
          <span className="absolute top-[40px] left-[356px] inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white py-[6px] pr-[12px] pl-[10px] font-sans text-[12.5px] leading-[15px] font-bold text-[#1c2a21]">
            <JobDetailSendIcon className="size-[14px]" />
            {PUBLISHED.sticker}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-[12px] px-[30px] pt-[24px] pb-[26px] max-sm:px-[16px]">
        <h2 className="m-0 text-center font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold text-[#1c2a21]">
          {PUBLISHED.title}
        </h2>
        <p className="m-0 text-center font-sans text-[15px] leading-[21px] text-[#595959]">
          {PUBLISHED.body(formatCount(count))}
        </p>
        <ul className="m-0 flex list-none flex-col gap-[4px] overflow-hidden rounded-[18px] border border-solid border-[#e1eae2] bg-[#f8f8f4] p-0">
          {PUBLISHED.next.map((text, i) => {
            const Icon = ICONS[i];
            return (
              <li
                key={text}
                className="flex items-center gap-[12px] border-0 border-t border-solid border-[#e1eae2] px-[16px] py-[12px] first:border-t-0"
              >
                <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#ebf1ec] text-[#387440]">
                  <Icon className="size-[15px]" />
                </span>
                <span className="font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
                  {text}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap gap-[10px] pt-[6px] [&>*]:flex-[1_1_180px]">
          <Button variant="tertiary" size="lg" onClick={onBack}>
            {PUBLISHED.back}
          </Button>
          <Button variant="primary" size="lg" data-autofocus="" onClick={onView}>
            {PUBLISHED.view}
          </Button>
        </div>
      </div>
    </div>
  </AgencyDialogShell>
);

export default ProgrammePublishedDialog;
