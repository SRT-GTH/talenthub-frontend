/*
 * AdminNextStepCard — the dark-green "Next step" card (Figma 427 x 173, #1f6b3f, 1px #00522b, r16, p 21/22/22/22, gap 12):
 * eyebrow 14/15 500 #b9d6c8 (+0.44), title 20/25 600 white, body 16/22 500 #b9cdbd. Same card as the agency home; text from the role.
 * Props: next { eyebrow, title, body }.
 */

const AdminNextStepCard = ({ next, className }) => (
  <section
    aria-label={next.eyebrow}
    className={`flex flex-col gap-[12px] rounded-[16px] border border-solid border-[#00522b] bg-[#1f6b3f] px-[22px] pt-[21px] pb-[22px] ${className ?? ''}`}
  >
    <p className="m-0 font-sans text-[14px] leading-[15px] font-medium tracking-[0.44px] text-[#b9d6c8]">
      {next.eyebrow}
    </p>
    <div className="flex flex-col gap-[8px]">
      <h2 className="m-0 font-sans text-[20px] leading-[25px] font-semibold tracking-[-0.1px] text-white">
        {next.title}
      </h2>
      <p className="m-0 font-sans text-[16px] leading-[22px] font-medium text-[#b9cdbd]">
        {next.body}
      </p>
    </div>
  </section>
);

export default AdminNextStepCard;
