import { useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import Modal from '../../ui/Modal.jsx';
import Select from '../../ui/form/Select.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { UPLOAD_DIALOG } from './recruiterDashboardData.js';

/*
 * UploadDialog — "Upload KYB documents" (Figma D51 10195:97739 choose, D52 10195:99049 uploading): a card on `ui/Modal` with a tile, title, the org + file rules,
 * a required "Document type" select (TIN certificate preselected), a dashed drop zone ("Drag & drop your TIN certificate, or browse") and the privacy line;
 * while `step="uploading"` the zone is replaced by the file rows (name, size, "Uploading · 64%" with a bar, "Queued") and the primary button reads "Uploading...".
 * Demo (signed out): no real upload happens; "Upload" stays disabled until a file is chosen, which the demo does by the `step=uploading` URL.
 * Live (onUploadFile given, US-7.3-05): "browse" or a drop picks one PDF / JPG / PNG up to 10 MB, "Upload" sends it as the chosen document
 * type through the existing KYB upload (POST /media/upload, then POST /recruiter/kyb/submit) and closes with onDone.
 * Props: org, step ('choose' | 'uploading'), onCancel, onDone, onUploadFile(file, type) (live), defaultType (live: the first missing document).
 */
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png';
const sizeLabel = (n) =>
  n >= 1024 * 1024
    ? `${(n / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(n / 1024))} KB`;
const UploadDialog = ({ org, step = 'choose', onCancel, onDone, onUploadFile, defaultType }) => {
  const live = typeof onUploadFile === 'function';
  const [type, setType] = useState(
    live && UPLOAD_DIALOG.types.includes(defaultType) ? defaultType : 'TIN certificate'
  );
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const input = useRef(null);
  const uploading = live ? busy : step === 'uploading';
  const pick = (f) => {
    if (!f) return;
    setError('');
    if (!/\.(pdf|jpe?g|png)$/i.test(f.name)) {
      setFile(null);
      setError('Use a PDF, JPG or PNG file.');
      return;
    }
    if (f.size > MAX_BYTES) {
      setFile(null);
      setError('That file is over 10 MB. Use a smaller scan.');
      return;
    }
    setFile(f);
  };
  const send = async () => {
    if (!live) {
      onDone?.();
      return;
    }
    if (!file || busy) return;
    setBusy(true);
    setError('');
    try {
      await onUploadFile(file, type);
      onDone?.();
    } catch (err) {
      setError(err?.message || 'That upload didn’t go through. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      isOpen
      onClose={onCancel}
      size="sm"
      ariaLabel={UPLOAD_DIALOG.title}
      showClose={false}
      className="!bg-[#0b1a0f]/45 !backdrop-blur-none"
      contentClassName="!max-w-[560px] !rounded-[24px] p-[24px] shadow-[0_24px_64px_rgba(15,15,10,0.18)] max-sm:p-[20px]"
    >
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start gap-[12px]">
          <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]">
            <img
              src={dashIcons.uploadDialogTile}
              alt=""
              aria-hidden="true"
              className="size-[22px]"
            />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <h2 className="m-0 font-['Bricolage_Grotesque',sans-serif] text-[24px] leading-[29px] font-semibold tracking-[-0.48px] text-[#111]">
              {UPLOAD_DIALOG.title}
            </h2>
            <p className="m-0 font-sans text-[14px] leading-[24px] text-[#575755]">
              {UPLOAD_DIALOG.subtitle(org)}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onCancel}
            className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] border-0 bg-[#fffefc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <img src={dashIcons.dialogCloseX} alt="" aria-hidden="true" className="size-[16px]" />
          </button>
        </div>

        {uploading && !live ? (
          <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
            {UPLOAD_DIALOG.files.map((file) => (
              <li
                key={file.id}
                className="flex items-start gap-[12px] rounded-[12px] border border-solid border-[#e5e8e3] p-[12px]"
              >
                <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[8px] bg-[#ebf1ec]">
                  <img
                    src={dashIcons.uploadFileRowIcon}
                    alt=""
                    aria-hidden="true"
                    className="size-[20px]"
                  />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
                  <span className="flex items-center justify-between gap-[8px]">
                    <span className="truncate font-sans text-[14px] leading-[24px] font-medium text-[#111]">
                      {file.name}
                    </span>
                    <span className="shrink-0 font-sans text-[12px] leading-[20px] text-[#575755]">
                      {file.size}
                    </span>
                  </span>
                  <span
                    role="progressbar"
                    aria-label={file.name}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={file.progress}
                    className="h-[4px] w-full overflow-hidden rounded-full bg-[#ebf1ec]"
                  >
                    <span
                      className="block h-full rounded-full bg-[#387440]"
                      style={{ width: `${file.progress}%` }}
                    />
                  </span>
                  <span
                    className={classNames(
                      'font-sans text-[12px] leading-[20px]',
                      file.progress ? 'text-[#2a5730]' : 'text-[#575755]'
                    )}
                  >
                    {file.status}
                  </span>
                </span>
                <img
                  src={dashIcons.uploadRemoveFile}
                  alt=""
                  aria-hidden="true"
                  className="size-[16px] shrink-0"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-[14px]">
            <Select
              label={UPLOAD_DIALOG.typeLabel}
              options={UPLOAD_DIALOG.types}
              value={type}
              onChange={setType}
            />
            <div
              className="flex flex-col items-center gap-[6px] rounded-[16px] border border-dashed border-[#c1d4c4] bg-[#fafcfa] px-[24px] py-[32px] text-center"
              onDragOver={live ? (e) => e.preventDefault() : undefined}
              onDrop={
                live
                  ? (e) => {
                      e.preventDefault();
                      pick(e.dataTransfer?.files?.[0]);
                    }
                  : undefined
              }
            >
              <img
                src={dashIcons.uploadDialogTile}
                alt=""
                aria-hidden="true"
                className="size-[22px]"
              />
              <p className="m-0 font-sans text-[14px] leading-[24px] text-[#111]">
                {UPLOAD_DIALOG.dropLead(type)}{' '}
                {live ? (
                  <button
                    type="button"
                    onClick={() => input.current?.click()}
                    disabled={busy}
                    className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold text-[#387440] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                  >
                    {UPLOAD_DIALOG.browse}
                  </button>
                ) : (
                  <span className="font-semibold text-[#387440]">{UPLOAD_DIALOG.browse}</span>
                )}
              </p>
              {live ? (
                <input
                  ref={input}
                  type="file"
                  accept={ACCEPT}
                  className="hidden"
                  aria-label={`Choose your ${type}`}
                  onChange={(e) => {
                    pick(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
              ) : null}
              {live && file ? (
                <p className="m-0 font-sans text-[13px] leading-[20px] font-medium text-[#2a5730]">
                  {file.name} · {sizeLabel(file.size)}
                  {busy ? ' · uploading…' : ''}
                </p>
              ) : null}
            </div>
            {error ? (
              <p role="alert" className="m-0 font-sans text-[13px] leading-[20px] text-[#902b20]">
                {error}
              </p>
            ) : null}
            <p className="m-0 font-sans text-[12px] leading-[20px] text-[#575755]">
              {UPLOAD_DIALOG.privacy}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-[12px]">
          <Button variant="tertiary" onClick={onCancel}>
            {UPLOAD_DIALOG.cancel}
          </Button>
          <Button
            variant="primary"
            disabled={live ? !file || busy : !uploading}
            onClick={live ? send : onDone}
          >
            <img
              src={dashIcons.uploadConfirmDisabledIcon}
              alt=""
              aria-hidden="true"
              className="size-[16px]"
            />
            {uploading ? UPLOAD_DIALOG.uploading : UPLOAD_DIALOG.upload}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadDialog;
