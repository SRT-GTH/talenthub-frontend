import { useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import PagesTree from '../editor/PagesTree.jsx';
import PortalToolbar from '../editor/PortalToolbar.jsx';
import SectionEditorCard from '../editor/SectionEditorCard.jsx';
import TheirVersionDialog from '../editor/TheirVersionDialog.jsx';
import {
  FRAME_PRESETS,
  PAGES,
  THEIR_VERSION,
  resolveSection,
} from '../editor/sectionEditorData.js';
import { useSectionEditor } from '../editor/useSectionEditor.js';
import { sameValue } from '../editor/richText.js';

const log = debug('SectionEditor');

/*
 * SectionEditor — Platform Admin 7.8.2 "Section editor" (frames 7.8.2a-2n, area `site-copy`).
 *   /admin/site-copy/section/:sectionId             (ctx.segments = ['section', id]; sections: public.home.hero · public.home.faq · public.shared.footer drawn)
 * Query keys of this screen (the shared ones are in adminState.js):
 *   ?modal=link | chip | reset | theirs   the link popover / the product-name menu / "Go back to the original?" / "Two versions of Home › Hero"
 *   ?field=<fieldKey>                      which field the popover belongs to (default: the first rich field, or the first changed one for reset)
 *   ?state=conflict | offline              someone else changed the section (7.8.2k) / the connection is lost (7.8.2m)
 *   ?item=3|5|6                            the FAQ question and answer edited (⚠️ ASSUMPTION, no switcher is drawn; default 3)
 *   ?f=2a … 2n                             the fixed state of a Figma frame, independent of storage (FRAME_PRESETS in sectionEditorData.js)
 * Frame URLs (role editor):
 *   2a …/section/public.home.hero?role=editor&f=2a        2b  …hero?role=editor&f=2b        2g  …hero?role=editor&f=2g        2h  …hero?role=editor&f=2h
 *   2c …/section/public.home.faq?role=editor&f=2c         2d  …faq?role=editor&f=2d         2e  …faq?role=editor&f=2e         2f  …faq?role=editor&item=5&f=2f
 *   2i …faq?role=editor&f=2i                              2n  …faq?role=editor&item=6&f=2n  2j  …/section/public.shared.footer?role=editor&f=2j
 *   2k …hero?role=editor&f=2k (= ?state=conflict)         2l  …hero?role=editor&f=2l (= ?state=conflict&modal=theirs)       2m  …hero?role=editor&f=2m (= ?state=offline)
 * Mounted from other builders (optional, nothing renders before their files exist): ../publish/PublishBar.jsx (`changes`, `role`, `onPublish`, `onDiscard`)
 * and ../publish/PublishDialogs.jsx (`modal`, `changes`, `onClose`, `onDone`; its `?modal=` values are publish*, discard, leave, blocked), the image / video
 * fields ../fields/ImageField.jsx · VideoField.jsx (EditorField).
 * ⚠️ ASSUMPTION: the publish dialogs call onDone('publish' | 'discard') — a publish moves the draft values into `site-copy.published`, a discard drops the drafts.
 */
const OPTIONAL = import.meta.glob('../publish/{PublishBar,PublishDialogs}.jsx', { eager: true });
const optional = (name) =>
  Object.entries(OPTIONAL).find(([path]) => path.endsWith(`/${name}.jsx`))?.[1]?.default ?? null;

const MINE = ['link', 'chip', 'reset', 'theirs'];

const sectionIdOf = (ctx) => {
  try {
    return decodeURIComponent(ctx.segments[1] ?? '');
  } catch {
    return ctx.segments[1] ?? '';
  }
};

const SectionEditorBody = ({ ctx, data, session, sectionId, item, preset }) => {
  const section = useMemo(() => resolveSection(sectionId, item), [sectionId, item]);
  const readOnly = !session.copy?.edit;
  const editor = useSectionEditor({ section, preset, readOnly });
  const [query, setQuery] = useState('');
  const [presetModalOff, setPresetModalOff] = useState(false);
  const snapshot = useRef({});

  const urlModal = data.modal;
  const name = MINE.includes(urlModal)
    ? urlModal
    : !urlModal && !presetModalOff
      ? preset?.modal
      : null;
  const firstRich = section.fields.find((f) => f.kind === 'rich')?.key;
  const firstChanged = section.fields.find(
    (f) => !sameValue(editor.value(f), f.original, f.kind)
  )?.key;
  const fieldKey =
    data.params.get('field') ??
    (name === preset?.modal ? preset?.field : null) ??
    (name === 'reset' ? firstChanged : firstRich);
  const modal =
    name && name !== 'theirs' && section.fields.some((f) => f.key === fieldKey)
      ? { name, field: fieldKey, linkInit: preset?.linkDraft }
      : null;
  const theirsOpen = name === 'theirs' && editor.conflict;

  useEffect(() => {
    log('mount', {
      sectionId,
      item,
      role: session.role,
      readOnly,
      modal: name,
      f: preset ? 'frame' : null,
    });
  }, [sectionId, item, session.role, readOnly, name, preset]);

  const setModal = (next, field) => {
    log('modal', { next, field });
    setPresetModalOff(true);
    data.update({ modal: next, field: next ? field : null });
  };

  // The values of the drafts as they were before a publish dialog opened (a dialog may clear the drafts before it calls onDone).
  const publishOpen = /^(publish|discard)/.test(urlModal ?? '');
  useEffect(() => {
    if (!publishOpen) snapshot.current = editor.drafts;
  }, [publishOpen, editor.drafts]);

  const refused = section.fields.some((f) => {
    const c = editor.check(f, editor.value(f));
    return c.over || c.unknown.length > 0;
  });
  const barHidden =
    modal?.name === 'link' ||
    modal?.name === 'chip' ||
    refused ||
    editor.conflict ||
    editor.saveFailed;
  const canPublish = Boolean(session.copy?.publish);
  const PublishBar = optional('PublishBar');
  const PublishDialogs = optional('PublishDialogs');
  const dialogChanges = editor.changes;

  const portalLabel = section.portalLabel;
  const summaries = {};
  const heroDraft = editor.drafts['public.home.hero']?.fields?.headline?.draft;
  if (heroDraft && !editor.conflict) summaries['public.home.hero'] = heroDraft;
  const treeStatus = PAGES.flatMap((p) => p.sections).find((s) => s.id === sectionId)?.status;

  const rows = (
    THEIR_VERSION && section.id === 'public.home.hero'
      ? [
          { key: 'headline', label: 'Headline' },
          { key: 'primary_cta', label: 'Main button text' },
        ]
      : []
  ).map((r) => {
    const f = section.fields.find((x) => x.key === r.key);
    return {
      label: r.label,
      mine: f ? editor.value(f) : '',
      theirs: THEIR_VERSION.fields[r.key] ?? '',
    };
  });

  return (
    <div className="flex min-w-0 flex-col gap-[24px]">
      <div className="flex flex-col gap-[3px]">
        <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
          Site copy
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959] max-lg:text-[14px]">
          {`${portalLabel} · ${section.pageLabel === 'Shared' ? 'Home' : section.pageLabel}`}
        </p>
      </div>
      <PortalToolbar ctx={ctx} portal={section.portal} query={query} onQuery={setQuery} />
      <div className="flex min-w-0 flex-col gap-[24px] lg:flex-row lg:items-start">
        <div className="order-2 w-full min-w-0 lg:order-1 lg:w-[clamp(300px,24.3vw,420px)] lg:shrink-0">
          <PagesTree
            ctx={ctx}
            activeId={sectionId}
            draftCounts={editor.draftCounts}
            published={editor.published}
            summaries={summaries}
            query={query}
          />
        </div>
        <div className="order-1 min-w-0 flex-1 lg:order-2">
          <SectionEditorCard
            ctx={ctx}
            section={section}
            editor={editor}
            readOnly={readOnly}
            modal={modal}
            onModal={setModal}
            sectionStatus={treeStatus}
            autoFocusKey={preset?.focus}
            activeTools={preset?.activeTools}
            onSeeTheirs={() => data.update({ modal: 'theirs' })}
          />
        </div>
      </div>
      {PublishBar && canPublish && !barHidden && dialogChanges.length > 0 && !theirsOpen ? (
        <PublishBar
          changes={dialogChanges}
          role={session.role}
          // Figma 7.8.2b: the bar floats 88px above the bottom of the viewport frame (clear of the Ask Buddy button)
          stickyClassName="bottom-[24px] xl:bottom-[88px]"
          onPublish={() =>
            data.update({
              modal: dialogChanges.some((c) => c.sectionId.includes('.shared.'))
                ? 'publish-shared'
                : 'publish',
            })
          }
          onDiscard={() => data.update({ modal: 'discard' })}
        />
      ) : null}
      {PublishDialogs && canPublish ? (
        <PublishDialogs
          modal={urlModal}
          changes={dialogChanges}
          onClose={() => data.update({ modal: null })}
          onDone={(result) => {
            const kind = typeof result === 'string' ? result : (result?.kind ?? result?.type);
            const ids = dialogChanges.map((c) => c.sectionId);
            log('publish dialogs done', { kind, ids });
            if (kind === 'discard') editor.clearDrafts(ids);
            else if (kind === 'publish') editor.goLive(ids, snapshot.current);
            data.update({ modal: null });
          }}
        />
      ) : null}
      {theirsOpen ? (
        <TheirVersionDialog
          title={`Two versions of ${section.pageLabel} › ${section.label}`}
          you="Kofi"
          other={THEIR_VERSION}
          rows={rows}
          onClose={() => data.update({ modal: null })}
          onKeepMine={() => {
            editor.keepMine();
            data.update({ modal: null, state: null });
          }}
          onUseTheirs={() => {
            editor.takeTheirs();
            data.update({ modal: null, state: null });
          }}
        />
      ) : null}
    </div>
  );
};

const SectionEditor = ({ ctx, data, session }) => {
  const sectionId = sectionIdOf(ctx);
  const f = data.params.get('f');
  const wanted = f ?? (data.state === 'conflict' ? '2k' : data.state === 'offline' ? '2m' : null);
  // A frame state sticks while the editor stays on the section (resolving the conflict removes ?state=, not the mock data behind it).
  const stuck = useRef({ sectionId, code: null });
  if (stuck.current.sectionId !== sectionId) stuck.current = { sectionId, code: null };
  if (wanted) stuck.current.code = wanted;
  const code = stuck.current.code;
  const found = code ? FRAME_PRESETS[code] : null;
  const preset = found && found.sectionId === sectionId ? found : null;
  const item = Number(data.params.get('item') ?? preset?.item ?? 3);
  return (
    <SectionEditorBody
      key={`${sectionId}|${code ?? ''}|${item}`}
      ctx={ctx}
      data={data}
      session={session}
      sectionId={sectionId}
      item={item}
      preset={preset}
    />
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.2',
    area: 'site-copy',
    priority: 5,
    match: (ctx) => ctx.segments.length === 2 && ctx.segments[0] === 'section',
    Component: SectionEditor,
  },
];

export default SectionEditor;
