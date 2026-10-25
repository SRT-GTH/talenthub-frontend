/*
 * DatasetLoggedCard — the dark green "Logged view" card of the approved dataset (Figma 11.4.3h, right of the partner footprint): eyebrow
 * "For your agency", title, the audit sentence and a light "View access log →" button (opens the agency audit log).
 * Props: logged { eyebrow, title, text, action }, onAction().
 */

const DatasetLoggedCard = ({ logged, onAction }) => (
  <section
    aria-labelledby="dr-logged-title"
    className="flex min-w-0 flex-col justify-between gap-[16px] rounded-[20px] bg-[#2a5730] p-[24px]"
  >
    <div className="flex flex-col gap-[8px]">
      <p className="m-0 font-sans text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#c1d4c4] uppercase">
        {logged.eyebrow}
      </p>
      <h2
        id="dr-logged-title"
        className="m-0 font-sans text-[22px] leading-[28px] font-semibold text-white"
      >
        {logged.title}
      </h2>
      <p className="m-0 font-sans text-[14px] leading-[20px] text-[#c1d4c4]">{logged.text}</p>
    </div>
    <button
      type="button"
      onClick={onAction}
      className="w-fit cursor-pointer rounded-[12px] border-0 bg-[#e1eae2] px-[18px] py-[12px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] shadow-[0_3px_0_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {logged.action} →
    </button>
  </section>
);

export default DatasetLoggedCard;
