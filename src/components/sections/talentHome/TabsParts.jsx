import {
  AiValidatedChatBubbleIcon,
  AssessmentDoneCheckIcon,
  AssessmentEvidencedShieldIcon,
  GameEvidencedControllerIcon,
  HomeTabAssessmentClipboardActiveIcon,
  HomeTabAssessmentClipboardIcon,
  HomeTabHouseIcon,
  HomeTabRecruiterEyeActiveIcon,
  HomeTabRecruiterEyeIcon,
  PlayfulAssessmentDoneCheckIcon,
  PlayfulAssessmentEvidencedShieldIcon,
  PlayfulSelfReportedPencilIcon,
  SelfReportedPencilIcon,
} from '../../shared/assets.jsx';
import { classNames } from '../../../utils/classNames.js';
import { HOME_TABS, EVIDENCE_KINDS } from './talentHomeTabsData.js';

/*
 * TabsParts — pieces shared by the Tabs agent's screens (MyAssessment, Recruiter activity,
 * Global search, Edit home). Focused look first; Playful only through `playful:` variants
 * (wiki/playful-mode.md). Colours are the exact Figma values.
 */

/* Bricolage Grotesque display face — Playful only (loaded by ensurePlayfulFont). */
export const DISPLAY =
  "playful:[font-family:var(--pf-font-display)] playful:[font-variation-settings:'opsz'_14,'wdth'_100]";

/* Plain white content card (Figma "Personality result" etc.). */
export const CARD =
  'rounded-[24px] border border-[#e7e7e7] bg-white shadow-[0_5px_8.5px_rgba(18,38,20,0.03)] ' +
  'playful:shadow-[0_8px_12px_rgba(18,38,20,0.06)]';

/* "Lifted" card: Focused = hairline + soft shadow, Playful = 1.5px ink border + 5px shelf. */
export const LIFT =
  'border border-[rgba(28,42,33,0.1)] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)] ' +
  'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] ' +
  'playful:shadow-[0_10px_12px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)]';

const CHIP_TONES = {
  // Focused: 12px pill; Playful: 32px GTH chip.
  soft: 'bg-[#ebf1ec] text-[#387440] playful:border-[#c1d4c4]',
  solid: 'bg-[#387440] text-white playful:border-[#1c2a21] playful:bg-[#1c2a21]',
  game: 'bg-[#e8f2ed] text-[#1d7c4d] playful:border-[#c1d4c4] playful:bg-[#ebf1ec] playful:text-[#387440]',
  self: 'bg-[#faf4e8] text-[#785910] playful:border-[#e1eae2] playful:bg-white playful:text-[#595959]',
  plain: 'bg-white text-[#595959] border border-[#e1eae2]',
};

/* Pill chip. `icon` = [focusedSrc, playfulSrc]. */
export const Chip = ({ tone = 'soft', icon, className, children, ...rest }) => {
  const [FocusedIcon, PlayfulIcon] = icon ?? [];
  return (
    <span
      {...rest}
      className={classNames(
        'inline-flex shrink-0 items-center whitespace-nowrap rounded-full font-semibold',
        'px-[10px] py-[4px] text-[12px] leading-normal',
        'playful:h-[32px] playful:border playful:px-[14px] playful:py-0 playful:text-[13px]',
        icon ? 'gap-[4px] pl-[8px] playful:gap-[6px]' : null,
        tone === 'plain'
          ? 'h-[32px] gap-[6px] border border-[#e1eae2] bg-white px-[14px] py-0 text-[13px] text-[#595959]'
          : null,
        CHIP_TONES[tone],
        className
      )}
    >
      {icon ? (
        <>
          <FocusedIcon className="size-[13px] playful:hidden" />
          <PlayfulIcon className="hidden size-[14px] playful:block" />
        </>
      ) : null}
      {children}
    </span>
  );
};

/* "Soft" green chip that is 32px in BOTH styles (Figma "GTH · Chip" instances in the Focused
   frames: Personality affinity, Career affinity, quick filters). */
export const SoftChip = ({ children, className }) => (
  <span
    className={classNames(
      'inline-flex h-[32px] shrink-0 items-center whitespace-nowrap rounded-full border border-[#c1d4c4] bg-[#ebf1ec] px-[14px] text-[13px] font-semibold text-[#387440]',
      className
    )}
  >
    {children}
  </span>
);

/* Evidence chip (Figma: Assessment-/Game-evidenced, AI-validated in chat, Self-reported). */
export const EvidenceChip = ({ kind }) => {
  const label = EVIDENCE_KINDS[kind].label;
  if (kind === 'assessment')
    return (
      <Chip
        tone="solid"
        icon={[AssessmentEvidencedShieldIcon, PlayfulAssessmentEvidencedShieldIcon]}
      >
        {label}
      </Chip>
    );
  if (kind === 'game')
    return (
      <Chip tone="game" icon={[GameEvidencedControllerIcon, GameEvidencedControllerIcon]}>
        {label}
      </Chip>
    );
  if (kind === 'self')
    return (
      <Chip tone="self" icon={[SelfReportedPencilIcon, PlayfulSelfReportedPencilIcon]}>
        {label}
      </Chip>
    );
  return (
    <span className="inline-flex h-[32px] shrink-0 items-center gap-[6px] whitespace-nowrap rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold text-[#595959]">
      <AiValidatedChatBubbleIcon className="size-[14px]" />
      {label}
    </span>
  );
};

export const CheckChip = ({ children }) => (
  <Chip tone="solid" icon={[AssessmentDoneCheckIcon, PlayfulAssessmentDoneCheckIcon]}>
    {children}
  </Chip>
);

/* Card head: 32px tile + title + spacer + trailing node. */
export const CardHead = ({ icon, title, trailing }) => {
  const Icon = icon;
  return (
    <div className="flex items-center gap-[10px]">
      <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec]">
        <Icon className="size-[17px]" />
      </span>
      <h2 className="whitespace-nowrap text-[17px] font-semibold text-[#1c2a21]">{title}</h2>
      <span className="h-px min-w-px flex-1" aria-hidden="true" />
      {trailing}
    </div>
  );
};

/* Playful-only sticker (Figma "genz:sticker", yellow, ink border, 2px shelf, tilted). */
export const Sticker = ({ children, rotate = '-5deg', className }) => (
  <span
    aria-hidden="true"
    style={{ '--sticker-rot': rotate }}
    className={classNames(
      'pointer-events-none hidden whitespace-nowrap rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] text-[12px] font-bold leading-normal text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block playful:rotate-[var(--sticker-rot)]',
      className
    )}
  >
    {children}
  </span>
);

/* Overview | MyAssessment | Recruiter activity switcher (Figma "Home tabs"). */
export const HomeTabs = ({ active, onSelect, tabs = HOME_TABS }) => {
  const icon = (id) => {
    if (id === 'home') return HomeTabHouseIcon;
    if (id === 'assessment')
      return active === id ? HomeTabAssessmentClipboardActiveIcon : HomeTabAssessmentClipboardIcon;
    return active === id ? HomeTabRecruiterEyeActiveIcon : HomeTabRecruiterEyeIcon;
  };
  return (
    <div
      role="tablist"
      aria-label="Home sections"
      className="flex gap-[6px] overflow-x-auto rounded-[16px] border border-[#e7e7e7] bg-[#f7f8f4] p-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab) => {
        const on = tab.id === active;
        const TabIcon = icon(tab.id);
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={on}
            aria-label={tab.chip ? `${tab.label}, ${tab.chip}` : tab.label}
            onClick={() => onSelect(tab.id)}
            className={classNames(
              'flex min-w-0 shrink-0 cursor-pointer items-center justify-center gap-[8px] whitespace-nowrap rounded-[12px] px-[clamp(10px,1.2vw,16px)] py-[12px] text-[15px] leading-normal md:flex-1',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
              on
                ? classNames('bg-white font-bold text-[#1c2a21]', LIFT)
                : 'bg-[#f7f8f4] font-semibold text-[#595959] hover:bg-white/60'
            )}
          >
            <TabIcon className={tab.id === 'recruiter' ? 'h-[17.1px] w-[18px]' : 'size-[18px]'} />
            <span
              aria-hidden="true"
              data-count={tab.label}
              className="after:content-[attr(data-count)]"
            />
            {tab.chip ? (
              <Chip
                tone={on ? 'solid' : 'soft'}
                aria-hidden="true"
                data-count={tab.chip}
                className="after:content-[attr(data-count)] max-[360px]:hidden"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
