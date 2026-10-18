import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { JobBriefIcon, JobCashIcon, JobPinIcon } from '../../shared/assets.jsx';
import Button from '../../ui/Button.jsx';
import recruiterPhoto from '../../../assets/talent-jobs/detail/recruiter-ama-darko.png';
import ApplyDialog from './JobApplyDialogs.jsx';
import { CompanyLogo, Sticker } from './JobDetailParts.jsx';
import {
  JobDetailArrowIcon,
  JobDetailBackIcon,
  JobDetailBanIcon,
  JobDetailCalIcon,
  JobDetailCheckIcon,
  JobDetailEyeIcon,
  JobDetailFlagIcon,
  JobDetailGradIcon,
  JobDetailInfoIcon,
  JobDetailLockCardIcon,
  JobDetailLockChipIcon,
  JobDetailPinIcon,
  JobDetailPlusIcon,
  JobDetailSaveIcon,
  JobDetailShareIcon,
  JobDetailSparkIcon,
  JobDetailClockIcon,
  JobDetailVerifiedIcon,
} from './JobDetailIcons.jsx';
import {
  FOCUS_RING,
  INK_CARD,
  INK_PILL,
  PILL_OUTLINE,
  SECTION_CARD,
  SECTION_TITLE,
} from './jobDetailStyles.js';
import {
  APPLIED_COPY,
  APPLIED_ROWS,
  JOB_DETAILS,
  JOB_DETAIL_COPY as COPY,
  JOB_LIST,
  JOB_TAB_LIST,
} from './talentJobsData.js';

const log = debug('JobDetailScreen');

/*
 * JobDetailScreen — the posting detail column + apply flow of Job Postings (Figma "Talent Job Postings":
 * J-02 7504:200 / 8110:409897, J-03 7504:135927 / 8110:410297, J-04 7505:346 / 8110:410690, J-05 7506:419 /
 * 8110:411209, J-09 7508:1489 / 8110:413270, J-11 7508:1964 / 8110:413719, J-12 7510:1087 / 8110:414623,
 * J-14 7510:1721 / 8110:415147). Replaces the list area of /job-postings.
 *
 * Props: `jobs` — the object from useTalentJobsState().  URL contract (every Figma frame is a URL):
 *   ?job=<id>                                J-02 detail (public company); junior-product-analyst = J-03 confidential
 *   ?job=<id>&apply=preview                  J-04 profile preview (Projects hidden)
 *   ?job=<id>&apply=projects                 J-12 preview after "Show Projects for this role" (match 82% -> 88%)
 *   ?job=<id>&apply=sent                     J-05 application sent
 *   ?job=<id>&state=applied                  J-09 already applied (application tracker)
 *   ?job=<id>&state=closed                   J-11 role closed
 *   ?job=<id>&apply=preview&state=offline    J-14 apply failed, offline (state=offline alone with a job = same)
 * Pass-c hooks: "How is this worked out?" -> modal=how-match, "Report posting" -> modal=report,
 * "Withdraw application" -> modal=withdraw.
 *
 * Layout (1728 frame): main column 1329 = left 925 (hero / about / skills) + 24 gap + right 380 (match, boost,
 * recruiter). Below xl the two columns collapse into one stack ordered hero, match, boost/similar, about,
 * skills, recruiter. Focused is the default look; Playful only through `playful:` variants.
 */
const byId = (id) => JOB_LIST.find((j) => j.id === id);

const parseWhy = (why) => {
  const verified = /\(verified\)/i.test(why);
  return { name: why.replace(/\s*\(verified\)/i, ''), verified };
};

/* One normalised view of a job for the screen: JOB_LIST row + (optional) JOB_DETAILS payload. */
const buildView = (job) => {
  const d = JOB_DETAILS[job.id] ?? {};
  const have = d.skills?.have ?? job.why.map(parseWhy);
  const missing = d.skills?.missing ?? [];
  const total = have.length + missing.length;
  const label =
    d.matchLabel ?? (job.match >= 80 ? 'Strong match' : job.match >= 70 ? 'Good match' : null);
  const row = APPLIED_ROWS.find((r) => r.id === job.id);
  const breakdown = d.breakdown
    ? [
        {
          id: 'skills',
          label: 'Skills',
          value: `${have.length} of ${total}`,
          icon: JobDetailSparkIcon,
        },
        {
          id: 'education',
          label: 'Education',
          value: d.breakdown.education,
          icon: JobDetailGradIcon,
        },
        { id: 'location', label: 'Location', value: d.breakdown.location, icon: JobDetailPinIcon },
      ]
    : [];
  return {
    job,
    d,
    confidential: Boolean(job.company.confidential),
    short: d.company?.short ?? job.company.name,
    line: d.company?.line ?? job.company.sector ?? null,
    sticker: d.sticker ?? (job.isNew ? 'New' : null),
    label,
    have,
    missing,
    total,
    breakdown,
    application: {
      applied: d.application?.applied ?? COPY.applied,
      note: d.application?.note ?? null,
      status: d.application?.status ?? row?.status ?? null,
      step: d.application?.step ?? row?.step ?? 0,
      when: d.application?.when ?? {},
    },
  };
};

/* Small bits ------------------------------------------------------------------------------------- */
const MetaChip = ({ icon, children }) => {
  const Icon = icon;
  return (
    <span className="inline-flex h-[30px] items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-[#f8f8f4] py-[6px] pr-[12px] pl-[10px] font-sans text-[13.5px] leading-[16px] font-medium text-[#1c2a21] max-lg:text-[14px]">
      <Icon className="size-[15px] shrink-0 text-[#595959]" />
      {children}
    </span>
  );
};

const IconButton = ({ label, onClick, pressed, children }) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={pressed}
    onClick={onClick}
    className={classNames(
      'flex size-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.2)] bg-white p-0 text-[#387440]',
      FOCUS_RING
    )}
  >
    {children}
  </button>
);

const CompanyPill = ({ confidential }) => (
  <span
    className={classNames(
      'inline-flex items-center gap-[4px] rounded-full py-[2px] pr-[8px] pl-[6px] font-sans text-[11.5px] leading-[14px] font-semibold max-lg:text-[12px]',
      PILL_OUTLINE,
      confidential
        ? 'bg-[#f8f8f4] text-[#595959] playful:border-[rgba(28,42,33,0.35)]'
        : 'bg-[#ebf1ec] text-[#224626]'
    )}
  >
    {confidential ? (
      <JobDetailLockChipIcon className="size-[11px]" />
    ) : (
      <JobDetailVerifiedIcon className="size-[11px]" />
    )}
    {confidential ? COPY.hidden : COPY.verified}
  </span>
);

const SkillChip = ({ name, verified, missing }) =>
  missing ? (
    <span className="inline-flex h-[32px] items-center gap-[6px] rounded-full border-[1.2px] border-dashed border-[#c8951a] bg-white py-[7px] pr-[12px] pl-[10px] font-sans text-[13px] leading-[16px] font-semibold text-[#967014] max-lg:text-[13px]">
      <JobDetailPlusIcon className="size-[13px]" />
      {name} · missing
    </span>
  ) : (
    <span
      className={classNames(
        'inline-flex h-[32px] items-center gap-[6px] rounded-full border border-solid bg-[#ebf1ec] py-[7px] pr-[12px] pl-[10px] font-sans text-[13px] leading-[16px] font-semibold text-[#2d5d33] max-lg:text-[13px]',
        verified
          ? 'border-[rgba(28,42,33,0.12)] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[1.5px_1.5px_0_#1c2a21]'
          : 'border-[#c1d4c4]'
      )}
    >
      <JobDetailCheckIcon className="size-[13px] text-[#387440]" />
      {verified ? `${name} · verified` : name}
    </span>
  );

/* Hero ------------------------------------------------------------------------------------------- */
const Hero = ({ view, mode, saved, onSave, onApply, jobs }) => {
  const { job, d, confidential, line, sticker } = view;
  const { closed, applied, sent } = mode;
  const title = job.title;
  const chips = [
    { icon: JobPinIcon, text: job.location },
    { icon: JobBriefIcon, text: job.type },
    { icon: JobCashIcon, text: job.pay },
    d.closes
      ? { icon: JobDetailCalIcon, text: closed ? (d.closedOn ?? d.closes) : d.closes }
      : null,
  ].filter(Boolean);

  let primary;
  if (closed) {
    primary = (
      <Button variant="primary" size="lg" disabled>
        {COPY.closedButton}
      </Button>
    );
  } else if (applied || sent) {
    primary = (
      <span
        aria-live="polite"
        className="inline-flex items-center justify-center rounded-[14px] border-b-2 border-l-2 border-r-2 border-t border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#165d3a] shadow-[0_1px_2px_rgba(27,36,44,0.12)] max-lg:px-4 max-lg:py-2.5 max-lg:text-[14px]"
      >
        {applied && !sent ? view.application.applied : COPY.applied}
      </span>
    );
  } else {
    primary = (
      <Button variant="primary" size="lg" onClick={onApply}>
        {COPY.apply}
      </Button>
    );
  }
  const hint = closed
    ? (d.closedNote ?? null)
    : applied && !sent
      ? view.application.note
      : COPY.hint;

  return (
    <article
      className={classNames(
        'flex min-w-0 flex-col gap-[16px] rounded-[26px] bg-white px-[clamp(16px,1.5vw,26px)] py-[clamp(16px,1.39vw,24px)] max-xl:order-1',
        closed ? 'border-[1.5px] border-solid border-[#bfbfbf]' : INK_CARD
      )}
    >
      <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[10px]">
        <CompanyLogo company={job.company} />
        <div className="flex min-w-0 flex-[1_1_200px] flex-col gap-[2px]">
          <div className="flex flex-wrap items-center gap-x-[6px] gap-y-[4px]">
            <span className="font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
              {job.company.name}
            </span>
            {confidential || d.company?.verified ? (
              <CompanyPill confidential={confidential} />
            ) : null}
          </div>
          {line ? (
            <span className="font-sans text-[13px] leading-[16px] text-[#737373] max-lg:text-[13px]">
              {line}
            </span>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-[12px]">
          {closed ? (
            <Sticker tone="grey" className="playful:rotate-[5deg]">
              {COPY.closedBadge}
            </Sticker>
          ) : sticker ? (
            <Sticker tone={confidential ? 'white' : 'yellow'} className="playful:rotate-[5deg]">
              {sticker}
            </Sticker>
          ) : null}
          <IconButton
            label={saved ? `Unsave ${title}` : `Save ${title}`}
            pressed={saved}
            onClick={onSave}
          >
            <JobDetailSaveIcon className="size-[20px]" filled={saved} />
          </IconButton>
          <IconButton label={`Share ${title}`} onClick={() => log('share', job.id)}>
            <JobDetailShareIcon className="size-[20px]" />
          </IconButton>
        </div>
      </div>

      <h1 className="m-0 font-sans text-[clamp(28px,2.31vw,40px)] leading-[1.1] font-semibold text-[#1c2a21] playful:font-heading">
        {title}
      </h1>

      <div className="flex flex-wrap gap-[8px]">
        {chips.map((c) => (
          <MetaChip key={c.text} icon={c.icon}>
            {c.text}
          </MetaChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[10px] pt-[4px] min-[1500px]:flex-nowrap playful:pb-[12px]">
        {primary}
        <Button variant="tertiary" size="lg" onClick={onSave} aria-pressed={saved}>
          {COPY.save}
        </Button>
        {hint ? (
          <span className="min-w-0 flex-[0_1_auto] font-sans text-[13px] leading-[16px] text-[#737373] max-lg:text-[13px]">
            {hint}
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => jobs.update({ modal: 'report' })}
          className={classNames(
            'inline-flex cursor-pointer items-center gap-[5px] rounded-[8px] border-0 bg-transparent px-[10px] py-[6px] font-sans text-[12.5px] leading-[15px] font-semibold text-[#737373]',
            FOCUS_RING
          )}
        >
          <JobDetailFlagIcon className="size-[13px]" />
          {COPY.report}
        </button>
      </div>
    </article>
  );
};

/* Application tracker (J-09) -------------------------------------------------------------------- */
const ApplicationCard = ({ view, jobs }) => {
  const { application } = view;
  const steps = APPLIED_COPY.steps;
  return (
    <section
      aria-label={COPY.yourApplication}
      className="flex min-w-0 flex-col gap-[14px] rounded-[22px] border border-solid border-[#387440] bg-white px-[clamp(16px,1.27vw,22px)] py-[20px] playful:border-[1.2px] max-xl:order-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-[8px]">
        <h2 className={SECTION_TITLE}>{COPY.yourApplication}</h2>
        {application.status ? (
          <span
            className={classNames(
              'inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] py-[5px] pr-[12px] pl-[10px] font-sans text-[12.5px] leading-[15px] font-bold text-[#1c2a21]',
              INK_PILL
            )}
          >
            <JobDetailEyeIcon className="size-[14px]" />
            {application.status}
          </span>
        ) : null}
      </div>
      <div className="no-scrollbar overflow-x-auto">
        <ol className="m-0 flex min-w-[300px] list-none p-0">
          {steps.map((s, i) => {
            const done = i <= application.step;
            const leftOn = i > 0 && i <= application.step;
            const rightOn = i < application.step;
            return (
              <li key={s} className="flex min-w-0 flex-1 flex-col items-center gap-[6px]">
                <span className="flex h-[26px] w-full items-center" aria-hidden="true">
                  <span
                    className={classNames(
                      'h-[3px] flex-1',
                      i === 0 ? 'bg-transparent' : leftOn ? 'bg-[#387440]' : 'bg-[#e1eae2]'
                    )}
                  />
                  <span
                    className={classNames(
                      'flex size-[26px] shrink-0 items-center justify-center rounded-full border border-solid',
                      done
                        ? 'border-[rgba(28,42,33,0.12)] bg-[#387440] text-white playful:border-[1.2px] playful:border-[#1c2a21]'
                        : 'border-[#c1d4c4] bg-white playful:border-[1.2px]'
                    )}
                  >
                    {done ? <JobDetailCheckIcon className="size-[13px]" /> : null}
                  </span>
                  <span
                    className={classNames(
                      'h-[3px] flex-1',
                      i === steps.length - 1
                        ? 'bg-transparent'
                        : rightOn
                          ? 'bg-[#387440]'
                          : 'bg-[#e1eae2]'
                    )}
                  />
                </span>
                <span
                  className={classNames(
                    'font-sans text-[13px] leading-[16px] font-semibold',
                    done ? 'text-[#1c2a21]' : 'text-[#737373]'
                  )}
                >
                  {s}
                </span>
                <span className="min-h-[14px] font-sans text-[11.5px] leading-[14px] text-[#737373] max-lg:text-[12px]">
                  {application.when[s] ?? ''}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
        <Button variant="tertiary" size="sm" onClick={() => log('prep with buddy')}>
          {COPY.prep}
        </Button>
        <button
          type="button"
          onClick={() => jobs.update({ modal: 'withdraw' })}
          className={classNames(
            'cursor-pointer rounded-[6px] border-0 bg-transparent p-0 font-sans text-[13px] leading-[16px] font-semibold text-[#c0392b]',
            FOCUS_RING
          )}
        >
          {COPY.withdraw}
        </button>
      </div>
    </section>
  );
};

const AboutCard = ({ about }) => (
  <section aria-labelledby="jd-about" className={classNames(SECTION_CARD, 'max-xl:order-5')}>
    <h2 id="jd-about" className={SECTION_TITLE}>
      {COPY.aboutTitle}
    </h2>
    <p className="m-0 font-sans text-[15px] leading-[1.45] text-[#1c2a21]">{about.intro}</p>
    <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
      {about.bullets.map((b) => (
        <li
          key={b}
          className="flex items-start gap-[10px] font-sans text-[14.5px] leading-[17px] text-[#1c2a21]"
        >
          <span
            className="mt-[5px] size-[7px] shrink-0 rounded-full bg-[#387440]"
            aria-hidden="true"
          />
          {b}
        </li>
      ))}
    </ul>
  </section>
);

const SkillsCard = ({ view }) => {
  const { have, missing, total } = view;
  return (
    <section
      aria-labelledby="jd-skills"
      className={classNames(SECTION_CARD, '!gap-[12px] max-xl:order-6')}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-[8px] gap-y-[4px]">
        <h2 id="jd-skills" className={SECTION_TITLE}>
          {COPY.skillsTitle}
        </h2>
        {missing.length ? (
          <span className="font-sans text-[13.5px] leading-[16px] font-semibold text-[#2d5d33] max-lg:text-[14px]">
            You have {have.length} of {total}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-[8px]">
        {have.map((s) => (
          <SkillChip key={s.name} name={s.name} verified={s.verified} />
        ))}
        {missing.map((m) => (
          <SkillChip key={m} name={m} missing />
        ))}
      </div>
    </section>
  );
};

/* Right column ---------------------------------------------------------------------------------- */
const MatchCard = ({ view, mode, jobs }) => {
  const { job, d, label, breakdown } = view;
  return (
    <section
      aria-label={COPY.yourMatch}
      className={classNames(
        'flex min-w-0 flex-col gap-[12px] rounded-[26px] bg-[#387440] p-[clamp(16px,1.27vw,22px)] max-xl:order-2',
        INK_CARD,
        mode.closed ? 'opacity-[0.55]' : null
      )}
    >
      <div className="flex min-h-[22px] items-center justify-between gap-[8px] playful:min-h-[31px]">
        <span className="font-sans text-[12px] leading-[14px] font-bold text-[#c1d4c4]">
          {COPY.yourMatch}
        </span>
        {label ? <Sticker className="playful:rotate-[-4deg]">{label}</Sticker> : null}
      </div>
      <p className="m-0 font-sans text-[clamp(48px,3.7vw,64px)] leading-[1.09] font-semibold text-white playful:font-heading">
        {job.match}%
      </p>
      {d.matchNote ? (
        <p className="m-0 font-sans text-[14px] leading-[20px] text-[#e1eae2]">{d.matchNote}</p>
      ) : null}
      {breakdown.length ? (
        <ul className="m-0 flex list-none flex-col rounded-[16px] bg-[rgba(255,255,255,0.1)] px-[14px] py-[4px]">
          {breakdown.map((r) => {
            const Icon = r.icon;
            return (
              <li
                key={r.id}
                className="flex items-center gap-[10px] border-0 border-b border-solid border-[rgba(255,255,255,0.18)] py-[10px] last:border-b-0"
              >
                <Icon className="size-[16px] shrink-0 text-[#c1d4c4]" />
                <span className="min-w-0 flex-1 font-sans text-[14px] leading-[17px] font-medium text-white">
                  {r.label}
                </span>
                <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#ffd86b]">
                  {r.value}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
      <button
        type="button"
        onClick={() => jobs.update({ modal: 'how-match' })}
        className={classNames(
          'inline-flex w-fit cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white py-[6px] pr-[12px] pl-[10px] font-sans text-[12.5px] leading-[15px] font-bold text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[1.5px_1.5px_0_#1c2a21]',
          FOCUS_RING
        )}
      >
        <JobDetailInfoIcon className="size-[14px]" />
        {COPY.how}
      </button>
    </section>
  );
};

const BoostCard = ({ boost }) => (
  <section
    aria-label="Boost your match"
    className="flex min-w-0 flex-col gap-[10px] rounded-[22px] border-[1.2px] border-solid border-[#c8951a] bg-[#faf4e8] p-[clamp(16px,1.16vw,20px)] max-xl:order-4"
  >
    <div className="flex min-h-[24px] flex-wrap items-center gap-[8px] playful:min-h-[27px]">
      <h2 className="m-0 font-sans text-[19px] leading-[24px] font-semibold text-[#1c2a21] playful:font-heading">
        Boost to ~{boost.to}%
      </h2>
      <Sticker
        tone="white"
        className="playful:rotate-[4deg] !py-[3px] !text-[11px] !leading-[13px] max-lg:!text-[12px]"
      >
        {boost.delta}
      </Sticker>
    </div>
    <p className="m-0 font-sans text-[13.5px] leading-[1.4] text-[#595959] max-lg:text-[14px]">
      {boost.note}
    </p>
    <div className="flex flex-wrap gap-[8px] pt-[2px] pb-[10px] playful:pb-0">
      <Button variant="tertiary" size="sm" onClick={() => log('boost: have it')}>
        {boost.have}
      </Button>
      <Button variant="tertiary" size="sm" onClick={() => log('boost: learn it')}>
        {boost.learn}
      </Button>
    </div>
  </section>
);

const SimilarCard = ({ ids, jobs }) => (
  <section
    aria-labelledby="jd-similar"
    className={classNames(
      'flex min-w-0 flex-col gap-[10px] rounded-[22px] bg-white p-[clamp(16px,1.16vw,20px)] max-xl:order-4',
      INK_CARD
    )}
  >
    <h2
      id="jd-similar"
      className="m-0 font-sans text-[21px] leading-[26px] font-semibold text-[#1c2a21] playful:font-heading"
    >
      {COPY.similarTitle}
    </h2>
    <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
      {ids.map((id) => {
        const j = byId(id);
        if (!j) return null;
        return (
          <li key={id}>
            <button
              type="button"
              aria-label={`${j.title}, ${j.company.name}, ${j.match}% match`}
              onClick={() => jobs.update({ job: id, state: null, apply: null })}
              className={classNames(
                'flex w-full cursor-pointer items-center gap-[10px] rounded-[12px] border-0 bg-transparent py-[8px] text-left',
                FOCUS_RING
              )}
            >
              <CompanyLogo company={j.company} size={34} radius={10} />
              <span className="flex min-w-0 flex-1 flex-col gap-[1px]">
                <span className="truncate font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                  {j.title}
                </span>
                <span
                  aria-hidden="true"
                  data-count={j.company.name}
                  className="truncate font-sans text-[12px] leading-[14px] text-[#737373] after:content-[attr(data-count)]"
                />
              </span>
              <span
                aria-hidden="true"
                data-count={`${j.match}%`}
                className={classNames(
                  'inline-flex items-center rounded-full bg-[#ebf1ec] px-[9px] py-[3px] font-sans text-[12.5px] leading-[15px] font-bold text-[#2d5d33] after:content-[attr(data-count)]',
                  PILL_OUTLINE
                )}
              />
              <JobDetailArrowIcon className="size-[15px] shrink-0 text-[#2d5d33]" />
            </button>
          </li>
        );
      })}
    </ul>
  </section>
);

const RecruiterCard = ({ view }) => {
  const { d, confidential } = view;
  if (confidential) {
    return (
      <section
        aria-label={COPY.hiring}
        className="flex min-w-0 flex-col gap-[12px] rounded-[22px] border border-dashed border-[#c1d4c4] bg-[#f8f8f4] p-[clamp(16px,1.16vw,20px)] max-xl:order-7"
      >
        <span className="font-sans text-[12px] leading-[14px] font-bold text-[#737373]">
          {COPY.hiring}
        </span>
        <div className="flex items-center gap-[12px]">
          <span className="flex size-[44px] shrink-0 items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21]">
            <JobDetailLockCardIcon className="size-[18px]" />
          </span>
          <p className="m-0 font-sans text-[13.5px] leading-[1.4] text-[#595959] max-lg:text-[14px]">
            {COPY.confidentialNote}
          </p>
        </div>
      </section>
    );
  }
  const r = d.recruiter;
  if (!r) return null;
  return (
    <section
      aria-label={COPY.hiring}
      className="flex min-w-0 flex-col gap-[12px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[clamp(16px,1.16vw,20px)] max-xl:order-7"
    >
      <span className="font-sans text-[12px] leading-[14px] font-bold text-[#737373]">
        {COPY.hiring}
      </span>
      <div className="flex items-center gap-[12px]">
        <span className="relative block size-[48px] shrink-0">
          <img
            src={recruiterPhoto}
            alt=""
            aria-hidden="true"
            className="size-[48px] rounded-full object-cover"
          />
          <span className="absolute -right-[2px] -bottom-[2px] flex size-[18px] items-center justify-center rounded-full border-2 border-solid border-white bg-[#224626] text-white">
            <JobDetailCheckIcon className="size-[10px]" />
          </span>
        </span>
        <span className="flex min-w-0 flex-col gap-[2px]">
          <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            {r.name}
          </span>
          <span className="font-sans text-[12.5px] leading-[15px] text-[#737373] max-lg:text-[13px]">
            {r.role}
          </span>
        </span>
      </div>
      <span
        className={classNames(
          'inline-flex w-fit items-center gap-[6px] rounded-full bg-[#f8f8f4] px-[10px] py-[6px] font-sans text-[12.5px] leading-[15px] font-medium text-[#595959] max-lg:text-[13px]',
          PILL_OUTLINE
        )}
      >
        <JobDetailClockIcon className="size-[13px]" />
        {r.reply}
      </span>
    </section>
  );
};

const ClosedBanner = ({ text }) => (
  <div
    role="status"
    className="flex min-w-0 items-start gap-[12px] rounded-[18px] border border-dashed border-[#bfbfbf] bg-[#f8f8f4] py-[14px] pr-[16px] pl-[18px] max-xl:order-0"
  >
    <JobDetailBanIcon className="mt-[8px] size-[20px] shrink-0 text-[#595959]" />
    <div className="flex min-w-0 flex-col gap-[2px]">
      <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
        {COPY.closedTitle}
      </span>
      {text ? (
        <span className="font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[13px]">
          {text}
        </span>
      ) : null}
    </div>
  </div>
);

/* Screen ----------------------------------------------------------------------------------------- */
const JobDetailScreen = ({ jobs }) => {
  const [params] = useSearchParams();
  const job = useMemo(() => byId(jobs.job), [jobs.job]);
  const stateRaw = params.get('state');
  const offline = jobs.state === 'offline';
  const closed = stateRaw === 'closed';
  const applied = stateRaw === 'applied';
  const apply = ['preview', 'projects', 'sent'].includes(jobs.apply)
    ? jobs.apply
    : offline
      ? 'preview'
      : null;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    log('mount', { job: jobs.job, apply, closed, applied, offline });
  }, [jobs.job, apply, closed, applied, offline]);

  // Unknown id -> back to the list rather than an empty screen.
  useEffect(() => {
    if (!job) {
      log('unknown job, leaving detail', jobs.job);
      jobs.update({ job: null, apply: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  if (!job) return null;
  const view = buildView(job);
  const tab = JOB_TAB_LIST.find((t) => t.id === jobs.tab) ?? JOB_TAB_LIST[0];
  const mode = { closed, applied, sent: apply === 'sent' };
  const leave = () => {
    log('back to list');
    jobs.update({ job: null, apply: null, state: null, modal: null });
  };
  const toggleSave = () => {
    log('toggle save', job.id, !saved);
    setSaved((s) => !s);
  };
  const startApply = () => {
    log('apply -> preview', job.id);
    jobs.update({ apply: 'preview' });
  };

  return (
    <div className="mx-auto flex w-full max-w-[1433px] flex-col gap-[24px] px-[clamp(12px,3vw,52px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(24px,3vw,56px)]">
      <div className="flex min-w-0 flex-wrap items-center gap-x-[8px] gap-y-[2px]">
        <button
          type="button"
          onClick={leave}
          className={classNames(
            'inline-flex cursor-pointer items-center gap-[8px] rounded-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#2d5d33]',
            FOCUS_RING
          )}
        >
          <JobDetailBackIcon className="size-[16px] shrink-0" />
          {COPY.backPrefix}
          {tab.label}
        </button>
        <span className="min-w-0 font-sans text-[13px] leading-[16px] whitespace-pre-wrap text-[#737373] max-lg:text-[13px]">
          {COPY.crumbPrefix}
          {job.title}
        </span>
      </div>

      <div className="flex flex-col gap-[16px] xl:grid xl:grid-cols-[minmax(0,1fr)_clamp(320px,22vw,380px)] xl:items-start xl:gap-[24px]">
        <div className="max-xl:contents xl:flex xl:min-w-0 xl:flex-col xl:gap-[16px] xl:pr-[6px]">
          {closed ? <ClosedBanner text={view.d.closedBanner} /> : null}
          <Hero
            view={view}
            mode={mode}
            saved={saved}
            onSave={toggleSave}
            onApply={startApply}
            jobs={jobs}
          />
          {applied && !closed ? <ApplicationCard view={view} jobs={jobs} /> : null}
          {view.d.about ? <AboutCard about={view.d.about} /> : null}
          <SkillsCard view={view} />
        </div>
        <div className="max-xl:contents xl:flex xl:min-w-0 xl:flex-col xl:gap-[16px]">
          <MatchCard view={view} mode={mode} jobs={jobs} />
          {closed && view.d.similar ? (
            <SimilarCard ids={view.d.similar} jobs={jobs} />
          ) : view.d.boost ? (
            <BoostCard boost={view.d.boost} />
          ) : null}
          <RecruiterCard view={view} />
        </div>
      </div>

      {apply ? <ApplyDialog jobs={jobs} view={view} kind={offline ? 'offline' : apply} /> : null}
    </div>
  );
};

export default JobDetailScreen;
