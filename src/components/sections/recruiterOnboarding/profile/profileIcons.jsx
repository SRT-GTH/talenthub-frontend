import fieldUser from '../../../../assets/recruiter-onboarding/profile/field-user.svg';
import fieldMail from '../../../../assets/recruiter-onboarding/profile/field-mail.svg';
import fieldLock from '../../../../assets/recruiter-onboarding/profile/field-lock.svg';
import helperDiamond from '../../../../assets/recruiter-onboarding/profile/helper-diamond.svg';
import eye from '../../../../assets/recruiter-onboarding/profile/eye.svg';
import flagGhana from '../../../../assets/recruiter-onboarding/profile/flag-ghana.svg';
import flagChevron from '../../../../assets/recruiter-onboarding/profile/flag-chevron.svg';
import modalClose from '../../../../assets/recruiter-onboarding/profile/modal-close.svg';
import modalCheck from '../../../../assets/recruiter-onboarding/profile/modal-check.svg';
import rowUser from '../../../../assets/recruiter-onboarding/profile/row-user.svg';
import rowMail from '../../../../assets/recruiter-onboarding/profile/row-mail.svg';
import rowBuilding from '../../../../assets/recruiter-onboarding/profile/row-building.svg';
import rowCheckCircle from '../../../../assets/recruiter-onboarding/profile/row-check-circle.svg';
import rowLock from '../../../../assets/recruiter-onboarding/profile/row-lock.svg';
import rowPhone from '../../../../assets/recruiter-onboarding/profile/row-phone.svg';
import shield from '../../../../assets/recruiter-onboarding/profile/shield.svg';
import otpHeroDoc from '../../../../assets/recruiter-onboarding/profile/otp-hero-doc.svg';
import otpClock from '../../../../assets/recruiter-onboarding/profile/otp-clock.svg';
import otpSmsPill from '../../../../assets/recruiter-onboarding/profile/otp-sms-pill-icon.svg';
import otpEmailPill from '../../../../assets/recruiter-onboarding/profile/otp-email-pill-icon.svg';
import { classNames } from '../../../../utils/classNames.js';

/*
 * Figma-exported glyphs for the recruiter profile step (R01/R02). Every file in
 * src/assets/recruiter-onboarding/profile/ is an export of the exact Figma node
 * (node ids per export below and in notes_profile.md). Nothing is redrawn.
 *
 * Mask glyphs: the exported SVG is used as a CSS mask so the same Figma shape
 * takes the state colour (grey / green / red) from currentColor. Multi-colour
 * or fixed-colour exports (flag, hero doc, building, check tile) render as <img>.
 */
// Vite may inline small SVGs as data URIs (quotes/parens) - always quote + escape for url().
const maskUrl = (src) => `url("${src.replace(/"/g, '%22')}")`;

const Mask = ({ src, className }) => (
  <span
    aria-hidden="true"
    className={classNames('inline-block shrink-0 bg-current', className)}
    style={{
      WebkitMaskImage: maskUrl(src),
      maskImage: maskUrl(src),
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
    }}
  />
);

const Img = ({ src, className }) => (
  <img src={src} alt="" aria-hidden="true" draggable="false" className={className} />
);

// field icons 16px: 7374:1592 / 1593 / 1595 ;2278:7334 (20-user / 20-mail / 20-lock)
export const FieldUserGlyph = ({ className = 'size-4' }) => (
  <Mask src={fieldUser} className={className} />
);
export const FieldMailGlyph = ({ className = 'size-4' }) => (
  <Mask src={fieldMail} className={className} />
);
export const FieldLockGlyph = ({ className = 'size-4' }) => (
  <Mask src={fieldLock} className={className} />
);
// helper-row diamond 16px: I7374:1593;2282:7508 (20-alert)
export const DiamondAlertIcon = ({ className }) => (
  <Mask src={helperDiamond} className={className} />
);
// eye 20x19: I7374:1595;2353:11474
export const EyeGlyph = ({ className = 'h-[19px] w-5' }) => (
  <Mask src={eye} className={className} />
);
// phone prefix: I7374:1594;2389:19836 (flag), ;2389:19837 (chevron)
export const FlagGhanaGlyph = ({ className = 'size-5' }) => (
  <Img src={flagGhana} className={className} />
);
export const FlagChevronGlyph = ({ className = 'size-2' }) => (
  <Mask src={flagChevron} className={className} />
);
// modal chrome
export const ModalCloseGlyph = ({ className = 'size-4' }) => (
  <Mask src={modalClose} className={className} />
); // 7374:2472
export const ModalCheckGlyph = ({ className = 'size-7' }) => (
  <Img src={modalCheck} className={className} />
); // 7374:2476
export const ShieldGlyph = ({ className }) => <Mask src={shield} className={className} />; // 7374:2521
// summary rows
export const UserGlyph = ({ className }) => <Mask src={rowUser} className={className} />; // 7374:2486
export const MailGlyph = ({ className }) => <Mask src={rowMail} className={className} />; // 7374:2491
export const BuildingGlyph = ({ className }) => <Img src={rowBuilding} className={className} />; // 7374:2502
export const CircleCheckGlyph = ({ className }) => (
  <Mask src={rowCheckCircle} className={className} />
); // 7374:2505
export const LockGlyph = ({ className }) => <Mask src={rowLock} className={className} />; // 7374:2509
export const PhoneGlyph = ({ className }) => <Mask src={rowPhone} className={className} />; // 7374:3729
// OTP modal
export const DocCheckGlyph = ({ className }) => <Img src={otpHeroDoc} className={className} />; // 7374:2778
export const ClockGlyph = ({ className }) => <Mask src={otpClock} className={className} />; // 7374:2819
export const SmsPillGlyph = ({ className }) => <Mask src={otpSmsPill} className={className} />; // 7374:2787
export const EmailPillGlyph = ({ className }) => <Mask src={otpEmailPill} className={className} />; // 7374:2794
