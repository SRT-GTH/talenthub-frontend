import { useCallback, useEffect } from 'react';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import CenteredIconDialog from '../../ui/CenteredIconDialog.jsx';
import { LogoutIcon } from './security/SettingsIcons.jsx';
import { LOGOUT_COPY } from './security/securityData.js';

const log = debug('RecruiterLogoutDialog');

/*
 * RecruiterLogoutDialog - SR-16 "Log out · confirm" (Figma 10161:82353, modal 10161:82614): `?modal=logout` over any Settings tab. `ui/CenteredIconDialog` (460 wide, p32, gap 16): a 56px red tile (#f9ebea) with the logout glyph,
 * a Bricolage 28/600 "Log out of GTH?", the 14/24 line and Stay (tertiary) / Log out (red). The talent `LogoutConfirm` is tied to the talent session API and talent copy, so the recruiter dialog is built on the shared recruiter dialog shell instead.
 * Stay, the Escape key and the scrim close it; Log out goes to `?state=logged-out` (mock: no session is ended).
 * Props: settings (useRecruiterSettingsState()).
 */
const DIALOG_BUTTON = '!h-[48px] !py-0';

const RecruiterLogoutDialog = ({ settings }) => {
  const { update } = settings;
  const stay = useCallback(() => {
    log('stay logged in');
    update({ modal: null });
  }, [update]);

  useEffect(() => {
    log('mount');
  }, []);

  return (
    <CenteredIconDialog
      icon={<LogoutIcon className="size-[28px]" />}
      iconTileClassName="bg-[#f9ebea] text-[#c0392b]"
      title={LOGOUT_COPY.title}
      body={LOGOUT_COPY.body}
      onClose={stay}
      widthClassName="!max-w-[460px]"
      footer={
        <>
          <Button variant="tertiary" className={DIALOG_BUTTON} onClick={stay}>
            {LOGOUT_COPY.stay}
          </Button>
          <Button
            variant="danger"
            size="sm"
            className={DIALOG_BUTTON}
            onClick={() => {
              log('dispatch log out (mock)');
              update({ modal: null, menu: null, state: 'logged-out' });
            }}
          >
            {LOGOUT_COPY.confirm}
          </Button>
        </>
      }
    />
  );
};

export default RecruiterLogoutDialog;
