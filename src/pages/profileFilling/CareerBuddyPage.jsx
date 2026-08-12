import CareerBuddySection from '../../components/sections/profileFilling/CareerBuddySection.jsx';
import { useCareerBuddyRole } from '../../hooks/useCareerBuddyRole.js';

/**
 * Remount the shell when DemoNavigator flips talent / recruiter / parent so
 * chat + panel state never briefly renders the previous role's stages
 * (undefined stage.Icon crashes TalentProfilePanel).
 */
export default function CareerBuddyPage() {
  const { role } = useCareerBuddyRole();
  return <CareerBuddySection key={role} />;
}
