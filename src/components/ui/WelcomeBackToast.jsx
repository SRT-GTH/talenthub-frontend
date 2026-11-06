import { debug } from '../../utils/debug.js';
import StatusToast from './StatusToast.jsx';
import waveHandIcon from '../../assets/recruiter/welcome-back-wave-hand.svg';
import closeIcon from '../../assets/recruiter/welcome-back-toast-close.svg';

const log = debug('WelcomeBackToast');

/*
 * WelcomeBackToast — the one-line greeting card of the recruiter Career Buddy (Figma "WELCOME TOAST" 7958:161069, node 7958:161260):
 * white, r12, a 1px green-to-gold gradient border, a gold hand-wave icon, "Welcome Back,  {name}" in 15px (the greeting is
 * semibold, the name regular) and a close button, over a 5 % ink wash that blurs the page by 1.8px (Figma blur radius; CSS uses half) (node 7958:161259).
 * A variant of `ui/StatusToast` (look and position only; the engine owns the live region, the timer and the swift in/out motion).
 * Props: name (string, e.g. "Mr.Whitmore"), open (default true), duration (ms, default 5000), onClose.
 */
const WelcomeBackToast = ({ name, open = true, duration = 5000, onClose }) => {
  log('render', { open, name });
  return (
    <StatusToast
      open={open}
      duration={duration}
      onClose={onClose}
      resetKey={name}
      wrapperClassName="pointer-events-none fixed inset-0 z-[80] flex items-start justify-center bg-[#1c2a21]/5 pt-[22px] backdrop-blur-[0.9px]"
      faceClassName="pointer-events-auto flex h-[55px] max-w-[calc(100vw-24px)] items-center gap-[36px] rounded-[12px] border border-solid border-transparent px-[16px] py-[12px] shadow-[0_2px_5.6px_rgba(200,149,26,0.12)] [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(113deg,#c2c7a2_0%,#c7a23c_100%)_border-box]"
    >
      <span className="flex items-center gap-[10px]">
        <img src={waveHandIcon} alt="" aria-hidden="true" className="block size-[24px] shrink-0" />
        <span className="whitespace-pre font-sans text-[15px] leading-[18px] text-[#404040]">
          <span className="font-semibold">Welcome Back,</span>
          <span className="font-medium">{'  '}</span>
          <span className="font-normal">{name}</span>
        </span>
      </span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss welcome message"
        className="flex size-[24px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <img src={closeIcon} alt="" aria-hidden="true" className="block size-[20px]" />
      </button>
    </StatusToast>
  );
};

export default WelcomeBackToast;
