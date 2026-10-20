import { useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { loadTalentHome, peekTalentHome } from '../../../services/talentHome.api.js';
import { placeholderFromStoredUser } from './talentHomeState.js';

const log = debug('useTalentShellLive');

/*
 * useTalentShellLive(enabled) - the signed-in talent's own /home data for the talent shell
 * (nav name, bell count, sidebar card) on pages whose state hook doesn't carry it (jobs, skills
 * lab, streak, profile, learning, notifications...). Before this those pages drew the Figma demo
 * person ("Kofi A.", bell 5, "Getting started 1 of 5") while the account menu showed the real user.
 *
 * Uses this tab's cached /home data when there is one (no extra requests), otherwise loads it once.
 * Until it arrives it returns the stored user's name with no numbers (`placeholder: true`), never
 * the demo person. Returns null when disabled (demo / logged out / the page supplies its own data).
 */
export const useTalentShellLive = (enabled) => {
  const [data, setData] = useState(() => (enabled ? (peekTalentHome()?.data ?? null) : null));

  useEffect(() => {
    if (!enabled) return undefined;
    const cached = peekTalentHome()?.data;
    if (cached) {
      setData(cached);
      return undefined;
    }
    let alive = true;
    loadTalentHome({
      onUpdate: (next) => {
        if (alive) setData(next);
      },
    })
      .then((next) => {
        if (alive) setData(next);
      })
      .catch((err) => log.error('shell data failed:', err?.code || err?.message));
    return () => {
      alive = false;
    };
  }, [enabled]);

  if (!enabled) return null;
  return data || placeholderFromStoredUser();
};
