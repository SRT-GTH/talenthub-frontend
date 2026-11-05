import { useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import NamePageHeading from '../names/NamePageHeading.jsx';
import SyncPagesTree from './SyncPagesTree.jsx';
import SyncPortalTabs from './SyncPortalTabs.jsx';
import SyncSearch from './SyncSearch.jsx';
import SyncSectionPane from './SyncSectionPane.jsx';
import { SparkleIcon } from './SyncIcons.jsx';
import { SYNC_PORTALS, SYNC_SECTIONS, SYNC_VIEWS } from './releaseSyncData.js';

const log = debug('SyncBrowseView');

/*
 * SyncBrowseView — the Site copy browse right after a release (Figma 7.8.8a-c): heading, the "Release 2.4 added 1 page and 6 sections…" note (7.8.8a),
 * the portal tabs + search, then the page tree and the section pane side by side (stacked below lg).
 *   view 'after-release'  Talent portal, Scholarships open with "New" chips (7.8.8a)
 *   view 'changed'        Public site › Home, Hero edited and its original text changed under the edit (7.8.8b)
 *   view 'removed'        Public site, "Removed sections (2)" with Home › Testimonials open, read-only (7.8.8c)
 * Interaction: open / close a page, pick a section (its pane opens), type in the fields (counters follow), "Keep my edit" / "Use the new original" /
 * "Reset to default" settle the changed original, the search filters the tree. Mock data only (releaseSyncData.js).
 * ⚠️ ASSUMPTION: "Keep my edit" keeps the text and clears the notice; "Use the new original" (and "Reset to default") replaces the headline with the
 * new original text and clears the notice and the "Changed" chip; a section without a drawn editor opens a one-field editor with its summary line.
 * Props: ctx, name ('after-release' | 'changed' | 'removed').
 */
const flatSections = (view) => [
  ...view.pages.flatMap((p) => p.sections ?? []),
  ...(view.removed?.sections ?? []),
];

const SyncBrowseView = ({ ctx, name }) => {
  const view = SYNC_VIEWS[name];
  const [open, setOpen] = useState(() => new Set([view.openPage]));
  const [selected, setSelected] = useState(view.selected);
  const [query, setQuery] = useState('');
  const [edits, setEdits] = useState({});
  const [settled, setSettled] = useState({});

  useEffect(() => {
    log('mount', { view: name, role: ctx.role, selected: view.selected });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const def = useMemo(() => {
    const known = SYNC_SECTIONS[selected];
    if (known) return known;
    const s = flatSections(view).find((x) => x.id === selected);
    const page = view.pages.find((p) => p.sections?.some((x) => x.id === selected));
    const portal = SYNC_PORTALS.find((p) => p.id === view.portal)?.label ?? '';
    return {
      path: s?.name.includes('›')
        ? [portal, ...s.name.split(' › ')]
        : [portal, page?.name ?? '', s?.name ?? ''].filter(Boolean),
      title: s?.name ?? '',
      chip: s?.chip ?? 'default',
      fields: [{ id: 'text', label: 'Text', kind: 'line', value: s?.sub ?? '', max: 160 }], // ⚠️ ASSUMPTION: not drawn
    };
  }, [selected, view]);

  const values = edits[selected] ?? {};
  const changedOpen = Boolean(def.changed) && !settled[selected];

  const toggle = (pageId) => {
    log('toggle page', pageId);
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(pageId)) next.delete(pageId);
      else next.add(pageId);
      return next;
    });
  };

  const onChange = (fieldId, text) =>
    setEdits((e) => ({ ...e, [selected]: { ...e[selected], [fieldId]: text } }));

  const keep = () => {
    log('keep my edit', selected);
    setSettled((s) => ({ ...s, [selected]: 'kept' }));
  };
  const useNew = () => {
    log('use the new original', selected);
    onChange(def.changed.field, def.changed.newOriginal);
    setSettled((s) => ({ ...s, [selected]: 'new' }));
  };

  return (
    <div className="flex flex-col gap-[24px] pt-[4px]">
      <NamePageHeading title="Site copy" subtitle={view.subtitle} />
      <div className="flex flex-col gap-[24px]">
        {view.banner ? (
          <p
            role="status"
            className="m-0 flex items-center gap-[12px] rounded-[16px] bg-[#ebf1ec]/50 p-[16px] font-sans text-[14px] leading-[20px] font-medium text-[#2a5730]"
          >
            <SparkleIcon className="size-[18px] shrink-0 text-[#27522e]" />
            {view.banner}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-[12px]">
          <SyncPortalTabs ctx={ctx} current={view.portal} />
          <SyncSearch value={query} onChange={setQuery} />
        </div>
        <div className="flex flex-col items-start gap-[24px] lg:flex-row">
          <SyncPagesTree
            ctx={ctx}
            view={view}
            open={open}
            onToggle={toggle}
            selected={selected}
            onSelect={(id) => {
              log('select section', id);
              setSelected(id);
            }}
            query={query}
          />
          <SyncSectionPane
            key={selected}
            ctx={ctx}
            sectionId={selected}
            def={def}
            values={values}
            onChange={onChange}
            changedOpen={changedOpen}
            onKeep={keep}
            onUseNew={useNew}
          />
        </div>
      </div>
    </div>
  );
};

export default SyncBrowseView;
