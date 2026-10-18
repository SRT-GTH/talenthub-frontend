import { useCallback, useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ShareBoxesIcon,
  ShareBriefcaseOutlineIcon,
  ShareBriefcaseSmallIcon,
  ShareCheckSmallIcon,
  ShareChevronRightIcon,
  ShareCopyIcon,
  ShareDownloadIcon,
  ShareMessageOutlineIcon,
  ShareMobileIcon,
  ShareShieldIcon,
  ShareSpinnerIcon,
  ShareStreakFlameIcon,
} from '../../shared/assets.jsx';
import {
  ShareCheck,
  ShareDialog,
  ShareFieldLabel,
  ShareHead,
  ShareToast,
} from './ShareProfileParts.jsx';
import { FOCUS_RING } from './ShareProfileUi.js';
import { ShareCardStage } from './ShareProfileCardArt.jsx';
import { copyText, downloadCardPng } from './ShareProfileFile.js';
import {
  CARD_PRESETS,
  CARD_STYLE_TOKENS,
  SHARE_CARD,
  presetStateFor,
} from './talentProfileShareData.js';

const log = debug('ShareProfileCard');

const MAKING_MS = 2000;
/* Figma SH-03d draws the bar at 118 of 180 px. */
const MAKING_STATIC = 118 / 180;

const SEG_ICON = { story: ShareMobileIcon, post: ShareBoxesIcon, banner: ShareBriefcaseSmallIcon };
/* Which icons are filled vs stroked decides how the active (white) / inactive (grey) colour is applied. */
const SEG_ICON_ACTIVE = {
  story: '',
  post: '[&_path]:fill-white',
  banner: '[&_path]:stroke-white',
};
const SEG_ICON_INACTIVE = {
  story: '[&_path]:fill-[#595959]',
  post: '',
  banner: '',
};

/* SH-03 / 03b / 03c / 03d / 03e — Make a share card (+ making + saved). */
const ShareProfileCard = ({ profile }) => {
  const share = profile.share;
  const preset = CARD_PRESETS[share] ?? CARD_PRESETS.card;
  const [style, setStyle] = useState(preset.style);
  const [size, setSize] = useState(preset.size);
  const [show, setShow] = useState(() =>
    Object.fromEntries(SHARE_CARD.show.map((item) => [item.id, item.on]))
  );
  const [caption, setCaption] = useState(SHARE_CARD.caption);
  const [progress, setProgress] = useState(MAKING_STATIC);
  const [xpOpen, setXpOpen] = useState(share === 'card-saved');
  const run = useRef(false);
  const synced = useRef(share);

  const phase = share === 'card-making' ? 'making' : share === 'card-saved' ? 'saved' : 'edit';

  const back = useCallback(() => profile.update({ share: 'open' }), [profile]);
  const close = useCallback(() => profile.update({ share: null }), [profile]);

  useEffect(() => {
    log('mount', { share, style, size, phase });
  }, [share, style, size, phase]);

  // A different frame was opened from outside (URL changed): adopt that frame's style + size.
  useEffect(() => {
    if (share !== synced.current) {
      synced.current = share;
      if (share === 'card' || share === 'card-midnight' || share === 'card-sunshine') {
        setStyle(CARD_PRESETS[share].style);
        setSize(CARD_PRESETS[share].size);
      }
    }
  }, [share]);

  useEffect(() => {
    setXpOpen(phase === 'saved');
  }, [phase]);

  // Making: a user-started run animates 0 → 100% then moves on to "saved"; a direct frame URL holds at 118/180.
  useEffect(() => {
    if (phase !== 'making') return undefined;
    if (!run.current) {
      setProgress(MAKING_STATIC);
      return undefined;
    }
    setProgress(0);
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / MAKING_MS);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        log('branch: card made');
        run.current = false;
        synced.current = 'card-saved';
        profile.update({ share: 'card-saved' });
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, profile]);

  const pick = (nextStyle, nextSize) => {
    const frame = presetStateFor(nextStyle, nextSize) ?? 'card';
    log('pick', { nextStyle, nextSize, frame });
    setStyle(nextStyle);
    setSize(nextSize);
    synced.current = frame;
    if (frame !== share) profile.update({ share: frame });
  };

  const fileName = `kofi-agyekum-${size}.png`;
  const cardShow = {
    skills: show.skills,
    open: show.open,
    qr: show.qr,
    headline: show.headline,
  };

  const startMaking = () => {
    log('click make card', { style, size });
    run.current = true;
    synced.current = 'card-making';
    profile.update({ share: 'card-making' });
  };

  const download = () => {
    log('click download png', { style, size });
    downloadCardPng({ style, size, filename: fileName });
  };

  const making = phase === 'making';
  const saved = phase === 'saved';

  const overlay = making ? (
    <div
      aria-hidden="true"
      className="absolute top-[36.8%] left-1/2 flex w-[240px] -translate-x-1/2 flex-col items-center gap-[10px] overflow-hidden rounded-[16px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[18px] shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)]"
    >
      <span className="flex size-[40px] shrink-0 items-center justify-center">
        <ShareSpinnerIcon className="h-[39px] w-[40px] motion-safe:animate-spin" />
      </span>
      <span className="text-[15px] font-semibold whitespace-nowrap text-[#1c2a21]">
        {SHARE_CARD.making.title}
      </span>
      <span className="text-[12px] whitespace-nowrap text-[#737373]">{SHARE_CARD.making.meta}</span>
      <span className="h-[6px] w-[180px] max-w-full overflow-hidden rounded-full bg-brand-green-light-hover">
        <span
          className="block h-full rounded-full bg-brand-green"
          style={{ width: `${Math.round(progress * 1000) / 10}%` }}
        />
      </span>
    </div>
  ) : null;

  const actionRows = [
    {
      ...SHARE_CARD.saved.actions[0],
      icon: <ShareMessageOutlineIcon className="size-[20px]" />,
      onClick: () => profile.update({ share: 'whatsapp' }),
    },
    {
      ...SHARE_CARD.saved.actions[1],
      icon: <ShareBriefcaseOutlineIcon className="size-[20px]" />,
      onClick: () => {
        try {
          window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer');
        } catch (err) {
          log.error('open linkedin failed', err);
        }
      },
    },
    {
      ...SHARE_CARD.saved.actions[2],
      icon: <ShareCopyIcon className="size-[20px]" />,
      onClick: () => copyText(caption),
    },
    {
      ...SHARE_CARD.saved.actions[3],
      icon: <ShareDownloadIcon className="size-[20px]" />,
      onClick: download,
    },
  ];

  return (
    <ShareDialog
      onClose={close}
      titleId="share-card-title"
      maxWidth={1060}
      busy={making}
      liveMessage={making ? SHARE_CARD.liveNote : saved ? SHARE_CARD.saved.title : undefined}
      toast={
        saved && xpOpen ? (
          <ShareToast
            onDismiss={() => setXpOpen(false)}
            className="gap-[10px] rounded-[14px] py-[12px] pr-[16px] pl-[14px]"
          >
            <ShareStreakFlameIcon className="size-[18px] shrink-0" />
            <span className="text-[13px] leading-[normal] font-semibold whitespace-nowrap">
              {SHARE_CARD.saved.xp}
            </span>
          </ShareToast>
        ) : null
      }
    >
      <ShareHead
        titleId="share-card-title"
        title={SHARE_CARD.title}
        subtitle={SHARE_CARD.subtitle}
        onBack={back}
        onClose={close}
        gap={12}
      />

      <div className="flex w-full flex-col gap-[clamp(16px,1.62vw,28px)] lg:flex-row lg:items-start">
        <ShareCardStage
          style={style}
          size={size}
          show={cardShow}
          faded={making}
          overlay={overlay}
        />

        {saved ? (
          <div className="flex min-w-0 flex-1 flex-col gap-[20px]">
            <div className="flex flex-col gap-[14px] overflow-hidden rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-brand-green-light p-[clamp(16px,1.39vw,24px)] shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)]">
              <div className="flex items-center gap-[12px]">
                <span className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-brand-green">
                  <ShareCheckSmallIcon className="size-[22px]" />
                </span>
                <h3 className="m-0 text-[clamp(22px,1.56vw,27px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading">
                  {SHARE_CARD.saved.title}
                </h3>
              </div>
              <p className="m-0 text-[14px] leading-[1.5] text-brand-green-active">
                {SHARE_CARD.saved.body}
              </p>
            </div>
            <p className="m-0 text-[14px] font-medium text-[#1c2a21]">{SHARE_CARD.saved.nowPost}</p>
            <div className="flex w-full flex-col gap-[12px]">
              {actionRows.map(({ id, title, body, icon, onClick }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    log('saved action', { id });
                    onClick();
                  }}
                  className={classNames(
                    'flex w-full cursor-pointer items-center gap-[14px] rounded-[14px] border border-solid border-[#e6e6e6] bg-white p-[14px] text-left leading-[normal]',
                    FOCUS_RING
                  )}
                >
                  <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#f8f8f4]">
                    {icon}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                    <span className="text-[15px] font-semibold text-[#1c2a21]">{title}</span>
                    <span className="text-[12px] text-[#737373]">{body}</span>
                  </span>
                  <ShareChevronRightIcon className="size-[18px] shrink-0" />
                </button>
              ))}
            </div>
            <div className="flex min-h-[63px] w-full items-center justify-end gap-[10px]">
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => {
                  log('click make another');
                  profile.update({ share: 'card' });
                }}
              >
                {SHARE_CARD.saved.makeAnother}
              </Button>
              <Button variant="primary" size="sm" onClick={close}>
                {SHARE_CARD.saved.done}
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={classNames(
              'flex min-w-0 flex-1 flex-col gap-[20px]',
              making && 'pointer-events-none opacity-50'
            )}
            aria-disabled={making || undefined}
            inert={making || undefined}
          >
            {/* Style */}
            <div className="flex w-full flex-col gap-[10px]">
              <p id="share-style-label" className="m-0 text-[14px] font-medium text-[#1c2a21]">
                {SHARE_CARD.styleLabel}
              </p>
              <div
                role="radiogroup"
                aria-labelledby="share-style-label"
                className="flex flex-wrap gap-[12px]"
              >
                {SHARE_CARD.styles.map((item) => {
                  const selected = style === item.id;
                  const tokens = CARD_STYLE_TOKENS[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => pick(item.id, size)}
                      className={classNames(
                        'flex cursor-pointer flex-col items-center gap-[6px] bg-transparent p-0 leading-[normal]',
                        FOCUS_RING
                      )}
                    >
                      <span
                        className={classNames(
                          'relative size-[64px] rounded-[16px] border-solid',
                          selected
                            ? 'border-[1.2px] border-[#1c2a21] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]'
                            : 'border border-[#e6e6e6]'
                        )}
                        style={{ backgroundColor: tokens.bg }}
                      >
                        <span
                          className="absolute right-[8px] bottom-[8px] size-[18px] rounded-full"
                          style={{ backgroundColor: tokens.dot }}
                        />
                      </span>
                      <span
                        className={classNames(
                          'text-[12px]',
                          selected ? 'font-semibold text-[#1c2a21]' : 'font-medium text-[#595959]'
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size */}
            <div className="flex w-full flex-col gap-[10px]">
              <p id="share-size-label" className="m-0 text-[14px] font-medium text-[#1c2a21]">
                {SHARE_CARD.sizeLabel}
              </p>
              <div
                role="radiogroup"
                aria-labelledby="share-size-label"
                className="flex w-fit max-w-full flex-wrap gap-[2px] rounded-[12px] border border-solid border-[#e6e6e6] bg-[#f8f8f4] p-[3px]"
              >
                {SHARE_CARD.sizes.map((item) => {
                  const selected = size === item.id;
                  const Icon = SEG_ICON[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => pick(style, item.id)}
                      className={classNames(
                        'flex cursor-pointer items-center gap-[6px] rounded-[9px] border-0 px-[14px] py-[9px] text-[13px] leading-[normal] font-semibold whitespace-nowrap',
                        selected ? 'bg-[#1c2a21] text-white' : 'bg-transparent text-[#595959]',
                        FOCUS_RING
                      )}
                    >
                      <Icon
                        className={classNames(
                          'size-[15px] shrink-0',
                          selected ? SEG_ICON_ACTIVE[item.id] : SEG_ICON_INACTIVE[item.id]
                        )}
                      />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Show on card */}
            <div className="flex w-full flex-col gap-[10px]">
              <p className="m-0 text-[14px] font-medium text-[#1c2a21]">{SHARE_CARD.showLabel}</p>
              <div className="grid w-full grid-cols-1 gap-x-[12px] gap-y-[16px] sm:grid-cols-2">
                {SHARE_CARD.show.map((item) => (
                  <ShareCheck
                    key={item.id}
                    checked={show[item.id]}
                    onChange={(next) => {
                      log('show', { id: item.id, next });
                      setShow((prev) => ({ ...prev, [item.id]: next }));
                    }}
                    className="min-w-0"
                  >
                    {item.label}
                  </ShareCheck>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div className="flex w-full flex-col gap-[8px]">
              <ShareFieldLabel htmlFor="share-caption" required hint="*" fixedHint>
                {SHARE_CARD.captionLabel}
              </ShareFieldLabel>
              <textarea
                id="share-caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="h-[112px] w-full resize-none rounded-[10px] border border-solid border-[#ccc] bg-white py-[13px] pr-[16px] pl-[20px] text-[14px] leading-6 font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2.5px_0_rgba(191,191,191,0.8)] outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]"
              />
            </div>

            <div className="flex w-full items-center gap-[10px] rounded-[12px] bg-brand-green-light px-[14px] py-[12px]">
              <ShareShieldIcon className="size-[15px] shrink-0" />
              <p className="m-0 min-w-0 flex-1 text-[13px] font-medium text-brand-green-active">
                {SHARE_CARD.safety}
              </p>
            </div>

            <div className="flex min-h-[69px] w-full flex-wrap items-center justify-end gap-[10px]">
              {making ? (
                <>
                  <Button variant="primary" size="sm" disabled>
                    {SHARE_CARD.preparing}
                  </Button>
                  <Button variant="primary" size="sm">
                    {SHARE_CARD.primary[size]}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="tertiary" size="sm" onClick={download}>
                    {SHARE_CARD.downloadPng}
                  </Button>
                  <Button variant="primary" size="sm" onClick={startMaking}>
                    {SHARE_CARD.primary[size]}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ShareDialog>
  );
};

export default ShareProfileCard;
