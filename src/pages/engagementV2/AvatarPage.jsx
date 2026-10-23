import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import EngagementStageBar from '../../components/sections/engagementShell/EngagementStageBar.jsx';
import { ENGAGEMENT_STAGES } from '../../components/sections/engagementShell/engagementShellData.js';
import AvatarHero from '../../components/sections/engagementV2/avatar/AvatarHero.jsx';
import AvatarPanel from '../../components/sections/engagementV2/avatar/AvatarPanel.jsx';
import AvatarSwitchModesDialog from '../../components/sections/engagementV2/avatar/AvatarSwitchModesDialog.jsx';
import {
  ExtrasBody,
  HairBody,
  OutfitBody,
  SkinBody,
  StyleBody,
} from '../../components/sections/engagementV2/avatar/AvatarStepBodies.jsx';
import {
  AVATAR_ROUTES,
  STEP_META,
  avatarFromProfile,
  avatarToProfile,
  extrasSelectedCount,
  outfitSelectedCount,
} from '../../components/sections/engagementV2/avatar/avatarData.js';
import { useAvatarState } from '../../components/sections/engagementV2/avatar/avatarState.js';
import { useAvatarSelection } from '../../hooks/useAvatarSelection.js';
import {
  fetchMyProfile,
  isLiveProfile,
  saveProfileFields,
} from '../../services/profileStages.api.js';
import { STORAGE_KEYS } from '../../constants/storageKeys.js';
import { debug } from '../../utils/debug.js';

const log = debug('AvatarPage');

/*
 * AvatarPage — Engagement revamp, Avatar selection (Figma section "Avatar selection": Focused 8285:3264 / Playful 3218:2745).
 * One page, five steps chosen by the route (`step`: undefined = Style | 'skin' | 'hair' | 'extras' | 'outfit'; mounted in App.jsx inside
 * AvatarFlowLayout at /profile/engagement/avatar[/skin|/hair|/extras|/outfit]). `?modal=switch-modes` opens the "Switch Modes" dialog
 * (also reachable from the nav's gold "Change input mode" button). Selections live in the app-root AvatarSelectionProvider so Career
 * Buddy shows the same avatar.
 * Live vs demo: for a signed-in talent (isLiveProfile()) the saved profile `avatar` is loaded into the provider once per session
 * (an empty profile resets the picker to its no-picks defaults). Until that load succeeds the picker is inert and nothing can be
 * saved; a failed load shows a status line and blocks the save (the app-root seed is never written). The last step's "finish
 * avatar" button awaits the save (avatarToProfile in avatarData.js) and only then leaves; a failed save keeps the talent here
 * with an inline status message.
 * Signed out (demo) the provider keeps its app-root seed and nothing is saved. The Figma stage bar reads "STAGE 1 OF 9 · Avatar · 1 of 9 done · 11%" with segment 2 in gold, which the
 * shared frame cannot express from `stageId`, so the shared EngagementStageBar is rendered here with explicit segments.
 * Footer: the frames draw their own action card inside the panel, so the shared sticky footer is off.
 */
const BODIES = {
  style: StyleBody,
  skin: SkinBody,
  hair: HairBody,
  extras: ExtrasBody,
  outfit: OutfitBody,
};
const ORDER = ['style', 'skin', 'hair', 'extras', 'outfit'];
const SEGMENTS = ENGAGEMENT_STAGES.map((s) =>
  s.n === 1 ? 'done' : s.n === 2 ? 'current' : 'todo'
);

/* The session (auth token) whose saved avatar is already in the provider. Module-level so stepping between the five routes,
   which remounts this page, neither reloads nor overwrites in-progress picks. */
let hydratedFor = null;
const sessionToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.authToken) || '';
  } catch {
    return '';
  }
};
const LOAD_ERROR = 'We couldn’t load your profile. Refresh to try again.';

const AvatarPage = ({ step: stepProp }) => {
  const step = stepProp ?? 'style';
  const navigate = useNavigate();
  const { selection, hydrate } = useAvatarSelection();
  const { modal, update } = useAvatarState();
  const meta = STEP_META[step];
  const Body = BODIES[step];
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  // 'loading' | 'ready' | 'error' — demo sessions and an already-loaded session start ready.
  const [load, setLoad] = useState(() =>
    !isLiveProfile() || hydratedFor === sessionToken() ? 'ready' : 'loading'
  );
  const hydrateRef = useRef(hydrate);
  hydrateRef.current = hydrate;

  useEffect(() => {
    log('mount', { step, modal });
  }, [step, modal]);

  // Live: load the saved avatar into the picker (once per session; the picker is inert until then).
  useEffect(() => {
    if (load !== 'loading') return undefined;
    let cancelled = false;
    const t = sessionToken();
    fetchMyProfile()
      .then((profile) => {
        if (cancelled) return;
        const saved = profile?.avatar?.avatarId ? profile.avatar : null;
        log('load saved avatar', saved ? saved.avatarId : 'none');
        hydrateRef.current(avatarFromProfile(saved) || {});
        hydratedFor = t;
        setLoad('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        log.error('profile load failed:', err?.response?.status || err?.message);
        setLoad('error');
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const go = (id) => {
    log('go', id);
    navigate(AVATAR_ROUTES[id]);
  };
  const idx = ORDER.indexOf(step);
  const onBack = () => {
    log('back from', step);
    if (idx === 0) navigate('/profile/engagement');
    else go(ORDER[idx - 1]);
  };
  const finish = async () => {
    if (!isLiveProfile()) {
      navigate('/profile/engagement');
      return;
    }
    if (saving) return;
    if (load !== 'ready') {
      log('save blocked: profile not loaded', load);
      return;
    }
    const avatar = avatarToProfile(selection);
    log('save avatar', avatar);
    setSaving(true);
    setSaveError(null);
    try {
      await saveProfileFields({ avatar });
      navigate('/profile/engagement');
    } catch (err) {
      log.error('save avatar failed:', err?.response?.status || err?.message);
      setSaveError("Couldn't save your avatar. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };
  const onNext = () => {
    log('next from', step);
    if (idx === ORDER.length - 1) finish();
    else go(ORDER[idx + 1]);
  };

  const selectedCount =
    step === 'extras'
      ? extrasSelectedCount(selection)
      : step === 'outfit'
        ? outfitSelectedCount(selection)
        : null;

  return (
    <EngagementStageFrame
      stageId={null}
      footer={false}
      onChangeInputMode={() => update({ modal: 'switch-modes' })}
    >
      <EngagementStageBar stageNumber={1} stageName="Avatar" segments={SEGMENTS} doneCount={1} />
      <div className="relative isolate overflow-hidden [container-type:inline-size]">
        <div
          className="relative grid grid-cols-1 lg:grid-cols-[990fr_738fr]"
          style={{ '--u': 'calc(min(100cqw, 1728px) / 1728)' }}
        >
          <AvatarHero meta={meta} />
          <AvatarPanel
            meta={meta}
            step={step}
            selectedCount={selectedCount}
            onTab={go}
            onBack={onBack}
            onNext={onNext}
            notice={load === 'error' ? LOAD_ERROR : saveError}
            busy={load !== 'ready'}
          >
            <Body />
          </AvatarPanel>
        </div>
      </div>
      {modal === 'switch-modes' ? (
        <AvatarSwitchModesDialog
          onClose={() => update({ modal: null })}
          onChoose={(id) => {
            log('mode chosen', id);
            if (id === 'chat') navigate('/profile/filling/career-buddy');
            else if (id === 'cv') navigate('/profile/filling/cv');
            else update({ modal: null });
          }}
        />
      ) : null}
    </EngagementStageFrame>
  );
};

export default AvatarPage;
