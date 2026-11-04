import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import MediaButton from './MediaButton.jsx';
import MediaDialogShell from './MediaDialogShell.jsx';
import { MediaFile16Icon, MediaFile21Icon, MediaFile30Icon } from './MediaIcons.jsx';
import { ACCEPT_ATTR, formatBytes } from './mediaLibraryModel.js';

const log = debug('MediaUploadDialog');

/*
 * MediaUploadDialog — "Upload to the media library" (Figma 7.8.9b): 560 modal, dashed #387440 drop zone (#f8f8f4, r16) "Drop files here, or browse" +
 * the limits, one row per file (name · "3.0 MB · 64%" · 6px progress bar), the WebP / AVIF note, then Cancel / "Next: describe it". The drop zone is a real
 * file picker (click, Enter / Space, or drag and drop). Progress is simulated (useMediaUploads). `autoPick` opens the picker when the dialog opens
 * from the "Upload your first file" button.
 * ⚠️ ASSUMPTION: "Next: describe it" finishes any upload still in progress (mock) and moves on to the details dialog; it is disabled while nothing is queued.
 * Props: queue, onFiles(FileList), onCancel, onNext, onClose.
 */
const MediaUploadDialog = ({ queue, onFiles, onCancel, onNext, onClose }) => {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  useEffect(() => {
    log('open', { queued: queue.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = () => inputRef.current?.click();
  const empty = queue.length === 0;

  return (
    <MediaDialogShell
      title="Upload to the media library"
      icon={<MediaFile21Icon className="size-[21px]" />}
      onClose={onClose}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTR}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        data-testid="media-file-input"
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={pick}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          log('dropped', e.dataTransfer.files.length);
          onFiles(e.dataTransfer.files);
        }}
        className={classNames(
          'flex w-full cursor-pointer flex-col items-center gap-[10px] rounded-[16px] border-2 border-dashed border-[#387440] p-[clamp(20px,5vw,32px)] text-center font-sans focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
          over ? 'bg-[#ebf1ec]' : 'bg-[#f8f8f4]'
        )}
      >
        <MediaFile30Icon className="size-[30px] text-[#27522e]" />
        <span className="text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
          Drop files here, or browse
        </span>
        <span className="text-[13px] leading-[16px] text-[#575755]">
          JPEG, PNG, WebP, AVIF or GIF up to 8 MB · PDF up to 10 MB
        </span>
      </button>
      {queue.length ? (
        <ul className="m-0 flex list-none flex-col gap-[8px] p-0" aria-label="Files to upload">
          {queue.map((q) => (
            <li
              key={q.id}
              className="flex flex-col gap-[8px] rounded-[12px] border border-solid border-[#e7e7e7] p-[14px]"
            >
              <div className="flex items-center gap-[10px]">
                <MediaFile16Icon className="size-[16px] shrink-0 text-[#1c2a21]" />
                <span className="min-w-0 flex-1 truncate text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                  {q.name}
                </span>
                <span className="shrink-0 text-[12.5px] leading-[15px] font-medium text-[#575755]">
                  {formatBytes(q.bytes)} · {q.progress}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={`Uploading ${q.name}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={q.progress}
                className="h-[6px] w-full overflow-hidden rounded-full bg-[#e7e7e7]"
              >
                <div
                  className="h-full rounded-full bg-[#387440] transition-[width] duration-150 motion-reduce:transition-none"
                  style={{ width: `${q.progress}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="m-0 text-[13px] leading-[16px] text-[#575755]">
        We keep your original and serve smaller WebP or AVIF copies sized for each device.
      </p>
      <div className="flex gap-[12px] max-sm:flex-col-reverse">
        <MediaButton variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </MediaButton>
        <MediaButton
          className="flex-1"
          onClick={onNext}
          aria-disabled={empty || undefined}
          disabled={empty}
        >
          Next: describe it
        </MediaButton>
      </div>
    </MediaDialogShell>
  );
};

export default MediaUploadDialog;
