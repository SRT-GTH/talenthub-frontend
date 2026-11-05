import { Navigate, useLocation, useParams } from 'react-router-dom';

/*
 * ParentWardTabRedirect — /parent/wards/:wardId/profile and /flags -> /parent/wards/:wardId?tab=profile | flags. The Flags and corrections canvas first shipped those two paths; the tabs now live on the one
 * ward page (ParentWardPage). Every other query param (modal, field, flag, note, toast…) is kept, so the frame URLs documented in wiki/parent-flags.md still work.
 * Props: tab ('profile' | 'flags').
 */
const ParentWardTabRedirect = ({ tab }) => {
  const { wardId } = useParams();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  params.set('tab', tab);
  return <Navigate to={`/parent/wards/${wardId}?${params}`} replace />;
};

export default ParentWardTabRedirect;
