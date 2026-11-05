import { classNames } from '../../utils/classNames.js';

/*
 * WidgetCard — the dashboard widget shell (Figma "Widget · …" frames in 10049:58645, e.g. 10049:58724 "Active job postings").
 * White card, 1px #e5e8e3 border, 24px padding, 16px gap; two soft shadows. A header row holds a 30px mint tile with the glyph, the 16/600 title
 * (+ an optional chip), a 12px subtitle and, on the right, `controls` (selects, links, a "Read-only" pill).
 *
 * Props: icon (an <img> src for the tile), title, titleChip (node), subtitle, controls (node), radius (24 | 16, Figma uses 24 on the first two rows and 16 below),
 * gap (16 | 14), id (anchors aria-labelledby), className, bodyClassName, children.
 */
const WidgetCard = ({
  icon,
  title,
  titleChip,
  subtitle,
  controls,
  radius = 24,
  gap = 16,
  id,
  className,
  bodyClassName,
  children,
}) => {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={classNames(
        'flex min-w-0 flex-col border border-solid border-[#e5e8e3] bg-white p-[24px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)] max-sm:p-[16px]',
        radius === 24 ? 'rounded-[24px]' : 'rounded-[16px]',
        gap === 14 ? 'gap-[14px]' : 'gap-[16px]',
        className
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-x-[12px] gap-y-[10px]">
        <div className="flex min-w-0 flex-col gap-[2px]">
          <div className="flex items-center gap-[8px]">
            <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[8px] bg-[#ebf1ec]">
              {icon ? <img src={icon} alt="" aria-hidden="true" className="size-[16px]" /> : null}
            </span>
            <h2
              id={headingId}
              className="m-0 font-sans text-[16px] leading-[28px] font-semibold tracking-[0.1px] text-[#111]"
            >
              {title}
            </h2>
            {titleChip}
          </div>
          {subtitle ? (
            <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {controls ? <div className="flex flex-wrap items-center gap-[8px]">{controls}</div> : null}
      </header>
      <div className={classNames('min-w-0', bodyClassName)}>{children}</div>
    </section>
  );
};

export default WidgetCard;
