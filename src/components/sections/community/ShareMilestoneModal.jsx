import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';
import AchievementPostCard from './AchievementPostCard.jsx';
import {
  COMMUNITIES,
  SHARE_MILESTONE_COPY,
  buildShareMilestoneCopy,
  buildAchievementBannerText,
} from './communityData.js';

const log = debug('ShareMilestoneModal');

/*
 * ShareMilestoneModal — Figma frame 7025:89274, modal card 7025:89865.
 *
 * "Milestone unlocked!" — shown from CAREER BUDDY right after a talent
 * confirms a profile stage, NOT from a community post's own Share button.
 * Corrected 2026-09-17: an earlier pass wired this to PostCard's ordinary
 * Share action instead (any post → "Milestone unlocked!"), which made no
 * sense for a random post someone else wrote. Figma's real context
 * (7025:89274) is the Career Buddy chat mid-Personality-Assessment, with
 * this card floating over the page and a live post PREVIEW (7025:89895,
 * `AchievementPostCard`) stacked underneath it — both rendered here as one
 * bespoke overlay instead of the generic `Modal.jsx` primitive, since
 * `Modal` only centers a single content box and has no notion of a second
 * element stacked below it.
 *
 * Card width corrected 2026-09-17 too: previously `!max-w-[712px]`
 * (guessed), but 7025:89865's own frame is 600px wide.
 *
 * Gap between the card and the PREVIEW stack (24px card→label, 12px
 * label→card) is `⚠️ ASSUMPTION` — estimated from the 7025:89274 screenshot
 * proportions rather than a separately-dived wrapper node, but both values
 * are otherwise-established spacing tokens in this design system.
 *
 * Audience chips (7025:89879) are the same pill component; the middle chip
 * "Select Community" additionally carries a caret (7025:89885) because it
 * opens a community picker — the picker itself is NOT drawn in Figma, so
 * this renders a native <select> populated from the real COMMUNITIES
 * dataset rather than inventing a bespoke dropdown UI. `⚠️ ASSUMPTION` on
 * the picker's appearance only.
 */

const SUBMIT_LABEL_GRADIENT = 'linear-gradient(188.38deg, #fef1e7 0%, #e8f2ed 20.192%)';
const CHIP_LABEL_GRADIENT = 'linear-gradient(193.15deg, #fef1e7 0%, #e8f2ed 20.192%)';

const ShareMilestoneModal = ({
  isOpen,
  onClose,
  onShare,
  onDecline,
  stageLabel,
  authorName = 'Emma',
  authorInitials = 'EM',
}) => {
  const copy = stageLabel ? buildShareMilestoneCopy(stageLabel) : SHARE_MILESTONE_COPY;
  const bannerText = stageLabel
    ? buildAchievementBannerText(authorName, stageLabel)
    : buildAchievementBannerText(authorName, 'Personality Assessment');

  const [audience, setAudience] = useState(copy.audiences[0]);
  const [community, setCommunity] = useState(COMMUNITIES[0].id);
  const [message, setMessage] = useState(copy.message);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    log('mount', { stageLabel, defaultAudience: copy.audiences[0] });
    setAudience(copy.audiences[0]);
    setCommunity(COMMUNITIES[0].id);
    setMessage(copy.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, stageLabel]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus?.();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) onClose?.();
  };

  const handleShare = () => {
    const payload = {
      stageLabel: stageLabel ?? 'Personality Assessment',
      audience,
      community: audience === 'Select Community' ? community : null,
      messageLength: message.trim().length,
    };
    log('milestone shared:', payload);
    onShare?.(payload);
    onClose?.();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      onMouseDown={handleOverlayMouseDown}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 px-[clamp(12px,2vw,32px)] py-[clamp(16px,3vw,40px)] backdrop-blur-[2px]"
    >
      <div className="flex w-full max-w-[600px] flex-col items-center gap-[24px]">
        <div className="relative flex w-full flex-col items-start gap-[24px] rounded-[24px] bg-white px-[32px] py-[28px] shadow-[0px_40px_100px_0px_rgba(0,0,0,0.25),0px_4px_0px_0px_rgba(0,0,0,0.13)]">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-[14px] top-[11px] inline-flex size-[28px] items-center justify-center rounded-[20px] bg-brand-green-light transition-colors hover:bg-brand-green-light-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <CommunityIcon src={icons.modalClose} size={16} />
          </button>

          <span className="flex size-[56px] items-center justify-center overflow-hidden rounded-full bg-brand-green-light">
            <CommunityIcon src={icons.diamondTrophy} size={26} />
          </span>

          <div className="flex flex-col items-start gap-[4px]">
            <h2 className="font-display text-[32px] text-black">{copy.title}</h2>
            <p className="font-sans text-[14px] text-[#595959]">{copy.subtitle}</p>
          </div>

          <div className="flex w-full flex-col items-start gap-[14px]">
            <label className="flex w-full items-start gap-[8px] overflow-hidden rounded-[10px] border border-[#ccc] bg-[#f8f8f8] px-[16px] py-[13px] shadow-[0px_2.5px_0px_0px_rgba(191,191,191,0.8)] focus-within:border-brand-green-light-active">
              <span className="sr-only">{copy.title}</span>
              <textarea
                rows={2}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="w-full resize-none bg-transparent font-sans text-[14px] leading-5 tracking-[0.2px] text-[#595959] outline-none"
              />
            </label>

            <div className="flex flex-col items-start gap-[8px]">
              <span className="whitespace-nowrap font-sans text-[12px] font-medium text-black">
                {copy.shareWithLabel}
              </span>
              <div
                role="radiogroup"
                aria-label={copy.shareWithLabel}
                className="flex flex-wrap items-center gap-[10px]"
              >
                {copy.audiences.map((item) => {
                  const active = item === audience;
                  const isPicker = item === 'Select Community';
                  return (
                    <button
                      key={item}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        log('share audience selected:', item);
                        setAudience(item);
                      }}
                      className={classNames(
                        'flex flex-col items-center justify-center rounded-[100px] border border-brand-green-light-hover py-[6px] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.06)] transition-colors',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                        isPicker ? 'pl-[12px] pr-[27px]' : 'px-[12px]',
                        active ? 'bg-brand-green' : 'bg-white hover:bg-brand-green-light'
                      )}
                    >
                      <span className="relative flex items-center justify-center gap-[6px]">
                        <span
                          className={classNames(
                            'whitespace-nowrap font-sans text-[12.5px] font-medium leading-5 tracking-[0.2px]',
                            active ? 'bg-clip-text text-transparent' : 'text-[#737373]'
                          )}
                          style={active ? { backgroundImage: CHIP_LABEL_GRADIENT } : undefined}
                        >
                          {item}
                        </span>
                        {isPicker && (
                          <CommunityIcon
                            src={icons.selectCaret}
                            size={7}
                            className="!h-[5px] absolute -right-[15px] top-[7px]"
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Community picker — only meaningful for the "Select Community"
                audience. Figma draws the caret but never the open picker. */}
            {audience === 'Select Community' && (
              <label className="flex w-full items-center overflow-hidden rounded-[10px] border border-[#ccc] bg-white px-[16px] py-[10px] shadow-[0px_2.5px_0px_0px_rgba(191,191,191,0.8)] focus-within:border-brand-green-light-active">
                <span className="sr-only">Select Community</span>
                <select
                  value={community}
                  onChange={(event) => {
                    log('share target community:', event.target.value);
                    setCommunity(event.target.value);
                  }}
                  className="w-full bg-transparent font-sans text-[14px] text-black outline-none"
                >
                  {COMMUNITIES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name.trim()}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="flex w-full items-center justify-between bg-white">
              <button
                type="button"
                onClick={() => {
                  log('milestone share declined — keeping private');
                  onDecline?.();
                  onClose?.();
                }}
                className="whitespace-nowrap font-sans text-[13px] font-medium text-[#737373] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                {copy.declineLabel}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-[8px] rounded-[10px] border-b-2 border-l-2 border-r-2 border-t border-brand-green-dark bg-brand-green px-[18px] py-[10px] drop-shadow-[0px_4px_0px_#224626] transition-transform active:translate-y-[2px] active:drop-shadow-[0px_2px_0px_#224626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                <span
                  className="whitespace-nowrap bg-clip-text font-sans text-[14px] font-bold leading-6 tracking-[0.1px] text-transparent"
                  style={{ backgroundImage: SUBMIT_LABEL_GRADIENT }}
                >
                  {copy.submitLabel}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-[12px]">
          <span className="whitespace-nowrap font-sans text-[13px] font-medium uppercase tracking-[1px] text-white/70">
            Preview
          </span>
          <AchievementPostCard
            authorName={authorName}
            authorInitials={authorInitials}
            timestamp="Just now"
            message={message}
            bannerText={bannerText}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ShareMilestoneModal;
