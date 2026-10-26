import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { formatCount } from '../agencyFormat.js';
import AgencyMobileChip from './AgencyMobileChip.jsx';
import AgencyMobileWidget from './AgencyMobileWidget.jsx';
import { MOBILE_HOME } from './data/agencyHomeData.js';
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
  AgMSparkles,
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
 * for every ?state / ?quota. Live: `data` is liveMobile(GET /agency/home, session) — the request tabs filter the list (Pending = in review or
 * needing detail, Approved = open access), every request / query links to its own page, empty sections say so. The agency chip opens settings.
 */

const TAB_DEFAULT = 'pending';

const EMPTY_LINE = 'm-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]';

const AgencyHomeMobile = ({ firstName, short, data: M = MOBILE_HOME }) => {
  const [tab, setTab] = useState(TAB_DEFAULT);
  const [windowId, setWindowId] = useState(M.applicants.activeWindow);
  const requestItems = M.requests.items.filter((r) =>
    !r.state
      ? true
      : tab === 'approved'
        ? r.state === 'approved'
        : ['pending', 'needs-detail'].includes(r.state)
  );
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

      <Link
        to="/agency/settings"
        aria-label={`Agency: ${M.org}`}
        onClick={() => log('agency settings')}
        className="flex min-h-[50px] w-full items-center gap-[10px] rounded-[10px] border border-solid border-[#e5e8e3] bg-white px-[16px] py-[12px] text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <AgMBuilding className="size-[20px] text-[#575755]" />
        <span className="flex-1 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111111]">
          {M.org}
        </span>
        <AgMChevronDown className="size-[20px] text-[#575755]" />
      </Link>

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
          {requestItems.length === 0 ? (
            <p className={EMPTY_LINE}>
              {tab === 'approved' ? 'No open access right now.' : 'Nothing in review.'}
            </p>
          ) : null}
          {requestItems.map((r) => (
            <div
              key={r.id || r.name}
              className="flex flex-col gap-[12px] rounded-[10px] border border-solid border-[#e5e8e3] p-[12px]"
            >
              <div className="flex items-start gap-[10px]">
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
                </div>
              </div>
              <Link
                to={r.to || '/agency/data-requests'}
                className="inline-flex h-[34px] w-fit items-center rounded-[10px] border border-solid border-[#c7c9c4] bg-white px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#111111] no-underline shadow-[0_3px_0_rgba(17,17,17,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {r.action}
              </Link>
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
          {M.programmes.items.length === 0 ? (
            <p className={EMPTY_LINE}>
              No live programmes yet. Post one to reach eligible talents.
            </p>
          ) : null}
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
        icon={<AgMSparkles className="size-[16px]" />}
        title={M.changes.title}
        subtitle={M.changes.sub}
      >
        <div className="flex flex-col gap-[12px]">
          <div className="flex flex-col items-start gap-[8px]">
            <Link
              to="/agency/queries/saved?tab=shared"
              onClick={() => log('query set')}
              className="flex h-[36px] w-[193px] max-w-full items-center gap-[6px] rounded-[10px] border border-solid border-[#dbded9] bg-[#fffefc] py-[7px] pr-[10px] pl-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#111111] no-underline"
            >
              <AgMBriefcase className="size-[14px] shrink-0" />
              <span className="flex-1 truncate text-left">{M.changes.set}</span>
              <AgMChevronDown className="size-[14px] shrink-0" />
            </Link>
            <Link
              to="/agency/queries/saved"
              className="inline-flex h-[32px] items-center gap-[6px] px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#387440] no-underline"
            >
              {M.changes.all}
              <AgMArrowRight className="size-[14px]" />
            </Link>
          </div>
          <div className="flex items-center gap-[8px]">
            <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111111]">
              {M.changes.movesLabel}
            </span>
            <AgencyMobileChip tone="plain" className="!border-0">
              {M.changes.movesCount}
            </AgencyMobileChip>
          </div>
          {M.changes.moves.length === 0 ? (
            <p className={EMPTY_LINE}>No saved queries yet.</p>
          ) : null}
          <ul className="m-0 flex list-none gap-[16px] overflow-x-auto p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {M.changes.moves.map((m) => (
              <li
                key={m.name}
                className="flex w-[240px] shrink-0 flex-col gap-[10px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[16px]"
              >
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden="true"
                    className="grid size-[44px] place-items-center rounded-full bg-[#ebf1ec] text-[#387440]"
                  >
                    <AgMChartBar className="size-[20px]" />
                  </span>
                  <AgencyMobileChip tone="mint" icon={<AgMSparkles className="size-[12px]" />}>
                    {m.delta}
                  </AgencyMobileChip>
                </div>
                <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111111]">
                  {m.name}
                </span>
                <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                  {m.meta}
                </span>
                <span className="flex flex-nowrap gap-[6px] overflow-hidden">
                  {m.tags.map((t, i) => (
                    <AgencyMobileChip key={`${t}-${i}`} tone="plain">
                      {t}
                    </AgencyMobileChip>
                  ))}
                </span>
                <span aria-hidden="true" className="h-px bg-[#e5e8e3]" />
                <span className="flex items-center gap-[6px]">
                  <Link
                    to="/agency/queries/saved"
                    aria-label={`${m.name} in saved queries`}
                    className="grid size-[32px] place-items-center rounded-[10px] border border-solid border-[#dbded9] text-[#111111]"
                  >
                    <AgMBookmark className="size-[16px]" />
                  </Link>
                  <Link
                    to="/agency/queries/saved"
                    className="inline-flex h-[34px] items-center justify-center rounded-[10px] border border-solid border-[#c7c9c4] bg-white px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#111111] no-underline shadow-[0_3px_0_rgba(17,17,17,0.18)]"
                  >
                    {M.changes.view}
                  </Link>
                  <Link
                    to={m.href || '/agency/queries'}
                    className="ml-[6px] inline-flex h-[32px] items-center justify-center gap-[6px] rounded-[10px] bg-[#387440] px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-white no-underline shadow-[0_3px_0_#2a5730]"
                  >
                    <AgMSend className="size-[14px]" />
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
                icon={l.tone === 'hot' ? <AgMFlame className="size-[12px]" /> : undefined}
              >
                {l.label}
              </AgencyMobileChip>
            ))}
          </div>
          {M.skills.rows.length === 0 ? (
            <p className={EMPTY_LINE}>No skill is held by 5 or more talents yet.</p>
          ) : null}
          <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
            {M.skills.rows.map((r) => (
              <li
                key={r.name}
                className="flex items-center gap-[10px] rounded-[10px] bg-[#f9ebea] p-[12px]"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className="font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#111111]">
                    {r.name}
                  </span>
                  <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                    {formatCount(r.talents)} talents
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

export default AgencyHomeMobile;
