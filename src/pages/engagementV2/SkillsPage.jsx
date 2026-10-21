import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
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
} from '../../components/sections/engagementV2/skills/skillsData.js';
import { useSkillsState } from '../../components/sections/engagementV2/skills/skillsState.js';

const log = debug('SkillsPage');

/*
 * SkillsPage — Engagement revamp stage 4 (route /profile/filling/skills). SK-01 empty · SK-02 list (?state=list) ·
 * SK-03 add dialog (?modal=add) · SK-04 Skills Lab (?view=lab). URLs and state: components/sections/engagementV2/skills/skillsState.js.
 * Skills live in component state (mock data, seeded from the URL on first render); adding one switches to the list.
 */
const DONE = ['avatar', 'interests', 'personality'];

const SkillsPage = () => {
  const navigate = useNavigate();
  const state = useSkillsState();
  const [skills, setSkills] = useState(() => (state.list || state.modal ? MOCK_SKILLS : []));

  useEffect(() => {
    log('mount', { view: state.view, list: state.list, modal: state.modal, skills: skills.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = STAGE_BY_ID.work.route;
  const back = STAGE_BY_ID.personality.route;
  const openAdd = () => {
    log('open add dialog');
    state.update({ modal: 'add', blank: true });
  };
  const closeAdd = () => state.update({ modal: null, blank: null });
  const addSkill = (draft) => {
    log('add skill', draft.name);
    setSkills((list) => [
      ...list,
      {
        id: `${draft.name.toLowerCase().replace(/\W+/g, '-')}-${list.length}`,
        name: draft.name,
        icon: 'function',
        level: draft.level,
        category: draft.category,
        usedIn: draft.usedIn,
        verified: false,
        endorsements: 0,
        endorsers: [],
      },
    ]);
    state.update({ modal: null, blank: null, state: 'list' });
  };
  const verify = (labId) => {
    log('verify in lab', labId);
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
              onContinue: () => navigate(next),
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
      {hasSkills ? (
        <SkillsListScreen
          skills={skills}
          onAdd={openAdd}
          onVerify={verify}
          onAllLabs={() => state.update({ view: 'lab' })}
          onEdit={(skill) => log('edit skill (not drawn in Figma)', skill.id)}
          onAskColleague={() => log('ask a colleague (not drawn in Figma)')}
        />
      ) : (
        <SkillsEmptyScreen
          onAdd={openAdd}
          onImport={() => log('import from CV (not drawn in Figma)')}
        />
      )}
      {state.modal ? (
        <AddSkillDialog
          initial={state.blank ? DRAFT_BLANK : DRAFT_DRAWN}
          onCancel={closeAdd}
          onSubmit={addSkill}
        />
      ) : null}
    </EngagementStageFrame>
  );
};

export default SkillsPage;
