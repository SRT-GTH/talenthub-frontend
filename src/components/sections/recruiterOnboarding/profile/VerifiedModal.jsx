import Button from '../../../ui/Button.jsx';
import ProfileModalShell from './ProfileModalShell.jsx';
import { ArrowRightIcon } from '../../../shared/assets.jsx';
import { MailGlyph, ModalCheckGlyph, PhoneGlyph } from './profileIcons.jsx';
import { debug } from '../../../../utils/debug.js';

const log = debug('VerifiedModal');

/*
 * VerifiedModal - R02 success, Figma 7374:3466 (440x553): "Contact verified"
 * chip, "You're Verified" (second word green), summary (Phone / Email, masked),
 * slim rail, CTA "Continue To Organisation".
 */
const VerifiedModal = ({ phoneMasked, emailMasked, onClose, onContinue }) => {
  log('render');
  return (
    <ProfileModalShell labelledBy="profile-verified-title" onClose={onClose} maxWidth={440}>
      <div className="flex flex-col items-center gap-3 pt-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-[10px] bg-[#e1eae2]">
          <ModalCheckGlyph />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-brand-green-light-active bg-brand-green-light px-3 py-1">
          <span
            aria-hidden="true"
            className="size-2 rounded-full border-[1.5px] border-success bg-white"
            style={{ boxShadow: '0 0 4px 0 #387440' }}
          />
          <span
            className="text-[12px] leading-[18px] text-[#999999]"
            style={{ letterSpacing: '0.2px' }}
          >
            Contact verified
          </span>
        </span>
        <h2
          id="profile-verified-title"
          className="mt-1 font-heading font-semibold text-[#1c2a21]"
          style={{ fontSize: 32, lineHeight: '34px', letterSpacing: '-0.58px' }}
        >
          You’re <span className="text-brand-green">Verified</span>
        </h2>
        <p className="text-[12px] leading-[18px] text-[#959592]" style={{ letterSpacing: '0.2px' }}>
          Your phone and email have been confirmed. Here&apos;s what we verified.
        </p>
      </div>

      <ul className="mt-5 flex flex-col rounded-[16px] border border-[#e1eae2] bg-brand-green-light/60">
        <li className="flex items-center justify-between gap-3 border-b border-brand-green-light-hover px-4 py-3 text-[12px] leading-5">
          <span className="flex items-center gap-2 text-[#575755]">
            <PhoneGlyph className="size-3 text-brand-green" />
            Phone
          </span>
          <span className="font-semibold text-brand-green">{phoneMasked}</span>
        </li>
        <li className="flex items-center justify-between gap-3 px-4 py-3 text-[12px] leading-5">
          <span className="flex items-center gap-2 text-[#575755]">
            <MailGlyph className="size-3 text-brand-green" />
            Email
          </span>
          <span className="min-w-0 truncate font-semibold text-brand-green">{emailMasked}</span>
        </li>
      </ul>

      <div
        className="mt-4 h-1 w-full overflow-hidden rounded-full bg-brand-green-light"
        aria-hidden="true"
      />

      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={onContinue}
        rightIcon={<ArrowRightIcon />}
        className="mt-4 w-full"
        data-autofocus
      >
        Continue To Organisation
      </Button>
    </ProfileModalShell>
  );
};

export default VerifiedModal;
