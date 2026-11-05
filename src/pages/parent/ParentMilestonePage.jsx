import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import MilestoneShared from '../../components/sections/parent/notifications/MilestoneShared.jsx';

/*
 * ParentMilestonePage — /parent/notifications/milestone, Figma canvas 10057:67396 frames PN-03 10043:913 ("Abena wanted you to see this") and PN-03b 10056:156668 (`?toast=sent`, "Sent to Abena").
 * ⚠️ ASSUMPTION: the path is ours (Figma draws no URL); the sidebar keeps Notifications active because the page is reached from a notification.
 */
const ParentMilestonePage = () => (
  <ParentFrame active="notifications">
    <MilestoneShared />
  </ParentFrame>
);

export default ParentMilestonePage;
