import { classNames } from '../../../../../utils/classNames.js';
import { CheckCircleFillIcon, UsersIcon } from './SyncIcons.jsx';

/*
 * SyncChip — the status chips of the page tree and the section pane (Figma "GTH · Chip": 32 high, r999, 14 px side padding, 13/600):
 *   edited   #ebf1ec · #2a5730 · check-circle   "Edited"
 *   new      #eaeffb · #244a9f                  "New" (after a release, 7.8.8a)
 *   default  #f8f8f4 · #575755                  "Default"
 *   changed  #faf4e8 · #463409                  "Changed" (original text changed since the edit, 7.8.8b)
 *   shared   #eaeffb · #244a9f · users          "Used on every page"
 *   removed  #f8f8f4 · #575755                  "Removed" (7.8.8c)
 *   synced   #eaf3ec · #27522e                  "Synced" (7.8.8d)
 * Props: tone, children (default label by tone).
 */
const TONES = {
  edited: { box: 'bg-[#ebf1ec] text-[#2a5730]', label: 'Edited', icon: CheckCircleFillIcon },
  new: { box: 'bg-[#eaeffb] text-[#244a9f]', label: 'New' },
  default: { box: 'bg-[#f8f8f4] text-[#575755]', label: 'Default' },
  changed: { box: 'bg-[#faf4e8] text-[#463409]', label: 'Changed' },
  shared: { box: 'bg-[#eaeffb] text-[#244a9f]', label: 'Used on every page', icon: UsersIcon },
  removed: { box: 'bg-[#f8f8f4] text-[#575755]', label: 'Removed' },
  synced: { box: 'bg-[#eaf3ec] text-[#27522e]', label: 'Synced' },
};

const SyncChip = ({ tone, children, generated = false }) => {
  const t = TONES[tone] ?? TONES.default;
  const Glyph = t.icon;
  return (
    <span
      className={classNames(
        'inline-flex min-h-[32px] shrink-0 items-center gap-[6px] rounded-full px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap',
        t.box
      )}
    >
      {Glyph ? <Glyph className="size-[14px] shrink-0" /> : null}
      {generated ? (
        <span
          aria-hidden="true"
          data-count={children ?? t.label}
          className="after:content-[attr(data-count)]"
        />
      ) : (
        (children ?? t.label)
      )}
    </span>
  );
};

export default SyncChip;
