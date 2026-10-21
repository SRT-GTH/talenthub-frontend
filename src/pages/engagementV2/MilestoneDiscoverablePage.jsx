import JourneyHub from '../../components/sections/engagementV2/journey/JourneyHub.jsx';

/* Engagement revamp: journey hub (Figma J-01 to J-07). All behaviour lives in JourneyHub; this page only sets URL defaults. */
const DEFAULTS = { done: 3, milestone: 1 };

const MilestoneDiscoverablePage = () => <JourneyHub defaults={DEFAULTS} />;

export default MilestoneDiscoverablePage;
