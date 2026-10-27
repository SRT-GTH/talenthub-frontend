import { useCallback, useEffect, useRef, useState } from 'react';
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
  HOME_HERO,
  QUICK_ACTIONS,
  glanceFor,
} from '../../components/sections/institution/home/data/institutionHomeData.js';
import InstitutionWelcome from '../../components/sections/institution/welcome/InstitutionWelcome.jsx';
import { useIsDesktop } from '../../hooks/useMediaQuery.js';
import {
  apiMessage,
  institutionHome,
  institutionWelcomeSeen,
} from '../../services/institutionPortal.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionHomePage');

/*
 * InstitutionHomePage — /institution (Figma 11.2.1a default 8585:9 · 11.2.1b new institution 8588:479 · 11.2.1c mobile 8588:960; welcome modal 11.1.3a, tour 11.1.3b-d).
 * Live:
 *   GET /institution/me (session)    greeting, institution name, accreditation gate, hero counts
 *   GET /institution/home            readiness by programme, roster stats, next step, recent students, the "at a glance" cards
 *   POST /institution/home/welcome-seen   the first time an approved staff member opens the home, the welcome modal opens once and is marked seen
 * The first-login body (checklist + locked cards) shows while the roster is empty (or ?state=new); its "Add your students" step ticks itself once students exist.
 * While the institution is not approved the home redirects to the accreditation page or its status page.
 * ⚠️ ASSUMPTION: the hero "Customise" button has no destination drawn: it is left out.
 */

const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

const liveChecklist = (def, total) => {
  const items = def.items.map((it) =>
    it.id === 'students' && total > 0
      ? {
          id: it.id,
          title: it.title,
          sub: `${total} on the roster`,
          state: 'done',
          trailing: 'Done',
        }
      : it.id === 'staff' && it.state !== 'done'
        ? {
            ...it,
            trailing: undefined,
            action: { label: 'Invite', to: '/institution/settings/staff' },
          }
        : it
  );
  const done = items.filter((i) => i.state === 'done').length;
  return {
    ...def,
    items,
    badge: `${done} of ${items.length}${done > 1 ? ' · nice start!' : ''}`,
    pct: Math.round((done / items.length) * 100),
  };
};

const InstitutionHomePage = () => {
  const data = useInstitutionState();
  const session = useInstitutionSession();
  const isDesktop = useIsDesktop();
  const { admin, institution, stats, counts } = session;
  const approved = session.verify.approved;
  const [home, setHome] = useState(null);
  const [error, setError] = useState('');
  const welcomed = useRef(false);

  const load = useCallback(async () => {
    setError('');
    try {
      setHome(await institutionHome());
    } catch (err) {
      setError(apiMessage(err));
    }
  }, []);

  useEffect(() => {
    if (approved) load();
  }, [approved, load]);

  // First visit after approval: open the welcome once and remember it on the server.
  useEffect(() => {
    if (!approved || welcomed.current || admin.welcomeSeen !== false || data.modal || data.tour)
      return;
    welcomed.current = true;
    log('first visit: welcome');
    data.update({ modal: 'welcome' });
    institutionWelcomeSeen().catch((err) => log('welcome-seen failed', apiMessage(err)));
  }, [approved, admin.welcomeSeen, data]);

  if (!approved) {
    const status = session.verify.status;
    log('gate redirect', status);
    return (
      <Navigate
        to={status === 'none' ? '/institution/accreditation' : '/institution/accreditation/status'}
        replace
      />
    );
  }

  const overlay = data.modal === 'welcome' || Boolean(data.tour);
  const firstLogin = data.state === 'new' || overlay || (home !== null && home.total === 0);
  const vars = {
    first: admin.firstName,
    institution: institution.short || institution.name,
    students: home?.total ?? stats.students,
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
  const checklist = liveChecklist(setup.checklist, home?.total ?? 0);

  return (
    <InstitutionFrame data={data} title="Home">
      {error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-solid border-[#ebc2bd] bg-[#f9ebea] px-[16px] py-[12px] font-sans text-[14px] text-[#902b20]"
        >
          <span>Could not load your students: {error}</span>
          <InstitutionButton size="md" onClick={load}>
            Try again
          </InstitutionButton>
        </div>
      ) : null}
      {isDesktop ? (
        <>
          <InstitutionPageHero
            title={fill(heroDef.title, vars)}
            subtitle={fill(heroDef.subtitle, vars)}
            className={firstLogin ? '[&_h1]:text-[22px] [&_h1]:leading-[28px]' : undefined}
          />
          <AgencyQuickActions actions={actions} />
          {firstLogin ? (
            <>
              <AgencyChecklistCard {...checklist} headingId="home-setup" />
              <AgencyFeatureCards {...setup.cards} dashed headingId="home-more" />
            </>
          ) : (
            <>
              <InstitutionReadinessCard home={home} />
              <div className="grid gap-[24px] xl:grid-cols-[minmax(0,878fr)_minmax(0,427fr)]">
                <InstitutionTermCard home={home} />
                <InstitutionNextStepCard home={home} />
              </div>
              <InstitutionStudentTable home={home} />
              <AgencyFeatureCards
                {...glanceFor(home, institution.short || institution.name)}
                headingId="home-glance"
              />
            </>
          )}
        </>
      ) : (
        <InstitutionHomeMobile session={session} home={home} />
      )}
      <InstitutionWelcome data={data} />
    </InstitutionFrame>
  );
};

export default InstitutionHomePage;
