import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import { debug } from '../../../utils/debug.js';
import { SkillIconJs, SkillIconPython, SkillIconJava } from '../../shared/assets.jsx';
import AddSkillModal from './AddSkillModal.jsx';
import Button from '../../ui/Button.jsx';

const log = debug('SkillsStage2Section');

/*
 * SkillsStage2Section — full page for /profile/filling/skills/categories.
 * Source: Figma frame 3669:28609.
 *
 * Layout (h-screen, overflow-hidden, flex-col):
 *   ┌─ EngagementTopNav
 *   ├─ EngagementTopBar (currentStageIndex=3 Skills)
 *   └─ main (flex-row)
 *       ├─ LEFT (flex-1, flex-col)
 *       │   ├─ Hero header  (Figma 3670:29134)
 *       │   ├─ "Stack Your Skills" section header (Figma 3669:28758)
 *       │   ├─ Skill card list (Figma 3676:29446, 3676:29415, 3676:29384, 3677:29774)
 *       │   ├─ "Add Another Skill" dashed button (Figma 3669:28769)
 *       │   └─ Footer
 *       └─ RIGHT PANEL (clamp 240–329px, bg-[#f8f8f4])
 */

// ─── SVG icons ────────────────────────────────────────────────────────────────

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

const CheckBadgeIcon = ({ className }) => (
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
    <circle cx="6" cy="6" r="5" />
    <path d="M3.5 6l1.8 1.8L8.5 4" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const PROFICIENCY_BAR = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };

// Three overlapping avatar circles shown per card
const AVATAR_COLORS = ['#3f6212', '#185fa5', '#be185d'];
const MOCK_ENDORSER_SETS = [
  ['A', 'A', 'E'],
  ['B', 'A', 'D'],
  ['K', 'A', 'E'],
];

// Initial skill list — matches Figma mock data (nodes 3676:29446 / 29415 / 29384 / 3677:29774).
// iconBg: Tailwind bg class for the 40×40 icon container.
// IconComponent: optional SVG component; if absent the emoji string is used instead.
const INITIAL_SKILLS = [
  {
    id: 'js',
    IconComponent: SkillIconJs,
    iconBg: 'bg-[#F7DF1E]',
    name: 'JavaScript',
    status: 'verified',
    proficiency: 'Expert',
    endorsements: 25,
    endorserSet: 0,
  },
  {
    id: 'java',
    IconComponent: SkillIconJava,
    iconBg: 'bg-[#f7fee7]',
    name: 'Java',
    status: 'verified',
    proficiency: 'Intermediate',
    endorsements: 12,
    endorserSet: 1,
  },
  {
    id: 'python',
    IconComponent: SkillIconPython,
    iconBg: 'bg-[#f7fee7]',
    name: 'Python',
    status: 'verified',
    proficiency: 'Advanced',
    endorsements: 18,
    endorserSet: 2,
  },
  {
    id: 'leadership',
    emoji: '🤝',
    iconBg: 'bg-[#f7fee7]',
    name: 'Team Leadership',
    status: 'self-reported',
    proficiency: 'Intermediate',
    endorsements: 3,
    endorserSet: 0,
  },
];

// ─── SkillCard ────────────────────────────────────────────────────────────────
/*
 * Fixed-height row card.  Clicking "✎ Edit" reveals a proficiency selector below.
 * Verified cards:      bg-[rgba(235,241,236,0.5)] — Figma 3676:29446
 * Self-reported cards: bg-white                   — Figma 3677:29774
 * "Verify in Lab" button visible only for self-reported skills.
 */
const SkillCard = ({ skill, isEditing, onToggleEdit, onChangeProficiency }) => {
  const isVerified = skill.status === 'verified';
  const barPct = PROFICIENCY_BAR[skill.proficiency] ?? 50;
  const endorsers = MOCK_ENDORSER_SETS[skill.endorserSet % MOCK_ENDORSER_SETS.length];
  const endorsementAmber = skill.endorsements <= 5;

  log('SkillCard render', { id: skill.id, status: skill.status, proficiency: skill.proficiency });

  return (
    <div
      className={`rounded-[16px] border border-[#e8e8e4] overflow-hidden transition-all duration-150 ${
        isVerified ? 'bg-[rgba(235,241,236,0.5)]' : 'bg-white'
      }`}
      style={{ boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.07)' }}
    >
      {/* Main card row */}
      <div className="flex items-start gap-[12px] px-[15px] py-[13px]">
        {/* Icon box — 40×40 rounded-[10px]. Brand bg per skill; renders SVG component
            or emoji fallback. Figma: bg-[#f7fee7] with emoji placeholder. */}
        <div
          className={`size-[40px] ${skill.iconBg ?? 'bg-[#f7fee7]'} rounded-[10px] flex items-center justify-center shrink-0 mt-[1px] overflow-hidden`}
        >
          {skill.IconComponent ? (
            <skill.IconComponent className="size-[22px]" />
          ) : (
            <span className="text-[20px] leading-none select-none">{skill.emoji}</span>
          )}
        </div>

        {/* Content column */}
        <div className="flex-1 min-w-0 flex flex-col gap-[7px] pt-[4px]">
          {/* Skill name + status badge */}
          <div className="flex items-center gap-[7px]">
            <span className="font-sans font-semibold text-[14px] text-[#111] leading-normal truncate">
              {skill.name}
            </span>
            {isVerified ? (
              /* Verified pill — dark green bg, gradient text (Figma 3673:29193) */
              <span className="h-[16px] px-[8px] rounded-full flex items-center bg-[#387440] border border-[#c1d4c4] shrink-0">
                <span
                  className="text-[8px] font-medium tracking-[0.2px] whitespace-nowrap"
                  style={{
                    backgroundImage:
                      'linear-gradient(193deg, rgb(254,241,231) 0%, rgb(232,242,237) 20.2%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Verified
                </span>
              </span>
            ) : (
              /* Self-reported pill — cream bg, gray text (Figma 3673:29193 self-reported state) */
              <span className="h-[16px] px-[8px] rounded-full flex items-center bg-[#fffefc] border border-[#b5b5b5] text-[8px] font-medium text-[#595959] tracking-[0.2px] whitespace-nowrap shrink-0">
                Self-reported
              </span>
            )}
          </div>

          {/* Proficiency dots + label — Figma 3673:29199: 4 × 7px squares, gap-[10px] */}
          <div className="flex items-center gap-[13px]">
            <div className="flex items-center gap-[10px]">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="size-[7px] bg-[#387440] rounded-[3.5px] shrink-0" />
              ))}
            </div>
            <span className="font-sans font-medium text-[10px] text-[#70706e]">
              {skill.proficiency}
            </span>
          </div>

          {/* Endorser avatars + count — Figma 3673:29200 / 3670:29186 */}
          <div className="flex items-center gap-[12px]">
            <div className="flex items-center">
              {endorsers.map((initial, i) => (
                <div
                  key={i}
                  className="size-5 rounded-[10px] border-2 border-white flex items-center justify-center font-bold text-[9px] text-white shrink-0"
                  style={{
                    background: AVATAR_COLORS[i],
                    marginLeft: i > 0 ? '-7px' : '0',
                    position: 'relative',
                    zIndex: 3 - i,
                  }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <span className="font-sans text-[10px] leading-normal">
              <span className="font-bold" style={{ color: endorsementAmber ? '#c8951a' : '#111' }}>
                {skill.endorsements}
              </span>{' '}
              <span
                style={{
                  color: endorsementAmber ? '#58554e' : '#111',
                  fontWeight: endorsementAmber ? 500 : 700,
                }}
              >
                endorsements
              </span>
            </span>
          </div>

          {/* Progress bar — Figma 3670:29187 / 29188 */}
          <div className="h-[4px] max-w-[200px] bg-[#f8f8f4] border border-[#e8e8e4] rounded-[2px] overflow-hidden">
            <div
              className="h-full bg-[#387440] rounded-[2px] transition-all duration-300"
              style={{ width: `${barPct}%` }}
            />
          </div>
        </div>

        {/* Action buttons — Figma 3677:29572 */}
        <div className="flex items-center gap-[8px] shrink-0 self-center ml-[8px]">
          {!isVerified && (
            <Button
              variant="tertiary-subtle"
              size="sm"
              leftIcon={<CheckBadgeIcon className="size-[11px]" />}
            >
              Verify in Lab
            </Button>
          )}
          <Button variant="tertiary" size="sm" onClick={onToggleEdit}>
            ✎&#8194;Edit
          </Button>
        </div>
      </div>

      {/* Edit panel — shown when isEditing */}
      {isEditing && (
        <div
          className="border-t px-[15px] pb-[14px] pt-[12px]"
          style={{ background: 'rgba(235,241,236,0.5)', borderTopColor: 'rgba(0,0,0,0.06)' }}
        >
          <p className="font-bold text-[10px] text-[#387440] tracking-[0.6px] uppercase mb-[10px]">
            Proficiency level
          </p>
          <div className="flex items-center gap-[6px] flex-wrap">
            {PROFICIENCY_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onChangeProficiency(level)}
                className={`h-[28px] px-[14px] rounded-full border font-semibold text-[11px] transition-colors duration-150 ${
                  skill.proficiency === level
                    ? 'bg-[#387440] border-[#2a5730] text-white'
                    : 'bg-white border-[#e8e8e4] text-[#555] hover:border-[#387440] hover:text-[#387440]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Right panel ──────────────────────────────────────────────────────────────
const SkillsStage2RightPanel = ({ skillCount, verifiedCount }) => (
  <aside
    className="w-[clamp(240px,19.04vw,329px)] shrink-0 bg-[#f8f8f4] border-l border-[#e8e8e4] overflow-y-auto [&::-webkit-scrollbar]:hidden"
    aria-label="Skills guidance"
    style={{ scrollbarWidth: 'none' }}
  >
    <div className="flex flex-col gap-[10px] p-[clamp(12px,1.16vw,20px)]">
      {/* PROFILE STRENGTH */}
      <div className="bg-white border border-[#e8e8e4] rounded-[16px] p-[clamp(12px,0.93vw,16px)]">
        <p className="font-bold text-[10px] uppercase tracking-[0.08em] text-[#888] mb-[8px]">
          Profile Strength
        </p>
        <div className="flex items-center gap-[10px] bg-[#f4f4f0] rounded-[10px] p-[10px] mb-[10px]">
          <span className="font-display not-italic text-[22px] leading-none text-[#111] shrink-0">
            36%
          </span>
          <div>
            <p className="font-sans font-semibold text-[11px] text-[#111] leading-tight">
              Profile strength
            </p>
            <p className="font-sans text-[10px] text-[#70706e] leading-tight mt-[2px]">
              Three stages done. Skills unlocks recruiter visibility.
            </p>
          </div>
        </div>
        <p className="font-sans text-[11px] text-[#70706e] leading-[1.6]">
          {verifiedCount} of {skillCount} skill{skillCount !== 1 ? 's' : ''} verified. Verified
          skills appear first on your recruiter card and get 4× more clicks.
        </p>
      </div>

      {/* VERIFIED SKILLS */}
      <div
        className="border border-[#c1d4c4] rounded-[10px] p-[clamp(12px,0.93vw,16px)]"
        style={{ background: 'rgba(235,241,236,0.5)' }}
      >
        <p className="font-bold text-[10px] uppercase tracking-[0.08em] text-[#888] mb-[8px]">
          Verified Skills
        </p>
        <ul className="flex flex-col gap-[5px]">
          {[
            'Go to Skills Lab — complete a 5–10 min mini-game',
            'Pass = green ✓ badge on your profile',
            'Recruiters click verified skills 4× more',
            'Retake any time — no penalty for trying',
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

      {/* PEER ENDORSEMENTS — Figma 3669:28749 */}
      <div className="bg-white border border-[#e8e8e4] rounded-[10px] p-[clamp(12px,0.93vw,16px)]">
        <p className="font-bold text-[10px] uppercase tracking-[0.08em] text-[#888] mb-[8px]">
          Peer Endorsements
        </p>
        <p className="font-sans text-[11px] text-[#70706e] leading-[1.6]">
          Anyone on GTH who&apos;s worked with you can endorse a skill. Endorsement count shows next
          to each skill — social proof that builds trust with recruiters.
        </p>
      </div>

      {/* SKILLS LAB */}
      <div className="bg-white border border-[#e8e8e4] rounded-[10px] p-[clamp(12px,0.93vw,16px)]">
        <p className="font-bold text-[10px] uppercase tracking-[0.08em] text-[#888] mb-[8px]">
          Skills Lab
        </p>
        <p className="font-sans text-[11px] text-[#70706e] leading-[1.6]">
          A separate mini-game area accessible from any skill card. Each challenge takes 5–10
          minutes. Retake any skill if you don&apos;t pass first time — no penalty.
        </p>
      </div>

      {/* THE SWEET SPOT */}
      <div
        className="border border-[#c1d4c4] rounded-[10px] p-[clamp(12px,0.93vw,16px)]"
        style={{ background: 'rgba(235,241,236,0.5)' }}
      >
        <p className="font-bold text-[10px] uppercase tracking-[0.08em] text-[#888] mb-[8px]">
          The Sweet Spot
        </p>
        <p className="font-sans text-[11px] text-[#70706e] leading-[1.6]">
          6–10 skills total. At least 3 verified. Too few = sparse profile. Too many unverified =
          noise. Quality beats quantity here.
        </p>
      </div>
    </div>
  </aside>
);

// ─── Main section ─────────────────────────────────────────────────────────────

const SkillsStage2Section = () => {
  log('mount', { route: '/profile/filling/skills/categories', stageIndex: 3 });
  const navigate = useNavigate();

  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [editingId, setEditingId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const handleGoBack = () => {
    log('go back → /profile/filling/skills');
    navigate('/profile/filling/skills');
  };

  const handleNext = () => {
    log('next → /profile/filling/work');
    navigate('/profile/filling/work');
  };

  const toggleEdit = (id) => {
    log('toggle edit', { id });
    setEditingId((prev) => (prev === id ? null : id));
  };

  const changeProficiency = (id, level) => {
    log('change proficiency', { id, level });
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, proficiency: level } : s)));
  };

  const addSkill = ({ name, proficiency }) => {
    const id = `skill-${skills.length}-${name.toLowerCase().replace(/\s+/g, '-')}`;
    log('add skill', { id, name, proficiency });
    setSkills((prev) => [
      ...prev,
      {
        id,
        emoji: '💡',
        iconBg: 'bg-[#f7fee7]',
        name,
        status: 'self-reported',
        proficiency,
        endorsements: 0,
        endorserSet: prev.length % MOCK_ENDORSER_SETS.length,
      },
    ]);
  };

  const verifiedCount = skills.filter((s) => s.status === 'verified').length;
  const totalEndorsements = skills.reduce((sum, s) => sum + s.endorsements, 0);

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

      {/* Stage trail — Skills (index 3) active */}
      <div className="shrink-0 h-[clamp(60px,4.46vw,77px)] flex items-stretch">
        <EngagementTopBar currentStageIndex={3} completionPct={0} className="w-full h-full" />
      </div>

      {/* Main area */}
      <main className="flex-1 min-h-0 overflow-hidden flex">
        {/* Left column */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {/* Hero header — Figma 3670:29134 */}
            <section
              aria-label="Skills — what you can actually do"
              className="border-b border-[rgba(0,0,0,0.07)] px-[clamp(20px,3.24vw,56px)] py-[clamp(20px,2.08vw,36px)]"
              style={{
                background: [
                  'radial-gradient(ellipse at 8% 0%, rgba(56,116,64,0.07) 0%, transparent 40%)',
                  'radial-gradient(ellipse at 95% 100%, rgba(244,114,182,0.1) 0%, transparent 40%)',
                  'white',
                ].join(', '),
              }}
            >
              <h2 className="font-display text-[clamp(26px,2.89vw,50px)] leading-[0.92] tracking-[-2px] mb-[clamp(8px,0.93vw,16px)]">
                <span className="not-italic text-[#111]">Skills</span>
                <br />
                <span className="italic text-[#387440]">What you can actually do.</span>
              </h2>
              <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-[1.6] text-[#959592] tracking-[0.2px] mb-[clamp(10px,0.93vw,16px)] max-w-[680px]">
                Add as many skills as you have. Set proficiency, collect peer endorsements, and
                verify your top skills via the Skills Lab mini-game to earn the green ✓ badge that
                recruiters trust 4× more.
              </p>
              <div className="flex items-center flex-wrap gap-[8px]">
                {[
                  `${skills.length} skill${skills.length !== 1 ? 's' : ''}`,
                  `${totalEndorsements} endorsements`,
                  '~5 min',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center font-sans font-semibold text-[clamp(10px,0.69vw,12px)] leading-5 text-[#737373] bg-white rounded-full px-[12px] py-[4px] border border-[#e1eae2] whitespace-nowrap"
                    style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* "Stack Your Skills" section header — Figma 3669:28758 */}
            <div className="px-[clamp(20px,3.24vw,56px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(10px,0.93vw,16px)]">
              <p className="font-bold text-[10px] uppercase tracking-[0.08em] text-[#888] mb-[6px]">
                All Skills
              </p>
              <h3 className="font-display text-[clamp(20px,1.62vw,28px)] leading-[1.05] tracking-[-1px] mb-[4px]">
                <span className="not-italic text-[#111]">Stack Your </span>
                <span className="italic text-[#387440]">Skills.</span>
              </h3>
              <p className="font-sans text-[clamp(10px,0.69vw,12px)] text-[#737373] leading-[1.5] max-w-[600px]">
                Verified skills show first on your recruiter card. Self-reported skills still show —
                they just don&apos;t get the ✓ badge. Both matter.
              </p>
            </div>

            {/* Skill cards */}
            <div className="flex flex-col gap-[8px] px-[clamp(20px,3.24vw,56px)] pb-[8px]">
              {skills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  isEditing={editingId === skill.id}
                  onToggleEdit={() => toggleEdit(skill.id)}
                  onChangeProficiency={(level) => changeProficiency(skill.id, level)}
                />
              ))}
            </div>

            {/* Add Another Skill — opens AddSkillModal (Figma 3669:28769) */}
            <div className="px-[clamp(20px,3.24vw,56px)] pt-[8px] pb-[clamp(16px,1.85vw,32px)]">
              <button
                type="button"
                onClick={() => {
                  log('open add skill modal');
                  setIsAddModalOpen(true);
                }}
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
                Add Another Skill
              </button>
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
                  Skills
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  rightIcon={<ArrowRightIcon className="size-3.5" />}
                >
                  Next: Work
                </Button>
              </div>
            </div>
          </footer>
        </div>

        {/* Right panel */}
        <SkillsStage2RightPanel skillCount={skills.length} verifiedCount={verifiedCount} />
      </main>

      {/* Add Skill modal — portal-rendered, Figma 3721:22423 */}
      <AddSkillModal
        isOpen={isAddModalOpen}
        onClose={() => {
          log('close add skill modal');
          setIsAddModalOpen(false);
        }}
        onAdd={addSkill}
      />
    </div>
  );
};

export default SkillsStage2Section;
