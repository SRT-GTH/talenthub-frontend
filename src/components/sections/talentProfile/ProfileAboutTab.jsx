import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  ProfileLockGlyph,
  ProfilePitchPlayLargeIcon,
  ProfileTraitThumbIcon,
  TalentSidebarProfileAvatarIllustration,
} from '../../shared/assets.jsx';
import {
  ABOUT_BIO,
  ABOUT_GOALS,
  ABOUT_INTERESTS,
  ABOUT_PITCH,
  ABOUT_TRAITS,
  ABOUT_WORK_STYLE,
} from './talentProfileTabsData.js';
import { EditButton, HeadLink, ProfileCard, ProfileChip, TabLayout } from './ProfileTabsUi.jsx';
import { CARD_PLAIN, GLYPHS, PAD, TITLE } from './profileTabsStyles.js';

const log = debug('ProfileAboutTab');

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/* The pitch video poster: 240px avatar disc, 72px play button, caption + "CC on" chip. */
const PitchCard = () => {
  const p = ABOUT_PITCH;
  return (
    <section
      aria-label={p.title}
      className={classNames(CARD_PLAIN, 'flex min-w-0 flex-col gap-[16px] overflow-hidden', PAD)}
    >
      <header className="flex items-center gap-[10px]">
        <h2 className={classNames(TITLE, 'min-w-0 truncate')}>{p.title}</h2>
        <span aria-hidden="true" className="h-px min-w-px flex-1" />
        <HeadLink onClick={() => log('re-record pitch (no backend)')}>{p.link}</HeadLink>
        <EditButton label="Edit pitch" onClick={() => log('edit pitch (no backend)')} />
      </header>

      <div className="relative flex min-h-[200px] w-full flex-col items-center gap-[12px] overflow-hidden rounded-[16px] border border-[rgba(28,42,33,0.1)] bg-[#2d5d33] px-[12px] pt-[20px] pb-[12px] @2xl:block @2xl:h-[clamp(240px,17.4vw,300px)] @2xl:p-0">
        <div className="relative size-[clamp(130px,13.9vw,240px)] shrink-0 @2xl:absolute @2xl:top-[13%] @2xl:left-1/2 @2xl:-translate-x-1/2">
          <span className="absolute inset-0 block overflow-hidden rounded-full bg-[#387440] playful:bg-[linear-gradient(135deg,#387440_14.6%,#7aa870_85.3%)]">
            <TalentSidebarProfileAvatarIllustration className="absolute -top-[6.45%] -left-[5.6%] block h-auto w-[111.3%] max-w-none" />
          </span>
          <button
            type="button"
            aria-label="Play pitch"
            onClick={() => log('play pitch')}
            className={classNames(
              'absolute top-[30.8%] left-1/2 block size-[30%] -translate-x-1/2 cursor-pointer rounded-full',
              FOCUS
            )}
          >
            <ProfilePitchPlayLargeIcon className="pointer-events-none absolute top-[-19.44%] left-[-33.33%] block size-[166.7%] max-w-none" />
          </button>
        </div>
        <p className="rounded-[10px] bg-[#1c2a21] px-[12px] py-[8px] text-[13px] leading-[normal] font-medium text-white @2xl:absolute @2xl:bottom-[25px] @2xl:left-[23px]">
          {p.caption}
        </p>
        <ProfileChip className="@2xl:absolute @2xl:right-[5px] @2xl:bottom-[21px]">
          {p.chip}
        </ProfileChip>
      </div>

      <p className="flex flex-wrap items-center gap-x-[16px] gap-y-[4px] text-[13px] leading-[normal] font-medium text-[#595959]">
        {p.stats.map((s, i) => (
          <span key={s} className="flex items-center gap-[16px]">
            {i > 0 ? (
              <span aria-hidden="true" className="text-[#bfbfbf]">
                ·
              </span>
            ) : null}
            {s}
          </span>
        ))}
      </p>
    </section>
  );
};

const BioCard = ({ onEdit }) => (
  <ProfileCard title={ABOUT_BIO.title} onEdit={onEdit} editLabel="Edit bio">
    <div className="flex flex-col gap-[22.5px] text-[15px] leading-[1.5] text-[#595959]">
      {ABOUT_BIO.paragraphs.map((t) => (
        <p key={t}>{t}</p>
      ))}
    </div>
  </ProfileCard>
);

const Trait = ({ row }) => (
  <li className="grid grid-cols-2 items-center gap-x-[14px] gap-y-[8px] @2xl:grid-cols-[minmax(0,120px)_minmax(0,1fr)_minmax(0,120px)]">
    <span className="order-1 text-[14px] leading-[normal] font-semibold text-[#1c2a21]">
      {row.left}
    </span>
    <span
      role="img"
      aria-label={`${row.left} to ${row.right}`}
      className="relative order-3 col-span-2 block h-[10px] rounded-full bg-[#e1eae2] @2xl:order-2 @2xl:col-span-1"
    >
      <span
        className="absolute -top-[6px] block size-[22px]"
        style={{ left: `calc((100% - 22px) * ${row.pos})` }}
      >
        <ProfileTraitThumbIcon className="block size-full" />
      </span>
    </span>
    <span className="order-2 text-right text-[14px] leading-[normal] font-medium text-[#737373] @2xl:order-3">
      {row.right}
    </span>
  </li>
);

const TraitsCard = ({ onEdit }) => {
  const t = ABOUT_TRAITS;
  return (
    <section
      aria-label={t.title}
      className={classNames(CARD_PLAIN, 'flex min-w-0 flex-col gap-[16px] overflow-hidden', PAD)}
    >
      <header className="flex flex-wrap items-center gap-x-[10px] gap-y-[8px]">
        <h2 className={TITLE}>{t.title}</h2>
        <span aria-hidden="true" className="h-px min-w-px flex-1" />
        <EditButton label="Edit how I work" onClick={onEdit} />
        <ProfileChip>{t.chip}</ProfileChip>
      </header>
      <ul className="flex flex-col gap-[16px]">
        {t.rows.map((row) => (
          <Trait key={row.key} row={row} />
        ))}
      </ul>
    </section>
  );
};

const GoalsCard = ({ onEdit }) => {
  const g = ABOUT_GOALS;
  return (
    <ProfileCard title={g.title} onEdit={onEdit} editLabel="Edit goals">
      <div className="flex flex-col gap-[16px]">
        {g.items.map((it) => {
          const Glyph = GLYPHS[it.icon];
          return (
            <div
              key={it.key}
              className={classNames(
                'flex flex-col items-start gap-[8px] rounded-[14px] p-[16px]',
                it.primary ? 'bg-[#ebf1ec]' : 'bg-[#f8f8f4]'
              )}
            >
              <p className="flex items-center gap-[6px] text-[15px] leading-[normal] font-semibold text-[#1c2a21]">
                <Glyph className="size-[17px] shrink-0" />
                {it.headline}
              </p>
              <p
                className={classNames(
                  'text-[13px] leading-[normal]',
                  it.primary ? 'text-[#2d5d33]' : 'text-[#595959]'
                )}
              >
                {it.detail}
              </p>
            </div>
          );
        })}
        {g.items.length ? null : (
          <p className="text-[14px] leading-[1.5] text-[#737373]">
            No goal yet. Tell Career Buddy a career you’re aiming for.
          </p>
        )}
        {g.salary ? (
          <p className="flex items-center gap-[8px] rounded-[12px] bg-[#faf4e8] px-[12px] py-[10px] text-[13px] leading-[normal] font-medium text-[#463409]">
            <ProfileLockGlyph className="size-[14px] shrink-0" />
            {g.salary}
          </p>
        ) : null}
      </div>
    </ProfileCard>
  );
};

const InterestsCard = ({ onEdit }) => (
  <ProfileCard title={ABOUT_INTERESTS.title} onEdit={onEdit} editLabel="Edit interests">
    <ul className="flex flex-wrap gap-[8px]">
      {ABOUT_INTERESTS.chips.map((c) => (
        <li key={c.label}>
          <ProfileChip icon={c.icon}>{c.label}</ProfileChip>
        </li>
      ))}
    </ul>
  </ProfileCard>
);

const WorkStyleCard = ({ onEdit }) => (
  <ProfileCard title={ABOUT_WORK_STYLE.title} onEdit={onEdit} editLabel="Edit work style">
    <dl className="flex flex-col gap-[16px]">
      {ABOUT_WORK_STYLE.rows.map((r) => (
        <div key={r.label} className="flex items-start gap-[10px]">
          <dt className="w-[110px] shrink-0 text-[13px] leading-[normal] font-medium text-[#737373]">
            {r.label}
          </dt>
          <dd className="min-w-0 flex-1 text-[14px] leading-[1.5] font-medium text-[#1c2a21]">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  </ProfileCard>
);

/*
 * ProfileAboutTab — P-06 (Figma Focused 8110:370695 / Playful 7572:1869). Pitch video poster, bio and
 * "How I work" on the left; goals, interests and work style on the right. Bio's pencil opens the
 * in-place editor (`edit=about`).
 */
const ProfileAboutTab = ({ profile }) => {
  useEffect(() => {
    log('mount', { tab: profile?.tab });
  }, [profile?.tab]);

  const editAbout = () => {
    log('edit about');
    profile?.update?.({ edit: 'about' });
  };
  const edit = (what) => () => log('edit', what, '(no frame)');

  return (
    <TabLayout
      tab="about"
      left={
        <>
          {ABOUT_PITCH ? <PitchCard /> : null}
          <BioCard onEdit={editAbout} />
          <TraitsCard onEdit={edit('traits')} />
        </>
      }
      right={
        <>
          <GoalsCard onEdit={edit('goals')} />
          <InterestsCard onEdit={edit('interests')} />
          <WorkStyleCard onEdit={edit('work style')} />
        </>
      }
    />
  );
};

export default ProfileAboutTab;
