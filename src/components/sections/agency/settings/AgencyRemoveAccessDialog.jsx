import { SettingsCloseXIcon, SettingsTrashIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import { SettingsDialog } from '../../talentSettings/SettingsBDialogs.jsx';
import AgencySettingsInfoBox from './AgencySettingsInfoBox.jsx';
import { AgencySettingsInfoIcon } from './agencySettingsIcons.jsx';

/*
 * AgencyRemoveAccessDialog — Figma 11.6.1d "Remove analyst access" (8611:1787, 520 wide, r24, p28): red trash tile, "Remove <name>’s access?",
 * "What happens:" list with red crosses, cream info box, Cancel / "Remove access". Focus is trapped, Esc closes, focus returns to the opener.
 * Figma also draws a "Type DELETE" field that is hidden (visible:false): not rendered.
 * Props: analyst (from ANALYSTS), actorName, onClose, onConfirm.
 */
const AgencyRemoveAccessDialog = ({ analyst, actorName, onClose, onConfirm }) => {
  if (!analyst) return null;
  const p = analyst.pronoun ?? { subject: 'They’re', possessive: 'Their' };
  const requests = analyst.requests ?? 0;
  const items = [
    `${p.subject} signed out right away`,
    `${p.possessive} ${analyst.queries ?? 0} saved queries move to ${actorName}`,
    `${requests} pending data request${requests === 1 ? '' : 's'} ${requests === 1 ? 'moves' : 'move'} to you`,
    'This frees 1 analyst seat',
  ];
  return (
    <SettingsDialog
      open
      title={`Remove ${analyst.name}’s access?`}
      icon={<SettingsTrashIcon className="size-[20px] text-[#902b20]" />}
      iconTone="bg-[#f9ebea]"
      onClose={onClose}
      widthClass="w-[520px]"
    >
      <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">What happens:</p>
      <ul className="m-0 flex list-none flex-col gap-[20px] p-0">
        {items.map((t) => (
          <li
            key={t}
            className="flex items-center gap-[10px] text-[14px] leading-[17px] text-[#1c2a21]"
          >
            <SettingsCloseXIcon className="size-[16px] shrink-0 text-[#902b20]" />
            {t}
          </li>
        ))}
      </ul>
      <AgencySettingsInfoBox icon={<AgencySettingsInfoIcon className="size-[18px]" />}>
        {`${p.possessive} past views and downloads stay in the audit log.`}
      </AgencySettingsInfoBox>
      <div className="flex flex-wrap items-center gap-[12px] pt-[8px]">
        <Button variant="tertiary" size="lg" className="min-w-[120px] flex-1" onClick={onClose}>
          Cancel
        </Button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex h-[46px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-white px-[20px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#c0392b] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <SettingsTrashIcon className="size-[20px] shrink-0 text-[#387440]" />
          Remove access
        </button>
      </div>
    </SettingsDialog>
  );
};

export default AgencyRemoveAccessDialog;
