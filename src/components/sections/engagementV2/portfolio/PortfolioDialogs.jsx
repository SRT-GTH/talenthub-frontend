import { useEffect, useMemo, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { useUiStyle } from '../../../../hooks/useUiStyle.js';
import { MilestoneTrophyIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';
import FlowPortal from '../../talentHome/FlowPortal.jsx';
import { AccentTitle, SectionEyebrow, Sticker, Star } from './PortfolioParts.jsx';
import {
  COMPLETE_CONFETTI,
  COMPLETE_STATS,
  MAX_DESCRIPTION,
  PROJECT_TYPES,
  hostLabel,
} from './portfolioData.js';
import { CARD, DISPLAY, EYEBROW, FOCUS } from './portfolioStyles.js';
import {
  PortfolioArrowRightIcon,
  PortfolioCheckIcon,
  PortfolioChevronIcon,
  PortfolioCloseIcon,
  PortfolioEditDuoIcon,
  PortfolioFolderDuoIcon,
  PortfolioImageDuoIcon,
  PortfolioImagePlusDuoIcon,
  PortfolioSearchDuoIcon,
  PortfolioTrashIcon,
} from './portfolioIcons.jsx';

const log = debug('PortfolioDialogs');

const INPUT_SHADOW =
  'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';
const INPUT_BASE = classNames(
  'box-border w-full rounded-[10px] border border-solid border-[#cccccc] bg-white font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] outline-none placeholder:font-normal placeholder:text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
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
      'absolute z-10 flex cursor-pointer items-center justify-center rounded-full border-0 bg-[#f3f3ef] p-0 text-[#387440]',
      FOCUS,
      className
    )}
  >
    <PortfolioCloseIcon className={size === 40 ? 'size-[20px]' : 'size-[18px]'} />
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

const fileSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;

/* ---------- Add / Edit project ---------- */
const emptyForm = {
  title: '',
  type: '',
  year: '',
  role: '',
  description: '',
  link1: '',
  link2: '',
  pin: false,
  cover: null,
};

const toForm = (p) => ({
  title: p.title,
  type: p.type,
  year: p.year,
  role: p.role,
  description: p.description || '',
  link1: p.links?.[0]?.url || '',
  link2: p.links?.[1]?.url || '',
  pin: Boolean(p.pinned),
  cover: p.cover ? { ...p.cover } : null,
});

/*
 * `live` (signed-in): the profile stores no project type, role or second link, so type / role turn optional and the
 * second link field is hidden (see projectToProfile in portfolioData.js).
 */
export const ProjectDialog = ({ mode, project, onClose, onSave, onDelete, live = false }) => {
  const isEdit = mode === 'edit';
  const initial = useMemo(
    () => (isEdit && project ? toForm(project) : emptyForm),
    [isEdit, project]
  );
  const [form, setForm] = useState(initial);
  const [invalid, setInvalid] = useState({});
  const refs = useRef({});
  const fileRef = useRef(null);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const pinnedLocked = isEdit && project?.pinned;

  useEffect(() => {
    log('mount', { mode, projectId: project?.id });
  }, [mode, project?.id]);

  useEffect(
    () => () => {
      if (form.cover?.previewUrl) URL.revokeObjectURL(form.cover.previewUrl);
    },
    [form.cover?.previewUrl]
  );

  const pickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    log('cover picked', { name: file.name, size: file.size, type: file.type });
    set({
      cover: { name: file.name, size: fileSize(file.size), previewUrl: URL.createObjectURL(file) },
    });
    e.target.value = '';
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = {
      title: !form.title.trim(),
      type: !live && !form.type,
      year: !form.year.trim(),
      role: !live && !form.role.trim(),
    };
    const first = Object.keys(errs).find((k) => errs[k]);
    log('submit', { mode, errs });
    if (first) {
      setInvalid(errs);
      refs.current[first]?.focus();
      return;
    }
    const links = (live ? [form.link1] : [form.link1, form.link2])
      .map((raw, i) => {
        const url = raw.trim();
        const prev = project?.links?.[i];
        if (url) return { label: prev && prev.url === url ? prev.label : hostLabel(url), url };
        return prev && !prev.url ? prev : null;
      })
      .filter(Boolean);
    onSave({
      id: project?.id ?? `p${Date.now()}`,
      title: form.title.trim(),
      type: form.type,
      year: form.year.trim(),
      role: form.role.trim(),
      description: form.description.trim(),
      tags: project?.tags ?? [],
      links,
      pinned: form.pin,
      cover: form.cover,
      icon: project?.icon ?? 'image',
    });
  };

  const rid = isEdit ? 'pf-edit' : 'pf-add';
  const words = (project?.title ?? '').split(' ');
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
            chip="Edit project"
            titleId={`${rid}-title`}
            lead={words.slice(0, -1).join(' ') + ' '}
            accent={words.slice(-1)[0]}
            subId={`${rid}-sub`}
            sub="Changes go live on your card when you save."
          />
        ) : (
          <DialogHeader
            chip="Add a project"
            titleId={`${rid}-title`}
            lead="New project. "
            accent="Show what you built."
            subId={`${rid}-sub`}
            sub="A cover, a name, your role and one result. Links make it real."
          />
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          tabIndex={-1}
          aria-label="Project cover image"
          onChange={pickFile}
        />
        {form.cover ? (
          <div className="flex items-center gap-[16px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f7f8f4] p-[18px] max-sm:flex-wrap">
            {form.cover.previewUrl ? (
              <img
                src={form.cover.previewUrl}
                alt=""
                className="h-[76px] w-[120px] shrink-0 rounded-[10px] border border-solid border-[rgba(28,42,33,0.1)] object-cover playful:border-[1.5px] playful:border-[#1c2a21]"
              />
            ) : (
              <span
                aria-hidden="true"
                className="h-[76px] w-[120px] shrink-0 rounded-[10px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#387440] playful:border-[1.5px] playful:border-[#1c2a21]"
              />
            )}
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span className="font-sans text-[15px] leading-[18px] font-semibold break-all text-[#1c2a21]">
                {form.cover.name} · {form.cover.size}
              </span>
              <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
                Shown on your card and in recruiter search
              </span>
            </span>
            <Button
              variant="tertiary-subtle"
              size="lg"
              onClick={() => fileRef.current?.click()}
              className="!py-[14px]"
            >
              Replace
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-[16px] rounded-[16px] border border-solid border-[#387440] bg-[#ebf1ec] p-[18px] playful:border-[1.5px] max-sm:flex-wrap">
            <span
              className={classNames(
                'flex size-[56px] shrink-0 items-center justify-center rounded-[16px] bg-white text-[#387440]',
                CARD
              )}
            >
              <PortfolioImagePlusDuoIcon className="size-[26px]" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                Drop a screenshot or image
              </span>
              <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
                PNG, JPG or WebP · up to 5 MB · optional but recommended
              </span>
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => fileRef.current?.click()}
              className="!py-[12px]"
            >
              Browse files
            </Button>
          </div>
        )}

        <Row>
          <Field label="Project name" required htmlFor={`${rid}-name`}>
            <input
              ref={(el) => {
                refs.current.title = el;
              }}
              id={`${rid}-name`}
              value={form.title}
              onChange={(e) => set({ title: e.target.value })}
              placeholder="e.g. Accra Bus Tracker"
              aria-required="true"
              aria-invalid={invalid.title || undefined}
              className={classNames(
                INPUT_BASE,
                'h-[51px] px-[16px] pl-[20px] font-medium',
                bad(invalid.title)
              )}
            />
          </Field>
          <Field label="Project type" required={!live} optional={live} htmlFor={`${rid}-type`}>
            <div className="relative">
              <select
                ref={(el) => {
                  refs.current.type = el;
                }}
                id={`${rid}-type`}
                value={form.type}
                onChange={(e) => set({ type: e.target.value })}
                aria-required={!live}
                aria-invalid={invalid.type || undefined}
                className={classNames(
                  INPUT_BASE,
                  'h-[51px] cursor-pointer appearance-none pr-[48px] pl-[20px] font-medium',
                  bad(invalid.type)
                )}
              >
                <option value="">Select a type</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <PortfolioChevronIcon className="pointer-events-none absolute top-1/2 right-[16px] h-[19px] w-[20px] -translate-y-1/2 text-[#387440]" />
            </div>
          </Field>
        </Row>
        <Row>
          <Field label="Year" required htmlFor={`${rid}-year`}>
            <input
              ref={(el) => {
                refs.current.year = el;
              }}
              id={`${rid}-year`}
              value={form.year}
              onChange={(e) => set({ year: e.target.value })}
              placeholder="e.g. 2024"
              inputMode="numeric"
              aria-required="true"
              aria-invalid={invalid.year || undefined}
              className={classNames(
                INPUT_BASE,
                'h-[51px] px-[16px] pl-[20px] font-medium',
                bad(invalid.year)
              )}
            />
          </Field>
          <Field label="Your role" required={!live} optional={live} htmlFor={`${rid}-role`}>
            <input
              ref={(el) => {
                refs.current.role = el;
              }}
              id={`${rid}-role`}
              value={form.role}
              onChange={(e) => set({ role: e.target.value })}
              placeholder="e.g. Solo developer, Lead UX designer"
              aria-required={!live}
              aria-invalid={invalid.role || undefined}
              className={classNames(
                INPUT_BASE,
                'h-[51px] px-[16px] pl-[20px] font-medium',
                bad(invalid.role)
              )}
            />
          </Field>
        </Row>
        <Field
          label="What you did and the result"
          counter={`${form.description.length} / ${MAX_DESCRIPTION}`}
          htmlFor={`${rid}-desc`}
        >
          <textarea
            id={`${rid}-desc`}
            value={form.description}
            maxLength={MAX_DESCRIPTION}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="The problem, what you built, and one result with a number."
            className={classNames(
              INPUT_BASE,
              'h-[96px] resize-none pt-[14px] pr-[16px] pb-[13px] pl-[20px] font-normal text-[#595959]'
            )}
          />
        </Field>
        <Row>
          <Field label="Link 1" optional htmlFor={`${rid}-l1`}>
            <input
              id={`${rid}-l1`}
              value={form.link1}
              onChange={(e) => set({ link1: e.target.value })}
              placeholder="Live demo, GitHub, Figma, Behance…"
              className={classNames(
                INPUT_BASE,
                'h-[51px] px-[16px] pl-[20px] font-normal text-[#595959]'
              )}
            />
          </Field>
          {live ? null : (
            <Field label="Link 2" optional htmlFor={`${rid}-l2`}>
              <input
                id={`${rid}-l2`}
                value={form.link2}
                onChange={(e) => set({ link2: e.target.value })}
                placeholder="Another link"
                className={classNames(
                  INPUT_BASE,
                  'h-[51px] px-[16px] pl-[20px] font-normal text-[#595959]'
                )}
              />
            </Field>
          )}
        </Row>

        {pinnedLocked ? (
          <div
            className={classNames(
              'flex flex-wrap items-center justify-between gap-x-[12px] gap-y-[6px] rounded-[14px] bg-[#faf4e8] px-[14px] py-[12px]',
              CARD
            )}
          >
            <span className="inline-flex items-center gap-[10px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
              <span
                aria-hidden="true"
                className="flex size-[20px] items-center justify-center rounded-[6px] border border-solid border-[#387440] bg-[#387440] text-white playful:border-2"
              >
                <PortfolioCheckIcon className="size-[16px]" />
              </span>
              Pinned as my top project
            </span>
            <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
              Only one project can be pinned
            </span>
          </div>
        ) : (
          <label className="inline-flex w-fit cursor-pointer items-center gap-[10px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
            <input
              type="checkbox"
              checked={form.pin}
              onChange={(e) => set({ pin: e.target.checked })}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="flex size-[20px] shrink-0 items-center justify-center rounded-[6px] border-2 border-solid border-[#babab7] bg-white text-white peer-checked:border-[#387440] peer-checked:bg-[#387440] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-green"
            >
              {form.pin ? <PortfolioCheckIcon className="size-[16px]" /> : null}
            </span>
            Pin as my top project (shows first on my card)
          </label>
        )}

        <div className="flex flex-wrap items-center justify-end gap-[12px] pt-[8px]">
          {isEdit ? (
            <button
              type="button"
              onClick={() => onDelete(project.id)}
              className={classNames(
                'mr-auto inline-flex min-h-[24px] cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#902b20]',
                FOCUS
              )}
            >
              <PortfolioTrashIcon className="size-[16px] text-[#387440]" />
              Delete this project
            </button>
          ) : null}
          <Button variant="tertiary-subtle" size="lg" onClick={onClose} className="!py-[14px]">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            rightIcon={<PortfolioArrowRightIcon className="size-full" />}
          >
            {isEdit ? 'Save changes' : 'Save project'}
          </Button>
        </div>
      </form>
    </DialogShell>
  );
};

/* ---------- Delete project ---------- */
export const DeleteDialog = ({ project, count, onClose, onDelete, onEdit }) => {
  const left = count - 1;
  return (
    <DialogShell
      labelledBy="pf-del-title"
      describedBy="pf-del-sub"
      onClose={onClose}
      maxWidth={620}
      initialFocus={null}
    >
      <CloseButton onClick={onClose} className="top-[24px] right-[24px]" />
      <div className={classNames('flex flex-col gap-[20px]', BODY_PAD)}>
        <DialogHeader
          chip="Delete project"
          chipTone="grey"
          titleId="pf-del-title"
          lead="Delete this "
          accent="project?"
          subId="pf-del-sub"
          sub="It disappears from your profile straight away. This can’t be undone."
        />
        <div className="flex items-center gap-[12px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f7f8f4] py-[14px] pr-[14px] pl-[16px]">
          <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]">
            <PortfolioImageDuoIcon className="size-[20px] text-[#387440]" />
          </span>
          <span className="flex min-w-0 flex-col gap-[2px]">
            <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {project.title}
            </span>
            <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
              {[project.type, project.year, project.role].filter(Boolean).join(' · ')}
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-[8px]">
          <SectionEyebrow>WHAT HAPPENS</SectionEyebrow>
          {[
            'Removed from your card and recruiter search',
            `Your portfolio drops to ${left} ${left === 1 ? 'project' : 'projects'}`,
            'Its links stop showing on your profile',
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
            <PortfolioEditDuoIcon className="size-[17px] text-white" />
          </span>
          <span className="flex min-w-0 flex-col gap-[2px]">
            <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
              Just need to fix something?
            </span>
            <span className="font-sans text-[13px] leading-[19px] text-[#595959]">
              Wrong title, old description or a broken link? Editing keeps the project and its
              history.
            </span>
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-[12px] pt-[8px]">
          <Button variant="tertiary-subtle" size="lg" onClick={onEdit} className="!py-[14px]">
            Edit instead
          </Button>
          <Button variant="danger" size="md" onClick={() => onDelete(project.id)}>
            Delete project
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

export const CompleteDialog = ({ count, pinnedTitle, onStay, onMilestone }) => {
  const { uiStyle } = useUiStyle();
  const lead = pinnedTitle ? `${count} projects with ${pinnedTitle} pinned.` : `${count} projects.`;
  return (
    <DialogShell
      labelledBy="pf-done-title"
      describedBy="pf-done-sub"
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
              left: x,
              top: y,
              width: w,
              height: h,
              background: color,
              opacity: op,
              transform: `rotate(${rot}deg)`,
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute top-[42px] left-1/2 flex -translate-x-1/2 items-center">
        <span
          className={classNames(
            'relative flex size-[100px] items-center justify-center rounded-full bg-[#387440] text-white',
            CARD
          )}
        >
          <PortfolioFolderDuoIcon className="size-[44px]" />
        </span>
      </div>
      <Sticker rotate={8} className="absolute top-[20px] left-[300px] max-sm:left-[calc(50%+56px)]">
        STAGE 6 DONE
      </Sticker>
      <Star
        color="text-[#ffd86b]"
        className="top-[52px] left-[190px] size-[18px] max-sm:left-[calc(50%-90px)]"
      />
      <CloseButton onClick={onStay} size={36} className="top-[21px] right-[20px]" />
      <div className="flex flex-col gap-[18px] px-[clamp(16px,2vw,32px)] pt-[18px] pb-[28px]">
        <div className="flex flex-col items-center gap-[8px] text-center">
          <span className={classNames(EYEBROW, 'text-[#387440]')}>STAGE 6 OF 9 COMPLETE</span>
          <AccentTitle
            as="h2"
            id="pf-done-title"
            lead="Portfolio live. "
            accent="Top 20% unlocked."
            className="text-[clamp(26px,2.03vw,35px)] leading-[1.19]"
          />
          <p id="pf-done-sub" className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
            {lead} Six stages done, so the Top 20% badge is now on your card.
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
          <div className="flex items-center gap-[14px] py-[10px]">
            <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
              <PortfolioSearchDuoIcon className="size-[24px]" />
            </span>
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                Portfolio filter
              </span>
              <span className="font-sans text-[13px] leading-[18px] text-[#595959]">
                Recruiters filtering for “has portfolio” now see you, with your pinned project on
                the result card.
              </span>
            </span>
          </div>
          <div className="flex items-center gap-[14px] py-[10px]">
            <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]">
              <MilestoneTrophyIcon className="size-[19px]" />
            </span>
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                Top 20% milestone
              </span>
              <span className="font-sans text-[13px] leading-[18px] text-[#595959]">
                Badge on your card, higher in search, and leaderboards.
              </span>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[12px] max-sm:grid-cols-1">
          <Button variant="tertiary-subtle" size="lg" onClick={onStay} className="w-full">
            Stay here
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={onMilestone}
            className="w-full"
            rightIcon={<PortfolioArrowRightIcon className="size-full" />}
          >
            See your milestone
          </Button>
        </div>
      </div>
    </DialogShell>
  );
};
