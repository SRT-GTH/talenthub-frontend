import { useEffect, useState } from 'react';
import AdminConfirmDialog from '../../ui/AdminConfirmDialog.jsx';
import AdminLoadNotice from '../../AdminLoadNotice.jsx';
import { useAdminData } from '../../useAdminData.js';
import { adminError, catCoordsRun, catCoordsStatus } from '../../../../../services/admin.api.js';
import { Btn, Chip, Note, ReasonInput } from './shared.jsx';
import { useReasonRun } from './useReasonRun.js';

/*
 * Coordinates for locations (locationGeocode service): how many have them, the source (OpenStreetMap via Nominatim,
 * 1 lookup a second), a preview of the next 5 lookups (nothing saved) and "Add missing coordinates", which runs in the
 * background and is followed here until it finishes. Coordinates typed by an admin are never replaced.
 */

const when = (d) =>
  d
    ? new Date(d).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '–';
const TYPE_ORDER = ['country', 'region', 'district', 'city', 'area'];
const plural = (t, n) =>
  t === 'city' ? (n === 1 ? 'city' : 'cities') : `${t}${n === 1 ? '' : 's'}`;

const CoordinatesPanel = ({ canEdit, toast, onChanged }) => {
  const st = useAdminData(() => catCoordsStatus(), []);
  const s = st.data;
  const [preview, setPreview] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const r = useReasonRun(toast, () => {
    setConfirming(false);
    st.reload();
  });
  const running = s?.running && !s.running.dryRun ? s.running : null;

  // Follow a background run: refresh every 4 s until it ends, then reload the list once.
  useEffect(() => {
    if (!running) return undefined;
    const t = setTimeout(st.reload, 4000);
    return () => clearTimeout(t);
  }, [running, st]);
  const [wasRunning, setWasRunning] = useState(false);
  useEffect(() => {
    if (running && !wasRunning) setWasRunning(true);
    if (!running && wasRunning) {
      setWasRunning(false);
      onChanged?.();
    }
  }, [running, wasRunning, onChanged]);

  const check = async () => {
    setChecking(true);
    setCheckError('');
    try {
      setPreview(await catCoordsRun({ dryRun: true }));
    } catch (e) {
      setCheckError(e?.response ? adminError(e) : e.message);
    } finally {
      setChecking(false);
    }
  };

  const last = s?.runs?.find((x) => !x.dryRun) || null;
  const c = s?.coverage;

  return (
    <div className="mb-[14px] flex flex-col gap-[10px] rounded-[16px] border border-solid border-[#e1eae2] bg-[#fbfcfa] p-[14px]">
      <AdminLoadNotice
        loading={st.loading && !s}
        error={st.error}
        status={st.status}
        onRetry={st.reload}
      >
        {s ? (
          <>
            <div className="flex flex-wrap items-center gap-[8px] font-sans text-[14px] text-[#1c2a21]">
              <span className="font-semibold">Coordinates</span>
              <Chip tone={c.missing ? 'warn' : 'good'}>
                {c.withCoordinates} of {c.total} have them
              </Chip>
              <span className="text-[#595959]">Source: {s.provider.label}</span>
            </div>
            <p className="m-0 font-sans text-[13px] text-[#595959]">
              {TYPE_ORDER.filter((t) => c.byType[t])
                .map(
                  (t) =>
                    `${c.byType[t].withCoordinates}/${c.byType[t].total} ${plural(t, c.byType[t].total)}`
                )
                .join(' · ')}
              . Looks up places one a second and only fills ones without coordinates; ones you type
              stay.{' '}
              <a
                href={s.provider.attribution.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#387440] underline"
              >
                {s.provider.attribution.text}
              </a>
              .
            </p>
            {running ? (
              <Note>
                Adding coordinates: {running.done} of {running.total} looked up (about{' '}
                {Math.max(
                  1,
                  Math.ceil(
                    ((running.total - running.done) * (s.provider.minIntervalMs || 1100)) / 60000
                  )
                )}{' '}
                min left). You can leave this page.
              </Note>
            ) : last ? (
              <p className="m-0 font-sans text-[13px] text-[#3b3b3b]">
                Last run {when(last.startedAt)}:{' '}
                {last.status === 'failed'
                  ? `failed (${last.error})`
                  : `${last.filledCount ?? 0} added, ${last.missedCount ?? 0} not found`}
                {last.misses?.length
                  ? ` (${last.misses
                      .slice(0, 6)
                      .map((m) => m.name)
                      .join(', ')}${last.misses.length > 6 ? '…' : ''})`
                  : ''}
                .
              </p>
            ) : null}
            {canEdit && c.missing && !running ? (
              <div className="flex flex-wrap gap-[10px]">
                <Btn onClick={check} disabled={checking}>
                  {checking ? 'Checking 5…' : 'Preview the next 5'}
                </Btn>
                <Btn
                  primary
                  onClick={() => {
                    r.reset();
                    setConfirming(true);
                  }}
                >
                  Add missing coordinates ({c.missing})
                </Btn>
              </div>
            ) : null}
            {checkError ? (
              <p className="m-0 font-sans text-[14px] text-[#b42318]">{checkError}</p>
            ) : null}
            {preview ? (
              <Note>
                <span className="font-semibold">Preview (nothing saved):</span>
                <ul className="m-0 mt-[6px] list-none p-0">
                  {(preview.filled || []).map((f) => (
                    <li key={f.id}>
                      {f.name}: {f.latitude}, {f.longitude}
                      {f.matchedBy === 'capital' ? ' (its capital town)' : ''} · {f.displayName}
                    </li>
                  ))}
                  {(preview.misses || []).map((m) => (
                    <li key={m.id}>
                      {m.name}: not found
                      {m.error && m.error !== 'No match in OpenStreetMap' ? ` (${m.error})` : ''}
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
          title="Add missing coordinates?"
          body={`Looks up ${c?.missing} places on OpenStreetMap, one a second (about ${Math.ceil(((c?.missing || 0) * 2.2) / 60)} min at most). Only places without coordinates are changed.`}
          primary={{ label: r.busy ? 'Starting…' : 'Start', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            r.run(
              async () => {
                const out = await catCoordsRun({ dryRun: false, reason: r.reason.trim() });
                setPreview(null);
                return out;
              },
              'Started',
              'It runs in the background; this panel follows it.'
            )
          }
          onClose={() => setConfirming(false)}
        >
          <ReasonInput
            value={r.reason}
            onChange={r.setReason}
            error={r.error}
            placeholder="e.g. Maps and nearby search need coordinates"
          />
        </AdminConfirmDialog>
      ) : null}
    </div>
  );
};

export default CoordinatesPanel;
