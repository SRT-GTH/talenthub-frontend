import { useId } from 'react';
import { RecordsIconChevdown } from '../records/recordsIcons.jsx';

/*
 * CredentialField — a labelled input of the issue form (Figma "Input · …" 8593:389560: label 14/24 500, green * (#2e8b57), optional 12 #595959, input 51 high r10, 1px #cccccc, p13/16/13/20, 14/20 #595959).
 * Props: label, required, optional, value, onChange(value), placeholder, options (renders the Template select with its chevron), autoFocus.
 */
const FIELD =
  'h-[51px] w-full rounded-[10px] border border-solid border-[#cccccc] bg-white px-[20px] font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#595959] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06)] placeholder:text-[#595959] focus-visible:outline-2 focus-visible:outline-[#387440]';

const CredentialField = ({
  label,
  required,
  optional,
  value,
  onChange,
  placeholder,
  options,
  autoFocus,
}) => {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-[8px]">
      <label
        htmlFor={id}
        className="flex items-center gap-[6px] text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
      >
        <span>
          {label}
          {required ? <span className="text-[#2e8b57]"> *</span> : null}
        </span>
        {optional ? (
          <span className="text-[12px] leading-[18px] font-normal text-[#595959]">Optional</span>
        ) : null}
      </label>
      {options ? (
        <div className="relative">
          <select
            id={id}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${FIELD} cursor-pointer appearance-none pr-[44px] font-medium text-[#1c2a21]`}
          >
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <RecordsIconChevdown className="pointer-events-none absolute top-[16px] right-[16px] size-[20px] text-[#1c2a21]" />
        </div>
      ) : (
        <input
          id={id}
          type="text"
          required={required}
          value={value}
          placeholder={placeholder}
          data-autofocus={autoFocus ? '' : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={FIELD}
        />
      )}
    </div>
  );
};

export default CredentialField;
