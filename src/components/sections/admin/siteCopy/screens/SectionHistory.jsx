import { useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import HistoryDetailPanel from '../history/HistoryDetailPanel.jsx';
import HistoryPagesPanel from '../history/HistoryPagesPanel.jsx';
import RestoreDialog from '../history/RestoreDialog.jsx';
import RestoreToast from '../history/RestoreToast.jsx';
import { useSectionHistory } from '../history/useSectionHistory.js';
import { PreviewSearchIcon } from '../preview/PreviewIcons.jsx';
import { PAGES_TOTAL, PORTAL_TABS, PUBLIC_PAGES } from '../preview/previewHistoryData.js';
import { sectionMeta } from '../preview/previewModel.js';

const log = debug('SectionHistory');

/*
 * SectionHistory — Platform Admin 7.8.5 "History" of a section: every published version (who, when, why), compare a version with the one before it, restore an old
 * version with a reason (it becomes a NEW live version, nothing is overwritten) and the confirmation toast.
 * Route  /admin/site-copy/section/:sectionId/history   (ctx.segments = ['section', id, 'history'])   Frames 7.8.5a-e.
 * Query  ?compare=<version> opens "What changed in version N" under that row (5b)  ·  ?modal=restore&version=<n> opens "Restore version N?" (5c; ?reason= prefills the
 *        reason, mock only)  ·  ?notice=restored&from=<n> shows the toast and the new live version on top (5d; works from a fresh session, the list is derived in memory)  ·
 *        ?q= filters the Pages panel.
 *   5a  /admin/site-copy/section/public.home.hero/history?role=editor     5b …?compare=5     5c …?modal=restore&version=4&reason=Undo%20typo
 *   5d  …?notice=restored&from=4&reason=Undo%20typo     5e  /admin/site-copy/section/public.home.features/history?role=editor
 * Data: shared mock KV `site-copy.history.<sectionId>` (seed: the drawn hero history) and `site-copy.published` (written by a restore). Roles: Restore needs
 * `session.copy.publish`; roles that can only read see the list with Restore disabled.
 */
const portalOf = (id) => PORTAL_TABS.find((t) => t.id === id) ?? PORTAL_TABS[0];

const pagesFor = (meta) =>
  meta.portal === 'public'
    ? PUBLIC_PAGES
    : [
        {
          id: meta.page,
          label: meta.page,
          status: 'default',
          // ⚠️ ASSUMPTION: only the Public site pages are drawn; other portals list the page of this section alone.
          sections: [{ id: meta.id, label: meta.label, summary: '', status: 'default' }],
        },
      ];

const Body = ({ ctx, data, session, sectionId }) => {
  const meta = useMemo(() => sectionMeta(sectionId), [sectionId]);
  const history = useSectionHistory(sectionId);
  const params = data.params;
  const compareParam = Number(params.get('compare')) || null;
  const restoreParam = params.get('modal') === 'restore' ? Number(params.get('version')) : null;
  const notice = params.get('notice') === 'restored' ? Number(params.get('from')) : null;
  const reasonParam = params.get('reason') ?? '';
  const actor = session.staff?.name ?? 'Ama Owusu';
  const canRestore = Boolean(session.copy?.publish);
  const portal = portalOf(meta.portal);

  // 7.8.5d from a fresh session: the restored list is derived in memory (a frame URL must not depend on stored state).
  const derived = notice && !history.versions.some((v) => v.restoredFrom);
  const versions = derived
    ? history.restoredPreview(notice, reasonParam || 'Undo typo', actor)
    : history.versions;
  const live = versions[0]?.version ?? 1;
  const restoring = restoreParam ? versions.find((v) => v.version === restoreParam) : null;
  const q = data.q;

  useEffect(() => {
    log('mount', {
      sectionId,
      versions: versions.length,
      live,
      compare: compareParam,
      restoring: restoring?.version ?? null,
      notice,
      role: session.role,
      canRestore,
    });
  }, [
    sectionId,
    versions.length,
    live,
    compareParam,
    restoring?.version,
    notice,
    session.role,
    canRestore,
  ]);

  const closeToast = useCallback(
    () => data.update({ notice: null, from: null, reason: null }, { replace: true }),
    [data]
  );

  const onToggle = (n) => {
    log('compare', { version: n, open: compareParam === n });
    data.update({ compare: compareParam === n ? null : n });
  };
  const onRestore = (n) => {
    log('restore dialog', n);
    data.update({ modal: 'restore', version: n });
  };
  const closeDialog = () => data.update({ modal: null, version: null, reason: null });
  const confirm = (reason) => {
    const entry = history.restore(restoring.version, reason, actor);
    data.update({
      modal: null,
      version: null,
      reason: null,
      compare: null,
      notice: 'restored',
      from: restoring.version,
    });
    log('restored', entry.version);
  };
  const undo = () => {
    if (!derived) history.undo(live);
    data.update({ notice: null, from: null, reason: null, compare: null });
  };

  const edited = versions.length > 1;
  const quote = restoring ? (Object.values(restoring.fields ?? {})[0]?.after ?? '') : '';

  return (
    <div className="relative flex min-w-0 flex-col gap-[24px]">
      <header className="flex flex-col gap-[3px]">
        <h1 className="m-0 font-sans text-[clamp(26px,2.4vw,34px)] leading-[1.2] font-semibold tracking-[-0.02em] text-[#1c2a21]">
          Site copy
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959]">
          {`${portal.label} · ${meta.page} · History`}
        </p>
      </header>
      <div className="flex flex-wrap items-center gap-[12px]">
        <nav
          aria-label="Portals"
          className="flex max-w-full items-center gap-[4px] overflow-x-auto rounded-[14px] bg-[#f8f8f4] p-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PORTAL_TABS.map((t) => {
            const active = t.id === portal.id;
            return (
              <Link
                key={t.id}
                to={copyUrl(
                  ctx,
                  COPY_PATHS.siteCopy,
                  t.id === 'emails' ? { tab: 'emails' } : { portal: t.id }
                )}
                aria-current={active ? 'page' : undefined}
                className={classNames(
                  'inline-flex min-h-[35px] shrink-0 items-center rounded-[11px] border border-solid px-[16px] py-[9px] font-sans text-[14px] leading-[17px] whitespace-nowrap no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                  active
                    ? 'border-[#e7e7e7] bg-white font-semibold text-[#1c2a21]'
                    : 'border-transparent font-medium text-[#575755]'
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
        <span className="hidden min-w-0 flex-1 lg:block" />
        <label className="flex min-h-[44px] w-full items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[11px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440] lg:w-[min(380px,100%)]">
          <PreviewSearchIcon className="size-[18px] shrink-0 text-[#387440]" />
          <span className="sr-only">Search pages, sections or words</span>
          <input
            type="search"
            value={q}
            onChange={(e) => data.update({ q: e.target.value }, { replace: true })}
            placeholder="Search pages, sections or words"
            className="min-h-[24px] min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] text-[#1c2a21] outline-none placeholder:text-[#575755]"
          />
        </label>
      </div>
      <div className="grid grid-cols-1 items-start gap-[24px] xl:grid-cols-[minmax(300px,420px)_minmax(0,1fr)]">
        <HistoryPagesPanel
          ctx={ctx}
          pages={pagesFor(meta)}
          total={meta.portal === 'public' ? PAGES_TOTAL : 1}
          currentId={sectionId}
          currentStatus={edited ? 'edited' : 'default'}
          query={q}
        />
        <HistoryDetailPanel
          portalLabel={portal.label}
          meta={meta}
          versions={versions}
          compare={compareParam}
          canRestore={canRestore}
          backTo={copyUrl(ctx, COPY_PATHS.section(sectionId))}
          onToggle={onToggle}
          onRestore={onRestore}
        />
      </div>
      {notice ? (
        <RestoreToast version={live} from={notice} onUndo={undo} onClose={closeToast} />
      ) : null}
      {restoring ? (
        <RestoreDialog
          version={restoring.version}
          next={live + 1}
          live={live}
          quote={quote}
          initialReason={reasonParam}
          onCancel={closeDialog}
          onConfirm={confirm}
        />
      ) : null}
    </div>
  );
};

const SectionHistory = ({ ctx, data, session }) => (
  <Body key={ctx.segments[1]} ctx={ctx} data={data} session={session} sectionId={ctx.segments[1]} />
);

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.5',
    area: 'site-copy',
    priority: 20,
    match: (ctx) =>
      ctx.segments.length === 3 && ctx.segments[0] === 'section' && ctx.segments[2] === 'history',
    Component: SectionHistory,
  },
];

export default SectionHistory;
