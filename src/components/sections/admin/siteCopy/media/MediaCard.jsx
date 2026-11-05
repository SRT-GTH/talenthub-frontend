import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { assetCaption, assetWarning, usedCount, usedLabel } from './mediaLibraryModel.js';
import { MediaArchiveIcon, MediaFile36Icon, MediaLinkIcon } from './MediaIcons.jsx';
import MediaWarningChip from './MediaWarningChip.jsx';

/*
 * MediaCard — one file of the library grid (Figma "media · <title>" 7.8.9a): white card r16, 1px #e7e7e7 border (2px #387440 when `selected`, 7.8.9f/g),
 * p10, gap8; thumb 170 high r12 (documents: #f8f8f4 tile with the file icon and a white "PDF" pill); title 14.5/600; caption 12.5 #575755;
 * "Used on N sections" (link icon) or "Unused" (archive icon) 12.5/500; one warning chip. The whole card links to the detail drawer.
 * Props: asset, to (detail URL), selected.
 */
const MediaCard = ({ asset, to, selected = false }) => {
  const warning = assetWarning(asset);
  const used = usedCount(asset) > 0;
  const UsedIcon = used ? MediaLinkIcon : MediaArchiveIcon;
  return (
    <Link
      to={to}
      aria-label={`${asset.title}. ${assetCaption(asset)}. ${usedLabel(asset)}.${warning && warning.id !== 'unused' ? ` ${warning.label}.` : ''}`}
      className={classNames(
        'flex min-w-0 flex-col items-stretch gap-[8px] self-start rounded-[16px] border border-solid bg-white p-[10px] font-sans text-[#1c2a21] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
        selected ? 'border-2 border-[#387440] p-[9px]' : 'border-[#e7e7e7]'
      )}
    >
      {asset.kind === 'document' ? (
        <span className="flex h-[170px] flex-col items-center justify-center gap-[6px] rounded-[12px] bg-[#f8f8f4] text-[#5f6b63]">
          <MediaFile36Icon className="size-[36px]" />
          <span className="inline-flex min-h-[32px] items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[16px] font-semibold text-[#595959]">
            PDF
          </span>
        </span>
      ) : (
        <img
          src={asset.src}
          alt=""
          loading="lazy"
          className="block h-[170px] w-full rounded-[12px] bg-[#f8f8f4] object-cover"
        />
      )}
      <span className="truncate text-[14.5px] leading-[17px] font-semibold">{asset.title}</span>
      <span className="text-[12.5px] leading-[15px] text-[#575755]">{assetCaption(asset)}</span>
      <span className="inline-flex items-center gap-[6px] text-[12.5px] leading-[15px] font-medium text-[#575755]">
        <UsedIcon className="size-[13px] shrink-0 text-[#5f6b63]" />
        {usedLabel(asset)}
      </span>
      {warning ? <MediaWarningChip warning={warning} /> : null}
    </Link>
  );
};

export default MediaCard;
