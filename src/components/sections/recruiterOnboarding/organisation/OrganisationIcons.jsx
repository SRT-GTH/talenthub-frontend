import typeBuildingGrey from '../../../../assets/recruiter-onboarding/organisation/type-building-grey.svg';
import typeBuildingGreen from '../../../../assets/recruiter-onboarding/organisation/type-building-green.svg';
import typeUsersGrey from '../../../../assets/recruiter-onboarding/organisation/type-users-grey.svg';
import typeUsersGreen from '../../../../assets/recruiter-onboarding/organisation/type-users-green.svg';
import shield18 from '../../../../assets/recruiter-onboarding/organisation/shield-18.svg';
import shield12 from '../../../../assets/recruiter-onboarding/organisation/shield-12.svg';
import search16Default from '../../../../assets/recruiter-onboarding/organisation/search-16-default.svg';
import search16Active from '../../../../assets/recruiter-onboarding/organisation/search-16-active.svg';
import search22Empty from '../../../../assets/recruiter-onboarding/organisation/search-22-empty.svg';
import arrowRow18 from '../../../../assets/recruiter-onboarding/organisation/arrow-row-18.svg';
import warning18 from '../../../../assets/recruiter-onboarding/organisation/warning-18.svg';
import successCheck28 from '../../../../assets/recruiter-onboarding/organisation/success-check-28.svg';
import building16 from '../../../../assets/recruiter-onboarding/organisation/building-16.svg';
import building20 from '../../../../assets/recruiter-onboarding/organisation/building-20.svg';
import mail12 from '../../../../assets/recruiter-onboarding/organisation/mail-12.svg';
import alert16Green from '../../../../assets/recruiter-onboarding/organisation/alert-16-green.svg';
import placeholderCircle16 from '../../../../assets/recruiter-onboarding/organisation/placeholder-circle-16.svg';
import arrowheadGreen from '../../../../assets/recruiter-onboarding/organisation/arrowhead-down-green.svg';
import arrowheadRed from '../../../../assets/recruiter-onboarding/organisation/arrowhead-down-red.svg';
import close16 from '../../../../assets/recruiter-onboarding/organisation/close-16.svg';

/*
 * OrganisationIcons - every icon here is an EXPORT of the Figma node (no redraws).
 * Files live in src/assets/recruiter-onboarding/organisation/; node ids are listed in
 * notes_organisation.md. All are decorative (alt="" + aria-hidden).
 */
const Img = ({ src, className }) => (
  <img src={src} alt="" aria-hidden="true" draggable={false} className={className} />
);

export const TypeDedicatedIcon = ({ selected, className }) => (
  <Img src={selected ? typeBuildingGreen : typeBuildingGrey} className={className} />
);
export const TypeFreelanceIcon = ({ selected, className }) => (
  <Img src={selected ? typeUsersGreen : typeUsersGrey} className={className} />
);
export const BuildingIcon = ({ className, size = 16 }) => (
  <Img src={size === 20 ? building20 : building16} className={className} />
);
export const ShieldOutlineIcon = ({ className }) => <Img src={shield18} className={className} />;
export const ShieldSmallIcon = ({ className }) => <Img src={shield12} className={className} />;
export const WarningIcon = ({ className }) => <Img src={warning18} className={className} />;
export const ArrowRowIcon = ({ className }) => <Img src={arrowRow18} className={className} />;
export const SearchGlyph = ({ className, variant = 'default' }) => (
  <Img
    src={
      variant === 'empty' ? search22Empty : variant === 'active' ? search16Active : search16Default
    }
    className={className}
  />
);
export const StatusMailIcon = ({ className }) => <Img src={mail12} className={className} />;
export const PlaceholderCircle = ({ className }) => (
  <Img src={placeholderCircle16} className={className} />
);
export const DiamondAlertIcon = ({ className }) => <Img src={alert16Green} className={className} />;
export const ArrowheadDownIcon = ({ className, tone = 'green' }) => (
  <Img src={tone === 'red' ? arrowheadRed : arrowheadGreen} className={className} />
);
export const SuccessCheckBadgeIcon = ({ className }) => (
  <Img src={successCheck28} className={className} />
);
export const CloseSmallIcon = ({ className }) => <Img src={close16} className={className} />;
