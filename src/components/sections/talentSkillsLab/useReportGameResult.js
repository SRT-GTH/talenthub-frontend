import { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { postGameResult } from '../../../services/skillsLab.api.js';

const log = debug('useReportGameResult');

const plain = (v) => (Array.isArray(v) ? v.map((x) => (Array.isArray(x) ? x[0] : x)).join('') : String(v ?? ''));

/*
 * Saves a finished game run for the signed-in talent (POST /skills-lab/games/:gameId/result): the server stores a game
 * session, and a passed skill game adds a Game-evidenced skill. Once per result object; nothing is sent for Figma frames
 * (`?f=`), `?demo=1`, or outside /skills-lab/games/:gameId.
 *   skill games       result.meta = { correct, total, passed } (buildGameResult)
 *   personality games result.title / traits (GameCompleteDialog copy)
 */
export const useReportGameResult = (result, { kind = 'skill' } = {}) => {
  const { gameId } = useParams();
  const [params] = useSearchParams();
  const sent = useRef(null);
  const startedAt = useRef(Date.now());
  const skip = !gameId || params.get('f') || params.get('demo') === '1';

  useEffect(() => {
    if (skip || !result || sent.current === result) return;
    sent.current = result;
    const durationSeconds = Math.round((Date.now() - startedAt.current) / 1000);
    const body =
      kind === 'skill'
        ? { ...(result.meta ?? {}), durationSeconds }
        : {
            durationSeconds,
            playStyle: plain(result.title).slice(0, 120),
            traits: (result.traits ?? []).map((tr) => ({ label: tr.label, chip: tr.chip, strong: Boolean(tr.strong) })),
          };
    log('report', gameId, body);
    postGameResult(gameId, body).catch((err) => log('report failed', err?.response?.status || err?.message));
    startedAt.current = Date.now();
  }, [skip, result, kind, gameId]);
};
