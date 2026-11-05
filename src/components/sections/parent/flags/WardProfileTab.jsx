import { debug } from '../../../../utils/debug.js';
import WardChip from '../wards/WardChip.jsx';
import flagIcon from '../../../../assets/parent/flag-field.svg';
import { FLAGS_COPY, PROFILE_GROUPS } from './data/flagsData.js';

const log = debug('WardProfileTab');

/*
 * WardProfileTab — the Profile tab, PW-03 "Ward · Review profile (flag a field)" (Figma 10034:4197): one white card (r24, p 8 / 22, gap 16, soft shadow) holding the ward's profile fields in five groups
 * (Personal · Education · Interests · Skills · Activities, 12/600 caps, letter-spacing .72). Each field is a row (p12, r12): label 13 #575755 over the value 15/600, an optional status chip, and a "Flag" button
 * (16px flag icon + 13/600 #575755, p 6 / 10, r10). The parent cannot edit a field, only flag it.
 * Chips: a flagged field shows its flag status ("Corrected · re-review" white chip, "Flagged by you" red chip); the Python field carries its static "Verified" chip.
 * Props: flags (flagsStore flags), onFlag(field) — opens the PW-04 dialog, groups (live: the ward's real fields; defaults to the mock).
 * Live fields with no value read "Not added yet" in grey; they can still be flagged ("please add your school").
 * ⚠️ ASSUMPTION: the whole row is not clickable (Figma draws only the Flag button); the button's accessible name carries the field ("Flag Date of birth").
 */
const FieldChip = ({ field, flag }) => {
  if (flag && flag.status !== 'approved') {
    const text = FLAGS_COPY.profileChip[flag.status];
    return <WardChip tone={flag.status === 'corrected' ? 'pending' : 'opted'}>{text}</WardChip>;
  }
  if (field.badge) return <WardChip tone="active">{field.badge}</WardChip>;
  return null;
};

const WardProfileTab = ({ flags, onFlag, groups = PROFILE_GROUPS }) => {
  log('render', { flags: flags.length });
  const flagFor = (fieldId) => flags.find((f) => f.fieldId === fieldId);

  return (
    <section
      aria-label="Profile fields"
      className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white px-[22px] py-[8px] shadow-[0_5px_8.5px_rgba(28,42,33,0.03)] max-sm:px-[14px]"
    >
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-[16px]">
          <h3 className="m-0 pt-[14px] pb-[6px] font-sans text-[12px] leading-normal font-semibold tracking-[0.72px] text-[#575755] uppercase">
            {group.label}
          </h3>
          {group.fields.map((field) => (
            <div key={field.id} className="flex items-center gap-[14px] rounded-[12px] p-[12px]">
              <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <span className="font-sans text-[13px] leading-normal text-[#575755] max-lg:text-[12px]">
                  {field.label}
                </span>
                <span
                  className={`font-sans text-[15px] leading-normal ${field.empty ? 'font-normal text-[#999]' : 'font-semibold text-[#1c2a21]'}`}
                >
                  {field.value}
                </span>
              </div>
              <FieldChip field={field} flag={flagFor(field.id)} />
              <button
                type="button"
                aria-label={`Flag ${field.label}`}
                onClick={() => {
                  log('flag', { field: field.id });
                  onFlag(field);
                }}
                className="flex shrink-0 cursor-pointer items-center gap-[6px] rounded-[10px] border-0 bg-transparent px-[10px] py-[6px] font-sans text-[13px] leading-normal font-semibold text-[#575755] hover:bg-[#f4f7f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] max-lg:text-[12px]"
              >
                <img src={flagIcon} alt="" aria-hidden="true" className="size-[16px]" />
                Flag
              </button>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
};

export default WardProfileTab;
