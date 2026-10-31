import { useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import {
  createParentLinkCode,
  fetchMyGuardians,
  parentError,
} from '../../../services/parent.api.js';
import Button from '../../ui/Button.jsx';
import {
  ArrowRightIcon,
  SettingsInfoCircleIcon,
  SettingsPersonIcon,
  SettingsChipCheckIcon,
} from '../../shared/assets.jsx';
import { Chip } from '../talentHome/coreUi.jsx';
import { TalentHomeChipLockIcon } from '../../shared/assets.jsx';
import { GroupCard, SettingRow, SettingsToggle, StatusPill, TextAction } from './SettingsBUi.jsx';
import { FieldB, PillChoice } from './SettingsBFields.jsx';
import { GUARDIAN_COPY, INVITE_SEED, RELATIONS } from './talentSettingsBData.js';

const log = debug('SettingsGuardian');

const InviteCard = ({ onSent }) => {
  const copy = GUARDIAN_COPY.invite;
  const [name, setName] = useState(INVITE_SEED.name);
  const [phone, setPhone] = useState(INVITE_SEED.phone);
  const [relation, setRelation] = useState(INVITE_SEED.relation);
  const valid = name.trim().length > 1 && phone.replace(/\D/g, '').length >= 9;

  const submit = (event) => {
    event.preventDefault();
    if (!valid) {
      log('branch', {
        invite: 'blocked',
        name: name.trim().length,
        digits: phone.replace(/\D/g, '').length,
      });
      return;
    }
    log('dispatch send invite', { relation });
    onSent?.();
  };

  return (
    <GroupCard title={copy.title} data-settings-card="invite">
      <p className="w-full text-[14px] leading-[1.5] text-[#595959]">{copy.description}</p>
      <form onSubmit={submit} noValidate className="flex w-full flex-col items-start gap-[8px]">
        <div className="flex w-full flex-col items-start gap-[16px] min-[700px]:flex-row">
          <FieldB label={copy.nameLabel} value={name} onChange={setName} autoComplete="off" />
          <FieldB
            label={copy.phoneLabel}
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={setPhone}
            autoComplete="off"
          />
        </div>
        <PillChoice
          options={RELATIONS}
          value={relation}
          onChange={setRelation}
          label={copy.title}
        />
        <div className="flex w-full flex-wrap items-center gap-x-[12px] gap-y-[8px] pt-[12px]">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!valid}
            rightIcon={<ArrowRightIcon />}
          >
            {copy.cta}
          </Button>
          <p className="text-[13px] leading-[normal] text-[#595959]">{copy.note}</p>
        </div>
      </form>
    </GroupCard>
  );
};

/*
 * SettingsGuardian — ST-08 "Parent or guardian (under 18)" (Playful 7844:14386 / Focused 8110:46548)
 * and ?state=invite (ST-08b, the "Link a parent or guardian" form replaces the linked card).
 * NOTE: the page subtitle for this section ("Shown to talents under 18. …") is drawn in the frame
 * header — see GUARDIAN_COPY.subtitle; SettingsLayout owns the heading.
 */
const RELATION_LABELS = {
  mother: 'Mother',
  father: 'Father',
  guardian: 'Guardian',
  older_sibling: 'Older sibling',
  other: 'Family',
};
const when = (iso, opts) => (iso ? new Date(iso).toLocaleString('en-GB', opts) : '');

/*
 * Live link code (POST /parent/link-code): a 6-character code the talent gives a parent, who types it in
 * "Link a ward" on their account. One code at a time: making a new one replaces the old; it works once and
 * expires after 24 hours. The code is only shown here (the server keeps a hash).
 */
const LinkCodeCard = ({ onLinked }) => {
  const [code, setCode] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const make = async () => {
    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      const out = await createParentLinkCode();
      log('link code made', { expiresAt: out?.expiresAt });
      setCode(out);
      onLinked?.();
    } catch (err) {
      setError(parentError(err, 'Could not make a code. Try again.'));
    } finally {
      setBusy(false);
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <GroupCard
      title="Link a parent or guardian with a code"
      description="Give this code to your parent or guardian. They type it in Link a ward on their GTH account. It works once and expires after 24 hours."
      data-settings-card="link-code"
    >
      {code ? (
        <div className="flex w-full flex-col items-start gap-[12px] border-t border-[rgba(28,42,33,0.08)] py-[14px]">
          <p
            aria-label={`Your code: ${code.code.split('').join(' ')}`}
            className="rounded-[12px] bg-[#f3f6f3] px-[18px] py-[10px] font-mono text-[28px] leading-none font-bold tracking-[6px] text-[#1c2a21]"
          >
            {code.code}
          </p>
          <div className="flex w-full flex-wrap items-center justify-between gap-x-[16px] gap-y-[8px]">
            <div className="flex min-w-0 flex-col gap-[2px]">
              <p className="text-[14px] font-semibold text-[#1c2a21]">
                Expires{' '}
                {when(code.expiresAt, {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-[13px] text-[#595959]">Making a new code turns this one off.</p>
            </div>
            <div className="flex items-center gap-[12px]">
              <TextAction tone="green" onClick={copy}>
                {copied ? 'Copied' : 'Copy'}
              </TextAction>
              <TextAction tone="green" onClick={make}>
                {busy ? 'Making…' : 'New code'}
              </TextAction>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full pt-[4px]">
          <Button type="button" variant="primary" size="lg" disabled={busy} onClick={make}>
            {busy ? 'Making a code…' : 'Make a code'}
          </Button>
        </div>
      )}
      {error ? (
        <p role="alert" className="text-[14px] font-medium text-[#c0392b]">
          {error}
        </p>
      ) : null}
    </GroupCard>
  );
};

/** The linked parents and guardians (GET /parent/my-guardians). */
const useGuardians = () => {
  const [state, setState] = useState({ status: 'loading', guardians: [] });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    fetchMyGuardians()
      .then((out) => alive && setState({ status: 'ready', guardians: out?.guardians || [] }))
      .catch(() => alive && setState({ status: 'error', guardians: [] }));
    return () => {
      alive = false;
    };
  }, [tick]);
  return { ...state, reload: () => setTick((n) => n + 1) };
};

/*
 * Live (GET /settings/overview `guardian`): talents 18+ get a short "not needed" note. Under-18s see their linked
 * parents and guardians (GET /parent/my-guardians), or the parent email from onboarding while nobody has linked, and
 * a link code to give a parent. The approval toggles have no talent-side backend yet, so they are read-only notes.
 */
const GuardianLive = ({ guardian, isMinor }) => {
  const linked = useGuardians();
  if (!isMinor) {
    return (
      <div className="flex w-full flex-col gap-[20px]" data-settings-section="guardian">
        <GroupCard title="Parent or guardian">
          <SettingRow
            top={false}
            title="Not needed for your account"
            description="Only talents under 18 link a parent or guardian. You manage your account yourself."
          />
        </GroupCard>
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="guardian">
      {linked.guardians.length ? (
        <GroupCard title={GUARDIAN_COPY.linked.title}>
          {linked.guardians.map((g) => (
            <div
              key={g.linkId}
              className="flex w-full items-center gap-[14px] border-t border-[rgba(28,42,33,0.08)] py-[14px]"
            >
              <span
                aria-hidden="true"
                className="flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-[#ffd86b] text-[#1c2a21]"
              >
                <SettingsPersonIcon className="size-[21px]" />
              </span>
              <div className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-[2px]">
                <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px]">
                  <p className="text-[15px] leading-[normal] font-semibold text-[#1c2a21]">
                    {g.name}
                  </p>
                  <StatusPill tone="on">
                    <SettingsChipCheckIcon className="size-[14px]" />
                    {GUARDIAN_COPY.linked.chip}
                  </StatusPill>
                </div>
                <p className="text-[13px] leading-[normal] text-[#595959]">
                  {[
                    RELATION_LABELS[g.relationship] || 'Parent or guardian',
                    g.linkedAt
                      ? `linked ${when(g.linkedAt, { day: 'numeric', month: 'short', year: 'numeric' })}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
            </div>
          ))}
        </GroupCard>
      ) : null}
      <LinkCodeCard onLinked={linked.reload} />
      {linked.guardians.length ? null : (
        <GroupCard title={GUARDIAN_COPY.linked.title}>
          <div className="flex w-full items-center gap-[14px] border-t border-[rgba(28,42,33,0.08)] py-[14px]">
            <span
              aria-hidden="true"
              className="flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-[#ffd86b] text-[#1c2a21]"
            >
              <SettingsPersonIcon className="size-[21px]" />
            </span>
            <div className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-[2px]">
              <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px]">
                <p className="text-[15px] leading-[normal] font-semibold text-[#1c2a21]">
                  {guardian.email || 'No parent or guardian email yet'}
                </p>
                {guardian.linked ? (
                  <StatusPill tone="on">
                    <SettingsChipCheckIcon className="size-[14px]" />
                    {GUARDIAN_COPY.linked.chip}
                  </StatusPill>
                ) : null}
              </div>
              <p className="text-[13px] leading-[normal] text-[#595959]">
                {guardian.linked
                  ? 'Your parent or guardian has set up their account.'
                  : 'We sent them an invite. They can approve with one tap.'}
              </p>
            </div>
          </div>
        </GroupCard>
      )}
      <GroupCard
        title={GUARDIAN_COPY.approves.title}
        description={GUARDIAN_COPY.approves.description}
      >
        <SettingRow
          title={GUARDIAN_COPY.approves.certificates.title}
          description={GUARDIAN_COPY.approves.certificates.description}
          control={
            <Chip icon={<TalentHomeChipLockIcon />}>
              {GUARDIAN_COPY.approves.certificates.chip}
            </Chip>
          }
        />
        <SettingRow
          top={false}
          title="Need to change your parent or guardian?"
          description="Contact support from Help and support and we will help you switch."
        />
      </GroupCard>
      <GroupCard title={GUARDIAN_COPY.turning18.title}>
        <SettingRow
          top={false}
          title={GUARDIAN_COPY.turning18.rowTitle}
          description={GUARDIAN_COPY.turning18.rowDescription}
        />
      </GroupCard>
    </div>
  );
};

const SettingsGuardian = ({ settings }) => {
  if (settings?.live?.overview) {
    return (
      <GuardianLive
        guardian={settings.live.overview.guardian || {}}
        isMinor={Boolean(settings.live.overview.account?.isMinor)}
      />
    );
  }
  return <SettingsGuardianDemo settings={settings} />;
};

const SettingsGuardianDemo = ({ settings }) => {
  const { state, update } = settings;
  const copy = GUARDIAN_COPY;
  const [wallet, setWallet] = useState(true);
  const [flags, setFlags] = useState(true);
  const inviting = state === 'invite';

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="guardian">
      <div className="flex w-full items-center gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px] text-[#463409]">
        <SettingsInfoCircleIcon className="size-[20px] shrink-0" />
        <p className="min-w-0 flex-[1_0_0] text-[14px] leading-[1.45] font-medium">
          {copy.example}
        </p>
      </div>

      {inviting ? (
        <InviteCard onSent={() => update({ state: null })} />
      ) : (
        <GroupCard title={copy.linked.title}>
          <div className="flex w-full items-center gap-[14px] border-t border-[rgba(28,42,33,0.08)] py-[14px]">
            <span
              aria-hidden="true"
              className="flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-[#ffd86b] text-[#1c2a21]"
            >
              <SettingsPersonIcon className="size-[21px]" />
            </span>
            <div className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-[2px]">
              <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px]">
                <p className="text-[15px] leading-[normal] font-semibold whitespace-nowrap text-[#1c2a21]">
                  {copy.linked.name}
                </p>
                <StatusPill tone="on">
                  <SettingsChipCheckIcon className="size-[14px]" />
                  {copy.linked.chip}
                </StatusPill>
              </div>
              <p className="text-[13px] leading-[normal] text-[#595959]">{copy.linked.meta}</p>
            </div>
            <TextAction tone="green" onClick={() => update({ state: 'invite' })}>
              {copy.linked.change}
            </TextAction>
          </div>
        </GroupCard>
      )}

      <GroupCard title={copy.approves.title} description={copy.approves.description}>
        <SettingRow
          title={copy.approves.certificates.title}
          description={copy.approves.certificates.description}
          control={<Chip icon={<TalentHomeChipLockIcon />}>{copy.approves.certificates.chip}</Chip>}
        />
        <SettingRow
          title={copy.approves.wallet.title}
          titleId="guardian-wallet"
          description={copy.approves.wallet.description}
          control={
            <SettingsToggle labelledBy="guardian-wallet" checked={wallet} onChange={setWallet} />
          }
        />
        <SettingRow
          top={false}
          title={copy.approves.flags.title}
          titleId="guardian-flags"
          description={copy.approves.flags.description}
          control={
            <SettingsToggle labelledBy="guardian-flags" checked={flags} onChange={setFlags} />
          }
        />
      </GroupCard>

      <GroupCard title={copy.turning18.title}>
        <SettingRow
          top={false}
          title={copy.turning18.rowTitle}
          description={copy.turning18.rowDescription}
        />
      </GroupCard>
    </div>
  );
};

export default SettingsGuardian;
