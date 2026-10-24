import { classNames } from '../../../../../utils/classNames.js';
import { at } from './reportLayout.js';

/*
 * ReportFooter — "GTH Report · Footer" (Figma 8896:108, Theme=Light / Dark): running footer text (9/11) at the left and the page number
 * (Bricolage 12/14 600) near the right edge. Light = #575755 text + #387440 number; Dark = white at 85 % + white number.
 * Props: text, page ("04"), theme ('light' | 'dark'), left (48), textTop (758), pageLeft (1059), pageTop (755),
 *        pageOnDark (light text, white page number: page 8 where the number sits on the dark back panel).
 */

const ReportFooter = ({
  text,
  page,
  theme = 'light',
  left = 48,
  pageLeft = 1059,
  textTop = 758,
  pageTop = 755,
  pageOnDark = false,
}) => {
  const dark = theme === 'dark';
  return (
    <>
      <p
        className={classNames(
          'm-0 font-sans text-[9px] leading-[11px] whitespace-nowrap',
          dark ? 'text-white/85' : 'text-[#575755]'
        )}
        style={at(left, textTop)}
      >
        {text}
      </p>
      <p
        className={classNames(
          'm-0 font-heading text-[12px] leading-[14px] font-semibold',
          dark || pageOnDark ? 'text-white' : 'text-[#387440]'
        )}
        style={at(pageLeft, pageTop)}
      >
        {page}
      </p>
    </>
  );
};

export default ReportFooter;
