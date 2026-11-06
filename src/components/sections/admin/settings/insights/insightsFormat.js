/* Formatting for the Settings › Overview / Security / Accessibility screens. */

export const fmt = (n) => (n == null ? '–' : Number(n).toLocaleString('en-GB'));

export const pctOf = (n, total) => (total ? `${Math.round((n / total) * 100)}%` : '–');

export const when = (d) =>
  d
    ? new Date(d).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Never';

export const ROLE_LABEL = {
  super_admin: 'Super Admin',
  senior_admin: 'Senior Admin',
  support_agent: 'Support agent',
  content_moderator: 'Content moderator',
  talent: 'Talent',
  parent: 'Parent',
  recruiter: 'Recruiter',
};

export const roleLabel = (t) => ROLE_LABEL[t] || (t ? String(t).replace(/_/g, ' ') : 'Unknown');
