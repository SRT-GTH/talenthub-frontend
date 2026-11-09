import { useCallback, useEffect, useState } from 'react';
import api from '../../../../services/api.js';
import { isRecruiterSession } from '../../../../services/recruiterShell.api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('useLiveAccount');

/*
 * useLiveAccount - the signed-in recruiter's own details for Settings > Account.
 *   GET /users/me      { user: { firstName, lastName, email, phoneNumber, metadata } }
 *   PUT /users/me      { firstName, lastName, phoneNumber, metadata }  (allow-listed fields only)
 * The job title lives in user.metadata.jobTitle; metadata is replaced as a whole by the backend, so the
 * stored metadata is sent back with the new title merged in. The email is the sign-in address and is
 * not changed here (it needs a verified change flow).
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

const toValues = (u = {}) => ({
  fullName: [u.firstName, u.lastName].filter(Boolean).join(' '),
  jobTitle: u.metadata?.jobTitle || '',
  email: u.email || '',
  phone: u.phoneNumber || '',
});

export const useLiveAccount = () => {
  const live = isRecruiterSession();
  const [state, setState] = useState({
    status: live ? 'loading' : 'demo',
    values: null,
    user: null,
  });

  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    api
      .get('/users/me')
      .then((res) => {
        const user = unwrap(res)?.user || {};
        if (alive) setState({ status: 'live', values: toValues(user), user });
      })
      .catch((err) => {
        log.error('load failed:', err?.response?.status);
        if (alive) setState({ status: 'error', values: null, user: null });
      });
    return () => {
      alive = false;
    };
  }, [live]);

  const save = useCallback(
    async (values) => {
      const parts = String(values.fullName || '')
        .trim()
        .split(/\s+/);
      const firstName = parts.shift() || '';
      const lastName = parts.join(' ');
      const body = {
        firstName,
        lastName,
        phoneNumber: String(values.phone || '').trim(),
        metadata: {
          ...(state.user?.metadata || {}),
          jobTitle: String(values.jobTitle || '').trim(),
        },
      };
      const out = unwrap(await api.put('/users/me', body));
      const user = out?.user || { ...state.user, ...body };
      setState({ status: 'live', values: toValues(user), user });
      log('saved');
      return toValues(user);
    },
    [state.user]
  );

  return { ...state, save };
};
