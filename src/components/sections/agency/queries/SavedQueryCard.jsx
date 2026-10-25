import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { formatCount } from '../agencyFormat.js';
import AgencyButton from '../AgencyButton.jsx';
import { PRIMARY_BUTTON } from '../../publicData/share/shareButtonClasses.js';
import {
  QueriesIconBookmark,
  QueriesIconBrief,
  QueriesIconCash,
  QueriesIconChartBar,
  QueriesIconCheck,
  QueriesIconFilterCard,
  QueriesIconMap,
  QueriesIconPin,
} from './queriesIcons.jsx';

/*
 * SavedQueryCard â€” one saved query (Figma "match card" 8609:2508 in 11.5.1e, re-used from the recruiter job card: 430 wide, r22, p18, gap 16):
 *   top   : 40px icon tile (#ebf1ec, r12) + name 13.5/600 over "Moved 7% this month" 12/400 #737373 · schedule sticker (#ebf1ec, 11/700) · 34px round bookmark
 *   title : 22/28 600 · meta pills (#f8f8f4, r999, 12/500: pin · brief · cash) · result panel (r16, p 12/14): "12,410 talents" + meter (110 x 8; green or amber)
 *           + "✓ District · ✓ Readiness · ✓ Age" pills · footer "Saved 2 Sep · Efua Owusu" + the action
 * The featured card (the one the notice talks about) has the dark 10 % border, the shadow, the #ebf1ec panel and the green "Open results"; the
 * others are #e1eae2-bordered with a #f8f8f4 panel and the white shelf button; a paused card is drawn at 60 % with "Delete".
 * The talent count goes through formatCount() ("<5" for a group under 5, Figma "<5 talents" on Upper West placements).
 * ⚠️ ASSUMPTION: the round bookmark toggles pause / resume of the refresh (Figma draws it as a state icon only).
 * Props: query, featured, onTogglePause(id), onDelete(id), onOpen(href).
 */

const ICONS = { map: QueriesIconMap, chart: QueriesIconChartBar, filter: QueriesIconFilterCard };
const METER = { green: 'bg-[#387440]', amber: 'bg-[#c8951a]' };

const MetaPill = ({ icon, children }) => (
  <span className="inline-flex items-center gap-[5px] rounded-full bg-[#f8f8f4] py-[4px] pr-[9px] pl-[8px] text-[12px] leading-[14px] font-medium text-[#595959]">
    {icon}
    {children}
  </span>
);

const SavedQueryCard = ({ query, featured = false, onTogglePause, onDelete, onOpen }) => {
  const Icon = ICONS[query.iconKey] ?? QueriesIconMap;
  const paused = query.status === 'paused';
  const [place, kind, span] = query.meta;
  return (
    <article
      aria-label={query.name}
      className={classNames(
        'flex min-w-0 flex-col gap-[16px] rounded-[22px] border border-solid bg-white p-[18px] font-sans',
        featured
          ? 'border-[#1c2a21]/10 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.08)]'
          : 'border-[#e1eae2]',
        paused && 'opacity-60'
      )}
    >
      <div className="flex items-center gap-[10px]">
        <span className="grid size-[40px] shrink-0 place-items-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
          <Icon className="size-[20px]" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[1px]">
          <span className="truncate text-[13.5px] leading-[16px] font-semibold text-[#1c2a21]">
            {query.name}
          </span>
          <span className="text-[12px] leading-[14px] text-[#737373]">
            {query.movedPct === null ? 'Paused' : `Moved ${query.movedPct}% this month`}
          </span>
        </div>
        <span className="shrink-0 rounded-full bg-[#ebf1ec] px-[10px] py-[4px] text-[11px] leading-[13px] font-bold text-[#1f4a2b] max-lg:text-[12px]">
          {query.schedule}
        </span>
        <button
          type="button"
          onClick={() => onTogglePause(query.id)}
          aria-pressed={!paused}
          aria-label={paused ? `Resume refreshing ${query.name}` : `Pause refreshing ${query.name}`}
          className={classNames(
            'grid size-[34px] shrink-0 cursor-pointer place-items-center rounded-full border border-solid border-[#1c2a21]/[0.12] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            paused ? 'bg-[#737373]' : 'bg-[#1c2a21]'
          )}
        >
          <QueriesIconBookmark className="size-[15px]" />
        </button>
      </div>
      <h3 className="m-0 text-[22px] leading-[28px] font-semibold tracking-[-0.11px] text-[#1c2a21]">
        {query.title}
      </h3>
      <div className="flex flex-wrap gap-[6px]">
        <MetaPill icon={<QueriesIconPin className="size-[13px] shrink-0" />}>{place}</MetaPill>
        <MetaPill icon={<QueriesIconBrief className="size-[13px] shrink-0" />}>{kind}</MetaPill>
        <MetaPill icon={<QueriesIconCash className="size-[13px] shrink-0" />}>{span}</MetaPill>
      </div>
      <div
        className={classNames(
          'flex flex-col gap-[16px] rounded-[16px] px-[14px] py-[12px]',
          featured ? 'bg-[#ebf1ec]' : 'bg-[#f8f8f4]'
        )}
      >
        <div className="flex items-center gap-[8px]">
          <span className="text-[22px] leading-[28px] font-semibold tracking-[-0.11px] text-[#1c2a21]">
            {formatCount(query.talents)}
          </span>
          <span className="text-[13px] leading-[16px] font-semibold text-[#2d5d33]">talents</span>
          <span aria-hidden="true" className="flex-1" />
          <span
            aria-hidden="true"
            className="h-[8px] w-[110px] shrink-0 overflow-hidden rounded-full bg-[#e1eae2]"
          >
            <span
              className={classNames('block h-full rounded-full', METER[query.tone])}
              style={{ width: `${Math.round(query.barRatio * 100)}%` }}
            />
          </span>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
          {query.chips.map((c) => (
            <li
              key={c}
              className="inline-flex items-center gap-[4px] rounded-full border border-solid border-[#c1d4c4] bg-white py-[3px] pr-[8px] pl-[6px] text-[11.5px] leading-[14px] font-semibold text-[#2d5d33] max-lg:text-[12px]"
            >
              <QueriesIconCheck className="size-[11px] text-[#387440]" />
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between gap-[8px]">
        <span className="text-[12px] leading-[14px] text-[#737373]">
          Saved {query.saved} · {query.by}
        </span>
        {paused ? (
          <AgencyButton size="md" onClick={() => onDelete(query.id)} className="!rounded-[10px]">
            Delete
          </AgencyButton>
        ) : featured ? (
          <Button
            type="button"
            variant="primary"
            size="sm"
            className={PRIMARY_BUTTON}
            onClick={() => onOpen(query.href)}
          >
            Open results
          </Button>
        ) : (
          <AgencyButton size="md" to={query.href} className="!rounded-[10px]">
            Open results
          </AgencyButton>
        )}
      </div>
    </article>
  );
};

export default SavedQueryCard;
