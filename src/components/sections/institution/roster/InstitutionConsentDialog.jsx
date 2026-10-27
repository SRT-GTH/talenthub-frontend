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
 * InstitutionConsentDialog — "N students need guardian consent" (Figma 11.2.2i 8744:431724, ?modal=consent): 820 wide. Chip "Under-18s", title, text, table (Student 200 · Age 60 · Guardian 220 ·
 * Status 180; status pills: "Not asked yet" #efefea / #575755 · "Sent 12 Oct" #faf4e8 / #967014 · "Agreed 9 Oct" #ebf1ec / #387440 · "Declined" #f9ebea / #902b20),
 * the "… · n more · See all" row, the shield note and "Not now" + "Send n consent requests →".
 * Live: the under-18s of the roster (GET /api/institution/students). Send → POST /api/institution/students/consent: every under-18 with a guardian phone or
 * email who hasn't been asked (or declined) gets a link by SMS / email (public page /guardian-consent/:token, no GTH account needed). Rows without a guardian
 * contact are skipped and counted.
 * Props: onClose.
 */

const PILL = {
  none: 'bg-[#efefea] text-[#575755]',
  sent: 'bg-[#faf4e8] text-[#967014]',
  agreed: 'bg-[#ebf1ec] text-[#387440]',
  declined: 'bg-[#f9ebea] text-[#902b20]',
};
const statusText = (r) =>
  r.status === 'none'
    ? r.hasContact
      ? 'Not asked yet'
      : 'No guardian contact'
    : r.status === 'sent'
      ? `Sent ${r.date}`
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
  const waiting = rows.filter((r) => r.status !== 'agreed');
  const sendable = rows.filter(
    (r) => (r.status === 'none' || r.status === 'declined') && r.hasContact
  );
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
    const { sent = 0, noContact = 0 } = out.result || {};
    log('sent', sent, noContact);
    rosterActions.toast(
      `${sent} consent request${sent === 1 ? ' was' : 's were'} sent.${noContact ? ` ${noContact} without a guardian contact were skipped.` : ''}`
    );
    onClose();
  };
  return (
    <InstitutionDialogShell label="Students need guardian consent" onClose={onClose}>
      <InstitutionDialogHeader
        chip="Under-18s"
        title={
          waiting.length
            ? `${waiting.length} student${waiting.length === 1 ? ' needs' : 's need'} guardian consent`
            : 'Every guardian has agreed'
        }
        text="Your staff see an under-18’s GTH profile and progress only after a parent or guardian agrees. We text or email each guardian a link; they don’t need a GTH account."
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
          Until a guardian agrees, the student’s profile stays hidden from your staff. They can
          still use My Learning and Skills Lab.
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
              ? `Send ${sendable.length} consent request${sendable.length === 1 ? '' : 's'}`
              : 'Nothing to send'
        }
        onPrimary={send}
        primaryDisabled={busy || !sendable.length}
      />
    </InstitutionDialogShell>
  );
};

export default InstitutionConsentDialog;
