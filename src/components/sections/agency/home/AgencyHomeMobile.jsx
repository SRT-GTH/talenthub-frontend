import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { formatCount } from '../agencyFormat.js';
import AgencyMobileChip from './AgencyMobileChip.jsx';
import AgencyMobileWidget from './AgencyMobileWidget.jsx';
import { MOBILE_HOME as M } from './data/agencyHomeData.js';
import {
  AgMAlert,
  AgMArrowRight,
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
  AgMShieldCheck,
  AgMTrendingUp,
  AgMUpload,
  AgMUsers,
  AgMChartBar,
  AgMBookmark,
  AgMSend,
} from './agencyHomeIcons.jsx';

const log = debug('AgencyHomeMobile');

/*
 * AgencyHomeMobile — the body of the agency home below lg (Figma 11.4.0d "Agency home · Mobile" 8613:8, 360 wide; the top bar is the chrome's, AgencyFrame).
 * A column of widgets (gap 16, p 16): greeting · agency switcher · MoU · Data requests · Live programmes · Applicants · Saved query changes · Readiness by skill.
 * ⚠️ ASSUMPTION: the Figma phone home is the same dashboard for every state (first login / quota nearly used are drawn on desktop only), so the phone shows this body
 * for every ?state / ?quota. The agency switcher (NYA ▾) has no menu drawn: it is a button that logs the intent. The data-request tabs (Pending / Approved) switch
 * the active tab style only (the three requests are the one list drawn).
 */

const TAB_DEFAULT = 'pending';

const AgencyHomeMobile = ({ firstName, short }) => {
  const [tab, setTab] = useState(TAB_DEFAULT);
  const [windowId, setWindowId] = useState(M.applicants.activeWindow);
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[4px]">
        <h1 className="m-0 font-sans text-[24px] leading-[30px] font-semibold tracking-[-0.12px] text-[#111111]">
          <span className="text-[#0f1712]">{M.greeting}</span>
          <span className="text-[#387440]">{firstName}</span>
        </h1>
        <p className="m-0 font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
          {M.sub.replace('{short}', short)}
        </p>
      </div>

      <button
        type="button"
        aria-label={`Agency: ${M.org}`}
        onClick={() => log('agency switcher')}
        className="flex min-h-[50px] w-full items-center gap-[10px] rounded-[10px] border border-solid border-[#e5e8e3] bg-white px-[16px] py-[12px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <AgMBuilding className="size-[20px] text-[#575755]" />
        <span className="flex-1 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111111]">
          {M.org}
        </span>
        <AgMChevronDown className="size-[20px] text-[#575755]" />
      </button>

      <AgencyMobileWidget
        id="m-mou"
        icon={<AgMShieldCheck className="size-[16px]" />}
        title={M.mou.title}
        subtitle={M.mou.sub}
      >
        <div className="flex flex-col gap-[12px]">
          {[M.mou.director, M.mou.ref].map((row, i) => (
            <div
              key={row.title}
              className={classNames(
                'flex items-start gap-[12px] rounded-[10px] px-[16px] py-[12px]',
                i === 0 ? 'bg-[#ebf1ec]/50' : 'bg-[#faf4e8]'
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
              <AgencyMobileChip
                tone={row.tone}
                icon={
                  i === 0 ? (
                    <AgMCheck className="size-[12px]" />
                  ) : (
                    <AgMClock className="size-[12px]" />
                  )
                }
              >
                {row.chip}
              </AgencyMobileChip>
            </div>
          ))}
          <div className="flex flex-col gap-[8px]">
            <p className="m-0 font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#575755]">
              {M.mou.docsLabel}
            </p>
            {M.mou.docs.map((d) => (
              <div key={d.name} className="flex items-center gap-[10px]">
                <AgMFile className="size-[16px] shrink-0 text-[#575755]" />
                <span className="flex-1 font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#111111]">
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
            {M.mou.note}
          </p>
          <Link
            to="/agency/mou"
            className="flex min-h-[46px] items-center justify-center gap-[6px] rounded-[10px] bg-[#387440] px-[18px] py-[11px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-white no-underline shadow-[0_3px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <AgMUpload className="size-[16px]" />
            {M.mou.action}
          </Link>
        </div>
      </AgencyMobileWidget>

      <AgencyMobileWidget
        id="m-requests"
        icon={<AgMFeedback className="size-[16px]" />}
        title={M.requests.title}
        subtitle={M.requests.sub}
      >
        <div className="flex flex-col gap-[12px]">
          <div
            role="tablist"
            aria-label="Data requests"
            className="flex gap-[4px] rounded-[10px] bg-[#fefefe] p-[3px]"
          >
            {M.requests.tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={classNames(
                  'min-h-[34px] flex-1 rounded-[6px] font-sans text-[12px] leading-[20px] tracking-[0.2px]',
                  tab === t.id
                    ? 'bg-white font-medium text-[#785910] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)]'
                    : 'text-[#575755]'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          {M.requests.items.map((r) => (
            <div
              key={r.name}
              className="flex items-start gap-[10px] rounded-[10px] border border-solid border-[#e5e8e3] p-[12px]"
            >
              <span
                aria-hidden="true"
                className="grid size-[36px] shrink-0 place-items-center rounded-full bg-[#ebf1ec] text-[#387440]"
              >
                <AgMChartBar className="size-[20px]" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111111]">
                  {r.name}
                </span>
                <span
                  className={classNames(
                    'font-sans text-[12px] leading-[20px] tracking-[0.2px]',
                    r.tone === 'warn' ? 'text-[#785910]' : 'text-[#575755]'
                  )}
                >
                  {r.status}
                </span>
                <Link
                  to="/agency/data-requests"
                  className="mt-[8px] inline-flex min-h-[34px] w-fit items-center rounded-[10px] border border-solid border-[#c7c9c4] bg-white px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#111111] no-underline shadow-[0_3px_0_rgba(17,17,17,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  {r.action}
                </Link>
              </div>
            </div>
          ))}
          <Link
            to="/agency/data-requests"
            className="inline-flex min-h-[32px] items-center gap-[6px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#387440] no-underline"
          >
            {M.requests.all}
            <AgMArrowRight className="size-[14px]" />
          </Link>
        </div>
      </AgencyMobileWidget>

      <AgencyMobileWidget
        id="m-programmes"
        icon={<AgMBriefcase className="size-[16px]" />}
        title={M.programmes.title}
        count={M.programmes.count}
        subtitle={M.programmes.sub}
      >
        <div className="flex flex-col gap-[12px]">
          {M.programmes.items.map((p) => (
            <Link
              key={p.name}
              to="/agency/programmes"
              className="flex items-center gap-[10px] rounded-[10px] border border-solid border-[#e5e8e3] p-[12px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
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
            to="/agency/programmes"
            className="flex min-h-[48px] items-center justify-center gap-[6px] rounded-[10px] border border-solid border-[#c7c9c4] bg-white px-[18px] py-[11px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111111] no-underline shadow-[0_3px_0_rgba(17,17,17,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {M.programmes.all}
            <AgMArrowRight className="size-[16px]" />
          </Link>
        </div>
      </AgencyMobileWidget>

      <AgencyMobileWidget
        id="m-applicants"
        icon={<AgMPipeline className="size-[16px]" />}
        title={M.applicants.title}
        subtitle={M.applicants.sub}
      >
        <div className="flex flex-col gap-[12px]">
          <div role="group" aria-label="Window" className="flex gap-[6px]">
            {M.applicants.windows.map((w) => (
              <button
                key={w}
                type="button"
                aria-pressed={windowId === w}
                onClick={() => setWindowId(w)}
                className={classNames(
                  'min-h-[28px] rounded-full px-[8px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px]',
                  windowId === w
                    ? 'bg-[#ebf1ec] text-[#2a5730]'
                    : 'border border-solid border-[#dbded9] bg-white text-[#111111]'
                )}
              >
                {w}
              </button>
            ))}
          </div>
          {M.applicants.stages.map((s) => (
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
                  {formatCount(s.n)}
                </span>
              </div>
              <div className="h-[8px] rounded-[8px] bg-[#fefefe]">
                <div className="h-full rounded-[8px] bg-[#387440]" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-[8px]">
            <AgencyMobileChip tone="hot">{M.applicants.notEligible}</AgencyMobileChip>
            <AgencyMobileChip tone="plain" className="!border-0 !text-[#575755]">
              {M.applicants.withdrawn}
            </AgencyMobileChip>
          </div>
        </div>
      </AgencyMobileWidget>

      <AgencyMobileWidget
        id="m-changes"
        icon={<AgMTrendingUp className="size-[16px]" />}
        title={M.changes.title}
        subtitle={M.changes.sub}
      >
        <div className="flex flex-col gap-[12px]">
          <button
            type="button"
            onClick={() => log('query set')}
            className="flex min-h-[40px] w-fit items-center gap-[6px] rounded-[10px] border border-solid border-[#dbded9] bg-white px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#111111]"
          >
            <AgMBookmark className="size-[14px]" />
            {M.changes.set}
            <AgMChevronDown className="size-[14px]" />
          </button>
          <Link
            to="/agency/queries"
            className="font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#387440] no-underline"
          >
            {M.changes.all}
          </Link>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111111]">
              {M.changes.movesLabel}
            </span>
            <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
              {M.changes.movesCount}
            </span>
          </div>
          <ul className="m-0 flex list-none gap-[12px] overflow-x-auto p-0 pb-[4px]">
            {M.changes.moves.map((m) => (
              <li
                key={m.name}
                className="flex w-[232px] shrink-0 flex-col gap-[8px] rounded-[10px] border border-solid border-[#e5e8e3] p-[12px]"
              >
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden="true"
                    className="grid size-[28px] place-items-center rounded-[6px] bg-[#ebf1ec] text-[#387440]"
                  >
                    <AgMChartBar className="size-[16px]" />
                  </span>
                  <AgencyMobileChip tone="mint" icon={<AgMTrendingUp className="size-[12px]" />}>
                    {m.delta}
                  </AgencyMobileChip>
                </div>
                <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111111]">
                  {m.name}
                </span>
                <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                  {m.meta}
                </span>
                <span className="flex flex-wrap gap-[6px]">
                  {m.tags.map((t, i) => (
                    <AgencyMobileChip key={`${t}-${i}`} tone="plain">
                      {t}
                    </AgencyMobileChip>
                  ))}
                </span>
                <span className="flex gap-[8px]">
                  <Link
                    to="/agency/queries"
                    className="inline-flex min-h-[34px] flex-1 items-center justify-center rounded-[10px] border border-solid border-[#c7c9c4] bg-white font-sans text-[12px] leading-[20px] font-medium text-[#111111] no-underline"
                  >
                    {M.changes.view}
                  </Link>
                  <Link
                    to="/agency/queries"
                    className="inline-flex min-h-[34px] flex-1 items-center justify-center gap-[4px] rounded-[10px] bg-[#387440] font-sans text-[12px] leading-[20px] font-medium text-white no-underline"
                  >
                    <AgMSend className="size-[12px]" />
                    {M.changes.open}
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </AgencyMobileWidget>

      <AgencyMobileWidget
        id="m-skills"
        icon={<AgMFlame className="size-[16px]" />}
        title={M.skills.title}
        subtitle={M.skills.sub}
      >
        <div className="flex flex-col gap-[12px]">
          <div className="flex gap-[8px]">
            {M.skills.legend.map((l) => (
              <AgencyMobileChip
                key={l.label}
                tone={l.tone === 'hot' ? 'hot' : l.tone === 'warm' ? 'warn' : 'cool'}
              >
                {l.label}
              </AgencyMobileChip>
            ))}
          </div>
          <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
            {M.skills.rows.map((r) => (
              <li
                key={r.name}
                className="flex items-center justify-between gap-[8px] rounded-[10px] bg-[#f9ebea] px-[12px] py-[10px]"
              >
                <span className="flex flex-col">
                  <span className="font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#111111]">
                    {r.name}
                  </span>
                  <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                    {formatCount(r.talents)} talents
                  </span>
                </span>
                <span className="inline-flex items-center gap-[4px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#165d3a]">
                  <AgMTrendingUp className="size-[14px]" />
                  {r.delta}
                </span>
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

export default AgencyHomeMobile;
