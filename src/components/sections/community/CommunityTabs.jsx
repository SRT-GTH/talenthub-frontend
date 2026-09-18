import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { COMMUNITY_TABS } from './communityData.js';

const log = debug('CommunityTabs');

/*
 * CommunityTabs — Feed / About / Members switcher.
 * Source: Figma `Component 30` (7025:86265 full header, Feed inactive/dark ·
 * 7025:88146 Feed active pill, icon goes light).
 *
 * States (both from Figma):
 *   active   → #387440 fill, r8, cream-gradient label, LIGHT icon
 *   inactive → transparent, #202021 label, DARK icon
 *
 * Icon colour, corrected 2026-09-17: `CommunityIcon`'s exported SVG assets
 * are each frozen at ONE Figma-instance colour (`icon-tab-feed.svg` is
 * baked pale/cream — only ever correct on the green active background;
 * `icon-tab-about.svg`/`icon-tab-members.svg` are baked pure black — only
 * ever correct on white) — reusing the SAME single asset for both states
 * regardless of which is active made Feed unreadable-pale whenever it
 * wasn't the selected tab. An externally-referenced `<img src>` can't
 * inherit CSS colour into the SVG's internals, so recolouring per-state
 * needs a real inline SVG — these three are hand-built from the real
 * asset files' own path/stroke data (not re-derived from Figma MCP output),
 * flattened to one `currentColor` fill/stroke each (Feed's original had a
 * subtle two-opacity accent + a cream gradient shape; solid `currentColor`
 * loses that at 24px, an acceptable simplification for a tab icon that
 * needs to flip between two very different backgrounds).
 *
 * Shell: white, r16, 0.8px #e2e8f0 RIGHT border only (Figma really does set
 * only border-right — reproduced rather than "corrected" to a full border),
 * with the two stacked 1px drop shadows.
 */

const FeedTabIcon = ({ className }) => (
  <svg viewBox="0 0 19 16" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M9.1 4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2h-4ZM9.1 13a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2h-4Z" />
    <path d="M9.1 1a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-8ZM9.1 10a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-8Z" />
    <path d="M1 0a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1ZM1 9a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H1Z" />
  </svg>
);

const AboutTabIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M13.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM13.14 8.77c-1.19.1-4.44 2.69-4.44 2.69-.2.15-.14.14.02.42.16.27.14.29.34.16.2-.13.53-.34 1.08-.68 2.12-1.36.34 1.78-.57 7.07-.36 2.62 2 1.27 2.61.87.6-.39 2.21-1.5 2.37-1.61.22-.15.06-.27-.11-.52-.12-.17-.24-.05-.24-.05-.65.43-1.84 1.33-2 .76-.19-.57 1.03-4.48 1.7-7.17.11-.64.41-2.04-.75-1.94Z" />
  </svg>
);

const MembersTabIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M7 18v-1a5 5 0 0 1 5-5m0 0a5 5 0 0 1 5 5v1m-5-5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM1 18v-1a3 3 0 0 1 3-3m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM23 18v-1a3 3 0 0 0-3-3m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
  </svg>
);

const TAB_ICONS = {
  Feed: FeedTabIcon,
  About: AboutTabIcon,
  Members: MembersTabIcon,
};

const ACTIVE_LABEL_GRADIENT = 'linear-gradient(202.2deg, #fef1e7 0%, #e8f2ed 20.192%)';

const CommunityTabs = ({ value, onChange, className }) => (
  <div
    role="tablist"
    aria-label="Community sections"
    className={classNames(
      'flex items-start rounded-[16px] border-r-[0.8px] border-[#e2e8f0] bg-white p-[8px] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]',
      className
    )}
  >
    <div className="flex items-end justify-center gap-[clamp(4px,1.1vw,16px)]">
      {COMMUNITY_TABS.map((tab) => {
        const active = tab === value;
        const TabIcon = TAB_ICONS[tab];
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => {
              log('tab selected:', tab);
              onChange?.(tab);
            }}
            className={classNames(
              'flex w-[clamp(96px,8.68vw,150px)] max-w-[210px] items-center justify-center gap-[6px] px-[16px] py-[10px] transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
              active ? 'rounded-[8px] bg-brand-green' : 'rounded-[8px] hover:bg-brand-green-light'
            )}
          >
            <TabIcon
              className={classNames(
                'size-[24px] shrink-0',
                active ? 'text-white' : 'text-[#202021]'
              )}
            />
            <span
              className={classNames(
                'whitespace-nowrap text-center font-sans text-[16px]',
                active ? 'bg-clip-text text-transparent' : 'text-[#202021]'
              )}
              style={active ? { backgroundImage: ACTIVE_LABEL_GRADIENT } : undefined}
            >
              {tab}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default CommunityTabs;
