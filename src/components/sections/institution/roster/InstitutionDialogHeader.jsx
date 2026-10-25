import { classNames } from '../../../../utils/classNames.js';

/*
 * InstitutionDialogHeader — the header block of the 820 / 620 roster dialogs (Figma "Header" 8590:384463, gap 8): chip (32 high, px 14, r999, 13/16 600; green #ebf1ec / #c1d4c4 / #387440,
 * or "plain" white / #e1eae2 / #595959 for Transfer out) · title 32/38 600 #1c2a21 whose second part is green #387440 · text 15/22 #595959.
 * Props: chip, tone ('green' | 'plain'), title (string or [black, green]), text, titleId, className.
 */
const InstitutionDialogHeader = ({ chip, tone = 'green', title, text, titleId, className }) => {
  const [a, b] = Array.isArray(title) ? title : [title, ''];
  return (
    <header className={classNames('flex flex-col gap-[8px] pr-[48px]', className)}>
      <span
        className={classNames(
          'inline-flex h-[32px] w-fit items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold',
          tone === 'plain'
            ? 'border-[#e1eae2] bg-white text-[#595959]'
            : 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
        )}
      >
        {chip}
      </span>
      <h2
        id={titleId}
        className="m-0 font-sans text-[26px] leading-[32px] font-semibold text-[#1c2a21] md:text-[32px] md:leading-[38px]"
      >
        {a}
        {b ? <span className="text-[#387440]">{b}</span> : null}
      </h2>
      {text ? (
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{text}</p>
      ) : null}
    </header>
  );
};

export default InstitutionDialogHeader;
