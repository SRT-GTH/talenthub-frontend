import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';
import { TOP_CONTRIBUTORS } from './communityData.js';

const log = debug('CommunityLeftRail');

/*
 * CommunityLeftRail — "Community Info" + "Top Contributors" cards.
 * Source: Figma 7025:86316 (7025:86317 info card, 7025:86328 contributors).
 *
 * Both cards: white, r24.108, p28, shadow 0 2px 1px rgba(141,138,138,.17).
 * Row separators are 1.205px #f2f2f2. Contributor rows carry a 9.64px status
 * dot — Figma ships two distinct SVGs (green `dot-online`, grey `dot-offline`)
 * rather than one recoloured glyph, so both files are used.
 */

const RailCard = ({ children, className }) => (
  <div
    className={classNames(
      'w-full overflow-hidden rounded-[24.108px] bg-white p-[28px] shadow-[0px_2px_1px_0px_rgba(141,138,138,0.17)]',
      className
    )}
  >
    {children}
  </div>
);

const CommunityLeftRail = ({ community, className }) => (
  <div className={classNames('flex w-full flex-col items-start gap-[18px]', className)}>
    <RailCard>
      <div className="flex w-full flex-col items-start gap-[16px]">
        <h2 className="w-full font-sans text-[18px] font-medium text-[#0a0a0a]">Community Info</h2>
        <dl className="flex w-full flex-col items-start gap-[7.23px]">
          {community.info.map((entry, index) => (
            <div key={entry.label} className="contents">
              {index > 0 && <div className="h-[1.205px] w-full bg-[#f2f2f2]" />}
              <div className="flex w-full items-center justify-between py-[14px] leading-[1.2]">
                <dt className="whitespace-nowrap font-sans text-[14px] text-[#737373]">
                  {entry.label}
                </dt>
                <dd className="whitespace-nowrap font-sans text-[16px] font-medium text-black">
                  {entry.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </RailCard>

    <RailCard className="flex-1">
      <div className="flex h-full w-full flex-col items-start gap-[16px]">
        <h2 className="w-full font-sans text-[18px] font-medium text-[#0a0a0a]">
          Top Contributors
        </h2>
        {/* Row buttons are plain `w-full` — no negative-margin bleed. An
            earlier pass used `-mx-[12px] w-[calc(100%+24px)] px-[12px]`,
            which cancels out to zero visual change for the content (the
            avatar/text sat exactly where they did with no padding at all,
            which is why that pass didn't fix anything) and, worse, made
            each row 24px wider than this `<ul>`'s own box. Since the `<ul>`
            only declares `overflow-y-auto`, the CSS visible/auto interaction
            rule forces its `overflow-x` to `auto` too, so that 24px overhang
            gave the list itself a real, permanent horizontal scrollbar —
            the "why is there a scroll?" bug. Plain `w-full` + `px-[12px]`
            gives the avatar/text genuine breathing room from the row's own
            edges with no overhang and no scrollbar. */}
        <ul className="flex w-full flex-1 flex-col items-start gap-[7.23px] overflow-y-auto">
          {TOP_CONTRIBUTORS.map((person, index) => (
            <li key={person.id} className="contents">
              {index > 0 && <div className="h-[1.205px] w-full bg-[#f2f2f2]" />}
              <button
                type="button"
                onClick={() => log('contributor clicked (no profile route wired yet):', person.id)}
                className="flex w-full items-center justify-between rounded-[8px] px-[12px] py-[12.05px] text-left transition-colors hover:bg-neutral focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-green"
              >
                <span className="flex min-w-0 items-center gap-[16.88px]">
                  <img
                    src={person.avatar}
                    alt=""
                    draggable="false"
                    className="size-[53.04px] shrink-0 select-none rounded-full object-cover"
                  />
                  <span className="flex min-w-0 flex-col items-start gap-[6px]">
                    <span className="w-full truncate font-sans text-[16px] font-medium text-black">
                      {person.name}
                    </span>
                    <span className="w-full truncate font-sans text-[14px] text-[#737373]">
                      {person.meta}
                    </span>
                  </span>
                </span>
                <CommunityIcon
                  src={person.online ? icons.dotOnline : icons.dotOffline}
                  size={9.64}
                  alt={person.online ? 'Online' : 'Offline'}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </RailCard>
  </div>
);

export default CommunityLeftRail;
