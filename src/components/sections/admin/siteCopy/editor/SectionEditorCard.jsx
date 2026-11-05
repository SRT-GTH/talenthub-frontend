import { Link } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import CopyStatusChip from './CopyStatusChip.jsx';
import EditorBanner from './EditorBanner.jsx';
import EditorButton from './EditorButton.jsx';
import EditorField from './EditorField.jsx';
import { EditorCheckCircleIcon, EditorEyeIcon, EditorHistoryIcon } from './EditorIcons.jsx';
import { THEIR_VERSION } from './sectionEditorData.js';

const log = debug('SectionEditorCard');

/*
 * SectionEditorCard — the white editor card of the Site copy section editor (frames 7.8.2a-2n): 885 wide at 1728, r20, p24, gap 22, border #1c2a21 at 10 %.
 *   head   breadcrumb "Public site › Home › Hero" 13/500 · title 22/600 + status chip (Edited / Default / Draft changes (n) / Used on every page) ·
 *          "History" and "Preview" links (→ …/history, …/preview) · the saved line ("Saved as draft just now · only staff can see it")
 *   banners shared section (7.8.2j) · paste notice (2i) · someone else is editing (2k) · connection lost (2m) · read-only (⚠️ the 7.8.7c copy)
 *   fields EditorField per field of the section
 * Props: ctx, section, editor (useSectionEditor), readOnly, modal ({ name, field, linkInit }), onModal(name, field), sectionStatus, autoFocusKey, activeTools,
 * conflictOther ({ name }), onSeeTheirs.
 */
const READ_ONLY_COPY =
  'You can view site copy but not change it. Ask a content editor if something needs updating.';

const SectionEditorCard = ({
  ctx,
  section,
  editor,
  readOnly,
  modal,
  onModal,
  sectionStatus,
  autoFocusKey,
  activeTools,
  conflictOther = THEIR_VERSION,
  onSeeTheirs,
}) => {
  const n = editor.draftCounts[section.id] ?? 0;
  const chip = section.shared
    ? { kind: 'shared' }
    : n > 0
      ? { kind: 'draft', count: n }
      : { kind: sectionStatus === 'edited' ? 'edited' : 'default' };
  const hasFailure = editor.saveFailed;
  const refused = section.fields.some(
    (f) => f.kind === 'rich' && editor.check(f, editor.value(f)).unknown.length > 0
  );
  let status = editor.status;
  if (editor.conflict) status = 'Your change is not saved yet';
  else if (refused) status = 'This change isn’t saved yet';
  else if (hasFailure) status = '';

  log('render', {
    sectionId: section.id,
    chip,
    status,
    conflict: editor.conflict,
    failed: hasFailure,
  });

  return (
    <section
      aria-label={`${section.label} editor`}
      className="flex min-w-0 flex-col gap-[22px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(16px,1.4vw,24px)]"
    >
      <div className="flex flex-col gap-[10px]">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#575755] max-lg:text-[12px]"
        >
          <span>{section.portalLabel}</span>
          <span aria-hidden="true">›</span>
          <span>{section.pageLabel}</span>
          <span aria-hidden="true">›</span>
          <span aria-current="page" className="font-semibold text-[#1c2a21]">
            {section.label}
          </span>
        </nav>
        <div className="flex flex-wrap items-center gap-[10px]">
          <h2 className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
            {section.label}
          </h2>
          <CopyStatusChip kind={chip.kind} count={chip.count} />
          <span className="min-w-[8px] grow" />
          <Link
            to={copyUrl(ctx, COPY_PATHS.history(section.id))}
            className="inline-flex min-h-[34px] items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] px-[12px] py-[8px] font-sans text-[13.5px] leading-[16px] font-semibold text-[#1c2a21] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <EditorHistoryIcon className="size-[16px] shrink-0" />
            History
          </Link>
          <Link
            to={copyUrl(ctx, COPY_PATHS.preview(section.id))}
            className="inline-flex min-h-[34px] items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] px-[12px] py-[8px] font-sans text-[13.5px] leading-[16px] font-semibold text-[#1c2a21] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <EditorEyeIcon className="size-[16px] shrink-0 text-[#387440]" />
            Preview
          </Link>
        </div>
        {status ? (
          <p
            aria-live="polite"
            className="m-0 flex items-center gap-[6px] font-sans text-[12.5px] leading-[15px] font-medium text-[#575755] max-lg:text-[12px]"
          >
            <EditorCheckCircleIcon className="size-[14px] shrink-0 text-[#387440]" />
            {status}
          </p>
        ) : null}
      </div>

      {readOnly ? <EditorBanner tone="info">{READ_ONLY_COPY}</EditorBanner> : null}
      {section.shared ? (
        <EditorBanner tone="blue">
          This section appears on every page. A change here shows up across the whole public site.
        </EditorBanner>
      ) : null}
      {editor.pasted ? (
        <EditorBanner tone="info">
          You pasted text from another app. We kept bold, italic, lists and links, and removed the
          rest so the page stays on-brand.
        </EditorBanner>
      ) : null}
      {editor.conflict ? (
        <EditorBanner
          tone="warn"
          textClassName="sm:w-[clamp(220px,22vw,298px)] sm:flex-none"
          actions={
            <>
              <EditorButton onClick={onSeeTheirs}>See their version</EditorButton>
              <EditorButton variant="primary" onClick={editor.keepMine}>
                Keep mine
              </EditorButton>
            </>
          }
        >
          {`${conflictOther.name} changed this section ${conflictOther.agoLong}. Choose which version to keep. Nothing is lost until you choose.`}
        </EditorBanner>
      ) : null}
      {hasFailure ? (
        <EditorBanner
          tone="error"
          textClassName="sm:w-[clamp(240px,26vw,360px)] sm:flex-none"
          actions={<EditorButton onClick={editor.retry}>Try again</EditorButton>}
        >
          Your last change isn’t saved yet: we lost the connection. Keep typing, we’ll save it as
          soon as you’re back online.
        </EditorBanner>
      ) : null}

      {section.fields.map((f) => (
        <EditorField
          key={f.key}
          field={f}
          editor={editor}
          readOnly={readOnly}
          sectionId={section.id}
          modal={modal}
          onModal={onModal}
          autoFocus={autoFocusKey === f.key}
          activeTools={f.kind === 'rich' ? activeTools : undefined}
          onPasted={() => editor.setPasted(true)}
        />
      ))}
    </section>
  );
};

export default SectionEditorCard;
