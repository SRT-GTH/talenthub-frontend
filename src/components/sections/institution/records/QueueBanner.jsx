import { RecordsIconClock } from './recordsIcons.jsx';

/* QueueBanner — the amber "discovery banner" under the toolbar (Figma 8593:52): #faf4e8, 1px #eedeb8, r20, clock icon #967014, 14/17 500 text. Props: children, live (aria-live). */
const QueueBanner = ({ children }) => (
  <p
    role="status"
    className="m-0 flex items-start gap-[14px] rounded-[20px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[14px] pl-[18px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]"
  >
    <RecordsIconClock className="mt-0 size-[18px] shrink-0 text-[#967014]" />
    <span>{children}</span>
  </p>
);

export default QueueBanner;
