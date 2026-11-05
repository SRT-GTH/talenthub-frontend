import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import {
  STAGE_BY_ID,
  stageNumber,
} from '../../components/sections/engagementShell/engagementShellData.js';
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
  goalsFromProfile,
  goalsToProfile,
} from '../../components/sections/engagementV2/goals/goalsData.js';
import { useGoalsState } from '../../components/sections/engagementV2/goals/goalsState.js';
import { PAGE_X } from '../../components/sections/engagementV2/goals/goalsStyles.js';
import { useUiStyle } from '../../hooks/useUiStyle.js';
import {
  fetchMyProfile,
  isLiveProfile,
  saveProfileFields,
} from '../../services/profileStages.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('GoalsPage');

/*
 * GoalsPage (stage 8, Figma GO-01..GO-06, Focused default + Playful). Route /profile/filling/goals; URL state is documented at
 * the top of goalsState.js. Add / edit / delete a goal, drag (or Arrow keys on the handle) to set priority (first = primary),
 * Next: Pitch opens the stage-complete dialog, which continues to the Pitch stage.
 * Live (signed in): goals load from the profile's user-sourced `desiredCareers` and every committed change (add, edit, delete,
 * reorder, Next) writes `desiredCareers` + `careerGoals` back (mappers in goalsData.js); never seeded.
 * Demo (signed out): component state only; the URL design frames (?state / ?modal) start with SEED_GOALS.
 */
const GoalsPage = () => {
  const navigate = useNavigate();
  const { uiStyle } = useUiStyle();
  const st = useGoalsState();
  const live = isLiveProfile();
  const [goals, setGoals] = useState(() => (!live && (st.state || st.modal) ? SEED_GOALS : []));
  /* live: 'loading' | 'ready' | 'error'. Dialogs and saves wait for 'ready'; a failed load never saves. */
  const [load, setLoad] = useState(live ? 'loading' : 'ready');
  const loaded = load === 'ready';
  const [saveError, setSaveError] = useState(null);
  const profileRef = useRef(null);
  const saveSeq = useRef(0);

  const target = goals.find((g) => g.id === st.goalId) ?? goals[0] ?? null;
  const modal = !loaded
    ? null
    : st.modal === 'add' || ((st.modal === 'edit' || st.modal === 'delete') && target)
      ? st.modal
      : null;
  const hasGoals = goals.length > 0;
  const pitchRoute = STAGE_BY_ID.pitch.route;
  const certsRoute = STAGE_BY_ID.certs.route;

  useEffect(() => {
    log('mount', { state: st.state, modal: st.modal, goals: goals.length });
  }, [st.state, st.modal, goals.length]);

  useEffect(() => {
    if (!live) return undefined;
    let cancelled = false;
    fetchMyProfile()
      .then((profile) => {
        if (cancelled) return;
        profileRef.current = profile;
        const found = goalsFromProfile(profile);
        log('loaded live goals', found.length);
        setGoals(found);
        setLoad('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        log.error('load goals failed:', err?.response?.status || err?.message);
        setLoad('error');
      });
    return () => {
      cancelled = true;
    };
  }, [live]);

  /*
   * Live: write the whole goal list (plus untouched non-user careers), then re-read the profile so new goals pick up their
   * server _id (applied only if no other save started meanwhile). Resolves true when saved (always true in the demo).
   */
  const persist = async (next) => {
    if (!live) return true;
    if (load !== 'ready' || !profileRef.current) {
      /* Without the loaded profile a whole-list write would drop the careers other surfaces wrote. */
      log.error('save goals blocked: profile not loaded', load);
      return false;
    }
    const fields = goalsToProfile(next, profileRef.current);
    const seq = ++saveSeq.current;
    log('save goals', { goals: next.length, desiredCareers: fields.desiredCareers.length, seq });
    try {
      await saveProfileFields(fields);
      setSaveError(null);
      profileRef.current = { ...profileRef.current, ...fields };
    } catch (err) {
      log.error('save goals failed:', err?.response?.status || err?.message);
      setSaveError(
        'We couldn’t save your goals. Your changes are kept here, try again in a moment.'
      );
      return false;
    }
    fetchMyProfile()
      .then((p) => {
        if (saveSeq.current !== seq) return log('re-read skipped: newer save', seq);
        profileRef.current = p;
        setGoals(goalsFromProfile(p));
      })
      .catch((err) => log.error('re-read after save failed:', err?.message));
    return true;
  };

  const commit = (next) => {
    setGoals(next);
    persist(next);
  };

  const showList = (patch = {}) => st.update({ modal: null, goal: null, state: 'list', ...patch });

  const saveGoal = (draft, makePrimary) => {
    const isEdit = st.modal === 'edit';
    log('save goal', { isEdit, id: draft.id, makePrimary });
    let next = isEdit
      ? goals.map((g) => (g.id === draft.id ? draft : g))
      : [...goals, { ...draft, id: `goal-${Date.now()}` }];
    const id = isEdit ? draft.id : next[next.length - 1].id;
    const idx = next.findIndex((g) => g.id === id);
    if (makePrimary && idx > 0) {
      next = [next[idx], ...next.filter((_, i) => i !== idx)];
    } else if (!makePrimary && isEdit && idx === 0 && next.length > 1) {
      next = [next[1], next[0], ...next.slice(2)];
    }
    commit(next);
    showList();
  };

  const deleteGoal = () => {
    log('delete goal', target?.id);
    const rest = goals.filter((g) => g.id !== target.id);
    commit(rest);
    st.update({ modal: null, goal: null, state: rest.length ? 'list' : null });
  };

  const reorder = (fromId, toId) => {
    log('reorder', { fromId, toId });
    const from = goals.findIndex((g) => g.id === fromId);
    const to = goals.findIndex((g) => g.id === toId);
    if (from < 0 || to < 0) return;
    const next = [...goals];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    commit(next);
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
        onContinue: async () => {
          if (!(await persist(goals))) return;
          st.update({ state: 'complete' });
        },
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
        sticker={
          hasGoals ? `${goals.length} GOALS · 1 PRIMARY` : `STAGE ${stageNumber('goals')} · AIM IT`
        }
        stickerClass="rotate-[4deg]"
        card={<HeroInfoCard title="A strong goal has" rows={HERO_CARD_ROWS} />}
      />
      <div className={`flex-1 pt-6 pb-10 lg:pt-10 lg:pb-[57px] ${PAGE_X}`}>
        <div className="mx-auto grid max-w-[1728px] items-start gap-6 lg:grid-cols-[minmax(0,1072fr)_minmax(0,464fr)] lg:justify-between lg:gap-[clamp(24px,3.7vw,64px)]">
          <div className="flex min-w-0 flex-col gap-5">
            {load === 'error' ? (
              <p
                role="status"
                className="m-0 rounded-[12px] border border-solid border-[#f3c7c2] bg-[#fdf1f0] px-4 py-3 font-sans text-[14px] leading-[20px] text-[#b42318]"
              >
                We couldn’t load your profile. Refresh to try again.
              </p>
            ) : null}
            {saveError ? (
              <p
                role="status"
                className="m-0 rounded-[12px] border border-solid border-[#f3c7c2] bg-[#fdf1f0] px-4 py-3 font-sans text-[14px] leading-[20px] text-[#b42318]"
              >
                {saveError}
              </p>
            ) : null}
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
