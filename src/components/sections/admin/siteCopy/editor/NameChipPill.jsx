import { CopyLabelIcon } from '../siteCopyIcons.jsx';

/*
 * NameChipPill — a product-name chip as it is drawn in the Insert name menu and inside a text (frames 7.8.2f): 21 high, r6, 1 px #387440 at 50 %,
 * #ebf1ec at 50 %, tag icon 12 px + the name 14/600 #2a5730. (Inside the editable text the same pill is built by chipDom.js.)
 * Props: name.
 */
const NameChipPill = ({ name }) => (
  <span className="inline-flex h-[21px] items-center gap-[4px] rounded-[6px] border border-solid border-[#387440]/50 bg-[#ebf1ec]/50 py-[1px] pr-[6px] pl-[7px] font-sans text-[14px] leading-[17px] font-semibold text-[#2a5730]">
    <CopyLabelIcon className="size-[12px] shrink-0" />
    {name}
  </span>
);

export default NameChipPill;
