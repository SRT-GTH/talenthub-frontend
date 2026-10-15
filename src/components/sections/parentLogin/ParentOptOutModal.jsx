import { useState } from 'react';
import Modal from '../../ui/Modal.jsx';
import Select from '../../ui/form/Select.jsx';
import Textarea from '../../ui/form/Textarea.jsx';
import TextInput from '../../ui/form/TextInput.jsx';
import ApiErrorNote from '../../shared/ApiErrorNote.jsx';
import { getApiErrorMessage } from '../../../services/apiErrors.js';
import {
  OPT_OUT_REASONS,
  optOutWithToken,
  useWardDisplay,
} from '../../../services/parentInvite.api.js';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentOptOutModal');

/*
 * Opt out with the link from the parent notice email, without an account.
 * Calls POST /parent-ward/opt-out-with-token; the ward's access is paused
 * at once and they are notified. Two states: form, then done.
 */
const ParentOptOutModal = ({ isOpen, onClose, onDone }) => {
  const ward = useWardDisplay();
  const [reasonCategory, setReasonCategory] = useState('parental_withdrawal');
  const [reason, setReason] = useState('');
  const [parentName, setParentName] = useState(ward.parentName || '');
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [done, setDone] = useState(false);

  const tooShort = reason.trim().length < 10;

  const handleSubmit = async () => {
    if (tooShort || submitting) return;
    setSubmitting(true);
    setApiError('');
    try {
      await optOutWithToken({
        reason: reason.trim(),
        reasonCategory,
        parentName: parentName.trim(),
      });
      log('opt-out recorded');
      setDone(true);
      onDone?.();
    } catch (err) {
      setApiError(getApiErrorMessage(err, 'We could not pause the account. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const footer = done ? (
    <div className="flex justify-end px-6 py-4">
      <button
        type="button"
        onClick={onClose}
        className="h-11 rounded-[10px] border-2 border-[#111] bg-white px-5 font-sans text-[14px] font-bold"
      >
        Close
      </button>
    </div>
  ) : (
    <div className="flex items-center justify-end gap-3 px-6 py-4">
      <button
        type="button"
        onClick={onClose}
        className="h-11 rounded-[10px] px-4 font-sans text-[14px] font-semibold text-[#70706e]"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={tooShort || submitting}
        data-testid="confirm-opt-out"
        className="h-11 rounded-[10px] border-2 border-[#8f2a20] bg-[#c0392b] px-5 font-sans text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Pausing access…' : `Pause ${ward.possessive} access`}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      ariaLabel="Opt out your ward"
      footer={footer}
    >
      <div className="flex flex-col gap-4 px-6 pb-2 pt-6">
        {done ? (
          <div role="status" data-testid="opt-out-done" className="flex flex-col gap-2">
            <h2 className="font-display text-[28px] leading-tight text-[#111]">
              {ward.possessive.charAt(0).toUpperCase() + ward.possessive.slice(1)} access is paused.
            </h2>
            <p className="font-sans text-[14px] leading-6 text-[#595959]">
              They can&apos;t sign in until access is restored, and they have been told. If you
              change your mind, contact the Ghana Talent Hub team.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-[28px] leading-tight text-[#111]">
                Opt out {ward.firstName === 'your ward' ? 'your ward' : ward.firstName}?
              </h2>
              <p className="font-sans text-[14px] leading-6 text-[#595959]">
                {ward.fullName}&apos;s access is paused straight away and they are notified. You
                don&apos;t need an account to do this.
              </p>
            </div>
            <Select
              label="Reason"
              required
              options={OPT_OUT_REASONS}
              value={reasonCategory}
              onChange={(v) => setReasonCategory(v)}
            />
            <Textarea
              label="Tell us a little more"
              required
              rows={3}
              maxLength={1000}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              helperText="At least 10 characters."
            />
            <label className="flex flex-col gap-1">
              <span className="font-sans text-[13px] font-semibold text-[#111]">
                Your name (optional)
              </span>
              <TextInput
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="e.g. Yaw Mensah"
              />
            </label>
            <ApiErrorNote message={apiError} className="max-w-none" />
          </>
        )}
      </div>
    </Modal>
  );
};

export default ParentOptOutModal;
