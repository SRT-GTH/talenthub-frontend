import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { RecordsIconCheck13 } from '../records/recordsIcons.jsx';
import CertificateSideRail from './CertificateSideRail.jsx';
import CredentialIssuedDialog from './CredentialIssuedDialog.jsx';
import CredentialToast from './CredentialToast.jsx';
import {
  CredentialsIconBack,
  CredentialsIconBookmark,
  CredentialsIconBrief,
  CredentialsIconCal,
  CredentialsIconCash,
  CredentialsIconFlag13,
  CredentialsIconPin15,
  CredentialsIconPlus,
  CredentialsIconRing,
  CredentialsIconSchoolMark,
  CredentialsIconShare,
} from './credentialsIcons.jsx';
import {
  ISSUER,
  LINKED_RECORDS,
  PREVIEW_GRADE_FALLBACK,
  PRONOUNS,
  PRONOUN_FALLBACK,
  TOAST_LINK_COPIED,
} from './data/credentialsData.js';
import {
  dismissToast,
  issueCredential,
  parseFormDate,
  resetForm,
  showToast,
  useCredentialsStore,
} from './useCredentialsStore.js';

const log = debug('CredentialPreviewView');

/*
 * CredentialPreviewView — the certificate page "Preview as the student sees it" (Figma 11.2.4c 8593:390292) with the "Credential issued!" dialog over it (11.2.4d 8593:390861).
 *   /institution/credentials/new?modal=preview       preview of the form: Draft sticker, "Issue credential" · "Edit details"; "Back to editing" returns to the form
 *   /institution/credentials/new?state=issued        the same page with the issued dialog (Back to credentials · Issue another)
 *   /institution/credentials/:id                     ⚠️ ASSUMPTION: the page of an issued credential (Valid sticker, "Issue a corrected copy" · "Back to credentials")
 * The left column is the certificate (company-style header with the school mark, title 40/44, four meta chips, "What this certifies", "Linked records"); the right column is CertificateSideRail.
 * Props: data (useInstitutionState()), credential (store row, for /:id) — omitted for the preview of the form.
 */
const CredentialPreviewView = ({ data, credential }) => {
  const navigate = useNavigate();
  const { form } = useCredentialsStore();
  const { state, update } = data;
  const issuedDialog = !credential && state === 'issued';

  const date = parseFormDate(form.date);
  const student = (credential?.student ?? form.student.split(' · ')[0]) || 'the student';
  const firstName = student.split(' ')[0];
  const pronoun = PRONOUNS[firstName] ?? PRONOUN_FALLBACK;
  const grade = credential
    ? credential.grade || PREVIEW_GRADE_FALLBACK
    : form.grade || PREVIEW_GRADE_FALLBACK;
  const programme = credential?.programme ?? form.title;
  const heading = credential?.title ?? form.type;
  const signedBy = credential?.signedBy ?? form.signedBy;
  const second = credential?.second ?? form.second;
  const cert = {
    number: credential?.number ?? 'GTH-CR-0412-00318',
    signedOn: credential?.issuedLong ?? date.long,
    status: credential ? 'Valid' : 'Valid',
    firstName,
    signerName: signedBy.split(',')[0],
    secondName: second.split(',')[0],
  };
  const awarded = credential?.issuedLong ?? date.long;

  useEffect(() => {
    log('mount', { credential: credential?.id, issuedDialog });
  }, [credential?.id, issuedDialog]);

  const copyLink = () => {
    const url = `${window.location.origin}/institution/verify/${cert.number}`;
    window.navigator.clipboard?.writeText(url).catch(() => {});
    showToast(TOAST_LINK_COPIED);
  };

  const issue = () => {
    issueCredential();
    log('issued');
    update({ state: 'issued' }, { replace: true });
  };

  const bullets = [
    `Signed by ${signedBy}`,
    `Countersigned by ${second}`,
    `Shows on ${firstName}’s profile under Verified credentials`,
    `${pronoun.subject} can download it as a PDF or share a link`,
  ];

  const chips = [
    { id: 'who', icon: CredentialsIconPin15, text: student },
    { id: 'programme', icon: CredentialsIconBrief, text: programme },
    { id: 'grade', icon: CredentialsIconCash, text: grade },
    { id: 'date', icon: CredentialsIconCal, text: `Awarded ${awarded}` },
  ];

  const { toast } = useCredentialsStore();

  return (
    <div className="flex flex-col gap-[24px] pt-[12px] font-sans">
      <div className="flex flex-wrap items-center gap-[8px] text-[14px] leading-[17px]">
        <Link
          to={credential ? '/institution/credentials' : '/institution/credentials/new'}
          className="inline-flex min-h-[24px] items-center gap-[8px] font-semibold text-[#2d5d33] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <CredentialsIconBack className="size-[16px] text-[#2d5d33]" />
          {credential ? 'Back to credentials' : 'Back to editing'}
        </Link>
        <span className="text-[13px] leading-[16px] text-[#737373]">
          · Preview as the student sees it
        </span>
      </div>
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
                    {ISSUER.school}
                  </p>
                  <span className="inline-flex h-[18px] items-center gap-[4px] rounded-full bg-[#ebf1ec] py-[2px] pr-[8px] pl-[6px] text-[11.5px] max-lg:text-[12px] leading-[14px] font-semibold text-[#224626]">
                    <RecordsIconCheck13 className="size-[11px] text-[#224626]" />
                    Verified institution
                  </span>
                </div>
                <p className="m-0 text-[13px] leading-[16px] text-[#737373]">{ISSUER.line}</p>
              </div>
              <span className="inline-flex h-[22px] items-center rounded-full bg-[#ebf1ec] px-[10px] text-[11.5px] max-lg:text-[12px] leading-[14px] font-bold text-[#1f4a2b]">
                {credential ? 'Valid' : 'Draft'}
              </span>
              <span
                aria-hidden="true"
                className="flex size-[42px] shrink-0 items-center justify-center rounded-full border border-solid border-[#1c2a21]/20 bg-white"
              >
                <CredentialsIconBookmark className="size-[20px] text-[#1c2a21]" />
              </span>
              <span
                aria-hidden="true"
                className="flex size-[42px] shrink-0 items-center justify-center rounded-full border border-solid border-[#1c2a21]/20 bg-white"
              >
                <CredentialsIconShare className="size-[20px] text-[#1c2a21]" />
              </span>
            </div>
            <h1 className="m-0 text-[30px] leading-[34px] font-semibold text-[#1c2a21] md:text-[40px] md:leading-[44px]">
              {heading}
            </h1>
            <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
              {chips.map((c) => {
                const Icon = c.icon;
                return (
                  <li
                    key={c.id}
                    className="inline-flex h-[30px] items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-[#f8f8f4] py-[6px] pr-[12px] pl-[10px] text-[13.5px] leading-[16px] font-medium text-[#1c2a21]"
                  >
                    <Icon className="size-[15px] shrink-0 text-[#595959]" />
                    {c.text}
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-wrap items-center gap-[10px] pt-[4px]">
              {credential ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() =>
                      navigate(`/institution/credentials/${credential.id}?modal=corrected`)
                    }
                  >
                    Issue a corrected copy
                  </Button>
                  <Button
                    variant="tertiary"
                    size="lg"
                    onClick={() => navigate('/institution/credentials')}
                  >
                    Back to credentials
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<CredentialsIconRing className="size-[20px] text-[#fef1e7]" />}
                    onClick={issue}
                  >
                    Issue credential
                  </Button>
                  <Button
                    variant="tertiary"
                    size="lg"
                    onClick={() => navigate('/institution/credentials/new')}
                  >
                    Edit details
                  </Button>
                  <span className="min-w-[160px] flex-1 text-[13px] leading-[16px] text-[#737373]">
                    Once issued, you can only revoke it with a second approver.
                  </span>
                  <span className="inline-flex items-center gap-[5px] px-[10px] py-[6px] text-[12.5px] leading-[15px] font-semibold text-[#737373]">
                    <CredentialsIconFlag13 className="size-[13px]" />
                    Report a problem
                  </span>
                </>
              )}
            </div>
          </section>
          <section
            aria-label="What this certifies"
            className="flex flex-col gap-[24px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[22px]"
          >
            <h2 className="m-0 text-[22px] leading-[28px] font-semibold text-[#1c2a21]">
              What this certifies
            </h2>
            <p className="m-0 text-[15px] leading-[22px] text-[#1c2a21]">
              {student} completed {programme} at Savannah Hills Senior High School, Tamale, with{' '}
              {grade.toLowerCase()}.
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
          <section
            aria-label="Linked records"
            className="flex flex-col gap-[12px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[22px]"
          >
            <div className="flex items-center justify-between gap-[8px]">
              <h2 className="m-0 text-[22px] leading-[28px] font-semibold text-[#1c2a21]">
                Linked records
              </h2>
              <span className="text-[13.5px] leading-[16px] font-semibold text-[#2d5d33]">
                4 verified
              </span>
            </div>
            <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
              {LINKED_RECORDS.map((r) =>
                r.verified ? (
                  <li
                    key={r.id}
                    className="inline-flex h-[32px] items-center gap-[6px] rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] py-[7px] pr-[12px] pl-[10px] text-[13px] leading-[16px] font-semibold text-[#2d5d33]"
                  >
                    <RecordsIconCheck13 className="size-[13px] text-[#387440]" />
                    {r.label}
                  </li>
                ) : (
                  <li
                    key={r.id}
                    className="inline-flex h-[32px] items-center gap-[6px] rounded-full border border-solid border-[#c8951a] bg-white py-[7px] pr-[12px] pl-[10px] text-[13px] leading-[16px] font-semibold text-[#967014]"
                  >
                    <CredentialsIconPlus className="size-[13px]" />
                    {r.label}
                  </li>
                )
              )}
            </ul>
          </section>
        </div>
        <CertificateSideRail cert={cert} onCopy={copyLink} />
      </div>
      {issuedDialog ? (
        <CredentialIssuedDialog
          firstName={firstName}
          possessive={pronoun.object}
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
      {toast ? <CredentialToast message={toast.message} onDismiss={dismissToast} /> : null}
    </div>
  );
};

export default CredentialPreviewView;
