import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';

/*
 * LinkButton — an anchor drawn like the Figma "Button" (Share / Download PDF family): the shared Button is a <button>, but the directory
 * actions are navigation (Visit website ↗, Partner enquiries, Apply on GTH, Ask the data team), so they must be real links.
 *   outline : white, 2px #1c2a21/30, r14, p 12/22, shelf 0 4 0 rgba(17,17,17,.25), 16/24 700 #1c2a21   (Figma "Button · Visit website")
 *   primary : #387440, 2px #2a5730, r10, p 12/18, shelf 0 4 0 #224626, label gradient peach -> mint     (Figma "Button · Apply on GTH")
 * Props: to (router path) | href (external, opens in a new tab with rel noopener), variant, className, children.
 */

const BASE =
  'inline-flex min-h-[48px] items-center justify-center gap-[8px] border-2 border-solid font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap no-underline transition-transform duration-100 hover:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#387440] active:translate-y-[3px]';

const VARIANTS = {
  outline:
    'rounded-[14px] border-[#1c2a21]/30 bg-white px-[22px] py-[12px] text-[#1c2a21] drop-shadow-[0_4px_0_rgba(17,17,17,0.25)]',
  primary:
    'rounded-[10px] border-[#2a5730] bg-[#387440] px-[18px] py-[12px] drop-shadow-[0_4px_0_#224626]',
};

const GRADIENT = {
  backgroundImage: 'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
};

const LinkButton = ({ to, href, variant = 'outline', className, children, ...rest }) => {
  const label =
    variant === 'primary' ? (
      <span className="bg-clip-text text-transparent" style={GRADIENT}>
        {children}
      </span>
    ) : (
      children
    );
  const cls = classNames(BASE, VARIANTS[variant], className);
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {label}
      </a>
    );
  }
  return (
    <Link to={to} className={cls} {...rest}>
      {label}
    </Link>
  );
};

export default LinkButton;
