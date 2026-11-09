import { classNames } from '../../../utils/classNames.js';
import Chip from '../../ui/Chip.jsx';
import InlineState from '../../ui/InlineState.jsx';
import SkeletonBlock from '../../ui/SkeletonBlock.jsx';
import WidgetCard from '../../ui/WidgetCard.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { PIPELINE, PIPELINE_7D, PIPELINE_STATES } from './recruiterDashboardData.js';

/*
 * PipelineWidget — "Recruitment pipeline" funnel (Figma 10049:58906, states D40–D44 in section 05): six stage columns (count in Bricolage Grotesque, drop-off chip, bar, label + sub-label),
 * an outflow strip (rejected / withdrawn / insight) and a hint. Bar heights are Figma's (140 → 10px).
 * Props: window ('7d' | '30d' | '90d'; 7d draws the D41 numbers, 90d reuses 30d), onWindowChange, jobFilter (node: the FilterSelect), readOnly,
 *   state ('' | 'empty' | 'loading'), selectedStage, onStage(stageId), onInvite (the empty state's action).
 */
const stagesFor = (windowId) =>
  windowId === '7d'
    ? PIPELINE.stages.map((stage, index) => ({ ...stage, ...PIPELINE_7D[index] }))
    : PIPELINE.stages;

const PipelineWidget = ({
  window: activeWindow = '30d',
  onWindowChange,
  jobFilter,
  readOnly = false,
  state = '',
  selectedStage = '',
  onStage,
  onInvite,
  live = null,
}) => {
  // `live` (signed-in home): { stages, subtitle, rejected, withdrawn, insight } from livePipeline(); no time-window switch.
  const stages = live ? live.stages : stagesFor(activeWindow);
  const subtitle = live
    ? live.subtitle
    : state === 'empty'
      ? PIPELINE_STATES.empty.subtitle
      : state === 'loading'
        ? PIPELINE_STATES.loading.subtitle
        : PIPELINE.subtitle;
  return (
    <WidgetCard
      id="dash-pipeline"
      icon={dashIcons.tilePipeline}
      title={PIPELINE.title}
      subtitle={subtitle}
      gap={14}
      controls={
        <>
          {jobFilter}
          <div
            hidden={Boolean(live)}
            role="group"
            aria-label="Time window"
            className="flex gap-[2px] rounded-[10px] bg-[#fefefe] p-[3px]"
          >
            {PIPELINE.windows.map((windowId) => {
              const active = windowId === activeWindow;
              return (
                <button
                  key={windowId}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onWindowChange?.(windowId)}
                  className={classNames(
                    'cursor-pointer rounded-[6px] border-0 px-[10px] py-[5px] font-sans text-[12px] leading-[20px] tracking-[0.2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                    active
                      ? 'bg-white font-medium text-[#2a5730] shadow-[0_1px_2px_rgba(15,15,10,0.12)]'
                      : 'bg-transparent text-[#575755]'
                  )}
                >
                  {windowId}
                </button>
              );
            })}
          </div>
          {readOnly ? <Chip tone="amber">Read-only</Chip> : null}
        </>
      }
    >
      {state === 'loading' ? (
        <div aria-busy="true" className="flex flex-col gap-[10px]">
          <p role="status" className="sr-only">
            Loading pipeline…
          </p>
          <div className="grid grid-cols-6 items-end gap-[8px] max-sm:grid-cols-3">
            {[140, 68, 37, 25, 10, 10].map((height, index) => (
              <div key={index} className="flex flex-col gap-[8px]">
                <SkeletonBlock className="h-[24px] w-[40px] rounded-[6px]" />
                <SkeletonBlock className="w-full rounded-[6px]" style={{ height }} />
                <SkeletonBlock className="h-[12px] w-[70%] rounded-[6px]" />
              </div>
            ))}
          </div>
          <SkeletonBlock className="h-[54px] w-full rounded-[10px]" />
        </div>
      ) : state === 'empty' ? (
        <InlineState
          tone="mint"
          icon={dashIcons.emptyTooFewCandidatesPipeline}
          title={PIPELINE_STATES.empty.title}
          actions={
            <button
              type="button"
              onClick={onInvite}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-[8px] whitespace-nowrap max-sm:gap-[6px] max-sm:px-[12px] rounded-[10px] border-0 bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-white shadow-[0_3px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <img src={dashIcons.sendInvite} alt="" aria-hidden="true" className="size-[14px]" />
              {PIPELINE_STATES.empty.action}
            </button>
          }
        >
          {PIPELINE_STATES.empty.body}
        </InlineState>
      ) : (
        <div className="flex flex-col gap-[10px]">
          <ol className="m-0 grid list-none grid-cols-6 items-end gap-[8px] p-0 max-sm:grid-cols-3 max-sm:gap-y-[16px]">
            {stages.map((stage) => (
              <li key={stage.id} className="flex min-w-0 flex-col justify-end gap-[8px]">
                <button
                  type="button"
                  onClick={() => onStage?.(stage.id)}
                  aria-label={`${stage.label}: ${stage.count} candidates`}
                  aria-pressed={selectedStage === stage.id}
                  className="flex min-w-0 cursor-pointer flex-col justify-end gap-[8px] border-0 bg-transparent p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                >
                  <span className="flex min-h-[32px] flex-wrap items-center gap-[6px]">
                    <span className="font-['Bricolage_Grotesque',sans-serif] text-[27px] leading-[32px] font-semibold tracking-[-0.54px] text-[#111]">
                      {stage.count}
                    </span>
                    {stage.drop ? (
                      <Chip tone="danger" icon={dashIcons.trendDownChip} className="px-[6px]">
                        {stage.drop}
                      </Chip>
                    ) : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className="block w-full bg-[#387440]"
                    style={{ height: `${stage.bar}px`, opacity: stage.opacity }}
                  />
                  <span className="flex flex-col gap-[5px]">
                    <span className="font-sans text-[12px] leading-[20px] font-semibold tracking-[0.1px] text-[#111]">
                      {stage.label}
                    </span>
                    <span className="font-sans text-[10px] leading-[16px] tracking-[0.2px] text-[#575755] uppercase max-xl:text-[12px]">
                      {stage.sub}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[8px] rounded-[10px] bg-[#fffefc] py-[12px] pr-0 pl-0">
            <span className="font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#575755]">
              {PIPELINE.outflowLabel}
            </span>
            <Chip tone="danger" icon={dashIcons.xCircleRejected}>
              {live ? live.rejected : PIPELINE.rejected}
            </Chip>
            <Chip tone="neutral" icon={dashIcons.undoWithdrawn}>
              {live ? live.withdrawn : PIPELINE.withdrawn}
            </Chip>
            <span
              aria-hidden="true"
              className="h-px min-w-[24px] flex-1 bg-[#e5e8e3] max-md:hidden"
            />
            <Chip
              hidden={Boolean(live && !live.insight)}
              tone="amber"
              icon={dashIcons.sparklesInsight}
              className="py-[5px] pr-[12px] pl-[10px] text-[#463409] max-sm:max-w-full max-sm:shrink max-sm:rounded-[16px] max-sm:whitespace-normal"
            >
              {live ? live.insight : PIPELINE.insight}
            </Chip>
          </div>
          <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {PIPELINE.hint}
          </p>
        </div>
      )}
    </WidgetCard>
  );
};

export default PipelineWidget;
