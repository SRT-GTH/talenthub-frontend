import { useRef } from 'react';
import useDismissableLayer from '../../../hooks/useDismissableLayer.js';
import { MenuDivider, MenuGroupLabel, MenuPanel, MenuRow } from '../../ui/MenuPanel.jsx';
import { debug } from '../../../utils/debug.js';
import { flowIcons } from './screeningFlowIcons.js';
import {
  EDUCATION_LEVELS,
  EDUCATION_LEVEL_GROUP,
  EDUCATION_PARTNERS,
  SAVED_CRITERIA,
  SKILL_CATALOG,
} from './screeningFlowData.js';

const log = debug('ScreeningMenus');

/*
 * ScreeningMenus — the three popovers of the builder (all on `ui/MenuPanel`, anchored by the caller).
 *   SkillSearchPopover   JS-01 "Popover · Add skill" (300 wide): the search field ("Pro"), FROM THIS POSTING / SUGGESTED groups, the green "Add “Pro” as a custom skill" row.
 *                        ⚠️ ASSUMPTION: Figma lists Accessibility and Interaction design under "Pro", so typing RANKS matches first but never hides a row; skills already added are not offered again.
 *                        Props: query, added[], onQuery, onAdd({ id, label }), onClose.
 *   EducationLevelMenu   JS-03 "Dropdown · Education level" (280 wide): MINIMUM LEVEL rows (selected = mint wash + green tick) and the "Only from partner institutions" row. Props: value, partners, onPick(id), onTogglePartners, onClose.
 *   SavedCriteriaMenu    JS-14 "Dropdown · Load criteria (open)" (340 wide): SAVED BY YOUR TEAM rows and the "Manage in Templates › Screening" link row. Props: onPick(item), onManage, onClose.
 */
export const SkillSearchPopover = ({ query, added, onQuery, onAdd, onClose, className }) => {
  const ref = useRef(null);
  useDismissableLayer(ref, true, onClose);
  const text = query.trim();
  const needle = text.toLowerCase();
  const offered = SKILL_CATALOG.filter((skill) => !added.includes(skill.id)).sort(
    (a, b) =>
      Number(b.label.toLowerCase().includes(needle)) -
      Number(a.label.toLowerCase().includes(needle))
  );
  const groups = [...new Set(offered.map((skill) => skill.group))];
  const exact = SKILL_CATALOG.some((skill) => skill.label.toLowerCase() === needle);
  log('render', { query: text, offered: offered.map((s) => s.id) });

  return (
    <MenuPanel ref={ref} role="dialog" aria-label="Add skill" className={className}>
      <div className="p-[4px]">
        <label className="flex h-[48px] items-center gap-[10px] rounded-[12px] border border-solid border-[#387540] bg-white px-[16px] shadow-[0_0_0_3px_rgba(56,116,64,0.12)]">
          <img
            src={flowIcons.skillSearchGlass}
            alt=""
            aria-hidden="true"
            className="size-[18px] shrink-0"
          />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search skills"
            aria-label="Search skills"
            className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#111] outline-none placeholder:text-[#999]"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onQuery('')}
              className="flex size-[16px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
            >
              <img
                src={flowIcons.skillSearchClear}
                alt=""
                aria-hidden="true"
                className="size-[16px]"
              />
            </button>
          ) : null}
        </label>
      </div>
      {groups.map((group) => (
        <div key={group} className="flex flex-col gap-[2px]">
          <MenuGroupLabel>{group}</MenuGroupLabel>
          {offered
            .filter((skill) => skill.group === group)
            .map((skill) => (
              <MenuRow
                key={skill.id}
                icon={
                  <img
                    src={flowIcons.menuAddPlus}
                    alt=""
                    aria-hidden="true"
                    className="size-[18px]"
                  />
                }
                label={skill.label}
                description={skill.note}
                onClick={() => onAdd({ id: skill.id, label: skill.label })}
              />
            ))}
        </div>
      ))}
      {text && !exact ? (
        <>
          <MenuDivider />
          <MenuRow
            icon={
              <img
                src={flowIcons.menuAddPlusGreen}
                alt=""
                aria-hidden="true"
                className="size-[18px]"
              />
            }
            label={`Add “${text}” as a custom skill`}
            onClick={() => onAdd({ id: `custom:${text}`, label: text })}
          />
        </>
      ) : null}
    </MenuPanel>
  );
};

export const EducationLevelMenu = ({
  value,
  partners,
  onPick,
  onTogglePartners,
  onClose,
  className,
}) => {
  const ref = useRef(null);
  useDismissableLayer(ref, true, onClose);
  return (
    <MenuPanel ref={ref} role="listbox" aria-label="Minimum education level" className={className}>
      <MenuGroupLabel>{EDUCATION_LEVEL_GROUP}</MenuGroupLabel>
      {EDUCATION_LEVELS.map((level) => (
        <MenuRow
          key={level.id}
          role="option"
          aria-selected={value === level.id}
          label={level.label}
          description={level.note}
          selected={value === level.id}
          onClick={() => onPick(level.id)}
        />
      ))}
      <MenuDivider />
      <MenuRow
        icon={
          <img
            src={flowIcons.educationLevelGraduation}
            alt=""
            aria-hidden="true"
            className="size-[18px]"
          />
        }
        label={EDUCATION_PARTNERS.label}
        description={EDUCATION_PARTNERS.note}
        selected={partners}
        onClick={onTogglePartners}
      />
    </MenuPanel>
  );
};

export const SavedCriteriaMenu = ({ onPick, onManage, onClose, className }) => {
  const ref = useRef(null);
  useDismissableLayer(ref, true, onClose);
  return (
    <MenuPanel ref={ref} role="menu" aria-label={SAVED_CRITERIA.trigger} className={className}>
      <MenuGroupLabel>{SAVED_CRITERIA.group}</MenuGroupLabel>
      {SAVED_CRITERIA.items.map((item) => (
        <MenuRow
          key={item.id}
          role="menuitem"
          icon={
            <img
              src={item.icon === 'file' ? flowIcons.savedRowFile : flowIcons.savedRowFilter}
              alt=""
              aria-hidden="true"
              className="size-[18px]"
            />
          }
          label={item.label}
          description={item.note}
          onClick={() => onPick(item)}
        />
      ))}
      <MenuDivider />
      <MenuRow
        role="menuitem"
        icon={
          <img
            src={flowIcons.savedRowArrowRight}
            alt=""
            aria-hidden="true"
            className="size-[18px]"
          />
        }
        label={SAVED_CRITERIA.manage}
        onClick={onManage}
      />
    </MenuPanel>
  );
};
