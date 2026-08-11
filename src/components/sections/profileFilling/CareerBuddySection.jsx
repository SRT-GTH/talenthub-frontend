import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import ChatThread from '../../ui/ChatThread.jsx';
import Toast from '../../ui/Toast.jsx';
import TalentProfilePanel from './TalentProfilePanel.jsx';
import RecruiterPanel from './RecruiterPanel.jsx';
import CareerBuddyHistoryDrawer from './CareerBuddyHistoryDrawer.jsx';
import GameStoreModal from './GameStoreModal.jsx';
import EscapeRoomGame from './EscapeRoomGame.jsx';
import JobPostFormModal from './JobPostFormModal.jsx';
import ConfirmJobPostModal from './ConfirmJobPostModal.jsx';
import CareerBuddyAvatar from '../../shared/CareerBuddyAvatar.jsx';
import CareerBuddyHero from './CareerBuddyHero.jsx';
import {
  CAREER_BUDDY_NODES,
  FIRST_TIME_HERO,
  RETURNING_HERO,
  TALENT_NAME,
  EDUCATIONAL_BACKGROUND_FIELDS,
  PERSONAL_INFO_PREVIEW_FIELDS,
  CAREER_OPTIONS_PREVIEW_FIELDS,
  PERSONALITY_FIELDS,
  WORK_EXPERIENCE_ENTRIES,
  PERSONAL_INTERESTS_PREVIEW_FIELDS,
} from './careerBuddyScript.js';
import {
  RECRUITER_BUDDY_NODES,
  RECRUITER_BUDDY_STAGES,
  RECRUITER_FIRST_TIME_HERO,
  RECRUITER_WELCOME_TOAST,
  RECRUITER_NAME,
  COMPANY_INFO_FIELDS,
  COMPANY_PANEL_PROGRESS,
  COMPANY_SAVE_META,
  KYB_UPLOAD_CTA,
  seedRecruiterJump,
  JOB_PANEL_PROGRESS,
  applyJobConvAnswer,
  buildJobsPanelFields,
} from './recruiterBuddyScript.js';
import {
  JOB_POSTED_SUCCESS_TOAST,
  emptyJobPostForm,
  seedJobPostFromUpload,
  JOB_FILE_REVIEW_CTA,
} from './jobPostFormData.js';
import {
  JOB_CONV_TITLE_FALLBACK,
  JOB_CONV_COMPANY_FALLBACK,
  JOB_CONV_INDUSTRY_FALLBACK,
  JOB_CONV_DEPARTMENT_FALLBACK,
  JOB_CONV_LOCATION_FALLBACK,
  JOB_CONV_TYPE_FALLBACK,
  JOB_CONV_EXPERIENCE_FALLBACK,
  JOB_CONV_DESCRIPTION_FALLBACK,
  JOB_CONV_RESP_FALLBACK,
  JOB_CONV_RESP_CONFIRM_FALLBACK,
  JOB_CONV_QUALS_FALLBACK,
  JOB_CONV_QUALS_CONFIRM_FALLBACK,
  JOB_CONV_SALARY_FALLBACK,
  JOB_CONV_BENEFITS_FALLBACK,
  JOB_CONV_PERKS_FALLBACK,
  JOB_CONV_DATES_FALLBACK,
} from './jobConversationData.js';
import { useCareerBuddyRole } from '../../../hooks/useCareerBuddyRole.js';
import { debug } from '../../../utils/debug.js';
import {
  AvatarStepIcon,
  WorkStepIcon,
  PortfolioStepIcon,
  CertsStepIcon,
  PanelPersonInfoIcon,
  PanelEducationIcon,
  PanelInterestsIcon,
  PanelPersonalityIcon,
  PanelSkillsIcon,
  PanelWorkExperienceIcon,
  PanelPortfolioIcon,
  PanelCertificationsIcon,
  PanelCareerOptionsIcon,
  PanelMicrophoneIcon,
  CareerBuddyBgEducationIcon,
  CareerBuddyBgSparkIcon,
  CareerBuddyBgChartIcon,
  PersonalityGamesIcon,
  PersonalityMcqIcon,
  PersonalityOpenChatIcon,
  RecruiterCompanyInfoIcon,
  JobFileUploadIcon,
  JobConversationIcon,
  JobManualCreationIcon,
} from '../../shared/assets.jsx';
// Page-level background glow ellipses — same 3 assets + pattern as
// InstitutionOnboardingLayout.jsx / ParentOnboardingLayout.jsx (Figma
// 5132:44957/44958/44959 match those files' insets exactly: -35.03% /
// -35.03% / -42.28%, green/red/gold — confirming shared assets, not new
// ones to extract).
import pageEllipseTl from '../../../assets/hero/page-ellipse-tl.svg';
import pageEllipseBr from '../../../assets/hero/page-ellipse-br.svg';
import pageEllipseCenter from '../../../assets/hero/page-ellipse-center.svg';
import careerBuddyBgGrid from '../../../assets/engagement/career-buddy-bg-grid.png';

const log = debug('CareerBuddySection');

/*
 * CareerBuddySection — full-page shell for /profile/filling/career-buddy.
 * Source: Figma file Bin8roWL8sloyc36IgFMuT, nodes 5132:43308-46274
 * ("AI ENGAGEMENT SCREENS — Welcome Phase and Miscellaneous Screens, Talent
 * Flow") plus the panel reference sheet at 4830:169704-194488 and
 * 5132:40348. See wiki/figma-node-map.md for the full node list.
 *
 * No careerBuddy.service.js exists yet (Engagement Batch 3, US-2.3.9-01 is
 * still a planned LLM integration) — the conversation is a deterministic
 * script (careerBuddyScript.js) walked by node id. Whatever the user types
 * during a free-text step is NOT parsed; the next scripted exchange plays
 * regardless, since there is no real NLP to process arbitrary input yet.
 * All state is local (useState) — no Redux, no persistence — consistent
 * with every other profileFilling section in this codebase.
 *
 * Layout (h-screen, overflow-hidden, flex-col), mirrors SkillsIntroSection:
 *   ┌─ EngagementTopNav  (bg-neutral, clamp 64-90px)
 *   ├─ EngagementTopBar  (11-stage trail, non-interactive — single-page flow)
 *   └─ main (flex-1, flex-row)
 *       ├─ LEFT: hero (first-time/returning) + ChatThread
 *       └─ RIGHT: TalentProfilePanel (talent) | RecruiterPanel (recruiter)
 *
 * Trail vs panel stage counts differ by design: the trail includes "Avatar"
 * (already done before this screen); the panel starts at "Personal Info."
 * (Figma 5132:43308 vs 4830:169800).
 *
 * KNOWN FIGMA DISCREPANCY (flagged, not silently resolved): the top-right
 * step counter reads "Step 1 of 9" in every captured screenshot, but the
 * breadcrumb itself renders 11 chips (Avatar..Pitch). EngagementProgressIndicator
 * computes its denominator from the actual stage count passed in, so this
 * build shows "Step N of 11" — internally consistent with what's really on
 * screen, rather than reproducing a numbers-don't-match Figma artifact.
 * Likewise "X% profile complete" is pinned at 0 here because every
 * captured screenshot shows 0% even while Personal Info (80%) and Skills
 * (48%) are already non-zero — treated as a static demo label in the
 * source file, not a computed weighted average.
 */

const CAREER_BUDDY_STAGES = [
  { id: 'avatar', trailLabel: 'Avatar', Icon: AvatarStepIcon },
  {
    id: 'personal-info',
    trailLabel: 'Personal Info',
    panelLabel: 'Personal Info.',
    completionPct: 80,
    status: 'in-progress',
    Icon: PanelPersonInfoIcon,
  },
  {
    id: 'educational-background',
    trailLabel: 'Education',
    panelLabel: 'Educational Background',
    completionPct: 0,
    status: 'not-started',
    Icon: PanelEducationIcon,
  },
  {
    id: 'personal-interests',
    trailLabel: 'Interests',
    panelLabel: 'Personal area of interest',
    completionPct: 0,
    status: 'not-started',
    Icon: PanelInterestsIcon,
  },
  {
    id: 'personality',
    trailLabel: 'Personality',
    panelLabel: 'Personality',
    completionPct: 0,
    status: 'not-started',
    Icon: PanelPersonalityIcon,
  },
  {
    id: 'skills',
    trailLabel: 'Skills',
    panelLabel: 'Skills (Competencies)',
    completionPct: 48,
    status: 'in-progress',
    Icon: PanelSkillsIcon,
  },
  {
    id: 'work-experience',
    trailLabel: 'Work',
    panelLabel: 'Work Experience',
    completionPct: 0,
    status: 'not-started',
    Icon: PanelWorkExperienceIcon,
  },
  {
    id: 'project-portfolio',
    trailLabel: 'Portfolio',
    panelLabel: 'Project Portfolio',
    completionPct: 0,
    status: 'not-started',
    Icon: PanelPortfolioIcon,
  },
  {
    id: 'certifications',
    trailLabel: 'Certs',
    panelLabel: 'Certifications',
    completionPct: 0,
    status: 'not-started',
    Icon: PanelCertificationsIcon,
  },
  {
    id: 'desired-career',
    trailLabel: 'Goals',
    panelLabel: 'Career Options',
    completionPct: 0,
    status: 'not-started',
    Icon: PanelCareerOptionsIcon,
  },
  {
    id: 'talent-pitch',
    trailLabel: 'Pitch',
    panelLabel: 'Career Pitch',
    completionPct: 0,
    status: 'not-started',
    Icon: PanelMicrophoneIcon,
  },
];

// Educational Background + Personal Area of Interest fields are collected
// live through this build's chat (`confirmed: true` — Modify/Confirm
// actions apply). The rest carry Figma's reference-sheet data as a
// read-only PREVIEW (`confirmed: false` — no Modify/Confirm) since their
// own chat flows aren't built in this slice yet; see the NAMING NOTE in
// careerBuddyScript.js.
const STAGE_FIELD_DATA = {
  'personal-info': { fields: PERSONAL_INFO_PREVIEW_FIELDS, confirmed: false },
  'educational-background': { fields: EDUCATIONAL_BACKGROUND_FIELDS, confirmed: true },
  personality: { fields: PERSONALITY_FIELDS, confirmed: true },
  // Work Experience uses `entries` (a list of collapsible job sub-cards),
  // not the flat `fields` every other stage uses — see WORK_EXPERIENCE_
  // ENTRIES' own comment in careerBuddyScript.js for why (multi-entry
  // panel row, only Experience 1 has real Q&A-collected data).
  'work-experience': { entries: WORK_EXPERIENCE_ENTRIES, confirmed: true },
  'personal-interests': { fields: PERSONAL_INTERESTS_PREVIEW_FIELDS, confirmed: true },
  // Career Options is live-collected via Career Exposure guidance Q&A
  // (Figma 5132:52485 / 64380) — confirmed: true so Modify/Confirm apply
  // once the chat reaches exposure-confirm-*.
  'desired-career': { fields: CAREER_OPTIONS_PREVIEW_FIELDS, confirmed: true },
};

// Icon lookup for the personality mode-picker + post-personality
// section-picker cards — kept out of careerBuddyScript.js (data-only, no
// React/asset imports) and merged onto the script's plain
// {id,title,description} modeCards here at render time. The section-
// picker's 6 card ids match CAREER_BUDDY_STAGES ids exactly, so they reuse
// the exact same Icon components as those stages' own panel rows.
const MODE_CARD_ICONS = {
  games: PersonalityGamesIcon,
  mcq: PersonalityMcqIcon,
  'open-chat': PersonalityOpenChatIcon,
  skills: PanelSkillsIcon,
  'work-experience': PanelWorkExperienceIcon,
  'project-portfolio': PanelPortfolioIcon,
  certifications: PanelCertificationsIcon,
  'talent-pitch': PanelMicrophoneIcon,
  'desired-career': PanelCareerOptionsIcon,
  // Recruiter Post a Job mode cards (Figma 5132:69556 / 69569 / 69583)
  'file-upload': JobFileUploadIcon,
  'conversation-ai': JobConversationIcon,
  'manual-creation': JobManualCreationIcon,
};

// Per-stage metadata for the real async save round-trip (handleConfirmStage
// below) — generalises what was previously hardcoded to
// 'educational-background' only. Each entry:
//   autoMessageText  — the [Auto] chat bubble text on save success
//   toastLabel       — body of the "Success, {toastLabel}" toast
//   nextNodeId       — script node to transition into after success (the
//                      next stage's transition prompt), or null to stay put
const STAGE_SAVE_META = {
  'educational-background': {
    autoMessageText: 'Educational background confirmed ✅',
    toastLabel: 'Educational background saved',
    nextNodeId: 'interests-prompt',
  },
  'personal-interests': {
    autoMessageText: 'Personal Area of Interest confirmed ✅',
    toastLabel: 'Personal area of interest saved',
    nextNodeId: 'personality-prompt',
  },
  // nextNodeId now resolved — Figma 5132:64061 gives the real hand-off
  // ("Okay that's great. We've covered a lot...") that this was previously
  // left disconnected pending.
  personality: {
    autoMessageText: 'Personality confirmed ✅',
    toastLabel: 'Personality saved',
    nextNodeId: 'post-personality-prompt',
  },
  // nextNodeId stays null — the section-picker's other 5 cards are all
  // stubs (no built flow to hand off into), and picking a DIFFERENT card
  // after confirming Work Experience would need its own real Q&A, not a
  // fabricated one.
  'work-experience': {
    autoMessageText: 'Work Experience confirmed ✅',
    toastLabel: 'Work experience saved',
    nextNodeId: null,
  },
  // nextNodeId for the return-from-guidance path is set dynamically via
  // guidanceResumeNodeIdRef (section-picker-from-guidance). Continue-
  // exploring stays on exposure-confirm-continue (chips already showing).
  'desired-career': {
    autoMessageText: 'Career Options confirmed ✅',
    toastLabel: 'Career options saved',
    nextNodeId: null,
  },
};

// Overwrite the KYB/KYC Status field with session-time verification state
// so RecruiterPanel renders "Verified" / green once the user uploads a doc.
const buildCompanyInfoFields = (kybVerified) =>
  COMPANY_INFO_FIELDS.map((field) =>
    field.label === 'KYB/KYC Status'
      ? {
          ...field,
          value: kybVerified ? 'Verified' : 'Not verified',
          verified: Boolean(kybVerified),
        }
      : field
  );

// Script node-id prefix → stage id, so `submit()` can flip a stage's panel
// row to 'in-progress' the moment its Q&A begins, regardless of which
// stage it is (see the in-progress transition comment at its usage below).
// Personality has two possible prefixes since it can be answered via either
// Open Chat or MCQ mode.
const STAGE_QA_NODE_PREFIX = {
  'edu-q': 'educational-background',
  'interests-q': 'personal-interests',
  'open-chat-q': 'personality',
  'mcq-q': 'personality',
  // Games mode has no Q&A nodes (the actual game is a separate React
  // component, not more script nodes) — 'games-intro' is the exact node
  // id `submit()` transitions to when the user picks the "Games" mode
  // card, so it works as a one-off "prefix" (a full match still satisfies
  // `nextId.startsWith(prefix)`).
  'games-intro': 'personality',
  'work-q': 'work-experience',
  'exposure-q': 'desired-career',
  // Confirm hand-off nodes also mark Career Options in-progress if the
  // user somehow lands here without walking exposure-q* (defensive).
  'exposure-confirm': 'desired-career',
};

// First-time welcome hero — Figma 5132:45003 ("Frame 13"): headline block
// (5132:45004/45005/45006) then a 28px gap then the Career Buddy intro card
// (5132:45007), card centred and 450px wide. Re-extracted 2026-07-24 via
// get_design_context — supersedes the earlier screenshot-only pass (wrong
// font sizes throughout, whole headline forced to display-serif instead of
// only "Ghana Talent AI", card was bg-white/shadow instead of the flat
// #f8f8f4 + border card Figma actually shows, avatar was a 36px placeholder
// icon instead of the real 80px CareerBuddyAvatar).
// Extracted 2026-08-10 to src/components/sections/profileFilling/CareerBuddyHero.jsx
// so the recruiter flow can render the identical hero with its own copy.
const FirstTimeHero = ({ hero }) => <CareerBuddyHero hero={hero} />;

const ReturningHero = () => (
  <div className="flex flex-col items-center text-center px-10 pt-20 pb-4 gap-2 shrink-0">
    <h1 className="font-display text-[26px] leading-tight">
      <span className="italic text-brand-green">{RETURNING_HERO.headlineQuestion}</span>{' '}
      <span className="font-semibold text-content-primary">{RETURNING_HERO.headlineName}</span>
    </h1>
    <p className="font-sans text-[13px] text-content-secondary">{RETURNING_HERO.subtitle}</p>
  </div>
);

const CareerBuddySection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { role } = useCareerBuddyRole();
  const isRecruiter = role === 'recruiter';
  // ?cb= query param lets DemoNavigator jump into mid-flow recruiter states.
  const demoHint = searchParams.get('cb') || 'welcome';

  const [nodeId, setNodeId] = useState('welcome');
  const [messages, setMessages] = useState(() => CAREER_BUDDY_NODES.welcome.seedMessages());
  const [stages, setStages] = useState(CAREER_BUDDY_STAGES);
  const [trailStageIndex, setTrailStageIndex] = useState(0);
  const [expandedPanelId, setExpandedPanelId] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [toast, setToast] = useState(null);
  // Stage id currently mid-save (drives the Confirm button's spinner + a
  // simulated async round-trip) — see handleConfirmStage below.
  const [confirmingStageId, setConfirmingStageId] = useState(null);
  // Which stages have already had one Confirm attempt — the FIRST attempt
  // always simulates a flaky-network failure (Figma 5132:46267 "Error, No
  // internet connection"), the retry always succeeds. Demonstrates the
  // error+retry path deterministically without a real backend.
  const [retriedStages, setRetriedStages] = useState({});
  const [gameStoreOpen, setGameStoreOpen] = useState(false);
  const [playingEscapeRoom, setPlayingEscapeRoom] = useState(false);
  const [jobPostFormOpen, setJobPostFormOpen] = useState(false);
  const [confirmJobPostOpen, setConfirmJobPostOpen] = useState(false);
  // Shared draft for Manual / Conversation AI / File Upload → form / Jobs panel.
  const [jobPostDraft, setJobPostDraft] = useState(emptyJobPostForm);
  // Header copy for JobPostFormModal: manual | upload | conversation
  const [jobPostFormMode, setJobPostFormMode] = useState('manual');
  // Bump only when clearing the draft (dismiss / success / fresh Fill Form).
  // Confirm step closes the form UI but must NOT clear the draft.
  const [jobPostFormResetKey, setJobPostFormResetKey] = useState(0);
  // Tracks whether the recruiter has uploaded a KYB doc this session — used
  // to update the KYB/KYC Status field in RecruiterPanel's view-details.
  const [kybVerified, setKybVerified] = useState(false);
  // After Career Options Confirm: 'section-picker-from-guidance' when the
  // user chose return-to-profile; null when they chose continue-exploring
  // (stay on exposure-confirm-continue so the next-area chips remain).
  // Ref (not state) so the simulated-save setTimeout always reads the
  // value set at wrap-up choice time, not a stale render closure.
  const guidanceResumeNodeIdRef = useRef(null);

  log('mount', { nodeId, stageCount: stages.length, role });

  // Recruiter stages with the RecruiterCompanyInfoIcon baked in — Icon
  // components can't live in the data-only script, merged here like MODE_CARD_ICONS.
  const recruiterStagesWithIcons = useMemo(
    () =>
      RECRUITER_BUDDY_STAGES.map((stage) => {
        if (stage.id === 'company-info') return { ...stage, Icon: RecruiterCompanyInfoIcon };
        if (stage.id === 'jobs') return { ...stage, Icon: PanelWorkExperienceIcon };
        return stage;
      }),
    []
  );

  // Script + trail selection — single source of truth for role.
  const scriptNodes = isRecruiter ? RECRUITER_BUDDY_NODES : CAREER_BUDDY_NODES;
  const trailStages = isRecruiter ? RECRUITER_BUDDY_STAGES : CAREER_BUDDY_STAGES;
  const firstTimeHero = isRecruiter ? RECRUITER_FIRST_TIME_HERO : FIRST_TIME_HERO;
  const personaName = isRecruiter ? RECRUITER_NAME : TALENT_NAME;

  // Reset conversation + panel state whenever role or DemoNavigator hint changes.
  useEffect(() => {
    if (isRecruiter) {
      const { nodeId: seedId, messages: seedMsgs } = seedRecruiterJump(demoHint);
      setNodeId(seedId);
      setMessages(seedMsgs);
      setTrailStageIndex(0);
      setConfirmingStageId(null);
      setRetriedStages({});
      guidanceResumeNodeIdRef.current = null;

      // Base recruiter stages (no KYB yet for most hints)
      let nextStages = recruiterStagesWithIcons;

      if (demoHint === 'company-review') {
        // Figma company-review frames show KYB already Verified on the panel.
        setKybVerified(true);
        nextStages = recruiterStagesWithIcons.map((stage) => {
          if (stage.id === 'kyb') return { ...stage, status: 'done', completionPct: 100 };
          if (stage.id === 'company-info') {
            return {
              ...stage,
              status: 'awaiting-review',
              completionPct: 100,
              fields: buildCompanyInfoFields(true),
            };
          }
          return stage;
        });
        setExpandedPanelId('company-info');
      } else if (demoHint === 'company-confirmed') {
        setKybVerified(true);
        nextStages = recruiterStagesWithIcons.map((stage) => {
          if (stage.id === 'kyb') return { ...stage, status: 'done', completionPct: 100 };
          if (stage.id === 'company-info') {
            return {
              ...stage,
              status: 'done',
              completionPct: 100,
              fields: buildCompanyInfoFields(true),
            };
          }
          return stage;
        });
        setExpandedPanelId(null);
      } else if (demoHint === 'kyb-verified') {
        nextStages = recruiterStagesWithIcons.map((stage) => {
          if (stage.id === 'kyb') return { ...stage, status: 'done', completionPct: 100 };
          if (stage.id === 'company-info')
            return { ...stage, fields: buildCompanyInfoFields(true) };
          return stage;
        });
        setKybVerified(true);
        setExpandedPanelId(null);
      } else {
        setKybVerified(false);
        setExpandedPanelId(null);
      }

      setStages(nextStages);
      // Welcome toast only on landing — mid-flow demo jumps skip it.
      if (demoHint === 'welcome') {
        setToast({
          id: `recruiter-welcome-${Date.now()}`,
          variant: 'welcome',
          title: RECRUITER_WELCOME_TOAST.title,
          body: RECRUITER_WELCOME_TOAST.body,
        });
      } else {
        setToast(null);
      }

      // DemoNavigator Post-a-Job jumps — confirm alone (form not stacked under).
      if (demoHint === 'post-job-form') {
        setJobPostFormMode('manual');
        setJobPostDraft(emptyJobPostForm());
        setJobPostFormResetKey((k) => k + 1);
        setJobPostFormOpen(true);
        setConfirmJobPostOpen(false);
      } else if (demoHint === 'post-job-confirm') {
        setJobPostFormOpen(false);
        setConfirmJobPostOpen(true);
      } else if (demoHint === 'post-job-success') {
        setJobPostFormOpen(false);
        setConfirmJobPostOpen(false);
        setJobPostDraft(emptyJobPostForm());
        setJobPostFormResetKey((k) => k + 1);
        setStages((prev) =>
          prev.map((stage) =>
            stage.id === 'jobs' ? { ...stage, status: 'done', completionPct: 100 } : stage
          )
        );
        setExpandedPanelId('jobs');
        setToast({
          id: `job-posted-${Date.now()}`,
          variant: 'success',
          title: JOB_POSTED_SUCCESS_TOAST.title,
          body: JOB_POSTED_SUCCESS_TOAST.body,
        });
      } else if (demoHint === 'post-job-chat') {
        setJobPostFormMode('conversation');
        setJobPostDraft(emptyJobPostForm());
        setJobPostFormOpen(false);
        setConfirmJobPostOpen(false);
        setStages((prev) =>
          prev.map((stage) =>
            stage.id === 'jobs'
              ? {
                  ...stage,
                  status: 'in-progress',
                  completionPct: JOB_PANEL_PROGRESS['job-conv-start'] ?? 12,
                  fields: null,
                }
              : stage
          )
        );
        setExpandedPanelId('jobs');
      } else if (demoHint === 'post-job-upload') {
        setJobPostFormMode('upload');
        setJobPostDraft(emptyJobPostForm());
        setJobPostFormOpen(false);
        setConfirmJobPostOpen(false);
        setStages((prev) =>
          prev.map((stage) =>
            stage.id === 'jobs'
              ? { ...stage, status: 'in-progress', completionPct: 8, fields: null }
              : stage
          )
        );
        setExpandedPanelId('jobs');
      } else if (demoHint === 'post-job-upload-review') {
        const draft = seedJobPostFromUpload();
        setJobPostFormMode('upload');
        setJobPostDraft(draft);
        setJobPostFormOpen(true);
        setConfirmJobPostOpen(false);
        setStages((prev) =>
          prev.map((stage) =>
            stage.id === 'jobs'
              ? {
                  ...stage,
                  status: 'in-progress',
                  completionPct: 92,
                  fields: buildJobsPanelFields(draft),
                }
              : stage
          )
        );
        setExpandedPanelId('jobs');
      } else if (demoHint === 'post-job-chat-review') {
        setJobPostFormMode('conversation');
        let draft = emptyJobPostForm();
        const steps = [
          ['job-conv-title', JOB_CONV_TITLE_FALLBACK],
          ['job-conv-company', JOB_CONV_COMPANY_FALLBACK],
          ['job-conv-industry', JOB_CONV_INDUSTRY_FALLBACK],
          ['job-conv-department', JOB_CONV_DEPARTMENT_FALLBACK],
          ['job-conv-location', JOB_CONV_LOCATION_FALLBACK],
          ['job-conv-type', JOB_CONV_TYPE_FALLBACK],
          ['job-conv-experience', JOB_CONV_EXPERIENCE_FALLBACK],
          ['job-conv-description', JOB_CONV_DESCRIPTION_FALLBACK],
          ['job-conv-resp', JOB_CONV_RESP_FALLBACK],
          ['job-conv-resp-confirm', JOB_CONV_RESP_CONFIRM_FALLBACK],
          ['job-conv-quals', JOB_CONV_QUALS_FALLBACK],
          ['job-conv-quals-confirm', JOB_CONV_QUALS_CONFIRM_FALLBACK],
          ['job-conv-salary', JOB_CONV_SALARY_FALLBACK],
          ['job-conv-benefits', JOB_CONV_BENEFITS_FALLBACK],
          ['job-conv-perks', JOB_CONV_PERKS_FALLBACK],
          ['job-conv-dates', JOB_CONV_DATES_FALLBACK],
        ];
        for (const [node, answer] of steps) {
          draft = applyJobConvAnswer(draft, node, answer);
        }
        setJobPostDraft(draft);
        setJobPostFormOpen(false);
        setConfirmJobPostOpen(false);
        setStages((prev) =>
          prev.map((stage) =>
            stage.id === 'jobs'
              ? {
                  ...stage,
                  status: 'awaiting-review',
                  completionPct: 100,
                  fields: buildJobsPanelFields(draft),
                }
              : stage
          )
        );
        setExpandedPanelId('jobs');
      } else {
        setJobPostFormOpen(false);
        setConfirmJobPostOpen(false);
      }
    } else {
      // Talent reset
      setNodeId('welcome');
      setMessages(CAREER_BUDDY_NODES.welcome.seedMessages());
      setStages(CAREER_BUDDY_STAGES);
      setTrailStageIndex(0);
      setExpandedPanelId(null);
      setConfirmingStageId(null);
      setRetriedStages({});
      setKybVerified(false);
      guidanceResumeNodeIdRef.current = null;
    }
    // demoHint and recruiterStagesWithIcons are stable across renders;
    // role drives the reset, demoHint drives the recruiter jump target.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, recruiterStagesWithIcons, demoHint]);

  const currentNode = scriptNodes[nodeId];
  const heroMode = currentNode?.hero ?? null;
  const showChrome = heroMode !== 'first-time';
  // New Chat + History once past the first-time hero (talent + recruiter).
  // Returning-talent hero keeps History but hides New Chat (already a fresh chat).
  const showNewChat = showChrome && heroMode !== 'returning';
  // Attach is always available for recruiters past the first-time hero
  // (KYB prompt OR job JD anytime — even mid Conversation mode).
  const enableAttach = Boolean(isRecruiter && showChrome);

  // Live Jobs panel preview whenever the shared draft changes (form edits,
  // conversation answers, and file-upload extract all share this path).
  const syncJobsPanelFromDraft = (draft, { pct, status } = {}) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== 'jobs') return stage;
        if (stage.status === 'done' && status !== 'in-progress' && status !== 'awaiting-review') {
          return stage;
        }
        const nextStatus =
          status ??
          (stage.status === 'awaiting-review'
            ? 'awaiting-review'
            : stage.status === 'not-started' || stage.status === 'done'
              ? 'in-progress'
              : stage.status);
        return {
          ...stage,
          status: nextStatus,
          completionPct: pct ?? Math.max(stage.completionPct ?? 0, 40),
          fields: buildJobsPanelFields(draft),
        };
      })
    );
    setExpandedPanelId('jobs');
  };

  const handleJobDraftChange = (draft) => {
    setJobPostDraft(draft);
    syncJobsPanelFromDraft(draft);
  };

  // careerBuddyScript.js / recruiterBuddyScript.js are data-only (no React/
  // asset imports or callbacks), so anything a message needs at render time —
  // modeCards' Icon components (MODE_CARD_ICONS), the games-intro linkButton's
  // onClick (opens the Game Store modal) — gets merged in here.
  const enrichedMessages = useMemo(
    () =>
      messages.map((message) => {
        let next = message;
        if (next.modeCards) {
          next = {
            ...next,
            modeCards: next.modeCards.map((card) => ({ ...card, Icon: MODE_CARD_ICONS[card.id] })),
          };
        }
        if (next.linkButton?.label === 'Open Game Store') {
          next = {
            ...next,
            linkButton: { ...next.linkButton, onClick: () => setGameStoreOpen(true) },
          };
        }
        if (next.linkButton?.label === 'Fill Form') {
          next = {
            ...next,
            linkButton: {
              ...next.linkButton,
              onClick: () => {
                log('branch', { openJobPostForm: true, fresh: true, mode: 'manual' });
                setJobPostFormMode('manual');
                setJobPostDraft(emptyJobPostForm());
                setJobPostFormResetKey((k) => k + 1);
                setConfirmJobPostOpen(false);
                setJobPostFormOpen(true);
                // Manual form open starts a Jobs add cycle (percent visible).
                setStages((prev) =>
                  prev.map((stage) =>
                    stage.id === 'jobs'
                      ? { ...stage, status: 'in-progress', completionPct: 8, fields: null }
                      : stage
                  )
                );
                setExpandedPanelId('jobs');
              },
            },
          };
        }
        if (next.linkButton?.label === JOB_FILE_REVIEW_CTA) {
          next = {
            ...next,
            linkButton: {
              ...next.linkButton,
              onClick: () => {
                log('branch', { openJobPostForm: true, mode: 'upload', fromFileReview: true });
                setJobPostFormMode('upload');
                setConfirmJobPostOpen(false);
                setJobPostFormOpen(true);
                setExpandedPanelId('jobs');
              },
            },
          };
        }
        return next;
      }),
    [messages]
  );

  // After a successful job post, surface unfinished setup chips (Company / KYB).
  const activeSuggestedReplies = useMemo(() => {
    const base = currentNode?.suggestedReplies ?? [];
    if (nodeId !== 'job-posted-success') return base;
    const companyDone = stages.some((s) => s.id === 'company-info' && s.status === 'done');
    const kybDone = kybVerified || stages.some((s) => s.id === 'kyb' && s.status === 'done');
    const chips = [];
    if (!companyDone) chips.push('Complete Company Profile');
    if (!kybDone) chips.push(KYB_UPLOAD_CTA);
    chips.push('Tell me more about GTH');
    return chips;
  }, [currentNode?.suggestedReplies, nodeId, stages, kybVerified]);

  const panelStages = useMemo(
    () =>
      stages
        .filter((stage) => stage.id !== 'avatar')
        .map((stage) => {
          const fieldData = STAGE_FIELD_DATA[stage.id];
          if (!fieldData) return stage;
          // Educational Background's real `fields` populate once the chat
          // has walked the questions (renders with Modify/Confirm) — first
          // in 'awaiting-review' (collected but not yet actually saved),
          // then 'done' once the panel's own Confirm click succeeds.
          // `stage.fields ?? fieldData.fields` prefers whatever the user
          // actually edited via Modify/Update over the static script
          // default, so a real edit survives the eventual save.
          // Everything else renders as `previewFields` — a read-only,
          // dimmed reference-sheet preview with no Modify/Confirm, shown
          // regardless of chat progress since no chat has collected it yet.
          if (fieldData.confirmed) {
            if (stage.status !== 'done' && stage.status !== 'awaiting-review') return stage;
            // Work Experience carries `entries` (a list of collapsible job
            // sub-cards) instead of the flat `fields` every other confirmed
            // stage uses — see STAGE_FIELD_DATA's comment above.
            return fieldData.entries
              ? { ...stage, entries: stage.entries ?? fieldData.entries }
              : { ...stage, fields: stage.fields ?? fieldData.fields };
          }
          return { ...stage, previewFields: fieldData.fields };
        }),
    [stages]
  );

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const applyStageConfirmations = (newMessages, jobDraftOverride) => {
    const confirmedIds = newMessages.filter((m) => m.confirmsStageId).map((m) => m.confirmsStageId);
    if (confirmedIds.length === 0) return;

    // Reaching the script's own "please review and confirm" message means
    // the data has been COLLECTED, not yet SAVED — Figma's own state name
    // for this is "AWAITING REVIEW AND CONFIRMATION" (5132:46916), distinct
    // from "EDUCATIONAL BACKGROUND SAVED" (5132:47276). The real save (with
    // its own loading/error/success states) only happens once the user
    // actually clicks Confirm in the panel — see handleConfirmStage.
    log('dispatch', { stagesAwaitingReview: confirmedIds });
    const draftForJobs = jobDraftOverride ?? jobPostDraft;
    setStages((prev) =>
      prev.map((stage) => {
        if (!confirmedIds.includes(stage.id)) return stage;
        // company-info: also populate fields and pin 100% so RecruiterPanel
        // can render the view-details sheet immediately on expand.
        if (stage.id === 'company-info') {
          return {
            ...stage,
            status: 'awaiting-review',
            completionPct: 100,
            fields: buildCompanyInfoFields(kybVerified),
          };
        }
        if (stage.id === 'jobs') {
          return {
            ...stage,
            status: 'awaiting-review',
            completionPct: 100,
            fields: buildJobsPanelFields(draftForJobs),
          };
        }
        return { ...stage, status: 'awaiting-review' };
      })
    );
    setExpandedPanelId(confirmedIds[0]);

    // Trail position once a stage's data is collected — index of the stage
    // itself within CAREER_BUDDY_STAGES, so everything up to and including
    // it reads as "reached" on the 11-chip breadcrumb.
    const STAGE_TRAIL_INDEX = {
      'educational-background': 2,
      'personal-interests': 3,
      personality: 4,
      'work-experience': 6,
      'desired-career': 9,
      jobs: 1,
    };
    const reachedIndex = Math.max(...confirmedIds.map((id) => STAGE_TRAIL_INDEX[id] ?? 0));
    if (reachedIndex > 0) setTrailStageIndex((prev) => Math.max(prev, reachedIndex));
  };

  const submit = (text) => {
    const node = scriptNodes[nodeId];
    if (!node) return;
    const nextId = node.next?.[text] ?? node.next?.['*'] ?? node.freeTextNext;
    log('branch', { fromNode: nodeId, input: text, nextNode: nextId ?? '(terminal)' });
    if (!nextId) return;

    const nextNode = scriptNodes[nextId];
    // Pass the user's input so recruiter nodes can echo the real typed text
    // (e.g. company-bio-rewrite echoes the recruiter's own bio draft).
    const newMessages = nextNode.reply ? nextNode.reply(text) : (nextNode.seedMessages?.() ?? []);
    setMessages((prev) => [...prev, ...newMessages]);

    // Conversation-with-AI: map answers into the shared job draft + Jobs panel.
    // Starting a new add after a prior post (status done) resets into in-progress.
    let nextJobDraft = jobPostDraft;
    if (isRecruiter && nextId.startsWith('job-conv-')) {
      if (nextId !== 'job-conv-start') {
        nextJobDraft = applyJobConvAnswer(jobPostDraft, nextId, text);
        setJobPostDraft(nextJobDraft);
        log('branch', { jobConvMapped: nextId, title: nextJobDraft.jobTitle });
      }
      const pct = JOB_PANEL_PROGRESS[nextId];
      if (pct !== undefined) {
        const previewFields = buildJobsPanelFields(nextJobDraft);
        setStages((prev) =>
          prev.map((stage) => {
            if (stage.id !== 'jobs') return stage;
            // New conversation after a posted job — begin a fresh add cycle.
            const startingFresh = stage.status === 'done' || stage.status === 'not-started';
            return {
              ...stage,
              status:
                stage.status === 'awaiting-review' && !startingFresh
                  ? 'awaiting-review'
                  : 'in-progress',
              completionPct: pct,
              fields:
                startingFresh && nextId === 'job-conv-start'
                  ? null
                  : previewFields || stage.fields || null,
            };
          })
        );
      }
    }

    // Manual Creation / File Upload / Conversation Post-a-Job entry — begin Jobs percent.
    if (
      isRecruiter &&
      (nextId === 'job-manual-prompt' ||
        nextId === 'post-a-job-options' ||
        nextId === 'job-conv-start' ||
        nextId === 'job-file-upload')
    ) {
      if (
        nextId === 'job-manual-prompt' ||
        nextId === 'job-conv-start' ||
        nextId === 'job-file-upload'
      ) {
        if (nextId === 'job-conv-start') setJobPostFormMode('conversation');
        if (nextId === 'job-manual-prompt') setJobPostFormMode('manual');
        if (nextId === 'job-file-upload') setJobPostFormMode('upload');
        setStages((prev) =>
          prev.map((stage) =>
            stage.id === 'jobs'
              ? {
                  ...stage,
                  status: 'in-progress',
                  completionPct:
                    nextId === 'job-conv-start' ? (JOB_PANEL_PROGRESS['job-conv-start'] ?? 6) : 8,
                  fields: stage.status === 'done' ? null : stage.fields,
                }
              : stage
          )
        );
      }
    }

    applyStageConfirmations(newMessages, nextJobDraft);

    // Career Options confirm has two post-save destinations depending on
    // the wrap-up chip (continue exploring vs return to profile setup).
    if (nextId === 'exposure-confirm-return') {
      guidanceResumeNodeIdRef.current = 'section-picker-from-guidance';
      log('branch', { guidanceResume: 'section-picker-from-guidance' });
    } else if (nextId === 'exposure-confirm-continue') {
      guidanceResumeNodeIdRef.current = null;
      log('branch', { guidanceResume: null });
    }

    // Entering a stage's own Q&A flips its panel row from "Not Started" to
    // "In Progress" (Figma 5132:46736 / 48095) — first q* node of that
    // stage only, so a stage already awaiting-review/done never regresses
    // back to in-progress.
    const startedStageId = Object.entries(STAGE_QA_NODE_PREFIX).find(([prefix]) =>
      nextId.startsWith(prefix)
    )?.[1];
    if (startedStageId) {
      setStages((prev) =>
        prev.map((stage) =>
          stage.id === startedStageId && stage.status === 'not-started'
            ? { ...stage, status: 'in-progress' }
            : stage
        )
      );
    }

    // KYB flow: selecting the KYB chip marks the kyb panel row in-progress.
    if (isRecruiter && nextId === 'kyb-prompt') {
      setStages((prev) =>
        prev.map((stage) =>
          stage.id === 'kyb' && stage.status === 'not-started'
            ? { ...stage, status: 'in-progress', completionPct: 40 }
            : stage
        )
      );
    }

    // Company Q&A progress animation — animate company-info completionPct as
    // each Q&A node fires, giving the recruiter live panel feedback.
    if (isRecruiter && COMPANY_PANEL_PROGRESS[nextId] !== undefined) {
      const pct = COMPANY_PANEL_PROGRESS[nextId];
      setStages((prev) =>
        prev.map((stage) =>
          stage.id === 'company-info'
            ? { ...stage, status: 'in-progress', completionPct: pct }
            : stage
        )
      );
    }

    setNodeId(nextId);
  };

  // Handles a confirmed file attachment from ChatThread.
  // KYB awaitFile → verify flow. Anything else (incl. mid Conversation) →
  // job JD extract + live Jobs panel (Figma 5132:75538 / 75730).
  const handleAttach = ({ name, size, sizeLabel }) => {
    const node = scriptNodes[nodeId];
    const displayName =
      name.length > 20 ? `${name.slice(0, 14)}... .${name.split('.').pop()}` : name;
    const fileMsg = {
      id: `file-msg-${nodeId}-${Date.now()}`,
      sender: 'user',
      personaLabel: personaName,
      file: { name, displayName, size, sizeLabel },
    };

    const isKybUpload = Boolean(node?.awaitFile && node.fileNext === 'kyb-verified');
    if (isKybUpload) {
      log('branch', { attachFile: name, fromNode: nodeId, kind: 'kyb' });
      const nextId = node.fileNext;
      const nextNode = scriptNodes[nextId];
      const nextMessages = nextNode?.reply ? nextNode.reply() : (nextNode?.seedMessages?.() ?? []);
      setMessages((prev) => [...prev, fileMsg, ...nextMessages]);
      setNodeId(nextId);
      setKybVerified(true);
      setStages((prev) =>
        prev.map((stage) => {
          if (stage.id === 'kyb') return { ...stage, status: 'done', completionPct: 100 };
          if (stage.id === 'company-info' && stage.fields) {
            return { ...stage, fields: buildCompanyInfoFields(true) };
          }
          return stage;
        })
      );
      return;
    }

    log('branch', { attachFile: name, fromNode: nodeId, kind: 'job-jd' });
    const draft = seedJobPostFromUpload();
    setJobPostFormMode('upload');
    setJobPostDraft(draft);
    setJobPostFormOpen(false);
    setConfirmJobPostOpen(false);
    const extractedMessages = RECRUITER_BUDDY_NODES['job-file-extracted'].reply();
    setMessages((prev) => [...prev, fileMsg, ...extractedMessages]);
    setNodeId('job-file-extracted');
    syncJobsPanelFromDraft(draft, { pct: 92, status: 'in-progress' });
  };

  const handleAttachRejected = (fileName) => {
    log('branch', { attachRejected: fileName });
    setToast({
      id: `attach-rejected-${Date.now()}`,
      variant: 'error',
      title: 'File too large',
      body: `${fileName} exceeds the 10 MB limit.`,
    });
  };

  const handleRequestJobPost = () => {
    log('branch', { requestJobPostConfirm: true, hideFormKeepDraft: true });
    // Confirm replaces the form (no stacked modals); draft stays in jobPostDraft.
    setJobPostFormOpen(false);
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === 'jobs'
          ? {
              ...stage,
              fields: buildJobsPanelFields(jobPostDraft),
              status:
                stage.status === 'done'
                  ? 'done'
                  : stage.status === 'awaiting-review'
                    ? 'awaiting-review'
                    : 'in-progress',
              completionPct: Math.max(stage.completionPct ?? 0, 40),
            }
          : stage
      )
    );
    setConfirmJobPostOpen(true);
  };

  const handleGoBackEditJobPost = () => {
    log('branch', { goBackEditJobPost: true });
    setConfirmJobPostOpen(false);
    setJobPostFormOpen(true);
  };

  const handleConfirmJobPost = () => {
    log('branch', { confirmJobPost: true });
    setConfirmJobPostOpen(false);
    setJobPostFormOpen(false);
    setJobPostDraft(emptyJobPostForm());
    setJobPostFormResetKey((k) => k + 1);
    // Posted successfully — Jobs stays at 100% until the recruiter starts another add.
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === 'jobs' ? { ...stage, status: 'done', completionPct: 100 } : stage
      )
    );
    setExpandedPanelId('jobs');
    const successNode = RECRUITER_BUDDY_NODES['job-posted-success'];
    setMessages((prev) => [...prev, ...successNode.reply()]);
    setNodeId('job-posted-success');
    setToast({
      id: `job-posted-${Date.now()}`,
      variant: 'success',
      title: JOB_POSTED_SUCCESS_TOAST.title,
      body: JOB_POSTED_SUCCESS_TOAST.body,
    });
  };

  const handleCloseJobPostForm = () => {
    log('branch', { closeJobPostForm: true });
    setJobPostFormOpen(false);
    setConfirmJobPostOpen(false);
    // Keep draft; refresh Jobs preview so panel matches last form edits.
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === 'jobs' && stage.status !== 'not-started' && stage.status !== 'done'
          ? { ...stage, fields: buildJobsPanelFields(jobPostDraft) }
          : stage
      )
    );
  };

  const handleOpenJobForm = (stageId) => {
    log('branch', { openJobFormFromPanel: stageId, mode: jobPostFormMode });
    setConfirmJobPostOpen(false);
    setJobPostFormOpen(true);
    // Opening the form after a prior post starts a new Jobs add cycle.
    if (stageId === 'jobs') {
      setStages((prev) =>
        prev.map((stage) =>
          stage.id === 'jobs' && stage.status === 'done'
            ? { ...stage, status: 'in-progress', completionPct: 8 }
            : stage
        )
      );
    }
  };

  const handleNewChat = () => {
    log('branch', { newChat: true, role });
    if (isRecruiter) {
      const { nodeId: seedId, messages: seedMsgs } = seedRecruiterJump('welcome');
      setNodeId(seedId);
      setMessages(seedMsgs);
      setStages(recruiterStagesWithIcons);
      setExpandedPanelId(null);
      setKybVerified(false);
      setJobPostFormOpen(false);
      setConfirmJobPostOpen(false);
      setJobPostDraft(emptyJobPostForm());
      setJobPostFormMode('manual');
      setJobPostFormResetKey((k) => k + 1);
      setToast({
        id: `recruiter-welcome-${Date.now()}`,
        variant: 'welcome',
        title: RECRUITER_WELCOME_TOAST.title,
        body: RECRUITER_WELCOME_TOAST.body,
      });
      return;
    }
    setNodeId('returning-prompt');
    setMessages(CAREER_BUDDY_NODES['returning-prompt'].seedMessages());
  };

  // Simulated network latency for the Confirm save round-trip (Figma has no
  // distinct "saving" frame of its own, but the toast variants — success/
  // error — only make sense with a real async gap to land in).
  const SIMULATED_SAVE_MS = 900;

  // `fieldsOrEntries` is whichever shape this stage uses (see
  // STAGE_FIELD_DATA) — TalentProfilePanel passes back `entries` for
  // Work Experience, `fields` for every other confirmed stage.
  const handleConfirmStage = (stageId, fieldsOrEntries) => {
    // Jobs Confirm → same ConfirmJobPostModal as the form's Post Job CTA.
    if (stageId === 'jobs') {
      log('branch', { jobsPanelConfirm: true });
      setJobPostFormOpen(false);
      setConfirmJobPostOpen(true);
      return;
    }

    log('dispatch', {
      stageConfirmedFromPanel: stageId,
      hasRetried: Boolean(retriedStages[stageId]),
    });
    setConfirmingStageId(stageId);
    // company-info never uses entries; for talent, check STAGE_FIELD_DATA.
    const usesEntries =
      stageId === 'company-info' ? false : Boolean(STAGE_FIELD_DATA[stageId]?.entries);
    // Recruiter company-info uses COMPANY_SAVE_META; talent stages use STAGE_SAVE_META.
    const saveMeta = stageId === 'company-info' ? COMPANY_SAVE_META : STAGE_SAVE_META[stageId];

    setTimeout(() => {
      if (!retriedStages[stageId]) {
        log('branch', { saveResult: 'error', stageId });
        setRetriedStages((prev) => ({ ...prev, [stageId]: true }));
        setConfirmingStageId(null);
        setToast({
          id: `${stageId}-error`,
          variant: 'error',
          title: 'Error',
          body: 'No internet connection',
        });
        return;
      }

      log('branch', { saveResult: 'success', stageId });
      setConfirmingStageId(null);
      setExpandedPanelId(null);
      setStages((prev) =>
        prev.map((stage) =>
          stage.id === stageId
            ? {
                ...stage,
                status: 'done',
                completionPct: 100,
                ...(usesEntries ? { entries: fieldsOrEntries } : { fields: fieldsOrEntries }),
              }
            : stage
        )
      );
      setToast({
        id: `${stageId}-saved`,
        variant: 'success',
        title: 'Success',
        body: saveMeta?.toastLabel ?? 'Saved',
      });

      if (saveMeta) {
        // System-generated confirmation bubble (Figma 5132:47342/47617 for
        // Educational Background, 5132:63972 for Personal Area of Interest)
        // — right-aligned like a user message via ChatThread's `auto` flag,
        // not real chat input.
        setMessages((prev) => [
          ...prev,
          {
            id: `auto-${stageId}-confirmed`,
            sender: 'user',
            personaLabel: personaName,
            auto: true,
            autoLabel: '[Auto]',
            text: saveMeta.autoMessageText,
          },
        ]);

        // Chain into the next stage's transition prompt (e.g. edu-confirm's
        // save leads into "Ready to move on to your personal area of
        // interest?") the same way `submit()` walks the script — just
        // triggered from this async success instead of user free-text.
        // Career Options: prefer guidanceResumeNodeIdRef (return → section
        // picker; continue → null so chips on exposure-confirm-continue stay).
        const nextNodeId =
          stageId === 'desired-career' ? guidanceResumeNodeIdRef.current : saveMeta.nextNodeId;
        if (nextNodeId) {
          // Recruiter company-info hands off via RECRUITER_BUDDY_NODES;
          // all talent stages use CAREER_BUDDY_NODES.
          const nodeSet = stageId === 'company-info' ? RECRUITER_BUDDY_NODES : CAREER_BUDDY_NODES;
          const nextNode = nodeSet[nextNodeId];
          const transitionMessages = nextNode?.reply
            ? nextNode.reply()
            : (nextNode?.seedMessages?.() ?? []);
          setMessages((prev) => [...prev, ...transitionMessages]);
          setNodeId(nextNodeId);
          if (stageId === 'desired-career') {
            guidanceResumeNodeIdRef.current = null;
            log('branch', { guidanceResumedTo: nextNodeId });
          }
        }
      }
    }, SIMULATED_SAVE_MS);
  };

  const handleModifyStage = (stageId) => {
    log('dispatch', { stageModifyRequested: stageId });
    if (stageId === 'jobs') handleOpenJobForm(stageId);
  };

  // "Let's Play →" inside the Game Store's details view. Only The Escape
  // Room (Figma 5132:61730-62816) has real gameplay built — the other 6
  // games still surface the same warning-toast stub the whole Games mode
  // used to, since no Figma content exists for their actual gameplay yet.
  const handlePlayGame = (game) => {
    if (game.id === 'escape-room') {
      log('branch', { playGame: game.id, real: true });
      setPlayingEscapeRoom(true);
      return;
    }
    log('branch', { playGameStub: game.id });
    setToast({
      id: `play-stub-${game.id}`,
      variant: 'warning',
      title: 'Coming soon',
      body: `${game.title}'s full gameplay isn't built yet.`,
    });
  };

  // "Save & Exit" (or the completion screen's Close) inside the Escape
  // Room — closes the game AND the Game Store modal underneath it, back
  // to the chat, rather than just returning to the store grid.
  const handleExitEscapeRoom = () => {
    log('dispatch', { exitEscapeRoom: true });
    setPlayingEscapeRoom(false);
    setGameStoreOpen(false);
  };

  // Mode-picker card click (Figma 5132:55202-55205) — the card's `id`
  // ('games' | 'mcq' | 'open-chat') is exactly the key personality-mode-
  // picker's own `next` map uses, so this is `submit()` verbatim; a
  // separate prop only so ChatThread doesn't need to know cards and
  // suggested-reply chips share a lookup mechanism.
  const handleSelectModeCard = (cardId) => {
    log('branch', { modeCardSelected: cardId });
    submit(cardId);
  };

  // MCQ answer click (Figma 5132:58211) — inserts the `[Auto] Option X`
  // echo bubble Figma shows (not the literal option text — see the
  // `options` comment in careerBuddyScript.js), then advances via the
  // current node's `next['*']`. Reuses `submit()` for that lookup: MCQ
  // nodes only ever define a wildcard `next`, so any optionId that doesn't
  // literally match a key (it never does) falls through to `next['*']`
  // exactly like free-text input does.
  const handleSelectMcqOption = (optionId) => {
    log('branch', { mcqOptionSelected: optionId, fromNode: nodeId });
    setMessages((prev) => [
      ...prev,
      {
        id: `mcq-option-${nodeId}`,
        sender: 'user',
        personaLabel: personaName,
        auto: true,
        autoLabel: '[Auto]',
        text: `Option ${optionId}`,
      },
    ]);
    submit(optionId);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <div className="shrink-0 h-[clamp(64px,5.2vw,90px)] flex items-stretch">
        <EngagementTopNav
          bgClass="bg-neutral"
          onSaveExit={handleSaveExit}
          showSwitchModes={false}
          className="w-full h-full"
        />
      </div>

      <div className="shrink-0 h-[clamp(60px,4.46vw,77px)] flex items-stretch">
        <EngagementTopBar
          stages={trailStages}
          currentStageIndex={trailStageIndex}
          completionPct={isRecruiter ? 16 : 0}
          interactive={false}
          className="w-full h-full"
        />
      </div>

      {toast && (
        <Toast
          key={toast.id}
          compact={toast.variant !== 'welcome'}
          position="top-center"
          variant={toast.variant}
          title={toast.title}
          body={toast.body}
          duration={toast.variant === 'welcome' ? 5000 : 4000}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* z-0 is load-bearing, not decorative: `relative` alone does NOT
          establish a stacking context (only position + an explicit
          z-index does) — without it, the ellipses' z-index:-1 below
          escapes past <main> and renders behind the whole page instead of
          just behind <main>'s own children, making them invisible.
          overflow-clip (not overflow-hidden) is ALSO load-bearing: hidden
          still permits *programmatic* scrollLeft/scrollTop (just hides the
          bar) — a real bug hit here where a focus-driven browser
          scroll-into-view silently shifted this whole column sideways with
          no visible scrollbar to reveal why. clip blocks scrolling outright,
          which is correct since this row was never meant to scroll. */}
      <main className="relative z-0 flex-1 min-h-0 overflow-clip flex">
        {/* Page-level background glow ellipses — fixed regardless of chat
            scroll (siblings of the scrolling column, not inside it), same
            pattern as InstitutionOnboardingLayout/ParentOnboardingLayout.
            Figma 5132:44956 ("Hovered States", 1728x893 reference for this
            <main> — the 1117-tall canvas minus the 224px nav/breadcrumb
            offset above it). Positioned as a CENTRE-point percentage of
            this container + translate(-50%,-50%) — same technique already
            used for the institution right-panel photo cards — so the glow
            stays proportionally placed at any viewport width instead of
            drifting at fixed px (each ellipse's own size is still a fixed
            px diameter per Figma; only the anchor point is percentage-based). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            left: '5.99%',
            top: '-22.23%' /* fixed 2026-07-24: was 0.17% from an arithmetic slip — correct centre-y = (-484 + 571/2) / 893 */,
            transform: 'translate(-50%,-50%)',
            width: '571px',
            height: '571px',
            zIndex: -1,
          }}
        >
          <img
            src={pageEllipseTl}
            alt=""
            className="absolute block max-w-none"
            style={{
              inset: '-35.03%',
              width: 'calc(100% + 70.06%)',
              height: 'calc(100% + 70.06%)',
            }}
            draggable={false}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            left: '98.93%',
            top: '93.1%',
            transform: 'translate(-50%,-50%)',
            width: '571px',
            height: '571px',
            zIndex: -1,
          }}
        >
          <img
            src={pageEllipseBr}
            alt=""
            className="absolute block max-w-none"
            style={{
              inset: '-35.03%',
              width: 'calc(100% + 70.06%)',
              height: 'calc(100% + 70.06%)',
            }}
            draggable={false}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            left: '52.8%',
            top: '12.9%',
            transform: 'translate(-50%,-50%)',
            width: '473px',
            height: '473px',
            zIndex: -1,
          }}
        >
          <img
            src={pageEllipseCenter}
            alt=""
            className="absolute block max-w-none"
            style={{
              inset: '-42.28%',
              width: 'calc(100% + 84.56%)',
              height: 'calc(100% + 84.56%)',
            }}
            draggable={false}
          />
        </div>

        {/* LEFT — hero + chat, on a soft green-to-cream gradient (Figma 5132:43308).
            No `z-index` set here alongside `relative` is DELIBERATE: it keeps this
            wrapper from forming its own stacking context, so the gradient div below
            (z:-2) and the page-level ellipses above (z:-1) both resolve directly in
            <main>'s shared stacking context instead of the ellipses getting trapped
            underneath this wrapper as an opaque sibling. overflow-clip, not
            overflow-hidden, for the same scrollLeft-corruption reason as
            <main> above — this pane's own grid-texture decoration (below)
            deliberately bleeds past its right edge, which is exactly the
            kind of overflow that can get silently scrolled into view. */}
        <div className="relative flex-1 min-h-0 flex flex-col overflow-clip">
          {/* Gradient backdrop as its own layer (z:-2, behind the page-level
              ellipses at z:-1) rather than a `background` set directly on this
              wrapper — a background painted on the wrapper itself sits at the
              wrapper's own (auto/0) paint level, which is ABOVE the ellipses'
              z:-1 and was fully hiding them underneath this opaque box. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(160deg, #ebf1ec 0%, #fdfdfc 55%, #ffffff 100%)',
              zIndex: -2,
            }}
          />
          {/* Fixed background decorations, scoped to the chat pane (Figma
              5132:44995, 1112x893 reference — pane's own overflow-hidden
              clips them at the edges exactly like Figma). Positioned as a
              centre-point percentage of the pane + translate(-50%,-50%),
              same reasoning as the page-level ellipses above: stays
              proportionally placed at any pane width instead of drifting
              at fixed px. Sit behind everything else via negative z-index;
              pointer-events-none so they never intercept clicks. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute z-0"
            style={{
              left: '20.32%',
              top: '14.4%',
              transform: 'translate(-50%,-50%)',
              width: '100px',
              height: '97px',
            }}
          >
            <CareerBuddyBgSparkIcon className="size-full" />
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute z-0"
            style={{
              left: '91.7%',
              top: '23.6%',
              transform: 'translate(-50%,-50%)',
              width: '90px',
              height: '90px',
            }}
          >
            <CareerBuddyBgEducationIcon className="size-full" />
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute z-0"
            style={{
              left: '2.65%',
              top: '50.92%',
              transform: 'translate(-50%,-50%)',
              width: '78px',
              height: '97px',
            }}
          >
            <CareerBuddyBgChartIcon className="size-full" />
          </span>
          {/* Grid texture (Figma 5132:45036). Figma's own node metadata places
              this literally at x:1112-1470 of the 1728px full-width reference
              frame — i.e. entirely inside the RIGHT PANEL's own horizontal
              range (panel starts at x:1112 too), not the chat pane. Confirmed
              via get_screenshot on 5132:44956: the reference render shows no
              visible grid there either, since the panel's own opaque bg-white
              legitimately paints over it — this node is inert in Figma, not a
              rendering bug on our side. Since the user explicitly asked for
              this as a visible background texture IN the chat pane (supplied
              the PNG for exactly that), it's repositioned here to the pane's
              own bottom-right corner instead — the one corner not already
              claimed by the spark/education/chart decorations above — rather
              than reproducing a position that can never show anything.
              The source PNG's own alpha tops out around 21% (most pixels far
              fainter still) — nearly invisible against this pane's near-white
              gradient, and CSS opacity/filters can only ever REDUCE that
              further, never boost it. Rendered as a mask instead: the PNG
              supplies the grid-line shape, a solid colour + independently-
              chosen opacity supplies the actual visibility. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute overflow-hidden z-0"
            style={{
              left: '95%',
              top: '90%',
              transform: 'translate(-50%,-50%)',
              width: '358px',
              height: '405px',
            }}
          >
            <div
              className="absolute block"
              style={{
                left: '-90.11%',
                top: 0,
                width: '280.22%',
                height: '124.47%',
                backgroundColor: '#94a3b8',
                opacity: 1,
                WebkitMaskImage: `url(${careerBuddyBgGrid})`,
                maskImage: `url(${careerBuddyBgGrid})`,
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
              }}
            />
          </div>

          <CareerBuddyHistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} />
          <GameStoreModal
            open={gameStoreOpen}
            onClose={() => setGameStoreOpen(false)}
            onPlayGame={handlePlayGame}
          />
          <EscapeRoomGame open={playingEscapeRoom} onExit={handleExitEscapeRoom} />
          <JobPostFormModal
            open={jobPostFormOpen}
            onClose={handleCloseJobPostForm}
            onRequestPost={handleRequestJobPost}
            resetKey={jobPostFormResetKey}
            mode={jobPostFormMode}
            value={jobPostDraft}
            onChange={handleJobDraftChange}
          />
          <ConfirmJobPostModal
            open={confirmJobPostOpen}
            onClose={handleGoBackEditJobPost}
            onConfirm={handleConfirmJobPost}
          />

          {heroMode === 'first-time' && <FirstTimeHero hero={firstTimeHero} />}
          {heroMode === 'returning' && !isRecruiter && <ReturningHero />}

          <ChatThread
            messages={enrichedMessages}
            onSend={submit}
            suggestedReplies={activeSuggestedReplies}
            onSelectOption={handleSelectMcqOption}
            onSelectModeCard={handleSelectModeCard}
            onNewChat={showNewChat ? handleNewChat : undefined}
            onOpenHistory={showChrome ? () => setHistoryOpen(true) : undefined}
            enableAttach={enableAttach}
            onAttach={handleAttach}
            onAttachRejected={handleAttachRejected}
          />
        </div>

        {/* RIGHT — role-specific panel */}
        {isRecruiter ? (
          <RecruiterPanel
            className="w-[clamp(300px,26vw,500px)] shrink-0 border-l border-border-default"
            stages={stages}
            expandedId={expandedPanelId}
            onToggleExpand={(id) => setExpandedPanelId((prev) => (prev === id ? null : id))}
            onConfirm={handleConfirmStage}
            onModify={handleModifyStage}
            onOpenForm={handleOpenJobForm}
            confirming={confirmingStageId}
          />
        ) : (
          <TalentProfilePanel
            className="w-[clamp(300px,26vw,500px)] shrink-0 border-l border-border-default"
            stages={panelStages}
            expandedId={expandedPanelId}
            onToggleExpand={(id) => setExpandedPanelId((prev) => (prev === id ? null : id))}
            onConfirm={handleConfirmStage}
            onModify={handleModifyStage}
            confirming={confirmingStageId}
          />
        )}
      </main>
    </div>
  );
};

export default CareerBuddySection;
