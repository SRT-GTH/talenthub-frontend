import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import Button from '../../ui/Button.jsx';
import { ProfileChipCheckIcon, ProfileEditModalCloseIcon } from '../../shared/assets.jsx';
import { HEAD } from '../talentHome/coreUi.jsx';
import {
  ImgDescAiIcon,
  ImgDescPlayIcon,
  ImgDescRefreshIcon,
  ImgDescVolumeIcon,
} from './ImageDescriptionIcons.jsx';
import { ALT_IMAGES, ALT_MODAL } from './ProfileImageDescriptionsData.js';
import { ProfileChip, ProjectCoverArt, Tag } from './ProfileTabsUi.jsx';
import { coverBg } from './profileTabsStyles.js';

const log = debug('ProfileAltTextModal');

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

// The frame truncates the spoken preview after the first seven words.
const PREVIEW_WORDS = 7;
const previewText = (title, text) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return `${title}.`;
  const cut = words.length > PREVIEW_WORDS;
  return `${title}. ${words.slice(0, PREVIEW_WORDS).join(' ')}${cut ? '…' : ''}`;
};

/*
 * ProfileAltTextModal — AX-06b "Describe this image" (Figma Playful 7591:4339, modal 7591:4876 /
 * Focused 8110:393635, modal 8110:394160). Opens over the Portfolio tab with `?ax=alt`.
 * Props: `profile` (talent profile state; `update({ ax })`), `onDescribed(projectKey)` called when an
 * image is saved. Mock only: nothing is persisted. "Try again" has no alternative text in the frames, so it
 * restores the drafted text.
 */
const ProfileAltTextModal = ({ profile, onDescribed }) => {
  const uid = useId();
  const dialogRef = useRef(null);
  const textRef = useRef(null);
  const [index, setIndex] = useState(0);
  const image = ALT_IMAGES[index];
  const next = ALT_IMAGES[index + 1];
  const [text, setText] = useState(image.draft);
  const [drafted, setDrafted] = useState(Boolean(image.draft));
  const [decorative, setDecorative] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    log('mount', { images: ALT_IMAGES.length });
  }, []);

  const close = () => {
    log('close');
    profile.update({ ax: 'images' });
  };

  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: close,
    initialFocus: () => textRef.current,
    lockScroll: true,
  });

  const advance = (saved) => {
    log(saved ? 'save' : 'skip', { image: image.key, decorative, chars: text.length });
    if (saved) onDescribed(image.key);
    if (!next) {
      close();
      return;
    }
    setIndex(index + 1);
    setText(next.draft);
    setDrafted(Boolean(next.draft));
    setDecorative(false);
    setInvalid(false);
    textRef.current?.focus();
  };

  const save = () => {
    if (!decorative && !text.trim()) {
      log('save blocked: empty description');
      setInvalid(true);
      textRef.current?.focus();
      return;
    }
    advance(true);
  };

  const tryAgain = () => {
    log('try again', { image: image.key });
    setText(image.draft);
    setDrafted(Boolean(image.draft));
    setInvalid(false);
    textRef.current?.focus();
  };

  const hear = () => {
    log('hear it');
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(previewText(image.title, text)));
  };

  const spoken = decorative ? '' : previewText(image.title, text);

  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[60] flex items-end justify-center overflow-hidden bg-[rgba(28,42,33,0.55)] sm:items-start sm:px-[clamp(12px,2vw,32px)] sm:pt-[clamp(16px,5vh,68px)] sm:pb-[16px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        aria-describedby={`${uid}-sub`}
        tabIndex={-1}
        className={classNames(
          'flex max-h-full w-full max-w-[900px] flex-col gap-[20px] overflow-y-auto rounded-[24px] border border-[rgba(28,42,33,0.1)] bg-white p-[clamp(16px,1.6vw,28px)] outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)]',
          'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_24px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]',
          'max-sm:max-h-[100dvh] max-sm:rounded-b-none max-sm:pb-[calc(16px+env(safe-area-inset-bottom))]'
        )}
      >
        <div className="flex items-start gap-[10px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[6px]">
              <h2
                id={`${uid}-title`}
                className={classNames(
                  HEAD,
                  'text-[clamp(22px,1.68vw,29px)] leading-[1.2] text-[#1c2a21]'
                )}
              >
                {ALT_MODAL.title}
              </h2>
              <ProfileChip>{`${index + 1} of ${ALT_IMAGES.length}`}</ProfileChip>
            </div>
            <p id={`${uid}-sub`} className="text-[14px] leading-[1.2] text-[#737373]">
              {ALT_MODAL.sub}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className={classNames(
              'flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#e6e6e6] bg-transparent',
              FOCUS_RING
            )}
          >
            <ProfileEditModalCloseIcon className="size-[16px]" />
          </button>
        </div>

        <div className="flex flex-col gap-[24px] md:flex-row">
          <figure className="flex w-full shrink-0 flex-col gap-[8px] md:w-[300px]">
            <div
              className="relative h-[190px] w-full overflow-hidden"
              style={{ background: coverBg(image.cover) }}
            >
              <div className="w-[427px] max-w-none shrink-0">
                <ProjectCoverArt kind={image.cover} fixed />
              </div>
              <Tag tone="white" className="absolute top-[12px] left-[11px] playful:rotate-3">
                {image.tag}
              </Tag>
            </div>
            <figcaption className="text-[12px] leading-[14px] font-medium text-[#737373]">
              {image.caption}
            </figcaption>
          </figure>

          <div className="flex min-w-0 flex-1 flex-col gap-[14px]">
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between gap-[10px]">
                <label
                  htmlFor={`${uid}-alt`}
                  className="flex gap-px text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
                >
                  {ALT_MODAL.field}
                  <span
                    aria-hidden="true"
                    className="font-[Instrument_Sans] text-[14px] leading-[21px] font-semibold text-[#2e8b57]"
                  >
                    *
                  </span>
                </label>
                <span
                  aria-hidden="true"
                  className="text-[12px] leading-[18px] tracking-[0.2px] text-[#595959]"
                >
                  *
                </span>
              </div>
              <textarea
                ref={textRef}
                id={`${uid}-alt`}
                value={text}
                disabled={decorative}
                aria-required="true"
                aria-invalid={invalid || undefined}
                aria-describedby={`${uid}-tips`}
                onChange={(e) => {
                  setText(e.target.value);
                  setInvalid(false);
                }}
                className="block h-[112px] w-full resize-none rounded-[10px] border border-[#ccc] bg-white py-[13px] pr-[16px] pl-[20px] text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_11px_rgba(28,42,33,0.03)] outline-none focus:border-2 focus:border-[#c1d4c4] focus:bg-[#fffefc] focus:py-[12px] focus:pr-[15px] focus:pl-[19px] disabled:opacity-50 aria-[invalid=true]:border-[#c0392b] playful:shadow-[0_1px_2px_rgba(28,42,33,0.04),0_4px_16px_rgba(28,42,33,0.06)]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
              {drafted ? (
                <span className="inline-flex items-center gap-[6px] rounded-full border border-[#c8951a] bg-[#faf4e8] px-[10px] py-[5px] text-[12px] leading-[14px] font-medium text-[#463409]">
                  <ImgDescAiIcon className="size-[14px] shrink-0" />
                  {ALT_MODAL.buddy}
                </span>
              ) : null}
              <button
                type="button"
                onClick={tryAgain}
                disabled={decorative}
                className={classNames(
                  'inline-flex cursor-pointer items-center gap-[8px] text-[13px] leading-[16px] font-semibold text-[#387440] disabled:cursor-default disabled:opacity-50',
                  FOCUS_RING
                )}
              >
                {ALT_MODAL.tryAgain}
                <ImgDescRefreshIcon className="size-[15px] shrink-0" />
              </button>
            </div>

            <div
              id={`${uid}-tips`}
              className="flex flex-col gap-[6px] rounded-[12px] bg-[#f8f8f4] p-[14px]"
            >
              <p className="text-[13px] leading-[16px] font-semibold text-[#1c2a21] max-lg:text-[12px]">
                {ALT_MODAL.tipsTitle}
              </p>
              <ul className="flex flex-col gap-[6px]">
                {ALT_MODAL.tips.map((t) => (
                  <li
                    key={t}
                    className="text-[13px] leading-[16px] whitespace-pre-wrap text-[#595959] max-lg:text-[12px]"
                  >
                    {`•  ${t}`}
                  </li>
                ))}
              </ul>
            </div>

            <label className="relative flex w-fit max-w-full cursor-pointer items-start gap-[10px]">
              <input
                type="checkbox"
                checked={decorative}
                onChange={(e) => {
                  log('decorative', e.target.checked);
                  setDecorative(e.target.checked);
                  setInvalid(false);
                }}
                className="peer absolute top-0 left-0 size-[22px] cursor-pointer opacity-0"
              />
              <span
                aria-hidden="true"
                className="flex size-[22px] shrink-0 items-center justify-center rounded-[6px] border-[1.5px] border-[#bfbfbf] bg-white peer-checked:border-[#387440] peer-checked:bg-[#387440] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#387440] [&>svg]:hidden peer-checked:[&>svg]:block [&_path]:fill-white"
              >
                <ProfileChipCheckIcon className="size-[14px]" />
              </span>
              <span className="text-[14px] leading-[17px] font-medium text-[#595959]">
                {ALT_MODAL.decorative}
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[8px] rounded-[12px] bg-[#1c2a21] px-[14px] py-[12px]">
          <ImgDescVolumeIcon className="size-[15px] shrink-0" />
          <p className="min-w-0 flex-1 basis-[200px] text-[13px] leading-[16px] font-medium text-white max-lg:text-[12px]">
            {decorative ? ALT_MODAL.decorative : `${ALT_MODAL.say}“${spoken}”`}
          </p>
          <button
            type="button"
            onClick={hear}
            disabled={decorative}
            className={classNames(
              'inline-flex cursor-pointer items-center gap-[5px] text-[13px] leading-[16px] font-semibold text-[#84cc16] disabled:cursor-default disabled:opacity-50',
              FOCUS_RING
            )}
          >
            <ImgDescPlayIcon className="size-[15px] shrink-0" />
            {ALT_MODAL.hear}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-[10px]">
          <p className="min-w-0 flex-1 basis-[120px] text-[12px] leading-[14px] font-medium text-[#737373]">
            {next ? `${ALT_MODAL.next}${next.title}` : null}
          </p>
          <Button variant="tertiary" size="sm" onClick={() => advance(false)}>
            {ALT_MODAL.skip}
          </Button>
          <Button variant="primary" size="sm" onClick={save}>
            {ALT_MODAL.save}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProfileAltTextModal;
