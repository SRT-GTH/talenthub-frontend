import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import careerBuddyTile from '../../../assets/talent-home/career-buddy-robot.png';
import { CARD_SOFT, Chip, CtaButton } from './coreUi.jsx';
import HomeColumns from './HomeColumns.jsx';
import { BUDDY_INTRO, CORE_CONTENT } from './talentHomeCoreData.js';

const log = debug('CareerBuddyIntroCard');

/*
 * Day 1: the "Meet Career Buddy" intro card (HM-01, left of the quests row).
 * Other states: the page puts this slot in a 2-column grid, so for Discoverable / Complete / Top
 * Talent this component renders the whole two-column body (matches + applications | buddy,
 * streak, readiness, recruiters) spanning both grid columns, and FirstQuestsCard renders nothing.
 */
const CareerBuddyIntroCard = ({ home }) => {
  const navigate = useNavigate();
  log('render', { state: home.stateKey });

  if (home.stateKey !== 'day1') {
    return (
      <div className="min-w-0 lg:col-span-2">
        <HomeColumns home={home} content={home.content ?? CORE_CONTENT[home.stateKey]} />
      </div>
    );
  }

  return (
    <section
      aria-label={BUDDY_INTRO.title}
      className={classNames(
        'flex min-w-0 flex-col gap-[14px] rounded-[24px] bg-white p-[clamp(14px,1.6vw,22px)]',
        CARD_SOFT
      )}
    >
      <div className="flex items-center gap-[14px]">
        <span className="relative size-[56px] shrink-0 overflow-hidden rounded-full bg-[#ebf1ec]">
          <span className="absolute inset-[2px] overflow-hidden">
            <img
              src={careerBuddyTile}
              alt=""
              draggable="false"
              className="absolute top-[-12.75%] left-[-9.93%] h-[117.89%] w-[129.76%] max-w-none"
            />
          </span>
        </span>
        <span className="flex min-w-0 flex-col gap-[2px] leading-[normal]">
          <h2 className="text-[17px] font-semibold text-[#1c2a21]">{BUDDY_INTRO.title}</h2>
          <p className="text-[13px] text-[#595959]">{BUDDY_INTRO.sub}</p>
        </span>
      </div>
      <p className="rounded-[16px] bg-[#f7f8f4] px-[16px] py-[14px] text-[15px] leading-[22px] text-[#1c2a21]">
        {BUDDY_INTRO.message}
      </p>
      <div className="-mx-[clamp(14px,1.6vw,22px)] flex gap-[8px] overflow-x-auto px-[clamp(14px,1.6vw,22px)] [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        {BUDDY_INTRO.chips.map((label) => (
          <Chip key={label} as="button" type="button" onClick={() => log('suggestion', label)}>
            {label}
          </Chip>
        ))}
      </div>
      <div>
        <CtaButton size="sm" onClick={() => navigate('/profile/filling/career-buddy')}>
          {BUDDY_INTRO.cta}
        </CtaButton>
      </div>
    </section>
  );
};

export default CareerBuddyIntroCard;
