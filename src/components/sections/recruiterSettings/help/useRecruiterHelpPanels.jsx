import RecruiterHelpPopover from '../RecruiterHelpPopover.jsx';
import { useRecruiterHelpState } from './useRecruiterHelpState.js';
import { RECRUITER_HELP_PAGE_VALUES } from './recruiterHelpData.js';

/*
 * useRecruiterHelpPanels - the `DashboardShell panels` fields of the Help set for any recruiter page:
 *   const helpPanels = useRecruiterHelpPanels();
 *   <DashboardShell panels={helpPanels} ...>       (or `panels={{ ...otherPanels, ...helpPanels }}`)
 * Returns { onHelp, helpOpen ('open' | false), help }: the "?" button toggles `?help=page`, `help` is the pop-over / shortcuts modal / feedback + invite dialogs node.
 * It only reads and writes the `help`, `q` and `modal=feedback|invite` keys, so pages with their own query state keep it.
 */
export const useRecruiterHelpPanels = () => {
  const state = useRecruiterHelpState();
  const helpOpen = state.help !== '';
  // The ringed "?" is drawn while the pop-over / shortcuts modal is open, not on the Help-centre pages (article, report, contact, sent).
  const ringed = helpOpen && !RECRUITER_HELP_PAGE_VALUES.includes(state.help);
  return {
    onHelp: () => state.update({ help: helpOpen ? null : 'page', q: null }),
    helpOpen: ringed ? 'open' : false, // NavIconButton `active` takes 'open' (the ringed button of the frames)
    help: <RecruiterHelpPopover />,
  };
};
