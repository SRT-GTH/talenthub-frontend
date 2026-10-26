import api from './api.js';
import { DISTRICTS_BY_REGION, GHANA_REGIONS } from '../constants/ghanaDistricts.js';
import { debug } from '../utils/debug.js';

const log = debug('location.api');

/*
 * Administrative locations (backend: GET /api/location/hierarchy, public).
 *   country › region › district (MMDA) › town/city › area
 * Names are canonical: regions without the word "Region" ("Greater Accra"), districts with their
 * category ("Accra Metropolitan", "Ga Central Municipal", "Ada East"). Use these names when saving an
 * address so reports and stakeholder dashboards group the same place together.
 *
 * Results are cached for the page session. If the API can't be reached, regions and districts fall back
 * to the bundled list (constants/ghanaDistricts.js) so pickers never come up empty.
 */

const cache = new Map();
const cached = (key, fn) => {
  if (!cache.has(key)) {
    cache.set(
      key,
      fn().catch((err) => {
        cache.delete(key);
        throw err;
      })
    );
  }
  return cache.get(key);
};

const hierarchy = (params) =>
  api.get('/location/hierarchy', { params }).then((r) => r.data?.data ?? r.data);

/** [{ value, label, name }] for the 16 regions; label adds "Region". */
export const getRegions = (country = 'GH') =>
  cached(`regions:${country}`, async () => {
    try {
      const out = await hierarchy({ country, type: 'region' });
      if (!out?.items?.length) throw new Error('no regions');
      return out.items.map((r) => ({
        value: r.name,
        label: `${r.name} Region`,
        name: r.name,
        id: r.id,
      }));
    } catch (err) {
      log('regions fallback', err?.message);
      return GHANA_REGIONS.map((r) => ({ value: r, label: `${r} Region`, name: r }));
    }
  });

/** [{ value, label, name, capital, category }] for one region's districts. */
export const getDistricts = (region, country = 'GH') =>
  region
    ? cached(`districts:${country}:${region}`, async () => {
        try {
          const out = await hierarchy({ country, type: 'district', region });
          if (!out?.items?.length) throw new Error('no districts');
          return out.items.map((d) => ({
            value: d.name,
            label: d.name,
            name: d.name,
            id: d.id,
            capital: d.capital,
            category: d.category,
          }));
        } catch (err) {
          log('districts fallback', region, err?.message);
          return (DISTRICTS_BY_REGION[region] ?? []).map((d) => ({ value: d, label: d, name: d }));
        }
      })
    : Promise.resolve([]);

/** Known towns / cities in a district (suggestions; towns are free text). Includes the district capital. */
export const getTowns = (district, region, country = 'GH') =>
  district
    ? cached(`towns:${country}:${district}`, async () => {
        const names = new Set();
        try {
          const [cities, districts] = await Promise.all([
            hierarchy({ country, type: 'city', district }),
            getDistricts(region, country),
          ]);
          (cities?.items ?? []).forEach((c) => names.add(c.name));
          const d = districts.find((x) => x.name === district);
          if (d?.capital) names.add(d.capital);
        } catch (err) {
          log('towns', district, err?.message);
        }
        return [...names].sort((a, b) => a.localeCompare(b));
      })
    : Promise.resolve([]);
