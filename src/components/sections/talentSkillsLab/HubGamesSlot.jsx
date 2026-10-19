import { debug } from '../../../utils/debug.js';

const log = debug('HubGamesSlot');

/* Resolved at build time: the Games agent's SkillsLabGamesTab.jsx if it exists, otherwise nothing. */
const found = import.meta.glob('./SkillsLabGamesTab.jsx', { eager: true });
const RealGamesTab = found['./SkillsLabGamesTab.jsx']?.default;

/*
 * GamesTabSlot — the "Games" tab (SL-G01) body. Renders <SkillsLabGamesTab skills={skills} /> when that file
 * exists; until then it is a clearly marked placeholder (PLACEHOLDER: owned by the Games agent).
 */
export const GamesTabSlot = ({ skills }) => {
  if (RealGamesTab) {
    const Real = RealGamesTab;
    return <Real skills={skills} />;
  }
  log('placeholder (SkillsLabGamesTab.jsx not found)');
  return (
    <div
      data-placeholder="skills-lab-games-tab"
      className="rounded-[20px] border border-dashed border-[rgba(28,42,33,0.35)] p-[24px] font-sans text-[14px] text-[#595959]"
    >
      PLACEHOLDER — Games tab (SkillsLabGamesTab.jsx) is delivered by the Games agent.
    </div>
  );
};

export default GamesTabSlot;
