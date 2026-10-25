import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { Select, TextInput } from '../../../ui/form';
import { GroupCard, SettingRow, SettingsToggle, TextAction } from '../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import { useAdminData, useAdminToast } from '../useAdminData.js';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import { adminError, configHistory, humanize, listConfig, shortDate, toggleFlag, updateConfig } from '../../../../services/admin.api.js';

const log = debug('PlatformConfigTab');

/*
 * PlatformConfigTab — Settings › Platform settings (Figma 7.5.2a-c) on real data: GET /api/admin/config (Super Admin), grouped by category.
 *   Feature flags   switch → reason → POST /config/flags/:key/toggle. The backend sends feature_flag-category toggles for a second approval
 *                   (which it never executes yet), so the dialog says so; operational / integration flags change straight away.
 *   Other settings  "Change" → new value + reason → PATCH /config/:key. Sensitive values stay hidden (the backend masks them).
 *   History         GET /config/:key/history (previous / new value, who, when, reason).
 */

const GROUPS = [
  { id: 'feature_flag', title: 'Feature flags', sub: 'Turn platform features on or off. Changes are logged with your reason.' },
  { id: 'operational', title: 'Operations', sub: 'Maintenance mode and session rules.' },
  { id: 'threshold', title: 'Limits and thresholds', sub: 'Numbers the platform uses for approvals, exports, moderation and onboarding.' },
  { id: 'integration', title: 'Integrations', sub: 'IDs for connected services. Values are hidden; you can replace them.' },
];

const label = (key) => humanize(String(key).split('.').slice(1).join(' ') || key);
const show = (c) => (c.isSensitive ? 'Hidden' : typeof c.value === 'boolean' ? (c.value ? 'On' : 'Off') : String(c.value ?? '—'));

const PlatformConfigTab = () => {
  const cfg = useAdminData(() => listConfig(), []);
  const [toastEl, toast] = useAdminToast();
  const [dialog, setDialog] = useState(null); // { kind: 'toggle' | 'edit' | 'history', c }
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const hist = useAdminData(
    () => (dialog?.kind === 'history' ? configHistory(dialog.c.key) : Promise.resolve(null)),
    [dialog?.kind, dialog?.c?.key],
  );
  const configs = cfg.data?.configs ?? [];

  const open = (kind, c) => {
    setError('');
    setReason('');
    setValue(kind === 'edit' ? (c.isSensitive ? '' : String(c.value ?? '')) : '');
    setDialog({ kind, c });
  };
  const close = () => setDialog(null);
  const run = async () => {
    if (busy) return;
    if (reason.trim().length < 3) {
      setError('Give a reason (it’s logged).');
      return;
    }
    const c = dialog.c;
    log(dialog.kind, c.key);
    setBusy(true);
    setError('');
    try {
      if (dialog.kind === 'toggle') {
        const res = await toggleFlag(c.key, !c.value, reason.trim());
        if (res?.status === 'pending_approval') toast('Sent for approval', `${label(c.key)} changes once a second Super Admin approves.`, 'info');
        else toast(`${label(c.key)} ${!c.value ? 'on' : 'off'}`, 'The change is live.');
      } else {
        let v = value;
        if (c.valueType === 'number') v = Number(value);
        if (c.valueType === 'boolean') v = value === 'true';
        if (c.valueType === 'number' && !Number.isFinite(v)) throw new Error('Enter a number.');
        await updateConfig(c.key, v, reason.trim());
        toast('Setting saved', `${label(c.key)} updated.`);
      }
      close();
      cfg.reload();
    } catch (e) {
      setError(e?.response ? adminError(e) : e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminLoadNotice loading={cfg.loading} error={cfg.error} status={cfg.status} onRetry={cfg.reload}>
        {GROUPS.map((g) => {
          // JSON settings (like the onboarding template) have their own editors.
          const items = configs.filter((c) => c.valueType !== 'json' && (c.category === g.id || (g.id === 'operational' && !GROUPS.some((x) => x.id === c.category))));
          if (!items.length) return null;
          return (
            <GroupCard key={g.id} title={g.title} description={g.sub} gap="gap-0" danger={g.id === 'integration'}>
              {items.map((c) => (
                <SettingRow
                  key={c.key}
                  title={label(c.key)}
                  description={`${c.description || c.key} · ${show(c)}${c.lastModifiedAt ? ` · changed ${shortDate(c.lastModifiedAt)}` : ''}`}
                  top
                  control={
                    <div className="flex items-center gap-[14px]">
                      <TextAction tone="green" onClick={() => open('history', c)}>
                        History
                      </TextAction>
                      {c.isFeatureFlag || c.valueType === 'boolean' ? (
                        <SettingsToggle checked={Boolean(c.value)} onChange={() => open('toggle', c)} label={label(c.key)} />
                      ) : (
                        <TextAction tone="green" onClick={() => open('edit', c)}>
                          Change
                        </TextAction>
                      )}
                    </div>
                  }
                />
              ))}
            </GroupCard>
          );
        })}
      </AdminLoadNotice>

      {dialog?.kind === 'toggle' ? (
        <AdminConfirmDialog
          title={`Turn ${label(dialog.c.key)} ${dialog.c.value ? 'off' : 'on'}?`}
          body={
            dialog.c.category === 'feature_flag'
              ? 'Feature flag changes need a second Super Admin to approve them before they take effect.'
              : 'This takes effect straight away for everyone.'
          }
          primary={{ label: busy ? 'Saving…' : dialog.c.value ? 'Turn off' : 'Turn on', tone: dialog.c.value ? 'red' : 'green' }}
          secondary="Cancel"
          onPrimary={run}
          onClose={close}
        >
          <TextInput label="Reason (logged)" required value={reason} onChange={(e) => setReason(e.target.value)} error={error || undefined} />
        </AdminConfirmDialog>
      ) : null}
      {dialog?.kind === 'edit' ? (
        <AdminConfirmDialog
          title={`Change ${label(dialog.c.key)}`}
          body={`${dialog.c.description || dialog.c.key}. Current value: ${show(dialog.c)}.`}
          primary={{ label: busy ? 'Saving…' : 'Save', arrow: true }}
          secondary="Cancel"
          onPrimary={run}
          onClose={close}
        >
          <div className="flex flex-col gap-[12px]">
            {dialog.c.valueType === 'boolean' ? (
              <Select label="New value" required options={['true', 'false']} value={value} onChange={setValue} />
            ) : (
              <TextInput
                label="New value"
                required
                type={dialog.c.valueType === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            )}
            <TextInput label="Reason (logged)" required value={reason} onChange={(e) => setReason(e.target.value)} error={error || undefined} />
          </div>
        </AdminConfirmDialog>
      ) : null}
      {dialog?.kind === 'history' ? (
        <AdminConfirmDialog
          title={`${label(dialog.c.key)} history`}
          body={hist.loading ? 'Loading…' : `${hist.data?.totalChanges ?? 0} changes.`}
          primary={{ label: 'Close' }}
          secondary="Done"
          onPrimary={close}
          onClose={close}
        >
          <ul className="m-0 flex max-h-[300px] list-none flex-col gap-[10px] overflow-auto p-0">
            {(hist.data?.history ?? []).map((h, i) => (
              <li key={i} className="rounded-[12px] bg-[#f8f8f4] p-[10px] font-sans text-[13px] leading-[18px] text-[#1c2a21]">
                <strong>
                  {dialog.c.isSensitive ? 'Changed' : `${String(h.previousValue)} → ${String(h.newValue)}`}
                </strong>
                <span className="block text-[#737373]">
                  {shortDate(h.modifiedAt)} · {String(h.modifiedBy || '').slice(-8)} · {h.reason}
                </span>
              </li>
            ))}
            {hist.error ? <li className="text-[13px] text-[#902b20]">{hist.error}</li> : null}
          </ul>
        </AdminConfirmDialog>
      ) : null}
      {toastEl}
    </>
  );
};

export default PlatformConfigTab;
