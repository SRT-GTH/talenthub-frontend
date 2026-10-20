import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { COMMUNITY_PAGE_COPY } from './communityData.js';
import {
  CmArrowLeftIcon,
  CmCalendarIcon,
  CmChevronRightIcon,
  CmGlobeIcon,
  CmShieldIcon,
  CmTrendUpIcon,
  CmUsersIcon,
} from './CommunityPageIcons.jsx';
import {
  CARD,
  CARD_TITLE,
  FOCUS_RING,
  HEADING,
  HERO_CHROME,
  PRIMARY_GRADIENT_TEXT,
  STICKER_BASE,
  TAG_CHIP,
} from './communityPageStyles.js';

const log = debug('CommunityPageParts');

/*
 * Community detail page building blocks (Figma C-04 … C-14: `community hero`, `community tabs`, `card · Community info`,
 * `card · Top contributor`, `card · Trending`, `card · Related`). Focused is the default look, Playful only via `playful:`.
 *
 *   PageButton        tone 'primary' (green shelf, gradient label) | 'joined' (soft green) | 'secondary' (white, ink 30%);
 *                     48px tall (44px below lg), router <Link> when `to`. Props: tone, to, onClick, className, children.
 *   CommunityHero     detail (COMMUNITY_DETAILS entry), joined, onJoin, onLeave, onShare, onInvite.
 *   CommunityTabs     tabs [{ id, label, count?, tone? }], active, onChange(id). `count` is generated content.
 *   InfoCard          detail, gap (px, per-frame rhythm).      ContributorsCard  detail.
 *   TopicsCard        detail, gap, tagGap.                      RelatedCard       detail, gap.
 */
const BUTTON_TONES = {
  primary: 'border-[#2a5730] bg-[#387440] shadow-[0_4px_0_#224626] active:translate-y-[2px]',
  joined: 'border-[#c1d4c4] bg-[#e1eae2] text-[#165d3a] shadow-[0_1px_2px_rgba(27,36,44,0.12)]',
  secondary:
    'border-[rgba(28,42,33,0.3)] bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] active:translate-y-[2px]',
};

export const PageButton = ({ tone = 'primary', to, onClick, className, children, ...rest }) => {
  const cls = classNames(
    'box-border inline-flex h-[48px] shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-[10px] border-x-2 border-b-2 border-t border-solid px-[18px] font-sans text-[16px] font-bold leading-[24px] tracking-[0.1px] no-underline transition-transform max-lg:h-[44px] max-lg:text-[14px]',
    BUTTON_TONES[tone],
    FOCUS_RING,
    className
  );
  const label =
    tone === 'primary' ? (
      <span className="bg-clip-text text-transparent" style={PRIMARY_GRADIENT_TEXT}>
        {children}
      </span>
    ) : (
      children
    );
  if (to)
    return (
      <Link to={to} className={cls} onClick={onClick} {...rest}>
        {label}
      </Link>
    );
  return (
    <button type="button" className={cls} onClick={onClick} {...rest}>
      {label}
    </button>
  );
};

const META_ROW =
  'inline-flex items-center gap-[5px] font-sans text-[13px] font-medium leading-[16px]';

/* Hero collage: Focused = three straight 130x150 photos, Playful = the same photos tilted (CSS vars carry both layouts). */
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

const Faces = ({ faces }) => (
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
);

export const CommunityHero = ({ detail, joined, faces, onJoin, onLeave, onShare, onInvite }) => (
  <section
    aria-label={detail.name}
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
        {COMMUNITY_PAGE_COPY.back}
      </Link>
      <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
        <h1
          className={classNames(
            HEADING,
            'text-[clamp(26px,2.14vw,37px)] leading-[1.19] tracking-normal'
          )}
        >
          {detail.name}
        </h1>
        <span
          className={classNames(
            STICKER_BASE,
            'h-[23px] text-[11px] leading-[13px] max-lg:text-[12px] playful:h-[31px] playful:leading-[17px]'
          )}
        >
          {detail.sticker}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[6px]">
        <span className={classNames(META_ROW, 'text-[#595959]')}>
          <CmUsersIcon className="size-[14px]" />
          {detail.membersLabel}
        </span>
        <span className={classNames(META_ROW, 'text-[#387440]')}>
          <CmTrendUpIcon className="size-[14px]" />
          {detail.activity}
        </span>
        {detail.events ? (
          <span className={classNames(META_ROW, 'text-[#595959]')}>
            <CmCalendarIcon className="size-[14px]" />
            {detail.events}
          </span>
        ) : null}
      </div>
      <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
        {detail.description}
      </p>
      <div className="flex min-h-[66px] flex-wrap items-center gap-[10px] max-lg:min-h-0">
        {joined ? (
          <>
            <PageButton tone="joined" onClick={onLeave}>
              {COMMUNITY_PAGE_COPY.joined}
            </PageButton>
            <PageButton onClick={onInvite}>{COMMUNITY_PAGE_COPY.invite}</PageButton>
          </>
        ) : (
          <>
            <PageButton onClick={onJoin}>{COMMUNITY_PAGE_COPY.join}</PageButton>
            <PageButton tone="secondary" onClick={onShare}>
              {COMMUNITY_PAGE_COPY.share}
            </PageButton>
          </>
        )}
        <Faces faces={faces} />
        <span className="font-sans text-[12px] font-medium leading-[14px] text-[#737373]">
          {joined ? detail.faces : detail.previewFaces}
        </span>
      </div>
    </div>
    <Collage photos={detail.collage} />
  </section>
);

const TAB_BASE =
  'relative box-border inline-flex shrink-0 cursor-pointer items-center gap-[8px] whitespace-nowrap border-0 border-solid bg-transparent px-[14px] pb-[12px] pt-[10px] font-sans text-[15px] leading-[18px]';

export const CommunityTabs = ({ tabs, active, onChange }) => (
  <div
    role="tablist"
    aria-label={COMMUNITY_PAGE_COPY.card.about}
    className="no-scrollbar flex items-end gap-[4px] overflow-x-auto border-0 border-b border-solid border-[#e1eae2]"
  >
    {tabs.map((tab) => {
      const on = tab.id === active;
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={on}
          aria-disabled={tab.inert || undefined}
          aria-label={tab.count ? `${tab.label}, ${tab.count}` : undefined}
          onClick={() => {
            if (tab.inert) return;
            log('tab', tab.id);
            onChange(tab.id);
          }}
          className={classNames(
            TAB_BASE,
            FOCUS_RING,
            on
              ? 'border-b-[3px] border-[#387440] font-semibold text-[#387440]'
              : 'font-medium text-[#737373]'
          )}
        >
          {tab.label}
          {tab.count ? (
            <span
              aria-hidden="true"
              data-count={tab.count}
              className={classNames(
                'inline-flex h-[16px] items-center rounded-full px-[7px] text-[11.5px] font-bold leading-[14px] after:content-[attr(data-count)] max-lg:text-[12px]',
                tab.tone === 'gold' ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
              )}
            />
          ) : null}
        </button>
      );
    })}
  </div>
);

const ROW_ICONS = {
  members: CmUsersIcon,
  activity: CmTrendUpIcon,
  visibility: CmGlobeIcon,
  moderatedBy: CmShieldIcon,
};

export const InfoCard = ({ detail, gap = 24 }) => {
  const copy = COMMUNITY_PAGE_COPY.card;
  const rows = ['members', 'activity', 'visibility', 'moderatedBy'];
  return (
    <section className={classNames(CARD, 'flex flex-col p-[20px]')} style={{ gap }}>
      <h2 className={CARD_TITLE}>{copy.about}</h2>
      {rows.map((key) => {
        const Glyph = ROW_ICONS[key];
        return (
          <div
            key={key}
            className="flex items-center gap-[8px] font-sans text-[13px] leading-[16px]"
          >
            <Glyph className="size-[14px] shrink-0 text-[#737373]" />
            <span className="flex-1 font-medium text-[#737373]">{copy[key]}</span>
            <span className="font-semibold text-[#1c2a21]">{detail.info[key]}</span>
          </div>
        );
      })}
    </section>
  );
};

export const ContributorsCard = ({ detail }) => (
  <section className={classNames(CARD, 'flex flex-col gap-[20px] p-[20px]')}>
    <h2 className={CARD_TITLE}>{detail.contributorsTitle}</h2>
    {detail.contributors.map((person) => (
      <div key={person.name} className="flex items-center gap-[10px]">
        <img
          src={person.avatar}
          alt=""
          className="size-[36px] shrink-0 rounded-full object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="truncate font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
            {person.name}
          </span>
          <span className="font-sans text-[12px] leading-[14px] text-[#737373]">
            {person.active}
          </span>
        </div>
        <span
          aria-hidden="true"
          className={classNames(
            'size-[8px] shrink-0 rounded-full',
            person.online ? 'bg-[#387440]' : 'bg-[#e6e6e6]'
          )}
        />
      </div>
    ))}
  </section>
);

export const TopicsCard = ({ detail, gap = 14, tagGap = 16 }) => (
  <section className={classNames(CARD, 'flex flex-col p-[20px]')} style={{ gap }}>
    <h2 className={CARD_TITLE}>{detail.topicsTitle}</h2>
    <div className="flex flex-wrap gap-x-[8px]" style={{ rowGap: tagGap }}>
      {detail.topics.map((topic) => (
        <Link
          key={topic}
          to={`/community?q=${encodeURIComponent(topic)}`}
          className={classNames(TAG_CHIP, FOCUS_RING)}
        >
          {topic}
        </Link>
      ))}
    </div>
  </section>
);

export const RelatedCard = ({ detail, gap = 24 }) => (
  <section className={classNames(CARD, 'flex flex-col p-[20px]')} style={{ gap }}>
    <h2 className={CARD_TITLE}>{COMMUNITY_PAGE_COPY.card.related}</h2>
    {detail.related.map((item) => (
      <Link
        key={item.id}
        to={`/community/${item.id}`}
        className={classNames('flex items-center gap-[10px] no-underline', FOCUS_RING)}
      >
        <img src={item.thumb} alt="" className="size-[44px] shrink-0 rounded-[10px] object-cover" />
        <span className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="truncate font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
            {item.name}
          </span>
          <span className="font-sans text-[12px] leading-[14px] text-[#737373]">
            {item.members}
          </span>
        </span>
        <CmChevronRightIcon className="size-[16px] shrink-0 text-[#737373]" />
      </Link>
    ))}
  </section>
);
