import { useEffect, useState } from 'react';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import RecruiterPageHeading from '../recruiterShared/RecruiterPageHeading.jsx';
import RecruiterJobTabs from '../recruiterShared/RecruiterJobTabs.jsx';
import RecruiterListToolbar from '../recruiterShared/RecruiterListToolbar.jsx';
import {
  TemplateCodeIcon,
  TemplateMegaphoneIcon,
  TemplateHeadsetIcon,
  TemplateGraduationIcon,
  TemplateDesignIcon,
  TemplatePlusIcon,
  TemplateArrowRightIcon,
} from './jobTemplatesIcons.jsx';
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
      className="flex h-full min-w-0 flex-col justify-between rounded-[14px] border border-border-card bg-white p-[22px] max-sm:p-[14px] text-left transition-all duration-300 ease-in hover:-translate-y-[2px] hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      <span className="flex flex-col gap-[24px] max-sm:gap-[10px]">
        {/* Figma: 48x48 #f3f8f4 r8 tile */}
        <span className="grid size-[48px] max-sm:size-[40px] place-items-center rounded-[8px] bg-[#f3f8f4]">
          <Icon className="w-[23.33px] text-brand-green-active" />
        </span>

        <span className="flex flex-col gap-[16px] max-sm:gap-[8px]">
          <span className="flex flex-col gap-[12px] max-sm:gap-[6px]">
            <span className="font-display text-[28px] not-italic leading-[36.4px] tracking-[-1.6px] text-black max-sm:text-[16px] max-sm:leading-6 max-sm:tracking-[-0.3px]">
              {template.title}
            </span>
            <span className="flex items-center gap-[6px]">
              <span className="inline-flex items-center rounded-pill border-[1.21px] border-border-pill bg-neutral px-[9.64px] py-[6px] font-sans text-[14px] font-medium leading-[16.71px] text-content-helper max-sm:py-[2px] max-sm:text-[12px]">
                {template.category}
              </span>
              <span className="font-sans text-[14px] leading-[16.71px] text-content-muted">•</span>
              <span className="font-sans text-[14px] leading-[19.2px] text-content-muted">
                {template.type}
              </span>
            </span>
          </span>

          {/* whitespace-pre-line keeps Figma's hard line breaks and literal "…" */}
          <span className="whitespace-pre-line font-sans text-[14px] leading-[21.6px] text-content-helper max-sm:line-clamp-3 max-sm:text-[13px] max-sm:leading-5">
            {template.description}
          </span>
        </span>
      </span>

      <span className="mt-[30px] flex items-center justify-between gap-3 border-t border-border-card pt-[18px] max-sm:mt-[10px] max-sm:pt-[8px]">
        <span className="font-sans text-[14px] max-sm:text-[13px] leading-[17.6px] text-[#999999]">
          {template.footnote}
        </span>
        <TemplateArrowRightIcon className="size-[24px] max-sm:size-[20px] shrink-0 text-brand-green-dark" />
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
      <div className="flex w-full flex-col gap-[28px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] max-md:gap-[12px] max-md:py-[12px]">
        {/* Header block — Figma 7249:75079, gap 16 */}
        <div className="flex flex-col gap-[16px] max-md:gap-[8px]">
          <RecruiterPageHeading
            lead={PAGE_HEADING.lead}
            accent={PAGE_HEADING.accent}
            subtitle={PAGE_SUBHEADING}
          />
          <RecruiterJobTabs />
        </div>

        {/* Canvas — Figma 7249:75098, gap 32 */}
        <div className="flex flex-col gap-[32px] pb-[48px] max-md:gap-[12px] max-md:pb-[8px]">
          {/* Category pills + search + create — Figma 7249:75100 / 7249:75126 */}
          <RecruiterListToolbar
            chips={CATEGORY_PILLS.map((pill) => ({ id: pill, label: pill }))}
            activeChipId={activeCategory}
            onChipSelect={(id) => {
              log('branch', { category: id });
              setActiveCategory(id);
            }}
            searchLabel={SEARCH_PLACEHOLDER}
            actionLabel={CREATE_CUSTOM_LABEL}
            onAction={() => log('branch', { action: 'create-custom', wired: false })}
          />

          {/* Grid — Figma 7249:75140: 4 columns of 315.25, 22.67 gutter */}
          <div className="grid grid-cols-1 gap-[22.67px] max-md:gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
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
              className="relative flex min-h-[360px] max-sm:min-h-[104px] flex-col items-center justify-center gap-[11px] max-sm:gap-[4px] rounded-[14px] px-[44px] py-[23px] max-sm:py-[12px] text-center transition-colors hover:bg-white/60"
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

              <span className="relative mb-[16px] max-sm:mb-0 grid size-[64px] max-sm:size-[36px] place-items-center rounded-full bg-[#f0eee8]">
                <TemplatePlusIcon className="size-[18.67px] text-content-muted" />
              </span>
              <span className="relative mb-[8px] max-sm:mb-0 font-display text-[28px] max-sm:text-[16px] not-italic leading-[64px] max-sm:leading-6 tracking-[-1.6px] text-black">
                {BLANK_TEMPLATE.title}
              </span>
              <span className="relative px-[18px] pt-[4px] max-sm:pt-0 font-sans text-[14px] max-sm:text-[13px] leading-[21.6px] max-sm:leading-5 text-content-helper">
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
