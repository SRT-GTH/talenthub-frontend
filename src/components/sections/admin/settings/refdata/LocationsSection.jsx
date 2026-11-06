import { useState } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { Checkbox, Select, TextInput, Textarea } from '../../../../ui/form';
import { GroupCard, SettingRow, TextAction } from '../../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../../ui/AdminConfirmDialog.jsx';
import AdminLoadNotice from '../../AdminLoadNotice.jsx';
import { useAdminData } from '../../useAdminData.js';
import {
  adminError,
  catImportLocations,
  catLocations,
  catPreviewLocationImport,
  catUpdateLocation,
  humanize,
} from '../../../../../services/admin.api.js';
import { Btn, Chip, Note, ReasonInput } from './shared.jsx';
import { useReasonRun } from './useReasonRun.js';
import CoordinatesPanel from './CoordinatesPanel.jsx';

/*
 * Locations: the countries, regions, cities and areas used in profiles, opportunities and search.
 * Import from CSV (always previewed first: new / already there / duplicate in the file / invalid; only
 * new rows are added), and edit a location's name, status, featured flag and coordinates.
 */

const COLUMNS = [
  'type',
  'name',
  'country',
  'region',
  'district',
  'city',
  'latitude',
  'longitude',
  'featured',
];
const SAMPLE = [
  COLUMNS.join(','),
  'region,Ashanti,GH,,,,,,',
  'district,Kumasi Metropolitan,GH,Ashanti,,,,,',
  'city,Kumasi,GH,Ashanti,Kumasi Metropolitan,,6.6885,-1.6244,true',
  'area,Adum,GH,Ashanti,Kumasi Metropolitan,Kumasi,,,',
].join('\n');
const TYPES = ['country', 'region', 'district', 'city', 'area'];
const STATUSES = ['active', 'inactive', 'deprecated'];

/** Minimal RFC 4180 CSV parser (quoted fields, "" escapes, CRLF). Returns rows as arrays. */
const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  const s = String(text || '').replace(/^\uFEFF/, '');
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (quoted) {
      if (ch === '"' && s[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && s[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += ch;
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => String(c).trim() !== ''));
};

/** CSV text → { rows: [{type,name,...}], error } using the header row to map columns. */
const csvToRows = (text) => {
  const table = parseCsv(text);
  if (table.length < 2) return { error: 'Add a header row and at least one location.' };
  const header = table[0].map((h) => h.trim().toLowerCase());
  const missing = ['type', 'name', 'country'].filter((c) => !header.includes(c));
  if (missing.length) return { error: `The header is missing: ${missing.join(', ')}.` };
  if (table.length - 1 > 2000) return { error: 'Import at most 2,000 locations at a time.' };
  return {
    rows: table
      .slice(1)
      .map((cells) =>
        Object.fromEntries(
          header
            .filter((h) => COLUMNS.includes(h))
            .map((h) => [h, (cells[header.indexOf(h)] ?? '').trim()])
        )
      ),
  };
};

const STATUS_TONE = { new: 'good', existing: undefined, duplicate: 'warn', invalid: 'warn' };
const STATUS_LABEL = {
  new: 'Will be added',
  existing: 'Already there',
  duplicate: 'Repeated in the file',
  invalid: 'Can’t import',
};

const place = (l) =>
  [
    l.name,
    l.type === 'area' ? l.city : null,
    l.type === 'city' || l.type === 'area' ? l.district : null,
    l.type === 'district' || l.type === 'city' || l.type === 'area' ? l.region : null,
    l.country,
  ]
    .filter(Boolean)
    .join(', ');

const Importer = ({ toast, onDone }) => {
  const [text, setText] = useState('');
  const [plan, setPlan] = useState(null);
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState('all');
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState(null);
  const r = useReasonRun(toast, (out) => {
    setConfirming(false);
    setResult(out);
  });

  const readFile = (file) => {
    if (!file) return;
    if (file.size > 1024 * 1024)
      return setError('The file is over 1 MB. Split it into smaller files.');
    const fr = new FileReader();
    fr.onload = () => {
      setText(String(fr.result || ''));
      setPlan(null);
      setError('');
    };
    fr.readAsText(file);
  };
  const preview = async () => {
    const parsed = csvToRows(text);
    if (parsed.error) return setError(parsed.error);
    setBusy(true);
    setError('');
    try {
      const out = await catPreviewLocationImport(parsed.rows);
      setRows(parsed.rows);
      setPlan(out);
      setShow(out.counts.invalid ? 'invalid' : 'all');
    } catch (e) {
      setError(e?.response ? adminError(e) : e.message);
    } finally {
      setBusy(false);
    }
  };
  const downloadSample = () => {
    const url = URL.createObjectURL(new Blob([SAMPLE + '\n'], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'locations-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shown = (plan?.rows ?? []).filter((x) => show === 'all' || x.status === show).slice(0, 300);

  if (result) {
    return (
      <GroupCard title="Import finished" gap="gap-[12px]">
        <Note>
          Added {result.created} location{result.created === 1 ? '' : 's'}. Skipped{' '}
          {result.counts.existing} already there, {result.counts.duplicate} repeated in the file and{' '}
          {result.counts.invalid} that couldn’t be imported.
        </Note>
        {result.failed?.length ? (
          <Note tone="warn">
            {result.failed.length} failed to save:{' '}
            {result.failed.map((f) => `line ${f.line} ${f.name} (${f.error})`).join('; ')}
          </Note>
        ) : null}
        <div>
          <Btn primary onClick={() => onDone(true)}>
            Back to locations
          </Btn>
        </div>
      </GroupCard>
    );
  }

  return (
    <GroupCard
      title="Import locations from CSV"
      description="Columns: type (country, region, district, city or area), name, country (2-letter code such as GH), region (for districts, cities and areas), district (optional, for cities and areas), city (for areas), latitude and longitude (both or neither), featured (true/false). You’ll see a preview before anything is saved; only new locations are added."
      gap="gap-[14px]"
    >
      <div className="flex flex-wrap gap-[14px]">
        <TextAction tone="green" onClick={() => onDone(false)}>
          ← All locations
        </TextAction>
        <TextAction tone="green" onClick={downloadSample}>
          Download a template CSV
        </TextAction>
      </div>
      <label className="flex flex-col gap-[6px] font-sans text-[14px] font-semibold text-[#1c2a21]">
        CSV file
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => readFile(e.target.files?.[0])}
          className="font-sans text-[14px] font-normal"
        />
      </label>
      <Textarea
        label="Or paste the CSV"
        rows={6}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setPlan(null);
        }}
        placeholder={SAMPLE}
      />
      {error ? <p className="m-0 font-sans text-[14px] text-[#b42318]">{error}</p> : null}
      <div className="flex flex-wrap gap-[10px]">
        <Btn primary onClick={preview} disabled={busy || !text.trim()}>
          {busy ? 'Checking…' : 'Preview import'}
        </Btn>
        {plan?.counts.new ? (
          <Btn
            primary
            onClick={() => {
              r.reset();
              setConfirming(true);
            }}
          >
            Import {plan.counts.new} new location{plan.counts.new === 1 ? '' : 's'}
          </Btn>
        ) : null}
      </div>

      {plan ? (
        <div className="flex flex-col gap-[10px]">
          <div className="flex flex-wrap gap-[8px]">
            {['all', 'new', 'existing', 'duplicate', 'invalid'].map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={show === k}
                onClick={() => setShow(k)}
                className={classNames(
                  'h-[30px] cursor-pointer rounded-full border border-solid px-[12px] font-sans text-[13px] font-semibold',
                  show === k
                    ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                    : 'border-[#e1eae2] bg-white text-[#595959]'
                )}
              >
                {k === 'all' ? `All ${plan.rows.length}` : `${STATUS_LABEL[k]} ${plan.counts[k]}`}
              </button>
            ))}
          </div>
          {!plan.counts.new ? (
            <Note tone="warn">
              Nothing new to add: every row is already there, repeated or invalid.
            </Note>
          ) : null}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-sans text-[13px]">
              <thead>
                <tr className="text-left text-[#737373]">
                  <th className="px-[8px] py-[6px]">Line</th>
                  <th className="px-[8px] py-[6px]">Result</th>
                  <th className="px-[8px] py-[6px]">Type</th>
                  <th className="px-[8px] py-[6px]">Location</th>
                  <th className="px-[8px] py-[6px]">Details</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((x) => {
                  const src = x.location || x.input || rows?.[x.line - 1] || {};
                  return (
                    <tr key={x.line} className="border-t border-solid border-[#eeeeea]">
                      <td className="px-[8px] py-[6px]">{x.line + 1}</td>
                      <td className="px-[8px] py-[6px]">
                        <Chip tone={STATUS_TONE[x.status]}>{STATUS_LABEL[x.status]}</Chip>
                      </td>
                      <td className="px-[8px] py-[6px]">{src.type || '–'}</td>
                      <td className="px-[8px] py-[6px]">{place(src) || '–'}</td>
                      <td className="px-[8px] py-[6px] text-[#595959]">
                        {x.error ||
                          [
                            x.location?.coordinates
                              ? `${x.location.coordinates.latitude}, ${x.location.coordinates.longitude}`
                              : null,
                            x.location?.featured ? 'featured' : null,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(plan.rows.filter((x) => show === 'all' || x.status === show).length ?? 0) >
            shown.length ? (
              <p className="m-0 mt-[6px] font-sans text-[13px] text-[#737373]">
                Showing the first 300 rows.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {confirming ? (
        <AdminConfirmDialog
          title={`Import ${plan.counts.new} location${plan.counts.new === 1 ? '' : 's'}?`}
          body="Only the rows marked Will be added are saved. The file is checked again on the server first."
          primary={{ label: r.busy ? 'Importing…' : 'Import', arrow: true }}
          secondary="Cancel"
          onPrimary={() =>
            r.run(
              () => catImportLocations(rows, r.reason.trim()),
              'Locations imported',
              `${plan.counts.new} new`
            )
          }
          onClose={() => setConfirming(false)}
        >
          <ReasonInput
            value={r.reason}
            onChange={r.setReason}
            error={r.error}
            placeholder="e.g. Adding Ashanti cities for the Kumasi pilot"
          />
        </AdminConfirmDialog>
      ) : null}
    </GroupCard>
  );
};

const LocationsSection = ({ canEdit, toast }) => {
  const [filters, setFilters] = useState({ q: '', type: '', country: '', status: '' });
  const [q, setQ] = useState('');
  const list = useAdminData(
    () => catLocations(filters),
    [filters.q, filters.type, filters.country, filters.status]
  );
  const rows = list.data?.locations ?? [];
  const summary = list.data?.summary ?? {};
  const [importing, setImporting] = useState(false);
  const [dialog, setDialog] = useState(null); // location being edited
  const [form, setForm] = useState({});
  const r = useReasonRun(toast, () => {
    setDialog(null);
    list.reload();
  });

  if (importing) {
    return (
      <Importer
        toast={toast}
        onDone={(changed) => {
          setImporting(false);
          if (changed) list.reload();
        }}
      />
    );
  }

  const open = (l) => {
    r.reset();
    setForm({
      name: l.name,
      status: l.status,
      featured: l.featured,
      latitude: l.coordinates ? String(l.coordinates.latitude) : '',
      longitude: l.coordinates ? String(l.coordinates.longitude) : '',
    });
    setDialog(l);
  };
  const save = () => {
    const l = dialog;
    const p = {};
    if (form.name.trim() !== l.name) p.name = form.name.trim();
    if (form.status !== l.status) p.status = form.status;
    if (form.featured !== l.featured) p.featured = form.featured;
    const hasLat = form.latitude.trim() !== '';
    const hasLng = form.longitude.trim() !== '';
    if (hasLat !== hasLng) return r.setError('Give both latitude and longitude.');
    if (hasLat) {
      const lat = Number(form.latitude);
      const lng = Number(form.longitude);
      if (!(lat >= -90 && lat <= 90) || !(lng >= -180 && lng <= 180))
        return r.setError('Latitude is −90 to 90 and longitude −180 to 180.');
      if (lat !== l.coordinates?.latitude || lng !== l.coordinates?.longitude) {
        p.latitude = lat;
        p.longitude = lng;
      }
    }
    if (p.name !== undefined && p.name.length < 2)
      return r.setError('The name needs 2+ characters.');
    if (!Object.keys(p).length) return r.setError('Nothing has changed.');
    return r.run(
      () => catUpdateLocation(l.id, { ...p, reason: r.reason.trim() }),
      'Location saved',
      form.name.trim()
    );
  };

  const countries = Object.keys(summary).sort();
  const opts = (vals, all) => [
    { value: '', label: all },
    ...vals.map((v) => ({ value: v, label: humanize(v) })),
  ];

  return (
    <GroupCard
      title="Locations"
      description="Countries, regions, districts, towns and areas used in onboarding, profiles, opportunities, search and reports."
      gap="gap-0"
    >
      <div className="flex flex-wrap gap-[8px] pb-[12px]">
        {countries.map((c) => (
          <Chip key={c}>
            {c}:{' '}
            {TYPES.filter((t) => summary[c][t])
              .map(
                (t) =>
                  `${summary[c][t]} ${t === 'city' && summary[c][t] !== 1 ? 'cities' : `${t}${summary[c][t] === 1 ? '' : 's'}`}`
              )
              .join(', ')}
          </Chip>
        ))}
      </div>
      <CoordinatesPanel canEdit={canEdit} toast={toast} onChanged={list.reload} />
      {canEdit ? (
        <div className="pb-[12px]">
          <TextAction tone="green" onClick={() => setImporting(true)}>
            + Import from CSV
          </TextAction>
        </div>
      ) : null}
      <form
        className="grid grid-cols-1 items-end gap-[10px] pb-[12px] md:grid-cols-[1fr_150px_150px_150px_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          setFilters((f) => ({ ...f, q: q.trim() }));
        }}
      >
        <TextInput label="Search by name" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select
          label="Type"
          options={opts(TYPES, 'All types')}
          value={filters.type}
          onChange={(v) => setFilters((f) => ({ ...f, type: v }))}
        />
        <Select
          label="Country"
          options={[
            { value: '', label: 'All countries' },
            ...countries.map((c) => ({ value: c, label: c })),
          ]}
          value={filters.country}
          onChange={(v) => setFilters((f) => ({ ...f, country: v }))}
        />
        <Select
          label="Status"
          options={opts(STATUSES, 'Any status')}
          value={filters.status}
          onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
        />
        <Btn type="submit">Search</Btn>
      </form>
      <AdminLoadNotice
        loading={list.loading}
        error={list.error}
        status={list.status}
        onRetry={list.reload}
      >
        {rows.map((l) => (
          <SettingRow
            key={l.id}
            title={`${l.name}${l.status !== 'active' ? ` · ${l.status}` : ''}${l.featured ? ' · featured' : ''}`}
            description={`${humanize(l.type)} · ${place(l)}${
              l.coordinates
                ? ` · ${l.coordinates.latitude}, ${l.coordinates.longitude}${l.coordinateSource === 'nominatim' ? ' (OpenStreetMap)' : ''}`
                : ' · no coordinates'
            }`}
            top
            control={
              canEdit ? (
                <TextAction tone="green" onClick={() => open(l)}>
                  Edit
                </TextAction>
              ) : null
            }
          />
        ))}
        {rows.length >= 500 ? (
          <p className="m-0 pt-[8px] font-sans text-[13px] text-[#737373]">
            Showing the first 500. Narrow the search to see more.
          </p>
        ) : null}
        {!rows.length && !list.loading ? (
          <p className="m-0 font-sans text-[14px] text-[#737373]">No locations match.</p>
        ) : null}
      </AdminLoadNotice>

      {dialog ? (
        <AdminConfirmDialog
          title={`Edit ${dialog.name}`}
          body={`${humanize(dialog.type)} in ${place({ ...dialog, name: null }) || dialog.country}. Its type and place in the hierarchy don’t change here.`}
          primary={{ label: r.busy ? 'Saving…' : 'Save', arrow: true }}
          secondary="Cancel"
          onPrimary={save}
          onClose={() => setDialog(null)}
        >
          <div className="flex flex-col gap-[12px]">
            <TextInput
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Select
              label="Status"
              options={STATUSES.map((s) => ({ value: s, label: humanize(s) }))}
              value={form.status}
              onChange={(v) => setForm((f) => ({ ...f, status: v }))}
            />
            <Checkbox
              label="Featured"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            />
            <div className="grid grid-cols-2 gap-[10px]">
              <TextInput
                label="Latitude"
                inputMode="decimal"
                value={form.latitude}
                onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
              />
              <TextInput
                label="Longitude"
                inputMode="decimal"
                value={form.longitude}
                onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
              />
            </div>
            <ReasonInput value={r.reason} onChange={r.setReason} error={r.error} />
          </div>
        </AdminConfirmDialog>
      ) : null}
    </GroupCard>
  );
};

export default LocationsSection;
