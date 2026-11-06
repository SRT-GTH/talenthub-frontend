import { debug } from '../../../utils/debug.js';
import { MenuDivider, MenuGroupLabel, MenuPanel, MenuRow } from '../../ui/MenuPanel.jsx';
import { BriefcaseIcon, ClockIcon, SparklesIcon } from './talentSearchMenuIcons.jsx';
import { SEARCH_SUGGESTIONS } from './talentSearchFilterData.js';
import assistantMark from '../../../assets/recruiter/talent-search/hiring-assistant-mark.webp';

const log = debug('TalentSearchSuggestions');

/*
 * TalentSearchSuggestions — the typeahead panel under the in-page search field (TS-02, Figma 10102:36674, 450 wide).
 * Rows: an "Ask Hiring Assistant" card (mint #ebf1ec, 1px #c1d4c4 border, 14px radius, the assistant avatar in a white 32px tile), a SKILLS group, a ROLES group
 * and a RECENT group (lighter #babab7 text) closed by the 1px rule Figma draws at the bottom.
 * Props: typed (the draft text), onPick(text) — commit a suggestion as the search, onAskAssistant(prompt), className.
 * Matching (⚠️ ASSUMPTION): a skill / role row shows when any typed word is part of its label; with nothing typed only RECENT shows. Figma draws the
 * list only for "react nat".
 */
const matches = (label, typed) => {
  const terms = typed.toLowerCase().split(/\s+/).filter(Boolean);
  return terms.some((term) => label.toLowerCase().includes(term));
};

const TalentSearchSuggestions = ({ typed, onPick, onAskAssistant, className }) => {
  const text = typed.trim();
  const groups = text
    ? SEARCH_SUGGESTIONS.groups
        .map((group) => ({ ...group, items: group.items.filter((i) => matches(i.label, text)) }))
        .filter((group) => group.items.length > 0)
    : [];
  const prompt = SEARCH_SUGGESTIONS.assistant.promptFor(text);
  log('render', { typedLength: text.length, groups: groups.map((g) => g.id) });

  return (
    <MenuPanel
      role="listbox"
      aria-label="Search suggestions"
      className={className}
      id="talent-search-suggestions"
    >
      {text ? (
        <button
          type="button"
          onClick={() => onAskAssistant?.(prompt)}
          className="flex w-full cursor-pointer items-center gap-[12px] rounded-[14px] border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] py-[12px] text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-green"
        >
          <span className="flex size-[32px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
            <img
              src={assistantMark}
              alt=""
              aria-hidden="true"
              className="size-[30px] rounded-full"
            />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="font-sans text-[12px] leading-[14px] font-medium text-[#1c2a21]">
              {SEARCH_SUGGESTIONS.assistant.label}“{prompt}”
            </span>
            <span className="font-sans text-[12px] leading-[14px] text-[#595959]">
              {SEARCH_SUGGESTIONS.assistant.hint}
            </span>
          </span>
        </button>
      ) : null}
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-[2px]">
          <MenuGroupLabel>{group.label}</MenuGroupLabel>
          {group.items.map((item) => (
            <MenuRow
              key={item.id}
              role="option"
              icon={
                group.kind === 'role' ? (
                  <BriefcaseIcon className="size-[18px]" />
                ) : (
                  <SparklesIcon className="size-[18px]" />
                )
              }
              label={item.label}
              description={item.meta}
              onClick={() => onPick?.(item.label)}
            />
          ))}
        </div>
      ))}
      <div className="flex flex-col gap-[2px]">
        <MenuGroupLabel>{SEARCH_SUGGESTIONS.recentLabel}</MenuGroupLabel>
        {SEARCH_SUGGESTIONS.recent.map((item) => (
          <MenuRow
            key={item.id}
            role="option"
            icon={<ClockIcon className="size-[18px]" />}
            label={item.label}
            muted
            onClick={() => onPick?.(item.label)}
          />
        ))}
      </div>
      <MenuDivider />
    </MenuPanel>
  );
};

export default TalentSearchSuggestions;
