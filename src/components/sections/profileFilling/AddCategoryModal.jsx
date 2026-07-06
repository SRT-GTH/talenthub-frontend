import { useState } from 'react';
import Modal from '../../ui/Modal.jsx';
import { debug } from '../../../utils/debug.js';
import {
  CatCourtIcon,
  CatPenToolIcon,
  CatBusinessIcon,
  CatEducationIcon,
  CatArchitectureIcon,
  CatMediaIcon,
  CatAgricultureIcon,
  CatDevelopmentIcon,
  CatEntertainmentIcon,
  CatBankingIcon,
  CatResearchIcon,
  CatTourismIcon,
  CatEnergyIcon,
  CatStartupsIcon,
} from '../../shared/assets.jsx';

const log = debug('AddCategoryModal');

/*
 * AddCategoryModal — "Add an Interest Category" modal.
 * Figma frame 3576:89182 (outer card) / 3576:89186 (inner content).
 *
 * Shell:   Modal (portal, xl ~960px) with built-in X close button + overlay.
 * Body:    2-column grid of 16 category chips — active = gradient + SemiBold green;
 *          inactive = white + Regular gray. Chips already in selectedIds are locked active.
 * Footer:  "OR TYPE YOUR OWN" input + "Add Custom" → "Done Selecting" shelf button.
 */

// ─── Chip gradient — Figma 3576:89195 (active chip background) ───────────────
const CHIP_GRADIENT = 'linear-gradient(184.4deg, rgb(254,241,231) 0%, rgb(232,242,237) 20.192%)';

/*
 * Full catalog — 16 categories matching Figma 3576:89186.
 * `suggestions` seeds the collapsed card once added to the stage-2 list.
 * `Icon` is used both in this modal's chip AND as the card header icon.
 */
const CATEGORY_CATALOG = [
  {
    id: 'tech',
    label: 'Technology & Engineering',
    Icon: CatCourtIcon,
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
    label: 'Business & Finance',
    Icon: CatBusinessIcon,
    suggestions: [
      { label: 'Project management', Icon: CatCourtIcon },
      { label: 'Strategy consulting', Icon: CatCourtIcon },
      { label: 'Operations', Icon: CatMediaIcon },
      { label: 'Entrepreneurship', Icon: CatCourtIcon },
      { label: 'Sales', Icon: CatArchitectureIcon },
      { label: 'Supply chain', Icon: CatEducationIcon },
    ],
  },
  {
    id: 'health',
    label: 'Health Sciences',
    Icon: CatCourtIcon,
    suggestions: [
      { label: 'Public health', Icon: CatCourtIcon },
      { label: 'Clinical research', Icon: CatResearchIcon },
      { label: 'Nursing', Icon: CatCourtIcon },
      { label: 'Pharmacy', Icon: CatAgricultureIcon },
      { label: 'Mental health', Icon: CatCourtIcon },
      { label: 'Biotechnology', Icon: CatMediaIcon },
    ],
  },
  {
    id: 'education',
    label: 'Education & Teaching',
    Icon: CatEducationIcon,
    suggestions: [
      { label: 'Curriculum design', Icon: CatEducationIcon },
      { label: 'EdTech', Icon: CatBusinessIcon },
      { label: 'Special education', Icon: CatCourtIcon },
      { label: 'Tutoring', Icon: CatCourtIcon },
      { label: 'Higher education', Icon: CatArchitectureIcon },
      { label: 'Vocational training', Icon: CatMediaIcon },
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture & Built Env.',
    Icon: CatArchitectureIcon,
    suggestions: [
      { label: 'Urban design', Icon: CatArchitectureIcon },
      { label: 'Interior design', Icon: CatEntertainmentIcon },
      { label: 'Civil engineering', Icon: CatEducationIcon },
      { label: 'Structural engineering', Icon: CatMediaIcon },
      { label: 'Real estate', Icon: CatBusinessIcon },
      { label: 'Landscape architecture', Icon: CatAgricultureIcon },
    ],
  },
  {
    id: 'media',
    label: 'Media & Communications',
    Icon: CatMediaIcon,
    suggestions: [
      { label: 'Journalism', Icon: CatMediaIcon },
      { label: 'Public relations', Icon: CatCourtIcon },
      { label: 'Broadcasting', Icon: CatEntertainmentIcon },
      { label: 'Social media', Icon: CatArchitectureIcon },
      { label: 'Advertising', Icon: CatBusinessIcon },
      { label: 'Copywriting', Icon: CatCourtIcon },
    ],
  },
  {
    id: 'law',
    label: 'Law & Policy',
    Icon: CatCourtIcon,
    suggestions: [
      { label: 'Corporate law', Icon: CatCourtIcon },
      { label: 'Human rights', Icon: CatDevelopmentIcon },
      { label: 'Public policy', Icon: CatMediaIcon },
      { label: 'International law', Icon: CatCourtIcon },
      { label: 'Compliance', Icon: CatBusinessIcon },
      { label: 'Arbitration', Icon: CatEducationIcon },
    ],
  },
  {
    id: 'agriculture',
    label: 'Agriculture & Food',
    Icon: CatAgricultureIcon,
    suggestions: [
      { label: 'Agribusiness', Icon: CatAgricultureIcon },
      { label: 'Food technology', Icon: CatBusinessIcon },
      { label: 'Crop science', Icon: CatAgricultureIcon },
      { label: 'Livestock', Icon: CatAgricultureIcon },
      { label: 'Irrigation', Icon: CatEducationIcon },
      { label: 'AgriTech', Icon: CatMediaIcon },
    ],
  },
  {
    id: 'development',
    label: 'Development & NGO',
    Icon: CatDevelopmentIcon,
    suggestions: [
      { label: 'International development', Icon: CatDevelopmentIcon },
      { label: 'Community organizing', Icon: CatCourtIcon },
      { label: 'Fundraising', Icon: CatBusinessIcon },
      { label: 'Program management', Icon: CatEducationIcon },
      { label: 'Social impact', Icon: CatDevelopmentIcon },
      { label: 'Grant writing', Icon: CatMediaIcon },
    ],
  },
  {
    id: 'energy',
    label: 'Energy & Environment',
    Icon: CatEnergyIcon,
    suggestions: [
      { label: 'Renewable energy', Icon: CatEnergyIcon },
      { label: 'Climate policy', Icon: CatDevelopmentIcon },
      { label: 'Oil & gas', Icon: CatMediaIcon },
      { label: 'Environmental science', Icon: CatAgricultureIcon },
      { label: 'Sustainability', Icon: CatEducationIcon },
      { label: 'Carbon markets', Icon: CatBusinessIcon },
    ],
  },
  {
    id: 'entertainment',
    label: 'Arts & Entertainment',
    Icon: CatEntertainmentIcon,
    suggestions: [
      { label: 'Music', Icon: CatEntertainmentIcon },
      { label: 'Film & TV', Icon: CatArchitectureIcon },
      { label: 'Gaming', Icon: CatBusinessIcon },
      { label: 'Theatre', Icon: CatEntertainmentIcon },
      { label: 'Dance', Icon: CatCourtIcon },
      { label: 'Fashion', Icon: CatCourtIcon },
    ],
  },
  {
    id: 'startups',
    label: 'Startups & VC',
    Icon: CatStartupsIcon,
    suggestions: [
      { label: 'Venture capital', Icon: CatBankingIcon },
      { label: 'Product management', Icon: CatBusinessIcon },
      { label: 'Growth hacking', Icon: CatMediaIcon },
      { label: 'Angel investing', Icon: CatDevelopmentIcon },
      { label: 'Fundraising', Icon: CatEducationIcon },
      { label: 'Pitch decks', Icon: CatCourtIcon },
    ],
  },
  {
    id: 'banking',
    label: 'Banking & Insurance',
    Icon: CatBankingIcon,
    suggestions: [
      { label: 'Investment banking', Icon: CatBankingIcon },
      { label: 'Retail banking', Icon: CatBusinessIcon },
      { label: 'Actuarial science', Icon: CatResearchIcon },
      { label: 'Risk management', Icon: CatMediaIcon },
      { label: 'FinTech', Icon: CatEducationIcon },
      { label: 'Microfinance', Icon: CatDevelopmentIcon },
    ],
  },
  {
    id: 'research',
    label: 'Research & Science',
    Icon: CatResearchIcon,
    suggestions: [
      { label: 'Data analysis', Icon: CatCourtIcon },
      { label: 'Lab research', Icon: CatResearchIcon },
      { label: 'Academic writing', Icon: CatMediaIcon },
      { label: 'Statistics', Icon: CatEducationIcon },
      { label: 'Physics', Icon: CatResearchIcon },
      { label: 'Chemistry', Icon: CatAgricultureIcon },
    ],
  },
  {
    id: 'tourism',
    label: 'Tourism & Hospitality',
    Icon: CatTourismIcon,
    suggestions: [
      { label: 'Hotel management', Icon: CatTourismIcon },
      { label: 'Travel & tourism', Icon: CatArchitectureIcon },
      { label: 'Event planning', Icon: CatEntertainmentIcon },
      { label: 'Food & beverage', Icon: CatAgricultureIcon },
      { label: 'Airline ops', Icon: CatEducationIcon },
      { label: 'Eco-tourism', Icon: CatDevelopmentIcon },
    ],
  },
];

// ─── Close icon ────────────────────────────────────────────────────────────────
const XIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    className="size-[14px]"
  >
    <path d="M3 3l10 10M13 3L3 13" />
  </svg>
);

// ─── Single category chip ──────────────────────────────────────────────────────
const CategoryChip = ({ cat, isSelected, isLocked, onToggle }) => (
  <button
    type="button"
    disabled={isLocked}
    onClick={onToggle}
    className="flex items-center gap-[8px] pl-[9px] pr-[12px] py-[11px] rounded-[10px] border border-[#fef1e7] bg-white text-left w-full transition-opacity duration-150 hover:opacity-80 disabled:cursor-default"
    style={isSelected ? { backgroundImage: CHIP_GRADIENT } : undefined}
  >
    <cat.Icon
      className={`size-[16px] shrink-0 ${isSelected ? 'text-[#387440]' : 'text-[#C1D4C4]'}`}
    />
    <span
      className="font-sans text-[12px] leading-normal truncate"
      style={{ color: isSelected ? '#387440' : '#70706e', fontWeight: isSelected ? 600 : 400 }}
    >
      {cat.label}
    </span>
  </button>
);

// ─── Main modal ────────────────────────────────────────────────────────────────
const AddCategoryModal = ({ isOpen, onClose, selectedIds = [], onDone }) => {
  log('mount', { isOpen, selectedCount: selectedIds.length });

  const [pendingIds, setPendingIds] = useState(new Set());
  const [customInput, setCustomInput] = useState('');

  const togglePending = (id) => {
    log('toggle pending', { id });
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddCustom = () => {
    const v = customInput.trim();
    if (!v) return;
    log('add custom category', { label: v });
    const customId = `custom-${v.toLowerCase().replace(/\s+/g, '-')}`;
    const customCat = {
      id: customId,
      label: v,
      Icon: CatCourtIcon,
      suggestions: [],
    };
    onDone?.([customCat]);
    setCustomInput('');
    onClose?.();
  };

  const handleDone = () => {
    const newCats = CATEGORY_CATALOG.filter(
      (c) => pendingIds.has(c.id) && !selectedIds.includes(c.id)
    );
    log('done selecting', { newCount: newCats.length, ids: newCats.map((c) => c.id) });
    onDone?.(newCats);
    setPendingIds(new Set());
    setCustomInput('');
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      ariaLabel="Add an Interest Category"
      contentClassName="overflow-hidden"
    >
      {/* ── Scrollable body ──────────────────────────────────────────────── */}
      <div className="px-[clamp(24px,3.47vw,60px)] pt-[36px] pb-[24px] overflow-y-auto max-h-[calc(90vh-100px)] no-scrollbar">
        {/* Header — Figma 3576:89188 */}
        <div className="flex flex-col items-center gap-[16px] mb-[20px]">
          {/* "Interest Category" pill — Figma 3576:89190 */}
          <div className="inline-flex items-center gap-[6px] bg-[rgba(235,241,236,0.5)] border border-[#c1d4c4] rounded-[6px] h-[24px] px-[10px]">
            <span
              className="size-[8px] rounded-full shrink-0 border-[1.5px] border-[#1d7c4d]"
              style={{
                background: '#c1d4c4',
                boxShadow: '0px 0px 4px 0px #387440',
              }}
            />
            <span className="font-sans text-[12px] text-[#999] tracking-[0.2px] leading-none whitespace-nowrap">
              Interest Category
            </span>
          </div>

          {/* Title — Figma 3576:89192: Instrument Serif 32px tracking-[-1.2px] */}
          <h2 className="font-display text-[clamp(24px,2.31vw,32px)] text-center leading-[1.1] tracking-[-1.2px]">
            <span className="not-italic text-[#111]">Add an </span>
            <span className="italic text-[#387440]">Interest Category</span>
          </h2>

          {/* Subtitle — Figma 3576:89193: Regular 12px #959592 */}
          <p className="font-sans text-[12px] text-[#959592] tracking-[0.2px] leading-[1.6] text-center max-w-[560px]">
            Pick from the list below or type your own. You can remove categories any time. No wrong
            answers — be honest about what actually interests you.
          </p>
        </div>

        {/* 2-column grid of 16 categories — Figma 3576:89194 */}
        <div className="grid grid-cols-2 gap-[6px]">
          {CATEGORY_CATALOG.map((cat) => {
            const isLocked = selectedIds.includes(cat.id);
            const isSelected = isLocked || pendingIds.has(cat.id);
            return (
              <CategoryChip
                key={cat.id}
                cat={cat}
                isSelected={isSelected}
                isLocked={isLocked}
                onToggle={() => !isLocked && togglePending(cat.id)}
              />
            );
          })}
        </div>

        {/* "Or type your own" — Figma 3576:89211 */}
        <div className="mt-[20px] flex flex-col gap-[10px]">
          {/* Label + divider */}
          <div className="flex items-center gap-[14px]">
            <span className="font-bold text-[10px] text-[#595959] tracking-[0.7px] uppercase whitespace-nowrap shrink-0">
              Or type your own
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.07)' }} />
          </div>

          {/* Input + Add Custom button — Figma 3576:89216 / 3576:89219 */}
          <div className="flex flex-wrap items-center  gap-[12px]">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCustom();
              }}
              placeholder="Add a specific — e.g. 'Mobile dev', 'Cloud infra'…"
              className="flex-1 min-w-0 h-[40px] bg-white border border-[#e8e8e4] rounded-[10px] px-[11px] font-sans text-[12px] text-[#111] outline-none focus:border-[#387440] transition-colors duration-150 placeholder-[#c8c8c8]"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="h-[40px] px-[18px] bg-[#387440] border-2 border-[#2a5730] rounded-[10px] font-bold text-[12px] text-white leading-none whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity duration-150"
              style={{ filter: 'drop-shadow(0px 3px 0px #2a5730)' }}
            >
              + Add Custom
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer — Figma 3576:89221 ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center w-full justify-center sm:justify-between gap-x-[16px] gap-y-[12px] px-[clamp(24px,3.47vw,60px)] py-[20px] border-t border-[#e8e8e4]">
        {/* Auto-saved indicator */}
        <div className="flex  items-center gap-[10px] shrink-0">
          <span className="size-[6px] rounded-[3px] shrink-0" style={{ background: '#387440' }} />
          <span className="font-sans text-nowrap text-[12px] text-[#babab7] leading-none">
            Auto-saved · changes carry to all tabs
          </span>
        </div>

        {/* Done Selecting — Figma 3576:89230: shelf button, white bg, black border */}
        <button
          type="button"
          onClick={handleDone}
          className="font-sans font-semibold text-[14px] text-[#111] leading-[24px] tracking-[0.1px] rounded-[14px] px-[34px] py-[14px] bg-white whitespace-nowrap shrink-0 hover:bg-[#f8f8f4] transition-colors duration-150"
          style={{
            borderTop: '1px solid rgba(17,17,17,0.2)',
            borderRight: '2px solid rgba(17,17,17,0.3)',
            borderBottom: '2px solid rgba(17,17,17,0.3)',
            borderLeft: '2px solid rgba(17,17,17,0.3)',
            filter: 'drop-shadow(0px 4px 0px rgba(17,17,17,0.25))',
          }}
        >
          Done Selecting
        </button>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
