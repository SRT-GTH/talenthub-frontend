/*
 * jobConversationData.js — Conversation-with-AI Post-a-Job copy + draft
 * mapping (Figma strip 5132:73294 / CHAT 5132:73460 + form-parity asks).
 *
 * Chat walks every JobPostFormModal field so the draft is complete before
 * panel review. Extra asks (company, industry, department, experience,
 * description, perks) match form sections not present in the Figma strip.
 */

import { emptyJobPostForm, INDUSTRY_OPTIONS } from './jobPostFormData.js';

/** Mode-card auto echo — Figma 5132:73294. */
export const JOB_CONV_AUTO = '💬 Conversation with AI';

export const JOB_CONV_TITLE_ASK =
  "Awesome! Let's have a conversation about this role. I'll ask you questions, and by the end, we'll have a complete job posting ready. ✨\nLet's start with the basics. **What's the job title for this position?** For example: Software Engineer, Marketing Manager, Sales Representative, Accountant, Graphic Designer, etc.";

export const JOB_CONV_TITLE_FALLBACK = 'We need a Digital Marketing Specialist';

export const JOB_CONV_COMPANY_ASK =
  'Got it! ✅\n\n**Which company is hiring for this role?**\nUse the official company name candidates will see on the job post.';

export const JOB_CONV_COMPANY_FALLBACK = 'Silver Rock Technologies';

export const JOB_CONV_INDUSTRY_ASK =
  'Perfect. 👍\n\n**What industry is this role in?**\nExamples: Technology, Finance & Banking, Healthcare, Education, Retail & E-commerce, NGO / Development, Other.';

export const JOB_CONV_INDUSTRY_FALLBACK = 'Technology';

export const JOB_CONV_DEPARTMENT_ASK =
  'Noted! 🌟\n\n**Which department or team will this person join?**\nFor example: Engineering, Sales, HR, Marketing, Product, Operations.';

export const JOB_CONV_DEPARTMENT_FALLBACK = 'Marketing';

export const JOB_CONV_LOCATION_ASK =
  'Perfect! A Digital Marketing Specialist — great role. 👍\nWhere will this person be working?\nYou can specify:\n- A specific city (e.g., Accra, Kumasi, Takoradi)\n- Multiple locations\n- Remote\n- Hybrid (office + remote)';

/** Location ask when the title is not the demo fallback — keep structure, swap title. */
export const jobConvLocationAskFor = (title) => {
  const role = title?.trim() || 'this role';
  return `Great — ${role} in that department. 👍\nWhere will this person be working?\nYou can specify:\n- A specific city (e.g., Accra, Kumasi, Takoradi)\n- Multiple locations\n- Remote\n- Hybrid (office + remote)`;
};

export const JOB_CONV_LOCATION_FALLBACK = "Accra, but we're flexible with hybrid";

export const jobConvTypeAskFor = (locationSummary) =>
  `Got it — ${locationSummary}. That's very attractive to candidates! 🌟\nWhat type of employment is this?\n- Full-time\n- Part-time  \n- Contract\n- Internship\n- Freelance/Project-based`;

export const JOB_CONV_TYPE_FALLBACK = 'Full-time';

export const JOB_CONV_EXPERIENCE_ASK =
  'Excellent. ✅\n\n**What experience level are you looking for?**\nPick one band:\n- 1-5 years\n- 6-10 years\n- 11-20 years\n- 20+ years';

export const JOB_CONV_EXPERIENCE_FALLBACK = '1-5';

export const JOB_CONV_DESCRIPTION_ASK =
  'Thanks! ✨\n\n**Write a short job description** candidates will read first.\nCover the role, the team, and what success looks like (a few sentences is fine).';

export const JOB_CONV_DESCRIPTION_FALLBACK =
  'We are hiring a Digital Marketing Specialist to own social, paid, and email campaigns. You will partner with design, track performance closely, and help grow our brand across Ghana.';

export const jobConvRespAskFor = (jobType) =>
  `Excellent. ${jobType} position noted.\nNow, tell me about the role itself. What will this person be responsible for?\nJust describe it naturally — what will a typical day or week look like? What are the main tasks they'll handle?\nFeel free to list out responsibilities, or just tell me in your own words. 😊`;

export const JOB_CONV_RESP_FALLBACK =
  "They'll manage our social media accounts, create content for campaigns, run Google and Facebook ads, analyze performance metrics, and work with our design team on marketing materials. Also handle email marketing campaigns.";

/** Organised list — Figma 5132:73294 after responsibilities capture. */
export const JOB_CONV_RESP_CANONICAL = [
  'Manage company social media accounts',
  'Create and execute marketing campaigns',
  'Run paid advertising (Google Ads, Facebook Ads)',
  'Manage email marketing campaigns',
  'Analyze campaign performance and metrics',
  'Collaborate with design team on marketing collateral',
];

export const JOB_CONV_RESP_REWRITE =
  "That's really helpful! Let me organize that:\n\nKey Responsibilities:\n- Manage company social media accounts\n- Create and execute marketing campaigns\n- Run paid advertising (Google Ads, Facebook Ads)\n- Manage email marketing campaigns\n- Analyze campaign performance and metrics\n- Collaborate with design team on marketing collateral\n\nDoes that capture everything, or should I add/modify anything?";

export const JOB_CONV_RESP_CONFIRM_FALLBACK = "That's perfect!";

export const JOB_CONV_QUALS_ASK =
  'Excellent! ✅\n\n\nNow, what qualifications or experience are you looking for?\nThink about:\n- Education level (degree, diploma, etc.)\n- Years of experience\n- Specific skills or software proficiency\n- Certifications (optional but nice to have)\n- Personality traits or soft skills';

export const JOB_CONV_QUALS_FALLBACK =
  'At least 2 years in digital marketing. Degree in Marketing or Communications preferred. Should know Google Analytics, Meta Ads Manager, and Mailchimp. Creative, detail-oriented, good communication.';

export const JOB_CONV_QUALS_CANONICAL = [
  'Minimum 2 years of digital marketing experience',
  'Degree in Marketing, Communications, or related field (preferred)',
  'Proficiency in Google Analytics, Meta Ads Manager, Mailchimp',
  'Creative thinker with strong attention to detail',
  'Excellent communication skills',
  'Thrives in fast-paced environments',
];

export const JOB_CONV_QUALS_REWRITE =
  "Perfect! Here's what I've got:\n\nRequired Qualifications:\n- Minimum 2 years of digital marketing experience\n- Degree in Marketing, Communications, or related field (preferred)\n- Proficiency in Google Analytics, Meta Ads Manager, Mailchimp\n- Creative thinker with strong attention to detail\n- Excellent communication skills\n- Thrives in fast-paced environments\n\nOptional/Nice-to-Have:\n- Digital marketing certifications\n\nDoes this look good?";

export const JOB_CONV_QUALS_CONFIRM_FALLBACK = 'Yes, continue';

export const JOB_CONV_SALARY_ASK =
  'Great! Now let\'s talk compensation. 💰\n\nWhat\'s the salary range for this position?\n\nYou can:\n- Provide a specific range (e.g., GHS 3,000 - 5,000/month)\n- Provide a fixed amount (e.g., GHS 5,000/month)\n- Say "Competitive" or "Negotiable"\n- Skip this if you prefer not to display salary\n\n*Note: Displaying salary increases applications by 30% on average!*';

export const JOB_CONV_SALARY_FALLBACK = 'GHS 4,000 to 6,000 per month depending on experience';

export const jobConvBenefitsAskFor = (salarySummary) =>
  `Excellent! ${salarySummary} is very competitive. ✅\n\nWhat about benefits?\n\nDo you offer any of these?\n- Health insurance\n- Performance bonuses\n- Paid time off\n- Professional development/training\n- Flexible working hours\n- Other perks (specify)\n\nJust list what applies, or type "none" if no additional benefits.`;

export const JOB_CONV_BENEFITS_FALLBACK =
  'Health insurance, annual bonuses, and training opportunities';

export const JOB_CONV_PERKS_ASK =
  'Wonderful! 🌟\n\n**Any additional perks** beyond the checklist?\nExamples: remote stipend, laptop, meal allowance — or type "none".';

export const JOB_CONV_PERKS_FALLBACK = 'Laptop provided and flexible Fridays';

export const JOB_CONV_DATES_ASK =
  'Almost done! 📅\n\n**What\'s the application deadline?**\nYou can give a specific date (day, month, year) or say something like "ASAP" or "Flexible."\nIf you also have a target start date, include that too.';

export const JOB_CONV_DATES_FALLBACK = 'Start in January 2026, deadline December 20th 2025';

export const JOB_CONV_COMPLETE_BOT =
  "Perfect! I've got everything I need. ✅\n\nLet me prepare your complete job post. Check the preview on the progress planner panel in just a moment...";

/** Live panel % while Conversation AI runs (final 100% on confirmsStageId). */
export const JOB_PANEL_PROGRESS = {
  'job-conv-start': 6,
  'job-conv-title': 10,
  'job-conv-company': 16,
  'job-conv-industry': 22,
  'job-conv-department': 28,
  'job-conv-location': 34,
  'job-conv-type': 40,
  'job-conv-experience': 46,
  'job-conv-description': 52,
  'job-conv-resp': 58,
  'job-conv-resp-confirm': 62,
  'job-conv-quals': 70,
  'job-conv-quals-confirm': 74,
  'job-conv-salary': 80,
  'job-conv-benefits': 86,
  'job-conv-perks': 92,
  'job-conv-dates': 100,
};

const BENEFIT_ALIASES = [
  { match: /health/i, value: 'Health Insurance' },
  { match: /bonus/i, value: 'Performance Bonuses' },
  { match: /train|professional development|development/i, value: 'Professional Development' },
  { match: /paid time|pto|leave/i, value: 'Paid Time Off' },
  { match: /flex/i, value: 'Flexible Working Hours' },
  { match: /pension|retirement/i, value: 'Pension/Retirement Plan' },
  { match: /transport/i, value: 'Transport Allowance' },
  { match: /meal/i, value: 'Meal Allowance' },
];

const parseJobTitle = (text) => {
  const raw = (text || '').trim();
  if (!raw) return 'Digital Marketing Specialist';
  const stripped = raw
    .replace(/^we need an?\s+/i, '')
    .replace(/^looking for an?\s+/i, '')
    .trim();
  return stripped || raw;
};

const parseIndustry = (text) => {
  const raw = (text || JOB_CONV_INDUSTRY_FALLBACK).trim().toLowerCase();
  const hit = INDUSTRY_OPTIONS.find(
    (opt) =>
      opt.label.toLowerCase() === raw ||
      opt.value === raw ||
      opt.label.toLowerCase().includes(raw) ||
      raw.includes(opt.label.toLowerCase().split('&')[0].trim())
  );
  if (hit) return hit.value;
  if (/tech|software|it\b/.test(raw)) return 'technology';
  if (/financ|bank/.test(raw)) return 'finance';
  if (/health|medic/.test(raw)) return 'healthcare';
  if (/educ|school/.test(raw)) return 'education';
  if (/retail|e-?comm/.test(raw)) return 'retail';
  if (/ngo|non-?profit|develop/.test(raw)) return 'ngo';
  return 'other';
};

const parseLocation = (text) => {
  const raw = (text || JOB_CONV_LOCATION_FALLBACK).trim();
  const lower = raw.toLowerCase();
  let workArrangement = 'On-site';
  if (/\bremote\b/.test(lower) && !/\bhybrid\b/.test(lower)) workArrangement = 'Remote';
  else if (/\bhybrid\b/.test(lower)) workArrangement = 'Hybrid';
  const cityMatch = raw.match(/\b(Accra|Kumasi|Takoradi|Tema|Tamale|Cape Coast)[^,]*/i);
  const workLocation = cityMatch ? cityMatch[0].trim() : raw.split(',')[0].trim() || raw;
  return { workLocation, workArrangement, summary: raw };
};

const parseJobType = (text) => {
  const raw = (text || JOB_CONV_TYPE_FALLBACK).trim();
  const lower = raw.toLowerCase();
  if (lower.includes('part')) return 'Part-time';
  if (lower.includes('contract')) return 'Contract';
  if (lower.includes('intern')) return 'Internship';
  if (lower.includes('freelance') || lower.includes('project')) return 'Freelance/Project-based';
  if (lower.includes('temp')) return 'Temporary';
  return 'Full-time';
};

const parseExperience = (text) => {
  const raw = (text || JOB_CONV_EXPERIENCE_FALLBACK).trim().toLowerCase();
  if (/20\+|over 20|more than 20/.test(raw)) return '20+';
  if (/11|12|13|14|15|16|17|18|19|11-20/.test(raw)) return '11-20';
  if (/6-10|6 to 10|\b[6-9]\b|\b10\b/.test(raw) && !/1-5/.test(raw)) return '6-10';
  return '1-5';
};

const parseSalary = (text) => {
  const raw = (text || JOB_CONV_SALARY_FALLBACK).trim();
  const lower = raw.toLowerCase();
  if (/competit|negoti|skip|n\/a|none/.test(lower)) {
    return {
      salaryMode: 'range',
      currency: 'GHS',
      salaryMin: '',
      salaryMax: '',
      salaryFixed: '',
      salaryFrequency: 'month',
      summary: raw,
    };
  }
  let currency = 'GHS';
  if (/\busd\b|\$/.test(lower)) currency = 'USD';
  if (/\beur\b|€/.test(lower)) currency = 'EUR';
  const nums = [...raw.matchAll(/([\d,]+(?:\.\d+)?)/g)].map((m) => m[1].replace(/,/g, ''));
  let salaryFrequency = 'month';
  if (/year|annum|\/yr/.test(lower)) salaryFrequency = 'year';
  if (/week|\/wk/.test(lower)) salaryFrequency = 'week';

  if (nums.length <= 1 || /fixed|flat|exactly/.test(lower)) {
    const salaryFixed = nums[0] || '';
    return {
      salaryMode: 'fixed',
      currency,
      salaryMin: '',
      salaryMax: '',
      salaryFixed,
      salaryFrequency,
      summary: salaryFixed
        ? `${currency === 'GHS' ? 'GHS' : currency} ${Number(salaryFixed).toLocaleString()}/${salaryFrequency}`
        : raw,
    };
  }

  const salaryMin = nums[0] || '';
  const salaryMax = nums[1] || nums[0] || '';
  const summary =
    salaryMin && salaryMax
      ? `${currency === 'GHS' ? 'GHS' : currency} ${Number(salaryMin).toLocaleString()} - ${Number(salaryMax).toLocaleString()}/${salaryFrequency}`
      : raw;
  return {
    salaryMode: 'range',
    currency,
    salaryMin,
    salaryMax,
    salaryFixed: '',
    salaryFrequency,
    summary,
  };
};

const parseBenefits = (text) => {
  const raw = (text || '').trim();
  if (!raw || /^none$/i.test(raw)) return { benefits: [] };
  const benefits = [];
  for (const { match, value } of BENEFIT_ALIASES) {
    if (match.test(raw) && !benefits.includes(value)) benefits.push(value);
  }
  return { benefits };
};

const parsePerks = (text) => {
  const raw = (text || '').trim();
  if (!raw || /^none$/i.test(raw)) return '';
  return raw;
};

const parseDates = (text) => {
  const raw = (text || JOB_CONV_DATES_FALLBACK).trim();
  const deadline = { deadlineDay: '', deadlineMonth: '', deadlineYear: '' };
  const months = {
    january: '1',
    february: '2',
    march: '3',
    april: '4',
    may: '5',
    june: '6',
    july: '7',
    august: '8',
    september: '9',
    october: '10',
    november: '11',
    december: '12',
  };
  // Prefer the "deadline …" clause so a start month doesn't win.
  const focus = raw.match(/deadline[:\s]+(.+)$/i)?.[1]?.trim() || raw;
  const named = focus.match(
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s*,?\s*(\d{4}))?/i
  );
  const slash = focus.match(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})\b/);
  if (named) {
    deadline.deadlineMonth = months[named[1].toLowerCase()];
    deadline.deadlineDay = String(Number(named[2]));
    deadline.deadlineYear = named[3] || '2025';
  } else if (slash) {
    deadline.deadlineDay = String(Number(slash[1]));
    deadline.deadlineMonth = String(Number(slash[2]));
    deadline.deadlineYear = slash[3].length === 2 ? `20${slash[3]}` : slash[3];
  }
  return deadline;
};

const linesToList = (text, fallbackList) => {
  const raw = (text || '').trim();
  if (!raw) return [...fallbackList];
  const bullets = raw
    .split(/\n|•|-/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
  if (bullets.length >= 2) return bullets;
  return [...fallbackList];
};

/**
 * Apply the answer that *led into* `arrivedNodeId` onto the job draft.
 * Called from CareerBuddySection when the FSM advances.
 */
export const applyJobConvAnswer = (draft, arrivedNodeId, inputText) => {
  const base = { ...emptyJobPostForm(), ...draft };
  const text = (inputText || '').trim();

  switch (arrivedNodeId) {
    case 'job-conv-title': {
      const jobTitle = parseJobTitle(text || JOB_CONV_TITLE_FALLBACK);
      return { ...base, jobTitle };
    }
    case 'job-conv-company': {
      return { ...base, companyName: text || JOB_CONV_COMPANY_FALLBACK };
    }
    case 'job-conv-industry': {
      return { ...base, industry: parseIndustry(text || JOB_CONV_INDUSTRY_FALLBACK) };
    }
    case 'job-conv-department': {
      return { ...base, department: text || JOB_CONV_DEPARTMENT_FALLBACK };
    }
    case 'job-conv-location': {
      const { workLocation, workArrangement } = parseLocation(text || JOB_CONV_LOCATION_FALLBACK);
      return { ...base, workLocation, workArrangement };
    }
    case 'job-conv-type': {
      return { ...base, jobType: parseJobType(text || JOB_CONV_TYPE_FALLBACK) };
    }
    case 'job-conv-experience': {
      return { ...base, experienceLevel: parseExperience(text || JOB_CONV_EXPERIENCE_FALLBACK) };
    }
    case 'job-conv-description': {
      return { ...base, description: text || JOB_CONV_DESCRIPTION_FALLBACK };
    }
    case 'job-conv-resp': {
      return {
        ...base,
        responsibilities: linesToList(text || JOB_CONV_RESP_FALLBACK, JOB_CONV_RESP_CANONICAL),
      };
    }
    case 'job-conv-resp-confirm': {
      return { ...base, responsibilities: [...JOB_CONV_RESP_CANONICAL] };
    }
    case 'job-conv-quals': {
      return {
        ...base,
        qualifications: linesToList(text || JOB_CONV_QUALS_FALLBACK, JOB_CONV_QUALS_CANONICAL),
      };
    }
    case 'job-conv-quals-confirm': {
      return { ...base, qualifications: [...JOB_CONV_QUALS_CANONICAL] };
    }
    case 'job-conv-salary': {
      const salary = parseSalary(text || JOB_CONV_SALARY_FALLBACK);
      return {
        ...base,
        salaryMode: salary.salaryMode,
        currency: salary.currency,
        salaryMin: salary.salaryMin,
        salaryMax: salary.salaryMax,
        salaryFixed: salary.salaryFixed,
        salaryFrequency: salary.salaryFrequency,
      };
    }
    case 'job-conv-benefits': {
      const { benefits } = parseBenefits(text || JOB_CONV_BENEFITS_FALLBACK);
      return { ...base, benefits };
    }
    case 'job-conv-perks': {
      return { ...base, additionalPerks: parsePerks(text || JOB_CONV_PERKS_FALLBACK) };
    }
    case 'job-conv-dates': {
      const dates = parseDates(text || JOB_CONV_DATES_FALLBACK);
      return {
        ...base,
        deadlineDay: dates.deadlineDay,
        deadlineMonth: dates.deadlineMonth,
        deadlineYear: dates.deadlineYear,
      };
    }
    default:
      return base;
  }
};

/** Panel view-details rows from a JobPostForm-shaped draft. */
export const buildJobsPanelFields = (draft = {}) => {
  const d = { ...emptyJobPostForm(), ...draft };
  const industryLabel =
    INDUSTRY_OPTIONS.find((opt) => opt.value === d.industry)?.label || d.industry || '—';
  const salary =
    d.salaryMode === 'fixed' && d.salaryFixed
      ? `${d.currency === 'GHS' ? 'GHS' : d.currency} ${d.salaryFixed}/${d.salaryFrequency || 'month'}`
      : d.salaryMin || d.salaryMax
        ? `${d.currency === 'GHS' ? 'GHS' : d.currency} ${d.salaryMin || '—'}${d.salaryMax ? ` – ${d.salaryMax}` : ''}/${d.salaryFrequency || 'month'}`
        : '—';
  const list = (arr) => (arr || []).filter(Boolean).join('; ') || '—';
  const deadline =
    d.deadlineDay && d.deadlineMonth && d.deadlineYear
      ? `${d.deadlineDay}/${d.deadlineMonth}/${d.deadlineYear}`
      : '—';

  const rows = [
    d.jobTitle && { label: 'Job Title', value: d.jobTitle },
    d.companyName && { label: 'Company Name', value: d.companyName },
    d.industry && { label: 'Industry', value: industryLabel },
    d.department && { label: 'Department', value: d.department },
    d.description && { label: 'Job Description', value: d.description, kind: 'bio' },
    (d.qualifications || []).some(Boolean) && {
      label: 'Qualifications',
      value: list(d.qualifications),
      kind: 'bio',
    },
    (d.responsibilities || []).some(Boolean) && {
      label: 'Responsibilities',
      value: list(d.responsibilities),
      kind: 'bio',
    },
    d.jobType && { label: 'Job Type', value: d.jobType },
    d.experienceLevel && { label: 'Experience Level', value: d.experienceLevel },
    d.workLocation && { label: 'Location', value: d.workLocation },
    d.workArrangement && { label: 'Work Arrangement', value: d.workArrangement },
    salary !== '—' && { label: 'Salary', value: salary },
    (d.benefits || []).length > 0 && { label: 'Benefits', value: d.benefits.join(', ') },
    d.additionalPerks && { label: 'Additional Perks', value: d.additionalPerks },
    deadline !== '—' && { label: 'Application Deadline', value: deadline },
  ].filter(Boolean);

  return rows.length > 0 ? rows : null;
};
