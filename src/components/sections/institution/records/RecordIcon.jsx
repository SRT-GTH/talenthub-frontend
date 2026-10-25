import {
  RecordsIconBulb,
  RecordsIconBulb25,
  RecordsIconChartbar,
  RecordsIconCheckcfill,
  RecordsIconDns,
  RecordsIconFile,
  RecordsIconFunc,
  RecordsIconGrad,
  RecordsIconHealth,
  RecordsIconHeart,
  RecordsIconPhone,
  RecordsIconPin,
  RecordsIconTarget,
  RecordsIconTarget15,
  RecordsIconTrend,
  RecordsIconTrophy,
  RecordsIconUsers,
  RecordsIconVoice,
  RecordsIconVoice15,
  RecordsIconVoice21,
  RecordsIconWallet,
} from './recordsIcons.jsx';

/* RecordIcon — resolves the icon names used in data/recordsData.js to the Figma SVG components. Props: name, size ('chip' | 'row' | 'skill' | 'exp' | 'badge'), className. */
const SETS = {
  chip: {
    target: RecordsIconTarget,
    pin: RecordsIconPin,
    voice: RecordsIconVoice,
    bulb: RecordsIconBulb,
    health: RecordsIconHealth,
    users: RecordsIconUsers,
    heart: RecordsIconHeart,
  },
  skill: {
    chartbar: RecordsIconChartbar,
    dns: RecordsIconDns,
    func: RecordsIconFunc,
    voice: RecordsIconVoice21,
  },
  exp: { trend: RecordsIconTrend, grad: RecordsIconGrad },
  row: {
    target: RecordsIconTarget15,
    file: RecordsIconFile,
    voice: RecordsIconVoice15,
    phone: RecordsIconPhone,
    wallet: RecordsIconWallet,
  },
  badge: {
    trophy: RecordsIconTrophy,
    check: RecordsIconCheckcfill,
    bulb: RecordsIconBulb25,
  },
};

const RecordIcon = ({ name, size = 'chip', className }) => {
  const Icon = SETS[size]?.[name];
  return Icon ? <Icon className={className} /> : null;
};

export default RecordIcon;
