import { useEffect, useState } from 'react';
import { getDistricts, getRegions } from '../services/location.api.js';

/**
 * Ghana regions and the districts of the chosen region, from GET /api/location/hierarchy
 * (falls back to the bundled list when offline). Values are canonical names ("Greater Accra",
 * "Accra Metropolitan"), so whatever a form saves groups correctly in reports.
 *
 *   const { regionNames, districtNames, regionOptions, districtOptions, loadingDistricts } = useAdminAreas(region);
 */
export const useAdminAreas = (region) => {
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  useEffect(() => {
    let live = true;
    getRegions().then((r) => live && setRegions(r));
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    let live = true;
    setDistricts([]);
    if (!region) return undefined;
    setLoadingDistricts(true);
    getDistricts(region)
      .then((d) => live && setDistricts(d))
      .finally(() => live && setLoadingDistricts(false));
    return () => {
      live = false;
    };
  }, [region]);

  return {
    regionNames: regions.map((r) => r.name),
    districtNames: districts.map((d) => d.name),
    // { value, label } with the plain name as label (forms that show "Region" in the field label).
    regionOptions: regions.map((r) => ({ value: r.name, label: r.name })),
    districtOptions: districts.map((d) => ({ value: d.name, label: d.name })),
    loadingDistricts,
  };
};

export default useAdminAreas;
