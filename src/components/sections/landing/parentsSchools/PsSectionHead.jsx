import AccentText from '../shared/AccentText.jsx';
import { classNames } from '../../../../utils/classNames.js';

/*
 * Centred section head used by P-04 sections (Figma "Head" 760 wide): chip · Bricolage title (32 mobile / 35 tablet / 56 desktop, 600) · 16-18px sub.
 * `dark` = on the #14301a band (gold chip + white copy); light = white chip with mint border, #111 title, #595959 sub.
 */
const PsSectionHead = ({ chip, title, accent, subtitle, dark = false, className }) => (
  <div
    className={classNames(
      'mx-auto flex w-full max-w-[798px] flex-col items-center gap-3 text-center',
      className
    )}
  >
    <span
      className={classNames(
        'inline-flex h-7 items-center rounded-full border px-3 font-sans text-[13px] font-semibold',
        dark
          ? 'border-[#1c2a21] bg-[#ffd86b] text-[#1c2a21]'
          : 'border-[#c1d4c4] bg-white text-[#387440]'
      )}
    >
      {chip}
    </span>
    <h2
      className={classNames(
        'm-0 font-heading text-[32px] font-semibold leading-[1.1] md:text-[35px] xl:text-[47px]',
        dark ? 'text-white' : 'text-[#1c2a21]'
      )}
    >
      <AccentText accent={accent} tone={dark ? 'gold' : 'green'}>
        {title}
      </AccentText>
    </h2>
    {subtitle ? (
      <p
        className={classNames(
          'm-0 max-w-[760px] font-sans text-[16px] leading-[27px] md:text-[18px]',
          dark ? 'text-white' : 'text-[#595959]'
        )}
      >
        {subtitle}
      </p>
    ) : null}
  </div>
);

export default PsSectionHead;
