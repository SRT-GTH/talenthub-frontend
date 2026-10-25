import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import InstitutionDialogActions from './InstitutionDialogActions.jsx';
import InstitutionDialogHeader from './InstitutionDialogHeader.jsx';
import InstitutionDialogShell from './InstitutionDialogShell.jsx';
import { CONSENT_MORE, CONSENT_TOTAL } from './data/rosterData.js';
import { consentRowsFor, rosterActions, useRosterStore } from './rosterStore.js';
import { Roster20ShieldIcon } from './rosterIcons.jsx';

const log = debug('InstitutionConsentDialog');

/*
 * InstitutionConsentDialog — "41 students need guardian consent" (Figma 11.2.2i 8744:431724, ?modal=consent): 820 wide. Chip "Under-18s", title, text, table (Student 200 · Age 60 · Guardian 220 ·
 * Status 180; header 12/14 500 #575755, rows 14/17 with a #f1f1f1 rule; status pills 12/14 600: "Not asked yet" #efefea / #575755 · "Sent 12 Oct" #faf4e8 / #967014 · "Agreed 9 Oct" #ebf1ec / #387440),
 * the "… · 37 more · See all" row, the shield note and "Not now" + "Send 41 consent requests →".
 * "See all" lists the other 37 under-18s (⚠️ ASSUMPTION: sample rows). Send → MOCK POST /institution/consent-requests → every "Not asked yet" becomes "Sent <today>" and a status line says so.
 * Props: onClose.
 */

const PILL = {
  none: 'bg-[#efefea] text-[#575755]',
  sent: 'bg-[#faf4e8] text-[#967014]',
  agreed: 'bg-[#ebf1ec] text-[#387440]',
};
const statusText = (r) =>
  r.status === 'none'
    ? 'Not asked yet'
    : r.status === 'sent'
      ? `Sent ${r.date}`
      : `Agreed ${r.date}`;

const GRID =
  'grid grid-cols-[minmax(0,1.1fr)_40px_minmax(0,1.6fr)_minmax(0,1fr)] items-center gap-x-[12px] md:grid-cols-[200px_60px_220px_180px] md:gap-x-0';

const InstitutionConsentDialog = ({ onClose }) => {
  const store = useRosterStore();
  const [all, setAll] = useState(false);
  const rows = consentRowsFor(store);
  const more = all ? CONSENT_MORE : [];
  const send = () => {
    log('send (mock)', CONSENT_TOTAL);
    rosterActions.markConsentSent();
    rosterActions.toast(`${CONSENT_TOTAL} consent requests were sent.`);
    onClose();
  };
  return (
    <InstitutionDialogShell label="Students need guardian consent" onClose={onClose}>
      <InstitutionDialogHeader
        chip="Under-18s"
        title={`${CONSENT_TOTAL} students need guardian consent`}
        text="Students under 18 can only appear to recruiters and programmes after a parent or guardian agrees. We text and email each guardian a link; they don’t need a GTH account."
      />
      <div className="flex flex-col gap-[14px]">
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
          {[...rows, ...more].map((r) => (
            <div
              key={r.id}
              role="row"
              className={classNames(GRID, 'border-b border-solid border-[#f1f1f1] py-[11px]')}
            >
              <span role="cell" className="font-medium">
                {r.name}
              </span>
              <span role="cell">{r.age}</span>
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
          {all ? null : (
            <div role="row" className={classNames(GRID, 'py-[11px]')}>
              <span role="cell" className="font-medium">
                …
              </span>
              <span role="cell" className="col-span-2 md:col-span-1">
                {CONSENT_TOTAL - rows.length} more
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
        <p className="m-0 flex items-start gap-[8px] font-sans text-[13px] leading-[16px] text-[#575755]">
          <Roster20ShieldIcon className="mt-px size-[16px] shrink-0" />
          Until a guardian agrees, the student’s profile stays private. They can still use My
          Learning and Skills Lab.
        </p>
      </div>
      <InstitutionDialogActions
        cancelLabel="Not now"
        onCancel={onClose}
        primaryLabel={`Send ${CONSENT_TOTAL} consent requests`}
        onPrimary={send}
        primaryDisabled={store.consentSent}
      />
    </InstitutionDialogShell>
  );
};

export default InstitutionConsentDialog;
