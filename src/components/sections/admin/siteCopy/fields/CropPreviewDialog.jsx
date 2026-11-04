import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import FieldButton from './FieldButton.jsx';
import FieldDialog from './FieldDialog.jsx';
import { CROP_LAYOUTS } from './fieldsData.js';
import { EyeTileIcon } from './FieldsIcons.jsx';

const log = debug('CropPreviewDialog');

/*
 * CropPreviewDialog — "How it looks on each screen" (Figma 7.8.10c): the chosen photo cropped for Desktop (380 x 214), Tablet (250 x 188) and Phone (160 x 200),
 * labels 13 / 600 under each crop, the line "The photo is cropped to fit each layout. Faces stay in the middle of the frame.", then "Choose another" and
 * "Save as draft". The crops are CSS object-fit covers centred on the middle of the photo (what "faces stay in the middle" means on the live page).
 * Props: asset, onChooseAnother(), onSave(), onClose().
 */
const CropPreviewDialog = ({ asset, onChooseAnother, onSave, onClose }) => {
  useEffect(() => {
    log('open', { asset: asset?.id, size: asset ? `${asset.width}x${asset.height}` : null });
  }, [asset]);

  return (
    <FieldDialog
      label="How it looks on each screen"
      icon={<EyeTileIcon className="size-[21px]" />}
      width={880}
      onClose={onClose}
    >
      <div className="flex items-end justify-between gap-x-[18px] gap-y-[14px] max-md:flex-wrap max-md:justify-center">
        {CROP_LAYOUTS.map((c) => (
          <figure
            key={c.id}
            style={{ flex: `0 1 ${c.maxWidth}px`, maxWidth: '100%' }}
            className="m-0 flex min-w-0 flex-col items-center gap-[8px]"
          >
            <img
              src={asset.src}
              alt={`${c.label} crop of ${asset.title}`}
              style={{ aspectRatio: c.ratio }}
              className="w-full rounded-[12px] object-cover"
            />
            <figcaption className="font-sans text-[13px] leading-[16px] font-semibold text-[#575755]">
              {c.label}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="m-0 font-sans text-[14px] leading-[17px] text-[#575755]">
        The photo is cropped to fit each layout. Faces stay in the middle of the frame.
      </p>
      <div className="flex gap-[12px] max-sm:flex-col">
        <FieldButton size="lg" className="flex-1" onClick={onChooseAnother}>
          Choose another
        </FieldButton>
        <FieldButton tone="primary" size="lg" className="flex-1" onClick={onSave}>
          Save as draft
        </FieldButton>
      </div>
    </FieldDialog>
  );
};

export default CropPreviewDialog;
