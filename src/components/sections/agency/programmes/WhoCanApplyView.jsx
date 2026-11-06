import { useEffect, useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import {
  createProgramme,
  getProgramme,
  programmeAudience,
  programmeInsights,
  programmeSkills,
  updateProgramme,
} from '../../../../services/agency.api.js';
import {
  DEFAULT_RULES,
  TEMPLATES,
  findContactDetails,
  stripContactDetails,
} from '../data/programmesData.js';
import AudiencePreviewCard from './AudiencePreviewCard.jsx';
import EligibilityRules from './EligibilityRules.jsx';
import ProgrammeConfirmDialog from './ProgrammeConfirmDialog.jsx';
import ProgrammesHeader from './ProgrammesHeader.jsx';
import ProgrammeSelect from './ProgrammeSelect.jsx';
import { reloadProgrammes, useProgrammesStore } from './useProgrammesStore.js';

const log = debug('WhoCanApplyView');

/*
 * WhoCanApplyView — "Who can apply" (Figma 11.5.2a 8597:393686, 11.5.2h audience under 5 8610:402145, 11.5.2i policy block 8610:402716).
 * Server-backed:
 *   - the Programme select lists the agency's drafts and live programmes (GET /agency/programmes) plus "New programme";
 *     choosing one loads its form and rules (GET /agency/programmes/:id); ?template=<id> prefills a new one from a template.
 *   - "PROGRAMME DETAILS" (title, type, description, grant amount, closing date) — Figma does not draw the description editor,
 *     the server needs the text the talents read, so the form carries it.
 *   - the Audience preview is POST /agency/programmes/audience {rules} (debounced); under 5 matches prints "<5" and blocks "Save and continue".
 *   - "Save and continue" checks the description for contact details (same rule the server applies at publish: phone numbers, emails, links),
 *     saves the draft (POST / PATCH) and opens the talent preview (?view=preview&programme=<id>). "Save draft" saves and stays.
 *   - SUPPLY INSIGHTS: GET /agency/programmes/insights.
 * URL keys: programme=<id> · template=<id> · state=policy-block (the policy dialog).
 * Props: data (useAgencyState()).
 */

const NEW_ID = 'new';

const SectionLabel = ({ children, tag }) => (
  <div className="flex items-center gap-[16px]">
    <h2 className="m-0 text-[16px] leading-[20px] font-medium tracking-[0.2px] text-[#387440]">
      {children}
    </h2>
    {tag ? (
      <span className="rounded-[6px] border-[1.2px] border-solid border-[#e8e8e4] bg-white px-[12px] py-[4px] text-[14px] leading-[20px] font-medium tracking-[0.2px] text-[#737373]">
        {tag}
      </span>
    ) : null}
  </div>
);

const FIELD =
  'w-full rounded-[10px] border border-solid border-[#cccccc] bg-white px-[16px] py-[12px] font-sans text-[14px] leading-[20px] text-[#1c2a21] shadow-[0_2.5px_0_rgba(0,0,0,0.04)] outline-none focus:border-[#387440]';

const Field = ({ label, required, hint, children }) => {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-[8px]">
      <label
        htmlFor={id}
        className="flex items-center gap-[1px] text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="text-[14px] font-semibold text-[#1d7c4d]">
            *
          </span>
        ) : null}
      </label>
      {children(id)}
      {hint ? <span className="text-[13px] leading-[18px] text-[#959592]">{hint}</span> : null}
    </div>
  );
};

const blankForm = () => ({
  title: '',
  kind: '',
  description: '',
  amount: '',
  deadline: '',
  templateId: null,
});

const fromTemplate = (id) => {
  const t = TEMPLATES.find((x) => x.id === id);
  if (!t) return blankForm();
  return {
    ...blankForm(),
    title: t.title,
    kind: `${t.badge} · ${t.length}`,
    description: t.blurb,
    templateId: t.id,
  };
};

const toDateInput = (v) => (v ? new Date(v).toISOString().slice(0, 10) : '');

const WhoCanApplyView = ({ data }) => {
  const navigate = useNavigate();
  const { programmes } = useProgrammesStore();
  const policyOpen = data.state === 'policy-block';
  const templateId = data.params.get('template');
  const programmeId = data.params.get('programme') ?? NEW_ID;
  const [form, setForm] = useState(() => (templateId ? fromTemplate(templateId) : blankForm()));
  const [rules, setRules] = useState(() => ({ ...DEFAULT_RULES }));
  const [audience, setAudience] = useState(null);
  const [insights, setInsights] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [status, setStatus] = useState({ busy: false, error: '', note: '' });
  const [loadingProgramme, setLoadingProgramme] = useState(false);

  const options = useMemo(
    () => [
      { id: NEW_ID, optionLabel: 'New programme' },
      ...programmes.filter((p) => p.status !== 'closed'),
    ],
    [programmes]
  );

  useEffect(() => {
    log('mount', { programmeId, templateId, state: data.state });
  }, [programmeId, templateId, data.state]);

  // an existing programme: load its form and rules
  useEffect(() => {
    if (programmeId === NEW_ID) return undefined;
    let live = true;
    setLoadingProgramme(true);
    getProgramme(programmeId)
      .then((p) => {
        if (!live) return;
        const f = p.form || {};
        setForm({
          title: f.title || '',
          kind: f.kind || '',
          description: f.description || '',
          amount: f.amount ? String(f.amount) : '',
          deadline: toDateInput(f.deadline),
          templateId: f.templateId || null,
        });
        setRules({ ...DEFAULT_RULES, ...(f.rules || {}) });
      })
      .catch(
        (err) =>
          live &&
          setStatus((s) => ({
            ...s,
            error: err?.response?.data?.message || err?.message || 'Could not load the programme.',
          }))
      )
      .finally(() => live && setLoadingProgramme(false));
    return () => {
      live = false;
    };
  }, [programmeId]);

  // the live audience (debounced)
  useEffect(() => {
    let live = true;
    const t = setTimeout(() => {
      programmeAudience(rules)
        .then((a) => live && setAudience(a))
        .catch((err) => log('audience failed', err?.message));
    }, 300);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [rules]);

  useEffect(() => {
    programmeInsights()
      .then((rows) => setInsights(Array.isArray(rows) ? rows : []))
      .catch((err) => log('insights failed', err?.message));
    programmeSkills()
      .then((res) => setSkillOptions(res?.items ?? []))
      .catch((err) => log('skills failed', err?.message));
  }, []);

  const patch = (p) => setRules((r) => ({ ...r, ...p }));
  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const chooseProgramme = (id) => {
    setStatus({ busy: false, error: '', note: '' });
    if (id === NEW_ID) {
      setForm(blankForm());
      setRules({ ...DEFAULT_RULES });
    }
    data.update({ programme: id === NEW_ID ? null : id, template: null }, { replace: true });
  };

  const payload = (description = form.description) => ({
    title: form.title.trim(),
    kind: form.kind.trim(),
    description,
    amount: form.amount ? Number(form.amount) : undefined,
    deadline: form.deadline || undefined,
    templateId: form.templateId || undefined,
    rules,
  });

  const save = async (description) => {
    if (form.title.trim().length < 3) {
      setStatus({
        busy: false,
        error: 'Give the programme a title (3 characters or more).',
        note: '',
      });
      return null;
    }
    setStatus({ busy: true, error: '', note: '' });
    try {
      const saved =
        programmeId === NEW_ID
          ? await createProgramme(payload(description))
          : await updateProgramme(programmeId, payload(description));
      await reloadProgrammes();
      setStatus({ busy: false, error: '', note: 'Draft saved.' });
      if (programmeId === NEW_ID && saved?.id) {
        data.update({ programme: saved.id, template: null }, { replace: true });
      }
      return saved;
    } catch (err) {
      setStatus({
        busy: false,
        error: err?.response?.data?.message || err?.message || 'Could not save the programme.',
        note: '',
      });
      return null;
    }
  };

  const goPreview = (id) => navigate(`/agency/programmes/new?view=preview&programme=${id}`);

  const finding = useMemo(() => findContactDetails(form.description), [form.description]);

  const onContinue = async () => {
    if (finding) {
      data.update({ state: 'policy-block' }, { replace: true });
      return;
    }
    const saved = await save();
    if (saved?.id) goPreview(saved.id);
  };

  return (
    <div className="flex flex-col gap-[28px] font-sans">
      <ProgrammesHeader
        title="Who can"
        accent="apply"
        sentence="Choose who sees this programme. The same rules as every organisation on GTH: only matching talents get it in their feed."
        tab="apply"
      />
      <div className="flex flex-col gap-[32px] pb-[24px]">
        <ProgrammeSelect value={programmeId} onChange={chooseProgramme} options={options} />
        <section
          aria-labelledby="details-title"
          className="flex flex-col gap-[18px] xl:max-w-[862px]"
        >
          <h2
            id="details-title"
            className="m-0 text-[16px] leading-[20px] font-medium tracking-[0.2px] text-[#387440]"
          >
            PROGRAMME DETAILS
          </h2>
          {loadingProgramme ? (
            <p className="m-0 text-[14px] text-[#737373]">Loading the programme…</p>
          ) : null}
          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
            <Field label="Title" required>
              {(id) => (
                <input
                  id={id}
                  className={FIELD}
                  value={form.title}
                  maxLength={140}
                  onChange={setField('title')}
                  placeholder="e.g. YouthStart Digital Grant"
                />
              )}
            </Field>
            <Field label="Type">
              {(id) => (
                <input
                  id={id}
                  className={FIELD}
                  value={form.kind}
                  maxLength={80}
                  onChange={setField('kind')}
                  placeholder="e.g. Start-up grant · 8-week course"
                />
              )}
            </Field>
          </div>
          <Field
            label="Description"
            hint="What talents read. No phone numbers, emails or links: talents reach you through GTH."
          >
            {(id) => (
              <textarea
                id={id}
                className={`${FIELD} min-h-[120px] resize-y`}
                value={form.description}
                maxLength={4000}
                onChange={setField('description')}
              />
            )}
          </Field>
          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
            <Field label="Grant or stipend (GHS)">
              {(id) => (
                <input
                  id={id}
                  type="number"
                  min="0"
                  inputMode="numeric"
                  className={FIELD}
                  value={form.amount}
                  onChange={setField('amount')}
                />
              )}
            </Field>
            <Field label="Closing date">
              {(id) => (
                <input
                  id={id}
                  type="date"
                  className={FIELD}
                  value={form.deadline}
                  onChange={setField('deadline')}
                />
              )}
            </Field>
          </div>
        </section>
        <div className="flex flex-col gap-[18px]">
          <SectionLabel tag="AUTOMATED">ELIGIBILITY</SectionLabel>
          <div className="grid grid-cols-1 items-start gap-[32px] xl:grid-cols-[minmax(0,862fr)_minmax(0,435fr)]">
            <EligibilityRules rules={rules} onChange={patch} skillOptions={skillOptions} />
            <AudiencePreviewCard
              audience={audience}
              busy={status.busy}
              error={status.error}
              note={status.note}
              onContinue={onContinue}
              onTemplate={() => save()}
            />
          </div>
        </div>
        <section aria-labelledby="supply-title" className="flex flex-col gap-[18px]">
          <h2
            id="supply-title"
            className="m-0 text-[16px] leading-[20px] font-medium tracking-[0.2px] text-[#387440]"
          >
            SUPPLY INSIGHTS
          </h2>
          <ul className="m-0 grid list-none grid-cols-1 gap-[24px] p-0 sm:grid-cols-3 xl:max-w-[866px]">
            {insights.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-[8px] rounded-[12px] border border-solid border-[#e6e2d6] bg-white px-[24px] pt-[23px] pb-[24px]"
              >
                <span className="text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
                  {s.label}
                </span>
                <span className="text-[32px] leading-[40px] font-semibold tracking-[-0.16px] text-[#1c2a21]">
                  {s.value}
                </span>
                <span className="text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
                  {s.note}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      {policyOpen ? (
        <ProgrammeConfirmDialog
          title="Remove contact details to publish"
          body={
            finding
              ? `Your description includes ${finding.what} (${finding.masked}). Talents reach your agency through GTH, so contact details can’t go in programmes.`
              : 'Your description no longer has contact details.'
          }
          confirmLabel="Remove details"
          cancelLabel="Edit description"
          width={565}
          busy={status.busy}
          onConfirm={async () => {
            const cleaned = stripContactDetails(form.description);
            setForm((f) => ({ ...f, description: cleaned }));
            data.update({ state: null }, { replace: true });
            const saved = await save(cleaned);
            if (saved?.id) goPreview(saved.id);
          }}
          onCancel={() => data.update({ state: null }, { replace: true })}
        />
      ) : null}
    </div>
  );
};

export default WhoCanApplyView;
