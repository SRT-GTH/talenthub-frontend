import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import {
  fetchMyProfile,
  isLiveProfile,
  saveProfileFields,
} from '../../services/profileStages.api.js';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import {
  nextStageRoute,
  stageNumber,
} from '../../components/sections/engagementShell/engagementShellData.js';
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
  adoptSavedIds,
  pinByOrder,
  pinnedFirst,
  projectFromProfile,
  projectToProfile,
} from '../../components/sections/engagementV2/portfolio/portfolioData.js';
import { usePortfolioState } from '../../components/sections/engagementV2/portfolio/portfolioState.js';
import { GUTTER } from '../../components/sections/engagementV2/portfolio/portfolioStyles.js';

const log = debug('PortfolioPage');

/*
 * PortfolioPage — Engagement stage 6 "Portfolio" (Figma PF-01..PF-06; Playful 7709:* / 7710:*, Focused 8285:*), route
 * /profile/filling/portfolio. Frames and URLs are documented at the top of portfolioState.js.
 *   Signed in (isLiveProfile): projects load from profile.portfolio (GET /profiles/me) and every add / edit / delete /
 *     pin / reorder, and "Next: Certs", writes the whole list back (PATCH /profiles/fields { portfolio }). Mapping in
 *     portfolioData.js (projectFromProfile / projectToProfile); pinned = first in the list. No seeds are shown. Dialogs
 *     (incl. ?modal deep links) and edits wait for the load; a failed load shows a status message and never saves.
 *     "Next: Certs" waits for the save and stays on the page if it fails.
 *   Signed out (demo): the ?state / ?modal design frames are seeded with SEED_PROJECTS held in page state.
 * Add / edit / delete / pin / drag-reorder work in both; the footer "Next: Certs" opens the stage-complete dialog (PF-06),
 * whose "See your milestone" goes to the Top 20% milestone. "Nothing to show yet? Skip this stage" goes to Certs.
 * Not drawn in Figma and therefore inert (log only): "Paste a link".
 */
const PortfolioPage = () => {
  const navigate = useNavigate();
  const ps = usePortfolioState();
  const [live] = useState(isLiveProfile);
  /* Live: 'loading' | 'ready' | 'error'. Nothing can be edited or saved until the profile has loaded. */
  const [load, setLoad] = useState(live ? 'loading' : 'ready');
  const ready = load === 'ready';
  const [saveError, setSaveError] = useState('');
  const saveSeq = useRef(0);
  const [projects, setProjects] = useState(() =>
    !live && (ps.state || ps.modal) ? SEED_PROJECTS.map((p) => ({ ...p })) : []
  );
  useEffect(() => {
    log('mount', { live, state: ps.state, modal: ps.modal, projects: projects.length });
    if (!live) return undefined;
    let cancelled = false;
    fetchMyProfile()
      .then((profile) => {
        if (cancelled) return;
        const list = Array.isArray(profile?.portfolio) ? profile.portfolio : [];
        log('profile portfolio loaded', list.length);
        setProjects(list.map(projectFromProfile));
        setLoad('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        log.error('load portfolio failed:', err?.response?.status || err?.message);
        setLoad('error');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Signed in: write the whole list (only after a successful load). Resolves true when saved (always true in the demo).
   * A successful save re-reads the profile so new projects pick up their server _id, unless another save started since.
   */
  const persist = async (list) => {
    if (!live) return true;
    if (!ready) {
      log.error('save portfolio blocked: profile not loaded', load);
      return false;
    }
    const seq = ++saveSeq.current;
    const body = list.map(projectToProfile);
    log('persist portfolio', body.length);
    try {
      await saveProfileFields({ portfolio: body });
    } catch (err) {
      log.error('save portfolio failed:', err?.response?.status || err?.message);
      setSaveError('We couldn’t save your projects. Your changes are still here; try again.');
      return false;
    }
    setSaveError('');
    fetchMyProfile()
      .then((profile) => {
        const saved = Array.isArray(profile?.portfolio) ? profile.portfolio : [];
        if (seq !== saveSeq.current) return;
        setProjects((cur) => (cur === list ? (adoptSavedIds(list, saved) ?? cur) : cur));
      })
      .catch((err) => log.error('re-read portfolio failed:', err?.message));
    return true;
  };
  const commit = (list) => {
    if (!ready) return;
    const next = live ? pinByOrder(list) : list;
    setProjects(next);
    persist(next);
  };
  const move = (from, to) => {
    const next = [...projects];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    commit(next);
  };
  const dragFor = useDragReorder(projects, move);

  /* Live: the URL must name an existing project (no first-project fallback, so edit / delete never hit the wrong one). */
  const target = live
    ? (projects.find((p) => p.id === ps.project) ?? null)
    : (projects.find((p) => p.id === ps.project) ?? projects[0] ?? null);
  const empty = projects.length === 0;
  const modal = ready ? ps.modal : null;
  const pinned = projects.find((p) => p.pinned) ?? null;

  useEffect(() => {
    if (live && ready && (ps.modal === 'edit' || ps.modal === 'delete') && !target) {
      log('closing dialog: no project', ps.project);
      ps.update({ modal: null, project: null });
    }
  }, [live, ready, ps, target]);

  const closeModal = useCallback(() => ps.update({ modal: null, project: null }), [ps]);
  const openAdd = () => {
    log('open add');
    ps.update({ modal: 'add', state: empty ? null : 'list' });
  };

  const save = (project) => {
    log('save project', { id: project.id, pinned: project.pinned });
    const prev = projects.find((r) => r.id === project.id);
    const saved = prev?.raw ? { ...project, raw: prev.raw } : project;
    const base = project.pinned ? projects.map((r) => ({ ...r, pinned: false })) : projects;
    const next = prev ? base.map((r) => (r.id === project.id ? saved : r)) : [...base, saved];
    commit(live ? pinnedFirst(next) : next);
    ps.update({ modal: null, project: null, state: 'list' });
  };
  const remove = (id) => {
    log('delete project', id);
    commit(projects.filter((r) => r.id !== id));
    ps.update({ modal: null, project: null, state: 'list' });
  };

  const sticker = empty
    ? `STAGE ${stageNumber('portfolio')} · SHOW IT`
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
        disabled: empty || !ready,
        onContinue: async () => {
          log('next: stage complete');
          if (await persist(projects)) ps.update({ state: 'complete', modal: null });
        },
      }}
    >
      <PortfolioHero sticker={sticker} />
      <main
        className={`mx-auto grid w-full max-w-[1728px] flex-1 items-start gap-x-[clamp(24px,3.7vw,64px)] gap-y-[24px] pt-[40px] pb-[56px] max-lg:pt-[24px] lg:grid-cols-[minmax(0,1072fr)_minmax(0,464fr)] ${GUTTER}`}
      >
        <div className="flex min-w-0 flex-col gap-[20px]">
          {saveError ? (
            <p role="status" className="m-0 font-sans text-[14px] leading-[20px] text-[#902b20]">
              {saveError}
            </p>
          ) : null}
          {load === 'loading' ? (
            <p role="status" className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
              Loading your projects…
            </p>
          ) : load === 'error' ? (
            <p role="status" className="m-0 font-sans text-[14px] leading-[20px] text-[#902b20]">
              We couldn’t load your profile. Refresh to try again.
            </p>
          ) : empty ? (
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
                  onMove={(d) => move(i, i + d)}
                  onEdit={() => ps.update({ modal: 'edit', project: p.id, state: 'list' })}
                />
              ))}
              <AddAnotherProject onClick={openAdd} />
            </>
          )}
        </div>
        <PortfolioRail />
      </main>

      {modal === 'add' ? (
        <ProjectDialog mode="add" live={live} onClose={closeModal} onSave={save} />
      ) : null}
      {modal === 'edit' && target ? (
        <ProjectDialog
          key={target.id}
          mode="edit"
          live={live}
          project={target}
          onClose={closeModal}
          onSave={save}
          onDelete={(id) => ps.update({ modal: 'delete', project: id })}
        />
      ) : null}
      {modal === 'delete' && target ? (
        <DeleteDialog
          project={target}
          count={projects.length}
          onClose={closeModal}
          onDelete={remove}
          onEdit={() => ps.update({ modal: 'edit', project: target.id })}
        />
      ) : null}
      {ready && ps.state === 'complete' && !modal ? (
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
