/*
 * liveJobForm - turns the "Create job" page's values (JobFormPage / BLANK_FORM keys) into the form
 * POST /opportunities/from-buddy reads (backend utils/jobPostForm.js formToOpportunity), so the page
 * and Career Buddy create postings the same way: company from the recruiter's organisation, category
 * from the job type, fair-hiring wording check, posting limit, and publish (or a draft while the
 * organisation affiliation is pending).
 */

const JOB_TYPE = {
  'full-time': 'full-time',
  'part-time': 'part-time',
  contract: 'contract',
  internship: 'internship',
  // NSS has no backend job type yet: posted as a fixed-term role (⚠️ ASSUMPTION).
  'national service (nss)': 'temporary',
};

const ARRANGEMENT = { 'on-site': 'on-site', hybrid: 'hybrid', remote: 'remote' };

const FREQUENCY = {
  'monthly salary': 'month',
  'yearly salary (gbp)': 'year',
  'hourly rate': 'month', // no hourly rate in the backend: sent as monthly (⚠️ ASSUMPTION)
  stipend: 'month',
};

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** "30 / 11 / 2026", "30/11/2026", "2026-11-30" or "30 Nov 2026" -> { day, month, year } or null. */
export const parseDeadline = (text) => {
  const s = String(text || '').trim();
  let m = s.match(/^(\d{1,2})\s*[/.-]\s*(\d{1,2})\s*[/.-]\s*(\d{4})$/);
  if (m) return { day: Number(m[1]), month: Number(m[2]), year: Number(m[3]) };
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return { day: Number(m[3]), month: Number(m[2]), year: Number(m[1]) };
  m = s.match(/^(\d{1,2})\s+([A-Za-z]{3,})\.?\s+(\d{4})$/);
  if (m) {
    const month = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase()) + 1;
    if (month) return { day: Number(m[1]), month, year: Number(m[3]) };
  }
  return null;
};

const amount = (text) => {
  const n = Number(String(text ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export const toBuddyForm = (values) => {
  const v = values || {};
  const deadline = parseDeadline(v.deadline);
  const pay = String(v.payType || '').toLowerCase();
  const min = amount(v.min);
  const max = amount(v.max);
  const paid = pay && pay !== 'unpaid' && (min !== null || max !== null);
  return {
    jobTitle: String(v.title || '').trim(),
    description: String(v.about || '').trim(),
    responsibilities: (v.responsibilities || []).map((r) => String(r).trim()).filter(Boolean),
    jobType: JOB_TYPE[String(v.employment || '').toLowerCase()] || 'full-time',
    department: String(v.department || '').trim(),
    workArrangement: ARRANGEMENT[String(v.setup || '').toLowerCase()] || 'on-site',
    workLocation: String(v.location || '').replace(/\s*·\s*/g, ', ').trim(),
    ...(paid
      ? {
          salaryMode: 'range',
          salaryMin: min ?? max,
          salaryMax: max ?? min,
          salaryFrequency: FREQUENCY[pay] || 'month',
          currency: pay.includes('gbp') ? 'GBP' : 'GHS',
        }
      : {}),
    ...(deadline
      ? { deadlineDay: deadline.day, deadlineMonth: deadline.month, deadlineYear: deadline.year }
      : {}),
    skills: (v.skills || []).map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean),
  };
};
