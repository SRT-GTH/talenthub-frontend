import { useState } from 'react';
import AdminConfirmDialog from '../../ui/AdminConfirmDialog.jsx';
import AdminLoadNotice from '../../AdminLoadNotice.jsx';
import { useAdminData } from '../../useAdminData.js';
import { TextAction } from '../../../talentSettings/SettingsBUi.jsx';
import { adminError, catFxStatus, catFxSync } from '../../../../../services/admin.api.js';
import { Btn, Chip, Note, ReasonInput } from './shared.jsx';
import { useReasonRun } from './useReasonRun.js';

/*
 * Automatic exchange rates (fxRates service): provider, schedule, last runs, dry run / update now.
 * Moves above the safe limit (25%) are held: "Review" opens the rate dialog prefilled so an admin confirms.
 */

const pct = (x) => (x == null ? '' : `${x > 0 ? '+' : ''}${(x * 100).toFixed(1)}%`);
const when = (d) =>
  d
    ? new Date(d).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '–';
const runLine = (r) =>
  r.status === 'failed'
    ? `Failed: ${r.error}`
    : `${r.applied?.length || 0} ${r.dryRun ? 'would change' : 'updated'} · ${r.held?.length || 0} ${
        r.dryRun ? 'would be held' : 'held'
      } for review · ${r.unchanged || 0} unchanged${
        r.skipped?.length ? ` · ${r.skipped.length} pinned` : ''
      }${r.missing?.length ? ` · not offered: ${r.missing.join(', ')}` : ''}`;

const FxAutoUpdatePanel = ({ canEdit, toast, onReview, onChanged, currencies = [] }) => {
  const st = useAdminData(() => catFxStatus(), []);
  const s = st.data;
  const [checking, setChecking] = useState(false);
  const [preview, setPreview] = useState(null);
  const [checkError, setCheckError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const r = useReasonRun(toast, () => {
    setConfirming(false);
    setPreview(null);
    st.reload();
    onChanged?.();
  });

  const dryRun = async () => {
    setChecking(true);
    setCheckError('');
    try {
      const out = await catFxSync({ dryRun: true });
      setPreview(out);
      st.reload();
    } catch (e) {
      setCheckError(e?.response ? adminError(e) : e.message);
    } finally {
      setChecking(false);
    }
  };

  const last = s?.runs?.find((x) => !x.dryRun) || null;
  // Held moves from the last real run that are still open (not since applied by hand, not pinned).
  const current = Object.fromEntries(currencies.map((c) => [c.code, c]));
  const held = (last?.held || []).filter(
    (h) => current[h.code] && !current[h.code].ratePinned && current[h.code].exchangeRate !== h.to
  );
  const shown = preview || null;

  return (
    <div className="mb-[14px] flex flex-col gap-[10px] rounded-[16px] border border-solid border-[#e1eae2] bg-[#fbfcfa] p-[14px]">
      <AdminLoadNotice loading={st.loading} error={st.error} status={st.status} onRetry={st.reload}>
        {s ? (
          <>
            <div className="flex flex-wrap items-center gap-[8px] font-sans text-[14px] text-[#1c2a21]">
              <span className="font-semibold">Automatic updates</span>
              {s.enabled ? <Chip tone="good">On · {s.schedule} UTC</Chip> : <Chip>Off</Chip>}
              <span className="text-[#595959]">Source: {s.providerLabel}</span>
              {!s.keyConfigured ? <Chip tone="warn">{s.keyEnv} not set</Chip> : null}
            </div>
            <p className="m-0 font-sans text-[13px] text-[#595959]">
              {s.enabled
                ? 'Rates update once a day. '
                : 'The daily schedule is off (server setting FX_AUTO_UPDATE_ENABLED=1 turns it on). You can still update now. '}
              Changes over {Math.round(s.maxAutoChange * 100)}% are held for you to confirm, and
              pinned rates are never changed.
              {s.attribution ? (
                <>
                  {' '}
                  <a
                    href={s.attribution.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#387440] underline"
                  >
                    {s.attribution.text}
                  </a>
                  .
                </>
              ) : null}
            </p>
            {last ? (
              <p className="m-0 font-sans text-[13px] text-[#3b3b3b]">
                Last update {when(last.startedAt)} ({last.triggeredBy}): {runLine(last)}
              </p>
            ) : (
              <p className="m-0 font-sans text-[13px] text-[#737373]">
                No automatic update has run yet.
              </p>
            )}
            {canEdit ? (
              <div className="flex flex-wrap gap-[10px]">
                <Btn onClick={dryRun} disabled={checking || !s.keyConfigured}>
                  {checking ? 'Checking…' : 'Check rates now'}
                </Btn>
                <Btn
                  primary
                  disabled={!s.keyConfigured}
                  onClick={() => {
                    r.reset();
                    setConfirming(true);
                  }}
                >
                  Update rates now
                </Btn>
              </div>
            ) : null}
            {checkError ? (
              <p className="m-0 font-sans text-[14px] text-[#b42318]">{checkError}</p>
            ) : null}
            {shown ? (
              <Note tone={shown.status === 'failed' ? 'warn' : 'info'}>
                <span className="font-semibold">Check (nothing saved):</span> {runLine(shown)}
                {shown.applied?.length || shown.held?.length ? (
                  <ul className="m-0 mt-[6px] list-none p-0">
                    {(shown.applied || []).map((a) => (
                      <li key={a.code}>
                        {a.code}: {a.from} → {a.to} ({pct(a.change)})
                      </li>
                    ))}
                    {(shown.held || []).map((a) => (
                      <li key={a.code}>
                        {a.code}: {a.from} → {a.to} ({pct(a.change)}) · would be held for review
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Note>
            ) : null}
            {held.length ? (
              <Note tone="warn">
                <span className="font-semibold">Held for review</span> (moved more than{' '}
                {Math.round(s.maxAutoChange * 100)}%):
                <ul className="m-0 mt-[6px] flex list-none flex-col gap-[4px] p-0">
                  {held.map((h) => (
                    <li key={h.code} className="flex flex-wrap items-center gap-[10px]">
                      <span>
                        {h.code}: {h.from} → {h.to} ({pct(h.change)})
                      </span>
                      {canEdit ? (
                        <TextAction tone="green" onClick={() => onReview(h.code, h.to)}>
                          Review
                        </TextAction>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Note>
            ) : null}
          </>
        ) : null}
      </AdminLoadNotice>

      {confirming ? (
        <AdminConfirmDialog
          title="Update rates now?"
          body={`Fetches today’s rates from ${s?.providerLabel}. Moves over ${Math.round((s?.maxAutoChange || 0.25) * 100)}% are held for review; pinned rates stay.`}
          primary={{ label: r.busy ? 'Updating…' : 'Update rates', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            r.run(
              async () => {
                const out = await catFxSync({ dryRun: false, reason: r.reason.trim() });
                if (out.status === 'failed') throw new Error(out.error || 'The update failed.');
                setPreview(null);
                return out;
              },
              'Rates updated',
              ''
            )
          }
          onClose={() => setConfirming(false)}
        >
          <ReasonInput
            value={r.reason}
            onChange={r.setReason}
            error={r.error}
            placeholder="e.g. Rates were months old"
          />
        </AdminConfirmDialog>
      ) : null}
    </div>
  );
};

export default FxAutoUpdatePanel;
