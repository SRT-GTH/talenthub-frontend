import { useEffect, useRef, useState } from 'react';
import AgencyButton from '../../../agency/AgencyButton.jsx';
import { debug } from '../../../../../utils/debug.js';
import NamePageHeading from '../names/NamePageHeading.jsx';
import SyncChip from './SyncChip.jsx';
import { CheckCircleFillIcon, LockIcon } from './SyncIcons.jsx';
import { MANUAL_SYNC_ROW, SYNC_COPY, SYNC_RELEASES } from './releaseSyncData.js';

const log = debug('SyncSectionList');

/*
 * SyncSectionList — "Section list from releases" for the Super Admin (Figma 7.8.8d: white card, r20, 24 padding, 16 gap): the title 19/600 and "Sync now"
 * (a white shelf button, 44 high), the explanation, one #f8f8f4 row (r14, 16 padding) per release — check-circle, "Release 2.4 · +1 page · +6 sections ·
 * 1 removed · 1 original changed", "Today 13:05 · by Release pipeline", chip "Synced" — and the grey lock note.
 * "Sync now" works for a Super Admin (`canSync`): it shows "Syncing…" for a moment, then adds a row on top.
 * ⚠️ ASSUMPTION: the manual sync adds the row "Manual sync · nothing new" (nothing is pending in the mock pipeline); other roles see the button off.
 * Props: canSync.
 */
const SyncSectionList = ({ canSync }) => {
  const [rows, setRows] = useState(SYNC_RELEASES);
  const [busy, setBusy] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const syncNow = () => {
    if (busy || !canSync) return;
    log('sync now');
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setRows((r) => [{ id: `manual-${r.length}`, ...MANUAL_SYNC_ROW }, ...r]);
      setBusy(false);
      log('synced');
    }, 900);
  };

  return (
    <div className="flex flex-col gap-[24px] pt-[4px]">
      <NamePageHeading title="Site copy" subtitle="Sections sync · super admin" />
      <section
        aria-label={SYNC_COPY.syncTitle}
        className="flex flex-col gap-[16px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[16px] sm:p-[24px]"
      >
        <div className="flex flex-wrap items-center justify-between gap-[10px]">
          <h2 className="m-0 font-sans text-[19px] leading-[23px] font-semibold text-[#1c2a21]">
            {SYNC_COPY.syncTitle}
          </h2>
          <AgencyButton
            size="md"
            onClick={syncNow}
            disabled={!canSync}
            aria-disabled={!canSync || busy ? 'true' : undefined}
            className="!h-[44px] max-sm:w-full sm:w-[42.5%]"
          >
            {busy ? 'Syncing…' : 'Sync now'}
          </AgencyButton>
        </div>
        <p className="m-0 font-sans text-[14px] leading-[21px] text-[#575755]">
          {SYNC_COPY.syncText}
        </p>
        <ul aria-live="polite" className="m-0 flex list-none flex-col gap-[16px] p-0">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex items-center gap-[14px] rounded-[14px] bg-[#f8f8f4] p-[16px]"
            >
              <CheckCircleFillIcon className="size-[18px] shrink-0 text-[#387440]" />
              <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                  {r.title}
                </p>
                <p className="m-0 font-sans text-[12.5px] leading-[15px] text-[#575755] max-lg:text-[12.5px]">
                  {r.meta}
                </p>
              </div>
              <SyncChip tone="synced" />
            </li>
          ))}
        </ul>
        <p className="m-0 flex items-center gap-[12px] rounded-[16px] bg-[#f8f8f4] p-[16px] font-sans text-[14px] leading-[20px] font-medium text-[#575755]">
          <LockIcon className="size-[18px] shrink-0 text-[#575755]" />
          {SYNC_COPY.syncLock}
        </p>
      </section>
    </div>
  );
};

export default SyncSectionList;
