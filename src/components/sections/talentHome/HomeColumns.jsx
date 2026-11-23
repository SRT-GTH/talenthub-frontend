import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveJob, unsaveJob } from '../../../services/talentJobs.api.js';
import { isLoggedIn } from '../../../services/auth.api.js';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import careerBuddyTile from '../../../assets/talent-home/career-buddy-robot.png';
import {
  TalentHomeActivityCheckCircleIcon,
  TalentHomeApplicationsSuitcaseIcon,
  TalentHomeArrowRightGreenIcon,
  TalentHomeCardTargetIcon,
  TalentHomeChipLockIcon,
  TalentHomeClockIcon,
  TalentHomeEyeGreenIcon,
  TalentHomeIndustryAgritechIcon,
  TalentHomeIndustryAgritechSmallIcon,
  TalentHomeIndustryFintechGreenIcon,
  TalentHomeIndustryFintechSmallIcon,
  TalentHomeIndustryFintechWhiteIcon,
  TalentHomeIndustryHealthIcon,
  TalentHomeIndustryTelecomIcon,
  TalentHomeJobReadinessLockIcon,
  TalentHomeMatchHeartIcon,
  SavedHeartIcon,
  TalentHomeNoteInfoIcon,
  TalentHomePrivacyLockIcon,
  TalentHomeSpotJobsIllustration,
  TalentHomeStarIcon,
  TalentHomeStreakDayCheckIcon,
  TalentHomeStreakFireIcon,
} from '../../shared/assets.jsx';
import {
  Bar,
  CARD_DASHED,
  CARD_INK,
  CARD_SOFT,
  Chip,
  CtaButton,
  DualPill,
  HEAD,
  LinkLabel,
  Photo,
  Points,
  Sticker,
} from './coreUi.jsx';
import { COMPANIES } from './talentHomeCoreData.js';
import { HomeCardChrome } from './EditHomePanel.jsx';
import { useHomeLayout } from './TabsHomeLayoutStore.js';
import { CardSkeleton, ShimmerStyle } from './TalentHomeStates.jsx';
import CircleButton from '../talentCommunity/circle/CircleButton.jsx';
import { CircleUsersIcon } from '../talentCommunity/circle/circleIcons.jsx';
// The home card's own Figma photos (the My circle exports crop and name these people differently).
import crewAbenaPhoto from '../../../assets/talent-home/home/crew-suggestion-abena-owusu.png';
import crewYawPhoto from '../../../assets/talent-home/home/crew-suggestion-yaw-darko.png';
import crewEfuaPhoto from '../../../assets/talent-home/home/crew-suggestion-efua-asante.png';
import crewEsiFace from '../../../assets/talent-home/home/crew-invite-esi-quaye.png';
import crewNanaYawFace from '../../../assets/talent-home/home/crew-invite-nana-yaw-mensah.png';

const log = debug('HomeColumns');

// Destinations on /job-postings (see talentJobsState.js): `?job=<id>` opens the posting, and
// `&apply=preview` opens the same apply preview the jobs page uses (the talent still confirms there).
// A demo card id the jobs feed doesn't know falls back to the list (JobDetailScreen).
const JOBS_ROUTE = '/job-postings';
const jobRoute = (id, apply) =>
  `${JOBS_ROUTE}?job=${encodeURIComponent(id)}${apply ? '&apply=preview' : ''}`;
const useGo = () => {
  const navigate = useNavigate();
  return (to, why) => {
    log('go', why, '->', to);
    navigate(to);
  };
};

const INDUSTRY_ICON = {
  fintechWhite: TalentHomeIndustryFintechWhiteIcon,
  fintechGreen: TalentHomeIndustryFintechGreenIcon,
  fintechSmall: TalentHomeIndustryFintechSmallIcon,
  agritech: TalentHomeIndustryAgritechIcon,
  agritechSmall: TalentHomeIndustryAgritechSmallIcon,
  health: TalentHomeIndustryHealthIcon,
  telecom: TalentHomeIndustryTelecomIcon,
};

const CompanyTile = ({ company, initials, size = 44, radius = 12 }) => {
  const c = COMPANIES[company];
  // Real organisations have no Figma tile: show their initials instead.
  if (!c) {
    return (
      <span
        aria-hidden="true"
        className="flex shrink-0 items-center justify-center bg-[#ebf1ec] text-[14px] font-bold text-[#387440]"
        style={{ width: size, height: size, borderRadius: radius }}
      >
        {initials || '•'}
      </span>
    );
  }
  const Icon = INDUSTRY_ICON[c.icon];
  return (
    <span
      aria-hidden="true"
      className={classNames('flex shrink-0 items-center justify-center', c.bg)}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <Icon />
    </span>
  );
};

const CARD_PAD = 'p-[clamp(14px,1.4vw,24px)]';

// Card header: [tile] title ... [link]
const CardHead = ({ tile, title, link, onLink, trailing, h2 = 'text-[17px]' }) => (
  <div className="flex items-center gap-[10px]">
    {tile ? (
      <span
        aria-hidden="true"
        className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec]"
      >
        {tile}
      </span>
    ) : null}
    <h2 className={classNames('min-w-0 leading-[normal] font-semibold text-[#1c2a21]', h2)}>
      {title}
    </h2>
    <span className="flex-1" />
    {link ? (
      <LinkLabel Icon={TalentHomeArrowRightGreenIcon} onClick={onLink}>
        {link}
      </LinkLabel>
    ) : null}
    {trailing}
  </div>
);

const SectionTitle = ({ parts }) => (
  <h2 className={classNames(HEAD, 'text-[clamp(18px,1.3vw,22px)] leading-[1.25]')}>
    {parts.map(([text, accent], i) => (
      <span key={i} className={accent ? 'text-[#387440]' : 'text-[#1c2a21]'}>
        {text}
      </span>
    ))}
  </h2>
);

// ---- Match cards -------------------------------------------------------------------------

/*
 * Save (heart) on a match card. Signed in with a live card: saves / unsaves through the same bookmarks API as
 * Opportunities (the role then shows under Opportunities › Saved). Demo: toggles on the card only.
 * Saved: the green heart on a light green circle (no saved state is drawn; there is no filled heart icon).
 */
const SaveHeart = ({ card }) => {
  const [saved, setSaved] = useState(Boolean(card.saved));
  const [bookmarkId, setBookmarkId] = useState(card.bookmarkId ?? null);
  const [busy, setBusy] = useState(false);
  const toggle = async () => {
    if (busy) return;
    const next = !saved;
    log('save toggle', { id: card.id, next, live: Boolean(card.live) });
    setSaved(next);
    if (!card.live || !isLoggedIn()) return;
    setBusy(true);
    try {
      if (next) {
        const res = await saveJob({ id: card.id, title: card.title });
        setBookmarkId(res?._id ?? res?.id ?? null);
      } else if (bookmarkId) {
        await unsaveJob(bookmarkId);
        setBookmarkId(null);
      }
    } catch (err) {
      log.error('save failed, rolling back', err?.response?.status);
      setSaved(!next);
    } finally {
      setBusy(false);
    }
  };
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${card.title} from saved` : `Save ${card.title}`}
      onClick={toggle}
      className={classNames(
        '-m-[6px] flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 p-0 transition-[background-color,transform] duration-150 active:scale-90 focus-visible:outline-2 focus-visible:outline-brand-green',
        saved ? 'bg-[#e2f1e4]' : 'bg-transparent hover:bg-[#f1f1ee]'
      )}
    >
      {saved ? (
        <SavedHeartIcon className="size-[18px]" />
      ) : (
        <TalentHomeMatchHeartIcon className="size-[18px]" />
      )}
    </button>
  );
};

const MatchCard = ({ card, variant, viewRole, onGate }) => {
  const go = useGo();
  const label = card.cta ?? viewRole.viewRole;
  const quickApply = card.cta === 'Quick apply';
  const open = () => {
    // Not Discoverable yet: applying opens the NU-03 gate instead (recruiters can't see the profile).
    if (quickApply && onGate) return onGate(card);
    return go(jobRoute(card.id, quickApply), quickApply ? 'quick apply' : 'view role');
  };
  const complete = variant === 'complete';
  const featured = card.featured;
  return (
    <article
      className={classNames(
        'relative flex min-w-0 flex-col rounded-[20px] p-[18px]',
        complete ? 'gap-[12px]' : 'gap-[10px]',
        featured ? classNames('bg-[#f5f9f5]', CARD_INK) : 'border border-[#e7e7e7] bg-white'
      )}
    >
      <div className="flex items-center gap-[10px]">
        <CompanyTile company={card.company} initials={card.initials} />
        <span className="flex-1" />
        {complete ? (
          <>
            <span className="flex flex-col items-end leading-[normal]">
              <span className={classNames(HEAD, 'text-[27px] leading-[1.2] text-[#387440]')}>
                {card.score}
              </span>
              <span className="text-[12px] font-medium text-[#595959]">{card.scoreLabel}</span>
            </span>
            <SaveHeart card={card} />
          </>
        ) : (
          <Chip
            icon={<TalentHomeChipLockIcon className="size-[14px]" />}
            className="max-[400px]:px-[10px] max-[400px]:text-[12px]"
          >
            {viewRole.fitChip}
          </Chip>
        )}
      </div>
      <h3 className="text-[16px] leading-[normal] font-semibold text-[#1c2a21]">{card.title}</h3>
      <p className="text-[13px] leading-[normal] text-[#595959]">{card.meta}</p>
      <div className="flex flex-wrap gap-[6px]">
        <DualPill focused="green" playful="green">
          {card.salary}
        </DualPill>
        {card.extra ? (
          <DualPill focused={card.extra.focused} playful={card.extra.playful}>
            {card.extra.text}
          </DualPill>
        ) : null}
      </div>
      {featured ? (
        <CtaButton size="sm" className="w-full" onClick={open}>
          {label}
        </CtaButton>
      ) : (
        <Button variant="tertiary-subtle" size="lg" className="w-full lg:py-[14px]!" onClick={open}>
          {label}
        </Button>
      )}
      {card.sticker ? (
        <Sticker className="top-[-14px] right-[8px]" rotate="-rotate-6">
          {card.sticker}
        </Sticker>
      ) : null}
    </article>
  );
};

const MatchesCard = ({ data, variant, onGate }) => {
  const go = useGo();
  return (
    <section
      aria-label="Matched roles"
      className={classNames(
        'flex flex-col gap-[16px] rounded-[24px] bg-white',
        CARD_PAD,
        CARD_SOFT
      )}
    >
      <div className="flex items-center gap-[10px]">
        <SectionTitle parts={data.title} />
        <span className="flex-1" />
        {data.link ? (
          <LinkLabel Icon={TalentHomeArrowRightGreenIcon} onClick={() => go(JOBS_ROUTE, 'see all')}>
            {data.link}
          </LinkLabel>
        ) : null}
      </div>
      {data.note ? (
        <p className="flex items-start gap-[10px] rounded-[14px] bg-[#faf4e8] px-[14px] py-[12px] text-[13px] leading-[18px] font-medium text-[#1c2a21]">
          <TalentHomeNoteInfoIcon className="mt-px size-[16px] shrink-0" />
          {data.note}
        </p>
      ) : (
        <p className="text-[14px] leading-[20px] text-[#595959]">{data.sub}</p>
      )}
      {/* Phones: ~2.5 cards in a snap row; lg: three equal columns. */}
      <div className="-mx-[clamp(14px,1.4vw,24px)] overflow-x-auto px-[clamp(14px,1.4vw,24px)] pt-[14px] pb-[2px] [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-[16px] max-lg:snap-x max-lg:snap-mandatory lg:grid lg:grid-cols-3 [&>*]:max-lg:w-[clamp(210px,40vw,277px)] [&>*]:max-lg:shrink-0 [&>*]:max-lg:snap-start">
          {data.cards.map((card) => (
            <MatchCard
              key={card.id}
              card={card}
              variant={variant}
              viewRole={{ fitChip: data.fitChip, viewRole: data.viewRole ?? 'View role' }}
              onGate={onGate}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ---- Applications --------------------------------------------------------------------------

const STEP = { done: 'bg-[#387440]', now: 'bg-[#c8951a]', todo: 'bg-[#e2e5dd]' };

const ApplicationsList = ({ data }) => {
  const go = useGo();
  return (
    <section
      aria-label="My applications"
      className={classNames(
        'flex flex-col gap-[12px] rounded-[24px] bg-white',
        CARD_PAD,
        CARD_SOFT
      )}
    >
      <CardHead
        tile={<TalentHomeApplicationsSuitcaseIcon className="size-[17px]" />}
        title={data.title}
        link={data.link}
        onLink={() => go(`${JOBS_ROUTE}?tab=applied`, 'full tracker')}
      />
      <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
        {data.items.map((item) => (
          <li
            key={item.id}
            className={classNames(
              'relative flex flex-wrap items-center gap-x-[14px] gap-y-[10px] rounded-[16px] p-[14px]',
              item.featured
                ? classNames('bg-[#f5f9f5]', CARD_INK)
                : 'border border-[#e7e7e7] bg-white'
            )}
          >
            <CompanyTile company={item.company} initials={item.initials} size={40} />
            <span className="flex min-w-[140px] flex-1 flex-col gap-[2px]">
              <span className="text-[15px] leading-[normal] font-semibold text-[#1c2a21]">
                {item.title}
              </span>
              <span className="text-[13px] leading-[normal] text-[#595959]">{item.meta}</span>
            </span>
            <span aria-hidden="true" className="flex gap-[4px]">
              {item.steps.map((s, i) => (
                <span key={i} className={classNames('h-[6px] w-[28px] rounded-[3px]', STEP[s])} />
              ))}
            </span>
            <Chip tone={item.chip.tone}>{item.chip.text}</Chip>
            {item.sticker ? (
              <Sticker
                className="top-[-13px] right-[40%]"
                color="bg-[#84cc16]"
                rotate="rotate-[5deg]"
              >
                {item.sticker}
              </Sticker>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
};

const ApplicationsEmpty = ({ data }) => {
  const go = useGo();
  return (
    <section
      aria-label="My applications"
      className={classNames(
        'flex flex-col gap-[14px] rounded-[24px] bg-white',
        CARD_PAD,
        CARD_SOFT
      )}
    >
      <CardHead
        tile={<TalentHomeApplicationsSuitcaseIcon className="size-[17px]" />}
        title={data.title}
      />
      <div
        className={classNames(
          'flex flex-col items-center gap-[20px] rounded-[18px] bg-[#f7f8f4] p-[20px] sm:flex-row',
          CARD_DASHED
        )}
      >
        <TalentHomeSpotJobsIllustration className="size-[104px] shrink-0" />
        <div className="flex min-w-0 flex-col gap-[6px] max-sm:items-center max-sm:text-center">
          <h3 className="text-[17px] leading-[normal] font-semibold text-[#1c2a21]">
            {data.emptyTitle}
          </h3>
          <p className="max-w-[560px] text-[14px] leading-[20px] text-[#595959]">
            {data.emptyBody}
          </p>
          <div className="mt-[6px]">
            <CtaButton size="sm" onClick={() => go(JOBS_ROUTE, 'browse roles')}>
              {data.cta}
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---- Recent activity -----------------------------------------------------------------------

// Demo frames only: live activity has no "See all" (talentHomeLive.js sets link: null).
const ActivityCard = ({ data }) => {
  const go = useGo();
  return (
    <section
      aria-label="Recent activity"
      className={classNames('flex flex-col gap-[4px] rounded-[24px] bg-white', CARD_PAD, CARD_SOFT)}
    >
      <CardHead
        tile={<TalentHomeClockIcon className="size-[17px]" />}
        title={data.title}
        link={data.link}
        onLink={() => go('/notifications', 'activity see all')}
      />
      {data.rows.length === 0 ? (
        <p className="mt-[8px] text-[14px] leading-[20px] text-[#595959]">
          Nothing yet. Updates on your applications and profile show up here.
        </p>
      ) : null}
      <ul className="m-0 mt-[8px] flex list-none flex-col p-0">
        {data.rows.map((row, i) => (
          <li
            key={i}
            className={classNames(
              'flex items-center gap-[12px] py-[12px]',
              i < data.rows.length - 1 && 'border-b border-[#e7e7e7]'
            )}
          >
            {row.kind === 'photo' ? (
              <Photo src={row.photo} size={36} />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#ebf1ec]"
              >
                {row.kind === 'check' ? (
                  <TalentHomeActivityCheckCircleIcon className="size-[18px]" />
                ) : (
                  <TalentHomeStarIcon className="size-[18px]" />
                )}
              </span>
            )}
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span className="text-[14px] leading-[normal] font-medium text-[#1c2a21]">
                {row.text}
              </span>
              <span className="text-[12px] leading-[normal] text-[#595959]">{row.when}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

// ---- Right column --------------------------------------------------------------------------

const BuddyCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <section
      aria-label="Career Buddy"
      className={classNames(
        'relative flex flex-col gap-[14px] rounded-[24px] bg-gradient-to-r from-[#2e6436] to-[#387440] p-[clamp(14px,1.3vw,22px)]',
        CARD_INK
      )}
    >
      <div className="flex items-center gap-[12px]">
        <span className="relative size-[48px] shrink-0 overflow-hidden rounded-full bg-white">
          <img
            src={careerBuddyTile}
            alt=""
            draggable="false"
            className="absolute top-[-12.75%] left-[-9.93%] h-[117.89%] w-[129.76%] max-w-none"
            style={{ transform: 'scale(0.846)', transformOrigin: 'center' }}
          />
        </span>
        <span className="flex flex-col gap-[2px] leading-[normal] text-white">
          <span className="text-[16px] font-semibold">{data.title}</span>
          <span className="text-[12px] font-medium">{data.sub}</span>
        </span>
      </div>
      <div className="flex flex-col gap-[8px] rounded-[18px] bg-white p-[16px]">
        <p className="text-[12px] leading-[normal] font-bold tracking-[1.2px] text-[#387440]">
          {data.label}
        </p>
        <p className="text-[15px] leading-[22px] text-[#1c2a21]">{data.message}</p>
      </div>
      <CtaButton
        size="lg"
        className="w-full"
        onClick={() =>
          navigate('/profile/filling/career-buddy', {
            // 2026-10-21: the CTA's request goes to Career Buddy as the talent's message.
            state: data.prompt
              ? { prompt: data.prompt, chipAction: data.chipAction || null }
              : null,
          })
        }
      >
        {data.cta}
      </CtaButton>
      {data.sticker ? (
        <Sticker className="top-[-19px] right-[22px]" rotate="-rotate-6">
          {data.sticker}
        </Sticker>
      ) : null}
    </section>
  );
};

const DAY_BASE = 'flex size-[36px] items-center justify-center rounded-full';
const DayTile = ({ status }) => {
  if (status === 'done')
    return (
      <span
        className={classNames(
          DAY_BASE,
          'border border-[rgba(28,42,33,0.12)] bg-[#f59638] playful:border-[1.5px] playful:border-[#1c2a21]'
        )}
      >
        <TalentHomeStreakDayCheckIcon className="size-[14px]" />
      </span>
    );
  if (status === 'today')
    return (
      <span className={classNames(DAY_BASE, 'border-2 border-dashed border-[#f59638] bg-white')} />
    );
  return <span className={classNames(DAY_BASE, 'border border-[#e7e7e7] bg-white')} />;
};

const StreakCard = ({ data }) => (
  <section
    aria-label="Streak"
    className={classNames(
      'flex flex-col gap-[14px] rounded-[24px] bg-white p-[clamp(14px,1.3vw,22px)]',
      CARD_INK
    )}
  >
    <div className="flex items-center gap-[12px]">
      <span
        aria-hidden="true"
        className="flex size-[48px] shrink-0 items-center justify-center rounded-[14px] bg-[#fff1e6]"
      >
        <TalentHomeStreakFireIcon className="size-[28px]" />
      </span>
      <span className="flex min-w-0 flex-col gap-[4px]">
        <span
          className={classNames(
            HEAD,
            'text-[clamp(18px,1.2vw,21px)] leading-[1.25] text-[#1c2a21]'
          )}
        >
          {data.title}
        </span>
        <span className="text-[13px] leading-[normal] text-[#595959]">{data.sub}</span>
        <span className="inline-flex w-fit items-center rounded-full border border-[#c1d4c4] bg-[#ebf1ec] px-[8px] py-[3px] text-[12px] leading-[normal] font-semibold text-[#387440]">
          {data.freeze}
        </span>
      </span>
    </div>
    <ol className="m-0 flex list-none justify-between gap-[6px] p-0">
      {data.days.map((d, i) => (
        <li key={i} className="flex flex-col items-center gap-[4px]">
          <DayTile status={data.status[i]} />
          <span
            className={classNames(
              'text-[12px] leading-[normal] font-semibold',
              data.status[i] === 'today' ? 'text-[#785910]' : 'text-[#595959]'
            )}
          >
            {d}
          </span>
        </li>
      ))}
    </ol>
    {data.week ? (
      /* Focused frames (Figma 8097:6860 / 7535 / HM): a "This week · N of M steps done" bar; Playful keeps the quest list below. */
      <div className="flex flex-col gap-[8px] playful:hidden">
        <div className="flex items-baseline justify-between gap-[8px]">
          <span className="text-[14px] leading-[normal] font-medium text-[#1c2a21]">
            {data.week.label}
          </span>
          <span className="text-[12px] leading-[normal] font-semibold whitespace-nowrap text-[#387440]">
            {data.week.done}
          </span>
        </div>
        <Bar pct={data.week.pct} height={8} />
      </div>
    ) : null}
    {data.quests ? (
      <div className={classNames('flex flex-col gap-[14px]', data.week && 'hidden playful:flex')}>
        <p className="text-[12px] leading-[normal] font-bold tracking-[1.2px] text-[#595959]">
          {data.questsTitle} · <Points n={data.questsPts} />
        </p>
        <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
          {data.quests.map((q) => (
            <li key={q.text} className="flex flex-col gap-[6px]">
              <div className="flex items-baseline justify-between gap-[8px]">
                <span className="text-[14px] leading-[normal] font-medium text-[#1c2a21]">
                  {q.text}
                </span>
                <span
                  className={classNames(
                    'text-[12px] leading-[normal] font-semibold whitespace-nowrap',
                    q.pct > 0 ? 'text-[#387440]' : 'text-[#595959]'
                  )}
                >
                  {q.count} · <Points n={q.pts} />
                </span>
              </div>
              <Bar pct={q.pct} height={8} to="playful:to-[#84cc16]" />
            </li>
          ))}
        </ul>
      </div>
    ) : null}
  </section>
);

const ReadinessLocked = ({ data }) => (
  <section
    aria-label="Job readiness"
    className={classNames(
      'flex flex-col gap-[12px] rounded-[24px] bg-white/75 p-[clamp(14px,1.3vw,22px)]',
      CARD_DASHED
    )}
  >
    <CardHead
      tile={<TalentHomeCardTargetIcon className="size-[17px]" />}
      title={data.title}
      trailing={<Chip icon={<TalentHomeChipLockIcon className="size-[14px]" />}>{data.chip}</Chip>}
    />
    <div className="flex items-center gap-[12px]">
      <span
        aria-hidden="true"
        className="flex size-[56px] shrink-0 items-center justify-center rounded-[16px] border border-[#e7e7e7] bg-[#f7f8f4]"
      >
        <TalentHomeJobReadinessLockIcon className="size-[24px]" />
      </span>
      <p className="max-w-[300px] text-[14px] leading-[20px] text-[#595959]">{data.preview}</p>
    </div>
    <Bar pct={data.pct} height={8} />
    <p className="text-[12px] leading-[normal] font-semibold text-[#387440]">{data.caption}</p>
  </section>
);

const ReadinessScore = ({ data }) => {
  const go = useGo();
  return (
    <section
      aria-label="Job readiness"
      className={classNames(
        'flex flex-col gap-[16px] rounded-[24px] bg-white p-[clamp(14px,1.3vw,22px)] playful:gap-[12px]',
        CARD_SOFT
      )}
    >
      <CardHead
        tile={<TalentHomeCardTargetIcon className="size-[17px]" />}
        title={data.title}
        link={data.link}
        onLink={() => go('/my-assessment', 'readiness details')}
      />
      <div className="flex items-center gap-[12px]">
        <span
          className={classNames(HEAD, 'text-[clamp(36px,2.7vw,47px)] leading-[1.1] text-[#387440]')}
        >
          {data.score}
        </span>
        <span className="flex flex-col gap-[2px] leading-[normal]">
          <span className="text-[14px] font-semibold text-[#1c2a21]">{data.headline}</span>
          <span className="text-[13px] text-[#595959]">{data.sub}</span>
        </span>
      </div>
      <Bar pct={data.pct} height={10} to="playful:to-[#84cc16]" />
      <div className="flex flex-col gap-[4px] rounded-[16px] border border-[#f7efdd] bg-[#faf4e8] p-[14px] playful:border-[#eedeb8]">
        <div className="flex items-center justify-between gap-[8px]">
          <span className="text-[12px] leading-[normal] font-bold tracking-[1.2px] text-[#c8951a] playful:text-[#785910]">
            {data.gapLabel}
          </span>
          {data.gapPts ? (
            <DualPill focused="whiteGold" playful="white">
              <Points n={data.gapPts} />
            </DualPill>
          ) : null}
        </div>
        <p className="text-[15px] leading-[normal] font-semibold text-[#1c2a21]">{data.gapTitle}</p>
        <p className="text-[13px] leading-[normal] text-[#595959]">{data.gapBody}</p>
      </div>
    </section>
  );
};

const WhoLooking = ({ data }) => (
  <section
    aria-label="Who’s looking"
    className={classNames(
      'flex flex-col gap-[12px] rounded-[24px] bg-white p-[clamp(14px,1.3vw,22px)]',
      CARD_SOFT
    )}
  >
    <CardHead
      tile={<TalentHomeEyeGreenIcon className="h-[16.15px] w-[17px]" />}
      title={data.title}
    />
    <div className="flex items-center gap-[14px]">
      <span aria-hidden="true" className="flex">
        {data.photos.map((p, i) => (
          <Photo
            key={i}
            src={typeof p === 'string' ? p : null}
            initials={p?.initials}
            size={40}
            className={i === 0 && data.photos.length > 1 ? '-mr-[10px]' : ''}
          />
        ))}
      </span>
      <span className="flex flex-col gap-[2px] leading-[normal]">
        <span className="text-[15px] font-semibold text-[#1c2a21]">{data.headline}</span>
        <span className="text-[13px] text-[#595959]">{data.sub}</span>
      </span>
    </div>
  </section>
);

const RecruiterCard = ({ data, onSeeAll }) => (
  <section
    aria-label="Recruiter activity"
    className={classNames(
      'flex flex-col gap-[12px] rounded-[24px] bg-white p-[clamp(14px,1.3vw,22px)]',
      CARD_SOFT
    )}
  >
    <CardHead
      tile={<TalentHomeEyeGreenIcon className="h-[16.15px] w-[17px]" />}
      title={data.title}
      link={data.link}
      onLink={onSeeAll}
    />
    <p className="text-[13px] leading-[normal] font-medium text-[#595959]">{data.sub}</p>
    <ul className="m-0 flex list-none flex-col p-0">
      {data.rows.map((r, i) => (
        <li
          key={`${r.name}-${i}`}
          className="flex items-start gap-[10px] border-b border-[#e7e7e7] py-[10px]"
        >
          <Photo src={r.photo} initials={r.initials} size={36} />
          <span className="flex min-w-0 flex-col gap-[6px] playful:gap-[2px]">
            <span className="text-[13px] leading-[normal] font-semibold text-[#1c2a21]">
              {r.name}
            </span>
            <span
              className={classNames(
                'text-[13px] leading-[normal]',
                r.whatAccent ? 'font-semibold text-[#387440]' : 'text-[#595959]'
              )}
            >
              {r.what}
            </span>
            <span className="flex flex-wrap items-center gap-[6px]">
              <span className="text-[12px] leading-[normal] text-[#595959]">{r.when}</span>
              <DualPill focused="green" playful="green">
                {r.role}
              </DualPill>
            </span>
          </span>
        </li>
      ))}
    </ul>
    <p className="flex items-center gap-[8px] rounded-[12px] bg-[#f7f8f4] px-[12px] py-[10px] text-[12px] leading-[normal] text-[#595959]">
      <TalentHomePrivacyLockIcon className="size-[14px] shrink-0" />
      {data.privacy}
    </p>
  </section>
);

// ---- People to link up with (Top Talent / complete demo frames) ---------------------------------
// Figma "GTH · Crew suggestions" card: an invitations strip (2 faces, "3 people want to link up with you", Review) over
// three suggestion cards with Link up. Demo data in the shape of GET /circle/discover (invitationsPreview + suggestions);
// every control opens the matching My circle screen (circleState.js URL contract).
const CIRCLE_ROUTE = '/community?view=circle';
const CREW = {
  title: 'People to link up with',
  link: 'My crew',
  invitations: {
    faces: [
      { id: 'esi-quaye', photo: crewEsiFace },
      { id: 'nana-yaw-mensah', photo: crewNanaYawFace },
    ],
    title: '3 people want to link up with you',
    names: 'Esi Quaye, Nana Yaw Mensah and 1 more',
  },
  people: [
    {
      id: 'abena-owusu',
      name: 'Abena Owusu',
      why: 'Both in Data Science Ghana',
      photo: crewAbenaPhoto,
    },
    { id: 'yaw-darko', name: 'Yaw Darko', why: 'Same course at Ashesi', photo: crewYawPhoto },
    {
      id: 'efua-asante',
      name: 'Efua Asante',
      why: 'Both learning JavaScript',
      photo: crewEfuaPhoto,
    },
  ],
  note: 'Picked from your clubs, school and skills. Only people you share something with.',
};

const CrewCard = () => {
  const go = useGo();
  return (
    <section
      aria-label={CREW.title}
      className={classNames(
        'flex flex-col gap-[14px] rounded-[24px] bg-white',
        CARD_PAD,
        CARD_SOFT
      )}
    >
      <CardHead
        tile={<CircleUsersIcon className="size-[17px] text-[#387440]" />}
        title={CREW.title}
        link={CREW.link}
        onLink={() => go(`${CIRCLE_ROUTE}&tab=circle`, 'crew: my crew')}
      />
      <div className="flex flex-wrap items-center gap-[12px] rounded-[14px] bg-[#f1f6f2] py-[10px] pr-[10px] pl-[14px] playful:border playful:border-solid playful:border-[#1c2a21] playful:bg-[#fff4d6]">
        <span aria-hidden="true" className="flex shrink-0 items-center">
          {CREW.invitations.faces.map((face, i) => (
            <Photo
              key={face.id}
              src={face.photo}
              size={32}
              className={classNames('border-2 border-solid border-white', i > 0 && '-ml-[10px]')}
            />
          ))}
        </span>
        <span className="flex min-w-[160px] flex-1 flex-col gap-[2px]">
          <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            {CREW.invitations.title}
          </span>
          <span className="text-[13px] leading-[16px] text-[#595959]">
            {CREW.invitations.names}
          </span>
        </span>
        <button
          type="button"
          onClick={() => go(`${CIRCLE_ROUTE}&tab=invitations`, 'crew: review invitations')}
          className="inline-flex min-h-[56px] shrink-0 cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-white px-[32px] py-[14px] text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[2px] max-lg:min-h-[48px] max-lg:px-[20px]"
        >
          Review
        </button>
      </div>
      <ul className="m-0 grid list-none gap-[12px] p-0 sm:grid-cols-3">
        {CREW.people.map((person) => (
          <li
            key={person.id}
            className="flex min-w-0 flex-col items-center gap-[6px] rounded-[16px] border border-solid border-[#e6e8e4] bg-white px-[12px] pt-[16px] pb-[14px] text-center playful:border-[1.5px] playful:border-[#1c2a21] playful:shadow-[0_3px_0_rgba(28,42,33,0.9)]"
          >
            <Photo src={person.photo} size={56} />
            <span className="max-w-full truncate text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {person.name}
            </span>
            <span className="max-w-full text-[12px] leading-[14px] text-[#595959]">
              {person.why}
            </span>
            <CircleButton
              aria-label={`Link up with ${person.name}`}
              onClick={() =>
                go(
                  `${CIRCLE_ROUTE}&modal=connect&person=${person.id}`,
                  `crew: link up ${person.id}`
                )
              }
              className="mt-[10px] w-full min-h-[52px] py-[12px]"
            >
              Link up
            </CircleButton>
          </li>
        ))}
      </ul>
      <p className="m-0 text-[12px] leading-[14px] text-[#6b6b6b]">{CREW.note}</p>
    </section>
  );
};

// ---- Public ----------------------------------------------------------------------------------

const LEFT_IDS = ['matched', 'applications', 'recent-activity', 'crew'];
const RIGHT_IDS = ['career-buddy', 'streak', 'job-readiness', 'recruiter-activity'];

// A section whose data is still on the way shows the Figma loading skeleton
// (HM-04), never an empty state the data has not confirmed yet.
const isPending = (section) => Boolean(section && section.pending);
const anyPending = (content) =>
  ['matches', 'activity', 'readiness', 'looking', 'recruiters'].some((k) => isPending(content[k]));

const HomeColumns = ({ home, content }) => {
  const layout = useHomeLayout();
  log('render', { state: home.stateKey, editing: home.editOpen });
  const complete = home.stateKey === 'complete' || home.stateKey === 'top';
  const variant = complete ? 'complete' : 'discoverable';
  // Live talents who aren't Discoverable yet get the apply gate (ApplyGateModal) instead of applying.
  const onGate =
    home.content && home.live?.journey?.milestone === 'none'
      ? (card) => {
          log('apply gate for', card.id);
          home.update({ new: 'gate', role: card.id });
        }
      : null;

  if (!complete) {
    return (
      <div className="grid min-w-0 gap-[16px] lg:grid-cols-[minmax(0,912fr)_minmax(0,448fr)]">
        {anyPending(content) ? <ShimmerStyle /> : null}
        <div className="flex min-w-0 flex-col gap-[16px]">
          {isPending(content.matches) ? (
            <CardSkeleton bodyH="h-[220px]" />
          ) : (
            <MatchesCard data={content.matches} variant={variant} onGate={onGate} />
          )}
          <ApplicationsEmpty data={content.applications} />
        </div>
        <aside aria-label="For you" className="flex min-w-0 flex-col gap-[16px]">
          <BuddyCard data={content.buddy} />
          {content.streak ? <StreakCard data={content.streak} /> : null}
          {isPending(content.readiness) ? (
            <CardSkeleton bodyH="h-[160px]" />
          ) : (
            <ReadinessLocked data={content.readiness} />
          )}
          {isPending(content.looking) ? (
            <CardSkeleton bodyH="h-[140px]" />
          ) : content.looking ? (
            <WhoLooking data={content.looking} />
          ) : null}
        </aside>
      </div>
    );
  }

  // Complete / Top Talent: cards are reorderable / hideable (HM-05 Edit home).
  const cards = {
    matched: isPending(content.matches) ? (
      <CardSkeleton bodyH="h-[220px]" />
    ) : (
      <MatchesCard data={content.matches} variant={variant} onGate={onGate} />
    ),
    applications: content.applications.items?.length ? (
      <ApplicationsList data={content.applications} />
    ) : (
      <ApplicationsEmpty data={content.applications} />
    ),
    'recent-activity': isPending(content.activity) ? (
      <CardSkeleton bodyH="h-[180px]" />
    ) : (
      <ActivityCard data={content.activity} />
    ),
    // Demo frames only: the live home has no circle data yet (the My circle screens load their own).
    crew: home.content ? null : <CrewCard />,
    'career-buddy': <BuddyCard data={content.buddy} />,
    streak: content.streak ? <StreakCard data={content.streak} /> : null,
    'job-readiness': isPending(content.readiness) ? (
      <CardSkeleton bodyH="h-[160px]" />
    ) : content.readiness?.kind === 'locked' ? (
      <ReadinessLocked data={content.readiness} />
    ) : (
      <ReadinessScore data={content.readiness} />
    ),
    'recruiter-activity': isPending(content.recruiters) ? (
      <CardSkeleton bodyH="h-[140px]" />
    ) : content.recruiters ? (
      <RecruiterCard data={content.recruiters} onSeeAll={() => home.update({ tab: 'recruiter' })} />
    ) : null,
  };
  const column = (ids) =>
    layout.onPage
      .filter((c) => ids.includes(c.id) && cards[c.id])
      .map((c) => (
        <HomeCardChrome key={c.id} id={c.id} editing={home.editOpen}>
          {cards[c.id]}
        </HomeCardChrome>
      ));
  return (
    <div className="grid min-w-0 gap-[16px] lg:grid-cols-[minmax(0,912fr)_minmax(0,448fr)]">
      {anyPending(content) ? <ShimmerStyle /> : null}
      <div className="flex min-w-0 flex-col gap-[16px]">{column(LEFT_IDS)}</div>
      <aside aria-label="For you" className="flex min-w-0 flex-col gap-[16px]">
        {column(RIGHT_IDS)}
      </aside>
    </div>
  );
};

export default HomeColumns;
