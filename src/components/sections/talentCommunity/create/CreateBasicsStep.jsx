import { useEffect, useId, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { fillCopy } from '../communityDialogUtils.js';
import { CREATE_COPY, CREATE_TOPICS, findNameConflict, toHashtag } from './createCommunityData.js';
import { Callout, FilterChip, FooterBar, Section } from './CreateDialogParts.jsx';
import { AreaField, TextField, UploadRow } from './CreateWizardParts.jsx';
import { CcCheckCircleIcon, CcInfoIcon, CcWarningIcon } from './CreateCommunityIcons.jsx';
import { formatMembers } from '../communityData.js';

const log = debug('CreateBasicsStep');

/*
 * Step 1 · Basics — CC-02 (filled), CC-02b (name taken: error + "Free names you could use").
 * Props: draft, patchDraft, checked (Next was pressed once: show the name-taken view when the name exists), onChecked,
 *        onNext(), onCancel(), onView(communityId).
 * "Next" is disabled until name, about and topic are filled. A taken name shows the CC-02b view instead of the rest of the form.
 */
const CreateBasicsStep = ({ draft, patchDraft, checked, onChecked, onNext, onCancel, onView }) => {
  const copy = CREATE_COPY.basics;
  const nameId = useId();
  const aboutId = useId();
  const nameRef = useRef(null);
  const [coverError, setCoverError] = useState(false);
  const conflict = checked ? findNameConflict(draft.name) : null;
  const ready =
    draft.name.trim().length >= 3 && draft.about.trim().length > 0 && Boolean(draft.topic);

  useEffect(() => {
    log('render', conflict ? 'name-taken' : 'form');
  }, [conflict]);

  const next = () => {
    if (!ready) return;
    if (findNameConflict(draft.name)) {
      log('name taken', draft.name);
      onChecked(true);
      nameRef.current?.focus();
      return;
    }
    onNext();
  };

  const nameHelp = draft.name.trim()
    ? conflict
      ? copy.nameTaken
      : fillCopy(copy.nameFree, { tag: toHashtag(draft.name) })
    : null;

  return (
    <>
      <TextField
        id={nameId}
        inputRef={nameRef}
        label={copy.name}
        value={draft.name}
        onChange={(name) => patchDraft({ name })}
        error={Boolean(conflict)}
        help={nameHelp}
        helpIcon={CcWarningIcon}
      />

      {conflict ? (
        <>
          <Callout role="alert" title={fillCopy(copy.existsTitle, { name: conflict.name })}>
            {fillCopy(copy.existsBody, {
              members: formatMembers(conflict.members),
              example: conflict.suggestions[0],
            })}
          </Callout>
          <Section title={copy.suggest}>
            <div className="flex flex-wrap gap-[8px]">
              {conflict.suggestions.map((name) => (
                <FilterChip
                  key={name}
                  onClick={() => {
                    log('suggestion', name);
                    patchDraft({ name });
                  }}
                >
                  {name}
                </FilterChip>
              ))}
            </div>
          </Section>
          <FooterBar note={copy.noCompany} noteIcon={CcInfoIcon}>
            <Button variant="tertiary" size="lg" onClick={() => onView(conflict.id)}>
              {fillCopy(copy.view, { name: conflict.name })}
            </Button>
            <Button variant="primary" size="sm" onClick={next}>
              {copy.next}
            </Button>
          </FooterBar>
        </>
      ) : (
        <>
          <AreaField
            id={aboutId}
            label={copy.about}
            value={draft.about}
            onChange={(about) => patchDraft({ about })}
            count={fillCopy(copy.aboutCount, { count: String(draft.about.length) })}
          />
          <Section title={copy.topic}>
            <div role="radiogroup" aria-label={copy.topic} className="flex flex-wrap gap-[8px]">
              {CREATE_TOPICS.map((topic) => (
                <FilterChip
                  key={topic}
                  role="radio"
                  on={draft.topic === topic}
                  onClick={() => patchDraft({ topic })}
                >
                  {topic}
                </FilterChip>
              ))}
            </div>
          </Section>
          <UploadRow
            cover={draft.cover}
            onPick={(cover) => {
              setCoverError(false);
              patchDraft({ cover });
            }}
            onError={() => setCoverError(true)}
          />
          {coverError ? (
            <p role="alert" className="m-0 font-sans text-[12px] leading-[18px] text-[#c0392b]">
              {copy.coverHint}
            </p>
          ) : null}
          <FooterBar note={copy.draftNote} noteIcon={CcCheckCircleIcon}>
            <Button variant="tertiary" size="lg" onClick={onCancel}>
              {copy.cancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!ready}
              onClick={next}
              className={classNames(!ready && 'cursor-not-allowed')}
            >
              {copy.next}
            </Button>
          </FooterBar>
        </>
      )}
    </>
  );
};

export default CreateBasicsStep;
