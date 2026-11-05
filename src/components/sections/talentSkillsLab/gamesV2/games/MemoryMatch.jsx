import MemoryMatchGame from '../memoryMatch/MemoryMatchGame.jsx';
import { MEMORY_COPY } from '../memoryMatch/memoryMatchData.js';
import { memoryMatchResultProgress } from '../memoryMatch/memoryMatchResultProgress.js';

/*
 * Games v2 "Memory Match" (GV-04 … GV-08, result strip of GV-10 / GV-11): the game lives in memoryMatch/MemoryMatchGame.jsx. This file only
 * registers it for GameV2Page (GAMES_V2 + GAMES_V2_META).
 */

export const GAMES_V2 = { 'memory-match': MemoryMatchGame };

export const GAMES_V2_META = {
  'memory-match': {
    name: MEMORY_COPY.name,
    subtitleLead: 'Working memory · 4×4 cards',
    /* a getter so the strip follows the run that was just finished (GameV2Page reads it on every render) */
    get resultProgress() {
      return memoryMatchResultProgress();
    },
  },
};
