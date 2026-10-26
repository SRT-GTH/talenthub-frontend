import { useEffect, useState } from 'react';
import { Checkbox } from '../../../../ui/form';
import { GroupCard, SettingRow, TextAction } from '../../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../../ui/AdminConfirmDialog.jsx';
import AdminLoadNotice from '../../AdminLoadNotice.jsx';
import { useAdminData } from '../../useAdminData.js';
import {
  adminError,
  catDataSources,
  catOnetCheck,
  catOnetRun,
  catScrapeCheck,
  catScrapeRun,
  humanize,
} from '../../../../../services/admin.api.js';
import { Btn, Chip, Note, ReasonInput } from './shared.jsx';
import { useReasonRun } from './useReasonRun.js';

/*
 * Data sources: reference data that comes from outside the platform.
 *   O*NET occupations   career data behind Career Buddy recommendations (quarterly; check / import now)
 *   Ghana sources       scheduled scrapers (GSS, GLMIS, universities, GES/WAEC, jobs.gov.gh)
 *   Exchange rates      summary; managed under Currencies
 *   Locations           Ghana regions and districts seeded from the MMDA list; managed under Locations
 */

const when = (d) =>
  d
    ? new Date(d).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '–';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ordinal = (n) =>
  `${n}${['th', 'st', 'nd', 'rd'][(n % 100 > 10 && n % 100 < 14) || n % 10 > 3 ? 0 : n % 10]}`;
/** "0 4 1 *\/3 *" → "every 3 months on the 1st at 04:00 UTC"; unknown shapes come back as written. */
const cronText = (cron) => {
  const f = String(cron || '')
    .trim()
    .split(/\s+/);
  if (f.length !== 5 || !/^\d+$/.test(f[0]) || !/^\d+$/.test(f[1]))
    return cron ? `${cron} (UTC)` : '';
  const [min, hour, dom, mon, dow] = f;
  const at = `at ${hour.padStart(2, '0')}:${min.padStart(2, '0')} UTC`;
  if (dom === '*' && mon === '*' && dow === '*') return `daily ${at}`;
  if (dom === '*' && mon === '*' && /^\d$/.test(dow)) return `every ${DAYS[Number(dow) % 7]} ${at}`;
  if (/^\d+$/.test(dom) && dow === '*') {
    const day = `the ${ordinal(Number(dom))}`;
    if (mon === '*') return `monthly on ${day} ${at}`;
    const every = mon.match(/^\*\/(\d+)$/);
    if (every) return `every ${every[1]} months on ${day} ${at}`;
    if (/^\d+(,\d+)*$/.test(mon))
      return `on ${day} of ${mon
        .split(',')
        .map((m) => MONTHS[Number(m) - 1])
        .join(' and ')} ${at}`;
  }
  return `${cron} (UTC)`;
};
const STATUS_TONE = {
  ok: 'good',
  running: undefined,
  failed: 'warn',
  skipped_no_new_version: undefined,
};
const STATUS_TEXT = {
  ok: 'Imported',
  running: 'Running…',
  failed: 'Failed',
  skipped_no_new_version: 'Already up to date',
  not_implemented: 'Not implemented',
};

const OnetCard = ({ onet, canEdit, toast, reload }) => {
  const [check, setCheck] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [force, setForce] = useState(false);
  const r = useReasonRun(toast, () => {
    setConfirming(false);
    reload();
    // The run row appears a moment after the import starts.
    setTimeout(reload, 2500);
  });
  const runs = onet?.runs ?? [];
  const running = runs.some((x) => x.status === 'running');

  // Poll while an import runs.
  useEffect(() => {
    if (!running) return undefined;
    const t = setInterval(reload, 5000);
    return () => clearInterval(t);
  }, [running, reload]);

  const doCheck = async () => {
    setChecking(true);
    setCheckError('');
    try {
      setCheck(await catOnetCheck());
    } catch (e) {
      setCheckError(e?.response ? adminError(e) : e.message);
    } finally {
      setChecking(false);
    }
  };
  const lastOk = runs.find((x) => x.status === 'ok');

  return (
    <GroupCard
      title="O*NET occupations"
      description="About 1,000 occupations with interests (RIASEC), education level, skills and tasks, from the U.S. Department of Labor’s O*NET database (CC BY 4.0). Career Buddy recommends careers from this list. New versions come out about four times a year."
      gap="gap-[10px]"
    >
      {onet?.error ? (
        <Note tone="warn">Couldn’t read the O*NET status: {onet.error}</Note>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-[8px] font-sans text-[14px]">
            <Chip tone={onet?.onetOccupationsActive ? 'good' : 'warn'}>
              {onet?.onetOccupationsActive ?? 0} occupations
            </Chip>
            <Chip>{onet?.poolEntriesActive ?? 0} recommendation pools</Chip>
            {lastOk ? <Chip>Version {lastOk.sourceVersion}</Chip> : null}
            {onet?.flag?.OCCUPATION_INGEST_ENABLED ? (
              <Chip tone="good">Quarterly schedule on</Chip>
            ) : (
              <Chip>Quarterly schedule off</Chip>
            )}
          </div>
          {!onet?.onetOccupationsActive ? (
            <Note tone="warn">
              No occupations imported yet, so Career Buddy falls back to a short placeholder list.
            </Note>
          ) : null}
          {canEdit ? (
            <div className="flex flex-wrap gap-[10px]">
              <Btn onClick={doCheck} disabled={checking}>
                {checking ? 'Checking…' : 'Check for a new version'}
              </Btn>
              <Btn
                primary
                disabled={running}
                onClick={() => {
                  r.reset();
                  setForce(false);
                  setConfirming(true);
                }}
              >
                {running ? 'Import running…' : 'Import now'}
              </Btn>
            </div>
          ) : null}
          {checkError ? (
            <p className="m-0 font-sans text-[14px] text-[#b42318]">{checkError}</p>
          ) : null}
          {check ? (
            <Note tone={check.error ? 'warn' : 'info'}>
              {check.error
                ? `Couldn’t reach O*NET: ${check.error}`
                : check.wouldImport
                  ? `Version ${check.latestVersion} is available${check.importedVersion ? ` (imported: ${check.importedVersion})` : ' and nothing is imported yet'}.`
                  : `Up to date: version ${check.latestVersion} is imported.`}
            </Note>
          ) : null}
          <div className="flex flex-col">
            {runs.map((x) => (
              <SettingRow
                key={x.id}
                title={`${when(x.startedAt)} · ${STATUS_TEXT[x.status] || humanize(x.status)}`}
                description={
                  x.status === 'ok'
                    ? `Version ${x.sourceVersion}: ${x.rowsInserted} new, ${x.rowsUpdated} updated, ${x.rowsDeactivated} retired · ${x.candidatePoolEntriesBuilt} pools rebuilt${x.latencyMs ? ` · ${Math.round(x.latencyMs / 1000)}s` : ''} · ${x.triggeredBy?.startsWith('admin') ? 'by an admin' : x.triggeredBy}`
                    : x.error || (x.sourceVersion ? `Version ${x.sourceVersion}` : '')
                }
                top
                control={
                  <Chip tone={STATUS_TONE[x.status]}>
                    {STATUS_TEXT[x.status] || humanize(x.status)}
                  </Chip>
                }
              />
            ))}
            {!runs.length ? (
              <p className="m-0 font-sans text-[14px] text-[#737373]">No imports yet.</p>
            ) : null}
          </div>
        </>
      )}

      {confirming ? (
        <AdminConfirmDialog
          title="Import O*NET now?"
          body="Downloads the latest O*NET tables (about 12 MB), updates the occupations and rebuilds Career Buddy’s recommendation pools. It runs in the background and takes a minute or two."
          primary={{ label: r.busy ? 'Starting…' : 'Start import', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            r.run(
              () => catOnetRun({ force, reason: r.reason.trim() }),
              'Import started',
              'O*NET occupations'
            )
          }
          onClose={() => setConfirming(false)}
        >
          <div className="flex flex-col gap-[12px]">
            <Checkbox
              label="Import again even if this version is already imported"
              checked={force}
              onChange={(e) => setForce(e.target.checked)}
            />
            <ReasonInput value={r.reason} onChange={r.setReason} error={r.error} />
          </div>
        </AdminConfirmDialog>
      ) : null}
    </GroupCard>
  );
};

const SourceRow = ({ t, canEdit, toast, reload }) => {
  const [preview, setPreview] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const r = useReasonRun(toast, () => {
    setConfirming(false);
    reload();
    setTimeout(reload, 2500);
  });
  const running = t.lastRun?.status === 'running';
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(reload, 5000);
    return () => clearInterval(id);
  }, [running, reload]);
  const check = async () => {
    setChecking(true);
    setCheckError('');
    try {
      setPreview(await catScrapeCheck(t.key));
    } catch (e) {
      setCheckError(e?.response ? adminError(e) : e.message);
    } finally {
      setChecking(false);
    }
  };
  const last = t.lastRun;
  return (
    <div className="flex flex-col gap-[8px] border-b border-solid border-[#eeeeea] py-[12px] last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-[10px]">
        <div className="flex min-w-0 flex-col gap-[2px]">
          <span className="font-sans text-[15px] font-semibold text-[#1c2a21]">
            {t.name || humanize(t.key)}
          </span>
          <span className="font-sans text-[13px] text-[#595959]">
            {t.enabled ? `Runs ${cronText(t.cron)}` : 'Switched off'}
            {t.records ? ` · ${t.records.active} active, ${t.records.inactive} closed` : ''}
            {' · '}
            {last
              ? `last read ${when(last.startedAt)}: ${STATUS_TEXT[last.status] || humanize(last.status)}${
                  last.status !== 'running'
                    ? ` (${last.rowsInserted || 0} new, ${last.rowsUpdated || 0} updated${last.rowsUnchanged ? `, ${last.rowsUnchanged} unchanged` : ''})`
                    : ''
                }`
              : 'never read'}
          </span>
          {t.notes ? <span className="font-sans text-[12px] text-[#737373]">{t.notes}</span> : null}
        </div>
        {t.extractorBuilt ? (
          <Chip tone="good">Reader built</Chip>
        ) : (
          <Chip tone="warn">Reader not built yet</Chip>
        )}
      </div>
      {canEdit && t.extractorBuilt && t.enabled ? (
        <div className="flex flex-wrap gap-[10px]">
          <Btn onClick={check} disabled={checking || running}>
            {checking ? 'Reading…' : 'Preview'}
          </Btn>
          <Btn
            primary
            disabled={running}
            onClick={() => {
              r.reset();
              setConfirming(true);
            }}
          >
            {running ? 'Reading…' : 'Read now'}
          </Btn>
        </div>
      ) : null}
      {checkError ? <p className="m-0 font-sans text-[14px] text-[#b42318]">{checkError}</p> : null}
      {preview ? (
        <Note tone={preview.ok && !preview.summary?.degraded ? 'info' : 'warn'}>
          {preview.ok ? (
            <>
              <span className="font-semibold">Preview (nothing saved):</span> showing the first{' '}
              {preview.preview?.length ?? 0} of {preview.listed ?? '?'} on the first list page
              {preview.summary?.degraded ? ' · some pages could not be read' : ''}
              <ul className="m-0 mt-[6px] list-none p-0">
                {(preview.preview || []).slice(0, 5).map((row) => (
                  <li key={row.sourceUrl}>
                    {row.title}
                    {row.employer ? ` · ${row.employer}` : ''}
                    {row.district || row.region || row.town
                      ? ` · ${[row.town, row.district, row.region].filter(Boolean).join(', ')}`
                      : ''}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            `Couldn’t read it: ${preview.error || preview.reason}`
          )}
        </Note>
      ) : null}
      {confirming ? (
        <AdminConfirmDialog
          title={`Read ${t.name || t.key} now?`}
          body="Reads every page of the source, adds new rows, updates changed ones and marks rows the source no longer lists as closed. It runs in the background."
          primary={{ label: r.busy ? 'Starting…' : 'Start', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            r.run(() => catScrapeRun(t.key, r.reason.trim()), 'Reading started', t.name || t.key)
          }
          onClose={() => setConfirming(false)}
        >
          <ReasonInput value={r.reason} onChange={r.setReason} error={r.error} />
        </AdminConfirmDialog>
      ) : null}
    </div>
  );
};

const ScrapersCard = ({ scrapers, canEdit, toast, reload }) => (
  <GroupCard
    title="Ghana sources"
    description="Readers for Ghana public sources. Readers run on their schedule when the server setting SCRAPER_ENABLED=1 is on; you can always read one now."
    gap="gap-0"
  >
    {scrapers?.error ? (
      <Note tone="warn">Couldn’t read the source status: {scrapers.error}</Note>
    ) : (
      <>
        {!scrapers?.flag?.SCRAPER_ENABLED ? (
          <div className="pb-[6px]">
            <Note tone="warn">
              Schedules are off on this server (SCRAPER_ENABLED is not 1). “Read now” still works.
            </Note>
          </div>
        ) : null}
        {(scrapers?.targets ?? []).map((t) => (
          <SourceRow key={t.key} t={t} canEdit={canEdit} toast={toast} reload={reload} />
        ))}
      </>
    )}
  </GroupCard>
);

const SummaryCard = ({ fx, locations, goTo }) => (
  <GroupCard title="Also from outside sources" gap="gap-0">
    <SettingRow
      title="Exchange rates"
      description={
        fx?.error
          ? fx.error
          : `${fx?.providerLabel} · ${fx?.enabled ? `updates ${cronText(fx.schedule)}` : 'schedule off'} · ${
              fx?.lastRun
                ? `last update ${when(fx.lastRun.startedAt)}`
                : 'not updated automatically yet'
            }`
      }
      top
      control={
        <TextAction tone="green" onClick={() => goTo('currencies')}>
          Open
        </TextAction>
      }
    />
    <SettingRow
      title="Ghana regions and districts"
      description={`${locations?.counts?.region ?? 0} regions · ${locations?.counts?.district ?? 0} districts (MMDAs) · ${
        locations?.counts?.city ?? 0
      } towns and cities. Used by onboarding, profiles, organisations and reports.`}
      top
      control={
        <TextAction tone="green" onClick={() => goTo('locations')}>
          Open
        </TextAction>
      }
    />
  </GroupCard>
);

const DataSourcesSection = ({ canEdit, toast, goTo }) => {
  const ds = useAdminData(() => catDataSources(), []);
  const d = ds.data;
  return (
    <AdminLoadNotice
      loading={ds.loading && !d}
      error={ds.error}
      status={ds.status}
      onRetry={ds.reload}
    >
      {d ? (
        <div className="flex flex-col gap-[16px]">
          <OnetCard onet={d.onet} canEdit={canEdit} toast={toast} reload={ds.reload} />
          <ScrapersCard scrapers={d.scrapers} canEdit={canEdit} toast={toast} reload={ds.reload} />
          <SummaryCard fx={d.fx} locations={d.locations} goTo={goTo} />
        </div>
      ) : null}
    </AdminLoadNotice>
  );
};

export default DataSourcesSection;
