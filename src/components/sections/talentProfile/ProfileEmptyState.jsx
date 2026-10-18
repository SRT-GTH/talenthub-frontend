import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ProfileCameraIcon,
  ProfileCheckWhiteIcon,
  ProfileDoodleSparkleLargeIcon,
  ProfileDoodleSparkleMediumIcon,
  ProfileDoodleSparkleSmallIcon,
  ProfileDoodleSquiggleIcon,
  ProfileEmptyAddProjectIcon,
  ProfileEmptyDiscoverEyeIcon,
  ProfileEmptyHeadlinePencilIcon,
  ProfileEmptyRingArcIcon,
  ProfileEmptyTipBulbIcon,
  ProfilePitchPlayIcon,
  ProfileSpotAboutIllustration,
  ProfileSpotJobsIllustration,
  ProfileSpotPortfolioIllustration,
  ProfileSpotSkillsIllustration,
  ProfileStrengthRingTrackIcon,
  TalentSidebarProfileAvatarIllustration,
} from '../../shared/assets.jsx';
import ringDoodle from '../../../assets/talent-profile/tabs/profile-cover-doodle-ring.png';
import { DISPLAY } from '../talentHome/TabsParts.jsx';

const log = debug('ProfileEmptyState');

/*
 * ProfileEmptyState — P-10 "New profile (mostly empty)". Figma Focused 8110:373025 / Playful 7574:1412.
 * Replaces header + tabs + body when `?empty=1`. All copy is verbatim from the frames.
 * Hero / content widths follow the 1329px desktop frame and collapse with container queries.
 */

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

// Local copies of the shared surface tokens (kept local so this file does not depend on the Tabs kit).
const CARD_PLAIN = 'rounded-[20px] border border-[#e6e6e6] bg-white';
const SHELF =
  'border border-[rgba(28,42,33,0.1)] shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_24px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]';

// Pill sticker: Focused = soft green pill; Playful = yellow ink-bordered sticker with a 2px shelf.
const Tag = ({ size = 11, className, children }) => (
  <span
    className={classNames(
      'inline-flex items-center gap-[6px] rounded-full bg-[#ebf1ec] px-[10px] py-[5px] leading-[normal] font-bold whitespace-nowrap text-[#1f4d26]',
      'playful:border-[1.2px] playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]',
      size === 12 ? 'text-[12px]' : 'text-[11px] max-lg:text-[12px]',
      className
    )}
  >
    {children}
  </span>
);

const EMPTY_PROFILE = {
  name: 'Kofi Agyekum',
  badge: 'New here',
  handle: '@kofi.agyekum · joined today',
  headline: 'Add a headline so recruiters know what you do',
  rolesChip: '+ What roles are you open to?',
  pitch: { title: 'Add your 60-sec pitch', meta: 'Profiles with a pitch get 3× more views' },
  preview: 'Preview as recruiter',
};

// Tab strip of the empty profile: counts are 0 (hidden on Overview + About me, as in the frame).
const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'skills', label: 'Skills', count: '0' },
  { key: 'experience', label: 'Experience', count: '0' },
  { key: 'portfolio', label: 'Portfolio', count: '0' },
  { key: 'certs', label: 'Certs', count: '0' },
  { key: 'about', label: 'About me' },
];

const SECTIONS = [
  {
    key: 'about',
    title: 'About',
    Spot: ProfileSpotAboutIllustration,
    heading: 'Say hi in 2–3 lines',
    body: 'Who you are, what you’re into, what you want next. Recruiters read this first.',
    actions: [
      { label: 'Write with Career Buddy', variant: 'primary', to: { edit: 'about', empty: null } },
      { label: 'Write it myself', variant: 'tertiary', to: { edit: 'about', empty: null } },
    ],
  },
  {
    key: 'skills',
    title: 'Skills',
    Spot: ProfileSpotSkillsIllustration,
    heading: 'Add 3 skills to start getting matched',
    body: 'Then prove one in Skills Lab to get the green tick.',
    actions: [
      { label: 'Add skills', variant: 'primary', to: { tab: 'skills', empty: null } },
      { label: 'Try a Skills Lab', variant: 'tertiary', to: null },
    ],
  },
  {
    key: 'experience',
    title: 'Experience',
    Spot: ProfileSpotJobsIllustration,
    heading: 'No job yet? That’s normal',
    body: 'Add school projects, NSS, volunteering, church or club roles, a side hustle.',
    actions: [
      { label: 'Add experience', variant: 'primary', to: { modal: 'experience' } },
      { label: 'Upload CV instead', variant: 'tertiary', to: null },
    ],
  },
  {
    key: 'portfolio',
    title: 'Portfolio',
    Spot: ProfileSpotPortfolioIllustration,
    heading: 'Show something you made',
    body: 'A dashboard, code, designs, a video. One project beats a long CV.',
    actions: [
      { label: 'Add a project', variant: 'project', to: { tab: 'portfolio', empty: null } },
    ],
  },
];

const STEPS = [
  { label: 'Pick your avatar', done: true },
  { label: 'Add a headline', gain: '+15%' },
  { label: 'Add 3 skills', gain: '+20%' },
  { label: 'Write your About', gain: '+15%' },
  { label: 'Add a project or experience', gain: '+20%' },
];

/* Playful-only cover doodles (Figma cover/doodle/*), positioned as % of the cover so they scale. */
const CoverDoodles = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden playful:block">
    <img
      src={ringDoodle}
      alt=""
      draggable="false"
      className="absolute top-[-40%] left-[73.7%] aspect-square h-[146.7%] max-w-none"
    />
    <ProfileDoodleSquiggleIcon className="absolute top-[26.7%] left-[31.6%] h-auto w-[9.03%]" />
    <ProfileDoodleSparkleLargeIcon className="absolute top-[60%] left-[48.2%] aspect-square h-[14.7%] w-auto" />
    <ProfileDoodleSparkleSmallIcon className="absolute top-[18.7%] left-[19.6%] aspect-square h-[9.3%] w-auto" />
    <ProfileDoodleSparkleMediumIcon className="absolute top-[69.3%] left-[90.3%] aspect-square h-[12%] w-auto" />
  </div>
);

const Avatar = () => (
  <div
    className={classNames(
      'relative -mt-[calc(var(--av)/2)] size-[var(--av)] shrink-0 rounded-full bg-white',
      SHELF
    )}
  >
    <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
      <span className="relative block size-[89.4%] overflow-hidden rounded-full bg-[#387440] playful:bg-[linear-gradient(135deg,#387440_14.6%,#7aa870_85.3%)]">
        <TalentSidebarProfileAvatarIllustration className="absolute -top-[6.45%] -left-[5.65%] block h-auto w-[111.3%] max-w-none" />
      </span>
    </span>
    <button
      type="button"
      aria-label="Change photo"
      onClick={() => log('change photo clicked (no backend)')}
      className={classNames(
        'absolute right-0 bottom-[2px] flex size-[34px] cursor-pointer items-center justify-center rounded-full border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] playful:border-[1.5px] playful:border-[#1c2a21]',
        FOCUS
      )}
    >
      <ProfileCameraIcon className="size-[15px]" />
    </button>
  </div>
);

const EmptyHero = ({ profile }) => {
  const p = EMPTY_PROFILE;
  return (
    <div className="@container">
      <section
        aria-label="Profile header"
        className={classNames('relative overflow-hidden rounded-[24px] bg-white', SHELF)}
        style={{ '--av': 'clamp(84px, 7.64vw, 132px)' }}
      >
        <div className="relative -mx-px -mt-px h-[clamp(112px,8.68vw,150px)] overflow-hidden bg-[#387440] playful:-mx-[1.5px] playful:-mt-[1.5px]">
          <CoverDoodles />
          <button
            type="button"
            onClick={() => log('pitch chip clicked (no backend)')}
            className={classNames(
              'absolute right-[12px] bottom-[10px] flex cursor-pointer items-center gap-[10px] rounded-full border-[1.5px] border-dashed border-[#1c2a21] bg-white py-[8px] pr-[14px] pl-[8px] text-left @5xl:top-[24px] @5xl:right-[3.9%] @5xl:bottom-auto',
              FOCUS
            )}
          >
            <ProfilePitchPlayIcon className="size-[28px] shrink-0" />
            <span className="flex flex-col leading-[normal] whitespace-nowrap">
              <span className="text-[13px] font-semibold text-[#1c2a21]">{p.pitch.title}</span>
              <span className="text-[11px] max-lg:text-[12px] text-[#737373]">{p.pitch.meta}</span>
            </span>
          </button>
        </div>

        <div className="flex flex-col px-[clamp(12px,1.85vw,32px)] pb-[clamp(16px,1.56vw,27px)] @5xl:flex-row @5xl:items-start">
          <div className="flex min-w-0 flex-col gap-x-[clamp(12px,1.4vw,24px)] @2xl:flex-row @5xl:flex-1">
            <Avatar />
            <div className="mt-[10px] flex min-w-0 flex-1 flex-col gap-[6px]">
              <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[4px]">
                <h1
                  className={classNames(
                    DISPLAY,
                    'text-[clamp(26px,2.14vw,37px)] leading-[1.2] font-semibold whitespace-nowrap text-[#1c2a21]'
                  )}
                >
                  {p.name}
                </h1>
                <Tag className="playful:-rotate-3">{p.badge}</Tag>
              </div>
              <p className="text-[13px] leading-[normal] text-[#737373]">{p.handle}</p>
              <button
                type="button"
                onClick={() => log('headline clicked (no backend)')}
                className={classNames(
                  'flex w-fit max-w-full cursor-pointer items-center gap-[6px] text-left text-[16px] leading-[normal] font-medium text-[#387440]',
                  FOCUS
                )}
              >
                <span>{p.headline}</span>
                <ProfileEmptyHeadlinePencilIcon className="size-[18px] shrink-0" />
              </button>
              <div className="flex flex-wrap gap-[8px] pt-[6px]">
                <button
                  type="button"
                  onClick={() => log('roles chip clicked (no backend)')}
                  className={classNames(
                    'inline-flex h-[32px] cursor-pointer items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#595959]',
                    FOCUS
                  )}
                >
                  {p.rolesChip}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-[16px] flex items-center @5xl:mt-[18px] @5xl:ml-[24px]">
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => {
                log('preview as recruiter -> view=recruiter');
                profile.update({ view: 'recruiter' });
              }}
            >
              {p.preview}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const EmptyTabs = ({ profile }) => {
  const active = profile.tab ?? 'overview';
  return (
    <nav aria-label="Profile sections" className="@container">
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex items-end gap-[4px] overflow-x-auto border-b border-[#e1eae2] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`profile-tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls="profile-tabpanel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => {
                log('tab ->', tab.key);
                profile.update({ tab: tab.key === 'overview' ? null : tab.key });
              }}
              className={classNames(
                'flex shrink-0 cursor-pointer items-center gap-[8px] border-b-[3px] px-[14px] pt-[10px] pb-[12px] text-[15px] leading-[normal] whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]',
                isActive
                  ? 'border-[#387440] font-semibold text-[#387440]'
                  : 'border-transparent font-medium text-[#737373] hover:text-[#1c2a21]'
              )}
            >
              {tab.label}
              {tab.count ? (
                <span
                  className={classNames(
                    'rounded-full px-[7px] py-px text-[11.5px] max-lg:text-[12px] leading-[normal] font-bold',
                    isActive ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
                  )}
                >
                  {tab.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const SectionCard = ({ section, profile }) => {
  const { Spot } = section;
  const go = (action) => {
    log('empty card action', { section: section.key, action: action.label });
    if (action.to) profile.update(action.to);
  };
  return (
    <section
      aria-label={section.title}
      className={classNames(
        CARD_PLAIN,
        'flex min-w-0 flex-col gap-[14px] p-[clamp(16px,1.39vw,24px)]'
      )}
    >
      <h2
        className={classNames(
          DISPLAY,
          'text-[clamp(19px,1.33vw,23px)] leading-[1.25] font-semibold text-[#1c2a21]'
        )}
      >
        {section.title}
      </h2>
      <div className="flex flex-col gap-[18px] rounded-[16px] border-[1.5px] border-dashed border-[#bfbfbf] bg-[#f8f8f4] p-[clamp(14px,1.16vw,20px)] @2xl:flex-row @2xl:items-center">
        <Spot className="size-[clamp(72px,6vw,104px)] shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <p className="text-[16px] leading-[normal] font-semibold text-[#1c2a21]">
            {section.heading}
          </p>
          <p className="text-[14px] leading-[1.5] text-[#595959]">{section.body}</p>
        </div>
        <div className="flex flex-wrap items-center gap-[10px]">
          {section.actions.map((a) =>
            a.variant === 'project' ? (
              <Button
                key={a.label}
                variant="tertiary"
                size="sm"
                onClick={() => go(a)}
                leftIcon={<ProfileEmptyAddProjectIcon />}
                className="max-lg:!px-[12px] lg:!h-[48px] lg:!rounded-[14px] lg:!px-[12px] lg:!py-0"
              >
                {a.label}
              </Button>
            ) : (
              <Button key={a.label} variant={a.variant} size="sm" onClick={() => go(a)}>
                {a.label}
              </Button>
            )
          )}
        </div>
      </div>
    </section>
  );
};

const StrengthCard = () => (
  <section
    aria-label="Profile strength"
    className={classNames(
      'flex min-w-0 flex-col gap-[14px] overflow-hidden rounded-[20px] bg-white p-[clamp(16px,1.39vw,24px)]',
      SHELF
    )}
  >
    <div className="flex items-center gap-[16px]">
      <div className="relative size-[84px] shrink-0 overflow-hidden">
        <ProfileStrengthRingTrackIcon className="absolute top-0 left-0 size-[84px]" />
        <ProfileEmptyRingArcIcon className="absolute top-0 right-[2.45%] bottom-[62.36%] left-1/2 block h-auto w-auto" />
        <span
          className={classNames(
            DISPLAY,
            'absolute top-[26.5px] left-[24.5px] text-[22px] leading-[1.25] font-semibold whitespace-nowrap text-[#1c2a21]'
          )}
        >
          20%
        </span>
      </div>
      <div className="flex min-w-0 flex-col gap-[4px]">
        <h2
          className={classNames(
            DISPLAY,
            'text-[clamp(18px,1.22vw,21px)] leading-[1.25] font-semibold text-[#1c2a21]'
          )}
        >
          Profile strength
        </h2>
        <p className="flex items-center gap-[5px] text-[13px] leading-[normal] font-medium text-[#2d5d33]">
          You’re 5 steps from Discoverable
          <ProfileEmptyDiscoverEyeIcon className="size-[15px] shrink-0" />
        </p>
      </div>
    </div>
    <ul className="flex flex-col gap-[14px]">
      {STEPS.map((s) => (
        <li key={s.label} className="flex items-center gap-[10px]">
          {s.done ? (
            <span
              aria-hidden="true"
              className="flex size-[20px] shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-[#387440] bg-[#387440] playful:border-[1.5px]"
            >
              <ProfileCheckWhiteIcon className="size-[13px]" />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="size-[20px] shrink-0 rounded-[6px] border-[1.5px] border-[#bfbfbf] bg-white"
            />
          )}
          <span
            className={classNames(
              'text-[14px] leading-[normal] whitespace-nowrap',
              s.done ? 'text-[#737373] line-through' : 'font-medium text-[#1c2a21]'
            )}
          >
            {s.label}
          </span>
          <span className="h-px min-w-px flex-1" aria-hidden="true" />
          {s.gain ? (
            <span className="inline-flex h-[32px] shrink-0 items-center rounded-full border border-[#c1d4c4] bg-[#ebf1ec] px-[14px] text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#387440]">
              {s.gain}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
    <Button
      variant="primary"
      size="sm"
      onClick={() => log('Do the next step (no backend)')}
      className="w-full"
    >
      Do the next step
    </Button>
  </section>
);

const WhyCard = () => (
  <section
    aria-label="Why it matters"
    className={classNames(
      'flex min-w-0 flex-col gap-[10px] overflow-hidden rounded-[20px] bg-[#faf4e8] p-[clamp(16px,1.39vw,24px)]',
      SHELF
    )}
  >
    <Tag size={12} className="w-fit playful:rotate-3">
      Did you know?
      <ProfileEmptyTipBulbIcon className="size-[14px] shrink-0" />
    </Tag>
    <p className={classNames(DISPLAY, 'text-[19px] leading-[1.25] font-semibold text-[#1c2a21]')}>
      Recruiters only search profiles that are 60%+ complete
    </p>
    <p className="text-[14px] leading-[1.5] text-[#463409]">
      Hit 60% and you start showing up in “Matched to you” for real roles in Ghana.
    </p>
  </section>
);

const ProfileEmptyState = ({ profile }) => {
  useEffect(() => {
    log('mount', { tab: profile?.tab });
  }, [profile?.tab]);

  return (
    <>
      <EmptyHero profile={profile} />
      <EmptyTabs profile={profile} />
      <div
        id="profile-tabpanel"
        role="tabpanel"
        aria-labelledby={`profile-tab-${profile.tab ?? 'overview'}`}
        className="@container"
      >
        <div className="grid grid-cols-1 items-start gap-[clamp(16px,1.39vw,24px)] @4xl:grid-cols-[minmax(0,880fr)_minmax(0,425fr)]">
          <div className="flex min-w-0 flex-col gap-[clamp(14px,1.16vw,20px)]">
            {SECTIONS.map((s) => (
              <SectionCard key={s.key} section={s} profile={profile} />
            ))}
          </div>
          <div className="flex min-w-0 flex-col gap-[clamp(14px,1.16vw,20px)]">
            <StrengthCard />
            <WhyCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileEmptyState;
