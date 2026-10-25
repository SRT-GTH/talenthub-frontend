/*
 * adminCoreData — mock staff data of the Platform Admin chrome (Figma canvas 8520:12, frames 7.0.2a-e). ⚠️ ASSUMPTION: no real auth /
 * API (frontend only); every value is copied from the role-home frames. Five roles with least privilege.
 * Figma quirk kept as drawn: the Data Protection Officer's avatar monogram reads "SU" (name Kwabena Ofori).
 */

export const ROLE_IDS = ['support', 'moderator', 'senior', 'super', 'dpo'];
export const DEFAULT_ROLE = 'senior';

export const STAFF = {
  senior: {
    id: 'senior',
    name: 'Akua Sarfo',
    shortName: 'Akua S.',
    firstName: 'Akua',
    monogram: 'AS',
    chip: 'Admin',
    title: 'Senior Admin · Trust & Safety',
    roleLabel: 'Senior Admin',
    slaLabel: 'SLA met this week',
    slaPct: 92,
    stats: [
      { value: '14', label: 'My queue' },
      { value: '3', label: 'Claimed' },
      { value: '22', label: 'Done today' },
    ],
    handbook: 'handbook.gth.internal/trust-and-safety',
  },
  support: {
    id: 'support',
    name: 'Kweku Ansah',
    shortName: 'Kweku A.',
    firstName: 'Kweku',
    monogram: 'KA',
    chip: 'Admin',
    title: 'Support Agent · Tier 1',
    roleLabel: 'Support Agent',
    slaLabel: 'Tickets answered in 1 day',
    slaPct: 92,
    stats: [
      { value: '9', label: 'Tickets' },
      { value: '2', label: 'Waiting' },
      { value: '31', label: 'Done today' },
    ],
    handbook: 'handbook.gth.internal/trust-and-safety',
  },
  moderator: {
    id: 'moderator',
    name: 'Esi Darko',
    shortName: 'Esi D.',
    firstName: 'Esi',
    monogram: 'ED',
    chip: 'Admin',
    title: 'Content Moderator',
    roleLabel: 'Content Moderator',
    slaLabel: 'Flags cleared in 24 hours',
    slaPct: 92,
    stats: [
      { value: '11', label: 'Flags' },
      { value: '2', label: 'Claimed' },
      { value: '18', label: 'Done today' },
    ],
    handbook: 'handbook.gth.internal/trust-and-safety',
  },
  super: {
    id: 'super',
    name: 'Nana Adjei',
    shortName: 'Nana A.',
    firstName: 'Nana',
    monogram: 'NA',
    chip: 'Admin',
    title: 'Super Admin · Platform',
    roleLabel: 'Super Admin',
    slaLabel: 'Approvals cleared this week',
    slaPct: 92,
    stats: [
      { value: '4', label: 'Approvals' },
      { value: '2', label: 'Exports' },
      { value: '1', label: 'Alerts' },
    ],
    handbook: 'handbook.gth.internal/trust-and-safety',
  },
  dpo: {
    id: 'dpo',
    name: 'Kwabena Ofori',
    shortName: 'Kwabena O.',
    firstName: 'Kwabena',
    monogram: 'SU',
    chip: 'Admin',
    title: 'Data Protection Officer',
    roleLabel: 'Data Protection Officer',
    slaLabel: 'Requests decided in 10 days',
    slaPct: 92,
    stats: [
      { value: '3', label: 'Requests' },
      { value: '2', label: 'Exports' },
      { value: '1', label: 'Appeals' },
    ],
    handbook: 'handbook.gth.internal/data-protection',
  },
};

export const STAFF_STATUS_LINE = 'GTH staff · 2-step sign-in on';
export const BADGES = { notifications: 5, messages: 5 };
