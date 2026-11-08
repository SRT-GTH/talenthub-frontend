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
  // National Service: backend type government-program (utils/jobPostForm.js "national-service").
  'national service (nss)': 'national-service',
  apprenticeship: 'temporary',
};

const ARRANGEMENT = { 'on-site': 'on-site', hybrid: 'hybrid', remote: 'remote' };

const FREQUENCY = {
  'monthly salary': 'month',
  'yearly salary (gbp)': 'year',
  'hourly rate': 'hour',
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

/* ---------- stored posting <-> page values (posting detail, Edit posting) ---------- */

const EMPLOYMENT_OF = (opp) => {
  if (opp.type === 'internship') return 'Internship';
  if (opp.type === 'government-program') return 'National Service (NSS)';
  const d = opp.duration?.type;
  if (d === 'contract') return 'Contract';
  if (d === 'temporary') return 'Contract';
  return 'Full-time';
};
const SETUP_OF = { onsite: 'On-site', hybrid: 'Hybrid', remote: 'Remote' };
const PAY_OF = {
  monthly: 'Monthly salary',
  yearly: 'Yearly salary (GBP)',
  hourly: 'Hourly rate',
  weekly: 'Monthly salary',
};
const pad = (n) => String(n).padStart(2, '0');

/** "About" and the bullet lists back out of the description the backend built (formToOpportunity). */
export const splitDescription = (text) => {
  const s = String(text || '');
  const grab = (label) => {
    const m = s.match(new RegExp(`${label}:\\n((?:- .*(?:\\n|$))+)`));
    return m
      ? m[1]
          .split('\n')
          .map((l) => l.replace(/^- /, '').trim())
          .filter(Boolean)
      : [];
  };
  const first = s.split(/\n\n(?:Responsibilities|Qualifications):\n/)[0].trim();
  // "Description to follow." is the backend's stand-in for a draft saved without one.
  const about = first === 'Description to follow.' ? '' : first;
  return {
    about,
    responsibilities: grab('Responsibilities'),
    qualifications: grab('Qualifications'),
  };
};

export const placeLabel = (loc = {}) => {
  if (loc.type === 'remote' && !loc.address && !loc.city) return 'Remote · anywhere in Ghana';
  return loc.address || [loc.city, loc.region].filter(Boolean).join(', ') || '';
};

export const fromOpportunity = (opp = {}) => {
  const { about, responsibilities } = splitDescription(opp.description);
  const d = opp.deadlineDate ? new Date(opp.deadlineDate) : null;
  const sal = opp.salary || {};
  return {
    title: opp.title || '',
    department:
      (opp.tags || []).find((t) =>
        ['Design', 'Engineering', 'Marketing', 'Operations', 'Finance'].includes(t)
      ) || '',
    employment: EMPLOYMENT_OF(opp),
    experience: '',
    setup: SETUP_OF[opp.location?.type] || 'On-site',
    location: placeLabel(opp.location),
    openings: '1',
    payType:
      sal.min || sal.max
        ? PAY_OF[sal.type] || 'Monthly salary'
        : opp.type === 'internship'
          ? 'Stipend'
          : '',
    min: sal.min != null ? String(sal.min) : '0',
    max: sal.max != null ? String(sal.max) : '0',
    showPay: Boolean(sal.min || sal.max),
    about,
    responsibilities,
    skills: (opp.skills || []).map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean),
    deadline:
      d && !Number.isNaN(d.getTime())
        ? `${pad(d.getUTCDate())} / ${pad(d.getUTCMonth() + 1)} / ${d.getUTCFullYear()}`
        : '',
    screening: '',
    confirmation: true,
    gthProfile: true,
    under18: false,
  };
};

/** Page values -> PUT /opportunities/:id updates (owner fields only; status is never sent from here). */
export const toPostingUpdates = (values, current = {}) => {
  const form = toBuddyForm(values);
  const sections = [form.description];
  if (form.responsibilities.length)
    sections.push(`Responsibilities:\n${form.responsibilities.map((r) => `- ${r}`).join('\n')}`);
  const kept = splitDescription(current.description).qualifications;
  if (kept.length) sections.push(`Qualifications:\n${kept.map((q) => `- ${q}`).join('\n')}`);
  const description = sections.filter(Boolean).join('\n\n').slice(0, 5000);
  const arrangement =
    { 'on-site': 'onsite', hybrid: 'hybrid', remote: 'remote' }[form.workArrangement] || 'onsite';
  const updates = {
    title: form.jobTitle,
    description,
    shortDescription: (form.description || description).slice(0, 300),
    // City and region are worked out from the address by the backend (utils/jobPostForm.js placeOf).
    location: { type: arrangement, address: form.workLocation, country: 'Ghana' },
    skills: form.skills.map((name) => ({ name, isRequired: true })),
  };
  if (form.salaryMin != null || form.salaryMax != null) {
    updates.salary = {
      currency: form.currency || 'GHS',
      min: form.salaryMin,
      max: form.salaryMax,
      type: { month: 'monthly', year: 'yearly', hour: 'hourly' }[form.salaryFrequency] || 'monthly',
    };
  }
  if (form.deadlineDay) {
    updates.deadlineDate = new Date(
      Date.UTC(form.deadlineYear, form.deadlineMonth - 1, form.deadlineDay, 23, 59, 59)
    ).toISOString();
  }
  return updates;
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
    workLocation: String(v.location || '')
      .replace(/\s*·\s*/g, ', ')
      .trim(),
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
