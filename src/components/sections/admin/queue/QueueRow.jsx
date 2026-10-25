import { Link, useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import AgencyButton from '../../agency/AgencyButton.jsx';
import {
  AdminArrowRightIcon,
  AdminBookmarkIcon,
  AdminCheckIcon,
  AdminEyeIcon,
  AdminArchiveIcon,
  AdminBookIcon,
  AdminCompanyTileIcon,
  AdminShieldTileIcon,
  AdminWarningIcon,
} from '../adminIcons.jsx';

/*
 * QueueRow — one "result" row of an admin queue list (Figma "result" rows of 7.1.1a accounts, 7.2.1a flags, 7.2.3a removed content, 7.2.5a new communities;
 * 1327 x 70, p 14/18/20/14, gap 14): a 42 x 42 lead (account mark image, or a #ebf1ec r12 tile with a 24px glyph) · title 16/600 + sticker (#ebf1ec, 11/700 #1f4a2b)
 * over the 13 #737373 sub line · up to three chips (amber with an eye, green with a check, grey) · pill (53 x 25: strong green "Open" / mint "Claim", "View") ·
 * age 12.5 #737373 · 34 round save button · arrow, or a white 16/700 button ("Reactivate", "Reassign", "Restore"). A muted row is drawn at 50 % except its button.
 * Props: row { id, lead, title, sticker, sub, chips, pill { label, strong }, age, muted, button, to }, onButton().
 * ⚠️ ASSUMPTION: the save (bookmark) button has no flow drawn (it logs); the pill and the arrow open `to`.
 */

const CHIP = {
  amber: 'border-[#c8951a] bg-[#faf4e8] text-[#1c2a21] font-semibold text-[11px]',
  green: 'border-[#c1d4c4] bg-[#ebf1ec] text-[#2d5d33] font-semibold text-[11.5px]',
  grey: 'border-transparent bg-[#f8f8f4] text-[#595959] font-medium text-[11px]',
};

const TILE_ICONS = {
  warning: AdminWarningIcon,
  archive: AdminArchiveIcon,
  company: AdminCompanyTileIcon,
  book: AdminBookIcon,
  shield: AdminShieldTileIcon,
};

const Chip = ({ chip }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center gap-[5px] rounded-full border border-solid py-[3px] leading-[14px] whitespace-nowrap',
      chip.tone === 'grey' ? 'px-[8px]' : 'px-[9px]',
      CHIP[chip.tone]
    )}
  >
    {chip.tone === 'amber' ? <AdminEyeIcon className="size-[13px] shrink-0" /> : null}
    {chip.tone === 'green' ? <AdminCheckIcon className="size-[11px] shrink-0" /> : null}
    {chip.label}
  </span>
);

const Lead = ({ lead, dim }) => {
  if (lead.src) {
    return (
      <img
        src={lead.src}
        alt=""
        draggable="false"
        className={classNames('size-[42px] shrink-0 rounded-[12px]', dim)}
      />
    );
  }
  const Icon = TILE_ICONS[lead.icon];
  return (
    <span
      aria-hidden="true"
      className={classNames(
        'grid size-[42px] shrink-0 place-items-center rounded-[12px] bg-[#ebf1ec] text-[#387440]',
        dim
      )}
    >
      <Icon className="size-[24px]" />
    </span>
  );
};

const QueueRow = ({ row, onButton, onSave }) => {
  const navigate = useNavigate();
  const dim = row.muted ? 'opacity-50' : '';
  return (
    <li className="flex flex-wrap items-center gap-x-[14px] gap-y-[8px] px-[18px] py-[14px] pr-[20px]">
      <Lead lead={row.lead} dim={dim} />
      <div className={classNames('flex min-w-[200px] flex-1 flex-col gap-[2px]', dim)}>
        <div className="flex flex-wrap items-center gap-[8px]">
          {row.to ? (
            <Link
              to={row.to}
              className="text-[16px] leading-[19px] font-semibold text-[#1c2a21] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {row.title}
            </Link>
          ) : (
            <span className="text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
              {row.title}
            </span>
          )}
          {row.sticker ? (
            <span className="inline-flex items-center rounded-full bg-[#ebf1ec] px-[10px] py-[4px] text-[11px] leading-[13px] font-bold text-[#1f4a2b]">
              {row.sticker}
            </span>
          ) : null}
        </div>
        <p className="m-0 text-[13px] leading-[16px] text-[#737373]">{row.sub}</p>
      </div>
      <div className={classNames('flex flex-wrap items-center gap-[6px]', dim)}>
        {row.chips.map((c) => (
          <Chip key={c.label} chip={c} />
        ))}
      </div>
      {row.pill ? (
        <Link
          to={row.to ?? '#'}
          aria-label={`${row.pill.label} ${row.title}`}
          className={classNames(
            'inline-flex h-[25px] items-center rounded-full border border-solid px-[10px] text-[12.5px] leading-[15px] font-bold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            row.pill.strong
              ? 'border-[#1c2a21] bg-[#387440] text-white'
              : 'border-[#c1d4c4] bg-[#ebf1ec] text-[#2d5d33]',
            dim
          )}
        >
          {row.pill.label}
        </Link>
      ) : null}
      <span className={classNames('min-w-[14px] text-[12.5px] leading-[15px] text-[#737373]', dim)}>
        {row.age}
      </span>
      <button
        type="button"
        aria-label={`Save ${row.title}`}
        onClick={() => onSave?.(row)}
        className={classNames(
          'grid size-[34px] shrink-0 cursor-pointer place-items-center rounded-full border border-solid border-[#1c2a21] bg-[#1c2a21] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
          dim
        )}
      >
        <AdminBookmarkIcon className="size-[15px]" />
      </button>
      {row.button ? (
        <AgencyButton size="md" onClick={() => onButton?.(row)}>
          {row.button}
        </AgencyButton>
      ) : (
        <button
          type="button"
          aria-label={`Open ${row.title}`}
          onClick={() => row.to && navigate(row.to)}
          className="grid size-[24px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AdminArrowRightIcon className="size-[16px]" />
        </button>
      )}
    </li>
  );
};

export default QueueRow;
