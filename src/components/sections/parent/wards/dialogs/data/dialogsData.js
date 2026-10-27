/*
 * dialogsData — copy of the ward dialogs and toasts, built from a ward { id, firstName, name, pronoun: 'her' | 'him' }.
 * Figma: PW-14 "Who can find Abena" 10049:2185, PW-14b toast 10056:530, PW-15 "Unlink Elliot" 10078:23842, PW-15b toast 10078:25861 (each frame draws one ward; the other ward's copy is the same sentence with its own pronouns).
 * ⚠️ ASSUMPTION: pronoun forms are derived from ward.pronoun ('her' -> she/her/hers, 'him' -> he/him/his).
 * ⚠️ ASSUMPTION: the "visible to verified partners" toast (saving the recommended option) is not drawn; its wording is mine.
 */

export const DEFAULT_VISIBILITY = 'partners';

const forms = (ward) => {
  const her = ward?.pronoun === 'her';
  return {
    subject: her ? 'She' : 'He',
    object: her ? 'her' : 'him',
    possessive: her ? 'her' : 'his',
    possessiveCap: her ? 'Her' : 'His',
  };
};

export const visibilityCopy = (ward) => {
  const p = forms(ward);
  return {
    title: `Who can find ${ward.firstName}`,
    body: `Under-18s are only shown to verified partners for learning, volunteering and unpaid internships. You can hide ${p.object} completely.`,
    options: [
      {
        value: 'partners',
        label: 'Verified partners only',
        hint: 'Recommended · schools, NGOs and approved internship hosts',
      },
      {
        value: 'hidden',
        label: 'Hidden from search',
        hint: `Nobody can find ${p.object}. ${p.subject} can still learn and apply to volunteer roles.`,
      },
    ],
    cancel: 'Cancel',
    save: 'Save',
  };
};

export const unlinkCopy = (ward) => {
  const p = forms(ward);
  return {
    title: `Unlink ${ward.firstName} from your account?`,
    body: `Use this if ${ward.firstName} was linked by mistake, or you’re no longer ${p.possessive} parent or guardian. To pause ${p.possessive} access instead, use Opt out.`,
    rows: [
      {
        title: `${ward.firstName} keeps ${p.possessive} account`,
        text: `${p.possessiveCap} profile, skills and Cycles stay ${p.possessive}.`,
      },
      {
        title: `You stop seeing ${p.possessive} activity`,
        text: `Open flags, evaluations and payment requests for ${ward.firstName} are cancelled.`,
      },
      {
        title: `${ward.firstName} is told`,
        text: `We let ${p.object} know, and ask ${p.object} to add another parent or guardian.`,
      },
    ],
    reasonLabel: 'Why are you unlinking?',
    reasonDefault: 'Linked by mistake',
    reasonHint: 'Only GTH’s safety team sees this.',
    cancel: 'Cancel',
    confirm: `Unlink ${ward.firstName}`,
  };
};

/* Toast content for ParentToast: { message, detail, actionLabel }. */
export const visibilityToast = (ward, value) => {
  const p = forms(ward);
  if (value === 'hidden') {
    return {
      message: `${ward.firstName} is now hidden from search`,
      detail: `${p.subject} can still learn and volunteer. ${p.subject}’s been told about the change.`,
      actionLabel: 'Undo',
    };
  }
  return {
    message: `${ward.firstName} is visible to verified partners`,
    detail: `${p.subject}’s been told about the change.`,
    actionLabel: 'Undo',
  };
};

export const unlinkToast = (ward) => {
  const p = forms(ward);
  return {
    message: `${ward.firstName} is no longer linked`,
    detail: `${p.subject}’s been told. Undo within 10 minutes.`,
    actionLabel: 'Undo',
  };
};
