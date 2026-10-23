import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import {
  fetchMyProfile,
  isLiveProfile,
  saveProfileFields,
} from '../../services/profileStages.api.js';
import Button from '../../components/ui/Button.jsx';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import { STAGE_BY_ID } from '../../components/sections/engagementShell/engagementShellData.js';
import AddSkillDialog from '../../components/sections/engagementV2/skills/AddSkillDialog.jsx';
import SkillsEmptyScreen from '../../components/sections/engagementV2/skills/SkillsEmptyScreen.jsx';
import SkillsLabFooter from '../../components/sections/engagementV2/skills/SkillsLabFooter.jsx';
import SkillsLabScreen from '../../components/sections/engagementV2/skills/SkillsLabScreen.jsx';
import SkillsListScreen from '../../components/sections/engagementV2/skills/SkillsListScreen.jsx';
import {
  DRAFT_BLANK,
  DRAFT_DRAWN,
  MOCK_SKILLS,
  mergeSavedSkills,
  skillFromDraft,
  skillsFromProfile,
  skillsToProfile,
} from '../../components/sections/engagementV2/skills/skillsData.js';
import { useSkillsState } from '../../components/sections/engagementV2/skills/skillsState.js';
import { GUTTER } from '../../components/sections/engagementV2/skills/skillsStyles.js';

const log = debug('SkillsPage');

/*
 * SkillsPage — Engagement revamp stage 4 (route /profile/filling/skills). SK-01 empty · SK-02 list (?state=list) ·
 * SK-03 add dialog (?modal=add) · SK-04 Skills Lab (?view=lab). URLs and state: components/sections/engagementV2/skills/skillsState.js.
 * Live (signed in): skills load from the profile (technicalSkills + softSkills, see skillsData.skillsFromProfile) and every
 * add, plus "Save and continue", writes both lists back with saveProfileFields, then re-reads the profile so new skills
 * pick up their `_id`; no mock skills or drawn dialog values are shown, so an empty profile gets the SK-01 empty state even
 * on ?state=list. Nothing (list, add dialog, ?modal=add deep link) is shown until the load succeeds; a failed load shows a
 * role="status" message and nothing can be saved. Save failures keep the local list and show a role="status" line;
 * "Save and continue" only navigates once the save succeeded. Demo (signed out): MOCK_SKILLS seeded from the URL on first render, kept in page state only.
 * Adding a skill switches to the list.
 */
const SAVE_ERROR = 'We couldn’t save your skills. Check your connection and try again.';
const LOAD_ERROR = 'We couldn’t load your profile. Refresh to try again.';

const DONE = ['avatar', 'interests', 'personality'];

const SkillsPage = () => {
  const navigate = useNavigate();
  const state = useSkillsState();
  const [live] = useState(isLiveProfile);
  const [skills, setSkills] = useState(() =>
    !live && (state.list || state.modal) ? MOCK_SKILLS : []
  );
  /* 'loading' | 'ready' | 'error' — live saves are only ever sent once the profile loaded ('ready'). */
  const [load, setLoad] = useState(live ? 'loading' : 'ready');
  const loaded = load === 'ready';
  const [saveError, setSaveError] = useState('');
  const saveSeq = useRef(0);

  useEffect(() => {
    log('mount', {
      live,
      view: state.view,
      list: state.list,
      modal: state.modal,
      skills: skills.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!live) return undefined;
    let cancelled = false;
    fetchMyProfile()
      .then((profile) => {
        if (cancelled) return;
        const rows = skillsFromProfile(profile);
        log('profile skills loaded', rows.length);
        setSkills(rows);
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
  }, [live]);

  /*
   * Write the whole list (both kinds) to the profile. Resolves true on success (always true in the demo). After a live
   * save the profile is re-read so new skills get their server `_id`, unless another save started meanwhile.
   */
  const persist = async (rows) => {
    if (!live) return true;
    if (load !== 'ready') {
      log.warn('save blocked: profile not loaded', load);
      return false;
    }
    const seq = ++saveSeq.current;
    try {
      await saveProfileFields(skillsToProfile(rows));
      log('saved skills', rows.length);
      setSaveError('');
      fetchMyProfile()
        .then((profile) => {
          if (seq !== saveSeq.current) return;
          setSkills((list) => mergeSavedSkills(list, profile));
        })
        .catch((err) => log.error('re-read after save failed:', err?.message));
      return true;
    } catch (err) {
      log.error('save skills failed:', err?.response?.status || err?.message);
      setSaveError(SAVE_ERROR);
      return false;
    }
  };

  const next = STAGE_BY_ID.work.route;
  const back = STAGE_BY_ID.personality.route;
  const openAdd = () => {
    log('open add dialog');
    state.update({ modal: 'add', blank: true });
  };
  const closeAdd = () => state.update({ modal: null, blank: null });
  const addSkill = (draft) => {
    if (!loaded) return;
    log('add skill', draft.name);
    const next = [...skills, skillFromDraft(draft, skills.length)];
    setSkills(next);
    state.update({ modal: null, blank: null, state: 'list' });
    persist(next);
  };
  const verify = (labId) => {
    log('verify in lab', labId);
    if (!labId) {
      state.update({ view: 'lab' });
      return;
    }
    navigate(`/skills-lab/lab/${labId}/play?from=engagement`);
  };

  if (state.view === 'lab') {
    return (
      <EngagementStageFrame stageId="skills" doneIds={DONE} footer={false}>
        <SkillsLabScreen
          onStartLab={verify}
          onPlayGame={(id) => {
            log('play game', id);
            navigate(`/skills-lab/games/${id}?from=engagement`);
          }}
        />
        <SkillsLabFooter onBack={() => state.update({ view: null, state: 'list' })} />
      </EngagementStageFrame>
    );
  }

  const hasSkills = skills.length > 0;
  const verifiedCount = skills.filter((s) => s.verified).length;
  const statusText = load === 'error' ? LOAD_ERROR : saveError;
  const status = statusText ? (
    <p
      role="status"
      className={`mx-auto mt-[16px] mb-0 w-full max-w-[1728px] font-sans text-[14px] font-medium leading-[20px] text-[#c0392b] ${GUTTER}`}
    >
      {statusText}
    </p>
  ) : null;
  const backButton = (
    <Button
      variant="tertiary-subtle"
      size="lg"
      className="!py-[14px]"
      onClick={() => {
        log('back: personality');
        navigate(back);
      }}
    >
      Back: Personality
    </Button>
  );

  return (
    <EngagementStageFrame
      stageId="skills"
      doneIds={DONE}
      footer={
        hasSkills
          ? {
              left: backButton,
              skipLabel: null,
              continueLabel: 'Save and continue',
              onContinue: async () => {
                log('save and continue', skills.length);
                if (await persist(skills)) navigate(next);
              },
            }
          : {
              left: backButton,
              autoSaved: false,
              continueLabel: 'Next: Work',
              disabled: true,
              onSkip: () => navigate(next),
            }
      }
    >
      {status}
      {!loaded ? null : hasSkills ? (
        <SkillsListScreen
          skills={skills}
          progressSticker={
            live ? `${verifiedCount} VERIFIED · ${skills.length - verifiedCount} TO GO` : undefined
          }
          onAdd={openAdd}
          onVerify={verify}
          onAllLabs={() => state.update({ view: 'lab' })}
          onEdit={(skill) => log('edit skill (not drawn in Figma)', skill.id)}
          onAskColleague={() => log('ask a colleague (not drawn in Figma)')}
        />
      ) : (
        <SkillsEmptyScreen onAdd={openAdd} onImport={() => navigate('/profile/filling/cv')} />
      )}
      {loaded && state.modal ? (
        <AddSkillDialog
          initial={state.blank || live ? DRAFT_BLANK : DRAFT_DRAWN}
          onCancel={closeAdd}
          onSubmit={addSkill}
        />
      ) : null}
    </EngagementStageFrame>
  );
};

export default SkillsPage;
