import { classNames } from '../../../utils/classNames.js';

/*
 * NotifButton — the compact action pill used across the Notifications screens. Same chrome as the
 * shared <Button> (Figma 50:6295: 1px top / 2px sides + bottom border, 4px hard shelf, r10 primary /
 * r14 secondary, peach→mint gradient label on the green face) but at the notification sizes, which
 * <Button>'s smallest size (16px label, 39px tall) cannot express:
 *   xs    pop-up rows      12.5px label, h31 (8132:382834 / :382840)
 *   sm    full-screen rows 13px label,   h34 (8132:2266 / :2274)
 *   md    inbox zero       14px label,   h42 (8132:2334 / :2340), px22
 *   help  Help pop-over    14px label,   h40 (8376:10399 actions), px16, optional icon
 * Props: tone ('primary' | 'secondary'), size, icon (img src), onClick, className, children.
 */
const SIZES = {
  xs: 'h-[31px] px-[14px] text-[12.5px]',
  sm: 'h-[34px] px-[14px] text-[13px]',
  md: 'h-[42px] px-[22px] text-[14px]',
  help: 'h-[40px] px-[16px] text-[14px] gap-[8px]',
};

const PRIMARY_GRADIENT = {
  backgroundImage: 'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

const NotifButton = ({ tone = 'secondary', size = 'xs', icon, onClick, className, children }) => {
  const primary = tone === 'primary';
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap border-b-2 border-l-2 border-r-2 border-t border-solid font-sans font-bold leading-[24px] tracking-[0.1px] transition-transform active:translate-y-[2px]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
        primary
          ? 'rounded-[10px] border-[#2a5730] bg-[#387440] shadow-[0_4px_0_#224626]'
          : 'rounded-[14px] border-[rgba(28,42,33,0.3)] bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]',
        SIZES[size],
        className
      )}
    >
      {icon && <img src={icon} alt="" aria-hidden="true" className="size-[20px]" />}
      {primary ? <span style={PRIMARY_GRADIENT}>{children}</span> : children}
    </button>
  );
};

export default NotifButton;
