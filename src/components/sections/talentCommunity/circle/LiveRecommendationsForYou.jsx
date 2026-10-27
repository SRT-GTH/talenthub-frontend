import { useCallback, useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { classNames } from '../../../../utils/classNames.js';
import { circleApi, circleErrorText } from '../../../../services/circle.api.js';
import CircleAvatar from './CircleAvatar.jsx';
import CircleButton from './CircleButton.jsx';
import { CARD, HEADING } from './circleStyles.js';

const log = debug('LiveRecommendationsForYou');

const STATUS_TEXT = {
  pending_recipient: 'Waiting for you',
  shown: 'Shown on your profile',
  hidden: 'Kept hidden',
};

/*
 * LiveRecommendationsForYou — the recommendations other talents wrote for the signed-in talent (US-5.3.1-05), on the
 * Invitations tab. GET /circle/recommendations; each one is hidden until the talent picks "Show on my profile"
 * (POST /circle/recommendations/:id/respond { decision }). "Keep hidden" is never shown to the author.
 * Renders nothing while loading, on error, or when there are none. Props: show({ text }) for toasts.
 */
const LiveRecommendationsForYou = ({ show }) => {
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    try {
      const out = await circleApi.myRecommendations();
      setItems(out?.items ?? []);
    } catch (err) {
      log.error('load failed', err?.response?.status);
      setItems([]);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  if (!items || items.length === 0) return null;

  const respond = async (rec, decision) => {
    setBusy(rec.id);
    try {
      await circleApi.respondRecommendation(rec.id, decision);
      show?.({
        text:
          decision === 'show'
            ? `${rec.author.name}’s recommendation is on your profile`
            : 'Kept hidden. They won’t be told.',
      });
      await load();
    } catch (err) {
      show?.({ text: circleErrorText(err) });
    } finally {
      setBusy(null);
    }
  };

  const pending = items.filter((r) => r.status === 'pending_recipient').length;
  return (
    <section
      aria-labelledby="circle-recs-for-you"
      className={classNames(CARD, 'flex flex-col gap-[14px] px-[22px] py-[20px] max-sm:px-[16px]')}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-[8px]">
        <h2 id="circle-recs-for-you" className={classNames(HEADING, 'text-[20px] leading-[24px]')}>
          Recommendations for you
        </h2>
        {pending > 0 && (
          <span className="font-sans text-[13px] leading-[16px] text-[#737373]">
            {pending} waiting for you
          </span>
        )}
      </div>
      {items.map((rec) => (
        <article
          key={rec.id}
          className="flex gap-[12px] border-t border-solid border-[#e7e7e7] pt-[14px]"
        >
          <CircleAvatar
            id={rec.author.id ?? `anon-${rec.id}`}
            size={44}
            photo={rec.author.photo}
            name={rec.author.name}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
            <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
              {rec.author.name}
            </span>
            <span className="font-sans text-[12px] leading-[14px] text-[#737373]">
              {[rec.relationshipLine, STATUS_TEXT[rec.status]].filter(Boolean).join(' · ')}
            </span>
            <p className="m-0 font-sans text-[14px] leading-[21px] text-[#1c2a21]">{rec.text}</p>
            <div className="flex flex-wrap gap-[8px]">
              {rec.status !== 'shown' && (
                <CircleButton disabled={busy === rec.id} onClick={() => respond(rec, 'show')}>
                  Show on my profile
                </CircleButton>
              )}
              {rec.status !== 'hidden' && (
                <CircleButton
                  tone="soft"
                  disabled={busy === rec.id}
                  onClick={() => respond(rec, 'hide')}
                >
                  {rec.status === 'shown' ? 'Hide from my profile' : 'Keep hidden'}
                </CircleButton>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

export default LiveRecommendationsForYou;
