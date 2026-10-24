import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { PARTNER_SIGN_IN_ROUTE } from '../publicDataNav.js';

/*
 * ShowcasePartnerCta — Figma "partner cta" 8497:1911 (1360x96): #2a5730, r20, p 24/28. Title "Want to reach talents like Akosua?" 20/24 600 white,
 * sub 14/17 #c1d4c4 "Verified partners and recruiters can search consented profiles across all 16 regions."; button "Become a partner →"
 * (#e1eae2, 2px #c1d4c4, r14, p 12/22, 16/24 700 #165d3a, shadow 0 1px 2px) linking to PARTNER_SIGN_IN_ROUTE.
 * Grid overview variant ("Why only five?" 8497:349565): `variant="why"` with its own title/body/label (copy passed in).
 * Props: title, body, label (default "Become a partner →"), variant ('bar' | 'why'), className
 */

const ShowcasePartnerCta = ({
  title,
  body,
  label = 'Become a partner →',
  variant = 'bar',
  className,
}) => {
  const button = (
    <Link
      to={PARTNER_SIGN_IN_ROUTE}
      className="inline-flex min-h-[48px] w-fit shrink-0 items-center justify-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[22px] py-[12px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#165d3a] no-underline shadow-[0_1px_2px_rgba(0,0,0,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {label}
    </Link>
  );
  if (variant === 'why') {
    return (
      <section
        aria-label={title}
        className={classNames(
          'flex flex-col gap-[10px] rounded-[24px] bg-[#2a5730] p-[24px] font-sans',
          className
        )}
      >
        <h2 className="m-0 text-[20px] leading-[24px] font-semibold text-white">{title}</h2>
        <p className="m-0 text-[14px] leading-[20px] text-[#c1d4c4]">{body}</p>
        <div className="pt-[10px]">{button}</div>
      </section>
    );
  }
  return (
    <section
      aria-label="Become a partner"
      className={classNames(
        'flex flex-wrap items-center justify-between gap-x-[24px] gap-y-[16px] rounded-[20px] bg-[#2a5730] px-[28px] py-[24px] font-sans',
        className
      )}
    >
      <div className="flex min-w-0 max-w-[560px] flex-col gap-[4px]">
        <h2 className="m-0 text-[20px] leading-[24px] font-semibold text-white">{title}</h2>
        <p className="m-0 text-[14px] leading-[17px] text-[#c1d4c4]">{body}</p>
      </div>
      {button}
    </section>
  );
};

export default ShowcasePartnerCta;
