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
// Live (`live` = { download() }): "Request download" saves a JSON copy of the account (GET /settings/export). The ward
// progress PDF and "Take a break" have no parent backend yet, so live hides them.
const DataTab = ({ onClose, live = null }) => {
  const [pause, setPause] = useState(false);
  const [status, setStatus] = useState(null);

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
              onClick={async () => {
                if (!live) {
                  log('request download (no screen drawn)');
                  return;
                }
                setStatus('Preparing your copy…');
                try {
                  await live.download();
                  setStatus('Downloaded.');
                } catch (err) {
                  setStatus(err?.message || 'Could not download. Try again.');
                }
              }}
            >
              {DATA.yourData.download.cta}
            </ParentButton>
          }
        />
        {status ? (
          <p role="status" className="m-0 font-sans text-[13px] text-[#575755]">
            {status}
          </p>
        ) : null}
        {live ? null : (
          <SettingRow
            top={false}
            nowrapControl={false}
            title={DATA.yourData.report.title}
            description={DATA.yourData.report.desc}
            control={
              <ParentButton
                variant="secondary"
                onClick={() => log('download PDF (no screen drawn)')}
              >
                {DATA.yourData.report.cta}
              </ParentButton>
            }
          />
        )}
      </GroupCard>

      {live ? null : (
        <GroupCard title={DATA.pause.title}>
          <SettingRow
            top={false}
            title={DATA.pause.row}
            titleId="data-pause"
            description={DATA.pause.desc}
            control={<SettingsToggle labelledBy="data-pause" checked={pause} onChange={setPause} />}
          />
        </GroupCard>
      )}

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
