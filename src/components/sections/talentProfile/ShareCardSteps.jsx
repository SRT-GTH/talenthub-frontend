import { useEffect, useRef } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { TextInput, Textarea } from '../../ui/form/index.js';
import {
  ShareAlertDiamondIcon,
  ShareCardCheckCircleIcon,
  ShareCardCheckWhiteIcon,
  ShareCardDownloadIcon,
  ShareCardEditIcon,
  ShareCardFolderIcon,
  ShareCardHourglassIcon,
  ShareCardInfoIcon,
  ShareCardLockIcon,
  ShareCardRefreshIcon,
  ShareCardShieldIcon,
  ShareCardStarIcon,
  ShareCardWifiOffIcon,
  ShareChevronRightIcon,
  ShareCopyIcon,
  ShareDownloadIcon,
  ShareLinkedInBriefcaseIcon,
  ShareStatusCameraIcon,
  ShareWhatsAppBubbleIcon,
} from '../../shared/assets.jsx';
import ShareCardArt, { FitArt } from './ShareCardArt.jsx';
import {
  CardButton,
  CardFooter,
  PreviewStage,
  ShowGroup,
  SizeGroup,
  StyleGroup,
} from './ShareCardParts.jsx';
import {
  BUDDY_SUGGESTIONS,
  CARD_LOOKS,
  CARD_PROFILE,
  CARD_SIZES,
  HEADLINE_MAX,
  MAKING_STEPS,
  SHARE_TARGETS,
} from './talentProfileCardData.js';

const log = debug('ShareCardSteps');

const NOTE = 'flex items-center gap-[6px]';

/* ====================== SC-01 · Pick a look ====================== */
const LookTile = ({ look, selected, onSelect }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={() => onSelect(look.id)}
    className={classNames(
      'relative flex cursor-pointer flex-col items-center gap-[10px] rounded-[16px] border px-[clamp(8px,1.33vw,23px)] pt-[13px] pb-[13px] text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      selected
        ? 'border-[1.5px] border-[#9fbfa3] bg-[#e9efea] playful:shadow-[3px_3px_0_rgba(28,42,33,0.55)]'
        : 'border-[#e6e6e6] bg-white'
    )}
  >
    <FitArt size="story" className="w-full">
      <ShareCardArt look={look.id} size="story" />
    </FitArt>
    <span className="flex items-center gap-[8px]">
      <span className="text-[15px] leading-[normal] font-semibold text-[#1c2a21]">
        {look.label}
      </span>
      {look.tag && (
        <span className="rounded-full border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[8px] py-[3px] text-[11px] max-lg:text-[12px] leading-[normal] font-bold whitespace-nowrap text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21]">
          {look.tag}
        </span>
      )}
    </span>
    {selected && (
      <span className="absolute top-[12px] right-[12px] flex size-[30px] items-center justify-center rounded-full border-2 border-white bg-[#387440] playful:border-[1.2px] playful:border-[#1c2a21]">
        <ShareCardCheckWhiteIcon className="size-[16px]" />
      </span>
    )}
  </button>
);

export const PickStep = ({ look, setLook, onCancel, onNext }) => (
  <>
    <div
      role="radiogroup"
      aria-label="Look"
      className="mt-[24px] grid grid-cols-2 gap-[clamp(10px,1.16vw,20px)] lg:grid-cols-4"
    >
      {CARD_LOOKS.map((l) => (
        <LookTile key={l.id} look={l} selected={l.id === look} onSelect={setLook} />
      ))}
    </div>
    <div className="mt-[24px] flex items-center gap-[8px] rounded-[12px] bg-[#f8f8f4] px-[14px] py-[10px] text-[13px] leading-[normal] font-medium text-[color:var(--brand-green\/normal-active,#2d5d33)]">
      <ShareCardShieldIcon className="size-[16px] shrink-0" />
      Every look uses only your public info: name, headline, verified skills and your link.
    </div>
    <div className="mt-[24px]">
      <CardFooter
        note={
          <>
            <ShareCardInfoIcon className="size-[14px] shrink-0" />4 looks to start · more coming
            soon
          </>
        }
      >
        <CardButton variant="secondary" onClick={onCancel}>
          Cancel
        </CardButton>
        <CardButton onClick={onNext}>Next: Customise</CardButton>
      </CardFooter>
    </div>
  </>
);

/* ====================== SC-02 / 04 / 05 · Customise ====================== */
export const CustomiseStep = ({
  size,
  look,
  setLook,
  onSize,
  show,
  setShow,
  caption,
  setCaption,
  text,
  onEditText,
  onBack,
  onNext,
}) => {
  const sizeInfo = CARD_SIZES.find((s) => s.id === size);
  const banner = size === 'banner';
  const showEdit = size !== 'post';
  return (
    <div className="mt-[20px] grid gap-[28px] lg:grid-cols-[minmax(0,400fr)_minmax(0,574fr)]">
      <PreviewStage size={size} dims={sizeInfo.dims} className="w-full">
        <ShareCardArt look={look} size={size} show={show} text={text} />
      </PreviewStage>
      <div className="flex min-w-0 flex-col gap-[20px]">
        <StyleGroup look={look} onChange={setLook} />
        <SizeGroup size={size} onChange={(s) => onSize(s)} />
        <div className="flex flex-col gap-[20px]">
          <ShowGroup
            show={show}
            onChange={(id, v) => setShow((prev) => ({ ...prev, [id]: v }))}
            rowGap={banner ? 14 : 10}
          />
          {showEdit && (
            <button
              type="button"
              onClick={onEditText}
              className="flex w-fit cursor-pointer items-center gap-[6px] text-[13px] leading-[normal] font-semibold text-[color:var(--brand-green\/normal,#387440)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <ShareCardEditIcon className="size-[14px]" />
              Edit text on card
            </button>
          )}
          {banner && (
            <p className="m-0 flex items-center gap-[6px] text-[12px] leading-[14px] font-medium text-[#737373]">
              <ShareCardInfoIcon className="size-[14px] shrink-0" />
              Avatar is left out: LinkedIn already shows your photo
            </p>
          )}
        </div>
        <Textarea
          label="Caption (copied when you share)"
          required
          rows={4}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <CardFooter
          note={
            <>
              <ShareCardLockIcon className="size-[14px] shrink-0" />
              No phone, school year or exact location on the card
            </>
          }
        >
          <CardButton variant="secondary" onClick={onBack}>
            Back
          </CardButton>
          <CardButton onClick={onNext}>Next: Share</CardButton>
        </CardFooter>
      </div>
    </div>
  );
};

/* ====================== SC-03 · Edit text ====================== */
export const TextStep = ({
  size,
  look,
  show,
  text,
  draft,
  setDraft,
  onReset,
  onCancel,
  onSave,
}) => {
  const sizeInfo = CARD_SIZES.find((s) => s.id === size);
  const headRef = useRef(null);
  useEffect(() => {
    headRef.current?.querySelector('input')?.focus({ preventScroll: true });
  }, []);
  const preview = {
    ...text,
    headline: draft.headline,
    highlight: draft.highlight,
    headlineEdited: draft.headline !== CARD_PROFILE.headline,
    highlightEdited: draft.highlight !== CARD_PROFILE.highlight,
  };
  const tipClass = 'text-[#595959] text-[12px] leading-[normal] font-normal tracking-normal';
  return (
    <div className="mt-[20px] grid gap-[28px] lg:grid-cols-[minmax(0,400fr)_minmax(0,574fr)]">
      <PreviewStage size={size} dims={sizeInfo.dims} className="w-full">
        <ShareCardArt look={look} size={size} show={show} text={preview} />
      </PreviewStage>
      <div className="flex min-w-0 flex-col gap-[18px]">
        <div ref={headRef}>
          <TextInput
            label="Headline on card"
            labelTrailing={`${draft.headline.length} / ${HEADLINE_MAX}`}
            labelTrailingClassName="text-[#595959]"
            value={draft.headline}
            onChange={(e) => setDraft((d) => ({ ...d, headline: e.target.value }))}
          />
        </div>
        <TextInput
          label="Highlight line"
          labelTrailing={`${draft.highlight.length} / ${HEADLINE_MAX}`}
          labelTrailingClassName="text-[#595959]"
          value={draft.highlight}
          onChange={(e) => setDraft((d) => ({ ...d, highlight: e.target.value }))}
          helperText="Shows above your skills. Leave empty to hide it."
          helperIcon={<ShareAlertDiamondIcon className="size-4 shrink-0" />}
          helperTextClassName={tipClass}
        />
        <TextInput
          label="Name"
          disabled
          value={CARD_PROFILE.name}
          readOnly
          helperText="Change your name in Profile › About me"
          helperIcon={<ShareAlertDiamondIcon className="size-4 shrink-0" />}
          helperTextClassName={tipClass}
        />
        <div className="flex flex-col gap-[10px] rounded-[16px] bg-[#faf4e8] p-[14px]">
          <p className="m-0 flex items-center gap-[6px] text-[13px] leading-[16px] font-semibold text-[#785910]">
            <ShareCardStarIcon className="size-[14px]" />
            Buddy suggestions
          </p>
          <div className="flex flex-wrap gap-[8px]">
            {BUDDY_SUGGESTIONS.map((s) => (
              <Button
                key={s}
                variant="chip"
                size="md"
                onClick={() => {
                  log('suggestion', s);
                  setDraft((d) => ({ ...d, headline: s }));
                }}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
        <CardFooter
          note={
            <button
              type="button"
              onClick={onReset}
              className={classNames(
                NOTE,
                'cursor-pointer text-[12px] font-medium text-[#737373] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]'
              )}
            >
              <ShareCardRefreshIcon className="size-[14px]" />
              Reset to profile text
            </button>
          }
        >
          <CardButton variant="secondary" onClick={onCancel}>
            Cancel
          </CardButton>
          <CardButton onClick={onSave}>Save text</CardButton>
        </CardFooter>
      </div>
    </div>
  );
};

/* ====================== SC-06 · Making it ====================== */
const RING_R = 54;
const RING_C = 2 * Math.PI * RING_R;

export const MakingStep = ({ size, look, show, text, progress, exportLabel, onCancel }) => {
  const sizeInfo = CARD_SIZES.find((s) => s.id === size);
  const exportIdx = MAKING_STEPS.findIndex((s) => s.id === 'export');
  return (
    <div className="mt-[20px] grid gap-[28px] lg:grid-cols-[minmax(0,400fr)_minmax(0,574fr)]">
      <PreviewStage size={size} dims={sizeInfo.dims} className="w-full">
        <ShareCardArt look={look} size={size} show={show} text={text} status="making" />
      </PreviewStage>
      <div className="flex min-w-0 flex-col gap-[18px]">
        <div
          role="progressbar"
          aria-label="Making your card"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="relative size-[120px]"
        >
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={RING_R} fill="none" stroke="#e1eae2" strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r={RING_R}
              fill="none"
              stroke="#387440"
              strokeWidth="12"
              strokeLinecap="butt"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - progress / 100)}
              className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[29px] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading">
            {progress}%
          </span>
        </div>
        <ul className="m-0 flex list-none flex-col gap-[16px] rounded-[16px] bg-[#f8f8f4] p-[18px]">
          {MAKING_STEPS.map((s, i) => {
            const done = progress >= s.at;
            const active = !done && (i === 0 || progress >= MAKING_STEPS[i - 1].at);
            return (
              <li key={s.id} className="flex items-center gap-[10px]">
                <span className="flex size-[18px] shrink-0 items-center justify-center">
                  {done ? (
                    <ShareCardCheckCircleIcon className="size-[18px] text-[#387440]" />
                  ) : active ? (
                    <ShareCardHourglassIcon className="size-[18px] text-[#c8951a]" />
                  ) : (
                    <span className="block size-[18px] rounded-full border-[1.5px] border-[#bfbfbf] bg-white" />
                  )}
                </span>
                <span
                  className={classNames(
                    'text-[14px] leading-[17px]',
                    done && 'font-normal text-[#1c2a21]',
                    active && 'font-semibold text-[#1c2a21]',
                    !done && !active && 'text-[#737373]'
                  )}
                >
                  {i === exportIdx ? exportLabel : s.label}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="flex justify-end gap-[10px]">
          <CardButton variant="secondary" onClick={onCancel}>
            Cancel
          </CardButton>
          <CardButton disabled>Share</CardButton>
        </div>
      </div>
    </div>
  );
};

/* ====================== SC-07 · Ready ====================== */
const TARGET_TILE = {
  whatsapp: { bg: '#25d366', icon: <ShareWhatsAppBubbleIcon className="size-[20px]" /> },
  instagram: { bg: '#ffd86b', icon: <ShareStatusCameraIcon className="size-[20px]" /> },
  linkedin: { bg: '#0a66c2', icon: <ShareLinkedInBriefcaseIcon className="size-[20px]" /> },
  download: { bg: '#f8f8f4', icon: <ShareDownloadIcon className="size-[20px]" />, outline: true },
  copy: { bg: '#f8f8f4', icon: <ShareCopyIcon className="size-[20px]" />, outline: true },
};

export const ReadyStep = ({
  size,
  look,
  show,
  text,
  sizeDims,
  fileInfo,
  onTarget,
  onAnother,
  onDone,
}) => (
  <div className="mt-[20px] grid gap-[28px] lg:grid-cols-[minmax(0,400fr)_minmax(0,574fr)]">
    <PreviewStage
      size={size}
      dims={sizeDims}
      className="w-full"
      badge={
        <span className="absolute top-[24px] left-[24px] z-10 flex items-center gap-[6px] rounded-full border border-[rgba(28,42,33,0.12)] bg-white px-[11px] py-[6px] text-[13px] leading-[16px] font-semibold text-[#1c2a21] shadow-[0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]">
          <ShareCardCheckCircleIcon className="size-[16px] text-[#387440]" />
          Ready
        </span>
      }
    >
      <ShareCardArt look={look} size={size} show={show} text={text} />
    </PreviewStage>
    <div className="flex min-w-0 flex-col gap-[16px]">
      <p className="m-0 text-[14px] leading-[17px] font-medium text-[#1c2a21]">Share to</p>
      <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
        {SHARE_TARGETS.map((t) => {
          const tile = TARGET_TILE[t.id];
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onTarget(t.id)}
                className="flex w-full cursor-pointer items-center gap-[14px] rounded-[14px] border border-[#ececec] bg-white p-[13px] pr-[15px] text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                <span
                  className={classNames(
                    'flex size-[44px] shrink-0 items-center justify-center rounded-[12px] border shadow-[0_3px_0_rgba(28,42,33,0.25)] playful:shadow-[3px_3px_0_rgba(28,42,33,0.55)]',
                    tile.outline ? 'border-[rgba(28,42,33,0.3)]' : 'border-[rgba(28,42,33,0.12)]'
                  )}
                  style={{ backgroundColor: tile.bg }}
                >
                  {tile.icon}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                    {t.title}
                  </span>
                  <span className="truncate text-[12px] leading-[14px] text-[#737373]">
                    {t.id === 'download' ? fileInfo : t.sub}
                  </span>
                </span>
                <ShareChevronRightIcon className="shrink-0" />
              </button>
            </li>
          );
        })}
      </ul>
      <CardFooter
        note={
          <>
            <ShareCardFolderIcon className="size-[14px] shrink-0" />
            Find it later in Profile › Share cards
          </>
        }
      >
        <CardButton variant="secondary" onClick={onAnother}>
          Make another
        </CardButton>
        <CardButton onClick={onDone}>Done</CardButton>
      </CardFooter>
    </div>
  </div>
);

/* ====================== SC-08 · Couldn't make it ====================== */
export const ErrorStep = ({ size, look, show, text, sizeDims, onRetry, onDownload, onClose }) => (
  <div className="mt-[20px] grid gap-[28px] lg:grid-cols-[minmax(0,400fr)_minmax(0,574fr)]">
    <PreviewStage size={size} dims={sizeDims} className="w-full">
      <ShareCardArt look={look} size={size} show={show} text={text} status="error" />
    </PreviewStage>
    <div className="flex min-w-0 flex-col gap-[16px]">
      <div
        role="alert"
        className="flex items-start gap-[14px] rounded-[14px] border-[1.5px] border-[#c0392b] bg-[#fbf3f2] p-[20px]"
      >
        <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[10px] border border-[#c75044] bg-white text-[#c0392b]">
          <ShareCardWifiOffIcon className="size-[22px]" />
        </span>
        <span className="flex min-w-0 flex-col gap-[4px] text-[#7a1f17]">
          <span className="text-[15px] leading-[19px] font-semibold">You’re offline</span>
          <span className="text-[13px] leading-[16px] font-medium">
            We’ll finish the card automatically when you’re back online, and send you a
            notification.
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-[8px] rounded-[12px] bg-[#f8f8f4] p-[14px] text-[13px] leading-[16px] font-medium text-[#2d5d33]">
        <button
          type="button"
          onClick={onRetry}
          className="flex w-fit cursor-pointer items-center gap-[8px] text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <ShareCardRefreshIcon className="size-[16px] shrink-0" />
          Try again now
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="flex w-fit cursor-pointer items-center gap-[8px] text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <ShareCardDownloadIcon className="size-[16px] shrink-0" />
          Or download a lower-quality copy (works on slow data)
        </button>
      </div>
      <div className="flex justify-end gap-[10px]">
        <CardButton variant="secondary" onClick={onClose}>
          Close
        </CardButton>
        <CardButton onClick={onRetry}>Try again</CardButton>
      </div>
    </div>
  </div>
);
