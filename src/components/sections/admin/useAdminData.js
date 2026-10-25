import { createElement, useCallback, useEffect, useRef, useState } from 'react';
import Toast from '../../ui/Toast.jsx';
import { adminError, adminStatus } from '../../../services/admin.api.js';
import { debug } from '../../../utils/debug.js';

const log = debug('useAdminData');

/*
 * useAdminData — loads one piece of Platform Admin data from the backend (services/admin.api.js).
 * loader: async () => value. deps: re-run when they change. Returns { data, error, status, loading, reload, setData }.
 * `status` is the HTTP status of the last failure (403 = the signed-in role can't see this).
 */
export const useAdminData = (loader, deps = []) => {
  const [state, setState] = useState({ data: null, error: null, status: 0, loading: true });
  const seq = useRef(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(loader, deps);

  const reload = useCallback(async () => {
    const mine = ++seq.current;
    // A refresh keeps what is on screen; only the first load (no data yet) shows the loading state.
    setState((s) => ({ ...s, loading: s.data == null, refreshing: true, error: null, status: 0 }));
    try {
      const data = await run();
      if (mine === seq.current) setState({ data, error: null, status: 0, loading: false, refreshing: false });
    } catch (err) {
      log('load failed', adminStatus(err));
      if (mine === seq.current) {
        setState({ data: null, error: adminError(err), status: adminStatus(err), loading: false, refreshing: false });
      }
    }
  }, [run]);

  useEffect(() => {
    reload();
  }, [reload]);

  const setData = useCallback((data) => setState((s) => ({ ...s, data })), []);
  return { ...state, reload, setData };
};

/** A small toast for admin results. Returns [element, show(title, body?, variant?)]. */
export const useAdminToast = () => {
  const [toast, setToast] = useState(null);
  const show = useCallback((title, body, variant = 'success') => {
    setToast({ id: Date.now(), title, body, variant });
  }, []);
  const el = toast
    ? createElement(Toast, {
        key: toast.id,
        title: toast.title,
        body: toast.body,
        variant: toast.variant,
        duration: 5000,
        onDismiss: () => setToast(null),
      })
    : null;
  return [el, show];
};

