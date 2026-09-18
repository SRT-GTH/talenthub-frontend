import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';
import { POST_MENU_ITEMS } from './communityData.js';
import CommentThread from './CommentThread.jsx';

const log = debug('PostCard');

/*
 * PostCard — one feed post.
 * Source: Figma 7025:86386 (comments collapsed) and 7025:86431 (comments
 * expanded). Those are the SAME card in two states, not two components —
 * verified by diffing their subtrees.
 *
 * Card: white, r19.29, px24.1 py19.29, shadow 0 7.23px 10px rgba(63,42,120,.12).
 *
 * Reaction buttons (7025:86414 / :86419) are the grey shelf treatment:
 * #f8f8f4 fill, #c6c6c3 border (1px top / 2px sides, bottom 1px on the "like"
 * and 2px on the "dislike" — Figma really does differ there, reproduced), and
 * a 3px #959592 drop shadow.
 *
 * HOVER STATES — both carry Figma annotations:
 *   7025:88313 "Hover state for comments cta" → bg #f1f1f1, r9.66
 *   7025:88317 "Hover state for share button" → bg #f1f1f1, r9.66
 * Implemented as real `hover:` classes on those two controls.
 *
 * Photo layouts:
 *   'triptych' (7025:86403) → 256px band: image | two stacked | image
 *   'single'   (7025:86448) → one 248.31px-tall full-width image
 */

const BODY_TONE_CLASSES = {
  body: 'text-[#595959]',
  code: 'font-semibold text-black',
  hashtag: 'text-brand-green',
};

const PostPhotos = ({ post }) => {
  if (!post.photos?.length) return null;

  if (post.photoLayout === 'single') {
    return (
      <div className="h-[248.31px] w-full overflow-hidden rounded-[7.23px]">
        <img
          src={post.photos[0]}
          alt=""
          draggable="false"
          className="size-full select-none object-cover"
        />
      </div>
    );
  }

  const [first, second, third, fourth] = post.photos;
  return (
    <div className="flex h-[256px] w-full items-start gap-[9.64px]">
      <div className="h-full min-w-0 flex-1 overflow-hidden rounded-[7.23px]">
        <img src={first} alt="" draggable="false" className="size-full select-none object-cover" />
      </div>
      <div className="flex h-full min-w-0 flex-1 flex-col items-start gap-[9.64px]">
        <div className="min-h-0 w-full flex-1 overflow-hidden rounded-[7.23px]">
          <img
            src={second}
            alt=""
            draggable="false"
            className="size-full select-none object-cover"
          />
        </div>
        <div className="min-h-0 w-full flex-1 overflow-hidden rounded-[7.23px]">
          <img
            src={third}
            alt=""
            draggable="false"
            className="size-full select-none object-cover"
          />
        </div>
      </div>
      <div className="h-full min-w-0 flex-1 overflow-hidden rounded-[7.23px]">
        <img src={fourth} alt="" draggable="false" className="size-full select-none object-cover" />
      </div>
    </div>
  );
};

const PostCard = ({
  post,
  onReport,
  onShare,
  onAddComment,
  onLikeComment,
  onReplyToComment,
  className,
}) => {
  const [commentsOpen, setCommentsOpen] = useState(Boolean(post.commentsOpenByDefault));
  const [menuOpen, setMenuOpen] = useState(false);
  const [reaction, setReaction] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    log('mount', {
      post: post.id,
      author: post.author,
      photos: post.photos?.length ?? 0,
      comments: post.comments?.length ?? 0,
      commentsOpenByDefault: Boolean(post.commentsOpenByDefault),
    });
  }, [post]);

  // Close the overflow menu on any outside click.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDocumentClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        log('branch: outside click → closing post menu for', post.id);
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, [menuOpen, post.id]);

  const handleReaction = (next) => {
    const resolved = reaction === next ? null : next;
    log('reaction on', post.id, ':', reaction ?? 'none', '→', resolved ?? 'none');
    setReaction(resolved);
  };

  return (
    <article
      className={classNames(
        'flex w-full flex-col items-center justify-center gap-[15.67px] overflow-visible rounded-[19.29px] bg-white px-[24.1px] py-[19.29px] shadow-[0px_7.232px_10.005px_0px_rgba(63,42,120,0.12)]',
        className
      )}
    >
      {/* Header */}
      <header className="flex w-full items-start justify-between">
        <div className="flex items-center gap-[20.49px]">
          <img
            src={post.avatar}
            alt=""
            draggable="false"
            className="size-[60.27px] shrink-0 select-none rounded-full object-cover"
          />
          <div className="flex flex-col items-start gap-[4px]">
            <div className="flex items-center gap-[7.23px]">
              <span className="whitespace-nowrap font-sans text-[18px] font-medium text-[#2a2a2a]">
                {post.author}
              </span>
              <span className="inline-flex items-center justify-center rounded-full border-[1.205px] border-[#e8e8e4] bg-neutral px-[9.64px] py-[4.82px]">
                <span className="whitespace-nowrap font-sans text-[14px] font-medium text-neutral-dark-active">
                  {post.badge}
                </span>
              </span>
            </div>
            <span className="whitespace-nowrap font-sans text-[14px] text-[#999]">
              {post.timestamp}
            </span>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label={`More actions for ${post.author}'s post`}
            aria-expanded={menuOpen}
            onClick={() => {
              log('post menu toggled for', post.id, '→', !menuOpen);
              setMenuOpen((open) => !open);
            }}
            className="inline-flex size-[24.11px] items-center justify-center rounded transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <CommunityIcon src={icons.postMenu} size={24.11} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[30px] z-20 min-w-[168px] overflow-hidden rounded-[12px] border border-[#e0e0e0] bg-white py-[6px] shadow-bottom-300"
            >
              {POST_MENU_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    log('post menu item selected:', item.id, 'on', post.id);
                    setMenuOpen(false);
                    if (item.id === 'report') onReport?.(post);
                  }}
                  className="block w-full px-[16px] py-[10px] text-left font-sans text-[14px] text-[#595959] transition-colors hover:bg-neutral focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-green"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Body — Figma authors this as a single mixed-style text node */}
      <p className="w-full whitespace-pre-wrap font-sans text-[16px] leading-[1.5] [word-break:break-word]">
        {post.body.map((run, index) => (
          <span key={`${post.id}-run-${index}`} className={BODY_TONE_CLASSES[run.tone]}>
            {run.text}
          </span>
        ))}
      </p>

      <PostPhotos post={post} />

      {/* Action row */}
      <div className="flex w-full flex-col items-center justify-center gap-[7.23px]">
        <div className="h-[1.808px] w-full bg-[#ededed]" />
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center py-[10.85px]">
            <div className="flex items-center gap-[9.64px]">
              <button
                type="button"
                aria-pressed={reaction === 'up'}
                aria-label={`Like ${post.author}'s post`}
                onClick={() => handleReaction('up')}
                className={classNames(
                  'flex items-center justify-center gap-[7.23px] rounded-[12.05px] border-b border-l-2 border-r-2 border-t border-neutral-active px-[19.29px] py-[12.05px] drop-shadow-[0px_3px_0px_#959592] transition-transform active:translate-y-[2px] active:drop-shadow-[0px_1px_0px_#959592]',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                  reaction === 'up' ? 'bg-brand-green-light' : 'bg-neutral'
                )}
              >
                <CommunityIcon src={icons.thumbsUp} size={16.88} className="!h-[18.62px]" />
                <span className="whitespace-nowrap font-sans text-[16px] font-medium tracking-[0.12px] text-neutral-darker">
                  {post.likeLabel}
                </span>
              </button>
              <button
                type="button"
                aria-pressed={reaction === 'down'}
                aria-label={`Dislike ${post.author}'s post`}
                onClick={() => handleReaction('down')}
                className={classNames(
                  'flex items-center justify-center gap-[7.23px] rounded-[12.05px] border-b-2 border-l-2 border-r-2 border-t border-neutral-active px-[19.29px] py-[12.05px] drop-shadow-[0px_3px_0px_#959592] transition-transform active:translate-y-[2px] active:drop-shadow-[0px_1px_0px_#959592]',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                  reaction === 'down' ? 'bg-brand-green-light' : 'bg-neutral'
                )}
              >
                <CommunityIcon src={icons.thumbsDown} size={16.88} className="!h-[18.61px]" />
              </button>
            </div>
          </div>

          {/* Comments CTA — hidden while the thread is open, matching Figma's
              expanded post (7025:86451 drops it from the action row). */}
          {!commentsOpen && (
            <button
              type="button"
              aria-expanded={false}
              onClick={() => {
                log('comment thread opened on post:', post.id);
                setCommentsOpen(true);
              }}
              className="flex items-center gap-[4.83px] rounded-[9.66px] px-[14.48px] py-[7.24px] transition-colors hover:bg-[#f1f1f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <CommunityIcon src={icons.comment} size={28.93} />
              <span className="whitespace-nowrap font-sans text-[16px] text-[#595959]">
                {post.commentLabel}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              log('share clicked on post:', post.id);
              onShare?.(post);
            }}
            className="flex items-center gap-[4.83px] rounded-[9.66px] px-[14.48px] py-[7.24px] transition-colors hover:bg-[#f1f1f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <CommunityIcon src={icons.share} size={18} />
            <span className="whitespace-nowrap font-sans text-[16px] leading-[1.5] text-[#595959]">
              Share
            </span>
          </button>
        </div>
      </div>

      {commentsOpen && (
        <CommentThread
          post={post}
          onClose={() => {
            log('comment thread closed on post:', post.id);
            setCommentsOpen(false);
          }}
          onAddComment={onAddComment}
          onLikeComment={onLikeComment}
          onReplyToComment={onReplyToComment}
        />
      )}
    </article>
  );
};

export default PostCard;
