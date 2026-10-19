import { useCallback, useEffect, useMemo, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import {
  fetchAssessmentTemplates,
  fetchMyAssessmentResults,
  scoreAssessment,
} from '../../../services/assessment.api.js';
import { LIVE_TYPES, buildLiveFlow, buildLiveResult, toRawResponses } from './liveAssessments.js';

const log = debug('useLiveAssessments');

/*
 * Templates + the talent's own results for My Assessment. `status`: loading | ready | error.
 * `flowFor(slug)` builds a runnable flow whose `submit(committed)` sends the answers to the server and resolves the
 * FullResultDialog view-model (fullFlow.js calls it once the run is finished).
 */
export const useLiveAssessments = ({ enabled = true } = {}) => {
  const [state, setState] = useState({ status: enabled ? 'loading' : 'idle', templates: [], results: [] });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading' }));
    try {
      const [templates, mine] = await Promise.all([
        fetchAssessmentTemplates(),
        fetchMyAssessmentResults().catch((err) => {
          log.error('results failed:', err?.response?.status || err?.message);
          return { rows: [] };
        }),
      ]);
      setState({ status: 'ready', templates, results: mine.rows });
    } catch (err) {
      log.error('templates failed:', err?.response?.status || err?.message);
      setState((s) => ({ ...s, status: 'error' }));
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  const latestByType = useMemo(() => {
    const out = {};
    state.results.forEach((r) => {
      const prev = out[r.assessmentType];
      const at = (x) => new Date(x.completedAt || x.createdAt).getTime() || 0;
      if (!prev || at(r) > at(prev)) out[r.assessmentType] = r;
    });
    return out;
  }, [state.results]);

  const flowFor = useCallback(
    (slug) => {
      const meta = LIVE_TYPES[slug];
      if (!meta) return null;
      const template = state.templates.find((t) => t.assessmentType === meta.type);
      if (!template || !template.questions?.length) return null;
      const flow = buildLiveFlow(template, slug, latestByType[meta.type] || null);
      flow.resultsTo = meta.kind === 'personality' ? '/my-assessment/personality' : '/my-assessment';
      flow.submit = async (committed) => {
        const rawResponses = toRawResponses(flow, committed);
        const data = await scoreAssessment({ assessmentType: meta.type, rawResponses });
        return buildLiveResult(flow, data);
      };
      return flow;
    },
    [state.templates, latestByType]
  );

  return { ...state, latestByType, flowFor, reload: load };
};
