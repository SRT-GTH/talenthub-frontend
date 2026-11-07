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
 * NEW BOARD (page "Recruiter - Application Pipeline" 10172:10101; the legacy board above is kept for `sidebar=collapsed`, live data and `handoff`):
 *   stage=<stageId>        filter chip (applied|screening|shortlisted|interview|offer-extended|hired|not-progressed), default all   PL-01
 *   qualified=1            "Show qualified only (46)" on
 *   q=<text>               search in this pipeline
 *   menu=<cardId>          card "..." menu open (menuItem=<item> pins the row hover)                                                PL-02  ?menu=ama-boateng&menuItem=move-shortlisted
 *   selected=<id,id,…>     bulk selection, shows the "N selected" bar                                                               PL-06
 *   drag=<ghostId>&over=<stageId>   card in flight over a dashed drop column                                                        PL-04  ?drag=nana-kwarteng&over=shortlisted
 *   justMoved=<ghostId>    copy of a card just moved ("2m in stage")                                                                PL-06
 *   scroll=end             board scrolled to Hired / Not progressed                                                                 PL-01b
 *   moved=<cardId>:<stageId>,…   cards already moved (written by menu / drop; applied with moveCard)
 *   scenario=<key>         board preset from actions/pipelineActionScenarios.js (ACTIONS agent)
 *   selectionBar=hidden    hide the "N selected" bar while cards stay ticked (also hidden automatically while any dialog except modal=bulk-move is open)
 *   pipeline=empty         brand-new posting, every stage empty                                                                     PL-15
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
  // New board design (Figma page "Recruiter - Application Pipeline", frames PL-01 … PL-16)
  stage: 'stage',
  qualified: 'qualified',
  q: 'q',
  menu: 'menu',
  menuItem: 'menuItem',
  selected: 'selected',
  drag: 'drag',
  over: 'over',
  justMoved: 'justMoved',
  scroll: 'scroll',
  moved: 'moved',
  scenario: 'scenario',
  pipeline: 'pipeline',
  selectionBar: 'selectionBar',
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
    stage: get('stage'),
    qualifiedOnly: get('qualified') === '1',
    query: get('q') ?? '',
    menu: get('menu'),
    menuItem: get('menuItem'),
    selected: (get('selected') ?? '').split(',').filter(Boolean),
    drag: get('drag'),
    over: get('over'),
    justMoved: get('justMoved'),
    scrollEnd: get('scroll') === 'end',
    moved: (get('moved') ?? '')
      .split(',')
      .filter(Boolean)
      .map((pair) => pair.split(':')),
    scenario: get('scenario'),
    pipelineEmpty: get('pipeline') === 'empty',
    selectionBarHidden: get('selectionBar') === 'hidden',
  };
  log('read', state);
  return state;
};
