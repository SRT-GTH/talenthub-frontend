import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import bulbArt from '../../../../assets/admin/flag-bulb-art.svg';
import {
  AdminArrowRightIcon,
  AdminMagnifierIcon,
  AdminMenuMeatballIcon,
  AdminRefreshIcon,
  AdminSendIcon,
  AdminWarningIcon,
} from '../adminIcons.jsx';
import { FLAG_HEAD, FLAG_LIST, FLAG_THREAD } from './data/adminModerationData.js';

const log = debug('FlagDetailView');

/*
 * FlagDetailView — /admin/moderation/flags/:id (Figma 7.2.2a "Moderation · Flag detail" 8627:1048 and the dialogs on top of it): title "Flag FL-2291" 32/40 600 +
 * 16 #999 sub line · left card (371, r24: search 45 high r12, Mine (3) / All (11) pills + refresh, the flag list with 53 round warning avatars, a "01" / "02"
 * counter pill and a divider between rows) · right card (948, r24: the thread header pill with a "…" menu, the "40m" time chip, the reported message bubble, the REPORT
 * card with the light-bulb art, the hint bubble, the decision bar Dismiss · Warn author · Escalate · "Remove content →", the internal-note field with a 37 round send button).
 * Props: onDecide(id) — 'dismiss' | 'warn' | 'escalate' | 'remove'.
 * ⚠️ ASSUMPTION: the reported message bubble is drawn 93 px wide in Figma (its text wraps to a 260 px tall column): it is drawn as a normal right-aligned bubble;
 * the flag list, the search, refresh and "…" only log; the note field is local (no send flow is drawn); "Warn author" opens the community warn dialog's twin
 * (onDecide('warn') is handled by the page).
 */

const Avatar = () => (
  <span
    aria-hidden="true"
    className="grid size-[53px] shrink-0 place-items-center rounded-full bg-[#ebf1ec] text-[#387440]"
  >
    <AdminWarningIcon className="size-[20px]" />
  </span>
);

const FlagDetailView = ({ onDecide, active = FLAG_LIST.items[0].id, listTab = 'mine', onTab }) => {
  const [note, setNote] = useState('');
  const send = (e) => {
    e.preventDefault();
    log('internal note (no send flow drawn)', note.length);
    setNote('');
  };
  return (
    <div className="flex flex-col gap-[24px] pt-[4px]">
      <header className="flex flex-col gap-[3px]">
        <h1 className="m-0 font-sans text-[32px] leading-[40px] font-semibold text-[#1c2a21]">
          {FLAG_HEAD.title}
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999999]">{FLAG_HEAD.sub}</p>
      </header>

      <div className="grid grid-cols-1 items-start gap-[10px] lg:grid-cols-[minmax(300px,371fr)_minmax(0,948fr)]">
        <aside
          aria-label="Flags"
          className="flex min-h-[845px] flex-col gap-[16px] rounded-[24px] border border-solid border-[#e5e5e5] bg-white px-[22px] py-[28px]"
        >
          <label className="flex h-[45px] items-center gap-[10px] rounded-[12px] border border-solid border-[#cccccc] bg-white px-[16px]">
            <AdminMagnifierIcon className="size-[16px] shrink-0 text-[#999999]" />
            <input
              type="search"
              aria-label="Search flags"
              placeholder={FLAG_LIST.search}
              className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[13px] text-[#1c2a21] outline-none placeholder:text-[#999999]"
            />
          </label>
          <div className="flex items-center gap-[16px]">
            <div role="tablist" aria-label="Flag list" className="flex items-center gap-[6px]">
              {FLAG_LIST.tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={listTab === t.id}
                  onClick={() => onTab?.(t.id)}
                  className={classNames(
                    'inline-flex h-[33px] cursor-pointer items-center gap-[5px] rounded-full border border-solid px-[14px] font-sans text-[14.6px] leading-[25px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                    listTab === t.id
                      ? 'border-[#e1eae2] bg-[#387440] font-semibold text-white'
                      : 'border-[#e1eae2] bg-white font-medium text-[#737373]'
                  )}
                >
                  {t.label}
                  <span className="font-medium">({t.count})</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Refresh"
              onClick={() => log('refresh (no flow drawn)')}
              className="ml-auto grid size-[20px] cursor-pointer place-items-center border-0 bg-transparent text-[#387440]"
            >
              <AdminRefreshIcon className="size-[20px]" />
            </button>
          </div>
          <ul className="m-0 flex list-none flex-col gap-[7px] p-0">
            {FLAG_LIST.items.map((f, i) => (
              <li
                key={f.id}
                className={classNames(i > 0 && 'border-t border-solid border-[#f2f2f2] pt-[7px]')}
              >
                <button
                  type="button"
                  onClick={() => log('open flag (only FL-2291 is drawn)', f.id)}
                  aria-current={f.id === active ? 'true' : undefined}
                  className={classNames(
                    'flex w-full cursor-pointer items-center gap-[12px] rounded-[12px] border border-solid bg-white px-[10px] py-[12px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                    f.id === active
                      ? 'border-[#e1eae2] shadow-[0_1px_2px_rgba(15,15,10,0.05)]'
                      : 'border-transparent'
                  )}
                >
                  <Avatar />
                  <span className="flex min-w-0 flex-1 flex-col gap-[7px]">
                    <span className="flex items-center justify-between gap-[10px]">
                      <span className="truncate font-sans text-[15px] leading-[18px] font-medium text-[#1c2a21]">
                        {f.title}
                      </span>
                      <span className="shrink-0 font-sans text-[13px] leading-[16px] text-[#737373]">
                        {f.time}
                      </span>
                    </span>
                    <span className="flex items-center justify-between gap-[10px]">
                      <span className="flex items-center gap-[6px] font-sans text-[13.5px] leading-[17px] text-[#737373]">
                        {f.dot ? (
                          <span
                            aria-hidden="true"
                            className="size-[6px] rounded-full bg-[#387440]"
                          />
                        ) : null}
                        {f.sub}
                      </span>
                      {f.count ? (
                        <span className="inline-flex rounded-full border border-solid border-[#1c2a21]/20 bg-[#387440] px-[6px] py-[3px] font-sans text-[11px] leading-[13px] font-medium text-white">
                          {f.count}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section
          aria-label={FLAG_THREAD.title}
          className="relative flex min-h-[845px] flex-col rounded-[24px] border border-solid border-[#e5e5e5] bg-white px-[22px] pt-[18px] pb-[14px]"
        >
          <div className="flex items-center gap-[16px] rounded-full border border-solid border-[#e5e5e5] px-[12px] py-[8px]">
            <Avatar />
            <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
              <p className="m-0 font-sans text-[16px] leading-[19px] font-medium text-[#1c2a21]">
                {FLAG_THREAD.title}
              </p>
              <p className="m-0 font-sans text-[14px] leading-[17px] text-[#737373]">
                {FLAG_THREAD.sub}
              </p>
            </div>
            <button
              type="button"
              aria-label="More"
              onClick={() => log('thread menu (no menu drawn)')}
              className="grid h-[24px] w-[41px] cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#1c2a21]"
            >
              <AdminMenuMeatballIcon className="h-[2px] w-[19px]" />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-[15px] pt-[32px] pb-[24px]">
            <span className="mx-auto inline-flex rounded-full bg-[#e5e5e5]/50 px-[14px] py-[6px] font-sans text-[13px] leading-[16px] text-[#595959]">
              {FLAG_THREAD.time}
            </span>
            <div className="ml-auto flex max-w-[460px] flex-col gap-[2px] rounded-[12px] bg-[#e5e5e5]/50 px-[16px] pt-[14px] pb-[8px]">
              <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
                {FLAG_THREAD.message.text}
              </p>
              <p className="m-0 flex items-center gap-[4px] font-sans text-[12px] leading-[14px] text-[#babab7]">
                {FLAG_THREAD.message.time}
                <span className="font-medium text-[#1d7c4d]">{FLAG_THREAD.message.read}</span>
              </p>
            </div>
            <div className="relative ml-auto flex w-[299px] max-w-full flex-col gap-[10px] rounded-[10px] border border-solid border-[#e1eae2] bg-[linear-gradient(135deg,#ffffff,#f3f8f4)] px-[18px] pt-[24px] pb-[18px]">
              <img
                src={bulbArt}
                alt=""
                draggable="false"
                className="pointer-events-none absolute -top-[18px] -right-[28px] size-[73px]"
              />
              <div className="flex flex-col gap-[2px]">
                <p className="m-0 font-sans text-[12px] leading-[14px] font-medium text-[#387440]">
                  {FLAG_THREAD.report.eyebrow}
                </p>
                <p className="m-0 font-sans text-[16px] leading-[19px] font-medium text-[#1c2a21]">
                  {FLAG_THREAD.report.title}
                </p>
                <p className="m-0 font-sans text-[14px] leading-[20px] text-[#999999]">
                  {FLAG_THREAD.report.reporter}
                </p>
                <p className="m-0 pt-[6px] font-sans text-[14px] leading-[20px] text-[#1d7c4d]">
                  {FLAG_THREAD.report.pattern}
                </p>
              </div>
              <p className="m-0 font-sans text-[12px] leading-[14px] text-[#959592]">
                {FLAG_THREAD.report.alert}
              </p>
            </div>
            <div className="ml-auto flex w-[448px] max-w-full flex-col gap-[2px] rounded-[12px] bg-[#e5e5e5]/50 px-[16px] pt-[14px] pb-[8px]">
              <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
                {FLAG_THREAD.hint.text}
              </p>
              <p className="m-0 flex items-center gap-[4px] font-sans text-[12px] leading-[14px] text-[#babab7]">
                {FLAG_THREAD.hint.time}
                <span className="font-medium text-[#1d7c4d]">{FLAG_THREAD.hint.read}</span>
              </p>
            </div>
            <div className="mt-auto flex flex-wrap items-center justify-end gap-[12px] pt-[16px]">
              {FLAG_THREAD.decisions.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onDecide(d.id)}
                  className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  {d.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onDecide('remove')}
                className="inline-flex h-[44px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-semibold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {FLAG_THREAD.primary}
                <AdminArrowRightIcon className="size-[20px]" />
              </button>
            </div>
          </div>

          <form
            onSubmit={send}
            className="flex h-[60px] items-center gap-[16px] rounded-full border border-solid border-[#e5e5e5] py-[12px] pr-[12px] pl-[20px]"
          >
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              aria-label="Internal note"
              placeholder={FLAG_THREAD.notePlaceholder}
              className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[14px] text-[#1c2a21] outline-none placeholder:text-[#999999]"
            />
            <button
              type="submit"
              aria-label="Add note"
              className="grid size-[36px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#387440] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <AdminSendIcon className="size-[16px]" />
            </button>
          </form>
        </section>
      </div>
      <Link to="/admin/moderation" className="sr-only">
        Back to the flag queue
      </Link>
    </div>
  );
};

export default FlagDetailView;
