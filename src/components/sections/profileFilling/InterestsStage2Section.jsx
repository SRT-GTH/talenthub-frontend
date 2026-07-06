import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import AddCategoryModal from './AddCategoryModal.jsx';
import InterestsCompleteModal from './InterestsCompleteModal.jsx';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  CatCourtIcon,
  CatPenToolIcon,
  CatBusinessIcon,
  CatEducationIcon,
  CatArchitectureIcon,
  CatMediaIcon,
} from '../../shared/assets.jsx';

const log = debug('InterestsStage2Section');

/*
 * InterestsStage2Section — full page shell for /profile/filling/interests/categories.
 * Source: Figma frame 3531:46209 ("Interests step stage 2").
 *
 * Expanded card state: Figma 3550:54481 (Category 1: Technology, expanded, active).
 *   - Container: border-[#387440] h-[202px] shadow rgba(42,87,48,0.2)
 *   - Icon bg: #f7fee7 (collapsed = ICON_GRADIENT)
 *   - Status: "In progress" #c8951a (collapsed "done" = "✓ Done" #1d7c4d)
 *   - Expanded panel (h-118px): bg rgba(235,241,236,0.5) border-t rgba(0,0,0,0.06)
 *     - Label "SPECIFICS INSIDE …" — #387440 bold 10px tracking-[0.6px] uppercase
 *     - Removable chips — bg-white border-[#c1d4c4] h-27px rounded-full, text #387440 12px semibold, × #babab7
 *     - Input — bg-white border-[#e8e8e4] h-34px rounded-[10px], placeholder #c8c8c8
 *     - "+ Add" button — bg-[#387440] border-2 border-[#2a5730] drop-shadow[0px_3px_0px_#2a5730] h-34px rounded-[10px]
 *
 * Suggestions row: Figma 3576:89634 / 3576:89506 / 3576:89622.
 *   - Label "SUGGESTIONS FOR …" — #70706e bold 10px tracking-[0.7px] uppercase
 *   - Chip added: linear-gradient(182deg, rgb(254,241,231) 0%, rgb(232,242,237) 100%) border-[#fef1e7]
 *   - Chip not added: bg-white border-[#fef1e7]
 */

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

const ChevronDownIcon = ({ className }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M2 4l4 4 4-4" />
  </svg>
);

const ChevronUpIcon = ({ className }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M2 8l4-4 4 4" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M1.5 3h9M4.5 3V2h3v1M2.5 3l.5 7h6l.5-7" />
    <line x1="5" y1="5" x2="5" y2="8.5" />
    <line x1="7" y1="5" x2="7" y2="8.5" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M11 7H3M6 4l-3 3 3 3" />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M3 7h8M8 4l3 3-3 3" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

// Collapsed card icon gradient — Figma 3550:47566
const ICON_GRADIENT = 'linear-gradient(216deg, rgb(254,241,231) 0%, rgb(232,242,237) 100%)';
// Suggestion chip gradient — Figma 3576:89506 / 3576:89513 (active/added state)
const SUGGESTION_GRADIENT =
  'linear-gradient(182.639deg, rgb(254,241,231) 0%, rgb(232,242,237) 20.192%)';

const INITIAL_CATEGORIES = [
  {
    id: 'tech',
    label: 'Technology & Engineering',
    Icon: CatCourtIcon,
    specifics: ['Software development', 'Data science', 'AI / Machine learning'],
    suggestions: [
      { label: 'Data science', Icon: CatCourtIcon },
      { label: 'UI/UX engineering', Icon: CatCourtIcon },
      { label: 'DevOps & SRE', Icon: CatCourtIcon },
      { label: 'Software dev', Icon: CatBusinessIcon },
      { label: 'AI / ML', Icon: CatCourtIcon },
      { label: 'Cloud & infrastructure', Icon: CatEducationIcon },
      { label: 'Mobile development', Icon: CatArchitectureIcon },
      { label: 'Blockchain / Web3', Icon: CatMediaIcon },
      { label: 'Robotics & automation', Icon: CatMediaIcon },
      { label: 'Business intelligence', Icon: CatMediaIcon },
    ],
  },
  {
    id: 'creative',
    label: 'Creative Arts & Design',
    Icon: CatPenToolIcon,
    specifics: ['UI/UX design', 'Brand design'],
    suggestions: [
      { label: 'Graphic design', Icon: CatPenToolIcon },
      { label: 'Motion design', Icon: CatArchitectureIcon },
      { label: 'Photography', Icon: CatCourtIcon },
      { label: 'Illustration', Icon: CatPenToolIcon },
      { label: 'Video production', Icon: CatEducationIcon },
      { label: 'Content creation', Icon: CatBusinessIcon },
    ],
  },
  {
    id: 'business',
    label: 'Business and Finance',
    Icon: CatBusinessIcon,
    specifics: ['Financial analysis', 'Marketing'],
    suggestions: [
      { label: 'Project management', Icon: CatCourtIcon },
      { label: 'Strategy consulting', Icon: CatCourtIcon },
      { label: 'Operations', Icon: CatMediaIcon },
      { label: 'Entrepreneurship', Icon: CatCourtIcon },
      { label: 'Sales', Icon: CatArchitectureIcon },
      { label: 'Supply chain', Icon: CatEducationIcon },
    ],
  },
];

// Figma 3547:47351 — live role matches panel
const ROLE_MATCHES = [
  { role: 'Data Scientist', company: 'Zeepay Ghana', pct: 94 },
  { role: 'Product Designer', company: 'mPharma', pct: 88 },
  { role: 'Growth Analyst', company: 'Farmerline', pct: 82 },
];

// ─── Category card ─────────────────────────────────────────────────────────────
/*
 * Renders the card header (always 84px) + expanded panel (118px, only when open)
 * + the suggestion row (only when open, outside the card).
 * Uses a React Fragment so both elements sit as siblings in the parent flex-col.
 */
const CategoryCard = ({
  category,
  isExpanded,
  onToggle,
  onRemoveCategory,
  inputValue,
  onInputChange,
  onAddSpecific,
  onRemoveSpecific,
}) => {
  const { id, label, Icon, specifics, suggestions } = category;
  const hasDone = !isExpanded && specifics.length > 0;

  log('CategoryCard render', { id, isExpanded, specificsCount: specifics.length });

  const handleAddFromInput = () => {
    const v = inputValue.trim();
    if (v && !specifics.includes(v)) onAddSpecific(v);
  };

  return (
    <>
      {/* ── The card ──────────────────────────────────────────────────────── */}
      <div
        className={`bg-white border rounded-[16px] overflow-hidden transition-colors duration-150 ${
          isExpanded ? 'border-[#387440]' : 'border-[#e8e8e4]'
        }`}
        style={{
          boxShadow: isExpanded
            ? '0px 4px 0px 0px rgba(42,87,48,0.2)'
            : '0px 4px 0px 0px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header row — always 84px — Figma 3550:47566 */}
        <div className="flex items-center gap-[10px] h-[84px] px-[15px]">
          {/* Icon container: light-green bg when expanded, gradient when collapsed */}
          <div
            className="size-[38px] rounded-[10px] flex items-center justify-center shrink-0"
            style={{ background: isExpanded ? '#f7fee7' : ICON_GRADIENT }}
          >
            <Icon className="size-5 text-[#387440]" />
          </div>

          {/* Text block */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-[8px] mb-[2px]">
              <span className="font-sans font-bold text-[13px] text-[#111] leading-normal truncate">
                {label}
              </span>
              {hasDone && (
                <span className="font-bold text-[10px] text-[#1d7c4d] leading-normal whitespace-nowrap shrink-0">
                  ✓ Done
                </span>
              )}
              {isExpanded && (
                <span className="font-bold text-[10px] text-[#c8951a] leading-normal whitespace-nowrap shrink-0">
                  In progress
                </span>
              )}
            </div>

            {/* Subtitle — "Added: …" when expanded, specifics list when collapsed */}
            <p className="font-sans text-[11px] text-[#70706e] leading-normal mb-[4px] truncate">
              {specifics.length > 0
                ? (isExpanded ? 'Added: ' : '') + specifics.join(' · ')
                : 'No specifics added yet'}
            </p>

            {/* Tags row — specifics count + Primary when expanded */}
            <div className="flex items-center gap-[6px]">
              <span className="inline-flex items-center bg-[#ebf1ec] border border-[#c1d4c4] rounded-full h-[19px] px-[8px] font-semibold text-[10px] text-[#2a5730] leading-none">
                {specifics.length} specific{specifics.length !== 1 ? 's' : ''}
              </span>
              {isExpanded && (
                <span className="inline-flex items-center bg-[#fefcf5] border border-[#e2dcca] rounded-full h-[19px] px-[8px] font-semibold text-[10px] text-[#999] leading-none">
                  Primary
                </span>
              )}
            </div>
          </div>

          {/* Action buttons — 28×28 each */}
          <div className="flex items-center gap-[5px] shrink-0">
            <button
              type="button"
              onClick={onToggle}
              className="size-[28px] bg-white border border-[#e8e8e4] rounded-[6px] flex items-center justify-center text-[#555] hover:bg-[#f8f8f4] transition-colors duration-150"
              aria-label={isExpanded ? `Collapse ${label}` : `Expand ${label}`}
            >
              {isExpanded ? (
                <ChevronUpIcon className="size-3" />
              ) : (
                <ChevronDownIcon className="size-3" />
              )}
            </button>
            <button
              type="button"
              onClick={onRemoveCategory}
              className="size-[28px] bg-white border border-[#e8e8e4] rounded-[6px] flex items-center justify-center text-[#555] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors duration-150"
              aria-label={`Remove ${label}`}
            >
              <TrashIcon className="size-3" />
            </button>
          </div>
        </div>

        {/* Expanded panel — Figma 3547:47286 (h-118px) */}
        {isExpanded && (
          <div
            className="border-t px-[15px] pb-[12px]"
            style={{
              background: 'rgba(235,241,236,0.5)',
              borderTopColor: 'rgba(0,0,0,0.06)',
            }}
          >
            {/* Section label — "SPECIFICS INSIDE …" */}
            <p className="font-bold text-[10px] text-[#387440] tracking-[0.6px] uppercase pt-[14px] pb-[8px]">
              Specifics inside {label}
            </p>

            {/* Removable chips — bg-white border-[#c1d4c4] h-27px */}
            {specifics.length > 0 && (
              <div className="flex flex-wrap items-center gap-[6px] mb-[8px]">
                {specifics.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-[4px] bg-white border border-[#c1d4c4] rounded-full h-[27px] pl-[11px] pr-[8px] font-semibold text-[12px] text-[#387440] leading-none shrink-0"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => onRemoveSpecific(s)}
                      className="font-semibold text-[11px] text-[#babab7] hover:text-[#555] leading-none ml-[2px]"
                      aria-label={`Remove ${s}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input + Add button — Figma 3547:47297 / 3547:47300 */}
            <div className="flex items-center gap-[8px]">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddFromInput();
                }}
                placeholder="Add a specific — e.g. 'Mobile dev', 'Cloud infra', 'Cybersecurity'…"
                className="flex-1 h-[34px] bg-white border border-[#e8e8e4] rounded-[10px] px-[11px] font-sans text-[12px] text-[#111] outline-none focus:border-[#387440] transition-colors duration-150"
                style={{ '::placeholder': { color: '#c8c8c8' } }}
              />
              <Button variant="primary" size="sm" onClick={handleAddFromInput}>
                + Add
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Suggestions row — below the card, only when expanded ─────────── */}
      {isExpanded && suggestions && suggestions.length > 0 && (
        <div>
          {/* "SUGGESTIONS FOR …" label — Figma 3576:89634: bold 10px #70706e tracking-[0.7px] uppercase */}
          <p className="font-bold text-[10px] text-[#70706e] tracking-[0.7px] uppercase mt-[2px] mb-[4px]">
            Suggestions for {label}
          </p>
          {/* Horizontal divider — Figma 3576:89635 */}
          <div className="h-px mb-[6px]" style={{ background: 'rgba(0,0,0,0.07)' }} />
          {/* 2-column grid — Figma 3576:89506–89622 */}
          <div className="grid grid-cols-2 gap-[6px]">
            {suggestions.map((sugg) => {
              const sLabel = sugg.label;
              const SuggIcon = sugg.Icon;
              const isAdded = specifics.includes(sLabel);
              return (
                <button
                  key={sLabel}
                  type="button"
                  disabled={isAdded}
                  onClick={() => !isAdded && onAddSpecific(sLabel)}
                  className="flex items-center gap-[8px] pl-[9px] pr-[10px] py-[11px] rounded-[10px] border border-[#fef1e7] bg-white text-left w-full transition-opacity duration-150 hover:opacity-80"
                  style={isAdded ? { backgroundImage: SUGGESTION_GRADIENT } : undefined}
                >
                  <SuggIcon
                    className={`size-[16px] shrink-0 ${isAdded ? 'text-[#387440]' : 'text-[#C1D4C4]'}`}
                  />
                  <span
                    className="font-sans text-[12px] leading-normal whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{
                      color: isAdded ? '#387440' : '#70706e',
                      fontWeight: isAdded ? 600 : 400,
                    }}
                  >
                    {sLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

// ─── Right panel ─────────────────────────────────────────────────────────────

const Stage2RightPanel = () => (
  <aside
    className="w-[clamp(240px,19.04vw,329px)] shrink-0 bg-[#f8f8f4] border-l border-[#e8e8e4] overflow-y-auto [&::-webkit-scrollbar]:hidden"
    aria-label="Interests guidance"
    style={{ scrollbarWidth: 'none' }}
  >
    <div className="flex flex-col gap-[10px] p-[clamp(12px,1.16vw,20px)]">
      {/* WHY INTERESTS MATTER — bg-white, rounded-[16px] */}
      <div className="bg-white border border-[#e8e8e4] rounded-[16px] p-[clamp(12px,0.93vw,16px)]">
        <p className="font-bold text-[10px] uppercase tracking-[0.08em] text-[#888] mb-[8px]">
          Why Interests Matter
        </p>
        <p className="font-sans text-[11px] text-[#70706e] leading-[1.6] mb-[10px]">
          Categories solve the cold-start problem — you match to at least 2–3 roles before
          you&apos;ve filled anything else. Specifics surface you to mentors with the same niche.
        </p>
        <div className="flex items-center gap-[10px] bg-[#f4f4f0] rounded-[10px] p-[10px]">
          <span className="font-display not-italic text-[22px] leading-none text-[#111] shrink-0">
            22%
          </span>
          <div>
            <p className="font-sans font-semibold text-[11px] text-[#111] leading-tight">
              Profile strength
            </p>
            <p className="font-sans text-[10px] text-[#70706e] leading-tight mt-[2px]">
              Two stages done. Interests fills the matching engine.
            </p>
          </div>
        </div>
      </div>

      {/* WHAT COUNTS? */}
      <div
        className="border border-[#c1d4c4] rounded-[10px] p-[clamp(12px,0.93vw,16px)]"
        style={{ background: 'rgba(235,241,236,0.5)' }}
      >
        <p className="font-bold text-[10px] uppercase tracking-[0.08em] text-[#888] mb-[8px]">
          What Counts?
        </p>
        <ul className="flex flex-col gap-[5px]">
          {[
            "Things you'd do without pay",
            'Topics you read for fun',
            "Skills you're building on the side",
            'Industries you want to work in',
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-[6px] font-sans text-[11px] text-[#70706e] leading-[1.5]"
            >
              <span className="font-bold text-[#387440] shrink-0 mt-px">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* POPULAR IN GHANA */}
      <div className="bg-white border border-[#e8e8e4] rounded-[10px] p-[clamp(12px,0.93vw,16px)]">
        <p className="font-bold text-[10px] uppercase tracking-[0.08em] text-[#888] mb-[8px]">
          Popular in Ghana
        </p>
        <p className="font-sans text-[11px] text-[#70706e] leading-[1.6]">
          Tech &amp; Engineering, Business, and Creative Arts are the top 3. Health Sciences and
          Education are rising fast in the 2024 cohort.
        </p>
      </div>

      {/* THE SWEET SPOT */}
      <div className="bg-white border border-[#e8e8e4] rounded-[10px] p-[clamp(12px,0.93vw,16px)]">
        <p className="font-bold text-[10px] uppercase tracking-[0.08em] text-[#888] mb-[8px]">
          The Sweet Spot
        </p>
        <p className="font-sans text-[11px] text-[#70706e] leading-[1.6]">
          3–5 categories. 8–10 specifics. Too few = broad matches. Too many = noise. Depth beats
          breadth here.
        </p>
      </div>

      {/* MENTOR MATCHING */}
      <div
        className="border border-[#c1d4c4] rounded-[10px] p-[clamp(12px,0.93vw,16px)]"
        style={{ background: 'rgba(235,241,236,0.5)' }}
      >
        <p className="font-bold text-[10px] uppercase tracking-[0.08em] text-[#888] mb-[8px]">
          Mentor Matching
        </p>
        <p className="font-sans text-[11px] text-[#70706e] leading-[1.6]">
          Add 2 more specifics to unlock — you&apos;ll be surfaced to senior professionals in the
          same niche.
        </p>
      </div>
    </div>
  </aside>
);

// ─── Main section ─────────────────────────────────────────────────────────────

const InterestsStage2Section = () => {
  log('mount', { route: '/profile/filling/interests/categories', stageIndex: 1 });
  const navigate = useNavigate();

  const [expandedIds, setExpandedIds] = useState(new Set());
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [inputValues, setInputValues] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const handleGoBack = () => {
    log('go back → /profile/filling/interests');
    navigate('/profile/filling/interests');
  };

  const handleNext = () => {
    log('next → interests complete modal');
    setIsCompleteModalOpen(true);
  };

  const handleContinueToPersonality = () => {
    log('continue to personality → /profile/filling/personality');
    setIsCompleteModalOpen(false);
    navigate('/profile/filling/personality');
  };

  const toggleCard = (id) => {
    log('toggle card', { id });
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeCategory = (id) => {
    log('remove category', { id });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleInputChange = (id, value) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const addSpecific = (id, specific) => {
    log('add specific', { id, specific });
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id && !c.specifics.includes(specific)
          ? { ...c, specifics: [...c.specifics, specific] }
          : c
      )
    );
    setInputValues((prev) => ({ ...prev, [id]: '' }));
  };

  const removeSpecific = (id, specific) => {
    log('remove specific', { id, specific });
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, specifics: c.specifics.filter((s) => s !== specific) } : c
      )
    );
  };

  const handleAddFromModal = (newCats) => {
    log('add categories from modal', { count: newCats.length });
    setCategories((prev) => {
      const existingIds = new Set(prev.map((c) => c.id));
      const toAdd = newCats
        .filter((c) => !existingIds.has(c.id))
        .map((c) => ({
          id: c.id,
          label: c.label,
          Icon: c.Icon,
          specifics: [],
          suggestions: c.suggestions ?? [],
        }));
      return [...prev, ...toAdd];
    });
  };

  const totalSpecifics = categories.reduce((sum, c) => sum + c.specifics.length, 0);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top nav */}
      <div className="shrink-0 h-[clamp(64px,5.2vw,90px)] flex items-stretch">
        <EngagementTopNav
          bgClass="bg-neutral"
          onSaveExit={handleSaveExit}
          showSwitchModes={false}
          className="w-full h-full"
        />
      </div>

      {/* Stage trail bar — Interests (index 1) active */}
      <div className="shrink-0 h-[clamp(60px,4.46vw,77px)] flex items-stretch">
        <EngagementTopBar currentStageIndex={1} completionPct={0} className="w-full h-full" />
      </div>

      {/* Main */}
      <main className="flex-1 min-h-0 overflow-hidden flex">
        {/* Left column */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {/* Header — Figma 3531:46294 */}
            <section
              aria-label="Interests — what pulls you in"
              className="border-b border-[rgba(0,0,0,0.07)] px-[clamp(20px,3.24vw,56px)] py-[clamp(20px,2.31vw,40px)]"
            >
              <h2 className="font-display text-[clamp(26px,2.89vw,50px)] leading-[0.92] tracking-[-2px] mb-[clamp(8px,0.93vw,16px)]">
                <span className="not-italic text-[#111]">What pulls </span>
                <span className="italic text-[#387440]">you in?</span>
              </h2>
              <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-[1.6] text-[#70706e] mb-[clamp(10px,0.93vw,16px)] max-w-[680px]">
                Pick broad areas first, then add specifics. Drives your role matches, mentor
                suggestions, and Squad recommendations. Multi-entry — add as many as fit. Real ones
                only.
              </p>
              <div className="flex items-center flex-wrap gap-[8px]">
                {[
                  `${categories.length} categories`,
                  `${totalSpecifics} specific interests`,
                  '4 min',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center font-sans font-medium text-[clamp(10px,0.69vw,12px)] leading-4 text-[#70706e] bg-white rounded-full px-[10px] py-[4px] border border-[#c1d4c4] whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Section heading — Figma 3531:46331 */}
            <div className="px-[clamp(20px,3.24vw,56px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(10px,0.93vw,16px)]">
              <p className="font-bold text-[10px] uppercase tracking-[0.08em] text-[#888] mb-[6px]">
                What this stage covers
              </p>
              <h3 className="font-display text-[clamp(20px,1.97vw,34px)] leading-[1.05] tracking-[-1px] mb-[4px]">
                <span className="not-italic text-[#111]">Broad areas </span>
                <span className="italic text-[#387440]">first.</span>
              </h3>
              <p className="font-sans text-[clamp(10px,0.69vw,12px)] text-[#737373] leading-[1.5]">
                Pick 2–6 categories that genuinely describe you. Expand any card to add specifics
                inside it.
              </p>
            </div>

            {/* Category accordion cards + inline suggestions */}
            <div className="flex flex-col gap-[8px] px-[clamp(20px,3.24vw,56px)] pb-[8px]">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  isExpanded={expandedIds.has(cat.id)}
                  onToggle={() => toggleCard(cat.id)}
                  onRemoveCategory={() => removeCategory(cat.id)}
                  inputValue={inputValues[cat.id] ?? ''}
                  onInputChange={(v) => handleInputChange(cat.id, v)}
                  onAddSpecific={(s) => addSpecific(cat.id, s)}
                  onRemoveSpecific={(s) => removeSpecific(cat.id, s)}
                />
              ))}
            </div>

            {/* Add another interest category — dashed green button → opens modal */}
            <div className="px-[clamp(20px,3.24vw,56px)] pt-[8px] pb-[clamp(16px,1.85vw,32px)]">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="w-full flex items-center justify-center gap-[10px] rounded-[16px] py-[clamp(16px,1.62vw,28px)] font-sans font-semibold text-[clamp(12px,0.81vw,14px)] text-[#387440] transition-colors duration-150 hover:bg-[rgba(235,241,236,0.7)]"
                style={{
                  background: 'rgba(235,241,236,0.5)',
                  border: '2px dashed #387440',
                }}
              >
                <span className="size-[20px] bg-[#387440] rounded-[4px] flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                    className="size-3"
                  >
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                </span>
                Add Another Interest Category
              </button>
            </div>

            {/* Live role matches — Figma 3547:47351 */}
            <div className="px-[clamp(20px,3.24vw,56px)] pb-[clamp(24px,2.31vw,40px)]">
              <div className="bg-[#fffefc] border border-[#eedeb8] rounded-[10px] p-[clamp(14px,1.39vw,24px)]">
                <p className="font-bold text-[10px] uppercase tracking-[0.08em] text-[#967014] mb-[10px]">
                  Live Role Matches from Your Interests
                </p>
                <div className="flex flex-col gap-[8px] mb-[8px]">
                  {ROLE_MATCHES.map(({ role, company, pct }) => (
                    <div key={role} className="flex items-center justify-between gap-[8px]">
                      <span className="font-sans font-semibold text-[12px] text-[#967014] min-w-0 truncate">
                        {role} · {company}
                      </span>
                      <span className="inline-flex items-center bg-[#f7efdd] rounded-full px-[8px] py-[2px] font-bold text-[10px] text-[#967014] whitespace-nowrap shrink-0">
                        {pct}% match
                      </span>
                    </div>
                  ))}
                </div>
                <p className="font-sans text-[11px] text-[rgba(17,17,17,0.55)] underline underline-offset-2 cursor-pointer">
                  +139 more in Opportunities →
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="shrink-0 h-[142px] border-t border-[#f1f5f9] bg-white flex items-center px-[clamp(20px,3.24vw,56px)]">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-[6px]">
                <span
                  aria-hidden="true"
                  className="inline-block w-[6px] h-[6px] rounded-[3px] bg-[#387440] shrink-0"
                />
                <span className="font-sans text-[12px] leading-5 text-[#555]">
                  Auto-saved · changes carry to all tabs
                </span>
              </div>

              <div className="flex items-center gap-6">
                <Button
                  variant="tertiary"
                  size="md"
                  onClick={handleGoBack}
                  leftIcon={<ArrowLeftIcon className="size-3.5" />}
                >
                  Avatar
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  rightIcon={<ArrowRightIcon className="size-3.5" />}
                >
                  Next: Personality
                </Button>
              </div>
            </div>
          </footer>
        </div>

        {/* Right panel */}
        <Stage2RightPanel />
      </main>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selectedIds={categories.map((c) => c.id)}
        onDone={handleAddFromModal}
      />

      {/* Interests Complete Modal — Figma 3576:101711 */}
      <InterestsCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onContinue={handleContinueToPersonality}
        categoryCount={categories.length}
        specificCount={totalSpecifics}
        roleMatchCount={142}
      />
    </div>
  );
};

export default InterestsStage2Section;
