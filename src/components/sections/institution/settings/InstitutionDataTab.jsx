import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { SettingsTrashIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import { SettingsACard, SettingsARow, SettingsAToggle } from '../../talentSettings/SettingsAUi.jsx';
import { GroupCard } from '../../talentSettings/SettingsBUi.jsx';
import { openApiFile } from '../../../../services/agency.api.js';
import {
  apiMessage,
  institutionAuditExport,
  institutionCloseRequest,
  institutionDataState,
  institutionRosterExport,
  institutionSetPaused,
} from '../../../../services/institutionPortal.api.js';
import InstitutionCloseAccountDialog from './InstitutionCloseAccountDialog.jsx';
import { DATA_COPY, TOASTS } from './data/institutionSettingsData.js';

const log = debug('InstitutionDataTab');

const day = (iso) =>
  iso
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(iso)
      )
    : '';

/*
 * InstitutionDataTab — Figma 11.6.1d "Settings · Data and retention" (8597:397433); `revised` = the copy of 11.6.1f (8746:688, behind the remove-staff dialog).
 * Live: "Download your roster" (POST /institution/roster/export, CSV, logged; under-18s without a guardian's agreement leave as initials), the audit log
 * CSV (POST /institution/audit/export), "Pause institution account" (PATCH /institution/settings/pause: a flag programmes will respect; staff keep access),
 * and "Close account", which sends a close request to the GTH team (POST /institution/settings/close-request): nothing closes until GTH confirms.
 * Pause and close are admin only. Props: revised, onToast(toast).
 */
const InstitutionDataTab = ({ revised, onToast }) => {
  const copy = DATA_COPY[revised ? 'rev' : 'base'];
  const [state, setState] = useState(null);
  const [closing, setClosing] = useState(false);
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    try {
      setState(await institutionDataState());
    } catch (err) {
      onToast({ ...TOASTS.failed, body: apiMessage(err) });
    }
  }, [onToast]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (key, fn) => {
    if (busy) return;
    setBusy(key);
    try {
      await fn();
    } catch (err) {
      onToast({ ...TOASTS.failed, body: apiMessage(err) });
    } finally {
      setBusy('');
    }
  };

  const download = (key, call) =>
    run(key, async () => {
      const file = await call();
      openApiFile(file);
      log('download', key, file.rows);
      onToast({
        ...TOASTS.exported,
        body: `${file.fileName} · ${file.rows} rows. Every export is logged.`,
      });
    });

  const togglePause = (next) =>
    run('pause', async () => {
      setState(await institutionSetPaused(next));
      onToast(next ? TOASTS.paused : TOASTS.resumed);
    });

  const canManage = Boolean(state?.canManage);
  const requested = state?.closeRequest;

  return (
    <>
      <SettingsACard title={copy.hold.title} desc={copy.hold.desc}>
        <SettingsARow first title={copy.hold.download.title} desc={copy.hold.download.desc}>
          <Button
            variant="tertiary"
            size="lg"
            className="shrink-0"
            disabled={busy === 'roster'}
            onClick={() => download('roster', institutionRosterExport)}
          >
            {busy === 'roster' ? 'Preparing…' : copy.hold.download.cta}
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
            disabled={busy === 'audit'}
            onClick={() => download('audit', () => institutionAuditExport('all'))}
          >
            {busy === 'audit' ? 'Preparing…' : copy.hold.audit.cta}
          </Button>
        </SettingsARow>
      </SettingsACard>

      <SettingsACard title={copy.pause.title}>
        <SettingsARow
          first
          title={copy.pause.row}
          desc={
            state?.paused
              ? `Paused ${day(state.pausedAt)}. ${copy.pause.desc}`
              : canManage
                ? copy.pause.desc
                : `${copy.pause.desc} Only admins can change this.`
          }
        >
          <SettingsAToggle
            on={Boolean(state?.paused)}
            label={copy.pause.row}
            disabled={!canManage || busy === 'pause'}
            onChange={togglePause}
          />
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
            <p className="text-[15px] font-semibold text-[#1c2a21]">
              {requested
                ? `Close requested ${day(requested.at)} by ${requested.by}`
                : copy.close.row}
            </p>
            <p className="text-[13.5px] text-[#595959]">
              {requested
                ? 'The GTH team confirms with you before anything is closed.'
                : copy.close.rowDesc}
            </p>
          </div>
          {canManage && !requested ? (
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
          ) : null}
        </div>
      </GroupCard>

      {closing ? (
        <InstitutionCloseAccountDialog
          onClose={() => setClosing(false)}
          onConfirm={(reason) =>
            run('close', async () => {
              setState(await institutionCloseRequest(reason));
              setClosing(false);
              onToast(TOASTS.closed);
            })
          }
        />
      ) : null}
    </>
  );
};

export default InstitutionDataTab;
