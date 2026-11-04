/*
 * NamePageHeading — the title block of the Product names, Super Admin home and release-sync screens (Figma "Container": title 34/41 600 #1c2a21 at
 * -0.68 tracking, 3 px gap, subtitle 16/24 #595959 at 0.2 tracking). The page's only <h1>. Fluid below lg.
 * Props: title, subtitle.
 */
const NamePageHeading = ({ title, subtitle }) => (
  <header className="flex flex-col gap-[3px] pt-[4px]">
    <h1 className="m-0 font-sans text-[clamp(26px,2.2vw+8px,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
      {title}
    </h1>
    <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959] max-lg:text-[14px]">
      {subtitle}
    </p>
  </header>
);

export default NamePageHeading;
