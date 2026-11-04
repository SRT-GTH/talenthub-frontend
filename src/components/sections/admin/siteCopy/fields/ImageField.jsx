import { useEffect, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import CropPreviewDialog from './CropPreviewDialog.jsx';
import FieldButton from './FieldButton.jsx';
import FieldChip from './FieldChip.jsx';
import ImageLibraryDialog from './ImageLibraryDialog.jsx';
import ResetPhotoPopover from './ResetPhotoPopover.jsx';
import { RestoreIcon, WarningIcon } from './FieldsIcons.jsx';
import { descriptionLine, findAsset, fitsField, metaLine } from './fieldsData.js';
import { useFieldAssets } from './useFieldAssets.js';

const log = debug('ImageField');

/*
 * ImageField — an image field of the Site copy section editor (Platform Admin 7.8.10a-e, h; Figma 7.8.10a "Image field").
 *   label row    "Hero image" + a "Changed" chip once the picture is not the design's, and on the right the chip "16:9 · at least 1200 px wide"
 *   image row    the crop frame (440 x 248, r14, dashed white inside stroke, "16:9 crop" label) and the details: asset title 15 / 600, "1920 × 1280 · from the
 *                design" / "2400 × 1600 · 3.0 MB", `Description: “…”` or "No description yet", then "Choose from library" (primary), "Upload new" (compact)
 *                and "Reset to default" (a confirm card, 7.8.10h)
 *   below        the load-fast note, or, when the picture is narrower than the field needs, the amber banner with "Choose a bigger one" (7.8.10d)
 * Dialogs it opens: the library picker (7.8.10b) → the crop preview (7.8.10c) after "Use this image" or an upload; the reset card.
 * The missing-description block (7.8.10e) is a PUBLISH rule, so the editor's publish flow raises MissingDescriptionDialog with `needsDescription(asset)`.
 *
 * Props:
 *   field           the field config (fieldsData.js HERO_IMAGE_FIELD: label, crumb, aspectLabel, aspectRatio, minWidth, cropLabel, original asset id, note)
 *   value           { assetId, asset? } — `asset` only for a file uploaded in this session (not in the library yet)
 *   onChange(next)  called with the new value (picking, uploading, reset)
 *   canEdit         false → read-only: no buttons, no reset
 *   dialog / onDialogChange   optional controlled dialog ('library' | 'crop' | 'reset' | null), for `?modal=` URLs; uncontrolled when `dialog` is undefined
 *   persistAssets   default true: the media list follows the shared `media.assets` store; false (frame URLs) seeds from the data file only
 *   assets          optional list that replaces the media library (the demo host passes the frame's own seed so the frames read exactly as drawn)
 * ⚠️ ASSUMPTION: "Use this image" applies the picture at once (the frame behind the crop preview already shows it as Changed) and the preview's
 * "Save as draft" / close keep it; "Choose another" goes back to the picker. A file chosen with "Upload new" stays in this session (the media
 * library page owns real uploads) and then opens the crop preview. "Reset to default" does nothing when the design photo is already in use.
 */
const ImageField = ({
  field,
  value,
  onChange,
  canEdit = true,
  dialog,
  onDialogChange,
  persistAssets = true,
  assets: assetsProp,
}) => {
  const library = useFieldAssets({ persist: persistAssets });
  const assets = assetsProp ?? library.assets;
  const lookup = (id) => findAsset(assets, id);
  const [localDialog, setLocalDialog] = useState(null);
  const [resetOpen, setResetOpen] = useState(false);
  const fileRef = useRef(null);
  const controlled = dialog !== undefined;
  const open = controlled ? dialog : localDialog;
  const setOpen = (next) => {
    log('dialog', next);
    if (controlled) onDialogChange?.(next);
    else setLocalDialog(next);
  };

  const asset = value?.asset ?? lookup(value?.assetId);
  const original = lookup(field.original) ?? assets.find((a) => a.title === field.originalTitle);
  const changed = Boolean(asset) && asset.id !== original?.id;
  const tooSmall = Boolean(asset) && !fitsField(asset, field);
  const resetShown = (resetOpen || open === 'reset') && changed && Boolean(original);
  const closeReset = () => {
    setResetOpen(false);
    if (open === 'reset') setOpen(null);
  };

  useEffect(() => {
    log('mount', { field: field.id, asset: asset?.id, changed, tooSmall, canEdit });
  }, [field.id, asset?.id, changed, tooSmall, canEdit]);

  if (!asset) return null;

  const pick = (assetId) => {
    log('use image', assetId);
    onChange?.({ assetId });
    setOpen('crop');
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    log('upload', { name: file.name, type: file.type, bytes: file.size });
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const created = {
        id: `upload-${Date.now()}`,
        title: file.name.replace(/\.[^.]+$/, ''),
        alt: '',
        kind: 'image',
        src,
        width: img.naturalWidth,
        height: img.naturalHeight,
        bytes: file.size,
        people: false,
        consent: false,
        usedIn: [],
        archived: false,
        addedAt: new Date().toISOString().slice(0, 10),
      };
      log('uploaded', { id: created.id, size: `${created.width}x${created.height}` });
      onChange?.({ assetId: created.id, asset: created });
      setOpen('crop');
    };
    img.onerror = () => log.error('the chosen file is not an image', file.name);
    img.src = src;
  };

  const openFilePicker = () => fileRef.current?.click();

  return (
    <div className="flex min-w-0 flex-col gap-[10px]" data-field={field.id}>
      <div className="flex min-h-[32px] flex-wrap items-center gap-x-[8px] gap-y-[6px]">
        <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
          {field.label}
        </span>
        {changed ? <FieldChip tone="warn">Changed</FieldChip> : null}
        <span className="flex-1" />
        <FieldChip tone="neutral">
          {field.aspectLabel} · at least {field.minWidth} px wide
        </FieldChip>
      </div>

      <div className="flex flex-wrap items-start gap-[18px]">
        <div className="relative aspect-[440/248] w-[min(440px,100%)] shrink-0 overflow-hidden rounded-[14px] bg-[#f8f8f4]">
          <img
            src={asset.src}
            alt={asset.alt?.trim() ? asset.alt : asset.title}
            className="absolute inset-0 size-full object-cover"
          />
          <svg
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute inset-0 size-full"
          >
            <rect
              x="1"
              y="1"
              rx="13"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="8 6"
              style={{ width: 'calc(100% - 2px)', height: 'calc(100% - 2px)' }}
            />
          </svg>
          <span className="absolute top-[10px] left-[10px] inline-flex items-center rounded-[6px] bg-[#1c2a21]/75 px-[8px] py-[4px] font-sans text-[11.5px] leading-[14px] font-bold text-white max-lg:text-[12px]">
            {field.cropLabel}
          </span>
        </div>

        <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-[8px] font-sans">
          <p className="m-0 text-[15px] leading-[18px] font-semibold break-words text-[#1c2a21]">
            {asset.title}
          </p>
          <p className="m-0 text-[13px] leading-[16px] text-[#575755]">
            {metaLine(asset, { fresh: open === 'crop' })}
          </p>
          <p className="m-0 text-[13px] leading-[18px] break-words text-[#575755]">
            {descriptionLine(asset)}
          </p>
          {canEdit ? (
            <div className="relative flex flex-col items-start gap-[8px]">
              <FieldButton tone="primary" onClick={() => setOpen('library')}>
                Choose from library
              </FieldButton>
              <FieldButton size="xs" onClick={openFilePicker}>
                Upload new
              </FieldButton>
              <button
                type="button"
                data-reset-trigger
                aria-expanded={resetShown}
                onClick={() => {
                  if (!changed) {
                    log('reset ignored: the design photo is already in use');
                    return;
                  }
                  if (resetShown) closeReset();
                  else setResetOpen(true);
                }}
                className="inline-flex min-h-[28px] cursor-pointer items-center gap-[6px] rounded-[8px] border-0 bg-transparent px-[4px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold text-[#575755] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                <RestoreIcon className="size-[14px]" />
                Reset to default
              </button>
              {resetShown ? (
                <ResetPhotoPopover
                  original={original}
                  current={asset}
                  onKeep={() => {
                    log('reset: keep new photo');
                    closeReset();
                  }}
                  onReset={() => {
                    log('reset: back to the design photo', original.id);
                    closeReset();
                    onChange?.({ assetId: original.id });
                  }}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {tooSmall ? (
        <div
          role="alert"
          className="flex items-center gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px] max-md:flex-wrap"
        >
          <WarningIcon className="size-[18px] shrink-0 text-[#8a6100]" />
          <p className="m-0 min-w-0 flex-[0_1_362px] font-sans text-[14px] leading-[20px] font-medium text-[#463409] max-md:flex-[1_1_200px]">
            This image is smaller than this space needs and may look blurry. The {field.noun} needs
            at least {field.minWidth} px wide.
          </p>
          {canEdit ? (
            <FieldButton
              className="min-w-[160px] flex-1 max-md:w-full"
              onClick={() => setOpen('library')}
            >
              Choose a bigger one
            </FieldButton>
          ) : null}
        </div>
      ) : (
        <p className="m-0 font-sans text-[12.5px] leading-[15px] text-[#575755]">{field.note}</p>
      )}

      {canEdit ? (
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          tabIndex={-1}
          aria-label="Upload a new image"
          className="sr-only"
          onChange={onFile}
        />
      ) : null}

      {open === 'library' ? (
        <ImageLibraryDialog
          field={field}
          assets={assets}
          onUse={pick}
          onUpload={openFilePicker}
          onClose={() => setOpen(null)}
        />
      ) : null}
      {open === 'crop' ? (
        <CropPreviewDialog
          asset={asset}
          onChooseAnother={() => setOpen('library')}
          onSave={() => {
            log('crop preview: saved as draft', asset.id);
            setOpen(null);
          }}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </div>
  );
};

export default ImageField;
