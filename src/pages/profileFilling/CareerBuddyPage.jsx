import { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import CareerBuddySection from '../../components/sections/profileFilling/CareerBuddySection.jsx';
import { useCareerBuddyRole } from '../../hooks/useCareerBuddyRole.js';

const CareerBuddyLiveSection = lazy(
  () => import('../../components/sections/profileFilling/CareerBuddyLiveSection.jsx')
);

/**
 * Talent Career Buddy runs LIVE (V2 agent) when VITE_CAREER_BUDDY_LIVE=1 or
 * the URL has ?live=1 (?live=0 forces the scripted demo back). Recruiter and
 * parent stay on the scripted demo - the agent only serves talents today.
 *
 * Remount the scripted shell when DemoNavigator flips talent / recruiter /
 * parent so chat + panel state never briefly renders the previous role's
 * stages (undefined stage.Icon crashes TalentProfilePanel).
 */
const LIVE_BY_DEFAULT = import.meta.env.VITE_CAREER_BUDDY_LIVE === '1';

export default function CareerBuddyPage() {
  const { role } = useCareerBuddyRole();
  const [params] = useSearchParams();
  const flag = params.get('live');
  const live = role === 'talent' && (flag === '1' || (LIVE_BY_DEFAULT && flag !== '0'));
  if (live) {
    return (
      <Suspense fallback={null}>
        <CareerBuddyLiveSection />
      </Suspense>
    );
  }
  return <CareerBuddySection key={role} />;
}
