import { useState } from 'react';
import { settingsError } from '../../../services/settings.api.js';

/** `run(fn, okText)`: busy while the save runs, then { tone: 'ok' | 'error', text } for LiveSaveStatus. */
export const useSaveAction = () => {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);
  const run = async (fn, okText = 'Saved') => {
    setBusy(true);
    setStatus(null);
    try {
      const out = await fn();
      setStatus({ tone: 'ok', text: okText });
      return out;
    } catch (err) {
      setStatus({ tone: 'error', text: settingsError(err) });
      return undefined;
    } finally {
      setBusy(false);
    }
  };
  return { busy, status, setStatus, run };
};
