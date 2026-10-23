import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY } from './circleData.js';
import { CircleCheckIcon, CircleCommentIcon } from './circleIcons.jsx';
import CircleButton from './CircleButton.jsx';
import { FOCUS_RING } from './circleStyles.js';

/*
 * CircleCardActions — Figma `Actions` of a circle card: the main button (full width) + the 38px "add a note" square.
 *   cta 'link-up'     → "Link up" (primary) · once sent: "Link-up sent" (soft, check, not clickable)
 *   cta 'learn-from'  → "Learn from" (soft, verified mentors: you follow them, they never get a request) · followed: "Following"
 * Props: person, cta, status ('none' | 'pending-sent' | 'connected'), following (bool), onLinkUp(person), onNote(person),
 * onLearnFrom(person).
 * ⚠️ ASSUMPTION: the "Link-up sent" and "Following" button states are not drawn in Figma (the caption of flow step 5 says the card
 * changes to "Link-up sent"); they reuse the soft button with a check.
 */
const CircleCardActions = ({ person, cta, status, following, onLinkUp, onNote, onLearnFrom }) => {
  const sent = status === 'pending-sent';
  let main;
  if (cta === 'learn-from') {
    main = (
      <CircleButton
        tone="soft"
        className="w-full flex-1"
        aria-pressed={following}
        onClick={() => onLearnFrom(person)}
      >
        {following ? COPY.following : COPY.learnFrom}
      </CircleButton>
    );
  } else if (sent || status === 'connected') {
    main = (
      <CircleButton tone="soft" className="w-full flex-1 gap-[8px]" disabled aria-disabled="true">
        <CircleCheckIcon className="size-[16px]" />
        {status === 'connected' ? COPY.inYourCircle : COPY.linkUpSent}
      </CircleButton>
    );
  } else {
    main = (
      <CircleButton className="w-full flex-1" onClick={() => onLinkUp(person)}>
        {COPY.linkUp}
      </CircleButton>
    );
  }
  return (
    <div className="flex items-center gap-[8px]">
      {main}
      <button
        type="button"
        aria-label={`Add a note for ${person.firstName}`}
        disabled={sent || status === 'connected'}
        onClick={() => onNote(person)}
        className={classNames(
          'flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#e7e7e7] bg-white p-0 text-[#1c2a21] disabled:cursor-not-allowed disabled:opacity-50 max-lg:size-[44px]',
          'playful:border-[rgba(28,42,33,0.35)]',
          FOCUS_RING
        )}
      >
        <CircleCommentIcon className="size-[16px]" />
      </button>
    </div>
  );
};

export default CircleCardActions;
