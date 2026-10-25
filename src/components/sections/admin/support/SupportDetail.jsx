import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { DETAIL } from './data/adminSupportData.js';

const log = debug('SupportDetail');

/*
 * SupportDetail — /admin/support/:queryId (Figma 7.7.1b "Query detail" 8666:416513; 7.7.1c / 7.7.1d draw the same page behind their dialogs): title "Query SUP-10451" 32/40 600 +
 * #999 sub · a 371 wide list card (search, Mine (3) / All (9), the four queries with a 01 / 02 badge) next to the conversation card (monogram + title + "···" menu,
 * the "6h" waited pill, Kofi's message bubble, the ACCOUNT card, the grey note bubble, the reply pill). Cards: white, 1.2px #00522b, r24.
 * ⚠️ ASSUMPTION: the list rows are inert (one query is drawn); the "···" menu (Reply with template / Escalate to Senior Admin) and the reply pill are how the two dialogs open (the
 * frames do not draw the trigger). Figma draws the message bubble 93 px wide (an auto-layout accident); here it is as wide as its text.
 * Props: onReply(), onEscalate().
 */

const Row = ({ item }) => (
  <li
    className={classNames(
      'flex items-center gap-[12px] rounded-[12px] px-[10px] py-[12px]',
      item.selected && 'border border-solid border-[#00522b] bg-white'
    )}
  >
    <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
      <span className="truncate font-sans text-[15px] leading-[18px] font-medium text-[#1c2a21]">
        {item.title}
      </span>
      <span className="font-sans text-[13.5px] leading-[16px] text-[#737373]">{item.status}</span>
    </div>
    <div className="flex flex-col items-end gap-[6px]">
      <span className="font-sans text-[13px] leading-[16px] text-[#737373]">{item.age}</span>
      {item.badge ? (
        <span className="rounded-full bg-[#ebf1ec] px-[7px] py-px font-sans text-[11px] leading-[13px] font-medium text-[#2d5d33]">
          {item.badge}
        </span>
      ) : null}
    </div>
  </li>
);

const Bubble = ({ text, time, read, className }) => (
  <div
    className={classNames(
      'self-end rounded-[12px] bg-[#e5e5e5]/50 px-[16px] pt-[14px] pb-[8px]',
      className
    )}
  >
    <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">{text}</p>
    <p className="m-0 mt-[4px] flex justify-end gap-[8px] font-sans text-[12px] leading-[14px] text-[#babab7]">
      {time}
      <span className="font-medium text-[#1d7c4d]">{read}</span>
    </p>
  </div>
);

const SupportDetail = ({ onReply, onEscalate }) => {
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('mine');
  const pick = (id) => {
    setMenu(false);
    if (id === 'reply') onReply();
    else onEscalate();
  };
  return (
    <div className="flex flex-col gap-[24px] font-sans">
      <div className="flex flex-col gap-[3px]">
        <h1 className="m-0 text-[32px] leading-[40px] font-semibold text-[#1c2a21]">
          {DETAIL.title}
        </h1>
        <p className="m-0 text-[16px] leading-[24px] text-[#999999]">{DETAIL.sub}</p>
      </div>
      <div className="flex flex-col gap-[10px] lg:flex-row">
        <aside
          aria-label="Queries"
          className="flex w-full shrink-0 flex-col gap-[16px] rounded-[24px] border border-solid border-[#00522b] bg-white px-[22px] py-[28px] lg:w-[371px]"
        >
          <input
            type="search"
            aria-label="Search queries"
            placeholder={DETAIL.searchPlaceholder}
            className="h-[45px] rounded-[12px] border border-solid border-[#cccccc] bg-white px-[16px] font-sans text-[13px] outline-none focus:border-[#387440]"
          />
          <div className="flex gap-[6px]">
            {DETAIL.filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => {
                  log('filter', f.id);
                  setFilter(f.id);
                }}
                className={classNames(
                  'cursor-pointer rounded-full border border-solid border-[#e1eae2] px-[14px] py-[4px] font-sans text-[14px] leading-[25px] font-semibold',
                  filter === f.id ? 'bg-[#387440] text-white' : 'bg-white text-[#737373]'
                )}
              >
                {f.label} {f.count}
              </button>
            ))}
          </div>
          <ul className="m-0 flex list-none flex-col gap-[4px] p-0">
            {DETAIL.list.map((it) => (
              <Row key={it.id} item={it} />
            ))}
          </ul>
        </aside>
        <section
          aria-label={DETAIL.header.title}
          className="flex min-h-[640px] min-w-0 flex-1 flex-col gap-[28px] rounded-[24px] border border-solid border-[#00522b] bg-white px-[22px] py-[18px]"
        >
          <header className="flex items-center gap-[14px] rounded-full border border-solid border-[#00522b] px-[12px] py-[8px]">
            <span className="grid size-[53px] shrink-0 place-items-center rounded-full bg-[#387440] text-[20px] font-semibold text-white">
              {DETAIL.header.monogram}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
              <span className="text-[16px] leading-[19px] font-medium text-[#1c2a21]">
                {DETAIL.header.title}
              </span>
              <span className="text-[14px] leading-[17px] text-[#737373]">{DETAIL.header.sub}</span>
            </div>
            <div className="relative">
              <button
                type="button"
                aria-label="Query actions"
                aria-expanded={menu}
                onClick={() => setMenu((v) => !v)}
                className="grid h-[24px] w-[41px] cursor-pointer place-items-center rounded-full border border-solid border-[#e1eae2] bg-white text-[#1c2a21]"
              >
                ···
              </button>
              {menu ? (
                <ul
                  role="menu"
                  className="absolute top-[32px] right-0 z-10 m-0 w-[220px] list-none rounded-[12px] border border-solid border-[#e1eae2] bg-white p-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                >
                  {DETAIL.menu.map((m) => (
                    <li key={m.id} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => pick(m.id)}
                        className="w-full cursor-pointer rounded-[8px] border-0 bg-transparent px-[10px] py-[9px] text-left font-sans text-[14px] text-[#1c2a21] hover:bg-[#f8f8f4]"
                      >
                        {m.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </header>
          <div className="flex flex-col gap-[14px]">
            <span className="self-center rounded-full bg-[#e5e5e5]/50 px-[14px] py-[6px] text-[13px] leading-[16px] text-[#595959]">
              {DETAIL.waited}
            </span>
            <Bubble {...DETAIL.message} className="max-w-[480px]" />
            <div className="flex w-full max-w-[299px] flex-col gap-[10px] self-end rounded-[10px] border border-solid border-[#00522b] bg-linear-to-b from-[#f4f9f4] to-[#ebf1ec] px-[18px] pt-[24px] pb-[18px]">
              <span className="text-[12px] leading-[14px] font-medium text-[#387440]">
                {DETAIL.account.label}
              </span>
              <span className="text-[16px] leading-[19px] font-medium text-[#1c2a21]">
                {DETAIL.account.name}
              </span>
              <span className="text-[14px] leading-[20px] text-[#999999]">
                {DETAIL.account.status}
              </span>
              <span className="text-[14px] leading-[20px] text-[#1d7c4d]">
                {DETAIL.account.check}
              </span>
              <span className="text-[12px] leading-[14px] text-[#959592]">
                {DETAIL.account.hint}
              </span>
            </div>
            <Bubble {...DETAIL.note} className="max-w-[421px]" />
          </div>
          <button
            type="button"
            onClick={onReply}
            className="mt-auto flex h-[60px] w-full cursor-pointer items-center justify-between rounded-full border border-solid border-[#00522b] bg-white pr-[12px] pl-[20px] text-left font-sans text-[14px] text-[#999999]"
          >
            {DETAIL.replyPlaceholder}
            <span
              aria-hidden="true"
              className="grid size-[36px] place-items-center rounded-full bg-[#387440] text-white"
            >
              ➤
            </span>
          </button>
        </section>
      </div>
    </div>
  );
};

export default SupportDetail;
