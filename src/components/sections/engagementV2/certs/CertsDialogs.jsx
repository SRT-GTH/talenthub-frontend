import { useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';
import { CARD, HEADING, Sticker, TwoTone } from './CertsParts.jsx';
import {
  CertsArrowRightIcon,
  CertsBellIcon,
  CertsCaretIcon,
  CertsCheckCircleIcon,
  CertsCheckIcon,
  CertsCloseIcon,
  CertsDeleteIcon,
  CertsEditDuoIcon,
  CertsFileCheckIcon,
  CertsFileIcon,
  CertsSearchIcon,
  CertsUploadIcon,
} from './certsIcons.jsx';
import { COMPLETE_STATS, CONFETTI, STATUS_LABEL, TYPE_OPTIONS } from './certsData.js';
import { parseMonthYear } from './certsData.js';
import {
  certFileProblem,
  extractCertificate,
  fileSizeLabel,
  toFormMonth,
  uploadCertificateFile,
} from '../../../../services/certificate.api.js';
import { uploadErrorMessage } from '../../../../services/media.api.js';

const log = debug('CertsDialogs');

const SECONDARY = 'rounded-[14px]! px-[34px]!';

/* Dialog shell: portal + scrim, role=dialog, focus trap, Esc, inert backdrop, scroll lock. */
const DialogShell = ({
  role = 'dialog',
  onClose,
  labelledBy,
  describedBy,
  maxW,
  top,
  className,
  children,
}) => {
  const ref = useRef(null);
  usePlayfulDialogA11y({ open: true, dialogRef: ref, onEscape: onClose, lockScroll: true });
  return createPortal(
    <div
      data-pf-portal
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[rgba(11,26,15,0.55)] px-3 pb-3"
      style={{ paddingTop: top }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={classNames(
          'relative w-full bg-white outline-none',
          CARD,
          'rounded-[28px]',
          className
        )}
        style={{ maxWidth: maxW }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

const CloseButton = ({ onClose, size = 40, className }) => (
  <button
    type="button"
    aria-label="Close"
    onClick={onClose}
    style={{ width: size, height: size }}
    className={classNames(
      'absolute inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-[#f3f3ef] p-0 text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      className
    )}
  >
    <CertsCloseIcon className="size-[20px]" />
  </button>
);

const Chip = ({ children, tone = 'green' }) => (
  <span
    className={classNames(
      'inline-flex h-[32px] w-fit items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold max-lg:text-[12px]',
      tone === 'green'
        ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
        : 'border-[#e1eae2] bg-white text-[#595959]'
    )}
  >
    {children}
  </span>
);

const DIALOG_PAD = 'px-[clamp(16px,2.3vw,40px)] pt-[36px] pb-[32px] max-sm:pt-[28px]';
const H_TITLE = classNames(
  'm-0 font-sans text-[clamp(24px,1.85vw,32px)] leading-[1.2] font-semibold max-sm:pr-[48px]',
  HEADING
);
const H_SUB = 'm-0 font-sans text-[15px] leading-[22px] text-[#595959]';

/* ---------- form fields ---------- */
const INPUT =
  'h-[51px] w-full rounded-[10px] border border-solid border-[#cccccc] bg-white py-[13px] pr-[16px] pl-[20px] font-sans text-[14px] leading-[20px] tracking-[0.2px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] placeholder:font-normal placeholder:text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const Field = ({ label, required, optional, children, htmlFor }) => (
  <div className="flex min-w-0 flex-col gap-[8px]">
    <div className="flex items-center justify-between gap-2">
      <label
        htmlFor={htmlFor}
        className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
      >
        {label}
        {required ? <span className="font-ui font-semibold text-[#2e8b57]"> *</span> : null}
      </label>
      {optional ? (
        <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#595959]">
          Optional
        </span>
      ) : null}
    </div>
    {children}
  </div>
);

const Row = ({ children }) => (
  <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 sm:gap-[16px]">{children}</div>
);

const blankForm = {
  title: '',
  issuer: '',
  type: '',
  credentialId: '',
  issueDate: '',
  expiryDate: '',
  noExpiry: false,
  link: '',
  skills: '',
};

/* ---------- Add / Edit ---------- */
/* `live` (signed-in): the profile has no slot for the type, so it is optional (see certToProfile in certsData.js). */
export const CertFormDialog = ({ mode, cert, onClose, onSave, onDelete, live = false }) => {
  const uid = useId();
  const fileRef = useRef(null);
  const editing = mode === 'edit' && cert;
  const [form, setForm] = useState(() =>
    editing ? { ...blankForm, ...cert, skills: cert.skills.join(', ') } : blankForm
  );
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const formRef = useRef(form);
  formRef.current = form;
  /*
   * 2026-11-01: the picked file was only logged ("no parsing in the mock") - the stage promised "we fill in the
   * fields" and threw the file away. Signed in, it is now stored (certificateFile) and a PDF is read into the empty
   * fields. Fields the talent already typed are never overwritten. Photos aren't read yet: said plainly.
   */
  const [upload, setUpload] = useState(null); // { status: 'reading'|'done'|'error', name, size, url, filled, note }
  const pickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!live) {
      log('file chosen (demo: not uploaded)', file.name);
      return;
    }
    const problem = certFileProblem(file);
    if (problem) {
      setUpload({
        status: 'error',
        name: file.name,
        size: fileSizeLabel(file.size),
        note: problem,
      });
      return;
    }
    const base = { name: file.name, size: fileSizeLabel(file.size) };
    setUpload({ ...base, status: 'reading', note: 'Uploading and reading your certificate…' });
    const [stored, read] = await Promise.allSettled([
      uploadCertificateFile(file),
      extractCertificate(file),
    ]);
    if (stored.status !== 'fulfilled') {
      log.error('certificate upload failed', stored.reason?.message);
      setUpload({
        ...base,
        status: 'error',
        note: uploadErrorMessage(
          stored.reason,
          'We couldn’t upload this file. Try again, or save the details without it.'
        ),
      });
      return;
    }
    const got = read.status === 'fulfilled' ? read.value : null;
    const x = got?.readable ? got.fields || {} : {};
    const suggestions = {
      title: x.name || '',
      issuer: x.issuingOrganization || '',
      credentialId: x.credentialId || '',
      issueDate: toFormMonth(x.issueDate),
      expiryDate: toFormMonth(x.expiryDate),
      link: x.credentialUrl || '',
      skills: Array.isArray(x.skills) ? x.skills.join(', ') : '',
    };
    // Read the latest typed values (the talent may type while the file uploads).
    const prev = formRef.current;
    const next = { ...prev };
    let filled = 0;
    Object.entries(suggestions).forEach(([k, v]) => {
      if (v && !String(prev[k] || '').trim()) {
        next[k] = v;
        filled += 1;
      }
    });
    setForm(next);
    const reason = got?.reason;
    const note = filled
      ? `${filled} ${filled === 1 ? 'field' : 'fields'} filled from your file. Check them before you save.`
      : reason === 'PHOTO'
        ? 'File attached. We can’t read photos yet, so fill in the details below.'
        : reason === 'NO_TEXT'
          ? 'File attached. We couldn’t find any text in it (it may be a scan), so fill in the details below.'
          : 'File attached. We couldn’t read the details from it, so fill them in below.';
    if (got?.readable && x.issueDate?.yearOnly && !suggestions.issueDate) {
      setUpload({
        ...base,
        status: 'done',
        url: stored.value,
        filled,
        note: `${note} Add the month it was issued.`,
      });
      return;
    }
    setUpload({ ...base, status: 'done', url: stored.value, filled, note });
  };
  const issue = parseMonthYear(form.issueDate);
  /* Typed but unparseable: the save button stays disabled and this says why (an issue date is never invented). */
  const issueBad = Boolean(form.issueDate.trim()) && !issue;
  const expiryOk =
    form.noExpiry || !form.expiryDate.trim() || Boolean(parseMonthYear(form.expiryDate));
  const valid =
    Boolean(form.title.trim() && form.issuer.trim() && (live || form.type) && issue && expiryOk) &&
    upload?.status !== 'reading';
  log('render', { mode, valid });

  const verifiedHeader = editing && cert.verifiedNote;
  const titleId = `${uid}-t`;
  const subId = `${uid}-s`;
  const f = (n) => `${uid}-${n}`;

  const submit = () => {
    if (!valid) return;
    onSave({
      ...form,
      title: form.title.trim(),
      issuer: form.issuer.trim(),
      skills: form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      expiryDate: form.noExpiry ? '' : form.expiryDate.trim(),
      ...(upload?.url
        ? {
            upload: {
              name: upload.name,
              size: upload.size,
              url: upload.url,
              filled: upload.filled,
            },
          }
        : {}),
    });
  };

  return (
    <DialogShell
      onClose={onClose}
      labelledBy={titleId}
      describedBy={subId}
      maxW={820}
      top={44}
      className={classNames('flex flex-col gap-[20px]', DIALOG_PAD)}
    >
      <CloseButton
        onClose={onClose}
        className="top-[24px] right-[24px] max-sm:top-[14px] max-sm:right-[14px]"
      />
      <div className="flex flex-col gap-[8px]">
        <Chip>{editing ? 'Edit certification' : 'Add a certification'}</Chip>
        <h2 id={titleId} className={H_TITLE}>
          {editing ? (
            <TwoTone text={cert.title} />
          ) : (
            <TwoTone text="New certificate. Upload it or type it." plain="New certificate. " />
          )}
        </h2>
        {editing ? (
          verifiedHeader ? (
            <p id={subId} className={H_SUB}>
              {cert.verifiedNote} Changing the ID or issuer sends it for a fresh check.
            </p>
          ) : (
            <span id={subId} />
          )
        ) : (
          <p id={subId} className={H_SUB}>
            Upload and we fill in the fields below in about 2 seconds. You can also fill them in
            yourself.
          </p>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={pickFile}
      />
      {upload ? (
        <div
          className={classNames(
            'flex flex-wrap items-center gap-[14px] rounded-[16px] border border-solid py-[14px] pr-[16px] pl-[14px]',
            upload.status === 'error'
              ? 'border-[#e2b4ad] bg-[#fdf3f1]'
              : 'border-[#e7e7e7] bg-[#f7f8f4]'
          )}
          role="status"
        >
          <span className="inline-flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
            <CertsFileIcon className="size-[22px]" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21] [overflow-wrap:anywhere]">
              {upload.name} · {upload.size}
            </p>
            <p
              className={classNames(
                'm-0 inline-flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium max-lg:text-[12px]',
                upload.status === 'error' ? 'text-[#a8382b]' : 'text-[#387440]'
              )}
            >
              {upload.status === 'done' ? (
                <CertsCheckCircleIcon className="size-[13px] shrink-0" />
              ) : null}
              {upload.note}
            </p>
          </div>
          <Button
            variant="tertiary-subtle"
            size="md"
            className={SECONDARY}
            disabled={upload.status === 'reading'}
            onClick={() => fileRef.current?.click()}
          >
            {upload.status === 'error' ? 'Try another file' : 'Re-upload'}
          </Button>
        </div>
      ) : editing ? (
        cert.file ? (
          <div className="flex flex-wrap items-center gap-[14px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f7f8f4] py-[14px] pr-[16px] pl-[14px]">
            <span className="inline-flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
              <CertsFileIcon className="size-[22px]" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21] [overflow-wrap:anywhere]">
                {cert.file.name}
                {cert.file.size ? ` · ${cert.file.size}` : ''}
              </p>
              <p className="m-0 inline-flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#387440] max-lg:text-[12px]">
                <CertsCheckCircleIcon className="size-[13px]" />
                {cert.file.filled
                  ? `${cert.file.filled} fields filled from your file`
                  : 'File attached'}
                {cert.file.url ? (
                  <a href={cert.file.url} target="_blank" rel="noreferrer" className="underline">
                    View
                  </a>
                ) : null}
              </p>
            </div>
            <Button
              variant="tertiary-subtle"
              size="md"
              className={SECONDARY}
              onClick={() => fileRef.current?.click()}
            >
              Re-upload
            </Button>
          </div>
        ) : null
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-[16px] rounded-[16px] border border-solid border-[#387440] bg-[#ebf1ec] p-[18px] playful:border-[1.5px]">
            <span
              className={classNames(
                'inline-flex size-[56px] shrink-0 items-center justify-center rounded-[16px] bg-white text-[#387440]',
                CARD
              )}
            >
              <CertsUploadIcon className="size-[26px]" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                Drop a PDF or photo of your certificate
              </p>
              <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[12px]">
                PDF, JPG or PNG · up to 10 MB · we auto-fill the fields
              </p>
            </div>
            <Button size="sm" onClick={() => fileRef.current?.click()}>
              Browse files
            </Button>
          </div>
          <div className="flex items-center gap-[12px]" aria-hidden="true">
            <span className="h-px flex-1 bg-[#e7e7e7]" />
            <span className="font-sans text-[12px] leading-[14px] font-semibold text-[#595959]">
              or fill it in yourself
            </span>
            <span className="h-px flex-1 bg-[#e7e7e7]" />
          </div>
        </>
      )}

      <Row>
        <Field label="Certificate name" required htmlFor={f('title')}>
          <input
            id={f('title')}
            value={form.title}
            onChange={set('title')}
            placeholder="e.g. Google Data Analytics Certificate, WASSCE"
            className={classNames(INPUT, 'font-medium text-[#1c2a21]')}
          />
        </Field>
        <Field label="Issuer" required htmlFor={f('issuer')}>
          <input
            id={f('issuer')}
            value={form.issuer}
            onChange={set('issuer')}
            placeholder="e.g. Coursera, WAEC Ghana, AWS"
            className={classNames(INPUT, 'font-medium text-[#1c2a21]')}
          />
        </Field>
      </Row>
      <Row>
        <Field label="Type" required={!live} optional={live} htmlFor={f('type')}>
          <div className="relative">
            <select
              id={f('type')}
              value={form.type}
              onChange={set('type')}
              className={classNames(
                INPUT,
                'cursor-pointer appearance-none pr-[44px] font-medium text-[#1c2a21]'
              )}
            >
              <option value="">Select a type</option>
              {TYPE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <CertsCaretIcon className="pointer-events-none absolute top-1/2 right-[8px] h-[19px] w-[20px] -translate-y-1/2 text-[#387440]" />
          </div>
        </Field>
        <Field label="Credential ID" optional htmlFor={f('cid')}>
          <input
            id={f('cid')}
            value={form.credentialId}
            onChange={set('credentialId')}
            placeholder="Helps us verify it"
            className={classNames(INPUT, 'text-[#595959]')}
          />
        </Field>
      </Row>
      <Row>
        <Field label="Issue date" required htmlFor={f('issue')}>
          <input
            id={f('issue')}
            value={form.issueDate}
            onChange={set('issueDate')}
            placeholder="MM / YYYY"
            inputMode="numeric"
            aria-invalid={issueBad || undefined}
            aria-describedby={issueBad ? f('issue-err') : undefined}
            className={classNames(
              INPUT,
              'font-medium text-[#1c2a21]',
              issueBad && '!border-[#c0392b]'
            )}
          />
          {issueBad ? (
            <span
              id={f('issue-err')}
              role="alert"
              className="font-sans text-[13px] leading-[16px] text-[#902b20]"
            >
              Use month / year, e.g. 03 / 2024.
            </span>
          ) : null}
        </Field>
        <Field label="Expiry date" optional htmlFor={f('expiry')}>
          {form.noExpiry ? (
            <input
              id={f('expiry')}
              disabled
              value="No expiry"
              readOnly
              className="h-[51px] w-full rounded-[10px] border-2 border-solid border-[#cccccc] bg-[#ebf1ec] py-[13px] pr-[16px] pl-[20px] font-ui text-[14px] leading-[21px] text-[#1c2a21] opacity-[0.55]"
            />
          ) : (
            <input
              id={f('expiry')}
              value={form.expiryDate}
              onChange={set('expiryDate')}
              placeholder="MM / YYYY"
              inputMode="numeric"
              className={classNames(INPUT, 'text-[#595959]')}
            />
          )}
        </Field>
      </Row>
      <Row>
        <Field label="Credential link" optional htmlFor={f('link')}>
          <input
            id={f('link')}
            value={form.link}
            onChange={set('link')}
            placeholder="https://…"
            className={classNames(INPUT, 'text-[#595959]')}
          />
        </Field>
        <Field label="Skills it covers" optional htmlFor={f('skills')}>
          <input
            id={f('skills')}
            value={form.skills}
            onChange={set('skills')}
            placeholder="e.g. SQL, Tableau (comma separated)"
            className={classNames(INPUT, 'text-[#595959]')}
          />
        </Field>
      </Row>

      <label className="inline-flex w-fit min-h-[24px] cursor-pointer items-center gap-[10px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
        <input
          type="checkbox"
          checked={form.noExpiry}
          onChange={(e) => setForm((s) => ({ ...s, noExpiry: e.target.checked }))}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={classNames(
            'inline-flex size-[20px] items-center justify-center rounded-[6px] border-solid text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-green',
            form.noExpiry
              ? 'border border-[#387440] bg-[#387440] playful:border-2'
              : 'border-2 border-[#babab7] bg-white'
          )}
        >
          {form.noExpiry ? <CertsCheckIcon className="size-[16px]" /> : null}
        </span>
        It doesn’t expire
      </label>

      {editing && cert.status === 'verified' ? (
        <div
          className={classNames(
            'flex items-center gap-[10px] rounded-[14px] bg-[#e8f2ed] px-[14px] py-[12px]',
            CARD
          )}
        >
          <CertsCheckCircleIcon className="size-[18px] shrink-0 text-[#387440]" />
          <p className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#165d3a]">
            Verified · the green badge shows on your card and in search
          </p>
        </div>
      ) : null}

      <div
        className={classNames(
          'flex flex-wrap items-center gap-[12px] pt-[8px]',
          editing ? 'justify-between' : 'justify-end'
        )}
      >
        {editing ? (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex min-h-[24px] cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#902b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <CertsDeleteIcon className="size-[16px] text-[#387440]" />
            Delete this certificate
          </button>
        ) : null}
        <div className="flex flex-wrap gap-[12px]">
          <Button variant="tertiary-subtle" size="md" className={SECONDARY} onClick={onClose}>
            Cancel
          </Button>
          <Button size="md" disabled={!valid} rightIcon={<CertsArrowRightIcon />} onClick={submit}>
            {editing ? 'Save changes' : 'Save certificate'}
          </Button>
        </div>
      </div>
    </DialogShell>
  );
};

/* ---------- Delete ---------- */
export const DeleteDialog = ({ cert, onClose, onEditInstead, onConfirm }) => {
  const uid = useId();
  const effects = useMemo(() => {
    const list = [];
    if (cert.status === 'verified') list.push('The Verified badge is removed from your card');
    if (cert.skills.length)
      list.push(`Skills evidence linked to it (${cert.skills.join(', ')}) goes too`);
    if (cert.expiryDate) list.push('Expiry reminders for it stop');
    return list;
  }, [cert]);
  const sub = [cert.issuer, STATUS_LABEL[cert.status], cert.dateLabel].filter(Boolean).join(' · ');
  return (
    <DialogShell
      onClose={onClose}
      labelledBy={`${uid}-t`}
      describedBy={`${uid}-s`}
      maxW={620}
      top={44}
      role="alertdialog"
      className={classNames('flex flex-col gap-[20px]', DIALOG_PAD)}
    >
      <CloseButton
        onClose={onClose}
        className="top-[24px] right-[24px] max-sm:top-[14px] max-sm:right-[14px]"
      />
      <div className="flex flex-col gap-[8px]">
        <Chip tone="plain">Delete certificate</Chip>
        <h2 id={`${uid}-t`} className={H_TITLE}>
          <TwoTone text="Delete this certificate?" plain="Delete this " />
        </h2>
        <p id={`${uid}-s`} className={H_SUB}>
          It disappears from your profile straight away. This can’t be undone.
        </p>
      </div>
      <div className="flex items-center gap-[12px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f7f8f4] py-[14px] pr-[16px] pl-[14px]">
        <span className="inline-flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
          <CertsFileCheckIcon className="size-[20px]" />
        </span>
        <div className="flex min-w-0 flex-col gap-[2px]">
          <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            {cert.title}
          </p>
          <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[12px]">
            {sub}
          </p>
        </div>
      </div>
      {effects.length ? (
        <div className="flex flex-col gap-[8px]">
          <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#595959] max-lg:text-[12px]">
            WHAT HAPPENS
          </p>
          {effects.map((e) => (
            <p
              key={e}
              className="m-0 flex items-center gap-[8px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]"
            >
              <span aria-hidden="true" className="size-[7px] shrink-0 rounded-full bg-[#c0392b]" />
              {e}
            </p>
          ))}
        </div>
      ) : null}
      <div className="flex items-center gap-[12px] rounded-[14px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[16px] pl-[14px]">
        <span className="inline-flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#c8951a] text-white">
          <CertsEditDuoIcon className="size-[17px]" />
        </span>
        <div className="flex min-w-0 flex-col gap-[2px]">
          <p className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
            Just need to fix something?
          </p>
          <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[12px]">
            Wrong date, issuer name or a missing ID? Editing keeps the verification where it can.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-[12px] pt-[8px]">
        <Button variant="tertiary-subtle" size="md" className={SECONDARY} onClick={onEditInstead}>
          Edit instead
        </Button>
        <Button
          variant="danger"
          size="md"
          className="border-[#2a5730]! drop-shadow-[0_4px_0_#902b20]!"
          onClick={onConfirm}
        >
          Delete certificate
        </Button>
      </div>
    </DialogShell>
  );
};

/* ---------- Stage complete ---------- */
const STAT_TONES = [
  { key: 'stages', label: 'STAGES DONE', bg: 'bg-[#f7f8f4]', num: 'text-[#1c2a21]' },
  { key: 'profile', label: 'PROFILE', bg: 'bg-[#e8f2ed]', num: 'text-[#165d3a]' },
  { key: 'earned', label: 'EARNED', bg: 'bg-[#faf4e8]', num: 'text-[#785910]' },
];

export const CompleteDialog = ({ summary, onClose, onStay, onNext, earnedLabels }) => {
  const uid = useId();
  const values = {
    stages: COMPLETE_STATS.stages,
    profile: COMPLETE_STATS.profile,
    earned: earnedLabels.focused,
  };
  return (
    <DialogShell
      onClose={onClose}
      labelledBy={`${uid}-t`}
      describedBy={`${uid}-s`}
      maxW={560}
      top={28}
      className="overflow-hidden pb-[28px]"
    >
      <div
        className="relative h-[176px] overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(280px 63px at 50% 50%, #e1eae2 0%, #ffffff 100%)',
        }}
      >
        <div aria-hidden="true" className="absolute inset-0 max-sm:hidden">
          {CONFETTI.map(([x, y, w, h, r, c, o]) => (
            <span
              key={`${x}-${y}`}
              className="absolute rounded-[2px]"
              style={{
                left: x,
                top: y,
                width: w,
                height: h,
                background: c,
                opacity: o,
                transform: `rotate(${r}deg)`,
              }}
            />
          ))}
        </div>
        <span
          aria-hidden="true"
          className={classNames(
            'absolute top-[40px] left-1/2 inline-flex size-[100px] -translate-x-1/2 items-center justify-center rounded-full bg-[#387440] text-white',
            CARD
          )}
        >
          <CertsFileCheckIcon className="size-[44px]" />
        </span>
        <Sticker
          stars={false}
          tilt={8}
          className="absolute top-[20px] left-[300px] max-sm:left-[12px]"
        >
          STAGE 7 DONE
        </Sticker>
        <span
          aria-hidden="true"
          className="absolute top-[52px] left-[190px] hidden size-[18px] text-[#ffd86b] playful:block max-sm:hidden"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C13.2 8.4 15.6 10.8 24 12C15.6 13.2 13.2 15.6 12 24C10.8 15.6 8.4 13.2 0 12C8.4 10.8 10.8 8.4 12 0Z" />
          </svg>
        </span>
        <CloseButton onClose={onClose} size={36} className="top-[20px] right-[20px]" />
      </div>
      <div className="flex flex-col gap-[18px] px-[clamp(16px,1.85vw,32px)] pt-[0px]">
        <div className="flex flex-col items-center gap-[8px] pt-[18px] text-center">
          <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#387440] max-lg:text-[12px]">
            STAGE 7 OF 9 COMPLETE
          </p>
          <h2
            id={`${uid}-t`}
            className={classNames(
              'm-0 font-sans text-[clamp(26px,2.03vw,35px)] leading-[1.19] font-semibold',
              HEADING
            )}
          >
            <TwoTone text="Credentials on the record." plain="Credentials " />
          </h2>
          <p id={`${uid}-s`} className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
            {summary}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-[10px]">
          {STAT_TONES.map((s) => (
            <div
              key={s.key}
              className={classNames(
                'flex flex-col items-center gap-[2px] rounded-[16px] px-[8px] py-[12px] text-center',
                s.bg,
                CARD
              )}
            >
              <span
                className={classNames(
                  'font-sans text-[23px] leading-[29px] font-semibold',
                  s.num,
                  HEADING
                )}
              >
                {s.key === 'earned' ? <EarnedValue labels={earnedLabels} /> : values[s.key]}
              </span>
              <span className="font-sans text-[10px] leading-[12px] font-semibold tracking-[1px] text-[#595959] max-lg:text-[12px]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-[4px]">
          <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#595959] max-lg:text-[12px]">
            WHAT YOU JUST UNLOCKED
          </p>
          {[
            {
              icon: CertsSearchIcon,
              title: 'Credential filter',
              text: 'Recruiters searching for AWS or Google Data Analytics now find you.',
            },
            {
              icon: CertsBellIcon,
              title: 'Expiry reminders',
              text: 'We’ll nudge you 60 days before anything expires.',
            },
          ].map((u) => {
            const Glyph = u.icon;
            return (
              <div key={u.title} className="flex items-center gap-[14px] py-[10px]">
                <span className="inline-flex size-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
                  <Glyph className="size-[20px]" />
                </span>
                <div className="flex min-w-0 flex-col gap-[2px]">
                  <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                    {u.title}
                  </p>
                  <p className="m-0 font-sans text-[13px] leading-[18px] text-[#595959] max-lg:text-[12px]">
                    {u.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
          <Button variant="tertiary-subtle" size="lg" className="w-full" onClick={onStay}>
            Stay here
          </Button>
          <Button size="lg" className="w-full" rightIcon={<CertsArrowRightIcon />} onClick={onNext}>
            Next: Goals
          </Button>
        </div>
      </div>
    </DialogShell>
  );
};

/* "+40 pts" (Focused) / "+40 XP" (Playful): both strings rendered, the style variant picks one. */
const EarnedValue = ({ labels }) => (
  <>
    <span className="playful:hidden">{labels.focused}</span>
    <span className="hidden playful:inline">{labels.playful}</span>
  </>
);
