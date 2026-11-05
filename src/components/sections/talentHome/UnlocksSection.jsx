import { Link } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import {
  TalentHomeArrowRightGreenSmallIcon,
  TalentHomeBadgeFireIcon,
  TalentHomeBadgeTrophyAltIcon,
  TalentHomeBadgeTrophyIcon,
  TalentHomeChipLockIcon,
  TalentHomeCommunityChatIcon,
  TalentHomeEvaluationsUsersIcon,
  TalentHomeLearningMortarboardIcon,
  TalentHomeSavedRolesHeartIcon,
  TalentHomeStarIcon,
  TalentHomeUnlockChatIcon,
  TalentHomeUnlockSearchIcon,
  TalentHomeUnlockTargetIcon,
  AddCardPersonalityLightbulbIcon,
  AddCardProfileCompletenessChartIcon,
  AddCardVerifiedSkillsShieldIcon,
} from '../../shared/assets.jsx';
import { Bar, CARD_DASHED, CARD_SOFT, Chip, HEAD, Photo } from './coreUi.jsx';
import { CORE_CONTENT, HERO, JOURNEY_COPY, UNLOCKS } from './talentHomeCoreData.js';
import { useLiveJourney } from '../engagementShell/useLiveJourney.js';
import { useLiveMoreForYou } from './useLiveMoreForYou.js';
import { PERSONALITY, SKILLS_EVIDENCE } from './talentHomeTabsData.js';
import { HomeCardChrome } from './EditHomePanel.jsx';
import { useHomeLayout } from './TabsHomeLayoutStore.js';

const log = debug('UnlocksSection');

const UNLOCK_ICON = {
  search: TalentHomeUnlockSearchIcon,
  target: TalentHomeUnlockTargetIcon,
  chat: TalentHomeUnlockChatIcon,
};

const UnlockCard = ({ card }) => {
  const Icon = UNLOCK_ICON[card.icon];
  return (
    <article
      className={classNames(
        'flex min-w-0 flex-col gap-[12px] rounded-[20px] bg-white/70 p-[clamp(14px,1.45vw,20px)]',
        CARD_DASHED
      )}
    >
      <div className="flex items-center gap-[8px]">
        <span
          aria-hidden="true"
          className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]"
        >
          <Icon className="size-[20px]" />
        </span>
        <span className="flex-1" />
        <Chip icon={<TalentHomeChipLockIcon className="size-[14px]" />}>{UNLOCKS.chipLocked}</Chip>
      </div>
      <h3 className="text-[16px] leading-[normal] font-semibold text-[#1c2a21]">{card.title}</h3>
      <p className="text-[13px] leading-[19px] text-[#595959]">{card.body}</p>
      <div className="flex items-center gap-[10px]">
        <span className="min-w-0 flex-1 lg:max-w-[300px]">
          <Bar pct={(100 * (card.progress.done ?? 1)) / card.progress.of} height={6} />
        </span>
        <span className="text-[12px] leading-[normal] font-semibold whitespace-nowrap text-[#387440]">
          {card.progress.done ?? 1} of {card.progress.of}
        </span>
      </div>
      <p className="text-[12px] leading-[normal] font-semibold text-[#785910]">{card.at}</p>
    </article>
  );
};

// ---- "More for you" (Complete / Top Talent) ----------------------------------------------------

const MoreCard = ({ icon, title, link, to, children }) => (
  <article
    className={classNames(
      'flex min-w-0 flex-col gap-[10px] rounded-[24px] bg-white p-[18px] max-lg:w-[clamp(220px,62vw,264px)] max-lg:shrink-0 max-lg:snap-start',
      CARD_SOFT
    )}
  >
    <div className="flex items-center gap-[8px]">
      <span
        aria-hidden="true"
        className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec]"
      >
        {icon}
      </span>
      <h3 className="text-[15px] leading-[normal] font-semibold text-[#1c2a21]">{title}</h3>
    </div>
    {children}
    {link && to ? (
      <Link
        to={to}
        className="mt-[2px] inline-flex w-fit items-center gap-[4px] rounded-[6px] text-[13px] leading-[normal] font-semibold text-[#387440] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        {link}
        <TalentHomeArrowRightGreenSmallIcon className="size-[14px]" />
      </Link>
    ) : link ? (
      <span className="mt-[2px] inline-flex w-fit items-center gap-[4px] text-[13px] leading-[normal] font-semibold text-[#387440]">
        {link}
        <TalentHomeArrowRightGreenSmallIcon className="size-[14px]" />
      </span>
    ) : null}
  </article>
);

const Row = ({ a, b }) => (
  <p className="flex flex-col gap-[2px] leading-[normal]">
    <span className="text-[13px] font-semibold text-[#1c2a21]">{a}</span>
    <span className="text-[12px] text-[#595959]">{b}</span>
  </p>
);

const BADGE_TILE =
  'flex size-[36px] items-center justify-center rounded-full border border-[rgba(28,42,33,0.12)] playful:border-[1.5px] playful:border-[#1c2a21]';

// live: { learning, saved, community } from useLiveMoreForYou (null = no data); demo cards are dropped when live.
const MoreForYou = ({ more, editing, live = null }) => {
  const layout = useHomeLayout();
  const demoCards = {
    'my-learning': (
      <MoreCard
        icon={<TalentHomeLearningMortarboardIcon className="size-[17px]" />}
        title={more.learning.title}
        link={more.learning.link}
      >
        <Bar pct={more.learning.pct} height={8} to="playful:to-[#84cc16]" />
        <Row a={more.learning.row[0]} b={more.learning.row[1]} />
      </MoreCard>
    ),
    'saved-roles': (
      <MoreCard
        icon={<TalentHomeSavedRolesHeartIcon className="size-[17px]" />}
        title={more.saved.title}
        link={more.saved.link}
      >
        <Chip className="w-fit">{more.saved.chip}</Chip>
        <Row a={more.saved.row[0]} b={more.saved.row[1]} />
      </MoreCard>
    ),
    evaluations: (
      <MoreCard
        icon={<TalentHomeEvaluationsUsersIcon className="size-[17px]" />}
        title={more.evaluations.title}
        link={more.evaluations.link}
      >
        {more.evaluations.rows.map((r) => (
          <Row key={r[0]} a={r[0]} b={r[1]} />
        ))}
      </MoreCard>
    ),
    community: (
      <MoreCard
        icon={<TalentHomeCommunityChatIcon className="size-[17px]" />}
        title={more.community.title}
        link={more.community.link}
      >
        <span aria-hidden="true" className="flex">
          {more.community.photos.map((src, i) => (
            <Photo key={i} src={src} size={28} className={i < 2 ? '-mr-[8px]' : ''} />
          ))}
        </span>
        <Row a={more.community.row[0]} b={more.community.row[1]} />
      </MoreCard>
    ),
    // Cards added from the Edit-home tray. Figma has no card frames for these; they reuse the
    // sibling "More for you" shell with strings/values already drawn elsewhere (hero stat,
    // MyAssessment, journey-complete card). See wiki/talent-home.md.
    'verified-skills': (
      <MoreCard
        icon={<AddCardVerifiedSkillsShieldIcon className="size-[17px]" />}
        title={HERO.complete.stats[3].label}
        link={SKILLS_EVIDENCE.manage}
      >
        <Row a={SKILLS_EVIDENCE.count} b={HERO.complete.stats[3].note} />
      </MoreCard>
    ),
    personality: (
      <MoreCard
        icon={<AddCardPersonalityLightbulbIcon className="size-[17px]" />}
        title={PERSONALITY.title}
      >
        <Chip tone="green" className="w-fit">
          {PERSONALITY.status}
        </Chip>
        <Row a={`${PERSONALITY.lead}${PERSONALITY.type}`} b={PERSONALITY.sub} />
      </MoreCard>
    ),
    'profile-completeness': (
      <MoreCard
        icon={<AddCardProfileCompletenessChartIcon className="size-[17px]" />}
        title={layout.cards.find((c) => c.id === 'profile-completeness').label}
      >
        <Bar pct={100} height={8} to="playful:to-[#84cc16]" />
        <Row
          a={JOURNEY_COPY.complete.sticker}
          b={JOURNEY_COPY.complete.title.map(([t]) => t).join('')}
        />
      </MoreCard>
    ),
    badges: (
      <MoreCard
        icon={<TalentHomeBadgeTrophyAltIcon className="size-[17px]" />}
        title={more.badges.title}
        link={more.badges.link}
      >
        <span aria-hidden="true" className="flex gap-[6px]">
          <span className={classNames(BADGE_TILE, 'bg-[#ffd86b]')}>
            <TalentHomeBadgeTrophyIcon className="size-[18px]" />
          </span>
          <span className={classNames(BADGE_TILE, 'bg-[#ebf1ec]')}>
            <TalentHomeStarIcon className="size-[18px]" />
          </span>
          <span className={classNames(BADGE_TILE, 'bg-[#fff1e6]')}>
            <TalentHomeBadgeFireIcon className="size-[18px]" />
          </span>
        </span>
        {more.badges.rows.map((r) => (
          <Row key={r[0]} a={r[0]} b={r[1]} />
        ))}
      </MoreCard>
    ),
  };
  const cards = live
    ? {
        'my-learning': live.learning ? (
          <MoreCard
            icon={<TalentHomeLearningMortarboardIcon className="size-[17px]" />}
            title={live.learning.title}
            link={live.learning.link}
            to={live.learning.to}
          >
            <Bar pct={live.learning.pct} height={8} to="playful:to-[#84cc16]" />
            <Row a={live.learning.row[0]} b={live.learning.row[1]} />
          </MoreCard>
        ) : null,
        'saved-roles': live.saved ? (
          <MoreCard
            icon={<TalentHomeSavedRolesHeartIcon className="size-[17px]" />}
            title={live.saved.title}
            link={live.saved.link}
            to={live.saved.to}
          >
            {live.saved.chip ? <Chip className="w-fit">{live.saved.chip}</Chip> : null}
            <Row a={live.saved.row[0]} b={live.saved.row[1]} />
          </MoreCard>
        ) : null,
        community: live.community ? (
          <MoreCard
            icon={<TalentHomeCommunityChatIcon className="size-[17px]" />}
            title={live.community.title}
            link={live.community.link}
            to={live.community.to}
          >
            <Row a={live.community.row[0]} b={live.community.row[1]} />
          </MoreCard>
        ) : null,
        'profile-completeness': demoCards['profile-completeness'],
      }
    : demoCards;
  return (
    <section
      aria-label="More for you"
      className="flex flex-col gap-[12px] lg:gap-[24px] lg:playful:gap-[12px]"
    >
      <div className="flex items-center gap-[10px] px-[4px] pt-[8px]">
        <h2 className={classNames(HEAD, 'text-[clamp(20px,1.45vw,25px)] leading-[1.2]')}>
          {more.title.map(([text, accent], i) => (
            <span key={i} className={accent ? 'text-[#387440]' : 'text-[#1c2a21]'}>
              {text}
            </span>
          ))}
        </h2>
        <span aria-hidden="true" className="hidden h-px flex-1 bg-[#e7e7e7] lg:block" />
        <p className="text-[13px] leading-[normal] font-medium text-[#595959] max-sm:hidden max-lg:ml-auto">
          {more.hint}
        </p>
      </div>
      <div className="-mx-[clamp(12px,1.4vw,24px)] overflow-x-auto px-[clamp(12px,1.4vw,24px)] pb-[2px] [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex items-start gap-[16px] max-lg:snap-x lg:grid lg:grid-cols-5">
          {layout.onPage
            .filter((c) => cards[c.id])
            .map((c) => (
              <HomeCardChrome key={c.id} id={c.id} editing={editing}>
                {cards[c.id]}
              </HomeCardChrome>
            ))}
        </div>
      </div>
    </section>
  );
};

/*
 * The unlock cards for the signed-in talent's journey: milestone thresholds follow its stage count (7 for JHS), JHS
 * talents unlock learning rather than roles, and under-18s are told recruiter messages need a linked parent.
 */
const unlockCardsFor = (journey) => {
  if (!journey?.total) return UNLOCKS.cards;
  const t = journey.total;
  const at = [Math.round(t / 3), Math.round((t * 2) / 3), t];
  const names = ['Discoverable', 'Top 20%', 'Top Talent'];
  return UNLOCKS.cards.map((card, i) => {
    const out = {
      ...card,
      progress: { of: at[i], done: Math.min(journey.doneCount || 0, at[i]) },
      at: `Unlocks at ${names[i]} · ${at[i]} of ${t}`,
    };
    if (journey.jhs && card.id === 'roles') {
      out.title = 'Learning matched to you';
      out.body = 'See training and scholarships picked for your interests.';
    }
    if (journey.isMinor && card.id === 'recruiters') {
      out.body = 'Verified recruiters can reach you once a parent or guardian links your account.';
    }
    return out;
  });
};

// Day 1: "What you unlock as you go". Discoverable: nothing. Complete / Top Talent: "More for you".
const UnlocksSection = ({ home }) => {
  const journey = useLiveJourney();
  const liveMore = useLiveMoreForYou(
    Boolean(home.live) && (home.stateKey === 'complete' || home.stateKey === 'top')
  );
  log('render', { state: home.stateKey });
  if (home.stateKey === 'complete' || home.stateKey === 'top') {
    if (home.live && !liveMore) return null;
    return (
      <MoreForYou
        more={CORE_CONTENT[home.stateKey].more}
        editing={home.editOpen}
        live={home.live ? liveMore : null}
      />
    );
  }
  if (home.stateKey !== 'day1') return null;
  return (
    <section aria-label="What you unlock as you go" className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[4px] px-[4px] pt-[8px]">
        <h2 className={classNames(HEAD, 'text-[clamp(22px,1.6vw,27px)] leading-[1.2]')}>
          {UNLOCKS.title.map(([text, accent], i) => (
            <span key={i} className={accent ? 'text-[#387440]' : 'text-[#1c2a21]'}>
              {text}
            </span>
          ))}
        </h2>
        <p className="text-[14px] leading-[normal] text-[#595959]">{UNLOCKS.sub}</p>
      </div>
      <div className="-mx-[clamp(12px,1.4vw,24px)] overflow-x-auto px-[clamp(12px,1.4vw,24px)] [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-[16px] max-lg:snap-x lg:grid lg:grid-cols-3 [&>*]:max-lg:w-[clamp(240px,70vw,448px)] [&>*]:max-lg:shrink-0 [&>*]:max-lg:snap-start">
          {(home.live ? unlockCardsFor(journey) : UNLOCKS.cards).map((card) => (
            <UnlockCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UnlocksSection;
