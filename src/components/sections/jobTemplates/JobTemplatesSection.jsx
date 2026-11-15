import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BannerToast from '../../ui/BannerToast.jsx';
import TemplateDetailsDialog from '../recruiterJobs/TemplateDetailsDialog.jsx';
import { ArrowRight, DotsGlyph, FilterGlyph } from '../recruiterJobs/jobIcons.jsx';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import { renderWorkspaceSidebar } from '../recruiterDashboard/renderWorkspaceSidebar.jsx';
import useScopedRoundedFont from '../../../hooks/useScopedRoundedFont.js';
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
import { isRecruiterSession } from '../../../services/recruiterShell.api.js';
import { fetchMyTemplates } from '../../../services/recruiterPostings.api.js';
import {
  PAGE_HEADING,
  PAGE_SUBHEADING,
  CATEGORY_PILLS,
  SEARCH_PLACEHOLDER,
  CREATE_CUSTOM_LABEL,
  TEMPLATES,
  BLANK_TEMPLATE,
  FILTERED_SUMMARY,
  MY_TEMPLATES,
  TEMPLATE_TOASTS,
  TEMPLATE_MENU,
  SCREENING_CRITERIA,
  SCREENING_LOAD_LABEL,
  SCREENING_PILL_LABEL,
} from './jobTemplatesData.js';

const log = debug('JobTemplatesSection');

/*
 * JobTemplatesSection — the recruiter job-template library.
 * Source: Figma 7249:75046 (+ filter-pill state 7249:75464), content canvas 7249:75078 (VERTICAL, gap 28,
 * py 32, width 1329).
 *
 * Card anatomy, from a full-depth walk of 7249:75141:
 *   card            315.25x360, white, 1px #e6e2d6, r14, VERTICAL, pad 22,
 *                   counter-axis MAX so the footer is pinned to the bottom
 *   └ body          VERTICAL gap 24
 *     ├ icon tile   48x48, #f3f8f4, r8, glyph #2a5730
 *     └ copy        VERTICAL gap 16
 *       ├ head      VERTICAL gap 12 — title Bricolage Grotesque 25/30 ls -0.5,
 *       │           then a HORIZONTAL gap-6 row: pill + "•" + type
 *       └ desc      14/21.6 #737373, Figma's own hard line breaks and "…"
 *   └ footer        pad-top 30, then a 1px #e6e2d6 TOP border with pad-top 18,
 *                   SPACE_BETWEEN: footnote 14/17.6 #999999 + 24px arrow
 *
 * The category chip is a PILL (r120.54), not a rounded rectangle, and sits on
 * #f8f8f4 behind a 1.21px #e8e8e4 outline.
 */
/*
 * URL STATE (query string on /recruiter/job-templates)
 *   (none)                 7249:75046  "All" pill active, every template shown
 *   ?category=design       7249:75464  "Design" pill active + "Showing 1 template in Design" + the
 *                                      matching cards + the "Create Custom" tile
 *   ?category=<technology|healthcare|manufacturing|retail|internship>  same, other pills
 * Clicking a pill writes the same key ("All" removes it), so reload, deep-link and back all work.
 * Typing in the search field filters by title locally (no frame draws a typed query).
 */
const CARD_ICONS = {
  code: TemplateCodeIcon,
  megaphone: TemplateMegaphoneIcon,
  headset: TemplateHeadsetIcon,
  graduation: TemplateGraduationIcon,
  design: TemplateDesignIcon,
};

const TemplateCard = ({ template, onUse, menu }) => {
  const Icon = CARD_ICONS[template.icon];
  return (
    <div className="relative min-w-0">
      {menu ? (
        <div className="absolute top-[14px] right-[14px] z-10">
          <span className="flex size-[28px] items-center justify-center rounded-full text-[#999]">
            <DotsGlyph size={16} />
          </span>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => onUse?.(template.id)}
        className="flex h-full min-w-0 flex-col justify-between rounded-[14px] border border-border-card bg-white p-[22px] max-sm:p-[14px] text-left transition-all duration-300 ease-in hover:-translate-y-[2px] hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <span className="flex flex-col gap-[24px] max-sm:gap-[10px]">
          {/* Figma: 48x48 #f3f8f4 r8 tile */}
          <span
            className="grid size-[48px] max-sm:size-[40px] place-items-center rounded-[8px]"
            style={{ backgroundColor: template.iconTileColor, color: template.iconColor }}
          >
            <Icon className="w-[23.33px]" />
          </span>

          <span className="flex flex-col gap-[16px] max-sm:gap-[8px]">
            <span className="flex flex-col gap-[12px] max-sm:gap-[6px]">
              <span className="font-heading text-[25px] font-semibold leading-[30px] tracking-[-0.5px] text-[#1c2a21] max-sm:text-[16px] max-sm:leading-6 max-sm:tracking-[-0.3px]">
                {template.title}
              </span>
              <span className="flex items-center gap-[6px]">
                <span className="inline-flex items-center rounded-pill border-[1.21px] border-border-pill bg-neutral px-[9.64px] py-[6px] font-sans text-[14px] font-medium leading-[16.71px] text-content-helper max-sm:py-[2px] max-sm:text-[12px]">
                  {template.category}
                </span>
                <span className="font-sans text-[14px] leading-[16.71px] text-content-muted">
                  •
                </span>
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
      {menu}
    </div>
  );
};

/* JS-15 — a saved screening-criteria card: filter tile, title (+ "New"), source line, tag pills, usage + "Load on a job". */
const ScreeningCard = ({ item, onLoad }) => (
  <article
    className={`flex min-w-0 flex-col gap-[16px] rounded-[14px] border bg-white p-[22px] ${item.isNew ? 'border-2 border-[#387440]' : 'border-border-card'}`}
  >
    <div className="flex items-start justify-between gap-[12px]">
      <span className="flex size-[40px] items-center justify-center rounded-[8px] bg-[#f3f8f4] text-[#2a5730]">
        <FilterGlyph size={20} />
      </span>
      {item.isNew ? (
        <span className="inline-flex h-[24px] items-center rounded-full bg-[#ebf1ec] px-[10px] font-sans text-[12px] leading-[16px] font-medium text-[#165d3a]">
          New
        </span>
      ) : null}
    </div>
    <div className="flex flex-col gap-[4px]">
      <h3 className="m-0 font-heading text-[20px] leading-[26px] font-semibold tracking-[-0.4px] text-[#111]">
        {item.title}
      </h3>
      <p className="m-0 font-sans text-[12px] leading-[16px] text-[#575755]">{item.source}</p>
    </div>
    <div className="flex flex-wrap gap-[8px]">
      {item.tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex h-[26px] items-center rounded-full border border-solid border-[#dbded9] bg-white px-[10px] font-sans text-[12px] leading-[16px] font-medium text-[#575755]"
        >
          {tag}
        </span>
      ))}
    </div>
    <div className="mt-auto flex items-center justify-between border-0 border-t border-solid border-border-card pt-[16px]">
      <span className="font-sans text-[12px] leading-[16px] text-[#575755]">{item.usedOn}</span>
      <button
        type="button"
        onClick={onLoad}
        className="inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[20px] font-medium text-[#387440]"
      >
        {SCREENING_LOAD_LABEL}
        <ArrowRight size={14} />
      </button>
    </div>
  </article>
);

/* Signed in: "My templates" are the recruiter's saved templates (GET /opportunities/templates?mine=true). */
const TYPE_LABEL = {
  'full-time-job': 'Full-Time',
  internship: 'Internship',
  'training-program': 'Training',
  'government-program': 'National Service',
};
const liveTemplateCard = (t) => {
  const f = t.defaultFields || {};
  const when = t.createdAt
    ? new Date(t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    : '';
  return {
    id: String(t.id || t._id),
    iconTileColor: '#f3f8f4',
    iconColor: '#2a5730',
    icon: 'code',
    title: t.name,
    category: t.category || 'Saved',
    type: TYPE_LABEL[f.type] || 'Job',
    description:
      t.description ||
      String(f.shortDescription || f.description || '').slice(0, 140) ||
      'No description saved.',
    footnote: when ? `Saved ${when} by you` : 'Saved by you',
    live: true,
  };
};

const JobTemplatesSection = () => {
  useScopedRoundedFont('data-recruiter-ui'); // Figma draws the recruiter pages in SF Pro Rounded
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const mine = searchParams.get('mine') === '1';
  const screeningView = searchParams.get('view') === 'screening';
  const toastKind = searchParams.get('toast');
  const isLive = isRecruiterSession();
  const [liveMine, setLiveMine] = useState(null);
  useEffect(() => {
    if (!isLive) return undefined;
    let alive = true;
    fetchMyTemplates()
      .then((rows) => alive && setLiveMine(rows.map(liveTemplateCard)))
      .catch((err) => {
        log.error('templates failed:', err?.response?.status);
        if (alive) setLiveMine([]);
      });
    return () => {
      alive = false;
    };
  }, [isLive, toastKind]);
  const savedName = searchParams.get('name');
  const toast =
    isLive && (toastKind === 'saved' || toastKind === 'copied')
      ? {
          tone: 'success',
          title: 'Success - Saved as a template',
          message: `${savedName || 'Your template'} is in My templates`,
          actionLabel: liveMine && liveMine.length ? 'Use it now' : undefined,
        }
      : TEMPLATE_TOASTS[toastKind];
  const modal = searchParams.get('modal');
  const menuId = searchParams.get('menu');
  const myList = isLive
    ? liveMine || []
    : [...(toastKind === 'copied' ? [MY_TEMPLATES.copied] : []), MY_TEMPLATES.saved];
  const patch = (changes) => {
    const next = new URLSearchParams(window.location.search);
    Object.entries(changes).forEach(([k, v]) => (v == null ? next.delete(k) : next.set(k, v)));
    setSearchParams(next);
  };
  const startFromTemplate = (id) => navigate(`/recruiter/job-postings/new?template=${id}`);

  // ?category=design -> the "Design" pill. Unknown values fall back to "All".
  const categoryParam = searchParams.get('category')?.toLowerCase() ?? '';
  const activeCategory =
    CATEGORY_PILLS.find((pill) => pill.toLowerCase() === categoryParam && pill !== 'All') ??
    CATEGORY_PILLS[0];
  const isFiltered = activeCategory !== CATEGORY_PILLS[0] && !mine && !screeningView;

  useEffect(() => {
    log('mount', { route: '/recruiter/job-templates', templateCount: TEMPLATES.length });
  }, []);

  useEffect(() => {
    log('state', { activeCategory, isFiltered, searchLength: searchText.length });
  }, [activeCategory, isFiltered, searchText]);

  const visibleTemplates = useMemo(() => {
    const needle = searchText.trim().toLowerCase();
    if (mine) return myList.filter((t) => !needle || t.title.toLowerCase().includes(needle));
    return TEMPLATES.filter(
      (template) =>
        (!isFiltered || template.category === activeCategory) &&
        (!needle || template.title.toLowerCase().includes(needle))
    );
    // myList only changes with toastKind (demo) or the loaded templates (live)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, isFiltered, searchText, mine, toastKind, liveMine]);

  const selectCategory = (pill) => {
    log('branch', { category: pill });
    const next = new URLSearchParams(searchParams);
    next.delete('mine');
    next.delete('view');
    next.delete('menu');
    if (pill === CATEGORY_PILLS[0]) next.delete('category');
    else next.set('category', pill.toLowerCase());
    setSearchParams(next);
  };

  return (
    <DashboardShell renderSidebar={renderWorkspaceSidebar}>
      <div className="flex w-full flex-col gap-[28px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] max-md:gap-[12px] max-md:py-[12px]">
        {/* Header block — Figma 7249:75079, gap 16 */}
        <div className="flex flex-col gap-[16px] max-md:gap-[8px]">
          <RecruiterPageHeading
            titleStyle="sans-accent"
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
            chips={[
              { id: CATEGORY_PILLS[0], label: CATEGORY_PILLS[0] },
              {
                id: 'mine',
                label: toastKind === 'copied' ? 'My templates ·' : 'My templates',
                count: String(myList.length),
              },
              {
                id: 'screening',
                label: SCREENING_PILL_LABEL,
                count: String(SCREENING_CRITERIA.length),
              },
              ...CATEGORY_PILLS.slice(1).map((pill) => ({ id: pill, label: pill })),
            ]}
            activeChipId={screeningView ? 'screening' : mine ? 'mine' : activeCategory}
            onChipSelect={(id) =>
              id === 'mine'
                ? patch({ mine: '1', view: null, category: null })
                : id === 'screening'
                  ? patch({ view: 'screening', mine: null, category: null })
                  : selectCategory(id)
            }
            onSearch={setSearchText}
            searchLabel={SEARCH_PLACEHOLDER}
            actionLabel={CREATE_CUSTOM_LABEL}
            onAction={() => navigate('/recruiter/job-templates/new')}
          />

          {/* Filtered: summary line (Figma 7249:75558, 14/20 #959592, gap 20 to the grid) */}
          <div className="flex flex-col gap-[20px] max-md:gap-[8px]">
            {isFiltered && (
              <p
                data-testid="job-templates-filter-summary"
                className="font-sans text-[14px] leading-5 tracking-[0.2px] text-[#959592]"
              >
                {FILTERED_SUMMARY.showing} {visibleTemplates.length}{' '}
                {visibleTemplates.length === 1
                  ? FILTERED_SUMMARY.singular
                  : FILTERED_SUMMARY.plural}{' '}
                {FILTERED_SUMMARY.inWord}{' '}
                <span className="font-medium text-brand-green">{activeCategory}</span>
              </p>
            )}

            {screeningView ? (
              <div className="grid grid-cols-1 gap-[22.67px] max-md:gap-[10px] sm:grid-cols-2 xl:grid-cols-3">
                {SCREENING_CRITERIA.map((item) => (
                  <ScreeningCard
                    key={item.id}
                    item={item}
                    onLoad={() => navigate('/recruiter/job-screening')}
                  />
                ))}
              </div>
            ) : null}
            {/* Grid — Figma 7249:75140: 4 columns of 315.25, 22.67 gutter */}
            <div
              style={screeningView ? { display: 'none' } : undefined}
              className="grid grid-cols-1 gap-[22.67px] max-md:gap-[10px] sm:grid-cols-2 xl:grid-cols-4"
            >
              {visibleTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={(id) =>
                    template.live
                      ? startFromTemplate(id)
                      : patch({ modal: 'details', template: id, menu: null })
                  }
                  menu={
                    mine && menuId === template.id ? (
                      <div
                        role="menu"
                        className="absolute top-[150px] left-[150px] z-20 flex w-[220px] flex-col rounded-[12px] border border-solid border-[#e5e5e5] bg-white py-[6px] shadow-[0_8px_24px_rgba(15,15,10,0.14)]"
                      >
                        {TEMPLATE_MENU.map((row) => (
                          <button
                            key={row.id}
                            type="button"
                            role="menuitem"
                            onClick={() =>
                              row.id === 'use'
                                ? startFromTemplate(template.id)
                                : patch({ menu: null })
                            }
                            className={`flex cursor-pointer flex-col border-0 bg-transparent px-[14px] py-[8px] text-left font-sans text-[14px] leading-[20px] hover:bg-[#f6f6f6] ${row.destructive ? 'text-[#c0392b]' : 'text-[#111]'}`}
                          >
                            {row.label}
                            {row.hint ? (
                              <span className="text-[12px] leading-[16px] text-[#575755]">
                                {row.hint}
                              </span>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    ) : null
                  }
                />
              ))}

              {/* Blank tile — Figma 7249:75230: 2px #d6d1c2 dashed [6,4], r14,
                VERTICAL gap 11, pad 44/23, centred, with a 64x64 #f0eee8
                circle holding an 18.67px #9a988f glyph. */}
              <button
                type="button"
                onClick={() => navigate('/recruiter/job-templates/new')}
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
                  <TemplatePlusIcon className="size-[19px] text-[#9a988f]" />
                </span>
                {/* Figma 7249:75235: the heading box is 58 tall (30 text + empty space below). */}
                <span className="relative flex h-[58px] max-sm:h-auto items-start font-heading text-[25px] font-semibold leading-[30px] tracking-[-0.5px] text-[#1c2a21] max-sm:text-[16px] max-sm:leading-6">
                  {BLANK_TEMPLATE.title}
                </span>
                <span className="relative px-[18px] pt-[4px] max-sm:pt-0 font-sans text-[14px] max-sm:text-[13px] leading-[21.6px] max-sm:leading-5 text-content-helper">
                  {BLANK_TEMPLATE.description}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {modal === 'details' && (
        <TemplateDetailsDialog
          onClose={() => patch({ modal: null, template: null })}
          onUse={() => startFromTemplate(searchParams.get('template') || 'product-designer')}
          onPreview={() => navigate('/recruiter/job-templates/product-designer/preview')}
        />
      )}
      {toast && (
        <BannerToast
          key={toastKind}
          tone={toast.tone}
          title={toast.title}
          message={toast.message}
          actionLabel={toast.actionLabel}
          duration={0}
          onAction={() =>
            startFromTemplate(
              isLive ? myList[0]?.id || '' : mine ? myList[0].id : 'product-designer'
            )
          }
          onClose={() => patch({ toast: null })}
        />
      )}
    </DashboardShell>
  );
};

export default JobTemplatesSection;
