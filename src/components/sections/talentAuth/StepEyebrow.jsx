import { GenzDoodleStar } from '../../shared/assets.jsx';

/*
 * StepEyebrow — the "01 The Basics" pill above each talent sign-up heading.
 *   Focused: #fffefc pill, 1px #c1d4c4, radius 8, grey number + green label.
 *   Playful: gold sticker tilted 4deg, 1.2px ink border, hard 2px ink
 *   shadow, ink text, with three doodle stars around it, placed from the sticker's edges so they fit any label length.
 * The look follows the sign-up style switch (UiStyleScope), so only `playful:` classes differ.
 */
// `icon` replaces the leading dot (Education shows a small trend-up glyph).
const StepEyebrow = ({ number, label, icon, className = '' }) => (
  <span className={`relative inline-flex ${className}`}>
    <span className="inline-flex items-center gap-2 rounded-[8px] border border-[#c1d4c4] bg-[#fffefc] px-4 py-1 max-md:px-3 max-md:py-0.5 playful:rotate-[4deg] playful:border-[1.2px] playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:px-[11px] playful:py-[5px] playful:shadow-[2px_2px_0_#1c2a21]">
      {icon ? (
        <span aria-hidden="true" className="text-brand-green playful:text-[#1c2a21]">
          {icon}
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="size-2 rounded-full border-[1.5px] border-[#1d7c4d] bg-[#e1eae2]"
          style={{ boxShadow: '0 0 4px 0 #006B3F' }}
        />
      )}
      <span className="font-heading text-[15px] font-semibold leading-[19px] text-[#b5b5b5] playful:text-[#1c2a21]">
        {number}
      </span>
      <span
        className="text-[12px] leading-[18px] text-brand-green playful:text-[#1c2a21]"
        style={{ letterSpacing: '0.2px' }}
      >
        {label}
      </span>
    </span>
    <GenzDoodleStar
      size={16}
      color="#C8951A"
      className="absolute hidden playful:block"
      style={{ left: 'calc(100% + 8px)', top: 'calc(50% - 23px)' }}
    />
    <GenzDoodleStar
      size={10}
      color="#C8951A"
      className="absolute hidden playful:block"
      style={{ left: 'calc(100% + 30px)', top: 'calc(50% - 5px)' }}
    />
    <GenzDoodleStar
      size={9}
      color="#387440"
      className="absolute hidden playful:block"
      style={{ left: '-20px', top: 'calc(50% - 1px)' }}
    />
  </span>
);

export default StepEyebrow;
