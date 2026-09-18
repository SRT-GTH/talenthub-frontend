import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';
import CommunityTabs from './CommunityTabs.jsx';

const log = debug('CommunityStickyHeader');

/*
 * CommunityStickyHeader — the compact community header.
 * Source: Figma 7025:87493.
 *
 * Figma annotation on that node: "This appears on scroll and remains fixed"
 * → the detail page swaps the full hero for this bar once the hero scrolls
 * past, and the bar is `sticky`.
 *
 * vs. the full hero: same "Go to Community" chip, title drops 52.6px → 36px
 * (tracking -1px), description + photo stack are dropped, and the tabs and
 * Joined / Invite Friends pair move up onto the same row.
 *
 * Corrected 2026-09-18: this used to render the white "Joined" + green
 * "Invite Friends" pair unconditionally, only swapping the button's label/
 * icon text for "Join" while leaving its background white — showing a
 * "Join"+"Invite Friends" pair even before joining (inviting friends to a
 * community you haven't joined doesn't make sense) and, since `icons.joinHero`
 * carries a pale cream/mint gradient fill meant for a dark-green background,
 * a near-invisible washed-out icon on that white button. Figma has no
 * distinct "scrolled + not joined" frame, so the not-joined branch below
 * mirrors CommunityHero.jsx's single-green-button treatment exactly, just
 * resized to this row's `h-[45px]`.
 */

const LABEL_GRADIENT = 'linear-gradient(204.82deg, #fef1e7 0%, #e8f2ed 20.192%)';
const INVITE_LABEL_GRADIENT = 'linear-gradient(188.61deg, #fef1e7 0%, #e8f2ed 20.192%)';

const CommunityStickyHeader = ({
  community,
  joined,
  onToggleJoin,
  onInvite,
  activeTab,
  onTabChange,
  className,
}) => (
  <div
    /* The page mounts this inside one sticky block together with the post
       filter row, so the stickiness/backdrop live there, not here. */
    className={classNames('flex flex-wrap items-center justify-between gap-4', className)}
  >
    <div className="flex flex-col items-start gap-[12px]">
      <Link
        to={'/community'}
        onClick={() => log('breadcrumb: back to community index')}
        className="inline-flex items-center justify-center gap-[7.17px] rounded-[7.17px] border-[1.195px] border-brand-green-light-active bg-brand-green-light/50 px-[14.34px] py-[7.17px] transition-colors hover:bg-brand-green-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <CommunityIcon src={icons.communityChip} size={14.34} />
        <span className="whitespace-nowrap font-sans text-[15.54px] tracking-[0.239px] text-[#999]">
          {community.breadcrumbLabel}
        </span>
      </Link>
      <div className="flex flex-col items-start gap-[2px]">
        <p className="whitespace-nowrap font-display text-[clamp(26px,2.08vw,36px)] tracking-[-1px] text-black">
          {community.title}
        </p>
        <p className="whitespace-nowrap font-sans text-[14px] leading-5 tracking-[0.2px] text-neutral-dark-hover">
          {community.memberLabel}
        </p>
      </div>
    </div>

    <CommunityTabs value={activeTab} onChange={onTabChange} />

    <div className="flex h-[45px] items-start gap-[10px]">
      {joined ? (
        <>
          <button
            type="button"
            aria-pressed="true"
            onClick={() => {
              log('toggle join from sticky header: joined → not joined');
              onToggleJoin?.();
            }}
            className="flex h-full items-center justify-center gap-[6px] rounded-[10px] border-b-2 border-l-2 border-r-2 border-t border-[rgba(17,17,17,0.3)] bg-white px-[14px] py-[10px] drop-shadow-[0px_4px_0px_rgba(17,17,17,0.25)] transition-transform active:translate-y-[2px] active:drop-shadow-[0px_2px_0px_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <CommunityIcon src={icons.joinedHeader} size={18} />
            <span className="whitespace-nowrap font-sans text-[14px] font-medium tracking-[0.1px] text-black">
              Joined
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              log('invite friends clicked from sticky header');
              onInvite?.();
            }}
            className="flex h-full items-center justify-center gap-[6px] rounded-[10px] border-b-2 border-l-2 border-r-2 border-t border-brand-green-dark bg-brand-green px-[14px] py-[10px] drop-shadow-[0px_4px_0px_#224626] transition-transform active:translate-y-[2px] active:drop-shadow-[0px_2px_0px_#224626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <CommunityIcon src={icons.inviteFriends} size={18} />
            <span
              className="whitespace-nowrap bg-clip-text font-sans text-[14px] font-medium tracking-[0.1px] text-transparent"
              style={{ backgroundImage: INVITE_LABEL_GRADIENT }}
            >
              Invite Friends
            </span>
          </button>
        </>
      ) : (
        <button
          type="button"
          aria-pressed="false"
          onClick={() => {
            log('toggle join from sticky header: not joined → joined');
            onToggleJoin?.();
          }}
          className="flex h-full items-center justify-center gap-[6px] rounded-[10px] border-b-2 border-l-2 border-r-2 border-t border-brand-green-dark bg-brand-green px-[14px] py-[10px] drop-shadow-[0px_4px_0px_#224626] transition-transform active:translate-y-[2px] active:drop-shadow-[0px_2px_0px_#224626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <CommunityIcon src={icons.joinHero} size={18} />
          <span
            className="whitespace-nowrap bg-clip-text font-sans text-[14px] font-medium tracking-[0.1px] text-transparent"
            style={{ backgroundImage: LABEL_GRADIENT }}
          >
            Join
          </span>
        </button>
      )}
    </div>
  </div>
);

export default CommunityStickyHeader;
