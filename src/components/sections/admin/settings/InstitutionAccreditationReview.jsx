import { useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import { classNames } from '../../../../utils/classNames.js';
import { Select, TextInput } from '../../../ui/form';
import { GroupCard, TextAction } from '../../talentSettings/SettingsBUi.jsx';
import AdminConfirmDialog from '../ui/AdminConfirmDialog.jsx';
import AdminLoadNotice from '../AdminLoadNotice.jsx';
import { useAdminData } from '../useAdminData.js';
import { adminError, shortDate } from '../../../../services/admin.api.js';
import { openApiFile } from '../../../../services/agency.api.js';
import {
  adminAccreditationDecide,
  adminAccreditationFile,
  adminAccreditationOf,
  adminAccreditationQueue,
  adminAccreditationReviewDoc,
} from '../../../../services/institutionPortal.api.js';

const log = debug('InstitutionAccreditationReview');

/*
 * InstitutionAccreditationReview — Settings › Organisations › "Institution accreditation to review" (Super / Senior Admin).
 * GET /admin/institutions/accreditation lists schools with accreditation documents (those sent for review first). "Review" loads one
 * (GET /admin/institutions/:orgId/accreditation): each document with its file (downloaded privately), typed details and state, and Verify / Ask for more
 * info / Reject per document (POST …/documents/:docId/review {status, note}). The overall decision (POST …/decide {decision, note, renewalDue}) approves
 * the institution once the four documents are verified (students, records and credentials open for it), or asks for more information / refuses it with a
 * note the school sees. Props: canEdit, toast(title, text).
 */

const DOC_DECISIONS = { Verify: 'verified', 'Ask for more info': 'needs-info', Reject: 'rejected' };
const DECISIONS = {
  'Approve the institution': 'approved',
  'Ask for more information': 'needs-info',
  'Not approved': 'not-approved',
};
const STATE = {
  none: 'not added',
  draft: 'not sent',
  pending: 'waiting for you',
  verified: 'verified',
  'needs-info': 'needs more info',
  rejected: 'rejected',
};
const STATUS = {
  none: 'not sent yet',
  'under-review': 'sent for review',
  'needs-info': 'more information asked',
  'not-approved': 'not approved',
  approved: 'approved',
};
const kb = (n) =>
  n >= 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(n / 1024))} KB`;
const detailsText = (d = {}) =>
  Object.entries(d)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `${k
          .replace(/At$/, '')
          .replace(/([A-Z])/g, ' $1')
          .toLowerCase()}: ${v}`
    )
    .join(' · ');

const InstitutionAccreditationReview = ({ canEdit, toast }) => {
  const queue = useAdminData(() => adminAccreditationQueue(), []);
  const [openId, setOpenId] = useState(null);
  const [one, setOne] = useState(null);
  const [loadingOne, setLoadingOne] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [choice, setChoice] = useState('');
  const [note, setNote] = useState('');
  const [renewal, setRenewal] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const items = queue.data?.items ?? [];
  const waiting = items.filter((a) => a.status === 'under-review').length;

  const openOne = async (id) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    setOne(null);
    setLoadingOne(true);
    try {
      setOne(await adminAccreditationOf(id));
    } catch (err) {
      toast('Could not load the documents', adminError(err));
      setOpenId(null);
    } finally {
      setLoadingOne(false);
    }
  };
  const viewFile = async (doc) => {
    try {
      openApiFile(await adminAccreditationFile(openId, doc.id));
      log('file', doc.kind);
    } catch (err) {
      toast('Could not open the file', adminError(err));
    }
  };
  const ask = (kind, doc) => {
    setDialog({ kind, doc });
    setChoice('');
    setNote('');
    setRenewal(String(one?.review?.renewalDue || '').slice(0, 10));
    setError('');
  };
  const record = async () => {
    const map = dialog.kind === 'doc' ? DOC_DECISIONS : DECISIONS;
    const value = map[choice];
    if (!value) {
      setError('Choose a decision.');
      return;
    }
    if (!['verified', 'approved'].includes(value) && note.trim().length < 3) {
      setError('Write a short note. The school sees it.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res =
        dialog.kind === 'doc'
          ? await adminAccreditationReviewDoc(openId, dialog.doc.id, {
              status: value,
              note: note.trim(),
            })
          : await adminAccreditationDecide(openId, {
              decision: value,
              note: note.trim(),
              ...(value === 'approved' && renewal ? { renewalDue: renewal } : {}),
            });
      setOne(res);
      toast(
        'Decision recorded',
        dialog.kind === 'doc'
          ? `${dialog.doc.title}: ${STATE[value]}.`
          : `${res.institution?.name}: ${STATUS[value]}.`
      );
      setDialog(null);
      queue.reload();
    } catch (err) {
      setError(adminError(err));
    } finally {
      setBusy(false);
    }
  };

  const docs = one
    ? [
        ...one.required.map((r) => ({ ...r, key: r.kind })),
        ...one.others.map((d) => ({ kind: 'other', title: d.title, doc: d, key: d.id })),
      ]
    : [];

  return (
    <>
      <GroupCard title={`Institution accreditation to review · ${waiting}`} gap="gap-0">
        <AdminLoadNotice
          loading={queue.loading}
          error={queue.error}
          status={queue.status}
          onRetry={queue.reload}
        >
          {!items.length ? (
            <p className="m-0 py-[14px] font-sans text-[14px] text-[#595959]">
              No institution has uploaded accreditation documents yet. Schools upload them from
              their portal’s Accreditation page.
            </p>
          ) : null}
          {items.map((a, i) => (
            <div
              key={a.orgId}
              className={classNames(
                'flex w-full flex-col gap-[10px] py-[14px]',
                i > 0 && 'border-t border-[rgba(28,42,33,0.08)]'
              )}
            >
              <div className="flex w-full flex-wrap items-start gap-[14px]">
                <div className="flex min-w-[240px] flex-1 flex-col gap-[3px]">
                  <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                    {a.name}
                    {a.short && a.short !== a.name ? (
                      <span className="font-normal text-[#595959]"> · {a.short}</span>
                    ) : null}
                  </p>
                  <p className="m-0 font-sans text-[13px] leading-[18px] text-[#595959]">
                    {a.documents} document{a.documents === 1 ? '' : 's'} ·{' '}
                    {STATUS[a.status] || a.status}
                    {a.submittedAt ? ` ${shortDate(a.submittedAt)}` : ''}
                    {a.type ? ` · ${a.type}` : ''}
                  </p>
                </div>
                <TextAction
                  tone="green"
                  onClick={() => openOne(a.orgId)}
                  aria-expanded={openId === a.orgId}
                >
                  {openId === a.orgId ? 'Close' : a.status === 'under-review' ? 'Review' : 'Open'}
                </TextAction>
              </div>
              {openId === a.orgId ? (
                <div className="flex flex-col gap-[10px] rounded-[12px] bg-[#f8f8f4] p-[12px]">
                  {loadingOne || !one ? (
                    <p className="m-0 font-sans text-[13px] text-[#595959]">Loading…</p>
                  ) : (
                    <>
                      <p className="m-0 font-sans text-[12px] text-[#1c2a21]">
                        {[
                          one.institution.type,
                          one.institution.gesNumber && `GES ${one.institution.gesNumber}`,
                          [one.institution.town, one.institution.region].filter(Boolean).join(', '),
                          one.institution.head?.name && `Head: ${one.institution.head.name}`,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                      {docs.map((s) => (
                        <div
                          key={s.key}
                          className="flex flex-wrap items-start gap-[12px] rounded-[10px] bg-white p-[10px]"
                        >
                          <div className="flex min-w-[220px] flex-1 flex-col gap-[2px]">
                            <p className="m-0 font-sans text-[14px] font-semibold text-[#1c2a21]">
                              {s.title}{' '}
                              <span className="font-normal text-[#595959]">
                                · {STATE[s.doc ? s.doc.status : 'none']}
                              </span>
                            </p>
                            {s.doc?.hasFile ? (
                              <p className="m-0 font-sans text-[12px] text-[#595959]">
                                {s.doc.fileName} · {kb(s.doc.size)} · uploaded{' '}
                                {shortDate(s.doc.uploadedAt)}
                                {s.doc.uploadedByName ? ` by ${s.doc.uploadedByName}` : ''}
                              </p>
                            ) : null}
                            {s.doc && detailsText(s.doc.details) ? (
                              <p className="m-0 font-sans text-[12px] text-[#1c2a21]">
                                {detailsText(s.doc.details)}
                              </p>
                            ) : null}
                            {s.doc?.note ? (
                              <p className="m-0 font-sans text-[12px] text-[#785910]">
                                Note: {s.doc.note}
                              </p>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-[12px]">
                            {s.doc?.hasFile ? (
                              <TextAction tone="green" onClick={() => viewFile(s.doc)}>
                                View file
                              </TextAction>
                            ) : null}
                            {canEdit && s.doc ? (
                              <TextAction tone="green" onClick={() => ask('doc', s.doc)}>
                                Check
                              </TextAction>
                            ) : null}
                          </div>
                        </div>
                      ))}
                      {one.review?.note ? (
                        <p className="m-0 font-sans text-[12px] text-[#595959]">
                          Last note to the school: {one.review.note}
                        </p>
                      ) : null}
                      {canEdit ? (
                        <div className="flex justify-end">
                          <TextAction tone="green" onClick={() => ask('decision')}>
                            Record the decision
                          </TextAction>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </AdminLoadNotice>
      </GroupCard>

      {dialog ? (
        <AdminConfirmDialog
          title={
            dialog.kind === 'doc'
              ? `Check: ${dialog.doc.title}`
              : `Accreditation: ${one?.institution?.name}`
          }
          body={
            dialog.kind === 'doc'
              ? 'Compare the file and its details with the GES / Ministry record. The school sees your note.'
              : 'Approving opens students, records and credentials for the school. All four documents must be verified first.'
          }
          primary={{ label: busy ? 'Saving…' : 'Record decision', arrow: true }}
          secondary="Cancel"
          onPrimary={() => !busy && record()}
          onClose={() => setDialog(null)}
        >
          <Select
            label="Decision"
            required
            options={Object.keys(dialog.kind === 'doc' ? DOC_DECISIONS : DECISIONS)}
            value={choice}
            onChange={setChoice}
          />
          {dialog.kind === 'decision' && choice === 'Approve the institution' ? (
            <TextInput
              label="Renew accreditation by (optional, default in a year)"
              type="date"
              value={renewal}
              onChange={(e) => setRenewal(e.target.value)}
            />
          ) : null}
          <TextInput
            label="Note to the school"
            required={!['Verify', 'Approve the institution'].includes(choice)}
            placeholder={
              choice === 'Verify' || choice === 'Approve the institution'
                ? 'Optional'
                : 'What to fix, or why'
            }
            value={note}
            onChange={(e) => setNote(e.target.value)}
            error={error || undefined}
          />
        </AdminConfirmDialog>
      ) : null}
    </>
  );
};

export default InstitutionAccreditationReview;
