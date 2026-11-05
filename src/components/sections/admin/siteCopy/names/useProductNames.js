import { useCallback } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useCopyKv } from '../useCopyKv.js';
import { formerNamesAfter } from './productNameRules.js';
import { publishNameLive, saveNameDraftLive, sendBackNameLive } from '../live/copyLive.js';
import { NAME_STAFF, PRODUCT_NAMES, SEED_DRAFT, SEED_REASON } from './productNamesData.js';

const log = debug('useProductNames');

/*
 * useProductNames — the shared mock "server" of the Product names flow (Platform Admin 7.8.6):
 *   list     `useCopyKv('product-names.list', PRODUCT_NAMES)` the LIVE names (what the name chips of the editor show)
 *   renames  `useCopyKv('product-names.renames', {})` { [nameId]: { draft: { name, short, plural }, status: 'draft' | 'published',
 *            reason, by, at, publishedBy?, publishedAt? } } — builder A reads this for the Content Editor home "Name draft" stat.
 * Actions: saveDraft (Content Editor, 7.8.6e) · sendBack (Super Admin, drops the draft) · publish (Super Admin, 7.8.6g-i) · seed (frame URLs).
 * ⚠️ ASSUMPTION: "Send back" removes the draft (the editor starts a new one); no backend yet.
 */

const todayAt = (h, m) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const useProductNames = () => {
  const [list, setList] = useCopyKv('product-names.list', PRODUCT_NAMES);
  const [renames, setRenames] = useCopyKv('product-names.renames', {});

  const saveDraft = useCallback(
    (id, draft, by) => {
      log('saveDraft', id, draft);
      setRenames((prev) => ({
        ...prev,
        [id]: { draft, status: 'draft', reason: '', by, at: new Date().toISOString() },
      }));
      saveNameDraftLive(id, draft);
    },
    [setRenames]
  );

  const sendBack = useCallback(
    (id) => {
      log('sendBack', id);
      setRenames((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      sendBackNameLive(id);
    },
    [setRenames]
  );

  const publish = useCallback(
    (id, draft, reason, publishedBy) => {
      log('publish', id, draft, { reason });
      setList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                name: draft.name,
                short: draft.short,
                plural: draft.plural,
                former: formerNamesAfter(item, draft),
                status: 'live',
              }
            : item
        )
      );
      setRenames((prev) => ({
        ...prev,
        [id]: {
          draft,
          status: 'published',
          reason,
          by: prev[id]?.by ?? publishedBy,
          at: prev[id]?.at ?? new Date().toISOString(),
          publishedBy,
          publishedAt: new Date().toISOString(),
        },
      }));
      publishNameLive(id, draft, reason);
    },
    [setList, setRenames]
  );

  /** Frame URLs: `none` = nothing renamed, `draft` = Ama's draft Career Buddy → Tali (14:40), `published` = renamed with the former names kept. */
  const seed = useCallback(
    (kind) => {
      log('seed', kind);
      const base = PRODUCT_NAMES;
      if (kind === 'draft') {
        setList(base);
        setRenames({
          'career-buddy': {
            draft: SEED_DRAFT,
            status: 'draft',
            reason: '',
            by: NAME_STAFF.editor,
            at: todayAt(14, 40),
          },
        });
      } else if (kind === 'published') {
        setList(
          base.map((item) =>
            item.id === 'career-buddy'
              ? {
                  ...item,
                  name: 'Tali',
                  short: 'Tali',
                  plural: '',
                  former: ['Career Buddy', 'Buddy'],
                }
              : item
          )
        );
        setRenames({
          'career-buddy': {
            draft: SEED_DRAFT,
            status: 'published',
            reason: SEED_REASON,
            by: NAME_STAFF.editor,
            at: todayAt(14, 40),
            publishedBy: NAME_STAFF.superAdmin,
            publishedAt: new Date().toISOString(),
          },
        });
      } else {
        setList(base);
        setRenames({});
      }
    },
    [setList, setRenames]
  );

  return { list, renames, saveDraft, sendBack, publish, seed };
};
