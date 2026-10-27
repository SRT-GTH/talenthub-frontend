import { useId } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { CommunityChevronDownGlyph } from './CommunityDialogIcons.jsx';
import { FOCUS_RING } from './communityDialogUtils.js';
import { POST_PURPOSES, PURPOSE_BY_VALUE } from './postPurpose.js';

/*
 * PurposePicker — the required "What's this post for?" dropdown in the create-post dialog (US-5.2.2-01).
 *   value        chosen purpose value or ''
 *   onChange(v)
 *   allowed      purpose values this community accepts (others are not offered)
 *   suggestion   { purpose, confidence } from the classifier (only sent at >= 0.7) or null
 * When the classifier is confident it says "This looks like an Upskilling post — does that fit?" with a
 * one-tap Yes; otherwise the field stays empty with the required prompt, and Post stays disabled.
 */
/* "an Upskilling post", "a Milestone post" */
const article = (word) => (/^[aeiou]/i.test(word || '') ? 'an' : 'a');

const PurposePicker = ({ value, onChange, allowed, suggestion }) => {
  const id = useId();
  const hintId = useId();
  const options = POST_PURPOSES.filter((p) => !allowed?.length || allowed.includes(p.value));
  const suggested = suggestion?.purpose ? PURPOSE_BY_VALUE[suggestion.purpose] : null;
  const chosen = value ? PURPOSE_BY_VALUE[value] : null;
  return (
    <div className="flex flex-col gap-[8px]">
      <label
        htmlFor={id}
        className="font-sans text-[14px] font-medium leading-[24px] tracking-[0.2px] text-[#1c2a21]"
      >
        What’s this post for?
        <span aria-hidden="true" className="font-ui text-[14px] font-semibold text-[#2e8b57]">
          *
        </span>
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          required
          aria-describedby={hintId}
          onChange={(e) => onChange(e.target.value)}
          className={classNames(
            'h-[44px] w-full cursor-pointer appearance-none rounded-[12px] border border-solid bg-white pl-[14px] pr-[40px] font-sans text-[14px] leading-[18px]',
            value ? 'border-[#cfd8d1] text-[#1c2a21]' : 'border-[#d9d9d9] text-[#737373]',
            FOCUS_RING
          )}
        >
          <option value="" disabled>
            Choose a purpose
          </option>
          {options.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label} — {p.hint}
            </option>
          ))}
        </select>
        <CommunityChevronDownGlyph
          aria-hidden="true"
          className="pointer-events-none absolute right-[14px] top-1/2 size-[16px] -translate-y-1/2 text-[#595959]"
        />
      </div>
      <p
        id={hintId}
        className="m-0 font-sans text-[12px] leading-[16px] text-[#737373]"
        aria-live="polite"
      >
        {suggested && value !== suggested.value ? (
          <span className="inline-flex flex-wrap items-center gap-[8px]">
            <span>
              This looks like {article(suggested.singular)} {suggested.singular} post — does that
              fit?
            </span>
            <button
              type="button"
              onClick={() => onChange(suggested.value)}
              className={classNames(
                'cursor-pointer rounded-full border border-solid border-[#387440] bg-white px-[10px] py-[3px] font-sans text-[12px] font-semibold text-[#387440]',
                FOCUS_RING
              )}
            >
              Yes, {suggested.singular}
            </button>
          </span>
        ) : suggested && chosen && value === suggested.value ? (
          `This looks like ${article(suggested.singular)} ${suggested.singular} post — does that fit? If not, pick another purpose.`
        ) : chosen ? (
          chosen.hint
        ) : (
          'What is the purpose of this post? (Required)'
        )}
      </p>
    </div>
  );
};

export default PurposePicker;
