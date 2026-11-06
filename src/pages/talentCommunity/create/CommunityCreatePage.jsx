import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import CreateWizardDialog from '../../../components/sections/talentCommunity/create/CreateWizardDialog.jsx';
import { useCreateCommunityState } from '../../../components/sections/talentCommunity/create/createCommunityState.js';
import { useOwnedCommunity } from '../../../components/sections/talentCommunity/create/createCommunityStore.js';
import { useCreateCommunityCopy } from '../../../components/sections/talentCommunity/create/useCreateCommunityCopy.js';
import CommunityBrowsePage from '../CommunityBrowsePage.jsx';

const log = debug('CommunityCreatePage');

/* A wizard draft built from an owned community (edit mode). */
const toDraft = (community) => ({
  name: community.name,
  about: community.about,
  topic: community.topic,
  cover: community.cover,
  joinPolicy: community.joinPolicy,
  ageRule: community.ageRule,
  regions: community.regions,
  ownRules: community.ownRules,
  checkFirstPosts: community.checkFirstPosts,
  allowEvents: community.allowEvents,
  agreed: false,
});

/*
 * CommunityCreatePage — `/community/create`: the "Start a community" wizard (Figma CC-02 … CC-05, CC-02b, CC-12) drawn as a dialog
 * over the Community browse page (the page behind is CommunityBrowsePage, so `?cat=` / `?demo=1` shape it). URL contract: the top
 * of createCommunityState.js. Edit mode (`?edit=<id>&from=<status>`) prefills the wizard from an owned community.
 */
const CommunityCreatePage = () => {
  const create = useCreateCommunityState();
  const navigate = useNavigate();
  const { isRecruiter, base } = useCreateCommunityCopy();
  const { edit, from, demo } = create;
  const { community, patch } = useOwnedCommunity({
    communityId: edit,
    demo: demo && Boolean(edit),
    ownerState: from ?? 'live',
    requests: 0,
    recruiter: isRecruiter,
  });
  const seed = useMemo(() => (edit && community ? toDraft(community) : null), [edit, community]);
  const ownerUrl = edit
    ? `${base}/${edit}/manage${from && demo ? `?state=${from}&demo=1` : ''}`
    : null;

  useEffect(() => {
    log('mount', edit ? `edit ${edit}` : 'new');
  }, [edit]);

  const close = useCallback(() => navigate(ownerUrl ?? base), [navigate, ownerUrl, base]);

  const saved = (draft) => {
    const renamed = draft.name.trim() !== community.name;
    const status = from === 'needs-change' || renamed ? 'under-review' : (from ?? community.status);
    log('edit saved', edit, status);
    patch((current) => ({
      ...current,
      name: draft.name.trim(),
      about: draft.about.trim(),
      topic: draft.topic,
      cover: draft.cover,
      joinPolicy: draft.joinPolicy,
      ageRule: draft.ageRule,
      regions: draft.regions,
      ownRules: draft.ownRules,
      checkFirstPosts: draft.checkFirstPosts,
      allowEvents: draft.allowEvents,
      status,
      feedback: null,
    }));
    navigate(`${base}/${edit}/manage${demo ? `?state=${status}&demo=1` : ''}`);
  };

  return (
    <>
      <CommunityBrowsePage />
      {edit && !seed ? null : (
        <CreateWizardDialog
          key={edit ?? 'new'}
          create={create}
          seed={seed}
          onSubmitted={edit ? saved : undefined}
          onClose={close}
        />
      )}
    </>
  );
};

export default CommunityCreatePage;
