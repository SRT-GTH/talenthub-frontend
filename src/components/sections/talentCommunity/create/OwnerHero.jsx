import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import {
  CmArrowLeftIcon,
  CmCalendarIcon,
  CmTrendUpIcon,
  CmUsersIcon,
} from '../CommunityPageIcons.jsx';
import { PageButton } from '../CommunityPageParts.jsx';
import { FOCUS_RING, HEADING, HERO_CHROME, STICKER_BASE } from '../communityPageStyles.js';
import { OWNER_COPY } from './createCommunityData.js';

const META_ROW =
  'inline-flex items-center gap-[5px] font-sans text-[13px] font-medium leading-[16px]';

/* Hero collage: Focused = three straight photos, Playful = the same photos tilted (same layout the Community hero uses). */
const Collage = ({ photos }) => (
  <div aria-hidden="true" className="h-[150px] w-[247px] shrink-0 lg:h-[200px] lg:w-[330px]">
    <div className="relative h-[200px] w-[330px] origin-top-left max-lg:scale-[0.75]">
      {photos.map((photo, index) => (
        <img
          key={photo.src}
          src={photo.src}
          alt=""
          style={{
            '--fx': `${photo.x}px`,
            '--fy': `${photo.y}px`,
            '--px': `${photo.px}px`,
            '--py': `${photo.py}px`,
            '--tilt': `${photo.tilt}deg`,
            zIndex: index + 1,
          }}
          className="absolute left-[var(--fx)] top-[var(--fy)] h-[150px] w-[130px] rounded-[14px] border border-solid border-[rgba(28,42,33,0.1)] object-cover shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:left-[var(--px)] playful:top-[var(--py)] playful:rotate-[var(--tilt)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]"
        />
      ))}
    </div>
  </div>
);

/*
 * OwnerHero — the owner's `community hero` (Figma CC-06 … CC-17b): back link, "#Name" + status sticker, meta row, about line,
 * a soft primary action + a green secondary action, then either a hint ("Only you can see this page until it’s live") or the
 * founding faces + "You + 2 founding members".
 * Props: community, status, copy (OWNER_STATUS_COPY[status]), photos, faces, showEvents, onAction(id).
 */
const OwnerHero = ({ community, status, copy, photos, faces, showEvents, onAction }) => {
  const count = community.members.length;
  const live = ['live', 'transfer-pending', 'archived'].includes(status);
  return (
    <section
      aria-label={community.name}
      className={classNames(
        'flex gap-[32px] rounded-[24px] bg-white p-[28px] max-lg:flex-col max-lg:gap-[16px] max-sm:p-[16px]',
        HERO_CHROME
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        <Link
          to="/community"
          className={classNames(
            'inline-flex w-fit items-center gap-[6px] font-sans text-[13px] font-semibold leading-[16px] text-[#387440] no-underline',
            FOCUS_RING
          )}
        >
          <CmArrowLeftIcon className="size-[14px]" />
          {OWNER_COPY.back}
        </Link>
        <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
          <h1
            className={classNames(
              HEADING,
              'break-words text-[clamp(26px,2.14vw,37px)] leading-[1.19] tracking-normal'
            )}
          >
            #{community.name}
          </h1>
          <span
            className={classNames(
              STICKER_BASE,
              'h-[23px] text-[11px] leading-[13px] max-lg:text-[12px] playful:h-[31px] playful:leading-[17px]'
            )}
          >
            {copy.sticker}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[6px]">
          <span className={classNames(META_ROW, 'text-[#595959]')}>
            <CmUsersIcon className="size-[14px]" />
            {count} {count === 1 ? 'member' : 'members'}
          </span>
          <span className={classNames(META_ROW, 'text-[#387440]')}>
            <CmTrendUpIcon className="size-[14px]" />
            {copy.metaStatus}
          </span>
          {showEvents ? (
            <span className={classNames(META_ROW, 'text-[#595959]')}>
              <CmCalendarIcon className="size-[14px]" />
              {OWNER_COPY.eventsZero}
            </span>
          ) : null}
        </div>
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{community.about}</p>
        <div className="flex min-h-[66px] flex-wrap items-center gap-[10px] max-lg:min-h-0">
          <PageButton tone="joined" onClick={() => onAction(copy.primary.id)}>
            {copy.primary.label}
          </PageButton>
          {copy.secondary ? (
            <PageButton onClick={() => onAction(copy.secondary.id)}>
              {copy.secondary.label}
            </PageButton>
          ) : null}
          {live ? (
            <span className="inline-flex shrink-0 items-center" aria-hidden="true">
              {faces.map((face, index) => (
                <img
                  key={`${index}-${face}`}
                  src={face}
                  alt=""
                  className={classNames(
                    'size-[28px] rounded-full border-2 border-solid border-white object-cover',
                    index > 0 && '-ml-[8px]'
                  )}
                />
              ))}
            </span>
          ) : null}
          <span className="font-sans text-[12px] font-medium leading-[14px] text-[#737373]">
            {copy.hint}
          </span>
        </div>
      </div>
      <Collage photos={photos} />
    </section>
  );
};

export default OwnerHero;
