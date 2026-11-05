import { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import AgencyDialog from '../../../agency/onboarding/AgencyDialog.jsx';
import MediaButton from './MediaButton.jsx';
import { MediaDrawerCloseIcon, MediaFile36Icon, MediaLink14Icon } from './MediaIcons.jsx';
import { formatBytes, formatShortDate, usedCount } from './mediaLibraryModel.js';

const log = debug('MediaDetailDrawer');

/*
 * MediaDetailDrawer — "Media detail" (Figma 7.8.9e): a 560 drawer from the right over a 55 % scrim, p28, gap16: title 20/24 600 + 34 round close, preview
 * 504 x 252 (r14), meta chips ("1200 × 600", "96 KB", "PNG", "Served as WebP / AVIF"), Title and Description (alt text) fields, "USED ON 3 SECTIONS" with one
 * link per section (to its editor section), "REPLACEMENTS" history lines (newest first) and the Archive / "Replace file" buttons pinned at the bottom.
 * Title / description save when the field loses focus (⚠️ ASSUMPTION: no save button is drawn). Without the media permission the fields are read-only and the
 * two buttons are not drawn. Figma flaw not copied: the Title / Description blocks are drawn 206 px tall (a fixed frame height) leaving a ~140 px hole; the
 * fields here sit 16 px apart. The "Archive" button keeps the drawn 8 px side padding. Documents show a file tile, "N pages" and no alt text field.
 * Props: asset, canEdit, hrefFor(use), onClose, onSaveField(patch), onReplace, onArchive.
 */
const Chip = ({ children }) => (
  <span className="inline-flex min-h-[32px] items-center rounded-full bg-[#f8f8f4] px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#575755]">
    {children}
  </span>
);

const Field = ({ label, value, onChange, onCommit, readOnly }) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-[8px]">
      <label
        htmlFor={id}
        className="text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onCommit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
        }}
        className="w-full rounded-[10px] border border-solid border-[#cccccc] bg-white px-[16px] py-[13px] pl-[20px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2px_11px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.04)] outline-none read-only:bg-[#f8f8f4] focus:border-[#387440] focus:outline-2 focus:outline-offset-0 focus:outline-[#387440]/30"
      />
    </div>
  );
};

const SectionLabel = ({ children }) => (
  <h3 className="m-0 font-sans text-[12px] leading-[14px] font-bold tracking-[0.48px] text-[#575755] uppercase">
    {children}
  </h3>
);

const historyLine = (h) =>
  `v${h.v} · ${h.kind === 'replaced' ? 'replaced' : 'uploaded'} by ${h.by} · ${formatShortDate(h.at)}${h.note ? ` · ${h.note}` : ''}`;

const MediaDetailDrawer = ({
  asset,
  canEdit,
  hrefFor,
  onClose,
  onSaveField,
  onReplace,
  onArchive,
}) => {
  const [title, setTitle] = useState(asset.title);
  const [alt, setAlt] = useState(asset.alt ?? '');
  const isDoc = asset.kind === 'document';
  const n = usedCount(asset);

  useEffect(() => {
    log('open', { id: asset.id, used: n, canEdit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset.id]);

  useEffect(() => {
    setTitle(asset.title);
    setAlt(asset.alt ?? '');
  }, [asset.id, asset.title, asset.alt]);

  const commit = (key, value, current) => {
    if (!canEdit || value === current) return;
    log('field saved', key);
    onSaveField({ [key]: value.trim() });
  };

  return (
    <AgencyDialog
      label={`${asset.title}, media detail`}
      onClose={onClose}
      scrimClassName="bg-[#1c2a21]/55"
      panelClassName="fixed! inset-y-0 right-0 my-0! w-full sm:w-[560px]"
    >
      <aside className="flex h-full w-full flex-col gap-[16px] overflow-y-auto bg-white p-[clamp(16px,4vw,28px)] font-sans text-[#1c2a21] shadow-[-8px_0_32px_rgba(0,0,0,0.16)]">
        <div className="flex items-center gap-[10px]">
          <h2
            tabIndex={-1}
            data-autofocus
            className="m-0 min-w-0 flex-1 outline-none text-[20px] leading-[24px] font-semibold text-[#1c2a21]"
          >
            {asset.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-[34px] shrink-0 cursor-pointer place-items-center rounded-full border border-solid border-[#e7e7e7] bg-white p-0 text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <MediaDrawerCloseIcon className="size-[16px]" />
          </button>
        </div>
        {isDoc ? (
          <div className="grid aspect-[2/1] w-full place-items-center rounded-[14px] bg-[#f8f8f4] text-[#5f6b63]">
            <MediaFile36Icon className="size-[48px]" />
          </div>
        ) : (
          <img
            src={asset.src}
            alt={asset.alt || ''}
            className="block aspect-[2/1] w-full rounded-[14px] bg-[#f8f8f4] object-cover"
          />
        )}
        <div className="flex flex-wrap gap-[8px]">
          {isDoc ? (
            <Chip>{asset.pages} pages</Chip>
          ) : (
            <Chip>{`${asset.width} × ${asset.height}`}</Chip>
          )}
          <Chip>{formatBytes(asset.bytes)}</Chip>
          <Chip>{asset.format}</Chip>
          {isDoc ? null : <Chip>Served as WebP / AVIF</Chip>}
        </div>
        <Field
          label="Title"
          value={title}
          onChange={setTitle}
          onCommit={() => commit('title', title, asset.title)}
          readOnly={!canEdit}
        />
        {isDoc ? null : (
          <Field
            label="Description (alt text)"
            value={alt}
            onChange={setAlt}
            onCommit={() => commit('alt', alt, asset.alt ?? '')}
            readOnly={!canEdit}
          />
        )}
        <div className="flex flex-col gap-[8px]">
          <SectionLabel>
            {n === 0
              ? 'Not used on any section'
              : `Used on ${n} ${n === 1 ? 'section' : 'sections'}`}
          </SectionLabel>
          {asset.usedIn.map((u) => (
            <Link
              key={u.sectionId}
              to={hrefFor(u)}
              className="flex min-h-[36px] items-center gap-[8px] rounded-[10px] bg-[#f8f8f4] p-[10px] text-[13.5px] leading-[16px] font-semibold text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <MediaLink14Icon className="size-[14px] shrink-0" />
              {u.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-[6px]">
          <SectionLabel>Replacements</SectionLabel>
          {asset.history.map((h) => (
            <p key={h.v} className="m-0 text-[13px] leading-[16px] text-[#1c2a21]">
              {historyLine(h)}
            </p>
          ))}
        </div>
        {canEdit ? (
          <div className="mt-auto flex flex-wrap gap-[12px] pt-[16px]">
            <MediaButton variant="secondary" className="px-[8px]!" onClick={onArchive}>
              Archive
            </MediaButton>
            <MediaButton className="px-[30px]!" onClick={onReplace}>
              Replace file
            </MediaButton>
          </div>
        ) : null}
      </aside>
    </AgencyDialog>
  );
};

export default MediaDetailDrawer;
