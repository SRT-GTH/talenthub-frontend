import closeSvg from '../../../assets/talent-onboarding/modal-close.svg';
import clockSvg from '../../../assets/talent-onboarding/otp-clock.svg';
import shieldSvg from '../../../assets/talent-onboarding/modal-shield.svg';
import alertSvg from '../../../assets/talent-onboarding/helper-alert.svg';
import mailSvg from '../../../assets/talent-onboarding/field-mail.svg';
import flagSvg from '../../../assets/talent-onboarding/field-flag-ghana.svg';
import successCheckSvg from '../../../assets/talent-onboarding/success-check.svg';
import phoneSvg from '../../../assets/talent-onboarding/success-phone.svg';
import successMailSvg from '../../../assets/talent-onboarding/success-mail.svg';
import pinSvg from '../../../assets/talent-onboarding/field-pin.svg';
import secPersonal from '../../../assets/talent-onboarding/review-sec-personal.svg';
import secIdentity from '../../../assets/talent-onboarding/review-sec-identity.svg';
import secContact from '../../../assets/talent-onboarding/review-sec-contact.svg';
import secAddress from '../../../assets/talent-onboarding/review-sec-address.svg';
import secEducation from '../../../assets/talent-onboarding/review-sec-education.svg';
import reviewCheck from '../../../assets/talent-onboarding/review-check-8.svg';
import mapSvg from '../../../assets/talent-onboarding/field-map.svg';

/*
 * talentIcons - icons for the talent Contact / Address / Education / Review pages,
 * every one an EXPORT of the actual Figma node (owner order: nothing is redrawn).
 * Same component names the pages already used, so the swap is an import change.
 * Node -> file (all Bin8roWL8sloyc36IgFMuT):
 *   close         8027:206939  modal-close.svg        clock     8027:206983  otp-clock.svg
 *   shield        8027:206999  modal-shield.svg       alert     I8027:206289;2388:19397 helper-alert.svg
 *   mail (field)  I8027:206290;2278:7334 field-mail.svg
 *   flag          I8027:206288;2389:19836 field-flag-ghana.svg
 *   success check 8027:207785  success-check.svg (68px incl. 2px shadow bleed)
 *   phone/mail row 8027:207797 / 8027:207802       pin  I8027:209260;2418:40550   map  I8027:209261;2418:40550
 * Colour variants (error / verified tints) are NOT in these exports; Figma shows the
 * default colours only, so className colour utilities have no effect here.
 */
const make = (src) => {
  const Icon = ({ className }) => (
    <img src={src} alt="" aria-hidden="true" className={className} draggable={false} />
  );
  return Icon;
};

export const CloseIcon = make(closeSvg);
export const ClockIcon = make(clockSvg);
export const ShieldCheckIcon = make(shieldSvg);
export const AlertDiamondIcon = make(alertSvg);
export const MailIcon = make(mailSvg);
export const GhanaFlagRoundIcon = make(flagSvg);
export const PhoneRowIcon = make(phoneSvg);
export const MailRowIcon = make(successMailSvg);
export const MapPinIcon = make(pinSvg);
export const MapIcon = make(mapSvg);
export const SuccessCheckIcon = ({ className }) => (
  <img
    src={successCheckSvg}
    alt=""
    aria-hidden="true"
    width="68"
    height="68"
    className={className}
    style={{ margin: -2, maxWidth: 'none' }}
    draggable={false}
  />
);

// Review page section glyphs + 8px check (8027:210862 / 210901 / 210936 / 210966 / 210999 / 210919).
export const ReviewPersonalIcon = make(secPersonal);
export const ReviewIdentityIcon = make(secIdentity);
export const ReviewContactIcon = make(secContact);
export const ReviewAddressIcon = make(secAddress);
export const ReviewEducationIcon = make(secEducation);
export const ReviewCheckIcon = make(reviewCheck);

// Figma 8027 field asterisk: Instrument Sans 600 14/21 #2E8B57 (I8027:206288;2397:31697).
export const TALENT_ASTERISK = 'font-ui font-semibold text-[#2E8B57] text-[14px] leading-[21px]';
