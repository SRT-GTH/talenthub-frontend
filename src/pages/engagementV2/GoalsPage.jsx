import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import { STAGE_BY_ID } from '../../components/sections/engagementShell/engagementShellData.js';
import {
  DeleteGoalDialog,
  GoalFormDialog,
  StageCompleteDialog,
} from '../../components/sections/engagementV2/goals/GoalsDialogs.jsx';
import {
  GoalsEmpty,
  GoalsList,
} from '../../components/sections/engagementV2/goals/GoalsContent.jsx';
import {
  HeroInfoCard,
  PageHero,
  RailCard,
} from '../../components/sections/engagementV2/goals/GoalsParts.jsx';
import {
  ALMOST_ROWS,
  EMPTY_GOAL,
  HERO_CARD_ROWS,
  SEED_GOALS,
  STAGE_DONE_IDS,
  WHY_ROWS,
} from '../../components/sections/engagementV2/goals/goalsData.js';
import { useGoalsState } from '../../components/sections/engagementV2/goals/goalsState.js';
import { PAGE_X } from '../../components/sections/engagementV2/goals/goalsStyles.js';
import { useUiStyle } from '../../hooks/useUiStyle.js';
import { debug } from '../../utils/debug.js';

const log = debug('GoalsPage');

/*
 * GoalsPage (stage 8, Figma GO-01..GO-06, Focused default + Playful). Route /profile/filling/goals; URL state is documented at
 * the top of goalsState.js. Real behaviour on mock data (goalsData.js): add / edit / delete a goal, drag (or Arrow keys on the
 * handle) to set priority (first = primary), Next: Pitch opens the stage-complete dialog, which continues to the Pitch stage.
 * The goals live in component state (no persistence yet: swap for the API and keep the goal shape).
 */
const GoalsPage = () => {
  const navigate = useNavigate();
  const { uiStyle } = useUiStyle();
  const st = useGoalsState();
  const [goals, setGoals] = useState(() => (st.state || st.modal ? SEED_GOALS : []));

  const target = goals.find((g) => g.id === st.goalId) ?? goals[0] ?? null;
  const modal =
    st.modal === 'add' || ((st.modal === 'edit' || st.modal === 'delete') && target)
      ? st.modal
      : null;
  const hasGoals = goals.length > 0;
  const pitchRoute = STAGE_BY_ID.pitch.route;
  const certsRoute = STAGE_BY_ID.certs.route;

  useEffect(() => {
    log('mount', { state: st.state, modal: st.modal, goals: goals.length });
  }, [st.state, st.modal, goals.length]);

  const showList = (patch = {}) => st.update({ modal: null, goal: null, state: 'list', ...patch });

  const saveGoal = (draft, makePrimary) => {
    const isEdit = st.modal === 'edit';
    log('save goal', { isEdit, id: draft.id, makePrimary });
    setGoals((prev) => {
      let next = isEdit
        ? prev.map((g) => (g.id === draft.id ? draft : g))
        : [...prev, { ...draft, id: `goal-${Date.now()}` }];
      const id = isEdit ? draft.id : next[next.length - 1].id;
      const idx = next.findIndex((g) => g.id === id);
      if (makePrimary && idx > 0) {
        next = [next[idx], ...next.filter((_, i) => i !== idx)];
      } else if (!makePrimary && isEdit && idx === 0 && next.length > 1) {
        next = [next[1], next[0], ...next.slice(2)];
      }
      return next;
    });
    showList();
  };

  const deleteGoal = () => {
    log('delete goal', target?.id);
    const rest = goals.filter((g) => g.id !== target.id);
    setGoals(rest);
    st.update({ modal: null, goal: null, state: rest.length ? 'list' : null });
  };

  const reorder = (fromId, toId) => {
    log('reorder', { fromId, toId });
    setGoals((prev) => {
      const from = prev.findIndex((g) => g.id === fromId);
      const to = prev.findIndex((g) => g.id === toId);
      if (from < 0 || to < 0) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const moveBy = (id, dir) => {
    const i = goals.findIndex((g) => g.id === id);
    const j = i + dir;
    if (j < 0 || j >= goals.length) return;
    reorder(id, goals[j].id);
  };

  const skip = () => {
    log('skip stage -> pitch');
    navigate(pitchRoute);
  };

  return (
    <EngagementStageFrame
      stageId="goals"
      doneIds={STAGE_DONE_IDS}
      footer={{
        skipLabel: null,
        continueLabel: 'Next: Pitch',
        disabled: !hasGoals,
        onContinue: () => st.update({ state: 'complete' }),
        left: (
          <Button
            variant="tertiary-subtle"
            size="lg"
            className="py-[14px]!"
            onClick={() => navigate(certsRoute)}
          >
            Back: Certs
          </Button>
        ),
      }}
    >
      <PageHero
        eyebrow="GOALS"
        title={
          <>
            <span className="text-[#1c2a21]">Where are you </span>
            <span className="text-[#387440]">actually heading?</span>
          </>
        }
        lead="Tell recruiters the role, place, timing and pay you want. Your primary goal drives your headline match."
        sticker={hasGoals ? `${goals.length} GOALS · 1 PRIMARY` : 'STAGE 8 · AIM IT'}
        stickerClass="rotate-[4deg]"
        card={<HeroInfoCard title="A strong goal has" rows={HERO_CARD_ROWS} />}
      />
      <div className={`flex-1 pt-6 pb-10 lg:pt-10 lg:pb-[57px] ${PAGE_X}`}>
        <div className="mx-auto grid max-w-[1728px] items-start gap-6 lg:grid-cols-[minmax(0,1072fr)_minmax(0,464fr)] lg:justify-between lg:gap-[clamp(24px,3.7vw,64px)]">
          <div className="flex min-w-0 flex-col gap-5">
            {hasGoals ? (
              <GoalsList
                goals={goals}
                onEdit={(id) => st.update({ modal: 'edit', goal: id })}
                onAdd={() => st.update({ modal: 'add' })}
                onReorder={reorder}
                onMoveBy={moveBy}
              />
            ) : (
              <GoalsEmpty onAdd={() => st.update({ modal: 'add' })} onSkip={skip} />
            )}
          </div>
          <div className="flex flex-col gap-5">
            <RailCard title="Why goals matter" rows={WHY_ROWS} />
            <RailCard title="Almost there" rows={ALMOST_ROWS} />
          </div>
        </div>
      </div>

      {modal === 'add' ? (
        <GoalFormDialog
          mode="add"
          goal={EMPTY_GOAL}
          isPrimary={!hasGoals}
          onSave={saveGoal}
          onClose={() => st.update({ modal: null })}
        />
      ) : null}
      {modal === 'edit' ? (
        <GoalFormDialog
          key={target.id}
          mode="edit"
          goal={target}
          isPrimary={goals[0]?.id === target.id}
          onSave={saveGoal}
          onDelete={() => st.update({ modal: 'delete', goal: target.id })}
          onClose={() => showList()}
        />
      ) : null}
      {modal === 'delete' ? (
        <DeleteGoalDialog
          goal={target}
          isPrimary={goals[0]?.id === target.id}
          nextPrimary={goals[1]}
          onEditInstead={() => st.update({ modal: 'edit', goal: target.id })}
          onDelete={deleteGoal}
          onClose={() => showList()}
        />
      ) : null}
      {st.complete && hasGoals ? (
        <StageCompleteDialog
          goals={goals}
          uiStyle={uiStyle}
          onClose={() => showList({ state: 'list' })}
          onNext={() => navigate(pitchRoute)}
        />
      ) : null}
    </EngagementStageFrame>
  );
};

export default GoalsPage;
