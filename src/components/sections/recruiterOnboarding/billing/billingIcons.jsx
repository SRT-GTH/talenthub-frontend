import checkCircle16 from '../../../../assets/recruiter-onboarding/billing/check-circle-16.svg';
import checkCircle12 from '../../../../assets/recruiter-onboarding/billing/check-circle-12.svg';
import checkCircleFill22 from '../../../../assets/recruiter-onboarding/billing/check-circle-fill-22.svg';
import checkCircleFill16 from '../../../../assets/recruiter-onboarding/billing/check-circle-fill-16.svg';
import checkTile64 from '../../../../assets/recruiter-onboarding/billing/check-tile-64.svg';
import shield18 from '../../../../assets/recruiter-onboarding/billing/shield-18.svg';
import shield12 from '../../../../assets/recruiter-onboarding/billing/shield-12.svg';
import card18 from '../../../../assets/recruiter-onboarding/billing/card-18.svg';
import card16 from '../../../../assets/recruiter-onboarding/billing/card-16.svg';
import phone18 from '../../../../assets/recruiter-onboarding/billing/phone-18.svg';
import phone16 from '../../../../assets/recruiter-onboarding/billing/phone-16.svg';
import user16 from '../../../../assets/recruiter-onboarding/billing/user-16.svg';
import lock16 from '../../../../assets/recruiter-onboarding/billing/lock-16.svg';
import calendar16 from '../../../../assets/recruiter-onboarding/billing/calendar-16.svg';
import calendar16Dialog from '../../../../assets/recruiter-onboarding/billing/calendar-16-dialog.svg';
import alertDiamond from '../../../../assets/recruiter-onboarding/billing/alert-diamond.svg';
import arrowRightWhite from '../../../../assets/recruiter-onboarding/billing/arrow-right-white.svg';
import close28 from '../../../../assets/recruiter-onboarding/billing/close-28.svg';
import chevronDown8 from '../../../../assets/recruiter-onboarding/billing/chevron-down-8.svg';
import ghanaFlag20 from '../../../../assets/recruiter-onboarding/billing/ghana-flag-20.svg';
import logoMtn from '../../../../assets/recruiter-onboarding/billing/logo-mtn-momo.png';
import logoTelecel from '../../../../assets/recruiter-onboarding/billing/logo-telecel-cash.png';
import logoAirtelTigo from '../../../../assets/recruiter-onboarding/billing/logo-airteltigo-money.png';

/*
 * billingIcons - every icon / logo on the recruiter Plan + Payment steps is an
 * EXPORT of the Figma node (owner order: nothing redrawn). Files live in
 * src/assets/recruiter-onboarding/billing/; the node id of each is listed in
 * notes_billing.md. Each component is a decorative <img> that fills the box the
 * caller sizes with `className` (Figma sizes: see each name).
 */
const make = (src) => {
  const Icon = ({ className }) => (
    <img src={src} alt="" aria-hidden="true" draggable="false" className={className} />
  );
  return Icon;
};

export const CheckCircleIcon = make(checkCircle16); // 7374:6927 (16)
export const CheckCircleSmallIcon = make(checkCircle12); // 7374:8986 (12)
export const CheckCircleDialogIcon = make(checkCircle16); // 7374:8983 (16)
export const CheckCircleFillIcon = make(checkCircleFill22); // 7374:7710 (22)
export const CheckCircleFillSmallIcon = make(checkCircleFill16); // 7374:8966 (16)
export const CheckTileIcon = make(checkTile64); // 7374:8686 (64 tile)
export const ShieldIcon = make(shield18); // 7374:7001 (18)
export const ShieldSmallIcon = make(shield12); // 7374:8713 (12)
export const CardIcon = make(card16); // I7374:7723;2278:7334 / 7374:8698 (16)
export const CardTabIcon = make(card18); // 7374:7717 (18)
export const PhoneIcon = make(phone16); // 7374:8703 (16)
export const PhoneTabIcon = make(phone18); // 7374:7720 (18)
export const UserIcon = make(user16); // I7374:7722;2278:7334
export const LockIcon = make(lock16); // I7374:7725;2278:7334
export const CalendarIcon = make(calendar16); // I7374:7724;2278:7334
export const CalendarDialogIcon = make(calendar16Dialog); // 7374:8989
export const DiamondAlertIcon = make(alertDiamond); // I7374:8185;2282:7549
export const ArrowRightIcon = make(arrowRightWhite); // I7374:7004;57:6266 (20)
export const CloseTileIcon = make(close28); // 7374:8681 (28 round close)
export const ChevronDownIcon = make(chevronDown8); // I7374:8424;2397:31660 (8)
export const GhanaFlagIcon = make(ghanaFlag20); // I7374:8424;2397:31659 (20)

export const MtnMark = make(logoMtn); // 7377:7172 (24)
export const TelecelMark = make(logoTelecel); // 7377:7173 (24)
export const AirtelTigoMark = make(logoAirtelTigo); // 7377:7175 (24)
