import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import { CONTINUE_ROWS } from '../browse/siteCopyBrowseData.js';
import EditorContinueCard from '../home/EditorContinueCard.jsx';
import EditorHomeSearch from '../home/EditorHomeSearch.jsx';
import EditorKpiTile from '../home/EditorKpiTile.jsx';
import EditorPortalCard from '../home/EditorPortalCard.jsx';
import SiteCopyTour from '../home/SiteCopyTour.jsx';
import { EDITOR_KPIS, greetingFor } from '../home/editorHomeData.js';
import { hasSeenTour } from '../home/siteCopyTourStore.js';

const log = debug('EditorHome');

/*
 * EditorHome — `/admin?role=editor` (Platform Admin 7.8.0a "Content Editor home · Site copy overview"). Area `home`, matches the Content Editor role.
 * URL keys: `greeting=morning|afternoon|evening` pins the greeting (it follows the clock otherwise; frame URL uses `afternoon`) · `tour=1|2|3` opens the first-visit
 * tour over this screen (7.8.0b is drawn over the Site copy list: `/admin/site-copy?role=editor&tour=1`, same tour) · `tour=0` keeps it closed. Without a `tour` key the
 * tour opens once on the first visit (localStorage `gth:copy-tour-seen`, see home/siteCopyTourStore.js).
 * Frame URL: 7.8.0a `/admin?role=editor&greeting=afternoon&tour=0`.
 * Links: "Open" rows go to the section editor `/admin/site-copy/section/<sectionId>`, "Pick a portal" tiles to `/admin/site-copy?portal=<id>`, a search to
 * `/admin/site-copy?find=<text>`; the sidebar persona numbers and the 3 / 12 / 18 of 214 / 1 tiles are seeds (they do not follow drafts saved in the editor).
 */
const EditorHome = ({ ctx, data, session }) => {
  const navigate = useNavigate();
  const tourParam = data.params.get('tour');
  const [autoTour, setAutoTour] = useState(() => tourParam === null && !hasSeenTour());
  const [autoStep, setAutoStep] = useState(1);
  const urlStep = Number(tourParam) || 0;
  const step = urlStep >= 1 && urlStep <= 3 ? urlStep : autoTour ? autoStep : 0;

  const first = (session?.staff?.name ?? 'Ama Owusu').split(' ')[0];
  const greeting = greetingFor(data.params.get('greeting'));

  useEffect(() => {
    log('mount', { role: ctx.role, tour: tourParam, autoTour, greeting });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const portalHref = (id) =>
    copyUrl(ctx, COPY_PATHS.siteCopy, { portal: id === 'public' ? null : id });
  const rows = CONTINUE_ROWS.map((r) => ({
    ...r,
    to: copyUrl(ctx, COPY_PATHS.section(r.sectionId)),
  }));

  const closeTour = () => {
    setAutoTour(false);
    if (tourParam !== null) data.update({ tour: null }, { replace: true });
  };
  const gotoStep = (n) => {
    if (urlStep) data.update({ tour: n });
    else setAutoStep(n);
  };

  return (
    <div className="flex min-w-0 flex-col gap-[24px] pt-[4px] font-sans">
      <div className="flex flex-col gap-[3px]">
        <h1 className="m-0 text-[clamp(28px,3vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
          {greeting}, {first}
        </h1>
        <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#595959]">
          Change the words on any page. Nothing goes live until you publish.
        </p>
      </div>

      <div className="flex flex-col gap-[24px]">
        <EditorHomeSearch
          onSearch={(text) => {
            log('search → browse', { len: text.length });
            navigate(copyUrl(ctx, COPY_PATHS.siteCopy, { find: text }));
          }}
        />

        <div
          role="list"
          aria-label="Site copy numbers"
          className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4"
        >
          {EDITOR_KPIS.map((k) => (
            <div key={k.id} role="listitem">
              <EditorKpiTile eyebrow={k.eyebrow} value={k.value} sub={k.sub} />
            </div>
          ))}
        </div>

        <EditorContinueCard rows={rows} />
        <EditorPortalCard hrefFor={portalHref} />
      </div>

      {step ? <SiteCopyTour step={step} onStep={gotoStep} onClose={closeTour} /> : null}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.0',
    area: 'home',
    priority: 10,
    match: (ctx) => ctx.role === 'editor',
    Component: EditorHome,
  },
];

export default EditorHome;
