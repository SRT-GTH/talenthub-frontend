import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY } from './circleData.js';
import { CircleCheckIcon } from './circleIcons.jsx';
import CircleAvatar from './CircleAvatar.jsx';
import CircleButton from './CircleButton.jsx';
import CircleMentorChip from './CircleMentorChip.jsx';
import CircleMutualFaces from './CircleMutualFaces.jsx';
import { personHref } from './circleState.js';
import { FOCUS_RING } from './circleStyles.js';

const FACES = {
  'esi-quaye': ['efua-asante', 'kojo-annan'],
  'nana-yaw-mensah': ['akosua-mensah', 'yaw-darko'],
  'adwoa-sarpong': ['kwame-boateng', 'abena-owusu'],
};

/*
 * CircleInvitationRow — Figma `Invitation · {name}` (NW-01 preview, NW-04 list): 56px avatar, name + "2nd" degree chip (+ Verified
 * mentor), headline, mutual faces + "{n} in your circle know them · {ago}", the sender's note in a quote box, and Ignore / Accept.
 * Accepted (NW-04 Nana Yaw): the row turns #f8f8f4, the buttons become the "In your circle" chip + "Say hi".
 * Props: person, invite ({ ago, note }), accepted (bool), divided (top rule, rows 2+ of the full list), xp (Playful "+5 XP" sticker
 * over an accepted row), onAccept(person), onIgnore(person), onSayHi(person).
 */
const CircleInvitationRow = ({
  person,
  invite,
  accepted,
  divided,
  xp,
  onAccept,
  onIgnore,
  onSayHi,
}) => (
  <li
    className={classNames(
      'relative flex gap-[14px] px-[16px] py-[14px] max-md:flex-col',
      divided && 'border-t border-solid border-[#e7e7e7]',
      accepted && 'bg-[#f8f8f4]'
    )}
  >
    <Link
      to={personHref(person.id)}
      aria-label={`View ${person.name}'s profile`}
      className={`shrink-0 self-start rounded-full ${FOCUS_RING}`}
    >
      <CircleAvatar id={person.id} size={56} />
    </Link>
    <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
      <div className="flex flex-wrap items-center gap-[6px]">
        <Link
          to={personHref(person.id)}
          className={`font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21] no-underline ${FOCUS_RING}`}
        >
          {person.name}
        </Link>
        <span className="rounded-[6px] bg-[#f8f8f4] px-[6px] py-[1px] font-sans text-[11px] font-semibold leading-[13px] text-[#737373] max-lg:text-[12px]">
          {person.degree}
        </span>
        {person.verifiedMentor && <CircleMentorChip />}
      </div>
      <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[14px] max-lg:leading-[18px]">
        {person.headline}
      </p>
      <div className="flex items-center gap-[6px]">
        <CircleMutualFaces ids={FACES[person.id] ?? []} />
        <span className="font-sans text-[12px] leading-[14px] text-[#737373] max-lg:text-[13px]">
          {`${person.mutual} in your circle know them · ${invite.ago}`}
        </span>
      </div>
      {invite.note && (
        <p className="m-0 mt-[4px] rounded-[12px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] px-[12px] py-[10px] font-sans text-[13px] leading-[19px] text-[#1c2a21] max-lg:text-[14px]">
          {invite.note}
        </p>
      )}
    </div>
    <div className="flex shrink-0 items-start gap-[8px] max-md:flex-wrap">
      {accepted ? (
        <>
          <span className="mt-[14px] inline-flex h-[22px] items-center gap-[5px] rounded-full bg-[#ebf1ec] px-[10px] font-sans text-[12px] font-semibold leading-[14px] text-[#387440] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]">
            <CircleCheckIcon className="size-[13px]" />
            {COPY.inYourCircle}
          </span>
          <CircleButton tone="soft" onClick={() => onSayHi(person)}>
            {COPY.sayHi}
          </CircleButton>
        </>
      ) : (
        <>
          <CircleButton tone="soft" onClick={() => onIgnore(person)}>
            {COPY.ignore}
          </CircleButton>
          <CircleButton className="mt-[4px]" onClick={() => onAccept(person)}>
            {COPY.accept}
          </CircleButton>
        </>
      )}
    </div>
    {xp && accepted && (
      <span className="absolute -top-[64px] right-[40px] z-10 hidden rotate-[4deg] items-center whitespace-nowrap rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[10px] py-[8px] font-sans text-[11px] max-lg:text-[12px] font-bold leading-[13px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-flex">
        {COPY.xp}
      </span>
    )}
  </li>
);

export default CircleInvitationRow;
