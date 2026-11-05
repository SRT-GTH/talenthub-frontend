/*
 * TabRow — list row of the ward tabs (Figma "row · …" 10049:1172): py12, gap 14 (16 with a photo), bottom hairline #e7e7e7 except the last row,
 * 40px mint icon tile r12 (or a 40px photo) + 14/600 title over 12 #575755 sub + trailing node.
 * Props: icon (url), photo (url), title, sub, last, children (trailing), size ('compact' default | 'roomy').
 * size="roomy" is the Flags and corrections canvas row (Figma "row · Date of birth" 10034:140647, "row · Date of birth was corrected" 10057:937): py14, hairline #eeeee9, tile #eef4ef,
 * title 15/18 over sub 13/16 (12 below lg), and the row wraps so a chip + button never overflow on a phone.
 */
const SIZES = {
  compact: {
    li: 'py-[12px]',
    line: 'border-[#e7e7e7]',
    tile: 'bg-[#ebf1ec]',
    text: 'min-w-0',
    title: 'text-[14px] leading-normal',
    sub: 'text-[12px] leading-normal',
  },
  roomy: {
    li: 'flex-wrap gap-y-[10px] py-[14px]',
    line: 'border-[#eeeee9]',
    tile: 'bg-[#eef4ef]',
    text: 'min-w-[180px]',
    title: 'text-[15px] leading-[18px]',
    sub: 'text-[13px] leading-[16px] max-lg:text-[12px]',
  },
};

const TabRow = ({ icon, photo, title, sub, last = false, size = 'compact', children }) => {
  const s = SIZES[size] ?? SIZES.compact;
  return (
    <li
      className={`flex min-w-0 items-center ${s.li} ${photo ? 'gap-x-[16px]' : 'gap-x-[14px]'} ${last ? '' : `border-0 border-b border-solid ${s.line}`}`}
    >
      {photo ? (
        <img
          src={photo}
          alt=""
          width="40"
          height="40"
          className="size-[40px] shrink-0 rounded-full object-cover"
        />
      ) : (
        <span
          className={`flex size-[40px] shrink-0 items-center justify-center rounded-[12px] ${s.tile}`}
        >
          <img src={icon} alt="" aria-hidden="true" className="size-[20px]" />
        </span>
      )}
      <div className={`flex ${s.text} flex-1 flex-col gap-[3px]`}>
        <p className={`m-0 font-sans font-semibold text-[#1c2a21] ${s.title}`}>{title}</p>
        <p className={`m-0 font-sans text-[#575755] ${s.sub}`}>{sub}</p>
      </div>
      {children}
    </li>
  );
};

export default TabRow;
