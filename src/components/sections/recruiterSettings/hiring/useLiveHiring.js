import { useCallback, useEffect, useState } from 'react';
import api from '../../../../services/api.js';
import { isRecruiterSession } from '../../../../services/recruiterShell.api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('useLiveHiring');

/*
 * useLiveHiring - Settings > Hiring preferences for a signed-in recruiter.
 *   GET /recruiter/hiring-settings  { settings, defaults, company, yourName, saved }
 *   PUT /recruiter/hiring-settings  { location, screening, showPay, applyWithProfile, hireNss, replyWithin, messages }
 * The backend sends the four automatic messages from these settings (applied, moved forward, not progressing,
 * role closed); a message switched off is not sent.
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

// Only the keys the screen edits, so the saved/draft comparison ignores server fields such as updatedAt.
export const pickHiring = (s = {}) => ({
  location: s.location || '',
  screening: s.screening || '',
  showPay: s.showPay !== false,
  applyWithProfile: s.applyWithProfile !== false,
  hireNss: s.hireNss !== false,
  replyWithin: s.replyWithin || '2 days',
  messages: Object.fromEntries(
    ['applied', 'forward', 'declined', 'closed'].map((id) => {
      const m = (s.messages && s.messages[id]) || {};
      return [id, { on: m.on !== false, text: m.text || '', edited: Boolean(m.edited) }];
    })
  ),
});

export const useLiveHiring = () => {
  const live = isRecruiterSession();
  const [state, setState] = useState({
    status: live ? 'loading' : 'demo',
    settings: null,
    defaults: {},
    company: '',
    yourName: '',
  });

  const take = (out) => ({
    status: 'live',
    settings: pickHiring(out.settings),
    defaults: out.defaults || {},
    company: out.company || '',
    yourName: out.yourName || '',
  });

  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    api
      .get('/recruiter/hiring-settings')
      .then((res) => {
        if (alive) setState(take(unwrap(res) || {}));
      })
      .catch((err) => {
        log.error('load failed:', err?.response?.status);
        if (alive) setState((s) => ({ ...s, status: 'error' }));
      });
    return () => {
      alive = false;
    };
  }, [live]);

  const save = useCallback(async (draft) => {
    const out = unwrap(await api.put('/recruiter/hiring-settings', draft)) || {};
    const next = take(out);
    setState(next);
    log('saved');
    return next.settings;
  }, []);

  return { ...state, save };
};
