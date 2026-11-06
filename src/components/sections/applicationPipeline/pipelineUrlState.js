import { debug } from '../../../utils/debug.js';

const log = debug('pipelineUrlState');

/*
 * pipelineUrlState.js — the query-string contract of /recruiter/application-pipeline.
 * Every Figma frame of "RECRUITER - APPLICATION PIPELINE" (section 7249:79016) is
 * a URL; clicking in the UI writes the same keys, so reload / deep link / back work.
 *
 *   key           values                                        notes
 *   ------------  --------------------------------------------  -------------------------------
 *   modal         schedule-interview | cancel-interview |       schedule modal; the two others are
 *                 schedule-confirmation                         the confirmation dialogs shown over
 *                                                               the page (modal hidden behind them)
 *   state         empty (default) | filled                      schedule modal content
 *   format        online | phone | in-person                    with state=filled: the filled frame
 *   interviewers  open                                          "Add Interviewers" row expanded
 *   dropdown      job-posting                                   Choose Job Posting list open
 *   forceHover    none | senior-ux-designer | devops-engineer   pins the #f6f6f6 row hover (+ real :hover)
 *                 | data-analyst-intern
 *   posting       same slugs as above (default senior-ux-designer)  selected posting (demo)
 *   sidebar       collapsed                                      the state frames are drawn with the
 *                                                               sidebar collapsed (7249:79474 onwards)
 *
 * Frames:
 *   7249:79017 Pipeline                     /recruiter/application-pipeline
 *   7249:79474 Job Posting Dropdown Hover   ?sidebar=collapsed&dropdown=job-posting&forceHover=senior-ux-designer
 *   7249:79940 Schedule - Empty             ?sidebar=collapsed&modal=schedule-interview
 *   7249:80546 Schedule - Empty, interviewer ?sidebar=collapsed&modal=schedule-interview&interviewers=open
 *   7249:81163 Schedule - Filled, Online    ?sidebar=collapsed&modal=schedule-interview&state=filled&format=online
 *   7249:82719 Schedule - Filled, In person ?sidebar=collapsed&modal=schedule-interview&state=filled&format=in-person
 *   7249:83356 Schedule - Filled, Phone     ?sidebar=collapsed&modal=schedule-interview&state=filled&format=phone
 *   7249:81797 Cancel Interview Confirmation  ?sidebar=collapsed&modal=cancel-interview
 *   7249:82258 Schedule Interview Confirmation ?sidebar=collapsed&modal=schedule-confirmation
 */
export const PIPELINE_URL_KEYS = {
  modal: 'modal',
  state: 'state',
  format: 'format',
  interviewers: 'interviewers',
  dropdown: 'dropdown',
  forceHover: 'forceHover',
  posting: 'posting',
  sidebar: 'sidebar',
};

export const SCHEDULE_MODAL_VALUES = [
  'schedule-interview',
  'cancel-interview',
  'schedule-confirmation',
];
const SCHEDULE_FORMATS = ['online', 'phone', 'in-person'];

export const readPipelineUrlState = (searchParams) => {
  const get = (key) => searchParams.get(PIPELINE_URL_KEYS[key]);
  const format = get('format');
  const state = {
    modal: get('modal'),
    scheduleState: get('state') === 'filled' ? 'filled' : 'empty',
    scheduleFormat: SCHEDULE_FORMATS.includes(format) ? format : null,
    interviewersOpen: get('interviewers') === 'open',
    dropdownOpen: get('dropdown') === 'job-posting',
    forceHover: get('forceHover'),
    posting: get('posting'),
    sidebarCollapsed: get('sidebar') === 'collapsed',
  };
  log('read', state);
  return state;
};
