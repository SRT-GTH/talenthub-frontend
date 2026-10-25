import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { PublicIconSearch } from '../../publicData/publicDataIcons.jsx';
import { PROGRAMME_FILTERS, closeSentence } from '../data/programmesData.js';
import ProgrammeCard from './ProgrammeCard.jsx';
import ProgrammeConfirmDialog from './ProgrammeConfirmDialog.jsx';
import ProgrammesHeader from './ProgrammesHeader.jsx';
import { ProgrammesIconWrite } from './programmesIcons.jsx';
import { closeProgramme, duplicateProgramme, useProgrammesStore } from './useProgrammesStore.js';
import Button from '../../../ui/Button.jsx';

const log = debug('ProgrammesListView');

/*
 * ProgrammesListView — "Your programmes" (Figma 11.5.2e All 8610:400592, 11.5.2f Drafts 8610:401148, 11.5.2j actions menu 8610:403301, 11.5.2k close dialog
 * 8610:403837): header + tabs, the filter chips (All (5) · Live · Draft · Closed; the active chip carries its count), the search field, "Post a programme",
 * "Showing 1 programme in Draft" under a filter, and the card grid (3 columns at 1329).
 * URL keys: tab=live|drafts|closed (default all), q= (search text), modal=actions|close with at=<programme id> (the card's menu / the close confirmation).
 * ⚠️ ASSUMPTIONS: Edit / "Continue editing" open the form with ?programme=<id>; Duplicate adds a draft "<title> (copy)"; closing sets the programme to Closed
 * (mock, in memory) and announces it; "View summary" of a closed programme opens its applicants; the card count is "All (n)" of the whole list.
 * Props: data (useAgencyState()).
 */

const FILTER_FROM_TAB = { drafts: 'draft', live: 'live', closed: 'closed' };

const ProgrammesListView = ({ data }) => {
  const navigate = useNavigate();
  const { programmes } = useProgrammesStore();
  const [announce, setAnnounce] = useState('');
  const buttonRefs = useRef({});
  const filter = FILTER_FROM_TAB[data.tab] ?? 'all';
  const needle = data.q.trim().toLowerCase();
  const at = data.params.get('at');
  const { modal, update } = data;

  const counts = useMemo(
    () => ({
      all: programmes.length,
      live: programmes.filter((p) => p.status === 'live').length,
      draft: programmes.filter((p) => p.status === 'draft').length,
      closed: programmes.filter((p) => p.status === 'closed').length,
    }),
    [programmes]
  );

  const visible = programmes.filter(
    (p) =>
      (filter === 'all' || p.status === filter) &&
      (!needle || p.title.toLowerCase().includes(needle))
  );

  useEffect(() => {
    log('mount', { filter, count: visible.length, modal, at });
  }, [filter, visible.length, modal, at]);

  const closeMenu = useCallback(
    (reason) => {
      const id = at;
      update({ modal: null, at: null }, { replace: true });
      if (id && reason !== 'tab' && reason !== 'outside') buttonRefs.current[id]?.focus();
    },
    [at, update]
  );

  const hrefFor = (p) =>
    p.status === 'draft'
      ? `/agency/programmes/new?programme=${p.id}`
      : `/agency/programmes/${p.id}/applicants`;

  const choose = (p, action) => {
    log('action', action, p.id);
    if (action === 'edit') navigate(`/agency/programmes/new?programme=${p.id}`);
    else if (action === 'duplicate') {
      const copy = duplicateProgramme(p.id);
      update({ modal: null, at: null }, { replace: true });
      setAnnounce(`Duplicated ${p.title} as a draft${copy ? `: ${copy.title}` : ''}.`);
    } else if (action === 'close') update({ modal: 'close', at: p.id });
  };

  const target = at ? programmes.find((p) => p.id === at) : null;
  const filterLabel = PROGRAMME_FILTERS.find((f) => f.id === filter)?.label;

  return (
    <div className="flex flex-col gap-[28px] font-sans">
      <ProgrammesHeader
        title="Programmes"
        sentence="National and regional government programmes you’ve posted, from draft to funded."
        tab="programmes"
      />
      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-wrap items-center justify-between gap-x-[28px] gap-y-[16px]">
          <div role="group" aria-label="Filter programmes" className="flex flex-wrap gap-[8px]">
            {PROGRAMME_FILTERS.map((f) => {
              const active = f.id === filter;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    update(
                      {
                        tab: f.id === 'all' ? null : f.id === 'draft' ? 'drafts' : f.id,
                        modal: null,
                        at: null,
                      },
                      { replace: true }
                    )
                  }
                  className={classNames(
                    'inline-flex min-h-[37px] cursor-pointer items-center gap-[4px] rounded-full border border-solid px-[14px] py-[6px] text-[14px] leading-[24px] tracking-[0.24px] shadow-[0_1.2px_3.6px_rgba(0,0,0,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                    active
                      ? 'border-[#e1eae2] bg-[#387440] text-white'
                      : 'border-[#e1eae2] bg-white font-medium text-[#737373]'
                  )}
                >
                  <span className={active ? 'font-semibold' : ''}>{f.label}</span>
                  {active ? <span className="font-medium">({counts[f.id]})</span> : null}
                </button>
              );
            })}
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-[19px]">
            <label className="flex h-[49px] w-full max-w-[362px] min-w-[200px] flex-1 items-center gap-[10px] rounded-[12px] border border-solid border-[#cccccc] bg-white px-[24px] shadow-[0_3px_0_rgba(0,0,0,0.04)] focus-within:border-[#387440]">
              <PublicIconSearch className="size-[19px] shrink-0 text-[#595959]" />
              <span className="sr-only">Search your programmes</span>
              <input
                type="search"
                value={data.q}
                placeholder="Search your programmes…"
                onChange={(e) => update({ q: e.target.value }, { replace: true })}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14.5px] leading-[24px] tracking-[0.24px] text-[#1c2a21] outline-none placeholder:text-[#999999]"
              />
            </label>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="!rounded-[12px] !px-[24px] !py-[12px] !text-[14px] !font-medium"
              leftIcon={<ProgrammesIconWrite />}
              onClick={() => navigate('/agency/programmes/new?modal=template')}
            >
              Post a programme
            </Button>
          </div>
        </div>
        {filter !== 'all' ? (
          <p className="m-0 -mt-[12px] text-[14px] leading-[17px] text-[#959592]">
            Showing {visible.length} {visible.length === 1 ? 'programme' : 'programmes'} in{' '}
            <span className="font-medium text-[#387440]">{filterLabel}</span>
          </p>
        ) : null}
        {visible.length ? (
          <ul className="m-0 grid list-none grid-cols-1 gap-[16px] p-0 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((p) => (
              <li key={p.id} className="min-w-0">
                <ProgrammeCard
                  programme={p}
                  href={hrefFor(p)}
                  menuOpen={modal === 'actions' && at === p.id}
                  buttonRef={(el) => {
                    buttonRefs.current[p.id] = el;
                  }}
                  onToggleMenu={() =>
                    modal === 'actions' && at === p.id
                      ? closeMenu('toggle')
                      : update({ modal: 'actions', at: p.id }, { replace: true })
                  }
                  onChoose={(a) => choose(p, a)}
                  onCloseMenu={closeMenu}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 rounded-[14px] border border-solid border-[#e6e2d6] bg-white p-[24px] text-[14px] leading-[20px] text-[#737373]">
            No programmes to show.
          </p>
        )}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
      {modal === 'close' && target ? (
        <ProgrammeConfirmDialog
          title="Close this programme?"
          body={closeSentence(target.applicants ?? 0)}
          confirmLabel="Yes, close it"
          cancelLabel="No, keep it open"
          width={528}
          onConfirm={() => {
            closeProgramme(target.id);
            update({ modal: null, at: null }, { replace: true });
            setAnnounce(`${target.title} is closed.`);
          }}
          onCancel={() => update({ modal: null, at: null }, { replace: true })}
        />
      ) : null}
    </div>
  );
};

export default ProgrammesListView;
