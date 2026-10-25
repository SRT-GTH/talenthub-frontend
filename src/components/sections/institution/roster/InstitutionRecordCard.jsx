import { classNames } from '../../../../utils/classNames.js';

/*
 * InstitutionRecordCard — the white card of the student record (Figma "card · About" 8744:433620 …): 1px #e6e6e6, r20, p 24, gap 16; head = title 23/29 600 #1c2a21 + a right link 13/16 600 #387440.
 * Props: id (anchor + heading id), title, link (text, e.g. "See all 7 →"), onLink, dark (the dark enrolment card), className, children.
 */
const InstitutionRecordCard = ({ id, title, link, onLink, className, children }) => (
  <section
    id={id}
    aria-labelledby={id ? `${id}-title` : undefined}
    className={classNames(
      'flex scroll-mt-[96px] flex-col gap-[16px] rounded-[20px] border border-solid border-[#e6e6e6] bg-white p-[24px]',
      className
    )}
  >
    <div className="flex items-center justify-between gap-[10px]">
      <h2
        id={id ? `${id}-title` : undefined}
        className="m-0 font-sans text-[23px] leading-[29px] font-semibold text-[#1c2a21]"
      >
        {title}
      </h2>
      {link ? (
        <button
          type="button"
          onClick={onLink}
          className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] leading-[16px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {link}
        </button>
      ) : null}
    </div>
    {children}
  </section>
);

export default InstitutionRecordCard;
