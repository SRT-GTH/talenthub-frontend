/* Hook module (not a component): it exports the hook plus shared constants, so
   fast refresh reloads it fully on edit - fine. */
/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AssessmentReportCard from './AssessmentReportCard.jsx';
import { createSpeaker } from './speechQueue.js';
import PracticeReviewCard from './PracticeReviewCard.jsx';
import OpportunityMatchCards from './opportunityGuidance/OpportunityMatchCards.jsx';
import CareerPostCards from './careerExposure/CareerPostCards.jsx';
import SearchResultCards from './search/SearchResultCards.jsx';
import SearchDetailSheet from './search/SearchDetailSheet.jsx';
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
  sendTurnStream,
  fetchMyProfile,
  fetchMyJourney,
  currentEntityId,
  currentFirstName,
  currentUserLabel,
  sendFeedback,
  sendSignal,
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
  turnToBubbles,
  cardChips,
  opportunityMatchView,
  whyThisMatchAction,
  careerPostView,
  userBubble,
  autoBubble,
  fileBubble,
  localBotBubble,
  chipActionFor,
  isPracticeTurn,
  stageForSection,
  buildPanelStages,
  changedCardFields,
  loadThreads,
  saveThread,
  newThread,
  threadTitle,
} from './careerBuddyLive.js';
import { chatsFromHistory } from './chatHistoryModel.js';

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
/*
 * The reply-in-progress row (Figma "Buddy thinking states", 8988:509558): phase thinking -> working (the agent sent a status)
 * -> writing (words are streaming) -> slow (over SLOW_AFTER_S seconds with nothing written) -> stopped (the talent stopped it).
 * Copy from the frames: the "Looking at" chips, the three steps and "Step 2 of 3"; the active step and the sub line carry the agent's own status.
 */
const SLOW_AFTER_S = 10;
const LOOKING_AT = ['Your profile', 'Discoverable rules'];
const thinkingBubble = (thinking) => ({
  id: THINKING_ID,
  sender: 'bot',
  personaLabel: 'Career Buddy',
  text: '',
  thinking,
});
const phaseFor = ({ streamed, status, elapsed }) => {
  if (streamed) return 'writing';
  if (elapsed >= SLOW_AFTER_S) return 'slow';
  return status ? 'working' : 'thinking';
};
const thinkingState = ({ streamed = '', status = '', elapsed = 0 }) => {
  const phase = phaseFor({ streamed, status, elapsed });
  return {
    phase,
    lookingAt: LOOKING_AT,
    sub: phase === 'slow' && status ? `This one takes longer: ${status}` : status,
    steps: [
      { id: 'read', label: 'Read your profile and chat', state: 'done' },
      { id: 'active', label: status || 'Working on it', state: 'active' },
      { id: 'write', label: 'Writing your answer', state: 'next' },
    ],
    stepText: 'Step 2 of 3',
    progress: phase === 'slow' ? Math.min(0.95, elapsed / 25.5) : 0.39,
    elapsed,
    text: streamed,
  };
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

/* Voice replies: speechQueue.js speaks each sentence as soon as it has streamed in. */

export function useCareerBuddyLive({
  enabled = true,
  voiceCallOpen = false,
  voiceId = DEFAULT_VOICE_ID,
  readAloud = false,
  onShowProfile,
} = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  // 2026-10-21: a CTA elsewhere (home "Start mock interview") can hand Career Buddy a prompt via
  // router state: { prompt, chipAction? }. Read once; it is cleared after it is sent.
  const handoffRef = useRef(location.state?.prompt ? location.state : null);
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
  // Iteration 9: the details sheet open for one search card ({ card, messageId }).
  const [searchDetail, setSearchDetail] = useState(null);
  const [toast, setToast] = useState(null);
  const [profile, setProfile] = useState(null);
  const [journeyPct, setJourneyPct] = useState(null);
  const [live, setLive] = useState(() => thread.live || { states: {}, card: null });
  // A pending review survives a reload / history switch with its conversation.
  useEffect(() => {
    patchThread({ live });
  }, [live, patchThread]);
  const [expandedPanelId, setExpandedPanelId] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  // Pins, renames and deletes of the history drawer live in this browser (the agent has no endpoint for them yet).
  const META_KEY = entityId ? `careerBuddy.chatMeta.${entityId}` : null;
  const [chatMeta, setChatMeta] = useState(() =>
    META_KEY
      ? readJson(META_KEY, { pinned: {}, titles: {}, deleted: {} })
      : { pinned: {}, titles: {}, deleted: {} }
  );
  const updateChatMeta = (fn) =>
    setChatMeta((prev) => {
      const next = fn(prev);
      if (META_KEY) writeJson(META_KEY, next);
      return next;
    });
  // "Your last chat was saved to History" toast after New chat (Figma 9086:75962).
  const [savedToast, setSavedToast] = useState(false);
  // Past conversations from the agent (null until loaded / agent unreachable).
  // undefined = still loading (the drawer shows a loading line, never this browser's local list
  // first), null = the agent can't be reached (fall back to the local list), array = server history.
  const [serverSessions, setServerSessions] = useState(undefined);
  const [historyPage, setHistoryPage] = useState({
    hasMore: false,
    nextBefore: null,
    loading: false,
  });
  const [speaking, setSpeaking] = useState(false);
  // A practice / mock interview is waiting for an answer - the voice call
  // waits longer before sending (people pause mid-answer).
  const [practiceActive, setPracticeActive] = useState(false);
  const [personality, setPersonality] = useState(() =>
    entityId ? readJson(PERSONALITY_KEY(entityId), null) : null
  );
  const [personalityReq, setPersonalityReq] = useState(null);
  const lastTurnRef = useRef(null);
  // 2026-10-27: the turn on its way, and the one the talent stopped (its reply keeps arriving in the background so
  // Continue can show it). Each is { seq, stopped, turn, error, done, waiters }.
  const runSeqRef = useRef(0);
  const currentRunRef = useRef(null);
  const stoppedRunRef = useRef(null);
  const openedRef = useRef(false);
  const voiceOpenRef = useRef(false);
  voiceOpenRef.current = voiceCallOpen;
  const voiceIdRef = useRef(voiceId);
  voiceIdRef.current = voiceId;
  const readAloudRef = useRef(readAloud);
  readAloudRef.current = readAloud;

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
    // The profile % shown everywhere else (home, profile page, account menu) is the 9-stage journey.
    fetchMyJourney()
      .then((j) => {
        if (typeof j?.percent === 'number') setJourneyPct(j.percent);
      })
      .catch((err) => log.error('journey refresh failed', err?.message));
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
    const page = await fetchHistory(entityId);
    if (page) {
      setServerSessions(page.sessions);
      setHistoryPage({ hasMore: page.hasMore, nextBefore: page.nextBefore, loading: false });
    } else {
      setServerSessions((prev) => (prev === undefined ? null : prev));
    }
  }, [entityId]);
  // "Show older conversations": the next page, appended (an id already shown is skipped).
  const loadMoreHistory = useCallback(async () => {
    if (!entityId || !historyPage.hasMore || historyPage.loading) return;
    setHistoryPage((p) => ({ ...p, loading: true }));
    const page = await fetchHistory(entityId, { before: historyPage.nextBefore });
    if (!page) {
      setHistoryPage((p) => ({ ...p, loading: false }));
      return;
    }
    setServerSessions((prev) => {
      const have = new Set((prev || []).map((s) => s.id));
      return [...(prev || []), ...page.sessions.filter((s) => !have.has(s.id))];
    });
    setHistoryPage({ hasMore: page.hasMore, nextBefore: page.nextBefore, loading: false });
  }, [entityId, historyPage]);
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

  const abortRef = useRef(null);
  // The reply being spoken (speechQueue.js), so Stop / a new turn can cut it off.
  const speakerRef = useRef(null);
  const runTurn = useCallback(
    async (
      text,
      { chipAction = null, showUser = true, autoText = null, inputMode = null } = {}
    ) => {
      if (!entityId || busy) return;
      lastTurnRef.current = { text, chipAction };
      // A new message drops any stopped reply still on its way (it is never shown).
      stoppedRunRef.current = null;
      const run = {
        seq: (runSeqRef.current += 1),
        stopped: false,
        turn: null,
        error: null,
        done: false,
        waiters: [],
      };
      currentRunRef.current = run;
      setBusy(true);
      const shown = autoText ? [autoBubble(autoText)] : showUser ? [userBubble(text)] : [];
      const startedAt = Date.now();
      let streamed = '';
      let status = '';
      const controller = new AbortController();
      abortRef.current = controller;
      // Re-draws the reply-in-progress row (first second -> working -> writing -> slow) every second.
      const draw = () =>
        !run.stopped &&
        patchThread((t) => ({
          messages: t.messages.map((m) =>
            m.id === THINKING_ID
              ? thinkingBubble(
                  thinkingState({
                    streamed,
                    status,
                    elapsed: Math.floor((Date.now() - startedAt) / 1000),
                  })
                )
              : m
          ),
        }));
      patchThread((t) => ({
        messages: [
          ...t.messages.filter((m) => m.id !== THINKING_ID),
          ...shown,
          thinkingBubble(thinkingState({})),
        ],
        chips: [],
        chipActions: [],
      }));
      const ticker = setInterval(draw, 1000);
      // 2026-10-23 (voice latency): in a voice call / read-aloud, speak sentence by sentence as the
      // reply streams instead of waiting for the whole turn.
      speakerRef.current?.cancel();
      const speaker =
        voiceOpenRef.current || readAloudRef.current
          ? createSpeaker({
              voiceId: voiceIdRef.current,
              onStart: () => setSpeaking(true),
              onIdle: () => setSpeaking(false),
            })
          : null;
      speakerRef.current = speaker;
      try {
        const turn = await sendTurnStream({
          entityId,
          message: text,
          history,
          chipAction,
          inputMode,
          signal: controller.signal,
          // 2026-10-19: the row shows what Career Buddy is doing while it works.
          onStatus: (next) => {
            if (!streamed && !run.stopped) {
              status = next;
              draw();
            }
          },
          // Reply words as Career Buddy writes them; the finished turn replaces this row.
          onDelta: (chunk) => {
            if (run.stopped) return;
            streamed += chunk;
            speaker?.push(chunk);
            draw();
          },
        });
        if (run.stopped) {
          // Stopped: keep the finished reply for Continue; the screen stays as the talent left it.
          run.turn = turn;
          return;
        }
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
          ...cardChips(turn),
        }));
        applyTurnToPanel(turn);
        refreshProfile();
        if (speaker) speaker.finish(turn.reply);
        else if (voiceOpenRef.current || readAloudRef.current) {
          // Voice switched on mid-turn: speak the whole reply.
          const late = createSpeaker({
            voiceId: voiceIdRef.current,
            onStart: () => setSpeaking(true),
            onIdle: () => setSpeaking(false),
          });
          speakerRef.current = late;
          late.finish(turn.reply);
        }
      } catch (err) {
        if (run.stopped) {
          run.error = err;
          return;
        }
        speaker?.cancel();
        setSpeaking(false);
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
        clearInterval(ticker);
        run.done = true;
        run.waiters.splice(0).forEach((resolve) => resolve());
        // A stopped run already handed the screen back (handleStop); never touch a newer turn's state.
        if (!run.stopped) {
          abortRef.current = null;
          setBusy(false);
          setConfirming(null);
        }
      }
    },
    [entityId, busy, history, patchThread, applyTurnToPanel, refreshProfile]
  );
  const runTurnRef = useRef(runTurn);
  runTurnRef.current = runTurn;

  // First open: restore the last conversation, or greet in a new one. A handed-off prompt is
  // then sent as the talent's own message (after the greeting in a new conversation - the
  // agent always greets on a session's first turn).
  useEffect(() => {
    if (!entityId || openedRef.current) return;
    openedRef.current = true;
    refreshProfile();
    const handoff = handoffRef.current;
    handoffRef.current = null;
    if (handoff) navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
    const sendHandoff = async () => {
      if (!handoff) return;
      // Let the greeting's state (history, busy) settle before the next turn.
      await new Promise((r) => setTimeout(r, 50));
      runTurnRef.current?.(
        handoff.prompt,
        handoff.chipAction ? { chipAction: handoff.chipAction } : {}
      );
    };
    if (!thread.messages.length) runTurn(OPENER, { showUser: false }).then(sendHandoff);
    else sendHandoff();
  }, [entityId, runTurn, refreshProfile, thread.messages.length, navigate, location]);

  // ---- stop generating / Continue / Try again (Figma 8993:511908 - 8993:514381) ----
  // 2026-10-27: Stop no longer cancels the request. The agent finishes the turn either way, so the reply keeps
  // arriving in the background (not shown) and Continue can show it.
  const handleStop = () => {
    const run = currentRunRef.current;
    if (!run || run.done || run.stopped) return;
    run.stopped = true;
    stoppedRunRef.current = run;
    abortRef.current = null;
    speakerRef.current?.cancel();
    setSpeaking(false);
    log('turn stopped', { seq: run.seq });
    patchThread((t) => ({
      messages: t.messages.map((m) =>
        m.id === THINKING_ID
          ? thinkingBubble({ phase: 'stopped', text: m.thinking?.text || '' })
          : m
      ),
      chips: [],
      chipActions: [],
    }));
    setBusy(false);
    setConfirming(null);
  };
  // 2026-10-27 live: Continue used to send "Please continue from where you stopped." as the talent's words, and the
  // agent read it as "continue my profile" (an education gather after a stopped readiness reply). The stopped reply
  // keeps arriving in the background (handleStop), so Continue shows it - waiting for it if it is still on its way.
  // If it failed, the same message (and chip action) goes again; never new words.
  const handleContinueStopped = async () => {
    const last = lastTurnRef.current;
    const run = stoppedRunRef.current;
    if (!last || busy || !entityId) return;
    if (!run) {
      runTurn(last.text, { chipAction: last.chipAction, showUser: false });
      return;
    }
    if (!run.done) {
      setBusy(true);
      patchThread((t) => ({
        messages: t.messages.map((m) =>
          m.id === THINKING_ID
            ? thinkingBubble(thinkingState({ status: 'Finishing the answer' }))
            : m
        ),
      }));
      await new Promise((resolve) => run.waiters.push(resolve));
      setBusy(false);
    }
    // A newer message replaced this reply while it was finishing: nothing to show.
    if (stoppedRunRef.current !== run) return;
    stoppedRunRef.current = null;
    log('continue stopped', { finished: Boolean(run.turn) });
    if (!run.turn) {
      runTurn(last.text, { chipAction: last.chipAction, showUser: false });
      return;
    }
    const turn = run.turn;
    patchThread((t) => ({
      messages: [...t.messages.filter((x) => x.id !== THINKING_ID), ...turnToBubbles(turn)],
      history: [
        ...t.history,
        { role: 'user', content: last.text },
        { role: 'assistant', content: turn.reply },
      ],
      ...cardChips(turn),
    }));
    setPracticeActive(isPracticeTurn(turn));
    applyTurnToPanel(turn);
    refreshProfile();
  };
  const handleTryAgainStopped = () => {
    stoppedRunRef.current = null;
    const last = lastTurnRef.current;
    if (last) runTurn(last.text, { chipAction: last.chipAction, showUser: false });
  };

  const handleSend = (text) => {
    const trimmed = String(text || '').trim();
    if (!trimmed) return;
    // 2026-10-25 live: after a reload the remembered turn is gone, so "Try again" went to the agent
    // as the talent's words and was read as "edit my education". Retry resends the last real
    // message (the remembered turn, else the last one in the thread) and never the chip text.
    if (trimmed === 'Try again' && !chipActionFor(trimmed, chipActions)) {
      const remembered = lastTurnRef.current?.text !== 'Try again' ? lastTurnRef.current : null;
      const lastUserText = [...(thread.messages || [])]
        .reverse()
        .find(
          (m) => m.sender === 'user' && !m.auto && m.text && m.text.trim() !== 'Try again'
        )?.text;
      const retry = remembered || (lastUserText ? { text: lastUserText, chipAction: null } : null);
      if (retry) runTurn(retry.text, { chipAction: retry.chipAction, showUser: false });
      else patchThread(() => ({ chips: [], chipActions: [] }));
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
    const hadChat = thread.messages.some((m) => m.sender === 'user' && !m.auto);
    window.speechSynthesis?.cancel();
    setLive({ states: {}, card: null });
    setExpandedPanelId(null);
    setThread(newThread());
    setHistoryOpen(false);
    // Figma 9086:75962: a fresh chat opens on the "what shall we work on today?" start screen (no greeting turn).
    if (hadChat) setSavedToast(true);
  };
  // Nothing has been said in this conversation: the start screen shows instead of the transcript.
  const freshChat = !messages.some((m) => m.sender === 'user' && !m.auto) && !busy;
  // The start-screen suggestions and any typed text open the conversation like a normal turn.
  // "Ask Buddy about ..." (history search found nothing): start a fresh chat with that as the first message.
  const askBuddyAbout = (text) => {
    if (busy) return;
    handleNewChat();
    setSavedToast(false);
    setTimeout(() => runTurnRef.current?.(text), 0);
  };
  const handleSelectHistory = (entry) => {
    const session = serverSessions?.find((s) => s.id === entry.id);
    if (session) {
      // 2026-10-21: switch unless this IS the highlighted (open) conversation. The old
      // check (sessionMatchesThread) compared time ranges, and a conversation kept in this
      // browser for days overlaps every session in between - so every click "matched" the
      // open thread and nothing happened.
      if (entry.id !== activeHistoryId) {
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
    speakerRef.current?.cancel();
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
    typeof journeyPct === 'number'
      ? journeyPct
      : typeof profile?.profileCompletion === 'number'
        ? Math.round(profile.profileCompletion)
        : 0;
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
  const historyLoading = Boolean(entityId) && serverSessions === undefined;
  const activeHistoryId =
    serverSessions?.find((s) => sessionMatchesThread(s, thread))?.id ?? thread.id;
  const historyChats = chatsFromHistory({
    threads,
    sessions: serverSessions,
    activeId: activeHistoryId,
    meta: chatMeta,
  });
  const handleRenameChat = (id, title) =>
    updateChatMeta((m) => ({ ...m, titles: { ...m.titles, [id]: title } }));
  const handleTogglePin = (id) =>
    updateChatMeta((m) => ({ ...m, pinned: { ...m.pinned, [id]: !m.pinned?.[id] } }));
  const handleDeleteChat = (id) => {
    updateChatMeta((m) => ({ ...m, deleted: { ...m.deleted, [id]: true } }));
    if (id === activeHistoryId) handleNewChat();
  };
  const handleClearAllChats = () => {
    updateChatMeta((m) => ({
      ...m,
      deleted: { ...m.deleted, ...Object.fromEntries(historyChats.map((c) => [c.id, true])) },
    }));
    handleNewChat();
  };

  // The match cards for a bot message with `opportunities` - the full screen and the Ask Buddy panel
  // (CareerBuddyFirstChat, `compact`) draw the same cards with the same Why this match? / View opportunity.
  // 2026-10-27: Career Buddy search results (gthSearch) as cards; "Ask Career Buddy" sends the card's question.
  // Iteration 9: "View details" opens a sheet over the chat (career / elective / programme); every tap on a card is
  // also an implicit signal (open / ask / details / why) for the feedback loop.
  // The query: from the reply text, or (cards can sit in a later bubble than the text) the card's "why" line.
  const searchQueryOf = (m, card) =>
    /\bon GTH for "([^"]{2,100})"/.exec(m.text || '')?.[1] ||
    /^Matches "([^"]{2,100})"/.exec(card?.why || '')?.[1] ||
    null;
  // A card can carry the exact action for its question (an assessment: take_assessment + its type), so the
  // classifier never has to guess which test was meant. Only that shape is accepted.
  const askOptionsOf = (card) => {
    const a = card?.askAction;
    const type = a?.slots?.find((s) => s?.name === 'assessmentType')?.value;
    const section = ['personality', 'psychometric'].includes(a?.section) ? a.section : null;
    return a?.intent === 'take_assessment' &&
      section &&
      typeof type === 'string' &&
      /^[a-z_]{2,40}$/.test(type)
      ? {
          chipAction: {
            intent: 'take_assessment',
            section,
            slots: [{ name: 'assessmentType', value: type }],
          },
        }
      : {};
  };
  const cardSignal = (kind, card, m) =>
    sendSignal({ entityId, kind, card, query: searchQueryOf(m, card), messageId: m.id });
  const renderSearchResults = (m, { compact = false } = {}) => (
    <>
      <SearchResultCards
        results={m.searchResults}
        compact={compact}
        disabled={busy}
        onOpen={(card) => {
          cardSignal('search_open', card, m);
          navigate(card.link);
        }}
        onAsk={(card) => {
          cardSignal('search_ask', card, m);
          runTurn(card.ask, askOptionsOf(card));
        }}
        onDetails={(card, opener) => {
          cardSignal('search_details', card, m);
          setSearchDetail({ card, messageId: m.id, opener });
        }}
        onWhy={(card) => cardSignal('search_why', card, m)}
      />
      {searchDetail && searchDetail.messageId === m.id ? (
        <SearchDetailSheet
          card={searchDetail.card}
          returnFocusTo={searchDetail.opener}
          disabled={busy}
          onClose={() => setSearchDetail(null)}
          onAsk={(card) => {
            cardSignal('search_ask', card, m);
            setSearchDetail(null);
            runTurn(card.ask, askOptionsOf(card));
          }}
          onOpen={(card) => {
            cardSignal('search_open', card, m);
            setSearchDetail(null);
            navigate(card.link);
          }}
        />
      ) : null}
    </>
  );

  const renderOpportunities = (m, { compact = false } = {}) => (
    <>
      <OpportunityMatchCards
        matches={m.opportunities.map((o) => opportunityMatchView(o))}
        followUps={[]}
        fitWidth={!compact}
        compact={compact}
        disabled={busy}
        onWhy={(_text, _view, i) => {
          const { label, chipAction } = whyThisMatchAction(m.opportunities[i], i);
          runTurn(label, { autoText: label, chipAction });
        }}
        onView={(view) => navigate(view.detailPath)}
      />
      {m.afterCards ? <p className="mt-[8px] whitespace-pre-line">{m.afterCards}</p> : null}
    </>
  );

  const lastBot = [...messages].reverse().find((m) => m.sender === 'bot' && m.id !== THINKING_ID);
  const reportPending = Boolean(lastBot?.report && !lastBot.reportAnswer);
  const enrichedMessages = messages.map((m) => {
    let out = m;
    if (m.thinking?.phase === 'stopped') {
      out = {
        ...out,
        thinking: {
          ...m.thinking,
          onContinue: handleContinueStopped,
          onTryAgain: handleTryAgainStopped,
        },
      };
    }
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
    if (m.opportunities?.length) {
      // 2026-10-25: the agent's matched postings as the Figma match cards (9053:80615).
      out = { ...out, content: renderOpportunities(m) };
    }
    if (m.careerPosts?.length) {
      // 2026-10-27: GTH posts about a career as cards (career exposure), after anything already drawn.
      const views = m.careerPosts.map((p) => careerPostView(p));
      out = {
        ...out,
        content: (
          <>
            {out.content || null}
            <CareerPostCards
              posts={views}
              career={m.careerPosts[0]?.career}
              onOpen={(post) => navigate(post.detailPath)}
            />
          </>
        ),
      };
    }
    if (m.searchResults?.length) {
      out = {
        ...out,
        content: (
          <>
            {out.content || null}
            {renderSearchResults(m)}
          </>
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
    renderOpportunities,
    renderSearchResults,
    suggestedReplies: busy || reportPending ? [] : chips,
    busy,
    handleSend,
    handleStop,
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
    historyChats,
    historyLoading,
    historyHasMore: Array.isArray(serverSessions) && historyPage.hasMore,
    historyLoadingMore: historyPage.loading,
    loadMoreHistory,
    activeHistoryId,
    handleNewChat,
    handleSelectHistory,
    askBuddyAbout,
    handleRenameChat,
    handleTogglePin,
    handleDeleteChat,
    handleClearAllChats,
    freshChat,
    savedToast,
    setSavedToast,
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
