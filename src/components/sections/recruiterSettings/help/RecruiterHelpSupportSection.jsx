import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import useScopedRoundedFont from '../../../../hooks/useScopedRoundedFont.js';
import DashboardShell from '../../dashboard/DashboardShell.jsx';
import { renderWorkspaceSidebar } from '../../recruiterDashboard/renderWorkspaceSidebar.jsx';
import HelpSupportPage from '../../talentSettings/HelpSupportPage.jsx';
import RecruiterContactView from './RecruiterContactView.jsx';
import { useRecruiterHelpPanels } from './useRecruiterHelpPanels.jsx';
import { useRecruiterHelpState } from './useRecruiterHelpState.js';
import {
  RECRUITER_ARTICLE_DATA,
  RECRUITER_HS_CONTACTS,
  RECRUITER_HS_COPY,
  RECRUITER_HS_FAQ,
  RECRUITER_HS_SAFETY,
  RECRUITER_HS_SEARCH_PLACEHOLDER,
  RECRUITER_HS_TOPICS,
  recruiterRequests,
  searchRecruiterHelp,
} from './recruiterHelpData.js';

const log = debug('RecruiterHelpSupportSection');

/* The talent Help page's `data` prop for the recruiter copy (module constant: stable identity). */
const PAGE_DATA = {
  copy: RECRUITER_HS_COPY,
  searchPlaceholder: RECRUITER_HS_SEARCH_PLACEHOLDER,
  topics: RECRUITER_HS_TOPICS,
  faq: RECRUITER_HS_FAQ,
  safety: RECRUITER_HS_SAFETY,
  contacts: RECRUITER_HS_CONTACTS,
  search: searchRecruiterHelp,
  defaultQuery: { searching: 'fee', none: 'bulk reject' },
  article: RECRUITER_ARTICLE_DATA.article,
  report: RECRUITER_ARTICLE_DATA.report,
  concernLink: false,
};

/*
 * RecruiterHelpSupportSection - `/recruiter/help` (Figma R-HS-01 10161:87217, R-HP-04 10161:89124, R-HP-07 10161:89324, R-HP-05 10161:89558, R-HP-06 10161:89746):
 * the talent Help page (`talentSettings/HelpSupportPage`) with the recruiter data, inside the recruiter dashboard shell. The pop-over states (?help=page|searching|none|shortcuts)
 * open over it through the same top-bar "?" panels as the other recruiter pages. Views: (none) Help and support · article · report · contact · sent (see recruiterHelpData.js).
 * Wiki: recruiter-settings-help.md.
 */
const RecruiterHelpSupportSection = () => {
  useScopedRoundedFont('data-recruiter-ui', true);
  const state = useRecruiterHelpState();
  const panels = useRecruiterHelpPanels();
  useEffect(() => {
    log('mount', { help: state.help, q: state.q });
  }, [state.help, state.q]);

  return (
    <DashboardShell renderSidebar={renderWorkspaceSidebar} panels={panels}>
      <div className="w-full py-[32px] pr-[clamp(16px,3.24vw,56px)] pl-[clamp(16px,2.3vw,40px)] max-md:py-[12px]">
        <HelpSupportPage
          settings={state}
          data={PAGE_DATA}
          requests={recruiterRequests()}
          ContactView={RecruiterContactView}
        />
      </div>
    </DashboardShell>
  );
};

export default RecruiterHelpSupportSection;
