import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { OWNER_STATUSES } from './createCommunityData.js';

const log = debug('createCommunityState');

/*
 * Create your own community (talent-created) — URL contract. Frontend-only; mock data in createCommunityData.js, session
 * store in createCommunityStore.js. Figma canvas "Talent - community Engagement" 5456:19207, Playful section 8947:2928 /
 * Focused twin 8944:2672 (CC-02 … CC-17b). Frame → URL table: wiki-ready text in the section notes.
 *
 * ROUTES
 *   /community/create                         the "Start a community" wizard, drawn as a dialog over the Community browse page
 *   /community/:communityId/manage            the owner's view of a community they created (hero, banner by status, feed, side cards)
 *
 * WIZARD (`/community/create`)
 *   ?step=basics|who|rules|review             CC-02 · CC-03 · CC-04 · CC-05   (default basics)
 *   &state=name-taken                         CC-02b  name already exists (error + "Free names you could use")
 *   ?state=not-ready                          CC-12   "Almost ready to start a community" (eligibility)
 *   &demo=1                                   fills the drawn Agritech draft (every frame URL carries it); without it the draft is the
 *                                             talent's own (starts empty, saved in sessionStorage "as you go")
 *   &cat=software-engineering                 the browse page behind the dialog (Figma draws "Showing 3 communities in Software engineering")
 *   &edit=<communityId>&from=<status>         the same wizard prefilled from an owned community (Settings → Edit details / Who can join /
 *                                             House rules, needs-change → "Edit and resubmit"); submitting returns to the owner page
 *
 * OWNER PAGE (`/community/:communityId/manage`)
 *   ?state=under-review                       CC-06  submitted, GTH checking
 *   ?state=waiting-mentor                     CC-07  approved, a verified mentor must co-moderate (ages 14+)
 *   ?state=needs-change                       CC-11  not approved yet
 *   ?state=live[&toast=live]                  CC-08  live (owner view) + "is live · +100 XP" toast
 *   ?state=transfer-pending                   CC-16b waiting for the new owner to accept
 *   ?state=archived                           CC-17b archived (read-only, restore in 90 days)
 *   &modal=invite                             CC-09  Invite people
 *   &modal=manage&tab=reports                 CC-10  Manage · reports and moderators   (tab=requests CC-14 · members · moderators · settings CC-15)
 *   &modal=mentor                             CC-13  Invite a verified mentor
 *   &modal=transfer                           CC-16  Transfer ownership
 *   &modal=archive                            CC-17  Archive community (confirm)
 *   &modal=create                             the existing Community "create post" dialog (Write the first post)
 *   &requests=3                               seeds the three join requests CC-14 / CC-15 draw (CC-10 draws none, so no "Requests" tab)
 *   &demo=1                                   without `state`, shows the live fixture instead of redirecting
 *   &rail=collapsed | &help=1                 icon rail (CC-06 … CC-17b draw it) / Help pop-over (default Help copy)
 *
 * Without `?state` / `?demo` the owner page shows the community the talent really created in this session (submit → under review);
 * an unknown id goes back to /community. Transitions that Figma draws as buttons (Send transfer request → transfer-pending,
 * Cancel transfer → live, Archive → archived, Restore → live, Edit and resubmit → under-review) update `?state` too.
 * There is NO demo control: reviewer outcomes (approved, needs a change, mentor accepted) come from GTH, so they are reachable only by URL.
 *
 * CC-01 (the entry point) is not drawn in either section: "Start a community" has no card / button on the browse frames.
 */
export const CREATE_STEPS = ['basics', 'who', 'rules', 'review'];
export const OWNER_MODALS = ['invite', 'mentor', 'manage', 'transfer', 'archive', 'create'];
export const MANAGE_TABS = ['reports', 'requests', 'members', 'moderators', 'settings'];

const pick = (value, allowed, fallback = null) => (allowed.includes(value) ? value : fallback);

export const useCreateCommunityState = () => {
  const [params, setParams] = useSearchParams();
  const stepParam = params.get('step');
  const stateParam = params.get('state');
  const modalParam = params.get('modal');
  const tabParam = params.get('tab');
  const toastParam = params.get('toast');
  const requestsParam = params.get('requests');
  const editParam = params.get('edit');
  const fromParam = params.get('from');
  const demoParam = params.get('demo') === '1';
  const railParam = params.get('rail');
  const helpParam = params.get('help');

  return useMemo(() => {
    const wizardState = pick(stateParam, ['name-taken', 'not-ready']);
    const ownerState = pick(stateParam, OWNER_STATUSES);
    const requests = Math.min(3, Math.max(0, Number.parseInt(requestsParam ?? '0', 10) || 0));
    const result = {
      step: pick(stepParam, CREATE_STEPS, 'basics'),
      wizardState,
      ownerState,
      modal: pick(modalParam, OWNER_MODALS),
      tab: pick(tabParam, MANAGE_TABS, 'reports'),
      toast: toastParam === 'live' ? 'live' : null,
      requests,
      edit: editParam || null,
      from: pick(fromParam, OWNER_STATUSES),
      demo: demoParam || Boolean(stateParam),
      rail: railParam === 'collapsed' ? 'collapsed' : 'expanded',
      help: helpParam === '1',
      // Merge a patch into the query string (null / undefined / false / '' removes a key). Keeps every other key.
      update: (patch, options = {}) => {
        const next = new URLSearchParams(params);
        Object.entries(patch).forEach(([key, value]) => {
          if (value === null || value === undefined || value === false || value === '')
            next.delete(key);
          else next.set(key, value === true ? '1' : String(value));
        });
        setParams(next, { replace: options.replace ?? true });
      },
    };
    log('state', result.step, result.wizardState, result.ownerState, result.modal, result.tab);
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stepParam,
    stateParam,
    modalParam,
    tabParam,
    toastParam,
    requestsParam,
    editParam,
    fromParam,
    demoParam,
    railParam,
    helpParam,
    params,
  ]);
};
