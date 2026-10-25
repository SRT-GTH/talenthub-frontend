import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AgencyChecklistCard from '../../components/sections/agency/home/AgencyChecklistCard.jsx';
import AgencyFeatureCards from '../../components/sections/agency/home/AgencyFeatureCards.jsx';
import AgencyQuickActions from '../../components/sections/agency/home/AgencyQuickActions.jsx';
import InstitutionButton from '../../components/sections/institution/InstitutionButton.jsx';
import InstitutionFrame from '../../components/sections/institution/InstitutionFrame.jsx';
import InstitutionPageHero from '../../components/sections/institution/InstitutionPageHero.jsx';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import { useInstitutionSession } from '../../components/sections/institution/useInstitutionSession.js';
import InstitutionHomeMobile from '../../components/sections/institution/home/InstitutionHomeMobile.jsx';
import InstitutionNextStepCard from '../../components/sections/institution/home/InstitutionNextStepCard.jsx';
import InstitutionReadinessCard from '../../components/sections/institution/home/InstitutionReadinessCard.jsx';
import InstitutionStudentTable from '../../components/sections/institution/home/InstitutionStudentTable.jsx';
import InstitutionTermCard from '../../components/sections/institution/home/InstitutionTermCard.jsx';
import {
  FIRST_LOGIN,
  FIRST_LOGIN_OVERLAY,
  GLANCE,
  HOME_HERO,
  QUICK_ACTIONS,
} from '../../components/sections/institution/home/data/institutionHomeData.js';
import InstitutionWelcome from '../../components/sections/institution/welcome/InstitutionWelcome.jsx';
import { useIsDesktop } from '../../hooks/useMediaQuery.js';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionHomePage');

/*
 * InstitutionHomePage — /institution (Figma 11.2.1a default 8585:9 · 11.2.1b new institution 8588:479 · 11.2.1c mobile 8588:960; welcome modal 11.1.3a 8744:428914, tour 11.1.3b-d
 * 8744:429486 / 430003 / 430559, drawn over the first-login body by <InstitutionWelcome>, package A). Focused style only.
 * URL states (keys: institutionState.js):
 *   /institution                   default home: hero · quick actions · student readiness · This term + Next step · students table · "This term at a glance"   (11.2.1a)
 *   /institution?state=new         first login: "Get set up" checklist + locked "Get more from GTH" cards, zeros in the chrome                                  (11.2.1b)
 *   /institution?modal=welcome     the "Akwaaba" modal over the first-login body (chrome at 64 %, 847 · 23 · 312)                                              (11.1.3a)
 *   /institution?tour=1|2|3        the 3-step spotlight tour over the same body                                                                                (11.1.3b-d)
 *   /institution?modal=profile     the profile menu (11.6.0a, mounted by InstitutionFrame) over the default home
 * Below lg the chrome is the phone bar and the body is the phone home (11.2.1c).
 * The gates (accreditation in review / needs more info / not approved, ?verify=...) are the status screens 11.1.2b-e: while the institution is not approved the home redirects there
 * (⚠️ ASSUMPTION, same as the agency MoU gate; the status page is where the Figma draws the gate).
 * ⚠️ ASSUMPTION: the hero "Customise" button has no destination drawn: it logs the intent only.
 */

const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

// The roster total drawn by the default home (term card + table footer), whatever the chrome counts say.
const ROSTER_TOTAL = 847;

const InstitutionHomePage = () => {
  const data = useInstitutionState();
  const session = useInstitutionSession();
  const isDesktop = useIsDesktop();
  const { admin, institution, stats, counts } = session;
  const approved = session.verify.approved;
  const overlay = data.modal === 'welcome' || Boolean(data.tour);
  const firstLogin = data.state === 'new' || overlay;

  useEffect(() => {
    log('mount', {
      approved,
      firstLogin,
      overlay,
      welcome: data.modal === 'welcome',
      tour: data.tour,
    });
  }, [approved, firstLogin, overlay, data.modal, data.tour]);

  if (!approved) {
    const status = session.verify.status;
    log('gate redirect', status);
    return (
      <Navigate
        to={
          status === 'none'
            ? '/institution/accreditation'
            : `/institution/accreditation/status?verify=${status}`
        }
        replace
      />
    );
  }

  const vars = {
    first: admin.firstName,
    institution: institution.short,
    students: stats.students,
    pending: stats.pending,
    credentials: stats.credentials,
    scholarships: counts.scholarshipsLive,
  };
  const heroDef = overlay
    ? HOME_HERO.firstLoginOverlay
    : firstLogin
      ? HOME_HERO.firstLogin
      : HOME_HERO.default;
  const actionSet = overlay
    ? QUICK_ACTIONS.firstLoginOverlay
    : firstLogin
      ? QUICK_ACTIONS.firstLogin
      : QUICK_ACTIONS.default;
  const actions = actionSet.map((a) => ({ ...a, meta: fill(a.meta, vars) }));
  const setup = overlay ? FIRST_LOGIN_OVERLAY : FIRST_LOGIN;

  return (
    <InstitutionFrame data={data} title="Home">
      {isDesktop ? (
        <>
          <InstitutionPageHero
            title={fill(heroDef.title, vars)}
            subtitle={fill(heroDef.subtitle, vars)}
            actions={
              <InstitutionButton onClick={() => log('customise')}>
                {heroDef.action}
              </InstitutionButton>
            }
            className={firstLogin ? '[&_h1]:text-[22px] [&_h1]:leading-[28px]' : undefined}
          />
          <AgencyQuickActions actions={actions} />
          {firstLogin ? (
            <>
              <AgencyChecklistCard {...setup.checklist} headingId="home-setup" />
              <AgencyFeatureCards {...setup.cards} dashed headingId="home-more" />
            </>
          ) : (
            <>
              <InstitutionReadinessCard />
              <div className="grid gap-[24px] xl:grid-cols-[minmax(0,878fr)_minmax(0,427fr)]">
                <InstitutionTermCard students={ROSTER_TOTAL} />
                <InstitutionNextStepCard pending={stats.pending} />
              </div>
              <InstitutionStudentTable students={ROSTER_TOTAL} />
              <AgencyFeatureCards {...GLANCE} headingId="home-glance" />
            </>
          )}
        </>
      ) : (
        <InstitutionHomeMobile firstName={admin.firstName} short={institution.short} />
      )}
      <InstitutionWelcome data={data} />
    </InstitutionFrame>
  );
};

export default InstitutionHomePage;
