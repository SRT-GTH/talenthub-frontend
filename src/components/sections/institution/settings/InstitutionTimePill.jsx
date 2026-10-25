import { SettingsAChevronDownIcon } from '../../../shared/assets.jsx';
import { InstitutionSettingsClockIcon } from './institutionSettingsIcons.jsx';

// Hourly 12-hour options: "12:00 am" ... "11:00 pm".
const TIMES = Array.from(
  { length: 24 },
  (_, h) => `${h % 12 === 0 ? 12 : h % 12}:00 ${h < 12 ? 'am' : 'pm'}`
);

/*
 * InstitutionTimePill — the quiet-hours time picker (Figma "time · 10:00 pm" (11.6.1c): 40 high, r12, 1px rgba(28,42,33,.1), clock + 15/600 + chevron).
 * A native <select> sits invisibly over the pill so it stays keyboard and screen-reader friendly. Props: value, onChange(value), label.
 */
const InstitutionTimePill = ({ value, onChange, label }) => (
  <label className="relative flex cursor-pointer items-center gap-[8px] rounded-[12px] border border-[rgba(28,42,33,0.1)] bg-white px-[14px] py-[10px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]">
    <InstitutionSettingsClockIcon className="block size-[16px] shrink-0 text-[#595959]" />
    <span className="text-[15px] leading-[18px] font-semibold whitespace-nowrap text-[#1c2a21]">
      {value}
    </span>
    <SettingsAChevronDownIcon className="block size-[18px] shrink-0" />
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="absolute inset-0 size-full cursor-pointer opacity-0"
    >
      {TIMES.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  </label>
);

export default InstitutionTimePill;
