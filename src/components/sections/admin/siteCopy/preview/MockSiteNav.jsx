import { classNames } from '../../../../../utils/classNames.js';

/*
 * MockSiteNav — the top bar of the mock public page (Figma "site nav" 7.8.3a/b/c, 60 high): "Ghana Talent Hub" 16/700 #2a5730, the three links
 * 13/500 #575755 and the ink "Join now" chip; the phone keeps the logo (14/700) and a "Menu" chip. Purely visual (the preview is not a browser).
 */
const LINK = 'font-sans text-[13px] leading-[16px] font-medium whitespace-nowrap text-[#575755]';

const MockSiteNav = ({ device }) => {
  const phone = device === 'phone';
  return (
    <div className="flex h-[60px] items-center gap-[16px] px-[24px] py-[14px]">
      <span
        className={classNames(
          'font-sans font-bold whitespace-nowrap text-[#2a5730]',
          phone ? 'text-[14px] leading-[17px]' : 'text-[16px] leading-[19px]'
        )}
      >
        Ghana Talent Hub
      </span>
      <span className="min-w-0 flex-1" />
      {phone ? null : (
        <>
          <span className={LINK}>How it works</span>
          <span className={LINK}>For students</span>
          <span className={LINK}>For recruiters</span>
        </>
      )}
      <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#1c2a21] bg-[#1c2a21] px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap text-white">
        {phone ? 'Menu' : 'Join now'}
      </span>
    </div>
  );
};

export default MockSiteNav;
