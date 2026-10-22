import {
  Fi16Check,
  Fi16Close,
  Fi20ArrowRight,
  Fi20Bolt,
  Fi20Book,
  Fi20Company,
  Fi20Eye,
  Fi20Globe,
  Fi20Heart,
  Fi20Lock,
  Fi20Map,
  Fi20Plus,
  Fi20Shield,
  Fi20User,
  FiFlagGh,
} from './LpFigmaIcons.jsx';

/*
 * LP-B icon set (S5-S9): thin wrapper over the exact Figma icon exports (LpFigmaIcons). Colour comes from `currentColor`;
 * `size` scales the whole exported instance box. (`strokeWidth` is accepted for API compatibility and ignored: the stroke is baked in.)
 */
const ICONS = {
  check: Fi16Check,
  close: Fi16Close,
  plus: Fi20Plus,
  arrowRight: Fi20ArrowRight,
  company: Fi20Company,
  globe: Fi20Globe,
  bolt: Fi20Bolt,
  shield: Fi20Shield,
  lock: Fi20Lock,
  map: Fi20Map,
  eye: Fi20Eye,
  user: Fi20User,
  heart: Fi20Heart,
  book: Fi20Book,
};

export const LpBIcon = ({ name, size = 20, className = '' }) => {
  const Icon = ICONS[name];
  return Icon ? (
    <Icon className={`shrink-0 ${className}`} style={{ width: size, height: size }} />
  ) : null;
};

/* Ghana flag chip icon (Figma "icon/flag-gh"). */
export const LpBFlagGh = ({ size = 15 }) => (
  <FiFlagGh className="shrink-0" style={{ width: size, height: size }} />
);

export default LpBIcon;
