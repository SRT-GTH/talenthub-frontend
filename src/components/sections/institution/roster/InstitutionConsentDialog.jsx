import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import InstitutionDialogActions from './InstitutionDialogActions.jsx';
import InstitutionDialogHeader from './InstitutionDialogHeader.jsx';
import InstitutionDialogShell from './InstitutionDialogShell.jsx';
import { consentRowsFor, rosterActions, useRosterStore } from './rosterStore.js';
import { Roster20ShieldIcon } from './rosterIcons.jsx';

const log = debug('InstitutionConsentDialog');

/*
 * InstitutionConsentDialog — "Guardian notices" for under-18s (Figma 11.2.2i 8744:431724, ?modal=consent; opt-out model, ADR-13): 820 wide. Chip "Under-18s", title,
 * text, table (Student 200 · Age 60 · Guardian 220 · Status 180; status pills: "No notice yet" / "No guardian contact" #efefea / #575755 · "Notified 12 Oct" #ebf1ec /
 * #387440 · "Opted out 9 Oct" #f9ebea / #902b20; older consent requests: "Sent" #faf4e8 · "Agreed" · "Declined"), the "… · n more · See all" row, the shield note and
 * "Not now" + "Send n notices →".
 * Under-18s are active from the start; each guardian gets a notice (SMS and / or email) with a link to opt out (public page /guardian-consent/:token, no GTH
 * account needed). Send → POST /api/institution/students/consent: every under-18 with a guardian contact whose guardian wasn't told yet. A guardian who opted
 * out is never written to again. Rows without a guardian contact are skipped and counted.
 * Props: onClose.
 */

const PILL = {
  none: 'bg-[#efefea] text-[#575755]',
  sent: 'bg-[#faf4e8] text-[#967014]',
  agreed: 'bg-[#ebf1ec] text-[#387440]',
  notified: 'bg-[#ebf1ec] text-[#387440]',
  declined: 'bg-[#f9ebea] text-[#902b20]',
  'opted-out': 'bg-[#f9ebea] text-[#902b20]',
};
const statusText = (r) =>
  r.status === 'none'
    ? r.hasContact
      ? 'No notice yet'
      : 'No guardian contact'
    : r.status === 'notified'
      ? `Notified ${r.date}`
      : r.status === 'opted-out'
        ? `Opted out ${r.date}`
        : r.status === 'sent'
          ? `Asked ${r.date}`
          : r.status === 'declined'
            ? `Declined ${r.date}`
            : `Agreed ${r.date}`;
const FIRST = 4;

const GRID =
  'grid grid-cols-[minmax(0,1.1fr)_40px_minmax(0,1.6fr)_minmax(0,1fr)] items-center gap-x-[12px] md:grid-cols-[200px_60px_220px_180px] md:gap-x-0';

const InstitutionConsentDialog = ({ onClose }) => {
  const store = useRosterStore();
  const [all, setAll] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');
  const rows = consentRowsFor(store);
  const waiting = rows.filter((r) => r.status === 'none' || r.status === 'sent');
  const sendable = rows.filter((r) => (r.status === 'none' || r.status === 'sent') && r.hasContact);
  const shown = all ? rows : rows.slice(0, FIRST);
  const send = async () => {
    if (busy) return;
    setBusy(true);
    const out = await rosterActions.sendConsent(sendable.map((r) => r.id));
    setBusy(false);
    if (!out.ok) {
      setProblem(out.message);
      return;
    }
    const { sent = 0, noContact = 0, failed = 0 } = out.result || {};
    log('sent', sent, noContact, failed);
    rosterActions.toast(
      `${sent} guardian notice${sent === 1 ? ' was' : 's were'} sent.${noContact ? ` ${noContact} without a guardian contact were skipped.` : ''}${failed ? ` ${failed} couldn’t be delivered yet; try again later.` : ''}`
    );
    onClose();
  };
  return (
    <InstitutionDialogShell label="Guardian notices for under-18s" onClose={onClose}>
      <InstitutionDialogHeader
        chip="Under-18s"
        title={
          waiting.length
            ? `${waiting.length} guardian${waiting.length === 1 ? ' hasn’t' : 's haven’t'} been told yet`
            : 'Every guardian with a contact has been told'
        }
        text="Students under 18 are active from the start. We text or email each parent or guardian a notice with a link to opt out if they have concerns; they don’t need a GTH account."
      />
      <div className="flex flex-col gap-[14px]">
        {rows.length ? (
          <div
            role="table"
            aria-label="Students under 18"
            className="max-h-[380px] max-w-[660px] overflow-y-auto font-sans text-[14px] leading-[17px] text-[#1c2a21]"
          >
            <div
              role="row"
              className={classNames(
                GRID,
                'border-b border-solid border-[#e7e7e7] pb-[10px] text-[12px] leading-[14px] font-medium text-[#575755]'
              )}
            >
              <span role="columnheader">Student</span>
              <span role="columnheader">Age</span>
              <span role="columnheader">Guardian</span>
              <span role="columnheader">Status</span>
            </div>
            {shown.map((r) => (
              <div
                key={r.id}
                role="row"
                className={classNames(GRID, 'border-b border-solid border-[#f1f1f1] py-[11px]')}
              >
                <span role="cell" className="font-medium">
                  {r.name}
                </span>
                <span role="cell">{r.age ?? '–'}</span>
                <span role="cell" className="pr-[8px]">
                  {r.guardian}
                </span>
                <span role="cell">
                  <span
                    className={classNames(
                      'inline-flex items-center rounded-full px-[8px] py-[3px] text-[12px] leading-[14px] font-semibold',
                      PILL[r.status]
                    )}
                  >
                    {statusText(r)}
                  </span>
                </span>
              </div>
            ))}
            {all || rows.length <= FIRST ? null : (
              <div role="row" className={classNames(GRID, 'py-[11px]')}>
                <span role="cell" className="font-medium">
                  …
                </span>
                <span role="cell" className="col-span-2 md:col-span-1">
                  {rows.length - FIRST} more
                </span>
                <span role="cell" className="hidden md:block" />
                <span role="cell">
                  <button
                    type="button"
                    onClick={() => setAll(true)}
                    className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] leading-[16px] font-semibold text-[#387440] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                  >
                    See all
                  </button>
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="m-0 font-sans text-[14px] text-[#595959]">
            No students under 18 are on your roster.
          </p>
        )}
        <p className="m-0 flex items-start gap-[8px] font-sans text-[13px] leading-[16px] text-[#575755]">
          <Roster20ShieldIcon className="mt-px size-[16px] shrink-0" />
          If a guardian opts out, the student’s access is paused and your staff no longer see their
          profile. Add a guardian contact for students marked “No guardian contact”.
        </p>
      </div>
      <p role="alert" className="m-0 font-sans text-[14px] leading-[20px] text-danger empty:hidden">
        {problem}
      </p>
      <InstitutionDialogActions
        cancelLabel="Not now"
        onCancel={onClose}
        primaryLabel={
          busy
            ? 'Sending…'
            : sendable.length
              ? `Send ${sendable.length} notice${sendable.length === 1 ? '' : 's'}`
              : 'Nothing to send'
        }
        onPrimary={send}
        primaryDisabled={busy || !sendable.length}
      />
    </InstitutionDialogShell>
  );
};

export default InstitutionConsentDialog;
