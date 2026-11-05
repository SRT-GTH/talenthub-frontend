import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { agoText, circleApi } from '../../../../services/circle.api.js';

const log = debug('useLiveCircle');

/*
 * useLiveCircle — My circle for a signed-in talent (backend circle.service). Same blocks the mock draws
 * (circleData.js), from the API:
 *   discover     { audience: 'adult' | 'minor', empty, suggestions: { title, note, topPickId, items }, minor? }
 *   received     [{ id, requestId, ago, note }]      sent  [{ id, requestId, ago }]
 *   connections  { total, items: [{ id, connected, region, muted }] }
 *   people       { [id]: card }   every person any block mentions, in the shape the cards read
 *   statusFor(id, base)           the relation after the talent's own actions on this screen
 * Actions resolve with the server's answer and reload what changed; callers show the toasts.
 */
export const useLiveCircle = ({ enabled }) => {
  const [state, setState] = useState({ status: enabled ? 'loading' : 'off' });
  const [overrides, setOverrides] = useState({}); // personId -> status after an action here
  const [requestIds, setRequestIds] = useState({}); // personId -> sent request id (for Undo)
  const [accepted, setAccepted] = useState([]); // ids accepted on this screen (row shows "In your circle")
  const [searchHits, setSearchHits] = useState(null);
  const alive = useRef(true);

  const reload = useCallback(async () => {
    if (!enabled) return;
    try {
      const [discover, invitations, connections, summary] = await Promise.all([
        circleApi.discover(),
        circleApi.invitations(),
        circleApi.connections(0),
        circleApi.summary(),
      ]);
      if (!alive.current) return;
      setState({ status: 'ready', discover, invitations, connections, summary });
    } catch (err) {
      log.error('load failed', err?.response?.status || err?.message);
      if (alive.current) setState((s) => ({ ...s, status: 'error' }));
    }
  }, [enabled]);

  useEffect(() => {
    alive.current = true;
    reload();
    return () => {
      alive.current = false;
    };
  }, [reload]);

  const people = useMemo(() => {
    const out = {};
    const add = (card) => {
      if (card?.id) out[card.id] = { ...out[card.id], ...card };
    };
    state.discover?.suggestions?.items?.forEach(add);
    state.discover?.invitationsPreview?.items?.forEach(add);
    state.invitations?.received?.forEach(add);
    state.invitations?.sent?.forEach(add);
    state.connections?.items?.forEach(add);
    searchHits?.forEach(add);
    return out;
  }, [state, searchHits]);

  const received = useMemo(
    () =>
      (state.invitations?.received || []).map((r) => ({
        id: r.id,
        requestId: r.requestId,
        ago: agoText(r.sentAt),
        note: r.note ? `“${r.note}”` : null,
      })),
    [state.invitations]
  );
  const sent = useMemo(
    () =>
      (state.invitations?.sent || []).map((r) => ({
        id: r.id,
        requestId: r.requestId,
        ago: `sent ${agoText(r.sentAt)}`,
      })),
    [state.invitations]
  );
  const connections = useMemo(
    () => ({
      total: state.connections?.total ?? 0,
      items: (state.connections?.items || []).map((c) => ({
        id: c.id,
        connected: `Connected ${agoText(c.connectedAt)}`,
        region: c.region || '',
        muted: c.muted,
      })),
    }),
    [state.connections]
  );

  const statusFor = useCallback((id, base = 'none') => overrides[id] ?? base, [overrides]);
  const mark = (id, status) => setOverrides((o) => ({ ...o, [id]: status }));

  const actions = {
    linkUp: async (person, note) => {
      const out = await circleApi.linkUp(person.id, note);
      mark(person.id, out?.status === 'accepted' ? 'connected' : 'pending-sent');
      if (out?.requestId) setRequestIds((r) => ({ ...r, [person.id]: out.requestId }));
      if (out?.status === 'accepted') reload();
      return out;
    },
    undoLinkUp: async (person) => {
      const id = requestIds[person.id];
      if (id) await circleApi.withdraw(id);
      mark(person.id, 'none');
      reload();
    },
    withdraw: async (row) => {
      await circleApi.withdraw(row.requestId);
      mark(row.id, 'none');
      reload();
    },
    accept: async (row) => {
      await circleApi.respond(row.requestId, 'accept');
      setAccepted((a) => [...a, row.id]);
      mark(row.id, 'connected');
      reload();
    },
    ignore: async (row) => {
      await circleApi.respond(row.requestId, 'ignore');
      reload();
    },
    dismiss: async (person) => {
      await circleApi.dismiss(person.id);
      reload();
    },
    remove: async (person) => {
      await circleApi.remove(person.id);
      mark(person.id, 'none');
      reload();
    },
    toggleMute: async (person, muted) => {
      await (muted ? circleApi.unmute(person.id) : circleApi.mute(person.id));
      reload();
    },
    block: async (person) => {
      await circleApi.block(person.id);
      mark(person.id, 'none');
      reload();
    },
    report: (person, reason) => circleApi.report(person.id, reason),
    search: async (q) => {
      if (!q || q.trim().length < 2) {
        setSearchHits(null);
        return;
      }
      const out = await circleApi.search(q.trim());
      if (alive.current) setSearchHits(out?.items || []);
    },
  };

  return {
    enabled,
    status: state.status,
    discover: state.discover,
    summary: state.summary,
    minor: state.discover?.audience === 'minor',
    // "Start your circle" only when there is nothing yet: no connections, no invitations either way.
    empty: Boolean(state.discover?.empty) && received.length === 0 && sent.length === 0,
    received,
    sent,
    accepted,
    connections,
    people,
    searchHits,
    statusFor,
    reload,
    actions,
  };
};
