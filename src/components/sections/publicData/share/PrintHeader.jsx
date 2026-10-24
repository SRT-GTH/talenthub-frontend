import gthLogo from '../../../../assets/public-data/gth-logo.png';

/*
 * PrintHeader — "pdf header" of the A4 print layouts (Figma 8503:259 / 8503:449): GTH logo 26×24 + title (12/14 600) on the left,
 * "Page …" (11/13 500 #595959) on the right, 18px / 40px padding and a 1px #e7e7e7 bottom rule. Props: title, pageLabel, className.
 */

const PrintHeader = ({ title, pageLabel, className }) => (
  <header
    className={`flex items-center justify-between gap-[8px] border-b border-solid border-[#e7e7e7] px-[40px] py-[18px] ${className ?? ''}`}
  >
    <div className="flex items-center gap-[10px]">
      <img src={gthLogo} alt="" width="26" height="24" className="h-[24px] w-[26px]" />
      <span className="font-sans text-[12px] leading-[14px] font-semibold text-[#1c2a21]">
        {title}
      </span>
    </div>
    <span className="font-sans text-[11px] leading-[13px] font-medium text-[#595959]">
      {pageLabel}
    </span>
  </header>
);

export default PrintHeader;
