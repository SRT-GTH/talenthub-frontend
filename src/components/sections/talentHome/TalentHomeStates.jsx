import { classNames } from '../../../utils/classNames.js';
import { SpinnerArcIcon } from '../../shared/assets.jsx';
import { CARD_SOFT, CARD_INK } from './coreUi.jsx';

/*
 * Reusable loading / empty / error pieces for talent-home cards (Figma HM-04).
 * Skeleton colours are Figma-exact (#eceee8, #f6f7f4, #eceee8). The shimmer is motion-safe only.
 * Figma draws NO empty/error variants and no copy for them, so CardEmpty / CardError take every
 * string from props (nothing invented here).
 */

// Keyframes for the skeleton shimmer; render once next to any skeleton.
export const ShimmerStyle = () => (
  <style>
    {'@keyframes th-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}'}
  </style>
);

// One skeleton block. `className` carries width/height/radius.
export const Skel = ({ className }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'block max-w-full shrink-0 bg-gradient-to-r from-[#eceee8] via-[#f6f7f4] to-[#eceee8] bg-[length:200%_100%] motion-safe:animate-[th-shimmer_1.4s_linear_infinite]',
      className
    )}
  />
);

// White card surface used by every skeleton card (Figma: border #e7e7e7, soft drop).
export const SkelCard = ({ className, children }) => (
  <div
    aria-hidden="true"
    className={classNames('flex flex-col rounded-[24px] bg-white', CARD_SOFT, className)}
  >
    {children}
  </div>
);

// Generic card skeleton: title bar + one body block (right-card pattern, Figma 8097:10829).
export const CardSkeleton = ({ titleW = 'w-[160px]', bodyH = 'h-[180px]', className }) => (
  <SkelCard className={classNames('gap-[12px] p-[clamp(16px,1.6vw,22px)]', className)}>
    <Skel className={classNames('h-[18px] rounded-[8px]', titleW)} />
    <Skel className={classNames('w-full rounded-[14px]', bodyH)} />
  </SkelCard>
);

// Empty / error card shells (copy and actions come from the caller).
const StateCard = ({ role, title, body, children, className }) => (
  <div
    role={role}
    className={classNames(
      'flex flex-col items-start gap-[12px] rounded-[24px] bg-white p-[clamp(16px,1.6vw,22px)] text-[#1c2a21]',
      CARD_SOFT,
      className
    )}
  >
    {title ? <p className="text-[16px] leading-[normal] font-semibold">{title}</p> : null}
    {body ? <p className="text-[14px] leading-[20px] text-[#595959]">{body}</p> : null}
    {children}
  </div>
);
export const CardEmpty = (props) => <StateCard role="status" {...props} />;
export const CardError = (props) => <StateCard role="alert" {...props} />;

// "Getting your matches ready…" pill (Figma 8097:10838 / 7733:888).
export const LoadingNote = ({ children = 'Getting your matches ready…' }) => (
  <div
    role="status"
    aria-live="polite"
    className={classNames(
      'mx-auto flex w-fit max-w-full items-center gap-[8px] rounded-[100px] bg-white px-[14px] py-[10px] text-[13px] leading-[normal] font-semibold text-[#1c2a21]',
      CARD_INK
    )}
  >
    <SpinnerArcIcon className="shrink-0 motion-safe:animate-spin" />
    <span>{children}</span>
  </div>
);

// Sidebar skeleton (Figma 8097:10791). The lead can drop it into the shell while loading.
export const SidebarSkeleton = () => (
  <div aria-hidden="true" className="flex w-full max-w-[280px] flex-col gap-[12px]">
    <SkelCard className="items-center gap-[12px] px-[20px] pt-[22px] pb-[20px]">
      <Skel className="size-[72px] rounded-[36px]" />
      <Skel className="h-[14px] w-[140px] rounded-[8px]" />
      <Skel className="h-[10px] w-[180px] rounded-[8px]" />
      <Skel className="h-[64px] w-full rounded-[14px]" />
    </SkelCard>
    <Skel className="h-[44px] w-full rounded-[12px]" />
    {Array.from({ length: 7 }, (_, i) => (
      <Skel key={i} className="h-[20px] w-[220px] rounded-[6px]" />
    ))}
  </div>
);
