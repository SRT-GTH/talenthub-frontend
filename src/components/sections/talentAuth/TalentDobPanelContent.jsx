import photo1 from '../../../assets/hero/talent-dob-panel-centre.webp';
import photo2 from '../../../assets/hero/talent-dob-panel-top-left.webp';
import photo3 from '../../../assets/hero/talent-dob-panel-bottom-left.webp';
import ellipseCard1 from '../../../assets/hero/talent-panel-card-ellipse-1.svg';
import ellipseCard23 from '../../../assets/hero/talent-panel-card-ellipse-23.svg';
import sparkle26 from '../../../assets/hero/talent-panel-sparkle-26.svg';
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

const log = debug('TalentDobPanelContent');

/*
 * TalentDobPanelContent - right-panel composition for the DOB step
 * (talent onboarding step 1, "When were you born?").
 *
 * Figma: panel 'Frame 150' 8027:203076 (739 x 916) in 8027:202802 /
 * 203008 / 203214 / 203420 / 203626 / 203832 / 204038 / 204258 (identical in all
 * states). Built for the shared panel contract (see TalentOnboardingPanel):
 * everything below is a % of the aspect-locked stage (PanelStage) and every
 * size is a container unit of it, so nothing clips or overlaps on short or
 * narrow screens (1280x560, 1024x600, 1920x700).
 *
 * Geometry (centre of the rotated bounding box, % of 739 x 916; side =
 * bbox / (cos t + sin t)):
 *   8027:203086 top-left    rot +7   side 331.6 -> 44.9%  ctr (30.25, 23.44) #ebc2bd
 *   8027:203080 centre      rot +5   side 288.3 -> 39.0%  ctr (72.22, 48.09) #eedeb8
 *   8027:203089 bottom-left rot -13  side 331.5 -> 44.9%  ctr (27.28, 75.08) #c1d4c4
 * Stacking (Figma order): centre card, top-left, bottom-left, chips, sparkle,
 * Adult/Youth card, watch-tutorial button.
 *
 * `photoCards` is exported in the same shape as the parent flow's configs so a
 * caller can spread it onto the shared panel; the stage renders it itself so
 * border/radius scale with the card (the shared PhotoCard sizes them in vw).
 */

export const PANEL_REF_H = 916;

// eslint-disable-next-line react-refresh/only-export-components
export const DOB_PHOTO_CARDS = [
  {
    photo: photo1,
    cx: 72.22,
    cy: 48.09,
    size: 39.0,
    rotate: 5,
    borderColor: '#eedeb8',
    ellipse: ellipseCard1,
    inset: [-17.98, -9.18, -1.76, -10.56],
  },
  {
    photo: photo2,
    cx: 30.25,
    cy: 23.44,
    size: 44.86,
    rotate: 7,
    borderColor: '#ebc2bd',
    ellipse: ellipseCard23,
    inset: [-17.98, -9.9, -2.47, -10.56],
  },
  {
    photo: photo3,
    cx: 27.28,
    cy: 75.08,
    size: 44.86,
    rotate: -13,
    borderColor: '#c1d4c4',
    ellipse: ellipseCard23,
    inset: [-17.98, -9.89, -2.47, -10.56],
  },
];

export const DobOverlayCards = () => {
  log('render overlays');
  return (
    <PanelStage refH={PANEL_REF_H}>
      {DOB_PHOTO_CARDS.map((card) => (
        <StageCard key={card.borderColor} {...card} />
      ))}
      {/* Data Protected chip 8027:203092 - left 3.38% top 36.56% */}
      <DataProtectedChip left={3.38} top={36.56} />
      {/* GDPA badge 8027:203105 - left 54.79% top 22.81% */}
      <GdpaBadge left={54.79} top={22.81} />
      {/* sparkle-26 8027:203111 - ctr (43.96%, 53.35%), rot 32 */}
      <StageSparkle src={sparkle26} cx={43.96} cy={53.35} rotate={32} />
      {/* Adult / Youth card 8027:203112 - left 60.39% top 70.2% */}
      <AdultYouthCard left={60.39} top={70.2} />
      {/* Watch tutorial 8027:203121 */}
      <StageWatchTutorial refH={PANEL_REF_H} />
    </PanelStage>
  );
};

// Photo cards are drawn by the stage, so the shared panel gets none.
// eslint-disable-next-line react-refresh/only-export-components
export const DOB_PANEL_PROPS = {
  photoCards: [],
  showWatchTutorial: false,
};

export default function TalentDobPanelContent() {
  return <DobOverlayCards />;
}
