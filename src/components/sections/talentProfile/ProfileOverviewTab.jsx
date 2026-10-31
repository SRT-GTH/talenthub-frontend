import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { STAGE_BY_ID } from '../engagementShell/engagementShellData.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ProfileCheckWhiteIcon,
  ProfileSearchNoteIcon,
  ProfileStrengthRingTrackIcon,
  ProfileTargetGlyph,
  ProfileTrophyIcon,
} from '../../shared/assets.jsx';
import whoLookingFace1 from '../../../assets/talent-home/home/who-looking-photo-1.png';
import whoLookingFace2 from '../../../assets/talent-home/tabs/search-person-kwesi-mensah-photo.png';
import whoLookingFace3 from '../../../assets/talent-profile/tabs/profile-viewer-face-3.png';
import whoLookingFace4 from '../../../assets/talent-profile/tabs/profile-viewer-face-4.png';
import {
  OVERVIEW_ABOUT,
  OVERVIEW_EXPERIENCE,
  OVERVIEW_PORTFOLIO,
  OVERVIEW_SKILLS,
  PROFILE_BADGES,
  PROFILE_GOAL,
  PROFILE_STRENGTH,
  PROFILE_VIEWS,
} from './talentProfileTabsData.js';
import {
  GlyphTile,
  Meter,
  ProfileCard,
  ProfileChip,
  ProjectCoverArt,
  StreakMark,
  Tag,
  TabLayout,
} from './ProfileTabsUi.jsx';
import { BADGE_ICONS, CARD_PLAIN, GLYPHS, SHELF, TITLE_SM, coverBg } from './profileTabsStyles.js';
import { DISPLAY } from '../talentHome/TabsParts.jsx';
import { ProfileAxVolumeIcon } from './AxAnnotationIcons.jsx';
import { AX_RAIL_LABEL, AX_READING_NOW } from './ProfileAxData.js';

const log = debug('ProfileOverviewTab');

const FACES = [whoLookingFace1, whoLookingFace2, whoLookingFace3, whoLookingFace4];

/* ------------------------------ left column ------------------------------ */
/*
 * AX-04 (read aloud): `reading` marks this card as the one being read — green border + shelf, the dark
 * "Reading now" tag next to the title, the first sentence underlined (Figma 7591:2434 / 8110:391982).
 */
const READING_CARD =
  '!border-[#387440] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:!border-[1.5px] playful:shadow-[4px_4px_0_rgba(56,116,64,0.65),0_10px_24px_rgba(56,116,64,0.15)]';
const FIRST_SENTENCE_LEN = OVERVIEW_ABOUT.text.indexOf('. ') + 1;

export const AboutCard = ({ go, readOnly = false, reading = false }) => (
  <ProfileCard
    title={OVERVIEW_ABOUT.title}
    link={OVERVIEW_ABOUT.link}
    onLink={() => go({ tab: 'about' })}
    onEdit={readOnly ? undefined : () => go({ edit: 'about' })}
    editLabel="Edit About"
    className={reading ? READING_CARD : undefined}
    titleAddon={
      reading ? (
        <span
          data-ax="reading-now"
          className="inline-flex shrink-0 items-center gap-[6px] rounded-full bg-[#1c2a21] px-[10px] py-[6px] text-[12px] leading-[14px] font-semibold whitespace-nowrap text-white playful:border playful:border-[rgba(28,42,33,0.35)]"
        >
          <ProfileAxVolumeIcon className="size-[14px] shrink-0" />
          {AX_READING_NOW}
        </span>
      ) : null
    }
  >
    <div className="flex flex-col gap-[16px]">
      <p
        className={classNames(
          'text-[15px] leading-[23px]',
          reading ? 'text-[#737373]' : 'text-[#595959]'
        )}
      >
        {reading ? (
          <>
            <span className="font-semibold text-[#1c2a21] underline">
              {OVERVIEW_ABOUT.text.slice(0, FIRST_SENTENCE_LEN)}
            </span>
            {OVERVIEW_ABOUT.text.slice(FIRST_SENTENCE_LEN)}
          </>
        ) : (
          OVERVIEW_ABOUT.text
        )}
      </p>
      <div
        className={classNames(
          'flex flex-wrap items-center gap-[8px]',
          OVERVIEW_ABOUT.vibe.length ? null : 'hidden'
        )}
      >
        <span className="text-[12px] leading-[normal] font-semibold whitespace-nowrap text-[#737373]">
          {OVERVIEW_ABOUT.vibeLabel}
        </span>
        {OVERVIEW_ABOUT.vibe.map((v) => (
          <ProfileChip key={v.label} icon={v.icon}>
            {v.label}
          </ProfileChip>
        ))}
      </div>
    </div>
  </ProfileCard>
);

const SkillCard = ({ item }) => (
  <li
    className={classNames(
      CARD_PLAIN,
      'flex min-w-0 items-center gap-[12px] rounded-[16px] p-[14px]'
    )}
  >
    <GlyphTile name={item.icon} size={40} glyph={21} />
    <div className="flex min-w-0 flex-1 flex-col items-start gap-[6px]">
      <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px]">
        <span className="text-[15px] leading-[normal] font-semibold whitespace-nowrap text-[#1c2a21]">
          {item.name}
        </span>
        <ProfileChip tone={item.chip.tone} icon="check">
          {item.chip.label}
        </ProfileChip>
      </div>
      <Meter pct={item.pct} className="w-full max-w-[300px]" />
      <span className="text-[12px] leading-[normal] text-[#737373]">{item.note}</span>
    </div>
  </li>
);

export const SkillsCard = ({ go, readOnly = false }) => (
  <ProfileCard
    title={OVERVIEW_SKILLS.title}
    link={OVERVIEW_SKILLS.link}
    onLink={() => go({ tab: 'skills' })}
    onEdit={readOnly ? undefined : () => go({ tab: 'skills' })}
    editLabel="Edit skills"
  >
    {OVERVIEW_SKILLS.items.length ? (
      <ul data-skill-grid="" className="grid grid-cols-1 gap-[12px] @2xl:grid-cols-2">
        {OVERVIEW_SKILLS.items.map((item) => (
          <SkillCard key={item.key} item={item} />
        ))}
      </ul>
    ) : (
      <p className="text-[14px] leading-[1.5] text-[#737373]">{OVERVIEW_SKILLS.empty}</p>
    )}
  </ProfileCard>
);

export const ExperienceCard = ({ go, readOnly = false }) => (
  <ProfileCard
    title={OVERVIEW_EXPERIENCE.title}
    link={OVERVIEW_EXPERIENCE.link}
    onLink={() => go({ tab: 'experience' })}
    onEdit={readOnly ? undefined : () => go({ tab: 'experience' })}
    editLabel="Edit experience"
  >
    {OVERVIEW_EXPERIENCE.items.length ? null : (
      <p className="text-[14px] leading-[1.5] text-[#737373]">{OVERVIEW_EXPERIENCE.empty}</p>
    )}
    <ul
      className={classNames(
        'flex flex-col gap-[16px]',
        OVERVIEW_EXPERIENCE.items.length ? null : 'hidden'
      )}
    >
      {OVERVIEW_EXPERIENCE.items.map((exp, i) => {
        const Glyph = GLYPHS[exp.icon];
        return (
          <li key={exp.key} className="flex flex-col gap-[16px]">
            {i > 0 ? <span aria-hidden="true" className="h-px w-full bg-[#e6e6e6]" /> : null}
            <div className="flex items-start gap-[16px]">
              <span
                aria-hidden="true"
                className="flex size-[48px] shrink-0 items-center justify-center rounded-[14px] border-[1.5px] border-[#1c2a21]"
                style={{ background: exp.iconBg }}
              >
                <Glyph className="size-[23px]" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
                <h3 className="text-[16px] leading-[normal] font-semibold text-[#1c2a21]">
                  {exp.title}
                </h3>
                <p className="text-[13px] leading-[normal] whitespace-pre-wrap text-[#737373]">
                  {exp.meta}
                </p>
                {exp.text ? (
                  <p className="text-[14px] leading-[normal] text-[#595959]">{exp.text}</p>
                ) : null}
                <div
                  className={classNames(
                    'flex flex-wrap gap-[6px] pt-[6px]',
                    exp.tags.length ? null : 'hidden'
                  )}
                >
                  {exp.tags.map((t) => (
                    <ProfileChip key={t}>{t}</ProfileChip>
                  ))}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  </ProfileCard>
);

const ProjectTile = ({ item }) => (
  <li className="flex min-w-0 flex-col items-start gap-[8px]">
    <div
      className="relative w-full overflow-hidden rounded-[14px] border border-[rgba(28,42,33,0.1)]"
      style={{ background: coverBg(item.cover) }}
    >
      <ProjectCoverArt kind={item.cover} />
      <Tag
        tone="white"
        className="absolute top-[11px] left-[11px] playful:bg-white playful:rotate-3"
      >
        {item.tag}
      </Tag>
    </div>
    <p className="text-[15px] leading-[normal] font-semibold text-[#1c2a21]">{item.title}</p>
    <p className="text-[12px] leading-[normal] text-[#737373]">{item.meta}</p>
  </li>
);

export const PortfolioCard = ({ go, readOnly = false }) => (
  <ProfileCard
    title={OVERVIEW_PORTFOLIO.title}
    link={OVERVIEW_PORTFOLIO.link}
    onLink={() => go({ tab: 'portfolio' })}
    onEdit={readOnly ? undefined : () => go({ tab: 'portfolio' })}
    editLabel="Edit portfolio"
  >
    {OVERVIEW_PORTFOLIO.items.length ? (
      <ul className="grid grid-cols-1 gap-[16px] @lg:grid-cols-2 @3xl:grid-cols-3">
        {OVERVIEW_PORTFOLIO.items.map((item) => (
          <ProjectTile key={item.key} item={item} />
        ))}
      </ul>
    ) : (
      <p className="text-[14px] leading-[1.5] text-[#737373]">{OVERVIEW_PORTFOLIO.empty}</p>
    )}
  </ProfileCard>
);

/* ------------------------------ right rail ------------------------------ */
/*
 * The progress arc of the strength ring, drawn from the real percentage (the exported Figma arc was a fixed ~70%, so
 * 100% showed an open ring). Same geometry as ProfileStrengthRingTrackIcon: 84px box, 8.4px stroke, starts at 12 o'clock.
 */
const RING_R = 37.8;
const RING_C = 2 * Math.PI * RING_R;
const StrengthArc = ({ pct, className }) => {
  const value = Math.max(0, Math.min(100, Number(pct) || 0));
  return (
    <svg viewBox="0 0 84 84" fill="none" aria-hidden="true" className={className}>
      {value > 0 ? (
        <circle
          cx="42"
          cy="42"
          r={RING_R}
          stroke="#387440"
          strokeWidth="8.4"
          strokeLinecap={value >= 100 ? 'butt' : 'round'}
          strokeDasharray={`${(RING_C * value) / 100} ${RING_C}`}
          transform="rotate(-90 42 42)"
        />
      ) : null}
    </svg>
  );
};

/* Live steps are journey stage ids: each opens its stage screen (the demo keys have no route and stay plain text). */
const stageRoute = (key) => STAGE_BY_ID[key]?.route || null;

const StrengthCard = ({ go }) => {
  const navigate = useNavigate();
  const s = PROFILE_STRENGTH;
  const next = s.steps.find((st) => !st.done);
  return (
    <section
      aria-label={s.title}
      className={classNames(
        'flex min-w-0 flex-col gap-[14px] rounded-[20px] bg-white',
        SHELF,
        'p-[clamp(16px,1.39vw,24px)]'
      )}
    >
      <div className="flex items-center gap-[16px]">
        <div
          role="img"
          aria-label={`${s.pct}%`}
          className="relative size-[84px] shrink-0 overflow-hidden"
        >
          <ProfileStrengthRingTrackIcon className="absolute top-0 left-0 size-[84px]" />
          <StrengthArc pct={s.pct} className="absolute top-0 left-0 size-[84px]" />
          <span
            className={classNames(
              DISPLAY,
              'absolute inset-0 flex items-center justify-center text-[22px] leading-[1.25] font-semibold text-[#1c2a21]'
            )}
          >
            {s.pct}%
          </span>
        </div>
        <div className="flex min-w-0 flex-col gap-[4px]">
          <h2 className={classNames(TITLE_SM, 'whitespace-nowrap')}>{s.title}</h2>
          <p className="flex items-center gap-[5px] text-[13px] leading-[normal] font-medium whitespace-nowrap text-[#2d5d33]">
            {s.sub}
            <ProfileTrophyIcon className="size-[15px] shrink-0" />
          </p>
        </div>
      </div>
      <ul className="flex flex-col gap-[14px]">
        {s.steps.map((st) => (
          <li key={st.key} className="flex items-center gap-[10px]">
            <span
              aria-hidden="true"
              className={classNames(
                'flex size-[20px] shrink-0 items-center justify-center rounded-[6px] border-[1.5px]',
                st.done ? 'border-[#387440] bg-[#387440]' : 'border-[#bfbfbf] bg-white'
              )}
            >
              {st.done ? <ProfileCheckWhiteIcon className="size-[13px]" /> : null}
            </span>
            {!st.done && stageRoute(st.key) ? (
              <button
                type="button"
                onClick={() => {
                  log('strength step ->', st.key);
                  navigate(stageRoute(st.key));
                }}
                className="cursor-pointer text-left text-[14px] leading-[normal] font-medium text-[#1c2a21] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {st.label}
              </button>
            ) : (
              <span
                className={classNames(
                  'text-[14px] leading-[normal]',
                  st.done
                    ? 'text-[#737373] line-through'
                    : 'font-medium whitespace-nowrap text-[#1c2a21]'
                )}
              >
                {st.label}
              </span>
            )}
            <span aria-hidden="true" className="h-px min-w-px flex-1" />
            {st.gain ? <ProfileChip tone="green">{st.gain}</ProfileChip> : null}
          </li>
        ))}
      </ul>
      <div className={s.cta ? null : 'hidden'}>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            log('finish my profile ->', next?.key);
            // Live: the next unfinished stage's screen. Demo keys keep the Figma tab behaviour.
            if (stageRoute(next?.key)) navigate(stageRoute(next.key));
            else
              go({
                tab: next?.key === 'endorse' || next?.key === 'skill' ? 'skills' : 'portfolio',
              });
          }}
        >
          {s.cta}
        </Button>
      </div>
    </section>
  );
};

const ViewsCard = () => {
  const v = PROFILE_VIEWS;
  return (
    <ProfileCard title={v.title} link={v.link} onLink={() => log('who’s looking: see all')}>
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-end gap-[12px]">
          <span
            className={classNames(
              DISPLAY,
              'text-[44px] leading-[1.1] font-semibold whitespace-nowrap text-[#1c2a21]'
            )}
          >
            {v.count}
          </span>
          <div className="flex flex-col gap-[2px] pb-[12px]">
            <span className="text-[13px] leading-[normal] font-medium whitespace-nowrap text-[#595959]">
              {v.label}
            </span>
            <span className="text-[12px] leading-[normal] font-semibold whitespace-nowrap text-[#387440]">
              {v.trend}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-[12px]">
          <div
            className={classNames(
              'flex shrink-0 items-center',
              v.showFaces === false ? 'hidden' : null
            )}
            aria-hidden="true"
          >
            {FACES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                width={34}
                height={34}
                draggable="false"
                className={classNames(
                  'size-[34px] rounded-full object-cover',
                  i < 3 && '-mr-[10px]'
                )}
              />
            ))}
          </div>
          <p className="min-w-0 text-[13px] leading-[1.4] text-[#595959]">{v.who}</p>
        </div>
        <div
          className={classNames(
            'flex items-center gap-[8px] rounded-[12px] bg-[#faf4e8] px-[12px] py-[10px]',
            v.searchNote ? null : 'hidden'
          )}
        >
          <span className="flex size-[15px] shrink-0 items-center justify-center">
            <ProfileSearchNoteIcon className="block size-[12px]" />
          </span>
          <span className="text-[13px] leading-[normal] font-medium text-[#463409]">
            {v.searchNote}
          </span>
        </div>
      </div>
    </ProfileCard>
  );
};

const GoalCard = ({ go }) => {
  const g = PROFILE_GOAL;
  if (!g) return null;
  return (
    <ProfileCard title={g.title} onEdit={() => go({ tab: 'about' })} editLabel="Edit goal">
      <div className="flex flex-col items-start gap-[10px] rounded-[14px] bg-[#ebf1ec] p-[16px]">
        <p className="flex items-center gap-[6px] text-[16px] leading-[normal] font-semibold text-[#1c2a21]">
          <ProfileTargetGlyph className="size-[18px] shrink-0" />
          {g.headline}
        </p>
        {g.detail ? (
          <p className="text-[13px] leading-[normal] text-[#2d5d33]">{g.detail}</p>
        ) : null}
        <Meter pct={g.pct} height={8} track="#ffffff" className="w-full" />
        <p className="text-[12px] leading-[normal] font-medium text-[#595959]">{g.progress}</p>
      </div>
    </ProfileCard>
  );
};

export const BadgesCard = ({ preview = false }) =>
  PROFILE_BADGES.items.length === 0 ? null : (
    <ProfileCard
      title={PROFILE_BADGES.title}
      link={PROFILE_BADGES.link}
      onLink={() => log('badges: all 9')}
    >
      <ul className="flex flex-wrap justify-between gap-x-[6px] gap-y-[12px]">
        {PROFILE_BADGES.items
          .filter((b) => !(preview && b.key === 'streak'))
          .map((b) => {
            const Icon = BADGE_ICONS[b.icon];
            return (
              <li key={b.key} className="flex w-[88px] flex-col items-center gap-[6px]">
                <span
                  aria-hidden="true"
                  className={classNames(
                    'flex size-[56px] items-center justify-center rounded-full',
                    SHELF
                  )}
                  style={{ background: b.bg }}
                >
                  {b.icon === 'streak' ? (
                    <StreakMark className="size-[34px]" />
                  ) : (
                    <Icon className="size-[25px]" />
                  )}
                </span>
                <span className="text-[11px] max-lg:text-[12px] leading-[normal] font-medium whitespace-nowrap text-[#595959]">
                  {b.label}
                </span>
              </li>
            );
          })}
      </ul>
    </ProfileCard>
  );

/*
 * ProfileOverviewTab — P-01 (Figma Focused 8110:368104 / Playful 7570:105): About, Top skills,
 * Experience, Portfolio on the left; Profile strength, Who's looking, My goal, Badges on the right.
 * "See all" links and pencils move to the matching tab via `profile.update({ tab })`; About's pencil
 * opens the in-place editor (`edit=about`).
 */
const ProfileOverviewTab = ({ profile }) => {
  useEffect(() => {
    log('mount', { tab: profile?.tab });
  }, [profile?.tab]);

  const go = (patch) => {
    log('navigate', patch);
    profile?.update?.(patch);
  };

  return (
    <TabLayout
      tab="overview"
      rightLabel={AX_RAIL_LABEL}
      left={
        <>
          <AboutCard go={go} reading={profile?.ax === 'aloud'} />
          <SkillsCard go={go} />
          <ExperienceCard go={go} />
          <PortfolioCard go={go} />
        </>
      }
      right={
        <>
          <StrengthCard go={go} />
          <ViewsCard />
          <GoalCard go={go} />
          <BadgesCard />
        </>
      }
    />
  );
};

export default ProfileOverviewTab;
