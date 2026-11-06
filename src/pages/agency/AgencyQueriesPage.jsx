import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import AgencyBanner from '../../components/sections/agency/AgencyBanner.jsx';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import { formatMonthYear, quotaPercent } from '../../components/sections/agency/agencyFormat.js';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import { useAgencySession } from '../../components/sections/agency/useAgencySession.js';
import {
  queryApiParams,
  queryTitle,
  regionOptionsWith,
} from '../../components/sections/agency/data/queriesData.js';
import { agencySaveQuery } from '../../services/agency.api.js';
import { useAgencySessionState } from '../../components/sections/agency/agencySessionStore.js';
import ExportCsvDialog from '../../components/sections/agency/queries/ExportCsvDialog.jsx';
import MoreFiltersDrawer from '../../components/sections/agency/queries/MoreFiltersDrawer.jsx';
import QueryFilterBar from '../../components/sections/agency/queries/QueryFilterBar.jsx';
import QueryResultsBody from '../../components/sections/agency/queries/QueryResultsBody.jsx';
import QuerySummaryBanner from '../../components/sections/agency/queries/QuerySummaryBanner.jsx';
import QueryToast from '../../components/sections/agency/queries/QueryToast.jsx';
import SaveQueryDialog from '../../components/sections/agency/queries/SaveQueryDialog.jsx';
import SavedQueriesView from '../../components/sections/agency/queries/SavedQueriesView.jsx';
import {
  useLiveOverview,
  useQueryPage,
} from '../../components/sections/agency/queries/useQueryPage.js';
import EmptyState from '../../components/sections/publicData/ui/EmptyState.jsx';
import { GOVERNMENT_PAGE_TEXT, governmentPageText } from '../../copy/portals/governmentCopy.js';

const log = debug('AgencyQueriesPage');

/*
 * AgencyQueriesPage — Figma 11.5.1a-h (canvas 8605:395409): /agency/queries (build + results) and /agency/queries/saved.
 *   a  Build a query         /agency/queries?region=volta&interest=technology&age=18-24&menu=region   the Region menu open
 *   b  Results               ?state=results&region=volta&interest=technology&age=18-24
 *   c  Save query            ?state=results&modal=save-query&…        d  Export CSV   ?state=results&modal=export&…
 *   e  Saved queries         /agency/queries/saved
 *   f  No results            ?state=zero&region=upper-west&interest=technology&age=18-24
 *   g  Profile filters       ?state=results&profile=1&region=volta   (the preset of extra filters; see useQueryPage)
 *   h  More filters drawer   ?modal=filters&profile=1&region=volta
 * URL keys of this page (besides the shared region= edu= interest= age= gender= state= modal=): x= (extra filters) · profile=1 · by= (view by) ·
 * menu=region · saved list: tab= show= view= sort= (see SavedQueriesView). The filters are live: every change rewrites the URL and the figures
 * come from GET /agency/overview; a group under 5 prints "<5" (the empty states for 0 and for 1-4 talents). Save query (POST /agency/queries,
 * 1 query of the MoU quota) and Export CSV (POST /agency/exports, 1 CSV export) open dialogs with a focus trap, Esc and focus return.
 * ⚠️ ASSUMPTION: the manifest URLs of a, g and h carry no filters although the frames draw them; the URLs above are the proposal (REQUESTS).
 */

const REMOVE_ORDER = ['extras', 'gender', 'age', 'interest', 'edu', 'region'];

const AgencyQueriesPage = () => {
  const data = useAgencyState();
  const { pathname } = useLocation();
  const saved = pathname.replace(/\/$/, '').endsWith('/saved');
  const session = useAgencySession();
  const sessionState = useAgencySessionState();
  const { filters, result, actions, loading, first, error, retry } = useQueryPage(data);
  // region menu counts: the same query without the region filter
  const regionCut = useLiveOverview({ ...filters, region: [] });
  const regionOptions = regionOptionsWith(regionCut.overview);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const dismissToast = useCallback(() => setToast(null), []);
  const { modal, state } = data;

  useEffect(() => {
    log('mount', { saved, modal, state });
  }, [saved, modal, state]);

  if (saved) {
    return (
      <AgencyFrame data={data} title="Saved queries" active="queries">
        <SavedQueriesView data={data} />
      </AgencyFrame>
    );
  }

  const built = state === 'results' || state === 'zero';
  const empty = result.status === 'zero' || result.status === 'suppressed';
  const quotaPct = quotaPercent(session.quota.used, session.quota.limit);

  const removeLast = () => {
    const key = REMOVE_ORDER.find((k) =>
      k === 'extras'
        ? Object.keys(filters.extras).length
        : k === 'region'
          ? filters.region.length
          : filters[k]
    );
    log('remove last', key);
    if (key === 'extras') actions.clearExtras();
    else if (key === 'region') actions.setRegions([]);
    else if (key) actions.setFilter(key, null);
  };

  const onSaved = async ({ schedule, channels, name }) => {
    const title = (name || queryTitle(filters)).slice(0, 80);
    setSaving(true);
    setSaveError('');
    try {
      await agencySaveQuery({
        name: title,
        filters: { ...queryApiParams(filters), by: filters.by },
        cadence: schedule.id,
        channels,
      });
      log('saved', title);
      actions.closeModal();
      sessionState?.reload?.();
      setToast(`Saved “${title}”. Each refresh uses 1 query from your quota.`);
    } catch (err) {
      setSaveError(err?.response?.data?.message || err?.message || 'Saving failed.');
    } finally {
      setSaving(false);
    }
  };

  const onExported = ({ fileName }) => {
    actions.closeModal();
    sessionState?.reload?.();
    setToast(`Export logged · ${fileName}`);
  };

  const exportable = result.status === 'ready';

  return (
    <AgencyFrame data={data} title="Queries" active="queries">
      <AgencyPageHero
        title={GOVERNMENT_PAGE_TEXT.queries.title}
        subtitle={governmentPageText('queries', 'subtitle', `Build a cut of the data in your MoU. Pick filters, then save or export it.${
          result.overview?.asOf?.label ? ` ${result.overview.asOf.label}.` : ''
        } Groups under 5 stay hidden.`)}
        actions={
          <AgencyButton
            size="sm"
            onClick={() => actions.openModal('export')}
            disabled={!exportable}
          >
            Export CSV
          </AgencyButton>
        }
      />
      <QueryFilterBar
        filters={filters}
        result={result}
        actions={actions}
        menu={data.params.get('menu')}
        regionOptions={regionOptions}
        saveLabel={result.status === 'zero' ? 'Save as query' : 'Save query'}
        onSave={() => actions.openModal('save-query')}
        onMore={() => actions.openModal('filters')}
      />
      {error && first ? (
        <EmptyState
          title="We couldn’t run this query"
          message="The figures didn’t load. Check your connection and try again."
          actionLabel="Try again"
          onAction={retry}
        />
      ) : first && loading ? (
        <p role="status" className="m-0 p-[24px] font-sans text-[15px] text-[#737373]">
          Counting talents…
        </p>
      ) : empty ? (
        <>
          <AgencyBanner
            eyebrow="Your MoU view"
            className="min-h-[173px] justify-center"
            title={`${session.mou.categories} data categories · access until ${formatMonthYear(session.mou.expires)}`}
          >
            Skills, readiness and programme outcomes for all 16 regions, down to district level.
            Ages 14–17 show as totals only. Every view is logged.
          </AgencyBanner>
          {result.status === 'zero' ? (
            <EmptyState
              title="No talents match this query yet"
              message="Remove a filter or widen the age range. Saved queries still rerun and tell you when talents appear."
              actionLabel="Clear all filters"
              onAction={actions.clearAll}
            />
          ) : (
            <EmptyState variant="suppressed" onAction={removeLast} />
          )}
        </>
      ) : (
        <>
          <QuerySummaryBanner filters={filters} result={result} built={built} />
          <QueryResultsBody
            result={result}
            filters={filters}
            view={filters.by}
            onView={actions.setView}
          />
        </>
      )}
      {modal === 'save-query' ? (
        <SaveQueryDialog
          quotaUsedPct={quotaPct}
          name={queryTitle(filters)}
          busy={saving}
          error={saveError}
          onSave={onSaved}
          onClose={() => {
            setSaveError('');
            actions.closeModal();
          }}
        />
      ) : null}
      {modal === 'export' && exportable ? (
        <ExportCsvDialog result={result} onExported={onExported} onClose={actions.closeModal} />
      ) : null}
      {modal === 'filters' ? (
        <MoreFiltersDrawer
          filters={filters}
          onApply={actions.applyDraft}
          onClose={actions.closeModal}
        />
      ) : null}
      <QueryToast message={toast} onDismiss={dismissToast} />
    </AgencyFrame>
  );
};

export default AgencyQueriesPage;
