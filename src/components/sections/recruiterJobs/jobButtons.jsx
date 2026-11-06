import { classNames } from '../../../utils/classNames.js';

/*
 * The recruiter job flows' action buttons (Figma "Publish job" / "Preview" / "Cancel" in JT-03, CT-03, JM-04…): 44px, 14px radius, 2px border and a 4px shelf.
 * `JobButton` tone: 'primary' (Brand Green #387440 face, #2a5730 border + shelf), 'ghost' (white, #1c2a21 @ 30 % border, 25 % shelf), 'danger' (#c0392b, #73221a), 'link' (text only, #387440).
 * Same look as the close-posting dialog buttons on the Job Postings page; kept here so the whole flow shares one definition.
 */
const TONES = {
  primary:
    'border-2 border-solid border-[#2a5730] bg-[#387440] text-white shadow-[0_4px_0_#2a5730] disabled:border-[#cfd3cf] disabled:bg-[#cfd3cf] disabled:text-white disabled:shadow-none',
  ghost:
    'border-2 border-solid border-[#1c2a21]/30 bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]',
  danger: 'border-2 border-solid border-[#73221a] bg-[#c0392b] text-white shadow-[0_4px_0_#73221a]',
  link: 'border-0 bg-transparent text-[#387440] font-medium !text-[14px] !h-auto !px-0 !py-0 !shadow-none',
};

export const JobButton = ({ tone = 'primary', className, children, type = 'button', ...rest }) => (
  <button
    type={type}
    className={classNames(
      'inline-flex h-[44px] cursor-pointer items-center justify-center gap-[8px] rounded-[14px] px-[18px] font-sans text-[16px] leading-[24px] font-bold transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-sm:shadow-none',
      TONES[tone],
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export default JobButton;
