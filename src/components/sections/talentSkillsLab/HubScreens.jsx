import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import trophyArt from '../../../assets/talent-skills-lab/hub/trophy.svg';
import {
  HubArrowRightIcon,
  HubBellIcon,
  HubBulbIcon,
  HubCheckCircleIcon,
  HubCheckIcon,
  HubCheckLargeIcon,
  HubCloseIcon,
  HubDownloadIcon,
  HubEyeIcon,
  HubEyeOffIcon,
  HubListBulletIcon,
  HubLockIcon,
  HubPlusIcon,
  HubRefreshIcon,
  HubSearchIcon,
  HubStarIcon,
  HubTrendUpIcon,
} from './HubIcons.jsx';
import {
  EMPHASIS_CARD,
  HAIRLINE_CARD,
  HEADING,
  HowLabsWorkCard,
  HubButton,
  HubChip,
  HubDots,
  HubLink,
  HubSectionHead,
  ScoresCard,
  VerificationCard,
  WeeklyCard,
} from './HubParts.jsx';
import { LAB_ICONS, useXpWord } from './hubShared.js';
import LabCard from './LabCard.jsx';
import { HUB_CATEGORIES, HUB_HOW_LABS_WORK, HUB_HOW_LABS_WORK_NEW } from './skillsLabData.js';
import { useHubData } from './skillsLabHubData.js';

const log = debug('HubScreens');

const GRID =
  'grid items-start gap-[20px] [grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr))]';

const Columns = ({ left, right }) => (
  <div className="grid items-start gap-[24px] xl:grid-cols-[minmax(0,1fr)_340px]">
    <div className="flex min-w-0 flex-col gap-[28px]">{left}</div>
    <div className="flex min-w-0 flex-col gap-[16px]">{right}</div>
  </div>
);

// Labs come from useHubData(): the live API response, or the drawn mock with `?demo=1`.
const labsByStatus = (labs, ...statuses) => labs.filter((l) => statuses.includes(l.status));

/* ---------- shared tiles ---------- */

const AddSkillTile = ({ skills }) => (
  <div
    className={classNames(
      'flex min-h-[300px] min-w-0 flex-col items-center justify-center gap-[12px] rounded-[20px] border border-dashed border-[rgba(28,42,33,0.1)] p-[20px] text-center playful:border-[1.5px] playful:border-[rgba(28,42,33,0.35)]'
    )}
  >
    <span className="inline-flex size-[48px] items-center justify-center rounded-[14px] bg-[#ebf1ec] text-[#387440]">
      <HubPlusIcon className="size-[23px]" />
    </span>
    <h3 className={classNames(HEADING, 'text-[17px] leading-[21px] tracking-[-0.01em]')}>
      Add a skill to unlock its lab
    </h3>
    <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
      Labs appear here for every skill on your profile.
    </p>
    <HubButton tone="secondary" onClick={() => skills.update({ modal: 'add' })}>
      Add a skill
    </HubButton>
  </div>
);

const SuggestTile = ({ skills }) => (
  <div className="flex min-h-[300px] min-w-0 flex-col items-start justify-center gap-[10px] rounded-[20px] bg-[#fbf4e0] p-[20px]">
    <span className="inline-flex size-[44px] items-center justify-center rounded-[13px] bg-[#ffd86b] text-[#1c2a21]">
      <HubBulbIcon className="size-[21px]" />
    </span>
    <h3 className={classNames(HEADING, 'text-[18px] leading-[22px] tracking-[-0.01em]')}>
      Can&apos;t find your skill?
    </h3>
    <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
      Tell us which lab to build next. Popular requests ship first.
    </p>
    <HubButton
      tone="secondary"
      className="mt-[4px]"
      onClick={() => skills.update({ modal: 'suggest' })}
    >
      Suggest a lab
    </HubButton>
  </div>
);

/* ---------- continue card ---------- */

const ContinueCard = ({ lab }) => {
  const p = lab.progress;
  const dots = useMemo(() => {
    const done = p.results;
    const rest = Array.from({ length: Math.max(0, p.total - done.length - 1) }, () => 'upcoming');
    return [...done, 'current', ...rest];
  }, [p]);
  const Glyph = LAB_ICONS[lab.icon];
  return (
    <section
      aria-label="Pick up where you left off"
      className={classNames(
        'flex flex-wrap items-center gap-[24px] rounded-[24px] bg-white p-[24px] max-sm:p-[16px]',
        EMPHASIS_CARD
      )}
    >
      <span className="inline-flex size-[150px] shrink-0 items-center justify-center rounded-[20px] bg-[#387440] text-white max-sm:size-[96px]">
        <Glyph className="size-[64px] max-sm:size-[44px]" />
      </span>
      <div className="flex min-w-[240px] flex-1 flex-col gap-[10px]">
        <div className="flex flex-wrap items-center gap-[10px]">
          <p className="m-0 font-sans text-[11.5px] font-bold uppercase leading-[14px] tracking-[0.06em] text-[#387440] max-lg:text-[12px]">
            PICK UP WHERE YOU LEFT OFF
          </p>
          <span
            data-doodle=""
            className="hidden items-center rounded-full border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[11px] font-bold leading-[13px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-flex playful:rotate-[3deg] max-lg:text-[12px]"
          >
            {`ABOUT ${p.minutesLeft} MIN LEFT`}
          </span>
        </div>
        <h2
          className={classNames(
            HEADING,
            'text-[clamp(24px,1.74vw,30px)] leading-[1.2] tracking-[-0.01em]'
          )}
        >
          {lab.title}
        </h2>
        <p className="m-0 font-sans text-[15px] font-medium leading-[18px] text-[#595959]">
          {`Challenge ${p.answered} of ${p.total} · get ${p.needed} right to earn the Verified badge`}
        </p>
        <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
          <HubDots dots={dots} big />
          <span className="font-sans text-[13px] font-semibold leading-[16px] text-[#387440]">
            {`${p.correct} correct · ${p.toReview} to review`}
          </span>
        </div>
        <div className="flex flex-wrap gap-[12px] pt-[4px]">
          <HubButton
            tone="primary"
            to={`/skills-lab/lab/${lab.id}/play`}
            rightIcon={<HubArrowRightIcon />}
          >
            Resume lab
          </HubButton>
          <HubButton tone="secondary" to={`/skills-lab/lab/${lab.id}`}>
            Lab details
          </HubButton>
        </div>
      </div>
    </section>
  );
};

/* ---------- All labs ---------- */

const CategoryChips = ({ skills }) => (
  <div
    className="flex flex-wrap items-center gap-[8px]"
    role="group"
    aria-label="Filter labs by category"
  >
    <HubChip
      tone={skills.cat ? 'outline' : 'dark'}
      pressed={!skills.cat}
      onClick={() => skills.update({ cat: null })}
    >
      All
    </HubChip>
    {HUB_CATEGORIES.map((c) => {
      const on = skills.cat === c.id;
      return (
        <HubChip
          key={c.id}
          tone={on ? 'dark' : 'outline'}
          pressed={on}
          onClick={() => {
            log('cat ->', c.id);
            skills.update({ cat: on ? null : c.id });
          }}
          icon={on ? <HubCloseIcon className="hidden size-[12px] playful:block" /> : null}
        >
          {c.label}
        </HubChip>
      );
    })}
  </div>
);

const SearchBar = ({ skills }) => (
  <form
    role="search"
    onSubmit={(e) => e.preventDefault()}
    className="flex min-h-[48px] items-center gap-[10px] rounded-[14px] border border-solid border-[#387440] bg-white px-[16px] py-[13px] playful:min-h-[50px] playful:border-2"
  >
    <HubSearchIcon className="size-[20px] shrink-0 text-[#1c2a21]" />
    <input
      type="search"
      aria-label="Search labs"
      value={skills.q}
      autoFocus={!skills.q}
      onChange={(e) => skills.update({ q: e.target.value, search: '1' })}
      className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[15px] font-medium leading-[18px] text-[#1c2a21] outline-none [&::-webkit-search-cancel-button]:hidden"
    />
    <button
      type="button"
      aria-label="Clear search"
      onClick={() => skills.update({ q: null, search: null })}
      className="inline-flex size-[24px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#595959] focus-visible:outline-2 focus-visible:outline-[#387440]"
    >
      <HubCloseIcon className="size-[18px]" />
    </button>
  </form>
);

const ExploreBlock = ({ skills, labs, title = 'Explore more labs', context, showCount }) => (
  <section className="flex flex-col gap-[16px]" aria-label={title}>
    <HubSectionHead title={title} />
    {title === 'Explore more labs' ? (
      <div className="flex flex-wrap items-center justify-between gap-[8px]">
        <CategoryChips skills={skills} />
        {showCount ? (
          <span className="font-sans text-[14px] font-medium leading-[17px] text-[#595959]">
            {labs.length} {labs.length === 1 ? 'lab' : 'labs'}
          </span>
        ) : null}
      </div>
    ) : null}
    <div className={GRID}>
      {labs.map((lab) => (
        <LabCard key={lab.id} lab={lab} context={context} />
      ))}
      {title === 'Explore more labs' ? <SuggestTile skills={skills} /> : null}
    </div>
  </section>
);

const NoLabResult = ({ skills }) => (
  <section
    aria-live="polite"
    className={classNames(
      'flex flex-col items-center gap-[14px] rounded-[24px] bg-white p-[40px] text-center max-sm:p-[20px]',
      HAIRLINE_CARD
    )}
  >
    <span className="inline-flex size-[56px] items-center justify-center rounded-[17px] bg-[#ffd86b] text-[#1c2a21]">
      <HubSearchIcon className="size-[27px]" />
    </span>
    <h2
      className={classNames(
        HEADING,
        'text-[clamp(20px,1.4vw,24px)] leading-[1.2] tracking-[-0.01em] [overflow-wrap:anywhere]'
      )}
    >
      {`No lab for "${skills.q}" yet`}
    </h2>
    <p className="m-0 max-w-[520px] font-sans text-[15px] leading-[23px] text-[#595959]">
      We are building new labs every month. Vote for this one and we will tell you when it launches.
    </p>
    <div className="flex flex-wrap justify-center gap-[12px] pt-[8px]">
      <HubButton
        tone="primary"
        rightIcon={<HubArrowRightIcon />}
        onClick={() => skills.update({ toast: 'suggestion' })}
      >
        Vote for this lab
      </HubButton>
      <HubButton tone="secondary" onClick={() => skills.update({ q: null, search: null })}>
        Clear search
      </HubButton>
    </div>
  </section>
);

export const HubAllTab = ({ skills }) => {
  const hub = useHubData();
  const { labs, summary, weekly, closeMatches } = hub.response;
  const xp = useXpWord();
  const continueLab = labs.find((l) => l.status === 'in_progress');
  const searching = skills.q.trim() !== '' || skills.searchOpen;
  const q = skills.q.trim().toLowerCase();

  const results = useMemo(
    () =>
      labs.filter(
        (l) =>
          (!skills.cat || l.categories.includes(skills.cat)) &&
          (!q || `${l.title} ${l.description}`.toLowerCase().includes(q))
      ),
    [labs, skills.cat, q]
  );

  useEffect(() => {
    log('all tab', { cat: skills.cat, q, results: results.length });
  }, [skills.cat, q, results.length]);

  const filtering = Boolean(skills.cat) || q !== '';
  const noMatch = q !== '' && results.length === 0;

  let left;
  if (filtering || searching) {
    left = (
      <>
        {searching ? <SearchBar skills={skills} /> : null}
        {noMatch ? (
          <>
            <NoLabResult skills={skills} />
            <ExploreBlock
              skills={skills}
              title="Close matches"
              labs={closeMatches.map(hub.labById).filter(Boolean)}
            />
          </>
        ) : (
          <ExploreBlock skills={skills} labs={results} context={skills.cat} showCount />
        )}
      </>
    );
  } else {
    const ready = labsByStatus(labs, 'ready');
    const verified = labsByStatus(labs, 'verified', 'cooldown');
    const explore = labsByStatus(labs, 'explore', 'new');
    left = (
      <>
        {continueLab ? <ContinueCard lab={continueLab} /> : null}
        <section className="flex flex-col gap-[16px]" aria-label="Ready to verify">
          <HubSectionHead
            title="Ready to verify"
            chip={
              <HubChip tone="soft" icon={<HubCheckIcon className="size-[14px] text-[#387440]" />}>
                From your skills
              </HubChip>
            }
            link={<HubLink onClick={() => skills.update({ modal: 'how' })}>Why verify?</HubLink>}
          />
          <div className={GRID}>
            {ready.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
            <AddSkillTile skills={skills} />
          </div>
        </section>
        <section className="flex flex-col gap-[16px]" aria-label="Verified">
          <HubSectionHead
            title="Verified"
            chip={
              <HubChip tone="statFocused">{`${summary.verified} of ${summary.total} skills`}</HubChip>
            }
            link={<HubLink to="/profile">See on my profile</HubLink>}
          />
          <div className={GRID}>
            {verified.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        </section>
        <ExploreBlock skills={skills} labs={explore} />
      </>
    );
  }

  const right =
    filtering || searching ? (
      <HowLabsWorkCard rows={HUB_HOW_LABS_WORK} />
    ) : (
      <>
        <VerificationCard summary={summary} />
        {weekly ? (
          <WeeklyCard weekly={weekly} onJoin={() => skills.update({ modal: 'weekly' })} />
        ) : null}
        <HowLabsWorkCard rows={HUB_HOW_LABS_WORK} />
      </>
    );
  log('xp word', xp);
  return <Columns left={left} right={right} />;
};

/* ---------- In progress ---------- */

export const HubProgressTab = ({ skills }) => {
  const { response } = useHubData();
  const { summary, nudge, labs } = response;
  const open = labsByStatus(labs, 'in_progress');
  return (
    <Columns
      left={
        <>
          {open.map((lab) => (
            <ContinueCard key={lab.id} lab={lab} />
          ))}
          {!open.length ? (
            <p className="m-0 rounded-[20px] bg-white p-[24px] font-sans text-[15px] leading-[22px] text-[#595959]">
              Nothing in progress. Start a lab from All labs; it saves after every answer.
            </p>
          ) : null}
          {nudge ? (
          <section
            aria-label={nudge.title}
            className="flex flex-wrap items-center gap-[14px] rounded-[20px] bg-[#fbf4e0] p-[20px]"
          >
            <span className="inline-flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ffd86b] text-[#1c2a21]">
              <HubBellIcon className="size-[19px]" />
            </span>
            <div className="flex min-w-[200px] flex-1 flex-col gap-[2px]">
              <h2 className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21]">
                {nudge.title}
              </h2>
              <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959]">
                {nudge.body}
              </p>
            </div>
            <HubButton tone="secondary" onClick={() => skills.update({ toast: 'reminder' })}>
              Remind me
            </HubButton>
          </section>
          ) : null}
        </>
      }
      right={
        <>
          <VerificationCard summary={summary} />
          <HowLabsWorkCard rows={HUB_HOW_LABS_WORK} />
        </>
      }
    />
  );
};

/* ---------- Verified ---------- */

const useScores = (skills) => {
  const hub = useHubData();
  const [mockScores, setMockScores] = useState(hub.profileScores);
  const scores = hub.live ? hub.profileScores : mockScores;
  const onToggle = (s, next) => {
    if (hub.live) {
      hub.setScoreShown(s.labId, next).catch(() => log('score toggle failed', s.labId));
    } else {
      setMockScores((cur) => cur.map((x) => (x.labId === s.labId ? { ...x, shown: next } : x)));
    }
    if (!next) skills.update({ toast: 'hidden' });
  };
  return [scores, onToggle];
};

export const HubVerifiedTab = ({ skills }) => {
  const { summary, labs } = useHubData().response;
  const [scores, onToggle] = useScores(skills);
  const verified = labsByStatus(labs, 'verified', 'cooldown');
  const next = labsByStatus(labs, 'in_progress', 'ready');
  return (
    <Columns
      left={
        <>
          <section
            aria-label="Verified skills"
            className="flex flex-wrap items-center gap-[20px] rounded-[24px] bg-[#2a5730] p-[24px] text-white"
          >
            <span className="inline-flex size-[72px] shrink-0 items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-[#387440] text-[#1c2a21] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:bg-[#ebf1ec] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]">
              <HubCheckLargeIcon className="size-[34px]" />
            </span>
            <div className="flex min-w-[220px] flex-1 flex-col gap-[6px]">
              <h2
                className={classNames(
                  HEADING,
                  'text-[clamp(22px,1.62vw,28px)] leading-[1.2] tracking-[-0.01em] !text-white'
                )}
              >
                {`${summary.verified} skills verified`}
              </h2>
              <p className="m-0 font-sans text-[15px] leading-[18px]">
                These show as Verified on your profile. Recruiters can filter by them.
              </p>
            </div>
            <HubButton tone="secondary" to="/profile">
              See on my profile
            </HubButton>
          </section>
          <div className={GRID}>
            {verified.map((lab) => (
              <LabCard key={lab.id} lab={lab} context="verifiedTab" />
            ))}
          </div>
          {next.length ? (
            <section className="flex flex-col gap-[16px]" aria-label="Next up">
              <HubSectionHead
                title={`Verify ${summary.total - summary.verified} more to reach ${summary.total} of ${summary.total}`}
              />
              <div className={GRID}>
                {next.map((lab) => (
                  <LabCard key={lab.id} lab={lab} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      }
      right={<ScoresCard scores={scores} onToggle={onToggle} />}
    />
  );
};

/* ---------- History ---------- */

const RESULT_LABEL = {
  in_progress: 'In progress',
  verified: 'Verified',
  perfect: 'Verified · perfect',
  not_yet: 'Not yet',
};

const StatTile = (props) => {
  const Glyph = props.Icon;
  const { value, label } = props;
  return (
    <div
      className={classNames(
        'flex min-w-0 flex-col gap-[6px] rounded-[20px] bg-white p-[20px]',
        HAIRLINE_CARD
      )}
    >
      <Glyph className="size-[20px] text-[#387440]" />
      <span className={classNames(HEADING, 'text-[28px] leading-[34px] tracking-[-0.01em]')}>
        {value}
      </span>
      <span className="font-sans text-[13px] font-medium leading-[16px] text-[#595959]">
        {label}
      </span>
    </div>
  );
};

const ResultChip = ({ result }) => {
  const verified = result === 'verified' || result === 'perfect';
  return (
    <HubChip
      tone={verified ? 'statFocused' : 'outline'}
      icon={
        verified ? (
          <HubCheckIcon className="size-[14px] text-[#272e35] playful:text-[#387440]" />
        ) : null
      }
    >
      {RESULT_LABEL[result]}
    </HubChip>
  );
};

const ROW_GRID =
  'grid items-center gap-[12px] [grid-template-columns:minmax(150px,1.9fr)_minmax(70px,1fr)_64px_minmax(110px,1.2fr)_minmax(86px,1fr)_minmax(96px,1fr)]';

const AttemptRow = ({ a }) => {
  const lab = useHubData().labById(a.labId);
  if (!lab) return null;
  const Glyph = LAB_ICONS[lab.icon];
  const verified = a.result === 'verified' || a.result === 'perfect';
  const Vis = a.onProfile ? HubEyeIcon : HubEyeOffIcon;
  return (
    <div
      className={classNames(
        ROW_GRID,
        'border-0 border-b border-solid border-[rgba(28,42,33,0.08)] p-[12px]'
      )}
    >
      <div className="flex min-w-0 items-center gap-[10px]">
        <span
          className={classNames(
            'inline-flex size-[32px] shrink-0 items-center justify-center rounded-[10px] text-[#387440]',
            verified ? 'bg-[#387440] playful:bg-[#ebf1ec]' : 'bg-[#ebf1ec]'
          )}
        >
          <Glyph className="size-[15px]" />
        </span>
        <Link
          to={`/skills-lab/lab/${lab.id}`}
          className="truncate font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21] no-underline"
        >
          {lab.title}
        </Link>
      </div>
      <span className="font-sans text-[14px] leading-[17px] text-[#1c2a21]">{a.date}</span>
      <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
        {a.score}
      </span>
      <span>
        <ResultChip result={a.result} />
      </span>
      <span
        className={classNames(
          'flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px]',
          a.onProfile ? 'text-[#387440]' : 'text-[#595959]'
        )}
      >
        <Vis className="size-[16px]" />
        {a.onProfile ? 'Shown' : 'Private'}
      </span>
      <span className="flex justify-end">
        {a.cooldown ? (
          <HubButton
            tone="disabled"
            disabled
            size="xs"
            className="!min-h-[34px] !text-[13px]"
            leftIcon={<HubLockIcon />}
          >
            {`Retake in ${a.cooldown.hours}h`}
          </HubButton>
        ) : (
          <HubLink to={`/skills-lab/lab/${lab.id}/play`}>
            {a.result === 'in_progress' ? 'Resume' : 'Retake'}
          </HubLink>
        )}
      </span>
    </div>
  );
};

export const HubHistoryTab = ({ skills }) => {
  const xp = useXpWord();
  const hub = useHubData();
  const { summary } = hub.response;
  const [filter, setFilter] = useState('all');
  const [scores, onToggle] = useScores(skills);
  const rows = hub.attempts.filter(
    (a) =>
      filter === 'all' ||
      (filter === 'verified' && (a.result === 'verified' || a.result === 'perfect')) ||
      (filter === 'not_yet' && a.result === 'not_yet')
  );
  return (
    <Columns
      left={
        <>
          <div className="grid gap-[16px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))]">
            <StatTile Icon={HubListBulletIcon} value={summary.labsTaken} label="labs taken" />
            <StatTile Icon={HubCheckCircleIcon} value={summary.verified} label="skills verified" />
            <StatTile
              Icon={HubTrendUpIcon}
              value={summary.bestResult}
              label={`best result (${summary.bestResultLab})`}
            />
            <StatTile Icon={HubStarIcon} value={summary.xp} label={`${xp} from labs`} />
          </div>
          <section
            aria-label="All attempts"
            className={classNames(
              'rounded-[20px] bg-white px-[24px] pb-[8px] pt-[24px] max-sm:px-[14px]',
              HAIRLINE_CARD
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-[12px] pb-[0px]">
              <h2 className={classNames(HEADING, 'text-[18px] leading-[22px] tracking-[-0.01em]')}>
                All attempts
              </h2>
              <div className="flex gap-[8px]" role="group" aria-label="Filter attempts">
                {[
                  ['all', 'All'],
                  ['verified', 'Verified'],
                  ['not_yet', 'Not yet'],
                ].map(([id, label]) => (
                  <HubChip
                    key={id}
                    tone={filter === id ? 'dark' : 'outline'}
                    pressed={filter === id}
                    onClick={() => setFilter(id)}
                  >
                    {label}
                  </HubChip>
                ))}
              </div>
            </div>
            <div className="no-scrollbar mt-[8px] overflow-x-auto">
              <div className="min-w-[700px]" role="table" aria-label="Attempts">
                <div
                  role="row"
                  className={classNames(
                    ROW_GRID,
                    'rounded-[10px] bg-[#f7f7f4] px-[12px] py-[10px] font-sans text-[12.5px] font-semibold leading-[15px] text-[#595959]'
                  )}
                >
                  <span>Lab</span>
                  <span>Date</span>
                  <span>Score</span>
                  <span>Result</span>
                  <span>On profile</span>
                  <span className="text-right">Action</span>
                </div>
                {rows.map((a) => (
                  <AttemptRow key={a.id} a={a} />
                ))}
              </div>
            </div>
            <p className="m-0 py-[12px] font-sans text-[13px] leading-[19px] text-[#595959]">
              Only Verified results can show on your profile. Attempts that do not pass are always
              private.
            </p>
          </section>
        </>
      }
      right={
        <>
          <ScoresCard
            scores={scores}
            onToggle={onToggle}
            intro="The Verified badge always shows. You choose whether recruiters also see the score."
          />
          <section className="flex flex-col gap-[12px] rounded-[20px] bg-[#fbf4e0] p-[22px]">
            <div className="flex items-center gap-[10px]">
              <span className="inline-flex size-[36px] shrink-0 items-center justify-center rounded-[11px] bg-[#ffd86b] text-[#1c2a21]">
                <HubDownloadIcon className="size-[17px]" />
              </span>
              <h2 className={classNames(HEADING, 'text-[17px] leading-[21px] tracking-[-0.01em]')}>
                Share with your school
              </h2>
            </div>
            <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
              Download a PDF of your Verified skills for a guidance counsellor or a scholarship
              form.
            </p>
            <HubButton
              tone="secondary"
              className="w-full"
              onClick={() => skills.update({ toast: 'pdf' })}
            >
              Download PDF
            </HubButton>
          </section>
        </>
      }
    />
  );
};

/* ---------- Empty (new talent) ---------- */

export const HubEmptyTab = ({ skills }) => {
  const hub = useHubData();
  const { popularForNewTalent } = hub.response;
  return (
    <Columns
      left={
        <>
          <section
            aria-label="Your first badge"
            className="flex flex-wrap items-center gap-[28px] rounded-[24px] bg-[#2a5730] p-[32px] text-white max-sm:p-[20px]"
          >
            <div className="flex min-w-[260px] flex-1 flex-col gap-[12px]">
              <p className="m-0 font-sans text-[11.5px] font-bold uppercase leading-[14px] tracking-[0.06em] text-[#84cc16] max-lg:text-[12px]">
                YOUR FIRST BADGE
              </p>
              <h2
                className={classNames(
                  HEADING,
                  'text-[clamp(24px,1.74vw,30px)] leading-[1.2] tracking-[-0.01em] !text-white'
                )}
              >
                Your first Verified badge is about 10 minutes away.
              </h2>
              <p className="m-0 font-sans text-[16px] leading-[24px]">
                Add your skills and we will line up the right labs. Or start with one that talents
                like you pick first.
              </p>
              <div className="flex flex-wrap gap-[12px] pt-[4px]">
                <HubButton
                  tone="primary"
                  rightIcon={<HubArrowRightIcon />}
                  onClick={() => skills.update({ modal: 'add' })}
                >
                  Add my skills
                </HubButton>
                <HubButton
                  tone="secondary"
                  onClick={() => skills.update({ state: null, tab: null, cat: null, q: null })}
                >
                  Browse all labs
                </HubButton>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="relative flex h-[220px] w-[220px] shrink-0 items-center justify-center rounded-[24px] bg-white/[0.08] max-md:hidden"
            >
              <span className="inline-flex size-[110px] items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-[#387440] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:bg-[#ebf1ec] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]">
                <img src={trophyArt} alt="" className="size-[104px]" />
              </span>
              <span
                data-doodle=""
                className="absolute bottom-[56px] hidden rounded-full border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[11px] font-bold leading-[18px] text-[#1c2a21] max-lg:text-[12px] shadow-[2px_2px_0_#1c2a21] playful:inline-block"
              >
                VERIFIED
              </span>
            </div>
          </section>
          <section className="flex flex-col gap-[16px]" aria-label="Popular with talents like you">
            <HubSectionHead
              title="Popular with talents like you"
              chip={<HubChip tone="soft">Tertiary · Statistics</HubChip>}
              link={
                <HubLink
                  onClick={() => skills.update({ state: null, tab: null, cat: null, q: null })}
                >
                  {`See all ${hub.response.summary.labsTotal} labs`}
                </HubLink>
              }
            />
            <div className={GRID}>
              {popularForNewTalent.map(({ id, badge }) => {
                if (!hub.labById(id)) return null;
                const lab = { ...hub.labById(id), status: 'explore' };
                return <LabCard key={id} lab={lab} context="popular" badge={badge} />;
              })}
            </div>
          </section>
        </>
      }
      right={
        <>
          <HowLabsWorkCard rows={HUB_HOW_LABS_WORK_NEW} />
          <section
            aria-label="Why verify"
            className={classNames(
              'flex flex-col gap-[10px] rounded-[24px] bg-[#ffd86b] p-[22px]',
              EMPHASIS_CARD
            )}
          >
            <p className="m-0 font-sans text-[11.5px] font-bold uppercase leading-[14px] tracking-[0.06em] text-[#1c2a21] max-lg:text-[12px]">
              WHY VERIFY
            </p>
            <p className="m-0 font-sans text-[16px] font-semibold leading-[22px] text-[#1c2a21]">
              Recruiters can filter by Verified skills, so you show up before people who only listed
              them.
            </p>
          </section>
        </>
      }
    />
  );
};

/* ---------- Loading ---------- */

const Bone = ({ className }) => (
  <span
    aria-hidden="true"
    className={classNames('block animate-pulse bg-[#e8e8e0] motion-reduce:animate-none', className)}
  />
);

const SkeletonCard = () => (
  <div className="flex flex-col gap-[12px] rounded-[20px] border border-solid border-[rgba(28,42,33,0.08)] bg-white p-[20px]">
    <Bone className="size-[44px] rounded-[12px]" />
    <Bone className="mt-[12px] h-[22px] w-[140px] max-w-full rounded-[8px]" />
    <Bone className="mt-[2px] h-[12px] w-[220px] max-w-full rounded-[8px]" />
    <Bone className="h-[12px] w-[250px] max-w-full rounded-[8px]" />
    <Bone className="h-[12px] w-[200px] max-w-full rounded-[8px]" />
    <Bone className="mt-[50px] h-[46px] w-full rounded-[12px]" />
  </div>
);

export const HubLoadingTab = () => (
  <div role="status" aria-busy="true">
    <Columns
      left={
        <>
          <div className="flex flex-wrap items-center gap-[24px] rounded-[24px] border border-solid border-[rgba(28,42,33,0.08)] bg-white p-[24px]">
            <Bone className="size-[150px] rounded-[20px] max-sm:size-[96px]" />
            <div className="flex min-w-[200px] flex-1 flex-col gap-[12px]">
              <Bone className="h-[12px] w-[180px] rounded-[8px]" />
              <Bone className="h-[28px] w-[260px] max-w-full rounded-[8px]" />
              <Bone className="h-[14px] w-[420px] max-w-full rounded-[8px]" />
              <Bone className="h-[10px] w-[300px] max-w-full rounded-[8px]" />
              <div className="flex gap-[12px]">
                <Bone className="h-[48px] w-[160px] rounded-[12px]" />
                <Bone className="h-[48px] w-[130px] rounded-[12px]" />
              </div>
            </div>
          </div>
          <Bone className="h-[22px] w-[200px] rounded-[8px]" />
          <div className={GRID}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </>
      }
      right={
        <>
          <div className="flex flex-col gap-[14px] rounded-[24px] border border-solid border-[rgba(28,42,33,0.08)] bg-white p-[24px]">
            <Bone className="h-[12px] w-[120px] rounded-[8px]" />
            <Bone className="h-[40px] w-[160px] rounded-[8px]" />
            <Bone className="h-[10px] w-full rounded-[8px]" />
            <Bone className="h-[12px] w-[240px] max-w-full rounded-[8px]" />
            <Bone className="h-[12px] w-[220px] max-w-full rounded-[8px]" />
          </div>
          <p className="m-0 flex items-center gap-[8px] rounded-[12px] bg-[#ebf1ec] p-[12px] font-sans text-[13px] font-medium leading-[16px] text-[#2a5730]">
            <HubRefreshIcon className="size-[16px] shrink-0 text-[#387440]" />
            Loading your labs. Saved progress is safe.
          </p>
        </>
      }
    />
  </div>
);
