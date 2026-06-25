import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('PreviewField');

/*
 * PreviewField — read-only summary field used across onboarding review /
 * confirmation screens. Pale grey box, uppercase micro-label, value below.
 *
 * Figma pattern: parent review (2973:80567 …), parent link-ward (2943:52553 …),
 * institution activate review card. Extracted here so every review screen shares
 * one primitive instead of re-defining the box per section.
 *
 * Props:
 *   label       {string}     uppercase micro-label
 *   value       {ReactNode}  the value (string, masked dots, badge stack, …)
 *   valueColor  {string}     value colour when not muted (default #595959)
 *   muted       {bool}       regular weight + grey #70706e (for "—" / secondary)
 *   leftIcon    {ReactNode}  optional leading icon box (e.g. 32px amber square)
 *   trailing    {ReactNode}  optional right-aligned element (e.g. Verified badge)
 *   height      {number}     min-height in px (default 48)
 *   className   {string}     width / extra classes (e.g. 'flex-1', 'w-full')
 */
const PreviewField = ({
  label,
  value,
  valueColor = '#595959',
  muted = false,
  leftIcon,
  trailing,
  height = 48,
  className,
}) => {
  log('render', { label, muted });

  return (
    <div
      className={classNames(
        'relative flex items-center rounded-[10px] bg-[#f8f8f4] px-[12px]',
        className
      )}
      style={{ minHeight: height }}
    >
      {leftIcon && <span className="mr-[12px] flex shrink-0 items-center">{leftIcon}</span>}
      <div className="flex min-w-0 flex-1 flex-col gap-[3px] py-[8px]">
        <span
          className="font-sans font-bold uppercase"
          style={{ fontSize: 9, color: '#babab7', letterSpacing: '0.6px', lineHeight: 'normal' }}
        >
          {label}
        </span>
        <div
          className={classNames('font-sans', muted ? 'font-normal' : 'font-semibold')}
          style={{ fontSize: 14, color: muted ? '#70706e' : valueColor, lineHeight: '16.9px' }}
        >
          {value}
        </div>
      </div>
      {trailing && <span className="ml-[12px] flex shrink-0 items-center">{trailing}</span>}
    </div>
  );
};

export default PreviewField;
