/*
 * rosterPronouns — the pronoun forms the roster dialogs use ("He’s removed ...", "move with him", "his WASSCE mock record"). Figma draws them for he/him students (Yaw, Kofi); the other
 * forms are the same sentences with the student's own pronouns, and "they" for a student added without a recorded pronoun (⚠️ ASSUMPTION).
 * pronounsOf(student) → { subj, subjIs, obj, poss, possAbs, drops }
 */
const SETS = {
  he: { subj: 'He', subjIs: 'He’s', obj: 'him', poss: 'his', possAbs: 'his', drops: 'drops' },
  she: { subj: 'She', subjIs: 'She’s', obj: 'her', poss: 'her', possAbs: 'hers', drops: 'drops' },
  they: {
    subj: 'They',
    subjIs: 'They’re',
    obj: 'them',
    poss: 'their',
    possAbs: 'theirs',
    drops: 'drop',
  },
};

export const pronounsOf = (student) => SETS[student?.pronoun] ?? SETS.they;
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
