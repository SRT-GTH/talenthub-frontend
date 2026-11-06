import { classNames } from '../../../../../utils/classNames.js';
import { EditorInfoIcon, EditorUsersIcon, EditorWarningIcon } from './EditorIcons.jsx';

/*
 * EditorBanner — the full-width notice cards of the section editor (r16, p16, gap 12, 14/500 on 20):
 *   warn   conflict "Ama Owusu changed this section …"   #faf4e8 / #463409, warning #8a6100
 *   info   paste notice "You pasted text from another app …"  #faf4e8 / #463409, info #8a6100
 *   error  "Your last change isn’t saved yet: …"          #f9ebea at 50 % / #c0392b, warning #c0392b
 *   blue   shared section "This section appears on every page …"  #eaeffb / #244a9f, people #387440
 * Props: tone, children (the text), textClassName (width of the text block when buttons sit beside it), actions (buttons; the first one grows on a wide row, they stack below md), className.
 */
const TONES = {
  warn: {
    box: 'bg-[#faf4e8] text-[#463409]',
    icon: EditorWarningIcon,
    iconClass: 'text-[#8a6100]',
  },
  info: { box: 'bg-[#faf4e8] text-[#463409]', icon: EditorInfoIcon, iconClass: 'text-[#8a6100]' },
  error: {
    box: 'bg-[#f9ebea]/50 text-[#c0392b]',
    icon: EditorWarningIcon,
    iconClass: 'text-[#c0392b]',
  },
  blue: { box: 'bg-[#eaeffb] text-[#244a9f]', icon: EditorUsersIcon, iconClass: 'text-[#387440]' },
};

const EditorBanner = ({ tone = 'info', children, actions, className, textClassName }) => {
  const def = TONES[tone] ?? TONES.info;
  const Glyph = def.icon;
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={classNames(
        'flex flex-col gap-[12px] rounded-[16px] p-[16px] sm:flex-row sm:items-center',
        def.box,
        className
      )}
    >
      <div
        className={classNames(
          'flex min-w-0 flex-1 items-center gap-[12px] sm:flex-[0_1_auto]',
          textClassName
        )}
      >
        <Glyph className={classNames('size-[18px] shrink-0', def.iconClass)} />
        <p className="m-0 font-sans text-[14px] leading-[20px] font-medium max-lg:text-[13px]">
          {children}
        </p>
      </div>
      {actions ? (
        <div className="flex min-w-0 flex-wrap items-center gap-[12px] sm:flex-1 sm:flex-nowrap [&>*:first-child]:flex-1">
          {actions}
        </div>
      ) : null}
    </div>
  );
};

export default EditorBanner;
