import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { PublicIconSearch } from '../../publicData/publicDataIcons.jsx';
import { TEMPLATES, TEMPLATE_FILTERS } from '../data/programmesData.js';
import ProgrammesHeader from './ProgrammesHeader.jsx';
import {
  ProgrammesIconArrowRight,
  ProgrammesIconPlus,
  ProgrammesIconTplCode,
  ProgrammesIconTplHat,
  ProgrammesIconTplMegaphone,
  ProgrammesIconTplPalette,
  ProgrammesIconTplPlus,
  ProgrammesIconTplService,
} from './programmesIcons.jsx';

const log = debug('TemplatesView');

/*
 * TemplatesView — "Programme templates" (Figma 11.5.2g, 8610:401606; manifest URL /agency/programmes/new?modal=template): header with the coloured word
 * "templates", the tab row, the chips (All · Grants · National service · Training · Employment · Events · Internships), the search field, "Start blank",
 * and the grid of template cards (315 x 360, r14, p22) ending with the dashed "Create Custom" card.
 * A card opens the "Who can apply" form for that template (/agency/programmes/new?template=<id>, ⚠️ ASSUMPTION), "Start blank" / "Create Custom" open it empty.
 * URL keys: group= (chip), q= (search). Figma inconsistency kept out: the first card's title is drawn in Bricolage Grotesque 25 (a leftover); all titles use 24/600.
 * Props: data (useAgencyState()).
 */

const ICONS = {
  code: ProgrammesIconTplCode,
  megaphone: ProgrammesIconTplMegaphone,
  service: ProgrammesIconTplService,
  hat: ProgrammesIconTplHat,
  palette: ProgrammesIconTplPalette,
};

const TemplatesView = ({ data }) => {
  const navigate = useNavigate();
  const group = data.params.get('group') ?? 'all';
  const needle = data.q.trim().toLowerCase();

  useEffect(() => {
    log('mount', { group, needle });
  }, [group, needle]);

  const visible = useMemo(
    () =>
      TEMPLATES.filter(
        (t) =>
          (group === 'all' || t.group === group) &&
          (!needle || t.title.toLowerCase().includes(needle))
      ),
    [group, needle]
  );

  return (
    <div className="flex flex-col gap-[28px] font-sans">
      <ProgrammesHeader
        title="Programme"
        accent="templates"
        sentence="Start from a template built for Ghanaian government programmes."
        tab="templates"
      />
      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-wrap items-center justify-between gap-x-[28px] gap-y-[16px]">
          <div role="group" aria-label="Template groups" className="flex flex-wrap gap-[8px]">
            {TEMPLATE_FILTERS.map((f) => {
              const active = f.id === group;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    data.update({ group: f.id === 'all' ? null : f.id }, { replace: true })
                  }
                  className={classNames(
                    'inline-flex min-h-[37px] cursor-pointer items-center rounded-full border border-solid border-[#e1eae2] px-[14px] py-[6px] text-[14px] leading-[24px] tracking-[0.24px] shadow-[0_1.2px_3.6px_rgba(0,0,0,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                    active
                      ? 'bg-[#387440] font-semibold text-white'
                      : 'bg-white font-medium text-[#737373]'
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-[19px]">
            <label className="flex h-[49px] w-full max-w-[362px] min-w-[200px] flex-1 items-center gap-[10px] rounded-[12px] border border-solid border-[#cccccc] bg-white px-[24px] shadow-[0_3px_0_rgba(0,0,0,0.04)] focus-within:border-[#387440]">
              <PublicIconSearch className="size-[19px] shrink-0 text-[#595959]" />
              <span className="sr-only">Search templates</span>
              <input
                type="search"
                value={data.q}
                placeholder="Search templates..."
                onChange={(e) => data.update({ q: e.target.value }, { replace: true })}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14.5px] leading-[24px] tracking-[0.24px] text-[#1c2a21] outline-none placeholder:text-[#999999]"
              />
            </label>
            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<ProgrammesIconPlus />}
              className="!rounded-[12px] !px-[24px] !py-[12px] !text-[14px] !font-medium"
              onClick={() => navigate('/agency/programmes/new')}
            >
              Start blank
            </Button>
          </div>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-[21px] p-0 sm:grid-cols-2 xl:grid-cols-4">
          {visible.map((t) => {
            const Icon = ICONS[t.icon];
            return (
              <li key={t.id} className="min-w-0">
                <Link
                  to={`/agency/programmes/new?template=${t.id}`}
                  className="flex h-full min-h-[360px] flex-col rounded-[14px] border border-solid border-[#e6e2d6] bg-white p-[22px] text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  <span
                    className={classNames(
                      'grid size-[48px] place-items-center rounded-[8px]',
                      t.tile.bg,
                      t.tile.fg
                    )}
                  >
                    <Icon className="h-[20px] w-[24px]" />
                  </span>
                  <span className="mt-[24px] flex flex-col gap-[12px]">
                    <span className="text-[24px] leading-[30px] font-semibold tracking-[-0.12px] text-[#1c2a21]">
                      {t.title}
                    </span>
                    <span className="flex items-center gap-[6px] text-[14px] leading-[17px]">
                      <span className="rounded-full border border-solid border-[#e8e8e4] bg-[#f8f8f4] px-[9.6px] py-[6px] font-medium text-[#737373]">
                        {t.badge}
                      </span>
                      <span aria-hidden="true" className="text-[#959592]">
                        •
                      </span>
                      <span className="text-[#959592]">{t.length}</span>
                    </span>
                  </span>
                  <span className="mt-[16px] text-[14px] leading-[22px] text-[#737373]">
                    {t.blurb}
                  </span>
                  <span className="mt-auto flex items-center justify-between border-0 border-t border-solid border-[#e6e2d6] pt-[18px] text-[14px] leading-[18px] text-[#999999]">
                    {t.foot}
                    <ProgrammesIconArrowRight className="size-[24px] text-[#2a5730]" />
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="min-w-0">
            <Link
              to="/agency/programmes/new"
              className="flex h-full min-h-[360px] flex-col items-center justify-center gap-[11px] rounded-[14px] border-2 border-dashed border-[#d6d1c2] px-[44px] py-[23px] text-center text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <span className="mb-[16px] grid size-[64px] place-items-center rounded-full bg-[#f0eee8] text-[#9a988f]">
                <ProgrammesIconTplPlus className="size-[19px]" />
              </span>
              <span className="text-[24px] leading-[30px] font-semibold tracking-[-0.12px] text-[#1c2a21]">
                Create Custom
              </span>
              <span className="text-[14px] leading-[22px] text-[#737373]">
                Start blank and add only what you need.
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TemplatesView;
