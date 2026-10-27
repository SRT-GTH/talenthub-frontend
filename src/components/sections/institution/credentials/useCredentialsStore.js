import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { debug } from '../../../../utils/debug.js';
import {
  apiMessage,
  credentialOptions,
  getCredential,
  listCredentials,
} from '../../../../services/institutionPortal.api.js';
import { emptyForm } from './data/credentialsData.js';

const log = debug('credentialsStore');

/*
 * credentialsStore — the issue form being edited (it survives the trip from the form dialog to the certificate preview and back), the toast,
 * and the hooks that load the list, one credential and the form options from /api/institution/credentials.
 */

let state = { form: emptyForm(), toast: null, issued: null };
const listeners = new Set();
const set = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getState = () => state;

export const useCredentialsStore = () => useSyncExternalStore(subscribe, getState, getState);
export const setForm = (patch) => set({ form: { ...state.form, ...patch } });
export const resetForm = () => set({ form: emptyForm(), issued: null });
export const setIssued = (issued) => set({ issued });
export const showToast = (message) => {
  log('toast', message);
  set({ toast: { id: Date.now(), message } });
};
export const dismissToast = () => set({ toast: null });

const useLoad = (fn, deps) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);
  useEffect(() => {
    let live = true;
    setError('');
    run()
      .then((d) => live && setData(d))
      .catch((err) => live && setError(apiMessage(err)));
    return () => {
      live = false;
    };
  }, [run, tick]);
  return { data, error, reload: () => setTick((t) => t + 1) };
};

export const useCredentialsList = ({ tab, filter, sort }) =>
  useLoad(() => listCredentials({ tab, filter, sort }), [tab, filter, sort]);

export const useCredential = (id) =>
  useLoad(() => (id ? getCredential(id) : Promise.resolve(null)), [id]);

export const useCredentialOptions = () => useLoad(() => credentialOptions(), []);
