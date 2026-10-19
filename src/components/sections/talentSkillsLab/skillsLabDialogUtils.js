/* Shared constants + helpers for the Skills Lab dialogs (kept out of the component files for fast refresh). */
export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

// Focused headings are SF Pro Rounded (font-sans); Playful headings are Bricolage Grotesque.
export const HEADING = 'font-sans playful:font-heading';

// "+50 {unit}" style templates: Playful says XP, Focused says pts.
export const fill = (template, values) =>
  template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));

export const unitFor = (uiStyle) => (uiStyle === 'playful' ? 'XP' : 'pts');

/*
 * The topic the talent last sent through "Suggest a lab". The toast that follows (?toast=suggestion) only knows the URL,
 * so the dialog leaves the topic here. Falls back to the topic drawn in Figma.
 */
export const suggestionDraft = { topic: 'Video editing' };
