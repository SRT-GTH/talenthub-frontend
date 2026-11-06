import { useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import InstitutionAccredDocCard from './InstitutionAccredDocCard.jsx';
import { ACCREDITATION as U } from './data/institutionOnboardingData.js';
import { PlusIcon } from './institutionOnboardingIcons.jsx';

const log = debug('InstitutionAccredList');

/*
 * InstitutionAccredList — "Your documents" (Figma 11.1.2a2 8589:2700): title + "n of 4 documents" chip, the review banner, one card per required document
 * (GES accreditation licence, Head’s Ghana Card, Letter on letterhead, Ministry of Education registration) and any other uploads, and the two dashed
 * actions "Upload …" (the next missing file, then "another document") / "Enter details manually" (the next document without its details).
 * Live: GET /api/institution/accreditation (services/institutionAccreditation.service.js). The pencil opens the typed details (licence number, dates,
 * the head's name and title) with "Replace file" and "Remove"; "View file" downloads the private file. Nothing can change while it is in review.
 * Props: view (the API response), busy, canEdit (institution admin), onUpload(kind, file), onSaveDetails(kind, details), onRemove(doc), onOpen(doc), error.
 */

const DASHED =
  'inline-flex min-h-[56px] flex-1 items-center justify-center gap-[8px] rounded-[16px] border-[1.5px] border-dashed border-[#387440] bg-[#ebf1ec]/60 px-[16px] font-sans text-[15px] leading-[18px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:opacity-50';
const INPUT =
  'min-h-[44px] w-full rounded-[10px] border border-solid border-[#1c2a21]/20 bg-white px-[12px] font-sans text-[15px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]';
const SMALL_BTN =
  'inline-flex min-h-[40px] items-center rounded-[10px] border border-solid px-[14px] font-sans text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:opacity-50';

const UPLOAD_LABEL = {
  licence: 'Upload the GES licence',
  headId: 'Upload the head’s Ghana Card',
  letter: 'Upload the letter on letterhead',
  registration: 'Upload the Ministry registration',
};
const kb = (n) =>
  n >= 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(n / 1024))} KB`;
const day = (d) =>
  d
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(d)
      )
    : '';
const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const okFile = (file) => /\.(pdf|jpe?g|png)$/i.test(file.name) && file.size <= 10 * 1024 * 1024;

/** The meta line of a document: its file, then its typed details. */
const metaOf = (kind, doc) => {
  if (!doc) return ['PDF, JPG or PNG up to 10 MB'];
  const d = doc.details || {};
  const out = [];
  if (doc.hasFile) out.push(`${doc.fileName} · ${kb(doc.size)} · ${day(doc.uploadedAt)}`);
  else out.push('No file yet');
  if (d.number) out.push(d.number);
  if (d.holder) out.push([d.holder, d.role].filter(Boolean).join(' · '));
  if (d.signedBy) out.push(`Signed by ${d.signedBy}`);
  if (d.issuedAt) out.push(`Issued ${day(d.issuedAt)}`);
  if (d.expiresAt) out.push(`Expires ${day(d.expiresAt)}`);
  if (d.note) out.push(d.note);
  return out;
};

const DetailsForm = ({ kind, doc, busy, onSave, onCancel, onReplace, onRemove }) => {
  const fields = U.list.fields[kind] || [];
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.key, (doc?.details || {})[f.key] || '']))
  );
  const [error, setError] = useState('');
  const save = (e) => {
    e.preventDefault();
    const missing = fields.find((f) => f.required && !String(values[f.key] || '').trim());
    if (missing) {
      setError(`Add the ${missing.label.toLowerCase()}.`);
      return;
    }
    setError('');
    onSave(values);
  };
  return (
    <form
      onSubmit={save}
      className="flex flex-col gap-[12px] rounded-[14px] bg-[#f8f8f4] p-[14px]"
      aria-label="Document details"
    >
      <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
        {fields.map((f) => (
          <label
            key={f.key}
            className="flex flex-col gap-[4px] font-sans text-[13px] font-semibold text-[#1c2a21]"
          >
            {f.label}
            <input
              type={f.type || 'text'}
              value={values[f.key]}
              placeholder={f.placeholder}
              required={f.required}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              className={INPUT}
            />
          </label>
        ))}
      </div>
      <p role="alert" className="m-0 font-sans text-[13px] text-danger empty:hidden">
        {error}
      </p>
      <div className="flex flex-wrap gap-[8px]">
        <button
          type="submit"
          disabled={busy}
          className={`${SMALL_BTN} border-[#2a5730] bg-[#387440] text-white`}
        >
          {busy ? 'Saving…' : 'Save details'}
        </button>
        {onReplace ? (
          <button
            type="button"
            disabled={busy}
            onClick={onReplace}
            className={`${SMALL_BTN} border-[#c1d4c4] bg-[#e1eae2] text-[#165d3a]`}
          >
            {doc?.hasFile ? 'Replace file' : 'Upload file'}
          </button>
        ) : null}
        {doc && onRemove ? (
          <button
            type="button"
            disabled={busy}
            onClick={onRemove}
            className={`${SMALL_BTN} border-[#e6c1bb] bg-white text-[#a03a2c]`}
          >
            Remove
          </button>
        ) : null}
        <button
          type="button"
          onClick={onCancel}
          className={`${SMALL_BTN} border-[#1c2a21]/10 bg-white text-[#1c2a21]`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const InstitutionAccredList = ({
  view,
  busy,
  canEdit,
  onUpload,
  onSaveDetails,
  onRemove,
  onOpen,
  error,
}) => {
  const fileRef = useRef(null);
  const target = useRef('other');
  const [editing, setEditing] = useState(null);
  const [pickError, setPickError] = useState(null);
  const locked = view.inReview || !canEdit;
  const slots = [
    ...view.required,
    ...view.others.map((d) => ({ kind: 'other', title: d.title, file: true, doc: d, key: d.id })),
  ];
  const nextFile = view.required.find((r) => r.file && r.missing);
  const nextDetails =
    view.required.find((r) => r.missing && !r.file) ||
    view.required.find((r) => r.file && r.doc && !Object.keys(r.doc.details || {}).length) ||
    view.required[0];
  const review = view.review;

  const pick = (kind) => {
    target.current = kind;
    fileRef.current?.click();
  };
  const take = (file) => {
    if (!file) return;
    if (!okFile(file)) {
      setPickError('Use a PDF, JPG or PNG up to 10 MB.');
      return;
    }
    setPickError(null);
    log('upload', { kind: target.current, name: file.name });
    onUpload(target.current, file);
  };

  return (
    <section aria-labelledby="accred-docs" className="flex flex-col gap-[16px]">
      <div className="flex flex-wrap items-center gap-[12px]">
        <h2
          id="accred-docs"
          className="m-0 font-sans text-[28px] leading-[34px] font-semibold text-[#1c2a21]"
        >
          {U.list.title}
        </h2>
        <span className="inline-flex rounded-full border border-solid border-[#1c2a21]/10 bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-semibold text-[#595959]">
          {view.done} of {view.total} documents
        </span>
      </div>
      {review && U.list.review[review.status] ? (
        <p
          role="status"
          className={`m-0 rounded-[14px] border border-solid px-[14px] py-[12px] font-sans text-[14px] leading-[20px] ${
            review.status === 'approved'
              ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#165d3a]'
              : review.status === 'under-review'
                ? 'border-[#1c2a21]/10 bg-white text-[#1c2a21]'
                : 'border-[#ecd9a3] bg-[#faf4e8] text-[#785910]'
          }`}
        >
          {fill(U.list.review[review.status], {
            date: day(review.status === 'under-review' ? review.submittedAt : review.decidedAt),
            note: review.note,
          })}
        </p>
      ) : null}
      {!canEdit ? (
        <p className="m-0 font-sans text-[14px] text-[#595959]">
          Only your institution’s admin can upload or change accreditation documents.
        </p>
      ) : null}
      <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
        {slots.map((s) => {
          const key = s.key || s.kind;
          const st = U.list.status[s.doc ? s.doc.status : 'none'] || U.list.status.none;
          const isEditing = editing === key;
          return (
            <InstitutionAccredDocCard
              key={key}
              title={s.title}
              status={st.label}
              tone={st.tone}
              meta={metaOf(s.kind, s.doc)}
              tags={s.kind === 'other' ? ['Optional'] : ['Required']}
              verified={s.doc?.status === 'verified'}
              pending={s.doc?.status !== 'verified'}
              note={s.doc?.note ? `GTH: ${s.doc.note}` : null}
              link={
                s.doc?.hasFile
                  ? { label: 'View file', onClick: () => onOpen(s.doc), disabled: busy }
                  : locked || (!s.file && s.doc)
                    ? undefined
                    : s.file
                      ? { label: 'Upload', onClick: () => pick(s.kind), disabled: busy }
                      : { label: 'Add details', onClick: () => setEditing(key), disabled: busy }
              }
              onEdit={locked ? undefined : () => setEditing(isEditing ? null : key)}
              editLabel={`Edit ${s.title} details`}
            >
              {isEditing ? (
                <DetailsForm
                  kind={s.kind}
                  doc={s.doc}
                  busy={busy}
                  onCancel={() => setEditing(null)}
                  onSave={async (details) => {
                    if (await onSaveDetails(s.kind, details, s.doc)) setEditing(null);
                  }}
                  onReplace={s.file && s.kind !== 'other' ? () => pick(s.kind) : undefined}
                  onRemove={
                    s.doc
                      ? async () => {
                          if (await onRemove(s.doc)) setEditing(null);
                        }
                      : undefined
                  }
                />
              ) : null}
            </InstitutionAccredDocCard>
          );
        })}
      </ul>
      {!locked ? (
        <div className="flex flex-col gap-[16px] sm:flex-row">
          <button
            type="button"
            disabled={busy}
            onClick={() => pick(nextFile ? nextFile.kind : 'other')}
            className={DASHED}
          >
            <PlusIcon className="size-[18px]" />
            {nextFile ? UPLOAD_LABEL[nextFile.kind] : 'Upload another document'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setEditing(nextDetails.kind)}
            className={DASHED}
          >
            {U.list.manual}
          </button>
        </div>
      ) : null}
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        aria-label="Choose a document"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          take(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <p role="alert" className="m-0 font-sans text-[14px] leading-[17px] text-danger empty:hidden">
        {pickError || error}
      </p>
    </section>
  );
};

export default InstitutionAccredList;
