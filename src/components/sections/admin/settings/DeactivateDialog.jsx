import { SettingsCloseXIcon, SettingsTrashIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import AgencySettingsInfoBox from '../../agency/settings/AgencySettingsInfoBox.jsx';
import { AgencySettingsInfoIcon } from '../../agency/settings/agencySettingsIcons.jsx';
import { SettingsDialog } from '../../talentSettings/SettingsBDialogs.jsx';
import { DEACTIVATE } from './data/adminSettingsData.js';

/*
 * DeactivateDialog — "Deactivate Kweku Ansah?" (Figma 7.5.1c 8639:1034, the talent "Delete account" modal: 520 wide, r24, p28): red trash tile · title 24/600 · "What happens:"
 * with four red-cross lines · cream info box · Cancel / "Deactivate" (white, green trash). Figma leaves a gap under the info box (a hidden reason field): not drawn.
 * Props: onClose, onConfirm.
 */

const DeactivateDialog = ({ onClose, onConfirm }) => (
  <SettingsDialog
    open
    title={DEACTIVATE.title}
    icon={<SettingsTrashIcon className="size-[20px] text-[#902b20]" />}
    iconTone="bg-[#f9ebea]"
    onClose={onClose}
    widthClass="w-[520px]"
    gap="gap-[16px]"
  >
    <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">What happens:</p>
    <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
      {DEACTIVATE.happens.map((t) => (
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
      {DEACTIVATE.info}
    </AgencySettingsInfoBox>
    <div className="flex flex-wrap items-center gap-[12px] pt-[48px]">
      <Button variant="tertiary" size="lg" className="min-w-[120px] flex-1" onClick={onClose}>
        {DEACTIVATE.cancel}
      </Button>
      <button
        type="button"
        onClick={onConfirm}
        className="inline-flex h-[46px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-white px-[20px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <SettingsTrashIcon className="size-[20px] shrink-0 text-[#387440]" />
        {DEACTIVATE.submit}
      </button>
    </div>
  </SettingsDialog>
);

export default DeactivateDialog;
