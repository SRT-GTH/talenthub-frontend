import { useCallback, useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { circleApi, circleErrorText } from '../../../../services/circle.api.js';
import PurposePicker from '../PurposePicker.jsx';
import { PURPOSE_BY_VALUE } from '../postPurpose.js';
import CircleAvatar from './CircleAvatar.jsx';
import { personHref } from './circleState.js';
import { CARD, FOCUS_RING, HEADING } from './circleStyles.js';

const log = debug('LiveCircleFeed');

/* US-5.3.1-04 audiences. Minors can't post in public. */
const AUDIENCES = [
  { value: 'connections', label: 'My Connections', note: 'Only people in your circle' },
  {
    value: 'communities',
    label: 'My Communities',
    note: 'Your circle and people in your communities',
  },
  { value: 'public', label: 'Public', note: 'Anyone on GTH' },
  { value: 'private', label: 'Only me', note: 'Nobody else sees it' },
];
const AUDIENCE_LABEL = Object.fromEntries(AUDIENCES.map((a) => [a.value, a.label]));

const ago = (iso) => {
  const t = iso ? new Date(iso).getTime() : 0;
  if (!t) return '';
  const m = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
};

/* Composer: text, required purpose (same dropdown as communities), audience (default My Connections). */
const Composer = ({ minor, onPosted }) => {
  const textId = useId();
  const audienceId = useId();
  const [text, setText] = useState('');
  const [purpose, setPurpose] = useState('');
  const [audience, setAudience] = useState('connections');
  const [state, setState] = useState({ busy: false, error: null });
  const options = AUDIENCES.filter((a) => !(minor && a.value === 'public'));
  const submit = async () => {
    if (!text.trim() || !purpose || state.busy) return;
    setState({ busy: true, error: null });
    try {
      const out = await circleApi.createPost({ content: text.trim(), purpose, audience });
      setText('');
      setPurpose('');
      setState({ busy: false, error: null });
      onPosted?.(out);
    } catch (err) {
      log('post failed', err?.response?.status);
      setState({ busy: false, error: circleErrorText(err, 'Couldn’t post. Try again.') });
    }
  };
  return (
    <section
      aria-label="Share with your circle"
      className={classNames(CARD, 'flex flex-col gap-[12px] p-[20px] max-sm:p-[14px]')}
    >
      <label htmlFor={textId} className="font-sans text-[14px] font-semibold text-[#1c2a21]">
        Share an update with your circle
      </label>
      <textarea
        id={textId}
        value={text}
        maxLength={2000}
        rows={3}
        onChange={(e) => setText(e.target.value)}
        placeholder="A win, a question, something you’re learning…"
        className={classNames(
          'w-full resize-y rounded-[12px] border border-solid border-[#d9d9d9] p-[12px] font-sans text-[14px] leading-[20px] text-[#1c2a21]',
          FOCUS_RING
        )}
      />
      <PurposePicker value={purpose} onChange={setPurpose} allowed={null} suggestion={null} />
      <div className="flex flex-wrap items-end gap-[12px]">
        <div className="flex min-w-[200px] flex-1 flex-col gap-[6px]">
          <label htmlFor={audienceId} className="font-sans text-[14px] font-medium text-[#1c2a21]">
            Who can see it
          </label>
          <select
            id={audienceId}
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className={classNames(
              'h-[40px] rounded-[12px] border border-solid border-[#cfd8d1] bg-white px-[12px] font-sans text-[14px] text-[#1c2a21]',
              FOCUS_RING
            )}
          >
            {options.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label} — {a.note}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim() || !purpose || state.busy}
          className={classNames(
            'h-[40px] cursor-pointer rounded-full border-0 bg-[#387440] px-[22px] font-sans text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50',
            FOCUS_RING
          )}
        >
          {state.busy ? 'Posting…' : 'Post'}
        </button>
      </div>
      {state.error ? (
        <p role="alert" className="m-0 font-sans text-[13px] text-[#c0392b]">
          {state.error}
        </p>
      ) : null}
    </section>
  );
};

const PostCard = ({ post }) => {
  const purpose = post.purpose ? PURPOSE_BY_VALUE[post.purpose] : null;
  return (
    <article
      className={classNames(CARD, 'flex flex-col gap-[10px] px-[20px] py-[16px] max-sm:px-[14px]')}
    >
      <div className="flex items-center gap-[12px]">
        <CircleAvatar
          id={post.author.id}
          photo={post.author.photo}
          name={post.author.name}
          size={44}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <div className="flex flex-wrap items-center gap-[6px]">
            {post.mine ? (
              <span className="font-sans text-[15px] font-semibold text-[#1c2a21]">You</span>
            ) : (
              <Link
                to={personHref(post.author.id)}
                className={`font-sans text-[15px] font-semibold text-[#1c2a21] no-underline ${FOCUS_RING}`}
              >
                {post.author.name}
              </Link>
            )}
            {purpose ? (
              <span
                className={classNames(
                  'inline-flex h-[22px] items-center rounded-full px-[10px] font-sans text-[11px] font-bold',
                  purpose.badge
                )}
              >
                {purpose.singular}
              </span>
            ) : null}
          </div>
          <span className="font-sans text-[12px] text-[#737373]">
            {ago(post.publishedAt)} · {AUDIENCE_LABEL[post.audience] || 'Public'}
            {post.pending ? ' · Waiting for a moderator' : ''}
          </span>
        </div>
      </div>
      <p className="m-0 whitespace-pre-line font-sans text-[14px] leading-[22px] text-[#1c2a21]">
        {post.content}
      </p>
    </article>
  );
};

/*
 * LiveCircleFeed — "From your circle" on the API (US-5.3.1-04, Figma NW-09 without the drawn mock data): a composer with the
 * required purpose and the audience, then posts from the talent's connections (and My Communities posts from people who share
 * a community), newest first, 20 at a time. Props: minor (no Public), onDiscover() for the empty state, show(toast).
 */
const LiveCircleFeed = ({ minor, onDiscover, show }) => {
  // nextOffset comes from the server (rows read), so a post added here or filtered there never shifts the pages.
  const [state, setState] = useState({
    status: 'loading',
    items: [],
    total: 0,
    nextOffset: 0,
    more: false,
  });
  const [busy, setBusy] = useState(false);
  const load = useCallback(async (offset = 0) => {
    setBusy(true);
    try {
      const out = await circleApi.feed(offset);
      setState((s) => {
        const fresh = out?.items || [];
        const items = offset
          ? [...s.items, ...fresh.filter((p) => !s.items.some((x) => x.id === p.id))]
          : fresh;
        const nextOffset = out?.nextOffset ?? offset + fresh.length;
        return {
          status: 'ready',
          items,
          total: out?.total || 0,
          nextOffset,
          more: nextOffset < (out?.total || 0),
        };
      });
    } catch (err) {
      log('feed failed', err?.response?.status);
      setState((s) => ({ ...s, status: 'error' }));
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    load(0);
  }, [load]);

  const onPosted = (out) => {
    // Shown at the top straight away; it isn't counted (a held post is not in the server's list yet).
    if (out?.post)
      setState((s) => ({
        ...s,
        items: [out.post, ...s.items.filter((x) => x.id !== out.post.id)],
      }));
    show?.({
      text:
        out?.moderation?.status === 'pending_review'
          ? 'Posted! It’ll go live after a quick check'
          : 'Posted to your circle',
    });
  };

  return (
    <div className="flex min-w-0 flex-col gap-[20px]">
      <div className="flex flex-col gap-[4px]">
        <h2 className={classNames(HEADING, 'text-[24px] leading-[30px]')}>From your circle</h2>
        <p className="m-0 font-sans text-[14px] text-[#595959]">
          Updates from the people you’ve linked up with.
        </p>
      </div>
      <Composer minor={minor} onPosted={onPosted} />
      {state.status === 'loading' ? (
        <p className="m-0 font-sans text-[14px] text-[#737373]">Loading your feed…</p>
      ) : state.status === 'error' ? (
        <p role="alert" className="m-0 font-sans text-[14px] text-[#c0392b]">
          Couldn’t load your feed.{' '}
          <button
            type="button"
            onClick={() => load(0)}
            className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#387440] underline"
          >
            Try again
          </button>
        </p>
      ) : state.items.length === 0 ? (
        <div className={classNames(CARD, 'flex flex-col items-start gap-[10px] p-[20px]')}>
          <p className="m-0 font-sans text-[15px] text-[#1c2a21]">
            Your feed is quiet. Link up with classmates to see their wins.
          </p>
          <button
            type="button"
            onClick={onDiscover}
            className={classNames(
              'cursor-pointer rounded-full border border-solid border-[#387440] bg-white px-[16px] py-[8px] font-sans text-[14px] font-semibold text-[#387440]',
              FOCUS_RING
            )}
          >
            Find people to link up with
          </button>
        </div>
      ) : (
        <>
          {state.items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {state.more ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => load(state.nextOffset)}
              className={classNames(
                'cursor-pointer self-center rounded-full border border-solid border-[#e1eae2] bg-white px-[16px] py-[8px] font-sans text-[14px] font-semibold text-[#387440]',
                FOCUS_RING
              )}
            >
              Show more
            </button>
          ) : null}
        </>
      )}
    </div>
  );
};

export default LiveCircleFeed;
