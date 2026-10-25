import api from '../../../../services/api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('rosterTemplate');

/*
 * rosterTemplate — the CSV template of the class list ("Download CSV template" on the empty roster 11.2.2l, "Download template" in the upload dialog 11.2.2c).
 * The columns are set by GTH Super Admins (Platform Admin › Settings › Onboarding templates, platform config onboarding.bulk_roster_template) and read
 * through GET /api/config/public/onboarding.bulk_roster_template. If that can't be reached, the built-in default below is used.
 */

export const TEMPLATE_CSV =
  'student_name,ghana_card,programme,index_number,dob,year_group,guardian_phone,email\n';
const DEFAULT_FILE = 'gth-class-list-template.csv';

const cell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? ''));

/** The current template ({ fileName, instructions, columns, includeExampleRow }), or null when it can't be loaded. */
export const loadRosterTemplate = async () => {
  try {
    const res = await api.get('/config/public/onboarding.bulk_roster_template');
    const value = res?.data?.value ?? res?.value;
    return value && Array.isArray(value.columns) && value.columns.length ? value : null;
  } catch (err) {
    log('template not available, using the built-in one', err?.response?.status);
    return null;
  }
};

/** CSV text for a template (header row + optional example row). */
export const templateToCsv = (t) => {
  if (!t) return TEMPLATE_CSV;
  const lines = [t.columns.map((c) => cell(c.key)).join(',')];
  if (t.includeExampleRow !== false) lines.push(t.columns.map((c) => cell(c.example)).join(','));
  return `${lines.join('\n')}\n`;
};

/** Saves the template as a real file (a Blob link; nothing leaves the browser). */
export const downloadTemplate = async () => {
  const t = await loadRosterTemplate();
  const url = URL.createObjectURL(new Blob([templateToCsv(t)], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = t?.fileName || DEFAULT_FILE;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return t;
};
