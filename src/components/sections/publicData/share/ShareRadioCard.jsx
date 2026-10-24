import { classNames } from '../../../../utils/classNames.js';

/*
 * ShareRadioCard — one option of the "What do you want to share?" and "Download a PDF snapshot" dialogs (Figma 8500:2398 / 8504:233):
 * radius 14 card, selected = #ebf1ec fill + 2px #387440 border + 6px green ring radio; unselected = white + 1px #e7e7e7 + 1.5px grey ring.
 * A native radio input (visually hidden) keeps arrow-key and screen-reader behaviour; the card is its label.
 * Props: name, value, checked, onChange(value), title, detail, extra (small green line, e.g. the link path), compact (phone sheet).
 */

const ShareRadioCard = ({
  name,
  value,
  checked,
  onChange,
  title,
  detail,
  extra,
  compact = false,
}) => (
  <label
    className={classNames(
      'flex cursor-pointer items-start gap-[14px] rounded-[14px] border-solid px-[16px] py-[14px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#387440]',
      checked ? 'border-2 border-[#387440] bg-[#ebf1ec]' : 'border border-[#e7e7e7] bg-white',
      compact && 'items-center px-[14px] py-[12px]'
    )}
  >
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
      className="peer sr-only"
    />
    <span
      aria-hidden="true"
      className={classNames(
        'mt-[1px] size-[20px] shrink-0 rounded-full border-solid bg-white',
        checked ? 'border-[6px] border-[#387440]' : 'border-[1.5px] border-[#b5b5b1]',
        compact && 'mt-0'
      )}
    />
    <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
      <span
        className={classNames('font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]')}
      >
        {title}
      </span>
      {detail ? (
        <span
          className={classNames(
            'font-sans leading-[16px] text-[#595959]',
            compact ? 'text-[12px] leading-[14px]' : 'text-[13px]'
          )}
        >
          {detail}
        </span>
      ) : null}
      {extra ? (
        <span className="font-sans text-[12px] leading-[14px] font-medium break-all text-[#387440]">
          {extra}
        </span>
      ) : null}
    </span>
  </label>
);

export default ShareRadioCard;
