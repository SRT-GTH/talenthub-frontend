import { useCallback, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import VoiceSavedToast from './VoiceSavedToast.jsx';
import { speakAgain } from './voiceSpeech.js';
import {
  applyLearned,
  estimateSpeechSeconds,
  loadLearnedWords,
  saveLearnedWord,
} from './voiceCaptionData.js';

const log = debug('useVoiceTurns');

/*
 * Saved voice turns (Figma VC-03 / VC-04). A call's turns are ordinary chat messages; this hook marks the ones that were
 * spoken so ChatThread draws them as voice turns, and owns what can be done to them:
 *   Edit        edit the words and send them again as a new turn (demo frames: edits the bubble in place)
 *   Play again  speak a Buddy turn again with the voice of the call
 *   Did you mean...   tap a doubtful word: pick the suggestion, keep what was heard, or type the word. Corrected
 *               words are remembered in this browser (localStorage `careerBuddy.learnedWords`) and applied to later turns.
 *   Toast       "Your voice chat is saved as text", once per call that had spoken turns.
 *
 * recordUtterance(text, { seconds }) is called for every turn sent from the call; `decorate(messages)` returns the
 * messages with voice marks. Messages that already carry `voice` (demo frames) are only corrected.
 *
 * ⚠️ ASSUMPTION: a Buddy reply counts as a voice turn when the talent message before it was spoken; its length
 * ("Voice · 0:08") is the reply's estimated speaking time, not measured. ⚠️ ASSUMPTION: corrected words are kept
 * locally only - they are not sent to the agent.
 */
export default function useVoiceTurns({ voiceId, onResend, demo = null } = {}) {
  const utterancesRef = useRef([]);
  const toastedRef = useRef(0);
  const [turnCount, setTurnCount] = useState(0);
  const [learned, setLearned] = useState(loadLearnedWords);
  const [textOverrides, setTextOverrides] = useState({});
  const [kept, setKept] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [fix, setFix] = useState(
    demo?.fix ? { id: demo.fix, heard: 'hub tell', suggestion: 'Hubtel' } : null
  );
  const [toastOpen, setToastOpen] = useState(Boolean(demo?.saved));

  const recordUtterance = useCallback((text, meta = {}) => {
    const clean = String(text || '').trim();
    if (!clean) return;
    utterancesRef.current = [
      ...utterancesRef.current,
      { text: clean, seconds: Math.max(1, Math.round(meta.seconds || 1)) },
    ];
    setTurnCount(utterancesRef.current.length);
    log('async', { voiceTurnRecorded: clean.length });
  }, []);

  /** Call ended: show the toast once if the call had spoken turns. */
  const noteCallEnded = useCallback(() => {
    if (utterancesRef.current.length > toastedRef.current) {
      toastedRef.current = utterancesRef.current.length;
      log('branch', { savedToast: true });
      setToastOpen(true);
    }
  }, []);

  const decorate = useCallback(
    (messages) => {
      const spoken = utterancesRef.current;
      let pointer = 0;
      let afterVoice = false;
      return messages.map((m) => {
        let next = m;
        if (!m.voice && m.sender === 'user' && !m.auto && !m.file && m.text) {
          if (pointer < spoken.length && spoken[pointer].text === String(m.text).trim()) {
            next = { ...m, voice: { who: 'you', seconds: spoken[pointer].seconds } };
            pointer += 1;
            afterVoice = true;
          } else {
            afterVoice = false;
          }
        } else if (!m.voice && m.sender === 'bot' && !m.thinking && m.text && afterVoice) {
          next = { ...m, voice: { who: 'buddy', seconds: estimateSpeechSeconds(m.text, voiceId) } };
          afterVoice = false;
        } else if (!m.voice && m.sender === 'user') {
          afterVoice = false;
        }
        if (next.voice?.who === 'you') {
          const base = textOverrides[next.id] ?? next.text;
          const text = applyLearned(base, learned);
          if (text !== next.text) next = { ...next, text };
        }
        return next;
      });
    },
    [learned, textOverrides, voiceId]
  );

  const actions = useMemo(
    () => ({
      editingId,
      fix,
      kept,
      onStartEdit: (id) => {
        log('branch', { startEdit: id });
        setFix(null);
        setEditingId(id);
      },
      onCancelEdit: () => setEditingId(null),
      onSaveEdit: (message, text) => {
        const clean = String(text || '').trim();
        setEditingId(null);
        if (!clean || clean === message.text) return;
        log('branch', { resendEdited: clean.length });
        if (onResend) onResend(clean);
        else setTextOverrides((prev) => ({ ...prev, [message.id]: clean }));
      },
      onPlay: (message) => {
        log('branch', { playAgain: message.id });
        speakAgain(message.text, voiceId);
      },
      onOpenFix: (message, part) =>
        setFix({ id: message.id, heard: part.heard, suggestion: part.suggestion }),
      onCloseFix: () => setFix(null),
      onKeep: (message, heard) => {
        log('branch', { keepHeard: heard });
        setKept((prev) => ({
          ...prev,
          [message.id]: [...(prev[message.id] ?? []), heard.toLowerCase()],
        }));
        setFix(null);
      },
      onPick: (message, heard, word) => {
        log('branch', { fixWord: word });
        const base = textOverrides[message.id] ?? message.text;
        const idx = base.toLowerCase().indexOf(heard.toLowerCase());
        const fixed =
          idx < 0 ? base : `${base.slice(0, idx)}${word}${base.slice(idx + heard.length)}`;
        setTextOverrides((prev) => ({ ...prev, [message.id]: fixed }));
        setLearned(saveLearnedWord(heard, word));
        setFix(null);
      },
    }),
    [editingId, fix, kept, onResend, textOverrides, voiceId]
  );

  const afterMessages = toastOpen ? (
    <VoiceSavedToast persist={Boolean(demo?.saved)} onDismiss={() => setToastOpen(false)} />
  ) : null;

  return {
    recordUtterance,
    noteCallEnded,
    decorate,
    turnCount,
    chatProps: { voiceTurns: actions, afterMessages },
  };
}
