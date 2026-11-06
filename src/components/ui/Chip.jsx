import { classNames } from '../../utils/classNames.js';

/*
 * Chip — the small rounded label of the recruiter dashboard (Figma "GTH · Chip" 8158:2202 and the "Chip · …" instances in 10049:58645).
 *
 *   variant="status" (default) — 26px high pill, 12/500: counts ("+5"), states ("Active", "Verified"), fit scores ("92% fit"), deltas ("+32%").
 *   variant="action"           — 32px high white pill with a line border, 13/600: the quick actions under the greeting ("Search talents").
 *
 * tone (status only): mint #ebf1ec · success #e8f2ed · danger #f9ebea · amber #faf4e8 · neutral #fefefe · outline-success / outline-amber / outline-danger (transparent, 1px border).
 * Props: variant, tone, icon (an <img> src, 12px for status and 14px for action), as ('span' | 'button' | 'a'), className, children, ...rest.
 */
const STATUS_TONES = {
  mint: 'bg-[#ebf1ec] text-[#2a5730]',
  success: 'bg-[#e8f2ed] text-[#165d3a]',
  danger: 'bg-[#f9ebea] text-[#902b20]',
  amber: 'bg-[#faf4e8] text-[#463409]',
  neutral: 'bg-[#fefefe] text-[#575755]',
  'outline-success': 'border border-solid border-[#2a5730] bg-transparent text-[#2a5730]',
  'outline-danger': 'border border-solid border-[#902b20] bg-transparent text-[#902b20]',
  'outline-amber': 'border border-solid border-[#967014] bg-transparent text-[#967014]',
};

const Chip = ({
  variant = 'status',
  tone = 'mint',
  icon,
  as: Component = 'span',
  className,
  children,
  ...rest
}) => {
  const isAction = variant === 'action';
  return (
    <Component
      className={classNames(
        'inline-flex shrink-0 items-center rounded-full font-sans whitespace-nowrap',
        isAction
          ? 'h-[32px] gap-[6px] border border-solid border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[16px] font-semibold text-[#595959]'
          : 'min-h-[26px] gap-[4px] px-[8px] py-[3px] text-[12px] leading-[20px] font-medium tracking-[0.2px]',
        !isAction && (STATUS_TONES[tone] ?? STATUS_TONES.mint),
        Component !== 'span' &&
          'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
        className
      )}
      {...rest}
    >
      {icon ? (
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className={isAction ? 'size-[14px] shrink-0' : 'size-[12px] shrink-0'}
        />
      ) : null}
      {children}
    </Component>
  );
};

export default Chip;
