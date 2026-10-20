import { useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import CommunityMeAvatar from './CommunityMeAvatar.jsx';
import { Comment } from './PostComments.jsx';
import { INPUT, LINK_BTN } from './postCommentStyles.js';
import { CommunityPostChevronSmallGlyph } from './CommunityPostIcons.jsx';

const log = debug('LivePostComments');

/*
 * LivePostComments — the C-07 comment thread on the API (same look as PostComments).
 * Props
 *   comments   [{ id, author, avatar, me?, time, text, likes, replies: [same] }] (toComment)
 *   canWrite   members only: the composer and Reply are hidden for visitors
 *   onComment(text, parentId?) -> Promise<boolean>
 * Replies show under their top-level comment: two are visible, "View n more replies" opens the rest.
 * ⚠️ ASSUMPTION: comment likes have no community endpoint yet, so the thumb toggles on screen only.
 */
const SHOWN_REPLIES = 2;

const LivePostComments = ({ comments, canWrite, onComment }) => {
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState({});
  const [replying, setReplying] = useState({});
  const [replyText, setReplyText] = useState({});
  const [expanded, setExpanded] = useState({});
  const replyRefs = useRef({});

  const send = async (text, parentId) => {
    const value = text.trim();
    if (!value || busy) return false;
    setBusy(true);
    setError(null);
    const ok = await onComment(value, parentId);
    setBusy(false);
    if (!ok) setError('Couldn’t post your comment. Try again.');
    log(parentId ? 'reply' : 'comment', ok);
    return ok;
  };

  const post = async () => {
    if (await send(draft)) setDraft('');
  };

  const reply = async (id) => {
    if (await send(replyText[id] ?? '', id)) {
      setReplyText((r) => ({ ...r, [id]: '' }));
      setExpanded((e) => ({ ...e, [id]: true }));
    }
  };

  const openReply = (id) => {
    setReplying((r) => ({ ...r, [id]: true }));
    window.setTimeout(() => replyRefs.current[id]?.focus(), 0);
  };

  const renderComment = (c, rootId, nested) => (
    <Comment
      key={c.id}
      comment={c}
      liked={Boolean(liked[c.id])}
      onLike={() => setLiked((l) => ({ ...l, [c.id]: !l[c.id] }))}
      replyOpen={Boolean(replying[rootId])}
      onReply={canWrite ? () => openReply(rootId) : undefined}
    >
      {nested}
    </Comment>
  );

  return (
    <section aria-label="Comments" className="flex flex-col gap-[20px]">
      {canWrite ? (
        <div className="flex items-center gap-[10px]">
          <CommunityMeAvatar size={36} />
          <input
            aria-label="Write a comment"
            placeholder="Write a comment…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && post()}
            className={classNames(INPUT, 'h-[51px]')}
          />
          <Button variant="primary" size="sm" onClick={post} disabled={!draft.trim() || busy}>
            Post
          </Button>
        </div>
      ) : null}
      {error ? (
        <p role="alert" className="m-0 font-sans text-[13px] font-medium text-[#c0392b]">
          {error}
        </p>
      ) : null}
      {comments.length === 0 ? (
        <p className="m-0 font-sans text-[13px] text-[#737373]">
          {canWrite ? 'No comments yet. Start the conversation.' : 'No comments yet.'}
        </p>
      ) : null}
      {comments.map((c) => {
        const replies = c.replies || [];
        const open = expanded[c.id] || replies.length <= SHOWN_REPLIES;
        const shown = open ? replies : replies.slice(0, SHOWN_REPLIES);
        return renderComment(
          c,
          c.id,
          <>
            {shown.length ? (
              <div className="flex w-full flex-col gap-[14px] pt-[6px]">
                {shown.map((r) => renderComment(r, c.id, null))}
              </div>
            ) : null}
            {!open ? (
              <button
                type="button"
                onClick={() => setExpanded((e) => ({ ...e, [c.id]: true }))}
                className={classNames(LINK_BTN, 'inline-flex items-center gap-[6px] pl-[6px] text-[#387440]')}
              >
                <CommunityPostChevronSmallGlyph className="size-[14px]" />
                {`View ${replies.length - SHOWN_REPLIES} more ${replies.length - SHOWN_REPLIES === 1 ? 'reply' : 'replies'}`}
              </button>
            ) : null}
            {canWrite && replying[c.id] ? (
              <div className="flex w-full items-center gap-[8px]">
                <CommunityMeAvatar size={28} />
                <input
                  ref={(el) => {
                    replyRefs.current[c.id] = el;
                  }}
                  aria-label={`Reply to ${c.author}…`}
                  placeholder={`Reply to ${c.author}…`}
                  value={replyText[c.id] ?? ''}
                  onChange={(e) => setReplyText((r) => ({ ...r, [c.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && reply(c.id)}
                  className={classNames(INPUT, 'h-[51px] font-normal leading-[20px]')}
                />
              </div>
            ) : null}
          </>
        );
      })}
    </section>
  );
};

export default LivePostComments;
