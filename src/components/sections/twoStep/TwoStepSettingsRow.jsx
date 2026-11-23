import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import { SettingRow, StatusPill } from '../talentSettings/SettingsBUi.jsx';
import { getMfaStatus, shortDate, twoStepPath } from '../../../services/mfa.api.js';
import { debug } from '../../../utils/debug.js';

const log = debug('TwoStepSettingsRow');

/*
 * TwoStepSettingsRow — the "2-step verification" row of Settings › Security and sign-in (live pages): On / Off and "Manage" or "Set up",
 * both opening /security/2-step (which comes back here). Hidden while 2-step isn't available yet and the account doesn't have it.
 */

const TwoStepSettingsRow = () => {
  const { pathname, search } = useLocation();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let alive = true;
    getMfaStatus()
      .then((s) => alive && setStatus(s))
      .catch((err) => log.error('status not loaded', err?.response?.status));
    return () => {
      alive = false;
    };
  }, []);

  if (!status || (!status.available && !status.enabled)) return null;
  const on = Boolean(status.enabled);
  return (
    <SettingRow
      title="2-step verification"
      chip={on ? <StatusPill tone="on">On</StatusPill> : null}
      description={
        on
          ? `You sign in with your password and a code from your authenticator app. ${status.backupCodesLeft} backup codes left.`
          : status.required && status.graceUntil
            ? `Your account needs this by ${shortDate(status.graceUntil)}. Add a code from an app on your phone when you sign in.`
            : 'Add a code from an app on your phone when you sign in, so a stolen password isn’t enough.'
      }
      control={
        <Button variant="tertiary" size="lg" to={twoStepPath({ next: `${pathname}${search}` })}>
          {on ? 'Manage' : 'Set up'}
        </Button>
      }
    />
  );
};

export default TwoStepSettingsRow;
