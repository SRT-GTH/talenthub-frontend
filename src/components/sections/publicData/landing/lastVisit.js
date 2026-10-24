import { SECTION_TARGETS } from './data/landingData.js';

/*
 * lastVisit — the returning-visitor memory of the landing page (Figma 8.1.1b "Continue where you left off → Partners").
 * ⚠️ ASSUMPTION: Figma draws the chip, not the rule. It is remembered per browser in localStorage under KEY (a section id of SECTION_TARGETS)
 * and never leaves the device. The landing page writes it when a visitor leaves through one of its section links; the sidebar / page chrome
 * could call rememberSection(id) too (REQUEST to the lead). Storage may be blocked: every access is wrapped.
 */

export const LAST_SECTION_KEY = 'gth:public-data:last-section';

export const rememberSection = (id) => {
  if (!SECTION_TARGETS[id]) return;
  try {
    window.localStorage.setItem(LAST_SECTION_KEY, id);
  } catch {
    /* storage blocked: the chip simply never appears */
  }
};

/** { label, to } of the remembered section, or null. */
export const readLastSection = () => {
  try {
    return SECTION_TARGETS[window.localStorage.getItem(LAST_SECTION_KEY)] ?? null;
  } catch {
    return null;
  }
};
