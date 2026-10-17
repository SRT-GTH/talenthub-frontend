import api from './api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';

const log = debug('careerBuddy.api');

/*
 * Career Buddy V2 (Mastra turn controller) client.
 *
 * One turn = POST {AGENT_BASE}/api/workflows/turnControllerWorkflow/start-async
 *   { resourceId: entityId, inputData: { userId: entityId, message, history, chipAction? } }
 * -> { status, result: { reply, blocks, card?, chips, chipActions, routedTo, ... } }
 *
 * Local dev: AGENT_BASE is `/agent`, which the Vite dev proxy forwards to the
 * Mastra server (VITE_AGENT_PROXY_TARGET, default http://localhost:4111).
 * Deployed builds set VITE_AGENT_BASE_URL. The agent has no auth of its own
 * yet - it trusts the userId it is given - so a deployed build must sit
 * behind a backend proxy that derives the userId from the JWT (not done yet;
 * POC/local only).
 *
 * Chips: `chips` are labels; `chipActions` carry what tapping a label means.
 * Send the matching chipAction back so the classifier is skipped. A label
 * with no chipAction (e.g. "Yes, save it") is sent as plain text.
 */

const AGENT_BASE = (import.meta.env.VITE_AGENT_BASE_URL || '/agent').replace(/\/$/, '');
const TURN_URL = `${AGENT_BASE}/api/workflows/turnControllerWorkflow/start-async`;
const TURN_TIMEOUT_MS = 120_000;

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null');
  } catch {
    return null;
  }
};

/** The logged-in talent's entity id (set by auth.api verifyLoginOtp). */
export const currentEntityId = () => {
  const user = storedUser();
  return user?.currentEntityId || user?.entityId || null;
};

export const currentFirstName = () => storedUser()?.firstName || null;

/** { name: 'Ama A.', initials: 'AA' } for the top nav. */
export const currentUserLabel = () => {
  const u = storedUser() || {};
  const first = u.firstName || '';
  const last = u.lastName || '';
  return {
    name: [first, last ? `${last[0]}.` : ''].filter(Boolean).join(' ') || 'You',
    initials: `${first[0] || ''}${last[0] || ''}`.toUpperCase() || 'ME',
  };
};

export class AgentError extends Error {
  constructor(message, detail) {
    super(message);
    this.name = 'AgentError';
    this.detail = detail;
  }
}

/**
 * Send one turn. `history` is the client-side transcript ({role, content}[]),
 * oldest first, NOT including `message`.
 */
export const sendTurn = async ({ entityId, message, history = [], chipAction }) => {
  const body = {
    resourceId: entityId,
    inputData: {
      userId: entityId,
      message,
      history,
      ...(chipAction ? { chipAction } : {}),
    },
  };
  log('turn ->', { message, chipAction: chipAction?.label, historyLen: history.length });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TURN_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(TURN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    throw new AgentError(
      err?.name === 'AbortError'
        ? 'Career Buddy took too long to answer.'
        : "Couldn't reach Career Buddy.",
      err
    );
  } finally {
    clearTimeout(timer);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.status !== 'success' || !json.result) {
    log.error('turn failed', res.status, json?.status, json?.error);
    throw new AgentError('Career Buddy had a problem answering that.', json?.error || res.status);
  }
  log('turn <-', json.result.routedTo, json.result.routeReason);
  return json.result;
};

/** GET /profiles/me - the live profile shown next to the chat. */
export const fetchMyProfile = async () => {
  const { data } = await api.get('/profiles/me');
  return data?.data || data?.profile || data || null;
};

/**
 * Thumbs up/down on one reply (2026-10-16: "store the feedback").
 * Fire-and-forget: a failed write never interrupts the conversation.
 */
export const sendFeedback = async ({ entityId, message, rating, userMessage }) => {
  try {
    await fetch(`${AGENT_BASE}/career-buddy/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: entityId,
        messageId: message.id,
        rating,
        reply: [message.text, ...(message.bullets || []), message.followUp]
          .filter(Boolean)
          .join('\n'),
        userMessage,
        routedTo: message.meta?.routedTo,
        routeReason: message.meta?.routeReason,
        intent: message.meta?.intent,
        section: message.meta?.section,
      }),
    });
  } catch (err) {
    log.error('feedback failed', err?.message);
  }
};

/** "Regenerate response": re-word a reply's prose (never re-runs the turn). */
export const regenerateReply = async (text) => {
  const res = await fetch(`${AGENT_BASE}/career-buddy/rephrase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const json = await res.json().catch(() => null);
  return json?.text || text;
};
/**
 * Past conversations, rebuilt by the agent from its turn-controller run
 * snapshots (GET /career-buddy/history) - the same list on every device.
 * Resolves to null when the agent can't be reached (caller falls back to
 * the conversations saved in this browser).
 */
export const fetchHistory = async (entityId, limit = 30) => {
  try {
    const res = await fetch(
      `${AGENT_BASE}/career-buddy/history?userId=${encodeURIComponent(entityId)}&limit=${limit}`
    );
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success || !Array.isArray(json.sessions)) return null;
    return json.sessions;
  } catch (err) {
    log.error('history failed', err?.message);
    return null;
  }
};
/**
 * The talent's saved assessment results (Big Five, RIASEC, ...) for the
 * Personality section of the Talent Profile Panel. Newest first.
 */
export const fetchAssessmentResults = async (entityId) => {
  try {
    // Token-scoped: the backend takes the talent from the login, never from
    // the request (GET /engagement/assessments/results is staff-only).
    void entityId;
    const { data } = await api.get('/engagement/assessments/results/me', {
      params: { pageSize: 50 },
    });
    const rows = data?.rows || data?.data?.rows || [];
    // required: the assessments the backend expects (PERSONALITY_ASSESSMENTS
    // + the career-interest quiz). Older backends don't send it.
    const required = data?.required || data?.data?.required || null;
    return {
      rows: Array.isArray(rows) ? rows : [],
      required: Array.isArray(required) ? required : null,
    };
  } catch (err) {
    log.error('assessment results failed', err?.message);
    return null;
  }
};
