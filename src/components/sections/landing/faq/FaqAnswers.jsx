import { useState } from 'react';
import LandingFaqItem from '../shared/LandingFaqItem.jsx';
import { FAQ_CATEGORIES, FAQ_DEFAULT_OPEN, FAQ_GROUPS } from './FaqData.js';
import { classNames } from '../../../../utils/classNames.js';
import { smoothScrollTo } from '../../../../utils/smoothScrollTo.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('FaqAnswers');

const topicsOffset = () => {
  const nav = document.querySelector('[data-landing-nav]')?.offsetHeight ?? 0;
  const topics = document.querySelector('[data-faq-topics]');
  const stuck =
    topics && getComputedStyle(topics).flexDirection === 'row' ? topics.offsetHeight : 0; // xl is a side column
  return nav + stuck + 16;
};

const CARD_SHADOW = 'shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]';

/* Topic list. Desktop: 320px card, vertical (Figma 7797:31736). Tablet / mobile: one horizontally scrolling row of pills (7815:301715). */
const Categories = ({ active, onSelect }) => (
  <nav
    aria-label="Browse by topic"
    data-faq-topics
    className={classNames(
      'flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
      // phones / tablets: the pill row sticks under the fixed nav (72 / 88px) while the answers scroll (product owner, 2026-11-14)
      'sticky top-[72px] z-20 -mx-5 bg-[#fbf3e4]/95 px-5 py-3 shadow-[0_6px_12px_-8px_rgba(28,42,33,0.25)] backdrop-blur-md md:top-[88px] md:-mx-10 md:px-10',
      'xl:mx-0 xl:shadow-none xl:backdrop-blur-none',
      'xl:sticky xl:top-[124px] xl:h-fit xl:w-[320px] xl:shrink-0 xl:flex-col xl:items-stretch xl:gap-4 xl:overflow-visible xl:rounded-[26px] xl:border-[1.4px] xl:border-[#1c2a21]/[.32] xl:bg-[#fffdf7] xl:p-5',
      'xl:shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]'
    )}
  >
    <h2 className="m-0 hidden shrink-0 whitespace-nowrap pr-1 font-heading xl:block text-[19px] font-semibold leading-[23.8px] text-[#1c2a21]">
      Browse by topic
    </h2>
    {FAQ_CATEGORIES.map((cat) => {
      const { id, label, count } = cat;
      const Icon = cat.Icon;
      const isActive = id === active;
      return (
        <button
          key={id}
          type="button"
          aria-current={isActive ? 'true' : undefined}
          onClick={() => onSelect(id)}
          className={classNames(
            'flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-[20px] border-[1.5px] px-[14px] py-[9px] text-left font-sans text-[14px] leading-[16.7px] text-[#1c2a21]',
            'xl:w-full xl:gap-[10px] xl:rounded-[14px] xl:py-[10px] xl:pl-[10px] xl:pr-3',
            isActive
              ? 'border-[#1c2a21] bg-[#ffd86b] font-bold'
              : 'border-[#1c2a21] bg-[#fffdf7] font-medium xl:border-transparent'
          )}
        >
          <Icon size={18} className={isActive ? 'text-[#1c2a21]' : 'text-[#387440]'} />
          <span>{label}</span>
          <span
            className={classNames(
              'text-[12px] font-bold leading-[14.3px] xl:ml-auto',
              isActive ? 'text-[#1c2a21]' : 'text-[#595959]'
            )}
          >
            {count}
          </span>
        </button>
      );
    })}
  </nav>
);

/*
 * FaqAnswers — "Section · Answers" (Figma 7797:31734, 1728x1703, gradient #fbf3e4 → #f1ede2, pad 100/96).
 * Row gap 40: Categories (320) | groups column 1000 (gap 36; group = Bricolage 29/600 title + gap 24 + items). First item drawn open.
 * Accordion: one open at a time. Topic click highlights it and scrolls to its group when that group exists (the last four topics have none drawn).
 */
const FaqAnswers = () => {
  const [active, setActive] = useState(FAQ_CATEGORIES[0].id);
  const [openId, setOpenId] = useState(FAQ_DEFAULT_OPEN);
  log('render', { active, openId });

  const selectCategory = (id) => {
    const cat = FAQ_CATEGORIES.find((c) => c.id === id);
    log('category selected', { id, group: cat?.group });
    setActive(id);
    if (cat?.group) {
      // land the group title below the fixed nav and, under xl, below the sticky topic row (smooth on iOS too)
      smoothScrollTo(document.getElementById(`faq-group-${cat.group}`), { offset: topicsOffset });
    }
  };

  return (
    <section className="bg-[linear-gradient(180deg,#fbf3e4_0%,#f1ede2_100%)] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-5 md:gap-7 xl:flex-row xl:items-start xl:gap-10">
        <Categories active={active} onSelect={selectCategory} />
        <div className="flex min-w-0 flex-1 flex-col gap-5 md:gap-9 xl:max-w-[1000px]">
          {FAQ_GROUPS.map((g) => (
            <section
              key={g.id}
              id={`faq-group-${g.id}`}
              aria-labelledby={`faq-title-${g.id}`}
              className="flex scroll-mt-[124px] flex-col gap-6"
            >
              <h2
                id={`faq-title-${g.id}`}
                className="m-0 font-heading text-[clamp(24px,calc(17px+0.8vw),29px)] font-semibold leading-[1.2] text-[#1c2a21]"
              >
                {g.title}
              </h2>
              <div className="flex flex-col gap-6">
                {g.items.map((item) => (
                  <LandingFaqItem
                    key={item.id}
                    id={item.id}
                    question={item.q}
                    answer={item.a}
                    open={openId === item.id}
                    onToggle={() => {
                      const next = openId === item.id ? null : item.id;
                      log('accordion toggle', { id: item.id, open: next !== null });
                      setOpenId(next);
                    }}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqAnswers;
