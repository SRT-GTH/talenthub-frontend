import { useSearchParams } from 'react-router-dom';
import RecruiterHomeSection from '../../components/sections/recruiterHome/RecruiterHomeSection.jsx';
import RecruiterDashboardSection from '../../components/sections/recruiterDashboard/RecruiterDashboardSection.jsx';

/*
 * /recruiter/home — the recruiter dashboard (Figma "Recruiter - Dashboard" 10005:38660). `?view=setup` keeps the earlier "Let's get you ready" home
 * (Figma 7249:73882, Talent file) reachable; see wiki/recruiter-dashboard.md.
 */
export default function RecruiterHomePage() {
  const [params] = useSearchParams();
  return params.get('view') === 'setup' ? <RecruiterHomeSection /> : <RecruiterDashboardSection />;
}
