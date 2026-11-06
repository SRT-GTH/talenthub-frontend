import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import {
  apiMessage,
  cancelRevokeCredential,
  correctCredential,
  issueCredential,
  revokeCredential,
} from '../../../../services/institutionPortal.api.js';
import Button from '../../../ui/Button.jsx';
import { RecordsIconCheck13 } from '../records/recordsIcons.jsx';
import CertificateSideRail from './CertificateSideRail.jsx';
import CredentialCorrectDialog from './CredentialCorrectDialog.jsx';
import CredentialIssuedDialog from './CredentialIssuedDialog.jsx';
import CredentialRevokeDialog from './CredentialRevokeDialog.jsx';
import CredentialToast from './CredentialToast.jsx';
import {
  CredentialsIconBack,
  CredentialsIconBrief,
  CredentialsIconCal,
  CredentialsIconCash,
  CredentialsIconPin15,
  CredentialsIconPlus,
  CredentialsIconRing,
  CredentialsIconSchoolMark,
} from './credentialsIcons.jsx';
import { CREDENTIAL_TYPES } from './data/credentialsData.js';
import {
  dismissToast,
  resetForm,
  setIssued,
  showToast,
  useCredential,
  useCredentialOptions,
  useCredentialsStore,
} from './useCredentialsStore.js';

const log = debug('CredentialPreviewView');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const longDate = (text) => {
  const m = /^\s*(\d{1,2})\s*[/.-]\s*(\d{1,2})\s*[/.-]\s*(\d{4})\s*$/.exec(text ?? '');
  return m && +m[2] >= 1 && +m[2] <= 12 ? `${+m[1]} ${MONTHS[+m[2] - 1]} ${m[3]}` : '';
};

const STATUS = {
  draft: 'Draft',
  valid: 'Valid',
  revoking: 'Revoking',
  revoked: 'Revoked',
};

/*
 * CredentialPreviewView — the certificate page "Preview as the student sees it" (Figma 11.2.4c 8593:390292) with the "Credential issued!" dialog (11.2.4d).
 *   /institution/credentials/new?modal=preview     preview of the issue form: Draft sticker, "Issue credential" (POST /credentials) · "Edit details"
 *   /institution/credentials/new?state=issued      the issued dialog over it (Back to credentials · Issue another)
 *   /institution/credentials/:id                   an issued credential (GET /credentials/:id): Issue a corrected copy · Revoke; a revocation someone else
 *                                                  asked for can be approved; your own can be withdrawn. ?modal=revoke|corrected open the dialogs.
 * Props: data (useInstitutionState()), credentialId (omitted for the preview of the form).
 */
const CredentialPreviewView = ({ data, credentialId }) => {
  const navigate = useNavigate();
  const { form, toast, issued } = useCredentialsStore();
  const { state, modal, update } = data;
  const { data: credential, error: loadError, reload } = useCredential(credentialId);
  const { data: options } = useCredentialOptions();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isPreview = !credentialId;
  const issuedDialog = isPreview && state === 'issued' && issued;

  useEffect(() => {
    log('mount', { credentialId, issuedDialog: Boolean(issuedDialog), modal });
  }, [credentialId, issuedDialog, modal]);

  useEffect(() => {
    if (isPreview && !form.rosterId && !issued)
      navigate('/institution/credentials/new', { replace: true });
  }, [isPreview, form.rosterId, issued, navigate]);

  if (credentialId && loadError) {
    return (
      <div className="flex flex-col gap-[12px] pt-[12px] font-sans">
        <p role="alert" className="m-0 text-[14px] text-[#902b20]">
          {loadError}
        </p>
        <Link to="/institution/credentials" className="text-[14px] font-semibold text-[#2d5d33]">
          Back to credentials
        </Link>
      </div>
    );
  }
  if (credentialId && !credential)
    return (
      <p className="m-0 pt-[12px] font-sans text-[14px] text-[#737373]">Loading the credential…</p>
    );

  const issuer = credential?.issuer ?? options?.issuer ?? { school: '', short: '', line: '' };
  const c = credential ?? issued;
  const student = c?.student ?? form.student ?? 'the student';
  const firstName = student.split(' ')[0];
  const grade = credential ? credential.grade : form.grade;
  const programme = credential ? credential.programme : form.title;
  const heading = credential ? credential.type : form.type;
  const signedBy = credential ? credential.signedBy : form.signedBy;
  const second = credential ? credential.second : form.second;
  const awarded = credential ? credential.issuedLong : longDate(form.date) || form.date;
  const status = credential ? credential.status : issued ? 'valid' : 'draft';
  const number = c?.number ?? 'Assigned when issued';
  const cert = {
    number,
    signedOn: credential ? credential.issuedLong : issued ? awarded : 'Not signed yet',
    status: STATUS[status],
    firstName,
    signerName: (signedBy || '').split(',')[0],
    signerRole: (signedBy || '').split(',').slice(1).join(',').trim(),
    secondName: (second || '').split(',')[0],
    issuerShort: issuer.short,
    verifyPath: c
      ? `/institution/verify/${encodeURIComponent((c.number || '').replace(/\s*\(v\d+\)$/, ''))}`
      : null,
  };

  const run = async (fn) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const issue = () =>
    run(async () => {
      const type = CREDENTIAL_TYPES.find((t) => t.value === form.type) ?? CREDENTIAL_TYPES[0];
      const res = await issueCredential({
        rosterId: form.rosterId,
        kind: type.kind,
        type: type.value,
        title: form.title,
        date: form.date,
        grade: form.grade || undefined,
        signedBy: form.signedBy,
        second: form.second || undefined,
        email: form.email,
      });
      log('issued', res.id, res.number);
      setIssued({ ...res, emailed: form.email });
      update({ modal: null, state: 'issued' }, { replace: true });
    });

  const closeModal = () => update({ modal: null }, { replace: true });

  const revoke = (reason) =>
    run(async () => {
      const res = await revokeCredential(credential.id, reason);
      closeModal();
      showToast(
        res.status === 'revoking'
          ? 'Revocation asked · a second staff member has to approve it'
          : `Credential revoked · gth.com/verify now shows it as revoked`
      );
      reload();
    });

  const withdraw = () =>
    run(async () => {
      await cancelRevokeCredential(credential.id);
      showToast('Revocation withdrawn · the credential stays valid');
      reload();
    });

  const correct = (patch) =>
    run(async () => {
      await correctCredential(credential.id, patch);
      closeModal();
      showToast('Corrected copy issued · gth.com/verify shows the new version');
      reload();
    });

  const copyLink = () => {
    if (!cert.verifyPath) return;
    window.navigator.clipboard
      ?.writeText(`${window.location.origin}${cert.verifyPath}`)
      .catch(() => {});
    showToast('Verify link copied');
  };

  const bullets = [
    signedBy ? `Signed by ${signedBy}` : null,
    second ? `Countersigned by ${second}` : null,
    `Shows on ${firstName}’s GTH profile${c && !c.linked ? ' once they link it to your school' : ''}`,
    'Anyone can check it at gth.com/verify with its number',
  ].filter(Boolean);

  const chips = [
    { id: 'who', icon: CredentialsIconPin15, text: student },
    { id: 'programme', icon: CredentialsIconBrief, text: programme },
    grade ? { id: 'grade', icon: CredentialsIconCash, text: grade } : null,
    { id: 'date', icon: CredentialsIconCal, text: `Awarded ${awarded}` },
  ].filter(Boolean);

  const linked = credential?.linkedRecords ?? [];

  return (
    <div className="flex flex-col gap-[24px] pt-[12px] font-sans">
      <div className="flex flex-wrap items-center gap-[8px] text-[14px] leading-[17px]">
        <Link
          to={credentialId ? '/institution/credentials' : '/institution/credentials/new'}
          className="inline-flex min-h-[24px] items-center gap-[8px] font-semibold text-[#2d5d33] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <CredentialsIconBack className="size-[16px] text-[#2d5d33]" />
          {credentialId ? 'Back to credentials' : 'Back to editing'}
        </Link>
        <span className="text-[13px] leading-[16px] text-[#737373]">
          · Preview as the student sees it
        </span>
      </div>
      {error ? (
        <p role="alert" className="m-0 text-[14px] leading-[20px] text-[#902b20]">
          {error}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-[24px] xl:grid-cols-[minmax(0,925fr)_minmax(0,380fr)]">
        <div className="flex min-w-0 flex-col gap-[16px]">
          <section
            aria-label="Certificate"
            className="flex flex-col gap-[16px] rounded-[26px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(16px,2vw,24px)_clamp(16px,2vw,26px)] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-center gap-[12px]">
              <CredentialsIconSchoolMark className="size-[56px] shrink-0 rounded-[16px]" />
              <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <div className="flex flex-wrap items-center gap-[6px]">
                  <p className="m-0 text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
                    {issuer.school}
                  </p>
                  <span className="inline-flex h-[18px] items-center gap-[4px] rounded-full bg-[#ebf1ec] py-[2px] pr-[8px] pl-[6px] text-[11.5px] leading-[14px] font-semibold text-[#224626] max-lg:text-[12px]">
                    <RecordsIconCheck13 className="size-[11px] text-[#224626]" />
                    Verified institution
                  </span>
                </div>
                <p className="m-0 text-[13px] leading-[16px] text-[#737373]">{issuer.line}</p>
              </div>
              <span
                className={`inline-flex h-[22px] items-center rounded-full px-[10px] text-[11.5px] leading-[14px] font-bold max-lg:text-[12px] ${
                  status === 'revoked' || status === 'revoking'
                    ? 'bg-[#f9ebea] text-[#902b20]'
                    : 'bg-[#ebf1ec] text-[#1f4a2b]'
                }`}
              >
                {STATUS[status]}
                {credential?.corrected ? ` · v${credential.version}` : ''}
              </span>
            </div>
            <h1 className="m-0 text-[30px] leading-[34px] font-semibold text-[#1c2a21] md:text-[40px] md:leading-[44px]">
              {heading}
            </h1>
            <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
              {chips.map((ch) => {
                const Icon = ch.icon;
                return (
                  <li
                    key={ch.id}
                    className="inline-flex h-[30px] items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-[#f8f8f4] py-[6px] pr-[12px] pl-[10px] text-[13.5px] leading-[16px] font-medium text-[#1c2a21]"
                  >
                    <Icon className="size-[15px] shrink-0 text-[#595959]" />
                    {ch.text}
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-wrap items-center gap-[10px] pt-[4px]">
              {isPreview ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    disabled={busy || Boolean(issued)}
                    rightIcon={<CredentialsIconRing className="size-[20px] text-[#fef1e7]" />}
                    onClick={issue}
                  >
                    {busy ? 'Issuing…' : 'Issue credential'}
                  </Button>
                  <Button
                    variant="tertiary"
                    size="lg"
                    onClick={() => navigate('/institution/credentials/new')}
                  >
                    Edit details
                  </Button>
                  <span className="min-w-[160px] flex-1 text-[13px] leading-[16px] text-[#737373]">
                    Once issued, it can only be corrected (spelling and dates) or revoked.
                  </span>
                </>
              ) : status === 'valid' ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => update({ modal: 'corrected' })}
                  >
                    Issue a corrected copy
                  </Button>
                  <Button variant="tertiary" size="lg" onClick={() => update({ modal: 'revoke' })}>
                    Revoke
                  </Button>
                </>
              ) : status === 'revoking' ? (
                <>
                  {credential.mineToApprove ? (
                    <Button variant="danger" size="lg" onClick={() => update({ modal: 'revoke' })}>
                      Review revocation
                    </Button>
                  ) : null}
                  <Button variant="tertiary" size="lg" disabled={busy} onClick={withdraw}>
                    Withdraw revocation
                  </Button>
                  <span className="min-w-[160px] flex-1 text-[13px] leading-[16px] text-[#737373]">
                    {credential.askedBy} asked to revoke it: “{credential.reason}”.{' '}
                    {credential.mineToApprove
                      ? 'Your approval completes it.'
                      : 'A second staff member has to approve.'}
                  </span>
                </>
              ) : status === 'revoked' ? (
                <span className="text-[14px] leading-[20px] text-[#902b20]">
                  Revoked {credential.revocation?.approvedAt}: {credential.revocation?.reason}
                </span>
              ) : (
                <span className="text-[14px] leading-[20px] text-[#737373]">
                  Waiting for a second staff member to release this batch.
                </span>
              )}
            </div>
          </section>
          <section
            aria-label="What this certifies"
            className="flex flex-col gap-[20px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[22px]"
          >
            <h2 className="m-0 text-[22px] leading-[28px] font-semibold text-[#1c2a21]">
              What this certifies
            </h2>
            <p className="m-0 text-[15px] leading-[22px] text-[#1c2a21]">
              {student} {heading.toLowerCase().startsWith('award') ? 'received' : 'completed'}{' '}
              {programme} at {issuer.school}
              {grade ? ` (${grade})` : ''}.
            </p>
            <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
              {bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-[10px] text-[14.5px] leading-[17px] text-[#1c2a21]"
                >
                  <span
                    aria-hidden="true"
                    className="size-[7px] shrink-0 rounded-full bg-[#387440]"
                  />
                  {b}
                </li>
              ))}
            </ul>
          </section>
          {credential?.corrections?.length ? (
            <section
              aria-label="Corrections"
              className="flex flex-col gap-[10px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[22px]"
            >
              <h2 className="m-0 text-[22px] leading-[28px] font-semibold text-[#1c2a21]">
                Corrections
              </h2>
              <ul className="m-0 flex list-none flex-col gap-[8px] p-0 text-[14px] leading-[20px] text-[#1c2a21]">
                {credential.corrections.map((x) => (
                  <li key={x.version}>
                    <strong>v{x.version}</strong> · {x.at} · {x.byName}:{' '}
                    {x.changes.map((ch) => `${ch.field} “${ch.was}” → “${ch.now}”`).join('; ')}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {credentialId ? (
            <section
              aria-label="Linked records"
              className="flex flex-col gap-[12px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[22px]"
            >
              <div className="flex items-center justify-between gap-[8px]">
                <h2 className="m-0 text-[22px] leading-[28px] font-semibold text-[#1c2a21]">
                  Linked records
                </h2>
                <span className="text-[13.5px] leading-[16px] font-semibold text-[#2d5d33]">
                  {linked.filter((r) => r.verified).length} verified
                </span>
              </div>
              {linked.length ? (
                <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
                  {linked.map((r) => (
                    <li key={r.id}>
                      <Link
                        to={`/institution/records/${r.id}`}
                        className={`inline-flex h-[32px] items-center gap-[6px] rounded-full border border-solid py-[7px] pr-[12px] pl-[10px] text-[13px] leading-[16px] font-semibold no-underline ${
                          r.verified
                            ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#2d5d33]'
                            : 'border-[#c8951a] bg-white text-[#967014]'
                        }`}
                      >
                        {r.verified ? (
                          <RecordsIconCheck13 className="size-[13px] text-[#387440]" />
                        ) : (
                          <CredentialsIconPlus className="size-[13px]" />
                        )}
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="m-0 text-[14px] leading-[20px] text-[#737373]">
                  {firstName} hasn’t sent you any records yet.
                </p>
              )}
            </section>
          ) : null}
          {credential?.history?.length ? (
            <section
              aria-label="History"
              className="flex flex-col gap-[10px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[22px]"
            >
              <h2 className="m-0 text-[22px] leading-[28px] font-semibold text-[#1c2a21]">
                History
              </h2>
              <ol className="m-0 flex list-none flex-col gap-[6px] p-0 text-[13.5px] leading-[19px] text-[#595959]">
                {credential.history.map((h, i) => (
                  <li key={`${h.at}-${i}`}>
                    <span className="font-semibold text-[#1c2a21]">
                      {h.what.charAt(0).toUpperCase() + h.what.slice(1)}
                    </span>
                    {h.by ? ` · ${h.by}` : ''} · {h.at}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>
        <CertificateSideRail cert={cert} onCopy={copyLink} />
      </div>
      {issuedDialog ? (
        <CredentialIssuedDialog
          sentence={
            issued.linked
              ? `${firstName} ${issued.emailed ? 'gets an email and ' : ''}sees it on their GTH profile now. Number ${issued.number}.`
              : `${firstName} isn’t on GTH yet; it goes on their profile when they link to your school. Number ${issued.number}.`
          }
          onBack={() => {
            resetForm();
            navigate('/institution/credentials');
          }}
          onAnother={() => {
            resetForm();
            navigate('/institution/credentials/new');
          }}
        />
      ) : null}
      {modal === 'revoke' &&
      credential &&
      (credential.status === 'valid' || credential.mineToApprove) ? (
        <CredentialRevokeDialog
          credential={credential}
          busy={busy}
          onCorrected={() => update({ modal: 'corrected' }, { replace: true })}
          onConfirm={revoke}
          onClose={closeModal}
        />
      ) : null}
      {modal === 'corrected' && credential?.status === 'valid' ? (
        <CredentialCorrectDialog
          credential={credential}
          busy={busy}
          onConfirm={correct}
          onClose={closeModal}
        />
      ) : null}
      {toast ? (
        <CredentialToast key={toast.id} message={toast.message} onDismiss={dismissToast} />
      ) : null}
    </div>
  );
};

export default CredentialPreviewView;
