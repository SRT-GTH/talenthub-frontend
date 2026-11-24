import api from '../../../../services/api.js';
import { institutionUploadRules } from '../../../../services/institutionPortal.api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('rosterTemplate');

/*
 * rosterTemplate — the class-list CSV template ("Download CSV template" on the empty roster 11.2.2l, "Download template" in the upload dialog 11.2.2c)
 * and the upload rules. GTH Super Admins set the columns (Admin › Settings › Onboarding templates: platform config onboarding.bulk_roster_template,
 * with an optional template per education level) and the levels, year groups and identity rule (onboarding.bulk_roster_rules).
 * GET /api/institution/roster/upload-rules returns them resolved for this institution: { maxRows, identity, levels, suggestedLevel, templates:
 * { default, <level key>: { fileName, instructions, includeExampleRow, columns } }, optOutWindowDays, smsAvailable }.
 * If that can't be reached, the public template (or the built-in default below) is used.
 */

export const TEMPLATE_CSV =
  'First Name,Last Name,Date of Birth,Gender,Email,Phone,Level,Grade,Student ID,Parent Name,Parent Email,Parent Phone\n';
const DEFAULT_FILE = 'GTH_Student_Upload_Template.csv';

const cell = (v) =>
  /[",\n]/.test(String(v ?? '')) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? '');

let rulesPromise = null;
/** The upload rules (cached for the session; a failed load is retried next time). */
export const loadUploadRules = () => {
  if (!rulesPromise) {
    rulesPromise = institutionUploadRules().catch((err) => {
      log('upload rules not available', err?.response?.status);
      rulesPromise = null;
      return null;
    });
  }
  return rulesPromise;
};

/** The admin template as the public config gives it ({ fileName, instructions, columns }), or null. */
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

/** CSV text for a template (header row + optional example row). Headers are the template's (what the upload recognises). */
export const templateToCsv = (t) => {
  if (!t) return TEMPLATE_CSV;
  const lines = [t.columns.map((c) => cell(c.header || c.key)).join(',')];
  if (t.includeExampleRow !== false) lines.push(t.columns.map((c) => cell(c.example)).join(','));
  return `${lines.join('\n')}\n`;
};

/** The template of one education level ('default' = all levels; none given = the institution's own level), from the upload rules when they load. */
export const templateFor = async (levelKey) => {
  const rules = await loadUploadRules();
  if (rules?.templates) {
    return rules.templates[levelKey ?? rules.suggestedLevel] || rules.templates.default || null;
  }
  return loadRosterTemplate();
};

/** Saves the template of a level as a real file (a Blob link; nothing leaves the browser). */
export const downloadTemplate = async (levelKey) => {
  const t = await templateFor(levelKey);
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
