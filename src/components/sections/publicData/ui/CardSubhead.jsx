import { classNames } from '../../../../utils/classNames.js';

/*
 * CardSubhead — the small caps label row inside a card body ("Education level … 219,428 total", "Age distribution … Median age 21",
 * "Strongest capability … Self-reported + assessed", "Gender … Self-identified"; Figma 8487:346194 / 8487:346211 / 8487:346237 / 8487:346265).
 * label 12/14 600 caps +0.72 #595959; aside 12/14 500 #595959 pushed right.
 * Props: label, aside, as ('p' | 'h3', default 'h3'), className.
 */

const CardSubhead = ({ label, aside, as = 'h3', className }) => {
  const Tag = as;
  return (
    <div className={classNames('flex items-center justify-between gap-[8px] font-sans', className)}>
      <Tag className="m-0 text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase">
        {label}
      </Tag>
      {aside && (
        <span className="text-right text-[12px] leading-[14px] font-medium text-[#595959]">
          {aside}
        </span>
      )}
    </div>
  );
};

export default CardSubhead;
