import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { ProfileGhanaFlagIcon, ProfileVerifiedCheckIcon } from '../../../shared/assets.jsx';
import kofiPhoto from '../../../../assets/institution/progress/student-kofi-danso-photo.png';
import { DISPLAY } from '../../talentHome/TabsParts.jsx';
import { INSTITUTION_BASE } from '../institutionNav.js';
import { ProfileChip, Tag } from '../../talentProfile/ProfileTabsUi.jsx';
import { SHELF } from '../../talentProfile/profileTabsStyles.js';

/*
 * ProgressStudentHero — the hero card of the student detail (Figma 8595:673, 1329x322, r24): green cover 150 high with the "Open to scholarships" sticker,
 * 132px avatar (photo for Kofi, monogram otherwise), name 37 + Verified pill, "he/him · joined …", headline + Ghana flag, preference chips, the actions
 * (Flag for coaching · Message <first>) with the "Your actions" sticker and the three stats. Same geometry as the talent profile hero (Theme 11 reuses it).
 * Props: detail, initials, photo (bool), flagged, onFlag().
 */

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const Stat = ({ value, label }) => (
  <div className="flex flex-col items-end">
    <span className="font-sans text-[clamp(20px,1.33vw,23px)] leading-[1.25] font-semibold text-[#1c2a21]">
      {value}
    </span>
    <span className="font-sans text-[11px] leading-[normal] font-medium whitespace-nowrap text-[#737373] max-lg:text-[12px]">
      {label}
    </span>
  </div>
);

const ProgressStudentHero = ({ detail, initials, photo, flagged, onFlag }) => (
  <div className="@container">
    <section
      aria-label="Student header"
      className={classNames('relative overflow-hidden rounded-[24px] bg-white', SHELF)}
      style={{ '--av': 'clamp(84px, 7.64vw, 132px)' }}
    >
      <div className="relative -mx-px -mt-px h-[clamp(112px,8.68vw,150px)] overflow-hidden bg-[#387440]">
        {detail.sticker ? (
          <Tag
            size={13}
            className="absolute top-[clamp(12px,1.39vw,24px)] left-[clamp(12px,1.85vw,32px)] z-10"
          >
            {detail.sticker}
          </Tag>
        ) : null}
      </div>
      <div className="flex flex-col px-[clamp(12px,1.85vw,32px)] pb-[clamp(16px,1.56vw,27px)] @5xl:flex-row @5xl:items-start">
        <div className="flex min-w-0 flex-col gap-x-[clamp(12px,1.4vw,24px)] @2xl:flex-row @5xl:flex-1">
          <div
            className={classNames(
              'relative -mt-[calc(var(--av)/2)] size-[var(--av)] shrink-0 rounded-full bg-white',
              SHELF
            )}
          >
            <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
              <span className="relative flex size-[89.4%] items-center justify-center overflow-hidden rounded-full bg-[#387440] font-sans text-[32px] font-semibold text-white">
                {photo ? (
                  <img src={kofiPhoto} alt="" className="absolute inset-0 size-full object-cover" />
                ) : (
                  initials
                )}
              </span>
            </span>
          </div>
          <div className="mt-[10px] flex min-w-0 flex-1 flex-col gap-[6px]">
            <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[4px]">
              <h1
                className={classNames(
                  DISPLAY,
                  'm-0 text-[clamp(26px,2.14vw,37px)] leading-[1.2] font-semibold whitespace-nowrap text-[#1c2a21]'
                )}
              >
                {detail.name}
              </h1>
              <span className="inline-flex items-center gap-[4px] rounded-full bg-[#ebf1ec] py-[4px] pr-[9px] pl-[7px] font-sans text-[12px] leading-[normal] font-semibold whitespace-nowrap text-[#2d5d33]">
                <ProfileVerifiedCheckIcon className="size-[13px]" />
                {detail.verified}
              </span>
            </div>
            {detail.handle ? (
              <p className="m-0 font-sans text-[13px] leading-[normal] text-[#737373]">
                {detail.handle}
              </p>
            ) : null}
            <p className="m-0 flex items-center gap-[6px] font-sans text-[16px] leading-[normal] font-medium text-[#1c2a21]">
              <span>{detail.headline}</span>
              <ProfileGhanaFlagIcon className="size-[18px] shrink-0" />
            </p>
            {detail.chips.length ? (
              <div className="flex flex-wrap gap-[8px] pt-[6px]">
                {detail.chips.map((c) => (
                  <ProfileChip key={c.label} tone={c.tone} icon={c.icon}>
                    {c.label}
                  </ProfileChip>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-[16px] flex flex-wrap items-center justify-between gap-x-[22px] gap-y-[14px] @5xl:mt-[18px] @5xl:ml-[24px] @5xl:flex-col @5xl:items-end @5xl:justify-start @5xl:gap-[28px]">
          <div className="flex flex-wrap items-center gap-[10px] pb-[4px]">
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              disabled={flagged}
              onClick={onFlag}
              className={FOCUS}
            >
              {flagged ? 'Flagged' : 'Flag for coaching'}
            </Button>
            <Link
              to={`${INSTITUTION_BASE}/messages/new`}
              className="inline-flex items-center justify-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] py-[12px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-white no-underline shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              Message {detail.first}
            </Link>
          </div>
          <div className="flex items-center gap-[22px]">
            {detail.stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>
      <Tag
        tone="white"
        className="absolute top-[calc(clamp(112px,8.68vw,150px)-25px)] right-[clamp(12px,3.1%,41px)] z-10 hidden @5xl:inline-flex"
      >
        Your actions
      </Tag>
    </section>
  </div>
);

export default ProgressStudentHero;
