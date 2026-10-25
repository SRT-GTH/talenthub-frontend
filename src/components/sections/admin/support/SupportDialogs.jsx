import { useState } from 'react';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { ESCALATE, REPLY } from './data/adminSupportData.js';

/*
 * SupportDialogs — the two dialogs of Support queries (Figma canvas 8520:12).
 *   ReplyDialog    7.7.1c 8666:417042 "Modal · Send feedback": "Reply to Kofi" · Template (In-platform · "2-step reset done" · Change template) · the template text ·
 *                  "Close the query after sending" checkbox · "Send reply". Props: onClose, onSend({ close }), onChangeTemplate.
 *   EscalateDialog 7.7.1d 8666:417619: "Escalate this query?" · "Send to *" (Akua Sarfo · Senior Admin) · "Note" (pre-filled) · Escalate + Cancel. Props: onClose, onEscalate({ note }).
 * ⚠️ ASSUMPTION: "Change template" only logs (no template list is drawn); the "Send to" field is a fixed read-only value (one Senior Admin is drawn).
 */

const BTN_SECONDARY =
  'inline-flex h-[56px] cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const BTN_PRIMARY =
  'inline-flex h-[56px] cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const CARD =
  'flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21] bg-white p-[clamp(16px,1.6vw,28px)] shadow-[0_24px_64px_rgba(0,0,0,0.2)]';
const LABEL = 'font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]';

export const ReplyDialog = ({ onClose, onSend, onChangeTemplate }) => {
  const [closeAfter, setCloseAfter] = useState(true);
  return (
    <AgencyDialog
      label={REPLY.title}
      onClose={onClose}
      scrimClassName="bg-[#1c2a21]/55"
      panelClassName="w-[min(640px,calc(100vw-32px))]"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend({ close: closeAfter });
        }}
        className={CARD}
      >
        <h2 className="m-0 font-sans text-[27px] leading-[32px] font-semibold text-[#1c2a21]">
          {REPLY.title}
        </h2>
        <div className="flex flex-col gap-[8px]">
          <span className={LABEL}>{REPLY.templateLabel}</span>
          <div className="flex flex-wrap items-center gap-[10px]">
            <span className="inline-flex rounded-full border border-solid border-[#e1eae2] bg-[#f8f8f4] px-[12px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959]">
              {REPLY.channel}
            </span>
            <span className="inline-flex rounded-full border border-solid border-[#1c2a21] bg-[#1c2a21] px-[14px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold text-white">
              {REPLY.template}
            </span>
            <button
              type="button"
              onClick={onChangeTemplate}
              className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] leading-[16px] font-semibold text-[#387440] underline"
            >
              {REPLY.change}
            </button>
          </div>
        </div>
        <p className="m-0 rounded-[12px] border border-solid border-[#cccccc] bg-white px-[16px] py-[12px] font-sans text-[14px] leading-[21px] text-[#1c2a21]">
          {REPLY.body}
        </p>
        <label className="flex cursor-pointer items-center gap-[10px] font-sans text-[14px] leading-[17px] text-[#1c2a21]">
          <input
            type="checkbox"
            checked={closeAfter}
            onChange={(e) => setCloseAfter(e.target.checked)}
            className="size-[18px] accent-[#387440]"
          />
          {REPLY.close}
        </label>
        <div className="flex justify-end pt-[4px]">
          <button type="submit" data-autofocus className={BTN_PRIMARY}>
            {REPLY.send}
          </button>
        </div>
      </form>
    </AgencyDialog>
  );
};

export const EscalateDialog = ({ onClose, onEscalate }) => {
  const [note, setNote] = useState(ESCALATE.note);
  return (
    <AgencyDialog
      label={ESCALATE.title}
      onClose={onClose}
      scrimClassName="bg-[#1c2a21]/55"
      panelClassName="w-[min(560px,calc(100vw-32px))]"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onEscalate({ note });
        }}
        className={CARD}
      >
        <h2 className="m-0 font-sans text-[27px] leading-[32px] font-semibold text-[#1c2a21]">
          {ESCALATE.title}
        </h2>
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#575755]">{ESCALATE.body}</p>
        <div className="flex flex-col gap-[8px]">
          <span className={LABEL}>
            {ESCALATE.toLabel}
            <span aria-hidden="true" className="text-[#1d7c4d]">
              *
            </span>
          </span>
          <div className="rounded-[12px] border border-solid border-[#cccccc] bg-white px-[16px] py-[12px] font-sans text-[14px] leading-[21px] text-[#1c2a21]">
            {ESCALATE.to}
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="escalate-note" className={LABEL}>
            {ESCALATE.noteLabel}
          </label>
          <textarea
            id="escalate-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="min-h-[88px] w-full resize-none rounded-[12px] border border-solid border-[#cccccc] bg-white px-[16px] py-[12px] font-sans text-[14px] leading-[21px] text-[#1c2a21] outline-none focus:border-[#387440]"
          />
        </div>
        <div className="flex flex-wrap gap-[10px] pt-[4px]">
          <button type="submit" data-autofocus className={BTN_PRIMARY}>
            {ESCALATE.primary}
          </button>
          <button type="button" onClick={onClose} className={BTN_SECONDARY}>
            {ESCALATE.secondary}
          </button>
        </div>
      </form>
    </AgencyDialog>
  );
};
