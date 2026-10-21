import { classNames } from '../../../../utils/classNames.js';
import { ArrowLeftIcon, ArrowRightSmIcon } from '../../../shared/assets.jsx';
import { AVATAR_TABS, FONT_SPACE, STAT_PILLS } from './avatarData.js';
import { SHADOW_HARD, SHADOW_SOFT, StatPill, StepTabs } from './AvatarPieces.jsx';

/*
 * AvatarPanel — the right "customiser panel" (Figma "RIGHT — customiser panel", 738 wide): title + helper line + stat pills (+ the
 * "✓ n selected" chip on Extras / Outfit), the tab row, the step body, and the action card pinned to the bottom (Go back · primary ·
 * "Auto-saved …" line). Props: meta (STEP_META entry), step, selectedCount (null hides the chip), onTab(tabId), onBack, onNext, children.
 * Chip placement (design px from the title top): Extras 27 / Outfit 86, right-aligned to the content edge.
 */
const GRADIENT_TEXT = {
  backgroundImage: 'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
};
const CHIP_TOP = { extras: 27, outfit: 86 };

const AvatarPanel = ({ meta, step, selectedCount = null, onTab, onBack, onNext, children }) => {
  const tall = meta.cardH === 150;
  return (
    <aside
      aria-label="Avatar customiser"
      className="relative flex flex-col bg-white lg:min-h-[calc(var(--pm)*var(--u))]"
      style={{ '--pm': meta.panelMin }}
    >
      <div className="relative px-4 pb-6 pt-5 lg:pb-0 lg:pl-[calc(25*var(--u))] lg:pr-[calc(78*var(--u))] lg:pt-0">
        <div
          className="max-lg:hidden lg:h-[calc(var(--pt)*var(--u))]"
          style={{ '--pt': meta.panelTop }}
        />
        <div className="relative">
          <h2 className="m-0 font-sans text-[22px] font-semibold leading-[28px] tracking-[-0.44px] text-[#1c2a21] playful:font-heading">
            {meta.title}
          </h2>
          <p className="m-0 mt-[8px] font-sans text-[12px] font-normal leading-[18px] tracking-[0.2px] text-[#70706e] max-lg:text-[12px]">
            {meta.subtitle}
          </p>
          <div className="mt-[2px] flex flex-wrap gap-[8px] pt-[0px]">
            {STAT_PILLS.map((p) => (
              <StatPill key={p.label} {...p} />
            ))}
          </div>
          {selectedCount !== null ? (
            <span
              className={classNames(
                'inline-flex items-center gap-[8px] border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[13px] py-[7px] text-[#387440] lg:absolute lg:right-0',
                step === 'extras' ? 'rounded-[8px]' : 'rounded-full',
                'max-lg:mt-[12px]'
              )}
              style={{ top: `calc(${CHIP_TOP[step]} * var(--u))` }}
            >
              <span
                className="text-[11px] font-bold leading-[14px] tracking-[0.44px] max-lg:text-[12px]"
                style={FONT_SPACE}
              >
                ✓
              </span>
              <span
                className="text-[13px] font-bold leading-[16px] tracking-[0.44px]"
                style={FONT_SPACE}
              >
                {selectedCount}
              </span>
              <span className="font-sans text-[11px] font-bold leading-[13px] tracking-[0.44px] max-lg:text-[12px]">
                selected
              </span>
            </span>
          ) : null}
        </div>
        <div className="mt-[16px] flex min-h-[56px] items-center">
          <StepTabs tabs={AVATAR_TABS} active={step} onSelect={onTab} />
        </div>
        <div className="mt-[24px] pb-[24px] lg:pb-[calc(24*var(--u))]">{children}</div>
      </div>
      <div className="flex-1" />
      <div className="border-0 border-t border-solid border-[#f1f5f9] bg-white px-4 lg:px-[calc(48*var(--u))]">
        <div
          className="mx-auto flex max-w-[629px] flex-col gap-[16px]"
          style={{
            paddingTop: `max(16px, calc(${tall ? 49 : 41} * var(--u)))`,
            paddingBottom: `max(16px, calc(${tall ? 19 : 15} * var(--u)))`,
          }}
        >
          <div className="flex flex-wrap items-center gap-[12px] lg:flex-nowrap lg:gap-[24px]">
            <button
              type="button"
              onClick={onBack}
              className={classNames(
                'inline-flex min-h-[52px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.1)] bg-white px-[32px] py-[12px] font-sans text-[14px] font-semibold leading-[24px] tracking-[0.1px] text-[#1c2a21]',
                'playful:border-[rgba(28,42,33,0.3)]',
                SHADOW_SOFT,
                SHADOW_HARD,
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
              )}
            >
              <ArrowLeftIcon className="size-[14px]" />
              {meta.back}
            </button>
            <button
              type="button"
              onClick={onNext}
              className={classNames(
                'inline-flex min-h-[48px] min-w-0 flex-1 cursor-pointer items-center justify-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[28px] py-[12px] font-sans text-[14px] font-semibold leading-[24px] tracking-[0.1px]',
                SHADOW_SOFT,
                SHADOW_HARD,
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
              )}
            >
              <span className="bg-clip-text text-transparent" style={GRADIENT_TEXT}>
                {meta.next}
              </span>
              <ArrowRightSmIcon className="size-[14px] text-[#ebf1ec]" />
            </button>
          </div>
          <p className="m-0 flex items-center justify-center gap-[4px] font-sans text-[12px] font-normal leading-[14px] text-[#babab7] max-lg:text-[12px]">
            <span aria-hidden="true" className="size-[6px] rounded-[3px] bg-[#387440]" />
            {meta.saved}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AvatarPanel;
