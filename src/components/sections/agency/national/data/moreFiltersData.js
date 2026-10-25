/*
 * moreFiltersData.js — the "More filters" catalogue (Figma 11.4.6a, 8707:418322: "27 profile filters"). SAMPLE CONTENT ONLY.
 * Group names, filter counts and the labels of the first three groups are as drawn. ⚠️ ASSUMPTION: the other groups are drawn collapsed, so their
 * field names / options are the most conservative reading of the group name (one "Any" default); Gender and the five Theme 8 keys map to the URL.
 * `key` of a core field is the URL query key; extra fields live in the drawer's own state (not in the URL).
 */

const ANY = 'Any';

export const MORE_FILTER_GROUPS = [
  {
    id: 'location',
    label: 'Location',
    fields: [
      { key: 'region', label: 'Region', core: true },
      {
        key: 'district',
        label: 'District / city',
        options: ['Accra Metro', 'Tema Metro', 'Ga East', 'Kumasi Metro'],
      },
      { key: 'urban', label: 'Urban or rural', options: ['Urban', 'Rural'] },
    ],
  },
  {
    id: 'about',
    label: 'About them',
    fields: [
      {
        key: 'age',
        label: 'Age range',
        core: true,
        note: 'Ages 14–17 show as one total and can’t be combined with other filters.',
      },
      { key: 'gender', label: 'Gender', core: true },
      { key: 'disability', label: 'Disability status', locked: true },
    ],
  },
  {
    id: 'education',
    label: 'Education',
    fields: [
      { key: 'edu', label: 'Education level', core: true },
      {
        key: 'field',
        label: 'Field of study',
        options: ['Mechatronics', 'Computer science', 'Nursing', 'Agriculture'],
      },
      { key: 'institution', label: 'Institution type', options: ['Public', 'Private', 'TVET'] },
      { key: 'enrolled', label: 'Currently enrolled', options: ['Yes', 'No'] },
    ],
  },
  {
    id: 'experience',
    label: 'Experience',
    fields: [
      { key: 'xp1', label: 'Years of experience', options: ['0–1', '2–4', '5+'] },
      { key: 'xp2', label: 'Work type', options: ['Paid', 'Internship', 'Volunteer'] },
      { key: 'xp3', label: 'Currently working', options: ['Yes', 'No'] },
    ],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    fields: [
      { key: 'c1', label: 'Has a certificate', options: ['Yes', 'No'] },
      {
        key: 'c2',
        label: 'Certificate type',
        options: ['TVET certificate', 'Professional', 'Short course'],
      },
      { key: 'c3', label: 'Issued by', options: ['Institution', 'Employer', 'GTH'] },
      { key: 'c4', label: 'Verified', options: ['Verified', 'Self-reported'] },
    ],
  },
  {
    id: 'interests',
    label: 'Interests and goals',
    fields: [
      { key: 'interest', label: 'Interest', core: true },
      { key: 'g1', label: 'Goal', options: ['Job', 'Internship', 'Scholarship'] },
      { key: 'g2', label: 'Looking for', options: ['Training', 'Mentorship'] },
    ],
  },
  {
    id: 'personality',
    label: 'Personality and strengths',
    fields: [
      { key: 'p1', label: 'Personality type', options: ['Social', 'Realistic', 'Investigative'] },
      {
        key: 'p2',
        label: 'Strongest capability',
        options: ['Technical', 'Creative', 'Analytical'],
      },
    ],
  },
  {
    id: 'skills',
    label: 'Skills and readiness',
    fields: [
      { key: 's1', label: 'Skills held', options: ['Data analysis', 'Digital marketing'] },
      { key: 's2', label: 'Assessment taken', options: ['Yes', 'No'] },
      { key: 's3', label: 'Assessment score band', options: ['Below 50', '50–69', '70+'] },
      { key: 's4', label: 'Readiness level', options: ['Ready now', 'Almost ready', 'Building'] },
    ],
  },
  {
    id: 'programmes',
    label: 'Programmes and outcomes',
    fields: [
      { key: 'o1', label: 'In a programme', options: ['Yes', 'No'] },
      { key: 'o2', label: 'Placed', options: ['Yes', 'No'] },
      { key: 'o3', label: 'Programme', options: ['Youth in Digital Skills'] },
    ],
  },
];

export const MORE_FILTER_TOTAL = MORE_FILTER_GROUPS.reduce((n, g) => n + g.fields.length, 0);
export { ANY };
