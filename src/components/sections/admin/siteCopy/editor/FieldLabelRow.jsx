import { classNames } from '../../../../../utils/classNames.js';
import CopyStatusChip from './CopyStatusChip.jsx';
import { EditorRestoreIcon } from './EditorIcons.jsx';

/*
 * FieldLabelRow — the label line above every field of the section editor (frames 7.8.2a-2n): label 14/600, the "Changed" chip once the text
 * differs from the original, then (right) the character counter 12.5/600 (red when over the limit or when a chip is refused) and
 * "Reset to default" (14 px clock + 12.5/600 #575755, r8, p 4/8; grey while its confirm popover is open).
 * Props: id (label id), label, changed, length, max, red, onReset, resetOpen, readOnly, children (the confirm popover, placed under the link).
 */
const FieldLabelRow = ({
  id,
  label,
  changed,
  length,
  max,
  red,
  onReset,
  resetOpen,
  readOnly,
  children,
}) => (
  <div className="relative flex flex-wrap items-center gap-x-[8px] gap-y-[4px]">
    <span
      id={id}
      className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21] max-lg:text-[13px]"
    >
      {label}
    </span>
    {changed ? <CopyStatusChip kind="changed" /> : null}
    <span className="min-w-[8px] grow" />
    <span
      aria-live="polite"
      aria-label={`${length} of ${max} characters`}
      className={classNames(
        'font-sans text-[12.5px] leading-[15px] font-semibold max-lg:text-[12px]',
        red ? 'text-[#c0392b]' : 'text-[#575755]'
      )}
    >
      {`${length} / ${max}`}
    </span>
    {changed && !readOnly ? (
      <button
        type="button"
        onClick={onReset}
        aria-haspopup="dialog"
        aria-expanded={Boolean(resetOpen)}
        aria-label={`Reset ${label} to default`}
        className={classNames(
          'inline-flex min-h-[24px] cursor-pointer items-center gap-[4px] rounded-[8px] border-0 px-[8px] py-[4px] font-sans text-[12.5px] leading-[15px] font-semibold whitespace-nowrap text-[#575755] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440] max-lg:text-[12px]',
          resetOpen ? 'bg-[#f8f8f4]' : 'bg-transparent hover:bg-[#f8f8f4]'
        )}
      >
        <EditorRestoreIcon className="size-[14px] shrink-0 text-[#5f6b63]" />
        Reset to default
      </button>
    ) : null}
    {children}
  </div>
);

export default FieldLabelRow;
