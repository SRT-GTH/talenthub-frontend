import { classNames } from '../../../utils/classNames.js';

/*
 * AgencyPageHero — the green "Welcome hero" banner on top of every agency page (Figma 8597:398321: Welcome back on Home,
 * "National data" + Download PDF, "Queries" + Export CSV ...). 1329 x 176 at 1728, r16, white 1.5 border, gradient #1f4a2b → #3f7f4c,
 * px24 py40, gap 18; title 24/30 600 #fefefe + subtitle 14/20 400 #fefefe on the left, the action(s) on the right.
 * Props: title (the page's single <h1>), subtitle (string or node), actions (node: AgencyButton(s)), className.
 * Below md the actions wrap under the text; padding and height shrink (16px side padding on phones).
 */

const AgencyPageHero = ({ title, subtitle, actions, className }) => (
  <section
    aria-label={typeof title === 'string' ? title : undefined}
    className={classNames(
      'flex min-h-[176px] flex-col justify-center gap-[18px] rounded-[16px] border-[1.5px] border-solid border-white bg-[linear-gradient(135deg,#1f4a2b_14.6%,#3f7f4c_85.4%)] px-[20px] py-[28px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)] md:flex-row md:items-center md:justify-between md:px-[24px] md:py-[40px]',
      className
    )}
  >
    <div className="flex min-w-0 flex-col gap-[4px]">
      <h1 className="m-0 font-sans text-[24px] leading-[30px] font-semibold tracking-[-0.12px] text-[#fefefe]">
        {title}
      </h1>
      {subtitle ? (
        <p className="m-0 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#fefefe]">
          {subtitle}
        </p>
      ) : null}
    </div>
    {actions ? (
      <div className="flex shrink-0 flex-wrap items-center gap-[12px]">{actions}</div>
    ) : null}
  </section>
);

export default AgencyPageHero;
