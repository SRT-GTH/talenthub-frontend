import arrowRight from '../../../../assets/parent/home-arrow-right.svg';

/*
 * HomeCardHead — the head row shared by the parent Overview cards (Figma "Card head" 10027:1850 / 10027:1957 / 10027:1980):
 * optional 32px mint tile + icon (r10), 17/600 #1c2a21 title, spacer, 14/600 #387440 link with a 15px arrow.
 * Props: icon (url), iconClass, title (node), linkLabel, onLink, linkIcon (url, defaults to the green arrow).
 */
const HomeCardHead = ({ icon, iconClass = 'size-[17px]', title, linkLabel, onLink, linkIcon }) => (
  <div className="flex w-full items-center gap-[10px]">
    {icon && (
      <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec]">
        <img src={icon} alt="" className={iconClass} />
      </span>
    )}
    <h2 className="m-0 min-w-0 truncate font-sans text-[17px] leading-normal font-semibold text-[#1c2a21]">
      {title}
    </h2>
    <span className="h-px min-w-px flex-1" aria-hidden="true" />
    {linkLabel && (
      <button
        type="button"
        onClick={onLink}
        className="flex shrink-0 cursor-pointer items-center gap-[4px] rounded-[4px] border-0 bg-transparent p-0 font-sans text-[14px] leading-normal font-semibold whitespace-nowrap text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        {linkLabel}
        <img src={linkIcon || arrowRight} alt="" className="size-[15px]" />
      </button>
    )}
  </div>
);

export default HomeCardHead;
