import { useState } from 'react';
import { TextInput } from '../../../ui/form';
import { GroupCard, SettingRow, TextAction } from '../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import { useAdminData } from '../useAdminData.js';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import {
  decideStaffReset,
  listStaffResets,
  mfaError,
  requestStaffReset,
  shortDate,
} from '../../../../services/mfa.api.js';
import { entityLabel } from '../../../../services/admin.api.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('TwoStepResets');

/*
 * Staff 2-step resets (user story D3, screen 10) — Super Admins only, in Settings › Staff accounts.
 *   ResetTwoStepDialog   "Reset 2-step verification" on a staff row: a reason (10+ characters) -> POST /security/mfa/staff-resets.
 *   TwoStepResetsCard    the requests waiting for a second Super Admin: Approve / Reject (not on your own request, not for yourself).
 * Approving removes every method and backup code, signs the person out everywhere and makes them set 2-step up again at their next sign-in;
 * they're emailed when it's asked for and when it happens. Both Super Admins must have signed in with 2-step (MFA_SIGN_IN_REQUIRED otherwise).
 * Backend: services/mfa.api.js. There's no self-approval for this action: with no other Super Admin it answers NO_SECOND_APPROVER.
 */

export const ResetTwoStepDialog = ({ person, name, onDone, onClose }) => {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const ok = reason.trim().length >= 10;
  return (
    <AdminConfirmDialog
      title={`Reset ${name}’s 2-step verification?`}
      body="A second Super Admin must approve. Then their authenticator apps and backup codes stop working, they’re signed out everywhere, and they set 2-step up again at their next sign-in. We email them both times."
      primary={{ label: busy ? 'Asking…' : 'Ask for approval', arrow: true }}
      secondary="Cancel"
      onPrimary={async () => {
        if (!ok || busy) return;
        setBusy(true);
        setError('');
        try {
          await requestStaffReset({ userId: person, reason });
          log('reset requested');
          onDone();
        } catch (err) {
          setError(mfaError(err, 'We couldn’t send the request. Try again.'));
        } finally {
          setBusy(false);
        }
      }}
      onClose={onClose}
    >
      <TextInput
        label="Reason"
        required
        value={reason}
        maxLength={500}
        onChange={(e) => setReason(e.target.value)}
        placeholder="e.g. Lost phone, confirmed by video call (ticket 1234)"
        helperText={
          !error ? 'At least 10 characters. Say how you confirmed it’s really them.' : undefined
        }
        error={error || undefined}
      />
    </AdminConfirmDialog>
  );
};

export const TwoStepResetsCard = ({ reloadKey = 0, onToast }) => {
  const resets = useAdminData(() => listStaffResets(), [reloadKey]);
  const [deciding, setDeciding] = useState(null); // { row, decision }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const rows = Array.isArray(resets.data) ? resets.data : [];

  return (
    <GroupCard
      title={`2-step resets waiting · ${rows.length}`}
      description="Each needs a second Super Admin. Check the reason before you approve."
      gap="gap-0"
    >
      <AdminLoadNotice
        loading={resets.loading}
        error={resets.error}
        status={resets.status}
        onRetry={resets.reload}
      >
        {rows.length === 0 ? (
          <p className="m-0 py-[10px] font-sans text-[14px] text-[#595959]">Nothing waiting.</p>
        ) : (
          rows.map((r, i) => (
            <SettingRow
              key={r.approvalId}
              top={i > 0}
              nowrapControl={false}
              title={`${r.targetName || r.targetEmail || 'Staff member'}${r.targetRole ? ` · ${entityLabel(r.targetRole)}` : ''}`}
              description={`“${r.reason || 'No reason given'}” · asked ${shortDate(r.createdAt)} · expires ${shortDate(r.expiresAt)}${r.requestedByMe ? ' · you asked' : ''}`}
              control={
                r.requestedByMe ? (
                  <span className="font-sans text-[13px] text-[#737373]">
                    Waiting for another Super Admin
                  </span>
                ) : (
                  <div className="flex items-center gap-[14px]">
                    <TextAction
                      tone="green"
                      onClick={() => setDeciding({ row: r, decision: 'approve' })}
                    >
                      Approve
                    </TextAction>
                    <TextAction
                      tone="danger"
                      onClick={() => setDeciding({ row: r, decision: 'reject' })}
                    >
                      Reject
                    </TextAction>
                  </div>
                )
              }
            />
          ))
        )}
      </AdminLoadNotice>

      {deciding ? (
        <AdminConfirmDialog
          title={
            deciding.decision === 'approve' ? 'Approve this 2-step reset?' : 'Reject this reset?'
          }
          body={
            deciding.decision === 'approve'
              ? `${deciding.row.targetName || deciding.row.targetEmail}: their authenticator apps and backup codes stop working now, they’re signed out everywhere, and they set 2-step up again at their next sign-in.`
              : `Nothing changes for ${deciding.row.targetName || deciding.row.targetEmail}. The Super Admin who asked can see that it was rejected.`
          }
          primary={{
            label: busy
              ? 'Saving…'
              : deciding.decision === 'approve'
                ? 'Approve and reset'
                : 'Reject',
            tone: deciding.decision === 'approve' ? 'red' : undefined,
          }}
          secondary="Cancel"
          onPrimary={async () => {
            if (busy) return;
            setBusy(true);
            setError('');
            try {
              await decideStaffReset(deciding.row.approvalId, { decision: deciding.decision });
              const who = deciding.row.targetName || deciding.row.targetEmail;
              onToast?.(
                deciding.decision === 'approve' ? '2-step verification reset' : 'Reset rejected',
                deciding.decision === 'approve'
                  ? `${who} sets it up again at their next sign-in.`
                  : `${who}’s 2-step verification is unchanged.`
              );
              setDeciding(null);
              resets.reload();
            } catch (err) {
              setError(mfaError(err, 'We couldn’t save that. Try again.'));
            } finally {
              setBusy(false);
            }
          }}
          onClose={() => {
            setDeciding(null);
            setError('');
          }}
        >
          {error ? <p className="m-0 text-[14px] text-[#902b20]">{error}</p> : null}
        </AdminConfirmDialog>
      ) : null}
    </GroupCard>
  );
};
