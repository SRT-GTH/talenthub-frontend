import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import { nextStageRoute } from '../../components/sections/engagementShell/engagementShellData.js';
import Button from '../../components/ui/Button.jsx';
import {
  AddAnotherProject,
  EmptyState,
  ListHeader,
  PortfolioHero,
  PortfolioRail,
  ProjectCard,
  SectionEyebrow,
} from '../../components/sections/engagementV2/portfolio/PortfolioParts.jsx';
import {
  CompleteDialog,
  DeleteDialog,
  ProjectDialog,
} from '../../components/sections/engagementV2/portfolio/PortfolioDialogs.jsx';
import { useDragReorder } from '../../components/sections/engagementV2/portfolio/portfolioDrag.js';
import {
  EXAMPLE_PROJECT,
  SEED_PROJECTS,
} from '../../components/sections/engagementV2/portfolio/portfolioData.js';
import { usePortfolioState } from '../../components/sections/engagementV2/portfolio/portfolioState.js';
import { GUTTER } from '../../components/sections/engagementV2/portfolio/portfolioStyles.js';

const log = debug('PortfolioPage');

/*
 * PortfolioPage — Engagement stage 6 "Portfolio" (Figma PF-01..PF-06; Playful 7709:* / 7710:*, Focused 8285:*), route
 * /profile/filling/portfolio. Frames and URLs are documented at the top of portfolioState.js. Projects are mock data held
 * in page state (API-shaped, see portfolioData.js): add / edit / delete / pin / drag-reorder work for real; the footer
 * "Next: Certs" opens the stage-complete dialog (PF-06), whose "See your milestone" goes to the Top 20% milestone.
 * "Nothing to show yet? Skip this stage" goes to Certs. Not drawn in Figma and therefore inert (log only): "Paste a link".
 */
const PortfolioPage = () => {
  const navigate = useNavigate();
  const ps = usePortfolioState();
  const [projects, setProjects] = useState(() =>
    ps.state || ps.modal ? SEED_PROJECTS.map((p) => ({ ...p })) : []
  );
  const dragFor = useDragReorder(projects, (from, to) =>
    setProjects((rs) => {
      const next = [...rs];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    })
  );
  useEffect(() => {
    log('mount', { state: ps.state, modal: ps.modal, projects: projects.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const target = projects.find((p) => p.id === ps.project) ?? projects[0] ?? null;
  const empty = projects.length === 0;
  const pinned = projects.find((p) => p.pinned) ?? null;

  const closeModal = useCallback(() => ps.update({ modal: null, project: null }), [ps]);
  const openAdd = () => {
    log('open add');
    ps.update({ modal: 'add', state: empty ? null : 'list' });
  };

  const save = (project) => {
    log('save project', { id: project.id, pinned: project.pinned });
    setProjects((rs) => {
      const exists = rs.some((r) => r.id === project.id);
      const base = project.pinned ? rs.map((r) => ({ ...r, pinned: false })) : rs;
      return exists ? base.map((r) => (r.id === project.id ? project : r)) : [...base, project];
    });
    ps.update({ modal: null, project: null, state: 'list' });
  };
  const remove = (id) => {
    log('delete project', id);
    setProjects((rs) => rs.filter((r) => r.id !== id));
    ps.update({ modal: null, project: null, state: 'list' });
  };

  const sticker = empty
    ? 'STAGE 6 · SHOW IT'
    : `${projects.length} ${projects.length === 1 ? 'PROJECT' : 'PROJECTS'} · ${projects.filter((p) => p.pinned).length} PINNED`;

  return (
    <EngagementStageFrame
      stageId="portfolio"
      doneIds={['avatar', 'interests', 'personality', 'skills', 'work']}
      footer={{
        left: (
          <Button
            variant="tertiary-subtle"
            size="lg"
            onClick={() => {
              log('back to work');
              navigate('/profile/filling/work');
            }}
            className="!py-[14px]"
          >
            Back: Work
          </Button>
        ),
        skipLabel: null,
        continueLabel: 'Next: Certs',
        disabled: empty,
        onContinue: () => {
          log('next: stage complete');
          ps.update({ state: 'complete', modal: null });
        },
      }}
    >
      <PortfolioHero sticker={sticker} />
      <main
        className={`mx-auto grid w-full max-w-[1728px] flex-1 items-start gap-x-[clamp(24px,3.7vw,64px)] gap-y-[24px] pt-[40px] pb-[56px] max-lg:pt-[24px] lg:grid-cols-[minmax(0,1072fr)_minmax(0,464fr)] ${GUTTER}`}
      >
        <div className="flex min-w-0 flex-col gap-[20px]">
          {empty ? (
            <>
              <EmptyState
                onAdd={openAdd}
                onPasteLink={() => log('paste a link (not drawn in Figma: inert)')}
                onSkip={() => navigate(nextStageRoute('portfolio'))}
              />
              <SectionEyebrow>WHAT A STRONG PROJECT LOOKS LIKE</SectionEyebrow>
              <div className="lg:-mr-[clamp(0px,1.97vw,34px)]">
                <ProjectCard project={EXAMPLE_PROJECT} example />
              </div>
            </>
          ) : (
            <>
              <ListHeader count={projects.length} />
              {projects.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  isFirst={i === 0}
                  isLast={i === projects.length - 1}
                  dragProps={dragFor(p.id)}
                  onMove={(d) =>
                    setProjects((rs) => {
                      const next = [...rs];
                      const [m] = next.splice(i, 1);
                      next.splice(i + d, 0, m);
                      return next;
                    })
                  }
                  onEdit={() => ps.update({ modal: 'edit', project: p.id, state: 'list' })}
                />
              ))}
              <AddAnotherProject onClick={openAdd} />
            </>
          )}
        </div>
        <PortfolioRail />
      </main>

      {ps.modal === 'add' ? <ProjectDialog mode="add" onClose={closeModal} onSave={save} /> : null}
      {ps.modal === 'edit' && target ? (
        <ProjectDialog
          key={target.id}
          mode="edit"
          project={target}
          onClose={closeModal}
          onSave={save}
          onDelete={(id) => ps.update({ modal: 'delete', project: id })}
        />
      ) : null}
      {ps.modal === 'delete' && target ? (
        <DeleteDialog
          project={target}
          count={projects.length}
          onClose={closeModal}
          onDelete={remove}
          onEdit={() => ps.update({ modal: 'edit', project: target.id })}
        />
      ) : null}
      {ps.state === 'complete' && !ps.modal ? (
        <CompleteDialog
          count={projects.length}
          pinnedTitle={pinned?.title}
          onStay={() => ps.update({ state: 'list' })}
          onMilestone={() => {
            log('see your milestone');
            navigate('/profile/engagement/milestone/top-20');
          }}
        />
      ) : null}
    </EngagementStageFrame>
  );
};

export default PortfolioPage;
