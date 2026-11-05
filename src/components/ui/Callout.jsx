import { classNames } from '../../utils/classNames.js';

/*
 * Callout — the full-width context banner (Figma "GTH · Callout" 8232:9405, drawn as "Context banner" 10064:37726 on the pending-affiliation dashboard).
 * A tinted card (16px radius, 1px tinted border) with a 40px white icon tile, a 14/600 title, a body line and an optional trailing action.
 * tone: 'warning' (#faf4e8 face, #c8951a border at 35%) | 'danger' (#f9ebea, #c0392b) | 'success' (#e8f2ed, #387440).
 * Props: tone, icon (an <img> src), title, action (node, right side), className, children (the body text).
 */
const TONES = {
  warning: 'bg-[#faf4e8] border-[#c8951a]/35',
  danger: 'bg-[#f9ebea] border-[#c0392b]/35',
  success: 'bg-[#e8f2ed] border-[#387440]/35',
};

const Callout = ({ tone = 'warning', icon, title, action, className, children }) => (
  <div
    role="status"
    className={classNames(
      'flex flex-wrap items-center justify-between gap-x-[21px] gap-y-[12px] rounded-[16px] border border-solid px-[20px] py-[16px]',
      TONES[tone] ?? TONES.warning,
      className
    )}
  >
    <div className="flex min-w-0 flex-1 basis-[320px] items-start gap-[21px] max-sm:gap-[12px]">
      {icon ? (
        <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] bg-white">
          <img src={icon} alt="" aria-hidden="true" className="size-[20px]" />
        </span>
      ) : null}
      <div className="flex min-w-0 flex-col gap-[2px]">
        <p className="m-0 font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
          {title}
        </p>
        <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
          {children}
        </p>
      </div>
    </div>
    {action}
  </div>
);

export default Callout;
