import { classNames } from '../../../../utils/classNames.js';

/*
 * CardHeader — Figma "T8 · Card header" (component 8482:61; instances e.g. 8487:346040 "Regional distribution", mobile heads 8507:87).
 *   desktop >= md : px24 pt20 pb16, title 18/21 600 #1c2a21, hint 12/14 500 #595959 pushed right, items centred
 *   mobile  < md  : px16 pt16 pb12 (the mobile card draws the head inside the 16px card padding), title 16/19, hint 12/14
 * Props
 *   title      string        card title, e.g. "Regional distribution"
 *   hint       string        right-hand aside, e.g. "16 regions · hover or tap a region" (Figma "aside")
 *   hintCompact string       optional shorter aside shown below md instead of `hint` (mobile map card: "Tap a region")
 *   level      'h2' | 'h3'   heading element (default h2; the page title is the h1)
 *   id         string        id of the heading (so a card can be aria-labelledby)
 *   children   node          optional extra controls placed after the hint (e.g. a "View all" link)
 *   className
 */

const CardHeader = ({ title, hint, hintCompact, level = 'h2', id, children, className }) => {
  const Heading = level;
  return (
    <div
      className={classNames(
        'flex items-center justify-between gap-[12px] px-[16px] pt-[16px] pb-[12px] md:px-[24px] md:pt-[20px] md:pb-[16px]',
        className
      )}
    >
      <Heading
        id={id}
        className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21] md:text-[18px] md:leading-[21px]"
      >
        {title}
      </Heading>
      {(hint || hintCompact || children) && (
        <div className="flex min-w-0 items-center gap-[12px]">
          {hint && (
            <span
              className={classNames(
                'text-right font-sans text-[12px] leading-[14px] font-medium text-[#595959]',
                hintCompact && 'hidden md:inline'
              )}
            >
              {hint}
            </span>
          )}
          {hintCompact && (
            <span className="font-sans text-[12px] leading-[14px] font-medium text-[#595959] md:hidden">
              {hintCompact}
            </span>
          )}
          {children}
        </div>
      )}
    </div>
  );
};

export default CardHeader;
