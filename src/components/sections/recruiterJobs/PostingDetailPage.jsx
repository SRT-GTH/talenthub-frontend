import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { JobButton } from './jobButtons.jsx';
import { BackCrumb, PageFrame } from './jobFlowParts.jsx';
import {
  ArrowRight,
  BadgeCheck,
  CheckGlyph,
  BriefcaseGlyph,
  BuildingGlyph,
  CalendarGlyph,
  CheckCircle,
  CopyGlyph,
  DotsGlyph,
  FilterGlyph,
  LinkGlyph,
  MapPin,
} from './jobIcons.jsx';
import { EDIT_POSTING, POSTING_DETAIL, SENIOR_UX } from './jobFormData.js';
import { useLivePosting } from './useLivePosting.js';

/*
 * PostingDetailPage — the recruiter's view of one live posting (Figma JM-01 "Job detail · recruiter view" 10117:58288; JM-05 "Changes saved · applicants notified" 10117:61762).
 * Route /recruiter/job-postings/:postingId (mock: every id shows Senior UX Designer); `?saved=1` adds the "Updated just now" pill and meta line (JM-05).
 * Header: employer row + status + Edit posting + link + menu; stats row; About; Skills you asked for. Right: Pipeline bars, screening summary, share link.
 * ⚠️ ASSUMPTION: the Pipeline bar widths are proportional to the counts (Applied 42 = the widest in the frame).
 */
const Card = ({ children, className }) => (
  <section
    className={classNames(
      'rounded-[16px] border border-solid border-[#e1eae2] bg-white p-[24px] max-sm:p-[16px]',
      className
    )}
  >
    {children}
  </section>
);

const NOTE_TONE = { good: 'text-[#387440]', warn: 'text-[#463409]' };
const STATUS_PILL = {
  Active: 'bg-[#ebf1ec] text-[#165d3a]',
  Draft: 'bg-[#f3f3f1] text-[#575755]',
  Paused: 'bg-[#faf4e8] text-[#7a5a12]',
  Closed: 'bg-[#fbeceb] text-[#902b20]',
};

const LiveNote = ({ children, tone }) => (
  <PageFrame>
    <BackCrumb to="/recruiter/job-postings" label={POSTING_DETAIL.back} crumb="Job Postings" />
    <p
      role={tone === 'error' ? 'alert' : undefined}
      className={classNames(
        'm-0 font-sans text-[14px] leading-[20px]',
        tone === 'error' ? 'text-[#c0392b]' : 'text-[#575755]'
      )}
    >
      {children}
    </p>
  </PageFrame>
);

const PostingDetailPage = () => {
  const { postingId = 'senior-ux-designer' } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const saved = params.get('saved') === '1';
  const [copied, setCopied] = useState(false);
  const posting = useLivePosting(postingId);
  if (posting.status === 'loading') return <LiveNote>Loading the posting…</LiveNote>;
  if (posting.status === 'missing')
    return <LiveNote tone="error">This posting doesn’t exist or isn’t one of yours.</LiveNote>;
  if (posting.status === 'error')
    return (
      <LiveNote tone="error">
        We couldn’t load this posting. Refresh the page to try again.
      </LiveNote>
    );
  const isLive = posting.status === 'live';
  const v = posting.view;
  // Live: the stored posting; demo: the Figma Senior UX Designer.
  const D = isLive
    ? {
        ...POSTING_DETAIL,
        crumb: `Job Postings / ${v.title}`,
        posted: v.posted,
        status: v.status,
        chips: v.chips,
        stats: v.stats,
        pipeline: { ...POSTING_DETAIL.pipeline, total: v.pipeline.total, rows: v.pipeline.rows },
        share: { ...POSTING_DETAIL.share, url: v.share },
      }
    : POSTING_DETAIL;
  const max = Math.max(1, ...D.pipeline.rows.map((row) => row.value));
  const job = isLive
    ? { title: v.title, about: v.about, responsibilities: v.responsibilities, skills: v.skills }
    : SENIOR_UX;
  const company = isLive ? v.company : 'Silver Rock Technology';

  return (
    <PageFrame>
      <BackCrumb to="/recruiter/job-postings" label={D.back} crumb={D.crumb} />
      <div className="grid items-start gap-[24px] lg:grid-cols-[minmax(0,925px)_minmax(300px,380px)]">
        <div className="flex min-w-0 flex-col gap-[20px]">
          <Card className="flex flex-col gap-[24px]">
            <div className="flex flex-wrap items-start justify-between gap-[12px]">
              <div className="flex items-center gap-[12px]">
                <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#2a5730]">
                  <BuildingGlyph size={20} />
                </span>
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-[8px]">
                    <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
                      {company}
                    </span>
                    {isLive ? null : (
                      <span className="inline-flex items-center gap-[4px] rounded-full bg-[#ebf1ec] px-[8px] py-[2px] font-sans text-[12px] leading-[16px] font-medium text-[#2a5730]">
                        <BadgeCheck size={12} />
                        Verified employer
                      </span>
                    )}
                  </div>
                  <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                    {saved ? EDIT_POSTING.saved.meta : D.posted}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <span
                  className={classNames(
                    'inline-flex h-[24px] items-center gap-[4px] rounded-full px-[10px] font-sans text-[12px] leading-[16px] font-medium',
                    STATUS_PILL[D.status] || STATUS_PILL.Active
                  )}
                >
                  {D.status === 'Active' ? <CheckGlyph size={12} /> : null}
                  {D.status}
                </span>
                {saved ? (
                  <span className="inline-flex h-[24px] items-center rounded-full bg-[#eaeffb] px-[10px] font-sans text-[12px] leading-[16px] font-medium text-[#244a9f]">
                    {EDIT_POSTING.saved.updated}
                  </span>
                ) : null}
                <JobButton
                  tone="ghost"
                  className="!h-[36px] !px-[14px] !text-[14px]"
                  onClick={() => navigate(`/recruiter/job-postings/${postingId}/edit`)}
                >
                  {D.edit}
                </JobButton>
                <button
                  type="button"
                  aria-label="Copy the job link"
                  onClick={() => {
                    navigator.clipboard?.writeText?.(D.share.url);
                    setCopied(true);
                  }}
                  className="flex size-[32px] cursor-pointer items-center justify-center rounded-[8px] border border-solid border-[#e1eae2] bg-white text-[#1c2a21]"
                >
                  <LinkGlyph size={16} />
                </button>
                <button
                  type="button"
                  aria-label="More actions"
                  onClick={() =>
                    navigate(`/recruiter/job-postings?menu=${postingId}&menuKind=manage`)
                  }
                  className="flex size-[32px] cursor-pointer items-center justify-center rounded-[8px] border border-solid border-[#e1eae2] bg-white text-[#1c2a21]"
                >
                  <DotsGlyph size={16} />
                </button>
              </div>
            </div>
            <h1 className="m-0 font-heading text-[36px] leading-[44px] font-semibold tracking-[-0.72px] text-[#111] max-sm:text-[28px] max-sm:leading-[34px]">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-[8px]">
              {D.chips.map((chip, index) => (
                <span
                  key={chip}
                  className="inline-flex h-[28px] items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white px-[12px] font-sans text-[12px] leading-[16px] font-medium text-[#111]"
                >
                  {
                    [
                      <MapPin key="m" />,
                      <BriefcaseGlyph key="b" />,
                      null,
                      <CalendarGlyph key="c" />,
                    ][index]
                  }
                  {chip}
                </span>
              ))}
            </div>
            <dl className="m-0 grid grid-cols-2 gap-[16px] sm:grid-cols-4">
              {D.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-[4px]">
                  <dt className="font-sans text-[12px] leading-[16px] text-[#575755]">
                    {stat.label}
                  </dt>
                  <dd className="m-0 font-heading text-[28px] leading-[34px] font-semibold text-[#111]">
                    {stat.value}
                  </dd>
                  <span
                    className={classNames(
                      'font-sans text-[12px] leading-[16px]',
                      NOTE_TONE[stat.tone]
                    )}
                  >
                    {stat.note}
                  </span>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="flex flex-col gap-[16px]">
            <h2 className="m-0 font-heading text-[22px] leading-[26px] font-semibold tracking-[-0.44px] text-[#111]">
              {D.aboutTitle}
            </h2>
            <p className="m-0 font-sans text-[14px] leading-[24px] text-[#111]">{job.about}</p>
            {isLive && !job.about && !job.responsibilities.length ? (
              <p className="m-0 font-sans text-[14px] leading-[24px] text-[#575755]">
                No description yet. Use Edit posting to add one.
              </p>
            ) : null}
            <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
              {job.responsibilities.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-[12px] font-sans text-[14px] leading-[24px] text-[#111]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[10px] size-[5px] shrink-0 rounded-full bg-[#111]"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="flex flex-col gap-[16px]">
            <div className="flex items-center justify-between gap-[12px]">
              <h2 className="m-0 font-heading text-[22px] leading-[26px] font-semibold tracking-[-0.44px] text-[#111]">
                {D.skillsTitle}
              </h2>
              <button
                type="button"
                onClick={() => navigate('/recruiter/job-screening')}
                className="inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[12px] leading-[16px] font-medium text-[#2a5730]"
              >
                <FilterGlyph size={14} />
                {D.editScreening}
              </button>
            </div>
            {isLive && !job.skills.length ? (
              <p className="m-0 font-sans text-[14px] leading-[20px] text-[#575755]">
                No skills listed. Talent Search ranks people by the skills you add here.
              </p>
            ) : null}
            <div className="flex flex-wrap gap-[8px]">
              {job.skills.map((skill) => (
                <span
                  key={skill.name}
                  className={classNames(
                    'inline-flex h-[28px] items-center rounded-full border border-solid px-[12px] font-sans text-[12px] leading-[16px] font-medium',
                    skill.required
                      ? 'border-[#bcd6c1] bg-[#ebf1ec] text-[#2a5730]'
                      : 'border-[#dbded9] bg-white text-[#575755]'
                  )}
                >
                  {skill.name}
                  {skill.required ? ' · required' : ''}
                </span>
              ))}
            </div>
          </Card>
        </div>

        <aside className="flex min-w-0 flex-col gap-[16px]">
          <Card className="flex flex-col gap-[16px] !p-[20px]">
            <div className="flex items-center justify-between">
              <h2 className="m-0 font-heading text-[18px] leading-[24px] font-semibold text-[#111]">
                {D.pipeline.title}
              </h2>
              <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                {D.pipeline.total}
              </span>
            </div>
            <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
              {D.pipeline.rows.map((row) => (
                <li key={row.label} className="flex flex-col gap-[6px]">
                  <div className="flex items-center justify-between font-sans text-[14px] leading-[20px] text-[#111]">
                    <span>{row.label}</span>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                  <span
                    className="block h-[5px] rounded-full"
                    style={{ width: `${(row.value / max) * 100}%`, background: row.color }}
                  />
                </li>
              ))}
            </ul>
            <JobButton
              className="w-full"
              onClick={() =>
                navigate(
                  isLive
                    ? `/recruiter/application-pipeline?posting=${postingId}`
                    : '/recruiter/application-pipeline'
                )
              }
            >
              {D.pipeline.open}
            </JobButton>
          </Card>

          {isLive ? (
            <Card className="flex flex-col gap-[12px] !p-[20px]">
              <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
                Find people for this role
              </span>
              <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                Talent Search ranks matching talent by fit for this posting.
              </span>
              <button
                type="button"
                onClick={() =>
                  navigate(`/recruiter/talent-search?job=${postingId}&tab=top-matches`)
                }
                className="inline-flex w-fit cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[20px] font-medium text-[#387440]"
              >
                Search talent
                <ArrowRight size={14} />
              </button>
            </Card>
          ) : (
            <Card className="flex flex-col gap-[12px] !p-[20px]">
              <div className="flex items-center gap-[12px]">
                <span className="flex size-[36px] items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#2a5730]">
                  <FilterGlyph size={18} />
                </span>
                <div className="flex flex-col">
                  <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
                    {D.screening.title}
                  </span>
                  <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                    {D.screening.body}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/recruiter/job-screening')}
                className="inline-flex w-fit cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[20px] font-medium text-[#387440]"
              >
                {D.screening.link}
                <ArrowRight size={14} />
              </button>
            </Card>
          )}

          <Card className="flex flex-col gap-[8px] !p-[20px]">
            <span className="font-sans text-[12px] leading-[16px] font-semibold tracking-[0.4px] text-[#575755]">
              {D.share.title}
            </span>
            <div className="flex items-center justify-between gap-[12px]">
              <span className="min-w-0 truncate font-sans text-[12px] leading-[16px] text-[#111]">
                {D.share.url}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText?.(D.share.url);
                  setCopied(true);
                }}
                className="inline-flex shrink-0 cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[12px] leading-[16px] font-medium text-[#2a5730]"
              >
                <CopyGlyph size={14} />
                {copied ? 'Copied' : D.share.copy}
              </button>
            </div>
          </Card>
        </aside>
      </div>
    </PageFrame>
  );
};

export default PostingDetailPage;
