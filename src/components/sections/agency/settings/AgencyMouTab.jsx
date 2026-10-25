import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import AgencyStatusChip from './AgencyStatusChip.jsx';
import {
  MOU_CATEGORIES,
  MOU_DPO,
  MOU_QUOTA,
  MOU_SUMMARY,
  TOASTS,
} from './data/agencySettingsData.js';

const log = debug('AgencyMouTab');

const TILE =
  'flex min-h-[66px] min-w-0 items-center gap-[12px] rounded-[16px] p-[14px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/*
 * AgencyMouTab — Figma 11.6.1g "MoU and access" (8611:2538): the three data categories, access limits (query quota, DPO report switch, report
 * cycle) and data protection (DPO, legal basis with an Edit chip). State is local; Save changes toasts.
 * ⚠️ ASSUMPTIONS: the category tiles are a radio group that highlights the chosen category; the not-in-MoU tile links to a new data request;
 * "Change" (quota) explains that limits are set by the MoU; "Edit" makes the legal basis an editable field (Enter / blur commits).
 * Props: onToast(toast).
 */
const AgencyMouTab = ({ onToast }) => {
  const [category, setCategory] = useState('skills');
  const [dpoReports, setDpoReports] = useState(false);
  const [cycle, setCycle] = useState('Monthly');
  const [legal, setLegal] = useState(MOU_DPO.legal);
  const [editing, setEditing] = useState(false);

  return (
    <>
      <SettingsACard title="Your MoU" desc={MOU_SUMMARY}>
        <div
          role="radiogroup"
          aria-label="Data categories"
          className="grid grid-cols-1 gap-[12px] md:grid-cols-3"
        >
          {MOU_CATEGORIES.map((c) => {
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
              <Link key={c.id} to="/agency/data-requests/new" className={classNames(TILE, look)}>
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
      </SettingsACard>

      <SettingsACard
        title="Access limits"
        desc="Set by your MoU. Ask your GTH contact to change them."
      >
        <SettingsARow
          first
          title="Query quota"
          badge={<AgencyStatusChip tone="active">{MOU_QUOTA.chip}</AgencyStatusChip>}
          desc={MOU_QUOTA.desc}
        >
          <SettingsALink onClick={() => onToast(TOASTS.quota)}>Change</SettingsALink>
        </SettingsARow>
        <SettingsARow
          title="Send access reports to your DPO"
          desc="dpo@nya.gov.gh gets a monthly access report."
        >
          <SettingsAToggle
            on={dpoReports}
            label="Send access reports to your DPO"
            onChange={setDpoReports}
          />
        </SettingsARow>
        <SettingsARow title="Report cycle" desc="Your DPO chooses how often.">
          <SegmentedControl
            options={['Monthly', 'Quarterly']}
            value={cycle}
            onChange={setCycle}
            label="Report cycle"
          />
        </SettingsARow>
      </SettingsACard>

      <SettingsACard title="Data protection">
        <SettingsARow first title="Data protection officer" desc="Named in your MoU.">
          <span className="inline-flex h-[32px] shrink-0 items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[16px] font-semibold text-[#595959]">
            {MOU_DPO.chip}
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
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setEditing((v) => !v)}
            className="inline-flex h-[32px] shrink-0 cursor-pointer items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[16px] font-semibold text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Edit
          </button>
        </SettingsARow>
      </SettingsACard>

      <div className="flex justify-end">
        <Button variant="primary" size="sm" onClick={() => onToast(TOASTS.saved)}>
          Save changes
        </Button>
      </div>
    </>
  );
};

export default AgencyMouTab;
