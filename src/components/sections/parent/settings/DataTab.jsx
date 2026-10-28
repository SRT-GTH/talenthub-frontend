import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import {
  DeleteAccountButton,
  GroupCard,
  SettingRow,
  SettingsToggle,
} from '../../talentSettings/SettingsBUi.jsx';
import ParentButton from '../ParentButton.jsx';
import { DATA } from './data/settingsData.js';

const log = debug('SettingsDataTab');

/*
 * DataTab — PS-05 "Settings · Data and account (parent)" (Figma 10046:3910): "Your data" (request a ZIP, download the ward progress report), "Take a break" (a switch) and the red-bordered
 * "Close my parent account" card whose button opens the confirm dialog (PS-07, `?modal=close-account`).
 * Props: onClose (opens the dialog). ⚠️ ASSUMPTION: "Request download" and "Download PDF" only log (no screen is drawn for them).
 */
const DataTab = ({ onClose }) => {
  const [pause, setPause] = useState(false);

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="data">
      <GroupCard title={DATA.yourData.title} description={DATA.yourData.desc}>
        <SettingRow
          nowrapControl={false}
          title={DATA.yourData.download.title}
          description={DATA.yourData.download.desc}
          control={
            <ParentButton
              variant="secondary"
              onClick={() => log('request download (no screen drawn)')}
            >
              {DATA.yourData.download.cta}
            </ParentButton>
          }
        />
        <SettingRow
          top={false}
          nowrapControl={false}
          title={DATA.yourData.report.title}
          description={DATA.yourData.report.desc}
          control={
            <ParentButton variant="secondary" onClick={() => log('download PDF (no screen drawn)')}>
              {DATA.yourData.report.cta}
            </ParentButton>
          }
        />
      </GroupCard>

      <GroupCard title={DATA.pause.title}>
        <SettingRow
          top={false}
          title={DATA.pause.row}
          titleId="data-pause"
          description={DATA.pause.desc}
          control={<SettingsToggle labelledBy="data-pause" checked={pause} onChange={setPause} />}
        />
      </GroupCard>

      <GroupCard
        title={DATA.close.title}
        description={DATA.close.desc}
        danger="delete"
        gap="gap-[4px]"
      >
        <SettingRow
          top
          nowrapControl={false}
          title={DATA.close.row}
          description={DATA.close.rowDesc}
          control={
            <DeleteAccountButton
              onClick={() => {
                log('close parent account -> confirm dialog');
                onClose?.();
              }}
            >
              {DATA.close.cta}
            </DeleteAccountButton>
          }
        />
      </GroupCard>
    </div>
  );
};

export default DataTab;
