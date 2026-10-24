import { useEffect, useMemo } from 'react';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import PublicDataFrame from '../../components/sections/publicData/PublicDataFrame.jsx';
import {
  EXPLORE_CARDS,
  TRUST_ITEMS,
  buildStatCards,
  getLandingSummary,
} from '../../components/sections/publicData/landing/data/landingData.js';
import LandingExploreCards from '../../components/sections/publicData/landing/LandingExploreCards.jsx';
import LandingHero from '../../components/sections/publicData/landing/LandingHero.jsx';
import LandingStats from '../../components/sections/publicData/landing/LandingStats.jsx';
import LandingTrustStrip from '../../components/sections/publicData/landing/LandingTrustStrip.jsx';
import { useReturningVisitor } from '../../components/sections/publicData/landing/useReturningVisitor.js';
import PublicDataModals from '../../components/sections/publicData/share/PublicDataModals.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('PublicLandingPage');

/*
 * PublicLandingPage — Figma canvas 8477:209484: 8.1.1a Landing (default), 8.1.1b returning visitor (?state=returning), 8.1.1c stats fallback
 * (?state=fallback), 8.1.1a-m the phone landing. Hero, stats row, "Explore the data" cards, trust strip; "For partners / For recruiters" lead to
 * PARTNER_SIGN_IN_ROUTE. The numbers are the national ones of the overview (landing/data/landingData.js).
 * The phone frame draws no section tabs under the top bar, so they are hidden here (REQUEST: a hideMobileTabs prop on PublicDataFrame).
 */

const HIDE_PHONE_TABS = "max-md:[&_nav[aria-label='Sections']]:hidden";

const PublicLandingPage = () => {
  const data = usePublicDataState();
  const returning = useReturningVisitor(data.state);
  const summary = useMemo(() => getLandingSummary(), []);
  const cards = useMemo(() => buildStatCards(summary), [summary]);
  const fallback = data.state === 'fallback' && !data.modal;

  useEffect(() => {
    log('mount', { state: data.state, returning: Boolean(returning) });
  }, [data.state, returning]);

  return (
    <PublicDataFrame data={data} title="Home" active="home" className={HIDE_PHONE_TABS}>
      <div className="flex flex-col gap-[16px] px-[16px] pt-[20px] pb-[24px] md:gap-0 md:p-0">
        <LandingHero talents={summary.talents} returning={returning} />
        <LandingStats cards={cards} fallback={fallback} />
        <LandingExploreCards cards={EXPLORE_CARDS} />
        <LandingTrustStrip items={TRUST_ITEMS} />
      </div>
      <PublicDataModals data={data} scope={{ title: 'Ghana Talent Hub', reportKind: 'overview' }} />
    </PublicDataFrame>
  );
};

export default PublicLandingPage;
