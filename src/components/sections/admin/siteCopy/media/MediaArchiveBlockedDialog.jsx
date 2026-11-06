import { Link } from 'react-router-dom';
import MediaButton from './MediaButton.jsx';
import MediaDialogShell from './MediaDialogShell.jsx';
import { MediaArchive21Icon, MediaLink14Icon } from './MediaIcons.jsx';
import { lastPart } from './mediaLibraryModel.js';

/*
 * MediaArchiveBlockedDialog — "This image is still in use" (Figma 7.8.9g, 520 modal, amber #faf4e8 tile): "This image is used on 1 section. Replace it there
 * first, then you can archive it.", one pill link per section ("Public site › Home › Hero", #f8f8f4, r12, 14/600 #387440) and Close / "Open the Hero section".
 * ⚠️ ASSUMPTION: several sections read "…used on 3 sections. Replace it in each one first, then you can archive it." and the button opens the first one;
 * a document says "This file is still in use". Props: noun ('image' | 'file' | 'logo'), uses [{ sectionId, label }], hrefFor(use), onClose.
 */
const MediaArchiveBlockedDialog = ({ noun, uses, hrefFor, onClose }) => {
  const first = uses[0];
  const n = uses.length;
  return (
    <MediaDialogShell
      title={`This ${noun} is still in use`}
      icon={<MediaArchive21Icon className="size-[21px] text-[#463409]" />}
      tone="amber"
      width={520}
      onClose={onClose}
    >
      <p className="m-0 text-[15px] leading-[22px] text-[#575755]">
        {n === 1
          ? `This ${noun} is used on 1 section. Replace it there first, then you can archive it.`
          : `This ${noun} is used on ${n} sections. Replace it in each one first, then you can archive it.`}
      </p>
      <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
        {uses.map((u) => (
          <li key={u.sectionId}>
            <Link
              to={hrefFor(u)}
              className="inline-flex min-h-[41px] items-center gap-[8px] rounded-[12px] bg-[#f8f8f4] p-[12px] font-sans text-[14px] leading-[17px] font-semibold text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <MediaLink14Icon className="size-[14px] shrink-0" />
              {u.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex gap-[12px] max-sm:flex-col-reverse">
        <MediaButton variant="secondary" className="flex-1" onClick={onClose}>
          Close
        </MediaButton>
        <MediaButton className="flex-1" to={hrefFor(first)}>
          Open the {lastPart(first.label)} section
        </MediaButton>
      </div>
    </MediaDialogShell>
  );
};

export default MediaArchiveBlockedDialog;
