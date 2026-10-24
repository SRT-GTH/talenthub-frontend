import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';

/*
 * FindTalentCard — the green "CTA" card of the region / district page (Figma 8493:2056, 456x225; phone 8507:390 "cta" r20 p18): #2a5730, r24, p28, gap 12,
 * shadow 0 5 17; eyebrow "FOR PARTNERS AND RECRUITERS" (12/14 600 +0.72 #c1d4c4), title 22/26 600 white, body 14/20 #c1d4c4 (max 400), button
 * "View talents in Greater Accra →" (#e1eae2, 2px #c1d4c4, r14, text #165d3a 16/700).
 * ⚠️ ASSUMPTION: Figma draws no destination; partners search consented profiles after verification, so the button leads to the existing sign-in
 * (/login), like "Partner sign-in →".
 * Props: cta { title, body, button, mobileBody, mobileButton }, onAction(), className. On phones the short copy of the phone frame is used when it exists.
 */

const FindTalentCard = ({ cta, onAction, className }) => (
  <section
    aria-labelledby="find-talent-title"
    className={classNames(
      'flex min-w-0 flex-col gap-[8px] rounded-[20px] bg-[#2a5730] p-[18px] font-sans md:justify-start md:gap-[12px] md:rounded-[24px] md:p-[28px] md:shadow-[0_5px_17px_rgba(0,0,0,0.04)]',
      className
    )}
  >
    <p className="m-0 text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#c1d4c4] uppercase max-md:hidden">
      For partners and recruiters
    </p>
    <h2
      id="find-talent-title"
      className="m-0 text-[18px] leading-[21px] font-semibold text-white md:text-[22px] md:leading-[26px]"
    >
      {cta.title}
    </h2>
    <p className="m-0 max-w-[400px] text-[13px] leading-[16px] text-[#c1d4c4] md:text-[14px] md:leading-[20px]">
      {cta.mobileBody ? (
        <>
          <span className="md:hidden">{cta.mobileBody}</span>
          <span className="max-md:hidden">{cta.body}</span>
        </>
      ) : (
        cta.body
      )}
    </p>
    <div className="pt-[10px]">
      <Button
        type="button"
        variant="tertiary-subtle"
        size="md"
        onClick={onAction}
        className="!rounded-[14px] !border-2 !border-solid !border-[#c1d4c4] !bg-[#e1eae2] !px-[22px] !py-[12px] !text-[#165d3a]"
      >
        {cta.mobileButton ? (
          <>
            <span className="md:hidden">{cta.mobileButton}</span>
            <span className="max-md:hidden">{cta.button}</span>
          </>
        ) : (
          cta.button
        )}
      </Button>
    </div>
  </section>
);

export default FindTalentCard;
