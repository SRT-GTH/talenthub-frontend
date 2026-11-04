import { useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import MediaButton from './MediaButton.jsx';
import MediaCheckRow from './MediaCheckRow.jsx';
import MediaDialogShell from './MediaDialogShell.jsx';
import { MediaRestoreIcon } from './MediaIcons.jsx';
import { ACCEPT_ATTR, assetNoun, shortTitle, usedCount } from './mediaLibraryModel.js';

const log = debug('MediaReplaceDialog');

/*
 * MediaReplaceDialog — "Replace Partner logo?" (Figma 7.8.9f): now → new thumbnails (200 x 100, r10), "This logo is used on 3 sections. They show the new
 * file once you publish them. The library keeps the same item, with the old file in its history.", the tick "Keep the same description" with the
 * current alt text quoted, Cancel / "Replace file". The "new" thumbnail is a button that opens a real file picker (images only); until a file is chosen it
 * shows the sample replacement (⚠️ ASSUMPTION). ⚠️ ASSUMPTION: an asset used nowhere reads "This logo isn’t used on any section yet." instead of the count;
 * a document has no thumbnails to compare, so the pair shows file tiles and the description tick is not drawn.
 * Props: asset, replacement { src, width, height, bytes, format, name? }, onPick(File), onReplace({ keepAlt }), onCancel, onClose.
 */
const Thumb = ({ src, label }) =>
  src ? (
    <img
      src={src}
      alt={label}
      className="h-[100px] w-[200px] max-w-full rounded-[10px] bg-[#f8f8f4] object-cover"
    />
  ) : (
    <span className="grid h-[100px] w-[200px] max-w-full place-items-center rounded-[10px] bg-[#f8f8f4] text-[13px] font-semibold text-[#575755]">
      PDF
    </span>
  );

const MediaReplaceDialog = ({ asset, replacement, onPick, onReplace, onCancel, onClose }) => {
  const [keepAlt, setKeepAlt] = useState(true);
  const inputRef = useRef(null);
  const noun = assetNoun(asset);
  const n = usedCount(asset);
  const hasAlt = asset.kind === 'image' && Boolean(asset.alt?.trim());

  return (
    <MediaDialogShell
      title={`Replace ${shortTitle(asset)}?`}
      icon={<MediaRestoreIcon className="size-[21px]" />}
      onClose={onClose}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        data-testid="media-replace-input"
        onChange={(e) => {
          const f = e.target.files?.[0];
          log('replacement picked', f?.name);
          if (f) onPick(f);
          e.target.value = '';
        }}
      />
      <div className="flex flex-wrap items-center gap-[14px]">
        <Thumb src={asset.src} label={`Current file of ${asset.title}`} />
        <span aria-hidden="true" className="text-[22px] leading-[26px] font-bold text-[#575755]">
          →
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Choose a different file"
          title="Choose a different file"
          className="cursor-pointer rounded-[10px] border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <Thumb src={replacement.src} label="The new file" />
        </button>
      </div>
      <p className="m-0 text-[15px] leading-[22px] text-[#575755]">
        {n === 0
          ? `This ${noun} isn’t used on any section yet. The library keeps the same item, with the old file in its history.`
          : `This ${noun} is used on ${n} ${n === 1 ? 'section' : 'sections'}. They show the new file once you publish them. The library keeps the same item, with the old file in its history.`}
      </p>
      {hasAlt ? (
        <MediaCheckRow
          label="Keep the same description"
          hint={`“${asset.alt}”`}
          checked={keepAlt}
          onChange={setKeepAlt}
        />
      ) : null}
      <div className="flex gap-[12px] max-sm:flex-col-reverse">
        <MediaButton variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </MediaButton>
        <MediaButton className="flex-1" onClick={() => onReplace({ keepAlt: hasAlt && keepAlt })}>
          Replace file
        </MediaButton>
      </div>
    </MediaDialogShell>
  );
};

export default MediaReplaceDialog;
