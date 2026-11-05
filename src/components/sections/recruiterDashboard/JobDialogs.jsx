import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import Modal from '../../ui/Modal.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { CLOSE_DIALOG, PAUSE_DIALOG } from './recruiterDashboardData.js';

/*
 * JobDialogs — the two confirmations behind a job row's "⋯" menu (Figma 10084:81316 "Pause Marketing Intern?", 10084:82752 "Close Marketing Intern?").
 * Both are 520px cards on `ui/Modal` (scrim, Esc, focus lock): a 44px icon tile, a 24/600 title, a 14px line, content, and Cancel + the confirm action.
 * Pause: amber tile, three consequences, green "Pause job". Close: red tile, a required reason (radio list, "Position filled" preselected), an opt-out checkbox, red "Close job".
 * Props (both): job { title, applicants, pipeline }, onCancel, onConfirm.
 */
const DIALOG_CLASS =
  '!max-w-[520px] !rounded-[24px] p-[24px] shadow-[0_24px_64px_rgba(15,15,10,0.18)] max-sm:p-[20px]';

const Header = ({ tone, icon, title, children, onClose }) => (
  <div className="flex items-start gap-[16px]">
    <span
      className={classNames(
        'flex size-[44px] shrink-0 items-center justify-center rounded-[12px]',
        tone === 'danger' ? 'bg-[#f9ebea]' : 'bg-[#faf4e8]'
      )}
    >
      <img src={icon} alt="" aria-hidden="true" className="size-[22px]" />
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
      <h2 className="m-0 font-sans text-[24px] leading-[29px] font-semibold text-[#111] max-sm:text-[20px] max-sm:leading-[26px]">
        {title}
      </h2>
      <p className="m-0 font-sans text-[14px] leading-[24px] text-[#575755]">{children}</p>
    </div>
    <button
      type="button"
      aria-label="Close dialog"
      onClick={onClose}
      className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] border-0 bg-[#fffefc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      <img src={dashIcons.dialogCloseX} alt="" aria-hidden="true" className="size-[16px]" />
    </button>
  </div>
);

const GhostButton = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex h-[40px] cursor-pointer items-center rounded-[10px] border border-solid border-[#1c2a21]/30 bg-white px-[16px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
  >
    {children}
  </button>
);

export const PauseJobDialog = ({ job, onCancel, onConfirm }) => (
  <Modal
    isOpen
    onClose={onCancel}
    size="sm"
    ariaLabel={PAUSE_DIALOG.title(job.title)}
    showClose={false}
    className="!bg-[#0b1a0f]/45 !backdrop-blur-none"
    contentClassName={DIALOG_CLASS}
  >
    <div className="flex flex-col gap-[20px]">
      <Header
        tone="warning"
        icon={dashIcons.dialogPauseTile}
        title={PAUSE_DIALOG.title(job.title)}
        onClose={onCancel}
      >
        {PAUSE_DIALOG.body(job.applicants)}
      </Header>
      <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
        {PAUSE_DIALOG.points.map((point) => (
          <li
            key={point.text}
            className="flex items-center gap-[12px] font-sans text-[14px] leading-[24px] text-[#111]"
          >
            <img
              src={dashIcons[point.icon]}
              alt=""
              aria-hidden="true"
              className="size-[18px] shrink-0"
            />
            {point.text}
          </li>
        ))}
      </ul>
      <div className="flex justify-end gap-[12px]">
        <GhostButton onClick={onCancel}>{PAUSE_DIALOG.cancel}</GhostButton>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex h-[40px] cursor-pointer items-center gap-[8px] rounded-[10px] border-0 bg-[#387440] px-[16px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-white shadow-[0_3px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <img
            src={dashIcons.dialogPauseConfirmButton}
            alt=""
            aria-hidden="true"
            className="size-[16px]"
          />
          {PAUSE_DIALOG.confirm}
        </button>
      </div>
    </div>
  </Modal>
);

export const CloseJobDialog = ({ job, onCancel, onConfirm }) => {
  const [reason, setReason] = useState(CLOSE_DIALOG.reasons[0]);
  const [notify, setNotify] = useState(true);
  return (
    <Modal
      isOpen
      onClose={onCancel}
      size="sm"
      ariaLabel={CLOSE_DIALOG.title(job.title)}
      showClose={false}
      className="!bg-[#0b1a0f]/45 !backdrop-blur-none"
      contentClassName={DIALOG_CLASS}
    >
      <div className="flex flex-col gap-[20px]">
        <Header
          tone="danger"
          icon={dashIcons.dialogCloseJobTile}
          title={CLOSE_DIALOG.title(job.title)}
          onClose={onCancel}
        >
          {CLOSE_DIALOG.body}
        </Header>

        <fieldset className="m-0 flex min-w-0 flex-col gap-[12px] border-0 p-0">
          <legend className="p-0 pb-[12px] font-sans text-[14px] leading-[24px] font-medium text-[#111]">
            {CLOSE_DIALOG.reasonLabel}
          </legend>
          {CLOSE_DIALOG.reasons.map((label) => {
            const selected = reason === label;
            return (
              <label
                key={label}
                className={classNames(
                  'flex min-h-[52px] cursor-pointer items-center gap-[12px] rounded-[10px] border border-solid px-[16px] font-sans text-[14px] leading-[24px] text-[#111] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-green',
                  selected
                    ? 'border-[#387440] bg-[#ebf1ec]/60 font-medium'
                    : 'border-[#dbded9] bg-white'
                )}
              >
                <input
                  type="radio"
                  name="close-reason"
                  value={label}
                  checked={selected}
                  onChange={() => setReason(label)}
                  className="size-[16px] accent-[#387440]"
                />
                {label}
              </label>
            );
          })}
        </fieldset>

        <label className="flex cursor-pointer items-center gap-[10px] font-sans text-[14px] leading-[24px] text-[#111]">
          <input
            type="checkbox"
            checked={notify}
            onChange={(event) => setNotify(event.target.checked)}
            className="size-[16px] accent-[#387440]"
          />
          {CLOSE_DIALOG.notify(job.pipeline)}
        </label>

        <div className="flex justify-end gap-[12px]">
          <GhostButton onClick={onCancel}>{CLOSE_DIALOG.cancel}</GhostButton>
          <button
            type="button"
            onClick={() => onConfirm({ reason, notify })}
            className="inline-flex h-[40px] cursor-pointer items-center gap-[8px] rounded-[10px] border-0 bg-[#c0392b] px-[16px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-white shadow-[0_3px_0_#902b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <img
              src={dashIcons.dialogCloseJobConfirmButton}
              alt=""
              aria-hidden="true"
              className="size-[16px]"
            />
            {CLOSE_DIALOG.confirm}
          </button>
        </div>
      </div>
    </Modal>
  );
};
