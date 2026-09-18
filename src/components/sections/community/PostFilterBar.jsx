import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';
import { POST_FILTERS, POST_SEARCH_PLACEHOLDER } from './communityData.js';

const log = debug('PostFilterBar');

/*
 * PostFilterBar — post-type chips + feed search + "Create Post".
 * Source: Figma 7025:86283.
 *
 * Chip states (both from Figma):
 *   active   → #387440 fill, 1.216px #e1eae2 border, r12,
 *              cream-gradient semibold 17.73px label
 *   inactive → white fill, same border, #737373 medium 14px label
 *
 * Search: 362px, r12, 1.216px #ccc border, 3.039px rgba(191,191,191,.8) shelf.
 * Create Post: #387440 + #2a5730 shelf borders + 4.822px #224626 shadow.
 */

const ACTIVE_LABEL_GRADIENT = 'linear-gradient(193.15deg, #fef1e7 0%, #e8f2ed 20.192%)';
const CREATE_LABEL_GRADIENT = 'linear-gradient(189.78deg, #fef1e7 0%, #e8f2ed 20.192%)';

const PostFilterBar = ({
  filter,
  onFilterChange,
  query,
  onQueryChange,
  onCreatePost,
  className,
}) => (
  <div className={classNames('flex flex-wrap items-center justify-between gap-4', className)}>
    <div
      className="flex items-center gap-[8px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label="Filter posts by type"
    >
      {POST_FILTERS.map((item) => {
        const active = item === filter;
        return (
          <button
            key={item}
            type="button"
            aria-pressed={active}
            onClick={() => {
              log('post filter selected:', item);
              onFilterChange?.(item);
            }}
            className={classNames(
              'flex shrink-0 flex-col items-center justify-center rounded-[12px] border-[1.216px] border-brand-green-light-hover px-[14px] py-[6px] drop-shadow-[0px_1.216px_1.824px_rgba(0,0,0,0.06)] transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
              active ? 'bg-brand-green' : 'bg-white hover:bg-brand-green-light'
            )}
          >
            <span
              className={classNames(
                'whitespace-nowrap font-sans tracking-[0.2431px]',
                active
                  ? 'bg-clip-text text-[17.73px] font-semibold leading-[29.56px] text-transparent'
                  : 'text-[14px] font-medium leading-[24.31px] text-[#737373]'
              )}
              style={active ? { backgroundImage: ACTIVE_LABEL_GRADIENT } : undefined}
            >
              {item}
            </span>
          </button>
        );
      })}
    </div>

    <div className="flex items-center gap-[clamp(10px,1.27vw,19.3px)]">
      <label className="flex w-[clamp(200px,23.9vw,362px)] max-w-[450px] items-center gap-[9.73px] overflow-hidden rounded-[12px] border-[1.216px] border-[#ccc] bg-white px-[24px] py-[12px] shadow-[0px_3.039px_0px_0px_rgba(191,191,191,0.8)] focus-within:border-brand-green-light-active">
        <span className="sr-only">{POST_SEARCH_PLACEHOLDER}</span>
        <CommunityIcon src={icons.search} size={19.45} />
        <input
          type="search"
          value={query}
          placeholder={POST_SEARCH_PLACEHOLDER}
          onChange={(event) => {
            log('feed search query:', event.target.value);
            onQueryChange?.(event.target.value);
          }}
          className="min-w-0 flex-1 bg-transparent font-sans text-[14.5px] leading-[24.31px] tracking-[0.2431px] text-black outline-none placeholder:text-[#999]"
        />
      </label>

      <button
        type="button"
        onClick={() => {
          log('create post clicked');
          onCreatePost?.();
        }}
        className="flex shrink-0 items-center justify-center gap-[7.23px] self-stretch rounded-[12.05px] border-b-[2.411px] border-l-[2.411px] border-r-[2.411px] border-t-[1.205px] border-brand-green-dark bg-brand-green px-[24.1px] py-[12.05px] drop-shadow-[0px_4.822px_0px_#224626] transition-transform active:translate-y-[2px] active:drop-shadow-[0px_2px_0px_#224626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <CommunityIcon src={icons.createPost} size={18} />
        <span
          className="whitespace-nowrap bg-clip-text font-sans text-[14px] font-medium tracking-[0.12px] text-transparent"
          style={{ backgroundImage: CREATE_LABEL_GRADIENT }}
        >
          Create Post
        </span>
      </button>
    </div>
  </div>
);

export default PostFilterBar;
