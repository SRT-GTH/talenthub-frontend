import { LpFireIcon, LpWalletIcon } from './LpAIcons.jsx';
import buddySrc from '../../../../assets/landing/career-buddy-mascot.png';
import avatarB from '../../../../assets/landing/student-avatar-b.webp';

/*
 * LpAParts — pieces shared by the LP-A landing sections.
 * Everything inside the float cards / stickers is sized in `em` (1em = 1 Figma px at the wrapper's font-size), so the
 * hero can scale the whole sticker cluster with one font-size (`--u`) while keeping Figma's proportions.
 * Text leaves carry their own em font-size and no padding/margin (no compounding).
 */

const CARD_SHADOW = 'shadow-[4em_4em_0_rgba(28,42,33,0.14),0_8em_20em_rgba(28,42,33,0.05)]';

/* Dot-grid texture (Figma "Texture · dot grid (decorative)"): 2px dots on a regular grid. */
export const DotGrid = ({ color, step = 40, className = '' }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 ${className}`}
    style={{
      backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1.5px)`,
      backgroundSize: `${step}px ${step}px`,
    }}
  />
);

/* "genz:sticker" — rotated pill with a hard 2px shadow. Figma: pad 5/11, radius 8, 1.2 ink stroke, 12/700 +0.4 tracking. */
export const Sticker = ({ children, bg = '#ffd86b', className = '', style }) => (
  <span
    className={`inline-flex rounded-[8em] border-[1.2em] border-[#1c2a21] px-[11em] py-[5em] shadow-[2em_2em_0_#1c2a21] ${className}`}
    style={{ backgroundColor: bg, ...style }}
  >
    <span className="whitespace-nowrap font-sans text-[12em] font-bold leading-[1.1933] tracking-[0.033em] text-[#1c2a21]">
      {children}
    </span>
  </span>
);

/* LP · Float · Streak (189x66) */
export const StreakCard = ({ className = '', style }) => (
  <div
    className={`flex items-center gap-[10em] rounded-[18em] border-[1.2em] border-[#1c2a21] bg-white py-[12em] pl-[12em] pr-[16em] ${CARD_SHADOW} ${className}`}
    style={style}
  >
    <span className="flex size-[40em] shrink-0 items-center justify-center rounded-[12em] bg-[#fff1e6]">
      <LpFireIcon id="lpa-hero-fire" className="h-[22em] w-[19em]" />
    </span>
    <span className="flex flex-col gap-[1em]">
      <span className="whitespace-nowrap font-heading text-[17em] font-semibold leading-[1.2500] text-[#1c2a21]">
        12-day streak
      </span>
      <span className="whitespace-nowrap font-sans text-[12em] font-semibold leading-[1.1933] text-[#785910]">
        +90 XP this week
      </span>
    </span>
  </div>
);

/* LP · Float · Match (260x130) */
export const MatchCard = ({ className = '', style }) => (
  <div
    className={`flex flex-col gap-[8em] rounded-[20em] border-[1.2em] border-[#1c2a21] bg-white px-[18em] py-[16em] ${CARD_SHADOW} ${className}`}
    style={style}
  >
    <div className="flex items-center gap-[10em]">
      <span className="flex size-[40em] shrink-0 items-center justify-center rounded-[12em] bg-[#387440] text-white">
        <LpWalletIcon className="size-[20em]" />
      </span>
      <span className="flex flex-col gap-[1em]">
        <span className="whitespace-nowrap font-sans text-[14em] font-semibold leading-[1.1929] text-[#1c2a21]">
          Frontend Engineer
        </span>
        <span className="whitespace-nowrap font-sans text-[12em] font-normal leading-[1.1933] text-[#595959]">
          Hubtel · Accra
        </span>
      </span>
    </div>
    <div className="flex items-center gap-[8em]">
      <span className="font-heading text-[27em] font-semibold leading-[1.2000] text-[#387440]">
        96%
      </span>
      <span className="whitespace-nowrap font-sans text-[12em] font-semibold leading-[1.1933] text-[#595959]">
        match for you
      </span>
    </div>
    <div className="h-[8em] overflow-hidden rounded-[4em] bg-[#eceee8]">
      <div className="h-full w-[96%] rounded-[4em] bg-[linear-gradient(90deg,#387440,#84cc16)]" />
    </div>
  </div>
);

/* LP · Float · Buddy (276x62), corner radii 20/20/20/4 */
export const BuddyCard = ({ className = '', style }) => (
  <div
    className={`flex items-center gap-[10em] rounded-[20em_20em_20em_4em] border-[1.2em] border-[#1c2a21] bg-white py-[12em] pl-[12em] pr-[16em] ${CARD_SHADOW} ${className}`}
    style={style}
  >
    <span className="flex size-[36em] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ebf1ec]">
      <img src={buddySrc} alt="" className="size-[34em] rounded-full object-cover" />
    </span>
    <span className="block w-[200em]">
      <span className="block font-sans text-[13em] font-medium leading-[1.3846] text-[#1c2a21]">
        Akwaaba! Want me to find roles that fit you?
      </span>
    </span>
  </div>
);

/* LP · Float · Recruiter (283x54) — gold pill with a recruiter's photo */
export const RecruiterCard = ({
  className = '',
  style,
  text = 'Ama from Hubtel viewed your profile',
}) => (
  <div
    className={`flex items-center gap-[10em] rounded-full border-[1.2em] border-[#1c2a21] bg-[#ffd86b] py-[10em] pl-[10em] pr-[14em] ${CARD_SHADOW} ${className}`}
    style={style}
  >
    <img
      src={avatarB}
      alt=""
      className="size-[32em] shrink-0 rounded-full border-[2em] border-[#1c2a21] object-cover"
    />
    <span className="whitespace-nowrap font-sans text-[13em] font-bold leading-[1.1923] text-[#1c2a21]">
      {text}
    </span>
  </div>
);
