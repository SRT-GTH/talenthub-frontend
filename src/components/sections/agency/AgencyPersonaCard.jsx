import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { AgencyShieldIcon } from './agencyIcons.jsx';
import { AGENCY_BASE } from './agencyNav.js';

const log = debug('AgencyPersonaCard');

/*
 * PersonaCard — the "Persona card" at the top of the agency and institution rails (one component, same Figma card in both portals, 279 x 327,
 * r16, border #e1eae2): monogram 62 (#387440) · name 14/600 + role chip (#eaeffb, #244a9f 10/600) · "title · short name" 12 · status line ·
 * meter (gradient #1f4a2b → #3f7f4c on #ebf1ec/50) · small link "… →" · stats strip of three numbers.
 * Props: monogram, name, role, subtitle, status, meter { label, pct }, link { to, label }, stats [{ value, label }] x3, statsLabel,
 * onNavigate (closes the phone drawer), className.
 *
 * AgencyPersonaCard (default export) — the agency rail's card: "Director, Research & Data · NYA", MoU status line, "Query quota this month",
 * "View MoU and access →", Regions · Requests · Programmes. Props: session (useAgencySession()); follows the MoU gate (?mou=, ?quota=).
 * The institution rail uses PersonaCard through InstitutionPersonaCard.
 */

const Stat = ({ value, label }) => (
  <div className="flex flex-1 flex-col items-center gap-[2px] px-[2px]">
    <span className="font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#387440]">
      {value}
    </span>
    <span className="font-sans text-[11px] max-lg:text-[12px] leading-[13px] text-[#999999]">
      {label}
    </span>
  </div>
);

export const PersonaCard = ({
  monogram,
  name,
  role,
  subtitle,
  status,
  meter,
  link,
  stats,
  statsLabel,
  onNavigate,
  className,
}) => (
  <section
    aria-label="Your account"
    className={classNames(
      'flex flex-col gap-[16px] rounded-[16px] border-[1.4px] border-solid border-[#e1eae2] bg-white px-[9.6px] py-[17.6px]',
      className
    )}
  >
    <span
      aria-hidden="true"
      className="mx-auto flex size-[62px] items-center justify-center rounded-full bg-[#387440] font-sans text-[22px] leading-[26px] font-semibold text-white"
    >
      {monogram}
    </span>
    <div className="flex flex-col items-center gap-[7px]">
      <div className="flex items-center gap-[5px]">
        <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.2px] text-[#1c2a21]">
          {name}
        </span>
        <span className="inline-flex h-[18px] items-center gap-[3px] rounded-[4px] bg-[#eaeffb] py-[2px] pr-[7px] pl-[6px] font-sans text-[10px] max-lg:text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#244a9f]">
          <AgencyShieldIcon className="size-[8px] text-[#185fa5]" />
          {role}
        </span>
      </div>
      <p className="m-0 text-center font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#babab7]">
        {subtitle}
      </p>
      <p className="m-0 flex items-center gap-[5px] font-sans text-[12px] leading-[16px] font-medium tracking-[0.2px] text-[#387440]">
        <span aria-hidden="true" className="size-[4px] rounded-full bg-[#387440]" />
        {status}
      </p>
    </div>
    <div className="mx-[9px] flex flex-col gap-[8px]">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[13px] leading-[16px] font-semibold tracking-[0.2px] text-[#1c2a21]">
          {meter.label}
        </span>
        <span className="font-sans text-[11px] max-lg:text-[12px] leading-[16px] font-medium tracking-[0.2px] text-[#babab7]">
          {meter.pct}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={meter.label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={meter.pct}
        className="h-[7px] w-full overflow-hidden rounded-[4px] bg-[#ebf1ec]/50"
      >
        <div
          className="h-full rounded-[4px] bg-[linear-gradient(135deg,#1f4a2b,#3f7f4c)]"
          style={{ width: `${meter.pct}%` }}
        />
      </div>
      {/* the vertical padding gives the small link a 24px touch target without moving it (negative margin cancels it) */}
      <Link
        to={link.to}
        onClick={onNavigate}
        className="-my-[5.5px] inline-block self-start py-[5.5px] font-sans text-[11px] max-lg:text-[12px] leading-[13px] tracking-[0.2px] text-[#70706e] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        {link.label}
      </Link>
    </div>
    <div
      role="group"
      aria-label={statsLabel}
      className="flex items-center gap-[4px] rounded-[10px] border border-solid border-[#faf4e8] bg-[#ebf1ec]/50 px-[3px] py-[9px]"
    >
      {stats.map((s, i) => (
        <Fragment key={s.label}>
          {i ? <span aria-hidden="true" className="h-[28px] w-px bg-[#ebf1ec]" /> : null}
          <Stat value={s.value} label={s.label} />
        </Fragment>
      ))}
    </div>
  </section>
);

const AgencyPersonaCard = ({ session, onNavigate, className }) => {
  const { analyst, agency, mou, quota, stats } = session;
  log('render', { status: mou.status, pct: quota.pct });
  return (
    <PersonaCard
      monogram={analyst.monogram}
      name={analyst.name}
      role={analyst.role}
      subtitle={`${analyst.title} · ${agency.short}`}
      status={mou.label}
      meter={{ label: 'Query quota this month', pct: quota.pct }}
      link={{ to: `${AGENCY_BASE}/settings/mou`, label: 'View MoU and access →' }}
      stats={[
        { value: stats.regions, label: 'Regions' },
        { value: stats.requests, label: 'Requests' },
        { value: stats.programmes, label: 'Programmes' },
      ]}
      statsLabel="Your agency in numbers"
      onNavigate={onNavigate}
      className={className}
    />
  );
};

export default AgencyPersonaCard;
