import { useMemo, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { COMMUNITY_PAGE_COPY } from './communityData.js';
import {
  CmCalendarIcon,
  CmGlobeIcon,
  CmMessageIcon,
  CmSearchIcon,
  CmUsersIcon,
} from './CommunityPageIcons.jsx';
import { PageButton } from './CommunityPageParts.jsx';
import {
  CARD,
  FOCUS_RING,
  OUTLINE_CHIP,
  OUTLINE_CHIP_OFF,
  OUTLINE_CHIP_ON,
  TAG_CHIP,
} from './communityPageStyles.js';
import { HEADING } from './communityStyles.js';

const log = debug('CommunityTabPanels');

/*
 * Community tab panels (Figma C-11 About tab, C-12 Members tab). Both replace only the feed column.
 *   AboutPanel    detail (COMMUNITY_DETAILS entry: about { text, audience, rules, moderators, facts }).
 *   MembersPanel  detail (people [{ id, name, avatar, badge?, role, city, skills, following }]).
 */
const PANEL_TITLE = 'text-[22px] leading-[28px]';
const FACT_ICONS = { calendar: CmCalendarIcon, globe: CmGlobeIcon, users: CmUsersIcon };

const OutlineChip = ({ children, className }) => (
  <span
    className={classNames(
      'inline-flex h-[32px] shrink-0 items-center whitespace-nowrap rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] font-semibold leading-[16px] text-[#595959]',
      className
    )}
  >
    {children}
  </span>
);

export const AboutPanel = ({ detail }) => {
  const { about } = detail;
  const copy = COMMUNITY_PAGE_COPY.about;
  return (
    <div className="flex min-w-0 flex-col gap-[20px]">
      <section className={classNames(CARD, 'flex flex-col gap-[14px] p-[24px] max-sm:p-[16px]')}>
        <h2 className={classNames(HEADING, PANEL_TITLE)}>{copy.forTitle}</h2>
        <p className="m-0 font-sans text-[15px] leading-[23px] text-[#595959]">{about.text}</p>
        {about.audience.length ? (
          <div className="flex flex-wrap gap-[8px]">
            {about.audience.map((label) => (
              <span key={label} className={TAG_CHIP}>
                {label}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className={classNames(CARD, 'flex flex-col gap-[20px] p-[24px] max-sm:p-[16px]')}>
        <h2 className={classNames(HEADING, PANEL_TITLE)}>{copy.rulesTitle}</h2>
        {about.rules.map((rule, index) => (
          <div key={rule.title} className="flex items-start gap-[14px]">
            <span
              aria-hidden="true"
              data-count={index + 1}
              className="inline-flex size-[30px] shrink-0 items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] font-sans text-[13px] font-bold leading-[16px] text-[#1c2a21] after:content-[attr(data-count)] playful:border-[1.5px] playful:border-[#1c2a21]"
            />
            <div className="flex min-w-0 flex-col gap-[2px]">
              <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                {rule.title}
              </span>
              <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
                {rule.text}
              </span>
            </div>
          </div>
        ))}
      </section>

      <section
        className={classNames(
          CARD,
          'flex flex-col gap-[14px] p-[24px] max-sm:p-[16px] playful:gap-[20px]'
        )}
      >
        <h2 className={classNames(HEADING, PANEL_TITLE)}>{copy.moderatorsTitle}</h2>
        {about.moderators.map((mod) => (
          <div key={mod.name} className="flex items-center gap-[10px]">
            <img
              src={mod.avatar}
              alt=""
              className="size-[40px] shrink-0 rounded-full object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="truncate font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
                {mod.name}
              </span>
              <span className="font-sans text-[12px] leading-[14px] text-[#737373]">
                {mod.role}
              </span>
            </div>
            <span className={TAG_CHIP}>{copy.moderator}</span>
          </div>
        ))}
      </section>

      <div className="grid gap-[12px] sm:grid-cols-3">
        {about.facts.map((fact) => {
          const Glyph = FACT_ICONS[fact.icon];
          return (
            <div
              key={fact.id}
              className="flex flex-col gap-[6px] rounded-[16px] border border-solid border-[#e6e6e6] bg-white p-[16px]"
            >
              <Glyph className="size-[18px] text-[#387440]" />
              <span className="font-sans text-[12px] font-medium leading-[14px] text-[#737373]">
                {fact.label}
              </span>
              <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                {fact.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FILTERS = {
  All: () => true,
  Moderators: (p) => p.badge?.kind === 'moderator',
  'Near you': (p) => p.city === 'Accra',
  'Open to work': (p) => p.badge?.kind === 'open',
  Mentors: (p) => p.badge?.kind === 'mentor',
};

const Badge = ({ badge }) =>
  badge.kind === 'open' ? (
    <OutlineChip>{badge.label}</OutlineChip>
  ) : (
    <span className={TAG_CHIP}>{badge.label}</span>
  );

export const MembersPanel = ({ detail }) => {
  const copy = COMMUNITY_PAGE_COPY.members;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [follows, setFollows] = useState(() =>
    Object.fromEntries(detail.people.map((person) => [person.id, person.following]))
  );
  // Live pages set `moreMembers: false` (the API returns the members it has) and `membersSearch` (real count).
  const [more, setMore] = useState(detail.moreMembers !== false);
  const searchLabel = detail.membersSearch || copy.search;

  const shown = useMemo(() => {
    const term = query.trim().toLowerCase();
    return detail.people.filter((person) => {
      if (!FILTERS[filter](person)) return false;
      if (!term) return true;
      return [person.name, person.role, ...person.skills].join(' ').toLowerCase().includes(term);
    });
  }, [detail.people, query, filter]);

  return (
    <div className="flex min-w-0 flex-col gap-[20px]">
      <div className="flex flex-wrap items-center gap-[10px]">
        <label className="flex h-[51px] w-[339px] max-w-full min-w-0 items-center gap-[8px] rounded-[10px] border border-solid border-[#cccccc] bg-white pl-[20px] pr-[16px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] max-lg:flex-1 max-lg:basis-[220px]">
          <CmSearchIcon className="size-[16px] shrink-0 text-[#387440]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchLabel}
            aria-label={searchLabel}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] outline-none placeholder:text-[#595959] max-sm:text-[16px]"
          />
        </label>
        <div className="no-scrollbar flex min-w-0 items-center gap-[10px] overflow-x-auto py-px max-lg:basis-full">
          {copy.filters.map((label) => (
            <button
              key={label}
              type="button"
              aria-pressed={label === filter}
              onClick={() => {
                log('filter', label);
                setFilter(label);
              }}
              className={classNames(
                OUTLINE_CHIP,
                FOCUS_RING,
                label === filter ? OUTLINE_CHIP_ON : OUTLINE_CHIP_OFF
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-solid border-[#e6e6e6] bg-white">
        {shown.map((person) => (
          <div
            key={person.id}
            className="flex flex-wrap items-center gap-[14px] border-0 border-b border-solid border-[#e6e6e6] px-[18px] py-[14px] max-sm:px-[12px]"
          >
            <img
              src={person.avatar}
              alt=""
              className="size-[44px] shrink-0 rounded-full object-cover"
            />
            <div className="flex min-w-[150px] flex-1 flex-col gap-[4px]">
              <div className="flex flex-wrap items-center gap-[8px]">
                <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                  {person.name}
                </span>
                {person.badge ? <Badge badge={person.badge} /> : null}
              </div>
              <span className="font-sans text-[12px] leading-[14px] text-[#737373]">
                {person.role}
              </span>
              <div className="flex flex-wrap gap-[6px]">
                {person.skills.map((skill) => (
                  <OutlineChip key={skill}>{skill}</OutlineChip>
                ))}
              </div>
            </div>
            {person.me ? (
              <span className="font-sans text-[12px] font-semibold text-[#737373]">You</span>
            ) : (
            <div className="flex items-center gap-[14px] max-sm:basis-full max-sm:gap-[10px] max-sm:pl-[58px]">
              <button
                type="button"
                aria-label={`Message ${person.name}`}
                onClick={() => log('message', person.id)}
                className={classNames(
                  'inline-flex size-[40px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#e6e6e6] bg-white p-0',
                  FOCUS_RING
                )}
              >
                <CmMessageIcon className="size-[18px] text-[#387440]" />
              </button>
              <PageButton
                tone="secondary"
                className="!h-[44px] !px-[16px]"
                aria-pressed={follows[person.id]}
                onClick={() => {
                  log('follow', person.id, !follows[person.id]);
                  setFollows((current) => ({ ...current, [person.id]: !current[person.id] }));
                }}
              >
                {follows[person.id] ? copy.following : copy.follow}
              </PageButton>
            </div>
            )}
          </div>
        ))}
      </div>

      {more ? (
        <div className="flex justify-center">
          <PageButton
            tone="secondary"
            className="!h-[44px] !px-[16px]"
            onClick={() => {
              log('show more members');
              setMore(false);
            }}
          >
            {copy.more}
          </PageButton>
        </div>
      ) : null}
    </div>
  );
};
