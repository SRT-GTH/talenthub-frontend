import { useEffect, useRef, useState } from 'react';
import { useLearningData } from './useLearningData.js';
import { RecCard } from './LearningHubParts.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  ArrowheadDownIcon,
  CheckIcon,
  ExploreCategoryBriefcaseIcon,
  ExploreCategoryChartIcon,
  ExploreCategoryCodeIcon,
  ExploreCategoryHeartIcon,
  ExploreCategoryLeafIcon,
  ExploreCategoryMicIcon,
  ExploreCategoryPenIcon,
  ExploreClearIcon,
  ExploreNoResultsSpot,
  ExploreSearchIcon,
  ProfileGhanaFlagIcon,
} from '../../shared/assets.jsx';
import {
  CardGrid,
  CourseCard,
  CourseChip,
  CourseCover,
  ExploreHeader,
  FOCUS_RING,
  ShelfButton,
  Sticker,
} from './ExploreParts.jsx';
import {
  CATEGORIES,
  CATEGORY_VIEW,
  CLEAR_SEARCH_LABEL,
  DEMO_QUERY_NONE,
  DEMO_QUERY_SEARCH,
  EXPLORE_HEADER,
  MATCHES_ROW,
  NO_RESULTS,
  POPULAR_ROW,
  SEARCH_PLACEHOLDER,
  SEARCH_VIEW,
  resultsHeading,
  searchCourses,
} from './talentLearningExploreData.js';

const log = debug('ExploreCourses');

/*
 * ExploreCourses — Explore courses (EX-01..EX-04). Figma Playful 7538:1631 / 2064 / 2488 / 2872,
 * Focused 8110:19619 / 20029 / 20429 / 20769. `learning.ex` (URL) and the local search query stay in
 * sync: typing a query with matches -> `ex=search`, no matches -> `ex=none`, clearing -> no `ex`;
 * the "Data & analytics" category -> `ex=category`.
 */

const CATEGORY_ICONS = {
  chart: ExploreCategoryChartIcon,
  code: ExploreCategoryCodeIcon,
  pen: ExploreCategoryPenIcon,
  briefcase: ExploreCategoryBriefcaseIcon,
  heart: ExploreCategoryHeartIcon,
  mic: ExploreCategoryMicIcon,
  leaf: ExploreCategoryLeafIcon,
};

const headingClass =
  'm-0 font-sans font-semibold text-[#1c2a21] playful:font-heading tracking-normal';

/* ---------- search field ---------- */

const SearchField = ({ value, onChange, onClear, inputRef }) => {
  const active = value.length > 0;
  return (
    <div
      className={classNames(
        'flex w-full items-center gap-[12px] bg-white transition-shadow focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]',
        active
          ? 'rounded-full border border-solid border-[rgba(28,42,33,0.1)] px-[18px] py-[14px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
          : 'rounded-[8px] border border-solid border-[#dfdfdc] py-[10px] pl-[14px] pr-[12px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]'
      )}
    >
      <span
        className={classNames(
          'flex shrink-0 items-center justify-center',
          active ? 'size-[20px]' : 'size-[28px] rounded-full'
        )}
      >
        <ExploreSearchIcon
          className={classNames(
            'size-[20px]',
            active ? '[&_path]:stroke-[#595959]' : '[&_path]:stroke-[#387440]'
          )}
        />
      </span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={SEARCH_PLACEHOLDER}
        aria-label={SEARCH_PLACEHOLDER}
        autoComplete="off"
        className={classNames(
          'min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 font-sans text-[#1c2a21] outline-none placeholder:text-[#bfbfbf] [&::-webkit-search-cancel-button]:hidden',
          active
            ? 'text-[15px] font-medium leading-[18px]'
            : 'text-[14px] leading-[20px] tracking-[0.2px]'
        )}
      />
      {active && (
        <button
          type="button"
          onClick={onClear}
          aria-label={CLEAR_SEARCH_LABEL}
          className={classNames(
            'flex size-[24px] shrink-0 items-center justify-center rounded-full',
            FOCUS_RING
          )}
        >
          <ExploreClearIcon className="size-[16px]" />
        </button>
      )}
    </div>
  );
};

/* ---------- EX-01 ---------- */

const CategoryChips = ({ onPick }) => (
  <div
    className="-mx-[2px] flex gap-[10px] overflow-x-auto px-[2px] pb-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    role="group"
    aria-label="Categories"
  >
    {CATEGORIES.map((c) => {
      const Icon = CATEGORY_ICONS[c.icon];
      return (
        <button
          key={c.id}
          type="button"
          onClick={() => onPick(c)}
          className={classNames(
            'flex shrink-0 cursor-pointer items-center gap-[10px] whitespace-nowrap rounded-[16px] border border-solid border-[#e1eae2] bg-white py-[8px] pl-[8px] pr-[14px] transition-colors hover:border-[#c1d4c4]',
            FOCUS_RING
          )}
        >
          <span
            className="flex size-[34px] items-center justify-center rounded-[10px] border border-solid border-[rgba(28,42,33,0.12)] playful:border-[#1c2a21]"
            style={{ backgroundColor: c.tint }}
          >
            <Icon />
          </span>
          <span className="font-sans text-[14px] font-semibold leading-[16.7px] text-[#1c2a21]">
            {c.label}
          </span>
          <span className="font-sans text-[12px] font-medium leading-[14.3px] text-[#737373]">
            {c.count}
          </span>
        </button>
      );
    })}
  </div>
);

const RowHead = ({ title, sticker, flag, seeAll }) => (
  <div className="flex items-center gap-[10px]">
    <h2 className={classNames(headingClass, 'text-[clamp(18px,1.27vw,22px)] leading-[1.25]')}>
      {title}
    </h2>
    {sticker && (
      <Sticker size="md" tilt={3} className="playful:py-[4px]">
        {sticker}
      </Sticker>
    )}
    {flag && <ProfileGhanaFlagIcon className="size-[28px] shrink-0" />}
    <span className="flex-1" />
    <button
      type="button"
      className={classNames(
        'shrink-0 cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 font-sans text-[13.5px] font-semibold leading-[16.1px] text-[#2d5d33] hover:underline',
        FOCUS_RING
      )}
    >
      {seeAll}
    </button>
  </div>
);

const ExploreHome = ({ onPickCategory, onOpen }) => (
  <>
    <CategoryChips onPick={onPickCategory} />
    <RowHead title={MATCHES_ROW.title} sticker={MATCHES_ROW.sticker} seeAll={MATCHES_ROW.seeAll} />
    <CardGrid>
      {MATCHES_ROW.courses.map((c) => (
        <CourseCard key={c.id} course={c} onOpen={onOpen} />
      ))}
    </CardGrid>
    <RowHead title={POPULAR_ROW.title} flag seeAll={POPULAR_ROW.seeAll} />
    <CardGrid>
      {POPULAR_ROW.courses.map((c) => (
        <CourseCard key={c.id} course={c} onOpen={onOpen} />
      ))}
    </CardGrid>
  </>
);

/* ---------- EX-02 ---------- */

const FilterOption = ({ option, checked, onToggle }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={onToggle}
    className={classNames(
      'flex cursor-pointer items-center gap-[10px] rounded-[6px] text-left',
      FOCUS_RING
    )}
  >
    <span
      className={classNames(
        'flex size-[20px] shrink-0 items-center justify-center rounded-[6px] border border-solid',
        checked
          ? 'border-[rgba(28,42,33,0.12)] bg-[#387440] playful:border-[1.2px] playful:border-[#1c2a21]'
          : 'border-[1.2px] border-[#c1d4c4] bg-white'
      )}
    >
      {checked && <CheckIcon className="size-[14px] text-white" />}
    </span>
    <span
      className={classNames(
        'font-sans text-[13.5px] leading-[16.1px]',
        checked ? 'font-semibold text-[#1c2a21]' : 'font-medium text-[#595959]'
      )}
    >
      {option.label}
    </span>
  </button>
);

const FiltersPanel = ({ checked, toggle }) => (
  <aside
    aria-label={CATEGORY_VIEW.filtersTitle}
    className="flex w-full shrink-0 flex-col gap-[16px] self-start rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[18px] lg:w-[250px]"
  >
    <h2 className={classNames(headingClass, 'text-[19px] leading-[23.8px]')}>
      {CATEGORY_VIEW.filtersTitle}
    </h2>
    <div className="grid grid-cols-1 gap-[16px] min-[480px]:grid-cols-2 lg:grid-cols-1">
      {CATEGORY_VIEW.groups.map((g) => (
        <div key={g.id} role="group" aria-label={g.label} className="flex flex-col gap-[8px]">
          <span className="font-sans text-[11px] max-lg:text-[12px] font-bold leading-[13.1px] text-[#737373]">
            {g.label}
          </span>
          {g.options.map((o) => (
            <FilterOption
              key={o.id}
              option={o}
              checked={Boolean(checked[o.id])}
              onToggle={() => toggle(o.id)}
            />
          ))}
        </div>
      ))}
    </div>
  </aside>
);

const CategoryView = ({ onOpen }) => {
  const [checked, setChecked] = useState(() => {
    const init = {};
    CATEGORY_VIEW.groups.forEach((g) =>
      g.options.forEach((o) => (init[o.id] = Boolean(o.checked)))
    );
    return init;
  });
  const toggle = (id) => {
    log('filter toggled', id);
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  };
  return (
    <div className="flex flex-col gap-[24px] lg:flex-row">
      <FiltersPanel checked={checked} toggle={toggle} />
      <section className="flex min-w-0 flex-1 flex-col gap-[14px]">
        <div className="flex items-center justify-between gap-[8px]">
          <p className="m-0 min-w-0 font-sans text-[15px] font-semibold leading-[17.9px] text-[#1c2a21]">
            {CATEGORY_VIEW.matchLabel}
          </p>
          <button
            type="button"
            aria-haspopup="listbox"
            className={classNames(
              'inline-flex h-[34px] shrink-0 cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-full border border-solid border-[#e1eae2] bg-white pl-[14px] pr-[12px] font-sans text-[13px] font-semibold leading-[15.5px] text-[#595959]',
              FOCUS_RING
            )}
          >
            {CATEGORY_VIEW.sort}
            <ArrowheadDownIcon className="size-[14px] text-[#1c2a21]" />
          </button>
        </div>
        <CardGrid cols="xl:grid-cols-3" gap="gap-[18px]">
          {CATEGORY_VIEW.courses.map((c) => (
            <CourseCard key={c.id} course={c} onOpen={onOpen} />
          ))}
        </CardGrid>
      </section>
    </div>
  );
};

/* ---------- EX-03 ---------- */

const ResultRow = ({ course, onOpen }) => (
  <article
    className={classNames(
      'flex flex-wrap items-center gap-[12px] rounded-[20px] border border-solid bg-white p-[12px] sm:gap-[18px] sm:py-[12px] sm:pl-[12px] sm:pr-[18px]',
      course.best
        ? 'border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
        : 'border-[#e1eae2]'
    )}
  >
    <button
      type="button"
      onClick={() => onOpen(course)}
      tabIndex={-1}
      aria-hidden="true"
      className="block h-[56px] w-[90px] shrink-0 cursor-pointer overflow-hidden rounded-[14px] border-0 p-0 sm:h-[80px] sm:w-[130px]"
    >
      <CourseCover kind={course.cover} />
    </button>
    <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
      <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px]">
        <h3
          className={classNames(
            headingClass,
            'text-[clamp(16px,1.16vw,20px)] leading-[1.25] max-sm:[overflow-wrap:anywhere]'
          )}
        >
          {course.title}
        </h3>
        {course.best && (
          <Sticker size="sm" tilt={4}>
            {SEARCH_VIEW.bestMatch}
          </Sticker>
        )}
      </div>
      <p className="m-0 font-sans text-[12.5px] leading-[14.9px] text-[#737373]">{course.meta}</p>
      <CourseChip chip={course.chip} />
    </div>
    <ShelfButton
      tone={course.best ? 'primary' : 'secondary'}
      onClick={() => onOpen(course)}
      className="max-sm:basis-full max-sm:!px-[14px] max-sm:!py-[8px] max-sm:text-[14px]"
    >
      {SEARCH_VIEW.viewCourse}
    </ShelfButton>
  </article>
);

const SearchResults = ({ query, results, onRelated, onOpen }) => (
  <div className="flex flex-col gap-[18px]">
    <div className="-mt-[0px] flex flex-wrap items-center gap-[8px]">
      <span className="font-sans text-[13px] font-semibold leading-[15.5px] text-[#737373]">
        {SEARCH_VIEW.relatedLabel}
      </span>
      {SEARCH_VIEW.related.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onRelated(r)}
          className={classNames(
            'cursor-pointer whitespace-nowrap rounded-full border border-solid border-[#e1eae2] bg-white px-[12px] py-[6px] font-sans text-[12.5px] font-semibold leading-[14.9px] text-[#595959] transition-colors hover:border-[#c1d4c4]',
            FOCUS_RING
          )}
        >
          {r}
        </button>
      ))}
    </div>
    <h2
      className={classNames(headingClass, 'text-[clamp(18px,1.22vw,21px)] leading-[1.25]')}
      aria-live="polite"
    >
      {resultsHeading(results.length, query)}
    </h2>
    <div className="flex flex-col gap-[20px]">
      {results.map((c) => (
        <ResultRow key={c.id} course={c} onOpen={onOpen} />
      ))}
    </div>
  </div>
);

/* ---------- EX-04 ---------- */

const NoResults = ({ onClosest }) => (
  <div className="flex flex-col items-center gap-[20px] rounded-[28px] border border-solid border-[#e1eae2] bg-white px-[16px] py-[34px] text-center sm:px-[40px]">
    <ExploreNoResultsSpot className="size-[130px]" />
    <h2
      className={classNames(headingClass, 'text-[clamp(24px,1.85vw,32px)] leading-[1.2]')}
      aria-live="polite"
    >
      {NO_RESULTS.title}
    </h2>
    <p className="m-0 max-w-[640px] font-sans text-[15px] leading-[17.9px] text-[#737373] playful:text-[#595959]">
      {NO_RESULTS.body}
    </p>
    <div className="flex flex-wrap items-center justify-center gap-[10px] py-[4px]">
      <ShelfButton size="lg">{NO_RESULTS.request}</ShelfButton>
      <ShelfButton size="lg" tone="secondary">
        {NO_RESULTS.askBuddy}
      </ShelfButton>
    </div>
    <div className="flex flex-wrap items-center justify-center gap-[8px]">
      <span className="font-sans text-[13px] font-semibold leading-[15.5px] text-[#737373]">
        {NO_RESULTS.closestLabel}
      </span>
      {NO_RESULTS.closest.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onClosest(c)}
          className={classNames(
            'cursor-pointer whitespace-nowrap rounded-full border-0 bg-[#ebf1ec] px-[12px] py-[6px] font-sans text-[12.5px] font-semibold leading-[14.9px] text-[#2d5d33] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]',
            FOCUS_RING
          )}
        >
          {c}
        </button>
      ))}
    </div>
  </div>
);

/* ---------- screen ---------- */

const stateForQuery = (q) => {
  if (!q.trim()) return null;
  return searchCourses(q).length ? 'search' : 'none';
};

/*
 * LiveExplore — Explore on the training API (GET /guidance/training/courses, already loaded by
 * LearningDataProvider). The Figma Explore rows / category page / search sets are built around a
 * 142-course catalogue that doesn't exist yet, so live mode is: real search (title, skills,
 * categories, provider) + chips from the real categories + the same course cards. ⚠️ ASSUMPTION
 * layout; copy reused from Figma where it fits.
 */
const LiveExplore = ({ data }) => {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState(null);
  const inputRef = useRef(null);
  const all = Object.values(data.courses);
  const categories = [...new Set(all.flatMap((c) => c.categories))].sort();
  const q = query.trim().toLowerCase();
  const results = all.filter((c) => {
    if (cat && !c.categories.includes(cat)) return false;
    if (!q) return true;
    return [c.title, c.provider, ...c.skills, ...c.categories].some((t) =>
      String(t).toLowerCase().includes(q)
    );
  });
  const free = all.filter((c) => c.tags.free).length;
  return (
    <div className="flex w-full min-w-0 flex-col gap-[24px]">
      <ExploreHeader
        title={EXPLORE_HEADER.title}
        count={`${free} free`}
        subtitle={`${all.length} course${all.length === 1 ? '' : 's'} picked for young Ghanaian talent. Learn anything, 15 minutes at a time.`}
      />
      <div className="flex flex-col gap-[18px]">
        <SearchField
          value={query}
          onChange={setQuery}
          onClear={() => {
            setQuery('');
            inputRef.current?.focus();
          }}
          inputRef={inputRef}
        />
        <div role="group" aria-label="Categories" className="flex flex-wrap gap-[8px]">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? 'all'}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={classNames(
                'h-[34px] rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold',
                cat === c
                  ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                  : 'border-[#e1eae2] bg-white text-[#595959] hover:bg-[#f4f7f4]'
              )}
            >
              {c ?? 'All'}
            </button>
          ))}
        </div>
        {q || cat ? (
          <p className="m-0 font-sans text-[15px] font-semibold text-[#1c2a21]">
            {q ? resultsHeading(results.length, query) : `${results.length} in ${cat}`}
          </p>
        ) : null}
        {results.length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] items-start gap-[20px]">
            {results.map((c) => (
              <RecCard
                key={c.id}
                size="lg"
                course={c}
                meta={c.metaFull}
                buttonLabel="View course"
                onStart={() => data.openCourse(c.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-[6px] py-[16px]">
            <p className="m-0 font-sans text-[18px] font-semibold text-[#1c2a21]">
              {NO_RESULTS.title}
            </p>
            <p className="m-0 max-w-[560px] font-sans text-[14px] text-[#595959]">
              {NO_RESULTS.body}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ExploreCourses = ({ learning }) => {
  const data = useLearningData();
  if (data.live) return <LiveExplore data={data} />;
  return <MockExplore learning={learning} />;
};

const MockExplore = ({ learning }) => {
  const ex = learning?.ex ?? null;
  const [query, setQuery] = useState(() =>
    ex === 'search' ? DEMO_QUERY_SEARCH : ex === 'none' ? DEMO_QUERY_NONE : ''
  );
  const inputRef = useRef(null);
  log('render', { ex, query });

  // Keep the URL state and the query in step (deep links / browser back).
  useEffect(() => {
    if ((ex === 'search' || ex === 'none') && stateForQuery(query) !== ex) {
      log('seeding query from URL', ex);
      setQuery(ex === 'search' ? DEMO_QUERY_SEARCH : DEMO_QUERY_NONE);
    } else if ((ex === null || ex === 'category') && query.trim()) {
      if (ex === null) {
        log('clearing query (ex removed)');
        setQuery('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ex]);

  const applyQuery = (next) => {
    setQuery(next);
    const state = stateForQuery(next);
    log('query', { next, state });
    // Typing replaces the category view; clearing returns to the explore home.
    if (state !== ex) learning.update({ ex: state });
  };

  const openCourse = (course) => {
    log('open course', course.id);
    learning.update({ view: 'course', ex: null });
  };

  const pickCategory = (cat) => {
    log('category', cat.id);
    if (cat.id === 'data') learning.update({ ex: 'category' });
  };

  const results = searchCourses(query);
  const mode = ex === 'category' && !query.trim() ? 'category' : (stateForQuery(query) ?? 'home');
  log('mode', mode);

  return (
    <div className="flex w-full min-w-0 flex-col gap-[24px]">
      <ExploreHeader
        title={mode === 'category' ? CATEGORY_VIEW.title : EXPLORE_HEADER.title}
        count={mode === 'category' ? CATEGORY_VIEW.count : EXPLORE_HEADER.count}
        subtitle={mode === 'category' ? CATEGORY_VIEW.subtitle : EXPLORE_HEADER.subtitle}
      />
      {mode === 'category' && <CategoryView onOpen={openCourse} />}
      {mode !== 'category' && (
        <div className="flex flex-col gap-[18px]">
          <SearchField
            value={query}
            onChange={applyQuery}
            onClear={() => {
              applyQuery('');
              inputRef.current?.focus();
            }}
            inputRef={inputRef}
          />
          {mode === 'home' && <ExploreHome onPickCategory={pickCategory} onOpen={openCourse} />}
          {mode === 'search' && (
            <SearchResults
              query={query}
              results={results}
              onRelated={applyQuery}
              onOpen={openCourse}
            />
          )}
          {mode === 'none' && <NoResults onClosest={applyQuery} />}
        </div>
      )}
    </div>
  );
};

export default ExploreCourses;
