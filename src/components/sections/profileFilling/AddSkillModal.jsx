import { useState, useEffect } from 'react';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('AddSkillModal');

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Data & Analytics',
  'Design & Creative',
  'Engineering',
  'Leadership',
  'Marketing',
  'Soft Skills',
  'Research',
  'Product',
];

const PROFICIENCY_LEVELS = [
  { label: 'Beginner', dots: 1 },
  { label: 'Intermediate', dots: 2 },
  { label: 'Advanced', dots: 3 },
  { label: 'Expert', dots: 4 },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const CloseXIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    className={className}
  >
    <line x1="3" y1="3" x2="13" y2="13" />
    <line x1="13" y1="3" x2="3" y2="13" />
  </svg>
);

// Hugeicons / game-controller-03 style
const GameControllerIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M2.00825 15.8092C2.23114 12.3161 2.88737 9.7599 3.44345 8.27511C3.72419 7.5255 4.32818 6.96728 5.10145 6.78021C9.40147 5.73993 14.5986 5.73993 18.8986 6.78021C19.6719 6.96728 20.2759 7.5255 20.5566 8.27511C21.1127 9.7599 21.7689 12.3161 21.9918 15.8092C22.1251 17.8989 20.6148 19.0503 18.9429 19.8925C17.878 20.4289 17.0591 18.8457 16.5155 17.6203C16.2185 16.9508 15.5667 16.5356 14.8281 16.5356H9.17196C8.43331 16.5356 7.78158 16.9508 7.48456 17.6203C6.94089 18.8457 6.122 20.4289 5.05711 19.8925C3.40215 19.0588 1.87384 17.9157 2.00825 15.8092Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5 4.5L6.96285 4M19 4.5L17 4"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9 13L7.5 11.5M7.5 11.5L6 10M7.5 11.5L6 13M7.5 11.5L9 10"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <path
      d="M15.9883 10H15.9973"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M17.9883 13H17.9973"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

// ─── ProficiencyCard ──────────────────────────────────────────────────────────
/*
 * Single proficiency option card.
 * Default:  bg-white border-[#ebf1ec]
 * Selected: bg-[#ebf1ec] border-[#387440]
 * Dot row:  dots filled (#387440) up to `filledDots`, rest empty (#ebf1ec when default / white when selected)
 */
const ProficiencyCard = ({ label, filledDots, isSelected, onClick }) => {
  log('ProficiencyCard render', { label, isSelected });
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 min-w-[80px] h-[52px] rounded-[10px] border flex flex-col items-center justify-center gap-[8px] transition-all duration-150 cursor-pointer ${
        isSelected
          ? 'bg-[#ebf1ec] border-[#387440]'
          : 'bg-white border-[#ebf1ec] hover:border-[#c1d4c4]'
      }`}
    >
      <span
        className={`text-[12px] font-semibold leading-none tracking-[0] ${
          isSelected ? 'text-[#387440]' : 'text-[#111]'
        }`}
      >
        {label}
      </span>
      <div className="flex items-center gap-[8px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="size-[6px] rounded-[3px] shrink-0 transition-colors duration-150"
            style={{
              background:
                i < filledDots ? '#387440' : isSelected ? 'rgba(56,116,64,0.2)' : '#ebf1ec',
            }}
          />
        ))}
      </div>
    </button>
  );
};

// ─── CategoryChip ─────────────────────────────────────────────────────────────
const CategoryChip = ({ label, isSelected, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`h-[34px] px-[12px] py-[8px] rounded-full border text-[10px] font-medium tracking-[0.2px] whitespace-nowrap transition-all duration-150 cursor-pointer ${
      isSelected
        ? 'bg-[#ebf1ec] border-[#387440] text-[#387440]'
        : 'bg-white border-[#e1eae2] text-[#70706e] hover:border-[#c1d4c4]'
    }`}
    style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
  >
    {label}
  </button>
);

// ─── AddSkillModal ────────────────────────────────────────────────────────────
/*
 * Full "Add A Skill" modal.
 * Source: Figma frame 3721:22423.
 *
 * Props:
 *   isOpen   {boolean}
 *   onClose  {() => void}
 *   onAdd    {({ name, proficiency, categories, usedAt }) => void}
 */
const AddSkillModal = ({ isOpen, onClose, onAdd }) => {
  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [usedAt, setUsedAt] = useState('');

  log('mount', { isOpen });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      log('modal opened — resetting form');
      setSkillName('');
      setProficiency(null);
      setSelectedCategories([]);
      setUsedAt('');
    }
  }, [isOpen]);

  const toggleCategory = (cat) => {
    log('toggle category', { cat });
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleAdd = () => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    log('add skill', { name: trimmed, proficiency, selectedCategories, usedAt });
    onAdd({
      name: trimmed,
      proficiency: proficiency ?? 'Intermediate',
      categories: selectedCategories,
      usedAt: usedAt.trim(),
    });
    onClose();
  };

  // Dynamic callout: shows skill name if typed, else generic text
  const calloutSkillName = skillName.trim() || 'Your skill';
  const canAdd = skillName.trim().length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      ariaLabel="Add a skill"
      showClose={false}
      contentClassName="!rounded-[24px] !border-[3px] !border-[#c1d4c4] overflow-hidden"
    >
      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <div className="flex flex-col">
        {/* Custom close button — Figma 3721:22424: bg-[#ebf1ec] rounded-[20px] size-[28px] */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-[25px] top-[25px] z-10 size-[28px] rounded-[20px] bg-[#ebf1ec] flex items-center justify-center text-[#387440] hover:bg-[#c1d4c4] transition-colors duration-150"
        >
          <CloseXIcon className="size-[12px]" />
        </button>

        {/* Content scroll area */}
        <div className="overflow-y-auto max-h-[calc(90vh-90px)] px-[clamp(24px,3.5vw,56px)] pt-[clamp(28px,2.78vw,48px)] pb-[clamp(16px,1.39vw,24px)] flex flex-col gap-[20px]">
          {/* ── Header (Figma 3721:22429) ──────────────────────────────── */}
          <div className="flex flex-col items-center gap-[16px]">
            {/* Badge pill */}
            <div
              className="flex items-center gap-[6px] h-[24px] px-[14px] rounded-[6px] border border-[#c1d4c4] shrink-0"
              style={{ background: 'rgba(235,241,236,0.5)' }}
            >
              {/* Pulsing dot — Figma 3721:22431;2374:15122 */}
              <span
                className="size-[8px] rounded-full shrink-0 bg-[#c1d4c4]"
                style={{
                  border: '1.5px solid #1d7c4d',
                  boxShadow: '0px 0px 4px 0px #387440',
                }}
              />
              <span className="font-sans text-[12px] text-[#999] tracking-[0.2px] whitespace-nowrap leading-[18px]">
                Add A skill
              </span>
            </div>

            {/* Heading + subtitle */}
            <div className="flex flex-col items-center gap-[4px] text-center">
              <h2 className="font-display text-[clamp(24px,2.31vw,40px)] tracking-[-1.2px] leading-[1.1]">
                <span className="not-italic text-[#111]">What are y</span>
                <span className="italic text-[#387440]">ou adding?</span>
              </h2>
              <p className="font-sans text-[12px] text-[#959592] tracking-[0.2px] leading-[18px] max-w-[520px]">
                Fill in the name, set your proficiency honestly, and tag it to a category.
                That&apos;s it — you can verify it later.
              </p>
            </div>
          </div>

          {/* ── Skill Name (Figma 3721:22436) ──────────────────────────── */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between h-[21px]">
              <label
                htmlFor="add-skill-name"
                className="font-sans font-medium text-[14px] text-[#111] tracking-[0.2px] leading-[24px]"
              >
                Skill Name
              </label>
            </div>
            <div className="h-[51px] relative">
              <input
                id="add-skill-name"
                type="text"
                value={skillName}
                onChange={(e) => {
                  log('skill name change', { value: e.target.value });
                  setSkillName(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canAdd) handleAdd();
                }}
                placeholder="e.g. React, Tableau, Public Speaking…"
                className="w-full h-full bg-white border border-[#ccc] rounded-[10px] pl-[20px] pr-[16px] font-sans text-[14px] text-[#111] placeholder:text-[#959592] tracking-[0.2px] leading-[20px] outline-none transition-colors duration-150 focus:border-[#387440]"
                style={{ boxShadow: '0px 2.5px 0px 0px rgba(191,191,191,0.8)' }}
              />
            </div>
          </div>

          {/* ── Proficiency level (Figma 4137:23291) ──────────────────── */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between h-[21px]">
              <span className="font-sans font-medium text-[14px] text-[#111] tracking-[0.2px] leading-[24px]">
                Proficiency level
              </span>
              <span className="font-sans text-[12px] text-[#595959] tracking-[0.2px] leading-[18px]">
                optional, adds credibility
              </span>
            </div>
            <div className="flex items-stretch gap-[8px]">
              {PROFICIENCY_LEVELS.map(({ label, dots }) => (
                <ProficiencyCard
                  key={label}
                  label={label}
                  filledDots={dots}
                  isSelected={proficiency === label}
                  onClick={() => {
                    log('proficiency selected', { label });
                    setProficiency((prev) => (prev === label ? null : label));
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Category (Figma 4137:23127) ────────────────────────────── */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between h-[21px]">
              <span className="font-sans font-medium text-[14px] text-[#111] tracking-[0.2px] leading-[24px]">
                Category
              </span>
              <span className="font-sans text-[12px] text-[#595959] tracking-[0.2px] leading-[18px]">
                optional, adds credibility
              </span>
            </div>
            {/* Multi-select chip grid — Figma 4137:23147 */}
            <div className="flex flex-wrap gap-x-[8px] gap-y-[8px]">
              {CATEGORIES.map((cat) => (
                <CategoryChip
                  key={cat}
                  label={cat}
                  isSelected={selectedCategories.includes(cat)}
                  onToggle={() => toggleCategory(cat)}
                />
              ))}
            </div>
          </div>

          {/* ── Where you used it (Figma 4136:22970) ─────────────────── */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between h-[21px]">
              <span className="font-sans font-medium text-[14px] text-[#111] tracking-[0.2px] leading-[24px]">
                Where you used it
              </span>
              <span className="font-sans text-[12px] text-[#595959] tracking-[0.2px] leading-[18px]">
                optional, adds credibility
              </span>
            </div>
            <div className="h-[51px] relative">
              <input
                type="text"
                value={usedAt}
                onChange={(e) => {
                  log('used-at change', { value: e.target.value });
                  setUsedAt(e.target.value);
                }}
                placeholder="e.g. Farmerline internship, KNUST final year project, freelance work…"
                className="w-full h-full bg-white border border-[#ccc] rounded-[10px] pl-[20px] pr-[16px] font-sans text-[14px] text-[#595959] placeholder:text-[#959592] tracking-[0.2px] leading-[20px] outline-none transition-colors duration-150 focus:border-[#387440]"
                style={{ boxShadow: '0px 2.5px 0px 0px rgba(191,191,191,0.8)' }}
              />
            </div>
          </div>

          {/* ── Verifiable callout (Figma 3721:22439) ──────────────────── */}
          <div
            className="rounded-[16px] border border-[#c1d4c4] px-[21px] py-[10px] flex items-center gap-[12px] min-h-[57px]"
            style={{ background: 'rgba(235,241,236,0.5)' }}
          >
            <GameControllerIcon className="size-[24px] text-[#387440] shrink-0" />
            <div className="flex flex-col gap-[4px] flex-1 min-w-0">
              <p className="font-sans font-bold text-[12px] text-[#387440] leading-normal">
                {calloutSkillName} is verifiable in Skills Lab
              </p>
              <p className="font-sans text-[10px] text-[#70706e] leading-normal">
                Once you save, you can verify {calloutSkillName} in the Skills Lab (5–10 min). Pass
                = green ✓ on your card.
              </p>
            </div>
          </div>
        </div>

        {/* ── Sticky footer (Figma 3721:22460) ──────────────────────────── */}
        <div
          className="shrink-0 h-[90px] border-t flex items-center px-[clamp(20px,2.5vw,40px)]"
          style={{ borderTopColor: 'rgba(0,0,0,0.07)', background: 'white' }}
        >
          <div className="flex items-center justify-between w-full">
            {/* Auto-saved indicator — Figma 3721:22462/3/4 */}
            <div className="flex items-center gap-[10px]">
              <span className="size-[6px] rounded-[3px] bg-[#387440] shrink-0" aria-hidden="true" />
              <span className="font-sans text-[12px] text-[#babab7] leading-normal whitespace-nowrap">
                Auto-saved · changes carry to all tabs
              </span>
            </div>

            {/* Add skill CTA — Figma 4140:23391 */}
            <Button variant="primary" size="md" onClick={handleAdd} disabled={!canAdd}>
              Add skill →
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddSkillModal;
