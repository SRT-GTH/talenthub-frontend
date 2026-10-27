import { useCallback, useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import {
  institutionInviteStaff,
  institutionRemoveStaff,
  institutionResendStaff,
  institutionSetStaffRole,
  institutionStaff,
  institutionUpdateCapabilities,
  apiMessage,
} from '../../../../services/institutionPortal.api.js';

const log = debug('useInstitutionStaff');

/*
 * useInstitutionStaff — the school's staff from GET /institution/staff (signed-up staff + pending invites, seats, role capabilities). Lives in the settings
 * PAGE so the staff tab and the remove dialog share one list. Every action calls the API, then reloads the list; actions throw on failure (the caller shows it).
 * Returns { loading, error, staff, seats, used, canManage, capabilities, reload, invite({name,email,role}), changeRole(id, role), resend(id), remove(id),
 *           setCapability(id, on) }.
 */
export const useInstitutionStaff = () => {
  const [state, setState] = useState({
    loading: true,
    error: '',
    staff: [],
    seats: 10,
    used: 0,
    canManage: false,
    capabilities: { issue: true, export: true },
  });

  const reload = useCallback(async () => {
    try {
      const r = await institutionStaff();
      setState({
        loading: false,
        error: '',
        staff: r.items,
        seats: r.seats,
        used: r.used,
        canManage: r.canManage,
        capabilities: r.capabilities,
      });
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: apiMessage(err) }));
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const invite = useCallback(
    async (input) => {
      log('invite', { role: input.role });
      await institutionInviteStaff(input);
      await reload();
    },
    [reload]
  );
  const changeRole = useCallback(
    async (id, role) => {
      log('role', { id, role });
      await institutionSetStaffRole(id, role);
      await reload();
    },
    [reload]
  );
  const resend = useCallback(
    async (id) => {
      log('resend', id);
      await institutionResendStaff(id);
      await reload();
    },
    [reload]
  );
  const remove = useCallback(
    async (id) => {
      log('remove', id);
      await institutionRemoveStaff(id);
      await reload();
    },
    [reload]
  );
  const setCapability = useCallback(async (id, on) => {
    log('capability', { id, on });
    const r = await institutionUpdateCapabilities({ [id]: on });
    setState((s) => ({ ...s, capabilities: r.capabilities }));
  }, []);

  return { ...state, reload, invite, changeRole, resend, remove, setCapability };
};
