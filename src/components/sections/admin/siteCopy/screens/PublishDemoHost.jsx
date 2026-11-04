import { useEffect, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import PublishBar from '../publish/PublishBar.jsx';
import PublishDialogs from '../publish/PublishDialogs.jsx';
import { PublishCheckIcon, PublishEditIcon } from '../publish/PublishIcons.jsx';
import { usePublishGuard } from '../publish/usePublishGuard.js';
import {
  DEMO_FAQ_CHANGE,
  DEMO_FOOTER_CHANGE,
  DEMO_HERO_CHANGE,
  DEMO_IMAGE_CHANGE,
  publishModalFor,
} from '../publish/publishData.js';

const log = debug('PublishDemoHost');

/*
 * PublishDemoHost — TEMPORARY host of the publish flow (frames 7.8.4a-i) until the section editor (screens/SectionEditor.jsx, builder B1) mounts
 * PublishBar + PublishDialogs itself. A simple static stand-in for the editor page sits behind the bar and dialogs; the BAR and DIALOGS are the real ones.
 *   /admin/site-copy/publish-demo                          7.8.4a  the bar over 3 unpublished changes (Hero 2, FAQ 1)
 *   ?modal=publish | publish-empty | publish-shared | discard | leave | blocked        7.8.4b · c · d · f · g · h (frame seeds)
 *   ?modal=published | discarded                           7.8.4e · i  (the toast; the change set is empty, the page shows the published text)
 *   ?role=editor|super|senior|…                            role override (support / moderator: no Publish button, they have no changes to publish)
 * Seeds come from the URL only on first load; after that the real flow runs: Publish → dialog → reason → really moves the drafts (publishStore) and
 * the toast follows; Discard → confirm → drafts removed; a click on any chrome link with unpublished changes opens 7.8.4g (usePublishGuard).
 * ⚠️ ASSUMPTION: frame-only host; the lead removes it once SectionEditor integrates the same two components.
 */
const seedFor = (modal) => {
  if (modal === 'publish-shared') return [DEMO_FOOTER_CHANGE];
  if (modal === 'blocked') return [DEMO_IMAGE_CHANGE, DEMO_FAQ_CHANGE];
  if (modal === 'published' || modal === 'discarded') return [];
  return [DEMO_HERO_CHANGE, DEMO_FAQ_CHANGE];
};

const FIELDS = [
  ['Headline', 'Find work that fits you', 'Your future starts here', '23 / 60'],
  [
    'Supporting line',
    'Show what you can do, get verified skills and connect with employers across Ghana.',
    null,
    '84 / 160',
  ],
  ['Main button text', 'Create my profile', 'Join for free', '13 / 24'],
  ['Second button text', 'See how it works', null, '16 / 24'],
];

const PublishDemoHost = ({ ctx, data, session }) => {
  const modal = data.modal;
  const fromUrl = useRef(Boolean(modal));
  const [changes, setChanges] = useState(() => seedFor(modal));
  const [result, setResult] = useState(null);
  const [leaveTo, setLeaveTo] = useState(null);
  // The frames draw the bar only without a dialog (7.8.4a) and under the leave dialog (7.8.4g) (and next to a toast).
  const showBar = !modal || ['leave', 'published', 'discarded'].includes(modal);
  const heroDraft = changes.some((c) => c.sectionId === DEMO_HERO_CHANGE.sectionId);

  useEffect(() => {
    log('mount', { modal, role: session.role, changes: changes.length });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  usePublishGuard({
    active: changes.length > 0,
    onBlock: (href) => {
      log('guard: leave attempt', href);
      setLeaveTo(href);
      fromUrl.current = false;
      data.update({ modal: 'leave' });
    },
  });

  const open = (m) => {
    fromUrl.current = false;
    data.update({ modal: m });
  };
  const close = () => {
    fromUrl.current = false;
    data.update({ modal: null });
  };

  const onDone = (r) => {
    log('done', r.action);
    fromUrl.current = false;
    if (r.action === 'published') {
      setChanges([]);
      setResult(r);
      data.update({ modal: 'published' });
    } else if (r.action === 'discarded') {
      setChanges((prev) => prev.filter((c) => !r.sectionIds.includes(c.sectionId)));
      setResult(r);
      data.update({ modal: 'discarded' });
    }
  };

  return (
    <div className="flex flex-col gap-[24px] xl:min-h-[calc(100dvh-202px)]">
      <div className="flex flex-col gap-[4px]">
        <h1 className="m-0 font-sans text-[clamp(28px,2.4vw,34px)] leading-[1.2] font-semibold text-[#1c2a21]">
          Site copy
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#595959]">
          Public site · Home
        </p>
      </div>

      <div className="grid gap-[24px] lg:grid-cols-[minmax(0,417px)_minmax(0,1fr)]">
        <section
          aria-label="Pages"
          className="hidden flex-col gap-[8px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[16px] lg:flex"
        >
          <p className="m-0 flex justify-between font-sans text-[13px] font-bold text-[#575755]">
            <span>Pages</span>
            <span className="font-medium">46 pages</span>
          </p>
          {['Hero', 'How it works', 'Features', 'Made for Ghana', 'FAQ', 'Footer'].map((n) => (
            <p
              key={n}
              className="m-0 rounded-[12px] bg-[#f8f8f4] px-[14px] py-[10px] font-sans text-[14px] font-semibold text-[#1c2a21]"
            >
              {n}
            </p>
          ))}
        </section>

        <section
          aria-label="Hero"
          className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[clamp(16px,2vw,24px)]"
        >
          <div className="flex flex-col gap-[6px]">
            <p className="m-0 font-sans text-[13px] font-medium text-[#575755]">
              Public site › Home › <b className="text-[#1c2a21]">Hero</b>
            </p>
            <div className="flex flex-wrap items-center gap-[10px]">
              <h2 className="m-0 font-sans text-[22px] leading-[28px] font-semibold text-[#1c2a21]">
                Hero
              </h2>
              <span className="inline-flex items-center gap-[6px] rounded-full bg-[#faf4e8] px-[12px] py-[4px] font-sans text-[13px] font-semibold text-[#463409]">
                {heroDraft ? (
                  <>
                    <PublishEditIcon className="size-[14px]" /> Draft changes (2)
                  </>
                ) : (
                  <>
                    <PublishCheckIcon className="size-[14px] text-[#387440]" /> Edited
                  </>
                )}
              </span>
            </div>
          </div>
          {FIELDS.map(([label, published, draft, count]) => (
            <div key={label} className="flex flex-col gap-[6px]">
              <p className="m-0 flex justify-between font-sans text-[14px] font-semibold text-[#1c2a21]">
                <span>{label}</span>
                <span className="text-[12.5px] text-[#575755]">{count}</span>
              </p>
              <p className="m-0 rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[16px] py-[12px] font-sans text-[15px] text-[#1c2a21]">
                {heroDraft && draft ? draft : published}
              </p>
            </div>
          ))}
        </section>
      </div>

      <PublishBar
        changes={showBar ? changes : []}
        role={session.role}
        previewTo={copyUrl(ctx, COPY_PATHS.preview(DEMO_HERO_CHANGE.sectionId))}
        stickyClassName="mt-auto bottom-[24px] min-[1280px]:bottom-[102px]"
        onPublish={() => open(publishModalFor(changes))}
        onDiscard={() => open('discard')}
      />

      <PublishDialogs
        modal={modal}
        changes={changes}
        result={result}
        ctx={ctx}
        leaveTo={leaveTo}
        historyTo={copyUrl(ctx, COPY_PATHS.history(DEMO_HERO_CHANGE.sectionId))}
        discardSectionId={DEMO_HERO_CHANGE.sectionId}
        seedReason={fromUrl.current}
        holdToast={fromUrl.current}
        onClose={close}
        onSwitch={open}
        onDone={onDone}
      />
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.4a',
    area: 'site-copy',
    priority: -10,
    match: (ctx) => ctx.segments[0] === 'publish-demo',
    Component: PublishDemoHost,
  },
];

export default PublishDemoHost;
