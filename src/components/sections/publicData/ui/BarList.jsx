import { classNames } from '../../../../utils/classNames.js';

/*
 * BarList — the <ul> that wraps BarRow items (Figma "interest bars" frame 8487:346130: V, gap 10, px24 pb24; mobile rows 12px apart).
 * Props: label (aria-label of the list, e.g. "Top 10 career interest clusters by talents"), gap (px, default 10), children, className.
 * The list is the text equivalent of the chart: each row prints label and value.
 */

const BarList = ({ label, gap = 10, children, className }) => (
  <ul
    aria-label={label}
    className={classNames('m-0 flex list-none flex-col p-0', className)}
    style={{ gap: `${gap}px` }}
  >
    {children}
  </ul>
);

export default BarList;
