import { classNames } from '../../../../utils/classNames.js';

/* RecordCard — the white profile card of the record detail (Figma "card · About" 8593:715: #fff, 1px #e6e6e6, r20, p24, gap 16) with its head (23/29 600 title + 13/600 #387440 link). Props: id, title, link, children, className. */
const RecordCard = ({ id, title, link, children, className }) => (
  <section
    id={id}
    aria-label={title}
    className={classNames(
      'flex scroll-mt-[96px] flex-col gap-[16px] rounded-[20px] border border-solid border-[#e6e6e6] bg-white p-[24px] font-sans',
      className
    )}
  >
    <div className="flex items-center justify-between gap-[10px]">
      <h2 className="m-0 text-[23px] leading-[29px] font-semibold text-[#1c2a21]">{title}</h2>
      {link ? (
        <span className="text-[13px] leading-[16px] font-semibold text-[#387440]">{link}</span>
      ) : null}
    </div>
    {children}
  </section>
);

export default RecordCard;
