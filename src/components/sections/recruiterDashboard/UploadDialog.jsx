import { useState } from 'react';
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
 * ⚠️ ASSUMPTION: no real upload happens (mock data); "Upload" stays disabled until a file is chosen, which the demo does by the `step=uploading` URL.
 * Props: org, step ('choose' | 'uploading'), onCancel, onDone.
 */
const UploadDialog = ({ org, step = 'choose', onCancel, onDone }) => {
  const [type, setType] = useState('TIN certificate');
  const uploading = step === 'uploading';
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

        {uploading ? (
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
            <div className="flex flex-col items-center gap-[6px] rounded-[16px] border border-dashed border-[#c1d4c4] bg-[#fafcfa] px-[24px] py-[32px] text-center">
              <img
                src={dashIcons.uploadDialogTile}
                alt=""
                aria-hidden="true"
                className="size-[22px]"
              />
              <p className="m-0 font-sans text-[14px] leading-[24px] text-[#111]">
                {UPLOAD_DIALOG.dropLead(type)}{' '}
                <span className="font-semibold text-[#387440]">{UPLOAD_DIALOG.browse}</span>
              </p>
            </div>
            <p className="m-0 font-sans text-[12px] leading-[20px] text-[#575755]">
              {UPLOAD_DIALOG.privacy}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-[12px]">
          <Button variant="tertiary" onClick={onCancel}>
            {UPLOAD_DIALOG.cancel}
          </Button>
          <Button variant="primary" disabled={!uploading} onClick={onDone}>
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
