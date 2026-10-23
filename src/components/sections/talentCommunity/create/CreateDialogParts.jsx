import { classNames } from '../../../../utils/classNames.js';
import { CloseButton, DialogTitle } from '../CommunityDialogParts.jsx';
import {
  CALLOUT_BASE,
  CALLOUT_TONES,
  FOCUS_RING,
  OUTLINE_CHIP,
  OUTLINE_CHIP_OFF,
  OUTLINE_CHIP_ON,
  PILL_BASE,
  SECTION_LABEL,
  TILE_BASE,
  TILE_TONES,
} from './createCommunityStyles.js';
import {
  CcBannerHelpIcon,
  CcBannerInfoIcon,
  CcBannerShieldIcon,
  CcCheckIcon,
  CcInfoCircleIcon,
} from './CreateCommunityIcons.jsx';

/*
 * Small pieces shared by the wizard and the owner dialogs (Figma CC-02 … CC-17).
 *   DialogHead    title (27/32, Bricolage in Playful) + the 40px close button          props: id, onClose, children
 *   Section       a 14/17 600 label + its content, gap 8                                props: title, className, children
 *   IconRow       Figma `row · …`: 40px icon tile + title + 12.5/18 body + trailing    props: icon, title, body, tone, trailing, className
 *   Callout       Figma `Callout · …`: r12 box, 18px icon, 14/17 title, 13/16 body      props: tone, icon, title, children
 *   FooterBar     note (left, 12/14 500 #737373 + 14px icon) and the buttons (right)   props: note, noteIcon, children
 *   FilterChip    32px pill chip, ink fill when `on`                                    props: on, onClick, children, role, className
 *   CheckRow      GTHCheckbox (20px, r6, green when checked) + 13/19 label               props: checked, onChange, children, id
 *   Pill          12/14 600 pill                                                        props: tone ('white' | 'green' | 'gold'), children
 *   PersonRow     36px avatar + name 14/17 600 + detail 12/14 + trailing                props: avatar, name, detail, trailing
 */
export const DialogHead = ({ id, onClose, children }) => (
  <div className="flex items-start gap-[10px]">
    <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
      <DialogTitle id={id}>{children}</DialogTitle>
    </div>
    <CloseButton onClose={onClose} />
  </div>
);

export const Section = ({ title, className, children }) => (
  <div className={classNames('flex flex-col gap-[8px]', className)}>
    {title ? <h3 className={SECTION_LABEL}>{title}</h3> : null}
    {children}
  </div>
);

export const IconRow = ({ icon, title, body, tone = 'green', trailing, className, muted }) => {
  const Glyph = icon;
  return (
    <div
      className={classNames(
        'flex items-center gap-[12px] py-[10px]',
        muted && 'opacity-50',
        className
      )}
    >
      <span className={classNames(TILE_BASE, TILE_TONES[tone])}>
        <Glyph className="size-[20px] text-[#387440]" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
          {title}
        </span>
        {body ? (
          <span className="font-sans text-[12.5px] font-normal leading-[18px] text-[#737373]">
            {body}
          </span>
        ) : null}
      </div>
      {trailing}
    </div>
  );
};

const CALLOUT_ICONS = {
  help: CcBannerHelpIcon,
  info: CcBannerInfoIcon,
  shield: CcBannerShieldIcon,
  circle: CcInfoCircleIcon,
};

export const Callout = ({
  tone = 'neutral',
  icon = 'circle',
  title,
  children,
  className,
  role,
}) => {
  const Glyph = CALLOUT_ICONS[icon];
  const styles = CALLOUT_TONES[tone];
  return (
    <div role={role} className={classNames(CALLOUT_BASE, styles.box, className)}>
      <Glyph
        className={classNames(
          'mt-px size-[18px] shrink-0',
          icon === 'circle' ? 'text-[#387440]' : styles.icon
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span
          className={classNames(
            'font-sans text-[14px] font-semibold leading-[17px] max-lg:leading-[18px]',
            styles.title
          )}
        >
          {title}
        </span>
        <span className="font-sans text-[13px] font-normal leading-[16px] text-[#1c2a21] max-lg:text-[12px] max-lg:leading-[16px]">
          {children}
        </span>
      </div>
    </div>
  );
};

export const FooterBar = ({ note, noteIcon: Glyph, children }) => (
  <div className="flex flex-wrap items-center gap-[10px]">
    <div className="flex min-w-[160px] flex-1 items-center gap-[6px] font-sans text-[12px] font-medium leading-[14px] text-[#737373]">
      {Glyph ? <Glyph className="size-[14px] shrink-0 text-[#387440]" /> : null}
      {note}
    </div>
    <div className="flex flex-wrap items-center justify-end gap-[10px]">{children}</div>
  </div>
);

export const FilterChip = ({ on, onClick, children, role, className, ...rest }) => (
  <button
    type="button"
    role={role}
    aria-pressed={role ? undefined : Boolean(on)}
    aria-checked={role === 'radio' ? Boolean(on) : undefined}
    onClick={onClick}
    className={classNames(
      OUTLINE_CHIP,
      FOCUS_RING,
      on ? OUTLINE_CHIP_ON : OUTLINE_CHIP_OFF,
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export const CheckRow = ({ checked, onChange, children, id }) => (
  <label htmlFor={id} className="flex min-h-[24px] cursor-pointer items-start gap-[10px]">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="peer sr-only"
    />
    <span
      aria-hidden="true"
      className={classNames(
        'mt-px flex size-[20px] shrink-0 items-center justify-center rounded-[6px] border-[1.5px] border-solid peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#387440]',
        checked
          ? 'border-[#19341d] bg-[#387440] shadow-[0_1.2px_0_#19341d]'
          : 'border-[#ccc] bg-white shadow-[0_2px_0_rgba(191,191,191,0.8)]'
      )}
    >
      {checked ? <CcCheckIcon className="size-[16px]" /> : null}
    </span>
    <span className="font-sans text-[13px] font-normal leading-[19px] text-[#1c2a21] max-lg:text-[14px]">
      {children}
    </span>
  </label>
);

const PILL_TONES = {
  white: 'bg-white text-[#737373]',
  green: 'bg-[#ebf1ec] text-[#2d5d33]',
  gold: 'bg-[#faf4e8] text-[#1c2a21]',
};

export const Pill = ({ tone = 'white', children, className }) => (
  <span className={classNames(PILL_BASE, PILL_TONES[tone], className)}>{children}</span>
);

export const PersonRow = ({ avatar, name, detail, trailing, className }) => (
  <div className={classNames('flex items-center gap-[10px] py-[8px]', className)}>
    <img src={avatar} alt="" className="size-[36px] shrink-0 rounded-full object-cover" />
    <div className="flex min-w-0 flex-1 flex-col gap-px">
      <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
        {name}
      </span>
      <span className="font-sans text-[12px] font-normal leading-[14px] text-[#737373]">
        {detail}
      </span>
    </div>
    {trailing}
  </div>
);
