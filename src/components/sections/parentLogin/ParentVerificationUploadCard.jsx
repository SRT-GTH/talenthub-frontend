import { useId, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentVerificationUploadCard');

/*
 * ParentVerificationUploadCard — the two upload cards on the Path A Verification
 * step (Figma 2926:90739 empty, 2931:95277 filled).
 *
 * Why not the shared <Upload>? Figma draws these cards with two plain lines of
 * hint copy and no chips / "Or browse to choose a file" link, and the shared
 * Upload is also used by Path B and other flows, so it is left untouched. The
 * whole card is a <label> for a visually-hidden file input (click, keyboard and
 * drag-and-drop all work).
 *
 *   empty    — amber dashed border, amber icon box, amber title, 'OPTIONAL' tag
 *   received — green tint + solid border, green icon box (white icon), 'ADDED'
 *              tag, the real file name (never a fabricated "Verified" claim)
 */
const ParentVerificationUploadCard = ({
  icon,
  title,
  lines,
  accept,
  filename,
  onFileSelect,
  height = 160,
  ariaLabel,
}) => {
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const received = Boolean(filename);

  const handleFiles = (list) => {
    if (!list || list.length === 0) return;
    log('file selected:', list[0].name);
    onFileSelect?.(list[0]);
  };

  return (
    <label
      htmlFor={inputId}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer?.files);
      }}
      className={classNames(
        'relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 px-4 py-5 transition-colors duration-150 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-green max-md:min-h-[96px]! max-md:gap-0.5 max-md:py-2',
        received
          ? 'border-solid border-[#c1d4c4] bg-[#ebf1ec]'
          : dragOver
            ? 'border-dashed border-[#c8951a] bg-[#faf4e8]'
            : 'border-dashed border-[#eedeb8] bg-[#fdfdfc]'
      )}
      style={{ minHeight: height }}
    >
      <span
        aria-hidden="true"
        className={classNames(
          'inline-flex size-10 items-center justify-center rounded-md max-md:size-8',
          received ? 'bg-brand-green text-white' : 'bg-white text-[#b48617] shadow-bottom-200'
        )}
      >
        {icon}
      </span>

      <span className="flex flex-col items-center gap-1 text-center">
        <span
          className={classNames(
            'font-sans text-[14px] font-bold leading-tight',
            received ? 'text-brand-green' : 'text-[#b48617]'
          )}
        >
          {title}
        </span>
        {received ? (
          <span className="max-w-full break-all font-sans text-[12px] leading-4 text-brand-green max-md:text-[13px]">
            {filename}
          </span>
        ) : (
          lines.map((line) => (
            <span
              key={line}
              className="font-sans text-[12px] leading-4 text-[#959592] max-md:text-[13px]"
            >
              {line}
            </span>
          ))
        )}
      </span>

      <span
        aria-hidden="true"
        className="absolute right-[10px] top-[10px] rounded-[4px] px-2 py-[3px] font-sans text-[12px] font-semibold uppercase leading-[10.7px] tracking-[0.5px] max-md:text-[12px]"
        style={{
          backgroundColor: received ? '#e1eae2' : '#faf4e8',
          color: received ? '#387440' : '#575755',
        }}
      >
        {received ? 'Added' : 'Optional'}
      </span>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        aria-label={ariaLabel ?? title}
        onChange={(e) => {
          handleFiles(e.target.files);
          // allow re-selecting the same file
          e.target.value = '';
        }}
        className="sr-only"
      />
    </label>
  );
};

export default ParentVerificationUploadCard;
