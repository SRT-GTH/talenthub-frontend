import StatusToast from './StatusToast.jsx';
import { classNames } from '../../utils/classNames.js';
import successIcon from '../../assets/ui/banner-toast-success.svg';
import warningIcon from '../../assets/ui/banner-toast-warning.svg';
import closeIcon from '../../assets/ui/banner-toast-close.svg';

/*
 * BannerToast — the light, two-line status toast with an optional action (Figma "Component 31" 10057:64881 success, "Component 32" 10068:41181 warning; recruiter dashboard D04 / D08).
 * A variant of `ui/StatusToast` (the one toast engine: live region, timer, motion). Unlike `ui/Toast` it has no scrim and no queue: `placement` positions it, `onClose` ends it.
 * tone 'success': #ebf1ec face, green border, "Success" title #2a5730. tone 'warning': #fefbf4 face, gold border, "Warning" title #b8712a.
 * Props: tone, title, message, actionLabel (omit to hide), onAction (called, then the toast closes), onClose, duration (ms, default 6000; 0 = stay), placement (wrapper classes, default top-centre under the nav).
 */
const TONES = {
  success: {
    face: 'border-[#387440] bg-[#ebf1ec]',
    title: 'text-[#2a5730]',
    icon: successIcon,
    action: 'text-[#2a5730]',
  },
  warning: {
    face: 'border-[#c8951a] bg-[#fefbf4]',
    title: 'text-[#b8712a]',
    icon: warningIcon,
    action: 'text-[#b8712a]',
  },
};

const BannerToast = ({
  tone = 'success',
  title,
  message,
  actionLabel,
  onAction,
  onClose,
  duration = 6000,
  placement = 'fixed top-[96px] left-1/2 z-[70] w-[500px] max-w-[calc(100vw-32px)] -translate-x-1/2 max-md:top-[72px]',
}) => {
  const style = TONES[tone] ?? TONES.success;
  return (
    <StatusToast
      duration={duration}
      resetKey={message}
      onClose={onClose}
      portal
      wrapperClassName={placement}
      faceClassName={classNames(
        'flex items-center justify-between gap-[24px] rounded-[12px] border border-solid py-[12px] pr-[14px] pl-[16px] shadow-[0_2px_5.6px_rgba(0,0,0,0.12)] max-sm:gap-[12px]',
        style.face
      )}
    >
      <div className="flex min-w-0 items-start gap-[11px]">
        <img src={style.icon} alt="" aria-hidden="true" className="mt-[2px] size-[22px] shrink-0" />
        <div className="flex min-w-0 flex-col gap-[4px]">
          <span
            className={classNames(
              'font-sans text-[14px] leading-[17px] font-semibold',
              style.title
            )}
          >
            {title}
          </span>
          <span className="font-sans text-[13px] leading-[16px] text-[#595959]">{message}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-[24px] max-sm:gap-[12px]">
        {actionLabel ? (
          <button
            type="button"
            onClick={() => {
              onAction?.();
              onClose?.();
            }}
            className={classNames(
              'cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
              style.action
            )}
          >
            {actionLabel}
          </button>
        ) : null}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          className="flex size-[20px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <img src={closeIcon} alt="" aria-hidden="true" className="size-[20px]" />
        </button>
      </div>
    </StatusToast>
  );
};

export default BannerToast;
