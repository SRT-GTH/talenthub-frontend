import { useState } from 'react';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';

/*
 * SupportDialogs — the dialogs of Support queries (Figma canvas 8520:12), on live data.
 *   ReplyDialog    7.7.1c "Reply to <first name>": Template (In-platform · the canned replies of this request's type, from platformEnum
 *                  support_reply, already personalised) · the text (editable; a template only fills it) · "Close the query after sending" ·
 *                  "Send reply". Props: firstName, replies [{ key, label, body }], busy, error, onClose, onSend({ body, macro, close }).
 *   NoteDialog     an internal note (never shown to the requester). Props: busy, error, onClose, onSave(text).
 *   EscalateDialog 7.7.1d "Escalate this query?": Send to (the Senior Admins) · Note · Escalate + Cancel.
 *                  Props: firstName, seniors [{ userId, name, role }], busy, error, onClose, onEscalate({ to, note }).
 */

const BTN_SECONDARY =
  'inline-flex h-[56px] cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const BTN_PRIMARY =
  'inline-flex h-[56px] cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-60';
const CARD =
  'flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21] bg-white p-[clamp(16px,1.6vw,28px)] shadow-[0_24px_64px_rgba(0,0,0,0.2)]';
const LABEL = 'font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]';
const FIELD =
  'w-full rounded-[12px] border border-solid border-[#cccccc] bg-white px-[16px] py-[12px] font-sans text-[14px] leading-[21px] text-[#1c2a21] outline-none focus:border-[#387440]';

const ErrorLine = ({ error }) =>
  error ? (
    <p role="alert" className="m-0 font-sans text-[14px] text-[#b42318]">
      {error}
    </p>
  ) : null;

export const ReplyDialog = ({ firstName, replies = [], busy, error, onClose, onSend }) => {
  const [macro, setMacro] = useState('');
  const [text, setText] = useState('');
  const [closeAfter, setCloseAfter] = useState(false);
  const pickTemplate = (key) => {
    setMacro(key);
    const r = replies.find((x) => x.key === key);
    if (r) setText(r.body);
  };
  const ok = text.trim().length >= 2;
  return (
    <AgencyDialog
      label={`Reply to ${firstName}`}
      onClose={onClose}
      scrimClassName="bg-[#1c2a21]/55"
      panelClassName="w-[min(640px,calc(100vw-32px))]"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ok && !busy)
            onSend({ body: text.trim(), macro: macro || undefined, close: closeAfter });
        }}
        className={CARD}
      >
        <h2 className="m-0 font-sans text-[27px] leading-[32px] font-semibold text-[#1c2a21]">
          Reply to {firstName}
        </h2>
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="support-template" className={LABEL}>
            Template <span className="font-normal text-[#737373]">· In-platform</span>
          </label>
          <select
            id="support-template"
            value={macro}
            onChange={(e) => pickTemplate(e.target.value)}
            className={FIELD}
          >
            <option value="">No template — write your own</option>
            {replies.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="support-reply" className={LABEL}>
            Message
          </label>
          <textarea
            id="support-reply"
            data-autofocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            maxLength={5000}
            className={`${FIELD} min-h-[140px] resize-y`}
          />
          <span className="font-sans text-[12px] text-[#737373]">
            {firstName} sees this in the app and gets a notification.
          </span>
        </div>
        <label className="flex cursor-pointer items-center gap-[10px] font-sans text-[14px] leading-[17px] text-[#1c2a21]">
          <input
            type="checkbox"
            checked={closeAfter}
            onChange={(e) => setCloseAfter(e.target.checked)}
            className="size-[18px] accent-[#387440]"
          />
          Close the query after sending
        </label>
        <ErrorLine error={error} />
        <div className="flex flex-wrap justify-end gap-[10px] pt-[4px]">
          <button type="button" onClick={onClose} className={BTN_SECONDARY}>
            Cancel
          </button>
          <button type="submit" disabled={!ok || busy} className={BTN_PRIMARY}>
            {busy ? 'Sending…' : 'Send reply'}
          </button>
        </div>
      </form>
    </AgencyDialog>
  );
};

export const NoteDialog = ({ busy, error, onClose, onSave }) => {
  const [text, setText] = useState('');
  const ok = text.trim().length >= 2;
  return (
    <AgencyDialog
      label="Add an internal note"
      onClose={onClose}
      scrimClassName="bg-[#1c2a21]/55"
      panelClassName="w-[min(560px,calc(100vw-32px))]"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ok && !busy) onSave(text.trim());
        }}
        className={CARD}
      >
        <h2 className="m-0 font-sans text-[27px] leading-[32px] font-semibold text-[#1c2a21]">
          Add an internal note
        </h2>
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#575755]">
          Only staff see notes. The person who asked never does.
        </p>
        <textarea
          aria-label="Note"
          data-autofocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          maxLength={5000}
          className={`${FIELD} min-h-[100px] resize-y`}
        />
        <ErrorLine error={error} />
        <div className="flex flex-wrap gap-[10px] pt-[4px]">
          <button type="submit" disabled={!ok || busy} className={BTN_PRIMARY}>
            {busy ? 'Saving…' : 'Save note'}
          </button>
          <button type="button" onClick={onClose} className={BTN_SECONDARY}>
            Cancel
          </button>
        </div>
      </form>
    </AgencyDialog>
  );
};

export const EscalateDialog = ({ firstName, seniors = [], busy, error, onClose, onEscalate }) => {
  const [to, setTo] = useState(seniors[0]?.userId || '');
  const [note, setNote] = useState('');
  const ok = to && note.trim().length >= 5;
  return (
    <AgencyDialog
      label="Escalate this query?"
      onClose={onClose}
      scrimClassName="bg-[#1c2a21]/55"
      panelClassName="w-[min(560px,calc(100vw-32px))]"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ok && !busy) onEscalate({ to, note: note.trim() });
        }}
        className={CARD}
      >
        <h2 className="m-0 font-sans text-[27px] leading-[32px] font-semibold text-[#1c2a21]">
          Escalate this query?
        </h2>
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#575755]">
          Account changes like suspensions, merges and field overrides need a Senior Admin.{' '}
          {firstName} is told someone senior is looking.
        </p>
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="escalate-to" className={LABEL}>
            Send to
            <span aria-hidden="true" className="text-[#1d7c4d]">
              *
            </span>
          </label>
          <select
            id="escalate-to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={FIELD}
          >
            {seniors.map((s) => (
              <option key={s.userId} value={s.userId}>
                {s.name} · {s.role === 'super_admin' ? 'Super Admin' : 'Senior Admin'}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="escalate-note" className={LABEL}>
            Note
            <span aria-hidden="true" className="text-[#1d7c4d]">
              *
            </span>
          </label>
          <textarea
            id="escalate-note"
            data-autofocus
            value={note}
            placeholder="What you've checked and what's needed"
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className={`${FIELD} min-h-[88px] resize-none`}
          />
        </div>
        <ErrorLine error={error} />
        <div className="flex flex-wrap gap-[10px] pt-[4px]">
          <button type="submit" disabled={!ok || busy} className={BTN_PRIMARY}>
            {busy ? 'Escalating…' : 'Escalate'}
          </button>
          <button type="button" onClick={onClose} className={BTN_SECONDARY}>
            Cancel
          </button>
        </div>
      </form>
    </AgencyDialog>
  );
};
