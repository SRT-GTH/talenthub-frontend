import { useCallback, useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ShareChevronDownIcon,
  ShareEditPencilIcon,
  ShareEyeIcon,
  ShareGlobeIcon,
  ShareLinkedInBriefcaseIcon,
  ShareMailIcon,
  ShareMoreDotsIcon,
  ShareStatusCameraIcon,
  ShareToastLinkIcon,
  ShareWhatsAppBubbleIcon,
  ShareXLetterIcon,
  TalentSidebarProfileAvatarIllustration,
} from '../../shared/assets.jsx';
import {
  ShareDialog,
  ShareFieldHelper,
  ShareFieldLabel,
  ShareHead,
  ShareQr,
  ShareSwitch,
  ShareToast,
} from './ShareProfileParts.jsx';
import { FOCUS_RING, SHARE_INPUT_CLASS } from './ShareProfileUi.js';
import { copyText, downloadQrPng, readSavedSlug } from './ShareProfileFile.js';
import { PROFILE_HOST, PROFILE_SLUG, SHARE_MAIN } from './talentProfileShareData.js';
import { ShareKeyboardHints } from './ProfileAxKeyboardHints.jsx';

const log = debug('ShareProfileMain');

const TILE =
  'flex size-[56px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] border-[1.4px] border-[rgba(28,42,33,0.32)] shadow-[0_10px_24px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.2)] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_24px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)]';

/* Channel tiles — Figma `channel · …` (fills straight from the frame). */
const CHANNEL_TILE = {
  whatsapp: { bg: '#25d366', icon: <ShareWhatsAppBubbleIcon className="size-[25px]" /> },
  linkedin: { bg: '#0a66c2', icon: <ShareLinkedInBriefcaseIcon className="size-[25px]" /> },
  status: { bg: '#ffd86b', icon: <ShareStatusCameraIcon className="size-[25px]" /> },
  x: { bg: '#1c2a21', icon: <ShareXLetterIcon className="h-[17.4px] w-[14.1px]" /> },
  email: { bg: '#faf4e8', icon: <ShareMailIcon className="size-[25px]" /> },
  more: { bg: '#f8f8f4', icon: <ShareMoreDotsIcon className="size-[28px]" /> },
};

/* `keyboardHints` (AX-08, `?ax=share-modal`): adds the "Tab move · Enter copy / open · ← → channels · Esc close" row. */
const ShareProfileMain = ({
  profile,
  copied = false,
  keyboardHints = profile?.ax === 'share-modal',
}) => {
  const slug = readSavedSlug(PROFILE_SLUG);
  const url = `${PROFILE_HOST}${slug}`;
  const fullUrl = `https://${url}`;
  const [google, setGoogle] = useState(false);
  const [toastOpen, setToastOpen] = useState(copied);
  const inputRef = useRef(null);
  const close = useCallback(() => profile.update({ share: null }), [profile]);

  useEffect(() => {
    log('mount', { copied, slug });
    setToastOpen(copied);
  }, [copied, slug]);

  const handleCopy = async () => {
    log('click copy link', { url });
    const ok = await copyText(fullUrl);
    if (ok) {
      log('branch: copied');
      profile.update({ share: 'copied' });
    } else {
      log.error('copy failed — selecting the link so it can be copied by hand');
      inputRef.current?.select();
    }
  };

  const openExternal = (href) => {
    log('open', { href });
    try {
      window.open(href, '_blank', 'noopener,noreferrer');
    } catch (err) {
      log.error('open failed', err);
    }
  };

  const onChannel = async (id) => {
    log('channel', { id });
    const text = encodeURIComponent(fullUrl);
    if (id === 'whatsapp') openExternal(`https://wa.me/?text=${text}`);
    else if (id === 'linkedin')
      openExternal(`https://www.linkedin.com/sharing/share-offsite/?url=${text}`);
    else if (id === 'status') profile.update({ share: 'card' });
    else if (id === 'x') openExternal(`https://twitter.com/intent/tweet?url=${text}`);
    else if (id === 'email')
      window.location.href = `mailto:?subject=${encodeURIComponent(SHARE_MAIN.title)}&body=${text}`;
    else if (id === 'more') {
      try {
        if (navigator.share) await navigator.share({ title: SHARE_MAIN.title, url: fullUrl });
        else await copyText(fullUrl);
      } catch (err) {
        log('share dismissed', err?.name);
      }
    }
  };

  return (
    <ShareDialog
      onClose={close}
      titleId="share-profile-title"
      maxWidth={720}
      toast={
        toastOpen ? (
          <ShareToast
            onDismiss={() => setToastOpen(false)}
            className="gap-[12px] rounded-[16px] py-[14px] pr-[18px] pl-[16px]"
          >
            <ShareToastLinkIcon className="size-[19px] shrink-0" />
            <span className="flex flex-col gap-[2px] leading-[normal] whitespace-nowrap max-sm:whitespace-normal">
              <span className="text-[14px] font-semibold text-white">{SHARE_MAIN.toast.title}</span>
              <span className="text-[12px] text-[#bfbfbf]">{SHARE_MAIN.toast.body}</span>
            </span>
            <span className="shrink-0 rounded-full bg-brand-green-light px-[10px] py-[5px] text-[11px] max-lg:text-[12px] font-bold whitespace-nowrap text-[#1f4d26]">
              {SHARE_MAIN.toast.sticker}
            </span>
          </ShareToast>
        ) : null
      }
    >
      <ShareHead
        titleId="share-profile-title"
        title={SHARE_MAIN.title}
        sticker={SHARE_MAIN.sticker}
        subtitle={SHARE_MAIN.subtitle}
        onClose={close}
      />

      {/* link row */}
      <div className="flex w-full flex-col gap-[12px] sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
          <ShareFieldLabel htmlFor="share-link-input">{SHARE_MAIN.linkLabel}</ShareFieldLabel>
          <input
            ref={inputRef}
            id="share-link-input"
            readOnly
            value={url}
            aria-describedby="share-link-hint"
            onFocus={(e) => e.currentTarget.select()}
            className={classNames(
              SHARE_INPUT_CLASS,
              copied ? 'border-[1.5px] border-brand-green-light-active' : 'border border-[#ccc]'
            )}
          />
          <ShareFieldHelper id="share-link-hint">
            {copied ? SHARE_MAIN.copiedHint : SHARE_MAIN.linkHint}
          </ShareFieldHelper>
        </div>
        <div className="flex shrink-0 flex-col items-stretch sm:pb-[26px]">
          {copied ? (
            <Button
              variant="tertiary-subtle"
              size="lg"
              data-ax="share-copy-link"
              onClick={handleCopy}
            >
              {SHARE_MAIN.copiedLabel}
            </Button>
          ) : (
            <Button variant="primary" size="md" data-ax="share-copy-link" onClick={handleCopy}>
              {SHARE_MAIN.copyLabel}
            </Button>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          log('click customise');
          profile.update({ share: 'link' });
        }}
        className={classNames(
          'flex w-fit cursor-pointer items-center gap-[6px] bg-transparent p-0 text-[13px] leading-[normal] font-semibold text-brand-green',
          FOCUS_RING
        )}
      >
        <ShareEditPencilIcon className="size-[14px] shrink-0" />
        <span>{SHARE_MAIN.customise}</span>
      </button>

      <p className="m-0 text-[14px] font-medium text-[#1c2a21]">{SHARE_MAIN.shareTo}</p>
      <div className="grid w-full grid-cols-3 gap-x-[12px] gap-y-[14px] sm:grid-cols-6">
        {SHARE_MAIN.channels.map((channel) => {
          const tile = CHANNEL_TILE[channel.id];
          return (
            <button
              key={channel.id}
              type="button"
              onClick={() => onChannel(channel.id)}
              className={classNames(
                'mx-auto flex w-[98px] max-w-full cursor-pointer flex-col items-center gap-[8px] bg-transparent p-0 leading-[normal]',
                FOCUS_RING
              )}
            >
              <span className={TILE} style={{ backgroundColor: tile.bg }}>
                {tile.icon}
              </span>
              <span className="text-[12px] font-medium whitespace-nowrap text-[#595959]">
                {channel.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* extras */}
      <div className="grid w-full grid-cols-1 gap-[16px] md:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            log('click create card');
            profile.update({ share: 'card' });
          }}
          className={classNames(
            'flex min-w-0 cursor-pointer items-center gap-[14px] rounded-[16px] border-0 bg-brand-green-light p-[16px] text-left leading-[normal]',
            FOCUS_RING
          )}
        >
          <span className="flex h-[112px] w-[64px] shrink-0 flex-col items-center gap-[4px] overflow-hidden rounded-[10px] border-[1.5px] border-solid border-[#1c2a21] bg-brand-green p-[8px] playful:h-[118px] playful:w-[75px]">
            <span className="flex size-[36px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-brand-green">
              <TalentSidebarProfileAvatarIllustration className="h-[40.645px] w-[40.065px] shrink-0" />
            </span>
            <span className="h-[4px] w-[40px] shrink-0 rounded-[2px] bg-white" />
            <span className="h-[4px] w-[28px] shrink-0 rounded-[2px] bg-[#ffd86b]" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <span className="text-[15px] font-semibold whitespace-nowrap text-[#1c2a21]">
              {SHARE_MAIN.card.title}
            </span>
            <span className="max-w-[150px] text-[12px] leading-[1.4] text-[#595959]">
              {SHARE_MAIN.card.body}
            </span>
            <span className="text-[13px] font-semibold whitespace-nowrap text-brand-green">
              {SHARE_MAIN.card.cta}
            </span>
          </span>
        </button>

        <div className="flex min-w-0 items-center gap-[14px] rounded-[16px] bg-[#faf4e8] p-[16px] leading-[normal]">
          <ShareQr size={84} border={1.5} logo={16.8} logoBorder={2} logoRadius={6} flag={14} />
          <div className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
            <span className="text-[15px] font-semibold whitespace-nowrap text-[#1c2a21]">
              {SHARE_MAIN.qr.title}
            </span>
            <span className="max-w-[150px] text-[12px] leading-[1.4] text-[#595959]">
              {SHARE_MAIN.qr.body}
            </span>
            <button
              type="button"
              onClick={() => {
                log('click download qr');
                downloadQrPng();
              }}
              className={classNames(
                'cursor-pointer bg-transparent p-0 text-left text-[13px] font-semibold whitespace-nowrap text-brand-green',
                FOCUS_RING
              )}
            >
              {SHARE_MAIN.qr.cta}
            </button>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-[#e6e6e6]" />

      {/* privacy */}
      <div className="flex w-full flex-col gap-[12px]">
        <div className="flex w-full items-center justify-between gap-[10px] max-sm:flex-wrap">
          <p
            id="share-who-label"
            className="m-0 min-w-0 flex-1 text-[14px] font-medium text-[#1c2a21]"
          >
            {SHARE_MAIN.whoCanOpen}
          </p>
          {/* ⚠️ ASSUMPTION: Figma draws only the closed dropdown ("Anyone with the link"); no option list. */}
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded="false"
            aria-labelledby="share-who-label share-who-value"
            onClick={() => log('dropdown clicked — options are not drawn in Figma')}
            className={classNames(
              'flex shrink-0 cursor-pointer items-center gap-[6px] rounded-[10px] border border-[#ccc] bg-white px-[12px] py-[8px]',
              FOCUS_RING
            )}
          >
            <span className="flex items-center gap-[5px]">
              <ShareGlobeIcon className="size-[15px] shrink-0" />
              <span
                id="share-who-value"
                className="text-[13px] font-medium whitespace-nowrap text-[#1c2a21]"
              >
                {SHARE_MAIN.audience}
              </span>
            </span>
            <ShareChevronDownIcon className="size-[14px] shrink-0" />
          </button>
        </div>
        <div className="flex w-full items-center gap-[10px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <p id="share-google-label" className="m-0 text-[14px] font-medium text-[#1c2a21]">
              {SHARE_MAIN.google}
            </p>
            <p className="m-0 text-[12px] text-[#737373]">{SHARE_MAIN.googleHint}</p>
          </div>
          <ShareSwitch
            checked={google}
            onChange={(next) => {
              log('google find', { next });
              setGoogle(next);
            }}
            labelledBy="share-google-label"
          />
        </div>
      </div>

      <div className="flex w-full items-center gap-[10px] max-sm:flex-col max-sm:items-stretch">
        <p className="m-0 flex min-w-0 flex-1 items-center gap-[5px] text-[12px] font-medium text-[#737373]">
          <ShareEyeIcon className="size-[14px] shrink-0" />
          <span>{SHARE_MAIN.opened}</span>
        </p>
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => {
            log('click download pdf');
            profile.update({ share: 'pdf' });
          }}
        >
          {SHARE_MAIN.pdf}
        </Button>
      </div>

      {keyboardHints ? <ShareKeyboardHints /> : null}
    </ShareDialog>
  );
};

export default ShareProfileMain;
