import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';
import { COMMENT_PLACEHOLDER } from './communityData.js';

const log = debug('CommentThread');

/*
 * CommentThread — the expanded comment section under a post.
 * Source: Figma 7025:86471 (header + composer + comment list) with the
 * inline reply composer at 7025:86530.
 *
 * Structure, exactly as Figma draws it:
 *   header    → comment glyph + "5.2k Comments"  ·  "Cancel" (brand-green)
 *   composer  → KA gradient avatar + bordered input + green "Post" button
 *   divider   → 1.808px #ededed
 *   comments  → avatar + name · dot · timestamp + body
 *               + thumbs-up/count, thumbs-down, "Reply"
 *               + optional "N replies ⌄" expander
 *               + optional inline reply composer ("Reply <name>...") with a
 *                 green "Reply" button
 *
 * The avatar initials block is Instrument Sans Bold on the dark-green
 * gradient — matching the app's existing user-chip treatment.
 */

const BUTTON_LABEL_GRADIENT = 'linear-gradient(203.44deg, #fef1e7 0%, #e8f2ed 20.192%)';
const AVATAR_GRADIENT = 'linear-gradient(135deg, #142916 0%, #2a5730 100%)';

const InitialsAvatar = ({ initials, size, fontSize }) => (
  <span
    aria-hidden="true"
    className="relative inline-flex shrink-0 items-center justify-center rounded-full"
    style={{ width: size, height: size, backgroundImage: AVATAR_GRADIENT }}
  >
    <span
      className="font-display font-bold text-white"
      style={{ fontSize, fontFamily: "'Instrument Sans', var(--font-sans)" }}
    >
      {initials}
    </span>
  </span>
);

/* Figma draws this button at full brand-green even with an empty field
 * (7025:86488 / :86539), so it is NOT visually dimmed when empty — the empty
 * case is guarded in the handler and announced via aria-disabled instead. */
const GreenActionButton = ({ label, onClick, disabled, className }) => (
  <button
    type="button"
    onClick={onClick}
    aria-disabled={disabled || undefined}
    className={classNames(
      'flex shrink-0 items-center justify-center gap-[7.23px] rounded-[12.05px] border-b-2 border-l-2 border-r-2 border-t border-brand-green-dark bg-brand-green px-[19.29px] py-[12.05px] drop-shadow-[0px_3px_0px_#224626] transition-transform',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      'active:translate-y-[2px] active:drop-shadow-[0px_1px_0px_#224626]',
      className
    )}
  >
    <span
      className="whitespace-nowrap bg-clip-text font-sans text-[16px] font-medium tracking-[0.12px] text-transparent"
      style={{ backgroundImage: BUTTON_LABEL_GRADIENT }}
    >
      {label}
    </span>
  </button>
);

const ReplyComposer = ({ authorName, onSubmit }) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim()) {
      log('branch: reply submit blocked — empty input');
      return;
    }
    log('reply submitted to:', authorName, '| chars:', value.trim().length);
    onSubmit?.(value.trim());
    setValue('');
  };

  return (
    <div className="flex h-[43.39px] w-full items-center gap-[14.47px]">
      <InitialsAvatar initials="KA" size="43.39px" fontSize="12.05px" />
      <label className="flex h-full min-w-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-[9.64px] border-[1.205px] border-[#e0e0e0] px-[14.47px] py-[9.64px] focus-within:border-brand-green-light-active">
        <span className="sr-only">{`Reply ${authorName}...`}</span>
        <div className="flex w-full items-center justify-between">
          <input
            type="text"
            value={value}
            placeholder={`Reply ${authorName}...`}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSubmit();
            }}
            className="min-w-0 flex-1 bg-transparent font-sans text-[14px] text-black outline-none placeholder:text-[#999]"
          />
          <CommunityIcon src={icons.emojiSmileSm} size={24.11} />
        </div>
      </label>
      <GreenActionButton
        label="Reply"
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="h-full !w-[77.15px]"
      />
    </div>
  );
};

const CommentRow = ({ comment, onLike, onReply }) => {
  const [replyOpen, setReplyOpen] = useState(Boolean(comment.replyComposerOpenByDefault));
  const [repliesExpanded, setRepliesExpanded] = useState(false);

  return (
    <div className="flex w-full items-start justify-center gap-[14.47px]">
      <img
        src={comment.avatar}
        alt=""
        draggable="false"
        className="size-[48.22px] shrink-0 select-none rounded-full object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[12.05px]">
        <div className="flex w-full flex-col items-start gap-[4.82px]">
          <div className="flex items-center justify-center gap-[7.23px]">
            <span className="whitespace-nowrap font-sans text-[16px] font-medium leading-[1.5] text-black">
              {comment.author}
            </span>
            <CommunityIcon src={icons.commentDot} size={6} />
            <span className="whitespace-nowrap font-sans text-[14px] leading-[1.5] text-neutral-dark-hover">
              {comment.timestamp}
            </span>
          </div>
          <p className="w-full font-sans text-[15px] leading-[1.5] text-[#595959]">
            {comment.body}
          </p>
        </div>

        <div className="flex items-start gap-[19.29px]">
          <div className="flex items-center gap-[12.05px]">
            <button
              type="button"
              aria-label={`Like ${comment.author}'s comment`}
              onClick={() => {
                log('comment liked:', comment.id);
                onLike?.(comment.id, 'up');
              }}
              className="flex items-center gap-[3.62px] rounded px-[2px] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <CommunityIcon src={icons.commentThumbsUp} size={14.47} className="!h-[15.96px]" />
              <span className="font-sans text-[15px] leading-[1.5] text-neutral-darker">
                {comment.likeCount}
              </span>
            </button>
            <button
              type="button"
              aria-label={`Dislike ${comment.author}'s comment`}
              onClick={() => {
                log('comment disliked:', comment.id);
                onLike?.(comment.id, 'down');
              }}
              className="inline-flex -scale-y-100 rotate-180 items-center justify-center rounded px-[2px] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <CommunityIcon src={icons.commentThumbsDown} size={14.47} className="!h-[15.95px]" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              log('reply composer toggled for:', comment.id, '→', !replyOpen);
              setReplyOpen((open) => !open);
            }}
            className="whitespace-nowrap font-sans text-[15px] leading-[1.5] text-brand-green-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            Reply
          </button>
        </div>

        {comment.replyCountLabel && (
          <button
            type="button"
            aria-expanded={repliesExpanded}
            onClick={() => {
              log('replies expander toggled for:', comment.id, '→', !repliesExpanded);
              setRepliesExpanded((expanded) => !expanded);
            }}
            className="flex items-center gap-[7.23px] rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <span className="whitespace-nowrap font-sans text-[15px] leading-[1.5] text-black">
              {comment.replyCountLabel}
            </span>
            <CommunityIcon
              src={icons.chevronDown}
              size={16.88}
              className={classNames('transition-transform', repliesExpanded && 'rotate-180')}
            />
          </button>
        )}

        {/* Expanded replies. Figma never renders an expanded reply list, so
            nothing is invented here — the expander reveals whatever replies
            the mock record actually holds (currently none) and logs the
            branch so the empty case is visible during development. */}
        {repliesExpanded && comment.replies.length > 0 && (
          <div className="flex w-full flex-col gap-[16px] border-l border-[#ededed] pl-[16px]">
            {comment.replies.map((reply) => (
              <CommentRow key={reply.id} comment={reply} onLike={onLike} onReply={onReply} />
            ))}
          </div>
        )}

        {replyOpen && (
          <ReplyComposer
            authorName={comment.author}
            onSubmit={(body) => onReply?.(comment.id, body)}
          />
        )}
      </div>
    </div>
  );
};

const CommentThread = ({ post, onClose, onAddComment, onLikeComment, onReplyToComment }) => {
  const [draft, setDraft] = useState('');

  const handlePost = () => {
    if (!draft.trim()) {
      log('branch: comment submit blocked — empty input');
      return;
    }
    log('comment submitted on post:', post.id, '| chars:', draft.trim().length);
    onAddComment?.(post.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="flex w-full flex-col items-start gap-[24.11px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[4px]">
          <CommunityIcon src={icons.commentOpen} size={24} />
          <span className="whitespace-nowrap font-sans text-[16px] font-medium text-black">
            {post.commentLabel}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            log('comment thread closed on post:', post.id);
            onClose?.();
          }}
          className="whitespace-nowrap font-sans text-[15.67px] font-medium text-brand-green hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          Cancel
        </button>
      </div>

      <div className="flex w-full flex-col items-start gap-[19.29px]">
        {/* Top-level composer */}
        <div className="flex h-[52.93px] w-full items-center gap-[14.47px]">
          <InitialsAvatar initials="KA" size="48.22px" fontSize="14.47px" />
          <label className="flex min-w-0 flex-1 flex-col items-start overflow-hidden rounded-[14.47px] border-[1.205px] border-[#e0e0e0] px-[18px] py-[12px] focus-within:border-brand-green-light-active">
            <span className="sr-only">{COMMENT_PLACEHOLDER}</span>
            <div className="flex w-full items-center justify-between">
              <input
                type="text"
                value={draft}
                placeholder={COMMENT_PLACEHOLDER}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handlePost();
                }}
                className="min-w-0 flex-1 bg-transparent font-sans text-[16px] text-black outline-none placeholder:text-[#999]"
              />
              <CommunityIcon src={icons.emojiSmile} size={28.93} />
            </div>
          </label>
          <GreenActionButton
            label="Post"
            onClick={handlePost}
            disabled={!draft.trim()}
            className="h-full !w-[77.15px]"
          />
        </div>

        <div className="h-[1.808px] w-full bg-[#ededed]" />

        <div className="flex w-full flex-col items-start gap-[19.29px]">
          {post.comments.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              onLike={onLikeComment}
              onReply={onReplyToComment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentThread;
