import { classNames } from '../../../utils/classNames.js';
import StatusDot from '../../ui/StatusDot.jsx';

/*
 * SectionProgressBanner — top pill banner on the Identity Map page.
 * Source: Figma frame (Section 1 · Your Identity · 2 of 9 stages done).
 *
 * Renders as a single horizontal pill positioned at the top-centre of
 * the map area, with a small leading green dot followed by the section
 * meta in uppercase tracking.
 */

const SectionProgressBanner = ({
  sectionNumber = 1,
  sectionLabel = 'Your Identity',
  stagesDone = 0,
  totalStages = 9,
  className,
}) => (
  <div
    className={classNames(
      'inline-flex items-center gap-2 rounded-full border border-brand-green-light-active',
      'bg-white/90 backdrop-blur-sm px-4 py-1.5 shadow-bottom-100',
      className
    )}
  >
    <StatusDot color="brand" />
    <span className="font-sans font-semibold text-[11px] leading-4 tracking-[1.2px] uppercase text-content-primary">
      Section {sectionNumber} · {sectionLabel} · {stagesDone} of {totalStages} Stages Done
    </span>
  </div>
);

export default SectionProgressBanner;
