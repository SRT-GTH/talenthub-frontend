import { classNames } from '../../../../utils/classNames.js';
import { EMPHASIS_CARD } from '../../talentSkillsLab/HubParts.jsx';
import {
  SkillsCalendarIcon,
  SkillsChartBarIcon,
  SkillsCompassIcon,
  SkillsDnsIcon,
  SkillsFunctionIcon,
  SkillsGameIcon,
  SkillsImageIcon,
  SkillsMicIcon,
  SkillsPlusIcon,
  SkillsTargetIcon,
  SkillsThumbUpIcon,
  SkillsUsersIcon,
  SkillsViewTableIcon,
} from './skillsIcons.jsx';

/* Page gutter (Figma 64px at 1728) and card chrome (Playful hard shadow / Focused hairline) shared by every Skills screen. */
export const GUTTER = 'px-[clamp(20px,3.7vw,64px)]';
export const CARD = classNames('rounded-[24px] bg-white', EMPHASIS_CARD);
export const SOFT_FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

export const GLYPHS = {
  function: SkillsFunctionIcon,
  dns: SkillsDnsIcon,
  'view-table': SkillsViewTableIcon,
  image: SkillsImageIcon,
  users: SkillsUsersIcon,
  'chart-bar': SkillsChartBarIcon,
  calendar: SkillsCalendarIcon,
  target: SkillsTargetIcon,
  mic: SkillsMicIcon,
  compass: SkillsCompassIcon,
  plus: SkillsPlusIcon,
  game: SkillsGameIcon,
  'thumb-up': SkillsThumbUpIcon,
};

export const CARD20 = classNames('rounded-[20px] bg-white', EMPHASIS_CARD);
export const CARD_CHROME = EMPHASIS_CARD;
