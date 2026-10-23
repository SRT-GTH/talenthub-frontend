import { useId } from 'react';
import Button from '../../../ui/Button.jsx';
import { CREATE_AGE_OPTIONS, CREATE_COPY, CREATE_JOIN_OPTIONS } from './createCommunityData.js';
import { Callout, CheckRow, IconRow } from './CreateDialogParts.jsx';
import CreateDraftPreviewCard from './CreateDraftPreviewCard.jsx';
import {
  CcGlobeIcon,
  CcLockIcon,
  CcShieldIcon,
  CcStarIcon,
  CcUsersIcon,
} from './CreateCommunityIcons.jsx';

const JOIN_SUMMARY_ICONS = { public: CcGlobeIcon, request: CcUsersIcon, invite: CcLockIcon };

/* Short summary lines (Figma `summary`): the drawn "Anyone on GTH can find and join" / "Needs a verified mentor … co-moderator". */
const JOIN_SUMMARY = {
  public: 'Anyone on GTH can find and join',
  request: 'Anyone can find it. You approve each new member',
  invite: 'Hidden from search. People join with your link',
};
const AGE_SUMMARY = {
  adults: 'Members must be 18 or older',
  'fourteen-plus': 'Needs a verified mentor or teacher as co-moderator',
};

/*
 * Step 4 · Review — CC-05 "Check and submit". Props: draft, patchDraft, onBack(), onSubmit(), submitLabel.
 * The preview card + four summary rows read the draft; "Submit for review" stays disabled until the guidelines box is ticked.
 */
const CreateReviewStep = ({ draft, patchDraft, onBack, onSubmit, submitLabel }) => {
  const copy = CREATE_COPY.review;
  const agreeId = useId();
  const join = CREATE_JOIN_OPTIONS.find((o) => o.id === draft.joinPolicy) ?? CREATE_JOIN_OPTIONS[0];
  const age = CREATE_AGE_OPTIONS.find((o) => o.id === draft.ageRule) ?? CREATE_AGE_OPTIONS[0];
  const JoinGlyph = JOIN_SUMMARY_ICONS[join.id];
  const regions = draft.regions.join(', ');
  const checks = draft.checkFirstPosts ? 'First 2 posts from new members are checked' : null;
  return (
    <>
      <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-[300px_minmax(0,1fr)]">
        <CreateDraftPreviewCard name={draft.name} about={draft.about} cover={draft.cover} />
        <div className="flex min-w-0 flex-col">
          <IconRow icon={JoinGlyph} title={join.title} body={JOIN_SUMMARY[join.id]} />
          <IconRow icon={CcUsersIcon} title={age.title} body={AGE_SUMMARY[age.id]} />
          <IconRow icon={CcStarIcon} title={`${draft.topic ?? ''} · ${regions}`} />
          <IconRow
            icon={CcShieldIcon}
            title={`3 GTH rules + ${draft.ownRules.length} of yours`}
            body={checks}
          />
        </div>
      </div>
      <Callout title={copy.nextTitle}>{copy.nextBody}</Callout>
      <CheckRow id={agreeId} checked={draft.agreed} onChange={(agreed) => patchDraft({ agreed })}>
        {copy.agree}
      </CheckRow>
      <div className="flex flex-wrap items-center justify-end gap-[10px]">
        <Button variant="tertiary" size="lg" onClick={onBack}>
          {copy.back}
        </Button>
        <Button variant="primary" size="sm" disabled={!draft.agreed} onClick={onSubmit}>
          {submitLabel ?? copy.submit}
        </Button>
      </div>
    </>
  );
};

export default CreateReviewStep;
