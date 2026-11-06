import { Link } from 'react-router-dom';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import { renderWorkspaceSidebar } from '../recruiterDashboard/renderWorkspaceSidebar.jsx';
import useScopedRoundedFont from '../../../hooks/useScopedRoundedFont.js';
import { classNames } from '../../../utils/classNames.js';
import { ArrowBack } from './jobIcons.jsx';

/*
 * Shared frame pieces of the recruiter job flows (Figma "Recruiter - Job Postings" 10103:59491).
 *   PageFrame   — the recruiter shell (workspace rail, top bar) + the 1329px content column with the page padding the other recruiter pages use.
 *   BackCrumb   — "← Back to templates  ·  Job Postings / Templates / …" (14/500 #387440 + 12 #575755).
 *   FlowHeading — Bricolage 34/600 title with a green accent run, and the 16px subtitle.
 *   FlowBanner  — the tinted context banner (success / info / warning / danger) with an optional trailing action.
 */
export const PageFrame = ({ children, className }) => {
  useScopedRoundedFont('data-recruiter-ui');
  return (
    <DashboardShell renderSidebar={renderWorkspaceSidebar}>
      <div
        className={classNames(
          'flex w-full flex-col gap-[20px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] max-md:gap-[14px] max-md:py-[16px]',
          className
        )}
      >
        {children}
      </div>
    </DashboardShell>
  );
};

export const BackCrumb = ({ to, label, crumb }) => (
  <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[4px] font-sans">
    <Link
      to={to}
      className="inline-flex items-center gap-[6px] text-[14px] leading-[20px] font-medium text-[#387440] no-underline hover:underline"
    >
      <ArrowBack size={14} />
      {label}
    </Link>
    <span className="text-[12px] leading-[16px] text-[#575755]">·&nbsp;&nbsp;{crumb}</span>
  </div>
);

export const FlowHeading = ({ lead, accent, subtitle }) => (
  <div className="flex flex-col gap-[8px]">
    <h1
      className="m-0 font-heading font-semibold tracking-[-0.02em] text-[#111]"
      style={{ fontSize: 'clamp(1.75rem, 1.4rem + 0.7vw, 2.125rem)', lineHeight: 1.2 }}
    >
      {lead}
      <span className="text-brand-green">{accent}</span>
    </h1>
    {subtitle ? (
      <p className="m-0 font-sans text-[16px] leading-[24px] text-[#575755] max-md:text-[14px]">
        {subtitle}
      </p>
    ) : null}
  </div>
);

const BANNER_TONES = {
  success: 'border-[#dbe7dd] bg-[#eef3ef]',
  info: 'border-[#d5def5] bg-[#eaeffb]',
  warning: 'border-[#f0e3c7] bg-[#faf4e8]',
  danger: 'border-[#f1cfcb] bg-[#f9ebea]',
};
const BANNER_ICON_TONES = {
  success: 'text-[#2a5730]',
  info: 'text-[#244a9f]',
  warning: 'text-[#c8951a]',
  danger: 'text-[#c0392b]',
};

export const FlowBanner = ({ tone = 'success', icon, title, body, action, className }) => (
  <div
    role="status"
    className={classNames(
      'flex items-start justify-between gap-[16px] rounded-[12px] border border-solid px-[20px] py-[16px] max-sm:flex-col max-sm:px-[14px]',
      BANNER_TONES[tone],
      className
    )}
  >
    <div className="flex min-w-0 items-start gap-[12px]">
      <span className={classNames('mt-[1px] shrink-0', BANNER_ICON_TONES[tone])}>{icon}</span>
      <div className="flex min-w-0 flex-col gap-[2px]">
        <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
          {title}
        </span>
        {body ? (
          <span className="font-sans text-[12px] leading-[16px] text-[#575755]">{body}</span>
        ) : null}
      </div>
    </div>
    {action}
  </div>
);
