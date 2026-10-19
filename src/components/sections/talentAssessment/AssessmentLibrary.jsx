import { useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { HubButton } from '../talentSkillsLab/HubParts.jsx';
import {
  AssessmentButtonArrowIcon,
  AssessmentClockIcon,
  AssessmentInfoIcon,
} from './AssessmentDetailIcons.jsx';
import { Chip, DetailHeader, Glyph, Tile } from './AssessmentDetailParts.jsx';
import { FOCUS_RING, PAGE_WRAP, RAISED } from './assessmentDetailStyles.js';

const log = debug('AssessmentLibrary');

/*
 * AssessmentLibrary — the body of `/my-assessment/library` (Figma MA-09 Playful 7984:10325 / Focused 8110:34137).
 * Props: data — ASSESSMENT_LIBRARY from assessmentData.js (`GET /assessment/library`). A tablist ("For your skills" ·
 * "Passed" · "All assessments", counts verbatim), a 3-column grid of assessment cards (2 columns below xl, 1 below sm) and
 * the recruiters note. The first card (`emphasis`) is the raised "Recommended" card: Playful 1.5px ink border + hard shelf,
 * Focused hairline + soft shadow. Arrow keys / Home / End move between tabs. Playful = 32px outlined chips, Focused = 22px flat.
 */
const TAB_DOM_ID = (id) => `assessment-tab-${id}`;

const Tabs = ({ tabs, active, onChange }) => {
  const refs = useRef({});
  const onKeyDown = (event, index) => {
    const last = tabs.length - 1;
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft'
          ? (index - 1 + tabs.length) % tabs.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    onChange(tabs[next].id);
    refs.current[tabs[next].id]?.focus();
  };
  return (
    <div
      role="tablist"
      aria-label="Assessments"
      className="flex flex-wrap items-start gap-[4px] border-0 border-b border-solid border-[rgba(28,42,33,0.1)]"
    >
      {tabs.map((tab, i) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[tab.id] = node;
            }}
            id={TAB_DOM_ID(tab.id)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={`${tab.label}, ${tab.count}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => onKeyDown(event, i)}
            className={classNames(
              'inline-flex shrink-0 cursor-pointer items-center gap-[8px] border-0 bg-transparent px-[14px] py-[10px] font-sans text-[15px] leading-[18px] whitespace-nowrap max-lg:min-h-[44px] max-lg:text-[16px]',
              FOCUS_RING,
              selected
                ? 'border-b-[2.5px] border-solid border-[#387440] font-semibold text-[#387440]'
                : 'font-medium text-[#595959]'
            )}
          >
            <span aria-hidden="true">{tab.label}</span>
            <span
              aria-hidden="true"
              data-count={tab.count}
              className={classNames(
                'inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-[7px] py-px font-sans text-[11.5px] leading-[14px] font-bold after:content-[attr(data-count)] max-lg:text-[12px]',
                selected ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2a5730]'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

const CardAction = ({ action }) => {
  if (action.kind === 'primary') {
    return (
      <HubButton
        tone="primary"
        size="lg"
        to={action.to}
        className="w-full"
        rightIcon={<AssessmentButtonArrowIcon />}
      >
        {action.label}
      </HubButton>
    );
  }
  return (
    <HubButton
      tone="secondary"
      size="lg"
      to={action.to ?? undefined}
      disabled={action.disabled}
      onClick={action.to ? undefined : () => log('card action (no destination)', action.label)}
      className={classNames('w-full', action.disabled && 'cursor-not-allowed opacity-50')}
    >
      {action.label}
    </HubButton>
  );
};

const AssessmentCard = ({ card }) => (
  <li
    className={classNames(
      'flex min-w-0 flex-col gap-[12px] rounded-[24px] border border-solid bg-white p-[20px]',
      card.emphasis ? RAISED : 'border-[rgba(28,42,33,0.12)]'
    )}
  >
    <div className="flex items-center justify-between gap-[12px]">
      <Tile
        className={classNames(
          'size-[48px] rounded-[14px]',
          card.tile === 'green' ? 'bg-[#387440] text-white' : 'bg-[#faf4e8] text-[#967014]'
        )}
      >
        <Glyph name={card.icon} className="size-[24px]" />
      </Tile>
      <Chip tone={card.status.tone} icon={card.status.icon}>
        {card.status.label}
      </Chip>
    </div>
    <h3
      className={classNames(
        'm-0 font-sans text-[19px] leading-[23px] font-semibold',
        card.muted ? 'text-[#595959]' : 'text-[#1c2a21]'
      )}
    >
      {card.name}
    </h3>
    <p className="m-0 flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-lg:text-[14px] max-lg:leading-[18px]">
      <AssessmentClockIcon className="size-[13px] shrink-0 text-[#595959]" />
      {card.meta}
    </p>
    <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[14px] max-lg:leading-[20px]">
      {card.body}
    </p>
    <CardAction action={card.action} />
  </li>
);

const AssessmentLibrary = ({ data }) => {
  const [active, setActive] = useState(data.tabs[0].id);
  const cards = data.cards.filter((card) => card.tabs.includes(active));
  const change = (id) => {
    log('tab', id);
    setActive(id);
  };
  return (
    <div className={PAGE_WRAP}>
      <DetailHeader back={data.back} title={data.title} subtitle={data.subtitle} />
      <Tabs tabs={data.tabs} active={active} onChange={change} />
      <div role="tabpanel" aria-labelledby={TAB_DOM_ID(active)}>
        <ul className="m-0 grid list-none grid-cols-1 gap-[20px] p-0 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <AssessmentCard key={card.id} card={card} />
          ))}
        </ul>
      </div>
      <p className="m-0 flex items-start gap-[10px] rounded-[14px] bg-[#f8f8f4] px-[18px] py-[14px] font-sans text-[13.5px] leading-[16px] text-[#595959] max-lg:text-[14px] max-lg:leading-[20px]">
        <AssessmentInfoIcon className="size-[18px] shrink-0 text-[#595959]" />
        {data.note}
      </p>
    </div>
  );
};

export default AssessmentLibrary;
