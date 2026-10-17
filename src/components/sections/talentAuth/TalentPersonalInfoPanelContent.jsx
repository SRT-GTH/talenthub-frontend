import photo1 from '../../../assets/hero/talent-personal-panel-centre.webp';
import photo2 from '../../../assets/hero/talent-personal-panel-top-left.webp';
import photo3 from '../../../assets/hero/talent-personal-panel-bottom-left.webp';
import ellipseCard1 from '../../../assets/hero/talent-panel-card-ellipse-1.svg';
import ellipseCard23 from '../../../assets/hero/talent-panel-card-ellipse-23.svg';
import sparkle26 from '../../../assets/hero/talent-panel-sparkle-26.svg';
import arrowDown from '../../../assets/hero/talent-panel-arrow-down.svg';
import arrowScribble from '../../../assets/hero/talent-panel-arrow-scribble.svg';
import {
  AdultYouthCard,
  DataProtectedChip,
  GdpaBadge,
  PanelStage,
  StageCard,
  StageSparkle,
  StageWatchTutorial,
} from './TalentPanelParts.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('TalentPersonalInfoPanelContent');

/*
 * TalentPersonalInfoPanelContent - right-panel composition for the Personal
 * info step ("Build Your Profile").
 *
 * Figma: panel 'Frame 141' 8027:204534 (739 x 916) in 8027:204466 / 204726 /
 * 204987 / 205248 / 205509 / 205770 (identical in every state). Same stage
 * contract as TalentDobPanelContent (see TalentPanelParts): % of an
 * aspect-locked stage + container units, nothing in vw.
 *
 * Geometry (centre of rotated bbox, % of 739 x 916; side = bbox/(cos t+sin t)):
 *   8027:204544 top-left    rot -8    side 331.5 -> 44.86%  ctr (30.25, 23.44) #ebc2bd
 *   8027:204538 centre      rot +5    side 312.1 -> 42.23%  ctr (69.43, 48.04) #eedeb8
 *   8027:204547 bottom-left rot +4.74 side 331.5 -> 44.86%  ctr (30.34, 74.59) #c1d4c4
 * Stacking (Figma order): centre card, top-left, bottom-left, chips, sparkle,
 * arrows, Adult/Youth card, watch tutorial.
 * Arrows: 8027:204571 (95.1 x 96, opacity .5) and 8027:204572 (58.5 x 58.5).
 */

export const PANEL_REF_H = 916;

// eslint-disable-next-line react-refresh/only-export-components
export const PERSONAL_PHOTO_CARDS = [
  {
    photo: photo1,
    cx: 69.43,
    cy: 48.04,
    size: 42.23,
    rotate: 5,
    borderColor: '#eedeb8',
    ellipse: ellipseCard1,
    inset: [-17.98, -9.31, -1.89, -10.56],
  },
  {
    photo: photo2,
    cx: 30.25,
    cy: 23.44,
    size: 44.86,
    rotate: -8,
    borderColor: '#ebc2bd',
    ellipse: ellipseCard23,
    inset: [-17.98, -9.9, -2.47, -10.56],
  },
  {
    photo: photo3,
    cx: 30.34,
    cy: 74.59,
    size: 44.86,
    rotate: 4.74,
    borderColor: '#c1d4c4',
    ellipse: ellipseCard23,
    inset: [-17.98, -9.89, -2.47, -10.56],
  },
];

export const PersonalOverlayCards = () => {
  log('render overlays');
  return (
    <PanelStage refH={PANEL_REF_H}>
      {PERSONAL_PHOTO_CARDS.map((card) => (
        <StageCard key={card.borderColor} {...card} />
      ))}
      <DataProtectedChip left={3.38} top={36.56} />
      <GdpaBadge left={54.79} top={22.81} />
      {/* sparkle-26 8027:204569 - ctr (47.94%, 2.24%), rot 21.55 */}
      <StageSparkle src={sparkle26} cx={47.94} cy={2.24} rotate={21.55} />
      {/* arrow 8027:204571 - ctr (18.34%, 51.09%), 12.87% wide, opacity .5 */}
      <img
        src={arrowDown}
        alt=""
        draggable={false}
        className="absolute block max-w-none opacity-50"
        style={{
          left: '18.34%',
          top: '51.09%',
          width: '12.87%',
          aspectRatio: '95.1 / 96',
          transform: 'translate(-50%, -50%) rotate(90deg)',
        }}
      />
      {/* arrow 8027:204572 - ctr (88.26%, 68.48%), 7.92% wide */}
      <img
        src={arrowScribble}
        alt=""
        draggable={false}
        className="absolute block max-w-none"
        style={{
          left: '88.26%',
          top: '68.48%',
          width: '7.92%',
          aspectRatio: '1',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <AdultYouthCard left={60.39} top={70.2} />
      <StageWatchTutorial refH={PANEL_REF_H} />
    </PanelStage>
  );
};

export default function TalentPersonalInfoPanelContent() {
  return <PersonalOverlayCards />;
}
