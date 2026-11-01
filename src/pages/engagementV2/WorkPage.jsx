import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { debug } from '../../utils/debug.js';
import {
  fetchMyProfile,
  isLiveProfile,
  saveProfileFields,
} from '../../services/profileStages.api.js';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import { nextStageRoute } from '../../components/sections/engagementShell/engagementShellData.js';
import {
  AddAnotherRole,
  EmptyState,
  LabNudge,
  ListHeader,
  RoleCard,
  SectionEyebrow,
  WhyRail,
  WorkHero,
} from '../../components/sections/engagementV2/work/WorkParts.jsx';
import { useDragReorder } from '../../components/sections/engagementV2/work/workDrag.js';
import {
  CompleteDialog,
  DeleteDialog,
  RoleDialog,
} from '../../components/sections/engagementV2/work/WorkDialogs.jsx';
import {
  EXAMPLE_ROLE,
  MOCK_NOW,
  SEED_ROLES,
  STAGE_YEARS_LABEL,
  currentMonth,
  formatRange,
  mergeSavedRoles,
  rolesFromProfile,
  rolesToProfile,
  yearsLabel,
} from '../../components/sections/engagementV2/work/workData.js';
import { useWorkState } from '../../components/sections/engagementV2/work/workState.js';
import { GUTTER } from '../../components/sections/engagementV2/work/workStyles.js';

const log = debug('WorkPage');

/*
 * WorkPage — Engagement stage 5 "Work" (Figma WK-01..WK-06; Playful 7707:*, Focused 8285:*), route /profile/filling/work.
 * Frames and URLs are documented at the top of workState.js. Live (signed in): roles load from profile.workExperience
 * (workData.rolesFromProfile) and every add / edit / delete / reorder, plus the footer "Next: Portfolio", writes the whole
 * list back with saveProfileFields (optimistic; a failure keeps the local list and shows a role="status" line), then
 * re-reads the profile so new roles pick up their `_id`. Nothing (list, dialogs, deep links) is shown or editable until
 * the load succeeds; a failed load shows a role="status" message and nothing can be saved. "Next: Portfolio" waits for
 * the save and only opens stage-complete on success. No seed roles are shown, so an empty profile is the WK-01 first
 * visit on every URL. Demo (signed out): SEED_ROLES held in page
 * state only. Either way the footer "Next: Portfolio" opens the stage-complete dialog, whose own "Next: Portfolio" goes
 * to the next stage. "Import from my CV" opens Upload my CV and "No work
 * experience yet? Skip this stage" goes to Portfolio (neither is drawn in Figma). Uses its own footer (Back: Skills / Next: Portfolio).
 */
const SAVE_ERROR = 'We couldn’t save your work history. Check your connection and try again.';
const LOAD_ERROR = 'We couldn’t load your profile. Refresh to try again.';

const WorkPage = () => {
  const navigate = useNavigate();
  const ws = useWorkState();
  const [live] = useState(isLiveProfile);
  const [roles, setRoles] = useState(() =>
    !live && (ws.state || ws.modal) ? SEED_ROLES.map((r) => ({ ...r })) : []
  );
  /* 'loading' | 'ready' | 'error' — live saves are only ever sent once the profile loaded ('ready'). */
  const [load, setLoad] = useState(live ? 'loading' : 'ready');
  const loaded = load === 'ready';
  const [saveError, setSaveError] = useState('');
  const saveSeq = useRef(0);
  const now = live ? currentMonth() : MOCK_NOW;

  /*
   * Write the whole list (in its current order). Resolves true on success (always true in the demo). After a live save
   * the profile is re-read so new roles get their server `_id`, unless another save started meanwhile.
   */
  const persist = async (next) => {
    if (!live) return true;
    if (load !== 'ready') {
      log.warn('save blocked: profile not loaded', load);
      return false;
    }
    const seq = ++saveSeq.current;
    try {
      await saveProfileFields(rolesToProfile(next));
      log('saved roles', next.length);
      setSaveError('');
      fetchMyProfile()
        .then((profile) => {
          if (seq !== saveSeq.current) return;
          setRoles((rs) => mergeSavedRoles(rs, profile, now));
        })
        .catch((err) => log.error('re-read after save failed:', err?.message));
      return true;
    } catch (err) {
      log.error('save roles failed:', err?.response?.status || err?.message);
      setSaveError(SAVE_ERROR);
      return false;
    }
  };
  const commit = (next) => {
    if (!loaded) return;
    setRoles(next);
    persist(next);
  };
  const move = (from, to) => {
    if (from < 0 || to < 0 || from >= roles.length || to >= roles.length) return;
    log('reorder', { from, to });
    const next = [...roles];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    commit(next);
  };
  const dragFor = useDragReorder(roles, move);

  useEffect(() => {
    log('mount', { live, state: ws.state, modal: ws.modal, roles: roles.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!live) return undefined;
    let cancelled = false;
    fetchMyProfile()
      .then((profile) => {
        if (cancelled) return;
        const list = rolesFromProfile(profile);
        log('profile roles loaded', list.length);
        setRoles(list);
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

  /* Demo frames open the first role when ?role= is missing or unknown; live, an unknown / missing id opens nothing. */
  const target = live
    ? (roles.find((r) => r.id === ws.role) ?? null)
    : (roles.find((r) => r.id === ws.role) ?? roles[0] ?? null);
  const empty = roles.length === 0;
  const years = live ? yearsLabel(roles, now) : STAGE_YEARS_LABEL;

  const closeModal = useCallback(() => ws.update({ modal: null, role: null, unsaved: null }), [ws]);
  const staleRole = live && loaded && (ws.modal === 'edit' || ws.modal === 'delete') && !target;
  useEffect(() => {
    if (!staleRole) return;
    log.warn('role not found, closing dialog', ws.role);
    closeModal();
  }, [staleRole, closeModal, ws.role]);
  const openAdd = () => {
    log('open add');
    ws.update({ modal: 'add', state: empty ? null : 'list' });
  };

  const save = (edited) => {
    log('save role', { id: edited.id, mode: ws.modal });
    const prev = roles.find((r) => r.id === edited.id);
    /* Keep the loaded profile item (`_id`, unedited fields); live ranges run to this month, not the drawn MOCK_NOW. */
    const role = live
      ? { ...edited, source: prev?.source, rangeLabel: formatRange(edited, now) }
      : edited;
    commit(prev ? roles.map((r) => (r.id === role.id ? role : r)) : [...roles, role]);
    ws.update({ modal: null, role: null, unsaved: null, state: 'list' });
  };
  const remove = (id) => {
    log('delete role', id);
    commit(roles.filter((r) => r.id !== id));
    ws.update({ modal: null, role: null, unsaved: null, state: 'list' });
  };

  return (
    <EngagementStageFrame
      stageId="work"
      doneIds={['avatar', 'interests', 'personality', 'skills']}
      footer={{
        skipLabel: null,
        continueLabel: 'Next: Portfolio',
        disabled: empty || !loaded,
        left: (
          <Button
            variant="tertiary-subtle"
            size="lg"
            className="!py-[14px]"
            onClick={() => {
              log('back to skills');
              navigate('/profile/filling/skills');
            }}
          >
            Back: Skills
          </Button>
        ),
        onContinue: async () => {
          log('next: stage complete');
          if (await persist(roles)) ws.update({ state: 'complete', modal: null });
        },
      }}
    >
      <WorkHero
        sticker={
          empty
            ? 'STAGE 5 · LET’S GO'
            : `${roles.length} ${roles.length === 1 ? 'ROLE' : 'ROLES'} · ${years} YEARS`
        }
      />
      <main
        className={`mx-auto grid w-full max-w-[1728px] flex-1 items-start gap-x-[clamp(24px,3.7vw,64px)] gap-y-[24px] pt-[40px] pb-[56px] max-lg:pt-[24px] lg:grid-cols-[minmax(0,1072fr)_minmax(0,464fr)] ${GUTTER}`}
      >
        <div className="flex min-w-0 flex-col gap-[20px]">
          {load === 'error' || saveError ? (
            <p
              role="status"
              className="m-0 font-sans text-[14px] font-medium leading-[20px] text-[#c0392b]"
            >
              {load === 'error' ? LOAD_ERROR : saveError}
            </p>
          ) : null}
          {live && loaded ? (
            // 2026-11-01: the journey's Work stage is "Work & education" - a real school completes it too.
            <p className="m-0 flex flex-wrap items-center gap-x-[8px] gap-y-[4px] rounded-[14px] bg-[#ebf1ec] px-[16px] py-[12px] font-sans text-[14px] leading-[20px] text-[#2d5d33]">
              <span>Still studying? Your school counts for this stage too.</span>
              <button
                type="button"
                onClick={() => navigate('/profile?tab=experience')}
                className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#2d5d33] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                Add or fix it in Education
              </button>
            </p>
          ) : null}
          {!loaded ? null : empty ? (
            <>
              <EmptyState
                onAdd={openAdd}
                onImport={() => navigate('/profile/filling/cv')}
                onSkip={() => navigate(nextStageRoute('work'))}
              />
              <SectionEyebrow>WHAT A STRONG ROLE LOOKS LIKE</SectionEyebrow>
              <RoleCard role={EXAMPLE_ROLE} example />
            </>
          ) : (
            <>
              <ListHeader count={roles.length} />
              {roles.map((r, i) => (
                <RoleCard
                  key={r.id}
                  role={r}
                  isFirst={i === 0}
                  isLast={i === roles.length - 1}
                  dragProps={dragFor(r.id)}
                  onMove={(d) => move(i, i + d)}
                  onEdit={() => ws.update({ modal: 'edit', role: r.id, state: 'list' })}
                />
              ))}
              <AddAnotherRole onClick={openAdd} />
              <LabNudge
                onOpen={() => {
                  log('open skills lab');
                  navigate('/skills-lab');
                }}
              />
            </>
          )}
        </div>
        <WhyRail />
      </main>

      {loaded && ws.modal === 'add' ? (
        <RoleDialog mode="add" live={live} onClose={closeModal} onSave={save} />
      ) : null}
      {loaded && ws.modal === 'edit' && target ? (
        <RoleDialog
          key={target.id}
          mode="edit"
          live={live}
          role={target}
          showUnsaved={ws.unsaved}
          onClose={closeModal}
          onSave={save}
          onDelete={(id) => ws.update({ modal: 'delete', role: id, unsaved: null })}
        />
      ) : null}
      {loaded && ws.modal === 'delete' && target ? (
        <DeleteDialog
          role={target}
          count={roles.length}
          onClose={closeModal}
          onDelete={remove}
          onEdit={() => ws.update({ modal: 'edit', role: target.id })}
        />
      ) : null}
      {loaded && ws.state === 'complete' && !ws.modal ? (
        <CompleteDialog
          roleCount={roles.length}
          yearsLabel={years}
          onStay={() => ws.update({ state: 'list' })}
          onNext={() => {
            log('next: portfolio');
            navigate('/profile/filling/portfolio');
          }}
        />
      ) : null}
    </EngagementStageFrame>
  );
};

export default WorkPage;
