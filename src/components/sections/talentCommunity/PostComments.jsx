import { useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import akosuaAvatar from '../../../assets/talent-community/posts/akosua-mansa.png';
import CommunityMeAvatar from './CommunityMeAvatar.jsx';
import {
  CommunityPostChevronSmallGlyph,
  CommunityPostThumbUpSmallGlyph,
} from './CommunityPostIcons.jsx';
import { FOCUS_RING } from './communityDialogUtils.js';
import { POST_DETAIL } from './communityData.js';

const log = debug('PostComments');

const AVATARS = { akosua: akosuaAvatar };

/* GTHInput of the comment composers: white, 1px #ccc, r10, hard 4px shadow + soft lift (Figma draws it in the active state). */
const INPUT =
  'block min-w-0 flex-1 rounded-[10px] border border-solid border-[#ccc] bg-white py-[13px] pl-[20px] pr-[16px] font-sans font-medium text-[14px] tracking-[0.2px] text-[#1c2a21] shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] outline-none placeholder:text-[#595959] max-sm:px-[14px]';

const LINK_BTN = `cursor-pointer border-0 bg-transparent p-0 font-sans text-[12px] font-semibold leading-[14px] ${FOCUS_RING}`;

/* One comment: avatar + grey bubble + like / Reply row (+ optional "View n replies" and inline reply composer). */
const Comment = ({ comment, onLike, liked, replyOpen, onReply, children }) => {
  const avatar = AVATARS[comment.id] ?? comment.avatar;
  const likes = comment.likes + (liked ? 1 : 0);
  return (
    <div className="flex gap-[10px]">
      {comment.me ? (
        <CommunityMeAvatar size={36} />
      ) : avatar ? (
        <img src={avatar} alt="" className="size-[36px] shrink-0 rounded-full object-cover" />
      ) : (
        <span aria-hidden="true" className="size-[36px] shrink-0" />
      )}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-[6px]">
        <div className="flex max-w-full flex-col gap-[4px] rounded-[14px] bg-[#f8f8f4] px-[14px] py-[10px]">
          <div className="flex items-center gap-[6px]">
            <span className="font-sans text-[13px] font-semibold leading-[16px] text-[#1c2a21] max-lg:text-[14px]">
              {comment.author}
            </span>
            <span className="font-sans text-[12px] leading-[14px] text-[#737373]">
              {comment.time}
            </span>
          </div>
          <p className="m-0 font-sans text-[14px] leading-[17px] text-[#1c2a21]">{comment.text}</p>
        </div>
        <div className="flex items-center gap-[14px] pl-[6px]">
          <button
            type="button"
            aria-pressed={liked}
            aria-label={`Like comment by ${comment.author}`}
            onClick={onLike}
            className={classNames(
              LINK_BTN,
              'inline-flex items-center gap-[4px]',
              liked ? 'text-[#387440]' : 'text-[#595959]'
            )}
          >
            <CommunityPostThumbUpSmallGlyph className="size-[13px]" />
            <span>{likes}</span>
          </button>
          <button
            type="button"
            aria-expanded={replyOpen}
            onClick={onReply}
            className={classNames(LINK_BTN, 'text-[#595959]')}
          >
            {POST_DETAIL.reply}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/*
 * PostComments — the open comment thread of a post (Figma C-07 `comments` 7628:6308 / Focused 8110:461921): composer,
 * Akosua Mansa (+ "View 4 replies"), King D (+ open "Reply to King D…" composer), "View 10 more comments".
 * Renders inside CommunityPostCard (as `children`). Props: `onCount(n)` called with the number of comments added locally.
 * Local state only: like toggles +1, Post appends a comment by Kofi, Reply opens/focuses the reply input.
 * ⚠️ ASSUMPTION: the 4 replies / 10 more comments are not drawn, "View 4 replies" and "View 10 more comments" only log.
 */
const PostComments = ({ onCount }) => {
  const copy = POST_DETAIL;
  const [draft, setDraft] = useState(copy.composer.value);
  const [added, setAdded] = useState([]);
  const [liked, setLiked] = useState({});
  const [replying, setReplying] = useState({ kingd: true });
  const [replyText, setReplyText] = useState({});
  const replyRefs = useRef({});

  const post = () => {
    const text = draft.trim();
    if (!text) return;
    log('comment', text.length);
    const next = [
      ...added,
      {
        id: `me-${added.length}`,
        author: 'Kofi Agyekum',
        time: 'Just now',
        text,
        likes: 0,
        me: true,
      },
    ];
    setAdded(next);
    onCount?.(next.length);
    setDraft('');
  };

  const toggleReply = (id) => {
    setReplying((r) => ({ ...r, [id]: true }));
    window.setTimeout(() => replyRefs.current[id]?.focus(), 0);
  };

  const submitReply = (id) => {
    const text = (replyText[id] ?? '').trim();
    if (!text) return;
    log('reply', id);
    setReplyText((r) => ({ ...r, [id]: '' }));
  };

  return (
    <section aria-label="Comments" className="flex flex-col gap-[20px]">
      <div className="flex items-center gap-[10px]">
        <CommunityMeAvatar size={36} />
        <input
          aria-label={copy.composer.value}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && post()}
          className={classNames(INPUT, 'h-[51px]')}
        />
        <Button variant="primary" size="sm" onClick={post} disabled={!draft.trim()}>
          {copy.composer.post}
        </Button>
      </div>

      {copy.thread.map((c) => (
        <Comment
          key={c.id}
          comment={c}
          liked={Boolean(liked[c.id])}
          onLike={() => setLiked((l) => ({ ...l, [c.id]: !l[c.id] }))}
          replyOpen={Boolean(replying[c.id])}
          onReply={() => toggleReply(c.id)}
        >
          {c.replies ? (
            <button
              type="button"
              onClick={() => log('view replies')}
              className={classNames(
                LINK_BTN,
                'inline-flex items-center gap-[6px] pl-[6px] text-[#387440]'
              )}
            >
              <CommunityPostChevronSmallGlyph className="size-[14px]" />
              {c.replies}
            </button>
          ) : null}
          {replying[c.id] ? (
            <div className="flex w-full items-center gap-[8px]">
              <CommunityMeAvatar size={28} />
              <input
                ref={(el) => {
                  replyRefs.current[c.id] = el;
                }}
                aria-label={c.replyPlaceholder ?? `Reply to ${c.author}…`}
                placeholder={c.replyPlaceholder ?? `Reply to ${c.author}…`}
                value={replyText[c.id] ?? ''}
                onChange={(e) => setReplyText((r) => ({ ...r, [c.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && submitReply(c.id)}
                className={classNames(INPUT, 'h-[51px] font-normal leading-[20px]')}
              />
            </div>
          ) : null}
        </Comment>
      ))}

      {added.map((c) => (
        <Comment
          key={c.id}
          comment={{ ...c, avatar: null }}
          liked={Boolean(liked[c.id])}
          onLike={() => setLiked((l) => ({ ...l, [c.id]: !l[c.id] }))}
          replyOpen={false}
          onReply={() => toggleReply(c.id)}
        />
      ))}

      <button
        type="button"
        onClick={() => log('view more comments')}
        className={classNames(LINK_BTN, 'self-start text-[13px] leading-[16px] text-[#387440]')}
      >
        {copy.more}
      </button>
    </section>
  );
};

export default PostComments;
