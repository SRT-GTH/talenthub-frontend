import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import { renderWorkspaceSidebar } from '../recruiterDashboard/renderWorkspaceSidebar.jsx';
import useScopedRoundedFont from '../../../hooks/useScopedRoundedFont.js';
import RecruiterPageHeading from '../recruiterShared/RecruiterPageHeading.jsx';
import RecruiterJobTabs from '../recruiterShared/RecruiterJobTabs.jsx';
import {
  CriteriaExperienceIcon,
  CriteriaSkillsIcon,
  CriteriaEducationIcon,
  AssessmentScoreIcon,
  LocationMatchIcon,
  RegionHubIcon,
  RatingStarIcon,
  CriteriaChevronIcon,
  ApplyingToArrowheadIcon,
  CriteriaToggle,
} from './jobScreeningIcons.jsx';
import { classNames } from '../../../utils/classNames.js';
import ClampText from '../../ui/ClampText.jsx';
import BannerToast from '../../ui/BannerToast.jsx';
import Chip from '../../ui/Chip.jsx';
import { debug } from '../../../utils/debug.js';
import useScreeningFlowParams from './useScreeningFlowParams.js';
import AdjustCriteriaDrawer from './AdjustCriteriaDrawer.jsx';
import ScreeningResults from './ScreeningResults.jsx';
import { EducationLevelMenu, SavedCriteriaMenu, SkillSearchPopover } from './ScreeningMenus.jsx';
import { MoveToPipelineDialog, ProcessingRunner, SaveCriteriaDialog } from './ScreeningDialogs.jsx';
import { flowIcons } from './screeningFlowIcons.js';
import {
  CUSTOM_SKILL_DROP,
  EDUCATION_LEVELS,
  FLOW_CRITERIA,
  FLOW_JOBS,
  NONE_STATE,
  SAVED_CRITERIA,
  SAVED_TOAST,
  SAVE_DIALOG,
  SKILL_CATALOG,
  readAdjustment,
  savedChip,
} from './screeningFlowData.js';
import {
  PAGE_HEADING,
  PAGE_SUBHEADING,
  APPLYING_TO,
  CORE_REQUIREMENTS,
  TALENT_FUNNEL,
  PERFORMANCE_CONTEXT,
  MARKET_INSIGHTS,
} from './jobScreeningData.js';

const log = debug('JobScreeningSection');

/*
 * JobScreeningSection — the automated screening-criteria builder.
 * Source: Figma 7249:78066, canvas 7249:78213.
 *
 * Layout, from a full-depth walk:
 *   Frame 41229                VERTICAL gap 32, pb 24
 *   ├ Applying to              431 wide select, r10, 1px #cccccc, 2.5px shelf
 *   └ Related Insights         VERTICAL gap 18
 *     ├ CORE REQUIREMENTS      16px #387440 label + AUTOMATED chip
 *     │                        (white, 1.21px #e8e8e4, r6)
 *     ├ row                    HORIZONTAL gap 32 — 862 criteria card +
 *     │                        435 funnel card (862 + 32 + 435 = 1329)
 *     └ Performance & Context  607 wide, two 300px cards, gap 10
 *   Market insights            three cards, 276 / 257 / 285, r12, pad 24/23/24
 *
 * The funnel card is #f3f8f4 behind a 1px #00522b stroke at OPACITY 0.10 —
 * near-invisible, not the hard outline it first shipped with. Same for the
 * "+ Add Skill" button; "Save as Template" is #111111 at 0.30. Each criteria row ends in a 44x24 toggle, and the
 * Assessment / Location cards carry a smaller 39.6x21.6 one in their header.
 */
const CRITERIA_ICONS = {
  experience: CriteriaExperienceIcon,
  skills: CriteriaSkillsIcon,
  education: CriteriaEducationIcon,
};
const CRITERIA_ICON_SIZES = {
  experience: 'h-[16px] w-[20px]',
  skills: 'size-[20px]',
  education: 'h-[18px] w-[22px]',
};
const CONTEXT_ICONS = { gauge: AssessmentScoreIcon, location: LocationMatchIcon };

/*
 * URL state (route /recruiter/job-screening):
 *   (none)                                        7249:78066  Screening Criteria
 *   ?dropdown=experience                          the Minimum Experience value dropdown open
 *   ?dropdown=experience&dropdownItem=2-5         7249:78533  Dropdown Menu Item Hover (pins the
 *                                                 #f6f6f6 hover fill on that row; real :hover also works)
 * dropdownItem values: 0-2 | 2-5 | 5-10 | 10-plus. Opening/choosing writes the same keys.
 *
 * The screening FLOW of "Recruiter - Job Postings" (Figma 10103:59491, frames JS-01 … JS-14) is the same route with these extra keys
 * (documented in wiki/recruiter-job-screening-flow.md). Without `job` the page is exactly the two frames above.
 *   job            senior-ux-designer | product-designer   switches the page to the flow's mock job (128 applicants / 46 qualified, or a new posting with none)
 *   skillSearch    <text> (may be empty)                    JS-01  the add-skill popover is open with that search text
 *   skills         prototyping,accessibility,custom:Foo     JS-02  skills added to the three the job lists (qualified count drops, "−8 · updated just now")
 *   education      on                                       JS-03  Education level switch on
 *   educationLevel any | diploma | bachelors | masters      the level (default bachelors); partners=on adds "Only from partner institutions"
 *   dropdown       experience | education-level | saved-criteria   which menu is open (JS-03, JS-14)
 *   run            processing  (+ checked=0..128)           JS-04  the screening dialog; without `checked` it counts up by itself and lands on results=meet
 *   results        meet | close | dont | none | waiting     JS-05 / JS-06 / (Don’t meet) / JS-08 / JS-09  the results screen (waiting = a new posting, job=product-designer); q=<text> filters the table
 *   drawer         adjust                                   JS-07  the adjust-criteria drawer; draft keys adjExperience (3plus|4plus|10plus), adjEducation (any|diploma|masters),
 *                                                           adjAssessment (60|80), adjLocation (off), adjOff (experience,skills,assessment) — counts only change after "Apply changes"
 *   modal          move | save-template                     JS-10 (notify=off, unq=reject) / JS-12 (tplName, tplFor, tplShare=off, tplDefault=on)
 *   saved          <name>                                   JS-13  the "Saved as “…”" chip beside AUTOMATED;  toast=saved shows the toast
 * "Move N to Pipeline" → /recruiter/application-pipeline?handoff=N (JS-11).
 */

const JobScreeningSection = () => {
  useScopedRoundedFont('data-recruiter-ui'); // Figma draws the recruiter pages in SF Pro Rounded
  const { searchParams, patch } = useScreeningFlowParams();
  const navigate = useNavigate();
  const [selectedValues, setSelectedValues] = useState({});
  const [enabledMap, setEnabledMap] = useState(() => {
    const initial = {};
    CORE_REQUIREMENTS.items.forEach((item) => {
      initial[item.id] = item.enabled;
    });
    PERFORMANCE_CONTEXT.forEach((card) => {
      initial[card.id] = card.enabled;
    });
    return initial;
  });
  const rootRef = useRef(null);

  const openSelectId = searchParams.get('dropdown');
  const forcedHoverOptionId = searchParams.get('dropdownItem');
  const setOpenSelectId = (next) => {
    const id = typeof next === 'function' ? next(openSelectId) : next;
    patch({ dropdown: id || null, dropdownItem: null });
  };

  // ── the screening flow (every state is a URL key, see the header comment) ──
  const flowJob = FLOW_JOBS[searchParams.get('job')] ?? null;
  const results = searchParams.get('results');
  const run = searchParams.get('run');
  const modal = searchParams.get('modal');
  const drawerOpen = searchParams.get('drawer') === 'adjust';
  const skillSearch = searchParams.get('skillSearch');
  const addedSkills = (searchParams.get('skills') ?? '').split(',').filter(Boolean);
  const educationOn = searchParams.get('education') === 'on';
  const educationLevel = searchParams.get('educationLevel') ?? 'bachelors';
  const partners = searchParams.get('partners') === 'on';
  const savedName = searchParams.get('saved');
  const adjustment = readAdjustment(searchParams);
  const skillLabel = (id) =>
    SKILL_CATALOG.find((skill) => skill.id === id)?.label ?? id.replace(/^custom:/, '');
  const skillDrop = (id) =>
    SKILL_CATALOG.find((skill) => skill.id === id)?.drop ?? CUSTOM_SKILL_DROP;
  const skillsDrop = addedSkills.reduce((sum, id) => sum + skillDrop(id), 0);

  const items = useMemo(() => {
    if (!flowJob) return CORE_REQUIREMENTS.items;
    return CORE_REQUIREMENTS.items.map((item) => {
      if (item.id === 'experience') {
        return {
          ...item,
          value: FLOW_CRITERIA.experience.value,
          description: FLOW_CRITERIA.experience.description,
        };
      }
      if (item.id === 'skills') {
        return {
          ...item,
          tags: [...FLOW_CRITERIA.skills.base, ...addedSkills.map(skillLabel)],
          description: FLOW_CRITERIA.skills.description,
        };
      }
      return item;
    });
    // addedSkills is derived from the URL string below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowJob, searchParams.get('skills')]);

  const isEnabled = (id) => (flowJob && id === 'education' ? educationOn : enabledMap[id]);
  const toggleEnabled = (id) => {
    log('branch', { toggle: id, to: !isEnabled(id) });
    if (flowJob && id === 'education') {
      patch({ education: educationOn ? null : 'on', dropdown: null });
      return;
    }
    setEnabledMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const enterFlow = (changes) => patch({ job: flowJob?.id ?? 'senior-ux-designer', ...changes });
  const addSkill = ({ id, label }) => {
    const safeId = id.startsWith('custom:') ? `custom:${label.replace(/[,]/g, ' ')}` : id;
    log('branch', { action: 'add-skill', id: safeId });
    patch({ skills: [...addedSkills, safeId].join(','), skillSearch: null });
  };
  const adjKeys = [
    'adjExperience',
    'adjEducation',
    'adjAssessment',
    'adjLocation',
    'adjOff',
  ].reduce((acc, key) => ({ ...acc, [key]: null }), {});

  // The results screen: counts follow the applied adjustment (the drawer's draft changes nothing until "Apply changes").
  const resultsJob = flowJob ?? FLOW_JOBS['senior-ux-designer'];
  const applied = drawerOpen ? { close: 0, dont: 0, delta: 0 } : adjustment;
  const counts =
    results === 'none'
      ? {
          screened: resultsJob.screened,
          meet: 0,
          close: NONE_STATE.counts.close,
          dont: NONE_STATE.counts.dont,
        }
      : {
          screened: resultsJob.screened,
          meet: resultsJob.qualified + applied.delta,
          close: resultsJob.close - applied.close,
          dont: resultsJob.dont - applied.dont,
        };
  const resultsTab = ['meet', 'close', 'dont'].includes(results) ? results : 'meet';
  const resultsMode = results === 'none' ? 'none' : results === 'waiting' ? 'waiting' : 'list';
  const goToPipeline = () => {
    log('branch', { action: 'move-to-pipeline', count: counts.meet });
    navigate(`/recruiter/application-pipeline?handoff=${counts.meet}`);
  };
  const closeDrawer = useCallback(() => patch({ drawer: null, ...adjKeys }), [patch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close an open menu on any click outside the page body.
  useEffect(() => {
    if (!openSelectId || openSelectId !== 'experience') return undefined;
    const onDocClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpenSelectId(null);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
    // setOpenSelectId only closes over the URL, which changes with openSelectId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSelectId]);

  useEffect(() => {
    log('mount', {
      route: '/recruiter/job-screening',
      criteriaCount: CORE_REQUIREMENTS.items.length,
      funnelPercent: Number(TALENT_FUNNEL.progressPercent.toFixed(2)),
    });
  }, []);

  return (
    <DashboardShell renderSidebar={renderWorkspaceSidebar}>
      {results ? (
        <ScreeningResults
          job={resultsJob}
          counts={counts}
          tab={resultsTab}
          mode={resultsMode}
          query={searchParams.get('q') ?? ''}
          onTab={(tab) => patch({ results: tab, q: null })}
          onQuery={(value) => patch({ q: value || null }, { replace: true })}
          onBack={() =>
            resultsMode === 'waiting'
              ? navigate('/recruiter/job-postings')
              : patch({ results: null, q: null, drawer: null, modal: null, ...adjKeys })
          }
          onAdjust={() => patch({ drawer: 'adjust' })}
          onMove={() => patch({ modal: 'move' })}
          onApplySuggestion={(apply) => patch({ results: 'meet', ...apply })}
          onReviewClose={() => patch({ results: 'close' })}
          onInvite={() => navigate('/recruiter/talent-search')}
        />
      ) : (
        <div
          ref={rootRef}
          className="flex w-full flex-col gap-[28px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] max-md:gap-[12px] max-md:py-[12px]"
        >
          <div className="flex flex-col gap-[16px] max-md:gap-[8px]">
            <RecruiterPageHeading
              lead={PAGE_HEADING.lead}
              accent={PAGE_HEADING.accent}
              subtitle={PAGE_SUBHEADING}
              titleStyle="sans-accent"
            />
            <RecruiterJobTabs />
          </div>

          <div className="flex flex-col gap-[32px] pb-[48px] max-md:gap-[16px] max-md:pb-[8px]">
            {/* Applying to — Figma 7249:78235, 431 wide, gap 8 */}
            <label className="flex w-full max-w-[431px] flex-col gap-[8px]">
              <span className="font-sans text-[14px] font-medium leading-6 tracking-[0.2px] text-black">
                {APPLYING_TO.label}
                <span className="font-display text-[14px] font-semibold not-italic text-[#2e8b57]">
                  {APPLYING_TO.required}
                </span>
              </span>
              <button
                type="button"
                onClick={() => log('branch', { action: 'open-applying-to', wired: false })}
                className="flex h-[51px] max-lg:min-h-[44px] max-lg:h-auto items-center justify-between gap-[8px] rounded-[10px] border border-[#cccccc] bg-white px-[16px] text-left font-sans text-[14px] font-medium leading-5 tracking-[0.2px] text-[#595959] shadow-[0_2.5px_0_0_#bfbfbf] max-lg:text-[16px] max-lg:shadow-none"
              >
                <span className="min-w-0 truncate">{APPLYING_TO.value}</span>
                <ApplyingToArrowheadIcon className="size-[20px] shrink-0 text-brand-green" />
              </button>
            </label>

            <div className="flex flex-col gap-[18px] max-md:gap-[10px]">
              {/* Section label — Figma 7249:78251, gap 16 */}
              <div className="flex items-center gap-[16px]">
                <span className="font-sans text-[16px] max-lg:text-[13px] font-medium leading-5 tracking-[0.2px] text-brand-green">
                  {CORE_REQUIREMENTS.sectionLabel}
                </span>
                <span className="inline-flex items-center rounded-[6px] border-[1.21px] border-border-pill bg-white px-[12px] py-[4px] font-sans text-[14px] max-lg:text-[13px] font-medium leading-5 tracking-[0.2px] text-content-helper">
                  {CORE_REQUIREMENTS.badge}
                </span>
                {flowJob ? (
                  <span className="relative inline-flex">
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={openSelectId === 'saved-criteria'}
                      onClick={() =>
                        setOpenSelectId((prev) =>
                          prev === 'saved-criteria' ? null : 'saved-criteria'
                        )
                      }
                      className="inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                    >
                      <img
                        src={flowIcons.loadSavedLinkFilter}
                        alt=""
                        aria-hidden="true"
                        className="size-[16px]"
                      />
                      {SAVED_CRITERIA.trigger}
                    </button>
                    {openSelectId === 'saved-criteria' ? (
                      <SavedCriteriaMenu
                        className="absolute top-[32px] left-0 z-30 w-[340px] max-w-[calc(100vw-32px)]"
                        onClose={() => setOpenSelectId(null)}
                        onPick={(item) => patch({ dropdown: null, saved: item.label })}
                        onManage={() => navigate('/recruiter/job-templates?view=screening')}
                      />
                    ) : null}
                  </span>
                ) : null}
                {savedName ? (
                  <Chip tone="success" icon={flowIcons.applicantSkillsCheck}>
                    {savedChip(savedName)}
                  </Chip>
                ) : null}
              </div>

              {/* Criteria + funnel — Figma 7249:78256, gap 32 */}
              <div className="flex flex-col gap-[32px] max-md:gap-[12px] xl:flex-row">
                <div className="flex min-w-0 flex-1 flex-col gap-[24px] max-sm:gap-0 rounded-[14px] border border-border-card bg-white px-[22px] py-[20px] max-sm:px-[12px] max-sm:py-[4px]">
                  {items.map((item) => {
                    const Icon = CRITERIA_ICONS[item.icon];
                    return (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-4 rounded-[12px] px-[12px] py-[16px] max-sm:px-[4px] max-sm:py-[10px]"
                      >
                        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
                          <div className="flex items-center gap-[8px]">
                            <Icon
                              className={classNames(
                                CRITERIA_ICON_SIZES[item.icon],
                                'shrink-0 text-brand-green'
                              )}
                            />
                            <span className="font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-black">
                              {item.title}
                            </span>
                          </div>
                          <ClampText
                            lines={2}
                            className="font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-[#999999]"
                          >
                            {item.description}
                          </ClampText>

                          <div className="flex flex-wrap items-center gap-[16px] pt-[8px]">
                            {item.value && (
                              <span className="relative inline-block">
                                <button
                                  type="button"
                                  aria-haspopup={item.options ? 'listbox' : undefined}
                                  aria-expanded={
                                    item.options ? openSelectId === item.id : undefined
                                  }
                                  onClick={() => {
                                    if (!item.options) {
                                      log('branch', { select: item.id, options: 'none-in-figma' });
                                      return;
                                    }
                                    setOpenSelectId((prev) => (prev === item.id ? null : item.id));
                                  }}
                                  className="inline-flex h-[38px] max-lg:min-h-[32px] max-lg:h-auto items-center gap-[4px] rounded-[8px] border border-[#e9e9e9] px-[12px] font-sans text-[16px] max-lg:text-[13px] leading-[22.4px] text-[#595959] transition-colors hover:bg-neutral"
                                >
                                  {selectedValues[item.id] ?? item.value}
                                  <CriteriaChevronIcon className="size-[16px] text-[#595959]" />
                                </button>

                                {item.options && openSelectId === item.id && (
                                  /* Figma 7249:78785 */
                                  <span className="absolute left-0 top-[42px] z-20 block w-[115px] max-lg:w-[160px] overflow-hidden rounded-[10px] border-[0.7px] border-[#e5e5e5] bg-white py-[4px] shadow-[0_1.5px_6.1px_0_rgba(64,64,64,0.25)]">
                                    {item.options.map((option, index) => (
                                      <span key={option.id} className="block">
                                        {index > 0 && (
                                          <span className="block h-[0.6px] w-full bg-[#e5e5e5]" />
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            log('branch', { select: item.id, chose: option.id });
                                            setSelectedValues((prev) => ({
                                              ...prev,
                                              [item.id]: option.label,
                                            }));
                                            setOpenSelectId(null);
                                          }}
                                          className={classNames(
                                            'flex h-[41px] max-lg:h-[40px] w-full items-center justify-center px-[16px] text-center font-sans text-[14px] leading-[24.31px] text-[#737373] transition-colors',
                                            // Figma highlights one row at #f6f6f6 to show the
                                            // hover state; the same fill marks the ACTIVE row,
                                            // i.e. whichever option is currently selected.
                                            'hover:bg-[#f6f6f6] active:bg-[#ededed]',
                                            forcedHoverOptionId === option.id && 'bg-[#f6f6f6]',
                                            (selectedValues[item.id] ?? item.value) ===
                                              option.label &&
                                              !forcedHoverOptionId &&
                                              'bg-[#f6f6f6]'
                                          )}
                                        >
                                          {option.label}
                                        </button>
                                      </span>
                                    ))}
                                  </span>
                                )}
                              </span>
                            )}
                            {item.tags &&
                              item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex h-[34px] items-center rounded-[8px] bg-[#ebf1ec] px-[12px] font-sans text-[15px] leading-[18px] text-[#2a5730]"
                                >
                                  {tag}
                                </span>
                              ))}
                            {item.addLabel && (
                              <span className="relative inline-block">
                                <button
                                  type="button"
                                  aria-haspopup="dialog"
                                  aria-expanded={skillSearch !== null}
                                  onClick={() => {
                                    if (!flowJob) {
                                      enterFlow({ skillSearch: '' });
                                      return;
                                    }
                                    patch({ skillSearch: skillSearch === null ? '' : null });
                                  }}
                                  className="inline-flex h-[34px] max-lg:min-h-[32px] max-lg:h-auto items-center rounded-[14px] border-2 border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[15px] font-bold leading-6 tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_0_rgba(17,17,17,0.25)] transition-all active:translate-y-[4px] active:shadow-none max-lg:shadow-none"
                                >
                                  {item.addLabel}
                                </button>
                                {flowJob && skillSearch !== null ? (
                                  <SkillSearchPopover
                                    className="absolute top-[calc(100%+9px)] left-0 z-30 w-[300px] max-w-[calc(100vw-32px)]"
                                    query={skillSearch}
                                    added={addedSkills}
                                    onQuery={(value) =>
                                      patch({ skillSearch: value }, { replace: true })
                                    }
                                    onAdd={addSkill}
                                    onClose={() => patch({ skillSearch: null })}
                                  />
                                ) : null}
                              </span>
                            )}
                            {item.staticValue && flowJob && educationOn ? (
                              <span className="relative inline-block">
                                <button
                                  type="button"
                                  aria-haspopup="listbox"
                                  aria-expanded={openSelectId === 'education-level'}
                                  onClick={() =>
                                    setOpenSelectId((prev) =>
                                      prev === 'education-level' ? null : 'education-level'
                                    )
                                  }
                                  className="inline-flex h-[38px] cursor-pointer items-center rounded-[8px] border border-[#e9e9e9] bg-transparent px-[12px] font-sans text-[16px] leading-[22px] text-[#595959]"
                                >
                                  {
                                    EDUCATION_LEVELS.find((level) => level.id === educationLevel)
                                      ?.label
                                  }
                                </button>
                                {openSelectId === 'education-level' ? (
                                  <EducationLevelMenu
                                    className="absolute bottom-[calc(100%+9px)] left-0 z-30 w-[280px] max-w-[calc(100vw-32px)]"
                                    value={educationLevel}
                                    partners={partners}
                                    onClose={() => setOpenSelectId(null)}
                                    onPick={(id) =>
                                      patch({
                                        educationLevel: id === 'bachelors' ? null : id,
                                        dropdown: null,
                                      })
                                    }
                                    onTogglePartners={() =>
                                      patch({ partners: partners ? null : 'on' })
                                    }
                                  />
                                ) : null}
                              </span>
                            ) : item.staticValue ? (
                              <span className="inline-flex h-[38px] items-center rounded-[8px] border border-[#e9e9e9] px-[12px] font-sans text-[16px] leading-[22px] text-[#595959]">
                                {item.staticValue}
                              </span>
                            ) : null}
                            {item.meta && (
                              <span className="font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-content-helper">
                                {item.meta}
                              </span>
                            )}
                          </div>
                        </div>

                        <CriteriaToggle
                          size="lg"
                          checked={isEnabled(item.id)}
                          onToggle={() => toggleEnabled(item.id)}
                          label={item.title}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Funnel — Figma 7249:78318: 435 wide, #f3f8f4 on #00522b */}
                <div className="flex w-full shrink-0 flex-col justify-between gap-[18px] rounded-[14px] border border-[#00522b]/10 bg-[#f3f8f4] p-[16px] xl:w-[435px]">
                  {/* Figma 7249:78802 — counterAxisAlignItems CENTER, and every
                    text node in this card is textAlignHorizontal CENTER. */}
                  <div className="flex flex-col items-center gap-[16px]">
                    <h3 className="text-center font-sans text-[18px] max-lg:text-[16px] font-medium leading-6 tracking-[0.2px] text-black">
                      {TALENT_FUNNEL.title}
                    </h3>

                    <div className="flex w-full flex-col gap-[16px]">
                      {/* Figma 7249:78805 — counterAxisAlignItems MAX (bottom) */}
                      <div className="flex items-end justify-between gap-3">
                        <span className="font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-[#595959]">
                          {TALENT_FUNNEL.stats[0].label}
                        </span>
                        <span className="font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-black">
                          {flowJob ? FLOW_CRITERIA.funnel.total : TALENT_FUNNEL.stats[0].value}
                        </span>
                      </div>

                      <span className="h-[7px] w-full overflow-hidden rounded-full bg-[#e6e6e6]">
                        <span
                          className="block h-full rounded-full bg-brand-green"
                          style={{ width: `${TALENT_FUNNEL.progressPercent}%` }}
                        />
                      </span>

                      <div className="flex flex-col">
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-[8px]">
                            <span className="size-[12px] rounded-full bg-brand-green" />
                            <span className="font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-[#595959]">
                              {TALENT_FUNNEL.stats[1].label}
                            </span>
                          </span>
                          <span className="font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-brand-green">
                            {flowJob
                              ? FLOW_CRITERIA.funnel.qualified - skillsDrop
                              : TALENT_FUNNEL.stats[1].value}
                          </span>
                        </div>
                        {flowJob && skillsDrop > 0 ? (
                          <span
                            aria-live="polite"
                            className="whitespace-pre pl-[20px] font-sans text-[12px] leading-[14px] font-medium text-[#c0392b]"
                          >
                            {`−${skillsDrop} · updated just now`}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Figma 7249:78819 — 1px TOP rule only (individualStrokeWeights
                    { top: 1, right: 0, bottom: 0, left: 0 }), pad-top 23,
                    gap 12, counterAxisAlignItems CENTER. */}
                  <div className="flex flex-col items-center gap-[12px] border-t border-border-card pt-[23px]">
                    <span className="w-full text-center font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-black">
                      {TALENT_FUNNEL.qualityLabel}
                    </span>
                    <span className="flex items-center gap-[4px]">
                      {Array.from({ length: TALENT_FUNNEL.qualityStarTotal }).map((_, index) => (
                        <RatingStarIcon
                          key={index}
                          className={classNames(
                            'h-[19px] w-[20px]',
                            index < TALENT_FUNNEL.qualityStars ? 'text-[#eab308]' : 'text-[#d6d1c2]'
                          )}
                        />
                      ))}
                      <span className="pl-[8px] font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-black">
                        {TALENT_FUNNEL.qualityValue}
                      </span>
                    </span>
                    {/* whitespace-pre-line keeps Figma's hard line break */}
                    <p className="w-full whitespace-pre-line pt-[4px] text-center font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-[#999999]">
                      {TALENT_FUNNEL.qualityNote}
                    </p>
                  </div>

                  <div className="flex flex-col gap-[12px] pt-[16px]">
                    <button
                      type="button"
                      onClick={() =>
                        enterFlow({
                          run: 'processing',
                          dropdown: null,
                          skillSearch: null,
                          checked: null,
                        })
                      }
                      className="inline-flex h-[44px] max-lg:h-[40px] items-center justify-center rounded-[10px] border-2 border-brand-green-dark max-lg:border max-lg:shadow-none bg-brand-green px-[18px] font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-white shadow-[0_4px_0_0_#224626] transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4px] active:shadow-none"
                    >
                      {TALENT_FUNNEL.primaryAction}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        enterFlow({ modal: 'save-template', dropdown: null, skillSearch: null })
                      }
                      className="inline-flex h-[44px] max-lg:h-[40px] items-center justify-center rounded-[14px] border-2 border-[#1c2a21]/30 max-lg:rounded-[10px] max-lg:border max-lg:shadow-none bg-white px-[18px] font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_0_rgba(17,17,17,0.25)] transition-all duration-300 ease-in active:translate-y-[4px] active:shadow-none"
                    >
                      {TALENT_FUNNEL.secondaryAction}
                    </button>
                  </div>
                </div>
              </div>

              {/* Performance & context — Figma 7249:78359: 607 wide, gap 10 */}
              <div className="flex w-full max-w-[607px] flex-col gap-[10px] sm:flex-row">
                {PERFORMANCE_CONTEXT.map((card) => {
                  const Icon = CONTEXT_ICONS[card.icon];
                  return (
                    <div
                      key={card.id}
                      className="flex w-full flex-col gap-[4px] rounded-[14px] border border-border-card bg-white px-[22px] pb-[38px] pt-[22px] max-sm:p-[14px] sm:w-[300px]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Icon className="size-[18px] shrink-0 text-brand-green" />
                        <CriteriaToggle
                          size="sm"
                          checked={isEnabled(card.id)}
                          onToggle={() => toggleEnabled(card.id)}
                          label={card.title}
                        />
                      </div>
                      <h4 className="pt-[12px] font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-black">
                        {card.title}
                      </h4>
                      <ClampText
                        lines={2}
                        className="font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-[#999999]"
                      >
                        {card.description}
                      </ClampText>

                      <div className="flex flex-col gap-[8px] pt-[16px]">
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={classNames(
                              'inline-flex items-center rounded-full px-[8px] py-[4px] font-sans text-[16px] max-lg:text-[13px] leading-6 max-lg:leading-5 tracking-[0.2px]',
                              card.badge ? 'bg-[#f3f8f4] text-brand-green' : 'text-brand-green'
                            )}
                          >
                            {!card.badge && (
                              <RegionHubIcon className="mr-[8px] size-[12px] shrink-0" />
                            )}
                            {card.badge ?? card.value}
                          </span>
                          {card.badge && (
                            <span className="font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-brand-green">
                              {card.value}
                            </span>
                          )}
                        </div>
                        {card.progressPercent != null && (
                          <span className="h-[8px] w-full overflow-hidden rounded-[4px] bg-[#f0eee8]">
                            <span
                              className="block h-full rounded-[4px] bg-brand-green"
                              style={{ width: `${card.progressPercent}%` }}
                            />
                          </span>
                        )}
                        {card.meta && (
                          <span className="font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-[#999999]">
                            {card.meta}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Market insights — Figma 7249:78400, gap 18 */}
            <div className="flex flex-col gap-[18px]">
              <span className="font-sans text-[16px] max-lg:text-[13px] font-medium leading-5 tracking-[0.2px] text-brand-green">
                {MARKET_INSIGHTS.sectionLabel}
              </span>
              <div className="flex flex-col gap-[18px] max-md:gap-[10px] md:flex-row">
                {MARKET_INSIGHTS.cards.map((card) => (
                  <div
                    key={card.id}
                    className="flex min-w-0 flex-1 flex-col gap-[8px] rounded-[12px] border border-border-card bg-white px-[24px] pb-[24px] pt-[23px] max-sm:p-[14px]"
                  >
                    <h5 className="font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-[#999999]">
                      {card.title}
                    </h5>
                    <span className="font-heading text-[32px] font-semibold leading-[38px] text-[#1c2a21] max-lg:text-[17px] max-lg:leading-6">
                      {card.value}
                    </span>
                    <p className="font-sans text-[16px] max-lg:text-[14px] leading-6 max-lg:leading-5 tracking-[0.2px] text-[#999999]">
                      {card.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {run === 'processing' ? (
        <ProcessingRunner
          pinned={searchParams.get('checked') === null ? null : Number(searchParams.get('checked'))}
          onDone={() => patch({ run: null, checked: null, results: 'meet' }, { replace: true })}
        />
      ) : null}
      {drawerOpen && results ? (
        <AdjustCriteriaDrawer
          values={{
            experience: searchParams.get('adjExperience') ?? '5-10',
            education: searchParams.get('adjEducation') ?? 'bachelors',
            assessment: searchParams.get('adjAssessment') ?? '70',
            location: searchParams.get('adjLocation') !== 'off',
            off: (searchParams.get('adjOff') ?? '').split(',').filter(Boolean),
          }}
          current={resultsJob.qualified}
          adjustment={adjustment}
          onChange={(changes) => patch(changes)}
          onReset={() => patch(adjKeys)}
          onCancel={closeDrawer}
          onApply={() => patch({ drawer: null })}
        />
      ) : null}
      {modal === 'move' ? (
        <MoveToPipelineDialog
          count={counts.meet}
          unqualified={counts.screened - counts.meet}
          notify={searchParams.get('notify') !== 'off'}
          rejectOthers={searchParams.get('unq') === 'reject'}
          onChange={(changes) =>
            patch({
              ...('notify' in changes ? { notify: changes.notify ? null : 'off' } : {}),
              ...('rejectOthers' in changes ? { unq: changes.rejectOthers ? 'reject' : null } : {}),
            })
          }
          onCancel={() => patch({ modal: null, notify: null, unq: null })}
          onConfirm={goToPipeline}
        />
      ) : null}
      {modal === 'save-template' ? (
        <SaveCriteriaDialog
          name={searchParams.get('tplName') ?? SAVE_DIALOG.defaultName}
          suggestFor={searchParams.get('tplFor') ?? SAVE_DIALOG.suggestOptions[0]}
          share={searchParams.get('tplShare') !== 'off'}
          makeDefault={searchParams.get('tplDefault') === 'on'}
          onChange={(changes) =>
            patch(
              {
                ...('name' in changes ? { tplName: changes.name } : {}),
                ...('suggestFor' in changes ? { tplFor: changes.suggestFor } : {}),
                ...('share' in changes ? { tplShare: changes.share ? null : 'off' } : {}),
                ...('makeDefault' in changes
                  ? { tplDefault: changes.makeDefault ? 'on' : null }
                  : {}),
              },
              { replace: 'name' in changes }
            )
          }
          onCancel={() =>
            patch({ modal: null, tplName: null, tplFor: null, tplShare: null, tplDefault: null })
          }
          onConfirm={() =>
            patch({
              modal: null,
              tplFor: null,
              tplShare: null,
              tplDefault: null,
              tplName: null,
              saved: (searchParams.get('tplName') ?? SAVE_DIALOG.defaultName).trim(),
              toast: 'saved',
            })
          }
        />
      ) : null}
      {searchParams.get('toast') === 'saved' ? (
        <BannerToast
          tone="success"
          title={SAVED_TOAST.title}
          message={SAVED_TOAST.message}
          actionLabel={SAVED_TOAST.action}
          onAction={() => navigate('/recruiter/job-templates?view=screening')}
          onClose={() => patch({ toast: null })}
          duration={0}
          placement="fixed top-[22px] left-1/2 z-[70] w-max max-w-[calc(100vw-32px)] -translate-x-1/2 max-md:top-[72px]"
        />
      ) : null}
    </DashboardShell>
  );
};

export default JobScreeningSection;
