import { useId, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  HelpArrowheadRightIcon,
  HelpCalloutShieldIcon,
  HelpFlagIcon,
  HelpFlagInkIcon,
  HelpFlagLargeIcon,
  HelpMailInkIcon,
  HelpRadioOffIcon,
  HelpRadioOnIcon,
  HelpThumbDownIcon,
  HelpThumbUpIcon,
  HelpToggleOnIcon,
  HelpWhatsappInkIcon,
} from '../../shared/assets.jsx';
import {
  FOCUS_RING,
  HEADING,
  HelpButton,
  HelpChip,
  HelpModal,
  HelpRow,
  PAGE_CARD,
  PageHeader,
} from './helpUi.jsx';
import HelpField from './helpFields.jsx';
import { ARTICLE, REPORT } from './helpData.js';
import iconBulb from '../../../assets/notifications/help/bulb.svg';

const log = debug('HelpArticleView');

/*
 * HP-04 Help article · Recruiter asked for a fee (Playful 8229:22097 / Focused 8230:419009) and
 * HP-07 Report a problem (modal over it, Playful 8229:22572 / Focused 8230:419313).
 * Props: settings ({ update }), reporting (true = the HP-07 modal is open, `?help=report`).
 */
const Step = ({ n, title, body }) => (
  <div className="flex items-start gap-[14px]">
    <span className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#387440] font-sans text-[14px] font-bold leading-[1.2] text-white">
      {n}
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
      <p className="m-0 font-sans text-[16px] font-semibold leading-[1.2] text-[#1c2a21]">
        {title}
      </p>
      <p className="m-0 whitespace-pre-wrap font-sans text-[14px] leading-[21px] text-[#595959]">
        {body}
      </p>
    </div>
  </div>
);

const SideTitle = ({ children }) => (
  <h2 className={classNames('m-0 text-[18px] leading-[1.2] text-[#1c2a21]', HEADING)}>
    {children}
  </h2>
);

const ReportProblemModal = ({ onClose }) => {
  const uid = useId();
  const [reason, setReason] = useState(REPORT.options[0]);
  const [details, setDetails] = useState(REPORT.detailsValue);
  const [block, setBlock] = useState(true);
  log('report modal', { reason, block });

  return (
    <HelpModal
      onClose={onClose}
      labelledBy={`${uid}-title`}
      scrim="rgba(28,42,33,0.45)"
      cardClassName="max-w-[560px]"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          log('send report', { reason, block, details: details.length });
          onClose();
        }}
        className="flex flex-col gap-[18px] rounded-[24px] bg-white p-[clamp(18px,2vw,28px)] shadow-[0_20px_48px_rgba(28,42,33,0.18)]"
      >
        <div className="flex items-start gap-[12px]">
          <HelpFlagLargeIcon className="size-[24px] shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <h2
              id={`${uid}-title`}
              className={classNames('m-0 text-[26px] leading-[1.2] text-[#1c2a21]', HEADING)}
            >
              {REPORT.title}
            </h2>
            <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#595959]">
              {REPORT.subtitle}
            </p>
          </div>
        </div>
        <p className="m-0 font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]">
          {REPORT.question}
        </p>
        <div role="radiogroup" aria-label={REPORT.question} className="flex flex-col gap-[8px]">
          {REPORT.options.map((option) => {
            const on = option === reason;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={option}
                onClick={() => setReason(option)}
                className={classNames(
                  'flex w-full cursor-pointer items-center gap-[12px] rounded-[12px] border border-solid px-[14px] py-[12px] text-left',
                  FOCUS_RING,
                  on
                    ? 'border-[1.5px] border-[#387440] bg-[#ebf1ec]'
                    : 'border-[rgba(28,42,33,0.15)] bg-white'
                )}
              >
                {on ? (
                  <HelpRadioOnIcon className="size-[18px] shrink-0" />
                ) : (
                  <HelpRadioOffIcon className="size-[18px] shrink-0" />
                )}
                <span
                  aria-hidden="true"
                  data-count={option}
                  className={classNames(
                    'min-w-0 flex-1 font-sans text-[14px] leading-[1.2] text-[#1c2a21] after:content-[attr(data-count)]',
                    on ? 'font-semibold' : 'font-medium'
                  )}
                />
              </button>
            );
          })}
        </div>
        <HelpField
          id={`${uid}-details`}
          label={REPORT.detailsLabel}
          star
          multiline
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <div className="flex items-center gap-[12px] rounded-[12px] bg-[#f8f8f4] px-[14px] py-[12px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <span
              id={`${uid}-block`}
              className="font-sans text-[14px] font-semibold leading-[1.2] text-[#1c2a21]"
            >
              {REPORT.blockTitle}
            </span>
            <span className="font-sans text-[12px] leading-[1.2] text-[#595959]">
              {REPORT.blockBody}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={block}
            aria-labelledby={`${uid}-block`}
            onClick={() => setBlock((v) => !v)}
            className={classNames('shrink-0 cursor-pointer rounded-full', FOCUS_RING)}
          >
            {block ? (
              <HelpToggleOnIcon className="block h-[26px] w-[44px]" />
            ) : (
              <span className="relative block h-[26px] w-[44px] rounded-full bg-[#dfdfdc]">
                <span className="absolute left-[3px] top-[3px] size-[20px] rounded-full bg-white" />
              </span>
            )}
          </button>
        </div>
        <div className="flex items-start gap-[10px]">
          <HelpButton size="lg" className="min-w-px flex-1" onClick={onClose}>
            {REPORT.cancel}
          </HelpButton>
          <HelpButton
            tone="primary"
            size="lg"
            className="min-w-px flex-1"
            onClick={(e) => e.currentTarget.form?.requestSubmit()}
          >
            {REPORT.send}
          </HelpButton>
        </div>
      </form>
    </HelpModal>
  );
};

const HelpArticleView = ({ settings, reporting }) => {
  log('mount', { reporting });
  const toCentre = () => settings.update({ help: null, q: null });
  const openReport = () => settings.update({ help: 'report', q: null });

  return (
    <div className="flex flex-col gap-[clamp(16px,1.39vw,24px)]">
      <PageHeader title={ARTICLE.pageTitle} subtitle={ARTICLE.pageSubtitle} preserveSpaces />

      <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start">
        <article
          className={classNames(
            PAGE_CARD,
            'flex min-w-0 flex-1 flex-col gap-[16px] p-[clamp(18px,1.62vw,28px)]'
          )}
        >
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-[6px]">
            <button
              type="button"
              onClick={toCentre}
              className={classNames(
                'cursor-pointer font-sans text-[13px] font-semibold leading-[1.2] text-[#387440]',
                FOCUS_RING
              )}
            >
              {ARTICLE.breadcrumb[0]}
            </button>
            <HelpArrowheadRightIcon className="size-[12px]" />
            <span className="font-sans text-[13px] font-semibold leading-[1.2] text-[#387440]">
              {ARTICLE.breadcrumb[1]}
            </span>
            <HelpArrowheadRightIcon className="size-[12px]" />
            <span
              aria-current="page"
              className="font-sans text-[13px] font-medium leading-[1.2] text-[#595959]"
            >
              {ARTICLE.breadcrumb[2]}
            </span>
          </nav>
          <h2
            className={classNames(
              'm-0 text-[clamp(24px,1.97vw,34px)] leading-[1.18] text-[#1c2a21]',
              HEADING
            )}
          >
            {ARTICLE.title}
          </h2>
          <div className="flex flex-wrap items-center gap-[10px]">
            <HelpChip soft>{ARTICLE.category}</HelpChip>
            <span className="whitespace-pre-wrap font-sans text-[13px] leading-[1.2] text-[#595959]">
              {ARTICLE.meta}
            </span>
          </div>
          <div
            role="note"
            className="flex items-start gap-[12px] rounded-[12px] border border-solid border-[rgba(192,57,43,0.25)] bg-[#fcece9] px-[16px] py-[14px]"
          >
            <HelpCalloutShieldIcon className="size-[18px] shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-[2px] leading-[1.2]">
              <p className="m-0 font-sans text-[14px] font-semibold text-[#c0392b]">
                {ARTICLE.callout.title}
              </p>
              <p className="m-0 font-sans text-[13px] text-[#1c2a21] opacity-85">
                {ARTICLE.callout.body}
              </p>
            </div>
          </div>
          <h3 className={classNames('m-0 text-[20px] leading-[1.2] text-[#1c2a21]', HEADING)}>
            {ARTICLE.stepsTitle}
          </h3>
          {ARTICLE.steps.map((s, i) => (
            <Step key={s.title} n={i + 1} title={s.title} body={s.body} />
          ))}
          <p className="m-0 font-sans text-[14px] leading-[21px] text-[#1c2a21]">
            {ARTICLE.alreadyPaid}
          </p>
          <div className="h-px w-full bg-[rgba(28,42,33,0.08)]" />
          <div className="flex flex-wrap items-center gap-[10px]">
            <span className="min-w-0 flex-1 font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]">
              {ARTICLE.helpful.question}
            </span>
            <HelpButton
              size="md"
              icon={<HelpThumbUpIcon className="size-[20px]" />}
              onClick={() => log('helpful: yes')}
            >
              {ARTICLE.helpful.yes}
            </HelpButton>
            <HelpButton
              size="md"
              icon={<HelpThumbDownIcon className="size-[20px]" />}
              onClick={() => log('helpful: no')}
            >
              {ARTICLE.helpful.no}
            </HelpButton>
          </div>
          <div className="flex flex-col gap-[8px]">
            <span className="font-sans text-[11px] font-semibold leading-[1.2] tracking-[0.66px] max-lg:text-[12px] text-[#387440]">
              {ARTICLE.relatedLabel}
            </span>
            {ARTICLE.related.map((title) => (
              <HelpRow
                key={title}
                icon="file"
                title={title}
                onClick={() => log('related (no article drawn)', title)}
              />
            ))}
          </div>
        </article>

        <aside className="flex w-full shrink-0 flex-col gap-[20px] xl:w-[340px]">
          <section className={classNames(PAGE_CARD, 'flex flex-col gap-[12px] p-[22px]')}>
            <SideTitle>{ARTICLE.stuck.title}</SideTitle>
            <p className="m-0 font-sans text-[13px] leading-[1.2] text-[#595959]">
              {ARTICLE.stuck.body}
            </p>
            <HelpButton
              tone="primary"
              className="w-full"
              icon={<img src={iconBulb} alt="" aria-hidden="true" className="size-[20px]" />}
              onClick={() => log('ask buddy')}
            >
              {ARTICLE.stuck.buddy}
            </HelpButton>
            <HelpButton
              className="w-full"
              icon={<HelpWhatsappInkIcon className="size-[20px]" />}
              onClick={() => log('whatsapp support')}
            >
              {ARTICLE.stuck.whatsapp}
            </HelpButton>
            <HelpButton
              className="w-full"
              icon={<HelpMailInkIcon className="size-[20px]" />}
              onClick={() => settings.update({ help: 'contact', q: null })}
            >
              {ARTICLE.stuck.contact}
            </HelpButton>
          </section>
          <section className="flex flex-col gap-[10px] rounded-[20px] border border-solid border-[rgba(178,52,40,0.25)] bg-[#fcece9] p-[22px]">
            <HelpFlagIcon className="size-[22px]" />
            <p className="m-0 font-sans text-[16px] font-semibold leading-[1.2] text-[#1c2a21]">
              {ARTICLE.reportCard.title}
            </p>
            <p className="m-0 font-sans text-[13px] leading-[19px] text-[#1c2a21]">
              {ARTICLE.reportCard.body}
            </p>
            <HelpButton
              className="w-full"
              icon={<HelpFlagInkIcon className="size-[20px]" />}
              onClick={openReport}
            >
              {ARTICLE.reportCard.action}
            </HelpButton>
          </section>
        </aside>
      </div>

      {reporting && <ReportProblemModal onClose={() => settings.update({ help: 'article' })} />}
    </div>
  );
};

export default HelpArticleView;
