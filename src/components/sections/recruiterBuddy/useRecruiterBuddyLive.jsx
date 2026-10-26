import { useCallback, useRef, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { currentEntityId, sendTurnStream } from '../../../services/careerBuddy.api.js';
import { confirmAgentDraft, draftErrorText } from '../../../services/recruiterPipeline.api.js';
import BuddyDraftCard from './BuddyDraftCard.jsx';

const log = debug('useRecruiterBuddyLive');

/*
 * useRecruiterBuddyLive — the live agent inside the recruiter Career Buddy screen
 * (CareerBuddySection, Figma recruiter AI screens). The screen keeps its scripted Company / Job post /
 * KYB flows; what the agent handles today (pipeline, candidates, stage moves, interviews, anything
 * typed that the script has no answer for) goes here. The agent takes the role from the login.
 *
 *   send(text, chipAction?)  user bubble + Buddy thinking, then the agent's reply bubble; a prepared
 *                            change arrives as `draft` and renders as BuddyDraftCard in the bubble
 *   chips                    the agent's suggested replies (labels); chipActionFor(label) for each
 *   decorate(messages)       adds the draft cards (with their buttons) at render time
 *   onHandoff(flow)          the screen opens its own guided flow when Buddy says so
 *                            (today 'post_job': the Figma Post a Job flow, posted on "Confirm & Post Job")
 *
 * Messages use the screen's own shape ({ id, sender, text, content?, thinking? }).
 */

export const PIPELINE_CHIP = 'Check my hiring pipeline';
const THINKING_ID = 'rb-thinking';
let seq = 0;
const nextId = (p) => `${p}-${Date.now()}-${(seq += 1)}`;

const HANDOFFS = new Set(['post_job']);

export const useRecruiterBuddyLive = ({ enabled, setMessages, onHandoff }) => {
  const [chips, setChips] = useState([]); // [{ label, intent, slots }]
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState({}); // messageId -> { state, error }
  const busyRef = useRef(false);

  const chipActionFor = useCallback(
    (label) => {
      if (label === PIPELINE_CHIP) return { intent: 'pipeline_status', slots: [] };
      const c = chips.find((x) => x.label === label);
      return c ? { intent: c.intent, slots: c.slots || [] } : null;
    },
    [chips]
  );

  const send = useCallback(
    async (text, chipAction = null) => {
      const entityId = currentEntityId();
      if (!enabled || !entityId || busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      setChips([]);
      setMessages((prev) => [
        ...prev,
        { id: nextId('me'), sender: 'user', text },
        {
          id: THINKING_ID,
          sender: 'bot',
          thinking: { phase: 'thinking', lookingAt: ['Your pipeline', 'Candidates'] },
        },
      ]);
      let reply;
      let handoff = null;
      try {
        const turn = await sendTurnStream({
          entityId,
          message: text,
          history: [],
          ...(chipAction ? { chipAction } : {}),
        });
        log('turn', turn.routeReason);
        reply = {
          id: nextId('rb'),
          sender: 'bot',
          // The screen's bubbles are plain text: drop the agent's **bold** marks.
          text: String(turn.reply || '').replace(/\*\*/g, ''),
          ...(turn.draft ? { recruiterDraft: turn.draft } : {}),
        };
        if (HANDOFFS.has(turn.handoff)) handoff = turn.handoff;
        setChips(
          (turn.chipActions || []).map((c) => ({
            label: c.label,
            intent: c.intent,
            slots: c.slots,
          }))
        );
      } catch (err) {
        log.error('turn failed', err?.message);
        reply = {
          id: nextId('rb'),
          sender: 'bot',
          text: err?.message || 'Career Buddy had a problem answering that.',
        };
      } finally {
        setMessages((prev) => [...prev.filter((m) => m.id !== THINKING_ID), reply]);
        busyRef.current = false;
        setBusy(false);
      }
      if (handoff) {
        log('handoff', handoff);
        onHandoff?.(handoff);
      }
    },
    [enabled, setMessages, onHandoff]
  );

  const confirm = useCallback(
    async (message) => {
      setDrafts((d) => ({ ...d, [message.id]: { state: 'busy' } }));
      try {
        const out = await confirmAgentDraft(message.recruiterDraft.draftId);
        setDrafts((d) => ({ ...d, [message.id]: { state: 'done' } }));
        const failed = out?.result?.failCount || 0;
        setMessages((prev) => [
          ...prev,
          {
            id: nextId('rb'),
            sender: 'bot',
            text:
              message.recruiterDraft.kind === 'interview'
                ? 'Done. The candidate has been told, and it’s on your Application Pipeline.'
                : failed
                  ? `Done, except ${failed} that couldn’t be moved. Check the Application Pipeline.`
                  : 'Done. Your Application Pipeline is up to date.',
          },
        ]);
      } catch (err) {
        log.error('confirm failed', err?.response?.status || err?.message);
        setDrafts((d) => ({ ...d, [message.id]: { state: 'open', error: draftErrorText(err) } }));
      }
    },
    [setMessages]
  );

  const decorate = useCallback(
    (messages) =>
      messages.map((m) => {
        if (!m.recruiterDraft) return m;
        const d = drafts[m.id] || { state: 'open' };
        return {
          ...m,
          content: (
            <div className="mt-[10px]">
              <BuddyDraftCard
                draft={m.recruiterDraft}
                state={d.state}
                error={d.error}
                onConfirm={() => confirm(m)}
                onCancel={() => setDrafts((x) => ({ ...x, [m.id]: { state: 'cancelled' } }))}
              />
            </div>
          ),
        };
      }),
    [drafts, confirm]
  );

  return {
    busy,
    chips: chips.map((c) => c.label),
    chipActionFor,
    send,
    decorate,
    clearChips: () => setChips([]),
  };
};
