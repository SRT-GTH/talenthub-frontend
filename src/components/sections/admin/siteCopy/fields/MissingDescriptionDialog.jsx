import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import FieldButton from './FieldButton.jsx';
import FieldDialog from './FieldDialog.jsx';
import { WarningIcon } from './FieldsIcons.jsx';

const log = debug('MissingDescriptionDialog');

/*
 * MissingDescriptionDialog — "One thing before publishing" (Figma 7.8.10e): publishing is blocked while a picture on the page has no description. A red block
 * "Add a description for this image in the media library" + `Home › Hero · “Classroom”`, the line "People using screen readers need a short description of every
 * image." and two buttons: "Close" and "Add description" (goes to the asset in the media library, where the description is written).
 * Props: field (crumb), asset, mediaHref (link to the asset in the media library), onClose().
 */
const MissingDescriptionDialog = ({ field, asset, mediaHref, onClose }) => {
  useEffect(() => {
    log('open', { asset: asset?.id, field: field.id });
  }, [asset, field]);

  return (
    <FieldDialog
      label="One thing before publishing"
      icon={<WarningIcon className="size-[21px]" />}
      tone="red"
      width={540}
      onClose={onClose}
    >
      <div
        role="alert"
        className="flex items-start gap-[10px] rounded-[12px] bg-[#f9ebea]/50 p-[12px]"
      >
        <WarningIcon className="mt-[1px] size-[16px] shrink-0 text-[#b42318]" />
        <div className="flex min-w-0 flex-col gap-[3px] font-sans">
          <span className="text-[14px] leading-[17px] font-semibold text-[#c0392b]">
            Add a description for this image in the media library
          </span>
          <span className="text-[12.5px] leading-[15px] text-[#1c2a21]">
            {field.crumb} · “{asset.title}”
          </span>
        </div>
      </div>
      <p className="m-0 font-sans text-[13.5px] leading-[16px] text-[#575755]">
        People using screen readers need a short description of every image.
      </p>
      <div className="flex gap-[12px] max-sm:flex-col">
        <FieldButton size="lg" className="flex-1" onClick={onClose}>
          Close
        </FieldButton>
        <FieldButton tone="primary" size="lg" className="flex-1" to={mediaHref}>
          Add description
        </FieldButton>
      </div>
    </FieldDialog>
  );
};

export default MissingDescriptionDialog;
