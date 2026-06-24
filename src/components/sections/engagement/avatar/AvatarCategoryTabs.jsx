import { classNames } from '../../../../utils/classNames.js';

// Icon-only PNGs exported from Figma. Text labels + pill background are
// added in code so we can flip the pill colour when the tab is active —
// no need for per-state asset variants.
import styleIcon from '../../../../assets/engagement/light_styler.png';
import skinIcon from '../../../../assets/engagement/dark-skin-tone.png';
import hairIcon from '../../../../assets/engagement/Vector.png';
import extrasIcon from '../../../../assets/engagement/glasses-linear.png';
import outfitIcon from '../../../../assets/engagement/clothes-hanger.png';

/*
 * AvatarCategoryTabs — the 5-tab row that sits at the top of every avatar
 * customiser panel (Style / Skin / Hair / Extras / Outfit).
 *
 * Lifted out of AvatarStylePanel + AvatarSkinPanel so all 5 customiser
 * panels share one source of truth for tab order, icons, labels, and the
 * active/inactive pill styling. Each panel just renders:
 *
 *     <AvatarCategoryTabs activeTab="style" onTabSelect={...} />
 *
 * Active state: solid brand-green pill, white icon + label.
 * Inactive:     white pill, dark text, faint border that turns green on
 *               hover so the pill still reads as interactive.
 */

// Tab order is fixed by the Figma design.
const TABS = [
  { id: 'style', label: 'Style', image: styleIcon },
  { id: 'skin', label: 'Skin', image: skinIcon },
  { id: 'hair', label: 'Hair', image: hairIcon },
  { id: 'extras', label: 'Extras', image: extrasIcon },
  { id: 'outfit', label: 'Outfit', image: outfitIcon },
];

const CategoryTabButton = ({ image, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    aria-label={label}
    className={classNames(
      'inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5',
      'font-sans font-semibold text-[13px] leading-5 tracking-[0.1px]',
      'border transition-[background-color,border-color,color] duration-150',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      active
        ? 'bg-brand-green border-brand-green text-white'
        : 'bg-white border-border-default text-content-primary hover:border-brand-green-light-active'
    )}
  >
    <img
      src={image}
      alt=""
      aria-hidden="true"
      draggable="false"
      className={classNames(
        'block size-4 select-none',
        // Flip the dark line-art to white on the green pill.
        active ? 'invert brightness-0' : ''
      )}
    />
    <span>{label}</span>
  </button>
);

const AvatarCategoryTabs = ({ activeTab = 'style', onTabSelect, className }) => (
  <nav
    aria-label="Customisation categories"
    className={classNames(
      'flex flex-wrap items-center gap-2',
      // Faint grey divider line under the tab row, full panel width.
      'pb-4 border-b border-border-default',
      className
    )}
  >
    {TABS.map((tab) => (
      <CategoryTabButton
        key={tab.id}
        image={tab.image}
        label={tab.label}
        active={tab.id === activeTab}
        onClick={() => onTabSelect?.(tab.id)}
      />
    ))}
  </nav>
);

export default AvatarCategoryTabs;
