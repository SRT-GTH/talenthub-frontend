import { classNames } from '../../utils/classNames.js';

/*
 * RecruiterSettingsCard — the white card of the recruiter Settings screens (Figma "Card · Personal detail" 10161:77535, "Card · Team members" 10161:78505, ...).
 * 16px radius, #e5e8e3 hairline, two-layer soft shadow, 24px padding, 16px gap; header = Bricolage 22/26 title + a 12/20 #575755 description.
 * Sibling of the talent `SettingsBUi` GroupCard (20px radius, 19px title) which the talent Settings keep; the recruiter frames draw a different card, hence this one.
 * Props: title, description, children, className, headerAction (node right of the header, e.g. a button), ...rest on the <section>.
 * `RecruiterSettingsRow`: a 46px line, title 14/500 + description 12/20 on the left, the control (link, chip, button) on the right. `top` draws the #e5e8e3 divider above (16px gap each side).
 * Used by every recruiter Settings tab; the text sizes are 14 / 12 as drawn (12px is the Figma floor for descriptions).
 */
export const RecruiterSettingsCard = ({
  title,
  description,
  children,
  className,
  headerAction,
  ...rest
}) => (
  <section
    aria-label={title}
    className={classNames(
      'flex w-full min-w-0 flex-col gap-[16px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[clamp(16px,1.39vw,24px)] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)]',
      className
    )}
    {...rest}
  >
    {title ? (
      <header className="flex min-w-0 items-start justify-between gap-[12px]">
        <div className="flex min-w-0 flex-col gap-[2px]">
          <h2 className="m-0 font-heading text-[clamp(19px,1.27vw,22px)] leading-[26px] font-semibold tracking-[-0.44px] text-[#111]">
            {title}
          </h2>
          {description ? (
            <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
              {description}
            </p>
          ) : null}
        </div>
        {headerAction}
      </header>
    ) : null}
    {children}
  </section>
);

export const RecruiterSettingsRow = ({ title, description, top = false, className, children }) => (
  <div
    className={classNames(
      'flex min-h-[46px] items-center gap-[12px]',
      top && 'border-t border-solid border-[#e5e8e3] pt-[16px]',
      className
    )}
  >
    <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
      <p className="m-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
        {title}
      </p>
      {description ? (
        <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] break-words text-[#575755]">
          {description}
        </p>
      ) : null}
    </div>
    {children}
  </div>
);

/*
 * RecruiterSettingsLink: the green 14/500 text link on the right of a row ("Change", "Resend", "Preview as talent"; Figma "Link · Change" 10161:77560, no underline). `icon` = an optional 16px glyph before the label.
 * min 24px target so it passes the small-target audit on phones.
 */
export const RecruiterSettingsLink = ({ icon, onClick, children, className, ...rest }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'inline-flex min-h-[24px] min-w-[24px] shrink-0 cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      className
    )}
    {...rest}
  >
    {icon}
    {children}
  </button>
);

export default RecruiterSettingsCard;
