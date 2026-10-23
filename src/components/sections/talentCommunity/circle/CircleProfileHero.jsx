import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY } from './circleData.js';
import { CircleCheckIcon, CircleGlobeIcon, CircleMoreIcon } from './circleIcons.jsx';
import CircleAvatar from './CircleAvatar.jsx';
import CircleButton from './CircleButton.jsx';
import CircleMutualFaces from './CircleMutualFaces.jsx';
import { CARD, FOCUS_RING, HEADING, STICKER } from './circleStyles.js';

/*
 * CircleProfileHero — Figma `Profile hero` (NW-06 connected / NW-06b not connected): a 120px cover (flat #dce7de; Playful: the
 * #2e6436 → #7dba4b gradient), the 120px avatar overlapping it (4px white ring), name 28/33 + degree chip (+ the yellow
 * "OPEN TO INTERNSHIPS" sticker in Playful), tagline, location + mutual faces + "{n} in his circle", and the actions.
 *   connected      → Message (primary) · "In your circle" chip · Follow (soft) · "…"
 *   not connected  → Link up (primary) · Follow (soft) · Message (soft)
 * Props: person, profile, degree ('1st' | '2nd'), connected (bool), pending (bool, link-up sent), following (bool), onLinkUp(),
 * onMessage(), onFollow(). ⚠️ The name sits over the cover as drawn (dark on the Playful gradient: low contrast in Figma itself).
 */
const CircleProfileHero = ({
  person,
  profile,
  degree,
  connected,
  pending,
  following,
  onLinkUp,
  onMessage,
  onFollow,
}) => (
  <section className={classNames(CARD, 'relative flex flex-col overflow-hidden pb-[22px]')}>
    <div
      aria-hidden="true"
      className="h-[120px] w-full shrink-0 bg-[#dce7de] playful:bg-[linear-gradient(90deg,#2e6436_0%,#7dba4b_100%)]"
    />
    <div className="-mt-[50px] flex flex-wrap items-end gap-x-[20px] gap-y-[12px] px-[28px] max-sm:px-[16px]">
      <CircleAvatar
        id={person.id}
        kind="profile"
        size={120}
        ring={false}
        className="border-[4px] border-solid border-white max-sm:size-[96px]"
      />
      <div className="flex min-w-[240px] flex-1 flex-col gap-[6px] pb-[4px]">
        <div className="flex flex-wrap items-center gap-[8px]">
          <h1
            className={classNames(
              HEADING,
              'text-[28px] leading-[33px] max-sm:text-[24px] max-sm:leading-[29px]'
            )}
          >
            {person.name}
          </h1>
          <span className="rounded-[6px] bg-[#f8f8f4] px-[6px] py-[1px] font-sans text-[11px] font-semibold leading-[13px] text-[#737373] max-lg:text-[12px]">
            {degree}
          </span>
          {profile.openTo && (
            <span className={classNames(STICKER, 'rotate-[3deg]')}>{profile.openTo}</span>
          )}
        </div>
        <p className="m-0 font-sans text-[15px] leading-[18px] text-[#595959] max-lg:text-[14px] max-lg:leading-[20px]">
          {profile.tagline}
        </p>
        <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[6px]">
          <span className="inline-flex items-center gap-[5px] font-sans text-[13px] leading-[16px] text-[#737373] max-lg:text-[14px]">
            <CircleGlobeIcon className="size-[14px]" />
            {profile.location}
          </span>
          <span className="inline-flex items-center gap-[6px]">
            <CircleMutualFaces ids={['abena-owusu', 'efua-asante', 'kwame-boateng']} size={22} />
            <span className="font-sans text-[13px] font-medium leading-[16px] text-[#387440] max-lg:text-[14px]">
              {profile.mutualLine}
            </span>
          </span>
          {profile.circleSize && (
            <span className="font-sans text-[13px] leading-[16px] text-[#737373] max-lg:text-[14px]">
              {profile.circleSize}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-[10px] pb-[4px]">
        {connected ? (
          <>
            <CircleButton onClick={onMessage}>{COPY.message}</CircleButton>
            <span className="inline-flex h-[22px] items-center gap-[5px] rounded-full bg-[#ebf1ec] px-[10px] font-sans text-[12px] font-semibold leading-[14px] text-[#387440] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]">
              <CircleCheckIcon className="size-[13px]" />
              {COPY.inYourCircle}
            </span>
            <CircleButton tone="soft" aria-pressed={following} onClick={onFollow}>
              {following ? COPY.following : COPY.follow}
            </CircleButton>
            <button
              type="button"
              aria-label={`More for ${person.name}`}
              className={classNames(
                'flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[#e7e7e7] bg-white p-0 text-[#595959] max-lg:size-[44px]',
                'playful:border-[rgba(28,42,33,0.35)]',
                FOCUS_RING
              )}
            >
              <CircleMoreIcon className="size-[16px]" />
            </button>
          </>
        ) : (
          <>
            {pending ? (
              <CircleButton tone="soft" disabled aria-disabled="true" className="gap-[8px]">
                <CircleCheckIcon className="size-[16px]" />
                {COPY.linkUpSent}
              </CircleButton>
            ) : (
              <CircleButton onClick={onLinkUp}>{COPY.linkUp}</CircleButton>
            )}
            <CircleButton tone="soft" aria-pressed={following} onClick={onFollow}>
              {following ? COPY.following : COPY.follow}
            </CircleButton>
            <CircleButton tone="soft" onClick={onMessage}>
              {COPY.message}
            </CircleButton>
          </>
        )}
      </div>
    </div>
  </section>
);

export default CircleProfileHero;
