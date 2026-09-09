import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import {
  WorkDeleteWarningIcon,
  WorkEditPencilIcon,
  PortfolioStepIcon,
} from '../../shared/assets.jsx';
import { PROJECT_ICON_GRADIENT } from './portfolioProjectTypeStyles.js';

const log = debug('DeletePortfolioModal');

/*
 * DeletePortfolioModal — delete-confirm overlay for the Portfolio stage-2
 * list page. Source: Figma frame 5211:114088 ("failed"), header content node
 * 5211:114110, preview card 5217:122669, reason rows 5211:114159, "Edit
 * instead" nudge 5211:114180, footer 5211:114089. File key
 * Bin8roWL8sloyc36IgFMuT. Structurally mirrors DeleteWorkModal.jsx — same
 * Modal `footer` prop usage (not a hand-rolled sticky footer, see that
 * file's own header comment for why that matters).
 *
 * `WorkDeleteWarningIcon` (from shared/assets.jsx) is reused here per this
 * session's explicit instruction to reuse that exact icon for every delete
 * usage in this Portfolio flow, rather than the distinct plain trash-can
 * "20-delete" glyph Figma actually specs for this modal's header badge and
 * footer button (5211:114111 / img20Delete) — a deliberate icon-set
 * consolidation, not a missed dive.
 *
 * ⚠️ FIGMA INCONSISTENCY (flagged, not silently fixed): the description under
 * the "Delete this project?" headline (5211:114115) reads "This will
 * permanently remove the role from your work history." — verbatim Work-flow
 * copy (DeleteWorkModal.jsx's own description is word-for-word identical
 * apart from this same sentence), left over from cloning that modal. The two
 * reason rows below it (5211:114162 / 5211:114167) ARE correctly Portfolio-
 * specific ("removed from your portfolio", "Portfolio strength may
 * decrease"), so only this one sentence is the copy-paste artifact.
 * Reproduced verbatim per this session's established rule.
 */
const DeletePortfolioModal = ({ isOpen, onClose, onConfirm, onEditInstead, project }) => {
  log('mount', { isOpen, projectId: project?.id });

  const handleConfirm = () => {
    log('confirm delete', { projectId: project?.id });
    onConfirm();
    onClose();
  };

  const handleEditInstead = () => {
    log('edit instead → close + open edit modal');
    onClose();
    onEditInstead?.();
  };

  const linkTags = project
    ? [
        project.liveLink && 'Live demo ↗',
        project.githubLink && 'GitHub ↗',
        project.figmaLink && 'Figma link ↗',
      ].filter(Boolean)
    : [];

  const footer = (
    <div className="flex items-center justify-end gap-[12px] px-[clamp(24px,3vw,40px)] py-[16px] border-t border-[rgba(0,0,0,0.07)]">
      <Button variant="tertiary" size="md" onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="danger"
        size="md"
        onClick={handleConfirm}
        leftIcon={<WorkDeleteWarningIcon className="size-full" />}
      >
        Permanently delete this project
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel="Delete this project"
      contentClassName="!rounded-[24px] !max-w-[550px] overflow-hidden"
      footer={footer}
    >
      <div className="relative flex flex-col p-[clamp(24px,3vw,40px)] gap-[20px]">
        {/* Top glow — every delete modal gets this, coloured to match its own
            "Permanently delete" CTA (Button `danger` variant, #c0392b). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-90px] size-[240px] -translate-x-1/2 rounded-full opacity-70 blur-[70px]"
          style={{ background: 'radial-gradient(circle, #c0392b 0%, transparent 70%)' }}
        />

        <div className="flex flex-col items-center gap-[14px] text-center">
          <span className="size-[56px] rounded-[16px] bg-[#fdecea] border-2 border-[#f6c6bd] flex items-center justify-center">
            <WorkDeleteWarningIcon className="size-[26px] text-[#c0392b]" />
          </span>
          <h2 className="font-display text-[clamp(22px,2.2vw,28px)] tracking-[-0.8px] text-[#111]">
            Delete this project?
          </h2>
          <p className="font-sans text-[13px] text-[#70706e] leading-[1.5] max-w-[360px]">
            This will permanently remove the role from your work history. Your profile updates
            immediately. This cannot be undone.
          </p>
        </div>

        {/* Preview of the project being deleted — Figma 5217:122669 */}
        {project && (
          <div
            className="flex items-stretch gap-[12px] rounded-[16px] border-2 border-[#ebc2bd] bg-[#f9ebea] overflow-hidden"
            style={{ boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.07)' }}
          >
            <span
              className="w-[72px] shrink-0 flex items-center justify-center"
              style={{ background: PROJECT_ICON_GRADIENT }}
            >
              <PortfolioStepIcon className="size-6 text-white" />
            </span>
            <div className="flex flex-col gap-[6px] min-w-0 py-[12px] pr-[16px]">
              <div className="flex flex-col gap-[2px] min-w-0">
                <span className="font-sans font-bold text-[15px] text-[#111]">{project.title}</span>
                <span className="font-sans text-[12px] text-[#70706e]">
                  {project.projectType} · {project.year} · {project.role}
                </span>
              </div>
              <p className="font-sans text-[12px] text-[#70706e] leading-[1.5]">
                {project.description}
              </p>
              <div className="flex items-center flex-wrap gap-[5px]">
                {linkTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-[#e8e8e4] bg-white h-[21px] px-[8px] font-sans font-semibold text-[10px] text-[#70706e]"
                  >
                    {tag}
                  </span>
                ))}
                {project.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-full border border-[#e8e8e4] bg-white h-[21px] px-[8px] font-sans font-semibold text-[10px] text-[#70706e]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reason rows — Figma 5211:114160 / 5211:114165, identical styling */}
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[8px] rounded-[8px] border border-[#c1d4c4] bg-white px-[12px] py-[10px]">
            <span className="size-[8px] rounded-[4px] bg-[#c0392b] shrink-0" aria-hidden="true" />
            <span className="font-sans text-[12px] text-[#575755]">
              Project removed from your portfolio immediately
            </span>
          </div>
          <div className="flex items-center gap-[8px] rounded-[8px] border border-[#c1d4c4] bg-white px-[12px] py-[10px]">
            <span className="size-[8px] rounded-[4px] bg-[#c0392b] shrink-0" aria-hidden="true" />
            <span className="font-sans text-[12px] text-[#575755]">
              Portfolio strength may decrease
            </span>
          </div>
        </div>

        {/* "Edit instead?" nudge — Figma 5211:114181 */}
        <div
          className="flex items-center gap-[16px] rounded-[8px] border border-[#c1d4c4] pl-[10px] pr-[16px] py-[12px]"
          style={{ background: 'rgba(235,241,236,0.5)' }}
        >
          <div className="flex flex-col gap-[4px] flex-1 min-w-0">
            <span className="font-sans font-semibold text-[12px] text-[#2a5730]">
              Want to fix something instead of deleting?
            </span>
            <p className="font-sans text-[10px] text-[#387440] leading-[14px] opacity-85">
              Wrong title, outdated description, broken link? Editing keeps all the context intact.
              Deleting and re-adding means starting from scratch.
            </p>
          </div>
          <Button
            variant="tertiary"
            size="sm"
            leftIcon={<WorkEditPencilIcon className="size-full" />}
            onClick={handleEditInstead}
            className="shrink-0"
          >
            Edit Instead
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeletePortfolioModal;
