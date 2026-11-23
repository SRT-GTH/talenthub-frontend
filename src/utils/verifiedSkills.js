/*
 * One rule for "verified skills" everywhere (Home hero and sidebar, My Assessment, profile stats).
 *
 * User story US-5.1.2-02 (GTH_Highlighting_Batch1): a skill is VERIFIED when the talent earns the platform badge by
 * passing a platform assessment (>= 70 %). The engagement stories keep "Game-Evidenced" and "Conversationally
 * Validated" as separate, lower evidence labels, so they are not counted as verified. A skill counts once, however
 * many passing attempts it has (GET /engagement/skills/verifications/me returns one row per attempt).
 *
 * "Proven" (Skills Lab and games step) is broader: assessment- OR game-evidenced, still one per skill.
 */
const VERIFIED_STATUSES = new Set(['verified', 'assessment_verified']);
const PROVEN_STATUSES = new Set([...VERIFIED_STATUSES, 'game_evidenced', 'training_evidenced']);

const keyOf = (v) =>
  String(v?.skillKey || v?.skill || v?.name || '')
    .trim()
    .toLowerCase();

const distinct = (rows, statuses) => {
  const seen = new Set();
  for (const v of rows || []) {
    const status = String(v?.validationStatus || '').toLowerCase();
    const key = keyOf(v);
    if (key && statuses.has(status)) seen.add(key);
  }
  return seen;
};

/** True when this verification row is a platform-assessment pass (the "Verified" badge). */
export const isPlatformVerified = (v) =>
  VERIFIED_STATUSES.has(String(v?.validationStatus || '').toLowerCase());

/** Distinct skills with a platform-verified badge. */
export const countVerifiedSkills = (rows) => distinct(rows, VERIFIED_STATUSES).size;

/** Distinct skills proven by an assessment or a game. */
export const countProvenSkills = (rows) => distinct(rows, PROVEN_STATUSES).size;
