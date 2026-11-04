import { debug } from '../../../../../utils/debug.js';
import { adminError, getStaff } from '../../../../../services/admin.api.js';
import {
  copyBlockHistory,
  discardCopyDraft,
  getCopyBlock,
  listCopyBlocks,
  listCopyTerms,
  publishCopyBlock,
  publishTerms,
  restoreCopyBlock,
  saveCopyDraft,
  saveTermDraft,
  syncCopyManifest,
} from '../../../../../services/siteCopy.api.js';
import { readCopyKv, writeCopyKv } from '../useCopyKv.js';
import { PRODUCT_NAMES } from '../names/productNamesData.js';
import { copyManifest, manifestField } from './copyManifest.js';
import {
  NAME_TERMS,
  fromBackendValue,
  toBackendValue,
  toCopyKey,
  toFieldPath,
  whenLabel,
} from './copyFormat.js';

const log = debug('copyLive');

/*
 * copyLive — the Site copy screens on the real backend (/api/admin/copy). The screens keep reading and writing the shared store
 * of useCopyKv (same keys and shapes as before); this module fills those keys from the backend and sends each change back:
 *
 *   site-copy.published            ← GET /blocks (+ GET /blocks/:key for every edited section)
 *   site-copy.drafts               ← the same; editor typing → PUT /blocks/:key/draft (per field, batched per section)
 *   publish / discard dialogs      → POST /blocks/:key/publish | discard (after the section's pending saves)
 *   site-copy.history.<id>         ← GET /blocks/:key/history; Restore → POST /blocks/:key/restore
 *   product-names.list / renames   ← GET /terms; Save draft / Send back → PUT /terms/:key/draft; Publish → POST /terms/publish
 *
 * Versions: the screens number the original text as version 1, the backend numbers the first publish as version 1, so a screen
 * version is the backend version + 1. Restoring version 1 (the original) saves every field back to its original and publishes.
 * Live mode is on for a real staff session (no `?role=` mock override) unless VITE_SITE_COPY_LIVE=off; frame URLs (`?f=`) never
 * use the store, so they stay as drawn. Errors go out as a `gth:copy-live` window event that CopyLiveSync shows.
 */

const EVENT = 'gth:copy-live';
const state = {
  live: false,
  session: null,
  permissions: [],
  versions: {}, // copyKey → backend version
  pending: {}, // copyKey → { [path]: value }
  timers: {},
  chains: {}, // copyKey → promise of the last save
  names: {}, // staff id → display name
  hydrated: null,
};

export const liveEnabled = () => import.meta.env.VITE_SITE_COPY_LIVE !== 'off';
export const isCopyLive = () => state.live;
export const copyLivePermissions = () => state.permissions;

const emit = (detail) => {
  try {
    window.dispatchEvent(new CustomEvent(EVENT, { detail }));
  } catch {
    /* no window */
  }
};
export const COPY_LIVE_EVENT = EVENT;

const fail = (err, what) => {
  const message = adminError(err, `Couldn't ${what}. Try again.`);
  log('error', what, message);
  emit({ type: 'error', message: `Couldn't ${what}: ${message}` });
  return message;
};

/** Turn live mode on (true) or off for this staff session. */
export const setCopyLive = (on, session) => {
  state.live = Boolean(on) && liveEnabled();
  state.session = session ?? null;
  if (!state.live) state.hydrated = null;
  log('live', state.live);
};

/* ----------------------------------------------------------------- people */

const staffName = async (id) => {
  if (!id) return 'Staff member';
  const me = state.session;
  if (me && String(me.entityId || '') === String(id)) return me.staff?.name ?? 'You';
  if (state.names[id]) return state.names[id];
  try {
    const s = await getStaff(id);
    const u = s?.user ?? s;
    const name =
      u?.metadata?.displayName ||
      [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim() ||
      u?.username ||
      'Staff member';
    state.names[id] = name;
  } catch {
    state.names[id] = 'Staff member';
  }
  return state.names[id];
};

/* ---------------------------------------------------------------- blocks */

const sectionOf = (key) => copyManifest().byKey[key];

/** Screen values of one backend block: { published: { key: v }, draft: { key: { draft } } | null }. */
const screenValues = (block) => {
  const meta = sectionOf(block.key);
  const published = {};
  const draft = {};
  (block.fields ?? []).forEach((bf) => {
    const f = manifestField(block.key, bf.path);
    if (!f) return;
    if (bf.published !== null && bf.published !== undefined) {
      published[f.key] = fromBackendValue(f, bf.published);
    }
    if (bf.draft !== undefined) {
      draft[f.key] = {
        draft: bf.draft === null ? (f.original ?? '') : fromBackendValue(f, bf.draft),
      };
    }
  });
  return { sectionId: meta?.sectionId, published, draft };
};

const applyBlock = (block) => {
  const { sectionId, published, draft } = screenValues(block);
  if (!sectionId) return;
  state.versions[block.key] = block.version ?? 0;
  const pub = { ...readCopyKv('site-copy.published', {}) };
  if (Object.keys(published).length) pub[sectionId] = published;
  else delete pub[sectionId];
  const drafts = { ...readCopyKv('site-copy.drafts', {}) };
  if (Object.keys(draft).length) {
    drafts[sectionId] = {
      fields: draft,
      savedAt: block.draftAt ? Date.parse(block.draftAt) : Date.now(),
    };
  } else delete drafts[sectionId];
  writeCopyKv('site-copy.published', pub);
  writeCopyKv('site-copy.drafts', drafts);
};

const refreshBlock = async (key) => {
  const b = await getCopyBlock(key);
  applyBlock(b);
  return b;
};

/**
 * Fill the store from the backend. A super admin also registers sections the backend doesn't know yet (manifest sync,
 * never retiring anything); other roles see a message for sections that aren't editable yet.
 */
export const hydrateCopy = async ({ force = false } = {}) => {
  if (!state.live) return null;
  if (state.hydrated && !force) return state.hydrated;
  state.hydrated = (async () => {
    const manifest = copyManifest();
    let res = await listCopyBlocks();
    state.permissions = res.permissions ?? [];
    const counts = Object.fromEntries((res.blocks ?? []).map((b) => [b.key, b.fieldCount]));
    // Missing sections, or sections whose field list changed in this build.
    const missing = manifest.blocks.filter((b) => counts[b.key] !== b.fields.length);
    if (missing.length && state.permissions.includes('copy.publishTerms')) {
      const r = await syncCopyManifest(manifest.blocks);
      log('manifest synced', r);
      res = await listCopyBlocks();
    } else if (missing.length) {
      log('sections not on the backend yet', missing.length);
    }
    const rows = res.blocks ?? [];
    rows.forEach((r) => {
      state.versions[r.key] = r.version ?? 0;
    });
    const edited = rows.filter((r) => r.editedFields > 0 || r.draftChanges > 0);
    const blocks = await Promise.all(edited.map((r) => getCopyBlock(r.key)));
    const pub = {};
    const drafts = {};
    blocks.forEach((b) => {
      const { sectionId, published, draft } = screenValues(b);
      if (!sectionId) return;
      if (Object.keys(published).length) pub[sectionId] = published;
      if (Object.keys(draft).length) {
        drafts[sectionId] = { fields: draft, savedAt: b.draftAt ? Date.parse(b.draftAt) : 0 };
      }
    });
    writeCopyKv('site-copy.published', pub);
    writeCopyKv('site-copy.drafts', drafts);
    log('hydrated', { sections: rows.length, edited: edited.length });
    return { sections: rows.length, edited: edited.length, permissions: state.permissions };
  })().catch((e) => {
    state.hydrated = null;
    fail(e, 'load the site copy');
    throw e;
  });
  return state.hydrated;
};

/* ---------------------------------------------------------------- drafts */

const runSave = (key) => {
  const fields = state.pending[key];
  delete state.pending[key];
  if (!fields || !Object.keys(fields).length) return state.chains[key] ?? Promise.resolve();
  const prev = state.chains[key] ?? Promise.resolve();
  state.chains[key] = prev
    .catch(() => undefined)
    .then(() => saveCopyDraft(key, fields))
    .then((b) => {
      log('draft saved', key, Object.keys(fields));
      return b;
    })
    .catch((e) => {
      fail(e, 'save the draft');
      return refreshBlock(key).catch(() => undefined);
    });
  return state.chains[key];
};

/**
 * The editor saved a field (its own 500 ms debounce already ran). `value` equal to the original goes as null (back to default);
 * the backend drops a draft field equal to what is live.
 */
export const saveDraftField = (sectionId, field, value) => {
  if (!state.live) return;
  const key = toCopyKey(sectionId);
  const same = value === (field.original ?? '');
  state.pending[key] = {
    ...(state.pending[key] ?? {}),
    [toFieldPath(field.key)]: same ? null : toBackendValue(field, value),
  };
  window.clearTimeout(state.timers[key]);
  state.timers[key] = window.setTimeout(() => runSave(key), 150);
};

/** Wait for the section's pending saves (before publish / discard). */
export const flushSection = (sectionId) => {
  const key = toCopyKey(sectionId);
  window.clearTimeout(state.timers[key]);
  return runSave(key);
};

/* ------------------------------------------------------- publish / discard */

/** The publish dialog's change set went live locally; send it. Resolves to { versions: { sectionId: screenVersion } }. */
export const publishLive = async (changes, reason) => {
  if (!state.live) return null;
  const versions = {};
  for (const c of changes) {
    const key = toCopyKey(c.sectionId);
    try {
      await flushSection(c.sectionId);
      const b = await publishCopyBlock(key, reason);
      versions[c.sectionId] = (b?.version ?? state.versions[key] ?? 0) + 1;
      await refreshBlock(key);
      await loadHistory(c.sectionId);
    } catch (e) {
      fail(e, `publish ${c.label ?? c.sectionId}`);
      await refreshBlock(key).catch(() => undefined);
    }
  }
  emit({ type: 'saved', message: 'Published' });
  return { versions };
};

export const discardLive = async (changes) => {
  if (!state.live) return;
  for (const c of changes) {
    const key = toCopyKey(c.sectionId);
    try {
      await flushSection(c.sectionId);
      await discardCopyDraft(key);
      await refreshBlock(key);
    } catch (e) {
      fail(e, `discard ${c.label ?? c.sectionId}`);
    }
  }
};

/* ---------------------------------------------------------------- history */

const historyKey = (sectionId) => `site-copy.history.${sectionId}`;

/** Backend versions → the screens' history list (oldest first, version 1 = the original). */
export const loadHistory = async (sectionId) => {
  if (!state.live) return null;
  const key = toCopyKey(sectionId);
  const meta = sectionOf(key);
  if (!meta) return null;
  try {
    const res = await copyBlockHistory(key);
    state.versions[key] = res.current ?? state.versions[key] ?? 0;
    const original = Object.fromEntries(meta.fields.map((f) => [f.key, f.original ?? '']));
    const list = [
      {
        version: 1,
        who: null,
        when: 'Original from the design',
        why: 'Original text',
        original: true,
        fields: Object.fromEntries(
          Object.entries(original).map(([k, v]) => [k, { before: null, after: v }])
        ),
      },
    ];
    let before = original;
    const rows = [...(res.versions ?? [])].sort((a, b) => a.version - b.version);
    for (const v of rows) {
      const now = { ...original };
      Object.entries(v.published ?? {}).forEach(([path, value]) => {
        const f = manifestField(key, path);
        if (f) now[f.key] = fromBackendValue(f, value);
      });
      const fields = {};
      Object.keys(now).forEach((k) => {
        if (now[k] !== before[k]) fields[k] = { before: before[k] ?? null, after: now[k] };
      });
      list.push({
        version: v.version + 1,
        who: await staffName(v.by),
        when: whenLabel(v.at),
        why: v.reason ?? '',
        ...(v.restoredFrom ? { restoredFrom: v.restoredFrom + 1 } : {}),
        fields,
      });
      before = now;
    }
    writeCopyKv(historyKey(sectionId), list);
    return list;
  } catch (e) {
    fail(e, 'load the history');
    return null;
  }
};

/** Make screen version `from` live again (a new version). */
export const restoreLive = async (sectionId, from, reason) => {
  if (!state.live) return;
  const key = toCopyKey(sectionId);
  try {
    if (from <= 1) {
      const meta = sectionOf(key);
      await flushSection(sectionId);
      await saveCopyDraft(key, Object.fromEntries(meta.fields.map((f) => [f.path, null])));
      await publishCopyBlock(key, reason);
    } else {
      await restoreCopyBlock(key, from - 1, reason);
    }
  } catch (e) {
    fail(e, 'restore that version');
  }
  await refreshBlock(key).catch(() => undefined);
  await loadHistory(sectionId);
};

/* ----------------------------------------------------------- product names */

/** Terms → `product-names.list` (live names) and `product-names.renames` (saved drafts). */
export const hydrateNames = async () => {
  if (!state.live) return null;
  try {
    const res = await listCopyTerms();
    const terms = Object.fromEntries((res.terms ?? []).map((t) => [t.key, t]));
    const list = PRODUCT_NAMES.map((item) => {
      const t = terms[NAME_TERMS[item.id]];
      if (!t) return item;
      return {
        ...item,
        name: t.forms?.name ?? item.name,
        short: t.forms?.short ?? '',
        plural: t.forms?.plural ?? '',
        former: t.formerNames ?? [],
      };
    });
    const renames = { ...readCopyKv('product-names.renames', {}) };
    PRODUCT_NAMES.forEach((item) => {
      const t = terms[NAME_TERMS[item.id]];
      if (t?.draft) {
        renames[item.id] = {
          ...(renames[item.id] ?? {}),
          draft: {
            name: t.draft.name ?? '',
            short: t.draft.short ?? '',
            plural: t.draft.plural ?? '',
          },
          status: 'draft',
          reason: '',
          by: renames[item.id]?.by ?? 'Staff member',
          at: renames[item.id]?.at ?? new Date().toISOString(),
        };
      } else if (renames[item.id]?.status === 'draft') delete renames[item.id];
    });
    writeCopyKv('product-names.list', list);
    writeCopyKv('product-names.renames', renames);
    return { list, renames };
  } catch (e) {
    fail(e, 'load the product names');
    return null;
  }
};

const formsOf = (draft) =>
  Object.fromEntries(
    Object.entries({ name: draft?.name, short: draft?.short, plural: draft?.plural }).filter(
      ([, v]) => v !== undefined && v !== null && String(v).trim() !== ''
    )
  );

export const saveNameDraftLive = async (id, draft) => {
  if (!state.live) return;
  try {
    await saveTermDraft(NAME_TERMS[id], formsOf(draft));
  } catch (e) {
    fail(e, 'save the name draft');
    await hydrateNames();
  }
};

/** Send back: the draft goes (saving the live forms clears the backend draft). */
export const sendBackNameLive = async (id) => {
  if (!state.live) return;
  const item = readCopyKv('product-names.list', PRODUCT_NAMES).find((x) => x.id === id);
  try {
    await saveTermDraft(NAME_TERMS[id], formsOf(item));
  } catch (e) {
    fail(e, 'send the draft back');
  }
  await hydrateNames();
};

/** Publish a rename. The backend publishes every saved name draft together. */
export const publishNameLive = async (id, draft, reason) => {
  if (!state.live) return;
  try {
    await saveTermDraft(NAME_TERMS[id], formsOf(draft));
    await publishTerms(reason);
    emit({ type: 'saved', message: 'Name published' });
  } catch (e) {
    fail(e, 'publish the name');
  }
  await hydrateNames();
};
