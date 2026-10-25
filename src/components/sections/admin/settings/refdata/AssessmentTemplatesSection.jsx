import { useState } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { TextInput, Textarea } from '../../../../ui/form';
import { GroupCard, SettingRow, TextAction } from '../../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../../ui/AdminConfirmDialog.jsx';
import AdminLoadNotice from '../../AdminLoadNotice.jsx';
import { useAdminData } from '../../useAdminData.js';
import {
  catAssessmentTemplate,
  catAssessmentTemplates,
  catSetAssessmentTemplateActive,
  catUpdateAssessmentTemplate,
  humanize,
} from '../../../../../services/admin.api.js';
import { Chip, Note, ReasonInput } from './shared.jsx';
import { useReasonRun } from './useReasonRun.js';

/*
 * Assessment templates: the question sets talents take in My Assessment.
 * Admins can rename a template, change its description and estimated minutes, and (de)activate it.
 * Questions and answer keys are view-only: changing them would change how talents are scored.
 * The only active template of a type can't be deactivated (talents couldn't take or be scored on it).
 */

const SCORING = {
  sjt_ranked_response: 'points per answer',
  cognitive_correct_count_scaled: 'correct answers, scaled',
  riasec_likert_average: 'average agreement per interest area',
  big_five_likert_average: 'average agreement per trait',
  mbti_dichotomy_count: 'answers counted per preference pair',
};
const TYPE_LABELS = { big_five: 'Big Five', riasec: 'RIASEC', mbti: 'MBTI' };
const typeLabel = (t) => TYPE_LABELS[t] || humanize(String(t || '').replace(/_/g, ' '));

const Question = ({ q, i }) => {
  const scoring = q.scoring && typeof q.scoring === 'object' ? q.scoring : null;
  const best = scoring ? Math.max(...Object.values(scoring).map(Number)) : null;
  return (
    <li className="flex flex-col gap-[8px] rounded-[12px] border border-solid border-[#e7e7e7] bg-white p-[14px]">
      <div className="flex flex-wrap items-center gap-[8px]">
        <span className="font-sans text-[12px] font-semibold text-[#737373]">
          {i + 1} · {q.key}
        </span>
        {q.dimension ? <Chip>Dimension {q.dimension}</Chip> : null}
        {q.scale ? <Chip>Scale {q.scale}</Chip> : null}
        {q.reverse ? <Chip tone="warn">Reverse-scored</Chip> : null}
        {q.difficulty ? <Chip>{humanize(q.difficulty)}</Chip> : null}
      </div>
      <p className="m-0 font-sans text-[15px] leading-[22px] text-[#1c2a21]">{q.text}</p>
      {Array.isArray(q.options) && q.options.length ? (
        <ul className="m-0 flex list-none flex-col gap-[4px] p-0">
          {q.options.map((o) => {
            const correct = q.correctAnswer != null && o === q.correctAnswer;
            const pts = scoring ? Number(scoring[o] ?? 0) : null;
            return (
              <li
                key={o}
                className={classNames(
                  'flex items-start justify-between gap-[10px] rounded-[8px] px-[10px] py-[6px] font-sans text-[14px]',
                  correct || (pts !== null && pts === best && best > 0)
                    ? 'bg-[#e3f1e5] text-[#1f5a2a]'
                    : 'bg-[#f8f8f4] text-[#3b3b3b]'
                )}
              >
                <span>{o}</span>
                <span className="shrink-0 font-semibold">
                  {correct
                    ? '✓ Correct answer'
                    : pts !== null
                      ? `${pts} pt${pts === 1 ? '' : 's'}`
                      : ''}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
};

const TemplateQuestions = ({ id, onBack }) => {
  const detail = useAdminData(() => catAssessmentTemplate(id), [id]);
  const t = detail.data?.template;
  const qs = Array.isArray(t?.questions) ? t.questions : [];
  return (
    <GroupCard
      title={t ? t.displayName : 'Questions'}
      description={
        t
          ? `${typeLabel(t.assessmentType)} · ${qs.length} questions · scored by ${SCORING[t.scoringAlgorithm] || humanize(String(t.scoringAlgorithm || 'n/a').replace(/_/g, ' '))} · v${t.version || 1}`
          : ''
      }
      gap="gap-[12px]"
    >
      <div>
        <TextAction tone="green" onClick={onBack}>
          ← All assessment templates
        </TextAction>
      </div>
      <Note>
        Questions and answer keys are view-only. Changing them would change how talents are scored,
        so that needs a new template version from the team.
      </Note>
      <AdminLoadNotice
        loading={detail.loading}
        error={detail.error}
        status={detail.status}
        onRetry={detail.reload}
      >
        <ol className="m-0 flex list-none flex-col gap-[10px] p-0">
          {qs.map((q, i) => (
            <Question key={q.key || i} q={q} i={i} />
          ))}
        </ol>
        {t && !qs.length ? (
          <p className="m-0 font-sans text-[14px] text-[#737373]">
            This template has no questions.
          </p>
        ) : null}
      </AdminLoadNotice>
    </GroupCard>
  );
};

const AssessmentTemplatesSection = ({ canEdit, toast }) => {
  const list = useAdminData(() => catAssessmentTemplates(), []);
  const rows = list.data?.templates ?? [];
  const [viewing, setViewing] = useState(null);
  const [dialog, setDialog] = useState(null); // { kind: 'edit'|'active', t }
  const [form, setForm] = useState({ displayName: '', description: '', estimatedMinutes: '' });
  const r = useReasonRun(toast, () => {
    setDialog(null);
    list.reload();
  });
  const open = (d) => {
    r.reset();
    setForm({
      displayName: d.t.displayName || '',
      description: d.t.description || '',
      estimatedMinutes: d.t.estimatedMinutes != null ? String(d.t.estimatedMinutes) : '',
    });
    setDialog(d);
  };

  if (viewing) return <TemplateQuestions id={viewing} onBack={() => setViewing(null)} />;

  const d = dialog;
  return (
    <GroupCard
      title="Assessment templates"
      description="The question sets talents take in My Assessment. You can rename them, change the description and time estimate, and switch templates on or off. Questions and answer keys are view-only."
      gap="gap-0"
    >
      <AdminLoadNotice
        loading={list.loading}
        error={list.error}
        status={list.status}
        onRetry={list.reload}
      >
        {rows.map((t) => (
          <SettingRow
            key={t.id}
            title={`${t.displayName}${t.isActive ? '' : ' · inactive'}`}
            description={`${typeLabel(t.assessmentType)} · ${t.questionCount} questions · ${
              t.estimatedMinutes ?? '–'
            } min · ${t.resultsOfType} result${t.resultsOfType === 1 ? '' : 's'} recorded for this type · v${t.version}${
              t.onlyActiveOfType ? ' · the only active template of its type' : ''
            }`}
            top
            control={
              <div className="flex items-center gap-[14px]">
                <TextAction tone="green" onClick={() => setViewing(t.id)}>
                  View questions
                </TextAction>
                {canEdit ? (
                  <TextAction tone="green" onClick={() => open({ kind: 'edit', t })}>
                    Edit
                  </TextAction>
                ) : null}
                {canEdit && !(t.isActive && t.onlyActiveOfType) ? (
                  <TextAction
                    tone={t.isActive ? 'danger' : 'green'}
                    onClick={() => open({ kind: 'active', t })}
                  >
                    {t.isActive ? 'Deactivate' : 'Activate'}
                  </TextAction>
                ) : null}
              </div>
            }
          />
        ))}
        {!rows.length && !list.loading ? (
          <p className="m-0 font-sans text-[14px] text-[#737373]">No assessment templates.</p>
        ) : null}
      </AdminLoadNotice>

      {d?.kind === 'edit' ? (
        <AdminConfirmDialog
          title={`Edit ${d.t.displayName}`}
          body="Talents see the name, description and time estimate before they start."
          primary={{ label: r.busy ? 'Saving…' : 'Save', arrow: true }}
          secondary="Cancel"
          onPrimary={() => {
            const mins = Number(form.estimatedMinutes);
            if (form.displayName.trim().length < 3)
              return r.setError('Give it a name (3+ characters).');
            if (!Number.isInteger(mins) || mins < 1 || mins > 240)
              return r.setError('Minutes is a whole number from 1 to 240.');
            const p = {};
            if (form.displayName.trim() !== d.t.displayName)
              p.displayName = form.displayName.trim();
            if (form.description.trim() !== (d.t.description || ''))
              p.description = form.description.trim();
            if (mins !== d.t.estimatedMinutes) p.estimatedMinutes = mins;
            if (!Object.keys(p).length) return r.setError('Nothing has changed.');
            return r.run(
              () => catUpdateAssessmentTemplate(d.t.id, { ...p, reason: r.reason.trim() }),
              'Template saved',
              form.displayName.trim()
            );
          }}
          onClose={() => setDialog(null)}
        >
          <div className="flex flex-col gap-[12px]">
            <TextInput
              label="Name"
              required
              value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            />
            <Textarea
              label="Description"
              optional
              rows={3}
              maxLength={1000}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <TextInput
              label="Estimated minutes"
              inputMode="numeric"
              value={form.estimatedMinutes}
              onChange={(e) =>
                setForm((f) => ({ ...f, estimatedMinutes: e.target.value.replace(/\D/g, '') }))
              }
            />
            <ReasonInput value={r.reason} onChange={r.setReason} error={r.error} />
          </div>
        </AdminConfirmDialog>
      ) : null}

      {d?.kind === 'active' ? (
        <AdminConfirmDialog
          title={`${d.t.isActive ? 'Deactivate' : 'Activate'} ${d.t.displayName}?`}
          body={
            d.t.isActive
              ? 'Talents can’t start it any more. Results already recorded stay.'
              : 'Talents can take it again.'
          }
          primary={{
            label: r.busy ? 'Saving…' : 'Confirm',
            tone: d.t.isActive ? 'red' : 'green',
            arrow: !d.t.isActive,
          }}
          secondary="Cancel"
          onPrimary={() =>
            r.run(
              () => catSetAssessmentTemplateActive(d.t.id, !d.t.isActive, r.reason.trim()),
              'Saved',
              d.t.displayName
            )
          }
          onClose={() => setDialog(null)}
        >
          <ReasonInput value={r.reason} onChange={r.setReason} error={r.error} />
        </AdminConfirmDialog>
      ) : null}
    </GroupCard>
  );
};

export default AssessmentTemplatesSection;
