import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { ManageShieldIcon } from './SettingsIcons.jsx';

const log = debug('RecruiterSettingsParts');

/*
 * Building blocks of the recruiter Settings cards (Figma "Card · Sign-in" 10161:81743 and its siblings): a white r16 card (#e5e8e3 hairline, two soft shadows, p24, gap 16) with a Bricolage 22/600 title
 * (optionally a 12/400 #575755 description under it, gap 2) and "Setting" rows - a text block (14/500 #111 title over a 12/400 #575755 line) with a control at the end, gap 12.
 * Used by the Security and Language-and-data tabs (this folder). The talent `talentSettings/SettingsBUi` pieces draw the talent look (r20, 15px titles), so these are the recruiter variants.
 * Consolidation candidate: every recruiter Settings tab draws the same card and row; one shared `SettingsCard` / `SettingLine` would serve them all.
 */

export const SettingsCard = ({ title, description, children, className, ...rest }) => (
  <section
    aria-label={title}
    className={classNames(
      'flex w-full flex-col gap-[16px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[24px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)] max-sm:p-[16px]',
      className
    )}
    {...rest}
  >
    <div className="flex flex-col gap-[2px]">
      <h2 className="m-0 font-heading text-[22px] leading-[26px] font-semibold tracking-[-0.44px] text-[#111]">
        {title}
      </h2>
      {description ? (
        <p className="m-0 text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
          {description}
        </p>
      ) : null}
    </div>
    {children}
  </section>
);

// One setting: title + description on the left, `control` at the end. Below sm the control drops under the text (320px has no room for both).
export const SettingLine = ({ title, description, control, titleId, className }) => (
  <div
    className={classNames(
      'flex w-full items-center gap-[12px] max-sm:flex-wrap max-sm:items-start',
      className
    )}
  >
    <div className="flex min-w-0 flex-[1_1_200px] flex-col gap-[2px]">
      <p
        id={titleId}
        className="m-0 text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]"
      >
        {title}
      </p>
      {description ? (
        <p className="m-0 text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
          {description}
        </p>
      ) : null}
    </div>
    {control ? <div className="flex shrink-0 items-center">{control}</div> : null}
  </div>
);

// Figma "Toggle · On" 40x22 (#387440, r11, 18px white knob with a 0 1 2 shadow).
export const SettingsSwitch = ({ checked, onChange, labelledBy, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-labelledby={labelledBy}
    aria-label={labelledBy ? undefined : label}
    onClick={() => {
      log('switch', { label: label ?? labelledBy, next: !checked });
      onChange(!checked);
    }}
    className={classNames(
      'relative h-[22px] w-[40px] shrink-0 cursor-pointer rounded-full border-0 p-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      'max-lg:after:absolute max-lg:after:-inset-[1px] max-lg:min-h-[24px]',
      checked ? 'bg-[#387440]' : 'bg-[#d6dbd5]'
    )}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'absolute top-[2px] size-[18px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] motion-safe:transition-[left] motion-safe:duration-150',
        checked ? 'left-[20px]' : 'left-[2px]'
      )}
    />
  </button>
);

// Figma "Chip · This device" (#ebf1ec, 12/500 #2a5730, r100, 3 x 8) and "Chip · Coming soon" (#fefefe, #575755, with a leading glyph).
const CHIP_TONES = {
  device: 'bg-[#ebf1ec] text-[#2a5730]',
  soon: 'bg-[#fefefe] text-[#575755]',
};
export const SettingsChip = ({ tone = 'device', icon, children }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center gap-[4px] rounded-full px-[8px] py-[3px] text-[12px] leading-[20px] font-medium tracking-[0.2px] whitespace-nowrap',
      CHIP_TONES[tone]
    )}
  >
    {icon}
    {children}
  </span>
);

// "Log out" link on a device row (14/500 #c0392b) and the green "Manage" link (14/500 #387440). Targets are at least 24px below lg.
export const SettingsTextLink = ({ tone = 'danger', onClick, children, className, ...rest }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'inline-flex min-h-[24px] min-w-[24px] shrink-0 cursor-pointer items-center border-0 bg-transparent p-0 text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      tone === 'danger' ? 'text-[#c0392b]' : 'text-[#387440]',
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

// Figma "Link · Manage" 10161:81755: the "On" chip (#e8f2ed pill, 12/500 #165d3a, a 12px shield-check glyph, 3 x 8, gap 4) then the green "Manage" link, 12 apart.
export const TwoStepStatus = ({ chip, onManage, manage }) => (
  <span className="flex items-center gap-[12px]">
    <span className="inline-flex items-center gap-[4px] rounded-full bg-[#e8f2ed] px-[8px] py-[3px] text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#165d3a]">
      <ManageShieldIcon className="size-[12px]" />
      {chip}
    </span>
    <SettingsTextLink tone="green" onClick={onManage} aria-haspopup="dialog">
      {manage}
    </SettingsTextLink>
  </span>
);

// Figma "Component 31" draws the toast text block 276px wide (SR-18's longer line wraps at it): pass it as the `message` of `PipelineToast` / `BannerToast`.
export const ToastText = ({ children }) => (
  <span className="block max-w-[276px] min-w-[min(276px,calc(100vw-150px))]">{children}</span>
);
