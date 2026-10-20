import { useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { answerLab, finishLab, playLab, restartLab } from '../../../services/skillsLab.api.js';
import ExtLabScreen from './labScreens/ExtLabScreen.jsx';

const log = debug('useLiveLabFlow');

/*
 * useLiveLabFlow — the lab flow for the signed-in talent, built entirely from the API (no local flow file, so no answer
 * key ships in production). GET /skills-lab/labs/:labId/play starts or resumes the run and returns the screen copy
 * (`chrome`: header, sticker, results wording, refreshers, `screen: 'ext'`) and the questions WITHOUT answers. The flow
 * carries `live = { answer, finish, restart }`, which useLabAttempt uses so the server decides right / wrong.
 * `restart` ("Start over" on the details page, ?restart=1) abandons the open run first.
 * Returns { status: loading | ready | error | off, flow }.
 */
export const useLiveLabFlow = ({ labId, enabled, restart = false }) => {
  const [state, setState] = useState({ status: enabled ? 'loading' : 'off', data: null, error: null });
  const attemptRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    let alive = true;
    (restart ? restartLab(labId) : playLab(labId))
      .then((data) => {
        if (!alive) return;
        attemptRef.current = data.attempt.id;
        log('play', { labId, attempt: data.attempt.id, index: data.attempt.index });
        setState({ status: 'ready', data, error: null });
      })
      .catch((err) => {
        log('play failed', err?.response?.status || err?.message);
        if (alive) setState({ status: 'error', data: null, error: err?.response?.status === 404 ? 'missing' : 'failed' });
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `restart` only matters for the first load
  }, [labId, enabled]);

  const liveFlow = useMemo(() => {
    if (!enabled || state.status !== 'ready') return null;
    const { lab, questions, attempt, chrome = {} } = state.data;
    const { screen, ...copy } = chrome;
    return {
      ...copy,
      id: lab.id,
      title: copy.title ?? lab.title,
      headerTitle: copy.headerTitle ?? `Skills Lab · ${lab.title}`,
      subtitle: copy.subtitle ?? '',
      Screen: screen === 'ext' ? ExtLabScreen : undefined,
      total: lab.total,
      passMark: lab.passMark,
      correctXp: lab.correctXp ?? 10,
      hintCost: lab.hintCost ?? 5,
      questions,
      // Resume where the server says; XP in the header is this run's (no streak tracking yet).
      session: { index: attempt.index, results: attempt.results, xp: 0, streakDays: null },
      frames: {},
      live: {
        answer: (body) => answerLab(labId, { attemptId: attemptRef.current, ...body }),
        finish: () => finishLab(labId, attemptRef.current),
        restart: async () => {
          const data = await restartLab(labId);
          attemptRef.current = data.attempt.id;
          return data;
        },
      },
    };
  }, [enabled, state, labId]);

  return { status: state.status, error: state.error, flow: liveFlow };
};
