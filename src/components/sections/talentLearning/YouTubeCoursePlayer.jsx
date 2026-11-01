import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import { createStretchTracker } from '../../../utils/watchStretches.js';
import { sendWatchProgress } from '../../../services/learningPath.api.js';
import { CARD_SOFT, FOCUS, HEAD } from './CourseUi.jsx';

const log = debug('YouTubeCoursePlayer');

/*
 * YouTubeCoursePlayer — a curated YouTube playlist played on GTH's own page (learning path iteration 4,
 * design note C3/C4).
 *   - Privacy-enhanced player (youtube-nocookie.com).
 *   - Watched stretches are sent every 20 s and on pause / end / leaving the page, only for videos
 *     the backend marks `track` (not Made for Kids, and tracking allowed for this talent).
 *   - The course completes on the server at 90% of the playlist watched.
 */
const FLUSH_MS = 20000;
let apiPromise = null;

const loadYouTubeApi = () => {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev();
      resolve(window.YT);
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    s.onerror = () => {
      apiPromise = null;
      reject(new Error('YouTube player failed to load'));
    };
    document.head.appendChild(s);
  });
  return apiPromise;
};

const mins = (sec) => {
  const m = Math.round((Number(sec) || 0) / 60);
  return m < 1 ? '<1 min' : `${m} min`;
};

const YouTubeCoursePlayer = ({ courseId, player, onProgress }) => {
  const videos = player?.videos || [];
  const [index, setIndex] = useState(() => {
    const firstOpen = videos.findIndex((v) => (v.percent || 0) < 0.9);
    return firstOpen >= 0 ? firstOpen : 0;
  });
  const [percents, setPercents] = useState(() =>
    Object.fromEntries(videos.map((v) => [v.videoId, v.percent || 0]))
  );
  const [failed, setFailed] = useState(false);
  const holder = useRef(null);
  const yt = useRef(null);
  const tracker = useRef(createStretchTracker());
  const poll = useRef(null);
  const video = videos[index] || null;

  const flush = useCallback(
    async (reason) => {
      if (!video || !video.track) return;
      const segments = tracker.current.take();
      if (!segments.length) return;
      try {
        const r = await sendWatchProgress(courseId, video.videoId, segments);
        log('flush', { reason, video: video.videoId, sent: segments.length, pct: r?.videoPercent });
        setPercents((p) => ({ ...p, [video.videoId]: r?.videoPercent ?? p[video.videoId] }));
        if (onProgress) onProgress(r);
      } catch (err) {
        log.error('watch flush failed:', err?.response?.status || err?.message);
      }
    },
    [courseId, video, onProgress]
  );

  // Create / swap the player when the video changes.
  useEffect(() => {
    if (!video) return undefined;
    let cancelled = false;
    tracker.current = createStretchTracker();
    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !holder.current) return;
        if (yt.current) {
          yt.current.loadVideoById({
            videoId: video.videoId,
            startSeconds: video.lastPosition || 0,
          });
          return;
        }
        yt.current = new YT.Player(holder.current, {
          host: player.host || 'https://www.youtube-nocookie.com',
          videoId: video.videoId,
          playerVars: {
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            start: Math.floor(video.lastPosition || 0),
          },
          events: {
            onStateChange: (e) => {
              const playing = e.data === YT.PlayerState.PLAYING;
              clearInterval(poll.current);
              if (playing) {
                poll.current = setInterval(() => {
                  const t =
                    yt.current && yt.current.getCurrentTime ? yt.current.getCurrentTime() : NaN;
                  tracker.current.tick(t);
                }, 1000);
              } else {
                tracker.current.close();
                if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED)
                  flush('state');
              }
            },
          },
        });
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.videoId]);

  // Regular flushes, and one when the page is hidden or left.
  useEffect(() => {
    const timer = setInterval(() => flush('interval'), FLUSH_MS);
    const onHide = () => {
      tracker.current.close();
      flush('pagehide');
    };
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      clearInterval(timer);
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onHide);
      tracker.current.close();
      flush('unmount');
    };
  }, [flush]);

  useEffect(
    () => () => {
      clearInterval(poll.current);
      if (yt.current && yt.current.destroy) yt.current.destroy();
      yt.current = null;
    },
    []
  );

  if (!videos.length) return null;
  const tracked = videos.some((v) => v.track);

  return (
    <section
      className={classNames(
        'flex flex-col gap-[12px] rounded-[22px] p-[clamp(14px,1.27vw,22px)]',
        CARD_SOFT
      )}
    >
      <div className="flex items-center gap-[8px]">
        <h2
          className={classNames(
            HEAD,
            'min-w-0 flex-1 text-[clamp(18px,1.27vw,22px)] leading-[1.25] text-[#1c2a21]'
          )}
        >
          Watch here
        </h2>
        <span className="shrink-0 text-[13.5px] font-semibold text-[#2d5d33]">
          {videos.length} video{videos.length === 1 ? '' : 's'}
        </span>
      </div>
      {failed ? (
        <p className="m-0 text-[14px] text-[#595959]">
          The player didn’t load. Check your connection, or open the playlist on YouTube.
        </p>
      ) : (
        <div
          className="relative w-full overflow-hidden rounded-[16px] bg-black"
          style={{ aspectRatio: '16 / 9' }}
        >
          <div ref={holder} className="absolute inset-0 size-full" data-testid="yt-player" />
        </div>
      )}
      <p className="m-0 text-[12.5px] leading-[1.4] text-[#737373]">
        {tracked
          ? 'Privacy-enhanced player. GTH notes how much you’ve watched; skipping ahead doesn’t count.'
          : 'Privacy-enhanced player. Progress isn’t tracked for these videos — say when you’ve finished.'}
      </p>
      <ol className="flex max-h-[320px] flex-col gap-[2px] overflow-y-auto">
        {videos.map((v, i) => {
          const pct = Math.round((percents[v.videoId] || 0) * 100);
          return (
            <li key={v.videoId}>
              <button
                type="button"
                onClick={() => {
                  tracker.current.close();
                  flush('switch');
                  setIndex(i);
                }}
                aria-current={i === index ? 'true' : undefined}
                className={classNames(
                  'flex w-full cursor-pointer items-center gap-[10px] rounded-[12px] px-[10px] py-[8px] text-left',
                  i === index ? 'bg-[#ebf1ec]' : 'hover:bg-[#f8f8f4]',
                  FOCUS
                )}
              >
                <span className="w-[26px] shrink-0 text-[13px] font-bold text-[#2d5d33]">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-[14px] text-[#1c2a21]">
                  {v.title || `Video ${i + 1}`}
                </span>
                <span className="shrink-0 text-[12.5px] text-[#737373]">
                  {v.track
                    ? pct >= 90
                      ? 'Watched'
                      : pct > 0
                        ? `${pct}%`
                        : mins(v.durationSec)
                    : mins(v.durationSec)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default YouTubeCoursePlayer;
