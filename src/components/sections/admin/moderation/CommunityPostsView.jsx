import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import AgencyButton from '../../agency/AgencyButton.jsx';
import { AgencyChevronDownIcon } from '../../agency/agencyIcons.jsx';
import {
  AdminBookmarkIcon,
  AdminCheckIcon,
  AdminClockIcon,
  AdminMagnifierIcon,
  AdminSparkIcon,
} from '../adminIcons.jsx';
import { POSTS } from './data/adminModerationData.js';

const log = debug('CommunityPostsView');

/*
 * CommunityPostsView — /admin/moderation/posts (Figma 7.2.4a "Moderation · Community posts" 8629:4149): title 34/41 600 + "42 new today" sticker · sub copy · the
 * queue tabs (All 1,204 · Escalated 2 · Reported 4 selected · Removed 7) · toolbar (chips, cards toggle selected, "Newest" select, "Community moderator escalation") ·
 * cream banner · three post cards in a grid (white, 1px #e1eae2, r22: community line with the save button and a status tag, the quoted post 20/600, author + purpose
 * lines, a #ebf1ec reports strip with a bar, three chips, footer text and a "Review post" / "Restore" button). A removed post is drawn at 50 %.
 * Props: data (useAdminState()), onReview(post), onRestore(post).
 * ⚠️ ASSUMPTION: tabs, chips, select and the escalation button only log; "Review post" opens the warn-the-author dialog (the one post-level flow drawn, 7.2.4b).
 */

const Card = ({ p, onReview, onRestore }) => (
  <li
    className={classNames(
      'flex min-w-0 flex-col gap-[14px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[18px]',
      p.muted && 'opacity-60'
    )}
  >
    <div className="flex items-start gap-[10px]">
      <span
        aria-hidden="true"
        className="grid size-[38px] shrink-0 place-items-center rounded-[12px] bg-[#ebf1ec] text-[#387440]"
      >
        <AdminSparkIcon className="size-[18px]" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[1px]">
        <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          {p.community}
        </p>
        <p className="m-0 font-sans text-[12.5px] leading-[15px] text-[#737373]">{p.posted}</p>
      </div>
      {p.tag ? (
        <span className="inline-flex shrink-0 items-center rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[11.5px] leading-[14px] font-bold text-[#1f4a2b]">
          {p.tag}
        </span>
      ) : null}
      <button
        type="button"
        aria-label="Save post"
        onClick={() => log('save (no flow drawn)', p.id)}
        className="grid size-[30px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#1c2a21] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <AdminBookmarkIcon className="size-[13px]" />
      </button>
    </div>
    <p className="m-0 font-sans text-[20px] leading-[26px] font-semibold text-[#1c2a21]">
      {p.text}
    </p>
    <div className="flex flex-col gap-[6px] font-sans text-[12.5px] leading-[15px] text-[#595959]">
      <p className="m-0 flex items-center gap-[6px]">
        <AdminClockIcon className="size-[13px] shrink-0 text-[#595959]" />
        {p.author}
      </p>
      <p className="m-0 flex items-center gap-[6px]">
        <AdminSparkIcon className="size-[13px] shrink-0 text-[#595959]" />
        {p.purpose}
      </p>
      <p className="m-0 flex items-center gap-[6px]">
        <AdminCheckIcon className="size-[13px] shrink-0 text-[#595959]" />
        {p.looks}
      </p>
    </div>
    <div className="flex flex-col gap-[8px] rounded-[14px] bg-[#ebf1ec] px-[14px] py-[12px]">
      <div className="flex items-center gap-[8px]">
        <span className="font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
          {p.reports}
        </span>
        <span className="font-sans text-[13px] leading-[16px] text-[#595959]">reports</span>
        <span
          aria-hidden="true"
          className="ml-auto h-[6px] w-[80px] overflow-hidden rounded-full bg-[#e1eae2]"
        >
          <span
            className="block h-full rounded-full"
            style={{ width: `${Math.round(p.fill * 100)}%`, background: p.fillColor }}
          />
        </span>
      </div>
      <div className="flex flex-wrap gap-[6px]">
        {p.chips.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-[4px] rounded-full border border-solid border-[#c1d4c4] bg-white px-[9px] py-[3px] font-sans text-[11.5px] leading-[14px] font-semibold text-[#2d5d33]"
          >
            <AdminCheckIcon className="size-[11px]" />
            {c}
          </span>
        ))}
      </div>
    </div>
    <div className="mt-auto flex items-center justify-between gap-[10px]">
      <p className="m-0 font-sans text-[12.5px] leading-[15px] text-[#737373]">{p.foot}</p>
      {p.actionStrong ? (
        <button
          type="button"
          onClick={() => onReview(p)}
          className="inline-flex h-[44px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {p.action}
        </button>
      ) : (
        <AgencyButton size="md" onClick={() => (p.muted ? onRestore(p) : onReview(p))}>
          {p.action}
        </AgencyButton>
      )}
    </div>
  </li>
);

const CommunityPostsView = ({ data, onReview, onRestore }) => {
  const tab = data.tab ?? POSTS.defaultTab;
  const chip = data.params.get('chip') ?? 'all';
  return (
    <div className="flex flex-col gap-[24px] pt-[4px]">
      <header className="flex flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 font-sans text-[34px] leading-[41px] font-semibold text-[#1c2a21]">
            {POSTS.title}
          </h1>
          <span className="inline-flex h-[26px] items-center rounded-full bg-[#ebf1ec] px-[11px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
            {POSTS.sticker}
          </span>
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#737373]">{POSTS.subtitle}</p>
      </header>
      <div className="flex flex-col gap-[18px]">
        <div role="tablist" aria-label="Post lists" className="flex flex-wrap gap-[4px]">
          {POSTS.tabs.map((t) => {
            const sel = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={sel}
                onClick={() => data.update({ tab: t.id })}
                className={classNames(
                  'relative inline-flex h-[43px] cursor-pointer items-center gap-[8px] border-0 bg-transparent px-[14px] pt-[10px] pb-[12px] font-sans text-[15px] leading-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                  sel ? 'font-semibold text-[#1c2a21]' : 'font-medium text-[#737373]'
                )}
              >
                {t.label}
                <span
                  className={classNames(
                    'inline-flex rounded-full px-[7px] py-px text-[11.5px] leading-[14px] font-bold',
                    sel ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
                  )}
                >
                  {t.count}
                </span>
                {sel ? (
                  <span
                    aria-hidden="true"
                    className="absolute right-0 bottom-0 left-0 h-[2px] bg-[#1c2a21]"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-[8px]">
          <label className="hidden h-[34px] items-center gap-[8px] rounded-full border border-solid border-[#e1eae2] bg-white px-[12px] md:flex">
            <AdminMagnifierIcon className="size-[14px] text-[#999999]" />
            <input
              type="search"
              aria-label="Search posts or authors"
              placeholder="Search posts or authors"
              className="w-[180px] border-0 bg-transparent font-sans text-[13px] outline-none placeholder:text-[#999999]"
            />
          </label>
          {POSTS.chips.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={chip === c.id}
              onClick={() => data.update({ chip: c.id === 'all' ? null : c.id })}
              className={classNames(
                'inline-flex h-[32px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                chip === c.id
                  ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                  : 'border-[#e1eae2] bg-white text-[#595959]'
              )}
            >
              {c.label}
            </button>
          ))}
          <span className="hidden flex-1 md:block" />
          <button
            type="button"
            onClick={() => log('sort select (no menu drawn)')}
            className="inline-flex h-[34px] cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white pr-[12px] pl-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959]"
          >
            {POSTS.sort}
            <AgencyChevronDownIcon className="size-[14px]" />
          </button>
          <AgencyButton
            size="xs"
            onClick={() => log('community moderator escalation (no flow drawn)')}
          >
            {POSTS.action}
          </AgencyButton>
        </div>
        <p className="m-0 flex items-center gap-[14px] rounded-[20px] border border-solid border-[#eedeb8] bg-[#faf4e8] px-[18px] py-[14px] pl-[14px] font-sans text-[14px] leading-[20px] font-medium text-[#1c2a21]">
          <AdminClockIcon className="size-[18px] shrink-0 text-[#c8951a]" />
          {POSTS.banner}
        </p>
        <ul className="m-0 grid list-none grid-cols-1 gap-[18px] p-0 md:grid-cols-2 xl:grid-cols-3">
          {POSTS.cards.map((p) => (
            <Card key={p.id} p={p} onReview={onReview} onRestore={onRestore} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommunityPostsView;
