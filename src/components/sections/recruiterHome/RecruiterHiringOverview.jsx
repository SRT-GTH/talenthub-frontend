import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { HIRING_OVERVIEW } from './recruiterHomeData.js';

const log = debug('RecruiterHiringOverview');

/*
 * RecruiterHiringOverview — existing-user home: the stats card (Total Applicants / Screening / Avg. Match + sort button + bar art) next to the
 * "Next Step Recommendation" card. Figma 8080:49908 (row, 1329x173, gap 24), 8080:49909 (stats card 878x173), 8080:49927 (recommendation 427x173).
 *
 * Stats card: white, r16, 1.5px #e5e5e5 border, bottom.100 shadow, pad 20/22; "Sort by Match" is the shared tertiary Button pinned top right;
 * the three stat columns (150px each, 1px #dfdfdc dividers) sit bottom-left and the decorative bars (Figma 8121:19102: three rectangles
 * 128x32 #f3f8f4, 128x48 #a7f4bb@50%, 128x64 #00522b@20%) bottom-right. The bars are decoration only (aria-hidden).
 */
const RecruiterHiringOverview = ({ className }) => {
  const { stats, sortLabel, nextStepRecommendation } = HIRING_OVERVIEW;
  log('render', { statCount: stats.length });

  return (
    <div
      className={classNames(
        'grid w-full grid-cols-1 gap-[24px] max-lg:gap-[12px] lg:grid-cols-[878fr_427fr]',
        className
      )}
    >
      <section
        aria-label="Applicant statistics"
        className="relative flex min-w-0 flex-col justify-end gap-[24px] rounded-lg border-[1.5px] border-[#e5e5e5] bg-white px-[22px] pb-[20px] pt-[20px] shadow-bottom-100 max-lg:gap-[12px] max-sm:px-[14px] max-sm:py-[14px]"
      >
        <div className="flex justify-end">
          <Button
            variant="tertiary"
            size="xs"
            onClick={() => log('branch', { action: 'sort-by-match', wired: false })}
            className="h-[42px] rounded-[14px]! px-[16px]! py-0! text-[16px]! max-sm:h-[36px] max-sm:text-[14px]!"
          >
            {sortLabel}
          </Button>
        </div>

        <div className="flex items-end justify-between gap-[24px]">
          <dl className="flex min-w-0 flex-wrap items-stretch gap-x-[8.5px] gap-y-[8px]">
            {stats.map((stat, index) => (
              <div key={stat.id} className="flex items-stretch gap-[8.5px]">
                {index > 0 && <span aria-hidden="true" className="w-px bg-[#dfdfdc]" />}
                <div className="flex w-max min-w-[150px] flex-col items-center gap-[6.59px] px-[16px] pt-[3px] max-sm:w-[96px] max-sm:px-[4px]">
                  <dt className="whitespace-nowrap text-[16px] leading-6 tracking-[0.2px] text-[#999999] max-sm:text-[13px] max-sm:leading-5">
                    {stat.label}
                  </dt>
                  <dd
                    className="font-heading text-[23px] font-semibold leading-[29px]"
                    style={{ color: stat.valueColor }}
                  >
                    {stat.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <div aria-hidden="true" className="relative hidden h-[64px] w-[266px] shrink-0 md:block">
            <span className="absolute bottom-0 left-0 h-[32px] w-[128px] bg-[#f3f8f4]" />
            <span className="absolute bottom-0 left-[32px] h-[48px] w-[128px] bg-[#a7f4bb]/50" />
            <span className="absolute bottom-0 left-[138px] h-[64px] w-[128px] bg-[#00522b]/20" />
          </div>
        </div>
      </section>

      <section
        aria-label={nextStepRecommendation.label}
        className="flex min-w-0 flex-col gap-[12px] rounded-lg border border-[#00522b] bg-[#1f6b3f] px-[22px] pb-[22px] pt-[21px] max-sm:px-[14px] max-sm:py-[14px]"
      >
        <p className="text-[14px] font-medium leading-[15px] tracking-[0.44px] text-[#9de9b2]">
          {nextStepRecommendation.label}
        </p>
        <div className="flex flex-col gap-[8px]">
          <h2 className="font-heading text-[20px] font-semibold leading-6 text-white">
            {nextStepRecommendation.title}
          </h2>
          <p className="text-[16px] font-medium leading-[22px] text-[#84d09b] max-sm:text-[14px]">
            {nextStepRecommendation.description}
          </p>
        </div>
      </section>
    </div>
  );
};

export default RecruiterHiringOverview;
