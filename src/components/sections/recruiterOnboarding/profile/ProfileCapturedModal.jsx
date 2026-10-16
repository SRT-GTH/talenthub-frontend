import Button from '../../../ui/Button.jsx';
import ProfileModalShell from './ProfileModalShell.jsx';
import { ArrowRightIcon, LoadingSpinner } from '../../../shared/assets.jsx';
import {
  BuildingGlyph,
  CircleCheckGlyph,
  FlagGhanaGlyph,
  LockGlyph,
  MailGlyph,
  ModalCheckGlyph,
  UserGlyph,
} from './profileIcons.jsx';
import { debug } from '../../../../utils/debug.js';

const log = debug('ProfileCapturedModal');

/*
 * ProfileCapturedModal - R01 loader state, Figma 7374:2251 (440x645).
 * "Profile section complete" chip, "Profile captured." headline, summary card
 * (Full Name / Email / Phone / Profile Type / Password), slim rail, and the
 * pressed CTA "Sending verification code" with a spinner. Purely presentational:
 * the page owns the timer and swaps to the OTP modal when submitProfile resolves.
 */
const Row = ({ icon, label, children, last }) => (
  <li
    className={`flex items-center justify-between gap-3 px-4 py-2.5 text-[12px] leading-5 ${
      last ? '' : 'border-b border-brand-green-light-hover'
    }`}
  >
    <span className="flex shrink-0 items-center gap-2 text-[#575755]">
      <span
        className="inline-flex size-4 items-center justify-center text-[#575755]"
        aria-hidden="true"
      >
        {icon}
      </span>
      {label}
    </span>
    <span className="flex min-w-0 items-center justify-end gap-1 text-right font-semibold text-brand-green">
      {children}
    </span>
  </li>
);

const ProfileCapturedModal = ({ fullName, email, phoneDisplay, onClose }) => {
  log('render');
  return (
    <ProfileModalShell labelledBy="profile-captured-title" onClose={onClose} maxWidth={440}>
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
            Profile section complete
          </span>
        </span>
        <h2
          id="profile-captured-title"
          className="mt-1 font-heading font-semibold text-[#1c2a21]"
          style={{ fontSize: 29, lineHeight: '32px', letterSpacing: '-0.58px' }}
        >
          Profile captured.
        </h2>
        <p className="text-[12px] leading-[18px] text-[#959592]" style={{ letterSpacing: '0.2px' }}>
          Your recruiter profile is saved and encrypted.
          <br />
          Next, we&apos;ll verify your email and phone.
        </p>
      </div>

      <ul className="mt-5 flex flex-col rounded-[16px] border border-[#e1eae2] bg-brand-green-light/60">
        <Row icon={<UserGlyph className="size-3" />} label="Full Name">
          <span className="truncate">{fullName}</span>
        </Row>
        <Row icon={<MailGlyph className="size-3" />} label="Email">
          <span className="truncate">{email}</span>
        </Row>
        <Row icon={<FlagGhanaGlyph className="size-3" />} label="Phone">
          <span className="truncate">{phoneDisplay}</span>
        </Row>
        <Row icon={<BuildingGlyph className="size-4" />} label="Profile Type">
          <CircleCheckGlyph className="size-3 shrink-0" />
          <span className="truncate">Recruiter</span>
        </Row>
        <Row icon={<LockGlyph className="size-4" />} label="Password" last>
          <CircleCheckGlyph className="size-3 shrink-0" />
          <span className="truncate">Secured</span>
        </Row>
      </ul>

      <div
        className="mt-4 h-1 w-full overflow-hidden rounded-full bg-brand-green-light"
        aria-hidden="true"
      />

      <div role="status" className="mt-4">
        <Button
          type="button"
          variant="primary"
          size="lg"
          state="active"
          leftIcon={<LoadingSpinner stroke="#FEF1E7" />}
          rightIcon={<ArrowRightIcon />}
          className="w-full"
          aria-busy="true"
          data-autofocus
        >
          Sending verification code
        </Button>
      </div>
    </ProfileModalShell>
  );
};

export default ProfileCapturedModal;
