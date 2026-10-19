import { useLocation, useNavigate } from 'react-router-dom';
import {
  TalentRailAssessmentGlyph,
  TalentRailCommunityGlyph,
  TalentRailHomeGlyph,
  TalentRailJobsGlyph,
  TalentRailLearningGlyph,
  TalentRailLinkIcon,
  TalentRailMessagesGlyph,
  TalentRailProfileGlyph,
  TalentRailSkillsLabGlyph,
  TalentRailToggleChevronsIcon,
  TalentRailWalletIcon,
} from '../../shared/assets.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import avatarPortrait from '../../../assets/talent-settings/menu/kofi-avatar-portrait.svg';
import { TALENT_NAV_MAIN, TALENT_NAV_SECONDARY, getTalentSidebarData } from './talentShellData.js';

const log = debug('TalentRailHome');

/*
 * TalentRailHome — Figma `GTH · Sidebar / Collapsed · Talent` as drawn in the HMc frames (Playful
 * 8808:451840 / Focused 8808:452764), shown when the talent shell is collapsed with `?collapsed=1`.
 * 126px rail, 12px side padding, 60 top / 40 bottom; 74px ring avatar (3px #468438 ring on a 6px white
 * pad), 80x54 nav tiles with 24px glyphs (active = solid #387440, radius 10), dot badges on My Assessment
 * and Job Postings, the Messages tile with a soft "4" badge, a divider before Skills Lab, the public-link
 * tile pinned to the bottom, and the » toggle at (49,16) 28x28. Playful differs only by glyph colour
 * (#46524a instead of #999999). Wallet (Figma `Nav item · Wallet`) has no destination yet.
 * ⚠️ ASSUMPTION: the ring is drawn as a conic grey→green sweep (the frame shows a part-filled ring;
 * the generated CSS only carries the green border colour).
 * Props: activeId (nav id drawn active), badges ({ messages: '4' }), onToggle, className.
 */
const MAIN = [
  ...TALENT_NAV_MAIN.slice(0, 3),
  { id: 'wallet', label: 'Wallet', icon: null },
  ...TALENT_NAV_MAIN.slice(3),
];
/* Glyph + its box inside the 24px icon slot, as drawn in Figma (21.6px glyphs sit at (0,-0.6) or centred). */
const GLYPHS = {
  home: [TalentRailHomeGlyph, 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[21.6px]'],
  assessment: [
    TalentRailAssessmentGlyph,
    'left-1/2 top-[calc(50%-0.6px)] -translate-x-1/2 -translate-y-1/2 size-[21.6px]',
  ],
  opportunities: [TalentRailJobsGlyph, 'left-0 top-[-0.6px] size-[21.6px]'],
  community: [TalentRailCommunityGlyph, 'left-0 top-[-0.6px] size-[21.6px]'],
  messages: [TalentRailMessagesGlyph, 'inset-0 size-full'],
  'skills-lab': [TalentRailSkillsLabGlyph, 'inset-0 size-full'],
  'my-learning': [TalentRailLearningGlyph, 'inset-0 size-full'],
  profile: [TalentRailProfileGlyph, 'inset-0 size-full'],
};
const DOT_IDS = ['assessment', 'opportunities'];

const Tile = ({ item, active, badge }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const go = () => {
    log('nav select:', item.id);
    if (item.route) {
      if (pathname !== item.route) navigate(item.route);
    } else if (item.tab && pathname !== '/home') {
      navigate(item.tab === 'home' ? '/home' : `/home?tab=${item.tab}`);
    } else log('nav (no destination wired yet):', item.id);
  };
  const dot = DOT_IDS.includes(item.id) && badge;
  const pill = item.id === 'messages' && badge;
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      aria-label={item.label}
      title={item.label}
      onClick={go}
      className={classNames(
        'relative flex h-[54px] w-[80px] shrink-0 cursor-pointer items-center justify-center gap-[8px] px-[12px] py-[10px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
        pill ? 'rounded-[16px]' : 'rounded-[10px]',
        active
          ? 'bg-[#387440] text-white'
          : 'text-[#999999] hover:bg-[#ebf1ec] playful:text-[#46524a]'
      )}
    >
      {GLYPHS[item.id] ? (
        <span aria-hidden="true" className="relative block size-[24px] shrink-0">
          {(() => {
            const [Glyph, place] = GLYPHS[item.id];
            return <Glyph className={classNames('absolute block', place)} />;
          })()}
        </span>
      ) : (
        <TalentRailWalletIcon className="size-[20px] text-[#999999]" />
      )}
      {dot && (
        <span
          aria-hidden="true"
          className={classNames(
            'absolute box-content size-[10px] rounded-[99px] border-2 border-solid border-white bg-[linear-gradient(135deg,#387440_14.637%,#7aa870_85.349%)]',
            item.id === 'assessment'
              ? 'top-[15px] left-[51px]'
              : 'top-[calc(50%-9px)] right-[19px] -translate-y-1/2'
          )}
        />
      )}
      {pill && (
        <span className="absolute top-[8.65px] right-[17.4px] left-[42.6px] flex items-center justify-center overflow-clip rounded-[99px] bg-[#e8f2ed] px-[6px] py-[2px] font-sans text-[12px] font-medium whitespace-nowrap text-[#387440]">
          {badge}
        </span>
      )}
    </button>
  );
};

const TalentRailHome = ({ activeId = 'home', home, activeNav, badges, onToggle, className }) => {
  const data = getTalentSidebarData(home?.stateKey ?? 'day1', home?.live, activeNav);
  const shown = badges ?? data.badges ?? {};
  log('render', { activeId, badges: shown });
  return (
    <div
      className={classNames(
        'relative flex w-[126px] shrink-0 flex-col items-center justify-between overflow-y-auto border-r-2 border-solid border-white bg-white px-[12px] pt-[60px] pb-[40px]',
        className
      )}
    >
      <button
        type="button"
        aria-label="Expand sidebar"
        aria-expanded="false"
        onClick={() => {
          log('toggle -> expanded');
          onToggle?.();
        }}
        className="absolute top-[16px] left-[49px] flex size-[28px] cursor-pointer items-center justify-center overflow-clip rounded-[8px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <TalentRailToggleChevronsIcon className="rotate-180" />
      </button>

      <div className="flex shrink-0 flex-col items-center gap-[20px]">
        <span
          aria-hidden="true"
          className="relative flex size-[74px] shrink-0 items-center justify-center overflow-clip rounded-[1000px] p-[3px] [background:conic-gradient(from_180deg,#e6e6e6,#468438)]"
        >
          <span className="flex size-full items-center justify-center overflow-clip rounded-[1000px] bg-white p-[3px]">
            <span className="relative flex size-[62px] items-center justify-center overflow-clip rounded-[31px] bg-[linear-gradient(135deg,#387440_14.637%,#7aa870_85.349%)]">
              <img
                src={avatarPortrait}
                alt=""
                draggable="false"
                className="h-[70px] w-[69px] max-w-none shrink-0 select-none"
              />
            </span>
          </span>
        </span>

        <div className="flex flex-col items-start gap-[12px] overflow-clip pt-[6px]">
          <nav aria-label="Main" className="flex flex-col items-start gap-[4px]">
            {MAIN.map((item) => (
              <Tile
                key={item.id}
                item={item}
                active={item.id === activeId}
                badge={shown[item.id]}
              />
            ))}
          </nav>
          <span aria-hidden="true" className="h-px w-full shrink-0 rounded-[30px] bg-[#e1eae2]" />
          <nav aria-label="More" className="flex flex-col items-start gap-[12px]">
            {TALENT_NAV_SECONDARY.map((item) => (
              <Tile key={item.id} item={item} active={item.id === activeId} />
            ))}
          </nav>
        </div>
      </div>

      <button
        type="button"
        aria-label="Public profile link"
        onClick={() => log('public profile (no destination wired yet)')}
        className="flex shrink-0 cursor-pointer items-start overflow-clip rounded-[12px] border border-solid border-[#f8f8f4] bg-white p-[12px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <span className="flex items-center rounded-[8px] bg-[#ebf1ec] px-[10px] py-[8px]">
          <TalentRailLinkIcon className="size-[20px]" />
        </span>
      </button>
    </div>
  );
};

export default TalentRailHome;
