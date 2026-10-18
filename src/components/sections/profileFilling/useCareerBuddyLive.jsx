/* Hook module (not a component): it exports the hook plus shared constants, so
   fast refresh reloads it fully on edit - fine. */
/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentReportCard from './AssessmentReportCard.jsx';
import PracticeReviewCard from './PracticeReviewCard.jsx';
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
  speakable,
  isPracticeTurn,
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
 * useCareerBuddyLive - the LIVE talent Career Buddy (V2 turn controller).
 *
 * 2026-10-18: moved out of CareerBuddyLiveSection (which was laid out from the
 * earlier Figma frames) so the newest screen - CareerBuddySection with the
 * Focused / Playful design - renders the real conversation, and the dashboard
 * "Ask Buddy" panel shares the same one. Behaviour is unchanged from the
 * 2026-10-16/17 integration:
 *   - Talent Profile Panel rows; a pending confirm card is reviewed in the
 *     panel with Modify / Update / Confirm. Confirm sends "Yes, save it";
 *     edited fields travel as a `card_edits` slot.
 *   - Stage trail + completion %, first-visit hero.
 *   - Success / error toasts; "[Auto] ... confirmed" bubble.
 *   - New Chat + History (agent sessions, falling back to this browser).
 *   - Thumbs up/down, Regenerate (re-words, never re-runs the turn).
 *   - Attach, voice call (speech in, spoken replies), practice interviews.
 *   - Personality / career-interests report with "Add your comment".
 *   - Save & Exit schedule -> the agent reminds the talent.
 *
 * Options:
 *   enabled          false = inert (no requests), for the scripted demo.
 *   voiceCallOpen    the screen's voice-call state (replies are spoken).
 *   onShowProfile    called when a reply points at the profile panel
 *                    (small screens switch to the Profile pane).
 */
export const OPENER = 'Hi';

/**
 * Whether this build can reach the agent: local dev proxies /agent, a deployed
 * build needs VITE_AGENT_BASE_URL (or VITE_CAREER_BUDDY_LIVE=1). Without it the
 * screens keep the scripted demo instead of showing "Couldn't reach Career Buddy".
 * VITE_CAREER_BUDDY_LIVE=0 turns live off everywhere.
 */
const ENV = import.meta.env || {};
export const LIVE_AVAILABLE =
  ENV.VITE_CAREER_BUDDY_LIVE !== '0' &&
  Boolean(ENV.DEV || ENV.VITE_AGENT_BASE_URL || ENV.VITE_CAREER_BUDDY_LIVE === '1');

export const LIVE_STAGES = [
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
const stageLabel = (id) => LIVE_STAGES.find((s) => s.id === id)?.panelLabel ?? 'Section';

export const THINKING_ID = 'cb-thinking';
const ThinkingBubble = {
  id: THINKING_ID,
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
  const u = new SpeechSynthesisUtterance(speakable(text));
  const t = VOICE_TUNING[voiceId] || VOICE_TUNING.tali;
  u.rate = t.rate;
  u.pitch = t.pitch;
  u.lang = 'en-GB';
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  synth.speak(u);
};

export function useCareerBuddyLive({
  enabled = true,
  voiceCallOpen = false,
  voiceId = DEFAULT_VOICE_ID,
  onShowProfile,
} = {}) {
  const navigate = useNavigate();
  const entityId = enabled ? currentEntityId() : null;
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
  const [historyOpen, setHistoryOpen] = useState(false);
  // Past conversations from the agent (null until loaded / agent unreachable).
  const [serverSessions, setServerSessions] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  // A practice / mock interview is waiting for an answer - the voice call
  // waits longer before sending (people pause mid-answer).
  const [practiceActive, setPracticeActive] = useState(false);
  const [personality, setPersonality] = useState(() =>
    entityId ? readJson(PERSONALITY_KEY(entityId), null) : null
  );
  const [personalityReq, setPersonalityReq] = useState(null);
  const lastTurnRef = useRef(null);
  const openedRef = useRef(false);
  const voiceOpenRef = useRef(false);
  voiceOpenRef.current = voiceCallOpen;
  const voiceIdRef = useRef(voiceId);
  voiceIdRef.current = voiceId;

  // Persist the conversation whenever it changes (thinking bubble excluded).
  useEffect(() => {
    if (!entityId || !thread.messages.length) return;
    const clean = {
      ...thread,
      messages: thread.messages.filter((m) => m.id !== THINKING_ID),
    };
    setThreads(saveThread(entityId, { ...clean, title: threadTitle(clean) }));
  }, [entityId, thread]);

  const refreshProfile = useCallback(async () => {
    if (!entityId) return;
    try {
      setProfile(await fetchMyProfile());
    } catch (err) {
      log.error('profile refresh failed', err?.message);
    }
    // Personality rows come from the saved assessment results (any device).
    const res = await fetchAssessmentResults(entityId);
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
    async (
      text,
      { chipAction = null, showUser = true, autoText = null, inputMode = null } = {}
    ) => {
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
        const turn = await sendTurn({ entityId, message: text, history, chipAction, inputMode });
        setPracticeActive(isPracticeTurn(turn));
        log('turn', {
          routedTo: turn.routedTo,
          reason: turn.routeReason,
          state: turn.sectionState,
        });
        patchThread((t) => ({
          messages: [...t.messages.filter((x) => x.id !== THINKING_ID), ...turnToBubbles(turn)],
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
          speak(turn.reply, voiceIdRef.current, () => setSpeaking(false));
        }
      } catch (err) {
        patchThread((t) => ({
          messages: t.messages.filter((x) => x.id !== THINKING_ID),
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
    [entityId, busy, history, patchThread, applyTurnToPanel, refreshProfile]
  );
  const runTurnRef = useRef(runTurn);
  runTurnRef.current = runTurn;

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

  // ---- panel: Modify / Update / Confirm ----
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
  const handleAttachRejected = (name) =>
    showToast('error', 'File too large', `${name} is over 10 MB.`);

  // ---- new chat / history ----
  const handleNewChat = () => {
    if (busy) return;
    window.speechSynthesis?.cancel();
    setLive({ states: {}, card: null });
    setExpandedPanelId(null);
    setThread(newThread());
    setHistoryOpen(false);
    // Greet in the new conversation (empty transcript -> returning greeting).
    setTimeout(() => runTurnRef.current?.(OPENER, { showUser: false }), 0);
  };
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

  // ---- save & exit: schedule a return ----
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
    navigate('/home');
  };

  // ---- voice ----
  const handleUtterance = (text) => runTurn(text, { inputMode: 'voice' });
  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
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
    return buildPanelStages(LIVE_STAGES, profile, live, {
      ...extras,
      personalityProgress: personalityReq,
    });
  }, [profile, live, personality, personalityReq]);
  const pct =
    typeof profile?.profileCompletion === 'number' ? Math.round(profile.profileCompletion) : 0;
  const trailIndex = useMemo(() => {
    const active = LIVE_STAGES.findIndex(
      (s) => live.states[s.id] || (live.card && stageForSection(live.card.section) === s.id)
    );
    if (active >= 0) return active;
    const firstOpen = LIVE_STAGES.findIndex(
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

  const lastBot = [...messages].reverse().find((m) => m.sender === 'bot' && m.id !== THINKING_ID);
  const reportPending = Boolean(lastBot?.report && !lastBot.reportAnswer);
  const enrichedMessages = messages.map((m) => {
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
    if (m.practiceReview) {
      out = { ...out, content: <PracticeReviewCard review={m.practiceReview} /> };
    }
    if (m.reviewSection) {
      const stage = stageForSection(m.reviewSection);
      out = {
        ...out,
        linkButton: {
          label: 'Review in profile panel',
          onClick: () => {
            setExpandedPanelId(stage);
            onShowProfile?.(stage);
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
  const hero = {
    ...FIRST_TIME_HERO,
    buddyCardLabel: firstName
      ? `Hi ${firstName}, I'm Career Buddy,`
      : FIRST_TIME_HERO.buddyCardLabel,
  };

  return {
    loggedIn: isLoggedIn() && Boolean(entityId),
    me,
    firstName,
    // conversation
    messages,
    enrichedMessages,
    suggestedReplies: busy || reportPending ? [] : chips,
    busy,
    handleSend,
    handleFeedback,
    handleRegenerate,
    handleAttach,
    handleAttachRejected,
    // hero
    showHero,
    hero,
    // history
    historyOpen,
    setHistoryOpen,
    historyList,
    activeHistoryId,
    handleNewChat,
    handleSelectHistory,
    // panel + trail
    stages: LIVE_STAGES,
    panelStages,
    pendingCard: Boolean(live.card),
    expandedPanelId,
    setExpandedPanelId,
    confirming,
    handleConfirmStage,
    trailIndex,
    pct,
    stageStatuses,
    // toast
    toast,
    setToast,
    // voice
    speaking,
    practiceActive,
    handleUtterance,
    stopSpeaking,
    // save & exit
    handleConfirmSchedule,
  };
}

export default useCareerBuddyLive;
