import { classNames } from '../../../../../utils/classNames.js';

/*
 * TextField — the one-line field of the section editor (Headline 20/600, buttons and FAQ questions 15/400): white box r12, 1 px #e7e7e7,
 * px 14 / py 12; focus = the border turns #387440 (drawn 2 px, here an inset ring so the box never changes height); over the limit or a
 * refused value = #c0392b 2 px. It is an <input> that keeps typing past the limit (the counter turns red, nothing is saved: frame 7.8.2g).
 * Props: id, labelId, value, onChange, headline, invalid, readOnly, autoFocus, describedBy.
 */
const TextField = ({
  id,
  labelId,
  value,
  onChange,
  headline,
  invalid,
  readOnly,
  autoFocus,
  describedBy,
}) => (
  <div
    className={classNames(
      'rounded-[12px] border border-solid bg-white px-[14px] py-[12px] transition-colors',
      invalid
        ? 'border-[#c0392b] shadow-[inset_0_0_0_1px_#c0392b]'
        : 'border-[#e7e7e7] focus-within:border-[#387440] focus-within:shadow-[inset_0_0_0_1px_#387440]'
    )}
  >
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      autoFocus={autoFocus}
      aria-labelledby={labelId}
      aria-invalid={invalid ? 'true' : undefined}
      aria-describedby={describedBy}
      autoComplete="off"
      spellCheck
      className={classNames(
        'block w-full min-w-0 border-0 bg-transparent p-0 font-sans text-[#1c2a21] outline-none',
        headline
          ? 'text-[20px] leading-[28px] font-semibold max-lg:text-[18px]'
          : 'text-[15px] leading-[22px] max-lg:text-[14px]'
      )}
    />
  </div>
);

export default TextField;
