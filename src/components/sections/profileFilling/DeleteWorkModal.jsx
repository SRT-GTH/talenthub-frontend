import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { debug } from '../../../utils/debug.js';
import {
  WorkDeleteWarningIcon,
  WorkRoleIcon,
  WorkEditPencilIcon,
  WorkDeleteIcon,
} from '../../shared/assets.jsx';
import { STATUS_TAG_STYLES } from './workRoleStatusStyles.js';

const log = debug('DeleteWorkModal');

/*
 * DeleteWorkModal — delete-confirm overlay for the Work stage-2 list page.
 * Source: Figma frame 5178:34742 ("Delete work experience"), overlay node
 * 5178:35347.
 *
 * Restyled 2026-09-06 via a real get_design_context dive on the role-preview
 * card (5178:35880), the reason rows (5178:35906/35911), and the "Edit
 * instead" nudge (5178:35927) — the previous pass's guess at these three
 * pieces (a plain grey title/org box, red+gold two-tone banners, a text-only
 * "Edit this role instead" link) didn't match. Verified now:
 *   - Role preview: pink card (#f9ebea / border #ebc2bd), a white 44px icon
 *     tile, then title/meta/status-tag/description/tag-row — i.e. the SAME
 *     content as a real `RoleCard` row, not a stripped-down summary.
 *   - Reason rows: BOTH rows share one style (white bg, border #c1d4c4,
 *     8px red dot, #575755 text) — not a red/gold pair.
 *   - "Edit instead": a real button (reuses the shared `Button` `tertiary`
 *     variant + a pencil leftIcon), not a plain underlined text link.
 *
 * Also switched to Modal's own `footer` prop (previously the Cancel/Delete
 * buttons were just the last children in Modal's single scrollable region —
 * harmless while the content was short, but not actually pinned; the
 * Add/Edit modal had the identical bug, fixed the same way).
 */
const DeleteWorkModal = ({ isOpen, onClose, onConfirm, onEditInstead, role }) => {
  log('mount', { isOpen, roleId: role?.id });

  const handleConfirm = () => {
    log('confirm delete', { roleId: role?.id });
    onConfirm();
    onClose();
  };

  const handleEditInstead = () => {
    log('edit instead → close + open edit modal');
    onClose();
    onEditInstead?.();
  };

  const statusStyle = role
    ? (STATUS_TAG_STYLES[role.statusTag] ?? STATUS_TAG_STYLES.Internship)
    : null;

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
        Permanently delete this role
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel="Delete this role"
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
            Delete this role?
          </h2>
          <p className="font-sans text-[13px] text-[#70706e] leading-[1.5] max-w-[360px]">
            This will permanently remove the role from your work history. Your profile updates
            immediately. This cannot be undone.
          </p>
        </div>

        {/* Preview of the role being deleted — Figma 5178:35880 */}
        {role && statusStyle && (
          <div className="flex items-center gap-[10px] rounded-[12px] border-2 border-[#ebc2bd] bg-[#f9ebea] px-[10px] py-[16px]">
            <span className="size-[44px] rounded-[10px] bg-[#fefefe] flex items-center justify-center shrink-0">
              <WorkRoleIcon className="size-5 text-[#c0392b]" />
            </span>
            <div className="flex flex-col gap-[8px] min-w-0">
              <div className="flex flex-col gap-[3px] min-w-0">
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
              </div>
              <span
                className="inline-flex items-center gap-[4px] self-start rounded-full border px-[9px] py-[3px] font-sans font-semibold text-[10px]"
                style={{
                  background: statusStyle.bg,
                  borderColor: statusStyle.border,
                  color: statusStyle.text,
                }}
              >
                {statusStyle.dot && <span className="text-[8px]">●</span>}
                {role.statusTag}
              </span>
              <p className="font-sans text-[12px] text-[#70706e] leading-[1.65]">
                {role.description}
              </p>
              <div className="flex items-center flex-wrap gap-[5px]">
                {role.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-[#e8e8e4] bg-white h-[21px] px-[8px] font-sans font-semibold text-[10px] text-[#70706e]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reason rows — Figma 5178:35906 / 5178:35911, identical styling */}
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[8px] rounded-[8px] border border-[#c1d4c4] bg-white px-[12px] py-[10px]">
            <span className="size-[8px] rounded-[4px] bg-[#c0392b] shrink-0" aria-hidden="true" />
            <span className="font-sans text-[12px] text-[#575755]">
              Role removed from your profile immediately
            </span>
          </div>
          <div className="flex items-center gap-[8px] rounded-[8px] border border-[#c1d4c4] bg-white px-[12px] py-[10px]">
            <span className="size-[8px] rounded-[4px] bg-[#c0392b] shrink-0" aria-hidden="true" />
            <span className="font-sans text-[12px] text-[#575755]">
              Profile strength may decrease
            </span>
          </div>
        </div>

        {/* "Edit instead?" nudge — Figma 5178:35927 */}
        <div
          className="flex items-center gap-[16px] rounded-[8px] border border-[#c1d4c4] pl-[10px] pr-[16px] py-[12px]"
          style={{ background: 'rgba(235,241,236,0.5)' }}
        >
          <div className="flex flex-col gap-[4px] flex-1 min-w-0">
            <span className="font-sans font-semibold text-[12px] text-[#2a5730]">
              Want to fix something instead of deleting?
            </span>
            <p className="font-sans text-[10px] text-[#387440] leading-[14px] opacity-85">
              If the dates, title or description are wrong, editing is safer. You keep the history
              and any recruiter activity on this role.
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

export default DeleteWorkModal;
