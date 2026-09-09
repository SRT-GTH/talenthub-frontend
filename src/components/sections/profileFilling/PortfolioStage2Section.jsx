import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import AddEditPortfolioModal from './AddEditPortfolioModal.jsx';
import DeletePortfolioModal from './DeletePortfolioModal.jsx';
import PortfolioSavedModal from './PortfolioSavedModal.jsx';
import { PROJECT_ICON_GRADIENT, getProjectTypeEmoji } from './portfolioProjectTypeStyles.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ArrowLeftIcon,
  ArrowRightSmIcon,
  PortfolioStepIcon,
  PortfolioPostIcon,
  ImagePlaceholderIcon,
  WorkDeleteWarningIcon,
  WorkEditPencilIcon,
} from '../../shared/assets.jsx';

const log = debug('PortfolioStage2Section');

/*
 * PortfolioStage2Section — full page for /profile/filling/portfolio/projects.
 * Source: Figma 5178:101512 "Portfolio 1" (populated + empty states share one
 * frame here — the empty-state illustration and the "Example of a strong
 * portfolio project" reference card sit directly above the Main container),
 * file key Bin8roWL8sloyc36IgFMuT. Structurally mirrors WorkStage2Section.jsx
 * (breadcrumb + main content column + right aside + footer) per this
 * session's shared-shell convention — see wiki/figma-node-map.md § "Project
 * Portfolio — profile filling page flow" for every node dived into
 * (2026-09-07).
 *
 * Verbatim text confirmed via get_design_context on 5178:101512 (2026-09-07):
 * headline "Portfolio.  Things you've shipped.", subtitle, empty-state copy,
 * aside cards ("What counts?", "Popular in Ghana", "Recruiter views this
 * week"), and the single reference card ("Accra Bus Tracker").
 *
 * Only the "Accra Bus Tracker" project below has fully verbatim Figma copy
 * (dived via get_design_context on the list page's own example card). The
 * other two — "GhanaPay Dashboard Redesign" and "Ghana Youth Unemployment" —
 * borrow their real project NAMES from the success/delete-modal dives in this
 * same session (5217:122674 / 5217:122537) but their full descriptions were
 * truncated ("I redesigned the GhanaPay Dashboard to improve user…") or
 * altogether unspecified in those compact contexts, so the remaining copy is
 * plausible invented-but-consistent mock data — same convention already used
 * for INITIAL_ROLES in WorkStage2Section.jsx.
 */

// ─── Data ─────────────────────────────────────────────────────────────────────

// Figma 5180:105024-105045 (verbatim) — the only project card whose copy was
// actually dived; #2-#3 are consistent mock seed data (see file-header
// comment) reusing real project names sourced from the success/delete modal
// dives.
const INITIAL_PROJECTS = [
  {
    id: 'project-1',
    title: 'Accra Bus Tracker',
    projectType: 'Mobile app',
    year: '2024',
    role: 'Solo developer',
    description:
      'Designed, built and deployed end-to-end real-time bus tracking for Accra commuters. Aggregated route data from 40+ drivers via a lightweight PWA, displayed live positions on Google Maps. Used by 200+ commuters during the KNUST pilot.',
    liveLink: 'https://accra-bus-tracker.vercel.app',
    githubLink: 'https://github.com/kofi/accra-bus',
    figmaLink: '',
    technologies: ['React Native', 'Firebase'],
    isPinned: true,
    coverImage: null,
  },
  {
    id: 'project-2',
    title: 'GhanaPay Dashboard Redesign',
    projectType: 'Design case study',
    year: '2024',
    role: 'Lead UX designer',
    description:
      'Redesigned the GhanaPay Dashboard to improve user comprehension of transaction history. Simplified the filter flow from 5 taps to 2 and introduced a spending-trends chart. Cut support tickets about "where did my money go" by 30% the following quarter.',
    liveLink: '',
    githubLink: '',
    figmaLink: 'https://figma.com/file/ghanapay-dashboard',
    technologies: ['UX Research', 'Figma'],
    isPinned: false,
    coverImage: null,
  },
  {
    id: 'project-3',
    title: 'Ghana Youth Unemployment',
    projectType: 'Data analysis',
    year: '2023',
    role: 'Independent researcher',
    description:
      'Analysed unemployment trends among Ghanaian youth aged 18–35 using public labour-force survey data. Built visualisations showing regional and gender disparities, and a simple model flagging at-risk districts. Shared as an open dataset and write-up on GitHub.',
    liveLink: '',
    githubLink: 'https://github.com/ama/gh-youth-unemployment',
    figmaLink: '',
    technologies: ['Python', 'Pandas'],
    isPinned: false,
    coverImage: null,
  },
];

// ─── ProjectCard ──────────────────────────────────────────────────────────────
//
// Two distinct layouts, confirmed via get_screenshot dives 2026-09-08 — this
// was NOT one card style reused for every project:
//   - The PINNED project gets a "hero" card: a full-width cover band on top
//     (Figma 5180:104917) with a "⭐ Pinned" corner badge AND a "Pinned" tag
//     chip in the tag row below it.
//   - Every OTHER project gets a compact ROW card (Figma 5178:101907 /
//     5200:105120 / 5200:105157 / 5200:105194, all sharing the same shape):
//     a narrow left-side icon column instead of a top cover band, no
//     "Pinned" badge/chip, and a noticeably shorter overall height.
// A previous pass used the hero layout for every project regardless of pin
// state, which is why non-pinned entries looked wrong compared to the first
// (pinned) one.
const ProjectTagRow = ({ project, isPinned }) => {
  const linkTags = [
    project.liveLink && {
      label: 'Live demo ↗',
      color: '#0369a1',
      bg: '#eaeffb',
      border: '#bfcef2',
    },
    project.githubLink && { label: 'GitHub ↗', color: '#70706e', bg: '#f8f8f4', border: '#e8e8e4' },
    project.figmaLink && {
      label: 'Figma link ↗',
      color: '#3062d4',
      bg: '#eaeffb',
      border: '#bfcef2',
    },
  ].filter(Boolean);

  return (
    <div className="flex items-center flex-wrap gap-[8px] mt-[2px]">
      {linkTags.map((tag) => (
        <span
          key={tag.label}
          className="inline-flex items-center rounded-full h-[22px] px-[10px] font-sans font-semibold text-[10px] border"
          style={{ background: tag.bg, borderColor: tag.border, color: tag.color }}
        >
          {tag.label}
        </span>
      ))}
      {/* Hero card only — Figma 5180:104928, "⭐ Pinned" as a tag chip IN
          ADDITION to the corner badge, not instead of it. */}
      {isPinned && (
        <span className="inline-flex items-center rounded-full h-[22px] px-[10px] font-sans font-semibold text-[10px] border border-[#c1d4c4] bg-[#ebf1ec] text-[#2a5730]">
          ⭐ Pinned
        </span>
      )}
      {project.technologies.map((tech) => (
        <span
          key={tech}
          className="inline-flex items-center rounded-full h-[20px] px-[8px] font-sans font-semibold text-[10px] text-[#70706e] bg-[#f8f8f4] border border-[#e8e8e4]"
        >
          {tech}
        </span>
      ))}
    </div>
  );
};

const ProjectCard = ({ project, onEdit, onDelete, readOnly = false }) => {
  log('ProjectCard render', { id: project.id, isPinned: project.isPinned, readOnly });

  // Compact row layout — every non-pinned project.
  if (!project.isPinned) {
    return (
      <div
        className="bg-white border border-[#e8e8e4] rounded-[16px] overflow-hidden relative flex items-stretch"
        style={{ boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.07)' }}
      >
        <div
          className="w-[72px] shrink-0 flex items-center justify-center"
          style={{ background: PROJECT_ICON_GRADIENT }}
          aria-hidden="true"
        >
          <span className="text-[26px] leading-none">
            {getProjectTypeEmoji(project.projectType)}
          </span>
        </div>

        <div
          className={`flex-1 min-w-0 px-[16px] py-[16px] flex flex-col gap-[8px] ${readOnly ? '' : 'pr-[70px]'}`}
        >
          <div className="flex flex-col gap-[4px]">
            <span className="font-sans font-semibold text-[16px] text-[#111]">{project.title}</span>
            <span className="font-sans text-[12px] text-[#70706e]">
              {project.projectType} · {project.year} · {project.role}
            </span>
          </div>
          <p className="font-sans text-[12px] text-[#70706e] leading-[1.5]">
            {project.description}
          </p>
          <ProjectTagRow project={project} isPinned={false} />
        </div>

        {!readOnly && (
          <div className="absolute right-[14px] top-[14px] flex items-center gap-[6px]">
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${project.title}`}
              className="size-[28px] rounded-[6px] border border-[#e8e8e4] bg-white flex items-center justify-center text-[#555] hover:bg-[#f8f8f4] transition-colors duration-150"
            >
              <WorkEditPencilIcon className="size-3" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Delete ${project.title}`}
              className="size-[28px] rounded-[6px] border border-[#e8e8e4] bg-white flex items-center justify-center text-[#555] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors duration-150"
            >
              <WorkDeleteWarningIcon className="size-3" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Hero layout — the pinned project only.
  return (
    <div
      className="bg-white border border-[#c1d4c4] rounded-[16px] overflow-hidden relative"
      style={{ boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.07)' }}
    >
      {/* Cover image / fallback gradient — Figma 5180:105045 */}
      <div
        className="relative h-[110px] flex items-center justify-center"
        style={
          project.coverImage
            ? {
                backgroundImage: `url(${project.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { background: PROJECT_ICON_GRADIENT }
        }
      >
        {!project.coverImage && <ImagePlaceholderIcon className="size-9 text-white/80" />}

        <span className="absolute left-[10px] top-[10px] inline-flex items-center gap-[4px] rounded-full bg-[rgba(235,241,236,0.2)] px-[10px] py-[3px] font-sans font-bold text-[9.2px] text-white">
          ⭐ Pinned
        </span>

        {!readOnly && (
          <div className="absolute right-[10px] top-[10px] flex items-center gap-[6px]">
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${project.title}`}
              className="size-[28px] rounded-[6px] border border-white/40 bg-white/90 flex items-center justify-center text-[#555] hover:bg-white transition-colors duration-150"
            >
              <WorkEditPencilIcon className="size-3" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Delete ${project.title}`}
              className="size-[28px] rounded-[6px] border border-white/40 bg-white/90 flex items-center justify-center text-[#555] hover:text-red-500 hover:bg-red-50 transition-colors duration-150"
            >
              <WorkDeleteWarningIcon className="size-3" />
            </button>
          </div>
        )}
      </div>

      {/* Info panel — Figma 5180:105025 */}
      <div className="border border-[rgba(235,241,236,0.5)] px-[16px] py-[16px] flex flex-col gap-[8px]">
        <div className="flex flex-col gap-[4px]">
          <span className="font-sans font-semibold text-[16px] text-[#111]">{project.title}</span>
          <span className="font-sans text-[12px] text-[#70706e]">
            {project.projectType} · {project.year} · {project.role}
          </span>
        </div>
        <p className="font-sans text-[12px] text-[#70706e] leading-[1.5]">{project.description}</p>
        <ProjectTagRow project={project} isPinned />
      </div>
    </div>
  );
};

// ─── Right aside ──────────────────────────────────────────────────────────────
// Figma 5178:101639 "Aside" — "What Counts?" (5178:101848) / "Why This
// Matters" (5178:101863) / "Recruiter Views This Week" (5178:101866),
// confirmed via get_screenshot on all 3 nodes directly (2026-09-08). The
// middle card was originally built as "Popular in Ghana" — a clone of
// InterestsStage2Section's own aside card, not this stage's real one; fixed
// here, its body copy ("Proof beats claims...") was already correct.
const PortfolioStage2RightAside = ({ projectCount }) => (
  <aside
    className="w-[clamp(240px,19.04vw,329px)] shrink-0 bg-[#f8f8f4] border-l border-[rgba(0,0,0,0.07)] overflow-y-auto [&::-webkit-scrollbar]:hidden"
    aria-label="Portfolio guidance"
    style={{ scrollbarWidth: 'none' }}
  >
    <div className="flex flex-col gap-[16px] p-[clamp(16px,1.5vw,24px)]">
      {/* What counts? */}
      <div
        className="rounded-[10px] border border-[#c1d4c4] p-[16px]"
        style={{ background: 'rgba(235,241,236,0.5)', boxShadow: '0px 1px 3px rgba(0,0,0,0.06)' }}
      >
        <p
          className="font-sans font-bold text-[12px] uppercase tracking-[0.6px] mb-[10px]"
          style={{
            backgroundImage: 'linear-gradient(172deg, rgb(20,41,22) 0%, rgb(42,87,48) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          What counts?
        </p>
        <ul className="flex flex-col gap-[7px]">
          {[
            'Live demo or repo link',
            'Outcome numbers',
            'Your specific role',
            'A pinned favourite',
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-[6px] font-sans text-[12px] text-[#716e65] leading-[1.4]"
            >
              <span className="font-bold text-brand-green shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Why This Matters — Figma 5178:101863 */}
      <div
        className="bg-white border border-[#e8e8e4] rounded-[10px] p-[16px]"
        style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
      >
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.6px] text-[#70706e] mb-[8px]">
          Why This Matters
        </p>
        <p className="font-sans text-[12px] text-[#999] leading-[1.6]">
          Proof beats claims. A live demo link is the strongest signal on GTH — recruiters open it
          first.
        </p>
      </div>

      {/* Recruiter views this week */}
      <div
        className="bg-white border border-[#e8e8e4] rounded-[16px] p-[16px]"
        style={{ boxShadow: '0px 4px 0px rgba(0,0,0,0.07)' }}
      >
        <p className="font-sans font-bold text-[10px] uppercase tracking-[0.8px] text-[#70706e] mb-[10px]">
          👀 Recruiter views this week
        </p>
        <p className="font-display text-[36px] leading-none text-[#111] mb-[10px]">
          {projectCount > 0 ? Math.min(projectCount * 3, 24) : 0}
        </p>
        <p className="font-sans text-[11px] text-[#70706e] mb-[10px]">
          profile views from recruiters
        </p>
        <div className="h-[6px] rounded-full bg-[#e8e8e4] overflow-hidden mb-[10px]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(projectCount * 20, 100)}%`,
              background: 'linear-gradient(90deg, #3f6212, #84cc16)',
            }}
          />
        </div>
        <p className="font-sans text-[10px] text-[#70706e]">
          {projectCount > 0
            ? 'Recruiters are already discovering your profile.'
            : 'Add projects to unlock recruiter discovery'}
        </p>
      </div>
    </div>
  </aside>
);

// ─── Main section ─────────────────────────────────────────────────────────────

const PortfolioStage2Section = () => {
  log('mount', { route: '/profile/filling/portfolio/projects', stageIndex: 5 });
  const navigate = useNavigate();

  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const handleGoBack = () => {
    log('go back → /profile/filling/portfolio');
    navigate('/profile/filling/portfolio');
  };

  const handleNext = () => {
    // Certs flow now exists (built 2026-09-08) — route to its intro page
    // instead of the /profile/engagement fallback this used before, mirroring
    // how WorkStage2Section.jsx's own "Next" handler was updated to point at
    // Portfolio once that stage existed.
    log('next → /profile/filling/certs');
    navigate('/profile/filling/certs');
  };

  const openAddModal = () => {
    log('open add-project modal');
    setModalMode('add');
    setEditingProject(null);
    setIsAddEditOpen(true);
  };

  const openEditModal = (project) => {
    log('open edit-project modal', { id: project.id });
    setModalMode('edit');
    setEditingProject({
      ...project,
      onDelete: () => {
        // Delete from inside the Edit modal must close the Edit modal too —
        // otherwise it stays open underneath the Delete-confirm modal.
        log('delete from within edit modal — closing edit modal first', { id: project.id });
        closeAddEditModal();
        setDeletingProject(project);
      },
    });
    setIsAddEditOpen(true);
  };

  const closeAddEditModal = () => {
    setIsAddEditOpen(false);
    setEditingProject(null);
  };

  const handleSaveProject = (formData) => {
    // "Only one can be pinned" is real business logic evidenced by Figma's
    // own copy on the pin toggle (both AddEditPortfolioModal.jsx's Add and
    // Edit variants say this explicitly) — so pinning one project here
    // un-pins every other project in the same update, rather than allowing
    // multiple pinned projects to coexist silently.
    const unpinOthers = (list, keepId) =>
      formData.isPinned ? list.map((p) => (p.id === keepId ? p : { ...p, isPinned: false })) : list;

    if (formData.id) {
      log('update existing project', { id: formData.id, isPinned: formData.isPinned });
      setProjects((prev) =>
        unpinOthers(
          prev.map((p) => (p.id === formData.id ? buildProject(formData, p) : p)),
          formData.id
        )
      );
    } else {
      const newProject = buildProject({ ...formData, id: `project-${Date.now()}` });
      log('add new project', { id: newProject.id, isPinned: newProject.isPinned });
      setProjects((prev) => unpinOthers([newProject, ...prev], newProject.id));
    }
    // PortfolioSavedModal.jsx's copy is a generic "here's what this unlocks"
    // confirmation, not a one-time milestone screen — so it opens after
    // every successful save (add AND edit), mirroring WorkSavedModal's
    // established rule for this session (see that file's header comment for
    // why an invented "every Nth save" gate was rejected there).
    setIsSavedModalOpen(true);
  };

  const buildProject = (formData, existing = {}) => ({
    ...existing,
    id: formData.id,
    title: formData.title,
    projectType: formData.projectType,
    year: formData.year,
    role: formData.role,
    description: formData.description,
    liveLink: formData.liveLink,
    githubLink: formData.githubLink,
    figmaLink: formData.figmaLink,
    technologies: formData.technologies,
    isPinned: formData.isPinned,
    coverImage: formData.coverImage ?? existing.coverImage ?? null,
  });

  const handleDeleteProject = () => {
    if (!deletingProject) return;
    log('delete project', { id: deletingProject.id });
    setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
    setDeletingProject(null);
  };

  const handleEditInsteadFromDelete = () => {
    if (!deletingProject) return;
    openEditModal(deletingProject);
  };

  const isEmpty = projects.length === 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <div className="shrink-0 h-[clamp(64px,5.2vw,90px)] flex items-stretch">
        <EngagementTopNav
          bgClass="bg-neutral"
          onSaveExit={handleSaveExit}
          showSwitchModes={false}
          className="w-full h-full"
        />
      </div>

      <div className="shrink-0 h-[clamp(60px,4.46vw,77px)] flex items-stretch">
        <EngagementTopBar currentStageIndex={5} completionPct={56} className="w-full h-full" />
      </div>

      <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 flex overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
              {/* Header — Figma 5178:101625 */}
              <section
                aria-label="Portfolio — things you've shipped"
                className="border-b border-[rgba(0,0,0,0.07)] px-[clamp(20px,3.24vw,56px)] py-[clamp(20px,2.31vw,40px)]"
              >
                <h2 className="font-display text-[clamp(26px,2.89vw,40px)] leading-[0.95] tracking-[-1.8px] mb-[clamp(8px,0.93vw,16px)]">
                  <span className="not-italic text-[#111]">Portfolio. </span>
                  <span className="italic text-brand-green">Things you&rsquo;ve shipped.</span>
                </h2>
                <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-[1.6] text-[#70706e] mb-[clamp(10px,0.93vw,16px)] max-w-[680px]">
                  A web app, a design case study, a data analysis, a research paper — anything you
                  created counts. Add 2–6 projects and pin your best one to the top.
                </p>
                {/* 🔧 DURATION-CONSISTENCY SWEEP (2026-09-09, explicit user
                    instruction): the third tag was Figma's own "~6 min",
                    which contradicted this flow's intro-page tag ("~7 min",
                    PortfolioIntroSection.jsx). The intro tag is the single
                    source of truth for the flow's duration; the right panel
                    and this tag are reconciled to it. Deliberate, instructed
                    divergence from Figma. */}
                <div className="flex items-center flex-wrap gap-[8px]">
                  {['2–6 projects', 'Pin your best', '~7 min'].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center font-sans font-medium text-[clamp(10px,0.69vw,12px)] leading-4 text-[#70706e] bg-white rounded-full px-[10px] py-[4px] border border-[#e1eae2] whitespace-nowrap"
                      style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              <div className="px-[clamp(20px,3.24vw,56px)] py-[clamp(20px,2vw,32px)]">
                {isEmpty ? (
                  <>
                    {/* Empty state — Figma 5178:101668 */}
                    <div
                      className="rounded-[24px] border-2 border-dashed border-brand-green flex flex-col items-center gap-[22px] px-[24px] py-[clamp(32px,4vw,56px)] text-center"
                      style={{ background: 'rgba(235,241,236,0.5)' }}
                    >
                      <div className="flex flex-col items-center gap-[4px]">
                        <PortfolioPostIcon className="size-10 text-brand-green" />
                        <h3 className="font-display text-[clamp(20px,2vw,26px)] text-brand-green mt-[8px]">
                          No projects yet.
                        </h3>
                        <p className="font-sans text-[14px] text-[#70706e] leading-[1.75] max-w-[520px] mt-[4px]">
                          Add your first project below. A web app, mobile app, design case study,
                          data analysis, research paper, hardware build — anything you created
                          counts.
                        </p>
                      </div>
                      <Button variant="primary" size="md" onClick={openAddModal}>
                        + Add your first project
                      </Button>
                      <p className="font-sans text-[12px] text-[#70706e]">
                        Nothing built yet?{' '}
                        <button
                          type="button"
                          onClick={handleNext}
                          className="font-semibold text-brand-green underline underline-offset-2"
                        >
                          Skip this stage
                        </button>
                      </p>
                    </div>

                    {/* Example of a strong portfolio project — Figma 5178:101683 */}
                    <div className="flex flex-col gap-[12px] mt-[28px]">
                      <p
                        className="font-sans font-semibold text-[13px] capitalize"
                        style={{
                          backgroundImage:
                            'linear-gradient(179deg, rgb(20,41,22) 0%, rgb(42,87,48) 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        Example of a strong portfolio project
                      </p>
                      <ProjectCard project={INITIAL_PROJECTS[0]} readOnly />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Populated state — Figma 5178:101666 "Main" */}
                    <div className="flex flex-col gap-[16px]">
                      {projects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          onEdit={() => openEditModal(project)}
                          onDelete={() => setDeletingProject(project)}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={openAddModal}
                      className="w-full flex items-center justify-center gap-[10px] rounded-[16px] py-[clamp(16px,1.62vw,28px)] mt-[16px] font-sans font-semibold text-[clamp(12px,0.81vw,14px)] text-brand-green transition-colors duration-150 hover:bg-[rgba(235,241,236,0.7)]"
                      style={{ background: 'rgba(235,241,236,0.5)', border: '2px dashed #387440' }}
                    >
                      <span className="size-[20px] bg-brand-green rounded-[4px] flex items-center justify-center shrink-0">
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          aria-hidden="true"
                          className="size-3"
                        >
                          <path d="M10 4v12M4 10h12" />
                        </svg>
                      </span>
                      Add Another Project
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <PortfolioStage2RightAside projectCount={projects.length} />
        </div>

        {/* Footer — spans the full viewport width, sibling of the row above
            rather than nested next to the aside (same layout note as
            WorkStage2Section.jsx). */}
        <footer className="shrink-0 h-[142px] w-full border-t border-[#f1f5f9] bg-white flex items-center px-[clamp(20px,3.24vw,56px)]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[6px]">
              <span
                aria-hidden="true"
                className="inline-block w-[6px] h-[6px] rounded-[3px] bg-brand-green shrink-0"
              />
              <span className="font-sans text-[12px] leading-5 text-[#555]">
                Auto-saved · changes carry to all tabs
              </span>
            </div>

            <div className="flex items-center gap-6">
              <Button
                variant="tertiary"
                size="md"
                onClick={handleGoBack}
                leftIcon={<ArrowLeftIcon className="size-full" />}
              >
                Work
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                rightIcon={<ArrowRightSmIcon className="size-full" />}
              >
                Next: Certs
              </Button>
            </div>
          </div>
        </footer>
      </main>

      <AddEditPortfolioModal
        isOpen={isAddEditOpen}
        onClose={closeAddEditModal}
        onSave={handleSaveProject}
        mode={modalMode}
        initialData={editingProject}
      />

      <DeletePortfolioModal
        isOpen={Boolean(deletingProject)}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteProject}
        onEditInstead={handleEditInsteadFromDelete}
        project={deletingProject}
      />

      <PortfolioSavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onContinue={() => {
          setIsSavedModalOpen(false);
          handleNext();
        }}
        projects={projects}
      />
    </div>
  );
};

export default PortfolioStage2Section;
