import { classNames } from '../../../../utils/classNames.js';

/*
 * SettingsBanner - the full-width context banner of the recruiter Settings tabs (Figma "Banner · …": 10161:83680 hiring paused, 10161:84301 notifications paused, 10161:84675 Focused mode).
 * 10px radius, 16px padding, gap 12, a 20px icon, a 14/24 600 title, a 12/20 #575755 body and an optional plain green action link on the right.
 * tone 'amber' (#faf4e8, ink #463409 icon) | 'blue' (#eaeffb, #244a9f icon). `compactTitle` draws the title at 17px line height (SR-12's Focused-mode banner is 71px high, SR-22's 78px).
 * Props: tone, icon (a component), title, body, actionLabel, onAction, compactTitle, className.
 */
const TONES = {
  amber: { face: 'bg-[#faf4e8]', icon: 'text-[#463409]' },
  blue: { face: 'bg-[#eaeffb]', icon: 'text-[#244a9f]' },
};

const SettingsBanner = ({
  tone = 'amber',
  icon,
  title,
  body,
  actionLabel,
  onAction,
  compactTitle = false,
  className,
  ...rest
}) => {
  const Glyph = icon;
  const style = TONES[tone] ?? TONES.amber;
  return (
    <div
      role="status"
      className={classNames(
        'flex w-full items-start gap-[12px] rounded-[10px] p-[16px]',
        style.face,
        className
      )}
      {...rest}
    >
      <Glyph className={classNames('mt-[2px] size-[20px] shrink-0', style.icon)} />
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <p
          className={classNames(
            'm-0 text-[14px] font-semibold tracking-[0.1px] text-[#111]',
            compactTitle ? 'leading-[17px]' : 'leading-[24px]'
          )}
        >
          {title}
        </p>
        <p className="m-0 text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">{body}</p>
      </div>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="min-h-[24px] shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default SettingsBanner;
