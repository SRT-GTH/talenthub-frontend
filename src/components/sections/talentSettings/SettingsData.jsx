import { logout as clearLocalSession } from '../../../services/auth.api.js';
import { deactivateAccount, downloadMyData, settingsError } from '../../../services/settings.api.js';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  SettingsCloseXIcon,
  SettingsInfoCircleIcon,
  SettingsPauseCircleIcon,
  SettingsTrashIcon,
} from '../../shared/assets.jsx';
import { DeleteAccountButton, GroupCard, SettingRow, SettingsToggle } from './SettingsBUi.jsx';
import { SettingsDialog, SettingsToast } from './SettingsBDialogs.jsx';
import { FieldB } from './SettingsBFields.jsx';
import { DATA_COPY, DELETE_COPY, DOWNLOAD_TOAST } from './talentSettingsBData.js';

const log = debug('SettingsData');

const DeleteListItem = ({ children }) => (
  <li className="flex w-full items-center gap-[10px]">
    <SettingsCloseXIcon className="size-[16px] shrink-0 text-[#902b20]" />
    <span className="min-w-0 flex-1 text-[14px] leading-[normal] text-[#1c2a21]">{children}</span>
  </li>
);

/*
 * Live copy: "Delete account" turns the account OFF — nothing is deleted (product decision 2026-10-20). Logging back in
 * turns it on again (backend users.verifyOTP). The drawn "permanently delete after 30 days" copy stays in `?demo=1`.
 */
const LIVE_DANGER = {
  title: 'Turn off your account',
  description:
    'Recruiters can’t find or message you and you’re logged out everywhere. Nothing is deleted: log back in any time to turn it back on.',
  rowTitle: 'Your profile, applications, skills and messages are kept.',
  rowDescription: 'Download your data first if you want a copy.',
  cta: 'Turn off my account',
};
const LIVE_DELETE = {
  ...DELETE_COPY,
  title: 'Turn off your account?',
  intro: 'While your account is off:',
  items: [
    'Recruiters can’t find you or message you',
    'You’re logged out on every device',
    'Your profile, applications, skills and messages are kept',
  ],
  info: 'Changed your mind? Log back in with your email and password and everything comes back.',
  confirm: 'Turn off my account',
};

// ---- ST-10 Delete account · Confirm ------------------------------------------------------------
const DeleteAccountDialog = ({ onClose, onConfirm, live = false, busy = false, error = null }) => {
  // Figma draws the field already filled with DELETE; the button only works while it matches.
  const [typed, setTyped] = useState(live ? '' : DELETE_COPY.confirmWord);
  const keepRef = useRef(null);
  const ready = typed === DELETE_COPY.confirmWord;
  const copy = live ? LIVE_DELETE : DELETE_COPY;

  return (
    <SettingsDialog
      open
      title={copy.title}
      icon={<SettingsTrashIcon className="size-[21px] text-[#902b20]" />}
      iconTone="bg-[#f9ebea]"
      onClose={onClose}
      topOffset
      initialFocus={() => keepRef.current}
      testId="delete"
    >
      <p className="w-full text-[15px] leading-[normal] font-semibold text-[#1c2a21]">
        {copy.intro}
      </p>
      <ul className="flex w-full flex-col gap-[16px]">
        {copy.items.map((item) => (
          <DeleteListItem key={item}>{item}</DeleteListItem>
        ))}
        {live ? null : (
          <DeleteListItem>
            <span className="playful:hidden">{copy.streakFocused}</span>
            <span className="hidden playful:inline">{copy.streakPlayful}</span>
          </DeleteListItem>
        )}
      </ul>
      <div className="flex w-full items-center gap-[10px] rounded-[12px] bg-[#faf4e8] p-[12px]">
        <SettingsInfoCircleIcon className="size-[18px] shrink-0 text-[#463409]" />
        <p className="min-w-0 flex-[1_0_0] text-[13.5px] leading-[1.45] font-medium text-[#463409]">
          {copy.info}
        </p>
      </div>
      <FieldB
        label={copy.confirmLabel}
        value={typed}
        onChange={setTyped}
        autoComplete="off"
        spellCheck={false}
      />
      {error ? (
        <p role="alert" className="m-0 w-full text-[13.5px] font-medium text-[#c0392b]">
          {error}
        </p>
      ) : null}
      <div className="flex w-full items-center gap-[12px]">
        <Button
          ref={keepRef}
          variant="tertiary"
          size="lg"
          className="min-w-0 flex-1"
          onClick={onClose}
        >
          {copy.keep}
        </Button>
        <DeleteAccountButton
          tone="white"
          className="min-w-0 flex-1"
          disabled={!ready || busy}
          onClick={() => {
            log('dispatch delete account', { ready });
            onConfirm?.();
          }}
        >
          {copy.confirm}
        </DeleteAccountButton>
      </div>
    </SettingsDialog>
  );
};

/*
 * SettingsData — ST-07 "Data and account" (Playful 7844:13705 / Focused 8110:46238) and its states:
 * ?state=download (ST-07b toast), ?state=paused (ST-07c banner + toggle on), ?state=delete (ST-10).
 */
const SettingsData = ({ settings }) => {
  const { state, update } = settings;
  const navigate = useNavigate();
  // Live: GET /settings/export, PUT /settings/pause, POST /settings/deactivate. No verified-skills PDF backend yet.
  const live = settings?.live?.overview ? settings.live : null;
  const copy = live ? { ...DATA_COPY, danger: LIVE_DANGER } : DATA_COPY;
  const paused = live ? Boolean(live.overview.paused) : state === 'paused';
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const onPauseToggle = async (next) => {
    log('dispatch pause profile', { next });
    if (!live) {
      update({ state: next ? 'paused' : null });
      return;
    }
    setError(null);
    try {
      await live.setPaused(next);
      setToast(next ? { title: 'Profile paused', body: 'Recruiters can’t find you until you unpause.' } : { title: 'Welcome back', body: 'Recruiters can find you again.' });
    } catch (err) {
      setError(settingsError(err));
    }
  };

  const onDownload = async () => {
    if (!live) {
      update({ state: 'download' });
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await downloadMyData();
      setToast({ title: 'Your data is downloading', body: 'A JSON file with your profile, applications, posts and results.' });
    } catch (err) {
      setError(settingsError(err, 'Could not prepare your data. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  const onTurnOff = async () => {
    if (!live) {
      update({ state: null });
      navigate('/logged-out');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await deactivateAccount();
      clearLocalSession();
      navigate('/logged-out', { replace: true });
    } catch (err) {
      setError(settingsError(err, 'Could not turn your account off. Try again.'));
      setBusy(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="data">
      {paused && (
        <div
          role="status"
          className="flex w-full flex-wrap items-center gap-x-[14px] gap-y-[10px] rounded-[18px] bg-[#faf4e8] p-[clamp(14px,1.2vw,18px)] text-[#463409]"
        >
          <SettingsPauseCircleIcon className="size-[22px] shrink-0" />
          <div className="flex min-w-0 flex-[1_1_220px] flex-col items-start gap-[2px]">
            <p className="text-[16px] leading-[normal] font-semibold lg:whitespace-nowrap">
              {copy.paused.title}
            </p>
            <p className="text-[13.5px] leading-[1.45]">
              {live ? 'Recruiters cannot find you. Unpause any time.' : copy.paused.description}
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => onPauseToggle(false)}>
            {copy.paused.cta}
          </Button>
        </div>
      )}

      <GroupCard title={copy.yourData.title} description={copy.yourData.description}>
        <SettingRow
          nowrapControl={false}
          title={copy.yourData.download.title}
          description={
            live
              ? 'Your profile, applications, community posts, results and settings as a file you can keep.'
              : copy.yourData.download.description
          }
          control={
            <Button variant="tertiary" size="lg" disabled={busy} onClick={onDownload}>
              {live ? 'Download' : copy.yourData.download.cta}
            </Button>
          }
        />
        {live ? null : (
        <SettingRow
          top={false}
          nowrapControl={false}
          title={copy.yourData.pdf.title}
          description={copy.yourData.pdf.description}
          control={
            <Button
              variant="tertiary"
              size="lg"
              onClick={() => log('dispatch download verified skills pdf')}
            >
              {copy.yourData.pdf.cta}
            </Button>
          }
        />
        )}
      </GroupCard>

      <GroupCard title={copy.takeABreak.title}>
        <SettingRow
          top={false}
          title={copy.takeABreak.pause.title}
          titleId="data-pause"
          description={
            live ? 'Recruiters cannot find you while paused. Come back any time.' : copy.takeABreak.pause.description
          }
          control={
            <SettingsToggle labelledBy="data-pause" checked={paused} onChange={onPauseToggle} />
          }
        />
      </GroupCard>

      <GroupCard
        title={copy.danger.title}
        description={copy.danger.description}
        danger={paused ? 'paused' : 'default'}
        gap={paused ? 'gap-[8px]' : 'gap-[4px]'}
      >
        <div className="flex w-full flex-wrap items-center gap-x-[16px] gap-y-[10px] border-t border-[rgba(28,42,33,0.08)] py-[14px]">
          <div className="flex min-w-0 flex-[1_1_240px] flex-col items-start gap-[3px] leading-[normal]">
            <p className="text-[15px] font-semibold text-[#1c2a21]">{copy.danger.rowTitle}</p>
            <p className="text-[13.5px] text-[#595959]">{copy.danger.rowDescription}</p>
          </div>
          <DeleteAccountButton onClick={() => update({ state: 'delete' })}>
            {copy.danger.cta}
          </DeleteAccountButton>
        </div>
      </GroupCard>

      {error && state !== 'delete' ? (
        <p role="alert" className="m-0 text-[14px] font-medium text-[#c0392b]">
          {error}
        </p>
      ) : null}

      {state === 'delete' && (
        <DeleteAccountDialog
          live={Boolean(live)}
          busy={busy}
          error={error}
          onClose={() => {
            setError(null);
            update({ state: null });
          }}
          onConfirm={onTurnOff}
        />
      )}
      <SettingsToast
        open={live ? Boolean(toast) : state === 'download'}
        title={live ? toast?.title : DOWNLOAD_TOAST.title}
        body={live ? toast?.body : DOWNLOAD_TOAST.body}
        elevated
        onDismiss={() => (live ? setToast(null) : update({ state: null }))}
      />
    </div>
  );
};

export default SettingsData;
