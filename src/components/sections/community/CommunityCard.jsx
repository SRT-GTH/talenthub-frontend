import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';

const log = debug('CommunityCard');

/*
 * CommunityCard — one tile in the community index grid.
 * Source: Figma component `Component 28` inside 7025:85246 (Joined) and
 * 7025:85247 (Join) — both states extracted, neither invented.
 *
 *   card    → 282px, white, 1.036px #e5e5e5 border, r20, 0 1px 2px rgba(0,0,0,.11)
 *   cover   → 110px tall, r12, object-cover
 *   Join    → #387440 fill, #2a5730 shelf border (1px top / 2px sides+bottom),
 *             4px #224626 drop-shadow, cream-gradient label
 *   Joined  → white fill, rgba(17,17,17,.3) shelf border, 4px rgba(17,17,17,.25)
 *             drop-shadow, #111 label, people-checkmark glyph
 *
 * The whole card navigates to the community; the Join/Joined button is a
 * separate control and stops propagation so joining doesn't also navigate.
 *
 * Once joined, clicking the "Joined" button reveals a floating "Leave"
 * popup underneath it (7025:85557): #fef6f5 fill, 1px rgba(192,57,43,.2)
 * border, r12, drop-shadow 0 2px 2.8px rgba(56,116,64,.24), positioned
 * `absolute left-0 top-[56px]` off the button. Fixed 98x45 (`⚠️` a first
 * pass used `px16 py14` hug-content padding instead, which the browser's
 * default line-height for 14px text inflated to 54px tall — the real
 * component definition (queried directly by its own node id, 5576:3369,
 * not the card's instance override) gives an explicit fixed 98x45 frame,
 * so this now centers the text in a fixed-height box instead). `top-[56px]`
 * (not Figma's own literal 50px) because Figma's Joined button in that same
 * component measures 39.37px tall (their real gap ≈ 10.6px) while this
 * card's own Joined button renders taller at ~44.75px — 56px keeps that
 * same ~10-11px gap instead of the ~5px it shrinks to if the raw 50px
 * offset is reused verbatim against a taller button. Clicking "Joined"
 * again closes it, and so does clicking anywhere outside it — same
 * outside-click pattern as PostCard.jsx's post-menu dropdown. Actually
 * leaving only happens via the popup's own "Leave" button (a `Button
 * variant="text-danger"`, not a raw `<button>` — see Button.jsx), so
 * clicking "Joined" itself never immediately unjoins; an earlier pass had
 * it toggle join state directly on click and open the popup on hover,
 * corrected here to match both a real Figma dive and follow-up feedback.
 *
 * `overflow-visible` replaces the card's old `overflow-hidden` so the popup
 * isn't clipped at the card edge, and the card gets a conditional `z-20`
 * while the popup is open so it paints over the next grid row instead of
 * being painted under it.
 */

const JOIN_LABEL_GRADIENT = 'linear-gradient(205.52deg, #fef1e7 0%, #e8f2ed 20.192%)';

const CommunityCard = ({ community, onToggleJoin }) => {
  const navigate = useNavigate();
  const { id, name, memberLabel, description, cover, joined } = community;
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const leaveRef = useRef(null);

  // Close the "Leave" popup on any outside click — same pattern as
  // PostCard.jsx's post-menu dropdown.
  useEffect(() => {
    if (!leaveConfirmOpen) return undefined;
    const onDocumentClick = (event) => {
      if (leaveRef.current && !leaveRef.current.contains(event.target)) {
        log('branch: outside click → closing leave popup for', id);
        setLeaveConfirmOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, [leaveConfirmOpen, id]);

  // Not joined yet has no confirm step; already joined resets it too, so a
  // stale open popup never survives a join/leave round trip.
  useEffect(() => {
    setLeaveConfirmOpen(false);
  }, [joined]);

  const handleOpen = () => {
    log('open community:', id);
    navigate(`/community/${id}`);
  };

  const handleJoinClick = (event) => {
    event.stopPropagation();
    if (joined) {
      log('branch: joined button clicked → toggling leave popup for', id);
      setLeaveConfirmOpen((open) => !open);
      return;
    }
    log('toggle join: not joined → joined', id);
    onToggleJoin?.(id);
  };

  const handleConfirmLeave = (event) => {
    event.stopPropagation();
    log('toggle join: joined → not joined', id);
    setLeaveConfirmOpen(false);
    onToggleJoin?.(id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleOpen();
        }
      }}
      aria-label={`${name.trim()}, ${memberLabel.trim()}`}
      className={classNames(
        'relative flex w-full cursor-pointer flex-col items-start justify-end gap-[10px] rounded-[20px] border-[1.036px] border-[#e5e5e5] bg-white p-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.11)] transition-shadow hover:shadow-bottom-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
        leaveConfirmOpen && 'z-20'
      )}
    >
      <div className="h-[110px] w-full overflow-hidden rounded-[12px]">
        <img src={cover} alt="" draggable="false" className="size-full select-none object-cover" />
      </div>

      <div className="flex w-full flex-col items-start py-[8px]">
        <div className="flex w-full flex-col items-end gap-[4px]">
          <div className="flex w-full flex-col items-start gap-[7px] [word-break:break-word]">
            <div className="flex w-full flex-col items-start gap-[4px]">
              <p className="font-sans text-[16.58px] font-semibold text-black">{name}</p>
              <p className="font-sans text-[13.47px] text-[#999]">{memberLabel}</p>
            </div>
            <p className="h-[41px] w-full max-w-[280px] font-sans text-[14.5px] leading-[20.5px] text-[#595959]">
              {description}
            </p>
          </div>

          <div ref={leaveRef} className="relative shrink-0">
            <button
              type="button"
              onClick={handleJoinClick}
              aria-pressed={joined}
              aria-expanded={joined ? leaveConfirmOpen : undefined}
              className={classNames(
                'flex shrink-0 items-center justify-center gap-[6px] rounded-[10px] border-b-2 border-l-2 border-r-2 border-t px-[16px] py-[10px] transition-transform active:translate-y-[2px]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                joined
                  ? 'border-[rgba(17,17,17,0.3)] bg-white drop-shadow-[0px_4px_0px_rgba(17,17,17,0.25)] active:drop-shadow-[0px_2px_0px_rgba(17,17,17,0.25)]'
                  : 'border-brand-green-dark bg-brand-green drop-shadow-[0px_4px_0px_#224626] active:drop-shadow-[0px_2px_0px_#224626]'
              )}
            >
              <CommunityIcon src={joined ? icons.joinedCard : icons.joinCard} size={18} />
              {joined ? (
                <span className="whitespace-nowrap font-sans text-[14.5px] font-medium tracking-[0.1px] text-black">
                  Joined
                </span>
              ) : (
                <span
                  className="whitespace-nowrap bg-clip-text font-sans text-[14.5px] font-medium tracking-[0.1px] text-transparent"
                  style={{ backgroundImage: JOIN_LABEL_GRADIENT }}
                >
                  Join
                </span>
              )}
            </button>
            {/* Click-to-open popup (7025:85557) — stays open until "Joined"
                is clicked again or a click lands outside it (see the
                outside-click effect above), not a hover reveal. */}
            {joined && leaveConfirmOpen && (
              <div
                // stopPropagation here too, not just on the Button below —
                // the box is 98x45 but "Leave" itself is a much smaller
                // hit area, so without this, a click on the popup's own
                // padding (not precisely on the button) bubbled up to the
                // card's onClick and navigated away instead of just
                // interacting with the popup.
                onClick={(event) => event.stopPropagation()}
                className="absolute left-0 top-[56px] z-20 flex h-[45px] w-[98px] items-center justify-center rounded-[12px] border border-[rgba(192,57,43,0.2)] bg-[#fef6f5] px-[16px] shadow-[0px_2px_2.8px_rgba(56,116,64,0.24)]"
              >
                <Button variant="text-danger" onClick={handleConfirmLeave}>
                  Leave
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
