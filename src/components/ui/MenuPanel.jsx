import { classNames } from '../../utils/classNames.js';

/*
 * MenuPanel — the white popover card used by every talent-search dropdown (Figma "Dropdown · …" frames 10102:36674 search suggestions, 10102:37457 skills,
 * 10102:38243 experience, 10102:39005 location, 10102:39790 sort): 16px radius, 6px padding, 2px gap, 1px #e5e8e3 border and the two-layer soft shadow.
 * It only draws the card and its rows; positioning, open state and dismissal belong to the caller.
 *
 *   MenuPanel       props: className, children, ...rest (role, aria-label, id, style).
 *   MenuGroupLabel  the 12/600 #575755 heading row ("SKILLS", "MUST HAVE"). Props: children, className.
 *   MenuRow         one 14px option row, r10, p10. Props: icon (node, 18px slot), label, description (12px second line), selected (mint wash, 500 weight + green check),
 *                   checked (the green check WITHOUT the wash: the Include remote talent / Within 50 km toggles of the location menu),
 *                   muted (the label is the lighter #babab7, used by "Recent" rows and "Clear skills"), as ('button' | 'div'), onClick, role, className, children (replaces the text block).
 *   MenuDivider     the 1px #e5e8e3 rule between groups.
 */
export const MenuPanel = ({ className, children, ...rest }) => (
  <div
    className={classNames(
      'flex flex-col gap-[2px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[6px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_-6px_rgba(15,15,10,0.1)]',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const MenuGroupLabel = ({ children, className }) => (
  <div
    className={classNames(
      'px-[10px] pt-[8px] pb-[4px] font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#575755]',
      className
    )}
  >
    {children}
  </div>
);

export const MenuDivider = ({ className }) => (
  <div role="separator" className={classNames('h-px w-full shrink-0 bg-[#e5e8e3]', className)} />
);

const CheckGlyph = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-[16px] shrink-0">
    <path
      d="M13.3337 4L6.00033 11.3333L2.66699 8"
      stroke="#387440"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MenuRow = ({
  icon,
  label,
  description,
  selected = false,
  checked = false,
  muted = false,
  as: Component = 'button',
  onClick,
  className,
  children,
  ...rest
}) => (
  <Component
    {...(Component === 'button' ? { type: 'button' } : {})}
    onClick={onClick}
    className={classNames(
      'flex min-h-[24px] w-full items-center gap-[10px] rounded-[10px] px-[10px] text-left font-sans focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-green',
      description ? 'py-[8px]' : 'py-[9px]',
      onClick ? 'cursor-pointer' : '',
      selected ? 'bg-[#ebf1ec]/50' : onClick ? 'hover:bg-[#f8f8f4]' : '',
      className
    )}
    {...rest}
  >
    {icon ? <span className="inline-flex size-[18px] shrink-0 text-[#575755]">{icon}</span> : null}
    {children ?? (
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span
          className={classNames(
            'text-[14px] leading-[24px] tracking-[0.2px]',
            selected ? 'font-medium' : 'font-normal',
            muted ? 'text-[#babab7]' : 'text-[#111]'
          )}
        >
          {label}
        </span>
        {description ? (
          <span className="text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {description}
          </span>
        ) : null}
      </span>
    )}
    {selected || checked ? <CheckGlyph /> : null}
  </Component>
);
