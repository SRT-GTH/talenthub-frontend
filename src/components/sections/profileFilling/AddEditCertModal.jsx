import { useState, useEffect } from 'react';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import { TextInput, Select, Checkbox, DatePicker } from '../../ui/form';
import { debug } from '../../../utils/debug.js';
import {
  CloseIcon,
  ArrowLeftIcon,
  WorkDeleteWarningIcon,
  HelperTextIcon,
} from '../../shared/assets.jsx';
import { CREDENTIAL_TYPES } from './certTypeStyles.js';

const log = debug('AddEditCertModal');

/*
 * AddEditCertModal — single form component for both the Add-Certification
 * and Edit-Certification flows, switched via the `mode` prop ('add' | 'edit')
 * per CLAUDE.md's shared-component-reuse rule and AddEditWorkModal.jsx /
 * AddEditPortfolioModal.jsx's established precedent.
 *
 * Add-mode content restyled 2026-09-09 via a real get_design_context dive on
 * 5248:170884 ("Overlay centred card") — the whole modal tree came back in
 * one call. This superseded an earlier get_metadata-only pass that guessed
 * several field labels and mis-copied the badge/headline as a leftover
 * "Identity captured." clone. Real, ✅ VERIFIED content:
 *   Badge: "Add A Cert". Headline is mixed-style: "New certification. "
 *     (plain) + "Add the details." (italic, #387440). Subtitle: "Upload a
 *     file above for automatic field detection, or fill in the details
 *     manually here. The more fields you complete, the stronger your
 *     credential card looks."
 *   Upload shortcut banner — "Have a PDF or image?" / "Upload it and GTH
 *     auto-fills the fields below in ~2 seconds." + a "Upload File" button.
 *   Section 1 "Core details" — Certification name (required), a row of
 *     Issuing organisation (required) + Category Select (no asterisk and no
 *     "optional" label in Figma's own markup — unmarked, unlike every other
 *     field here — so left un-required and non-blocking), then Skills or
 *     subjects covered (required, comma separated).
 *   Section 2 "Dates" — Issue date (required) + Expiry date. Figma marks
 *     Expiry date OPTIONAL (grey "optional" label, not a required asterisk)
 *     — the "This certificate does not expire" checkbox (not covered by this
 *     dive, kept from the earlier pass since several populated list cards
 *     show "No expiry", i.e. real evidenced UI) still disables the field
 *     when checked, but neither state blocks submission any more.
 *   Section 3 "Verification - removes "Self-reported" label" (literal
 *     mixed-weight header) — Credential ID and "Badge or verify URL" both
 *     carry an individual green required-asterisk in Figma's raw markup, yet
 *     the tip box directly below says to add EITHER one, not both, and the
 *     app's own verified/self-reported badge logic (see CertsStage2Section
 *     / DeleteCertModal) treats "neither filled" as a fully valid saved
 *     state. Resolved as: show both with the Figma-verified `required`
 *     asterisk styling, but do NOT gate `canSubmit` on either — the asterisk
 *     documents Figma's visual truth, the tip copy documents the actual
 *     (non-blocking) behavior.
 *
 * The upload-shortcut banner's "Upload File" button opens a native file
 * picker (hidden `<input type="file">`) but does not run real AI extraction
 * — no such backend exists anywhere in this app yet (same "no invented
 * backend" rule as every other stage). Selecting a file only logs it via
 * debug() and leaves the manual fields for the user to fill, consistent with
 * the modal being a genuinely manual form with an accelerated-path banner on
 * top.
 *
 * Edit-mode copy (badge/headline/subtitle, footer "Delete this
 * Certification") is unchanged from the earlier get_metadata pass — this
 * dive only covered the Add-mode root (5248:170884); Edit mode
 * (5249:171693) has not yet been independently re-dived.
 */

// Matches the "20-alert" symbol Field.jsx uses internally for its own
// helperText row — reproduced here for the upload-shortcut banner's icon,
// which isn't attached to any single input (same pattern
// AddEditPortfolioModal.jsx's own local AlertIcon uses).
const UploadIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M8 10.5V2.5M8 2.5 5 5.5M8 2.5l3 3"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 10.5v1.5a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-1.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EMPTY_FORM = {
  name: '',
  issuer: '',
  credentialType: '',
  skillsText: '',
  dateIssued: '',
  expiryDate: '',
  doesNotExpire: false,
  credentialId: '',
  badgeUrl: '',
};

const AddEditCertModal = ({ isOpen, onClose, onSave, mode = 'add', initialData = null }) => {
  const isEditMode = mode === 'edit';
  const [form, setForm] = useState(EMPTY_FORM);

  log('mount', { isOpen, mode, initialDataId: initialData?.id });

  useEffect(() => {
    if (isOpen) {
      log('open — resetting form', { mode, prefill: Boolean(initialData) });
      setForm(
        initialData
          ? { ...EMPTY_FORM, ...initialData, skillsText: (initialData.skills ?? []).join(', ') }
          : EMPTY_FORM
      );
    }
  }, [isOpen, initialData, mode]);

  const update = (field, value) => {
    log('field change', { field, value });
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUploadPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // No AI-extraction backend exists in this app — mock upload only logs
    // the picked file, same "no invented backend" rule as every other stage.
    log('upload shortcut — file picked (no AI extraction backend yet)', { name: file.name });
    e.target.value = '';
  };

  const canSubmit =
    form.name.trim() && form.issuer.trim() && form.skillsText.trim() && form.dateIssued.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    const skills = form.skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    log(isEditMode ? 'save certification edit' : 'add certification', { ...form, skills });
    onSave({
      ...(isEditMode && initialData ? { id: initialData.id } : {}),
      ...form,
      skills,
    });
    onClose();
  };

  // Verification tip (Figma 5249:171313/171314) only makes sense while the
  // cert would still show as "Self-reported" — hide it once either field is
  // filled, matching its own copy ("...and the disclaimer disappears").
  const showVerificationTip = !form.credentialId.trim() && !form.badgeUrl.trim();

  // Edit mode's footer is "Delete this Certification" + Save (no separate
  // Cancel) — ✅ VERIFIED verbatim button text (5249:172095) — same pattern
  // AddEditWorkModal/AddEditPortfolioModal already established; Add mode
  // keeps Cancel + Save since there's nothing to delete yet.
  const footer = (
    <div className="border-t border-[rgba(0,0,0,0.07)] bg-white px-[clamp(20px,2.5vw,40px)] py-[16px] flex items-center justify-between">
      {isEditMode && initialData?.onDelete ? (
        <button
          type="button"
          onClick={initialData.onDelete}
          className="flex items-center gap-[7px] rounded-[10px] border border-[#ebc2bd] bg-[#f9ebea] px-[14px] py-[10px] font-sans font-bold text-[12px] text-[#c0392b] transition-colors duration-150 hover:bg-[#f6ddda]"
        >
          <WorkDeleteWarningIcon className="size-4" />
          Delete this Certification
        </button>
      ) : (
        <Button
          leftIcon={<ArrowLeftIcon className="size-full text-[#111111]" />}
          variant="tertiary"
          size="md"
          onClick={onClose}
        >
          Cancel
        </Button>
      )}
      <Button
        variant="primary"
        size="md"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={isEditMode ? '!py-[10px] !text-[12px] !leading-[normal]' : undefined}
      >
        {isEditMode ? 'Save Changes' : 'Save certification →'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      ariaLabel={isEditMode ? 'Edit certification' : 'Add a certification'}
      showClose={false}
      contentClassName="!max-w-[820px] !rounded-[24px] !border-3 !border-[#c1d4c4] overflow-hidden p-0"
      footer={footer}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-[25px] top-[25px] z-10 size-[28px] rounded-[20px] bg-[#ebf1ec] flex items-center justify-center text-brand-green hover:bg-[#c1d4c4] transition-colors duration-150"
      >
        <CloseIcon className="size-[12px]" />
      </button>

      <div className="px-[clamp(24px,4vw,68px)] pt-[clamp(28px,3vw,48px)] pb-[clamp(20px,2vw,32px)] flex flex-col gap-[24px]">
        {/* Header — see file-header comment re: "Identity captured." clone. */}
        <div className="flex flex-col items-center gap-[16px] text-center">
          <div
            className="flex items-center gap-[6px] h-[24px] px-[14px] rounded-[6px] border border-[#c1d4c4] shrink-0"
            style={{ background: 'rgba(235,241,236,0.5)' }}
          >
            <span
              className="size-[8px] rounded-full shrink-0 bg-[#c1d4c4]"
              style={{ border: '1.5px solid #1d7c4d', boxShadow: '0px 0px 4px 0px #387440' }}
            />
            <span className="font-sans text-[12px] text-[#999] tracking-[0.2px] whitespace-nowrap">
              {isEditMode ? 'Edit certification' : 'Add A Cert'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-[4px]">
            <h2 className="font-display text-[clamp(22px,2.4vw,32px)] tracking-[-1.2px] leading-[1.1] text-[#111]">
              {isEditMode ? (
                'Update this certification.'
              ) : (
                <>
                  New certification. <span className="italic text-[#387440]">Add the details.</span>
                </>
              )}
            </h2>
            <p className="font-sans text-[12px] text-[#959592] tracking-[0.2px] leading-[18px] max-w-[480px]">
              {isEditMode
                ? "Update the details below and save when you're done."
                : 'Upload a file above for automatic field detection, or fill in the details manually here. The more fields you complete, the stronger your credential card looks.'}
            </p>
          </div>
        </div>

        {/* Upload shortcut banner — Figma 5249:171316, ✅ VERIFIED via
            get_design_context 2026-09-09. */}
        <div className="rounded-[16px] border border-[#c1d4c4] bg-[rgba(235,241,236,0.5)] px-[16px] py-[12px] flex items-center justify-between gap-[16px]">
          <div className="flex items-center gap-[12px] min-w-0">
            <span
              className="size-[32px] rounded-[8px] bg-white flex items-center justify-center shrink-0"
              style={{
                boxShadow: '0px 2px 1px rgba(27,36,44,0.04), 0px 2px 4px rgba(27,36,44,0.08)',
              }}
            >
              <UploadIcon className="size-3 text-[#111]" />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-sans font-semibold text-[12px] text-[#111]">
                Have a PDF or image?
              </span>
              <span className="font-sans text-[11px] text-[#70706e]">
                Upload it and GTH auto-fills the fields below in ~2 seconds.
              </span>
            </div>
          </div>
          <label className="shrink-0 inline-flex items-center rounded-[10px] border border-[#c1d4c4] bg-[rgba(235,241,236,0.5)] px-[16px] py-[10px] font-sans font-semibold text-[12px] text-brand-green cursor-pointer hover:bg-[rgba(235,241,236,0.8)] transition-colors duration-150">
            Upload File
            <input
              type="file"
              accept="application/pdf,image/*"
              className="sr-only"
              onChange={handleUploadPick}
            />
          </label>
        </div>

        {/* Section 1 — Certificate details */}
        <div className="rounded-[24px] border border-[#e8e8e4] bg-white p-[22px] flex flex-col gap-[16px]">
          <div className="flex items-center gap-[10px] border-b border-[#f8f8f4] pb-[10px]">
            <span className="size-[22px] rounded-[11px] bg-brand-green flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-[11px] text-white leading-none">1</span>
            </span>
            <span className="font-sans font-semibold text-[12px] text-[#111]">Core details</span>
          </div>

          <TextInput
            size="xs"
            label="Certification name"
            required
            helperIcon={<HelperTextIcon />}
            helperIconClassName="text-[#2e8b57]"
            helperText="Use the official full name as it appears on the certificate."
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Google Data Analytics Certificate, WASSCE, AWS Cloud Practitioner…"
          />

          <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[35px]">
            <div className="flex-1">
              <TextInput
                size="xs"
                label="Issuing organisation"
                required
                value={form.issuer}
                onChange={(e) => update('issuer', e.target.value)}
                placeholder="e.g. Coursera, WAEC Ghana, Amazon Web Services…"
              />
            </div>
            <div className="flex-1">
              <Select
                size="xs"
                label="Category"
                options={CREDENTIAL_TYPES}
                value={form.credentialType}
                onChange={(value) => update('credentialType', value)}
                placeholder="Select…"
              />
            </div>
          </div>

          <TextInput
            size="xs"
            label="Skills or subjects covered"
            required
            helperIcon={<HelperTextIcon />}
            helperIconClassName="text-[#2e8b57]"
            helperText="These appear as searchable tags on your cert card."
            value={form.skillsText}
            onChange={(e) => update('skillsText', e.target.value)}
            placeholder="e.g. Data Analytics, SQL, R, Tableau — comma separated"
          />
        </div>

        {/* Section 2 — Dates */}
        <div className="rounded-[24px] border border-[#e8e8e4] bg-white p-[22px] flex flex-col gap-[16px]">
          <div className="flex items-center gap-[10px] border-b border-[#f8f8f4] pb-[10px]">
            <span className="size-[22px] rounded-[11px] bg-brand-green flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-[11px] text-white leading-none">2</span>
            </span>
            <span className="font-sans font-semibold text-[12px] text-[#111]">Dates</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[35px]">
            <div className="flex-1">
              <DatePicker
                label="Issue date"
                required
                value={form.dateIssued}
                onChange={(value) => update('dateIssued', value)}
              />
            </div>
            <div className="flex-1">
              <DatePicker
                label="Expiry date"
                optional
                value={form.expiryDate}
                onChange={(value) => update('expiryDate', value)}
                disabled={form.doesNotExpire}
              />
            </div>
          </div>

          <Checkbox
            label="This certificate does not expire"
            checked={form.doesNotExpire}
            onChange={(e) => {
              update('doesNotExpire', e.target.checked);
              if (e.target.checked) update('expiryDate', '');
            }}
          />
        </div>

        {/* Section 3 — Credential ID & verification */}
        <div className="rounded-[24px] border border-[#e8e8e4] bg-white p-[22px] flex flex-col gap-[16px]">
          <div className="flex items-center gap-[10px] border-b border-[#f8f8f4] pb-[10px]">
            <span className="size-[22px] rounded-[11px] bg-brand-green flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-[11px] text-white leading-none">3</span>
            </span>
            <span className="font-sans font-semibold text-[12px] text-[#111]">
              Verification{' '}
              <span className="font-normal text-[10px] text-[#70706e]">
                - removes &ldquo;Self-reported&rdquo; label
              </span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[35px]">
            <div className="flex-1">
              <TextInput
                size="xs"
                label="Credential ID"
                required
                value={form.credentialId}
                onChange={(e) => update('credentialId', e.target.value)}
                placeholder="e.g. GOOGLE-DA-2024-KA7"
              />
            </div>
            <div className="flex-1">
              <TextInput
                size="xs"
                label="Badge or verify URL"
                required
                value={form.badgeUrl}
                onChange={(e) => update('badgeUrl', e.target.value)}
                placeholder="https://…"
              />
            </div>
          </div>

          {/* Verification tip — Figma 5249:171312, ✅ VERIFIED verbatim. */}
          {showVerificationTip && (
            <div
              className="rounded-[10px] p-[15px] flex flex-col gap-[4px]"
              style={{ background: 'rgba(235,241,236,0.3)' }}
            >
              <span className="font-sans font-semibold text-[11px] text-[#2a5730]">
                ✓ How to remove &ldquo;Self-reported&rdquo;
              </span>
              <p className="font-sans text-[10px] text-[#2a5730] opacity-85 leading-[1.5]">
                Add either a Credential ID (from Coursera, LinkedIn Learning, AWS etc.) or a badge
                verify link. GTH will mark the cert as Uploaded &amp; verifiable and the disclaimer
                disappears.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddEditCertModal;
