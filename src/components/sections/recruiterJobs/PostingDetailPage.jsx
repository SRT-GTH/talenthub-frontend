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
import { EDIT_POSTING, POSTING_DETAIL as D, SENIOR_UX } from './jobFormData.js';

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

const PostingDetailPage = () => {
  const { postingId = 'senior-ux-designer' } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const saved = params.get('saved') === '1';
  const [copied, setCopied] = useState(false);
  const max = Math.max(...D.pipeline.rows.map((row) => row.value));
  const job = SENIOR_UX;

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
                      Silver Rock Technology
                    </span>
                    <span className="inline-flex items-center gap-[4px] rounded-full bg-[#ebf1ec] px-[8px] py-[2px] font-sans text-[12px] leading-[16px] font-medium text-[#2a5730]">
                      <BadgeCheck size={12} />
                      Verified employer
                    </span>
                  </div>
                  <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                    {saved ? EDIT_POSTING.saved.meta : D.posted}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="inline-flex h-[24px] items-center gap-[4px] rounded-full bg-[#ebf1ec] px-[10px] font-sans text-[12px] leading-[16px] font-medium text-[#165d3a]">
                  <CheckGlyph size={12} />
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
                <span className="flex size-[32px] items-center justify-center rounded-[8px] border border-solid border-[#e1eae2] text-[#1c2a21]">
                  <LinkGlyph size={16} />
                </span>
                <span className="flex size-[32px] items-center justify-center rounded-[8px] border border-solid border-[#e1eae2] text-[#1c2a21]">
                  <DotsGlyph size={16} />
                </span>
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
              onClick={() => navigate('/recruiter/application-pipeline')}
            >
              {D.pipeline.open}
            </JobButton>
          </Card>

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
