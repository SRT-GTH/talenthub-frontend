import AgencyNavItem from '../agency/AgencyNavItem.jsx';
import {
  InstitutionCredentialsIcon,
  InstitutionHomeIcon,
  InstitutionMessagesIcon,
  InstitutionProgrammesIcon,
  InstitutionProgressIcon,
  InstitutionRecordsIcon,
  InstitutionStudentsIcon,
} from './institutionIcons.jsx';

/*
 * InstitutionNavItem — "GTH-DASH · Nav item" of the institution rail (Figma 8585:417 active / 8585:418 inactive). The same component as the
 * agency rail item: it renders AgencyNavItem with the institution icon set (expanded 255 x 44 tile with label, or the 44px icon-only rail tile).
 * Props: item, active, variant ('expanded' | 'rail'), onNavigate.
 */

const NAV_ICONS = {
  home: InstitutionHomeIcon,
  students: InstitutionStudentsIcon,
  programmes: InstitutionProgrammesIcon,
  messages: InstitutionMessagesIcon,
  records: InstitutionRecordsIcon,
  credentials: InstitutionCredentialsIcon,
  progress: InstitutionProgressIcon,
};

const InstitutionNavItem = (props) => <AgencyNavItem {...props} icons={NAV_ICONS} />;

export default InstitutionNavItem;
