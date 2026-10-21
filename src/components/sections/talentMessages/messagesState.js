import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { isLoggedIn } from '../../../services/auth.api.js';
import { MESSAGE_CONVERSATIONS } from './messagesData.js';

const log = debug('messagesState');

/*
 * Talent Messages — URL-driven state (frontend-only mocks; swap for an API later and keep the shape).
 * Figma canvas "Talent Messages" 7387:104275. Sections (Playful / Focused):
 *   MAIN        T-MSG-01…14   7414:1716 / 8110:435675      COLLAPSED  T-MSG-01c…14c   7425:1555 / 8110:442860
 *   HELP REPLY  H-01…04(+c)   7463:4296 / 8110:449384      A11Y       A-01…04         7489:5818 / 8110:453593
 *   LANGUAGES   L-01…03       7497:6380 / 8110:455946      TOGGLE     A-01c           8808:456563 / 8808:457245
 *   HELP pop-over HP          8376:504797 / 8376:504917
 * Frame → URL table: wiki/talent-messages.md (the lead owns that table and this file).
 *
 *   /messages                                   T-MSG-01 inbox, "Mr. Owura Asante" open
 *   &menu=options                               T-MSG-02 conversation options menu (the ⋯ button)
 *   ?tab=requests&c=request                     T-MSG-03 Requests tab, message request
 *   ?tab=requests&c=request&state=accepted      T-MSG-04 request accepted · first reply
 *   &modal=not-interested                       T-MSG-05 job card · Not interested (reasons)
 *   &modal=pre-apply                            T-MSG-06 Before you apply (pre-apply preview)
 *   ?c=applied                                  T-MSG-07 job card · Applied
 *   ?c=interview | &state=confirmed             T-MSG-08 interview invite · T-MSG-09 interview confirmed
 *   ?state=offline                              T-MSG-10 message not sent · offline
 *   ?tab=requests&c=confidential                T-MSG-11 request from a confidential company
 *   ?c=closed                                   T-MSG-12 role has closed
 *   ?state=empty | ?state=loading               T-MSG-13 empty inbox (first visit) · T-MSG-14 loading
 *   &reply=ideas|writing|draft|placed           H-01 reply ideas · H-02 Buddy is writing · H-03 draft ready · H-04 draft placed
 *   ?a11y=1                                     A-01 Accessibility panel open in the Messages tab (panel closed in A-02…A-04)
 *   ?calm=1&read=1&explain=1&large=1            A-02 settings on (Calm chat + Read aloud + Explain it simply + Large text), panel closed
 *   ?calm=1&read=playing&explain=1  |  ?explain=open     A-03 Read aloud playing · A-04 Explain it simply (Career Buddy), panel closed
 *   ?lang=menu | twi|ga|ewe|dagbani|hausa|toast L-01 language menu · L-02/02b–e Coming-soon modal · L-03 "On the list" toast
 *   &rail=collapsed                             every "c" frame (icon rail) · A-01c with ?a11y=1
 *   &help=1                                     Help pop-over (HP)
 *   &demo=1                                     draw the Kofi shell (default when signed out); see messagesFrame
 * Live (2026-10-21): a signed-in talent on /messages sees their own conversations (useLiveMessages.js). The drawn mock
 * stays on with `demo=1`, when signed out, with any `state=` frame, or with `c=` set to a drawn key (owura, request…).
 *
 * `c` is a conversation key (owura = the drawn default). Section agents may ADD derived fields but must not rename
 * existing ones.
 */
export const MESSAGES_TABS = ['all', 'unread', 'requests'];
export const MESSAGES_STATES = ['empty', 'loading', 'offline', 'accepted', 'confirmed'];
export const MESSAGES_MODALS = ['not-interested', 'pre-apply'];
export const MESSAGES_REPLY_STEPS = ['ideas', 'writing', 'draft', 'placed'];
export const MESSAGES_LANGS = ['menu', 'twi', 'ga', 'ewe', 'dagbani', 'hausa', 'toast'];

const DRAWN_IDS = MESSAGE_CONVERSATIONS.map((x) => x.id);

const pick = (value, allowed, fallback = null) => (allowed.includes(value) ? value : fallback);

export const useMessagesState = () => {
  const [params, setParams] = useSearchParams();
  const tab = pick(params.get('tab'), MESSAGES_TABS, 'all');
  const c = params.get('c') || null;
  const state = pick(params.get('state'), MESSAGES_STATES);
  const menu = params.get('menu') === 'options' ? 'options' : null;
  const modal = pick(params.get('modal'), MESSAGES_MODALS);
  const reply = pick(params.get('reply'), MESSAGES_REPLY_STEPS);
  const lang = pick(params.get('lang'), MESSAGES_LANGS);
  const q = params.get('q') ?? '';
  const rail = params.get('rail') === 'collapsed' ? 'collapsed' : 'expanded';
  const help = params.get('help') === '1';
  const a11yParam = params.get('a11y') === '1';
  const calm = params.get('calm') === '1';
  const large = params.get('large') === '1';
  const read =
    params.get('read') === 'playing' ? 'playing' : params.get('read') === '1' ? 'on' : null;
  const explain =
    params.get('explain') === 'open' ? 'open' : params.get('explain') === '1' ? 'on' : null;
  // Drawn frames vs the talent's own inbox (see the header). Menus, modals, Help me reply, language and a11y keys are
  // ordinary interactions in the live inbox too, so they no longer switch the mock on by themselves.
  const demo =
    params.get('demo') === '1' ||
    !isLoggedIn() ||
    params.has('state') ||
    (Boolean(c) && DRAWN_IDS.includes(c));

  return useMemo(() => {
    log('state', { demo, tab, c, state, menu, modal, reply, lang, rail, a11yParam });
    // Merge a patch into the query string (null/undefined/false/'' removes a key).
    const update = (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === false || v === '') next.delete(k);
        else next.set(k, v === true ? '1' : String(v));
      });
      setParams(next, { replace: true });
    };
    return {
      // `stateKey` / `tab` mirror the talent-home contract so the shared shell keeps working.
      stateKey: 'top',
      tab,
      messagesTab: tab,
      c,
      state,
      menu,
      modal,
      reply,
      lang,
      q,
      rail,
      help,
      demo,
      calm,
      large,
      read,
      explain,
      a11yMode: a11yParam,
      a11yParam,
      update,
      searchOpen: params.get('search') === '1',
      editOpen: false,
      loading: null,
      newUser: null,
      journeyMin: false,
    };
  }, [
    params,
    setParams,
    tab,
    c,
    state,
    menu,
    modal,
    reply,
    lang,
    q,
    rail,
    help,
    demo,
    calm,
    large,
    read,
    explain,
    a11yParam,
  ]);
};
