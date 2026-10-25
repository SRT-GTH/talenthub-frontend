import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import { COMMUNITY_PAGE_COPY } from './communityData.js';
import CommunityMeAvatar from './CommunityMeAvatar.jsx';
import {
  CmArrowDownIcon,
  CmAttachmentIcon,
  CmCheckCircleIcon,
  CmCheckIcon,
  CmEyeIcon,
  CmHelpIcon,
  CmImageIcon,
  CmLinkIcon,
  CmMicIcon,
  CmShieldLargeIcon,
  CmStarIcon,
  CmUsersIcon,
  CmWaveIcon,
} from './CommunityPageIcons.jsx';
import { PageButton } from './CommunityPageParts.jsx';
import {
  CARD,
  FOCUS_RING,
  OUTLINE_CHIP,
  OUTLINE_CHIP_OFF,
  OUTLINE_CHIP_ON,
  STICKER_BASE,
} from './communityPageStyles.js';
import { HEADING } from './communityStyles.js';

const log = debug('CommunityFeedParts');

/*
 * Community feed building blocks (Figma C-04 / C-05 / C-06 / C-14): `feed toolbar`, `composer`, `preview banner`,
 * `guidelines`, `empty feed`, `toast · joined`.
 *
 *   FeedToolbar     filters (labels), filter (active label), onFilter(label), sort (label).
 *   Composer        onCompose() — the whole row (clip + placeholder, mic, waveform, Photo / Win / Link) opens the create dialog.
 *   PreviewBanner   onJoin().
 *   Guidelines      onGotIt(), onReadAll().
 *   EmptyFeed       onWrite().
 *   JoinedToast     onDone() after 6s (portaled, centred over the page, 98px below the top of the viewport).
 */
export const FeedToolbar = ({ filters, filter, onFilter, sort }) => {
  const sortId = useId();
  return (
    <div className="flex items-center gap-[8px]">
      <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-[8px] overflow-x-auto py-px">
        {filters.map((label) => (
          <button
            key={label}
            type="button"
            aria-pressed={label === filter}
            onClick={() => onFilter(label)}
            className={classNames(
              OUTLINE_CHIP,
              FOCUS_RING,
              label === filter ? OUTLINE_CHIP_ON : OUTLINE_CHIP_OFF
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <label className="relative inline-flex h-[34px] shrink-0 cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white pl-[14px] pr-[12px] font-sans text-[13px] font-semibold leading-[16px] text-[#595959]">
        <span id={sortId}>{sort}</span>
        <CmArrowDownIcon className="size-[14px] text-[#595959]" />
        <select
          aria-labelledby={sortId}
          className="absolute inset-0 size-full cursor-pointer appearance-none rounded-full opacity-0"
          defaultValue={sort}
        >
          <option>{sort}</option>
        </select>
      </label>
    </div>
  );
};

const QUICK =
  'inline-flex h-[38px] shrink-0 cursor-pointer items-center gap-[6px] rounded-[10px] border border-solid border-[#e6e6e6] bg-white px-[12px] font-sans text-[13px] font-semibold leading-[16px] text-[#2d5d33] max-sm:size-[40px] max-sm:justify-center max-sm:px-0';

const ROUND =
  'inline-flex size-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#f0f0f0] p-0';

export const Composer = ({ onCompose }) => {
  const copy = COMMUNITY_PAGE_COPY.composer;
  const quick = [
    {
      id: 'photo',
      label: copy.photo,
      icon: <CmImageIcon className="size-[16px] shrink-0 text-[#387440]" />,
    },
    {
      id: 'win',
      label: copy.win,
      icon: <CmStarIcon className="size-[16px] shrink-0 text-[#387440]" />,
    },
    {
      id: 'link',
      label: copy.link,
      icon: <CmLinkIcon className="size-[16px] shrink-0 text-[#387440]" />,
    },
  ];
  return (
    <div className={classNames(CARD, 'flex flex-wrap items-center gap-[12px] p-[16px]')}>
      <CommunityMeAvatar size={44} />
      <div className="flex min-w-0 flex-[1_1_220px] items-center gap-[8px] rounded-[12px] border border-solid border-[#e5e7eb] bg-white pr-[16px] max-sm:pr-[8px]">
        <button
          type="button"
          onClick={() => {
            log('compose');
            onCompose();
          }}
          className={classNames(
            'flex min-h-[48px] min-w-0 flex-1 cursor-pointer items-center gap-[5px] rounded-[12px] border-0 bg-transparent p-0 pl-[16px] text-left',
            FOCUS_RING
          )}
        >
          <CmAttachmentIcon className="size-[40px] shrink-0 text-[#595959]" />
          <span className="min-w-0 flex-1 truncate font-sans text-[13px] leading-[20px] tracking-[0.2px] text-[#999999] max-sm:text-[14px] playful:whitespace-normal playful:text-[16px]">
            {copy.placeholder}
          </span>
        </button>
        <button
          type="button"
          aria-label="Voice note"
          onClick={onCompose}
          className={classNames(ROUND, FOCUS_RING)}
        >
          <CmMicIcon className="size-[19px] text-[#58554e]" />
        </button>
        <button
          type="button"
          aria-label="Voice message"
          onClick={onCompose}
          className={classNames(ROUND, FOCUS_RING, 'max-sm:hidden')}
        >
          <CmWaveIcon className="size-[19px] text-[#595959]" />
        </button>
      </div>
      <div className="flex items-center gap-[12px] max-sm:gap-[8px]">
        {quick.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            onClick={onCompose}
            className={classNames(QUICK, FOCUS_RING)}
          >
            {icon}
            <span className="max-sm:hidden">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const PreviewBanner = ({ onJoin }) => (
  <div className="flex flex-wrap items-center gap-[12px] rounded-[16px] border border-solid border-[#c8951a] bg-[#faf4e8] px-[16px] py-[14px]">
    <CmEyeIcon className="size-[18px] shrink-0 text-[#785910]" />
    <div className="flex min-w-0 flex-1 basis-[200px] flex-col gap-[2px]">
      <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#463409]">
        {COMMUNITY_PAGE_COPY.preview.title}
      </span>
      <span className="font-sans text-[12px] leading-[14px] text-[#785910]">
        {COMMUNITY_PAGE_COPY.preview.sub}
      </span>
    </div>
    <PageButton onClick={onJoin}>{COMMUNITY_PAGE_COPY.preview.join}</PageButton>
  </div>
);

/* `rules` / `note` (optional) replace the drawn Frontend copy — live pages pass the community's own house rules. */
export const Guidelines = ({ onGotIt, onReadAll, rules, note }) => {
  const copy = COMMUNITY_PAGE_COPY.guidelines;
  const list = rules?.length ? rules : copy.rules;
  return (
    <section className="flex flex-col gap-[12px] rounded-[16px] border border-solid border-[#c1d4c4] bg-[#ebf1ec] p-[18px] playful:border-[1.5px] playful:border-[#387440]">
      <div className="flex items-center gap-[10px]">
        <CmShieldLargeIcon className="size-[20px] shrink-0 text-[#2d5d33]" />
        <h2 className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c4327]">
          {copy.title}
        </h2>
      </div>
      <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
        {list.map((rule) => (
          <li key={rule} className="flex items-start gap-[8px]">
            <CmCheckIcon className="mt-[1px] size-[14px] shrink-0 text-[#387440]" />
            <span className="font-sans text-[13px] font-medium leading-[16px] text-[#2d5d33]">
              {rule}
            </span>
          </li>
        ))}
      </ul>
      {(note ?? copy.note) ? (
        <p className="m-0 font-sans text-[12px] leading-[14px] text-[#2d5d33]">
          {note ?? copy.note}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-[10px] py-[4px]">
        <PageButton onClick={onGotIt}>{copy.gotIt}</PageButton>
        <button
          type="button"
          onClick={onReadAll}
          className={classNames(
            'cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440]',
            FOCUS_RING
          )}
        >
          {copy.readAll}
        </button>
      </div>
    </section>
  );
};

const IDEA_ICONS = { help: CmHelpIcon, star: CmStarIcon, users: CmUsersIcon };

/* `body` (optional) replaces the drawn line (live pages drop the "Founding Voice badge" promise: no badge backend yet). */
export const EmptyFeed = ({ onWrite, body }) => {
  const copy = COMMUNITY_PAGE_COPY.empty;
  return (
    <section className="relative flex flex-col items-center gap-[14px] rounded-[20px] bg-white px-[32px] py-[40px] text-center max-sm:px-[16px] max-sm:py-[28px]">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
      >
        <rect
          x="0.75"
          y="0.75"
          rx="19.25"
          fill="none"
          stroke="#bfbfbf"
          strokeWidth="1.5"
          strokeDasharray="6 5"
          style={{ width: 'calc(100% - 1.5px)', height: 'calc(100% - 1.5px)' }}
        />
      </svg>
      <img src={copy.art} alt="" className="size-[104px]" />
      <h2
        className={classNames(
          HEADING,
          'text-[23px] leading-[28.75px] max-sm:text-[20px] max-sm:leading-[26px]'
        )}
      >
        {copy.title}
      </h2>
      <p className="m-0 max-w-[440px] font-sans text-[14px] leading-[21px] text-[#595959]">
        {body ?? copy.body}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-[8px]">
        {copy.ideas.map((idea) => {
          const Glyph = IDEA_ICONS[idea.icon];
          return (
            <button
              key={idea.id}
              type="button"
              onClick={() => {
                log('idea', idea.id);
                onWrite();
              }}
              className={classNames(
                'inline-flex h-[32px] cursor-pointer items-center gap-[6px] rounded-full border-0 bg-[#ebf1ec] py-[8px] pl-[10px] pr-[12px] font-sans text-[13px] font-semibold leading-[16px] text-[#2d5d33]',
                FOCUS_RING
              )}
            >
              <Glyph className="size-[14px] shrink-0 text-[#2d5d33]" />
              {idea.label}
            </button>
          );
        })}
      </div>
      <PageButton className="mt-[2px]" onClick={onWrite}>
        {copy.cta}
      </PageButton>
    </section>
  );
};

const TOAST_MS = 6000;

/* C-05 `toast · joined`: dark pill, green check, 14/17 white label + the "+10 XP / +10 pts" sticker. */
export const JoinedToast = ({ onDone }) => {
  const xp = useUiStyle().uiStyle === 'playful' ? 'XP' : 'pts';
  useEffect(() => {
    log('toast mount');
    const timer = window.setTimeout(() => onDone?.(), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 top-[98px] z-[55] flex w-max max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-[10px] rounded-[16px] bg-[#1c2a21] py-[12px] pl-[12px] pr-[16px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] lg:ml-[63px] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]"
    >
      <CmCheckCircleIcon className="size-[20px] shrink-0" />
      <span className="font-sans text-[14px] font-semibold leading-[17px] text-white">
        {COMMUNITY_PAGE_COPY.welcomeToast}
      </span>
      <span
        className={classNames(
          STICKER_BASE,
          'h-[23px] text-[11px] leading-[13px] max-lg:text-[12px] playful:h-[28px]'
        )}
      >
        {COMMUNITY_PAGE_COPY.welcomeBonus.replace('{xp}', xp)}
      </span>
    </div>,
    document.body
  );
};
