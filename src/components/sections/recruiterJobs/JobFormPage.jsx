import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import JobFormFields from './JobFormFields.jsx';
import { Field, Select, TextBox, CheckRow } from './jobFormControls.jsx';
import { JobButton } from './jobButtons.jsx';
import { BackCrumb, FlowBanner, FlowHeading, PageFrame } from './jobFlowParts.jsx';
import {
  PublishingDialog,
  SaveTemplateDialog,
  ConfirmSaveDialog,
  VisibilityGroup,
} from './jobFlowDialogs.jsx';
import {
  CheckCircle,
  FileGlyph,
  InfoCircle,
  SaveGlyph,
  WarnTriangle,
  BellGlyph,
} from './jobIcons.jsx';
import {
  BLANK_FORM,
  BUILD_TEMPLATE,
  CATEGORIES,
  CREATE_JOB,
  EDIT_POSTING,
  JUNIOR_FRONTEND,
  PRODUCT_DESIGNER,
  SENIOR_UX,
} from './jobFormData.js';

const log = debug('JobFormPage');

/*
 * JobFormPage — "Create job" (mode 'job'), "Build a template" ('template') and "Edit posting" ('edit').
 * Figma "Recruiter - Job Postings" 10103:59491. URL state (mock data, no route guards):
 *   /recruiter/job-postings/new?template=product-designer          JT-03 pre-filled      (no `template` = blank form)
 *     &menu=employment | location (&q=Acc) | screening               JT-04 / JT-05 / JT-06 dropdown open
 *     &state=errors                                                  JT-07 validation errors (Publish job with bad data writes the same key)
 *     &state=publishing                                              JT-09 processing dialog (Publish job runs it, then opens the success dialog on the postings page)
 *   /recruiter/job-templates/new                                     CT-01 blank builder;  ?state=filled  CT-02
 *     &modal=save                                                    CT-03 save dialog;  &menu=category  CT-04;  &state=name-taken  CT-05
 *   /recruiter/job-postings/:id/edit                                 JM-03 edit a live posting;  ?modal=confirm  JM-04
 * Everything the user does writes the same keys, so reload, deep-link and back all work.
 */
const toNumber = (text) => Number(String(text ?? '').replace(/[^0-9.]/g, '')) || 0;

const validate = (values, mode) => {
  const errors = {};
  if (toNumber(values.min) > toNumber(values.max) && toNumber(values.max) > 0) {
    errors.pay = `Minimum can’t be higher than maximum (GHS ${values.max})`;
  }
  if (mode === 'job' && !values.deadline.trim()) errors.deadline = CREATE_JOB.errors.deadline;
  return errors;
};

const seedFor = (mode, params, routeId) => {
  if (mode === 'edit') return { ...SENIOR_UX };
  if (mode === 'template') {
    const filled = params.get('state') === 'filled' || params.get('modal') === 'save';
    return filled
      ? { ...JUNIOR_FRONTEND, templateName: JUNIOR_FRONTEND.title, includeScreening: true }
      : { ...BLANK_FORM, templateName: '', category: '', includeScreening: false };
  }
  if (params.get('template') === 'product-designer' || routeId === 'product-designer') {
    const base = { ...PRODUCT_DESIGNER };
    if (params.get('state') === 'errors') return { ...base, min: '12,000', deadline: '' };
    return base;
  }
  return { ...BLANK_FORM };
};

const Aside = ({ className, children }) => (
  <aside
    className={classNames(
      'flex min-w-0 flex-col gap-[16px] lg:sticky lg:top-[24px] lg:self-start',
      className
    )}
  >
    {children}
  </aside>
);

const AsideCard = ({ children, className }) => (
  <div
    className={classNames(
      'flex flex-col gap-[16px] rounded-[16px] border border-solid border-[#e1eae2] bg-white p-[20px]',
      className
    )}
  >
    {children}
  </div>
);

const Eyebrow = ({ children }) => (
  <span className="font-sans text-[12px] leading-[16px] font-semibold tracking-[0.4px] text-[#575755]">
    {children}
  </span>
);

const JobAside = ({ values, errors, onPublish, onPreview, onDraft }) => {
  const a = CREATE_JOB.aside;
  const bad = new Set(Object.keys(errors).length ? CREATE_JOB.errors.checklistBad : []);
  return (
    <Aside>
      <AsideCard>
        <Eyebrow>{a.status}</Eyebrow>
        <h2 className="m-0 font-heading text-[22px] leading-[26px] font-semibold tracking-[-0.44px] text-[#111]">
          {values.title || 'Untitled job'}
        </h2>
        <span className="inline-flex w-fit items-center gap-[6px] rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12px] leading-[16px] font-medium text-[#2a5730]">
          <FileGlyph size={12} />
          {a.fromTemplate}
        </span>
        <div className="flex flex-col gap-[12px]">
          <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
            {a.checklistTitle}
          </span>
          <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
            {a.checklist.map((item) => {
              const isBad = bad.has(item);
              return (
                <li
                  key={item}
                  className={classNames(
                    'flex items-center gap-[8px] font-sans text-[14px] leading-[20px]',
                    isBad ? 'text-[#c0392b]' : 'text-[#111]'
                  )}
                >
                  {isBad ? (
                    <InfoCircle size={16} />
                  ) : (
                    <CheckCircle size={16} className="text-[#2a5730]" />
                  )}
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex flex-col gap-[12px]">
          <JobButton onClick={onPublish} className="w-full">
            {a.publish}
          </JobButton>
          <JobButton tone="ghost" onClick={onPreview} className="w-full">
            {a.preview}
          </JobButton>
          <button
            type="button"
            onClick={onDraft}
            className="inline-flex cursor-pointer items-center justify-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[20px] font-medium text-[#387440]"
          >
            <SaveGlyph size={14} />
            {a.draft}
          </button>
        </div>
      </AsideCard>
      <div className="rounded-[16px] bg-[#faf4e8] p-[20px]">
        <div className="flex flex-col gap-[6px]">
          <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
            {a.tipTitle}
          </span>
          <p className="m-0 font-sans text-[12px] leading-[16px] text-[#575755]">{a.tip}</p>
        </div>
      </div>
    </Aside>
  );
};

const TemplateAside = ({
  values,
  set,
  menu,
  setMenu,
  visibility,
  setVisibility,
  onSave,
  onPreview,
}) => {
  const a = BUILD_TEMPLATE.aside;
  const ready = Boolean(values.title.trim());
  return (
    <Aside>
      <AsideCard className="gap-[18px]">
        <Eyebrow>{a.eyebrow}</Eyebrow>
        <Field label={a.nameLabel} required htmlFor="side-tpl-name">
          <TextBox
            id="side-tpl-name"
            value={values.templateName}
            placeholder={a.namePlaceholder}
            onChange={(v) => set('templateName', v)}
          />
        </Field>
        <Field label={a.categoryLabel} required htmlFor="side-tpl-category">
          <Select
            id="side-tpl-category"
            value={values.category}
            placeholder={a.categoryPlaceholder}
            groups={[{ items: CATEGORIES.map((c) => ({ value: c, label: c })) }]}
            open={menu === 'category-side'}
            onOpenChange={(next) => setMenu(next ? 'category-side' : '')}
            onChange={(v) => set('category', v)}
          />
        </Field>
        <VisibilityGroup visibility={visibility} setVisibility={setVisibility} compact />
        <hr className="m-0 h-px w-full border-0 bg-[#e1eae2]" />
        <CheckRow
          checked={values.includeScreening}
          onChange={(v) => set('includeScreening', v)}
          label={a.includeScreening}
        />
        <div className="flex flex-col gap-[12px]">
          <JobButton onClick={onSave} disabled={!ready} className="w-full">
            {a.save}
          </JobButton>
          <JobButton tone="ghost" onClick={onPreview} className="w-full">
            {a.preview}
          </JobButton>
          {ready ? null : (
            <p className="m-0 text-center font-sans text-[12px] leading-[16px] text-[#575755]">
              {a.hint}
            </p>
          )}
        </div>
      </AsideCard>
    </Aside>
  );
};

const EditAside = ({ onSave, onCancel }) => {
  const a = EDIT_POSTING.aside;
  return (
    <Aside>
      <AsideCard>
        <Eyebrow>{a.title}</Eyebrow>
        <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
          {a.changes.map((change) => (
            <li key={change.label} className="flex items-start gap-[8px]">
              <span className={change.notify ? 'text-[#c8951a]' : 'text-[#2a5730]'}>
                {change.notify ? <BellGlyph size={14} /> : <CheckCircle size={14} />}
              </span>
              <div className="flex flex-col">
                <span className="font-sans text-[12px] leading-[16px] font-medium text-[#111]">
                  {change.label}
                </span>
                <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                  {change.note}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-[12px]">
          <JobButton onClick={onSave} className="w-full">
            {a.save}
          </JobButton>
          <JobButton tone="ghost" onClick={onCancel} className="w-full">
            {a.cancel}
          </JobButton>
        </div>
        <p className="m-0 text-center font-sans text-[12px] leading-[16px] text-[#575755]">
          {a.foot}
        </p>
      </AsideCard>
    </Aside>
  );
};

const JobFormPage = ({ mode = 'job' }) => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { postingId } = useParams();
  const [values, setValues] = useState(() => seedFor(mode, params, ''));
  const [visibility, setVisibility] = useState('team');
  const [notify, setNotify] = useState(true);
  const [ask, setAsk] = useState(false);
  const timers = useRef([]);
  const [step, setStep] = useState(1);

  const update = useCallback(
    (patch) => {
      const next = new URLSearchParams(window.location.search);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === null || value === '' || value === undefined) next.delete(key);
        else next.set(key, value);
      });
      log('url', Object.fromEntries(next));
      setParams(next, { replace: true });
    },
    [setParams]
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const set = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (
      key === 'templateName' &&
      new URLSearchParams(window.location.search).get('state') === 'name-taken'
    ) {
      update({ state: null });
    }
  };
  const menu = params.get('menu') ?? '';
  const modal = params.get('modal') ?? '';
  const state = params.get('state') ?? '';
  const query = params.get('q') ?? '';
  const setMenu = (key) => update({ menu: key || null, q: key === 'location' ? query : null });
  const errors = state === 'errors' ? validate(values, mode) : {};

  const publish = () => {
    const found = validate(values, mode);
    if (Object.keys(found).length) {
      log('publish blocked', found);
      update({ state: 'errors', menu: null });
      return;
    }
    log('publish start');
    update({ state: 'publishing', menu: null });
    setStep(0);
    timers.current.push(setTimeout(() => setStep(1), 900));
    timers.current.push(setTimeout(() => setStep(2), 1800));
    timers.current.push(
      setTimeout(() => navigate('/recruiter/job-postings?toast=published&modal=published'), 2700)
    );
  };

  const nameTaken = state === 'name-taken';
  const saveTemplate = () => {
    if (nameTaken) {
      log('save template blocked: name already used', values.templateName);
      return;
    }
    navigate('/recruiter/job-templates?mine=1&toast=saved');
  };

  const isTemplate = mode === 'template';
  const isEdit = mode === 'edit';
  const backTo = isEdit
    ? `/recruiter/job-postings/${postingId ?? 'senior-ux-designer'}`
    : '/recruiter/job-templates';

  const previewTo = '/recruiter/job-postings/new/preview';

  return (
    <PageFrame>
      <BackCrumb
        to={backTo}
        label={isEdit ? EDIT_POSTING.back : (isTemplate ? BUILD_TEMPLATE : CREATE_JOB).back}
        crumb={isEdit ? EDIT_POSTING.crumb : (isTemplate ? BUILD_TEMPLATE : CREATE_JOB).crumb}
      />
      {isEdit ? (
        <FlowHeading
          lead={EDIT_POSTING.titleLead}
          accent={EDIT_POSTING.titleAccent}
          subtitle={EDIT_POSTING.subtitle}
        />
      ) : isTemplate ? (
        <FlowHeading
          lead={BUILD_TEMPLATE.titleLead}
          accent={BUILD_TEMPLATE.titleAccent}
          subtitle={BUILD_TEMPLATE.subtitle}
        />
      ) : (
        <FlowHeading
          lead={CREATE_JOB.titleLead}
          accent={CREATE_JOB.titleAccent}
          subtitle={CREATE_JOB.subtitle}
        />
      )}

      {isEdit ? (
        <FlowBanner
          tone="warning"
          icon={<WarnTriangle size={18} />}
          title={EDIT_POSTING.warning.title}
          body={EDIT_POSTING.warning.body}
        />
      ) : isTemplate ? (
        <FlowBanner
          tone="info"
          icon={<InfoCircle size={18} />}
          title={BUILD_TEMPLATE.banner.title}
          body={BUILD_TEMPLATE.banner.body}
        />
      ) : Object.keys(errors).length ? (
        <FlowBanner
          tone="danger"
          icon={<InfoCircle size={18} />}
          title={CREATE_JOB.errorBanner.title}
          body={CREATE_JOB.errorBanner.body}
        />
      ) : values.title ? (
        <FlowBanner
          tone="success"
          icon={<CheckCircle size={18} />}
          title={CREATE_JOB.banner.title}
          body={CREATE_JOB.banner.body}
          action={
            <button
              type="button"
              onClick={() => setValues(seedFor(mode, params, 'product-designer'))}
              className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[20px] font-medium whitespace-nowrap text-[#387440]"
            >
              {CREATE_JOB.banner.reset}
            </button>
          }
        />
      ) : null}

      <div className="grid items-start gap-[24px] lg:grid-cols-[minmax(0,925px)_minmax(300px,380px)]">
        <JobFormFields
          values={values}
          set={set}
          variant={mode === 'job' ? 'job' : mode}
          menu={menu}
          setMenu={setMenu}
          errors={errors}
          query={query}
          setQuery={(q) => update({ q: q || null })}
        />
        {isEdit ? (
          <EditAside
            onSave={() => update({ modal: 'confirm' })}
            onCancel={() => navigate(backTo)}
          />
        ) : isTemplate ? (
          <TemplateAside
            values={values}
            set={set}
            menu={menu}
            setMenu={setMenu}
            visibility={visibility}
            setVisibility={setVisibility}
            onSave={() => update({ modal: 'save' })}
            onPreview={() => navigate(previewTo)}
          />
        ) : (
          <JobAside
            values={values}
            errors={errors}
            onPublish={publish}
            onPreview={() => navigate(previewTo)}
            onDraft={() => navigate('/recruiter/job-postings?status=draft')}
          />
        )}
      </div>

      {state === 'publishing' ? (
        <PublishingDialog step={step} onClose={() => update({ state: null })} />
      ) : null}
      {isTemplate && modal === 'save' ? (
        <SaveTemplateDialog
          values={values}
          set={set}
          menu={menu}
          setMenu={setMenu}
          nameTaken={nameTaken}
          visibility={visibility}
          setVisibility={setVisibility}
          onCancel={() => update({ modal: null, menu: null, state: null })}
          onSave={saveTemplate}
        />
      ) : null}
      {isEdit && modal === 'confirm' ? (
        <ConfirmSaveDialog
          notify={notify}
          setNotify={setNotify}
          ask={ask}
          setAsk={setAsk}
          onKeep={() => update({ modal: null })}
          onSave={() =>
            navigate(`/recruiter/job-postings/${postingId ?? 'senior-ux-designer'}?saved=1`)
          }
        />
      ) : null}
    </PageFrame>
  );
};

export default JobFormPage;
