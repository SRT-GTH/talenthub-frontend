import { useEffect, useMemo, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import {
  GroupCard,
  SettingRow,
  SettingsToggle,
  TextAction,
} from '../../talentSettings/SettingsBUi.jsx';
import SettingsBanner from '../hiring/SettingsBanner.jsx';
import SettingsFooter from '../hiring/SettingsFooter.jsx';
import { BellIcon } from '../hiring/hiringIcons.jsx';
import {
  FOOTER_COPY,
  NOTIFICATIONS_COPY as COPY,
  NOTIFICATION_ROWS,
} from '../hiring/hiringData.js';

import { isRecruiterSession } from '../../../../services/recruiterShell.api.js';
import {
  ROW_CATEGORY,
  draftFromPreferences,
  fetchNotificationPrefs,
  saveNotificationPrefs,
} from '../account/liveNotifications.js';

const log = debug('NotificationsTab');

const initialDraft = () => ({
  rows: Object.fromEntries(NOTIFICATION_ROWS.map((r) => [r.id, [...r.on]])),
  quiet: true,
});

/*
 * NotificationsTab - recruiter Settings `?tab=notifications` (Figma SR-10 10161:80671; paused SR-21 10161:84249).
 * The talent notification matrix (talentSettings/SettingsNotifications) redrawn with recruiter copy: seven rows x In app / Email / SMS as real switches (recruiter 40x22 `SettingsToggle`),
 * a Quiet hours card, and the Cancel / Save changes footer (Save stays grey until something changes, then "You have unsaved changes").
 * `?state=paused` (SR-21): the blue "Notifications paused until tomorrow, 9:00 AM" banner with "Resume now"; the drawn matrix is not dimmed ("Interview reminders still come through").
 * ⚠️ ASSUMPTION: the "Pause for 24 hours" link (bottom left) is the click path into the paused state; no control for it is drawn. Mock only, nothing is sent.
 */
const NotificationsTab = ({ settings }) => {
  const paused = settings.state === 'paused';
  const [saved, setSaved] = useState(initialDraft);
  const [draft, setDraft] = useState(initialDraft);
  const [status, setStatus] = useState(null);
  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);
  // Signed in: the recruiter's stored preferences (liveNotifications.js).
  const isLive = isRecruiterSession();
  const [prefs, setPrefs] = useState(null);
  useEffect(() => {
    if (!isLive) return undefined;
    let alive = true;
    fetchNotificationPrefs()
      .then((p) => {
        if (!alive) return;
        const next = draftFromPreferences(p, Object.keys(initialDraft().rows));
        setPrefs(p);
        setSaved(next);
        setDraft(next);
      })
      .catch((err) => {
        log.error('preferences failed:', err?.response?.status);
        if (alive)
          setStatus({ tone: 'error', text: 'We couldn’t load your notification settings.' });
      });
    return () => {
      alive = false;
    };
  }, [isLive]);

  useEffect(() => {
    log('mount', { paused });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    log('paused', paused);
  }, [paused]);

  const setCell = (id, col, on) => {
    log('cell', { id, col, on });
    setStatus(null);
    setDraft((d) => {
      // Live: rows stored on the same category switch together (New applicants and Offer responses).
      const same =
        isLive && ROW_CATEGORY[id]
          ? Object.keys(d.rows).filter((r) => ROW_CATEGORY[r] === ROW_CATEGORY[id])
          : [id];
      const rows = { ...d.rows };
      same.forEach((r) => {
        rows[r] = d.rows[r].map((v, i) => (i === col ? on : v));
      });
      return { ...d, rows };
    });
  };

  return (
    <>
      {paused ? (
        <SettingsBanner
          tone="blue"
          icon={BellIcon}
          title={COPY.paused.title}
          body={COPY.paused.body}
          actionLabel={COPY.paused.resume}
          onAction={() => {
            log('resume notifications');
            settings.update({ state: null });
          }}
          data-testid="notifications-paused-banner"
        />
      ) : null}

      <GroupCard
        recruiter
        title={COPY.matrix.title}
        description={COPY.matrix.description}
        aria-label={COPY.matrix.title}
      >
        <div aria-hidden="true" className="flex w-full justify-end gap-[12px] max-md:hidden">
          <div className="flex w-[184px] shrink-0 gap-[32px] text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#575755]">
            {COPY.channels.map((channel) => (
              <span key={channel} className="w-[40px] whitespace-nowrap">
                {channel}
              </span>
            ))}
          </div>
        </div>
        {NOTIFICATION_ROWS.map((row) => (
          <div key={row.id} className="flex w-full flex-col gap-[16px]">
            <hr className="m-0 h-px w-full border-0 bg-[#e5e8e3]" />
            <SettingRow
              recruiter
              nowrapControl={false}
              title={row.title}
              description={row.description}
              control={
                <div className="flex w-[184px] shrink-0 gap-[32px] max-md:w-full max-md:justify-between max-md:gap-[12px]">
                  {COPY.channels.map((channel, col) => (
                    <div key={channel} className="flex items-center gap-[8px]">
                      <SettingsToggle
                        recruiter
                        checked={draft.rows[row.id][col]}
                        label={`${row.title}, ${channel}`}
                        onChange={(on) => setCell(row.id, col, on)}
                      />
                      <span
                        aria-hidden="true"
                        className="text-[12px] leading-[20px] font-semibold text-[#575755] md:hidden"
                      >
                        {channel}
                      </span>
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        ))}
      </GroupCard>

      <GroupCard
        recruiter
        title={COPY.quiet.title}
        description={COPY.quiet.description}
        aria-label={COPY.quiet.title}
      >
        <SettingRow
          recruiter
          title={COPY.quiet.row}
          description={COPY.quiet.range}
          control={
            <SettingsToggle
              recruiter
              checked={draft.quiet}
              label={COPY.quiet.row}
              onChange={(on) => {
                log('quiet hours', on);
                setStatus(null);
                setDraft((d) => ({ ...d, quiet: on }));
              }}
            />
          }
        />
      </GroupCard>

      <SettingsFooter
        dirty={dirty}
        saveDisabled={!dirty}
        status={status}
        leading={
          !paused && !isLive ? (
            <TextAction
              tone="grey"
              className="min-h-[24px]"
              onClick={() => {
                log('pause notifications for 24 hours');
                settings.update({ state: 'paused' });
              }}
            >
              {COPY.pauseLink}
            </TextAction>
          ) : null
        }
        onCancel={() => {
          log('cancel');
          setDraft(saved);
          setStatus(null);
        }}
        onSave={() => {
          log('save', { dirty });
          if (isLive) {
            saveNotificationPrefs(prefs, draft)
              .then((p) => {
                setPrefs(p);
                setSaved(draft);
                setStatus({ tone: 'ok', text: FOOTER_COPY.saved });
              })
              .catch((err) => {
                log.error('save failed:', err?.response?.status);
                setStatus({ tone: 'error', text: 'Not saved. Please try again.' });
              });
            return;
          }
          setSaved(draft);
          setStatus({ tone: 'ok', text: FOOTER_COPY.saved });
        }}
      />
    </>
  );
};

export default NotificationsTab;
