import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommunityFrame from '../../components/sections/talentCommunity/CommunityFrame.jsx';
import { useCommunityState } from '../../components/sections/talentCommunity/communityState.js';
import { careerContentApi } from '../../services/careerContent.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('CareerContentPage');

const TYPE_TAG = { article: 'Article', video: 'Video', qa: 'Q&A' };

/*
 * CareerContentPage - `/career-content/:contentId`: one GTH post about a career, opened from a Career Buddy post card
 * (2026-10-27). GET /api/guidance/content/:id applies the same rules as the cards (community members only, nothing
 * held, flagged or by a minor), so a link that isn't for this talent reads "not available". Shows the post in full,
 * plays its video, links to its community thread, and lists related posts.
 */
const CareerContentPage = () => {
  const { contentId } = useParams();
  const community = useCommunityState();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: 'loading', item: null });

  useEffect(() => {
    let live = true;
    setState({ status: 'loading', item: null });
    careerContentApi
      .item(contentId)
      .then((item) => live && setState({ status: 'ready', item }))
      .catch((err) => {
        log.error('item failed', err?.response?.status);
        if (live)
          setState({ status: err?.response?.status === 404 ? 'missing' : 'error', item: null });
      });
    return () => {
      live = false;
    };
  }, [contentId]);

  const item = state.item;
  return (
    <CommunityFrame community={community}>
      <main className="mx-auto flex w-full max-w-[760px] flex-col gap-[20px] px-[16px] py-[24px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-fit cursor-pointer rounded-full border border-solid border-[#c1d4c4] bg-white px-[14px] py-[6px] font-sans text-[14px] font-semibold text-[#387440]"
        >
          ← Back
        </button>
        {state.status !== 'ready' ? (
          <p className="m-0 font-sans text-[15px] text-[#595959]">
            {state.status === 'loading'
              ? 'Loading…'
              : state.status === 'missing'
                ? 'This post isn’t available to you.'
                : 'We couldn’t load this post. Please try again.'}
          </p>
        ) : (
          <>
            <article className="flex flex-col gap-[14px] rounded-[16px] border border-solid border-[#e7e7e7] bg-white p-[22px] max-sm:p-[16px]">
              <div className="flex flex-wrap items-center gap-[8px] font-sans text-[13px] text-[#595959]">
                <span className="rounded-full bg-[#ebf1ec] px-[10px] py-[3px] font-semibold text-[#387440]">
                  {TYPE_TAG[item.type] || 'Article'}
                </span>
                {item.careerCategory?.title ? <span>About {item.careerCategory.title}</span> : null}
                {item.type === 'article' && item.estimatedMinutes ? (
                  <span>· {item.estimatedMinutes} min read</span>
                ) : null}
              </div>
              <h1 className="m-0 font-sans text-[22px] font-semibold leading-[28px] text-[#1c2a21] playful:font-heading">
                {item.title}
              </h1>
              <p className="m-0 font-sans text-[14px] text-[#595959]">
                by {item.author?.name || 'a GTH member'}
                {item.community ? (
                  <>
                    {' '}
                    in{' '}
                    <Link
                      to={item.url || `/community/${item.community.slug || item.community.id}`}
                      className="font-semibold text-[#387440]"
                    >
                      {item.community.name}
                    </Link>
                  </>
                ) : (
                  ' on the GTH feed'
                )}
              </p>
              {item.videoUrl ? (
                <video
                  controls
                  preload="metadata"
                  src={item.videoUrl}
                  className="w-full rounded-[12px] bg-black"
                >
                  <track kind="captions" />
                </video>
              ) : null}
              {/* A short post is all title: don't print it twice. */}
              {String(item.content || '').trim() !== String(item.title || '').trim() ? (
                <p className="m-0 whitespace-pre-line font-sans text-[16px] leading-[26px] text-[#1c2a21]">
                  {item.content}
                </p>
              ) : null}
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="w-fit font-sans text-[14px] font-semibold text-[#387440]"
                >
                  Open the link ↗
                </a>
              ) : null}
              {item.url ? (
                <Link
                  to={item.url}
                  className="w-fit rounded-[10px] border-2 border-solid border-[#387440] px-[14px] py-[6px] font-sans text-[14px] font-semibold text-[#387440]"
                >
                  Join the conversation in {item.community?.name}
                </Link>
              ) : null}
            </article>
            {item.related?.length ? (
              <section className="flex flex-col gap-[10px]">
                <h2 className="m-0 font-sans text-[16px] font-semibold text-[#1c2a21]">
                  More about this career
                </h2>
                <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
                  {item.related.map((r) => (
                    <li key={r.id}>
                      <Link
                        to={`/career-content/${encodeURIComponent(r.id)}`}
                        className="flex flex-col gap-[2px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[10px] no-underline"
                      >
                        <span className="font-sans text-[12px] text-[#737373]">
                          {TYPE_TAG[r.type] || 'Article'}
                          {r.community?.name ? ` · ${r.community.name}` : ''}
                        </span>
                        <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">
                          {r.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}
      </main>
    </CommunityFrame>
  );
};

export default CareerContentPage;
