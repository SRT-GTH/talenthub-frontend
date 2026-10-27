import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import {
  apiMessage,
  checkProgramme,
  createProgramme,
  getProgramme,
  programmeAudience,
  updateProgramme,
} from '../../../../services/institutionPortal.api.js';
import { DEFAULT_RULES, EMPTY_DETAILS, POLICY_TITLE } from './data/programmesData.js';
import { formatCount } from '../institutionFormat.js';
import AudiencePreviewCard from './AudiencePreviewCard.jsx';
import EligibilityRules from './EligibilityRules.jsx';
import ProgrammeConfirmDialog from './ProgrammeConfirmDialog.jsx';
import ProgrammeDetailsCard from './ProgrammeDetailsCard.jsx';
import ProgrammesHeader from './ProgrammesHeader.jsx';
import ProgrammeSelect from './ProgrammeSelect.jsx';
import useProgrammeOptions from './useProgrammeOptions.js';
import { upsertProgramme, useProgrammesStore } from './useProgrammesStore.js';

const log = debug('WhoCanApplyView');

/*
 * WhoCanApplyView — "Who can apply" (Figma 11.5.2a 8597:393686, 11.5.2h audience under 5 8610:402145, 11.5.2i policy block 8610:402716):
 * header with the tab row, the required "Programme" select (a draft or live programme, or "New programme"), DETAILS (what students read; not drawn,
 * see ProgrammeDetailsCard), "ELIGIBILITY · AUTOMATED" with the rule cards and the live Audience preview, and "YOUR STUDENTS".
 * Live: the form loads GET /api/institution/programmes/:id (or a template from the options), the audience recomputes from the roster with every rule
 * (POST .../audience, debounced), "Save and continue" saves (POST / PATCH) and runs the check (POST .../:id/check): contact details in the text open the
 * "Remove contact details to publish" dialog ("Remove details" strips them on the server), fewer than 5 matching students keep you here, otherwise the
 * student preview opens. "Save as Template" saves the programme as one of the school's own templates.
 * URL keys: programme=<id> · template=<id> · state=policy-block.
 * Props: data (useInstitutionState()).
 */

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

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
const detailsFrom = (form) => ({
  ...EMPTY_DETAILS,
  title: form.title ?? '',
  description: form.description ?? '',
  kind: form.kind ?? '',
  place: form.place ?? '',
  mode: form.mode ?? 'onsite',
  deadline: toDateInput(form.deadline),
  templateId: form.templateId ?? null,
});

const WhoCanApplyView = ({ data }) => {
  const navigate = useNavigate();
  const { programmes } = useProgrammesStore();
  const { options, error: optionsError } = useProgrammeOptions();
  const policyOpen = data.state === 'policy-block';
  const programmeId = data.params.get('programme') || null;
  const templateId = data.params.get('template') || null;
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [rules, setRules] = useState(() => ({ ...DEFAULT_RULES }));
  const [loading, setLoading] = useState(Boolean(programmeId));
  const [audience, setAudience] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [policy, setPolicy] = useState(null);
  const [busy, setBusy] = useState(false);
  const descriptionRef = useRef(null);

  // load the programme being edited, or start from a template
  useEffect(() => {
    let alive = true;
    setMessage('');
    setErrors({});
    if (programmeId) {
      setLoading(true);
      getProgramme(programmeId)
        .then((p) => {
          if (!alive) return;
          setDetails(detailsFrom(p.form));
          setRules({ ...DEFAULT_RULES, ...(p.form?.rules ?? {}) });
          if (p.status === 'closed')
            setMessage(
              'This programme is closed. Duplicate it from Your programmes to run it again.'
            );
        })
        .catch((err) => alive && setMessage(apiMessage(err)))
        .finally(() => alive && setLoading(false));
    } else if (templateId?.startsWith('own-')) {
      setLoading(true);
      getProgramme(templateId)
        .then((p) => {
          if (!alive) return;
          setDetails(detailsFrom(p.form));
          setRules({ ...DEFAULT_RULES, ...(p.form?.rules ?? {}) });
        })
        .catch((err) => alive && setMessage(apiMessage(err)))
        .finally(() => alive && setLoading(false));
    } else if (templateId && options?.template?.[templateId]) {
      const t = options.template[templateId];
      setDetails({ ...EMPTY_DETAILS, ...t, templateId });
      setRules({ ...DEFAULT_RULES });
      setLoading(false);
    } else if (!templateId) {
      setDetails(EMPTY_DETAILS);
      setRules({ ...DEFAULT_RULES });
      setLoading(false);
    }
    log('load', { programmeId, templateId });
    return () => {
      alive = false;
    };
  }, [programmeId, templateId, options]);

  // the audience follows the rules (debounced)
  useEffect(() => {
    let alive = true;
    const t = window.setTimeout(() => {
      programmeAudience(rules)
        .then((a) => alive && setAudience(a))
        .catch((err) => alive && setMessage(apiMessage(err)));
    }, 300);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [rules]);

  const S = options?.students;
  const insights = S
    ? [
        {
          id: 'under18',
          label: 'Under 18',
          value: `${formatCount(S.under18.count)} of ${formatCount(S.under18.of)}`,
          note: 'Guardians get a copy of the invite and can say no.',
        },
        {
          id: 'linked',
          label: 'Linked profiles',
          value: `${S.linked.pct}%`,
          note: `${formatCount(S.linked.unlinked)} students still need to link before they can see programmes.`,
        },
        {
          id: 'consent',
          label: 'Guardian consent',
          value: `${formatCount(S.consent.count)} of ${formatCount(S.consent.of)}`,
          note: 'Under-18s see programmes once a guardian agrees.',
        },
      ]
    : [];

  const patch = (p) => setRules((r) => ({ ...r, ...p }));
  const patchDetails = (p) => {
    setDetails((d) => ({ ...d, ...p }));
    if (p.title !== undefined && errors.title) setErrors({});
  };

  const selectOptions = [
    { id: '', optionLabel: 'New programme' },
    ...programmes.filter((p) => p.status !== 'closed' && !p.isTemplate),
  ];

  /** Saves the form; returns the programme id (a new draft's id goes into the URL). */
  const save = async (extra = {}) => {
    if (details.title.trim().length < 3) {
      setErrors({ title: 'Give the programme a title (at least 3 characters).' });
      return null;
    }
    const body = { ...details, deadline: details.deadline || null, rules, ...extra };
    const card =
      programmeId && !extra.asTemplate
        ? await updateProgramme(programmeId, body)
        : await createProgramme(body);
    upsertProgramme(card);
    if (!programmeId && !extra.asTemplate) {
      data.update({ programme: card.id, template: null }, { replace: true });
    }
    return card.id;
  };

  const goPreview = (id) => navigate(`/institution/programmes/new?modal=preview&programme=${id}`);

  const onContinue = async () => {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      const id = await save();
      if (!id) return;
      const res = await checkProgramme(id);
      if (res.policy) {
        setPolicy(res.policy);
        data.update({ programme: id, template: null, state: 'policy-block' }, { replace: true });
        return;
      }
      if (!res.ok) {
        setAudience(res.audience);
        setMessage(
          'Saved as a draft. Fewer than 5 students match these rules, so it can’t be published yet.'
        );
        return;
      }
      goPreview(id);
    } catch (err) {
      setMessage(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const onTemplate = async () => {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      const id = await save({ asTemplate: true });
      if (id)
        setMessage('Saved as one of your templates. Find it under Templates › Your templates.');
    } catch (err) {
      setMessage(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const removeDetails = async () => {
    setBusy(true);
    try {
      const card = await updateProgramme(programmeId, { removeContacts: true });
      upsertProgramme(card);
      const fresh = await getProgramme(programmeId);
      setDetails(detailsFrom(fresh.form));
      data.update({ state: null }, { replace: true });
      setPolicy(null);
      const res = await checkProgramme(programmeId);
      if (res.ok) goPreview(programmeId);
      else
        setMessage(
          res.policy
            ? res.policy.sentence
            : 'Fewer than 5 students match these rules, so it can’t be published yet.'
        );
    } catch (err) {
      setMessage(apiMessage(err));
      data.update({ state: null }, { replace: true });
    } finally {
      setBusy(false);
    }
  };

  // the dialog opened from the URL (a reload): ask the server what it found
  const { update } = data;
  useEffect(() => {
    if (!policyOpen || policy || !programmeId) return;
    checkProgramme(programmeId)
      .then((res) =>
        res.policy ? setPolicy(res.policy) : update({ state: null }, { replace: true })
      )
      .catch(() => update({ state: null }, { replace: true }));
  }, [policyOpen, policy, programmeId, update]);

  return (
    <div className="flex flex-col gap-[28px] font-sans">
      <ProgrammesHeader
        title="Who can"
        accent="apply"
        sentence="Choose which of your students see this programme. Only students on your roster can apply."
        tab="apply"
      />
      <div className="flex flex-col gap-[32px] pb-[24px]">
        <ProgrammeSelect
          value={programmeId ?? ''}
          onChange={(id) =>
            data.update({ programme: id || null, template: null, state: null }, { replace: true })
          }
          options={selectOptions}
        />
        {message ? (
          <p
            role="status"
            className="m-0 rounded-[12px] border border-solid border-[#eedeb8] bg-[#faf4e8] px-[16px] py-[12px] text-[14px] leading-[20px] text-[#785910] xl:max-w-[1329px]"
          >
            {message}
          </p>
        ) : null}
        {optionsError ? (
          <p role="alert" className="m-0 text-[14px] leading-[20px] text-[#902b20]">
            {optionsError}
          </p>
        ) : null}
        <div className="flex flex-col gap-[18px]">
          <SectionLabel>DETAILS</SectionLabel>
          {loading ? (
            <p className="m-0 text-[14px] leading-[20px] text-[#737373]">Loading the programme…</p>
          ) : (
            <ProgrammeDetailsCard
              ref={descriptionRef}
              value={details}
              onChange={patchDetails}
              errors={errors}
            />
          )}
        </div>
        <div className="flex flex-col gap-[18px]">
          <SectionLabel tag="AUTOMATED">ELIGIBILITY</SectionLabel>
          <div className="grid grid-cols-1 items-start gap-[32px] xl:grid-cols-[minmax(0,862fr)_minmax(0,435fr)]">
            <EligibilityRules
              rules={rules}
              onChange={patch}
              forms={options?.forms ?? []}
              studyOptions={options?.study ?? []}
            />
            <AudiencePreviewCard
              audience={audience}
              busy={busy || loading}
              onContinue={onContinue}
              onTemplate={onTemplate}
            />
          </div>
        </div>
        <section aria-labelledby="supply-title" className="flex flex-col gap-[18px]">
          <h2
            id="supply-title"
            className="m-0 text-[16px] leading-[20px] font-medium tracking-[0.2px] text-[#387440]"
          >
            YOUR STUDENTS
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
      {policyOpen && policy ? (
        <ProgrammeConfirmDialog
          title={POLICY_TITLE}
          body={policy.sentence}
          confirmLabel={busy ? 'Removing…' : 'Remove details'}
          cancelLabel="Edit description"
          width={565}
          onConfirm={removeDetails}
          onCancel={() => {
            data.update({ state: null }, { replace: true });
            window.requestAnimationFrame(() => descriptionRef.current?.focus());
          }}
        />
      ) : null}
    </div>
  );
};

export default WhoCanApplyView;
