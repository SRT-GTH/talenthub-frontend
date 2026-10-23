import { useUiStyle } from '../../../../hooks/useUiStyle.js';
import CirclePersonCardFocused from './CirclePersonCardFocused.jsx';
import CirclePersonCardPlayful from './CirclePersonCardPlayful.jsx';

/*
 * CirclePersonCard — one "person to link up with" card (Figma `Circle card · {name}`, NW-01/02/03/10/11). Focused = horizontal
 * 520px card; Playful = the tilted portrait card with the hero photo (the two frames share no layout, so the style picks the component).
 * Props: person (circleData person), cta ('link-up' | 'learn-from'), status ('none' | 'pending-sent' | 'connected'),
 * following (bool, mentors), index (tilt in Playful), topPick (Playful "TOP PICK" sticker), onLinkUp(person), onNote(person),
 * onLearnFrom(person), onDismiss(person) (Focused only).
 */
const CirclePersonCard = (props) => {
  const { uiStyle } = useUiStyle();
  return uiStyle === 'playful' ? (
    <CirclePersonCardPlayful {...props} />
  ) : (
    <CirclePersonCardFocused {...props} />
  );
};

export default CirclePersonCard;
