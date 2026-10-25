import { SettingsCloseXIcon, SettingsTrashIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import { SettingsDialog } from '../../talentSettings/SettingsBDialogs.jsx';
import InstitutionSettingsInfoBox from './InstitutionSettingsInfoBox.jsx';
import { InstitutionSettingsInfoIcon } from './institutionSettingsIcons.jsx';

const plural = (n, one) => `${n} ${one}${n === 1 ? '' : 's'}`;

/*
 * InstitutionRemoveStaffDialog — Figma 11.6.1f "Remove Kwame Asante’s access?" (8746:917, 520 wide, r24, p28): red trash tile, title, "What happens:" list
 * with red crosses, cream info box, Cancel / "Remove access". Focus is trapped, Esc closes, focus returns to the opener (SettingsDialog).
 * Figma also draws a "Type DELETE" field that is hidden (an empty 80px gap in the frame): not rendered. Lines for 0 draft credentials / 0 revocations are
 * left out (⚠️ ASSUMPTION; the frame only draws Kwame). Props: member (from STAFF), actorName, onClose, onConfirm.
 */
const InstitutionRemoveStaffDialog = ({ member, actorName, onClose, onConfirm }) => {
  if (!member) return null;
  const p = member.pronoun ?? { subject: 'They’re', possessive: 'Their', he: 'they' };
  const drafts = member.drafts ?? 0;
  const revocations = member.revocations ?? 0;
  const items = [
    `${p.subject} signed out right away`,
    drafts > 0
      ? `${p.possessive} ${plural(drafts, 'draft credential')} ${drafts === 1 ? 'moves' : 'move'} to ${actorName}`
      : null,
    revocations > 0
      ? `${plural(revocations, 'revocation')} ${p.he} started ${revocations === 1 ? 'is' : 'are'} cancelled`
      : null,
    'This frees 1 staff seat',
  ].filter(Boolean);
  return (
    <SettingsDialog
      open
      title={`Remove ${member.name}’s access?`}
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
      <InstitutionSettingsInfoBox icon={<InstitutionSettingsInfoIcon className="size-[18px]" />}>
        {`${p.possessive} past views and downloads stay in the audit log.`}
      </InstitutionSettingsInfoBox>
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

export default InstitutionRemoveStaffDialog;
