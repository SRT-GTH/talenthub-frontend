import { GLYPHS } from './jobGlyphData.js';

/*
 * Glyphs of the recruiter job flows (Figma "Recruiter - Job Postings" 10103:59491). Every glyph is Figma's own export (the design system's `Icon/<name>` instances, e.g. `Icon/check-circle`, `Icon/building`),
 * saved purpose-named in `src/assets/recruiter-jobs/*.svg` and inlined through `jobGlyphData.js` so strokes follow `currentColor`. Nothing here is hand-drawn.
 * `Glyph` renders one by name; the named exports below keep the call sites readable. `size` scales the exported vector (Figma draws each at 12, 16, 18, 20 or 28 px).
 */
export const Glyph = ({ name, size, className }) => {
  const glyph = GLYPHS[name];
  if (!glyph) return null;
  return (
    <svg
      viewBox={glyph.viewBox}
      width={size ?? glyph.w}
      height={size ?? glyph.h}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      dangerouslySetInnerHTML={{ __html: glyph.body }}
    />
  );
};

const make = (name, defaultSize) => {
  const Component = ({ size = defaultSize, className }) => (
    <Glyph name={name} size={size} className={className} />
  );
  Component.displayName = `Glyph(${name})`;
  return Component;
};

export const SetupIcon = ({ kind }) => (
  <Glyph
    name={kind === 'onsite' ? 'building' : kind === 'hybrid' ? 'activity-hybrid' : 'globe'}
    size={16}
  />
);

export const PlusGlyph = make('plus', 14);
export const CheckCircle = make('check-circle', 16);
export const SpinnerGlyph = make('refresh-spinner', 16);
export const ClockGlyph = make('clock', 16);
export const ArrowBack = make('arrow-back-undo', 14);
export const ArrowRight = make('arrow-right', 14);
export const InfoCircle = make('info', 18);
export const WarnTriangle = make('alert', 18);
export const EyeGlyph = make('eye-preview', 16);
export const FileGlyph = make('file-document', 22);
export const SaveGlyph = make('save-draft', 16);
export const SendGlyph = make('send', 22);
export const SparkGlyph = make('sparkles', 18);
export const LinkGlyph = make('link', 16);
export const PipelineGlyph = make('pipeline', 16);
export const BookmarkGlyph = make('bookmark', 16);
export const DotsGlyph = make('more-dots', 16);
export const PauseGlyph = make('pause', 22);
export const CopyGlyph = make('copy', 14);
export const TrashGlyph = make('trash', 16);
export const PencilGlyph = make('pencil', 16);
export const FilterGlyph = make('filter', 18);
export const BuildingGlyph = make('building', 18);
export const MapPin = make('map-pin', 12);
export const BriefcaseGlyph = make('briefcase', 12);
export const CalendarGlyph = make('calendar', 12);
export const CloseGlyph = make('close-x', 14);
export const XCircleGlyph = make('x-circle', 16);
export const BellGlyph = make('bell', 16);
export const CheckGlyph = make('check', 12);
export const CheckTick = make('check-tick', 12);
export const BadgeCheck = make('badge-check', 12);
export const ChevronSelect = make('chevron-select', 20);
