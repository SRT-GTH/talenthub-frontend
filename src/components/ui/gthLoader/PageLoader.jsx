import { classNames } from '../../../utils/classNames.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import GthLoader from './GthLoader.jsx';
import GthRouteProgress from './GthRouteProgress.jsx';

/*
 * PageLoader — the full-page loader for the first load after login (Figma LD-01 Playful 9314:10307, LD-02 Focused 9314:10426).
 *   Playful: cream gradient + soft green / red / gold blobs, the 6 px kente band on top, the 226.8 loader, a Bricolage 30 caption that rotates through four lines (4 s loop),
 *            the 260 route bar, a "DID YOU KNOW" tip pill tilted 1.5deg, and "GHANA TALENT HUB" at the foot.
 *   Focused: #f7f8f4, the 128.8 loader, one 17 / 500 #595959 line, a 220 route bar, the foot line.
 * Props: look, captions (Playful rotation), label (Focused line), tip, className.
 * ⚠️ ASSUMPTION: the three background blobs are soft radial gradients in the Figma tints (the blob art is a blurred export); the caption cycle is the drawn 4 s (about 1 s per line).
 */
const PAGE_CAPTIONS = [
  'Warming up Buddy…',
  'Polishing your profile…',
  'Finding your people…',
  'Lining up opportunities…',
];
const DEFAULT_TIP = 'A 3-minute quiz keeps your streak alive.';
// Lines 2-4 are one track shifted by 1 s (see gthLoader.css), line 1 has its own.
const CAPTION_DELAY = ['0s', '0s', '-3s', '-2s'];
const KENTE =
  'repeating-linear-gradient(90deg,#d64534 0 48px,#f5b724 48px 96px,#387440 96px 144px,#1c2a21 144px 192px)';

const Foot = ({ playful }) => (
  <p
    className={classNames(
      'absolute bottom-[clamp(24px,5.4vh,60px)] left-0 m-0 w-full text-center font-sans text-[13px] leading-[16px] font-semibold tracking-[1.56px]',
      playful ? 'text-[rgba(28,42,33,0.55)]' : 'text-[rgba(28,42,33,0.45)]'
    )}
  >
    GHANA TALENT HUB
  </p>
);

const BLOB = 'pointer-events-none absolute rounded-full';

const PageLoader = ({
  look,
  captions = PAGE_CAPTIONS,
  label = 'Loading your dashboard',
  tip = DEFAULT_TIP,
  className,
}) => {
  const { uiStyle } = useUiStyle();
  const mode = look || (uiStyle === 'playful' ? 'playful' : 'focused');
  if (mode === 'focused') {
    return (
      <div
        data-route-fallback
        role="status"
        aria-label={label}
        className={classNames(
          'relative grid min-h-dvh flex-1 place-items-center bg-[#f7f8f4]',
          className
        )}
      >
        <div className="flex flex-col items-center gap-[18px]">
          <GthLoader size="page" look="focused" px="clamp(96px,9vw,128.8px)" label="" />
          <p className="m-0 font-sans text-[17px] leading-[normal] font-medium whitespace-nowrap text-[#595959]">
            {label}
          </p>
          <GthRouteProgress look="focused" pace="slow" className="!w-[220px]" />
        </div>
        <Foot playful={false} />
      </div>
    );
  }
  return (
    <div
      data-route-fallback
      role="status"
      aria-label="Loading"
      className={classNames(
        'relative grid min-h-dvh flex-1 place-items-center overflow-hidden',
        className
      )}
      style={{ backgroundImage: 'linear-gradient(139.24deg,#f7faf2 0%,#fff5e0 71.429%)' }}
    >
      <div
        aria-hidden="true"
        className={classNames(BLOB, '-top-[200px] -left-[160px] size-[620px]')}
        style={{
          backgroundImage: 'radial-gradient(closest-side,rgba(56,116,64,0.2),rgba(56,116,64,0))',
        }}
      />
      <div
        aria-hidden="true"
        className={classNames(BLOB, '-top-[60px] right-[60px] size-[300px]')}
        style={{
          backgroundImage: 'radial-gradient(closest-side,rgba(214,69,52,0.17),rgba(214,69,52,0))',
        }}
      />
      <div
        aria-hidden="true"
        className={classNames(BLOB, '-right-[130px] -bottom-[190px] size-[560px]')}
        style={{
          backgroundImage: 'radial-gradient(closest-side,rgba(245,183,36,0.38),rgba(245,183,36,0))',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[6px]"
        style={{ backgroundImage: KENTE }}
      />
      <div className="relative flex flex-col items-center gap-[22px] px-4">
        <GthLoader size="page" look="playful" px="clamp(150px,13.1vw,226.8px)" label="" />
        <div className="relative h-[40px] w-[min(520px,92vw)] font-heading text-[30px] leading-[normal] font-semibold text-[#1c2a21] max-sm:text-[24px]">
          {captions.slice(0, 4).map((c, i) => (
            <p
              key={c}
              data-first={i === 0 ? '' : undefined}
              className="gl-caption absolute inset-x-0 top-0 m-0 text-center"
              style={{ animationDelay: CAPTION_DELAY[i] }}
            >
              {c}
            </p>
          ))}
        </div>
        <GthRouteProgress look="playful" pace="slow" className="!w-[260px]" />
        {tip ? (
          <div className="rotate-[1.5deg] rounded-full border-[1.5px] border-solid border-[#1c2a21] bg-white px-[14px] py-[8px] font-sans shadow-[0_2px_0_#1c2a21]">
            <span className="flex items-start gap-[8px] whitespace-nowrap max-sm:whitespace-normal">
              <span className="text-[13px] font-bold text-[#be780a]">DID YOU KNOW</span>
              <span className="text-[14px] font-medium text-[#3c4640]">{tip}</span>
            </span>
          </div>
        ) : null}
      </div>
      <Foot playful />
    </div>
  );
};

export default PageLoader;
