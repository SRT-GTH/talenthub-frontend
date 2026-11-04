import SyncBrowseView from '../sync/SyncBrowseView.jsx';
import SyncSectionList from '../sync/SyncSectionList.jsx';

/*
 * ReleaseSync — the Site copy browse after a release and the Super Admin's sections sync (Platform Admin 7.8.8a-d). It sits on the browse route
 * `/admin/site-copy` and wins over the plain browse (priority 100) whenever `?view=` names one of the release states:
 *
 *   /admin/site-copy?role=editor&view=after-release   7.8.8a  Talent portal, "Release 2.4 added 1 page and 6 sections…", Scholarships open with "New" chips
 *   /admin/site-copy?role=editor&view=changed         7.8.8b  Public site › Home › Hero: "The original text changed since your edit" (Keep my edit / Use the new original)
 *   /admin/site-copy?role=editor&view=removed         7.8.8c  "Removed sections (2)" read-only, Home › Testimonials open, history kept
 *   /admin/site-copy?role=super&view=sync             7.8.8d  Super Admin "Section list from releases" + "Sync now"
 * Mock data only (sync/releaseSyncData.js); the page is rebuilt here from the frames (the Site copy browse / editor are other builders' screens).
 */
const VIEWS = ['after-release', 'changed', 'removed', 'sync'];

const ReleaseSyncScreen = ({ ctx, session }) => {
  const view = ctx.params.get('view');
  if (view === 'sync') return <SyncSectionList canSync={Boolean(session.copy?.rename)} />;
  return <SyncBrowseView key={view} ctx={ctx} name={view} />;
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.8',
    area: 'site-copy',
    priority: 100,
    match: (ctx) => ctx.segments.length === 0 && VIEWS.includes(ctx.params.get('view')),
    Component: ReleaseSyncScreen,
  },
];

export default ReleaseSyncScreen;
