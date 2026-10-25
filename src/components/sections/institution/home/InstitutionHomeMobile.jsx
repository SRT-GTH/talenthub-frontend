import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import akosua from '../../../../assets/institution/home/top-student-akosua.png';
import akua from '../../../../assets/institution/home/top-student-akua.png';
import fati from '../../../../assets/institution/home/top-student-fati.png';
import yaw from '../../../../assets/institution/home/top-student-yaw.png';
import AgencyMobileChip from '../../agency/home/AgencyMobileChip.jsx';
import AgencyMobileWidget from '../../agency/home/AgencyMobileWidget.jsx';
import {
  AgMAlert,
  AgMArrowRight,
  AgMBookmark,
  AgMBriefcase,
  AgMBuilding,
  AgMCheck,
  AgMChevronDown,
  AgMChevronRight,
  AgMClock,
  AgMFeedback,
  AgMFile,
  AgMFlame,
  AgMInfo,
  AgMPipeline,
  AgMSend,
  AgMShieldCheck,
  AgMSparkles,
  AgMTrendingUp,
  AgMUpload,
  AgMUsers,
} from '../../agency/home/agencyHomeIcons.jsx';
import { formatCount } from '../institutionFormat.js';
import { IhLock } from './institutionHomeIcons.jsx';
import { MOBILE_HOME as M } from './data/institutionHomeData.js';

const log = debug('InstitutionHomeMobile');

/*
 * InstitutionHomeMobile — the body of the institution home below lg (Figma 11.2.1c "Institution home · Mobile" 8588:960, 360 wide; the top bar is the chrome's, InstitutionFrame).
 * A column of widgets (gap 16, p 0 inside the frame's padding): greeting · institution switcher · Verification · Records to verify · Your programmes · Student journey ·
 * Top students · In-demand skills. The widget shell, the chips and the icons are the agency phone home's (identical Figma components, read-only import).
 * ⚠️ ASSUMPTION: the phone home is the same dashboard for every state (first login / new institution are drawn on desktop only). The institution switcher has no menu drawn: it logs
 * the intent. The records tabs and the journey window chips only switch their active style (one list / one data set is drawn).
 */

const PHOTOS = { akua, fati, akosua, yaw };
const SHELF_BTN =
  'border border-solid border-[#c7c9c4] bg-white text-[#111111] no-underline shadow-[0_3px_0_rgba(34,70,38,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const InstitutionHomeMobile = ({ firstName, short }) => {
  const [tab, setTab] = useState(M.records.tabs[0].id);
  const [windowId, setWindowId] = useState(M.journey.activeWindow);
  useEffect(() => {
    log('mount');
  }, []);
  const v = M.verification;
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[4px]">
        <h1 className="m-0 font-sans text-[24px] leading-[30px] font-semibold tracking-[-0.12px] text-[#111111]">
          <span className="text-[#0f1712]">{M.greeting[0]}</span>
          <span className="text-[#387440]">{M.greeting[1].replace('{first}', firstName)}</span>
        </h1>
        <p className="m-0 font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
          {M.sub}
        </p>
      </div>

      <button
        type="button"
        aria-label={`Institution: ${short}`}
        onClick={() => log('institution switcher')}
        className="flex min-h-[48px] w-full items-center gap-[10px] rounded-[10px] border border-solid border-[#e5e8e3] bg-white px-[16px] py-[12px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <AgMBuilding className="size-[20px] text-[#387440]" />
        <span className="flex-1 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111111]">
          {short}
        </span>
        <AgMChevronDown className="size-[20px] text-[#575755]" />
      </button>

      <AgencyMobileWidget
        id="im-verification"
        icon={<AgMShieldCheck className="size-[16px]" />}
        title={v.title}
        subtitle={v.sub}
      >
        <div className="flex flex-col gap-[12px]">
          {[
            { row: v.head, tone: 'ok', bg: 'bg-[#ebf1ec]/50', icon: AgMCheck },
            { row: v.ges, tone: 'warn', bg: 'bg-[#faf4e8]', icon: AgMClock },
          ].map(({ row, tone, bg, icon }) => {
            const Glyph = icon;
            return (
              <div
                key={row.title}
                className={classNames(
                  'flex items-center gap-[12px] rounded-[10px] px-[16px] py-[12px]',
                  bg
                )}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111111]">
                    {row.title}
                  </span>
                  <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                    {row.sub}
                  </span>
                </div>
                <AgencyMobileChip tone={tone} icon={<Glyph className="size-[12px]" />}>
                  {row.chip}
                </AgencyMobileChip>
              </div>
            );
          })}
          <div className="flex flex-col gap-[8px]">
            <p className="m-0 font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#575755]">
              {v.docsLabel}
            </p>
            {v.docs.map((d) => (
              <div key={d.name} className="flex items-center gap-[10px]">
                <AgMFile className="size-[16px] shrink-0 text-[#575755]" />
                <span className="min-w-0 flex-1 font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#111111]">
                  {d.name}
                </span>
                <AgencyMobileChip
                  tone={d.tone}
                  icon={
                    d.tone === 'ok' ? (
                      <AgMCheck className="size-[12px]" />
                    ) : (
                      <AgMAlert className="size-[12px]" />
                    )
                  }
                >
                  {d.chip}
                </AgencyMobileChip>
              </div>
            ))}
          </div>
          <p className="m-0 flex items-center gap-[8px] font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            <AgMInfo className="size-[16px] shrink-0" />
            {v.note}
          </p>
          <Link
            to={v.to}
            className="flex min-h-[46px] items-center justify-center gap-[6px] rounded-[10px] bg-[#387440] px-[18px] py-[11px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-white no-underline shadow-[0_3px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <AgMUpload className="size-[16px]" />
            {v.action}
          </Link>
        </div>
      </AgencyMobileWidget>

      <AgencyMobileWidget
        id="im-records"
        icon={<AgMFeedback className="size-[16px]" />}
        title={M.records.title}
        subtitle={M.records.sub}
      >
        <div className="flex flex-col gap-[12px]">
          <div
            role="tablist"
            aria-label="Records"
            className="flex gap-[4px] rounded-[10px] bg-[#fefefe] p-[3px]"
          >
            {M.records.tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={classNames(
                  'min-h-[34px] flex-1 rounded-[6px] font-sans text-[12px] leading-[20px] tracking-[0.2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                  tab === t.id
                    ? 'bg-white font-medium text-[#785910] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)]'
                    : 'text-[#575755]'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          {M.records.items.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-center gap-[10px] rounded-[10px] border border-solid border-[#e5e8e3] p-[12px]"
            >
              <span
                aria-hidden="true"
                style={{ backgroundColor: r.tint, color: r.ink }}
                className="grid size-[36px] shrink-0 place-items-center rounded-full font-sans text-[12px] leading-[20px] font-semibold tracking-[0.1px]"
              >
                {r.initials}
              </span>
              <span className="flex min-w-[140px] flex-1 flex-col gap-[2px]">
                <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111111]">
                  {r.title}
                </span>
                <span
                  className={classNames(
                    'font-sans text-[12px] leading-[20px] tracking-[0.2px]',
                    r.late ? 'text-[#785910]' : 'text-[#575755]'
                  )}
                >
                  {r.sent}
                </span>
              </span>
              <Link
                to={M.records.to}
                aria-label={`${M.records.action}: ${r.title}`}
                className={classNames(
                  SHELF_BTN,
                  'inline-flex min-h-[32px] items-center justify-center rounded-[10px] px-[12px] py-[6px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px]'
                )}
              >
                {M.records.action}
              </Link>
            </div>
          ))}
          <Link
            to={M.records.to}
            className="inline-flex min-h-[32px] items-center gap-[6px] self-start px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {M.records.all}
            <AgMArrowRight className="size-[14px]" />
          </Link>
        </div>
      </AgencyMobileWidget>

      <AgencyMobileWidget
        id="im-programmes"
        icon={<AgMBriefcase className="size-[16px]" />}
        title={M.programmes.title}
        count={M.programmes.count}
        subtitle={M.programmes.sub}
      >
        <div className="flex flex-col gap-[12px]">
          {M.programmes.items.map((p) => (
            <Link
              key={p.id}
              to={`/institution/programmes/${p.id}`}
              className="flex min-h-[56px] items-center gap-[10px] rounded-[10px] border border-solid border-[#e5e8e3] p-[12px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-[4px]">
                <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111111]">
                  {p.name}
                </span>
                <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                  {p.meta}
                </span>
                <span className="flex flex-wrap gap-[6px]">
                  <AgencyMobileChip tone="plain" icon={<AgMUsers className="size-[12px]" />}>
                    {p.chips[0]}
                  </AgencyMobileChip>
                  <AgencyMobileChip tone="ok">{p.chips[1]}</AgencyMobileChip>
                </span>
              </span>
              <AgMChevronRight className="size-[20px] shrink-0 text-[#575755]" />
            </Link>
          ))}
          <Link
            to={M.programmes.to}
            className={classNames(
              SHELF_BTN,
              'flex min-h-[46px] items-center justify-center gap-[6px] rounded-[10px] px-[18px] py-[11px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px]'
            )}
          >
            {M.programmes.all}
            <AgMArrowRight className="size-[16px]" />
          </Link>
        </div>
      </AgencyMobileWidget>

      <AgencyMobileWidget
        id="im-journey"
        icon={<AgMPipeline className="size-[16px]" />}
        title={M.journey.title}
        subtitle={M.journey.sub}
      >
        <div className="flex flex-col gap-[12px]">
          <div role="group" aria-label="Window" className="flex gap-[6px]">
            {M.journey.windows.map((w) => (
              <button
                key={w}
                type="button"
                aria-pressed={windowId === w}
                onClick={() => setWindowId(w)}
                className={classNames(
                  'min-h-[28px] rounded-full px-[8px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                  windowId === w
                    ? 'bg-[#ebf1ec] text-[#2a5730]'
                    : 'border border-solid border-[#dbded9] bg-white text-[#111111]'
                )}
              >
                {w}
              </button>
            ))}
          </div>
          {M.journey.stages.map((s) => (
            <div key={s.label} className="flex flex-col gap-[6px]">
              <div className="flex items-center gap-[8px]">
                <span className="flex-1 font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#111111]">
                  {s.label}
                </span>
                {s.from ? (
                  <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                    {s.from}
                  </span>
                ) : null}
                <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111111]">
                  {s.n.toLocaleString('en-GB')}
                </span>
              </div>
              <div className="h-[8px] rounded-[8px] bg-[#fefefe]">
                <div
                  className="h-full rounded-[8px] bg-[#387440]"
                  style={{ width: `${(s.n / M.journey.total) * M.journey.fullPct}%` }}
                />
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-[6px]">
            <AgencyMobileChip tone="hot">{M.journey.inactive}</AgencyMobileChip>
            <AgencyMobileChip tone="plain" className="!border-0 !bg-[#fefefe] !text-[#575755]">
              {M.journey.withdrawn}
            </AgencyMobileChip>
          </div>
        </div>
      </AgencyMobileWidget>

      <AgencyMobileWidget
        id="im-top"
        icon={<AgMSparkles className="size-[16px]" />}
        title={M.top.title}
        subtitle={M.top.sub}
      >
        <div className="flex flex-col gap-[12px]">
          <div className="flex flex-wrap items-center gap-[8px]">
            <button
              type="button"
              onClick={() => log('class select')}
              className="flex h-[36px] items-center gap-[6px] rounded-[10px] border border-solid border-[#dbded9] bg-[#fffefc] py-[7px] pr-[10px] pl-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#111111]"
            >
              <AgMBriefcase className="size-[14px] shrink-0 text-[#575755]" />
              <span>{M.top.select}</span>
              <AgMChevronDown className="size-[14px] shrink-0 text-[#575755]" />
            </button>
            <Link
              to={M.top.to}
              className="inline-flex min-h-[32px] items-center gap-[6px] px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {M.top.all}
              <AgMArrowRight className="size-[14px]" />
            </Link>
          </div>
          <div className="flex items-center gap-[8px]">
            <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111111]">
              {M.top.groupLabel}
            </span>
            <AgencyMobileChip tone="plain" className="!border-0 !bg-[#fefefe] !text-[#575755]">
              {M.top.groupChip}
            </AgencyMobileChip>
          </div>
          <ul
            tabIndex={0}
            aria-label={M.top.groupLabel}
            className="m-0 flex list-none gap-[16px] overflow-x-auto p-0 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] [&::-webkit-scrollbar]:hidden"
          >
            {M.top.items.map((t) => (
              <li
                key={t.id}
                className={classNames(
                  'flex w-[240px] shrink-0 flex-col gap-[10px] rounded-[16px] border border-solid border-[#e5e8e3] p-[16px]',
                  t.photo ? 'bg-white' : 'bg-[#fffefc]'
                )}
              >
                <div className="flex items-center justify-between">
                  {t.photo ? (
                    <img
                      src={PHOTOS[t.photo]}
                      alt=""
                      width="44"
                      height="44"
                      className="size-[44px] rounded-[22px] object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid size-[44px] place-items-center rounded-full bg-[#bcb7a8] text-white"
                    >
                      <IhLock className="size-[20px]" />
                    </span>
                  )}
                  <AgencyMobileChip tone="mint" icon={<AgMSparkles className="size-[12px]" />}>
                    {t.fit}
                  </AgencyMobileChip>
                </div>
                <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111111]">
                  {t.name}
                </span>
                <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                  {t.meta}
                </span>
                <span className="flex flex-wrap gap-[6px]">
                  {t.tags.map((tag, i) => (
                    <AgencyMobileChip key={`${tag}-${i}`} tone="plain">
                      {tag}
                    </AgencyMobileChip>
                  ))}
                </span>
                <span aria-hidden="true" className="h-px bg-[#e5e8e3]" />
                <span className="flex items-center gap-[6px]">
                  <button
                    type="button"
                    aria-label={`Save ${t.name}`}
                    onClick={() => log('save', t.id)}
                    className="grid size-[32px] shrink-0 place-items-center rounded-[10px] border border-solid border-[#dbded9] text-[#111111]"
                  >
                    <AgMBookmark className="size-[16px]" />
                  </button>
                  <Link
                    to={M.top.to}
                    className={classNames(
                      SHELF_BTN,
                      'inline-flex min-h-[34px] min-w-0 flex-1 items-center justify-center rounded-[10px] px-[12px] py-[6px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px]'
                    )}
                  >
                    {M.top.review}
                  </Link>
                  <Link
                    to="/institution/messages/new"
                    className="inline-flex min-h-[32px] min-w-0 flex-1 items-center justify-center gap-[6px] rounded-[10px] bg-[#387440] px-[12px] py-[6px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-white no-underline shadow-[0_3px_0_#2a5730]"
                  >
                    <AgMSend className="size-[14px]" />
                    {M.top.message}
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </AgencyMobileWidget>

      <AgencyMobileWidget
        id="im-skills"
        icon={<AgMFlame className="size-[16px]" />}
        title={M.skills.title}
        subtitle={M.skills.sub}
      >
        <div className="flex flex-col gap-[12px]">
          <div className="flex gap-[6px]">
            {M.skills.legend.map((l) => (
              <AgencyMobileChip
                key={l.label}
                tone={l.tone === 'hot' ? 'hot' : l.tone === 'warm' ? 'warn' : 'cool'}
                icon={l.tone === 'hot' ? <AgMFlame className="size-[12px]" /> : undefined}
              >
                {l.label}
              </AgencyMobileChip>
            ))}
          </div>
          <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
            {M.skills.rows.map((r) => (
              <li
                key={r.name}
                className="flex min-h-[48px] items-center gap-[10px] rounded-[10px] bg-[#f9ebea] p-[12px]"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className="font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#111111]">
                    {r.name}
                  </span>
                  <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                    {formatCount(r.students)} students
                  </span>
                </span>
                <AgencyMobileChip tone="ok" icon={<AgMTrendingUp className="size-[12px]" />}>
                  {r.delta}
                </AgencyMobileChip>
              </li>
            ))}
          </ul>
          <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {M.skills.foot}
          </p>
        </div>
      </AgencyMobileWidget>
    </div>
  );
};

export default InstitutionHomeMobile;
