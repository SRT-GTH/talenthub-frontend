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
import { debug } from '../../utils/debug.js';

const log = debug('ProfileCompletePage');

/*
 * ProfileCompletePage (all 9 stages done, Figma CO-01 / CO-02, Focused default + Playful). Route /profile/filling/complete; URL
 * state in completeState.js. Reached from the Pitch published step. Career Buddy "writes" the bio (skeleton + steps), then shows
 * it with Regenerate / Edit bio; "Go to my dashboard" unlocks when the bio is ready. Mock data only (completeData.js).
 */
const ProfileCompletePage = () => {
  const navigate = useNavigate();
  const { uiStyle } = useUiStyle();
  const st = useCompleteState();
  const [auto, setAuto] = useState('writing');
  const [tone, setTone] = useState(DEFAULT_TONE);
  const phase = st.pinned ?? auto;
  const writing = phase === 'writing';
  const xpWord = uiStyle === 'playful' ? 'XP' : 'pts';

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
            <span className="text-[#387440]">You’re live, {PROFILE.firstName}.</span>
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
            />
            <SectionLabel>WHAT HAPPENS NEXT</SectionLabel>
            <NextCards />
          </div>
          <div className="flex flex-col gap-5">
            <ProfilePreview />
            <RailCard title="Keep it fresh" rows={FRESH_ROWS(xpWord)} />
          </div>
        </div>
      </div>
    </EngagementStageFrame>
  );
};

export default ProfileCompletePage;
