import WavyDivider from '../../../shared/WavyDivider.jsx';

/*
 * InstitutionSignUpHeading — the heading block shared by the two sign-up steps (Figma 11.1.1a "Frame 146"): step pill (156 x 27, #fffefc, 1px #c1d4c4, r8:
 * 8px dot + "03" 15/19 600 #b5b5b5 + label 12/18 #387440), the 54/60 600 headline (second part green, -0.84), the 16/24 #737373 lead and the wavy underline.
 * Props: step ("03"), label, title [plain, green], lead, status (optional small grey status next to the pill, e.g. "Email verified" on 11.1.1d).
 */

const InstitutionSignUpHeading = ({ step, label, title, lead, status }) => (
  <div className="flex flex-col items-center gap-[12px] text-center">
    <div className="flex items-center gap-[12px]">
      <span className="inline-flex items-center gap-[6px] rounded-[8px] border border-solid border-[#c1d4c4] bg-[#fffefc] px-[16px] py-[4px]">
        <span
          aria-hidden="true"
          className="size-[8px] rounded-full border-[1.5px] border-solid border-[#1d7c4d] bg-[#e1eae2]"
        />
        <span className="font-sans text-[15px] leading-[19px] font-semibold text-[#b5b5b5]">
          {step}
        </span>
        <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#387440]">
          {label}
        </span>
      </span>
      {status ? (
        <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#999999]">
          {status}
        </span>
      ) : null}
    </div>
    <h1 className="m-0 max-w-[554px] font-sans text-[clamp(34px,5vw,54px)] leading-[1.11] font-semibold tracking-[-0.84px] text-[#1c2a21]">
      {title[0]}
      <span className="text-[#387440]">{title[1]}</span>
    </h1>
    <p className="m-0 max-w-[482px] font-sans text-[16px] leading-[24px] text-[#737373]">{lead}</p>
    <WavyDivider />
  </div>
);

export default InstitutionSignUpHeading;
