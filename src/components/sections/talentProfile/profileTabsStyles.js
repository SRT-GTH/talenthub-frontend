/* Style constants + icon registries shared by the profile header / tab bodies (Tabs agent). */
import {
  ProfileBadgeBulbIcon,
  ProfileBadgeCheckCircleGlyph,
  ProfileBarGlyph,
  ProfileBldgGlyph,
  ProfileBookGlyph,
  ProfileChipAnalyticalIcon,
  ProfileChipCalmIcon,
  ProfileChipCheckIcon,
  ProfileChipHeartIcon,
  ProfileChipLangIcon,
  ProfileChipPinIcon,
  ProfileChipTargetIcon,
  ProfileChipTeamIcon,
  ProfileCompanyGlyph,
  ProfileDnsGlyph,
  ProfileFileIcon,
  ProfileFuncGlyph,
  ProfileGameGlyph,
  ProfileGradGlyph,
  ProfileInterestAgritechIcon,
  ProfileInterestCityIcon,
  ProfileInterestDataIcon,
  ProfileInterestFintechIcon,
  ProfileInterestMicIcon,
  ProfileInterestMusicIcon,
  ProfileLaptopGlyph,
  ProfileLinkIcon,
  ProfileNoteIcon,
  ProfileTableGlyph,
  ProfileTargetGlyph,
  ProfileTrendGlyph,
  ProfileTrophyIcon,
  ProfileVoiceGlyph,
} from '../../shared/assets.jsx';
import { DISPLAY } from '../talentHome/TabsParts.jsx';

// Plain card (Figma "card · *": white, 1px #e6e6e6, r20) — identical in both styles.
export const CARD_PLAIN = 'rounded-[20px] border border-[#e6e6e6] bg-white';
// Raised surface. Focused = hairline + soft drop; Playful = 1.5px ink border + 4px shelf.
export const SHELF =
  'border border-[rgba(28,42,33,0.1)] shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_24px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]';
// Fluid padding: Figma 24px at 1728.
export const PAD = 'p-[clamp(16px,1.39vw,24px)]';
// Card / section heading: SF Pro Rounded (Focused) vs Bricolage Grotesque (Playful), 23px.
export const TITLE = `${DISPLAY} font-semibold leading-[1.25] text-[#1c2a21] text-[clamp(19px,1.33vw,23px)]`;
// Smaller heading (rail cards: 21px).
export const TITLE_SM = `${DISPLAY} font-semibold leading-[1.25] text-[#1c2a21] text-[clamp(18px,1.22vw,21px)]`;

/* ---------- icon registries (keys used by talentProfileTabsData.js) ---------- */
export const GLYPHS = {
  bar: ProfileBarGlyph,
  dns: ProfileDnsGlyph,
  func: ProfileFuncGlyph,
  table: ProfileTableGlyph,
  voice: ProfileVoiceGlyph,
  trend: ProfileTrendGlyph,
  grad: ProfileGradGlyph,
  laptop: ProfileLaptopGlyph,
  bldg: ProfileBldgGlyph,
  company: ProfileCompanyGlyph,
  target: ProfileTargetGlyph,
  book: ProfileBookGlyph,
  game: ProfileGameGlyph,
};
export const CHIP_ICONS = {
  target: ProfileChipTargetIcon,
  pin: ProfileChipPinIcon,
  lang: ProfileChipLangIcon,
  analytical: ProfileChipAnalyticalIcon,
  calm: ProfileChipCalmIcon,
  team: ProfileChipTeamIcon,
  heart: ProfileChipHeartIcon,
  check: ProfileChipCheckIcon,
  data: ProfileInterestDataIcon,
  fintech: ProfileInterestFintechIcon,
  agritech: ProfileInterestAgritechIcon,
  city: ProfileInterestCityIcon,
  mic: ProfileInterestMicIcon,
  music: ProfileInterestMusicIcon,
};
export const LINK_ICONS = {
  link: ProfileLinkIcon,
  file: ProfileFileIcon,
  laptop: ProfileLaptopGlyph,
  note: ProfileNoteIcon,
};
export const BADGE_ICONS = {
  trophy: ProfileTrophyIcon,
  checkc: ProfileBadgeCheckCircleGlyph,
  bulb: ProfileBadgeBulbIcon,
};

export const COVER_BG = { bars: '#dbeafe', line: '#ede9fe', dots: '#faf4e8' };
export const coverBg = (kind) => COVER_BG[kind];
