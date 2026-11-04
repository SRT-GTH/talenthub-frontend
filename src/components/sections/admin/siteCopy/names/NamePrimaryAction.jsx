import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';

/*
 * NamePrimaryAction — the green "shelf" action of the Super Admin / sync screens (Figma "Btn · Review" 90 x 44: #387440, 2px #2a5730 border, r14, 0 4px 0
 * shelf, 16/700 label, 10/18 padding; "Btn · Use the new original" 185 x 44 is the same). A <Link> when `to` is set, else a <button>.
 * Props: to, onClick, children, className, ...rest (aria-label etc.).
 */
const BASE =
  'inline-flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] py-[10px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-white no-underline shadow-[0_4px_0_#2a5730] transition-[transform,box-shadow] duration-100 hover:shadow-[0_5px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] active:shadow-[0_1px_0_#2a5730] disabled:cursor-not-allowed disabled:opacity-50';

const NamePrimaryAction = ({ to, className, children, ...rest }) =>
  to ? (
    <Link to={to} className={classNames(BASE, className)} {...rest}>
      {children}
    </Link>
  ) : (
    <button type="button" className={classNames(BASE, className)} {...rest}>
      {children}
    </button>
  );

export default NamePrimaryAction;
