import { useNavigate, useSearchParams } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { JobButton } from './jobButtons.jsx';
import { BackCrumb, FlowBanner, PageFrame } from './jobFlowParts.jsx';
import {
  BadgeCheck,
  BookmarkGlyph,
  CheckGlyph,
  BriefcaseGlyph,
  BuildingGlyph,
  CalendarGlyph,
  CheckCircle,
  ClockGlyph,
  EyeGlyph,
  LinkGlyph,
  MapPin,
  PlusGlyph,
} from './jobIcons.jsx';
import { PRODUCT_DESIGNER, PREVIEW } from './jobFormData.js';

/*
 * JobPreviewPage — what talent will see, drawn from the recruiter side (Figma JT-02 "Template preview" 10117:51016 and JT-08 "Preview before publishing" 10117:53347).
 * Routes: /recruiter/job-templates/product-designer/preview (variant 'template': "Use template" bar) and /recruiter/job-postings/new/preview (variant 'publish': "Back to edit" + "Publish job").
 * The match panel is a sample talent; every talent-side button is disabled (as the banner says). Composed here instead of reusing the talent job screen because the screen is bound to the talent shell and live data.
 * ⚠️ ASSUMPTION: composed from the talent job-detail visuals (talentJobs/), values from the frames.
 */
const Chip = ({ icon, children }) => (
  <span className="inline-flex h-[28px] items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white px-[12px] font-sans text-[12px] leading-[16px] font-medium text-[#111]">
    {icon}
    {children}
  </span>
);

const SKILL_TONE = {
  have: 'border-[#bcd6c1] bg-[#ebf1ec] text-[#165d3a]',
  missing: 'border-[#f0e3c7] bg-[#faf4e8] text-[#463409]',
};

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

const JobPreviewPage = ({ variant = 'template' }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isTemplate = variant === 'template';
  const copy = isTemplate ? PREVIEW.template : PREVIEW.publish;
  const job = PRODUCT_DESIGNER;
  const back = isTemplate
    ? '/recruiter/job-templates'
    : '/recruiter/job-postings/new?template=product-designer';
  const skills = copy.skills;
  void params;

  return (
    <PageFrame className="pb-[110px]">
      <BackCrumb to={back} label={copy.crumbBack} crumb={copy.crumb} />
      <FlowBanner
        tone="info"
        icon={<EyeGlyph size={18} />}
        title={copy.bannerTitle}
        body={copy.bannerBody}
      />

      <div className="grid items-start gap-[24px] lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="flex min-w-0 flex-col gap-[20px]">
          <Card className="flex flex-col gap-[20px]">
            <div className="flex flex-wrap items-start justify-between gap-[12px]">
              <div className="flex items-center gap-[12px]">
                <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#2a5730]">
                  <BuildingGlyph size={20} />
                </span>
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-[8px]">
                    <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
                      {PREVIEW.employer}
                    </span>
                    <span className="inline-flex items-center gap-[4px] rounded-full bg-[#ebf1ec] px-[8px] py-[2px] font-sans text-[12px] leading-[16px] font-medium text-[#2a5730]">
                      <BadgeCheck size={12} />
                      {PREVIEW.verified}
                    </span>
                  </div>
                  <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                    {PREVIEW.employerMeta}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <span
                  className={classNames(
                    'inline-flex h-[24px] items-center rounded-full px-[10px] font-sans text-[12px] leading-[16px] font-medium',
                    isTemplate ? 'bg-[#ebf1ec] text-[#165d3a]' : 'bg-[#ebf1ec] text-[#165d3a]'
                  )}
                >
                  {copy.badge}
                </span>
                <span className="flex size-[32px] items-center justify-center rounded-[8px] border border-solid border-[#e1eae2] text-[#1c2a21]">
                  <BookmarkGlyph size={16} />
                </span>
                <span className="flex size-[32px] items-center justify-center rounded-[8px] border border-solid border-[#e1eae2] text-[#1c2a21]">
                  <LinkGlyph size={16} />
                </span>
              </div>
            </div>
            <h1 className="m-0 font-heading text-[36px] leading-[44px] font-semibold tracking-[-0.72px] text-[#111] max-sm:text-[28px] max-sm:leading-[34px]">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-[8px]">
              {PREVIEW.chips.map((chip, index) => (
                <Chip
                  key={chip}
                  icon={
                    [
                      <MapPin key="m" />,
                      <BriefcaseGlyph key="b" />,
                      null,
                      <CalendarGlyph key="c" />,
                    ][index]
                  }
                >
                  {chip}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-[12px]">
              <JobButton disabled className="!cursor-not-allowed opacity-60">
                {PREVIEW.apply}
              </JobButton>
              <JobButton tone="ghost" disabled className="!cursor-not-allowed opacity-60">
                {PREVIEW.save}
              </JobButton>
              <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                {PREVIEW.applyHint}
              </span>
            </div>
          </Card>

          <Card className="flex flex-col gap-[16px]">
            <h2 className="m-0 font-heading text-[22px] leading-[26px] font-semibold tracking-[-0.44px] text-[#111]">
              {PREVIEW.aboutTitle}
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
                {PREVIEW.skillsTitle}
              </h2>
              <span className="font-sans text-[12px] leading-[16px] font-medium text-[#387440]">
                {PREVIEW.skillsCount}
              </span>
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {skills.map((skill) => (
                <span
                  key={skill.name}
                  className={classNames(
                    'inline-flex h-[28px] items-center gap-[6px] rounded-full border border-solid px-[12px] font-sans text-[12px] leading-[16px] font-medium',
                    SKILL_TONE[skill.state]
                  )}
                >
                  {skill.state === 'have' ? <CheckGlyph size={12} /> : <PlusGlyph size={12} />}
                  {skill.name}
                </span>
              ))}
            </div>
          </Card>
        </div>

        <aside className="flex min-w-0 flex-col gap-[16px]">
          <section className="flex flex-col gap-[14px] rounded-[16px] bg-[#2a5730] p-[24px] text-white">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[12px] leading-[16px] font-semibold tracking-[0.4px]">
                {PREVIEW.match.eyebrow}
              </span>
              <span className="rounded-full bg-white px-[10px] py-[3px] font-sans text-[12px] leading-[16px] font-medium text-[#111]">
                {PREVIEW.match.badge}
              </span>
            </div>
            <span className="font-heading text-[56px] leading-[60px] font-semibold tracking-[-1.1px]">
              {PREVIEW.match.percent}
            </span>
            <p className="m-0 font-sans text-[12px] leading-[18px]">{PREVIEW.match.copy}</p>
            <ul className="m-0 flex list-none flex-col gap-[16px] rounded-[10px] bg-[#1f4a2b] p-[16px]">
              {PREVIEW.match.rows.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between font-sans text-[14px] leading-[20px]"
                >
                  <span>{row.label}</span>
                  <span className="font-semibold text-[#c8951a]">{row.value}</span>
                </li>
              ))}
            </ul>
            <span className="font-sans text-[14px] leading-[20px] font-medium">
              {PREVIEW.match.how}
            </span>
          </section>

          <Card className="flex flex-col gap-[14px] !p-[20px]">
            <span className="font-sans text-[12px] leading-[16px] font-semibold tracking-[0.4px] text-[#575755]">
              {PREVIEW.hiring.eyebrow}
            </span>
            <div className="flex items-center gap-[12px]">
              <span className="flex size-[40px] items-center justify-center rounded-full bg-[#ebf1ec] font-sans text-[12px] leading-[16px] font-semibold text-[#2a5730]">
                {PREVIEW.hiring.initials}
              </span>
              <div className="flex flex-col">
                <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
                  {PREVIEW.hiring.name}
                </span>
                <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                  {PREVIEW.hiring.role}
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-[6px] font-sans text-[12px] leading-[16px] font-medium text-[#575755]">
              <ClockGlyph size={12} />
              {PREVIEW.hiring.reply}
            </span>
          </Card>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 lg:left-[clamp(280px,17.5vw,303px)]">
        <div className="mx-[clamp(16px,2.3vw,40px)] mb-[16px] flex flex-wrap items-center justify-between gap-[12px] rounded-[16px] border border-solid border-[#e1eae2] bg-white px-[20px] py-[14px] shadow-[0_8px_24px_rgba(15,15,10,0.08)]">
          <span className="font-sans text-[14px] leading-[20px] text-[#575755]">
            {copy.barCopy}
          </span>
          <div className="flex items-center gap-[12px]">
            <JobButton tone="ghost" onClick={() => navigate(back)}>
              {isTemplate ? copy.close : copy.back}
            </JobButton>
            <JobButton
              onClick={() =>
                navigate(
                  isTemplate
                    ? '/recruiter/job-postings/new?template=product-designer'
                    : '/recruiter/job-postings/new?template=product-designer&state=publishing'
                )
              }
            >
              {isTemplate ? copy.use : copy.publish}
            </JobButton>
          </div>
        </div>
      </div>
    </PageFrame>
  );
};

export default JobPreviewPage;
