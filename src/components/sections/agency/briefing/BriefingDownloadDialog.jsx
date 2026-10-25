import { useId } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { REGIONS } from '../../publicData/regionsList.js';
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from '../../publicData/share/shareButtonClasses.js';
import ShareDialogShell from '../../publicData/share/ShareDialogShell.jsx';
import ShareRadioCard from '../../publicData/share/ShareRadioCard.jsx';
import {
  BRIEFING_NOTE_MAX,
  BRIEFING_OPTIONS,
  BRIEFING_PAGES_PER_REGION,
  BRIEFING_REGIONAL_MAX,
} from './data/briefingData.js';

/*
 * BriefingDownloadDialog — Figma 11.4.4a "Download a briefing pack" (8605:404019): three radio options with a page count (This view + MoU slices ·
 * Full briefing · Regional pack), the logged cover note (n / 200) and Cancel + Download briefing pack. Shell = the Theme 8 dialog shell
 * (same 600px card, 24 radius, header / body / footer as drawn).
 * ⚠️ ASSUMPTION: "Choose up to 3 regions" has no picker drawn: picking Regional pack reveals a 16-region checkbox group (max 3), the option's
 * page estimate becomes "<n> regions · <4n> pages" and the submit button stays disabled until one region is picked.
 * Props: option, onOption(id), regions[], onToggleRegion(id), note, onNote(text), onSubmit(), onClose().
 */

const RegionPicker = ({ regions, onToggle }) => (
  <fieldset className="m-0 flex min-w-0 flex-col gap-[8px] border-0 p-0">
    <legend className="mb-[8px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
      Regions ({regions.length} / {BRIEFING_REGIONAL_MAX})
    </legend>
    <div className="flex flex-wrap gap-[8px]">
      {REGIONS.map((region) => {
        const checked = regions.includes(region.id);
        const locked = !checked && regions.length >= BRIEFING_REGIONAL_MAX;
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

const BriefingDownloadDialog = ({
  option,
  onOption,
  regions,
  onToggleRegion,
  note,
  onNote,
  onSubmit,
  onClose,
}) => {
  const noteId = useId();
  const canSubmit = option !== 'regional' || regions.length > 0;
  const detailOf = (o) =>
    o.id === 'regional' && regions.length > 0
      ? `${regions.length} ${regions.length === 1 ? 'region' : 'regions'} · ${regions.length * BRIEFING_PAGES_PER_REGION} pages`
      : o.detail;

  return (
    <ShareDialogShell
      title="Download a briefing pack"
      description="Ready for a minister’s desk: your MoU view, dated, with methodology and a data-protection note on the last page."
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
            Download briefing pack
          </Button>
        </>
      }
    >
      <fieldset className="m-0 flex min-w-0 flex-col gap-[16px] border-0 p-0">
        <legend className="sr-only">What to download</legend>
        {BRIEFING_OPTIONS.map((o) => (
          <ShareRadioCard
            key={o.id}
            name="briefing-option"
            value={o.id}
            checked={option === o.id}
            onChange={onOption}
            title={o.label}
            detail={detailOf(o)}
          />
        ))}
      </fieldset>
      {option === 'regional' ? <RegionPicker regions={regions} onToggle={onToggleRegion} /> : null}
      <div className="flex flex-col gap-[6px]">
        <label
          htmlFor={noteId}
          className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]"
        >
          Cover note (logged)
        </label>
        <div className="flex items-center gap-[8px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[12px] focus-within:border-[#387440]">
          <input
            id={noteId}
            type="text"
            value={note}
            maxLength={BRIEFING_NOTE_MAX}
            onChange={(event) => onNote(event.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[15px] leading-[18px] text-[#1c2a21] outline-none"
          />
          <span className="shrink-0 font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
            {note.length} / {BRIEFING_NOTE_MAX}
          </span>
        </div>
      </div>
    </ShareDialogShell>
  );
};

export default BriefingDownloadDialog;
