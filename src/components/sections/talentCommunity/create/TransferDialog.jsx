import { useId, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { DialogShell } from '../CommunityDialogParts.jsx';
import { fillCopy } from '../communityDialogUtils.js';
import { TRANSFER_COPY } from './createCommunityData.js';
import { CheckRow, DialogHead, IconRow, Section } from './CreateDialogParts.jsx';
import {
  CcClockIcon,
  CcHourglassIcon,
  CcShieldIcon,
  CcUserIcon,
  CcUsersIcon,
} from './CreateCommunityIcons.jsx';
import {
  FOCUS_RING,
  OPTION_BASE,
  OPTION_OFF,
  OPTION_ON,
  TILE_BASE,
  TILE_TONES,
} from './createCommunityStyles.js';

const log = debug('TransferDialog');
const POINT_ICONS = { clock: CcClockIcon, user: CcUserIcon, shield: CcShieldIcon };

/*
 * TransferDialog — "Transfer ownership" (Figma CC-16). Props: community, initialConfirmed (the drawn frame shows the box ticked),
 * onSend(moderator), onClose().
 * Only an accepted (active) co-moderator can be picked; an invited one is shown dimmed and cannot be chosen. The pending
 * transfer is sent only after the "I understand …" box is ticked.
 */
const TransferDialog = ({ community, initialConfirmed = false, onSend, onClose }) => {
  const titleId = useId();
  const checkId = useId();
  const copy = TRANSFER_COPY;
  const candidates = community.moderators.filter((m) => m.state !== 'owner');
  const firstActive = candidates.find((m) => m.state === 'active') ?? null;
  const [picked, setPicked] = useState(firstActive?.id ?? null);
  const [confirmed, setConfirmed] = useState(initialConfirmed);
  const target = candidates.find((m) => m.id === picked) ?? null;
  const first = target?.name.split(' ')[0] ?? 'they';

  return (
    <DialogShell width={680} gap={18} onClose={onClose} labelId={titleId}>
      <DialogHead id={titleId} onClose={onClose}>
        {copy.title}
      </DialogHead>
      <Section title={copy.who} className="gap-[16px]">
        <div role="radiogroup" aria-label={copy.who} className="flex flex-col gap-[16px]">
          {candidates.map((mod) => {
            const active = mod.state === 'active';
            const selected = picked === mod.id;
            const Glyph = active ? CcUsersIcon : CcHourglassIcon;
            return (
              <button
                key={mod.id}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-disabled={!active || undefined}
                disabled={!active}
                onClick={() => setPicked(mod.id)}
                className={classNames(
                  OPTION_BASE,
                  selected ? OPTION_ON : OPTION_OFF,
                  !active && 'cursor-not-allowed opacity-50',
                  FOCUS_RING
                )}
              >
                <span
                  className={classNames(TILE_BASE, selected ? TILE_TONES.white : TILE_TONES.green)}
                >
                  <Glyph className="size-[20px] text-[#387440]" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                    {mod.name}
                  </span>
                  <span className="font-sans text-[13px] leading-[18px] text-[#737373] max-lg:text-[12px]">
                    {active ? copy.adjoaDetail : copy.ransfordDetail}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    'flex size-[20px] shrink-0 items-center justify-center rounded-full border-solid',
                    selected ? 'border-2 border-[#387440]' : 'border-[1.5px] border-[#e6e6e6]'
                  )}
                >
                  {selected ? <span className="size-[10px] rounded-full bg-[#387440]" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </Section>
      <div className="flex flex-col gap-[8px]">
        {copy.points.map((point) => (
          <IconRow
            key={point.title}
            icon={POINT_ICONS[point.icon]}
            title={fillCopy(point.title, { name: target?.name.split(' ')[0] ?? 'They' })}
            body={point.body}
          />
        ))}
      </div>
      <CheckRow id={checkId} checked={confirmed} onChange={setConfirmed}>
        {fillCopy(copy.confirm, { name: first })}
      </CheckRow>
      <div className="flex flex-wrap items-center justify-end gap-[10px]">
        <Button variant="tertiary" size="lg" onClick={onClose}>
          {copy.cancel}
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={!target || !confirmed}
          onClick={() => {
            log('send', target?.id);
            onSend(target);
          }}
        >
          {copy.send}
        </Button>
      </div>
    </DialogShell>
  );
};

export default TransferDialog;
