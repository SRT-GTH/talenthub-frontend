import { useId } from 'react';
import { classNames } from '../../../utils/classNames.js';
import {
  SettingsAInfoCircleTipIcon,
  SettingsASliderThumbIcon,
  SettingsAVolumeIcon,
} from '../../shared/assets.jsx';
import { A11Y_PREVIEW, A11Y_READING, A11Y_TEXT_MAX, A11Y_TEXT_MIN } from './talentSettingsAData.js';

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/* "Text size" slider: A ——o—— A (Figma 8110:45217). A real range input sits invisibly over the track. */
export const SettingsATextSizeSlider = ({ value, onChange, label }) => {
  const id = useId();
  const pct = (value - A11Y_TEXT_MIN) / (A11Y_TEXT_MAX - A11Y_TEXT_MIN);
  const left = `${(pct * 100).toFixed(3)}%`;
  return (
    <div className="flex items-center gap-[14px]">
      <span
        aria-hidden="true"
        className="text-[13px] leading-[16px] font-semibold text-[#1c2a21] max-lg:text-[13px]"
      >
        {A11Y_READING.textSize.small}
      </span>
      <div className="relative flex h-[8px] min-w-0 flex-1 items-start rounded-full bg-[#e7e7e7]">
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 h-[8px] rounded-full bg-[#387440]"
          style={{ width: left }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[-8px] size-[24px]"
          style={{ left: `calc(${left} - 10px)` }}
        >
          <SettingsASliderThumbIcon className="block size-[24px]" />
        </span>
        <input
          id={id}
          type="range"
          aria-label={label}
          min={A11Y_TEXT_MIN}
          max={A11Y_TEXT_MAX}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={classNames(
            'absolute top-[-8px] left-0 h-[24px] w-full cursor-pointer opacity-0',
            FOCUS
          )}
        />
      </div>
      <span
        aria-hidden="true"
        className="text-[22px] leading-[26px] font-semibold text-[#1c2a21] playful:font-heading"
      >
        {A11Y_READING.textSize.large}
      </span>
    </div>
  );
};

/* Extra time: Off | 1.5× | 2× segmented control (Figma "extra time"). */
export const SettingsASegmented = ({ options, value, onChange, label }) => (
  <div
    role="radiogroup"
    aria-label={label}
    className="flex shrink-0 items-start gap-[4px] rounded-[12px] bg-[#f8f8f4] p-[4px]"
  >
    {options.map((opt) => {
      const on = opt === value;
      return (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={on}
          onClick={() => onChange(opt)}
          className={classNames(
            'cursor-pointer rounded-[10px] px-[16px] py-[8px] text-[14px] leading-[17px] font-semibold whitespace-nowrap max-sm:px-[10px]',
            on
              ? 'border border-[rgba(28,42,33,0.1)] bg-white text-[#387440] playful:border-[rgba(28,42,33,0.15)]'
              : 'border border-transparent text-[#1c2a21]',
            FOCUS
          )}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

/* Live preview card + shortcut tip (Figma "preview col"). Reacts to the settings on the left. */
export const SettingsAPreview = ({ prefs }) => {
  const scale = prefs.textSize / 115;
  const px = (n) => `${(n * scale).toFixed(2)}px`;
  const roomy = prefs.dyslexia;
  return (
    <div className="flex w-[320px] shrink-0 flex-col gap-[16px] max-xl:w-full">
      <div className="flex flex-col gap-[12px] rounded-[24px] border border-[rgba(28,42,33,0.1)] bg-white p-[22px] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_12px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]">
        <div className="flex items-center gap-[8px]">
          <p className="text-[11.5px] leading-[14px] font-bold text-[#387440] max-lg:text-[12px]">
            {A11Y_PREVIEW.label}
          </p>
          <span aria-hidden="true" className="h-px min-w-px flex-1" />
          <span className="rounded-full border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[8px] py-[3px] text-[11px] leading-[13px] font-bold whitespace-nowrap text-[#1c2a21] max-lg:text-[12px] playful:border-[#1c2a21]">
            {A11Y_PREVIEW.chip}
          </span>
        </div>
        <div
          className="flex flex-col gap-[8px] rounded-[16px] bg-[#f8f8f4] p-[16px]"
          style={roomy ? { letterSpacing: '0.12em' } : undefined}
        >
          <p
            className="font-semibold whitespace-normal text-[#1c2a21]"
            style={{ fontSize: px(20), lineHeight: roomy ? 1.8 : 1.2 }}
          >
            {A11Y_PREVIEW.title}
          </p>
          <p className="text-[#595959]" style={{ fontSize: px(15), lineHeight: roomy ? 1.8 : 1.2 }}>
            {A11Y_PREVIEW.meta}
          </p>
          <p className="leading-[1.5] text-[#1c2a21]" style={{ fontSize: px(16) }}>
            {A11Y_PREVIEW.body}
          </p>
          <p
            className={classNames(
              'font-semibold text-[#387440]',
              prefs.links && 'underline decoration-solid'
            )}
            style={{ fontSize: px(16), lineHeight: roomy ? 1.8 : 1.2 }}
          >
            {A11Y_PREVIEW.link}
          </p>
          {prefs.aloud ? (
            <span className="flex w-fit items-center gap-[6px] rounded-full border border-[rgba(28,42,33,0.1)] bg-white px-[12px] py-[7px] playful:border-[rgba(28,42,33,0.15)]">
              <SettingsAVolumeIcon className="block size-[16px] shrink-0" />
              <span className="text-[14px] leading-[17px] font-semibold whitespace-nowrap text-[#1c2a21]">
                {A11Y_PREVIEW.listen}
              </span>
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex items-start gap-[10px] rounded-[16px] bg-[#ebf1ec] p-[16px]">
        <SettingsAInfoCircleTipIcon className="block size-[18px] shrink-0" />
        <p className="min-w-0 flex-1 text-[13.5px] leading-[1.45] text-[#2a5730]">
          {A11Y_PREVIEW.tip}
        </p>
      </div>
    </div>
  );
};
