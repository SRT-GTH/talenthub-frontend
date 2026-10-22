import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { debug } from '../../utils/debug.js';
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
  SEED_ROLES,
  STAGE_YEARS_LABEL,
} from '../../components/sections/engagementV2/work/workData.js';
import { useWorkState } from '../../components/sections/engagementV2/work/workState.js';
import { GUTTER } from '../../components/sections/engagementV2/work/workStyles.js';

const log = debug('WorkPage');

/*
 * WorkPage — Engagement stage 5 "Work" (Figma WK-01..WK-06; Playful 7707:*, Focused 8285:*), route /profile/filling/work.
 * Frames and URLs are documented at the top of workState.js. Roles are mock data held in page state (API-shaped, see
 * workData.js): add / edit / delete / drag-reorder work for real; the footer "Next: Portfolio" opens the stage-complete
 * dialog, whose own "Next: Portfolio" goes to the next stage. "Import from my CV" opens Upload my CV and "No work
 * experience yet? Skip this stage" goes to Portfolio (neither is drawn in Figma). Uses its own footer (Back: Skills / Next: Portfolio).
 */
const WorkPage = () => {
  const navigate = useNavigate();
  const ws = useWorkState();
  const [roles, setRoles] = useState(() =>
    ws.state || ws.modal ? SEED_ROLES.map((r) => ({ ...r })) : []
  );
  const dragFor = useDragReorder(roles, (from, to) =>
    setRoles((rs) => {
      const next = [...rs];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    })
  );
  useEffect(() => {
    log('mount', { state: ws.state, modal: ws.modal, roles: roles.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const target = roles.find((r) => r.id === ws.role) ?? roles[0] ?? null;
  const empty = roles.length === 0;

  const closeModal = useCallback(() => ws.update({ modal: null, role: null, unsaved: null }), [ws]);
  const openAdd = () => {
    log('open add');
    ws.update({ modal: 'add', state: empty ? null : 'list' });
  };

  const save = (role) => {
    log('save role', { id: role.id, mode: ws.modal });
    setRoles((rs) =>
      rs.some((r) => r.id === role.id)
        ? rs.map((r) => (r.id === role.id ? role : r))
        : [...rs, role]
    );
    ws.update({ modal: null, role: null, unsaved: null, state: 'list' });
  };
  const remove = (id) => {
    log('delete role', id);
    setRoles((rs) => rs.filter((r) => r.id !== id));
    ws.update({ modal: null, role: null, unsaved: null, state: 'list' });
  };

  return (
    <EngagementStageFrame
      stageId="work"
      doneIds={['avatar', 'interests', 'personality', 'skills']}
      footer={{
        skipLabel: null,
        continueLabel: 'Next: Portfolio',
        disabled: empty,
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
        onContinue: () => {
          log('next: stage complete');
          ws.update({ state: 'complete', modal: null });
        },
      }}
    >
      <WorkHero
        sticker={
          empty
            ? 'STAGE 5 · LET’S GO'
            : `${roles.length} ${roles.length === 1 ? 'ROLE' : 'ROLES'} · ${STAGE_YEARS_LABEL} YEARS`
        }
      />
      <main
        className={`mx-auto grid w-full max-w-[1728px] flex-1 items-start gap-x-[clamp(24px,3.7vw,64px)] gap-y-[24px] pt-[40px] pb-[56px] max-lg:pt-[24px] lg:grid-cols-[minmax(0,1072fr)_minmax(0,464fr)] ${GUTTER}`}
      >
        <div className="flex min-w-0 flex-col gap-[20px]">
          {empty ? (
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
                  onMove={(d) =>
                    setRoles((rs) => {
                      const next = [...rs];
                      const [m] = next.splice(i, 1);
                      next.splice(i + d, 0, m);
                      return next;
                    })
                  }
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

      {ws.modal === 'add' ? <RoleDialog mode="add" onClose={closeModal} onSave={save} /> : null}
      {ws.modal === 'edit' && target ? (
        <RoleDialog
          key={target.id}
          mode="edit"
          role={target}
          showUnsaved={ws.unsaved}
          onClose={closeModal}
          onSave={save}
          onDelete={(id) => ws.update({ modal: 'delete', role: id, unsaved: null })}
        />
      ) : null}
      {ws.modal === 'delete' && target ? (
        <DeleteDialog
          role={target}
          count={roles.length}
          onClose={closeModal}
          onDelete={remove}
          onEdit={() => ws.update({ modal: 'edit', role: target.id })}
        />
      ) : null}
      {ws.state === 'complete' && !ws.modal ? (
        <CompleteDialog
          roleCount={roles.length}
          yearsLabel={STAGE_YEARS_LABEL}
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
