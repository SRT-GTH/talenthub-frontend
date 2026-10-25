import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { AdminMagnifierIcon, AdminPlusIcon } from '../adminIcons.jsx';
import CommsTabs from './CommsTabs.jsx';
import {
  AdminArrowMdIcon,
  AdminTplCapIcon,
  AdminTplCodeIcon,
  AdminTplMegaphoneIcon,
  AdminTplPaletteIcon,
  AdminTplPlusIcon,
  AdminTplShieldIcon,
} from './commsIcons.jsx';
import { TEMPLATES as DESIGN } from './data/adminCommsData.js';

const log = debug('TemplatesView');

/*
 * TemplatesView — /admin/comms/templates (Figma 7.4.3a "Comms · Notification templates" 8638:3946, behind 7.4.3b-d): title 32/40 600 ("templates" green) + sub · the Sent / Templates /
 * Bulk notification tabs (Templates selected) · filter pills (All selected, Account, Moderation, Verification, System, Marketing, Minors) + search (362) + the green
 * "New template" button (159 x 49) · four template cards per row (315 x 360, white, 1px #e6e2d6, r14, p22: a 48 tile, 24/600 title, area + channel pills, 14 #737373 text, a
 * rule and "Active · v4" + an arrow) and a dashed "New template" card (2px #d6d1c2).
 * Props: onOpen(card), onNew(). ⚠️ ASSUMPTION: the filter pills and the search only log; opening a card opens the edit dialog. The first card's title is drawn in Bricolage 25
 * (the other four are SF Pro Rounded 24): kept as drawn.
 */

const TILE_ICONS = {
  code: AdminTplCodeIcon,
  megaphone: AdminTplMegaphoneIcon,
  shield: AdminTplShieldIcon,
  cap: AdminTplCapIcon,
  palette: AdminTplPaletteIcon,
};

const TemplatesView = ({ data, onOpen, onNew, cards, filters, sub, query = '', onQuery, canCreate = true, notice }) => {
  const filter = data.params.get('chip') ?? 'all';
  const TEMPLATES = { ...DESIGN, sub: sub ?? DESIGN.sub, filters: filters ?? DESIGN.filters, cards: cards ?? DESIGN.cards };
  return (
    <div className="flex flex-col gap-[28px] pt-[4px]">
      <div className="flex flex-col gap-[16px]">
        <header className="flex flex-col gap-[3px]">
          <h1 className="m-0 font-sans text-[32px] leading-[40px] font-semibold text-[#1c2a21]">
            Notification <span className="text-[#387440]">templates</span>
          </h1>
          <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999999]">{TEMPLATES.sub}</p>
          {notice}
        </header>
        <CommsTabs active="templates" />
      </div>

      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-wrap items-center justify-between gap-[16px]">
          <div
            role="group"
            aria-label="Template areas"
            className="flex flex-wrap items-center gap-[8px]"
          >
            {TEMPLATES.filters.map((f, i) => {
              const id = i === 0 ? 'all' : f.toLowerCase();
              const on = filter === id;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    log('filter', id);
                    data.update({ chip: id === 'all' ? null : id });
                  }}
                  className={classNames(
                    'inline-flex h-[37px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[14px] leading-[25px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                    on
                      ? 'border-[#e1eae2] bg-[#387440] font-semibold text-white'
                      : 'border-[#e1eae2] bg-white font-medium text-[#737373]'
                  )}
                >
                  {f}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-[19px]">
            <label className="flex h-[49px] w-[362px] max-w-full items-center gap-[10px] rounded-[12px] border border-solid border-[#cccccc] bg-white px-[24px]">
              <AdminMagnifierIcon className="size-[19px] shrink-0 text-[#999999]" />
              <input
                type="search"
                aria-label="Search templates"
                placeholder={TEMPLATES.search}
                value={query}
                onChange={(e) => onQuery?.(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[14.5px] text-[#1c2a21] outline-none placeholder:text-[#999999]"
              />
            </label>
            {canCreate ? (
            <button
              type="button"
              onClick={onNew}
              className="inline-flex h-[49px] cursor-pointer items-center gap-[7px] rounded-[12px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[24px] font-sans text-[14px] leading-[17px] font-medium text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <AdminPlusIcon className="size-[18px]" />
              {TEMPLATES.create}
            </button>
            ) : null}
          </div>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 gap-[21px] p-0 sm:grid-cols-2 xl:grid-cols-4">
          {TEMPLATES.cards.map((c) => {
            const Icon = TILE_ICONS[c.icon] ?? AdminTplCodeIcon;
            return (
              <li key={c.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => onOpen(c)}
                  className="flex h-[360px] w-full cursor-pointer flex-col rounded-[14px] border border-solid border-[#e6e2d6] bg-white p-[22px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      'grid size-[48px] shrink-0 place-items-center rounded-[8px]',
                      c.dark ? 'text-white' : 'text-[#2a5730]'
                    )}
                    style={{ backgroundColor: c.tile }}
                  >
                    <Icon className="size-[23px]" />
                  </span>
                  <span className="flex flex-col gap-[12px] pt-[24px]">
                    <span
                      className={classNames(
                        'font-semibold text-[#1c2a21]',
                        c.quirk
                          ? "font-['Bricolage_Grotesque',system-ui,sans-serif] text-[25px] leading-[30px]"
                          : 'font-sans text-[24px] leading-[30px]'
                      )}
                    >
                      {c.title}
                    </span>
                    <span className="flex flex-wrap items-center gap-[6px] font-sans text-[14px] leading-[17px]">
                      <span className="inline-flex rounded-full border border-solid border-[#e8e8e4] bg-[#f8f8f4] px-[10px] py-[6px] font-medium text-[#737373]">
                        {c.area}
                      </span>
                      <span className="text-[#9a988f]">•</span>
                      <span className="text-[#9a988f]">{c.channel}</span>
                    </span>
                  </span>
                  <span className="min-h-[44px] flex-1 pt-[16px] font-sans text-[14px] leading-[22px] text-[#737373]">
                    {c.text}
                  </span>
                  <span className="mt-auto flex items-center justify-between border-t border-solid border-[#e6e2d6] pt-[18px] font-sans text-[14px] leading-[18px] text-[#999999]">
                    {c.status}
                    <AdminArrowMdIcon className="size-[24px] text-[#387440]" />
                  </span>
                </button>
              </li>
            );
          })}
          {canCreate ? (
          <li className="min-w-0">
            <button
              type="button"
              onClick={onNew}
              className="flex h-[360px] w-full cursor-pointer flex-col items-center gap-[11px] rounded-[14px] border-2 border-dashed border-[#d6d1c2] bg-transparent px-[23px] pt-[44px] text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <span className="grid size-[64px] place-items-center rounded-full bg-[#f0eee8] text-[#737373]">
                <AdminTplPlusIcon className="size-[19px]" />
              </span>
              <span className="pt-[16px] font-sans text-[24px] leading-[30px] font-semibold text-[#1c2a21]">
                {TEMPLATES.blank.title}
              </span>
              <span className="px-[18px] pt-[8px] font-sans text-[14px] leading-[22px] text-[#737373]">
                {TEMPLATES.blank.text}
              </span>
            </button>
          </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
};

export default TemplatesView;
