import { useEffect, useRef, useState } from 'react';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import RecruiterPageHeading from '../recruiterShared/RecruiterPageHeading.jsx';
import RecruiterJobTabs from '../recruiterShared/RecruiterJobTabs.jsx';
import {
  CriteriaExperienceIcon,
  CriteriaSkillsIcon,
  CriteriaEducationIcon,
  AssessmentGaugeIcon,
  LocationMatchIcon,
  RatingStarIcon,
  CriteriaChevronIcon,
  CriteriaToggle,
} from './jobScreeningIcons.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
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
const CONTEXT_ICONS = { gauge: AssessmentGaugeIcon, location: LocationMatchIcon };

const JobScreeningSection = () => {
  const [openSelectId, setOpenSelectId] = useState(null);
  const [selectedValues, setSelectedValues] = useState({});
  const rootRef = useRef(null);

  // Close an open menu on any click outside it.
  useEffect(() => {
    if (!openSelectId) return undefined;
    const onDocClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpenSelectId(null);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openSelectId]);

  useEffect(() => {
    log('mount', {
      route: '/recruiter/job-screening',
      criteriaCount: CORE_REQUIREMENTS.items.length,
      funnelPercent: Number(TALENT_FUNNEL.progressPercent.toFixed(2)),
    });
  }, []);

  return (
    <DashboardShell>
      <div
        ref={rootRef}
        className="flex w-full flex-col gap-[28px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)]"
      >
        <div className="flex flex-col gap-[16px]">
          <RecruiterPageHeading
            lead={PAGE_HEADING.lead}
            accent={PAGE_HEADING.accent}
            subtitle={PAGE_SUBHEADING}
          />
          <RecruiterJobTabs />
        </div>

        <div className="flex flex-col gap-[32px] pb-[48px]">
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
              className="flex h-[51px] items-center justify-between gap-[8px] rounded-[10px] border border-[#cccccc] bg-white px-[16px] text-left font-sans text-[14px] font-medium leading-5 tracking-[0.2px] text-[#595959] shadow-[0_2.5px_0_0_#bfbfbf]"
            >
              {APPLYING_TO.value}
              <CriteriaChevronIcon className="size-[20px] shrink-0 text-[#595959]" />
            </button>
          </label>

          <div className="flex flex-col gap-[18px]">
            {/* Section label — Figma 7249:78251, gap 16 */}
            <div className="flex items-center gap-[16px]">
              <span className="font-sans text-[16px] font-medium leading-5 tracking-[0.2px] text-brand-green">
                {CORE_REQUIREMENTS.sectionLabel}
              </span>
              <span className="inline-flex items-center rounded-[6px] border-[1.21px] border-border-pill bg-white px-[12px] py-[4px] font-sans text-[14px] font-medium leading-5 tracking-[0.2px] text-content-helper">
                {CORE_REQUIREMENTS.badge}
              </span>
            </div>

            {/* Criteria + funnel — Figma 7249:78256, gap 32 */}
            <div className="flex flex-col gap-[32px] xl:flex-row">
              <div className="flex min-w-0 flex-1 flex-col gap-[24px] rounded-[14px] border border-border-card bg-white px-[22px] py-[20px]">
                {CORE_REQUIREMENTS.items.map((item) => {
                  const Icon = CRITERIA_ICONS[item.icon];
                  return (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 rounded-[12px] px-[12px] py-[16px]"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
                        <div className="flex items-center gap-[8px]">
                          <Icon className="h-[16px] w-[19.5px] shrink-0 text-brand-green" />
                          <span className="font-sans text-[16px] leading-6 tracking-[0.2px] text-black">
                            {item.title}
                          </span>
                        </div>
                        <p className="font-sans text-[16px] leading-6 tracking-[0.2px] text-[#999999]">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-[16px] pt-[8px]">
                          {item.value && (
                            <span className="relative inline-block">
                              <button
                                type="button"
                                aria-haspopup={item.options ? 'listbox' : undefined}
                                aria-expanded={item.options ? openSelectId === item.id : undefined}
                                onClick={() => {
                                  if (!item.options) {
                                    log('branch', { select: item.id, options: 'none-in-figma' });
                                    return;
                                  }
                                  setOpenSelectId((prev) => (prev === item.id ? null : item.id));
                                }}
                                className="inline-flex h-[38px] items-center gap-[4px] rounded-[8px] border border-[#e9e9e9] px-[12px] font-sans text-[16px] leading-[22.4px] text-[#595959] transition-colors hover:bg-neutral"
                              >
                                {selectedValues[item.id] ?? item.value}
                                <CriteriaChevronIcon className="size-[16px] text-[#595959]" />
                              </button>

                              {item.options && openSelectId === item.id && (
                                /* Figma 7249:78785 */
                                <span className="absolute left-0 top-[42px] z-20 block w-[115px] overflow-hidden rounded-[10px] border-[0.7px] border-[#e5e5e5] bg-white py-[4px] shadow-[0_1.5px_6.1px_0_rgba(64,64,64,0.25)]">
                                  {item.options.map((option, index) => (
                                    <span key={option} className="block">
                                      {index > 0 && (
                                        <span className="block h-[0.6px] w-full bg-[#e5e5e5]" />
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          log('branch', { select: item.id, chose: option });
                                          setSelectedValues((prev) => ({
                                            ...prev,
                                            [item.id]: option,
                                          }));
                                          setOpenSelectId(null);
                                        }}
                                        className={classNames(
                                          'flex h-[41px] w-full items-center px-[16px] text-left font-sans text-[14px] leading-[24.31px] text-content-helper transition-colors',
                                          // Figma highlights one row at #f6f6f6 to show the
                                          // hover state; the same fill marks the ACTIVE row,
                                          // i.e. whichever option is currently selected.
                                          'hover:bg-[#f6f6f6] active:bg-[#ededed]',
                                          (selectedValues[item.id] ?? item.value) === option &&
                                            'bg-[#f6f6f6]'
                                        )}
                                      >
                                        {option}
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
                                className="inline-flex h-[34px] items-center rounded-[8px] bg-brand-green-light px-[12px] font-sans text-[16px] leading-6 text-black"
                              >
                                {tag}
                              </span>
                            ))}
                          {item.addLabel && (
                            <button
                              type="button"
                              onClick={() => log('branch', { action: 'add-skill', wired: false })}
                              className="inline-flex h-[34px] items-center rounded-[8px] border border-[#00522b]/10 px-[12px] font-sans text-[16px] leading-6 text-brand-green-dark transition-colors hover:bg-brand-green-light"
                            >
                              {item.addLabel}
                            </button>
                          )}
                          {item.meta && (
                            <span className="font-sans text-[16px] leading-6 tracking-[0.2px] text-content-helper">
                              {item.meta}
                            </span>
                          )}
                        </div>
                      </div>

                      <CriteriaToggle size="lg" />
                    </div>
                  );
                })}
              </div>

              {/* Funnel — Figma 7249:78318: 435 wide, #f3f8f4 on #00522b */}
              <div className="flex w-full shrink-0 flex-col justify-between gap-[18px] rounded-[14px] border border-[#00522b]/10 bg-[#f3f8f4] p-[16px] xl:w-[435px]">
                {/* Figma 7249:78802 — counterAxisAlignItems CENTER, and every
                    text node in this card is textAlignHorizontal CENTER. */}
                <div className="flex flex-col items-center gap-[16px]">
                  <h3 className="text-center font-sans text-[18px] font-medium leading-6 tracking-[0.2px] text-black">
                    {TALENT_FUNNEL.title}
                  </h3>

                  <div className="flex w-full flex-col gap-[16px]">
                    {/* Figma 7249:78805 — counterAxisAlignItems MAX (bottom) */}
                    <div className="flex items-end justify-between gap-3">
                      <span className="font-sans text-[16px] leading-6 tracking-[0.2px] text-[#595959]">
                        {TALENT_FUNNEL.stats[0].label}
                      </span>
                      <span className="font-sans text-[16px] leading-6 tracking-[0.2px] text-black">
                        {TALENT_FUNNEL.stats[0].value}
                      </span>
                    </div>

                    <span className="h-[7px] w-full overflow-hidden rounded-full bg-[#e6e6e6]">
                      <span
                        className="block h-full rounded-full bg-brand-green"
                        style={{ width: `${TALENT_FUNNEL.progressPercent}%` }}
                      />
                    </span>

                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-[8px]">
                        <span className="size-[12px] rounded-full bg-brand-green" />
                        <span className="font-sans text-[16px] leading-6 tracking-[0.2px] text-[#595959]">
                          {TALENT_FUNNEL.stats[1].label}
                        </span>
                      </span>
                      <span className="font-sans text-[16px] leading-6 tracking-[0.2px] text-brand-green">
                        {TALENT_FUNNEL.stats[1].value}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Figma 7249:78819 — 1px TOP rule only (individualStrokeWeights
                    { top: 1, right: 0, bottom: 0, left: 0 }), pad-top 23,
                    gap 12, counterAxisAlignItems CENTER. */}
                <div className="flex flex-col items-center gap-[12px] border-t border-border-card pt-[23px]">
                  <span className="w-full text-center font-sans text-[16px] leading-6 tracking-[0.2px] text-black">
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
                    <span className="pl-[8px] font-sans text-[16px] leading-6 tracking-[0.2px] text-black">
                      {TALENT_FUNNEL.qualityValue}
                    </span>
                  </span>
                  {/* whitespace-pre-line keeps Figma's hard line break */}
                  <p className="w-full whitespace-pre-line pt-[4px] text-center font-sans text-[16px] leading-6 tracking-[0.2px] text-[#999999]">
                    {TALENT_FUNNEL.qualityNote}
                  </p>
                </div>

                <div className="flex flex-col gap-[12px] pt-[16px]">
                  <button
                    type="button"
                    onClick={() => log('branch', { action: 'apply-filter-pool', wired: false })}
                    className="inline-flex h-[44px] items-center justify-center rounded-[10px] border-2 border-brand-green-dark bg-brand-green px-[18px] font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-white shadow-[0_4px_0_0_#224626] transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4px] active:shadow-none"
                  >
                    {TALENT_FUNNEL.primaryAction}
                  </button>
                  <button
                    type="button"
                    onClick={() => log('branch', { action: 'save-as-template', wired: false })}
                    className="inline-flex h-[44px] items-center justify-center rounded-[14px] border-2 border-black/30 bg-white px-[18px] font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-black shadow-[0_4px_0_0_#111111] transition-all duration-300 ease-in active:translate-y-[4px] active:shadow-none"
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
                    className="flex w-full flex-col gap-[4px] rounded-[14px] border border-border-card bg-white px-[22px] pb-[38px] pt-[22px] sm:w-[300px]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Icon className="size-[18px] shrink-0 text-brand-green" />
                      <CriteriaToggle size="sm" />
                    </div>
                    <h4 className="pt-[12px] font-sans text-[16px] leading-6 tracking-[0.2px] text-black">
                      {card.title}
                    </h4>
                    <p className="font-sans text-[16px] leading-6 tracking-[0.2px] text-[#999999]">
                      {card.description}
                    </p>

                    <div className="flex flex-col gap-[8px] pt-[16px]">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={classNames(
                            'inline-flex items-center rounded-full px-[8px] py-[4px] font-sans text-[16px] leading-6 tracking-[0.2px]',
                            card.badge ? 'bg-[#f3f8f4] text-brand-green' : 'text-brand-green'
                          )}
                        >
                          {card.badge ?? card.value}
                        </span>
                        {card.badge && (
                          <span className="font-sans text-[16px] leading-6 tracking-[0.2px] text-brand-green">
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
                        <span className="font-sans text-[16px] leading-6 tracking-[0.2px] text-[#999999]">
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
            <span className="font-sans text-[16px] font-medium leading-5 tracking-[0.2px] text-brand-green">
              {MARKET_INSIGHTS.sectionLabel}
            </span>
            <div className="flex flex-col gap-[18px] md:flex-row">
              {MARKET_INSIGHTS.cards.map((card) => (
                <div
                  key={card.id}
                  className="flex min-w-0 flex-1 flex-col gap-[8px] rounded-[12px] border border-border-card bg-white px-[24px] pb-[24px] pt-[23px]"
                >
                  <h5 className="font-sans text-[16px] leading-6 tracking-[0.2px] text-[#999999]">
                    {card.title}
                  </h5>
                  <span className="font-display text-[36px] not-italic leading-[64px] text-black">
                    {card.value}
                  </span>
                  <p className="font-sans text-[16px] leading-6 tracking-[0.2px] text-[#999999]">
                    {card.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default JobScreeningSection;
