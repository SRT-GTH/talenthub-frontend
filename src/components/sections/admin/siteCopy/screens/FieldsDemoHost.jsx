import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import { copyUrl, COPY_PATHS } from '../copyUrl.js';
import ImageField from '../fields/ImageField.jsx';
import MissingDescriptionDialog from '../fields/MissingDescriptionDialog.jsx';
import VideoField from '../fields/VideoField.jsx';
import { EyeIcon, HistoryIcon } from '../fields/FieldsIcons.jsx';
import {
  FIELD_ASSET_SEED,
  HERO_IMAGE_FIELD,
  SECTION_TITLE_FIELD,
  SECTION_VIDEO_FIELD,
  findAsset,
  needsDescription,
  parseVideoUrl,
} from '../fields/fieldsData.js';
import EditorPublishBar from '../fieldsHost/EditorPublishBar.jsx';
import HostTextField from '../fieldsHost/HostTextField.jsx';
import PagesTreeCard from '../fieldsHost/PagesTreeCard.jsx';
import PortalTabsRow from '../fieldsHost/PortalTabsRow.jsx';
import TreeStatusChip from '../fieldsHost/TreeStatusChip.jsx';
import { PUBLIC_PAGES } from '../fieldsHost/pagesTreeData.js';

const log = debug('FieldsDemoHost');

/*
 * FieldsDemoHost — Platform Admin 7.8.10a-h: the image and video fields of the Site copy section editor, shown in the editor's look so every frame has a URL.
 * The real editor page is builder B1's (`/admin/site-copy/section/:id`, which mounts ImageField / VideoField); this screen is the host for the field UI + dialogs:
 *
 *   /admin/site-copy/fields-demo                                     7.8.10a  image field (Home › Hero): crop shape, minimum width, size hint
 *   …?modal=library                                                  7.8.10b  "Choose an image for Home › Hero" (also: Choose from library)
 *   …?modal=crop                                                     7.8.10c  "How it looks on each screen" (also: Use this image / Upload new)         &bar=off hides the publish bar
 *   …?state=small                                                    7.8.10d  image too small, may look blurry (800 × 400 picture)                        &bar=off
 *   …?modal=nodescription                                            7.8.10e  "One thing before publishing" (also: Publish with a picture that has no description)  &bar=off
 *   …?field=video                                                    7.8.10f  video field: YouTube link with player preview (Home › How it works)
 *   …?field=video&state=refused                                      7.8.10g  video link refused: not YouTube or Vimeo
 *   …?modal=reset                                                    7.8.10h  "Go back to the original photo?" (also: Reset to default)
 *   other keys: asset=<media id> picks the picture shown, role=… keeps the mock role. The URL is the state of the dialogs (data.update({ modal })).
 * Low priority on purpose: the real editor owns `/admin/site-copy/*`; this only matches `/admin/site-copy/fields-demo`.
 * What works (mock): choosing / uploading / resetting a picture, typing a video link, the Headline / Supporting line / Section title counters, Discard, Preview /
 * History / tabs / tree (links to the other 7.8 screens), Publish (blocked by a picture with no description → dialog; otherwise opens the publish flow of the editor).
 * ⚠️ ASSUMPTION: this host is only as faithful as is cheap; the status chips of the tree are fixed as drawn (Home / Hero show the draft only for the picture, How it works
 * keeps "Default" as in the frame); nothing is saved (state lives in this page).
 */
const HOME_HERO_ID = 'public.home.hero';
const HOW_ID = 'public.home.how-it-works';
const HEADLINE = { id: 'headline', label: 'Headline', max: 60, initial: 'Find work that fits you' };
const SUPPORT = {
  id: 'supporting',
  label: 'Supporting line',
  max: 160,
  initial: 'Show what you can do, get verified skills and connect with employers across Ghana.',
};
const REFUSED_SAMPLE = 'https://drive.example.com/share/how-it-works.mp4';
const DIALOG_MODALS = ['library', 'crop', 'reset'];

const initialAssetId = (data) => {
  const asset = data.params.get('asset');
  if (asset) return asset;
  if (data.state === 'small') return 'm-small-banner';
  if (data.state === 'noalt' || data.modal === 'nodescription') return 'm-classroom';
  if (data.modal === 'crop' || data.modal === 'reset') return 'm-career-fair-2026';
  return HERO_IMAGE_FIELD.original;
};

const FieldsDemoHost = ({ ctx, data, session }) => {
  const navigate = useNavigate();
  const canEdit = session.copy?.edit !== false;
  const videoMode = data.params.get('field') === 'video';
  const assets = FIELD_ASSET_SEED;

  const [image, setImage] = useState(() => ({ assetId: initialAssetId(data) }));
  const [video, setVideo] = useState(() => ({
    url: data.state === 'refused' ? REFUSED_SAMPLE : videoMode ? SECTION_VIDEO_FIELD.sampleUrl : '',
  }));
  const [headline, setHeadline] = useState(HEADLINE.initial);
  const [support, setSupport] = useState(SUPPORT.initial);
  const [sectionTitle, setSectionTitle] = useState(SECTION_TITLE_FIELD.initial);

  const asset = image.asset ?? findAsset(assets, image.assetId);
  const imageChanged = image.assetId !== HERO_IMAGE_FIELD.original;
  const videoChanged = Boolean(parseVideoUrl(video.url));
  const heroCount =
    Number(imageChanged) +
    Number(headline !== HEADLINE.initial) +
    Number(support !== SUPPORT.initial);
  const howCount = Number(videoChanged) + Number(sectionTitle !== SECTION_TITLE_FIELD.initial);
  const count = videoMode ? howCount : heroCount;
  const sectionId = videoMode ? HOW_ID : HOME_HERO_ID;
  const sectionName = videoMode ? 'How it works' : 'Hero';
  const crumbText = `Home › ${sectionName}`;
  const blocked = data.modal === 'nodescription';
  const dialog = !videoMode && DIALOG_MODALS.includes(data.modal) ? data.modal : null;

  useEffect(() => {
    log('mount', {
      field: videoMode ? 'video' : 'image',
      modal: data.modal,
      state: data.state,
      asset: image.assetId,
      role: session.role,
      canEdit,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    log('draft', { section: sectionId, count, imageChanged, videoChanged });
  }, [sectionId, count, imageChanged, videoChanged]);

  const hrefFor = (id) =>
    id === HOME_HERO_ID
      ? copyUrl(ctx, '/admin/site-copy/fields-demo')
      : id === HOW_ID
        ? copyUrl(ctx, '/admin/site-copy/fields-demo', { field: 'video' })
        : copyUrl(ctx, COPY_PATHS.section(id));

  const discard = () => {
    log('discard', sectionId);
    setImage({ assetId: HERO_IMAGE_FIELD.original });
    setVideo({ url: '' });
    setHeadline(HEADLINE.initial);
    setSupport(SUPPORT.initial);
    setSectionTitle(SECTION_TITLE_FIELD.initial);
    data.update({ modal: null, state: null });
  };

  const publish = () => {
    if (asset && needsDescription(asset)) {
      log('publish blocked: the picture has no description', asset.id);
      data.update({ modal: 'nodescription' });
      return;
    }
    if (video.url.trim() && !videoChanged) {
      log('publish blocked: the video link is refused');
      document.querySelector(`[data-field="${SECTION_VIDEO_FIELD.id}"] input`)?.focus();
      return;
    }
    log('publish → the publish flow of the editor', sectionId);
    navigate(copyUrl(ctx, COPY_PATHS.section(sectionId), { modal: 'publish' }));
  };

  const treeDraft = !videoMode && heroCount > 0;
  const statusOverrides = useMemo(
    () => (treeDraft ? { home: 'draft', [HOME_HERO_ID]: 'draft' } : {}),
    [treeDraft]
  );

  return (
    <div className="flex flex-col gap-[24px] pt-[16px]">
      <header className="flex flex-col gap-[3px]">
        <h1 className="m-0 font-sans text-[clamp(28px,1.97vw,34px)] leading-[41px] font-semibold tracking-[-0.68px] text-[#1c2a21]">
          Site copy
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959] max-sm:text-[14px]">
          Public site · Home
        </p>
      </header>

      <div className="flex flex-col gap-[24px]">
        <PortalTabsRow ctx={ctx} active="public" />

        <div className="flex items-start gap-[24px] max-lg:flex-col max-lg:gap-[16px]">
          <PagesTreeCard
            pages={PUBLIC_PAGES}
            selectedId={sectionId}
            outlinedIds={videoMode ? [HOME_HERO_ID] : []}
            statusOverrides={statusOverrides}
            hrefFor={hrefFor}
          />

          <section
            aria-label={`${sectionName} section`}
            className="flex min-w-0 flex-1 flex-col gap-[22px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[24px] max-sm:p-[16px] max-lg:w-full"
          >
            <div className="flex flex-col gap-[10px]">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#575755]"
              >
                <span>Public site</span>
                <span aria-hidden="true">›</span>
                <span>Home</span>
                <span aria-hidden="true">›</span>
                <span aria-current="page" className="font-semibold text-[#1c2a21]">
                  {sectionName}
                </span>
              </nav>
              <div className="flex flex-wrap items-center gap-[10px]">
                <h2 className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
                  {sectionName}
                </h2>
                <TreeStatusChip status={count > 0 ? 'draft' : 'edited'} count={count} />
                <span className="flex-1" />
                <Link
                  to={copyUrl(ctx, COPY_PATHS.history(sectionId))}
                  className="inline-flex min-h-[34px] items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] px-[12px] py-[8px] font-sans text-[13.5px] leading-[16px] font-semibold text-[#1c2a21] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  <HistoryIcon className="size-[16px]" />
                  History
                </Link>
                {canEdit ? (
                  <Link
                    to={copyUrl(ctx, COPY_PATHS.preview(sectionId))}
                    className="inline-flex min-h-[34px] items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] px-[12px] py-[8px] font-sans text-[13.5px] leading-[16px] font-semibold text-[#1c2a21] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                  >
                    <EyeIcon className="size-[16px] text-[#387440]" />
                    Preview
                  </Link>
                ) : null}
              </div>
            </div>

            {videoMode ? (
              <>
                <VideoField
                  field={SECTION_VIDEO_FIELD}
                  value={video}
                  onChange={setVideo}
                  canEdit={canEdit}
                />
                <HostTextField
                  label={SECTION_TITLE_FIELD.label}
                  value={sectionTitle}
                  onChange={setSectionTitle}
                  max={SECTION_TITLE_FIELD.maxLength}
                  canEdit={canEdit}
                />
              </>
            ) : (
              <>
                <ImageField
                  field={HERO_IMAGE_FIELD}
                  value={image}
                  onChange={setImage}
                  canEdit={canEdit}
                  dialog={dialog}
                  onDialogChange={(d) => data.update({ modal: d })}
                  assets={assets}
                />
                <HostTextField
                  label={HEADLINE.label}
                  value={headline}
                  onChange={setHeadline}
                  max={HEADLINE.max}
                  variant="headline"
                  canEdit={canEdit}
                />
                <HostTextField
                  label={SUPPORT.label}
                  value={support}
                  onChange={setSupport}
                  max={SUPPORT.max}
                  variant="rich"
                  canEdit={canEdit}
                />
              </>
            )}
          </section>
        </div>

        {count > 0 && canEdit && data.params.get('bar') !== 'off' ? (
          <EditorPublishBar
            count={count}
            crumb={crumbText}
            previewHref={copyUrl(ctx, COPY_PATHS.preview(sectionId))}
            onDiscard={discard}
            onPublish={publish}
          />
        ) : null}
      </div>

      {blocked && asset ? (
        <MissingDescriptionDialog
          field={HERO_IMAGE_FIELD}
          asset={asset}
          mediaHref={copyUrl(ctx, `${COPY_PATHS.media}/${asset.id}`)}
          onClose={() => data.update({ modal: null })}
        />
      ) : null}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const COPY_SCREENS = [
  {
    id: '7.8.10',
    area: 'site-copy',
    priority: -10,
    match: (ctx) => ctx.segments.length === 1 && ctx.segments[0] === 'fields-demo',
    Component: FieldsDemoHost,
  },
];

export default FieldsDemoHost;
