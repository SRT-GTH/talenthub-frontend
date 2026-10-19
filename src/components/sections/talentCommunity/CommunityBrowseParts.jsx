import { useEffect, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import headDoodleGold from '../../../assets/talent-community/browse/head-doodle-gold.svg';
import headDoodleGreen from '../../../assets/talent-community/browse/head-doodle-green.svg';
import headDoodleRing from '../../../assets/talent-community/browse/head-doodle-ring.svg';
import headDoodleSquiggle from '../../../assets/talent-community/browse/head-doodle-squiggle.svg';
import headFlame from '../../../assets/talent-community/browse/head-flame.svg';
import headSparkle from '../../../assets/talent-community/browse/head-sparkle.svg';
import {
  COMMUNITY_BROWSE_COPY as COPY,
  COMMUNITY_CATEGORIES,
  COMMUNITY_HEADER_FACES,
} from './communityData.js';
import {
  CommunitySearchBigIcon,
  CommunitySearchIcon,
  CommunityPlusIcon,
} from './communityBrowseIcons.jsx';
import { CommunityButton, CommunityChip, CommunitySticker } from './CommunityParts.jsx';
import { EMPHASIS_SURFACE, FOCUS_RING, HEADING } from './communityStyles.js';

const log = debug('CommunityBrowseParts');

/*
 * Browse-screen pieces for /community (Figma C-01 … C-16). Page: src/pages/talentCommunity/CommunityBrowsePage.jsx.
 * Desktop column is 1329px wide (x343) with a 24px gap; chips + search toolbar; cards in 300px tracks (20px row gap).
 */

/* The decoration sticker row of the "GTH · Messages header art" instance (Playful only, hidden in Focused and below xl). */
const HeaderDecor = () => (
  <div
    className="relative hidden h-[69px] w-[600px] shrink-0 xl:playful:block"
    aria-hidden="true"
    data-doodle=""
  >
    <div className="absolute inset-x-0 top-[-2px] h-[84px]">
      <span className="absolute left-0 top-[30px] flex">
        {COMMUNITY_HEADER_FACES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="-ml-[12px] size-[40px] rounded-full border-[3px] border-solid border-white object-cover first:ml-0"
            style={{ zIndex: 4 - i }}
          />
        ))}
      </span>
      <span className="absolute left-[136px] top-[36px] inline-flex items-center gap-[6px] whitespace-nowrap rounded-full border border-solid border-[rgba(0,82,43,0.12)] bg-white px-[12px] py-[7px] font-sans text-[12px] leading-[14px] tracking-[0.2px] text-[#1c2a21] shadow-[0_6px_14px_rgba(31,69,38,0.16)]">
        <span className="size-[8px] rounded-full bg-[#349643]" />
        {COPY.header.friends}
      </span>
      <span
        className="absolute left-[338px] top-[9px] inline-flex items-center gap-[6px] whitespace-nowrap rounded-full bg-[#387440] px-[14px] py-[8px] font-sans text-[13px] font-medium leading-[16px] tracking-[0.2px] text-white shadow-[0_6px_14px_rgba(31,69,38,0.16)]"
        style={{ transform: 'rotate(5deg)' }}
      >
        <img src={headSparkle} alt="" className="size-[15px]" />
        {COPY.header.ask}
      </span>
      <span
        className="absolute left-[431px] top-[42px] inline-flex items-center gap-[6px] whitespace-nowrap rounded-full border-[1.5px] border-solid border-[#c8951a] bg-[#faf4e8] px-[12px] py-[7px] font-sans text-[12px] font-semibold leading-[14px] tracking-[0.2px] text-[#c8951a] shadow-[0_6px_14px_rgba(31,69,38,0.16)]"
        style={{ transform: 'rotate(-4deg)' }}
      >
        <img src={headFlame} alt="" className="size-[15px]" />
        {COPY.header.xp}
      </span>
      <img src={headDoodleGold} alt="" className="absolute left-[574px] top-0 size-[22px]" />
      <img src={headDoodleGreen} alt="" className="absolute left-[316px] top-[46px] size-[12px]" />
      <img
        src={headDoodleSquiggle}
        alt=""
        className="absolute left-[298px] top-[10px] h-[20px] w-[48px]"
      />
      <img src={headDoodleRing} alt="" className="absolute left-[250px] top-[6px] size-[14px]" />
    </div>
  </div>
);

/*
 * BrowseHeader — "Find your people" + count sticker, subtitle, decoration art.
 * Props: total (number, the "10 communities" sticker).
 */
export const BrowseHeader = ({ total }) => (
  <div className="flex items-start justify-between gap-[24px]">
    <div className="flex min-w-0 flex-col gap-[3px]">
      <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
        <h1
          className={classNames(
            HEADING,
            'text-[clamp(26px,1.97vw,34px)] leading-[1.2] tracking-[-0.02em]'
          )}
        >
          {COPY.title}
        </h1>
        <CommunitySticker>{`${total} communities`}</CommunitySticker>
      </div>
      <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999999] max-sm:text-[14px] max-sm:leading-[20px]">
        {COPY.subtitle}
      </p>
    </div>
    <HeaderDecor />
  </div>
);

/*
 * BrowseToolbar — category chips (All + 8) and the 340px search field.
 * Props: cat (selected category id or null), onCat(id|null), q (search text), onQ(text).
 * The chips are a scroll row on phones, a wrapping row from md.
 */
export const BrowseToolbar = ({ cat, onCat, q, onQ }) => {
  const [value, setValue] = useState(q);
  useEffect(() => {
    setValue(q);
  }, [q]);

  return (
    <div className="flex flex-col gap-[12px] lg:flex-row lg:items-end lg:gap-[16px] playful:lg:min-h-[60px] playful:lg:items-center">
      <div
        role="group"
        aria-label="Community categories"
        className="no-scrollbar -mx-[12px] flex min-w-0 flex-1 gap-[8px] overflow-x-auto px-[12px] max-md:[mask-image:linear-gradient(to_right,transparent,#000_12px,#000_calc(100%-24px),transparent)] md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      >
        <CommunityChip
          on={!cat}
          onClick={() => {
            log('cat ->', 'all');
            onCat(null);
          }}
        >
          All
        </CommunityChip>
        {COMMUNITY_CATEGORIES.map((c) => (
          <CommunityChip
            key={c.id}
            on={cat === c.id}
            onClick={() => {
              log('cat ->', c.id);
              onCat(cat === c.id ? null : c.id);
            }}
          >
            {c.label}
          </CommunityChip>
        ))}
      </div>
      <label
        className={classNames(
          'flex h-[51px] w-full shrink-0 cursor-text items-center gap-[8px] rounded-[10px] border border-solid border-[#cccccc] bg-white py-[13px] pl-[20px] pr-[16px] lg:w-[340px]',
          EMPHASIS_SURFACE,
          'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]'
        )}
      >
        <CommunitySearchIcon className="size-[16px] shrink-0" />
        <input
          type="search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onQ(e.target.value);
          }}
          placeholder={COPY.searchPlaceholder}
          aria-label="Search communities"
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] font-medium leading-[24px] tracking-[0.2px] text-[#1c2a21] outline-none placeholder:font-normal placeholder:text-[#595959] [&::-webkit-search-cancel-button]:hidden"
        />
      </label>
    </div>
  );
};

/* "Picked for you" / "Your communities" / "All communities" row heading: 18px icon + Bricolage 21px (+ note or sticker). */
export const BrowseSectionHead = ({ icon, title, note, sticker }) => {
  const Glyph = icon;
  return (
    <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px]">
      <span className="flex items-center gap-[8px]">
        {Glyph ? <Glyph className="size-[18px] shrink-0" /> : null}
        <h2 className={classNames(HEADING, 'text-[21px] leading-[26px] max-lg:text-[20px]')}>
          {title}
        </h2>
      </span>
      {sticker ? <CommunitySticker size="sm">{sticker}</CommunitySticker> : null}
      {note ? (
        <span className="font-sans text-[13px] font-medium leading-[16px] text-[#737373] max-lg:text-[12px]">
          {note}
        </span>
      ) : null}
    </div>
  );
};

/*
 * BrowseResultsLine — "Showing 3 communities in <Software engineering> · Clear" (C-02).
 * Props: count, label (category name or the search term), term (true = quote the label as a search term), onClear.
 * ⚠️ ASSUMPTION: for a text search the same line reads "Showing N communities for “term” · Clear" (only the category form is drawn).
 */
export const BrowseResultsLine = ({ count, label, term = false, onClear }) => (
  <p className="m-0 flex flex-wrap items-center gap-x-[6px] font-sans text-[14px] leading-[17px]">
    <span className="font-medium text-[#595959]">
      {term ? COPY.results.showing(count).replace(/ in$/, ' for') : COPY.results.showing(count)}
    </span>
    <span className="font-semibold text-[#387440]">{term ? `“${label}”` : label}</span>
    <button
      type="button"
      onClick={onClear}
      className={classNames(
        'cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21] max-lg:min-h-[32px]',
        FOCUS_RING
      )}
    >
      {COPY.results.clear}
    </button>
  </p>
);

/*
 * BrowseGrid — the card grid: 300px tracks (32px column gap, 20px row gap) from sm, one fluid column on phones.
 * `gap` = 'default' (32px) | 'wide' (loading skeleton, 40px) | 'tight' (C-16 closest communities, 20px).
 */
export const BrowseGrid = ({ gap = 'default', className, children, ...rest }) => (
  <div
    className={classNames(
      'grid grid-cols-1 items-start gap-y-[20px] sm:[grid-template-columns:repeat(auto-fill,300px)]',
      gap === 'wide' ? 'gap-x-[40px]' : gap === 'tight' ? 'gap-x-[20px]' : 'gap-x-[32px]',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

/* Loading placeholder card (Figma "skeleton card" 7629:9962): grey cover 150, lines 200/130/250/180, dots + button blocks. */
const Bone = ({ className }) => <span className={classNames('block bg-[#e7e7e7]', className)} />;

export const CommunityCardSkeleton = () => (
  <div
    aria-hidden="true"
    className="flex w-full flex-col overflow-hidden rounded-[20px] border border-solid border-[#e6e6e6] bg-white motion-safe:animate-pulse"
    data-skeleton=""
  >
    <div className="h-[150px] bg-[#ececea]" />
    <div className="flex flex-col gap-[10px] p-[16px]">
      <Bone className="h-[16px] w-[200px] max-w-full rounded-[6px]" />
      <Bone className="h-[10px] w-[130px] max-w-full rounded-[6px]" />
      <Bone className="h-[10px] w-[250px] max-w-full rounded-[6px]" />
      <Bone className="h-[10px] w-[180px] max-w-full rounded-[6px]" />
      <div className="flex items-center justify-between gap-[8px] pt-[6px]">
        <Bone className="h-[26px] w-[70px] rounded-[13px]" />
        <Bone className="h-[40px] w-[72px] rounded-[10px]" />
      </div>
    </div>
  </div>
);

/*
 * RequestTile — "Can’t find your people?" dashed tile next to "Your communities" (C-03, Figma 7625:5936).
 * Props: requested (boolean), onRequest.
 * ⚠️ ASSUMPTION: no request flow is drawn: the link turns into "Request sent" (no extra copy invented beyond that).
 */
export const RequestTile = ({ requested, onRequest }) => (
  <div className="relative flex min-h-[334px] w-full flex-col items-center justify-center gap-[10px] rounded-[20px] bg-white px-[16px] text-center">
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
    >
      <rect
        x="0.75"
        y="0.75"
        rx="19.25"
        fill="none"
        stroke="#bfbfbf"
        strokeWidth="1.5"
        strokeDasharray="6 5"
        style={{ width: 'calc(100% - 1.5px)', height: 'calc(100% - 1.5px)' }}
      />
    </svg>
    <span className="flex size-[52px] items-center justify-center rounded-full border-[1.5px] border-solid border-[rgba(28,42,33,0.1)] bg-[#ffd86b] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]">
      <CommunityPlusIcon className="size-[22px]" />
    </span>
    <h3 className={classNames(HEADING, 'text-[17px] leading-[21px]')}>
      {COPY.tiles.discoverTitle}
    </h3>
    <p className="m-0 max-w-[220px] font-sans text-[13px] font-normal leading-[18px] text-[#737373]">
      {COPY.tiles.discoverBody}
    </p>
    <button
      type="button"
      onClick={onRequest}
      aria-live="polite"
      className={classNames(
        'cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440] max-lg:min-h-[32px]',
        FOCUS_RING
      )}
    >
      {requested ? 'Request sent' : COPY.tiles.discoverLink}
    </button>
  </div>
);

/*
 * NoResults — C-16 white panel: search icon tile, "No community for “term” yet", request progress, two buttons.
 * Props: term, asked, needed, requested (boolean), onRequest, onClear.
 * ⚠️ ASSUMPTION: "Request this community" adds you to the count (14 -> 15 of 25) and the button turns into a disabled
 *    "Request sent" (no other copy invented).
 */
export const NoResults = ({ term, asked, needed, requested, onRequest, onClear }) => {
  const count = requested ? asked + 1 : asked;
  return (
    <section
      aria-label="No results"
      className="flex flex-col items-center gap-[14px] rounded-[24px] border border-solid border-[#e6e6e6] bg-white px-[clamp(16px,2vw,32px)] py-[48px] text-center"
    >
      <span
        className={classNames(
          'flex size-[77px] items-center justify-center rounded-[22px] border-[1.4px] border-solid border-[rgba(28,42,33,0.32)] bg-[#eaeffb]',
          'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
        )}
      >
        <CommunitySearchBigIcon className="size-[34px]" />
      </span>
      <h2
        className={classNames(
          HEADING,
          'text-[25px] leading-[30px] max-lg:text-[22px] max-lg:leading-[28px]'
        )}
      >
        {COPY.noResults.title(term)}
      </h2>
      <p className="m-0 max-w-[460px] font-sans text-[14px] font-normal leading-[21px] text-[#595959]">
        {COPY.noResults.body}
      </p>
      <div className="flex w-full max-w-[360px] flex-col items-center gap-[6px]">
        <div
          role="progressbar"
          aria-label="People who have asked for this community"
          aria-valuemin={0}
          aria-valuemax={needed}
          aria-valuenow={count}
          className="h-[10px] w-full overflow-hidden rounded-full bg-[#e1eae2]"
        >
          <div
            className="h-full rounded-full bg-[#387440]"
            style={{ width: `${(count / needed) * 100}%` }}
          />
        </div>
        <span className="font-sans text-[12px] font-medium leading-[14px] text-[#2d5d33]">
          {COPY.noResults.progress(count, needed)}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-[10px] pt-[2px]">
        <CommunityButton tone="primary" disabled={requested} onClick={onRequest}>
          {requested ? 'Request sent' : COPY.noResults.request}
        </CommunityButton>
        <CommunityButton tone="secondary" onClick={onClear}>
          {COPY.noResults.clear}
        </CommunityButton>
      </div>
    </section>
  );
};
