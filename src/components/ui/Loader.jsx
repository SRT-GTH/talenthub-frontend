import { debug } from '../../utils/debug.js';
import GthLoader from './gthLoader/GthLoader.jsx';

const log = debug('Loader');

/*
 * Loader — design-system spinner. Now the GTH loader (Figma "GTH · Loaders" 9312:544769, see ui/gthLoader/GthLoader.jsx): the plain green spinner is gone.
 * The old size names keep working:
 *   sm — 32  (inline with text, on white)            → GTH Section loader at 32
 *   md — 60  (default — a card or panel)             → GTH Section loader at 60
 *   lg — 96  (an empty page that carries the screen) → GTH Page loader at 96
 * Playful or Focused follows the user's UI style. For a loader inside a green button use <GthLoader size="button" /> (white arc on the button).
 * A11y: role="status" with a visually hidden label (inside GthLoader).
 */
const SIZE_PRESETS = {
  sm: { size: 'section', px: 32 },
  md: { size: 'section', px: 60 },
  lg: { size: 'page', px: 96 },
};

const Loader = ({ size = 'md', label = 'Loading…', className, ...rest }) => {
  log('render', { size, label });
  const preset = SIZE_PRESETS[size] || SIZE_PRESETS.md;
  return (
    <GthLoader size={preset.size} px={preset.px} label={label} className={className} {...rest} />
  );
};

export default Loader;
