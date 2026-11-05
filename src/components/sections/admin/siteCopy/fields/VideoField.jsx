import { useEffect, useId, useState } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import FieldChip from './FieldChip.jsx';
import { LinkIcon, PlayIcon, WarningIcon } from './FieldsIcons.jsx';
import { parseVideoUrl } from './fieldsData.js';

const log = debug('VideoField');

/*
 * VideoField — a video field of the Site copy section editor (Platform Admin 7.8.10f / 10g; Figma 7.8.10f "Video field", 7.8.10g "Video link refused").
 *   label row   "Video" and the chip "YouTube or Vimeo links only"
 *   link box    46 px, r12, link icon + the pasted link (15 / 18). Valid: 2 px green ring and the player preview below. Refused: 2 px red ring, red link icon and the
 *               red line "Only YouTube or Vimeo links work here. To share a file, upload it to the media library." (no preview).
 *   preview     560 x 315 poster (r14, 25 % ink veil), a 72 px white play disc and the dark chip "YouTube · 1:42", then "Preview of how the video shows on the page."
 * Props: field (fieldsData.js SECTION_VIDEO_FIELD), value ({ url }), onChange({ url }), canEdit (false → read-only box).
 * Validation: parseVideoUrl (https links to YouTube watch / youtu.be / embed / shorts, Vimeo numbered pages). The refused message shows after the box loses focus
 * (or at once when the field opens with a refused link, 7.8.10g); an empty box shows neither message nor preview.
 * ⚠️ ASSUMPTION: no backend, so the poster is the sample picture for every valid link and the length "1:42" is only known for the sample link (other links show
 * just "YouTube" / "Vimeo"); the play disc is part of the picture, not a control (no playback in the editor); an empty box shows the placeholder "https://" (not drawn).
 */
const VideoField = ({ field, value, onChange, canEdit = true }) => {
  const inputId = useId();
  const errorId = useId();
  const url = value?.url ?? '';
  const parsed = parseVideoUrl(url);
  const [touched, setTouched] = useState(() => Boolean(url) && !parseVideoUrl(url));
  const refused = Boolean(url.trim()) && !parsed && touched;
  const isSample = parsed && url.trim() === field.sampleUrl;
  const providerName = parsed?.provider === 'vimeo' ? 'Vimeo' : 'YouTube';
  const chip = isSample ? `${providerName} · ${field.sampleDuration}` : providerName;

  useEffect(() => {
    log('mount', { field: field.id, url, valid: Boolean(parsed), refused });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    log('state', { valid: Boolean(parsed), refused, provider: parsed?.provider ?? null });
  }, [parsed, refused]);

  return (
    <div className="flex min-w-0 flex-col gap-[10px]" data-field={field.id}>
      <div className="flex min-h-[32px] flex-wrap items-center gap-x-[8px] gap-y-[6px]">
        <label
          htmlFor={inputId}
          className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
        >
          {field.label}
        </label>
        <span className="flex-1" />
        <FieldChip tone="neutral">{field.hint}</FieldChip>
      </div>

      <div
        className={classNames(
          'flex min-h-[46px] items-center gap-[10px] rounded-[12px] bg-white px-[14px] py-[12px]',
          refused
            ? 'border-2 border-solid border-[#c0392b]'
            : parsed
              ? 'border-2 border-solid border-[#387440]'
              : 'border border-solid border-[#e7e7e7] focus-within:border-2 focus-within:border-[#387440]'
        )}
      >
        <LinkIcon
          className={classNames(
            'size-[16px] shrink-0',
            refused ? 'text-[#b42318]' : 'text-[#27522e]'
          )}
        />
        <input
          id={inputId}
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          value={url}
          readOnly={!canEdit}
          placeholder="https://"
          aria-invalid={refused}
          aria-describedby={refused ? errorId : undefined}
          onChange={(e) => {
            log('typing', { length: e.target.value.length });
            onChange?.({ url: e.target.value });
          }}
          onBlur={() => setTouched(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setTouched(true);
          }}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[15px] leading-[18px] text-[#1c2a21] outline-none placeholder:text-[#575755]"
        />
      </div>

      {refused ? (
        <p
          id={errorId}
          role="alert"
          className="m-0 flex items-start gap-[6px] font-sans text-[13px] leading-[16px] font-semibold text-[#c0392b]"
        >
          <WarningIcon className="mt-[1px] size-[14px] shrink-0 text-[#b42318]" />
          {field.refused}
        </p>
      ) : null}

      {parsed ? (
        <>
          <div className="relative aspect-video w-[min(560px,100%)] overflow-hidden rounded-[14px] bg-[#1c2a21]">
            <img
              src={field.samplePoster}
              alt={`Preview of the ${providerName} video`}
              className="absolute inset-0 size-full object-cover"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-[#1c2a21]/25" />
            <FieldChip tone="dark" className="absolute top-[14px] left-[14px]">
              {chip}
            </FieldChip>
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 flex size-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1c2a21]"
            >
              <PlayIcon className="ml-[4px] h-[24px] w-[21px]" />
            </span>
          </div>
          <p className="m-0 font-sans text-[12.5px] leading-[15px] text-[#575755]">
            {field.previewNote}
          </p>
        </>
      ) : null}
    </div>
  );
};

export default VideoField;
