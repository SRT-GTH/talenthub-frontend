import { useState } from 'react';
import { debug } from '../../../utils/debug.js';
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
const SettingsGuardian = ({ settings }) => {
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
