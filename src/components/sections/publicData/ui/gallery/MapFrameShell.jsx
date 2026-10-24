/*
 * MapFrameShell — DEV GALLERY ONLY. Reproduces the page wrapper of the four Figma map component frames (8.2.2a-d, 888 wide): #f8f8f4,
 * padding 40, gap 16, a 20/24 600 title and a 14/20 note (Figma documentation copy, not product copy), then the card. Lets the built map card
 * be diffed against the whole 0.5x frame export.
 * Props: title, note, children.
 */

const MapFrameShell = ({ title, note, children }) => (
  <div className="flex w-[888px] flex-col gap-[16px] bg-[#f8f8f4] p-[40px] font-sans">
    <h3 className="m-0 text-[20px] leading-[24px] font-semibold text-[#1c2a21]">{title}</h3>
    <p className="m-0 text-[14px] leading-[20px] text-[#595959]">{note}</p>
    {children}
  </div>
);

export default MapFrameShell;
