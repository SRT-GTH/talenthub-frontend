import { useCallback, useEffect } from 'react';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { ShareCopyIcon, ShareMailSmallIcon } from '../../shared/assets.jsx';
import { ShareBackButton, ShareCloseButton, ShareDialog, ShareQr } from './ShareProfileParts.jsx';
import { copyText, downloadCardPng } from './ShareProfileFile.js';
import { CARD_PRESETS, SHARE_CARD, SHARE_WHATSAPP } from './talentProfileShareData.js';

const log = debug('WhatsAppStatusSheet');

/*
 * WhatsAppStatusSheet — SH-03f "Post to WhatsApp Status from your phone" (Figma modal · Send to phone).
 * WhatsApp Status can only be posted from a phone, so the card is handed over with a QR. The caption is
 * copied to the clipboard when the sheet opens ("Caption copied. Paste it when you post.").
 */
const WhatsAppStatusSheet = ({ profile }) => {
  const back = useCallback(() => profile.update({ share: 'card-saved' }), [profile]);
  const close = useCallback(() => profile.update({ share: null }), [profile]);

  useEffect(() => {
    log('mount');
    copyText(SHARE_CARD.caption).then((ok) => log('caption copied', { ok }));
  }, []);

  return (
    <ShareDialog onClose={close} titleId="share-whatsapp-title" maxWidth={620}>
      <div className="flex w-full items-start gap-[12px]">
        <ShareBackButton onBack={back} size={44} />
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <h2
            id="share-whatsapp-title"
            className="m-0 text-[clamp(22px,1.68vw,29px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading"
          >
            {SHARE_WHATSAPP.title}
          </h2>
          <p className="m-0 max-w-[440px] text-[clamp(12px,0.81vw,14px)] text-[#737373]">
            {SHARE_WHATSAPP.subtitle}
          </p>
        </div>
        <ShareCloseButton onClose={close} size={44} />
      </div>

      <div className="flex w-full items-center gap-[24px] max-sm:flex-col max-sm:items-stretch">
        <div className="flex shrink-0 flex-col items-center gap-[8px] self-start rounded-[18px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[16px] shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)] max-sm:self-center">
          <ShareQr
            size={180}
            border={1}
            borderColor="rgba(28,42,33,0.1)"
            logo={36}
            logoBorder={4.286}
            logoRadius={12.857}
            flag={48.462}
          />
          <span className="text-[11px] max-lg:text-[12px] font-medium whitespace-nowrap text-[#737373]">
            {SHARE_WHATSAPP.expires}
          </span>
        </div>
        <ol className="m-0 flex min-w-0 flex-1 list-none flex-col gap-[16px] p-0">
          {SHARE_WHATSAPP.steps.map((step, i) => (
            <li key={step} className="flex items-center gap-[12px]">
              <span
                aria-hidden="true"
                className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] text-[13px] font-bold text-[#1c2a21]"
              >
                {i + 1}
              </span>
              <span className="text-[15px] font-medium text-[#1c2a21]">{step}</span>
            </li>
          ))}
          <li className="list-none">
            <button
              type="button"
              onClick={() => {
                log('click email it');
                window.location.href = `mailto:?subject=${encodeURIComponent(SHARE_CARD.title)}&body=${encodeURIComponent(SHARE_CARD.caption)}`;
              }}
              className="flex w-fit max-w-full cursor-pointer items-center gap-[8px] rounded-[12px] border-0 bg-[#f8f8f4] px-[12px] py-[10px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <ShareMailSmallIcon className="size-[16px] shrink-0" />
              <span className="text-[13px] font-semibold text-brand-green-active">
                {SHARE_WHATSAPP.email}
              </span>
            </button>
          </li>
        </ol>
      </div>

      <div
        role="status"
        className="flex w-full items-center gap-[10px] rounded-[12px] bg-brand-green-light px-[14px] py-[10px]"
      >
        <ShareCopyIcon className="size-[16px] shrink-0" />
        <p className="m-0 min-w-0 flex-1 text-[13px] font-medium text-brand-green-active">
          {SHARE_WHATSAPP.captionCopied}
        </p>
      </div>

      <div className="flex min-h-[64px] w-full flex-wrap items-center justify-end gap-[10px]">
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => {
            log('click download instead');
            const preset = CARD_PRESETS['card-saved'];
            downloadCardPng({
              style: preset.style,
              size: preset.size,
              filename: 'kofi-agyekum-story.png',
            });
          }}
        >
          {SHARE_WHATSAPP.downloadInstead}
        </Button>
        <Button variant="primary" size="sm" onClick={close}>
          {SHARE_WHATSAPP.done}
        </Button>
      </div>
    </ShareDialog>
  );
};

export default WhatsAppStatusSheet;
