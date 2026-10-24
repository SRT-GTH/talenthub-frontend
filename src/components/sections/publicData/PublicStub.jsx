/*
 * PublicStub — placeholder body of a Theme 8 page that is not built yet (Figma canvas 8477:209484). Replaced section by section;
 * the page keeps the real chrome (sidebar, top bar, footer) so the layout, routes and URL state can be checked from day one.
 */
const PublicStub = ({ name, frames }) => (
  <div className="px-[16px] py-[32px] md:px-[32px] xl:px-[40px]">
    <div className="rounded-[24px] border border-dashed border-[#c1d4c4] bg-white p-[24px]">
      <p className="m-0 font-sans text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#387440] uppercase">
        Not built yet
      </p>
      <h2 className="mt-[8px] mb-0 font-sans text-[20px] leading-[24px] font-semibold text-[#1c2a21]">
        {name}
      </h2>
      <p className="mt-[8px] mb-0 font-sans text-[14px] leading-[20px] text-[#595959]">{frames}</p>
    </div>
  </div>
);

export default PublicStub;
