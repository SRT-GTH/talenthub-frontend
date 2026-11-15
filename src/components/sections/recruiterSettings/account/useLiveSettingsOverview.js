import { useCallback, useEffect, useState } from 'react';
import { isRecruiterSession } from '../../../../services/recruiterShell.api.js';
import { fetchSettingsOverview } from '../../../../services/settings.api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('useLiveSettingsOverview');

/*
 * The signed-in recruiter's own account settings from GET /settings/overview (backend talentSettings.service,
 * which acts on whoever is signed in): preferences (accessibility, language), password age and signed-in devices.
 * Signed out -> { status: 'demo' } and the tabs keep their Figma values.
 */
export const useLiveSettingsOverview = () => {
  const live = isRecruiterSession();
  const [state, setState] = useState({ status: live ? 'loading' : 'demo', overview: null });

  const reload = useCallback(
    () =>
      fetchSettingsOverview()
        .then((overview) => setState({ status: 'live', overview: overview || {} }))
        .catch((err) => {
          log.error('overview failed:', err?.response?.status);
          setState({ status: 'error', overview: null });
        }),
    []
  );

  useEffect(() => {
    if (live) reload();
  }, [live, reload]);

  return { ...state, reload };
};

/* Recruiter Accessibility tab <-> preferences.accessibility (textSize is a percentage there). */
const SIZE_TO_PCT = { Default: 100, Large: 125, 'Extra large': 150 };
export const a11yFromPrefs = (a = {}, defaults) => ({
  ...defaults,
  textSize: Object.entries(SIZE_TO_PCT).reduce(
    (best, [label, pct]) =>
      Math.abs(pct - (a.textSize ?? 100)) < Math.abs(SIZE_TO_PCT[best] - (a.textSize ?? 100))
        ? label
        : best,
    'Default'
  ),
  ...(typeof a.contrast === 'boolean' ? { contrast: a.contrast } : {}),
  ...(typeof a.motion === 'boolean' ? { motion: a.motion } : {}),
  ...(typeof a.dyslexia === 'boolean' ? { dyslexia: a.dyslexia } : {}),
  ...(typeof a.aloud === 'boolean' ? { aloud: a.aloud } : {}),
  ...(typeof a.keyboard === 'boolean' ? { shortcuts: a.keyboard } : {}),
});
export const a11yToPrefs = (d) => ({
  textSize: SIZE_TO_PCT[d.textSize] || 100,
  contrast: Boolean(d.contrast),
  motion: Boolean(d.motion),
  dyslexia: Boolean(d.dyslexia),
  aloud: Boolean(d.aloud),
  keyboard: Boolean(d.shortcuts),
});

/** "3 months ago" style age of the password, or null. */
export const ageOf = (iso) => {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  const days = Math.floor((Date.now() - t) / 864e5);
  if (days < 1) return 'today';
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? '' : 's'} ago`;
};
