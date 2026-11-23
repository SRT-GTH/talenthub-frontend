import { useCallback, useEffect, useState } from 'react';
import Button from '../../ui/Button.jsx';
import { PasswordInput, TextInput, VerificationCode } from '../../ui/form';
import AgencyDialog from '../agency/onboarding/AgencyDialog.jsx';
import { GroupCard, SettingRow, StatusPill, TextAction } from '../talentSettings/SettingsBUi.jsx';
import BackupCodesView from './BackupCodesView.jsx';
import TwoStepQr from './TwoStepQr.jsx';
import {
  confirmAppSetup,
  getMfaStatus,
  makeNewBackupCodes,
  mfaError,
  removeMethod,
  shortDate,
  startAppSetup,
} from '../../../services/mfa.api.js';
import { debug } from '../../../utils/debug.js';

const log = debug('TwoStepPanel');

/*
 * TwoStepPanel — "2-step verification" settings (user stories A1, A2, F; screens 1, 3, 4, 5). Used by the standalone page
 * /security/2-step (everyone, and the forced set-up) and by Admin › Settings › 2-step verification.
 *   Off:  why it matters, the required-by date for admins, "Set up 2-step verification".
 *   On:   the authenticator apps (name, added, last used, Remove), backup codes left + "Make new codes", "Add another app".
 * Set-up (dialog): Confirm it's you (password while off, a current code once on) -> scan the QR code / type the key -> enter a code
 *   -> the 10 backup codes (first method only, ticked "I saved these") -> done.
 * Remove a method / new backup codes: Confirm it's you with a current code (app or backup code), as the backend requires.
 * Passkeys come in Phase 4; this panel offers the authenticator app only. Backend: services/mfa.api.js.
 * Props: onEnabled() (after the first method is added; the forced page goes on to where the user was going), autoStart (opens set-up at once).
 */

const SHELL =
  'flex w-[min(520px,calc(100vw-48px))] flex-col gap-[18px] rounded-[24px] bg-white p-[clamp(20px,6vw,32px)]';
const H = 'm-0 font-sans text-[22px] leading-[28px] font-semibold tracking-[-0.1px] text-[#1c2a21]';
const P = 'm-0 font-sans text-[14px] leading-[20px] text-[#595959]';

const groupKey = (k) =>
  String(k || '')
    .replace(/(.{4})/g, '$1 ')
    .trim();

const Dialog = ({ label, onClose, children }) => (
  <AgencyDialog
    label={label}
    onClose={onClose}
    dismissable={false}
    scrimClassName="bg-[#0f1f14]/45"
  >
    <div className={SHELL}>{children}</div>
  </AgencyDialog>
);

const CloseRow = ({ onClose }) => (
  <button
    type="button"
    onClick={onClose}
    className="self-end cursor-pointer border-0 bg-transparent font-sans text-[13px] font-semibold text-[#387440] underline-offset-2 hover:underline"
  >
    Cancel
  </button>
);

/* Step 1 of every change: prove it's you. While 2-step is off: the password; once on: a current code (app or backup code). */
const ConfirmStep = ({ enabled, why, busy, error, onSubmit, onClose, withLabel = false }) => {
  const [secret, setSecret] = useState('');
  const [label, setLabel] = useState('Authenticator app');
  const ready = secret.trim().length >= (enabled ? 6 : 1) && !busy;
  return (
    <form
      className="flex flex-col gap-[16px]"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready)
          onSubmit({
            [enabled ? 'code' : 'password']: secret.trim(),
            label: label.trim() || undefined,
          });
      }}
    >
      <CloseRow onClose={onClose} />
      <h2 className={H}>Confirm it’s you</h2>
      <p className={P}>{why}</p>
      {enabled ? (
        <TextInput
          label="Code from your authenticator app, or a backup code"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          autoComplete="one-time-code"
          inputMode="text"
          data-autofocus
          error={error || undefined}
        />
      ) : (
        <PasswordInput
          label="Your password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          autoComplete="current-password"
          data-autofocus
          error={error || undefined}
        />
      )}
      {withLabel ? (
        <TextInput
          label="Name this app"
          optional
          value={label}
          maxLength={60}
          onChange={(e) => setLabel(e.target.value)}
          helperText="So you can tell your apps apart, e.g. “My Tecno phone”."
        />
      ) : null}
      <Button type="submit" variant="primary" size="lg" disabled={!ready} className="w-full">
        {busy ? 'Checking…' : 'Continue'}
      </Button>
    </form>
  );
};

const ScanStep = ({ setup, busy, error, onSubmit, onClose }) => {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col gap-[16px]">
      <CloseRow onClose={onClose} />
      <h2 className={H}>Add your authenticator app</h2>
      <ol className="m-0 flex list-decimal flex-col gap-[4px] pl-[20px] font-sans text-[14px] leading-[20px] text-[#595959]">
        <li>
          Open Google Authenticator, Microsoft Authenticator or another authenticator app on your
          phone.
        </li>
        <li>Tap “+” or “Add”, then scan this code.</li>
        <li>Type the 6-digit code the app shows.</li>
      </ol>
      <div className="flex flex-col items-center gap-[10px]">
        <TwoStepQr uri={setup.otpauthUri} />
        <p className="m-0 font-sans text-[12px] leading-[16px] text-[#70706e]">
          Can’t scan? Type this key in the app:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[8px]">
          <code className="rounded-[8px] bg-[#f6f7f4] px-[10px] py-[6px] font-mono text-[14px] font-semibold tracking-[0.04em] text-[#1c2a21] break-all">
            {groupKey(setup.secret)}
          </code>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(setup.secret);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              } catch {
                setCopied(false);
              }
            }}
            className="cursor-pointer border-0 bg-transparent font-sans text-[13px] font-semibold text-[#387440] underline-offset-2 hover:underline"
          >
            {copied ? 'Copied' : 'Copy key'}
          </button>
        </div>
      </div>
      <VerificationCode
        length={6}
        value={code}
        onChange={setCode}
        onComplete={(v) => !busy && onSubmit(v)}
        label="6-digit code from the app"
        error={error || undefined}
        helperText={!error ? 'The code changes every 30 seconds. Use the newest one.' : undefined}
      />
      <Button
        variant="primary"
        size="lg"
        disabled={code.length !== 6 || busy}
        onClick={() => onSubmit(code)}
        className="w-full"
      >
        {busy ? 'Checking…' : 'Finish set-up'}
      </Button>
    </div>
  );
};

const MethodRow = ({ m, onRemove, top }) => (
  <SettingRow
    top={top}
    title={m.label || 'Authenticator app'}
    description={`Authenticator app · added ${shortDate(m.createdAt)}${m.lastUsedAt ? ` · last used ${shortDate(m.lastUsedAt)}` : ''}`}
    control={
      <TextAction
        tone="danger"
        onClick={() => onRemove(m)}
        aria-label={`Remove ${m.label || 'authenticator app'}`}
      >
        Remove
      </TextAction>
    }
  />
);

const TwoStepPanel = ({ onEnabled, autoStart = false }) => {
  const [status, setStatus] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [flow, setFlow] = useState(null); // { kind: 'add'|'remove'|'codes', step, setup?, codes?, method? }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const s = await getMfaStatus();
      log('status', { enabled: s?.enabled, required: s?.required, methods: s?.methods?.length });
      setStatus(s);
      return s;
    } catch (err) {
      setLoadError(mfaError(err, 'We couldn’t load your 2-step verification settings.'));
      return null;
    }
  }, []);

  useEffect(() => {
    load().then((s) => {
      if (autoStart && s && s.available && !s.enabled) setFlow({ kind: 'add', step: 'confirm' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    setFlow(null);
    setError('');
    setBusy(false);
  };
  const step = async (fn) => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(mfaError(err));
    } finally {
      setBusy(false);
    }
  };

  if (loadError) {
    return (
      <GroupCard title="2-step verification">
        <p className={P}>{loadError}</p>
        <Button variant="tertiary" size="md" onClick={load}>
          Try again
        </Button>
      </GroupCard>
    );
  }
  if (!status) {
    return (
      <GroupCard title="2-step verification">
        <p className={P}>Loading…</p>
      </GroupCard>
    );
  }

  const enabled = Boolean(status.enabled);
  const methods = status.methods || [];
  const due = status.required && !enabled;

  return (
    <div className="flex w-full flex-col gap-[20px]" data-two-step-panel>
      {due ? (
        <p
          role="status"
          className="m-0 rounded-[16px] bg-[#faf4e8] p-[16px] font-sans text-[14px] leading-[20px] font-medium text-[#463409]"
        >
          {status.mustSetUpNow
            ? 'Your account needs 2-step verification. Set it up now to keep using GTH.'
            : status.graceUntil
              ? `Your account needs 2-step verification. Set it up by ${shortDate(status.graceUntil)}; after that you’ll need it to keep using GTH.`
              : 'Your account needs 2-step verification. Set it up to keep using GTH.'}
        </p>
      ) : null}
      {enabled && status.required && status.signedInWith2Step === false && status.mustSetUpNow ? (
        <p
          role="status"
          className="m-0 rounded-[16px] bg-[#faf4e8] p-[16px] font-sans text-[14px] leading-[20px] font-medium text-[#463409]"
        >
          This sign-in didn’t use 2-step verification. Sign out, then sign in again and enter the
          code from your app.
        </p>
      ) : null}
      {notice ? (
        <p
          role="status"
          className="m-0 rounded-[16px] bg-[#ebf1ec] p-[16px] font-sans text-[14px] leading-[20px] font-medium text-[#2a5730]"
        >
          {notice}
        </p>
      ) : null}

      <GroupCard
        title="2-step verification"
        description="After your password, you’ll also enter a code from an app on your phone. A stolen password alone won’t get anyone into your account."
      >
        <SettingRow
          top={false}
          title="Status"
          chip={enabled ? <StatusPill tone="on">On</StatusPill> : null}
          description={
            enabled
              ? `On since ${shortDate(status.enrolledAt)}.`
              : status.available
                ? 'Off.'
                : 'Not available yet. We’ll let you know when you can turn it on.'
          }
          control={
            !enabled && status.available ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setFlow({ kind: 'add', step: 'confirm' })}
              >
                Set up
              </Button>
            ) : null
          }
        />
      </GroupCard>

      {enabled ? (
        <GroupCard title="Authenticator apps" gap="gap-0">
          {methods.map((m, i) => (
            <MethodRow
              key={m.id}
              m={m}
              top={i > 0}
              onRemove={(method) => setFlow({ kind: 'remove', method })}
            />
          ))}
          {status.available ? (
            <div className="pt-[12px]">
              <TextAction tone="green" onClick={() => setFlow({ kind: 'add', step: 'confirm' })}>
                Add another authenticator app
              </TextAction>
            </div>
          ) : null}
        </GroupCard>
      ) : null}

      {enabled ? (
        <GroupCard title="Backup codes">
          <SettingRow
            top={false}
            title={`${status.backupCodesLeft} left`}
            description="Use one to sign in if you don’t have your phone. Each works once."
            control={
              <TextAction tone="green" onClick={() => setFlow({ kind: 'codes', step: 'confirm' })}>
                Make new codes
              </TextAction>
            }
          />
          {status.backupCodesLeft <= 3 ? (
            <p className="m-0 font-sans text-[13px] leading-[18px] font-medium text-[#902b20]">
              You’re running low. Make new codes so you don’t get locked out.
            </p>
          ) : null}
        </GroupCard>
      ) : null}

      {/* ── Set up an authenticator app ── */}
      {flow?.kind === 'add' && flow.step === 'confirm' ? (
        <Dialog label="Confirm it’s you" onClose={close}>
          <ConfirmStep
            enabled={enabled}
            withLabel
            why={
              enabled
                ? 'Enter a code from the app you already have to add another one.'
                : 'Enter your password to start setting up 2-step verification.'
            }
            busy={busy}
            error={error}
            onClose={close}
            onSubmit={(proof) =>
              step(async () => {
                const setup = await startAppSetup(proof);
                setFlow({ kind: 'add', step: 'scan', setup });
              })
            }
          />
        </Dialog>
      ) : null}
      {flow?.kind === 'add' && flow.step === 'scan' ? (
        <Dialog label="Add your authenticator app" onClose={close}>
          <ScanStep
            setup={flow.setup}
            busy={busy}
            error={error}
            onClose={close}
            onSubmit={(code) =>
              step(async () => {
                const out = await confirmAppSetup({ factorId: flow.setup.factorId, code });
                if (out?.backupCodes?.length)
                  setFlow({ kind: 'add', step: 'codes', codes: out.backupCodes });
                else setFlow({ kind: 'add', step: 'done', first: false });
              })
            }
          />
        </Dialog>
      ) : null}
      {flow?.kind === 'add' && flow.step === 'codes' ? (
        <Dialog label="Save your backup codes" onClose={() => null}>
          <h2 className={H}>Save your backup codes</h2>
          <BackupCodesView
            codes={flow.codes}
            onDone={() => setFlow({ kind: 'add', step: 'done', first: true })}
          />
        </Dialog>
      ) : null}
      {flow?.kind === 'add' && flow.step === 'done' ? (
        <Dialog label="2-step verification is on" onClose={close}>
          <h2 className={H}>{flow.first ? '2-step verification is on' : 'App added'}</h2>
          <p className={P}>
            {flow.first
              ? 'Next time you sign in, enter your password and then a code from your app. We’ve emailed you about this change.'
              : 'You can use either app to sign in. We’ve emailed you about this change.'}
          </p>
          <Button
            variant="primary"
            size="lg"
            data-autofocus
            className="w-full"
            onClick={async () => {
              const first = flow.first;
              close();
              await load();
              if (first) onEnabled?.();
            }}
          >
            Done
          </Button>
        </Dialog>
      ) : null}

      {/* ── Remove a method ── */}
      {flow?.kind === 'remove' ? (
        <Dialog label="Confirm it’s you" onClose={close}>
          <ConfirmStep
            enabled
            why={
              methods.length <= 1
                ? `Removing ${flow.method.label || 'this app'} turns 2-step verification off and your backup codes stop working.${status.required ? ' Your account needs 2-step verification, so you’ll have to set it up again.' : ''}`
                : `Enter a code to remove ${flow.method.label || 'this app'}.`
            }
            busy={busy}
            error={error}
            onClose={close}
            onSubmit={({ code }) =>
              step(async () => {
                const out = await removeMethod(flow.method.id, { code });
                close();
                setNotice(
                  out?.enabled
                    ? 'App removed.'
                    : '2-step verification is off. We’ve emailed you about this change.'
                );
                await load();
              })
            }
          />
        </Dialog>
      ) : null}

      {/* ── New backup codes ── */}
      {flow?.kind === 'codes' && flow.step === 'confirm' ? (
        <Dialog label="Confirm it’s you" onClose={close}>
          <ConfirmStep
            enabled
            why="New codes replace the old ones: the old codes stop working."
            busy={busy}
            error={error}
            onClose={close}
            onSubmit={({ code }) =>
              step(async () => {
                const out = await makeNewBackupCodes({ code });
                setFlow({ kind: 'codes', step: 'show', codes: out?.backupCodes || [] });
              })
            }
          />
        </Dialog>
      ) : null}
      {flow?.kind === 'codes' && flow.step === 'show' ? (
        <Dialog label="Your new backup codes" onClose={() => null}>
          <h2 className={H}>Your new backup codes</h2>
          <BackupCodesView
            codes={flow.codes}
            doneLabel="Done"
            onDone={async () => {
              close();
              setNotice('New backup codes made. The old ones no longer work.');
              await load();
            }}
          />
        </Dialog>
      ) : null}
    </div>
  );
};

export default TwoStepPanel;
