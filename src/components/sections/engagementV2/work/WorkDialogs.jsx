import { useEffect, useMemo, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';
import FlowPortal from '../../talentHome/FlowPortal.jsx';
import { useUiStyle } from '../../../../hooks/useUiStyle.js';
import { AccentTitle, SectionEyebrow, Sticker, Star } from './WorkParts.jsx';
import {
  COMPLETE_CONFETTI,
  COMPLETE_STATS,
  EMPLOYMENT_TYPES,
  formatRange,
  fromField,
  previewMeta,
  toField,
} from './workData.js';
import { CARD, DISPLAY, EYEBROW } from './workStyles.js';
import {
  WorkArrowRightIcon,
  WorkBoltIcon,
  WorkBulbIcon,
  WorkCheckIcon,
  WorkChevronIcon,
  WorkCloseIcon,
  WorkEditDuoIcon,
  WorkInfoIcon,
  WorkPlusDuoIcon,
  WorkSearchIcon,
  WorkTrashIcon,
  WorkWorkIcon,
} from './workIcons.jsx';

const log = debug('WorkDialogs');

const INPUT_SHADOW =
  'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';
const INPUT_BASE = classNames(
  'box-border w-full rounded-[10px] border border-solid border-[#cccccc] bg-white font-sans text-[14px] leading-[20px] font-medium tracking-[0.2px] text-[#1c2a21] outline-none placeholder:font-normal placeholder:text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
  INPUT_SHADOW
);

/* ---------- Shell ---------- */
const DialogShell = ({
  labelledBy,
  describedBy,
  onClose,
  maxWidth,
  pad = 44,
  initialFocus,
  children,
}) => {
  const dialogRef = useRef(null);
  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: onClose,
    initialFocus,
    lockScroll: true,
  });
  return (
    <FlowPortal
      className="overflow-y-auto bg-[rgba(11,26,15,0.55)] px-[clamp(8px,2vw,16px)] pb-[16px]"
      onScrimMouseDown={onClose}
    >
      <div style={{ paddingTop: `clamp(12px,${pad / 17.28}vw,${pad}px)` }} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        style={{ maxWidth }}
        className={classNames('relative mx-auto w-full rounded-[28px] bg-white outline-none', CARD)}
      >
        {children}
      </div>
    </FlowPortal>
  );
};

const CloseButton = ({ onClick, size = 40, className }) => (
  <button
    type="button"
    aria-label="Close"
    onClick={onClick}
    style={{ width: size, height: size }}
    className={classNames(
      'absolute z-10 flex cursor-pointer items-center justify-center rounded-full border-0 bg-[#f3f3ef] p-0 text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      className
    )}
  >
    <WorkCloseIcon className={size === 40 ? 'size-[20px]' : 'size-[18px]'} />
  </button>
);

const DialogHeader = ({ chip, chipTone = 'green', titleId, lead, accent, subId, sub }) => (
  <div className="flex flex-col gap-[8px] pr-[48px]">
    <span
      className={classNames(
        'inline-flex h-[32px] w-fit items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold',
        chipTone === 'green'
          ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
          : 'border-[#e1eae2] bg-white text-[#595959]'
      )}
    >
      {chip}
    </span>
    <AccentTitle
      as="h2"
      id={titleId}
      lead={lead}
      accent={accent}
      className="text-[clamp(24px,1.85vw,32px)] leading-[1.19]"
    />
    <p id={subId} className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
      {sub}
    </p>
  </div>
);

const BODY_PAD =
  'px-[clamp(18px,2.3vw,40px)] pt-[clamp(24px,2.1vw,36px)] pb-[clamp(20px,1.85vw,32px)]';

/* ---------- Form bits ---------- */
const Field = ({ label, required, optional, counter, htmlFor, children }) => (
  <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
    <div className="flex items-center justify-between gap-2">
      <label
        htmlFor={htmlFor}
        className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
      >
        {label}
        {required ? <span className="text-[#2e8b57]">*</span> : null}
      </label>
      {optional ? (
        <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#595959]">
          Optional
        </span>
      ) : null}
      {counter ? (
        <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#595959]">
          {counter}
        </span>
      ) : null}
    </div>
    {children}
  </div>
);

const Row = ({ children }) => <div className="flex gap-[16px] max-sm:flex-col">{children}</div>;

const bad = (on) => (on ? '!border-[#c0392b]' : '');

/* ---------- Add / Edit role ---------- */
const emptyForm = {
  title: '',
  org: '',
  type: '',
  location: '',
  start: '',
  end: '',
  current: false,
  description: '',
  tools: [],
};

const toForm = (r) => ({
  title: r.title,
  org: r.org,
  type: r.type,
  location: r.location || '',
  start: toField(r.start),
  end: r.current ? '' : toField(r.end),
  current: r.current,
  description: r.description || '',
  tools: [...(r.tools || [])],
});

export const RoleDialog = ({ mode, role, showUnsaved, onClose, onSave, onDelete }) => {
  const isEdit = mode === 'edit';
  const initial = useMemo(() => (isEdit && role ? toForm(role) : emptyForm), [isEdit, role]);
  const [form, setForm] = useState(initial);
  const [invalid, setInvalid] = useState({});
  const [addingTool, setAddingTool] = useState(false);
  const [toolDraft, setToolDraft] = useState('');
  const refs = useRef({});
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  useEffect(() => {
    log('mount', { mode, roleId: role?.id });
  }, [mode, role?.id]);

  const submit = (e) => {
    e.preventDefault();
    const start = fromField(form.start);
    const end = form.current ? null : fromField(form.end);
    const errs = {
      title: !form.title.trim(),
      org: !form.org.trim(),
      type: !form.type,
      start: !start,
      end: !form.current && !end,
    };
    const first = Object.keys(errs).find((k) => errs[k]);
    log('submit', { mode, errs });
    if (first) {
      setInvalid(errs);
      refs.current[first]?.focus();
      return;
    }
    const base = {
      id: role?.id ?? `r${Date.now()}`,
      title: form.title.trim(),
      org: form.org.trim(),
      type: form.type,
      location: form.location.trim(),
      place: form.location.split(',')[0].trim(),
      start,
      end,
      current: form.current,
      description: form.description.trim(),
      tools: form.tools,
    };
    onSave({ ...base, rangeLabel: formatRange(base) });
  };

  const addTool = () => {
    const t = toolDraft.trim();
    if (t && !form.tools.includes(t)) set({ tools: [...form.tools, t] });
    setToolDraft('');
    setAddingTool(false);
  };

  const rid = isEdit ? 'work-edit' : 'work-add';
  return (
    <DialogShell
      labelledBy={`${rid}-title`}
      describedBy={`${rid}-sub`}
      onClose={onClose}
      maxWidth={820}
      initialFocus={() => refs.current.title}
    >
      <CloseButton onClick={onClose} className="top-[24px] right-[24px]" />
      <form
        onSubmit={submit}
        noValidate
        className={classNames('flex flex-col gap-[20px]', BODY_PAD)}
      >
        {isEdit ? (
          <DialogHeader
            chip="Edit role"
            titleId={`${rid}-title`}
            lead={role.title.split(' ').slice(0, -1).join(' ') + ' '}
            accent={role.title.split(' ').slice(-1)[0]}
            subId={`${rid}-sub`}
            sub={`At ${role.org}. Changes go live on your card when you save.`}
          />
        ) : (
          <DialogHeader
            chip="Add a role"
            titleId={`${rid}-title`}
            lead="New role. "
            accent="Tell the story."
            subId={`${rid}-sub`}
            sub="Use your real title and dates. Two or three lines on what you did is enough."
          />
        )}

        <SectionEyebrow>ROLE AND ORGANISATION</SectionEyebrow>
        <Row>
          <Field label="Job title" required htmlFor={`${rid}-t`}>
            <input
              id={`${rid}-t`}
              ref={(n) => (refs.current.title = n)}
              value={form.title}
              onChange={(e) => set({ title: e.target.value })}
              aria-invalid={invalid.title || undefined}
              placeholder="e.g. Software Engineer, ICT Instructor"
              className={classNames(INPUT_BASE, 'h-[51px] pr-[16px] pl-[20px]', bad(invalid.title))}
            />
          </Field>
          <Field label="Organisation" required htmlFor={`${rid}-o`}>
            <input
              id={`${rid}-o`}
              ref={(n) => (refs.current.org = n)}
              value={form.org}
              onChange={(e) => set({ org: e.target.value })}
              aria-invalid={invalid.org || undefined}
              placeholder="Company or institution"
              className={classNames(INPUT_BASE, 'h-[51px] pr-[16px] pl-[20px]', bad(invalid.org))}
            />
          </Field>
        </Row>
        <Row>
          <Field label="Employment type" required htmlFor={`${rid}-y`}>
            <div className="relative">
              <select
                id={`${rid}-y`}
                ref={(n) => (refs.current.type = n)}
                value={form.type}
                onChange={(e) => set({ type: e.target.value })}
                aria-invalid={invalid.type || undefined}
                className={classNames(
                  INPUT_BASE,
                  'h-[51px] cursor-pointer appearance-none pr-[48px] pl-[20px]',
                  bad(invalid.type)
                )}
              >
                <option value="" disabled>
                  Select a type
                </option>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <WorkChevronIcon className="pointer-events-none absolute top-1/2 right-[16px] size-[20px] -translate-y-1/2 text-[#387440]" />
            </div>
          </Field>
          <Field label="Location" optional htmlFor={`${rid}-l`}>
            <input
              id={`${rid}-l`}
              value={form.location}
              onChange={(e) => set({ location: e.target.value })}
              placeholder="e.g. Accra, Kumasi or Remote"
              className={classNames(INPUT_BASE, 'h-[51px] pr-[16px] pl-[20px]')}
            />
          </Field>
        </Row>

        <SectionEyebrow>DATES</SectionEyebrow>
        <Row>
          <Field label="Start date" required htmlFor={`${rid}-s`}>
            <input
              id={`${rid}-s`}
              ref={(n) => (refs.current.start = n)}
              value={form.start}
              onChange={(e) => set({ start: e.target.value })}
              aria-invalid={invalid.start || undefined}
              placeholder="MM / YYYY"
              inputMode="numeric"
              className={classNames(INPUT_BASE, 'h-[51px] pr-[16px] pl-[20px]', bad(invalid.start))}
            />
          </Field>
          <Field label="End date" required={!form.current} htmlFor={`${rid}-e`}>
            {form.current ? (
              <input
                id={`${rid}-e`}
                value="Present"
                disabled
                readOnly
                className="box-border h-[51px] w-full rounded-[10px] border-2 border-solid border-[#cccccc] bg-[#ebf1ec] pr-[16px] pl-[20px] font-sans text-[14px] leading-[21px] text-[#1c2a21] opacity-[0.55]"
              />
            ) : (
              <input
                id={`${rid}-e`}
                ref={(n) => (refs.current.end = n)}
                value={form.end}
                onChange={(e) => set({ end: e.target.value })}
                aria-invalid={invalid.end || undefined}
                placeholder="MM / YYYY"
                inputMode="numeric"
                className={classNames(INPUT_BASE, 'h-[51px] pr-[16px] pl-[20px]', bad(invalid.end))}
              />
            )}
          </Field>
        </Row>
        <label className="flex min-h-[24px] w-fit cursor-pointer items-center gap-[10px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
          <input
            type="checkbox"
            checked={form.current}
            onChange={(e) => {
              log('current toggled', e.target.checked);
              set({ current: e.target.checked });
            }}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={classNames(
              'flex size-[20px] shrink-0 items-center justify-center rounded-[6px] border-2 border-solid peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-green',
              form.current
                ? 'border-[#387440] bg-[#387440] text-white'
                : 'border-[#babab7] bg-white'
            )}
          >
            {form.current ? <WorkCheckIcon className="size-[16px]" /> : null}
          </span>
          I currently work here
        </label>

        <SectionEyebrow>WHAT YOU DID AND ACHIEVED</SectionEyebrow>
        <Field
          label="Description"
          counter={`${form.description.length} / 400`}
          htmlFor={`${rid}-d`}
        >
          <textarea
            id={`${rid}-d`}
            value={form.description}
            maxLength={400}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Lead with your biggest win. What did you build or improve, and what changed because of it?"
            className={classNames(
              INPUT_BASE,
              'h-[110px] resize-none pt-[14px] pr-[16px] pb-[13px] pl-[20px]'
            )}
          />
        </Field>

        {isEdit ? (
          <div className="flex flex-wrap items-center gap-[8px]">
            <span className="font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
              Tools
            </span>
            {form.tools.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] py-[6px] pr-[10px] pl-[12px] font-sans text-[13px] leading-[16px] font-semibold text-[#2a5730] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]"
              >
                {t}
                <button
                  type="button"
                  aria-label={`Remove ${t}`}
                  onClick={() => set({ tools: form.tools.filter((x) => x !== t) })}
                  className="flex size-[24px] -m-[4px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#387440]"
                >
                  <WorkCloseIcon className="size-[15px]" />
                </button>
              </span>
            ))}
            {addingTool ? (
              <input
                autoFocus
                aria-label="Tool name"
                value={toolDraft}
                onChange={(e) => setToolDraft(e.target.value)}
                onBlur={addTool}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTool();
                  } else if (e.key === 'Escape') {
                    e.stopPropagation();
                    setToolDraft('');
                    setAddingTool(false);
                  }
                }}
                className="h-[30px] w-[110px] rounded-full border border-solid border-[#e7e7e7] bg-white px-[12px] font-sans text-[13px] outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setAddingTool(true)}
                className="inline-flex min-h-[30px] cursor-pointer items-center gap-[5px] rounded-full border border-solid border-[#e7e7e7] bg-transparent py-[6px] pr-[12px] pl-[10px] font-sans text-[13px] leading-[16px] font-medium text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                <WorkPlusDuoIcon className="size-[13px] text-[#387440]" />
                Add tool
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-[6px] rounded-[14px] border border-solid border-[#eedeb8] bg-[#faf4e8] px-[16px] py-[14px]">
            <div className="flex items-center gap-[8px]">
              <WorkBulbIcon className="size-[16px] text-[#387440]" />
              <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                Patterns that get read
              </span>
            </div>
            {[
              '•  Built [what] for [who] that [result with a number]',
              '•  Cut [metric] by [%] by [how]',
              '•  Led [N] people to deliver [project] on time',
            ].map((line) => (
              <span
                key={line}
                className="font-mono text-[13px] leading-[17px] text-[#1c2a21] max-lg:text-[13px]"
              >
                {line}
              </span>
            ))}
          </div>
        )}

        {isEdit && (dirty || showUnsaved) ? (
          <div
            role="status"
            className="flex items-center gap-[8px] rounded-[12px] bg-[#faf4e8] px-[14px] py-[10px]"
          >
            <WorkInfoIcon className="size-[16px] shrink-0 text-[#387440]" />
            <span className="font-sans text-[13px] leading-[16px] font-medium text-[#785910]">
              You have unsaved changes. Save before you leave.
            </span>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-[12px] pt-[8px]">
          {isEdit ? (
            <button
              type="button"
              onClick={() => onDelete(role.id)}
              className="mr-auto inline-flex min-h-[24px] cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#902b20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <WorkTrashIcon className="size-[16px] text-[#387440]" />
              Delete this role
            </button>
          ) : null}
          <Button variant="tertiary-subtle" size="lg" onClick={onClose} className="!py-[14px]">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            rightIcon={<WorkArrowRightIcon className="size-full" />}
          >
            {isEdit ? 'Save changes' : 'Save role'}
          </Button>
        </div>
      </form>
    </DialogShell>
  );
};

/* ---------- Delete role ---------- */
export const DeleteDialog = ({ role, count, onClose, onDelete, onEdit }) => {
  const left = count - 1;
  return (
    <DialogShell
      labelledBy="work-del-title"
      describedBy="work-del-sub"
      onClose={onClose}
      maxWidth={620}
      initialFocus={null}
    >
      <CloseButton onClick={onClose} className="top-[24px] right-[24px]" />
      <div className={classNames('flex flex-col gap-[20px]', BODY_PAD)}>
        <DialogHeader
          chip="Delete role"
          chipTone="grey"
          titleId="work-del-title"
          lead="Delete this "
          accent="role?"
          subId="work-del-sub"
          sub="It disappears from your profile straight away. This can’t be undone."
        />
        <div className="flex items-center gap-[12px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f7f8f4] py-[14px] pr-[14px] pl-[16px]">
          <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]">
            <WorkWorkIcon className="size-[20px] text-[#387440]" />
          </span>
          <span className="flex min-w-0 flex-col gap-[2px]">
            <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {role.title}
            </span>
            <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
              {previewMeta(role)}
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-[8px]">
          <SectionEyebrow>WHAT HAPPENS</SectionEyebrow>
          {[
            'Removed from your card and recruiter search',
            `Your Work stage drops to ${left} ${left === 1 ? 'role' : 'roles'}`,
            'Endorsements linked to this role are removed',
          ].map((t) => (
            <span
              key={t}
              className="flex items-center gap-[8px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]"
            >
              <span aria-hidden="true" className="size-[7px] shrink-0 rounded-full bg-[#c0392b]" />
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-[12px] rounded-[14px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[16px] pl-[14px]">
          <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#c8951a]">
            <WorkEditDuoIcon className="size-[17px] text-white" />
          </span>
          <span className="flex min-w-0 flex-col gap-[2px]">
            <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
              Just need to fix something?
            </span>
            <span className="font-sans text-[13px] leading-[19px] text-[#595959]">
              Wrong title, dates or description? Editing keeps the role and any recruiter activity
              on it.
            </span>
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-[12px] pt-[8px]">
          <Button variant="tertiary-subtle" size="lg" onClick={onEdit} className="!py-[14px]">
            Edit instead
          </Button>
          <Button variant="danger" size="md" onClick={() => onDelete(role.id)}>
            Delete role
          </Button>
        </div>
      </div>
    </DialogShell>
  );
};

/* ---------- Stage complete ---------- */
const STAT_TONES = [
  { bg: 'bg-[#f7f8f4]', fg: 'text-[#1c2a21]', label: 'STAGES DONE', key: 'stagesDone' },
  { bg: 'bg-[#e8f2ed]', fg: 'text-[#165d3a]', label: 'PROFILE', key: 'profile' },
  { bg: 'bg-[#faf4e8]', fg: 'text-[#785910]', label: 'EARNED', key: 'earned' },
];

export const CompleteDialog = ({ roleCount, yearsLabel, onStay, onNext }) => {
  const { uiStyle } = useUiStyle();
  return (
    <DialogShell
      labelledBy="work-done-title"
      describedBy="work-done-sub"
      onClose={onStay}
      maxWidth={560}
      pad={28}
      initialFocus={null}
    >
      <div className="relative h-[176px] overflow-hidden rounded-t-[26px] bg-[radial-gradient(280px_63px_at_50%_50%,#e1eae2_0%,#ffffff_100%)] max-sm:bg-[radial-gradient(200px_63px_at_50%_50%,#e1eae2_0%,#ffffff_100%)]">
        {COMPLETE_CONFETTI.map(([x, y, w, h, rot, color, op]) => (
          <span
            key={`${x}-${y}`}
            aria-hidden="true"
            className="absolute rounded-[2px] max-sm:hidden"
            style={{
              left: x - w / 2,
              top: y - h / 2,
              width: w,
              height: h,
              background: color,
              opacity: op,
              transform: `rotate(${rot}deg)`,
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute top-[40px] left-1/2 flex -translate-x-1/2 items-center">
        <span
          className={classNames(
            'relative flex size-[100px] items-center justify-center rounded-full bg-[#387440]',
            CARD
          )}
        >
          <WorkWorkIcon className="size-[44px] text-white" />
        </span>
      </div>
      <Sticker rotate={8} className="absolute top-[18px] left-[calc(50%+16px)] ml-[56px]">
        STAGE 5 DONE
      </Sticker>
      <Star color="text-[#ffd86b]" className="top-[50px] left-[calc(50%-90px)] size-[18px]" />
      <CloseButton onClick={onStay} size={36} className="top-[20px] right-[16px]" />
      <div className="flex flex-col gap-[18px] px-[clamp(16px,2vw,32px)] pt-[18px] pb-[28px]">
        <div className="flex flex-col items-center gap-[8px] text-center">
          <span className={classNames(EYEBROW, 'text-[#387440]')}>STAGE 5 OF 9 COMPLETE</span>
          <AccentTitle
            as="h2"
            id="work-done-title"
            lead="Work history, "
            accent="done."
            className="text-[clamp(26px,2.03vw,35px)] leading-[1.19]"
          />
          <p id="work-done-sub" className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
            {roleCount} roles and {yearsLabel} years of experience. You now show up when recruiters
            filter by experience and industry.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-[10px] max-sm:grid-cols-1">
          {STAT_TONES.map((s) => {
            const raw = COMPLETE_STATS[s.key];
            const value =
              typeof raw === 'string' ? raw : raw[uiStyle === 'playful' ? 'playful' : 'focused'];
            return (
              <div
                key={s.key}
                className={classNames(
                  'flex flex-col items-center gap-[2px] rounded-[16px] px-[8px] py-[12px]',
                  s.bg,
                  CARD
                )}
              >
                <span
                  className={classNames(
                    'font-sans text-[23px] leading-[29px] font-semibold',
                    s.fg,
                    DISPLAY
                  )}
                >
                  {value}
                </span>
                <span className="font-sans text-[10px] leading-[12px] font-semibold tracking-[1px] text-[#595959] max-lg:text-[12px]">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-[4px]">
          <SectionEyebrow>WHAT YOU JUST UNLOCKED</SectionEyebrow>
          {[
            {
              Icon: WorkSearchIcon,
              title: 'Experience filters',
              sub: 'Recruiters searching for 1–3 years of experience can now find you.',
            },
            {
              Icon: WorkBoltIcon,
              title: 'Skill suggestions',
              sub: 'TypeScript and Django from your roles are ready to verify in Skills Lab.',
            },
          ].map((u) => {
            const Glyph = u.Icon;
            return (
              <div key={u.title} className="flex items-center gap-[14px] py-[10px]">
                <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]">
                  <Glyph className="size-[24px] text-[#387440]" />
                </span>
                <span className="flex min-w-0 flex-col gap-[2px]">
                  <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                    {u.title}
                  </span>
                  <span className="font-sans text-[13px] leading-[18px] text-[#595959]">
                    {u.sub}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-[12px] max-sm:grid-cols-1">
          <Button variant="tertiary-subtle" size="lg" onClick={onStay} className="w-full">
            Stay here
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={onNext}
            className="w-full"
            rightIcon={<WorkArrowRightIcon className="size-full" />}
          >
            Next: Portfolio
          </Button>
        </div>
      </div>
    </DialogShell>
  );
};
