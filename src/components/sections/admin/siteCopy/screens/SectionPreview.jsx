import { useCallback, useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import { useCopyKv } from '../useCopyKv.js';
import HeadlineFitCheck from '../preview/HeadlineFitCheck.jsx';
import MockFaq from '../preview/MockFaq.jsx';
import MockGenericSection from '../preview/MockGenericSection.jsx';
import MockHero from '../preview/MockHero.jsx';
import MockHowItWorks from '../preview/MockHowItWorks.jsx';
import PreviewExpired from '../preview/PreviewExpired.jsx';
import PreviewNonStaff from '../preview/PreviewNonStaff.jsx';
import PreviewStage from '../preview/PreviewStage.jsx';
import PreviewToolbar from '../preview/PreviewToolbar.jsx';
import { PreviewEyeIcon } from '../preview/PreviewIcons.jsx';
import QuickSectionPanel from '../preview/QuickSectionPanel.jsx';
import {
  DRAFTS_KEY,
  LONG_HEADLINE_SAMPLE,
  PREVIEW_LINK_MINUTES,
  PUBLIC_PAGES,
  PUBLISHED_KEY,
  SEED_DRAFTS,
} from '../preview/previewHistoryData.js';
import { DEVICES, fieldValue, hasFieldDraft, sectionMeta } from '../preview/previewModel.js';
import { classNames } from '../../../../../utils/classNames.js';

const log = debug('SectionPreview');

/*
 * SectionPreview — Platform Admin 7.8.3 "Preview" of a section: a faithful mock of the public page that shows the section's DRAFT text in a desktop / tablet /
 * phone frame with the sections outlined, and "what everyone sees now" (the published text) one click away.
 * Route  /admin/site-copy/section/:sectionId/preview   (ctx.segments = ['section', id, 'preview'])   Frames 7.8.3a-h.
 * Query  ?device=desktop|tablet|phone (3a / 3b / 3c)  ·  ?open=<sectionId> a clicked section opens the slim editor beside the page (3d)  ·
 *        ?view=published → "What everyone sees now" (3g)  ·  ?state=expired (3e) | nonstaff (3h)  ·
 *        ?sample=long-headline → the long headline of the phone frame 3c (a frame URL must not depend on stored drafts; ⚠️ ASSUMPTION: mock only)
 *   3a  /admin/site-copy/section/public.home.hero/preview?role=editor
 *   3b  …?device=tablet   3c …?device=phone&sample=long-headline   3d …?device=tablet&open=public.home.how-it-works
 *   3e  …?state=expired   3f  /admin/site-copy/section/public.home.faq/preview   3g …?view=published   3h …?state=nonstaff
 * Reads the shared mock KV: drafts `site-copy.drafts`, published `site-copy.published` (shapes in preview/previewHistoryData.js). The slim editor writes drafts.
 * Roles: Publish only with `session.copy.publish`; without `edit` the slim editor is read-only.
 */

const GENERIC_SUBTITLE = `Draft changes applied · link expires in ${PREVIEW_LINK_MINUTES} minutes`;

const Banner = ({ tone, children }) => (
  <div
    role="status"
    className={classNames(
      'flex items-center gap-[12px] rounded-[16px] p-[16px] font-sans text-[14px] leading-[20px] font-medium',
      tone === 'ok' ? 'bg-[#ebf1ec]/50 text-[#2a5730]' : 'bg-[#eaeffb] text-[#244a9f]'
    )}
  >
    <PreviewEyeIcon className="size-[18px] shrink-0 text-[#387440]" />
    <span className="min-w-0">{children}</span>
  </div>
);

const SectionPreview = ({ ctx, data, session }) => {
  const sectionId = ctx.segments[1];
  const meta = useMemo(() => sectionMeta(sectionId), [sectionId]);
  const [drafts, setDrafts] = useCopyKv(DRAFTS_KEY, SEED_DRAFTS);
  const [published] = useCopyKv(PUBLISHED_KEY, {});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [timedOut, setTimedOut] = useState(false);
  const [lines, setLines] = useState(null);

  const device = DEVICES.includes(data.params.get('device'))
    ? data.params.get('device')
    : 'desktop';
  const view = data.view === 'published' ? 'published' : 'draft';
  const open = data.params.get('open');
  const sample = data.params.get('sample') === 'long-headline';
  const state = data.state;
  const expired = state === 'expired' || timedOut;
  const canEdit = Boolean(session.copy?.edit);
  const canPublish = Boolean(session.copy?.publish);

  useEffect(() => {
    log('mount', { sectionId, device, view, open, state, sample, role: session.role });
  }, [sectionId, device, view, open, state, sample, session.role]);

  // The preview link lives PREVIEW_LINK_MINUTES (7.8.3e); "Open a fresh preview" starts a new one.
  useEffect(() => {
    const id = setTimeout(
      () => {
        log('preview link expired after', PREVIEW_LINK_MINUTES, 'minutes');
        setTimedOut(true);
      },
      PREVIEW_LINK_MINUTES * 60 * 1000
    );
    return () => clearTimeout(id);
  }, [startedAt]);

  const freshPreview = useCallback(() => {
    log('fresh preview');
    setStartedAt(Date.now());
    setTimedOut(false);
    data.update({ state: null });
  }, [data]);

  const tFor = useCallback(
    (id) => {
      const m = sectionMeta(id);
      return (key) => {
        const field = m.fields.find((f) => f.key === key);
        if (!field) return '';
        if (sample && view === 'draft' && id === 'public.home.hero' && key === 'headline')
          return LONG_HEADLINE_SAMPLE;
        return fieldValue({ drafts, published, sectionId: id, field, mode: view });
      };
    },
    [drafts, published, view, sample]
  );

  const setDraft = useCallback(
    (id, key, text) => {
      log('draft typed', { id, key, length: text.length });
      setDrafts((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          fields: { ...prev[id]?.fields, [key]: { ...prev[id]?.fields?.[key], draft: text } },
          savedAt: new Date().toISOString(),
        },
      }));
    },
    [setDrafts]
  );

  const unpublished = Object.keys(drafts).length;
  const openMeta = open ? sectionMeta(open) : null;
  const outline = (id) => ({
    active: view === 'draft',
    selected: open === id,
    onOpen: () => {
      log('section clicked', id);
      data.update({ open: id });
    },
  });

  const subtitle = expired
    ? 'Link expired'
    : view === 'published'
      ? 'Showing the published page: talents, parents and recruiters see this until you publish'
      : open
        ? 'Click any outlined section to edit it here'
        : GENERIC_SUBTITLE;

  if (state === 'nonstaff') return <PreviewNonStaff />;

  const draftedFaq = meta.fields.findIndex(
    (f) => /^a\d$/.test(f.key) && hasFieldDraft({ drafts, published, sectionId, field: f })
  );
  const faqIndex = draftedFaq >= 0 ? Number(meta.fields[draftedFaq].key.slice(1)) - 1 : -1;
  const homeTop = meta.previewKind === 'home-top';
  const heroFields = sectionMeta('public.home.hero');
  const origHeadline = heroFields.fields[0].published;
  const showFit =
    homeTop &&
    device === 'phone' &&
    view === 'draft' &&
    lines &&
    lines.now >= 3 &&
    lines.now > lines.original;

  const status = (id) =>
    Object.keys(drafts[id]?.fields ?? {}).length
      ? 'Draft'
      : PUBLIC_PAGES.flatMap((p) => p.sections).find((s) => s.id === id)?.status === 'edited'
        ? 'Edited'
        : 'Default';

  return (
    <div className="relative flex min-w-0 flex-col gap-[24px]">
      <header className="flex flex-col gap-[3px]">
        <h1 className="m-0 font-sans text-[clamp(26px,2.4vw,34px)] leading-[1.2] font-semibold tracking-[-0.02em] text-[#1c2a21]">
          {`Preview · ${meta.page}`}
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959]">
          {subtitle}
        </p>
      </header>
      <PreviewToolbar
        backTo={copyUrl(ctx, COPY_PATHS.section(sectionId))}
        device={device}
        onDevice={(d) => data.update({ device: d === 'desktop' ? null : d })}
        view={view}
        onView={(v) => data.update({ view: v === 'draft' ? null : v })}
        unpublished={unpublished}
        canPublish={canPublish}
        publishTo={copyUrl(ctx, COPY_PATHS.section(sectionId), { modal: 'publish' })}
      />
      {expired ? (
        <PreviewExpired minutes={PREVIEW_LINK_MINUTES} onFresh={freshPreview} />
      ) : (
        <>
          {open ? null : view === 'published' ? (
            <Banner tone="ok">
              This is the live page. Your {unpublished} draft changes aren’t shown to anyone outside
              staff.
            </Banner>
          ) : (
            <Banner tone="info">
              Preview · only you can see these changes. Talents, parents and recruiters still see
              the published page.
            </Banner>
          )}
          <div className="flex flex-col items-start gap-[24px] xl:flex-row">
            <PreviewStage
              device={device}
              withNav={meta.previewKind !== 'faq'}
              label={`Preview of ${meta.page} (${device})`}
              className={classNames(open && device !== 'phone' ? 'xl:flex-1' : '')}
              frameClassName={
                meta.previewKind === 'faq' && device === 'desktop' ? 'mx-auto max-w-[1100px]' : ''
              }
            >
              {homeTop ? (
                <>
                  <MockHero
                    device={device}
                    t={tFor('public.home.hero')}
                    outline={outline('public.home.hero')}
                    onLines={setLines}
                    originalHeadline={origHeadline}
                  />
                  <MockHowItWorks
                    device={device}
                    t={tFor('public.home.how-it-works')}
                    outline={outline('public.home.how-it-works')}
                  />
                </>
              ) : meta.previewKind === 'faq' ? (
                <MockFaq
                  device={device}
                  t={tFor(sectionId)}
                  drafted={faqIndex}
                  outline={outline(sectionId)}
                />
              ) : (
                <MockGenericSection meta={meta} t={tFor(sectionId)} outline={outline(sectionId)} />
              )}
            </PreviewStage>
            {openMeta ? (
              <QuickSectionPanel
                meta={openMeta}
                value={(key) => tFor(open)(key)}
                onChange={(key, text) => setDraft(open, key, text)}
                onClose={() => data.update({ open: null })}
                status={status(open)}
                readOnly={!canEdit}
              />
            ) : showFit ? (
              <HeadlineFitCheck
                lines={lines}
                original={origHeadline}
                editTo={copyUrl(ctx, COPY_PATHS.section('public.home.hero'), { field: 'headline' })}
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.3',
    area: 'site-copy',
    priority: 20,
    match: (ctx) =>
      ctx.segments.length === 3 && ctx.segments[0] === 'section' && ctx.segments[2] === 'preview',
    Component: SectionPreview,
  },
];

export default SectionPreview;
