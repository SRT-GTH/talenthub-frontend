/*
 * jobPostFormData.js — constants + copy for the Recruiter Career Buddy
 * Manual Creation job-post form (Figma 5132:70013–73286).
 *
 * Industry options were not designed as a dropdown list in Figma; these are
 * demo placeholders until product supplies the official set.
 */

export const JOB_POST_HEADLINE = {
  before: "Let's build your ",
  accent: 'job post.',
};

export const JOB_POST_SUBTITLE =
  'Fill in the details below — you can always switch to chat or file upload later if you change your mind.';

/** File-upload review modal — Figma 5132:75730. */
export const JOB_POST_UPLOAD_HEADLINE = {
  before: "Here's what we ",
  accent: 'found.',
};

export const JOB_POST_UPLOAD_SUBTITLE =
  'We pulled these details from your file — review and edit anything before posting.';

/** Conversation-with-AI review — distinct header when opening the shared form. */
export const JOB_POST_CONVERSATION_HEADLINE = {
  before: "Here's your draft ",
  accent: 'job post.',
};

export const JOB_POST_CONVERSATION_SUBTITLE =
  'We built these details from your chat — review and edit anything before posting.';

export const JOB_POST_AUTOSAVE = 'Your progress is saved automatically';

export const JOB_POST_CTA = 'Post Job';

/** File-upload prompt — Figma 5132:75224 (verbatim). */
export const JOB_FILE_UPLOAD_PROMPT =
  "Perfect! Upload your job description document, and I'll do the heavy lifting. 📤\n\nI'll automatically extract:\n- Job title\n- Job description and responsibilities  \n- Required qualifications and skills\n- Salary range (if included)\n- Application deadline\n- And more!\n\nNB: Accepted formats: PDF, Word (.doc, .docx), Text (.txt), Max file size:** 10 MB";

/** After extract — Figma 5132:75538 (verbatim). */
export const JOB_FILE_EXTRACTED_BOT =
  "Perfect! I'm processing your document now...\nDone! ✅ I've extracted the following information from your document. \nLet me show you what I found — please click the review button below.";

export const JOB_FILE_REVIEW_CTA = 'Review & Post Job';

export const JOB_DESCRIPTION_MAX = 500;

export const JOB_TYPE_OPTIONS = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Temporary',
  'Freelance/Project-based',
];

export const WORK_ARRANGEMENT_OPTIONS = ['On-site', 'Hybrid', 'Remote'];

export const EXPERIENCE_LEVEL_OPTIONS = [
  { value: '1-5', label: '1-5' },
  { value: '6-10', label: '6-10' },
  { value: '11-20', label: '11-20' },
  { value: '20+', label: '20+' },
];

/** Demo industry list — Figma has no designed option set (Select Industry only). */
export const INDUSTRY_OPTIONS = [
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'telecom', label: 'Telecommunications' },
  { value: 'oil-gas', label: 'Oil & Gas' },
  { value: 'ngo', label: 'NGO / Development' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'other', label: 'Other' },
];

export const CURRENCY_OPTIONS = [
  { value: 'GHS', label: 'GH₵' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
];

export const SALARY_FREQUENCY_OPTIONS = [
  { value: 'month', label: '/Month' },
  { value: 'year', label: '/Year' },
  { value: 'week', label: '/Week' },
];

export const BENEFIT_OPTIONS = [
  'Health Insurance',
  'Pension/Retirement Plan',
  'Performance Bonuses',
  'Paid Time Off',
  'Professional Development',
  'Flexible Working Hours',
  'Transport Allowance',
  'Meal Allowance',
];

export const MONTH_OPTIONS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export const JOB_POST_PLACEHOLDERS = {
  jobTitle: 'e.g. Senior Software Engineer',
  companyName: 'e.g. Silver Rock Technology',
  department: 'e.g. Engineering, Sales, HR',
  description: 'Describe the role, team, and what success looks like in this position...',
  qualification: 'e.g. "Bachelor\'s in Marketing"',
  responsibility: 'e.g. "Develop marketing strategies"',
  workLocation: 'e.g. Tema community 22 or Accra',
  additionalPerks: 'Describe other benefits your company offers',
};

export const CONFIRM_JOB_POST = {
  title: 'Confirm Job Posting',
  body: "You're about to allow our AI to post this job publicly using the information provided. Please confirm that all details are accurate before continuing.",
  confirm: 'Confirm & Post Job',
  edit: 'Go back and edit',
};

export const JOB_POSTED_SUCCESS_TOAST = {
  title: 'Success',
  body: 'Job posted successfully',
};

/** Figma 5132:73166 — verbatim success bot copy. */
export const JOB_POSTED_SUCCESS_BOT =
  '🎉 Awesome—congratulations on publishing your first job post!\nNow let’s walk you through how to track applications. You can monitor all candidate activity in two simple ways:\n📊 Dashboard\nGo to the Applications section on your dashboard to view, manage, and review all incoming applications in one place.\n🤖 AI Progress Planner Panel\nOn the right-hand panel, locate the Application Pipeline. Open it to see the different stages of your hiring process and track candidate progress in real time.';

export const JOB_MANUAL_PROMPT_BOT =
  'Prefer to fill everything yourself?\u2028 👇 Click here to manually fill the job details';

export const emptyJobPostForm = () => ({
  jobTitle: '',
  companyName: '',
  industry: '',
  department: '',
  description: '',
  qualifications: ['', ''],
  responsibilities: ['', ''],
  jobType: 'Full-time',
  experienceLevel: '',
  workLocation: '',
  workArrangement: 'On-site',
  salaryMode: 'range',
  currency: 'GHS',
  salaryMin: '',
  salaryMax: '',
  salaryFixed: '',
  salaryFrequency: 'month',
  benefits: [],
  additionalPerks: '',
  deadlineDay: '',
  deadlineMonth: '',
  deadlineYear: '',
});

/**
 * Demo extract seeded into the form after a successful file attach
 * (Figma 5132:75730 field values).
 */
export const seedJobPostFromUpload = () => ({
  ...emptyJobPostForm(),
  jobTitle: 'Marketing Manager',
  companyName: 'Silver Rock Technologies',
  industry: 'technology',
  department: 'Sales',
  description:
    'We are seeking an experienced Marketing Manager to lead our marketing efforts and drive brand growth. The ideal candidate will have a proven track record in developing and executing successful marketing strategies across',
  qualifications: ["Bachelor's in Marketing", '3+ years experience', 'Strong communication skills'],
  responsibilities: [
    'Develop marketing strategies',
    'Manage social media campaigns',
    'Analyze market trends',
  ],
  jobType: 'Full-time',
  experienceLevel: '1-5',
  workLocation: '10 Jungle Road, East Legon, Accra, Ghana',
  workArrangement: 'On-site',
  salaryMode: 'range',
  currency: 'GHS',
  salaryMin: '8000',
  salaryMax: '12000',
  salaryFrequency: 'month',
  benefits: [
    'Health Insurance',
    'Pension/Retirement Plan',
    'Performance Bonuses',
    'Paid Time Off',
    'Professional Development',
    'Flexible Working Hours',
    'Transport Allowance',
    'Meal Allowance',
  ],
  additionalPerks: '',
  deadlineDay: '31',
  deadlineMonth: '12',
  deadlineYear: '2026',
});
