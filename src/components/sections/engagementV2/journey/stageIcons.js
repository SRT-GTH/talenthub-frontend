import {
  BoltIcon,
  BulbIcon,
  CertsIcon,
  FolderIcon,
  HeartIcon,
  PitchIcon,
  TargetIcon,
  UserIcon,
  WorkIcon,
} from './JourneyIcons.jsx';

/* Stage id -> its Figma icon component. */
const STAGE_ICONS = {
  avatar: UserIcon,
  interests: HeartIcon,
  personality: BulbIcon,
  skills: BoltIcon,
  work: WorkIcon,
  portfolio: FolderIcon,
  certs: CertsIcon,
  goals: TargetIcon,
  pitch: PitchIcon,
};

export const stageIconFor = (id) => STAGE_ICONS[id];
