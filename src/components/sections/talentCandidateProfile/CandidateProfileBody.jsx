import ProfileCard from './ProfileCard.jsx';
import {
  BriefcaseIcon,
  ExternalLinkIcon,
  FilePlaceholderIcon,
  GraduationCapIcon,
  VerifiedBadgeIcon,
} from './talentCandidateProfileIcons.jsx';
import { PROFILE_COPY } from './talentCandidateProfileData.js';
import { debug } from '../../../utils/debug.js';

const log = debug('CandidateProfileBody');

/*
 * CandidateProfileBody — the left-column cards under the header: About, Skills, Experience, Portfolio, Education and certificates (Figma TS-11 10102:41591 … 10102:41690, TS-19 10102:45179 …).
 * Props: candidate (see talentCandidateProfileData.js).
 */
const TEXT = 'font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#111]';
const META = 'font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]';
const ROW_TITLE = 'font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]';

const THUMB_TINTS = { mint: 'bg-[#ebf1ec]', cream: 'bg-[#faf4e8]', blue: 'bg-[#eaeffb]' };

const IconTile = ({ children }) => (
  <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] bg-[#fefefe] text-[#575755]">
    {children}
  </span>
);

const SkillRow = ({ skill }) => (
  <li className="grid grid-cols-[minmax(110px,180px)_minmax(0,360px)_auto] items-center gap-[12px] max-sm:grid-cols-[minmax(96px,1fr)_minmax(0,1fr)_auto]">
    <span className="flex min-w-0 items-center gap-[6px]">
      <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
        {skill.name}
      </span>
      {skill.verified ? (
        <>
          <VerifiedBadgeIcon className="size-[14px] shrink-0 text-[#387440]" />
          <span className="sr-only">verified by a GTH assessment</span>
        </>
      ) : null}
    </span>
    <span aria-hidden="true" className="block h-[8px] rounded-[8px] bg-[#fefefe]">
      <span
        className="block h-full rounded-[8px] bg-[#387440]"
        style={{ width: `${skill.percent}%` }}
      />
    </span>
    <span className={`${META} min-w-[66px]`}>{skill.level}</span>
  </li>
);

const CandidateProfileBody = ({ candidate }) => {
  const { portfolio } = candidate;
  log('render', {
    candidate: candidate.id,
    skills: candidate.skills.length,
    experience: candidate.experience.length,
    projects: portfolio.projects.length,
  });

  return (
    <>
      <ProfileCard title={PROFILE_COPY.about} gapClassName="gap-[10px]">
        <p className={`m-0 ${TEXT}`}>{candidate.about}</p>
      </ProfileCard>

      <ProfileCard
        title={PROFILE_COPY.skills}
        aside={
          <span className="font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#387440]">
            {candidate.skillsNote}
          </span>
        }
      >
        <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
          {candidate.skills.map((skill) => (
            <SkillRow key={skill.id} skill={skill} />
          ))}
        </ul>
      </ProfileCard>

      <ProfileCard title={PROFILE_COPY.experience} gapClassName="gap-[14px]">
        {candidate.experience.map((job) => (
          <div key={job.id} className="flex items-start gap-[12px]">
            <IconTile>
              <BriefcaseIcon className="size-[20px]" />
            </IconTile>
            <div className="flex min-w-0 flex-col gap-[2px]">
              <h3 className={`m-0 ${ROW_TITLE}`}>{job.title}</h3>
              <p className={`m-0 ${META}`}>{job.meta}</p>
              <p className={`m-0 ${TEXT}`}>{job.summary}</p>
            </div>
          </div>
        ))}
      </ProfileCard>

      <ProfileCard
        title={PROFILE_COPY.portfolio}
        aside={
          <a
            href={portfolio.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-[6px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <ExternalLinkIcon className="size-[16px]" />
            {portfolio.linkLabel}
          </a>
        }
      >
        <ul className="m-0 grid list-none grid-cols-3 gap-[12px] p-0 max-md:grid-cols-1 md:max-xl:grid-cols-2">
          {portfolio.projects.map((project) => (
            <li
              key={project.id}
              className="flex min-w-0 flex-col gap-[8px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[12px]"
            >
              <span
                className={`flex h-[110px] w-[min(200px,100%)] items-center justify-center rounded-[10px] text-[#575755] ${THUMB_TINTS[project.tint]}`}
              >
                <FilePlaceholderIcon className="size-[28px]" />
              </span>
              <h3 className={`m-0 ${ROW_TITLE}`}>{project.title}</h3>
              <p className={`m-0 ${META}`}>{project.caption}</p>
            </li>
          ))}
        </ul>
      </ProfileCard>

      <ProfileCard title={PROFILE_COPY.education}>
        {candidate.education.map((item) => (
          <div key={item.id} className="flex items-center gap-[12px]">
            <IconTile>
              <GraduationCapIcon className="size-[20px]" />
            </IconTile>
            <div className="flex min-w-0 flex-col gap-[2px]">
              <h3 className={`m-0 ${ROW_TITLE}`}>{item.title}</h3>
              <p className={`m-0 ${META}`}>{item.meta}</p>
            </div>
          </div>
        ))}
      </ProfileCard>
    </>
  );
};

export default CandidateProfileBody;
