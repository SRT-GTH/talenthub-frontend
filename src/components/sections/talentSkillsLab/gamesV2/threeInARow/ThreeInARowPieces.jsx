/*
 * X and O pieces (Figma "piece · X" 9619:62643, "piece · O" 9619:62648; 81×81 drawings). X = two rounded bars crossed at 45°,
 * O = a ring. Fill defaults to the piece colour; a winning cell passes white. Playful draws the 1.26px ink@.55 outline, Focused none.
 */
const INK = '[&_.ink]:stroke-transparent playful:[&_.ink]:stroke-[rgba(28,42,33,0.55)]';
const RING =
  'M72.0895 40.5004C72.0895 57.9469 57.9462 72.0901 40.4997 72.0901C23.0532 72.0901 8.90995 57.9469 8.90995 40.5004C8.90995 23.0538 23.0532 8.91063 40.4997 8.91063C57.9462 8.91063 72.0895 23.0538 72.0895 40.5004ZM20.9141 40.5004C20.9141 51.3172 29.6829 60.086 40.4997 60.086C51.3166 60.086 60.0854 51.3172 60.0854 40.5004C60.0854 29.6835 51.3166 20.9147 40.4997 20.9147C29.6829 20.9147 20.9141 29.6835 20.9141 40.5004Z';

export const ThreeInARowX = ({ fill = '#387440', className = '' }) => (
  <svg viewBox="0 0 81 81" fill="none" aria-hidden="true" className={`${INK} ${className}`}>
    <rect
      x="59.7585"
      y="10.4997"
      width="15.1874"
      height="69.6595"
      rx="7.56"
      transform="rotate(45 59.7585 10.4997)"
      fill={fill}
    />
    <rect
      className="ink"
      x="59.7585"
      y="11.3907"
      width="13.9274"
      height="68.3995"
      rx="6.93"
      transform="rotate(45 59.7585 11.3907)"
      strokeWidth="1.26"
    />
    <rect
      x="10.5018"
      y="21.2427"
      width="15.1874"
      height="69.6595"
      rx="7.56"
      transform="rotate(-45 10.5018 21.2427)"
      fill={fill}
    />
    <rect
      className="ink"
      x="11.3927"
      y="21.2427"
      width="13.9274"
      height="68.3995"
      rx="6.93"
      transform="rotate(-45 11.3927 21.2427)"
      strokeWidth="1.26"
    />
  </svg>
);

export const ThreeInARowO = ({ fill = '#e0a526', className = '' }) => (
  <svg viewBox="0 0 81 81" fill="none" aria-hidden="true" className={`${INK} ${className}`}>
    <path d={RING} fill={fill} />
    <path className="ink" d={RING} strokeWidth="1.26" />
  </svg>
);
