import { useId } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from './shareButtonClasses.js';
import { REGIONS } from '../regionsList.js';
import ShareDialogShell from './ShareDialogShell.jsx';
import ShareRadioCard from './ShareRadioCard.jsx';
import { DOWNLOAD_NOTE_MAX, DOWNLOAD_OPTIONS, DOWNLOAD_REGIONAL_MAX } from './data/shareData.js';

/*
 * DownloadChooseDialog — Figma 8.8.1a "Download a PDF snapshot" (8504:221, dialog) and 8.8.1 · Mobile · Download sheet (8515:2637, sheet).
 * Three radio options (This view · Full snapshot · Regional pack), a cover note (0 / 200) on the dialog, Cancel + Download PDF.
 * Props: viewDetail (e.g. "National snapshot · 4 pages"), option, onOption(id), regions[], onToggleRegion(id), note, onNote(text),
 *        onSubmit(), onClose(), sheet (draw the phone bottom sheet instead of the dialog).
 * ⚠️ ASSUMPTION: Figma draws "Choose up to 3 regions" but not the picker; picking Regional pack reveals a 16-region checkbox group (max 3) and
 *   Download PDF stays disabled until one region is picked. The phone sheet has no cover-note field (not drawn).
 */

const RegionPicker = ({ regions, onToggle }) => (
  <fieldset className="m-0 flex min-w-0 flex-col gap-[8px] border-0 p-0">
    <legend className="mb-[8px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
      Regions ({regions.length} / {DOWNLOAD_REGIONAL_MAX})
    </legend>
    <div className="flex flex-wrap gap-[8px]">
      {REGIONS.map((region) => {
        const checked = regions.includes(region.id);
        const locked = !checked && regions.length >= DOWNLOAD_REGIONAL_MAX;
        return (
          <label
            key={region.id}
            className={classNames(
              'inline-flex min-h-[32px] cursor-pointer items-center rounded-full border border-solid px-[12px] font-sans text-[13px] leading-[16px] font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#387440]',
              checked
                ? 'border-[#387440] bg-[#ebf1ec] text-[#2a5730]'
                : 'border-[#e7e7e7] bg-white text-[#1c2a21]',
              locked && 'cursor-not-allowed opacity-50'
            )}
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={locked}
              onChange={() => onToggle(region.id)}
              className="sr-only"
            />
            {region.name}
          </label>
        );
      })}
    </div>
  </fieldset>
);

const DownloadChooseDialog = ({
  viewDetail,
  option,
  onOption,
  regions,
  onToggleRegion,
  note,
  onNote,
  onSubmit,
  onClose,
  sheet = false,
}) => {
  const noteId = useId();
  const canSubmit = option !== 'regional' || regions.length > 0;
  const options = DOWNLOAD_OPTIONS.map((o) => ({
    ...o,
    detail: o.id === 'view' ? viewDetail : o.detail,
  }));

  if (sheet) {
    return (
      <ShareDialogShell
        variant="sheet"
        title="Download PDF"
        description="Presentation-ready, with methodology on the last page."
        onClose={onClose}
      >
        <fieldset className="m-0 flex min-w-0 flex-col gap-[14px] border-0 p-0">
          <legend className="sr-only">What to download</legend>
          {options.map((o) => (
            <ShareRadioCard
              key={o.id}
              name="download-option"
              value={o.id}
              checked={option === o.id}
              onChange={onOption}
              title={o.label}
              detail={o.sheet}
              compact
            />
          ))}
        </fieldset>
        {option === 'regional' ? (
          <RegionPicker regions={regions} onToggle={onToggleRegion} />
        ) : null}
        <Button
          type="button"
          variant="primary"
          size="sm"
          className={PRIMARY_BUTTON}
          disabled={!canSubmit}
          onClick={onSubmit}
          className={classNames(PRIMARY_BUTTON, 'w-full')}
        >
          Download PDF
        </Button>
      </ShareDialogShell>
    );
  }

  return (
    <ShareDialogShell
      title="Download a PDF snapshot"
      description="Branded, presentation-ready, with the date and our methodology on the last page."
      onClose={onClose}
      width={600}
      footer={
        <>
          <Button
            type="button"
            variant="tertiary"
            size="md"
            onClick={onClose}
            className={TERTIARY_BUTTON}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className={PRIMARY_BUTTON}
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            Download PDF
          </Button>
        </>
      }
    >
      <fieldset className="m-0 flex min-w-0 flex-col gap-[16px] border-0 p-0">
        <legend className="sr-only">What to download</legend>
        {options.map((o) => (
          <ShareRadioCard
            key={o.id}
            name="download-option"
            value={o.id}
            checked={option === o.id}
            onChange={onOption}
            title={o.label}
            detail={o.detail}
          />
        ))}
      </fieldset>
      {option === 'regional' ? <RegionPicker regions={regions} onToggle={onToggleRegion} /> : null}
      <div className="flex flex-col gap-[6px]">
        <label
          htmlFor={noteId}
          className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]"
        >
          Add a note to the cover (optional)
        </label>
        <div className="flex items-center gap-[8px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[12px] focus-within:border-[#387440]">
          <input
            id={noteId}
            type="text"
            value={note}
            maxLength={DOWNLOAD_NOTE_MAX}
            onChange={(event) => onNote(event.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[15px] leading-[18px] text-[#1c2a21] outline-none"
          />
          <span className="shrink-0 font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
            {note.length} / {DOWNLOAD_NOTE_MAX}
          </span>
        </div>
      </div>
    </ShareDialogShell>
  );
};

export default DownloadChooseDialog;
