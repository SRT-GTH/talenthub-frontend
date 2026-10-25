import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import efuaPhoto from '../../../../assets/agency/programmes/efua-owusu-recruiter.png';
import nyaLogo from '../../../../assets/agency/programmes/nya-logo-mark.svg';
import { JobBriefIcon, JobCashIcon, JobPinIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import {
  JobDetailBackIcon,
  JobDetailCalIcon,
  JobDetailCheckIcon,
  JobDetailClockIcon,
  JobDetailFlagIcon,
  JobDetailGradIcon,
  JobDetailInfoIcon,
  JobDetailPinIcon,
  JobDetailPlusIcon,
  JobDetailSaveIcon,
  JobDetailShareIcon,
  JobDetailSparkIcon,
  JobDetailVerifiedIcon,
} from '../../talentJobs/JobDetailIcons.jsx';
import { Sticker } from '../../talentJobs/JobDetailParts.jsx';
import {
  FOCUS_RING,
  INK_CARD,
  SECTION_CARD,
  SECTION_TITLE,
} from '../../talentJobs/jobDetailStyles.js';
import { PREVIEW } from '../data/programmesData.js';

const log = debug('ProgrammePreviewBody');

/*
 * ProgrammePreviewBody — "Preview as a talent sees it" (Figma 11.5.2b 8597:394257 in the talent chrome; 11.5.2c 8597:394759 in the agency chrome): the posting detail of
 * the Talent Jobs screens (same 925 | 380 two-column layout and the same tokens: hero card r26, "About the grant", "Good to have", the green match card, the amber
 * "Boost to ~86%" card, "WHO’S RUNNING IT") drawn with the programme's content. Everything on it is read-only (a preview): Apply, Save and Share are inert.
 * Props: published (the primary button reads "Published"), onPublish (shows the "Publish programme" button in the back row; ⚠️ ASSUMPTION: Figma draws no publish
 * control, so the back row carries it), backHref, children (overlay dialogs).
 */

const MetaChip = ({ icon, children }) => {
  const Icon = icon;
  return (
    <span className="inline-flex h-[30px] items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-[#f8f8f4] py-[6px] pr-[12px] pl-[10px] font-sans text-[13.5px] leading-[16px] font-medium text-[#1c2a21] max-lg:text-[14px]">
      <Icon className="size-[15px] shrink-0 text-[#595959]" />
      {children}
    </span>
  );
};

const IconButton = ({ label, children }) => (
  <button
    type="button"
    aria-label={label}
    onClick={() => log('preview only:', label)}
    className={classNames(
      'flex size-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.2)] bg-white p-0 text-[#387440]',
      FOCUS_RING
    )}
  >
    {children}
  </button>
);

const SkillChip = ({ name, verified }) => (
  <span
    className={classNames(
      'inline-flex h-[32px] items-center gap-[6px] rounded-full border border-solid bg-[#ebf1ec] py-[7px] pr-[12px] pl-[10px] font-sans text-[13px] leading-[16px] font-semibold text-[#2d5d33]',
      verified ? 'border-[rgba(28,42,33,0.12)]' : 'border-[#c1d4c4]'
    )}
  >
    <JobDetailCheckIcon className="size-[13px] text-[#387440]" />
    {verified ? `${name} · verified` : name}
  </span>
);

const ProgrammePreviewBody = ({ published = false, onPublish, backHref, children }) => {
  const P = PREVIEW;
  const metaIcons = [JobPinIcon, JobBriefIcon, JobCashIcon, JobDetailCalIcon];
  const rowIcons = {
    skills: JobDetailSparkIcon,
    education: JobDetailGradIcon,
    region: JobDetailPinIcon,
  };
  return (
    <div className="flex w-full min-w-0 flex-col gap-[24px] font-sans">
      <div className="flex min-w-0 flex-wrap items-center gap-x-[8px] gap-y-[8px]">
        <Link
          to={backHref}
          className={classNames(
            'inline-flex min-h-[24px] items-center gap-[8px] rounded-[6px] text-[14px] leading-[17px] font-semibold text-[#2d5d33] no-underline',
            FOCUS_RING
          )}
        >
          <JobDetailBackIcon className="size-[16px] shrink-0" />
          Back to editing
        </Link>
        <span className="min-w-0 font-sans text-[13px] leading-[16px] whitespace-pre-wrap text-[#737373]">
          {'·  Preview as a talent sees it'}
        </span>
        {onPublish && !published ? (
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="ml-auto !py-[8.5px] !text-[14px]"
            onClick={onPublish}
          >
            Publish programme
          </Button>
        ) : null}
      </div>
      <div className="flex flex-col gap-[16px] xl:grid xl:grid-cols-[minmax(0,1fr)_clamp(320px,22vw,380px)] xl:items-start xl:gap-[24px]">
        <div className="max-xl:contents xl:flex xl:min-w-0 xl:flex-col xl:gap-[16px] xl:pr-[6px]">
          <article
            className={classNames(
              'flex min-w-0 flex-col gap-[16px] rounded-[26px] bg-white px-[clamp(16px,1.5vw,26px)] py-[clamp(16px,1.39vw,24px)] max-xl:order-1',
              INK_CARD
            )}
          >
            <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[10px]">
              <img
                src={nyaLogo}
                alt=""
                aria-hidden="true"
                className="size-[56px] shrink-0 rounded-[16px] object-cover"
              />
              <div className="flex min-w-0 flex-[1_1_200px] flex-col gap-[2px]">
                <div className="flex flex-wrap items-center gap-x-[6px] gap-y-[4px]">
                  <span className="font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
                    {P.agency}
                  </span>
                  <span className="inline-flex items-center gap-[4px] rounded-full bg-[#ebf1ec] py-[2px] pr-[8px] pl-[6px] font-sans text-[11.5px] leading-[14px] font-semibold text-[#224626] max-lg:text-[12px]">
                    <JobDetailVerifiedIcon className="size-[11px]" />
                    {P.agencyBadge}
                  </span>
                </div>
                <span className="font-sans text-[13px] leading-[16px] text-[#737373]">
                  {P.agencyLine}
                </span>
              </div>
              <div className="ml-auto flex items-center gap-[12px]">
                <Sticker tone="yellow">{P.sticker}</Sticker>
                <IconButton label={`Save ${P.title}`}>
                  <JobDetailSaveIcon className="size-[20px]" />
                </IconButton>
                <IconButton label={`Share ${P.title}`}>
                  <JobDetailShareIcon className="size-[20px]" />
                </IconButton>
              </div>
            </div>
            <h1 className="m-0 font-sans text-[clamp(28px,2.31vw,40px)] leading-[1.1] font-semibold text-[#1c2a21]">
              {P.title}
            </h1>
            <div className="flex flex-wrap gap-[8px]">
              {P.chips.map((c, i) => (
                <MetaChip key={c.id} icon={metaIcons[i]}>
                  {c.text}
                </MetaChip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[10px] pt-[4px] min-[1500px]:flex-nowrap">
              {published ? (
                <span
                  aria-live="polite"
                  className="inline-flex items-center justify-center rounded-[14px] border-t border-r-2 border-b-2 border-l-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#165d3a] shadow-[0_1px_2px_rgba(27,36,44,0.12)] max-lg:px-4 max-lg:py-2.5 max-lg:text-[14px]"
                >
                  Published
                </span>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => log('preview only: apply')}
                  aria-disabled="true"
                >
                  Apply with my GTH profile
                </Button>
              )}
              <Button variant="tertiary" size="lg" onClick={() => log('preview only: save')}>
                Save for later
              </Button>
              <span className="min-w-0 flex-[0_1_auto] font-sans text-[13px] leading-[16px] text-[#737373]">
                {P.hint}
              </span>
              <button
                type="button"
                onClick={() => log('preview only: report')}
                className={classNames(
                  'inline-flex cursor-pointer items-center gap-[5px] rounded-[8px] border-0 bg-transparent px-[10px] py-[6px] font-sans text-[12.5px] whitespace-nowrap leading-[15px] font-semibold text-[#737373]',
                  FOCUS_RING
                )}
              >
                <JobDetailFlagIcon className="size-[13px]" />
                Report programme
              </button>
            </div>
          </article>
          <section
            aria-labelledby="pp-about"
            className={classNames(SECTION_CARD, 'max-xl:order-5')}
          >
            <h2 id="pp-about" className={SECTION_TITLE}>
              {P.about.title}
            </h2>
            <p className="m-0 font-sans text-[15px] leading-[1.45] text-[#1c2a21]">
              {P.about.intro}
            </p>
            <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
              {P.about.bullets.map((b) => (
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
          <section
            aria-labelledby="pp-good"
            className={classNames(SECTION_CARD, '!gap-[12px] max-xl:order-6')}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-[8px] gap-y-[4px]">
              <h2 id="pp-good" className={SECTION_TITLE}>
                {P.good.title}
              </h2>
              <span className="font-sans text-[13.5px] leading-[16px] font-semibold text-[#2d5d33]">
                {P.good.summary}
              </span>
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {P.good.items.map((s) => (
                <SkillChip key={s.id} name={s.text} verified={s.verified} />
              ))}
              <span className="inline-flex h-[32px] items-center gap-[6px] rounded-full border-[1.2px] border-dashed border-[#c8951a] bg-white py-[7px] pr-[12px] pl-[10px] font-sans text-[13px] leading-[16px] font-semibold text-[#967014]">
                <JobDetailPlusIcon className="size-[13px]" />
                {P.good.missing} · missing
              </span>
            </div>
          </section>
        </div>
        <div className="max-xl:contents xl:flex xl:min-w-0 xl:flex-col xl:gap-[16px]">
          <section
            aria-label="YOUR MATCH"
            className={classNames(
              'flex min-w-0 flex-col gap-[12px] rounded-[26px] bg-[#387440] p-[clamp(16px,1.27vw,22px)] max-xl:order-2',
              INK_CARD
            )}
          >
            <div className="flex min-h-[22px] items-center justify-between gap-[8px]">
              <span className="font-sans text-[12px] leading-[14px] font-bold text-[#c1d4c4]">
                YOUR MATCH
              </span>
              <Sticker>{P.match.label}</Sticker>
            </div>
            <p className="m-0 font-sans text-[clamp(48px,3.7vw,64px)] leading-[1.09] font-semibold text-white">
              {P.match.pct}%
            </p>
            <p className="m-0 font-sans text-[14px] leading-[20px] text-[#e1eae2]">
              {P.match.note}
            </p>
            <ul className="m-0 flex list-none flex-col rounded-[16px] bg-[rgba(255,255,255,0.1)] px-[14px] py-[4px]">
              {P.match.rows.map((r) => {
                const Icon = rowIcons[r.id];
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
            <button
              type="button"
              onClick={() => log('preview only: how match')}
              className={classNames(
                'inline-flex w-fit cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white py-[6px] pr-[12px] pl-[10px] font-sans text-[12.5px] leading-[15px] font-bold text-[#1c2a21]',
                FOCUS_RING
              )}
            >
              <JobDetailInfoIcon className="size-[14px]" />
              How is this worked out?
            </button>
          </section>
          <section
            aria-label="Boost your match"
            className="flex min-w-0 flex-col gap-[10px] rounded-[22px] border-[1.2px] border-solid border-[#c8951a] bg-[#faf4e8] p-[clamp(16px,1.16vw,20px)] max-xl:order-4"
          >
            <div className="flex min-h-[24px] flex-wrap items-center gap-[8px]">
              <h2 className="m-0 font-sans text-[19px] leading-[24px] font-semibold text-[#1c2a21]">
                {P.boost.title}
              </h2>
              <Sticker
                tone="white"
                className="!py-[3px] !text-[11px] !leading-[13px] max-lg:!text-[12px]"
              >
                {P.boost.delta}
              </Sticker>
            </div>
            <p className="m-0 font-sans text-[13.5px] leading-[1.4] text-[#595959]">
              {P.boost.note}
            </p>
            <div className="flex flex-wrap gap-[8px] pt-[2px] pb-[10px]">
              <Button variant="tertiary" size="sm" onClick={() => log('preview only: have it')}>
                {P.boost.have}
              </Button>
              <Button variant="tertiary" size="sm" onClick={() => log('preview only: learn it')}>
                {P.boost.learn}
              </Button>
            </div>
          </section>
          <section
            aria-label={P.runner.heading}
            className="flex min-w-0 flex-col gap-[12px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[clamp(16px,1.16vw,20px)] max-xl:order-7"
          >
            <span className="font-sans text-[12px] leading-[14px] font-bold text-[#737373]">
              {P.runner.heading}
            </span>
            <div className="flex items-center gap-[12px]">
              <span className="relative block size-[48px] shrink-0">
                <img
                  src={efuaPhoto}
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
                  {P.runner.name}
                </span>
                <span className="font-sans text-[12.5px] leading-[15px] text-[#737373]">
                  {P.runner.role}
                </span>
              </span>
            </div>
            <span className="inline-flex w-fit items-center gap-[6px] rounded-full bg-[#f8f8f4] px-[10px] py-[6px] font-sans text-[12.5px] leading-[15px] font-medium text-[#595959]">
              <JobDetailClockIcon className="size-[13px]" />
              {P.runner.reply}
            </span>
          </section>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ProgrammePreviewBody;
