import { useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import radioOn from '../../../../../assets/parent/wards-radio-on.svg';
import radioOff from '../../../../../assets/parent/wards-radio-off.svg';
import FilterChips from './FilterChips.jsx';
import TabCard from './TabCard.jsx';
import TabRow from './TabRow.jsx';
import { crewData } from './data/tabsData.js';

const log = debug('CrewTab');

/*
 * CrewTab — PW-16 10105:2989, content under the ward header + tabs: left column (flex 1, gap 20) + 400px "Circle rules" card (gap 24).
 * Left: filter chips (All · 6 / Classmates · 4 / Verified mentors · 2), card "In Abena’s crew" (6 photo rows: tag + "Report a concern"), card "Waiting for Abena · 1" (tag only).
 * Tags 12/600 px10 py4 r999: Peer #e8f2ed/#387440, Verified mentor #e6eefa/#2554aa, "Abena decides" #fff4d6/#8c620a.
 * Right: 14-gap card, 3 radio options r14 (selected = #f1f6f2 + 1.5px #387440) and the #faf8f0 "What you can see" note.
 * Props: ward (wardsData entry).
 * ⚠️ ASSUMPTION: "Report a concern" only logs; the radio is local state (Figma shows "Classmates and verified mentors" selected); photo rows are circles (Figma exports square PNG, 40px).
 */
const TAGS = {
  Peer: 'bg-[#e8f2ed] text-[#387440]',
  'Verified mentor': 'bg-[#e6eefa] text-[#2554aa]',
  decides: 'bg-[#fff4d6] text-[#8c620a]',
};

const Tag = ({ kind, children }) => (
  <span
    className={`shrink-0 rounded-full px-[10px] py-[4px] font-sans text-[12px] leading-normal font-semibold whitespace-nowrap ${TAGS[kind] ?? TAGS.decides}`}
  >
    {children}
  </span>
);

const CrewTab = ({ ward }) => {
  const d = crewData(ward);
  const [rule, setRule] = useState(d.rules[0].id);
  log('render, ward:', ward.id, 'crew:', d.crew.length, 'rule:', rule);
  return (
    <div className="flex w-full min-w-0 flex-col gap-[24px] lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-col gap-[20px] lg:flex-1">
        <FilterChips items={d.filters} label="Filter crew" />
        <TabCard title={d.crewLabel} variant="label" id="crew-list">
          <ul className="m-0 flex list-none flex-col p-0">
            {d.crew.map((p, i) => (
              <TabRow
                key={p.id}
                photo={p.photo}
                title={p.name}
                sub={p.sub}
                last={i === d.crew.length - 1}
              >
                <Tag kind={p.tag}>{p.tag}</Tag>
                <button
                  type="button"
                  onClick={() => log('report a concern:', p.id)}
                  className="shrink-0 cursor-pointer rounded-[4px] border-0 bg-transparent p-0 font-sans text-[13px] leading-normal font-medium whitespace-nowrap text-[#787876] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  Report a concern
                </button>
              </TabRow>
            ))}
          </ul>
        </TabCard>
        <TabCard title={d.waitingLabel} variant="label" id="crew-waiting">
          <ul className="m-0 flex list-none flex-col p-0">
            {d.waiting.map((p, i) => (
              <TabRow
                key={p.id}
                photo={p.photo}
                title={p.name}
                sub={p.sub}
                last={i === d.waiting.length - 1}
              >
                <Tag kind="decides">{p.tag}</Tag>
              </TabRow>
            ))}
          </ul>
        </TabCard>
      </div>
      <TabCard
        title={d.rulesTitle}
        variant="label"
        id="crew-rules"
        gap={14}
        className="lg:w-[400px] lg:shrink-0"
      >
        <div role="radiogroup" aria-labelledby="crew-rules" className="flex flex-col gap-[14px]">
          {d.rules.map((r) => {
            const on = r.id === rule;
            return (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  log('rule:', r.id);
                  setRule(r.id);
                }}
                className={`flex w-full cursor-pointer gap-[12px] rounded-[14px] px-[14px] py-[12px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] ${
                  on
                    ? 'border-[1.5px] border-solid border-[#387440] bg-[#f1f6f2]'
                    : 'border border-solid border-[#e7e7e7] bg-white'
                }`}
              >
                <img src={on ? radioOn : radioOff} alt="" className="size-[18px] shrink-0" />
                <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <span className="font-sans text-[14px] leading-normal font-semibold text-[#1c2a21]">
                    {r.title}
                  </span>
                  <span className="font-sans text-[12px] leading-normal text-[#6e6e6c]">
                    {r.body}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-[6px] rounded-[14px] bg-[#faf8f0] p-[14px]">
          <p className="m-0 font-sans text-[13px] leading-normal font-semibold text-[#1c2a21]">
            {d.seeTitle}
          </p>
          {d.see.map((line) => (
            <p key={line} className="m-0 font-sans text-[12px] leading-normal text-[#595959]">
              {line}
            </p>
          ))}
        </div>
      </TabCard>
    </div>
  );
};

export default CrewTab;
