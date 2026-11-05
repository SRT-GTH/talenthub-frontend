import { useId, useState } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import MediaButton from './MediaButton.jsx';
import MediaCheckRow from './MediaCheckRow.jsx';
import MediaDialogShell from './MediaDialogShell.jsx';
import { MediaEditIcon, MediaFile36Icon, MediaWarning14Icon } from './MediaIcons.jsx';
import { HERO_MIN_WIDTH } from './mediaLibraryData.js';
import { formatBytes } from './mediaLibraryModel.js';

const log = debug('MediaDescribeDialog');

/*
 * MediaDescribeDialog — "Describe this image" (Figma 7.8.9c, validation 7.8.9k): file preview 180 x 120 + name + "2400 × 1600 · 3.0 MB · big enough for hero
 * sections", Title, "Description (alt text)" with a live "n / 200" counter, the help line, three ticks (Decorative image · Shows identifiable people ·
 * Consent confirmed) and Cancel / "Save to library". Validation (on Save, then live):
 *   alt shorter than 5 characters and not decorative → "Use at least 5 characters, or tick “Decorative image”." (red box 2px #c0392b, counter red)
 *   shows identifiable people without consent       → "Confirm consent, or untick “Shows identifiable people”."
 * The consent hint reads "…under 18 (Data Protection Act, 2012)." normally and "…under 18." while the consent error shows (the two wordings Figma draws).
 * ⚠️ ASSUMPTION: "Consent confirmed" only appears once "Shows identifiable people" is ticked; a document (PDF) is described by its title only
 * ("Describe this file"); the title falls back to the file name when left empty; the preview of a freshly picked small image says "too small for hero sections".
 * Props: item (queue item), initialErrors (open with the validation already showing, ?modal=describe), onSave(values), onCancel, onClose.
 */
const ALT_MAX = 200;
const ALT_MIN = 5;

const fieldClass =
  'w-full rounded-[10px] border border-solid border-[#cccccc] bg-white px-[16px] py-[13px] pl-[20px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2px_11px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.04)] outline-none focus:border-[#387440] focus:outline-2 focus:outline-offset-0 focus:outline-[#387440]/30';

const FieldError = ({ id, children }) => (
  <p
    id={id}
    role="alert"
    className="m-0 flex items-center gap-[6px] text-[13px] leading-[16px] font-semibold text-[#c0392b]"
  >
    <MediaWarning14Icon className="size-[14px] shrink-0" />
    {children}
  </p>
);

const MediaDescribeDialog = ({ item, initialErrors = false, onSave, onCancel, onClose }) => {
  const isDoc = item.kind === 'document';
  const [title, setTitle] = useState(item.title ?? '');
  const [alt, setAlt] = useState(item.alt ?? '');
  const [decorative, setDecorative] = useState(Boolean(item.decorative));
  const [people, setPeople] = useState(Boolean(item.people));
  const [consent, setConsent] = useState(Boolean(item.consent));
  const [submitted, setSubmitted] = useState(initialErrors);
  const altId = useId();
  const titleId = useId();

  const altError = !isDoc && !decorative && alt.trim().length < ALT_MIN;
  const consentError = !isDoc && people && !consent;
  const showAltError = submitted && altError;
  const showConsentError = submitted && consentError;
  const bigEnough = (item.width ?? 0) >= HERO_MIN_WIDTH;

  const save = () => {
    setSubmitted(true);
    log('save', { altError, consentError, decorative, people, consent });
    if (altError || consentError) return;
    onSave({
      title: title.trim() || String(item.name ?? '').replace(/\.[a-z0-9]+$/i, ''),
      alt: decorative || isDoc ? '' : alt.trim(),
      decorative: !isDoc && decorative,
      people: !isDoc && people,
      consent: !isDoc && people && consent,
    });
  };

  return (
    <MediaDialogShell
      title={isDoc ? 'Describe this file' : 'Describe this image'}
      icon={<MediaEditIcon className="size-[21px]" />}
      width={640}
      focusTitle={false}
      onClose={onClose}
    >
      <div className="flex gap-[16px] max-sm:flex-col">
        {isDoc ? (
          <span className="grid h-[120px] w-[180px] shrink-0 place-items-center rounded-[12px] bg-[#f8f8f4] text-[#5f6b63] max-sm:w-full">
            <MediaFile36Icon className="size-[36px]" />
          </span>
        ) : (
          <img
            src={item.src}
            alt=""
            className="h-[120px] w-[180px] shrink-0 rounded-[12px] bg-[#f8f8f4] object-cover max-sm:w-full"
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
          <span className="truncate text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
            {item.name}
          </span>
          <span className="text-[12.5px] leading-[15px] text-[#575755]">
            {isDoc
              ? `PDF · ${item.pages} pages · ${formatBytes(item.bytes)}`
              : `${item.width} × ${item.height} · ${formatBytes(item.bytes)} · ${bigEnough ? 'big enough' : 'too small'} for hero sections`}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        <label
          htmlFor={titleId}
          className="text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
        >
          Title
        </label>
        <input
          id={titleId}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={fieldClass}
          data-autofocus={isDoc || undefined}
        />
      </div>

      {isDoc ? null : (
        <>
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center gap-[8px]">
              <label
                htmlFor={altId}
                className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
              >
                Description (alt text)
              </label>
              <span className="grow" />
              <span
                aria-live="polite"
                className={classNames(
                  'text-[12.5px] leading-[15px] font-semibold',
                  showAltError ? 'text-[#c0392b]' : 'text-[#575755]'
                )}
              >
                {alt.length} / {ALT_MAX}
              </span>
            </div>
            <textarea
              id={altId}
              rows={1}
              value={alt}
              maxLength={ALT_MAX}
              disabled={decorative}
              onChange={(e) => setAlt(e.target.value)}
              aria-invalid={showAltError || undefined}
              aria-describedby={`${altId}-help`}
              data-autofocus
              className={classNames(
                'block min-h-[46px] w-full resize-none rounded-[12px] border-2 border-solid bg-white px-[14px] py-[12px] font-sans text-[15px] leading-[18px] text-[#1c2a21] outline-none [field-sizing:content] disabled:bg-[#f8f8f4] disabled:text-[#575755]',
                showAltError ? 'border-[#c0392b]' : 'border-[#387440]'
              )}
            />
            {showAltError ? (
              <FieldError id={`${altId}-help`}>
                Use at least 5 characters, or tick “Decorative image”.
              </FieldError>
            ) : (
              <p id={`${altId}-help`} className="m-0 text-[12.5px] leading-[15px] text-[#575755]">
                Screen readers read this out, and it shows if the image fails to load.
              </p>
            )}
          </div>
          <MediaCheckRow
            label="Decorative image"
            hint="Only for patterns or shapes that carry no meaning."
            checked={decorative}
            onChange={setDecorative}
          />
          <MediaCheckRow
            label="Shows identifiable people"
            hint="Faces or names someone could recognise."
            checked={people}
            onChange={(v) => {
              setPeople(v);
              if (!v) setConsent(false);
            }}
          />
          {people ? (
            <>
              <MediaCheckRow
                label="Consent confirmed"
                hint={
                  showConsentError
                    ? 'Everyone shown agreed, and a parent or guardian for anyone under 18.'
                    : 'Everyone shown agreed, and a parent or guardian for anyone under 18 (Data Protection Act, 2012).'
                }
                checked={consent}
                onChange={setConsent}
              />
              {showConsentError ? (
                <FieldError>Confirm consent, or untick “Shows identifiable people”.</FieldError>
              ) : null}
            </>
          ) : null}
        </>
      )}

      <div className="flex gap-[12px] max-sm:flex-col-reverse">
        <MediaButton variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </MediaButton>
        <MediaButton className="flex-1" onClick={save}>
          Save to library
        </MediaButton>
      </div>
    </MediaDialogShell>
  );
};

export default MediaDescribeDialog;
