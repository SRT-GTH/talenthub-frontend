import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

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
const log = debug('AvatarCategoryTabs');

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
      // Phones: 32px pills that never shrink (the row scrolls instead).
      'max-lg:min-h-8 max-lg:shrink-0 max-lg:snap-start max-lg:py-1 max-lg:px-3 max-lg:text-[13px]',
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

const AvatarCategoryTabs = ({ activeTab = 'style', onTabSelect, className }) => {
  const navRef = useRef(null);
  const [moreRight, setMoreRight] = useState(false);

  // Phones: the pill row scrolls sideways, so bring the active pill into view
  // (horizontal only, so the page itself never jumps).
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector('[aria-pressed="true"]');
    if (!nav || !active || nav.scrollWidth <= nav.clientWidth) return;
    log('scroll active tab into view', activeTab);
    nav.scrollLeft = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
  }, [activeTab]);

  // Right-edge fade while more pills are hidden off-screen.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    const update = () => setMoreRight(nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 2);
    update();
    nav.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      nav.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [activeTab]);

  return (
    <nav
      ref={navRef}
      data-more-right={moreRight || undefined}
      aria-label="Customisation categories"
      className={classNames(
        'flex flex-wrap items-center gap-2',
        // Phones: one horizontally scrollable pill row that stays pinned right
        // under the sticky avatar stage while the option grid scrolls.
        'max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:snap-x max-lg:no-scrollbar',
        'max-lg:data-[more-right]:[mask-image:linear-gradient(to_right,#000_calc(100%-28px),transparent)]',
        'max-lg:sticky max-lg:top-[var(--stage-h)] max-lg:z-10 max-lg:-mx-4 max-lg:bg-white max-lg:px-4 max-lg:py-1',
        // Faint grey divider line under the tab row, full panel width.
        'pb-4 border-b border-border-default max-lg:pb-1',
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
};

export default AvatarCategoryTabs;
