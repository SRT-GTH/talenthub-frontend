import { classNames } from '../../../../../utils/classNames.js';

/*
 * PatternTimerRing — the countdown ring around the "?" bead (Figma "timer track" + "time left": two 122px ellipses with
 * arcData innerRadius .9, drawn from 12 o'clock clockwise; track = ink@.08, arc = #387440, urgent #c73326).
 * It is 1.173 x the bead and sits 9/104 outside it. `fraction` 0…1 of the ring that is still full.
 */
const RADIUS = 57.95; // mid-line of the 6.1px ring in a 122 box
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PatternTimerRing = ({ fraction, urgent }) => {
  const filled = Math.max(0, Math.min(1, fraction)) * CIRCUMFERENCE;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 122 122"
      className="pointer-events-none absolute top-[-8.65%] left-[-8.65%] size-[117.3%] -rotate-90"
    >
      <circle
        cx="61"
        cy="61"
        r={RADIUS}
        fill="none"
        stroke="rgba(28,42,33,0.08)"
        strokeWidth="6.1"
      />
      <circle
        cx="61"
        cy="61"
        r={RADIUS}
        fill="none"
        strokeWidth="6.1"
        strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
        className={classNames(
          'transition-[stroke-dasharray] duration-1000 ease-linear motion-reduce:transition-none',
          urgent ? 'stroke-[#c73326]' : 'stroke-[#387440]'
        )}
      />
    </svg>
  );
};

export default PatternTimerRing;
