import { useEffect, useId, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { fillCopy } from '../communityDialogUtils.js';
import { CREATE_COPY, GTH_RULES, MAX_OWN_RULES } from './createCommunityData.js';
import { CheckRow, FooterBar, IconRow, Pill, Section } from './CreateDialogParts.jsx';
import { CcEditIcon, CcLockIcon, CcPlusIcon, CcShieldIcon } from './CreateCommunityIcons.jsx';
import { FOCUS_RING, INPUT_BASE, INPUT_OK, TEXT_ACTION } from './createCommunityStyles.js';
import { classNames } from '../../../../utils/classNames.js';

const log = debug('CreateRulesStep');

/* Inline editor for one of "your rules" (title + one-line detail). */
const RuleEditor = ({ rule, onSave, onRemove, onCancel }) => {
  const titleId = useId();
  const detailId = useId();
  const [title, setTitle] = useState(rule.title);
  const [detail, setDetail] = useState(rule.detail);
  return (
    <div className="flex flex-col gap-[8px] rounded-[16px] border border-solid border-[#e6e6e6] p-[12px]">
      <label htmlFor={titleId} className="sr-only">
        Rule
      </label>
      <input
        id={titleId}
        type="text"
        autoFocus
        value={title}
        maxLength={80}
        onChange={(e) => setTitle(e.target.value)}
        className={classNames(INPUT_BASE, INPUT_OK, FOCUS_RING, 'py-[8px]')}
      />
      <label htmlFor={detailId} className="sr-only">
        Rule detail
      </label>
      <input
        id={detailId}
        type="text"
        value={detail}
        maxLength={120}
        onChange={(e) => setDetail(e.target.value)}
        className={classNames(INPUT_BASE, INPUT_OK, FOCUS_RING, 'py-[8px]')}
      />
      <div className="flex items-center gap-[16px]">
        <button
          type="button"
          className={classNames(TEXT_ACTION, FOCUS_RING)}
          disabled={!title.trim()}
          onClick={() => onSave({ ...rule, title: title.trim(), detail: detail.trim() })}
        >
          Save
        </button>
        <button type="button" className={classNames(TEXT_ACTION, FOCUS_RING)} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className={classNames(TEXT_ACTION, FOCUS_RING, 'ml-auto !text-[#c0392b]')}
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

/*
 * Step 3 · House rules — CC-04. Props: draft, patchDraft, onBack(), onNext().
 * Three GTH rules are always on; up to 5 of the talent's own (Edit opens an inline editor, "Add a rule" appends one);
 * two moderation checkboxes. The drawn Edit / Add flows have no frames: ⚠️ ASSUMPTION inline editor with Save / Cancel / Remove.
 */
const CreateRulesStep = ({ draft, patchDraft, onBack, onNext }) => {
  const copy = CREATE_COPY.rules;
  const checkId = useId();
  const [editing, setEditing] = useState(null);
  const rules = draft.ownRules;

  useEffect(() => {
    log('render', rules.length);
  }, [rules.length]);

  const save = (rule) => {
    const exists = rules.some((r) => r.id === rule.id);
    patchDraft({
      ownRules: exists ? rules.map((r) => (r.id === rule.id ? rule : r)) : [...rules, rule],
    });
    setEditing(null);
  };
  const remove = (id) => {
    patchDraft({ ownRules: rules.filter((r) => r.id !== id) });
    setEditing(null);
  };

  return (
    <>
      <Section title={copy.gthTitle} className="gap-0">
        {GTH_RULES.map((title) => (
          <IconRow
            key={title}
            icon={CcLockIcon}
            title={title}
            trailing={<Pill>{copy.alwaysOn}</Pill>}
          />
        ))}
      </Section>
      <Section
        title={fillCopy(copy.ownTitle, { count: String(rules.length) })}
        className="gap-[4px]"
      >
        {rules.map((rule) =>
          editing === rule.id ? (
            <RuleEditor
              key={rule.id}
              rule={rule}
              onSave={save}
              onRemove={() => remove(rule.id)}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <IconRow
              key={rule.id}
              icon={CcEditIcon}
              title={rule.title}
              body={rule.detail}
              trailing={
                <button
                  type="button"
                  aria-label={`${copy.edit}: ${rule.title}`}
                  className={classNames(TEXT_ACTION, FOCUS_RING)}
                  onClick={() => setEditing(rule.id)}
                >
                  {copy.edit}
                </button>
              }
            />
          )
        )}
        {editing === 'new' ? (
          <RuleEditor
            rule={{ id: `rule-${Date.now()}`, title: '', detail: '' }}
            onSave={save}
            onRemove={() => setEditing(null)}
            onCancel={() => setEditing(null)}
          />
        ) : null}
        {rules.length < MAX_OWN_RULES && editing !== 'new' ? (
          <button
            type="button"
            className={classNames(TEXT_ACTION, FOCUS_RING, 'mt-[4px] self-start')}
            onClick={() => setEditing('new')}
          >
            <CcPlusIcon className="size-[16px]" />
            {copy.add}
          </button>
        ) : null}
      </Section>
      <Section title={copy.moderation} className="gap-[10px]">
        <CheckRow
          id={`${checkId}-first`}
          checked={draft.checkFirstPosts}
          onChange={(checked) => patchDraft({ checkFirstPosts: checked })}
        >
          Check new members’ first 2 posts before they show
        </CheckRow>
        <CheckRow
          id={`${checkId}-events`}
          checked={draft.allowEvents}
          onChange={(checked) => patchDraft({ allowEvents: checked })}
        >
          Let members post events
        </CheckRow>
      </Section>
      <FooterBar note={copy.note} noteIcon={CcShieldIcon}>
        <Button variant="tertiary" size="lg" onClick={onBack}>
          {copy.back}
        </Button>
        <Button variant="primary" size="sm" onClick={onNext}>
          {copy.next}
        </Button>
      </FooterBar>
    </>
  );
};

export default CreateRulesStep;
