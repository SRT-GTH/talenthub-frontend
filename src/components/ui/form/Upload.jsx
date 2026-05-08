import { useId, useRef, useState } from 'react';
import Field from './Field.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('Upload');

/*
 * Upload — drop-zone uploader.
 * Source: Figma frame 3014:57097 ("Upload"). Variant symbols:
 *   3010:50594 default, 3010:50596 hover, 3010:50605 loading, 3010:50614 received.
 *
 * Visual ladder:
 *   default   — bg #fefefd, dashed brand-green-light-active border, white-shadow icon
 *   hover     — bg brand-green-light, dashed brand-green border, otherwise same
 *   loading   — same as hover + thin progress bar at the bottom
 *   received  — solid brand-green border, brand-green icon block (white check), "File Received"
 *
 * State derivation (highest first):
 *   forced `state` prop  →  `error`  →  `disabled`
 *   →  filename + !loading  =>  received
 *   →  progress != null     =>  loading
 *   →  drag-over (interactive) =>  hover
 *   →  default
 *
 * Native `<input type="file">` is visually hidden and clicked via the
 * "browser to choose a file" link — keyboard / screen-reader / form
 * integration is identical to a normal file input. Drop events fire on
 * the wrapping label and forward through `onFileSelect`.
 *
 * Loading + received are *consumer-managed*. The component does not own
 * upload progress — it just paints the visual that matches the props
 * you set. Pass `progress={Number}` to render the loading bar; pass
 * `filename={'foo.csv'}` to render the success state.
 */

const UploadIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M8 11V3M8 3 4.5 6.5M8 3l3.5 3.5M3 12.5V13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="m4.5 10.5 3.5 3.5L15.5 6.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const STATE_CLASSES = {
  default: 'bg-[#fefefd] border-2 border-dashed border-brand-green-light-active',
  hover: 'bg-brand-green-light border-2 border-dashed border-brand-green',
  loading: 'bg-brand-green-light border-2 border-dashed border-brand-green',
  received: 'bg-brand-green-light border-2 border-solid border-brand-green',
  error: 'bg-white border-2 border-dashed border-danger',
  disabled: 'bg-[#fefefd] border-2 border-dashed border-[#cccccc] opacity-55 cursor-not-allowed',
};

const Upload = ({
  // File-input props
  accept,
  acceptLabels,
  multiple = false,
  onFileSelect,
  // State props
  filename,
  progress,
  // Showcase / forced state
  state,
  // Field-style props
  label,
  required,
  optional,
  helperText,
  error,
  disabled = false,
  // Layout
  height = 173,
  className,
  id,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const isForced = Boolean(state);
  const effectiveDisabled = disabled || state === 'disabled';

  // Resolve which visual to paint.
  let resolvedState;
  if (isForced) {
    resolvedState = state;
  } else if (effectiveDisabled) {
    resolvedState = 'disabled';
  } else if (error) {
    resolvedState = 'error';
  } else if (filename && progress == null) {
    resolvedState = 'received';
  } else if (progress != null) {
    resolvedState = 'loading';
  } else if (dragOver) {
    resolvedState = 'hover';
  } else {
    resolvedState = 'default';
  }

  log('render', {
    label,
    resolvedState,
    progress,
    filename,
    hasError: Boolean(error),
  });

  const stateClasses = STATE_CLASSES[resolvedState] || STATE_CLASSES.default;
  const isReceived = resolvedState === 'received';

  const openFilePicker = () => {
    if (effectiveDisabled || isForced) return;
    fileInputRef.current?.click();
  };

  const handleFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const file = multiple ? Array.from(fileList) : fileList[0];
    log('files selected:', multiple ? fileList.length : fileList[0]?.name);
    onFileSelect?.(file);
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
    // Reset value so re-selecting the same file fires onChange again.
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    if (effectiveDisabled || isForced) return;
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    if (effectiveDisabled || isForced) return;
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer?.files);
  };

  // Progress bar fill — clamp 0..100.
  const pctClamped = progress != null ? Math.max(0, Math.min(100, progress)) : 0;

  return (
    <Field
      label={label}
      htmlFor={inputId}
      required={required}
      optional={optional}
      helperText={helperText}
      error={error}
      className={className}
    >
      <div
        className={classNames(
          'relative flex flex-col items-center justify-center w-full px-4 py-5 rounded-2xl gap-2',
          stateClasses,
          'transition-colors duration-150'
        )}
        style={{ minHeight: height }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...rest}
      >
        {/* Icon block */}
        <span
          className={classNames(
            'inline-flex items-center justify-center size-10 rounded-md',
            isReceived
              ? 'bg-brand-green text-white'
              : 'bg-white text-content-primary shadow-bottom-200'
          )}
          aria-hidden="true"
        >
          {isReceived ? <CheckIcon className="size-5" /> : <UploadIcon className="size-4" />}
        </span>

        {/* Headline + sub-label */}
        <div
          className={classNames(
            'flex flex-col items-center gap-1 text-center',
            isReceived ? 'text-brand-green' : 'text-content-primary'
          )}
        >
          <p className="font-sans font-bold text-[14px] leading-tight">
            {isReceived ? 'File Received' : 'Drag Your File Here'}
          </p>
          {isReceived ? (
            <p className="font-sans text-[12px] leading-4 text-brand-green">{filename}</p>
          ) : (
            <p className="font-sans text-[12px] leading-4 text-neutral-dark-hover">
              Or{' '}
              <button
                type="button"
                onClick={openFilePicker}
                disabled={effectiveDisabled}
                className="font-medium text-brand-green underline cursor-pointer disabled:cursor-not-allowed"
              >
                browse to choose a file
              </button>
            </p>
          )}
        </div>

        {/* Accept-type pills */}
        {acceptLabels && acceptLabels.length > 0 && !isReceived && resolvedState !== 'loading' && (
          <div className="flex items-center gap-1.5 mt-1">
            {acceptLabels.map((extName) => (
              <span
                key={extName}
                className="inline-flex items-center justify-center px-2 h-[21px] min-w-9 rounded-pill bg-white border border-[#e6e6e6] font-sans font-bold text-[10px] text-neutral-dark-active"
              >
                {extName}
              </span>
            ))}
          </div>
        )}

        {/* Progress bar — only in loading state */}
        {resolvedState === 'loading' && (
          <div className="absolute left-5 right-5 bottom-3 h-1 rounded-pill bg-black-light overflow-clip">
            <div
              className="h-full bg-brand-green rounded-pill transition-[width] duration-300"
              style={{ width: `${pctClamped}%` }}
              role="progressbar"
              aria-valuenow={pctClamped}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        )}

        {/* Native file input — visually hidden but accessible */}
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={effectiveDisabled}
          onChange={handleInputChange}
          aria-invalid={Boolean(error) || undefined}
          className="sr-only"
        />
      </div>
    </Field>
  );
};

export default Upload;
