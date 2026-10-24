import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from './shareButtonClasses.js';
import { ShareIconBigcheck } from './shareIcons.jsx';
import {
  DIGEST_UNDO_DAYS,
  UNSUBSCRIBED_SAMPLE_EMAIL,
  subscribeToDigest,
} from './data/shareData.js';

const log = debug('DigestUnsubscribedCard');

/*
 * DigestUnsubscribedCard — Figma 8.8.3f "Unsubscribed confirmation" (8505:248): a 560px white card (radius 24, padding 40) with a green check,
 * "You’ve been unsubscribed", the address that was removed, "Undo · resubscribe" + "Go to the national snapshot" and the 30-day note.
 * No sign-in is needed (the link in the email carries a token — ⚠️ mocked: the address is the sample one from shareData.js, never put in the URL).
 * ⚠️ ASSUMPTION: Undo re-subscribes through the mocked request and lands on the digest "Check your inbox" confirmation (the address must be
 *   re-confirmed), as Figma draws no state for it.
 * Props: email (defaults to the sample address).
 */

const DigestUnsubscribedCard = ({ email = UNSUBSCRIBED_SAMPLE_EMAIL }) => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const undo = async () => {
    setBusy(true);
    await subscribeToDigest({ email });
    log('resubscribed (mock)');
    navigate('/data/overview?modal=digest&state=success');
  };

  return (
    <section
      aria-labelledby="digest-unsubscribed-title"
      className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-[14px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[24px] text-center shadow-[0_5px_17px_rgba(28,42,33,0.06)] sm:p-[40px]"
    >
      <span className="flex size-[62px] items-center justify-center rounded-full bg-[#ebf1ec] text-[#387440]">
        <ShareIconBigcheck className="size-[30px]" />
      </span>
      <h1
        id="digest-unsubscribed-title"
        className="m-0 font-sans text-[24px] leading-[29px] font-semibold text-[#1c2a21]"
      >
        You’ve been unsubscribed
      </h1>
      <p className="m-0 max-w-[480px] font-sans text-[15px] leading-[22px] text-[#595959]">
        {email} won’t receive the GTH monthly digest any more. No sign-in was needed and we’ve
        deleted your preferences.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-[12px] pt-[8px]">
        <Button
          type="button"
          variant="tertiary"
          size="md"
          disabled={busy}
          onClick={undo}
          className={TERTIARY_BUTTON}
        >
          Undo · resubscribe
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          className={PRIMARY_BUTTON}
          onClick={() => navigate('/data/overview')}
        >
          Go to the national snapshot
        </Button>
      </div>
      <p className="m-0 font-sans text-[12px] leading-[14px] text-[#595959]">
        Unsubscribed by mistake? Undo works for {DIGEST_UNDO_DAYS} days.
      </p>
    </section>
  );
};

export default DigestUnsubscribedCard;
