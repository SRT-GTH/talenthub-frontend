import Modal from '../../ui/Modal.jsx';
import IconTileDialog from '../../ui/IconTileDialog.jsx';
import { classNames } from '../../../utils/classNames.js';
import { CheckRow, Field, Select, TextBox } from './jobFormControls.jsx';
import { JobButton } from './jobButtons.jsx';
import {
  ArrowRight,
  CheckCircle,
  ClockGlyph,
  LinkGlyph,
  PipelineGlyph,
  SaveGlyph,
  SendGlyph,
  SparkGlyph,
  SpinnerGlyph,
} from './jobIcons.jsx';
import {
  BUILD_TEMPLATE,
  CATEGORIES,
  EDIT_POSTING,
  NEW_CATEGORY_LABEL,
  PUBLISHED,
  PUBLISHING,
} from './jobFormData.js';
import { PlusGlyph } from './jobIcons.jsx';

/*
 * Dialogs of the recruiter job flows (Figma "Recruiter - Job Postings" 10103:59491).
 *   CenterDialog        — the centred confirm card: 44px icon tile, Bricolage 28/600 title, 14px body, children, footer (JT-09, JT-10, JM-04, JM-08, JM-12). 24px radius on the #0b1a0f 45 % scrim.
 *   PublishingDialog    — JT-09 "Publishing your job…" with the three-step progress.
 *   PublishedDialog     — JT-10 "Your job is live!" with the three next steps.
 *   SaveTemplateDialog  — CT-03 / CT-04 / CT-05: name, category (dropdown), visibility, include screening.
 *   SaveAsTemplateDialog— JM-06 "Save as a template" rename + what to include.
 *   ConfirmSaveDialog   — JM-04 "Save changes to a live posting?".
 *   PauseDialog / DeleteDraftDialog — JM-08 / JM-12.
 */
export const CenterDialog = ({
  icon,
  iconClassName = 'bg-[#ebf1ec] text-[#2a5730]',
  title,
  body,
  onClose,
  children,
  footer,
  widthClassName = '!max-w-[480px]',
}) => (
  <Modal
    isOpen
    onClose={onClose}
    size="sm"
    ariaLabel={title}
    showClose={false}
    scrollHint={false}
    className="!bg-[#0b1a0f]/45 !backdrop-blur-none"
    contentClassName={classNames(
      widthClassName,
      '!rounded-[24px] px-[32px] py-[32px] sm:!pb-[32px] shadow-[0_4px_0_0_rgba(0,0,0,0.13),0_40px_100px_0_rgba(0,0,0,0.25)] max-sm:!rounded-b-none max-sm:px-[20px]'
    )}
  >
    <div className="flex flex-col items-center gap-[16px] text-center">
      {icon ? (
        <span
          className={classNames(
            'flex size-[44px] items-center justify-center rounded-[10px]',
            iconClassName
          )}
        >
          {icon}
        </span>
      ) : null}
      <h2 className="m-0 font-heading text-[28px] leading-[34px] font-semibold tracking-[-0.56px] text-[#111]">
        {title}
      </h2>
      {body ? (
        <p className="m-0 font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
          {body}
        </p>
      ) : null}
      {children ? (
        <div className="flex w-full flex-col gap-[14px] text-left">{children}</div>
      ) : null}
      {footer ? (
        <div className="flex w-full flex-wrap items-center justify-center gap-[12px] pt-[4px] max-sm:flex-col">
          {footer}
        </div>
      ) : null}
    </div>
  </Modal>
);

const STEP_ICON = {
  done: <CheckCircle size={16} className="text-[#2a5730]" />,
  active: <SpinnerGlyph size={16} className="text-[#2a5730]" />,
  todo: <ClockGlyph size={16} className="text-[#babab7]" />,
};

export const PublishingDialog = ({ onClose, step = 1 }) => (
  <CenterDialog
    icon={<SendGlyph size={22} />}
    title={PUBLISHING.title}
    body={PUBLISHING.body}
    onClose={onClose}
    widthClassName="!max-w-[360px]"
  >
    <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
      {PUBLISHING.steps.map((s, index) => {
        const state = index < step ? 'done' : index === step ? 'active' : 'todo';
        return (
          <li
            key={s.label}
            className={classNames(
              'flex items-center gap-[8px] font-sans text-[12px] leading-[16px]',
              state === 'todo' ? 'text-[#575755]' : 'font-medium text-[#111]'
            )}
          >
            {STEP_ICON[state]}
            {s.label}
          </li>
        );
      })}
    </ul>
    <div
      role="progressbar"
      aria-label={PUBLISHING.title}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(((step + 0.5) / PUBLISHING.steps.length) * 100)}
      className="h-[6px] w-full overflow-hidden rounded-full bg-[#ebf1ec]"
    >
      <span
        className="block h-full rounded-full bg-[#387440]"
        style={{ width: `${((step + 0.5) / PUBLISHING.steps.length) * 100}%` }}
      />
    </div>
  </CenterDialog>
);

const NEXT_ICONS = { invite: SparkGlyph, share: LinkGlyph, track: PipelineGlyph };

export const PublishedDialog = ({ onBack, onView, onAction }) => (
  <CenterDialog
    icon={<CheckCircle size={22} />}
    title={PUBLISHED.title}
    body={PUBLISHED.body}
    onClose={onBack}
    widthClassName="!max-w-[560px]"
    footer={
      <>
        <JobButton tone="ghost" onClick={onBack}>
          {PUBLISHED.back}
        </JobButton>
        <JobButton onClick={onView}>{PUBLISHED.view}</JobButton>
      </>
    }
  >
    <span className="font-sans text-[12px] leading-[16px] font-semibold tracking-[0.4px] text-[#575755]">
      {PUBLISHED.nextLabel}
    </span>
    {PUBLISHED.next.map((row) => {
      const Icon = NEXT_ICONS[row.id];
      return (
        <div
          key={row.id}
          className="flex items-center justify-between gap-[12px] rounded-[12px] border border-solid border-[#e1eae2] bg-white px-[12px] py-[10px]"
        >
          <div className="flex min-w-0 items-center gap-[12px]">
            <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#ebf1ec] text-[#2a5730]">
              <Icon size={16} />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
                {row.title}
              </span>
              <span className="truncate font-sans text-[12px] leading-[16px] text-[#575755]">
                {row.body}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onAction?.(row.id)}
            className="inline-flex shrink-0 cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[12px] leading-[16px] font-medium text-[#2a5730]"
          >
            {row.action}
            <ArrowRight size={12} />
          </button>
        </div>
      );
    })}
  </CenterDialog>
);

export const SaveTemplateDialog = ({
  values,
  set,
  menu,
  setMenu,
  nameTaken,
  onCancel,
  onSave,
  visibility,
  setVisibility,
}) => {
  const d = BUILD_TEMPLATE.dialog;
  return (
    <IconTileDialog
      icon={<SaveGlyph size={22} />}
      title={d.title}
      body={d.body}
      onClose={onCancel}
      widthClassName="!max-w-[480px]"
      footer={
        <div className="flex items-center justify-end gap-[8px]">
          <JobButton tone="ghost" onClick={onCancel}>
            {d.cancel}
          </JobButton>
          <JobButton onClick={onSave}>{d.save}</JobButton>
        </div>
      }
    >
      <Field label={d.nameLabel} required htmlFor="tpl-name" error={nameTaken ? d.nameError : ''}>
        <TextBox
          id="tpl-name"
          value={values.templateName}
          error={nameTaken}
          onChange={(v) => set('templateName', v)}
        />
      </Field>
      <Field label={d.categoryLabel} required htmlFor="tpl-category">
        <Select
          id="tpl-category"
          value={values.category}
          groups={[{ items: CATEGORIES.map((c) => ({ value: c, label: c })) }]}
          footer={[{ id: 'new', label: NEW_CATEGORY_LABEL, icon: <PlusGlyph /> }]}
          open={menu === 'category'}
          onOpenChange={(next) => setMenu(next ? 'category' : '')}
          onChange={(v) => set('category', v)}
        />
      </Field>
      <VisibilityGroup visibility={visibility} setVisibility={setVisibility} />
      <CheckRow
        checked={values.includeScreening}
        onChange={(v) => set('includeScreening', v)}
        label={d.includeScreening}
        hint={d.includeScreeningHint}
      />
    </IconTileDialog>
  );
};

export const VisibilityGroup = ({ visibility, setVisibility, compact }) => {
  const a = BUILD_TEMPLATE.aside;
  const rows = [
    { id: 'me', label: a.onlyMe },
    { id: 'team', label: a.team, hint: a.teamHint },
  ];
  return (
    <div className="flex flex-col gap-[10px]" role="radiogroup" aria-label={a.visibilityLabel}>
      <span className="font-sans text-[14px] leading-[20px] font-medium text-[#111]">
        {a.visibilityLabel}
      </span>
      {rows.map((row) => {
        const on = visibility === row.id;
        return (
          <button
            key={row.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => setVisibility(row.id)}
            className={classNames(
              'flex cursor-pointer items-start gap-[10px] border-0 bg-transparent p-0 text-left',
              compact && 'gap-[8px]'
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                'mt-[1px] flex size-[18px] shrink-0 items-center justify-center rounded-full border border-solid',
                on ? 'border-[#387440]' : 'border-[#cccccc]'
              )}
            >
              {on ? <span className="size-[8px] rounded-full bg-[#387440]" /> : null}
            </span>
            <span className="flex flex-col">
              <span className="font-sans text-[14px] leading-[20px] text-[#111]">{row.label}</span>
              {row.hint ? (
                <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                  {row.hint}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export const SaveAsTemplateDialog = ({ copy, onClose, onSave, name, setName }) => (
  <IconTileDialog
    icon={<SaveGlyph size={22} />}
    title={copy.title}
    body={copy.body}
    onClose={onClose}
    widthClassName="!max-w-[480px]"
    footer={
      <div className="flex items-center justify-end gap-[8px]">
        <JobButton tone="ghost" onClick={onClose}>
          Cancel
        </JobButton>
        <JobButton onClick={onSave}>Save template</JobButton>
      </div>
    }
  >
    <Field label="Template name" required htmlFor="dup-name">
      <TextBox id="dup-name" value={name} onChange={setName} />
    </Field>
    <Field label="Category" required htmlFor="dup-category">
      <Select
        id="dup-category"
        value={copy.category}
        groups={[{ items: CATEGORIES.map((c) => ({ value: c, label: c })) }]}
        open={false}
        onOpenChange={() => {}}
      />
    </Field>
    <div className="flex flex-col gap-[10px]">
      <span className="font-sans text-[14px] leading-[20px] font-medium text-[#111]">
        {copy.includeLabel}
      </span>
      {copy.includes.map((row) => (
        <CheckRow key={row.label} checked label={row.label} hint={row.hint} />
      ))}
    </div>
  </IconTileDialog>
);

/* copy (live): { body, notify, notifyHint } replace the Figma wording (128 applicants, Silver Rock). */
export const ConfirmSaveDialog = ({ onKeep, onSave, notify, setNotify, ask, setAsk, copy }) => {
  const c = { ...EDIT_POSTING.confirm, ...(copy || {}) };
  return (
    <CenterDialog
      title={c.title}
      body={c.body}
      onClose={onKeep}
      widthClassName="!max-w-[520px]"
      footer={
        <>
          <JobButton tone="ghost" onClick={onKeep}>
            {c.keep}
          </JobButton>
          <JobButton onClick={onSave}>{c.save}</JobButton>
        </>
      }
    >
      <CheckRow checked={notify} onChange={setNotify} label={c.notify} hint={c.notifyHint} />
      <CheckRow checked={ask} onChange={setAsk} label={c.ask} />
    </CenterDialog>
  );
};
