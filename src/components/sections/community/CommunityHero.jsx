import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';

const log = debug('CommunityHero');

/*
 * CommunityHero — the full-size community header on the detail page.
 * Source: Figma 7025:86234 (not-joined) and 7025:87528 (joined action pair).
 *
 *   "Go to Community" chip  → rgba(235,241,236,.5) fill, #c1d4c4 border, r7.17
 *   title                   → Instrument Serif 52.6px / 48.4, tracking -2px
 *   members                 → SF Pro Rounded 16.7px, #959592
 *   body                    → 16.7px / 23.67, #595959, max 636px
 *   photo stack             → four 100x130 cards, r6, 0.8px #c9c9c9 border,
 *                             fanned right-to-left at Figma's exact offsets
 *   Join (not joined)       → #387440 + #2a5730 shelf + 4.78px #224626 shadow
 *   Joined + Invite Friends → white shelf button + green shelf button
 *
 * The two action states are BOTH from Figma; `joined` picks between them.
 */

const LABEL_GRADIENT = 'linear-gradient(204.82deg, #fef1e7 0%, #e8f2ed 20.192%)';
const INVITE_LABEL_GRADIENT = 'linear-gradient(188.61deg, #fef1e7 0%, #e8f2ed 20.192%)';

/* Figma absolute offsets for the fanned stack, normalised against the
 * 1514px-wide content column (left) and its 143px-tall band (top). */
const PHOTO_STACK_POSITIONS = [
  { left: '83.29%', top: '50px' },
  { left: '85.47%', top: '39px' },
  { left: '87.65%', top: '25px' },
  { left: '89.70%', top: '13px' },
];

const CommunityHero = ({ community, joined, onToggleJoin, onInvite, className }) => (
  <section className={classNames('flex flex-col items-start gap-[19.12px]', className)}>
    <div className="relative flex w-full flex-col items-start gap-[14.34px]">
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

      <div className="flex w-full flex-col items-start gap-[9.56px]">
        <h1 className="font-display text-[clamp(34px,3.04vw,52.6px)] leading-[0.92] tracking-[-2px] text-black">
          {community.title}
        </h1>
        <p className="whitespace-nowrap font-sans text-[16.73px] leading-[23.9px] tracking-[0.239px] text-neutral-dark-hover">
          {community.memberLabel}
        </p>
      </div>

      <p className="max-w-[636px] font-sans text-[16.73px] leading-[23.67px] text-[#595959]">
        {community.description}
      </p>

      {/* Fanned photo stack — hidden below xl where it would collide with copy */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
        {community.photoStack.map((photo, index) => (
          <img
            key={photo}
            src={photo}
            alt=""
            draggable="false"
            className="absolute h-[130px] w-[100px] select-none rounded-[6px] border-[0.8px] border-[#c9c9c9] object-cover"
            style={PHOTO_STACK_POSITIONS[index]}
          />
        ))}
      </div>
    </div>

    <div className="flex items-start gap-[10px]">
      {joined ? (
        <>
          <button
            type="button"
            aria-pressed="true"
            onClick={() => {
              log('leave community:', community.id);
              onToggleJoin?.();
            }}
            className="flex h-[45px] items-center justify-center gap-[6px] rounded-[10px] border-b-2 border-l-2 border-r-2 border-t border-[rgba(17,17,17,0.3)] bg-white px-[14px] py-[10px] drop-shadow-[0px_4px_0px_rgba(17,17,17,0.25)] transition-transform active:translate-y-[2px] active:drop-shadow-[0px_2px_0px_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <CommunityIcon src={icons.joinedHeader} size={18} />
            <span className="whitespace-nowrap font-sans text-[14px] font-medium tracking-[0.1px] text-black">
              Joined
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              log('invite friends clicked');
              onInvite?.();
            }}
            className="flex h-[45px] items-center justify-center gap-[6px] rounded-[10px] border-b-2 border-l-2 border-r-2 border-t border-brand-green-dark bg-brand-green px-[14px] py-[10px] drop-shadow-[0px_4px_0px_#224626] transition-transform active:translate-y-[2px] active:drop-shadow-[0px_2px_0px_#224626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
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
            log('join community:', community.id);
            onToggleJoin?.();
          }}
          className="flex items-center justify-center gap-[7.17px] rounded-[11.95px] border-b-[2.391px] border-l-[2.391px] border-r-[2.391px] border-t-[1.195px] border-brand-green-dark bg-brand-green px-[19.12px] py-[11.95px] drop-shadow-[0px_4.781px_0px_#224626] transition-transform active:translate-y-[2px] active:drop-shadow-[0px_2px_0px_#224626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <CommunityIcon src={icons.joinHero} size={21.5} />
          <span
            className="whitespace-nowrap bg-clip-text font-sans text-[16px] font-medium tracking-[0.12px] text-transparent"
            style={{ backgroundImage: LABEL_GRADIENT }}
          >
            Join
          </span>
        </button>
      )}
    </div>
  </section>
);

export default CommunityHero;
