import { useId } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { PUBLISH_COPY, REASON_MAX } from './publishData.js';
import { PublishWarningIcon } from './PublishIcons.jsx';

/*
 * PublishReasonField — "Why are you publishing this?" (Figma 11023:76375 / 11023:77301): label 14/500, a 51-high field (1px #ccc, r10,
 * p 13/16/13/20, 14/500 ink, placeholder #6e7a72), then either the counter "24 / 200 · everyone on the team can see this in history"
 * (12.5 #575755) or, when `error`, the red field (2px #b42318) and the 13/600 #c0392b message with a 14px warning glyph.
 * ⚠️ Figma 7.8.4c draws the message ON TOP of the bottom of the field (the instance is clipped to 58 high); here it sits below the field.
 * The field grows with long text (a textarea with one row); maxLength 200.
 */
const PublishReasonField = ({ value, onChange, error, autoFocus = false }) => {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex flex-col gap-[8px]">
        <label
          htmlFor={id}
          className="font-sans text-[14px] leading-[21px] font-medium tracking-[0.2px] text-[#1c2a21]"
        >
          {PUBLISH_COPY.reasonLabel}
        </label>
        <textarea
          id={id}
          rows={1}
          value={value}
          maxLength={REASON_MAX}
          data-autofocus={autoFocus ? '' : undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder={PUBLISH_COPY.reasonPlaceholder}
          onChange={(e) => onChange(e.target.value.replace(/\n/g, ' '))}
          className={classNames(
            'block min-h-[51px] w-full resize-none rounded-[10px] border border-solid bg-white py-[13px] pr-[16px] pl-[20px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] [field-sizing:content] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_11px_rgba(28,42,33,0.03)] outline-none placeholder:text-[#6e7a72] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            error ? 'border-[#b42318] [box-shadow:inset_0_0_0_1px_#b42318]' : 'border-[#cccccc]'
          )}
        />
      </div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="m-0 flex max-w-[450px] items-start gap-[6px] font-sans text-[13px] leading-[18px] font-semibold text-[#c0392b]"
        >
          <PublishWarningIcon className="mt-[2px] size-[14px] shrink-0 text-[#b42318]" />
          <span>{PUBLISH_COPY.reasonError}</span>
        </p>
      ) : (
        <p className="m-0 font-sans text-[12.5px] leading-[15px] text-[#575755] max-lg:text-[12px]">
          {value.length} / {REASON_MAX} · {PUBLISH_COPY.reasonHint}
        </p>
      )}
    </div>
  );
};

export default PublishReasonField;
