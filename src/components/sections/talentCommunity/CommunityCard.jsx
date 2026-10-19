import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { COMMUNITY_BROWSE_COPY, COMMUNITY_CARD_FACES, formatMembers } from './communityData.js';
import { CommunityMetaUsersIcon, CommunityTagTargetIcon } from './communityBrowseIcons.jsx';
import { CommunityButton } from './CommunityParts.jsx';
import CommunityJoinedMenu from './CommunityJoinedMenu.jsx';
import { EMPHASIS_SURFACE, FOCUS_RING } from './communityStyles.js';

const log = debug('CommunityCard');

/*
 * CommunityCard — Figma component set "GTH · Community card" (7624:4401): State=Join (7624:4337, white card, hairline, green
 * "Join" button) and State=Joined (7624:4369, ink-bordered emphasis card, soft-green "Joined" button, "You’re in" cover tag).
 * 300px wide in the desktop grid (the grid decides: `w-full` here), cover 150px, body padding 16 / gap 8.
 *
 * Props
 *   community   catalogue item (GET /communities): { id, name, members, activity, description, cover, tag }
 *   joined      boolean — picks the Joined variant (button opens the menu, cover tag "You’re in")
 *   showTag     false hides the cover tag (C-16 "Closest communities" draws plain cards). Default true
 *   activity    overrides `community.activity` (C-16 draws Hackathons Ghana as "Active daily")
 *   muted       boolean — only changes the menu label ("Unmute notifications")
 *   menuOpen    boolean — the "Joined" menu is open (controlled by the page: only one card has it open at a time)
 *   to          href of the community page (default `/community/<id>`, `?joined=1` when joined)
 *   onJoin(community)            "Join" clicked
 *   onToggleMenu(community)      "Joined" clicked
 *   onCloseMenu()                menu dismissed (Escape / outside click / an item chosen)
 *   onMute(community) · onLeave(community)   menu actions
 *   className   extra classes on the <article>
 * The card title is a stretched link to the community page; the buttons sit above it.
 */
const CardTag = ({ tag, joined }) => (
  <span
    className={classNames(
      'absolute left-[11px] top-[12px] inline-flex items-center gap-[5px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] py-[5px] pl-[8px] pr-[10px] font-sans text-[11px] font-bold text-[#1c2a21] max-lg:text-[12px]',
      'playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]',
      joined ? 'bg-[#ebf1ec] leading-[15px]' : 'bg-[#ffd86b] leading-[17px]'
    )}
  >
    <CommunityTagTargetIcon className="size-[13px] shrink-0" />
    {tag.label}
  </span>
);

const CommunityCard = ({
  community,
  joined = false,
  showTag = true,
  activity,
  muted = false,
  menuOpen = false,
  to,
  onJoin,
  onToggleMenu,
  onCloseMenu,
  onMute,
  onLeave,
  className,
}) => {
  useEffect(() => {
    log('render', community.id, joined ? 'joined' : 'join');
  }, [community.id, joined]);

  const href = to ?? `/community/${community.id}${joined ? '?joined=1' : ''}`;
  const tag = joined ? { kind: 'joined', label: 'You’re in' } : community.tag;
  const membersLabel = formatMembers(community.members);
  const activityLabel = activity ?? community.activity;

  return (
    <article
      data-community={community.id}
      data-state={joined ? 'joined' : 'join'}
      className={classNames(
        'relative flex w-full min-w-0 flex-col rounded-[20px] bg-white',
        joined
          ? classNames(
              'border border-solid border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]',
              EMPHASIS_SURFACE
            )
          : 'border border-solid border-[#e6e6e6]',
        className
      )}
    >
      <div className="relative h-[150px] shrink-0 overflow-hidden rounded-t-[19px] bg-[#ececea]">
        <img
          src={community.cover}
          alt=""
          aria-hidden="true"
          className="size-full object-cover"
          draggable={false}
        />
        {showTag && tag ? <CardTag tag={tag} joined={joined} /> : null}
      </div>
      <div className="flex flex-col gap-[8px] p-[16px]">
        <h3 className="m-0 font-sans text-[17px] font-semibold leading-[20px] text-[#1c2a21]">
          <Link
            to={href}
            className={classNames(
              '-my-[2px] inline-flex min-h-[24px] items-center text-inherit no-underline after:absolute after:inset-0 after:rounded-[20px] after:content-[""]',
              FOCUS_RING
            )}
          >
            {community.name}
          </Link>
        </h3>
        <p className="m-0 flex flex-wrap items-center gap-x-[6px] font-sans text-[12px] font-medium leading-[14px]">
          <CommunityMetaUsersIcon className="size-[14px] shrink-0" />
          <span className="whitespace-nowrap text-[#595959]">{membersLabel}</span>
          <span aria-hidden="true" className="text-[#bfbfbf]">
            ·
          </span>
          <span className="whitespace-nowrap text-[#387440]">{activityLabel}</span>
        </p>
        <p className="m-0 font-sans text-[13px] font-normal leading-[19px] text-[#595959]">
          {community.description}
        </p>
        <div className={classNames('flex items-center gap-[8px]', joined ? '' : 'py-[5px]')}>
          <span className="flex shrink-0 items-center" aria-hidden="true">
            {COMMUNITY_CARD_FACES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className="-ml-[8px] size-[26px] rounded-full border-2 border-solid border-white object-cover first:ml-0"
                style={{ zIndex: 3 - i }}
              />
            ))}
          </span>
          <span className="whitespace-nowrap font-sans text-[11px] font-medium leading-[13px] text-[#737373] max-lg:text-[12px]">
            {COMMUNITY_BROWSE_COPY.friendsHere}
          </span>
          <span className="min-w-0 flex-1" aria-hidden="true" />
          {joined ? (
            <span className="relative z-10 shrink-0">
              <CommunityButton
                tone="joined"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label={`${COMMUNITY_BROWSE_COPY.joined}, ${community.name}`}
                onClick={() => onToggleMenu?.(community)}
              >
                {COMMUNITY_BROWSE_COPY.joined}
              </CommunityButton>
              {menuOpen ? (
                <CommunityJoinedMenu
                  to={href}
                  muted={muted}
                  onMute={() => onMute?.(community)}
                  onLeave={() => onLeave?.(community)}
                  onClose={() => onCloseMenu?.()}
                />
              ) : null}
            </span>
          ) : (
            <CommunityButton
              tone="primary"
              aria-label={`${COMMUNITY_BROWSE_COPY.join}, ${community.name}`}
              className="relative z-10"
              onClick={() => onJoin?.(community)}
            >
              {COMMUNITY_BROWSE_COPY.join}
            </CommunityButton>
          )}
        </div>
      </div>
    </article>
  );
};

export default CommunityCard;
