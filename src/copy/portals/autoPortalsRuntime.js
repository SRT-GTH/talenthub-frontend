import { debug } from '../../utils/debug.js';
import { autoIds, autoSections } from '../autoCopy.js';
import { bindCopy } from '../copyBind.js';
import { getCopyState, subscribeCopy } from '../copyBundle.js';
import { AUTO_EXCLUDE, AUTO_PREVIEW, AUTO_ROOTS } from './autoPortalsConfig.js';

const log = debug('autoPortals');

/*
 * autoPortalsRuntime — on the pages: load only the portal data files that have published (or, in a preview, draft) text and bind
 * it (copyBind.js). Section ids come from the file paths, so nothing is loaded for files nobody edited.
 * Keep the globs equal to autoPortalsAdmin.js.
 */
const LOADERS = import.meta.glob([
  '../../components/sections/talent{Assessment,Community,Home,Jobs,Learning,Messages,Profile,Settings,SkillsLab,Streak,Wallet}/**/*{Data,data}.js',
  '../../components/sections/talent{Assessment,Community,Home,Jobs,Learning,Messages,Profile,Settings,SkillsLab,Streak,Wallet}/**/data/*.js',
  '../../components/sections/{parent,institution,agency}/**/*{Data,data}.js',
  '../../components/sections/{parent,institution,agency}/**/data/*.js',
]);

const IDS = autoIds(Object.keys(LOADERS), AUTO_ROOTS);
const loaded = new Set();

const bindEdited = async () => {
  const keys = Object.keys(getCopyState().blocks ?? {});
  if (!keys.length) return;
  const wanted = Object.entries(IDS)
    .filter(
      ([path, place]) =>
        !loaded.has(path) && keys.some((k) => k === place.key || k.startsWith(`${place.key}Part`))
    )
    .map(([path]) => path);
  if (!wanted.length) return;
  wanted.forEach((p) => loaded.add(p));
  const mods = Object.fromEntries(
    await Promise.all(wanted.map(async (p) => [p, await LOADERS[p]()]))
  );
  const sections = autoSections(mods, {
    roots: AUTO_ROOTS,
    exclude: AUTO_EXCLUDE,
    preview: AUTO_PREVIEW,
    ids: IDS,
  });
  bindCopy(...sections);
  log(
    'bound',
    sections.map((s) => s.id)
  );
};

let started = false;
/** Start once: bind edited data files now and whenever newly published copy arrives. */
export const startAutoCopy = () => {
  if (started || typeof window === 'undefined') return;
  started = true;
  bindEdited().catch((e) => log('bind failed', e?.message));
  subscribeCopy(() => bindEdited().catch((e) => log('bind failed', e?.message)));
};
