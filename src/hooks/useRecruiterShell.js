import { useEffect, useState } from 'react';
import {
  isRecruiterSession,
  loadRecruiterShell,
  peekRecruiterShell,
  subscribeRecruiterShell,
} from '../services/recruiterShell.api.js';

/*
 * useRecruiterShell() - the signed-in recruiter's shell data (name, organisation, plan, counts), shared
 * by the workspace rail, the top bar and the home page. Returns null for demo sessions (signed out,
 * or not a recruiter): callers then keep their Figma content. While loading it returns the parts that
 * have arrived; missing numbers are null (render a dash, never a demo value).
 */
export const useRecruiterShell = () => {
  const live = isRecruiterSession();
  const [data, setData] = useState(() => (live ? peekRecruiterShell() || {} : null));

  useEffect(() => {
    if (!live) return undefined;
    const off = subscribeRecruiterShell((d) => setData(d || {}));
    loadRecruiterShell().then((d) => setData(d || {}));
    return off;
  }, [live]);

  return live ? data || {} : null;
};

/* "—" for a number that has not arrived (or failed), the number otherwise. */
export const dash = (n) => (n === null || n === undefined ? '—' : String(n));
