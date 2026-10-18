import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ProfileCBulbIcon,
  ProfileEyeIcon,
  ProfileFileDarkGlyph,
  ProfileHourglassGlyph,
  ProfileLockGlyph,
  ProfilePhoneGlyph,
  ProfileTargetGlyph,
  ProfileVoiceGlyph,
  ProfileWalletGlyph,
} from '../../shared/assets.jsx';
import ProfileHeader from './ProfileHeader.jsx';
import ProfileTabBar from './ProfileTabBar.jsx';
import {
  AboutCard,
  BadgesCard,
  ExperienceCard,
  PortfolioCard,
  SkillsCard,
} from './ProfileOverviewTab.jsx';
import {
  HeadLink,
  ProfileCard,
  ProfileChip,
  StreakMark,
  TabLayout,
  Tag,
} from './ProfileTabsUi.jsx';
import { SHELF } from './profileTabsStyles.js';
import { DISPLAY } from '../talentHome/TabsParts.jsx';
import { PITCH_HIDDEN, PUBLIC_RAIL, RECRUITER_RAIL } from './talentProfilePreviewData.js';

const log = debug('PublicProfileView');

/*
 * PublicProfileView — the recruiter and public-link previews of the profile, drawn INSIDE the talent
 * shell (all three Figma frames carry the sidebar + nav; the wiki's earlier "no shell" note was wrong).
 *   mode "recruiter"  P-07  Playful 7573:602  / Focused 8110:371211
 *                     PR-04 (`updated`: pitch hidden) 7584:3137 / 8110:388716 — cover chip, a leading
 *                     "Pitch video · Just now" row, an info bar and a saved toast with Undo.
 *   mode "public"     PR-02 7584:1691 / 8110:387366 — Copy link / Join GTH buttons, "Find talent like
 *                     Kofi" card, "Also hidden on the public link".
 * Layout = ProfileHeader(mode) + the tab bar + the Overview left column in read-only form (no pencils)
 * + a mode-specific right rail + Badges. The banner above it is <ProfilePreviewBanner/>.
 *
 * Props: profile (useTalentProfileState object). Mode comes from `profile.view`.
 */
const ROW_ICONS = {
  wallet: ProfileWalletGlyph,
  target: ProfileTargetGlyph,
  eye: ProfileEyeIcon,
  streak: StreakMark,
  hourglass: ProfileHourglassGlyph,
  // Figma's `icon/video` is an empty instance (nothing drawn): keep the 15px slot, no glyph.
  video: null,
  file: ProfileFileDarkGlyph,
  voice: ProfileVoiceGlyph,
  phone: ProfilePhoneGlyph,
};

const HiddenRow = ({ icon, label, labelFocused, children, tinted = false }) => {
  const { uiStyle } = useUiStyle();
  const Icon = ROW_ICONS[icon];
  const text = uiStyle !== 'playful' && labelFocused ? labelFocused : label;
  return (
    <li
      className={classNames(
        'flex items-center gap-[10px]',
        tinted ? '-mx-[8px] rounded-[8px] bg-[#faf4e8] px-[8px] py-[6px]' : null
      )}
    >
      <span aria-hidden="true" className="flex size-[15px] shrink-0 items-center justify-center">
        {Icon ? <Icon className="block size-full" /> : null}
      </span>
      <span className="min-w-0 flex-1 text-[14px] leading-[normal] font-medium text-[#595959]">
        {text}
      </span>
      {children}
      <ProfileLockGlyph className="size-[14px] shrink-0" />
    </li>
  );
};

const HiddenCard = ({ data, manage, pitchRow }) => (
  <ProfileCard title={data.title} bodyClassName="flex flex-col gap-[16px]">
    <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
      {pitchRow ? (
        <HiddenRow icon={pitchRow.icon} label={pitchRow.label} tinted>
          <span className="rounded-full border border-[#e1eae2] bg-white px-[14px] py-[7px] text-[13px] leading-[normal] font-semibold text-[#595959]">
            {pitchRow.chip}
          </span>
        </HiddenRow>
      ) : null}
      {data.rows.map((r) => (
        <HiddenRow key={r.label} icon={r.icon} label={r.label} labelFocused={r.labelFocused} />
      ))}
    </ul>
    <HeadLink onClick={manage} className="self-start">
      {data.link}
    </HeadLink>
  </ProfileCard>
);

const MatchCard = () => {
  const m = RECRUITER_RAIL.match;
  return (
    <section
      aria-label={m.eyebrow}
      className={classNames(
        'flex min-w-0 flex-col gap-[12px] rounded-[20px] bg-white p-[24px]',
        SHELF
      )}
    >
      <p className="m-0 text-[13px] leading-[normal] font-semibold text-[#737373]">{m.eyebrow}</p>
      <div className="flex items-center gap-[10px]">
        <span
          className={classNames(DISPLAY, 'text-[40px] leading-[44px] font-semibold text-[#1c2a21]')}
        >
          {m.pct}
        </span>
        <span className="pt-[10px] text-[14px] leading-[normal] font-semibold text-[#2d5d33]">
          {m.word}
        </span>
      </div>
      <div className="flex flex-wrap gap-[6px]">
        {m.why.map((w) => (
          <ProfileChip key={w} tone="green" icon="check">
            {w}
          </ProfileChip>
        ))}
      </div>
      <p className="m-0 text-[12px] leading-[14px] text-[#737373]">{m.note}</p>
    </section>
  );
};

const JoinCard = () => {
  const j = PUBLIC_RAIL.join;
  return (
    <section
      aria-label={j.title}
      className={classNames(
        'flex min-w-0 flex-col items-start gap-[12px] rounded-[20px] bg-[#1c2a21] p-[24px]',
        'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
      )}
    >
      <span className="inline-flex items-center gap-[6px] rounded-full border border-[#1c2a21] bg-[#84cc16] px-[10px] py-[5px] text-[12px] leading-[14px] font-bold text-[#1c2a21]">
        {j.sticker}
        <ProfileEyeIcon className="size-[15px]" />
      </span>
      <h2
        className={classNames(DISPLAY, 'm-0 text-[22px] leading-[28px] font-semibold text-white')}
      >
        {j.title}
      </h2>
      <p className="m-0 text-[14px] leading-[21px] text-[#bfbfbf]">{j.body}</p>
      <Button
        variant="primary"
        size="sm"
        onClick={() => log('create recruiter account (no backend)')}
      >
        {j.cta}
      </Button>
    </section>
  );
};

/* PR-04 bottom-centre overlays: info bar above a "Saved" toast. */
const PitchHiddenOverlays = ({ undo }) => (
  <div className="pointer-events-none sticky bottom-[clamp(12px,1.4vw,24px)] z-20 mx-auto flex w-full max-w-[430px] flex-col items-stretch gap-[10px]">
    <p className="pointer-events-auto m-0 flex items-center gap-[8px] rounded-[10px] border border-[#c8951a] bg-[#faf4e8] px-[12px] py-[8px] text-[12px] leading-[14px] font-medium text-[#463409]">
      <ProfileCBulbIcon className="size-[14px] shrink-0" />
      {PITCH_HIDDEN.info}
    </p>
    <div
      role="status"
      className="pointer-events-auto flex items-center gap-[12px] rounded-[16px] bg-[#1c2a21] py-[14px] pr-[14px] pl-[18px] shadow-[0_10px_24px_rgba(28,42,33,0.06)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]"
    >
      <svg viewBox="0 0 18 18" aria-hidden="true" className="size-[18px] shrink-0">
        <path
          d="M4.5 9.5 7.5 12.5 13.5 5.5"
          fill="none"
          stroke="#84cc16"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="m-0 min-w-0 flex-1 text-[14px] leading-[17px] font-semibold text-white">
        {PITCH_HIDDEN.toast}
      </p>
      <button
        type="button"
        onClick={undo}
        className="shrink-0 cursor-pointer rounded-[8px] border border-[rgba(28,42,33,0.35)] px-[12px] py-[6px] text-[13px] leading-[16px] font-semibold text-[#ffd86b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd86b]"
      >
        {PITCH_HIDDEN.undo}
      </button>
    </div>
  </div>
);

const PublicProfileView = ({ profile }) => {
  const mode = profile?.view === 'public' ? 'public' : 'recruiter';
  const updated = mode === 'recruiter' && Boolean(profile?.updated);

  useEffect(() => {
    log('mount', { mode, updated, manage: profile?.manage });
  }, [mode, updated, profile?.manage]);

  // Preview pages show the Overview content only; links inside it are inert here.
  const go = (patch) => log('preview link (inert):', patch);
  const manage = () => {
    log('manage what’s visible -> manage=1');
    profile?.update?.({ manage: true });
  };

  return (
    <div className="flex flex-col gap-[clamp(12px,0.926vw,16px)]">
      <ProfileHeader profile={profile} mode={mode} />
      <ProfileTabBar profile={{ ...profile, tab: 'overview' }} />
      <TabLayout
        tab="overview"
        left={
          <>
            <AboutCard go={go} readOnly />
            <SkillsCard go={go} readOnly />
            <ExperienceCard go={go} readOnly />
            <PortfolioCard go={go} readOnly />
          </>
        }
        right={
          mode === 'public' ? (
            <>
              <JoinCard />
              <HiddenCard data={PUBLIC_RAIL.hidden} manage={manage} />
              <BadgesCard preview />
            </>
          ) : (
            <>
              <MatchCard />
              <HiddenCard
                data={RECRUITER_RAIL.hidden}
                manage={manage}
                pitchRow={updated ? RECRUITER_RAIL.pitchRow : null}
              />
              <BadgesCard preview />
            </>
          )
        }
      />
      {updated ? <PitchHiddenOverlays undo={() => profile?.update?.({ updated: null })} /> : null}
    </div>
  );
};

export default PublicProfileView;
