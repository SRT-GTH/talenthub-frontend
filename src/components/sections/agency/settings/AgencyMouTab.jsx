import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { agencySettings, agencyUpdateMou } from '../../../../services/agency.api.js';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { SegmentedControl } from '../../talentSettings/SettingsBUi.jsx';
import {
  SettingsACard,
  SettingsALink,
  SettingsARow,
  SettingsAToggle,
} from '../../talentSettings/SettingsAUi.jsx';
import { useAgencyResource } from '../useAgencyResource.js';
import AgencyStatusChip from './AgencyStatusChip.jsx';
import { TOASTS } from './data/agencySettingsData.js';

const log = debug('AgencyMouTab');

const TILE =
  'flex min-h-[66px] min-w-0 items-center gap-[12px] rounded-[16px] p-[14px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const day = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';
const CAT_LABEL = {
  skills: 'Skills and readiness',
  readiness: 'Readiness',
  outcomes: 'Programme outcomes',
  demand: 'Skills demand',
};

/*
 * AgencyMouTab — Figma 11.6.1g "MoU and access" (8611:2538). Live: GET /agency/settings → mou. The data categories in the MoU (plus a tile
 * that starts a data request for anything outside it), the query quota (limit and use this month), the DPO access-report switch and cycle,
 * the DPO and the legal basis. Save → PATCH /agency/settings/mou (admins only). Limits are set with GTH ("Change" explains how).
 * Props: onToast(toast).
 */
const AgencyMouTab = ({ onToast }) => {
  const res = useAgencyResource(agencySettings, []);
  const m = res.data?.mou;
  const admin = res.data?.role === 'admin';
  const [category, setCategory] = useState(null);
  const [dpoReports, setDpoReports] = useState(false);
  const [cycle, setCycle] = useState('Monthly');
  const [legal, setLegal] = useState('');
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!m) return;
    setCategory((c) => c ?? m.categories[0] ?? null);
    setDpoReports(Boolean(m.dpoReports));
    setCycle(m.reportCycle === 'quarterly' ? 'Quarterly' : 'Monthly');
    setLegal(m.legalBasis || '');
  }, [m]);

  if (!m) {
    return (
      <p role="status" className="m-0 p-[16px] font-sans text-[15px] text-[#737373]">
        {res.error ? 'We couldn’t load your MoU.' : 'Loading your MoU…'}
      </p>
    );
  }

  const save = async () => {
    setBusy(true);
    try {
      await agencyUpdateMou({
        dpoReports,
        reportCycle: cycle.toLowerCase(),
        legalBasis: legal.trim(),
      });
      res.reload();
      onToast(TOASTS.saved);
    } catch (err) {
      onToast({ title: 'Not saved', body: err?.response?.data?.message || err?.message });
    } finally {
      setBusy(false);
    }
  };

  const tiles = [
    ...m.categories.map((c) => ({
      id: c,
      title: CAT_LABEL[c] || c,
      note: 'Active · aggregates',
      chip: 'Active',
    })),
    {
      id: 'request',
      title: 'Anything else',
      note: 'Not in your MoU',
      chip: 'Request',
      request: true,
    },
  ];
  const used = m.usage?.queries ?? 0;
  const limit = m.limits?.queriesPerMonth ?? 0;

  return (
    <>
      <SettingsACard
        title="Your MoU"
        desc={`${m.reference || 'MoU'} · signed ${day(m.signedAt)} · ends ${day(m.expiresAt)}. We remind you 60 days before.`}
      >
        <div
          role="radiogroup"
          aria-label="Data categories"
          className="grid grid-cols-1 gap-[12px] md:grid-cols-3"
        >
          {tiles.map((c) => {
            const body = (
              <>
                <span
                  aria-hidden="true"
                  className={classNames(
                    'flex size-[22px] shrink-0 items-center justify-center rounded-full border bg-white',
                    category === c.id ? 'border-[#387440]' : 'border-[rgba(28,42,33,0.1)]'
                  )}
                >
                  {category === c.id ? (
                    <span className="size-[10px] rounded-full bg-[#387440]" />
                  ) : null}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                    {c.title}
                  </span>
                  <span className="text-[13px] leading-[16px] text-[#595959]">{c.note}</span>
                </span>
                {c.chip ? <AgencyStatusChip tone="note">{c.chip}</AgencyStatusChip> : null}
              </>
            );
            const look =
              category === c.id
                ? 'border border-[#387440] bg-[#ebf1ec]'
                : 'border border-[rgba(28,42,33,0.12)] bg-white';
            return c.request ? (
              <Link
                key={c.id}
                to="/agency/data-requests/new"
                className={classNames(TILE, look, 'no-underline')}
              >
                {body}
              </Link>
            ) : (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={category === c.id}
                onClick={() => {
                  log('category', c.id);
                  setCategory(c.id);
                }}
                className={classNames(TILE, 'cursor-pointer', look)}
              >
                {body}
              </button>
            );
          })}
        </div>
        {m.categories.length === 0 ? (
          <p className="m-0 pt-[8px] text-[13px] text-[#902b20]">
            No data categories are recorded on your MoU yet. Ask your GTH contact.
          </p>
        ) : null}
      </SettingsACard>

      <SettingsACard
        title="Access limits"
        desc="Set by your MoU. Ask your GTH contact to change them."
      >
        <SettingsARow
          first
          title="Query quota"
          badge={<AgencyStatusChip tone="active">{`${limit} queries a month`}</AgencyStatusChip>}
          desc={`${used} used this month. Resets on the 1st.`}
        >
          <SettingsALink onClick={() => onToast(TOASTS.quota)}>Change</SettingsALink>
        </SettingsARow>
        <SettingsARow
          title="Send access reports to your DPO"
          desc={
            m.dpo?.email
              ? `${m.dpo.email} gets an access report.`
              : 'Your DPO gets an access report.'
          }
        >
          <SettingsAToggle
            on={dpoReports}
            label="Send access reports to your DPO"
            disabled={!admin}
            onChange={setDpoReports}
          />
        </SettingsARow>
        <SettingsARow title="Report cycle" desc="Your DPO chooses how often.">
          <SegmentedControl
            options={['Monthly', 'Quarterly']}
            value={cycle}
            onChange={admin ? setCycle : () => {}}
            label="Report cycle"
          />
        </SettingsARow>
      </SettingsACard>

      <SettingsACard title="Data protection">
        <SettingsARow first title="Data protection officer" desc="Named in your MoU.">
          <span className="inline-flex h-[32px] shrink-0 items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[16px] font-semibold text-[#595959]">
            {m.dpo ? `${m.dpo.name}${m.dpo.email ? ` · ${m.dpo.email}` : ''}` : 'Not recorded yet'}
          </span>
        </SettingsARow>
        <SettingsARow
          title="Legal basis"
          desc={
            editing ? (
              <input
                autoFocus
                aria-label="Legal basis"
                value={legal}
                onChange={(e) => setLegal(e.target.value)}
                onBlur={() => setEditing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') setEditing(false);
                }}
                className="mt-[2px] w-full rounded-[10px] border border-[#c1d4c4] bg-white px-[10px] py-[6px] text-[13.5px] text-[#1c2a21]"
              />
            ) : (
              legal
            )
          }
        >
          {admin ? (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setEditing((v) => !v)}
              className="inline-flex h-[32px] shrink-0 cursor-pointer items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[16px] font-semibold text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              Edit
            </button>
          ) : null}
        </SettingsARow>
      </SettingsACard>

      {admin ? (
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default AgencyMouTab;
