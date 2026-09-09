import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../engagement/EngagementTopBar.jsx';
import AddEditWorkModal from './AddEditWorkModal.jsx';
import DeleteWorkModal from './DeleteWorkModal.jsx';
import WorkSavedModal from './WorkSavedModal.jsx';
import { STATUS_TAG_STYLES } from './workRoleStatusStyles.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ArrowLeftIcon,
  ArrowRightSmIcon,
  WorkRoleIcon,
  WorkDeleteIcon,
  WorkEditPencilIcon,
  BriefcaseIcon,
} from '../../shared/assets.jsx';

const log = debug('WorkStage2Section');

/*
 * WorkStage2Section — full page for /profile/filling/work/history.
 * Source: Figma 5112:106198 "WORK" (empty state) + 5113:107408 "work added"
 * (populated state), file key Bin8roWL8sloyc36IgFMuT. Structurally mirrors
 * InterestsStage2Section.jsx / SkillsStage2Section.jsx (breadcrumb + main
 * content column + right aside + footer) per this session's shared-shell
 * convention — see wiki/figma-node-map.md § "Work Experience — profile
 * filling flow" for every node dived into.
 *
 * Verbatim text confirmed via get_design_context on 5112:106198 (2026-09-06):
 * headline "Work history. Where you've been.", subtitle, empty-state copy,
 * aside cards ("What counts?", "Why this matters", "Recruiter views this
 * week"), and the single reference card ("Example of a strong work entry").
 *
 * ⚠️ Figma's header tag row on THIS frame literally reads "3 categories /
 * 4 specific interests / 4 min" — an unmistakable copy-paste leftover from
 * the Interests stage-2 frame (categories/specific-interests make no sense
 * for a Work-history page). Per this session's "flag, don't silently
 * reproduce" rule for nonsensical copy, this component computes real tags
 * from live state instead ("N roles", "N+ years experience", "~5 min")
 * rather than reproducing the wrong strings verbatim.
 *
 * ⚠️ SCOPE DECISION (documented per "don't block on ambiguity" rule): the
 * vertical timeline-rail treatment described for the populated-state cards
 * (dot markers + vertical divider, Figma nodes 5113:121766 / 5113:121775)
 * was not deep-dived in this session — get_design_context on 5112:106198
 * (empty state) confirms the single "Example of a strong work entry"
 * reference card renders with NO rail, so this component uses the simpler
 * plain-card-stack treatment (screenshot-confirmed-plain wins over an
 * un-dived "more complete" variant per Figma frame naming alone). Revisit
 * if the rail turns out to be the production intent once re-verified.
 *
 * Only role #1 below (Junior Frontend Developer @ Hubtel) has verbatim
 * Figma copy (dived via get_design_context). Roles #2–4 are plausible mock
 * seed data consistent with the four example entries named in this
 * session's brief (Junior Backend Developer, Software Engineering Intern,
 * ICT Instructor) — same "invented but consistent" mock-data convention
 * already used for INITIAL_SKILLS / ROLE_MATCHES in the sibling Interests
 * and Skills stage-2 sections.
 */

// ─── Data ─────────────────────────────────────────────────────────────────────

// Figma 5112:107359 (verbatim) — the only role card whose copy was actually
// dived; #2–4 are consistent mock seed data (see file-header comment).
const INITIAL_ROLES = [
  {
    id: 'role-1',
    jobTitle: 'Junior Frontend Developer',
    organisation: 'Hubtel',
    location: 'Accra, Ghana',
    employmentType: 'Full-time',
    startDate: '01/2024',
    endDate: '',
    isCurrent: true,
    duration: '1yr 7mo',
    statusTag: 'Current',
    description:
      'Built and maintained React components for the merchant dashboard. Reduced page load time 35% through lazy-loading and code splitting. Shipped 4 major features with cross-functional teams of design, backend and QA.',
    tags: ['Full-time', 'React', 'TypeScript'],
  },
  {
    id: 'role-2',
    jobTitle: 'Junior Backend Developer',
    organisation: 'Hubtel',
    location: 'Accra, Ghana',
    employmentType: 'Full-time',
    startDate: '06/2023',
    endDate: '',
    isCurrent: true,
    duration: '2yr 2mo',
    statusTag: 'Current',
    description:
      'Own payment-service APIs on the merchant platform. Migrated a legacy PHP endpoint to Node.js, cutting average response time by 40% and eliminating a recurring timeout bug reported by merchants.',
    tags: ['Full-time', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'role-3',
    jobTitle: 'Software Engineering Intern',
    organisation: 'Hubtel',
    location: 'Accra, Ghana',
    employmentType: 'Internship',
    startDate: '05/2022',
    endDate: '08/2022',
    isCurrent: false,
    duration: '4mo',
    statusTag: 'Internship',
    description:
      'Shadowed the mobile team and shipped a QA automation script that cut manual regression-testing time by half. Presented findings to the wider engineering org at the end-of-internship demo day.',
    tags: ['Internship', 'QA', 'Automation'],
  },
  {
    id: 'role-4',
    jobTitle: 'ICT Instructor',
    organisation: 'Accra Technical Training Centre',
    location: 'Accra, Ghana',
    employmentType: 'National Service',
    startDate: '09/2021',
    endDate: '08/2022',
    isCurrent: false,
    duration: '1yr',
    statusTag: 'National Service',
    description:
      'Taught introductory computing and basic web development to 3 cohorts of trainees. Redesigned the course handouts, improving end-of-term assessment pass rates from 61% to 84%.',
    tags: ['National Service', 'Teaching'],
  },
];

// ─── RoleCard ─────────────────────────────────────────────────────────────────
const RoleCard = ({ role, onEdit, onDelete, readOnly = false }) => {
  const statusStyle = STATUS_TAG_STYLES[role.statusTag] ?? STATUS_TAG_STYLES.Internship;
  log('RoleCard render', { id: role.id, statusTag: role.statusTag, readOnly });

  return (
    <div
      className="bg-white border border-[#e8e8e4] rounded-[16px] p-[16px] flex flex-col gap-[10px] relative"
      style={{ boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.07)' }}
    >
      {/* Edit/delete icon buttons — top-right, 28px squares. Hidden for the
          "Example of a strong work entry" reference card (readOnly): it's a
          static illustration, not a real saved role, so editing/deleting it
          makes no sense. */}
      {!readOnly && (
        <div className="absolute right-[14px] top-[14px] flex items-center gap-[6px]">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${role.jobTitle}`}
            className="size-[28px] rounded-[6px] border border-[#e8e8e4] bg-white flex items-center justify-center text-[#555] hover:bg-[#f8f8f4] transition-colors duration-150"
          >
            <WorkEditPencilIcon className="size-3" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${role.jobTitle}`}
            className="size-[28px] rounded-[6px] border border-[#e8e8e4] bg-white flex items-center justify-center text-[#555] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors duration-150"
          >
            <WorkDeleteIcon className="size-3" />
          </button>
        </div>
      )}

      <div className={`flex items-start gap-[14px] ${readOnly ? '' : 'pr-[70px]'}`}>
        <span className="size-[44px] rounded-[10px] bg-[rgba(235,241,236,0.5)] flex items-center justify-center shrink-0">
          <WorkRoleIcon className="size-5 text-brand-green" />
        </span>
        <div className="flex flex-col gap-[4px] min-w-0">
          <span className="font-sans font-bold text-[15px] text-[#111]">{role.jobTitle}</span>
          <div className="flex items-center flex-wrap gap-[9px] font-sans text-[12px] text-[#70706e]">
            <span>
              {role.organisation} — {role.location}
            </span>
            <span className="text-[#e8e8e4]">|</span>
            <span>
              {role.startDate} – {role.isCurrent ? 'Present' : role.endDate}
            </span>
            <span className="text-[#e8e8e4]">|</span>
            <span className="font-mono text-[10px] text-[#babab7]">{role.duration}</span>
          </div>
          <span
            className="inline-flex items-center gap-[4px] self-start rounded-full border px-[8px] h-[19px] font-sans font-semibold text-[10px]"
            style={{
              background: statusStyle.bg,
              borderColor: statusStyle.border,
              color: statusStyle.text,
            }}
          >
            {statusStyle.dot && <span className="text-[8px]">●</span>}
            {role.statusTag}
          </span>
          <p className="font-sans text-[12px] text-[#70706e] leading-[1.65] mt-[2px]">
            {role.description}
          </p>
          <div className="flex items-center flex-wrap gap-[5px] mt-[2px]">
            {role.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-[#e8e8e4] bg-[#f8f8f4] h-[21px] px-[8px] font-sans font-semibold text-[10px] text-[#70706e]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Right aside ──────────────────────────────────────────────────────────────
// Figma 5112:106321 "Aside" — "What counts?" / "Why this matters" /
// "Recruiter views this week" (verbatim, confirmed via get_design_context).
const WorkStage2RightAside = ({ roleCount }) => (
  <aside
    className="w-[clamp(240px,19.04vw,329px)] shrink-0 bg-[#f8f8f4] border-l border-[rgba(0,0,0,0.07)] overflow-y-auto [&::-webkit-scrollbar]:hidden"
    aria-label="Work experience guidance"
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
            'Duration & consistency',
            'Relevant experience',
            'Measurable impact',
            'Growth trajectory',
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

      {/* Why this matters */}
      <div
        className="bg-white border border-[#e8e8e4] rounded-[10px] p-[16px]"
        style={{ boxShadow: '0px 1px 1.5px rgba(0,0,0,0.06)' }}
      >
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.6px] text-[#70706e] mb-[8px]">
          Why this matters
        </p>
        <p className="font-sans text-[12px] text-[#999] leading-[1.6]">
          Recruiters prioritize experience. Even 3 months at an SME beats a blank page. Skills lab
          badges complement your work history.
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
          {roleCount > 0 ? Math.min(roleCount * 3, 24) : 0}
        </p>
        <p className="font-sans text-[11px] text-[#70706e] mb-[10px]">
          profile views from recruiters
        </p>
        <div className="h-[6px] rounded-full bg-[#e8e8e4] overflow-hidden mb-[10px]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(roleCount * 20, 100)}%`,
              background: 'linear-gradient(90deg, #3f6212, #84cc16)',
            }}
          />
        </div>
        <p className="font-sans text-[10px] text-[#70706e]">
          {roleCount > 0
            ? 'Recruiters are already discovering your profile.'
            : 'Add work experience to unlock recruiter discovery'}
        </p>
      </div>
    </div>
  </aside>
);

// ─── Main section ─────────────────────────────────────────────────────────────

const WorkStage2Section = () => {
  log('mount', { route: '/profile/filling/work/history', stageIndex: 4 });
  const navigate = useNavigate();

  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingRole, setEditingRole] = useState(null);
  const [deletingRole, setDeletingRole] = useState(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  const handleSaveExit = () => {
    log('save & exit → /');
    navigate('/');
  };

  const handleGoBack = () => {
    log('go back → /profile/filling/work');
    navigate('/profile/filling/work');
  };

  const handleNext = () => {
    // Portfolio flow now exists (built 2026-09-07) — route to its intro page
    // instead of the /profile/engagement fallback this used before.
    log('next → /profile/filling/portfolio');
    navigate('/profile/filling/portfolio');
  };

  const openAddModal = () => {
    log('open add-role modal');
    setModalMode('add');
    setEditingRole(null);
    setIsAddEditOpen(true);
  };

  const openEditModal = (role) => {
    log('open edit-role modal', { id: role.id });
    setModalMode('edit');
    setEditingRole({
      ...role,
      onDelete: () => {
        // Delete from inside the Edit modal must close the Edit modal too —
        // otherwise it stays open underneath the Delete-confirm modal.
        log('delete from within edit modal — closing edit modal first', { id: role.id });
        closeAddEditModal();
        setDeletingRole(role);
      },
    });
    setIsAddEditOpen(true);
  };

  const closeAddEditModal = () => {
    setIsAddEditOpen(false);
    setEditingRole(null);
  };

  const handleSaveRole = (formData) => {
    if (formData.id) {
      log('update existing role', { id: formData.id });
      setRoles((prev) => prev.map((r) => (r.id === formData.id ? buildRole(formData, r) : r)));
    } else {
      const newRole = buildRole({ ...formData, id: `role-${Date.now()}` });
      log('add new role', { id: newRole.id });
      setRoles((prev) => [newRole, ...prev]);
    }
    // WorkSavedModal.jsx's copy is a generic "here's what this unlocks"
    // confirmation, not a one-time milestone screen — so it opens after
    // every successful save (add AND edit), same as every other stage's
    // Confirm → success-toast pattern in this app. An earlier version only
    // opened it on every 4th *added* role, invented to match Figma's
    // hardcoded "4 roles" mock copy — but that copy is just the demo's
    // static snapshot, not a real trigger rule, and it never fired on edits.
    setIsSavedModalOpen(true);
  };

  const buildRole = (formData, existing = {}) => ({
    ...existing,
    id: formData.id,
    jobTitle: formData.jobTitle,
    organisation: formData.organisation,
    location: formData.location,
    employmentType: formData.employmentType,
    startDate: formData.startDate,
    endDate: formData.endDate,
    isCurrent: formData.isCurrent,
    duration: existing.duration ?? '—',
    statusTag: formData.isCurrent
      ? 'Current'
      : formData.employmentType === 'Internship' || formData.employmentType === 'National Service'
        ? formData.employmentType
        : 'Past role',
    description: formData.description,
    // The Add/Edit form only ever collects employment type, not the extra
    // skill/context tags shown on cards (e.g. "React", "Teaching") — those
    // have no matching form field in Figma's own modal. Preserve them across
    // an edit by swapping just the employment-type entry rather than
    // regenerating the whole tags array, which previously discarded them.
    tags: existing.tags
      ? existing.tags.map((tag) =>
          tag === existing.employmentType ? formData.employmentType : tag
        )
      : [formData.employmentType].filter(Boolean),
  });

  const handleDeleteRole = () => {
    if (!deletingRole) return;
    log('delete role', { id: deletingRole.id });
    setRoles((prev) => prev.filter((r) => r.id !== deletingRole.id));
    setDeletingRole(null);
  };

  const handleEditInsteadFromDelete = () => {
    if (!deletingRole) return;
    openEditModal(deletingRole);
  };

  const isEmpty = roles.length === 0;

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
        <EngagementTopBar currentStageIndex={4} completionPct={44} className="w-full h-full" />
      </div>

      <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 flex overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
              {/* Header — Figma 5112:106307 */}
              <section
                aria-label="Work history — where you've been"
                className="border-b border-[rgba(0,0,0,0.07)] px-[clamp(20px,3.24vw,56px)] py-[clamp(20px,2.31vw,40px)]"
              >
                <h2 className="font-display text-[clamp(26px,2.89vw,40px)] leading-[0.95] tracking-[-1.8px] mb-[clamp(8px,0.93vw,16px)]">
                  <span className="not-italic text-[#111]">Work history. </span>
                  <span className="italic text-brand-green">Where you&rsquo;ve been.</span>
                </h2>
                <p className="font-sans text-[clamp(11px,0.81vw,14px)] leading-[1.6] text-[#70706e] mb-[clamp(10px,0.93vw,16px)] max-w-[680px]">
                  Full-time, internship, freelance, national service, apprenticeship — all count.
                  You can add as many roles as you like and re-order them any time.
                </p>
                <div className="flex items-center flex-wrap gap-[8px]">
                  {[
                    `${roles.length} role${roles.length !== 1 ? 's' : ''}`,
                    isEmpty ? 'Not started' : 'In progress',
                    '~5 min',
                  ].map((tag) => (
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
                    {/* Empty state — Figma 5112:107315 */}
                    <div
                      className="rounded-[24px] border-2 border-dashed border-brand-green flex flex-col items-center gap-[22px] px-[24px] py-[clamp(32px,4vw,56px)] text-center"
                      style={{ background: 'rgba(235,241,236,0.5)' }}
                    >
                      <div className="flex flex-col items-center gap-[4px]">
                        <BriefcaseIcon className="size-10 text-brand-green" />
                        <h3 className="font-display text-[clamp(20px,2vw,26px)] text-brand-green mt-[8px]">
                          No work history yet.
                        </h3>
                        <p className="font-sans text-[14px] text-[#70706e] leading-[1.75] max-w-[520px] mt-[4px]">
                          Add your first role below. It could be a job, an internship, your national
                          service posting, a freelance contract, or a volunteer role — anything
                          where you showed up and did work.
                        </p>
                      </div>
                      <Button variant="primary" size="md" onClick={openAddModal}>
                        + Add your first role
                      </Button>
                      <p className="font-sans text-[12px] text-[#70706e]">
                        No experience at all?{' '}
                        <button
                          type="button"
                          onClick={handleNext}
                          className="font-semibold text-brand-green underline underline-offset-2"
                        >
                          Skip this stage
                        </button>
                      </p>
                    </div>

                    {/* Example of a strong work entry — Figma 5112:107357 */}
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
                        Example of a strong work entry
                      </p>
                      <RoleCard role={INITIAL_ROLES[0]} readOnly />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Populated state — Figma 5113:107408 */}
                    <div className="flex flex-col gap-[10px]">
                      {roles.map((role) => (
                        <RoleCard
                          key={role.id}
                          role={role}
                          onEdit={() => openEditModal(role)}
                          onDelete={() => setDeletingRole(role)}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={openAddModal}
                      className="w-full flex items-center justify-center gap-[10px] rounded-[16px] py-[clamp(16px,1.62vw,28px)] mt-[10px] font-sans font-semibold text-[clamp(12px,0.81vw,14px)] text-brand-green transition-colors duration-150 hover:bg-[rgba(235,241,236,0.7)]"
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
                      Add Another Role
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <WorkStage2RightAside roleCount={roles.length} />
        </div>

        {/* Footer — spans the full viewport width (the Figma
            "Background+HorizontalBorder" node runs edge to edge); the right
            aside's own height stops above it instead of running down
            alongside it, so the footer is a sibling of the row above, not
            nested inside the column next to the aside. */}
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
                Skills
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                rightIcon={<ArrowRightSmIcon className="size-full" />}
              >
                Next: Portfolio
              </Button>
            </div>
          </div>
        </footer>
      </main>

      <AddEditWorkModal
        isOpen={isAddEditOpen}
        onClose={closeAddEditModal}
        onSave={handleSaveRole}
        mode={modalMode}
        initialData={editingRole}
      />

      <DeleteWorkModal
        isOpen={Boolean(deletingRole)}
        onClose={() => setDeletingRole(null)}
        onConfirm={handleDeleteRole}
        onEditInstead={handleEditInsteadFromDelete}
        role={deletingRole}
      />

      <WorkSavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onContinue={() => {
          setIsSavedModalOpen(false);
          handleNext();
        }}
        roles={roles}
      />
    </div>
  );
};

export default WorkStage2Section;
