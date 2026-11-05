import { useCopyKv } from '../useCopyKv.js';
import { FIELD_ASSET_SEED, findAsset } from './fieldsData.js';
import { debug } from '../../../../../utils/debug.js';

const log = debug('useFieldAssets');

/*
 * useFieldAssets — the media library the image field reads: `useCopyKv('media.assets', MEDIA_ASSETS)` where MEDIA_ASSETS is the seed list of builder F
 * (`siteCopy/media/mediaLibraryData.js`, picked up when the file exists) and this builder's FIELD_ASSET_SEED otherwise. The glob is optional so the
 * field works before / without that file. `lookup(id)` falls back to the field seed for ids the library does not hold.
 * Pass { persist: false } on frame URLs so they never depend on stored state.
 */
const FOUND = import.meta.glob('../media/mediaLibraryData.js', { eager: true });
const LIBRARY_SEED = Object.values(FOUND)[0]?.MEDIA_ASSETS;
const SEED = Array.isArray(LIBRARY_SEED) && LIBRARY_SEED.length ? LIBRARY_SEED : FIELD_ASSET_SEED;
log('library seed', { fromMediaLibrary: SEED !== FIELD_ASSET_SEED, count: SEED.length });

export const useFieldAssets = ({ persist = true } = {}) => {
  const [assets] = useCopyKv('media.assets', SEED, { persist });
  const list = Array.isArray(assets) ? assets : SEED;
  return { assets: list, lookup: (id) => findAsset(list, id) };
};
