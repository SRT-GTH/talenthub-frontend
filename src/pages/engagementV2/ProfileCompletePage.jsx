import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import EngagementStageBar from '../../components/sections/engagementShell/EngagementStageBar.jsx';
import {
  ENGAGEMENT_STAGES,
  STAGE_BY_ID,
} from '../../components/sections/engagementShell/engagementShellData.js';
import {
  BioCard,
  NextCards,
  ProfilePreview,
  StatsRow,
} from '../../components/sections/engagementV2/complete/CompleteParts.jsx';
import {
  DEFAULT_TONE,
  FRESH_ROWS,
  HERO_CARD_ROWS,
  PROFILE,
  WRITING_MS,
} from '../../components/sections/engagementV2/complete/completeData.js';
import { useCompleteState } from '../../components/sections/engagementV2/complete/completeState.js';
import {
  HeroInfoCard,
  PageHero,
  RailCard,
  SectionLabel,
} from '../../components/sections/engagementV2/goals/GoalsParts.jsx';
import { PAGE_X } from '../../components/sections/engagementV2/goals/goalsStyles.js';
import { useUiStyle } from '../../hooks/useUiStyle.js';
import { STORAGE_KEYS } from '../../constants/storageKeys.js';
import { fetchMyProfile, isLiveProfile } from '../../services/profileStages.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('ProfileCompletePage');

/*
 * ProfileCompletePage (all 9 stages done, Figma CO-01 / CO-02, Focused default + Playful). Route /profile/filling/complete; URL
 * state in completeState.js. Reached from the Pitch published step. Career Buddy "writes" the bio (skeleton + steps), then shows
 * it with Regenerate / Edit bio; "Go to my dashboard" unlocks when the bio is ready.
 * Live (signed in): the hero / preview name comes from the stored user (th:user-profile) or the profile, and the bio card shows
 * the profile's professionalBio (the written pitch). The rest (stats, headline, badges, tone, the writing animation) is demo copy
 * from completeData.js. Demo (signed out): everything from completeData.js.
 */
const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null') || {};
  } catch {
    return {};
  }
};

const wordCount = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0);

/* Live name + bio for the page; null fields fall back to the demo values. */
const liveView = (profile) => {
  const u = storedUser();
  const first = (u.firstName || profile?.firstName || '').trim();
  const last = (u.lastName || profile?.lastName || '').trim();
  const bio = typeof profile?.professionalBio === 'string' ? profile.professionalBio.trim() : '';
  return {
    firstName: first,
    fullName: [first, last].filter(Boolean).join(' '),
    bio: bio
      ? { text: bio, words: wordCount(bio) }
      : { text: 'No bio yet. Publish a written pitch and it shows here.', words: 0 },
  };
};
const ProfileCompletePage = () => {
  const navigate = useNavigate();
  const { uiStyle } = useUiStyle();
  const st = useCompleteState();
  const [auto, setAuto] = useState('writing');
  const [tone, setTone] = useState(DEFAULT_TONE);
  const phase = st.pinned ?? auto;
  const writing = phase === 'writing';
  const xpWord = uiStyle === 'playful' ? 'XP' : 'pts';
  const live = isLiveProfile();
  const [me, setMe] = useState(() => (live ? liveView(null) : null));
  const [loadError, setLoadError] = useState(false); // read-only page: nothing to block, just say so

  useEffect(() => {
    if (!live) return undefined;
    let cancelled = false;
    fetchMyProfile()
      .then((profile) => {
        if (cancelled) return;
        const view = liveView(profile);
        log('loaded live profile', { name: Boolean(view.fullName), bioWords: view.bio.words });
        setMe(view);
      })
      .catch((err) => {
        if (cancelled) return;
        log.error('load profile failed:', err?.response?.status || err?.message);
        setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [live]);

  const firstName = me ? me.firstName : PROFILE.firstName;

  useEffect(() => {
    log('phase', { phase, pinned: st.pinned });
    if (st.pinned || auto !== 'writing') return undefined;
    const t = setTimeout(() => {
      log('bio ready');
      setAuto('ready');
    }, WRITING_MS);
    return () => clearTimeout(t);
  }, [auto, st.pinned, phase]);

  const regenerate = () => {
    log('regenerate');
    st.update({ state: null });
    setAuto('writing');
  };

  return (
    <EngagementStageFrame
      stageId={null}
      footer={{
        skipLabel: null,
        continueLabel: 'Go to my dashboard',
        disabled: writing,
        onContinue: () => navigate('/home'),
        left: (
          <Button
            variant="tertiary-subtle"
            size="lg"
            className="py-[14px]!"
            onClick={() => navigate(STAGE_BY_ID.pitch.route)}
          >
            Back: Pitch
          </Button>
        ),
      }}
    >
      <EngagementStageBar
        stageNumber={9}
        stageName="Profile complete"
        segments={ENGAGEMENT_STAGES.map(() => 'done')}
        doneCount={ENGAGEMENT_STAGES.length}
      />
      <PageHero
        eyebrow="PROFILE COMPLETE"
        title={
          <>
            <span className="text-[#1c2a21]">Profile complete. </span>
            <span className="text-[#387440]">
              {firstName ? `You’re live, ${firstName}.` : 'You’re live.'}
            </span>
          </>
        }
        lead="Nine of nine stages done. Recruiters across Ghana can now find you, view your pitch and message you."
        sticker="TOP TALENT"
        stickerClass="rotate-[4deg]"
        card={<HeroInfoCard title="Your profile today" rows={HERO_CARD_ROWS} />}
      />
      <div className={`flex-1 pt-6 pb-10 lg:pt-10 lg:pb-[44px] ${PAGE_X}`}>
        <div className="mx-auto grid max-w-[1728px] items-start gap-6 lg:grid-cols-[minmax(0,1072fr)_minmax(0,464fr)] lg:justify-between lg:gap-[clamp(24px,3.7vw,64px)]">
          <div className="flex min-w-0 flex-col gap-5">
            {loadError ? (
              <p
                role="status"
                className="m-0 rounded-[12px] border border-solid border-[#f3c7c2] bg-[#fdf1f0] px-4 py-3 font-sans text-[14px] leading-[20px] text-[#b42318]"
              >
                We couldn’t load your profile. Refresh to try again.
              </p>
            ) : null}
            <StatsRow xpWord={xpWord} />
            <BioCard
              writing={writing}
              tone={tone}
              onTone={(t) => {
                log('tone', t);
                setTone(t);
              }}
              onRegenerate={regenerate}
              onEdit={() => log('edit bio (no editor drawn in Figma)')}
              bio={me ? me.bio : undefined}
            />
            <SectionLabel>WHAT HAPPENS NEXT</SectionLabel>
            <NextCards />
          </div>
          <div className="flex flex-col gap-5">
            <ProfilePreview fullName={me?.fullName || undefined} />
            <RailCard title="Keep it fresh" rows={FRESH_ROWS(xpWord)} />
          </div>
        </div>
      </div>
    </EngagementStageFrame>
  );
};

export default ProfileCompletePage;
