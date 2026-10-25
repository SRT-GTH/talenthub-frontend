import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { SettingsTrashIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import { SettingsACard, SettingsARow, SettingsAToggle } from '../../talentSettings/SettingsAUi.jsx';
import { GroupCard } from '../../talentSettings/SettingsBUi.jsx';
import InstitutionCloseAccountDialog from './InstitutionCloseAccountDialog.jsx';
import { DATA_COPY, TOASTS } from './data/institutionSettingsData.js';

const log = debug('InstitutionDataTab');

/*
 * InstitutionDataTab — Figma 11.6.1d "Settings · Data and retention" (8597:397433): "Student data you hold" (request a records ZIP, audit log PDF),
 * "Pause the account" (switch) and the red "Close the account" card. `revised` = the copy of 11.6.1f (8746:688, the Data tab behind the remove-staff
 * dialog): "Data you hold", "Export log", other pause / close lines, a cream "Remove access" button (kept as drawn; shown only while that dialog is open).
 * Mock interactions (⚠️ ASSUMPTION: no frame draws their results): Request download and Download PDF show a toast, the switch pauses the account (toast),
 * Close account opens a confirmation dialog whose confirm button only shows a toast (nothing is closed). The "Audit log" title links to the audit log
 * (11.6.1g), which no nav item reaches. Props: revised, onToast(toast).
 */
const InstitutionDataTab = ({ revised, onToast }) => {
  const copy = DATA_COPY[revised ? 'rev' : 'base'];
  const [paused, setPaused] = useState(false);
  const [closing, setClosing] = useState(false);

  const togglePause = (next) => {
    log('pause', next);
    setPaused(next);
    onToast(next ? TOASTS.paused : TOASTS.resumed);
  };

  return (
    <>
      <SettingsACard title={copy.hold.title} desc={copy.hold.desc}>
        <SettingsARow first title={copy.hold.download.title} desc={copy.hold.download.desc}>
          <Button
            variant="tertiary"
            size="lg"
            className="shrink-0"
            onClick={() => {
              log('request download');
              onToast(TOASTS.downloadRequested);
            }}
          >
            {copy.hold.download.cta}
          </Button>
        </SettingsARow>
        <SettingsARow
          title={
            <Link
              to="/institution/settings/audit-log"
              className="inline-flex min-h-[24px] items-center text-inherit no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {copy.hold.audit.title}
            </Link>
          }
          desc={copy.hold.audit.desc}
        >
          <Button
            variant="tertiary"
            size="lg"
            className="shrink-0"
            onClick={() => {
              log('download audit pdf');
              onToast(TOASTS.pdf);
            }}
          >
            {copy.hold.audit.cta}
          </Button>
        </SettingsARow>
      </SettingsACard>

      <SettingsACard title={copy.pause.title}>
        <SettingsARow first title={copy.pause.row} desc={copy.pause.desc}>
          <SettingsAToggle on={paused} label={copy.pause.row} onChange={togglePause} />
        </SettingsARow>
      </SettingsACard>

      <GroupCard
        title={copy.close.title}
        description={copy.close.desc}
        danger={revised ? 'paused' : 'default'}
        gap="gap-[4px]"
      >
        <div className="flex w-full flex-wrap items-center gap-x-[16px] gap-y-[10px] border-t border-[rgba(28,42,33,0.08)] py-[14px]">
          <div className="flex min-w-0 flex-[1_1_240px] flex-col items-start gap-[3px] leading-[normal]">
            <p className="text-[15px] font-semibold text-[#1c2a21]">{copy.close.row}</p>
            <p className="text-[13.5px] text-[#595959]">{copy.close.rowDesc}</p>
          </div>
          <button
            type="button"
            onClick={() => setClosing(true)}
            className={classNames(
              'inline-flex h-[47px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] px-[20px] text-[15px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
              revised ? 'bg-[#faf4e8] text-[#c0392b]' : 'bg-[#c0392b] text-white'
            )}
          >
            <SettingsTrashIcon className="size-[20px] shrink-0 text-[#387440]" />
            {copy.close.cta}
          </button>
        </div>
      </GroupCard>

      {closing ? (
        <InstitutionCloseAccountDialog
          onClose={() => setClosing(false)}
          onConfirm={() => {
            log('close account (mock)');
            setClosing(false);
            onToast(TOASTS.closed);
          }}
        />
      ) : null}
    </>
  );
};

export default InstitutionDataTab;
