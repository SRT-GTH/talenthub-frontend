import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import { useAdminToast } from '../../useAdminData.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import { useCopyKv } from '../useCopyKv.js';
import MediaArchiveBlockedDialog from '../media/MediaArchiveBlockedDialog.jsx';
import MediaButton from '../media/MediaButton.jsx';
import MediaCard from '../media/MediaCard.jsx';
import MediaDescribeDialog from '../media/MediaDescribeDialog.jsx';
import MediaDetailDrawer from '../media/MediaDetailDrawer.jsx';
import { MediaFile30Icon, MediaWarning18Icon } from '../media/MediaIcons.jsx';
import MediaRefusedDialog from '../media/MediaRefusedDialog.jsx';
import MediaReplaceDialog from '../media/MediaReplaceDialog.jsx';
import MediaToolbar from '../media/MediaToolbar.jsx';
import MediaUploadDialog from '../media/MediaUploadDialog.jsx';
import {
  MEDIA_ASSETS,
  MEDIA_DEMO_REFUSED,
  MEDIA_DEMO_UPLOAD,
  MEDIA_REPLACEMENT_SAMPLE,
  MEDIA_MAX_DOCUMENT_BYTES,
  MEDIA_MAX_IMAGE_BYTES,
} from '../media/mediaLibraryData.js';
import {
  assetNoun,
  filterAssets,
  headerLine,
  kindOfName,
  refusedByName,
  tooLargeMessage,
  uniqueId,
  usedCount,
} from '../media/mediaLibraryModel.js';
import { describeImageFile, useMediaUploads } from '../media/useMediaUploads.js';

const log = debug('MediaLibrary');

/*
 * MediaLibrary — Platform Admin 7.8.9a-m, the media library (area `media`, `/admin/media[/:assetId]`; Settings → Integrations media storage is MediaStorageSettings).
 *   /admin/media                         library grid (7.8.9a) · ?filter=images|documents|unused|alt (7.8.9h alt, j documents, l unused) · ?q=career (7.8.9m)
 *   /admin/media?state=empty             empty library (7.8.9i)
 *   /admin/media?modal=upload            upload dialog (7.8.9b; &progress=64 holds the drawn in-progress row) · modal=refused → 7.8.9d with the two drawn files
 *   /admin/media?modal=details           "Describe this image" for the drawn career-fair-2026.jpg (7.8.9c) · modal=describe&… → 7.8.9k (validation showing: "Fai", consent missing)
 *   /admin/media/:assetId                detail drawer (7.8.9e) · &modal=replace (7.8.9f) · &modal=archive → "still in use" (7.8.9g) when the asset is used
 * `?role=editor|super|senior` (mock) can upload / replace / archive (session.copy.media); other roles see the library read-only. The list is useCopyKv('media.assets').
 * ⚠️ ASSUMPTION (not drawn): a filter with no result says "No files match." ; upload / replace / archive confirm with a toast (copy invented); a card opens the detail
 * drawer; archived files leave the library (they are kept in the list with archived: true); the 2nd, 3rd … files of one upload are described one after another.
 * Figma inconsistencies kept as drawn: the drawn header counts (64 images · 9 documents) include files that are not itemised (see mediaLibraryData.js).
 */
const DIALOGS = ['upload', 'details', 'describe', 'refused', 'replace', 'archive'];

const BANNER_AMBER = '#8a6100';

const MediaLibrary = ({ ctx, data, session }) => {
  const navigate = useNavigate();
  const canEdit = Boolean(session.copy?.media);
  const [assets, setAssets] = useCopyKv('media.assets', MEDIA_ASSETS);
  const [toastEl, toast] = useAdminToast();

  const filter = ['images', 'documents', 'unused', 'alt'].includes(data.params.get('filter'))
    ? data.params.get('filter')
    : null;
  const q = data.q;
  const emptyState = data.state === 'empty';
  const assetId = ctx.segments[0] ?? null;
  const modal = canEdit && DIALOGS.includes(data.modal) ? data.modal : null;
  const asset = assetId ? (assets.find((a) => a.id === assetId) ?? null) : null;

  const uploads = useMediaUploads(
    useMemo(() => {
      if (data.modal === 'upload' && data.params.get('progress')) {
        const p = Number(data.params.get('progress')) || 0;
        return {
          queue: [
            {
              ...MEDIA_DEMO_UPLOAD,
              id: 'demo-upload',
              progress: Math.min(100, p),
              held: true,
              status: 'uploading',
            },
          ],
        };
      }
      if (data.modal === 'refused') return { refused: MEDIA_DEMO_REFUSED };
      return {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );
  const { queue, refused, addFiles, completeAll, discard, clearRefused, setQueue, setRefused } =
    uploads;
  const [replacement, setReplacement] = useState(null);

  useEffect(() => {
    log('mount', {
      assetId,
      modal: data.modal,
      filter,
      q,
      emptyState,
      canEdit,
      assets: assets.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, data.modal, filter, q, emptyState, canEdit]);

  // An unknown asset id goes back to the library.
  useEffect(() => {
    if (assetId && !asset) {
      log('unknown asset, back to the library', assetId);
      navigate(copyUrl(ctx, COPY_PATHS.media), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, asset]);

  const libUrl = useCallback(
    (extra = {}) => copyUrl(ctx, COPY_PATHS.media, { filter, q, ...extra }),
    [ctx, filter, q]
  );
  const assetUrl = useCallback(
    (id, extra = {}) => copyUrl(ctx, `${COPY_PATHS.media}/${id}`, { filter, q, ...extra }),
    [ctx, filter, q]
  );
  const sectionUrl = useCallback((use) => copyUrl(ctx, COPY_PATHS.section(use.sectionId)), [ctx]);
  const closeToLibrary = () => navigate(libUrl());
  const closeDialog = () => data.update({ modal: null, progress: null });

  const list = useMemo(
    () => (emptyState ? [] : filterAssets(assets, { filter, q })),
    [assets, filter, q, emptyState]
  );
  const subtitle = headerLine({ assets, filter, q, results: list.length, empty: emptyState });

  const setFilter = (id) => navigate(libUrl({ filter: id }), { replace: true });
  const setSearch = (value) => navigate(libUrl({ q: value }), { replace: true });

  const patchAsset = (id, patch) =>
    setAssets((list0) => list0.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  // ---- upload flow ----
  const openUpload = () => {
    log('open upload');
    data.update({ modal: 'upload' });
  };
  const onFiles = async (files) => {
    const res = await addFiles(files);
    if (res.refused) data.update({ modal: 'refused', progress: null });
    else if (res.added) log('files queued', res.added);
  };
  const cancelUpload = () => {
    log('upload cancelled');
    discard();
    closeDialog();
  };
  const nextDescribe = () => {
    log('next: describe it');
    completeAll();
    data.update({ modal: 'details', progress: null });
  };
  const refusedClose = () => {
    clearRefused();
    data.update({ modal: queue.length ? 'upload' : null, progress: null });
  };
  const refusedChooseOther = () => {
    clearRefused();
    data.update({ modal: 'upload', progress: null });
  };

  const demoItem = {
    ...MEDIA_DEMO_UPLOAD,
    id: 'demo-describe',
    status: 'done',
    progress: 100,
    people: true,
    consent: true,
  };
  const describing = queue.find((q) => q.status === 'done') ?? queue[0] ?? demoItem;
  const describeErrors = data.modal === 'describe';
  const describeItem =
    describeErrors && queue.length === 0
      ? { ...demoItem, alt: 'Fai', people: true, consent: false }
      : describing;

  const saveDescribed = (values) => {
    const item = describeItem;
    const id = uniqueId(values.title, assets);
    const added = {
      id,
      title: values.title,
      alt: values.alt,
      kind: item.kind,
      format: item.format,
      src: item.src,
      width: item.width,
      height: item.height,
      bytes: item.bytes,
      pages: item.pages ?? null,
      people: values.people,
      consent: values.consent,
      decorative: values.decorative,
      usedIn: [],
      archived: false,
      addedAt: new Date().toISOString().slice(0, 10),
      addedBy: session.staff?.name ?? 'GTH staff',
      history: [
        {
          v: 1,
          kind: 'uploaded',
          by: session.staff?.name ?? 'GTH staff',
          at: new Date().toISOString().slice(0, 10),
        },
      ],
    };
    log('saved to the library', id);
    setAssets((cur) => [added, ...cur]);
    const rest = queue.filter((q) => q.id !== item.id);
    setQueue(rest);
    toast('Saved to the library', `${values.title} is ready to use on any page.`);
    if (rest.length === 0) navigate(libUrl({ modal: null, progress: null }));
  };

  // ---- replace / archive ----
  const pickReplacement = async (file) => {
    const refusedMessage = refusedByName(file.name);
    const kind = kindOfName(file.name);
    if (refusedMessage || kind !== asset.kind) {
      toast(
        'That file can’t replace this one',
        refusedMessage ??
          `${asset.kind === 'document' ? 'Choose a PDF' : 'Choose an image'} to replace ${asset.title}.`,
        'error'
      );
      return;
    }
    if (file.size > (kind === 'document' ? MEDIA_MAX_DOCUMENT_BYTES : MEDIA_MAX_IMAGE_BYTES)) {
      toast('That file can’t replace this one', tooLargeMessage(kind), 'error');
      return;
    }
    const meta = kind === 'image' ? await describeImageFile(file) : {};
    const ext = (file.name.split('.').pop() || '').toUpperCase();
    setReplacement({
      src: meta.src ?? null,
      width: meta.width ?? null,
      height: meta.height ?? null,
      bytes: file.size,
      format: ext === 'JPEG' ? 'JPG' : ext,
    });
  };
  const confirmReplace = ({ keepAlt }) => {
    const next = replacement ?? MEDIA_REPLACEMENT_SAMPLE;
    const v = (asset.history[0]?.v ?? 1) + 1;
    patchAsset(asset.id, {
      src: next.src ?? asset.src,
      width: next.width ?? asset.width,
      height: next.height ?? asset.height,
      bytes: next.bytes,
      format: next.format,
      alt: keepAlt ? asset.alt : '',
      history: [
        {
          v,
          kind: 'replaced',
          by: session.staff?.name ?? 'GTH staff',
          at: new Date().toISOString().slice(0, 10),
        },
        ...asset.history,
      ],
    });
    log('replaced', asset.id, { keepAlt, v });
    setReplacement(null);
    const n = usedCount(asset);
    toast(
      'File replaced',
      n === 0
        ? `${asset.title} has a new file. The old one is in its history.`
        : `${n} ${n === 1 ? 'section shows' : 'sections show'} the new file once you publish ${n === 1 ? 'it' : 'them'}.`
    );
    navigate(assetUrl(asset.id));
  };
  const askArchive = () => {
    if (usedCount(asset) > 0) {
      log('archive blocked', asset.id);
      data.update({ modal: 'archive' });
      return;
    }
    patchAsset(asset.id, { archived: true });
    log('archived', asset.id);
    toast('Archived', `${asset.title} left the library.`);
    navigate(libUrl());
  };

  const noun = asset ? assetNoun(asset) : 'image';
  const blockedArchive = modal === 'archive' && asset && usedCount(asset) > 0;
  const overDrawer = modal === 'replace' || blockedArchive;
  const showDrawer = Boolean(asset) && !overDrawer;
  const selectedId = asset && overDrawer ? asset.id : null;

  return (
    <div className="flex flex-col gap-[24px] pt-[4px] lg:pt-[16px]">
      <header className="flex flex-wrap items-start justify-between gap-[12px]">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <h1 className="m-0 font-sans text-[clamp(26px,4.5vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
            Media library
          </h1>
          <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959]">
            {subtitle}
          </p>
        </div>
        {canEdit ? (
          <MediaButton size="header" onClick={openUpload}>
            Upload
          </MediaButton>
        ) : null}
      </header>

      <div className="flex flex-col gap-[24px]">
        <MediaToolbar filter={filter} q={q} onFilter={setFilter} onSearch={setSearch} />
        {filter === 'alt' && !emptyState ? (
          <div
            role="status"
            className="flex items-center gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px] font-sans text-[14px] leading-[20px] font-medium text-[#463409]"
          >
            <MediaWarning18Icon className="size-[18px] shrink-0" style={{ color: BANNER_AMBER }} />
            Images without a description can’t be published. Screen-reader users would miss them.
          </div>
        ) : null}

        {emptyState ? (
          <section className="flex flex-col items-center gap-[14px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(24px,5vw,64px)] text-center font-sans">
            <span className="grid size-[66px] place-items-center rounded-full bg-[#ebf1ec]/50 text-[#27522e]">
              <MediaFile30Icon className="size-[30px]" />
            </span>
            <h2 className="m-0 text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
              Your media library is empty
            </h2>
            <p className="m-0 max-w-[560px] text-[15px] leading-[22px] text-[#575755]">
              Upload images and PDF guides here, then use them on any page. Pictures already in the
              design keep showing until you replace them.
            </p>
            {canEdit ? (
              <MediaButton className="mt-[2px]" onClick={openUpload}>
                Upload your first file
              </MediaButton>
            ) : null}
          </section>
        ) : list.length === 0 ? (
          <p
            role="status"
            className="m-0 rounded-[16px] border border-solid border-[#e7e7e7] bg-white p-[24px] text-center font-sans text-[15px] leading-[22px] text-[#575755]"
          >
            No files match.
          </p>
        ) : (
          <ul
            aria-label="Media files"
            className="m-0 grid list-none grid-cols-1 items-start gap-[16px] p-0 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,260px),305px))]"
          >
            {list.map((a) => (
              <li key={a.id} className="min-w-0 self-start">
                <MediaCard asset={a} to={assetUrl(a.id)} selected={a.id === selectedId} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {showDrawer ? (
        <MediaDetailDrawer
          asset={asset}
          canEdit={canEdit}
          hrefFor={sectionUrl}
          onClose={closeToLibrary}
          onSaveField={(patch) => patchAsset(asset.id, patch)}
          onReplace={() => {
            setReplacement(null);
            data.update({ modal: 'replace' });
          }}
          onArchive={askArchive}
        />
      ) : null}

      {modal === 'upload' ? (
        <MediaUploadDialog
          queue={queue}
          onFiles={onFiles}
          onCancel={cancelUpload}
          onNext={nextDescribe}
          onClose={cancelUpload}
        />
      ) : null}
      {modal === 'refused' ? (
        <MediaRefusedDialog
          files={refused.length ? refused : MEDIA_DEMO_REFUSED}
          onClose={() => {
            setRefused([]);
            refusedClose();
          }}
          onChooseOther={refusedChooseOther}
        />
      ) : null}
      {modal === 'details' || modal === 'describe' ? (
        <MediaDescribeDialog
          key={describeItem.id}
          item={describeItem}
          initialErrors={describeErrors}
          onSave={saveDescribed}
          onCancel={() => {
            discard();
            closeToLibrary();
          }}
          onClose={() => {
            discard();
            closeToLibrary();
          }}
        />
      ) : null}
      {modal === 'replace' && asset ? (
        <MediaReplaceDialog
          asset={asset}
          replacement={replacement ?? MEDIA_REPLACEMENT_SAMPLE}
          onPick={pickReplacement}
          onReplace={confirmReplace}
          onCancel={() => data.update({ modal: null })}
          onClose={() => data.update({ modal: null })}
        />
      ) : null}
      {blockedArchive ? (
        <MediaArchiveBlockedDialog
          noun={noun}
          uses={asset.usedIn}
          hrefFor={sectionUrl}
          onClose={() => data.update({ modal: null })}
        />
      ) : null}
      {toastEl}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.9',
    area: 'media',
    priority: 0,
    match: () => true,
    Component: MediaLibrary,
  },
];

export default MediaLibrary;
