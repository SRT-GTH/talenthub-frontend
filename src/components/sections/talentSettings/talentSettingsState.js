import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('talentSettingsState');

/*
 * Talent Settings & Account — mock state source (frontend-only; swap for an API later, keep the shape).
 * Section = path param, state/overlays = query params, on `/settings/:section`:
 *
 *   /settings                                 -> redirects to /settings/account
 *   /settings/account                         ST-01 Account                          ?state=email-error    ST-01b
 *   /settings/privacy                         ST-02 Profile and privacy              ?state=hidden ST-02b · ?state=blocked ST-02c (Manage blocked)
 *   /settings/notifications                   ST-03 Notifications                    ?state=paused ST-03b (paused for 24 hours)
 *   /settings/accessibility                   ST-04 Accessibility                    ?state=unsaved (ST-09 unsaved changes) · ?state=saved (ST-09b saved toast)
 *   /settings/language                        ST-05 Language and data
 *   /settings/security                        ST-06 Security and sign-in             ?state=password ST-06b · ?state=two-step ST-06c · ?state=device-logged-out ST-06d (toast)
 *   /settings/data                            ST-07 Data and account                 ?state=download ST-07b (toast) · ?state=paused ST-07c · ?state=delete ST-10 (Delete account · Confirm)
 *   /settings/guardian                        ST-08 Parent or guardian (under 18)    ?state=invite ST-08b
 *   /settings/appearance                      ST-09 Appearance
 *
 * Overlays available on ANY talent page (the talent shell reads them from the URL):
 *   ?menu=open | language                     PM-01 Profile menu · PM-02 Language
 *   ?logout=confirm                           LO-01 Log out · Confirm
 *   /logged-out                               LO-02 Logged out (own route, no talent shell)
 *   ?help=page|searching|none|shortcuts|article|report|contact|sent
 *                                              HP-01 pop-over · HP-02 searching · HP-03 no results · HP-08 keyboard shortcuts ·
 *                                              HP-04 article · HP-07 report a problem · HP-05 contact support · HP-06 request sent
 *                                              (`?help=1` stays the existing "For this page" pop-over)
 *   /settings/help  (HS-01)                   Help and support page
 *   ?dialog=feedback | invite                 FB-01 Send feedback · IV-01 Invite a friend
 *   ?collapsed=1                              HMc collapsed-sidebar state of the talent shell
 *
 * The lead owns this file. Section agents may ADD derived fields but must not rename existing ones.
 */

export const SETTINGS_SECTIONS = [
  'account',
  'privacy',
  'notifications',
  'accessibility',
  'language',
  'security',
  'data',
  'guardian',
  'appearance',
  'help',
];

export const SECTION_STATES = {
  account: ['email-error'],
  privacy: ['hidden', 'blocked'],
  notifications: ['paused'],
  accessibility: ['unsaved', 'saved'],
  security: ['password', 'two-step', 'device-logged-out'],
  data: ['download', 'paused', 'delete'],
  guardian: ['invite'],
};

export const HELP_STATES = [
  'page',
  'searching',
  'none',
  'shortcuts',
  'article',
  'report',
  'contact',
  'sent',
];

const pick = (value, allowed, fallback = null) => (allowed.includes(value) ? value : fallback);

export const useTalentSettingsState = () => {
  const { section: sectionParam } = useParams();
  const [params, setParams] = useSearchParams();
  const section = pick(sectionParam, SETTINGS_SECTIONS, 'account');
  const state = pick(params.get('state'), SECTION_STATES[section] ?? []);
  const menu = pick(params.get('menu'), ['open', 'language']);
  const logout = params.get('logout') === 'confirm' ? 'confirm' : null;
  const help = pick(params.get('help'), HELP_STATES);
  const dialog = pick(params.get('dialog'), ['feedback', 'invite']);
  const collapsed = params.get('collapsed') === '1';
  const a11yMode = params.get('a11y') === '1';

  return useMemo(() => {
    log('state', { section, state, menu, logout, help, dialog, collapsed });
    // Merge a patch into the query string (null/undefined/false removes a key).
    const update = (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === false) next.delete(k);
        else next.set(k, v === true ? '1' : String(v));
      });
      setParams(next, { replace: true });
    };
    return {
      // `stateKey` / `tab` mirror the talent-home contract so the shared shell keeps working.
      stateKey: 'top',
      tab: section,
      section,
      state,
      menu,
      logout,
      help,
      dialog,
      collapsed,
      a11yMode,
      // `?demo=1` = GubliAS's drawn mock (Figma values, nothing saved). Live data otherwise (useLiveSettings).
      demo: params.get('demo') === '1',
      update,
      // Shell hooks (search/edit unused here but present for the shared nav).
      searchOpen: params.get('search') === '1',
      editOpen: false,
      newUser: null,
      journeyMin: false,
    };
  }, [params, setParams, section, state, menu, logout, help, dialog, collapsed, a11yMode]);
};
