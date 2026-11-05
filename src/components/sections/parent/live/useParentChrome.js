import { useMemo } from 'react';
import emma from '../../../../assets/parent/emma.webp';
import { PARENT, SIDEBAR_STATES } from '../data/parentCoreData.js';
import { useParentMe } from './parentLive.js';
import { initialsAvatar, parentChrome, sidebarState } from './parentLiveView.js';

const BLANK_PHOTO = initialsAvatar(' ', '#eef1ee', '#eef1ee');

const EMPTY_SIDEBAR = {
  role: '',
  done: 0,
  doneText: '',
  note: '',
  stats: SIDEBAR_STATES.none.stats.map((s) => ({ ...s, value: '–' })),
  badges: {},
};

/*
 * useParentChrome(stateKey) — what the sidebar, the collapsed rail and the top bar show.
 * Demo: the mock persona and SIDEBAR_STATES[stateKey] (the frame's state, as before).
 * Live: the signed-in parent and their real counts (stateKey is ignored); dashes while the first load runs.
 */
const useParentChrome = (stateKey = 'linked') => {
  const me = useParentMe();
  return useMemo(() => {
    if (!me.live) {
      return {
        live: false,
        parent: { ...PARENT, photo: emma },
        sidebar: SIDEBAR_STATES[stateKey] || SIDEBAR_STATES.linked,
      };
    }
    if (!me.data) {
      return {
        live: true,
        loading: me.status !== 'error',
        parent: { name: '', short: '', verified: false, photo: BLANK_PHOTO },
        sidebar: EMPTY_SIDEBAR,
      };
    }
    return { live: true, parent: parentChrome(me.data), sidebar: sidebarState(me.data) };
  }, [me.live, me.data, me.status, stateKey]);
};

export default useParentChrome;
