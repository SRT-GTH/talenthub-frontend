import { Navigate, useLocation } from 'react-router-dom';

/*
 * AgencyDistrictsPage — the "Districts" nav item has no frame of its own; Figma 11.4.2b "District breakdown" is the page the item stands for
 * (the rail highlights Districts there). ⚠️ ASSUMPTION: /agency/districts opens that page (Accra Metro, the drawn district), keeping the query.
 */
const AgencyDistrictsPage = () => {
  const { search } = useLocation();
  return <Navigate to={`/agency/regions/greater-accra/districts/accra-metro${search}`} replace />;
};

export default AgencyDistrictsPage;
