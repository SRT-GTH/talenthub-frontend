import { debug } from '../../../../utils/debug.js';

const log = debug('closingSummary');

/*
 * closingSummary - turns the recruiter-onboarding provider data into ONE view
 * model for R08 (review) and R09 (done). Every field falls back to the Figma
 * demo value (Kwame Asante / MTN Ghana / Professional monthly / Visa 4081 /
 * Local + Entry,Mid + Technology,Finance) so any step opens directly.
 *
 * Readers are deliberately tolerant about the exact key names the sibling step
 * pages use (organisation.name | orgName | displayName ...), because those
 * slices are owned by other agents; see the notes file for the keys relied on.
 *
 * Figma: R08 7374:9838 / 10128, R09 7374:10419 / 10565 / 10711.
 */

const first = (obj, keys, fallback) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return fallback;
};

const SCOPE_LABEL = {
  local: 'Local (Ghana only)',
  international: 'International (Outside Ghana)',
  both: 'Both (Local + international)',
};

const TIER_LABEL = { free: 'Free', professional: 'Professional', pro: 'Professional' };

export const initialsOf = (name) =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || 'KA';

// Short brand mark for the Done hero ("MTN", "KL"): first word if short, else initials.
export const orgMark = (name) => {
  const w = String(name || '').split(/\s+/)[0] || '';
  return w.length > 0 && w.length <= 4 ? w.toUpperCase() : initialsOf(name);
};

export const buildSummary = (data = {}, { defaultAffiliation = 'pending' } = {}) => {
  const profile = data.profile || {};
  const org = data.organisation || {};
  const plan = data.plan || {};
  const pay = data.payment || {};
  const prefs = data.preferences || {};

  const fullName = first(profile, ['fullName', 'name'], 'Kwame Asante');
  const email = first(profile, ['email'], 'k.asante@mtn.com.gh');
  const phone = first(profile, ['phone'], '+233 24 ••• 4567');
  const type = data.recruiterType === 'freelance' ? 'Freelance' : 'Dedicated';

  const rawAffil = String(
    first(org, ['affiliation', 'affiliationStatus', 'status'], defaultAffiliation)
  );
  const affiliation = /admin|owner|creat/i.test(rawAffil)
    ? 'admin'
    : /active|approved/i.test(rawAffil)
      ? 'active'
      : 'pending';
  const isNewOrg = affiliation === 'admin';
  const orgName = first(
    org,
    ['name', 'orgName', 'displayName', 'organisationName'],
    isNewOrg ? 'Kente Labs Ghana' : 'MTN Ghana'
  );
  const orgLegal = first(org, ['legalName'], '');
  const primaryAdmin = first(org, ['primaryAdmin', 'adminName'], 'Ama Owusu');

  const tierKey = String(
    first(plan, ['tier', 'id', 'name'], isNewOrg ? 'free' : 'professional')
  ).toLowerCase();
  const tier = TIER_LABEL[tierKey] || tierKey.charAt(0).toUpperCase() + tierKey.slice(1);
  const billing = String(first(plan, ['billing', 'cycle'], 'monthly')).toLowerCase();
  const monthly = tierKey === 'free' ? 0 : Number(first(plan, ['price', 'amount'], 50));

  const brand = first(pay, ['brand'], 'Visa');
  const last4 = first(pay, ['last4'], '4081');

  const scope = SCOPE_LABEL[prefs.scope] || SCOPE_LABEL.local;
  const experience = prefs.experience?.length ? prefs.experience : ['Entry-level', 'Mid-level'];
  const industries = prefs.industries?.length ? prefs.industries : ['Technology', 'Finance'];

  const summary = {
    fullName,
    firstName: String(fullName).split(/\s+/)[0],
    email,
    phone,
    type,
    orgName,
    orgFull: orgLegal
      ? `${orgName} (${orgLegal})`
      : orgName === 'MTN Ghana'
        ? 'MTN Ghana (Scancom PLC)'
        : orgName,
    role: first(org, ['role', 'yourRole'], isNewOrg ? 'Primary Admin' : 'Recruiter'),
    primaryAdmin: isNewOrg ? fullName : primaryAdmin,
    affiliation,
    affiliationText: isNewOrg
      ? 'Primary Admin'
      : affiliation === 'active'
        ? 'Approved'
        : 'Pending approval : post under your name meanwhile',
    tierKey,
    tier,
    isFree: tierKey === 'free',
    planText: `${tier} · ${billing.charAt(0).toUpperCase() + billing.slice(1)}`,
    amountText: monthly ? `$${monthly.toFixed(2)} / month` : '$0.00 / month',
    paymentText: monthly ? `${brand} •••• ${last4}` : 'No payment needed',
    nextBilling: first(plan, ['nextBilling'], '12 Nov 2026 · cancel anytime'),
    scope,
    experienceText: experience.join(', '),
    industriesText: industries.join(', '),
  };
  log('buildSummary', { affiliation, tierKey, org: orgName });
  return summary;
};
