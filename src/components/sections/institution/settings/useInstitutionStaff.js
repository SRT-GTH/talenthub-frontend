import { useCallback, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { STAFF } from './data/institutionSettingsData.js';

const log = debug('useInstitutionStaff');

const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const inviteNote = () => `Invite sent ${today()} · expires in 7 days`;

/*
 * useInstitutionStaff — the mock staff list of the settings screens (Figma 11.6.1b-f; shaped like GET /institution/staff). Lives in the settings PAGE so
 * the staff tab, the invite card and the remove dialog (which 11.6.1f draws over the Data tab) share one list.
 * Returns { staff, invite({ name, email, role }), changeRole(id, role), resend(id), remove(id) -> { gone, index }, restore(gone, index) }.
 */
export const useInstitutionStaff = () => {
  const [staff, setStaff] = useState(STAFF);

  const invite = useCallback(({ name, email, role }) => {
    log('invite', { email, role });
    setStaff((list) => [
      ...list,
      {
        id: `inv-${Date.now()}`,
        name: email,
        invitee: name,
        email,
        role,
        note: inviteNote(),
        status: 'invited',
      },
    ]);
  }, []);

  const changeRole = useCallback((id, role) => {
    log('role', { id, role });
    setStaff((list) => list.map((s) => (s.id === id ? { ...s, role } : s)));
  }, []);

  const resend = useCallback((id) => {
    log('resend', id);
    setStaff((list) => list.map((s) => (s.id === id ? { ...s, note: inviteNote() } : s)));
  }, []);

  const remove = useCallback(
    (id) => {
      const index = staff.findIndex((s) => s.id === id);
      const gone = staff[index];
      log('remove', id);
      setStaff((list) => list.filter((s) => s.id !== id));
      return { gone, index };
    },
    [staff]
  );

  const restore = useCallback((gone, index) => {
    log('restore', gone.id);
    setStaff((list) => {
      const next = [...list];
      next.splice(Math.min(index, next.length), 0, gone);
      return next;
    });
  }, []);

  return { staff, invite, changeRole, resend, remove, restore };
};
