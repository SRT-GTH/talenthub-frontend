import { STORAGE_KEYS } from '../../../../../constants/storageKeys.js';
import { useParentMe } from '../../live/parentLive.js';
import { ACCOUNT, CLOSE, NOTIFICATIONS, ROLES, SECURITY } from './settingsData.js';

/*
 * useParentSettingsData — the Settings copy for this session (ADR-15).
 * Demo frames (`?state=`, `?demo=1`, Site copy preview, signed out) get the drawn persona (Emma Mensah, Abena and Elliot, her phone,
 * her devices). A signed-in parent gets the same screens with their own details (the stored profile and GET /parent/me) and no
 * sample person: unknown values are left empty, the sample devices and Google link are dropped. Nothing here saves; the tabs
 * stay as they were (Save only logs), so this only removes the sample content.
 */
const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null') || {};
  } catch {
    return {};
  }
};

const RELATIONSHIP = { mother: 'Mother', father: 'Father', guardian: 'Guardian' };

export const useParentSettingsData = () => {
  const me = useParentMe();
  if (!me.live) return { live: false, ACCOUNT, ROLES, NOTIFICATIONS, SECURITY, CLOSE };

  const u = storedUser();
  const p = me.data?.parent || {};
  const wards = me.data?.wards || [];
  const names = wards.map((w) => w.firstName || w.name).filter(Boolean);
  const fullName = p.name || [u.firstName, u.lastName].filter(Boolean).join(' ');
  const value = {
    fullName,
    email: p.email || u.email || '',
    phone: p.phone || p.phoneNumber || u.phoneNumber || '',
    dob: '',
    region: u.region || '',
    city: u.locality || '',
  };
  const role = RELATIONSHIP[p.relationship] || 'Parent';
  const wardsLine = names.length ? `linked to ${names.join(' and ')}` : 'no ward linked yet';

  return {
    live: true,
    ACCOUNT: {
      ...ACCOUNT,
      fields: ACCOUNT.fields.map((f) => ({
        ...f,
        value: value[f.id] ?? '',
        // Sign-in codes go to the account email, so it is confirmed; nothing confirms the rest here.
        verified: f.id === 'email' && Boolean(value.email),
      })),
      type: {
        ...ACCOUNT.type,
        role: `${role} · ${wardsLine}`,
        roleDesc: p.hasCareerProfile
          ? ACCOUNT.type.roleDesc
          : 'Your roles shows the spaces you can open.',
      },
    },
    ROLES: {
      ...ROLES,
      wards: {
        ...ROLES.wards,
        row: `${wards.length} linked`,
        rowDesc: wards.length
          ? wards.map((w) => w.name || w.firstName).join(' · ')
          : 'Link your child to see them here.',
      },
    },
    NOTIFICATIONS: {
      ...NOTIFICATIONS,
      weekly: {
        ...NOTIFICATIONS.weekly,
        rowDesc: 'What your wards did this week, every Sunday at 6 pm on WhatsApp.',
      },
    },
    SECURITY: {
      ...SECURITY,
      signIn: {
        ...SECURITY.signIn,
        password: { ...SECURITY.signIn.password, desc: 'The password you use to log in.' },
        twoStep: {
          ...SECURITY.signIn.twoStep,
          desc: 'A code is sent to you when you sign in on a new device.',
        },
        google: null,
      },
      devices: {
        ...SECURITY.devices,
        list: [
          { id: 'this', kind: 'laptop', name: 'This browser', meta: 'Active now', current: true },
        ],
      },
    },
    CLOSE: {
      ...CLOSE,
      intro: 'Your wards keep their accounts. Here’s what happens.',
      points: ['Your link to your wards ends, and they’re told.', ...CLOSE.points.slice(1)],
    },
  };
};
