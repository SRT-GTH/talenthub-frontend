import { useEffect, useState } from 'react';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import RecruiterPageHeading from '../recruiterShared/RecruiterPageHeading.jsx';
import RecruiterJobTabs from '../recruiterShared/RecruiterJobTabs.jsx';
import { SearchIcon } from '../../shared/assets.jsx';
import {
  TemplateCodeIcon,
  TemplateMegaphoneIcon,
  TemplateHeadsetIcon,
  TemplateGraduationIcon,
  TemplateDesignIcon,
  TemplatePlusIcon,
  TemplateArrowRightIcon,
} from './jobTemplatesIcons.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  PAGE_HEADING,
  PAGE_SUBHEADING,
  CATEGORY_PILLS,
  SEARCH_PLACEHOLDER,
  CREATE_CUSTOM_LABEL,
  TEMPLATES,
  BLANK_TEMPLATE,
} from './jobTemplatesData.js';

const log = debug('JobTemplatesSection');

/*
 * JobTemplatesSection — the recruiter job-template library.
 * Source: Figma 7249:75046, content canvas 7249:75078 (VERTICAL, gap 28,
 * py 32, width 1329).
 *
 * Card anatomy, from a full-depth walk of 7249:75141:
 *   card            315.25x360, white, 1px #e6e2d6, r14, VERTICAL, pad 22,
 *                   counter-axis MAX so the footer is pinned to the bottom
 *   └ body          VERTICAL gap 24
 *     ├ icon tile   48x48, #f3f8f4, r8, glyph #2a5730
 *     └ copy        VERTICAL gap 16
 *       ├ head      VERTICAL gap 12 — title 28/36.4 ls -1.6 Instrument Serif,
 *       │           then a HORIZONTAL gap-6 row: pill + "•" + type
 *       └ desc      14/21.6 #737373, Figma's own hard line breaks and "…"
 *   └ footer        pad-top 30, then a 1px #e6e2d6 TOP border with pad-top 18,
 *                   SPACE_BETWEEN: footnote 14/17.6 #999999 + 24px arrow
 *
 * The category chip is a PILL (r120.54), not a rounded rectangle, and sits on
 * #f8f8f4 behind a 1.21px #e8e8e4 outline.
 */
const CARD_ICONS = {
  code: TemplateCodeIcon,
  megaphone: TemplateMegaphoneIcon,
  headset: TemplateHeadsetIcon,
  graduation: TemplateGraduationIcon,
  design: TemplateDesignIcon,
};

const TemplateCard = ({ template, onUse }) => {
  const Icon = CARD_ICONS[template.icon];
  return (
    <button
      type="button"
      onClick={() => onUse?.(template.id)}
      className="flex h-full min-w-0 flex-col justify-between rounded-[14px] border border-border-card bg-white p-[22px] text-left transition-all duration-300 ease-in hover:-translate-y-[2px] hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      <span className="flex flex-col gap-[24px]">
        {/* Figma: 48x48 #f3f8f4 r8 tile */}
        <span className="grid size-[48px] place-items-center rounded-[8px] bg-[#f3f8f4]">
          <Icon className="w-[23.33px] text-brand-green-active" />
        </span>

        <span className="flex flex-col gap-[16px]">
          <span className="flex flex-col gap-[12px]">
            <span className="font-display text-[28px] not-italic leading-[36.4px] tracking-[-1.6px] text-black">
              {template.title}
            </span>
            <span className="flex items-center gap-[6px]">
              <span className="inline-flex items-center rounded-pill border-[1.21px] border-border-pill bg-neutral px-[9.64px] py-[6px] font-sans text-[14px] font-medium leading-[16.71px] text-content-helper">
                {template.category}
              </span>
              <span className="font-sans text-[14px] leading-[16.71px] text-content-muted">•</span>
              <span className="font-sans text-[14px] leading-[19.2px] text-content-muted">
                {template.type}
              </span>
            </span>
          </span>

          {/* whitespace-pre-line keeps Figma's hard line breaks and literal "…" */}
          <span className="whitespace-pre-line font-sans text-[14px] leading-[21.6px] text-content-helper">
            {template.description}
          </span>
        </span>
      </span>

      <span className="mt-[30px] flex items-center justify-between gap-3 border-t border-border-card pt-[18px]">
        <span className="font-sans text-[14px] leading-[17.6px] text-[#999999]">
          {template.footnote}
        </span>
        <TemplateArrowRightIcon className="size-[24px] shrink-0 text-brand-green-dark" />
      </span>
    </button>
  );
};

const JobTemplatesSection = () => {
  const [activeCategory, setActiveCategory] = useState(CATEGORY_PILLS[0]);

  useEffect(() => {
    log('mount', { route: '/recruiter/job-templates', templateCount: TEMPLATES.length });
  }, []);

  return (
    <DashboardShell>
      <div className="flex w-full flex-col gap-[28px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)]">
        {/* Header block — Figma 7249:75079, gap 16 */}
        <div className="flex flex-col gap-[16px]">
          <RecruiterPageHeading
            lead={PAGE_HEADING.lead}
            accent={PAGE_HEADING.accent}
            subtitle={PAGE_SUBHEADING}
          />
          <RecruiterJobTabs />
        </div>

        {/* Canvas — Figma 7249:75098, gap 32 */}
        <div className="flex flex-col gap-[32px] pb-[48px]">
          <div className="flex items-center justify-between gap-[28.93px]">
            {/* Category pills — Figma 7249:75100, gap 8, h37, r100 */}
            <div className="flex flex-wrap items-center gap-[8px]">
              {CATEGORY_PILLS.map((pill) => {
                const isActive = pill === activeCategory;
                return (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => {
                      log('branch', { category: pill });
                      setActiveCategory(pill);
                    }}
                    className={classNames(
                      'inline-flex h-[37px] shrink-0 items-center rounded-pill border-[1.22px] border-brand-green-light-hover px-[14px]',
                      'font-sans tracking-[0.24px] shadow-[0_1.22px_3.65px_0_rgba(0,0,0,0.08)] transition-all duration-300 ease-in',
                      isActive
                        ? 'bg-brand-green text-[14.59px] font-semibold text-white'
                        : 'bg-white text-[14px] font-medium text-content-helper hover:bg-neutral'
                    )}
                  >
                    {pill}
                  </button>
                );
              })}
            </div>

            {/* Search + Create — Figma 7249:75126: a 547.73x49 HORIZONTAL group,
                gap 19.29. It must NOT wrap: the input is a fixed 362px and the
                button a fixed 166.4px, so `flex-wrap` + `w-full` on the label
                was pushing the button onto its own line. */}
            <div className="flex shrink-0 flex-nowrap items-center gap-[19.29px]">
              <label className="flex h-[49px] w-[362px] shrink-0 items-center gap-[9.73px] rounded-[12px] border-[1.22px] border-[#cccccc] bg-white px-[24px] shadow-[0_3.04px_0_0_#bfbfbf] focus-within:border-brand-green">
                <span className="sr-only">{SEARCH_PLACEHOLDER}</span>
                <SearchIcon className="size-[19.45px] shrink-0 text-[#595959]" />
                <input
                  type="search"
                  placeholder={SEARCH_PLACEHOLDER}
                  onChange={(event) => log('search', { length: event.target.value.length })}
                  className="min-w-0 flex-1 bg-transparent font-sans text-[14.5px] leading-[24.31px] text-black outline-none placeholder:text-[#999999]"
                />
              </label>
              <button
                type="button"
                onClick={() => log('branch', { action: 'create-custom', wired: false })}
                className="inline-flex h-[49px] shrink-0 items-center justify-center whitespace-nowrap rounded-[12.05px] border-[2.41px] border-brand-green-dark bg-brand-green px-[24.11px] font-sans text-[14px] font-medium leading-[16.71px] tracking-[0.12px] text-white shadow-[0_4.82px_0_0_#224626] transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4.82px] active:shadow-none"
              >
                {CREATE_CUSTOM_LABEL}
              </button>
            </div>
          </div>

          {/* Grid — Figma 7249:75140: 4 columns of 315.25, 22.67 gutter */}
          <div className="grid grid-cols-1 gap-[22.67px] sm:grid-cols-2 xl:grid-cols-4">
            {TEMPLATES.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={(id) => log('branch', { useTemplate: id, destination: 'none-in-figma' })}
              />
            ))}

            {/* Blank tile — Figma 7249:75230: 2px #d6d1c2 dashed [6,4], r14,
                VERTICAL gap 11, pad 44/23, centred, with a 64x64 #f0eee8
                circle holding an 18.67px #9a988f glyph. */}
            <button
              type="button"
              onClick={() =>
                log('branch', { action: 'blank-template', destination: 'none-in-figma' })
              }
              className="relative flex min-h-[360px] flex-col items-center justify-center gap-[11px] rounded-[14px] px-[44px] py-[23px] text-center transition-colors hover:bg-white/60"
            >
              {/* Tailwind cannot express stroke-dasharray, so the 6/4 dash is
                  drawn as an SVG rect (2px stroke clipped to 2px inset). */}
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full text-[#d6d1c2]"
              >
                <rect
                  width="100%"
                  height="100%"
                  rx="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="6 4"
                />
              </svg>

              <span className="relative mb-[16px] grid size-[64px] place-items-center rounded-full bg-[#f0eee8]">
                <TemplatePlusIcon className="size-[18.67px] text-content-muted" />
              </span>
              <span className="relative mb-[8px] font-display text-[28px] not-italic leading-[64px] tracking-[-1.6px] text-black">
                {BLANK_TEMPLATE.title}
              </span>
              <span className="relative px-[18px] pt-[4px] font-sans text-[14px] leading-[21.6px] text-content-helper">
                {BLANK_TEMPLATE.description}
              </span>
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default JobTemplatesSection;
