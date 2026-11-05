import { useEffect, useMemo, useState } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { SettingsToggle } from '../../../talentSettings/SettingsBUi.jsx';
import FieldButton from './FieldButton.jsx';
import FieldDialog from './FieldDialog.jsx';
import { fitFilterLabel, fitsField, sizeLabel } from './fieldsData.js';
import { CheckCircleIcon, FileIcon, SearchIcon } from './FieldsIcons.jsx';

const log = debug('ImageLibraryDialog');

/*
 * ImageLibraryDialog — "Choose an image for Home › Hero" (Figma 7.8.10b): a toggle "Only show images that fit this space (16:9, 1200 px or wider)" (on by
 * default), a search box, the picker grid (tiles 272 wide: thumbnail 254 x 150, title 13.5 / 600 + a check when chosen, size 12), then "Upload new" and
 * "Use this image". The chosen tile has the green ring. Reads the media library (images that are not archived); the search matches title and description.
 * ⚠️ ASSUMPTION: the first listed image starts chosen (the frame draws "Career fair 2026" chosen while the field still shows the design photo); "Upload new"
 * opens the file picker of the field (same as the field's own button); an empty result says "No images match." (not drawn); a double click uses the tile.
 * Props: field, assets, onUse(assetId), onUpload(), onClose().
 */
const ImageLibraryDialog = ({ field, assets, onUse, onUpload, onClose }) => {
  const [fitOnly, setFitOnly] = useState(true);
  const [query, setQuery] = useState('');
  const images = useMemo(() => assets.filter((a) => a.kind === 'image' && !a.archived), [assets]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return images.filter(
      (a) =>
        (!fitOnly || fitsField(a, field)) &&
        (!q || a.title.toLowerCase().includes(q) || (a.alt ?? '').toLowerCase().includes(q))
    );
  }, [images, fitOnly, query, field]);
  const [chosen, setChosen] = useState(() => shown[0]?.id ?? null);

  useEffect(() => {
    log('open', { total: images.length, shown: shown.length, fitOnly });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    log('filter', { fitOnly, query, shown: shown.length });
    if (chosen && !shown.some((a) => a.id === chosen)) setChosen(shown[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitOnly, query]);

  return (
    <FieldDialog
      label={`Choose an image for ${field.crumb}`}
      icon={<FileIcon className="size-[21px]" />}
      onClose={onClose}
    >
      <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[10px]">
        <div className="flex min-w-0 items-center gap-[10px]">
          <SettingsToggle checked={fitOnly} onChange={setFitOnly} label={fitFilterLabel(field)} />
          <span
            aria-hidden="true"
            className="min-w-0 font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]"
          >
            {fitFilterLabel(field)}
          </span>
        </div>
        <span className="flex-1" />
        <label className="flex h-[44px] w-[260px] max-w-full items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] max-sm:w-full">
          <SearchIcon className="size-[18px] shrink-0 text-[#387440]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, sections or words"
            aria-label="Search the media library"
            className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] text-[#1c2a21] outline-none placeholder:text-[#575755]"
          />
        </label>
      </div>
      <ul
        aria-label="Images in the media library"
        className="m-0 flex max-h-[min(661px,calc(100dvh-367px))] min-h-[120px] list-none flex-wrap content-start gap-[14px] overflow-y-auto p-[3px]"
      >
        {shown.length === 0 ? (
          <li className="font-sans text-[14px] text-[#575755]" role="status">
            No images match.
          </li>
        ) : null}
        {shown.map((a) => {
          const on = a.id === chosen;
          return (
            <li key={a.id} className="w-[272px] max-sm:w-full">
              <button
                type="button"
                aria-pressed={on}
                aria-label={`${a.title}, ${sizeLabel(a)}`}
                onClick={() => {
                  log('choose', a.id);
                  setChosen(a.id);
                }}
                onDoubleClick={() => onUse(a.id)}
                className={classNames(
                  'flex w-full cursor-pointer flex-col gap-[6px] rounded-[14px] border border-solid bg-white p-[8px] text-left font-sans focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                  on ? 'border-[#387440] shadow-[0_0_0_1.5px_#387440]' : 'border-[#e7e7e7]'
                )}
              >
                <img
                  src={a.src}
                  alt=""
                  loading="lazy"
                  className="aspect-[254/150] w-full rounded-[10px] object-cover"
                />
                <span className="flex items-center gap-[6px]">
                  <span className="min-w-0 flex-1 truncate text-[13.5px] leading-[16px] font-semibold text-[#1c2a21]">
                    {a.title}
                  </span>
                  {on ? <CheckCircleIcon className="size-[16px] shrink-0 text-[#387440]" /> : null}
                </span>
                <span
                  aria-hidden="true"
                  data-size={sizeLabel(a)}
                  className="text-[12px] leading-[14px] text-[#575755] after:content-[attr(data-size)]"
                />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex gap-[12px] max-sm:flex-col">
        <FieldButton size="lg" className="flex-1" onClick={onUpload}>
          Upload new
        </FieldButton>
        <FieldButton
          tone="primary"
          size="lg"
          className="flex-1"
          disabled={!chosen}
          onClick={() => chosen && onUse(chosen)}
        >
          Use this image
        </FieldButton>
      </div>
    </FieldDialog>
  );
};

export default ImageLibraryDialog;
