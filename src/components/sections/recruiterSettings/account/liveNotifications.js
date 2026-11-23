import api from '../../../../services/api.js';

/*
 * Settings > Notifications, signed in: GET / PUT /notifications/preferences (backend notificationPreference).
 * Each row of the matrix is stored on one notification category the backend already sends under:
 *   new-applicants, offers -> applications   (one category: these two rows switch together)
 *   messages -> messages, interviews -> recruiter, closing -> opportunities, streak -> streak
 *   digest -> the daily digest (digest.enabled / digest.channels)
 * Columns In app / Email / SMS -> channels inApp / email / sms. Quiet hours 21:00-07:00 Africa/Accra.
 */

export const ROW_CATEGORY = {
  'new-applicants': 'applications',
  offers: 'applications',
  messages: 'messages',
  interviews: 'recruiter',
  closing: 'opportunities',
  streak: 'streak',
};
const COLS = ['inApp', 'email', 'sms'];

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

const colsFrom = (cat, globalChannels) => {
  if (!cat || cat.enabled === false) return [false, false, false];
  const list = Array.isArray(cat.channels) && cat.channels.length ? cat.channels : null;
  return COLS.map((c) => (list ? list.includes(c) : Boolean(globalChannels?.[c])));
};

export const draftFromPreferences = (prefs, rowIds) => {
  const cats = prefs?.categories || {};
  const rows = {};
  rowIds.forEach((id) => {
    if (id === 'digest') {
      const d = prefs?.digest || {};
      rows[id] = d.enabled
        ? COLS.map((c) =>
            Array.isArray(d.channels) && d.channels.length ? d.channels.includes(c) : c === 'email'
          )
        : [false, false, false];
    } else rows[id] = colsFrom(cats[ROW_CATEGORY[id]], prefs?.channels);
  });
  return { rows, quiet: Boolean(prefs?.quietHours?.enabled) };
};

export const fetchNotificationPrefs = async () =>
  unwrap(await api.get('/notifications/preferences'))?.preferences || {};

/** Sends the full categories object (the backend replaces it as a whole). */
export const saveNotificationPrefs = async (prefs, draft) => {
  const categories = { ...(prefs?.categories || {}) };
  const byCat = {};
  Object.entries(draft.rows).forEach(([id, cols]) => {
    const cat = ROW_CATEGORY[id];
    if (!cat) return;
    byCat[cat] = (byCat[cat] || [false, false, false]).map((v, i) => v || cols[i]);
  });
  Object.entries(byCat).forEach(([cat, cols]) => {
    categories[cat] = {
      ...(categories[cat] || {}),
      enabled: cols.some(Boolean),
      channels: COLS.filter((_, i) => cols[i]),
    };
  });
  const digestCols = draft.rows.digest || [false, false, false];
  const body = {
    categories,
    quietHours: {
      ...(prefs?.quietHours || {}),
      enabled: draft.quiet,
      start: '21:00',
      end: '07:00',
      timezone: 'Africa/Accra',
    },
    digest: {
      ...(prefs?.digest || {}),
      enabled: digestCols.some(Boolean),
      channels: COLS.filter((_, i) => digestCols[i]),
      frequency: 'daily',
    },
  };
  return (
    unwrap(await api.put('/notifications/preferences', body))?.preferences || { ...prefs, ...body }
  );
};
