import { useState } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import EditorButton from './EditorButton.jsx';
import EditorPopover from './EditorPopover.jsx';
import { EditorWarningIcon } from './EditorIcons.jsx';
import { isValidLink, LINK_ERROR } from './richText.js';

const log = debug('LinkPopover');

/*
 * LinkPopover — "Add a link" (frames 7.8.2d / 2e): title 17/600, the four kinds as pills (Web address · Page on GTH · Email · Phone; the chosen
 * one #1c2a21 with white text), "Link text" + the address field (GTH input 51 high, r10, #ccc; refused = #b42318 2 px with the warning line
 * "Links must start with https://, mailto:, tel: or a page on GTH like /pricing"), then Cancel / Add link. A link that does not start with
 * https://, mailto:, tel: or / is refused and nothing is added.
 * ⚠️ ASSUMPTION: Page on GTH / Email / Phone label the address field with their own name, add "/" · "mailto:" · "tel:" when missing, and share the
 * one drawn hint and refusal line (only the Web address state is drawn). The pills stay while the refusal shows (frame 7.8.2e omits them).
 * Props: pos, initialText, initialUrl, initialError, onCancel, onAdd({ text, url }).
 */
const KINDS = [
  { id: 'web', label: 'Web address' },
  { id: 'page', label: 'Page on GTH' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
];

const normalise = (kind, raw) => {
  const v = raw.trim();
  if (!v) return v;
  if (kind === 'page') return v.startsWith('/') ? v : `/${v}`;
  if (kind === 'email') return /^mailto:/i.test(v) ? v : `mailto:${v}`;
  if (kind === 'phone') return /^tel:/i.test(v) ? v : `tel:${v.replace(/\s+/g, '')}`;
  return v;
};

const Input = ({ id, label, value, onChange, error, autoFocus, describedBy }) => (
  <div className="flex flex-col gap-[8px]">
    <label
      htmlFor={id}
      className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
    >
      {label}
    </label>
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-autofocus={autoFocus ? '' : undefined}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={describedBy}
      autoComplete="off"
      className={classNames(
        'block h-[51px] w-full rounded-[10px] border border-solid bg-white px-[20px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21] shadow-[0_2px_11px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.05)] outline-none focus-visible:border-[#387440]',
        error ? 'border-[#b42318] shadow-[inset_0_0_0_1px_#b42318]' : 'border-[#ccc]'
      )}
    />
  </div>
);

const LinkPopover = ({ pos, initialText = '', initialUrl = '', initialError, onCancel, onAdd }) => {
  const [kind, setKind] = useState('web');
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState(Boolean(initialError));
  const kindLabel = KINDS.find((k) => k.id === kind).label;

  const submit = (e) => {
    e?.preventDefault();
    const href = normalise(kind, url);
    if (!isValidLink(href) || (kind === 'email' && !/^mailto:[^\s@]+@[^\s@]+$/i.test(href))) {
      log('link refused', { kind, url });
      setError(true);
      return;
    }
    log('link added', { kind, href });
    onAdd({ text: text.trim() || href, url: href });
  };

  return (
    <EditorPopover label="Add a link" pos={pos} width={420} onClose={onCancel}>
      <form onSubmit={submit} className="flex flex-col gap-[12px] p-[20px]" noValidate>
        <h3 className="m-0 font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
          Add a link
        </h3>
        <div role="group" aria-label="Kind of link" className="flex flex-wrap gap-[6px]">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              aria-pressed={kind === k.id}
              onClick={() => {
                log('link kind', k.id);
                setKind(k.id);
                setError(false);
              }}
              className={classNames(
                'min-h-[33px] cursor-pointer rounded-full border border-solid px-[13px] py-[8px] font-sans text-[14px] leading-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                kind === k.id
                  ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                  : 'border-[#1c2a21]/10 bg-white text-[#1c2a21]'
              )}
            >
              {k.label}
            </button>
          ))}
        </div>
        <Input id="link-text" label="Link text" value={text} onChange={setText} />
        <Input
          id="link-url"
          label={kindLabel}
          value={url}
          onChange={(v) => {
            setUrl(v);
            setError(false);
          }}
          error={error}
          autoFocus
          describedBy="link-url-note"
        />
        {error ? (
          <p
            id="link-url-note"
            role="alert"
            className="m-0 flex items-start gap-[6px] font-sans text-[13px] leading-[18px] font-semibold text-[#c0392b]"
          >
            <EditorWarningIcon className="mt-[2px] size-[14px] shrink-0 text-[#b42318]" />
            {LINK_ERROR}
          </p>
        ) : (
          <p
            id="link-url-note"
            className="m-0 font-sans text-[12.5px] leading-[15px] text-[#575755] max-lg:text-[12px]"
          >
            Starts with https://, mailto:, tel: or a page like /pricing
          </p>
        )}
        <div className="flex flex-wrap gap-[10px]">
          <EditorButton onClick={onCancel}>Cancel</EditorButton>
          <EditorButton variant="primary" type="submit">
            Add link
          </EditorButton>
        </div>
      </form>
    </EditorPopover>
  );
};

export default LinkPopover;
