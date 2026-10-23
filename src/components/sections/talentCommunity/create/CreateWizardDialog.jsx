import { useEffect, useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { DialogShell } from '../CommunityDialogParts.jsx';
import CreateBasicsStep from './CreateBasicsStep.jsx';
import CreateNotReady from './CreateNotReady.jsx';
import CreateReviewStep from './CreateReviewStep.jsx';
import CreateRulesStep from './CreateRulesStep.jsx';
import CreateWhoStep from './CreateWhoStep.jsx';
import { DialogHead } from './CreateDialogParts.jsx';
import { Stepper } from './CreateWizardParts.jsx';
import { CREATE_COPY, DEMO_DRAFT, ELIGIBILITY } from './createCommunityData.js';
import { submitCommunity, useCommunityDraft } from './createCommunityStore.js';

const log = debug('CreateWizardDialog');

/*
 * CreateWizardDialog — "Start a community" (Figma CC-02 … CC-05, CC-02b, CC-12), a 680px dialog over the Community browse page.
 * Props: create (useCreateCommunityState()), seed (edit mode: a draft built from the owned community), onSubmitted(draft)
 * (edit mode only: called instead of creating a new community), onClose().
 * The step lives in `?step=`; the draft is saved as you go (real flow) or is the drawn Agritech draft (`?demo=1`).
 * `?state=not-ready` shows the eligibility gate; the real flow passes it (⚠️ ASSUMPTION: no profile-completion backend yet).
 */
const CreateWizardDialog = ({ create, seed = null, onSubmitted, onClose }) => {
  const navigate = useNavigate();
  const titleId = useId();
  const { step, wizardState, demo, update } = create;
  const nameTakenFrame = demo && wizardState === 'name-taken';
  const frameSeed = useMemo(
    () => (nameTakenFrame ? { ...DEMO_DRAFT, name: 'Data Science Ghana' } : seed),
    [nameTakenFrame, seed]
  );
  const { draft, patchDraft } = useCommunityDraft({ demo, seed: frameSeed });
  const [checked, setChecked] = useState(nameTakenFrame);
  const notReady = wizardState === 'not-ready';
  const eligibility = notReady ? ELIGIBILITY.notReady : ELIGIBILITY.ready;

  useEffect(() => {
    log('step', step, notReady ? 'not-ready' : '', demo ? 'demo' : 'real');
  }, [step, notReady, demo]);

  const go = (next) => update({ step: next === 'basics' ? null : next });
  const finishProfile = () => {
    log('finish profile');
    navigate('/profile');
  };
  const submit = () => {
    if (seed && onSubmitted) {
      onSubmitted(draft);
      return;
    }
    const community = submitCommunity(draft);
    navigate(`/community/${community.id}/manage`);
  };

  let title = CREATE_COPY.title;
  if (notReady) title = CREATE_COPY.notReady.title;
  else if (step === 'review') title = CREATE_COPY.reviewTitle;

  let body;
  if (notReady) {
    body = (
      <CreateNotReady
        eligibility={eligibility}
        onFinishProfile={finishProfile}
        onNotNow={onClose}
      />
    );
  } else if (step === 'who') {
    body = (
      <CreateWhoStep
        draft={draft}
        patchDraft={patchDraft}
        onBack={() => go('basics')}
        onNext={() => go('rules')}
      />
    );
  } else if (step === 'rules') {
    body = (
      <CreateRulesStep
        draft={draft}
        patchDraft={patchDraft}
        onBack={() => go('who')}
        onNext={() => go('review')}
      />
    );
  } else if (step === 'review') {
    body = (
      <CreateReviewStep
        draft={draft}
        patchDraft={patchDraft}
        onBack={() => go('rules')}
        onSubmit={submit}
      />
    );
  } else {
    body = (
      <CreateBasicsStep
        draft={draft}
        patchDraft={patchDraft}
        checked={checked}
        onChecked={setChecked}
        onNext={() => go('who')}
        onCancel={onClose}
        onView={(id) => navigate(`/community/${id}`)}
      />
    );
  }

  return (
    <DialogShell
      width={680}
      gap={notReady || step === 'review' ? 18 : 20}
      onClose={onClose}
      labelId={titleId}
    >
      <DialogHead id={titleId} onClose={onClose}>
        {title}
      </DialogHead>
      {notReady ? null : <Stepper current={step} />}
      {body}
    </DialogShell>
  );
};

export default CreateWizardDialog;
