import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { FilterRemoveIcon } from './talentSearchIcons.jsx';
import { MenuDivider, MenuGroupLabel, MenuPanel, MenuRow } from '../../ui/MenuPanel.jsx';
import {
  ActivityIcon,
  GlobeIcon,
  MapPinIcon,
  PlusIcon,
  SearchFieldIcon,
} from './talentSearchMenuIcons.jsx';
import {
  EXPERIENCE_FILTER,
  LOCATION_FILTER,
  SKILLS_FILTER,
  SORT_MENU,
} from './talentSearchFilterData.js';

const log = debug('TalentSearchMenus');

/*
 * TalentSearchMenus — the four dropdown panels of the talent-search filter bar, all drawn on the shared `MenuPanel` card.
 *   SkillsMenu      TS-03, Figma 10102:37457 (320 wide)   search field, "MUST HAVE" removable pills, "SUGGESTED FOR THIS ROLE" rows, "Clear skills"
 *   ExperienceMenu  TS-04, Figma 10102:38243 (240 wide)   four single-choice rows, the selected one on a mint wash with a check
 *   LocationMenu    TS-05, Figma 10102:39005 (300 wide)   search field, four cities (single choice), a divider, "Include remote talent" and "Within 50 km" toggles
 *   SortMenu        TS-07, Figma 10102:39790 (260 wide)   five single-choice rows
 * The panels are controlled: the section owns the values (they live in the URL) and passes change handlers. Positioning is the caller's.
 */
const FieldInput = ({ placeholder, value, onChange, onKeyDown, label }) => (
  <label className="flex h-[40px] w-full items-center gap-[8px] rounded-[10px] border border-solid border-[#ccc] bg-white px-[18px] shadow-[2px_2px_0_rgba(191,191,191,0.8)] focus-within:border-brand-green">
    <SearchFieldIcon className="size-[16px] shrink-0 text-[#387440]" />
    <span className="sr-only">{label ?? placeholder}</span>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      className="min-w-0 flex-1 bg-transparent font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#111] outline-none placeholder:text-[#595959]"
    />
  </label>
);

export const SkillsMenu = ({ skills, onChange, className }) => {
  const [draft, setDraft] = useState('');

  const add = (name) => {
    const clean = name.trim();
    if (!clean || skills.some((skill) => skill.toLowerCase() === clean.toLowerCase())) return;
    log('skill added', clean);
    onChange([...skills, clean]);
    setDraft('');
  };

  const remove = (name) => {
    log('skill removed', name);
    onChange(skills.filter((skill) => skill !== name));
  };

  const suggested = SKILLS_FILTER.suggested.filter((item) => !skills.includes(item.id));

  return (
    <MenuPanel
      role="dialog"
      aria-label="Skills filter"
      className={classNames('w-[320px]', className)}
    >
      <FieldInput
        placeholder={SKILLS_FILTER.placeholder}
        value={draft}
        onChange={setDraft}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            add(draft);
          }
        }}
      />
      {skills.length > 0 ? (
        <>
          <MenuGroupLabel>{SKILLS_FILTER.mustHaveLabel}</MenuGroupLabel>
          <ul className="m-0 flex list-none flex-wrap gap-[5px] p-0">
            {skills.map((skill) => (
              <li
                key={skill}
                className="inline-flex min-h-[32px] items-center gap-[10px] rounded-full bg-[#ebf1ec]/50 px-[12px] py-[6px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#111]"
              >
                {skill}
                <button
                  type="button"
                  aria-label={`Remove ${skill}`}
                  onClick={() => remove(skill)}
                  className="relative inline-flex size-[16px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#387440] before:absolute before:-inset-[4px] before:content-['']"
                >
                  <FilterRemoveIcon className="size-[7px]" />
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {suggested.length > 0 ? (
        <>
          <MenuGroupLabel>{SKILLS_FILTER.suggestedLabel}</MenuGroupLabel>
          {suggested.map((item) => (
            <MenuRow
              key={item.id}
              icon={<PlusIcon className="size-[18px]" />}
              label={item.label}
              description={item.meta}
              onClick={() => add(item.id)}
            />
          ))}
        </>
      ) : null}
      <MenuDivider className="my-[2px]" />
      <MenuRow
        label={SKILLS_FILTER.clearLabel}
        muted
        onClick={() => {
          log('skills cleared');
          onChange([]);
        }}
      />
    </MenuPanel>
  );
};

export const ExperienceMenu = ({ value, onChange, className }) => (
  <MenuPanel
    role="listbox"
    aria-label="Experience filter"
    className={classNames('w-[240px]', className)}
  >
    <MenuGroupLabel>{EXPERIENCE_FILTER.label}</MenuGroupLabel>
    {EXPERIENCE_FILTER.options.map((option) => (
      <MenuRow
        key={option.id}
        role="option"
        aria-selected={option.id === value}
        label={option.label}
        selected={option.id === value}
        onClick={() => onChange(option.id)}
      />
    ))}
  </MenuPanel>
);

export const LocationMenu = ({ value, remote, radius, onChange, onToggle, className }) => {
  const [draft, setDraft] = useState('');
  const needle = draft.trim().toLowerCase();
  const cities = LOCATION_FILTER.options.filter(
    (option) => !needle || option.label.toLowerCase().includes(needle)
  );
  const toggleState = { remote, radius };

  return (
    <MenuPanel
      role="dialog"
      aria-label="Location filter"
      className={classNames('w-[300px] gap-[10px]', className)}
    >
      <FieldInput placeholder={LOCATION_FILTER.placeholder} value={draft} onChange={setDraft} />
      <div className="flex flex-col gap-[2px]">
        {cities.map((option) => (
          <MenuRow
            key={option.id}
            icon={<MapPinIcon className="size-[18px]" />}
            label={option.label}
            selected={option.id === value}
            onClick={() => onChange(option.id)}
          />
        ))}
        <MenuDivider className="my-[2px]" />
        {LOCATION_FILTER.toggles.map((toggle) => (
          <MenuRow
            key={toggle.id}
            role="menuitemcheckbox"
            aria-checked={toggleState[toggle.id]}
            icon={
              toggle.id === 'remote' ? (
                <GlobeIcon className="size-[18px]" />
              ) : (
                <ActivityIcon className="size-[18px]" />
              )
            }
            label={toggle.label}
            description={toggle.description}
            checked={toggleState[toggle.id]}
            onClick={() => onToggle(toggle.id, !toggleState[toggle.id])}
          />
        ))}
      </div>
    </MenuPanel>
  );
};

export const SortMenu = ({ value, onChange, className }) => (
  <MenuPanel
    role="listbox"
    aria-label="Sort talents"
    className={classNames('w-[260px]', className)}
  >
    {SORT_MENU.options.map((option) => (
      <MenuRow
        key={option.id}
        role="option"
        aria-selected={option.id === value}
        label={option.label}
        description={option.description}
        selected={option.id === value}
        onClick={() => onChange(option.id)}
      />
    ))}
  </MenuPanel>
);
