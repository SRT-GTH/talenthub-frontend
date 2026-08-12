/**
 * Career Buddy voice personas — Figma 5146:76230 / 76269.
 * Tagline for Sol corrected from Figma typo "Savvy ad relaxed" → "and"
 * per product confirmation 2026-08-12.
 */
export const CAREER_BUDDY_VOICES = [
  {
    id: 'sol',
    name: 'Sol',
    callLabel: 'SOL',
    tagline: 'Savvy and relaxed',
  },
  {
    id: 'bruce',
    name: 'Bruce',
    callLabel: 'BRUCE',
    tagline: 'Calm and affirming',
  },
  {
    id: 'tali',
    name: 'Tali',
    callLabel: 'TALI',
    tagline: 'Jovial and cheerful',
  },
];

export const DEFAULT_VOICE_ID = 'tali';

export function getVoiceById(id) {
  return CAREER_BUDDY_VOICES.find((v) => v.id === id) ?? CAREER_BUDDY_VOICES[2];
}

export function cycleVoiceId(currentId, direction) {
  const idx = CAREER_BUDDY_VOICES.findIndex((v) => v.id === currentId);
  const safe = idx < 0 ? 2 : idx;
  const next =
    direction === 'prev'
      ? (safe - 1 + CAREER_BUDDY_VOICES.length) % CAREER_BUDDY_VOICES.length
      : (safe + 1) % CAREER_BUDDY_VOICES.length;
  return CAREER_BUDDY_VOICES[next].id;
}
