import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import ChatThread from '../../ui/ChatThread.jsx';
import Toast from '../../ui/Toast.jsx';
import CareerBuddyAvatar from '../../shared/CareerBuddyAvatar.jsx';
import TalentProfilePanel from './TalentProfilePanel.jsx';
import CareerBuddyHero from './CareerBuddyHero.jsx';
import CareerBuddyHistoryDrawer from './CareerBuddyHistoryDrawer.jsx';
import CareerBuddyOptOutModal from './CareerBuddyOptOutModal.jsx';
import VoiceCallOverlay from './VoiceCallOverlay.jsx';
import VoiceSettingsOverlay from './VoiceSettingsOverlay.jsx';
import AssessmentReportCard from './AssessmentReportCard.jsx';
import { DEFAULT_VOICE_ID } from './careerBuddyVoices.js';
import { FIRST_TIME_HERO } from './careerBuddyScript.js';
import {
  AvatarStepIcon,
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
} from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';
import { isLoggedIn } from '../../../services/auth.api.js';
import {
  sendTurn,
  fetchMyProfile,
  currentEntityId,
  currentFirstName,
  currentUserLabel,
  sendFeedback,
  regenerateReply,
  fetchHistory,
  fetchAssessmentResults,
  AgentError,
} from '../../../services/careerBuddy.api.js';
import {
  personalityFromResults,
  personalityProgress,
  threadFromSession,
  sessionMatchesThread,
  sessionGroups,
  turnToBubbles,
  userBubble,
  autoBubble,
  fileBubble,
  localBotBubble,
  chipActionFor,
  stageForSection,
  buildPanelStages,
  changedCardFields,
  loadThreads,
  saveThread,
  newThread,
  threadTitle,
  historyGroups,
} from './careerBuddyLive.js';

const log = debug('CareerBuddyLive');

/*
 * Career Buddy - LIVE (talent). The real screen: talks to the V2 turn
 * controller; the scripted CareerBuddySection stays for demos (recruiter,
 * parent, DemoNavigator).
 *
 * 2026-10-16 integration of the Figma screen pieces (Quazor's decisions):
 *   - Talent Profile Panel with the 6-state rows; a pending confirm card is
 *     reviewed IN THE PANEL with Modify / Update / Confirm (Figma 5132:46916-
 *     47617). Confirm sends "Yes, save it"; edited fields travel as a
 *     structured `card_edits` slot so the agent saves exactly what was typed.
 *   - Stage trail top bar + completion %, first-visit hero.
 *   - Success / error toasts; "[Auto] ... confirmed ✅" bubble.
 *   - New Chat + History drawer: conversations kept in this browser per
 *     talent (the agent's own memory is untouched - a new chat simply starts
 *     with an empty transcript, which the agent greets as a returning user).
 *   - Thumbs up/down stored by the agent (/career-buddy/feedback); Regenerate
 *     re-words the reply (never re-runs the turn, so it can't double-save).
 *   - Dictation (mic), attach, voice call (speech in, spoken replies) and
 *     voice settings are shown.
 *   - Personality / career-interests report with "Add your comment".
 *   - Save & Exit -> the opt-out modal; a scheduled return asks the agent to
 *     remind the talent.
 */
const OPENER = 'Hi';

const BASE_STAGES = [
  { id: 'avatar', trailLabel: 'Avatar', Icon: AvatarStepIcon },
  {
    id: 'personal-info',
    trailLabel: 'Personal Info',
    panelLabel: 'Personal Info.',
    Icon: PanelPersonInfoIcon,
  },
  {
    id: 'educational-background',
    trailLabel: 'Education',
    panelLabel: 'Educational Background',
    Icon: PanelEducationIcon,
  },
  {
    id: 'personal-interests',
    trailLabel: 'Interests',
    panelLabel: 'Personal area of interest',
    Icon: PanelInterestsIcon,
  },
  {
    id: 'personality',
    trailLabel: 'Personality',
    panelLabel: 'Personality',
    Icon: PanelPersonalityIcon,
  },
  {
    id: 'skills',
    trailLabel: 'Skills',
    panelLabel: 'Skills (Competencies)',
    Icon: PanelSkillsIcon,
  },
  {
    id: 'work-experience',
    trailLabel: 'Work',
    panelLabel: 'Work Experience',
    Icon: PanelWorkExperienceIcon,
  },
  {
    id: 'project-portfolio',
    trailLabel: 'Portfolio',
    panelLabel: 'Project Portfolio',
    Icon: PanelPortfolioIcon,
  },
  {
    id: 'certifications',
    trailLabel: 'Certs',
    panelLabel: 'Certifications',
    Icon: PanelCertificationsIcon,
  },
  {
    id: 'desired-career',
    trailLabel: 'Goals',
    panelLabel: 'Career Options',
    Icon: PanelCareerOptionsIcon,
  },
  {
    id: 'talent-pitch',
    trailLabel: 'Pitch',
    panelLabel: 'Career Pitch',
    Icon: PanelMicrophoneIcon,
  },
];
const stageLabel = (id) => BASE_STAGES.find((s) => s.id === id)?.panelLabel ?? 'Section';

const ThinkingBubble = {
  id: 'cb-thinking',
  sender: 'bot',
  personaLabel: 'Career Buddy',
  text: 'Thinking…',
};

const PERSONALITY_KEY = (entityId) => `careerBuddy.personality.${entityId}`;
const readJson = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const writeJson = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota - history is a convenience */
  }
};

/* Voice replies: the browser's speech synthesis, tuned per Career Buddy voice. */
const VOICE_TUNING = {
  sol: { rate: 0.95, pitch: 0.9 },
  bruce: { rate: 0.9, pitch: 0.75 },
  tali: { rate: 1.05, pitch: 1.15 },
};
const speak = (text, voiceId, onEnd) => {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  if (!synth || !text) {
    onEnd?.();
    return;
  }
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[*_#>]/g, ''));
  const t = VOICE_TUNING[voiceId] || VOICE_TUNING.tali;
  u.rate = t.rate;
  u.pitch = t.pitch;
  u.lang = 'en-GB';
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  synth.speak(u);
};

const CareerBuddyLiveSection = () => {
  const navigate = useNavigate();
  const entityId = currentEntityId();
  const me = currentUserLabel();
  const firstName = currentFirstName();

  // ---- conversation (persisted per talent in this browser) ----
  const [threads, setThreads] = useState(() => (entityId ? loadThreads(entityId) : []));
  const [thread, setThread] = useState(() => {
    const last = entityId ? loadThreads(entityId)[0] : null;
    return last && last.messages?.length ? last : newThread();
  });
  const { messages, history, chips, chipActions } = thread;
  const patchThread = useCallback((patch) => {
    setThread((t) => ({ ...t, ...(typeof patch === 'function' ? patch(t) : patch) }));
  }, []);

  // ---- screen state ----
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [profile, setProfile] = useState(null);
  const [live, setLive] = useState(() => thread.live || { states: {}, card: null });
  // A pending review survives a reload / history switch with its conversation.
  useEffect(() => {
    patchThread({ live });
  }, [live, patchThread]);
  const [expandedPanelId, setExpandedPanelId] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [mobilePane, setMobilePane] = useState('chat');
  const [historyOpen, setHistoryOpen] = useState(false);
  // Past conversations from the agent (null until loaded / agent unreachable).
  const [serverSessions, setServerSessions] = useState(null);
  const [voiceCallOpen, setVoiceCallOpen] = useState(false);
  const [voiceSettingsOpen, setVoiceSettingsOpen] = useState(false);
  const [voiceId, setVoiceId] = useState(DEFAULT_VOICE_ID);
  const [speaking, setSpeaking] = useState(false);
  const [optOutOpen, setOptOutOpen] = useState(false);
  const [personality, setPersonality] = useState(() =>
    entityId ? readJson(PERSONALITY_KEY(entityId), null) : null
  );
  const [personalityReq, setPersonalityReq] = useState(null);
  const lastTurnRef = useRef(null);
  const openedRef = useRef(false);
  const voiceOpenRef = useRef(false);
  voiceOpenRef.current = voiceCallOpen;

  // Persist the conversation whenever it changes (thinking bubble excluded).
  useEffect(() => {
    if (!entityId || !thread.messages.length) return;
    const clean = {
      ...thread,
      messages: thread.messages.filter((m) => m.id !== ThinkingBubble.id),
    };
    setThreads(saveThread(entityId, { ...clean, title: threadTitle(clean) }));
  }, [entityId, thread]);

  const refreshProfile = useCallback(async () => {
    try {
      setProfile(await fetchMyProfile());
    } catch (err) {
      log.error('profile refresh failed', err?.message);
    }
    // Personality rows come from the saved assessment results (any device).
    const res = entityId ? await fetchAssessmentResults(entityId) : null;
    if (res) {
      const results = res.rows;
      setPersonalityReq(personalityProgress(results, res.required));
      const fromServer = personalityFromResults(results);
      setPersonality((prev) => {
        const next = { ...(prev || {}), ...fromServer };
        writeJson(PERSONALITY_KEY(entityId), next);
        return next;
      });
    }
  }, [entityId]);

  const refreshHistory = useCallback(async () => {
    if (!entityId) return;
    const sessions = await fetchHistory(entityId);
    if (sessions) setServerSessions(sessions);
  }, [entityId]);
  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);
  useEffect(() => {
    if (historyOpen) refreshHistory();
  }, [historyOpen, refreshHistory]);

  const showToast = (variant, title, body) =>
    setToast({ id: `${variant}-${Date.now()}`, variant, title, body });

  const applyTurnToPanel = useCallback(
    (turn) => {
      const stage = stageForSection(turn.card?.section ?? turn.sectionState?.section);
      setLive((prev) => {
        const states = { ...prev.states };
        if (turn.sectionState) {
          const s = stageForSection(turn.sectionState.section);
          if (s) {
            if (turn.sectionState.state === 'saved') delete states[s];
            else states[s] = turn.sectionState.state;
          }
        }
        return { states, card: turn.card?.fields?.length ? turn.card : null };
      });
      if (turn.card?.fields?.length && stage) {
        setExpandedPanelId(stage);
      }
      if (turn.sectionState?.state === 'saved') {
        const s = stageForSection(turn.sectionState.section);
        showToast('success', 'Success', `${stageLabel(s)} saved`);
      }
      if (turn.report?.bars?.length) {
        const rows = [
          ...(turn.report.code ? [{ label: 'Career-interest code', value: turn.report.code }] : []),
          ...turn.report.bars.map((b) => ({ label: b.label, value: `${b.value}%` })),
        ];
        const next = { ...(personality || {}), [turn.report.assessmentType]: rows };
        setPersonality(next);
        writeJson(PERSONALITY_KEY(entityId), next);
      }
    },
    [entityId, personality]
  );

  const runTurn = useCallback(
    async (text, { chipAction = null, showUser = true, autoText = null } = {}) => {
      if (!entityId || busy) return;
      lastTurnRef.current = { text, chipAction };
      setBusy(true);
      const shown = autoText ? [autoBubble(autoText)] : showUser ? [userBubble(text)] : [];
      patchThread((t) => ({
        messages: [...t.messages, ...shown, ThinkingBubble],
        chips: [],
        chipActions: [],
      }));
      try {
        const turn = await sendTurn({ entityId, message: text, history, chipAction });
        log('turn', {
          routedTo: turn.routedTo,
          reason: turn.routeReason,
          state: turn.sectionState,
        });
        patchThread((t) => ({
          messages: [
            ...t.messages.filter((x) => x.id !== ThinkingBubble.id),
            ...turnToBubbles(turn),
          ],
          history: [
            ...t.history,
            { role: 'user', content: text },
            { role: 'assistant', content: turn.reply },
          ],
          chips: turn.chips || [],
          chipActions: turn.chipActions || [],
        }));
        applyTurnToPanel(turn);
        refreshProfile();
        if (voiceOpenRef.current) {
          setSpeaking(true);
          speak(turn.reply, voiceId, () => setSpeaking(false));
        }
      } catch (err) {
        patchThread((t) => ({
          messages: t.messages.filter((x) => x.id !== ThinkingBubble.id),
          chips: ['Try again'],
          chipActions: [],
        }));
        showToast(
          'error',
          'Error',
          err instanceof AgentError ? err.message : 'Something went wrong talking to Career Buddy.'
        );
        log.error('turn failed', err?.detail || err);
      } finally {
        setBusy(false);
        setConfirming(null);
      }
    },
    [entityId, busy, history, patchThread, applyTurnToPanel, refreshProfile, voiceId]
  );

  // First open: restore the last conversation, or greet in a new one.
  useEffect(() => {
    if (!entityId || openedRef.current) return;
    openedRef.current = true;
    refreshProfile();
    if (!thread.messages.length) runTurn(OPENER, { showUser: false });
  }, [entityId, runTurn, refreshProfile, thread.messages.length]);

  const handleSend = (text) => {
    const trimmed = String(text || '').trim();
    if (!trimmed) return;
    if (trimmed === 'Try again' && lastTurnRef.current && !chipActionFor(trimmed, chipActions)) {
      const { text: lastText, chipAction } = lastTurnRef.current;
      runTurn(lastText, { chipAction, showUser: false });
      return;
    }
    runTurn(trimmed, { chipAction: chipActionFor(trimmed, chipActions) });
  };

  // ---- panel: Modify / Update / Confirm (Figma 5132:46916-47617) ----
  const handleConfirmStage = (stageId, updatedFields) => {
    const card = live.card;
    if (!card || stageForSection(card.section) !== stageId) return;
    const edits = changedCardFields(card, updatedFields);
    setConfirming(stageId);
    if (Object.keys(edits).length === 0) {
      runTurn('Yes, save it', { autoText: `${stageLabel(stageId)} confirmed ✅` });
    } else {
      runTurn('Yes, save it with my changes', {
        autoText: `${stageLabel(stageId)} updated and confirmed ✅`,
        chipAction: {
          label: 'Update',
          intent: 'build_profile',
          section: card.section,
          slots: [{ name: 'card_edits', value: JSON.stringify(edits) }],
        },
      });
    }
  };

  // ---- report answer ("are we spot on?" + comment) ----
  const handleReportAnswer = (message, label, note) => {
    patchThread((t) => ({
      messages: t.messages.map((m) => (m.id === message.id ? { ...m, reportAnswer: label } : m)),
    }));
    runTurn(label, {
      chipAction: {
        label,
        intent: 'take_assessment',
        section: 'personality',
        slots: [
          { name: 'assessmentType', value: message.report.assessmentType },
          ...(note ? [{ name: 'sentiment_note', value: note }] : []),
        ],
      },
    });
  };

  // ---- feedback + regenerate ----
  const handleFeedback = (message, rating) => {
    const idx = messages.findIndex((m) => m.id === message.id);
    const userMessage = [...messages.slice(0, idx)]
      .reverse()
      .find((m) => m.sender === 'user' && m.text)?.text;
    patchThread((t) => ({
      messages: t.messages.map((m) => (m.id === message.id ? { ...m, feedback: rating } : m)),
    }));
    sendFeedback({ entityId, message, rating, userMessage });
  };
  const handleRegenerate = async (message) => {
    if (!message.text) return;
    try {
      const text = await regenerateReply(message.text);
      patchThread((t) => ({
        messages: t.messages.map((m) => (m.id === message.id ? { ...m, text } : m)),
      }));
    } catch {
      showToast('error', 'Error', "Couldn't regenerate that reply.");
    }
  };

  // ---- attach ----
  const handleAttach = (file) => {
    patchThread((t) => ({
      messages: [
        ...t.messages,
        fileBubble(file),
        localBotBubble(
          `Thanks - I've kept ${file.name} with this conversation. I can't read files yet, so tell me the key details (for example your school, a job or a certificate) and I'll add them to your profile.`
        ),
      ],
    }));
  };

  // ---- new chat / history ----
  const handleNewChat = () => {
    if (busy) return;
    window.speechSynthesis?.cancel();
    setLive({ states: {}, card: null });
    setExpandedPanelId(null);
    const fresh = newThread();
    setThread(fresh);
    setHistoryOpen(false);
    // Greet in the new conversation (empty transcript -> returning greeting).
    setTimeout(() => runTurnRef.current?.(OPENER, { showUser: false }), 0);
  };
  const runTurnRef = useRef(runTurn);
  runTurnRef.current = runTurn;
  const handleSelectHistory = (entry) => {
    const session = serverSessions?.find((s) => s.id === entry.id);
    if (session) {
      if (!sessionMatchesThread(session, thread)) {
        window.speechSynthesis?.cancel();
        setLive({ states: {}, card: null });
        setExpandedPanelId(null);
        setThread(threadFromSession(session));
      }
      setHistoryOpen(false);
      return;
    }
    const t = threads.find((x) => x.id === entry.id);
    if (!t) return;
    setLive(t.live || { states: {}, card: null });
    setThread(t);
    setHistoryOpen(false);
  };

  // ---- save & exit / opt out ----
  const handleConfirmSchedule = (date) => {
    const when = date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    // The exact date travels as a slot (09:00 Accra = UTC) so the agent never
    // has to re-parse the words; the agent schedules it via schedule_reengagement.
    const scheduledFor = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0, 0)
    ).toISOString();
    const message = `Please remind me to continue my profile on ${when}.`;
    sendTurn({
      entityId,
      message,
      history,
      chipAction: {
        label: message,
        intent: 'remind_me',
        slots: [{ name: 'scheduledFor', value: scheduledFor }],
      },
    }).catch(() => undefined);
    setOptOutOpen(false);
    navigate('/profile/engagement');
  };

  // ---- derived ----
  const panelStages = useMemo(() => {
    const extras = {
      personality: personality
        ? [
            ...(personality.big_five || []),
            ...(personality.riasec || []),
            ...(personality.mbti || []),
          ]
        : null,
    };
    return buildPanelStages(BASE_STAGES, profile, live, {
      ...extras,
      personalityProgress: personalityReq,
    });
  }, [profile, live, personality, personalityReq]);
  const pct =
    typeof profile?.profileCompletion === 'number' ? Math.round(profile.profileCompletion) : 0;
  const trailIndex = useMemo(() => {
    const active = BASE_STAGES.findIndex(
      (s) => live.states[s.id] || (live.card && stageForSection(live.card.section) === s.id)
    );
    if (active >= 0) return active;
    const firstOpen = BASE_STAGES.findIndex(
      (s, i) => i > 0 && panelStages.find((p) => p.id === s.id)?.status === 'not-started'
    );
    return firstOpen >= 0 ? firstOpen : 0;
  }, [live, panelStages]);
  // Trail ticks follow the panel (saved data), not the trail position.
  // Avatar is done before the talent reaches Career Buddy (onboarding).
  const stageStatuses = useMemo(() => {
    const out = { avatar: 'completed' };
    for (const p of panelStages) out[p.id] = p.status === 'done' ? 'completed' : 'not-started';
    return out;
  }, [panelStages]);
  const historyList = serverSessions ? sessionGroups(serverSessions) : historyGroups(threads);
  const activeHistoryId =
    serverSessions?.find((s) => sessionMatchesThread(s, thread))?.id ?? thread.id;

  const lastBot = [...messages]
    .reverse()
    .find((m) => m.sender === 'bot' && m.id !== ThinkingBubble.id);
  const reportPending = Boolean(lastBot?.report && !lastBot.reportAnswer);
  const enriched = messages.map((m) => {
    let out = m;
    if (m.report) {
      out = {
        ...out,
        content: (
          <AssessmentReportCard
            report={m.report}
            answered={m.reportAnswer || null}
            disabled={busy || m !== lastBot}
            onAnswer={(label, note) => handleReportAnswer(m, label, note)}
          />
        ),
      };
    }
    if (m.reviewSection) {
      const stage = stageForSection(m.reviewSection);
      out = {
        ...out,
        linkButton: {
          label: 'Review in profile panel',
          onClick: () => {
            setExpandedPanelId(stage);
            setMobilePane('profile');
          },
        },
      };
    }
    return out;
  });
  const hasHistory =
    (serverSessions?.length ?? 0) > 0 ||
    threads.some(
      (t) => t.id !== thread.id && t.messages?.some((m) => m.sender === 'user' && !m.auto)
    );
  const showHero =
    !hasHistory && messages.filter((m) => m.sender === 'user' && !m.auto).length === 0;

  if (!isLoggedIn() || !entityId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral p-6 text-center font-sans">
        <CareerBuddyAvatar size={80} />
        <p className="text-[16px] text-[#595959]">Log in to talk to Career Buddy.</p>
        <Link to="/login" className="rounded-full bg-[#387440] px-6 py-2 text-white">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen flex-col overflow-hidden bg-white font-sans max-lg:h-[100dvh]"
      data-testid="career-buddy-live"
    >
      <div className="shrink-0 h-[clamp(64px,5.2vw,90px)] flex items-stretch max-lg:h-auto">
        <EngagementTopNav
          userName={me.name}
          userInitials={me.initials}
          bgClass="bg-neutral"
          onSaveExit={() => setOptOutOpen(true)}
          className="w-full h-full"
        />
      </div>
      <div className="shrink-0 h-[clamp(60px,4.46vw,77px)] flex items-stretch max-lg:h-auto">
        <EngagementTopBar
          stages={BASE_STAGES}
          currentStageIndex={trailIndex}
          completionPct={pct}
          stageStatuses={stageStatuses}
          trackPct={pct}
          progressWidthClass="w-[380px]"
          interactive={false}
          className="w-full h-full"
        />
      </div>

      {/* Chat | Profile switch - below lg only one pane shows at a time. */}
      <div className="lg:hidden shrink-0 border-b border-border-default bg-white px-4 py-1.5">
        <div
          role="group"
          aria-label="Career Buddy view"
          className="grid grid-cols-2 gap-1 rounded-[10px] bg-neutral p-0.5"
        >
          {[
            { id: 'chat', label: 'Chat' },
            { id: 'profile', label: 'Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={mobilePane === tab.id}
              onClick={() => setMobilePane(tab.id)}
              className={`relative inline-flex min-h-8 items-center justify-center gap-2 rounded-[8px] text-[14px] font-semibold ${
                mobilePane === tab.id
                  ? 'bg-white text-brand-green shadow-sm'
                  : 'text-content-secondary'
              }`}
            >
              {tab.label}
              {tab.id === 'profile' && mobilePane === 'chat' && live.card && (
                <span
                  aria-label="Waiting for your review"
                  className="size-2 rounded-full bg-accent"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <Toast
          key={toast.id}
          compact
          position="top-center"
          variant={toast.variant}
          title={toast.title}
          body={toast.body}
          duration={4000}
          onDismiss={() => setToast(null)}
        />
      )}

      <main className="relative z-0 flex-1 min-h-0 overflow-clip flex bg-neutral">
        <div
          className={`relative flex min-w-0 flex-1 flex-col ${mobilePane === 'profile' ? 'max-lg:hidden' : ''}`}
        >
          <CareerBuddyHistoryDrawer
            open={historyOpen}
            onClose={() => setHistoryOpen(false)}
            groups={historyList}
            activeId={activeHistoryId}
            onSelect={handleSelectHistory}
          />
          {showHero && !voiceCallOpen && (
            <CareerBuddyHero
              hero={{
                ...FIRST_TIME_HERO,
                buddyCardLabel: firstName
                  ? `Hi ${firstName}, I'm Career Buddy,`
                  : FIRST_TIME_HERO.buddyCardLabel,
              }}
            />
          )}
          <div className="relative flex flex-1 min-h-0 flex-col">
            <ChatThread
              messages={enriched}
              onSend={handleSend}
              suggestedReplies={busy || reportPending ? [] : chips}
              disabled={busy}
              onNewChat={handleNewChat}
              onOpenHistory={() => setHistoryOpen(true)}
              onOpenVoiceSettings={() => setVoiceSettingsOpen(true)}
              onOpenVoiceCall={() => setVoiceCallOpen(true)}
              enableAttach
              onAttach={handleAttach}
              onAttachRejected={(name) =>
                showToast('error', 'File too large', `${name} is over 10 MB.`)
              }
              onFeedback={handleFeedback}
              onRegenerate={handleRegenerate}
              className="min-h-0 flex-1"
            />
            <VoiceCallOverlay
              open={voiceCallOpen && !voiceSettingsOpen}
              voiceId={voiceId}
              userName={me.name}
              onUtterance={(text) => runTurn(text)}
              paused={busy || speaking}
              status={
                busy ? 'Career Buddy is thinking…' : speaking ? 'Career Buddy is speaking…' : ''
              }
              onHangUp={() => {
                window.speechSynthesis?.cancel();
                setSpeaking(false);
                setVoiceCallOpen(false);
              }}
              onOpenSettings={() => setVoiceSettingsOpen(true)}
            />
            <VoiceSettingsOverlay
              open={voiceSettingsOpen}
              voiceId={voiceId}
              onDone={(id) => {
                setVoiceId(id);
                setVoiceSettingsOpen(false);
              }}
              onCancel={() => setVoiceSettingsOpen(false)}
            />
          </div>
        </div>

        <TalentProfilePanel
          className={`w-[clamp(300px,26vw,500px)] shrink-0 border-l border-border-default max-lg:min-h-0 max-lg:w-full max-lg:flex-1 max-lg:border-l-0 max-lg:px-4 ${
            mobilePane === 'chat' ? 'max-lg:hidden' : ''
          }`}
          stages={panelStages}
          expandedId={expandedPanelId}
          onToggleExpand={(id) => setExpandedPanelId((prev) => (prev === id ? null : id))}
          onConfirm={handleConfirmStage}
          onModify={(id) => log('modify', id)}
          confirming={confirming}
        />
      </main>

      <CareerBuddyOptOutModal
        open={optOutOpen}
        initialStep="journey"
        onClose={() => setOptOutOpen(false)}
        onChooseDifferentMode={() => setOptOutOpen(false)}
        onGoToDashboard={() => {
          setOptOutOpen(false);
          navigate('/profile/engagement');
        }}
        onConfirmSchedule={handleConfirmSchedule}
      />
    </div>
  );
};

export default CareerBuddyLiveSection;
