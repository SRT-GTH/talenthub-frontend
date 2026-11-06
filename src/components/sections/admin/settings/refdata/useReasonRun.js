import { useState } from 'react';
import { adminError } from '../../../../../services/admin.api.js';

/**
 * Dialog/editor state for "do X with a reason": run(fn, title, text) checks the reason (10+ chars),
 * calls fn, toasts, then calls onDone. Errors land in `error` (server message when there is one).
 */
export const useReasonRun = (toast, onDone) => {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const reset = () => {
    setReason('');
    setError('');
  };
  const run = async (fn, title, text) => {
    if (busy) return;
    if (reason.trim().length < 10) return setError('Add a reason (10+ characters).');
    setBusy(true);
    setError('');
    try {
      const out = await fn();
      toast(title, text);
      onDone?.(out);
    } catch (e) {
      setError(e?.response ? adminError(e) : e.message);
    } finally {
      setBusy(false);
    }
  };
  return { reason, setReason, busy, error, setError, reset, run };
};
