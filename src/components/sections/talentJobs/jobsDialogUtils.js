import { useEffect, useLayoutEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { JOB_LIST } from './talentJobsData.js';

const log = debug('jobsDialogUtils');

/* Shared constants + hooks for the Job Postings dialogs (kept out of the component files for fast refresh). */
export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

// Hard "ink" shadow + border shared by selected chips / tiles in Playful (Figma 2px 2px 0 #1c2a21).
export const INK_CHIP =
  'playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]';

export const HEADING = 'font-sans playful:font-heading';

export const findJob = (id, fallbackId) =>
  JOB_LIST.find((job) => job.id === id) ?? JOB_LIST.find((job) => job.id === fallbackId);

export const fill = (template, values) =>
  template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));

// Viewport-anchored placement for the popovers. `measure` must be a stable function returning
// `{ top, right }` (px) or null when the anchor is not on the page.
export const useAnchor = (measure) => {
  const [pos, setPos] = useState(null);
  useLayoutEffect(() => {
    const place = () => {
      const next = measure();
      log('anchor', next);
      setPos(next);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [measure]);
  return pos;
};

export const useMount = (name, detail) => {
  useEffect(() => {
    log(`${name} mount`, detail);
    return () => log(`${name} unmount`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
