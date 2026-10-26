import { useEffect, useMemo, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { agencyHome, agencyWelcomeSeen } from '../../services/agency.api.js';
import { useAgencyResource } from '../../components/sections/agency/useAgencyResource.js';
import AgencyButton from '../../components/sections/agency/AgencyButton.jsx';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import AgencyPageHero from '../../components/sections/agency/AgencyPageHero.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import { useAgencySession } from '../../components/sections/agency/useAgencySession.js';
import AgencyChecklistCard from '../../components/sections/agency/home/AgencyChecklistCard.jsx';
import AgencyFeatureCards from '../../components/sections/agency/home/AgencyFeatureCards.jsx';
import AgencyHomeMobile from '../../components/sections/agency/home/AgencyHomeMobile.jsx';
import AgencyMonthCard from '../../components/sections/agency/home/AgencyMonthCard.jsx';
import AgencyNationalSnapshot from '../../components/sections/agency/home/AgencyNationalSnapshot.jsx';
import AgencyNextStepCard from '../../components/sections/agency/home/AgencyNextStepCard.jsx';
import AgencyPaginationBar from '../../components/sections/agency/home/AgencyPaginationBar.jsx';
import AgencyQuickActions from '../../components/sections/agency/home/AgencyQuickActions.jsx';
import AgencySavedQueriesTable from '../../components/sections/agency/home/AgencySavedQueriesTable.jsx';
import {
  HOME_HERO,
  LIMIT_CARDS,
  MOBILE_HOME,
  liveChecklist,
  liveMobile,
  liveQuickActions,
  liveUnlockCards,
  toHomeQueryRow,
} from '../../components/sections/agency/home/data/agencyHomeData.js';
import { FIRST_LOGIN } from '../../components/sections/agency/onboarding/data/agencyOnboardingData.js';
import AgencyTour from '../../components/sections/agency/onboarding/AgencyTour.jsx';
import AgencyWelcomeModal from '../../components/sections/agency/onboarding/AgencyWelcomeModal.jsx';
import { useIsDesktop } from '../../hooks/useMediaQuery.js';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyHomePage');

/*
 * AgencyHomePage — /agency (Figma 11.4.0a-d, welcome 11.4.1e, tour 11.4.1f-h). Package A.
 * URL states (see agencyState.js for the shared keys):
 *   /agency                       default home (hero · quick actions · national snapshot · This month · saved queries · MoU limits)
 *   /agency?state=first-login     first login: checklist "Get set up" + locked "Get more from GTH" cards      (11.4.0b)
 *   /agency?quota=92              quota nearly used: hero "You’ve used 92% …" + the 92 % limit card (11.4.0c, mock override of the session)
 *   /agency?modal=welcome         the "Akwaaba" modal over the first-login home                                  (11.4.1e)
 *   /agency?tour=1|2|3            the 3-step spotlight tour over the first-login home                            (11.4.1f-h)
 * Below lg the chrome is the phone bar and the body is the phone home (11.4.0d).
 * ⚠️ ASSUMPTION: while the MoU is not approved (?mou=none|pending|needs-info|not-approved) the home is the MoU status page (it is the gate), so this page redirects there.
 * Live: GET /agency/home (national snapshot, this month, next step, saved queries, quick-action counts, checklist). The first visit of an
 * analyst (no welcome seen yet) opens the welcome dialog once and shows the "Get set up" layout; closing it calls POST /agency/home/welcome-seen.
 * "Customise" opens the agency settings.
 */

const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

const AgencyHomePage = () => {
  const data = useAgencyState();
  const session = useAgencySession();
  const isDesktop = useIsDesktop();
  const { analyst, agency, quota, limits } = session;
  const approved = session.mou.approved;
  const home = useAgencyResource(agencyHome, []);
  const h = home.data;
  const firstLogin =
    data.state === 'first-login' ||
    data.modal === 'welcome' ||
    Boolean(data.tour) ||
    Boolean(h?.firstLogin);
  const overlay = data.modal === 'welcome' || Boolean(data.tour);
  const autoOpened = useRef(false);
  const { update } = data;

  // first visit: open the welcome dialog once (it is marked seen when closed)
  useEffect(() => {
    if (h?.firstLogin && !autoOpened.current && !data.modal && !data.tour) {
      autoOpened.current = true;
      update({ modal: 'welcome' }, { replace: true });
    }
  }, [h?.firstLogin, data.modal, data.tour, update]);

  const markSeen = () => {
    if (!h?.firstLogin) return;
    agencyWelcomeSeen()
      .then(() => home.reload())
      .catch((err) => log.error('welcome-seen failed', err?.message));
  };
  const rows = useMemo(() => (h?.savedQueries || []).map(toHomeQueryRow), [h]);

  useEffect(() => {
    log('mount', {
      approved,
      firstLogin,
      quota: quota.pct,
      welcome: data.modal === 'welcome',
      tour: data.tour,
    });
  }, [approved, firstLogin, quota.pct, data.modal, data.tour]);

  if (!approved) {
    const status = session.mou.status;
    return (
      <Navigate
        to={status === 'none' ? '/agency/mou' : `/agency/mou/status?mou=${status}`}
        replace
      />
    );
  }

  const vars = {
    first: analyst.firstName,
    agency: agency.name,
    pct: quota.pct,
    resets: quota.resets,
  };
  const subtitle = (def) =>
    def === HOME_HERO.default && h?.summary ? h.summary : fill(def.subtitle, vars);
  const heroDef = firstLogin
    ? HOME_HERO.firstLogin
    : quota.nearlyUsed
      ? HOME_HERO.quota
      : HOME_HERO.default;
  const quickActions = liveQuickActions(
    firstLogin ? (overlay ? 'firstLoginOverlay' : 'firstLogin') : 'default',
    h?.counts
  );

  const heroAction =
    quota.nearlyUsed && !firstLogin ? (
      <AgencyButton to="/agency/settings?tab=mou">{heroDef.action}</AgencyButton>
    ) : (
      <AgencyButton to="/agency/settings">{heroDef.action}</AgencyButton>
    );

  const limitRows = LIMIT_CARDS.map((c) => {
    const l = limits[c.id];
    const pct = c.id === 'queries' ? quota.pct : Math.floor((l.used / l.limit) * 100);
    const used = c.id === 'queries' ? quota.used : l.used;
    return {
      id: c.id,
      icon: c.icon,
      badge: 'MoU limit',
      title: c.title,
      text: fill(c.body, { used, limit: l.limit, resets: quota.resets }),
      progressLabel: `${pct}%`,
      fillPct: pct,
      foot: c.foot,
    };
  });

  return (
    <AgencyFrame data={data} title="Home">
      {isDesktop ? (
        <>
          <AgencyPageHero
            title={fill(heroDef.title, vars)}
            subtitle={subtitle(heroDef)}
            actions={heroAction}
            className={firstLogin ? '[&_h1]:text-[22px] [&_h1]:leading-[28px]' : undefined}
          />
          <AgencyQuickActions actions={quickActions} />
          {firstLogin ? (
            <>
              <AgencyChecklistCard
                {...liveChecklist(FIRST_LOGIN.checklist, h)}
                headingId="home-setup"
              />
              <AgencyFeatureCards
                {...liveUnlockCards(FIRST_LOGIN.cards, h)}
                dashed
                headingId="home-more"
              />
            </>
          ) : (
            <>
              <AgencyNationalSnapshot snapshot={h?.national} />
              <div className="grid gap-[24px] xl:grid-cols-[minmax(0,878fr)_minmax(0,427fr)]">
                <AgencyMonthCard
                  queriesRun={quota.used}
                  dataRequests={limits.dataRequests.used}
                  csvExports={limits.csvExports.used}
                />
                <AgencyNextStepCard step={h?.nextStep} />
              </div>
              <div className="flex flex-col gap-[8px]">
                <AgencySavedQueriesTable rows={rows} />
                {rows.length ? <AgencyPaginationBar total={rows.length} /> : null}
                {(h?.counts?.savedQueries || 0) > rows.length ? (
                  <Link
                    to="/agency/queries/saved"
                    className="self-end font-sans text-[15px] font-semibold text-[#387440]"
                  >
                    See all {h.counts.savedQueries} saved queries
                  </Link>
                ) : null}
              </div>
              <AgencyFeatureCards
                title="Your MoU this month"
                subtitle="Limits come from your MoU. Ask your GTH contact if you need more room."
                cards={limitRows}
                headingId="home-limits"
              />
            </>
          )}
        </>
      ) : (
        <AgencyHomeMobile
          firstName={analyst.firstName}
          short={agency.short}
          data={liveMobile(MOBILE_HOME, h, session)}
        />
      )}
      {data.modal === 'welcome' ? (
        <AgencyWelcomeModal
          firstName={analyst.firstName}
          agencyName={agency.name}
          onClose={() => {
            markSeen();
            data.update({ modal: null });
          }}
          onExtra={(panel) => {
            markSeen();
            data.update({ modal: panel });
          }}
          onTour={() => {
            markSeen();
            data.update({ modal: null, tour: 1 });
          }}
        />
      ) : null}
      {data.tour ? (
        <AgencyTour
          step={data.tour}
          onStep={(n) => data.update({ tour: n })}
          onClose={() => data.update({ tour: null })}
        />
      ) : null}
    </AgencyFrame>
  );
};

export default AgencyHomePage;
