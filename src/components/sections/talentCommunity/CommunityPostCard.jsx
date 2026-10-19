import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityMeAvatar from './CommunityMeAvatar.jsx';
import {
  CmBookmarkIcon,
  CmCommentIcon,
  CmMoreIcon,
  CmShareIcon,
  CmThumbDownIcon,
  CmThumbUpIcon,
} from './CommunityPageIcons.jsx';
import { CARD, FOCUS_RING, STICKER_BASE } from './communityPageStyles.js';

const log = debug('CommunityPostCard');

/*
 * CommunityPostCard — a feed post (Figma `post · Samuel Boateng` / `post · Yaa Asantewaa` in C-06, C-04, C-05, C-07;
 * `post · Kofi (pending)` in C-13). Playful and Focused draw the same card; only the kind sticker differs (soft green
 * pill vs gold ink sticker with a 2px hard shadow).
 *
 * Props
 *   post       { id, author: { name, avatar?: url, me?: true }, kind ('Achievement' | 'Update' | …), time ('2 hours ago'),
 *                body (plain text; `#tags` are painted #387440 / 500), images?: [url, …] (1-3 shown, big + two stacked),
 *                moreCount?: number (the "+1" veil on the 3rd image), likes, comments, liked?, saved? }
 *   locked     preview mode (C-04): like / dislike / comment / save / share are dimmed to 45% and disabled.
 *   actionsOpacity  explicit opacity of the action row (C-13 pending post draws 0.4).
 *   tone       'default' (#e6e6e6 hairline) | 'expanded' (C-07 open post: ink 10% hairline + soft shadows) |
 *              'pending' (C-13: 1.5px dashed #c8951a border, dash 6 4).
 *   commentsActive  the comment button drawn in its pressed state (C-07: #ebf1ec fill + #387440 hairline).
 *   banner     node rendered between the head and the body (C-13 "pending banner").
 *   to         path of the post page (the comment button, the images and the time link there via onOpen).
 *   onOpen(post)    open the post (comment button / image click). onLike / onDislike / onSave / onShare / onMore(post):
 *                   optional; like / save also toggle locally. onMore opens the report flow on the feed pages.
 *   children   rendered after the action row inside the card (C-07 comment thread, gap 20).
 *   className  appended to the card.
 */
const ACTION =
  'inline-flex h-[32px] shrink-0 cursor-pointer items-center gap-[6px] rounded-[10px] bg-transparent px-[12px] font-sans text-[13px] font-semibold leading-[16px] text-[#595959] disabled:cursor-not-allowed';
const ACTION_IDLE = 'border-0';

const TONES = {
  default: '',
  expanded:
    '!border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]',
  pending: '!border-transparent',
};

const formatCount = (value) => Number(value).toLocaleString('en-US');

/* Post copy with the `#tags` painted like Figma's character overrides (#387440, weight 500). */
export const CommunityPostText = ({ text }) =>
  text.split(/(#\w+)/g).map((part, index) =>
    part.startsWith('#') ? (
      <span key={`${part}-${index}`} className="font-medium text-[#387440]">
        {part}
      </span>
    ) : (
      part
    )
  );

const PostImages = ({ images, moreCount, onOpen }) => {
  const [first, second, third] = images;
  const tile =
    'block size-full cursor-pointer rounded-[14px] border-0 bg-[#ebf1ec] p-0 ' + FOCUS_RING;
  return (
    <div className="flex h-[clamp(150px,33.6vw,260px)] gap-[8px] md:h-[260px]">
      <button type="button" onClick={onOpen} className={classNames(tile, 'min-w-0 flex-1')}>
        <img src={first} alt="" className="size-full rounded-[14px] object-cover" />
      </button>
      {second ? (
        <div className="flex w-[clamp(84px,26.5%,200px)] shrink-0 flex-col gap-[8px]">
          <button type="button" onClick={onOpen} className={classNames(tile, 'min-h-0 flex-1')}>
            <img src={second} alt="" className="size-full rounded-[14px] object-cover" />
          </button>
          {third ? (
            <button
              type="button"
              onClick={onOpen}
              className={classNames(tile, 'relative min-h-0 flex-1 overflow-hidden')}
            >
              <img src={third} alt="" className="size-full rounded-[14px] object-cover" />
              {moreCount ? (
                <span
                  data-count={`+${moreCount}`}
                  className="absolute inset-0 flex items-center justify-center rounded-[14px] bg-[rgba(28,42,33,0.45)] font-sans text-[20px] font-semibold leading-[24px] text-white after:content-[attr(data-count)]"
                />
              ) : null}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

const CommunityPostCard = ({
  post,
  locked = false,
  actionsOpacity,
  tone = 'default',
  commentsActive = false,
  banner,
  onOpen,
  onLike,
  onDislike,
  onSave,
  onShare,
  onMore,
  className,
  children,
}) => {
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(Boolean(post.saved));
  const likes = post.likes + (liked && !post.liked ? 1 : 0) - (!liked && post.liked ? 1 : 0);
  const dim = actionsOpacity ?? (locked ? 0.45 : undefined);
  const images = post.images ?? [];

  // ⚠️ ASSUMPTION: the active like / dislike / save states are not drawn; they recolour the glyph + label #387440.
  const toggleLike = () => {
    log('like', post.id, !liked);
    setLiked((v) => !v);
    if (!liked) setDisliked(false);
    onLike?.(post);
  };
  const toggleDislike = () => {
    log('dislike', post.id, !disliked);
    setDisliked((v) => !v);
    if (!disliked) setLiked(false);
    onDislike?.(post);
  };
  const toggleSave = () => {
    log('save', post.id, !saved);
    setSaved((v) => !v);
    onSave?.(post);
  };
  const open = () => {
    log('open', post.id);
    onOpen?.(post);
  };

  return (
    <article
      className={classNames(
        CARD,
        'relative flex flex-col p-[20px] max-sm:p-[16px]',
        tone === 'expanded' ? 'gap-[20px]' : 'gap-[14px]',
        TONES[tone],
        className
      )}
    >
      {tone === 'pending' ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          <rect
            x="0.75"
            y="0.75"
            rx="19.25"
            fill="none"
            stroke="#c8951a"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            style={{ width: 'calc(100% - 1.5px)', height: 'calc(100% - 1.5px)' }}
          />
        </svg>
      ) : null}
      <header className="flex items-center gap-[10px]">
        {post.author.me ? (
          <CommunityMeAvatar size={44} />
        ) : (
          <img
            src={post.author.avatar}
            alt=""
            className="size-[44px] shrink-0 rounded-full object-cover"
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <div className={classNames('flex items-center gap-[8px]', locked && 'min-h-[31px]')}>
            <span className="min-w-0 truncate font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
              {post.author.name}
            </span>
            <span
              className={classNames(
                STICKER_BASE,
                'h-[22px] text-[10px] leading-[12px] max-lg:text-[12px] playful:h-[27px]'
              )}
            >
              {post.kind}
            </span>
          </div>
          <span className="font-sans text-[12px] leading-[14px] text-[#737373]">{post.time}</span>
        </div>
        <button
          type="button"
          aria-label="More options"
          onClick={() => {
            log('more', post.id);
            onMore?.(post);
          }}
          className={classNames(
            'inline-flex size-[24px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] border-0 bg-transparent p-0 text-[#737373]',
            FOCUS_RING
          )}
        >
          <CmMoreIcon className="size-[20px]" />
        </button>
      </header>

      {banner}

      <p className="m-0 font-sans text-[15px] leading-[23px] text-[#1c2a21]">
        <CommunityPostText text={post.body} />
      </p>

      {images.length ? (
        <PostImages images={images} moreCount={post.moreCount} onOpen={open} />
      ) : null}

      <div className="h-px bg-[#e6e6e6]" />

      <div
        className="flex items-center gap-[8px]"
        style={dim === undefined ? undefined : { opacity: dim }}
      >
        <button
          type="button"
          disabled={locked}
          aria-pressed={liked}
          aria-label="Like"
          onClick={toggleLike}
          className={classNames(ACTION, ACTION_IDLE, FOCUS_RING, liked && '!text-[#387440]')}
        >
          <CmThumbUpIcon className="size-[16px]" />
          <span>{formatCount(likes)}</span>
        </button>
        <button
          type="button"
          disabled={locked}
          aria-pressed={disliked}
          aria-label="Dislike"
          onClick={toggleDislike}
          className={classNames(ACTION, ACTION_IDLE, FOCUS_RING, disliked && '!text-[#387440]')}
        >
          <CmThumbDownIcon className="size-[16px]" />
        </button>
        <button
          type="button"
          disabled={locked}
          aria-label="Comments"
          onClick={open}
          className={classNames(
            ACTION,
            FOCUS_RING,
            commentsActive ? 'border border-solid border-[#387440] !bg-[#ebf1ec]' : ACTION_IDLE
          )}
        >
          <CmCommentIcon className="size-[16px]" />
          <span>{formatCount(post.comments)}</span>
        </button>
        <span className="flex-1" />
        <button
          type="button"
          disabled={locked}
          aria-pressed={saved}
          aria-label="Save"
          onClick={toggleSave}
          className={classNames(ACTION, ACTION_IDLE, FOCUS_RING, saved && '!text-[#387440]')}
        >
          <CmBookmarkIcon className="size-[16px]" />
          <span className="max-sm:hidden">Save</span>
        </button>
        <button
          type="button"
          disabled={locked}
          aria-label="Share"
          onClick={() => {
            log('share', post.id);
            onShare?.(post);
          }}
          className={classNames(ACTION, ACTION_IDLE, FOCUS_RING)}
        >
          <CmShareIcon className="size-[16px]" />
          <span className="max-sm:hidden">Share</span>
        </button>
      </div>

      {children}
    </article>
  );
};

export default CommunityPostCard;
