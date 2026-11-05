import { useId } from 'react';

/*
 * SwitchSortGlyph — the card art: a coloured circle / rounded square with a pattern so colour never relies on hue alone
 * (Figma "shape · circle · blue" 9619:56558, "shape · square · red" 9619:58254, "colour swatch" 9619:56524 / 9619:56590).
 * One 120×120 drawing scaled by CSS: dots = red (5×5, r3.6, step 24), stripes = blue (10 bars 6 wide, step 19.2, rotated 35°).
 * Corner radius is 12 % of the side (14.4 / 120 on the card, 4.8 / 40 on the basket swatch).
 * Playful draws the 1.5px ink@.55 outline; Focused has none.
 */
const FILL = { red: '#c8432f', blue: '#2f5e9e' };
const DOT_CENTRES = [20.4, 44.4, 68.4, 92.4, 116.4];
const STRIPE_X = Array.from({ length: 10 }, (_, i) => 52.8 + i * 19.2);

const SwitchSortGlyph = ({ colour, shape, className = '' }) => {
  const clipId = useId();
  const round = shape === 'circle';
  return (
    <span className={`relative block shrink-0 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="block size-full">
        <defs>
          <clipPath id={clipId}>
            <rect width="120" height="120" rx={round ? 60 : 14.4} />
          </clipPath>
        </defs>
        <rect width="120" height="120" rx={round ? 60 : 14.4} fill={FILL[colour]} />
        <g clipPath={`url(#${clipId})`} fill="#fff">
          {colour === 'red'
            ? DOT_CENTRES.flatMap((cy) =>
                DOT_CENTRES.map((cx) => (
                  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.6" fillOpacity="0.38" />
                ))
              )
            : STRIPE_X.map((x) => (
                <rect
                  key={x}
                  x={x}
                  y="-60"
                  width="6"
                  height="240"
                  transform={`rotate(35 ${x} -60)`}
                  fillOpacity="0.3"
                />
              ))}
        </g>
      </svg>
      <span
        className={`absolute inset-0 ${
          round ? 'rounded-full' : 'rounded-[12%]'
        } playful:border-[1.5px] playful:border-solid playful:border-[rgba(28,42,33,0.55)]`}
      />
    </span>
  );
};

export default SwitchSortGlyph;
