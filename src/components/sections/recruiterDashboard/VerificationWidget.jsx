import { classNames } from '../../../utils/classNames.js';
import Chip from '../../ui/Chip.jsx';
import WidgetCard from '../../ui/WidgetCard.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { VERIFICATION, VERIFICATION_STATES } from './recruiterDashboardData.js';

/*
 * VerificationWidget — "Verification" (Figma 10049:58853, states D50–D55 in section 06): KYC (you) + KYB (organisation) status tiles, the KYB document list, a note and the upload button.
 * `variant`: '' (default, two documents missing) | 'verified' (KYB verified, all documents verified, green "Verified recruiter" banner) |
 * 'rejected' (TIN certificate rejected with the reason and a 24-hour cooldown, Recruitment licence in review, disabled "Re-upload available in 18h") |
 * 'owner' (not an org owner, 403: a red note and "Notify Ama Owusu" replace the upload button).
 * Props: org, variant, readOnly (pending affiliation: "Read-only" pill, dimmed upload), onUpload, onNotifyOwner.
 */
const DocStatus = ({ status }) => {
  if (status === 'Verified') {
    return (
      <Chip tone="success" icon={dashIcons.checkActive}>
        Verified
      </Chip>
    );
  }
  if (status === 'Rejected') {
    return (
      <Chip tone="danger" icon={dashIcons.xCircleRejected}>
        Rejected
      </Chip>
    );
  }
  if (status === 'In review') {
    return (
      <Chip tone="amber" icon={dashIcons.docStatusInReviewClock}>
        In review
      </Chip>
    );
  }
  return (
    <Chip tone="danger" icon={dashIcons.alertMissing}>
      Missing
    </Chip>
  );
};

const documentsFor = (variant) => {
  if (variant === 'verified')
    return VERIFICATION.documents.map((d) => ({ ...d, status: 'Verified' }));
  if (variant === 'rejected' || variant === 'owner') {
    return VERIFICATION.documents.map((d) => ({
      ...d,
      status: d.id === 'registration' ? 'Verified' : d.id === 'tin' ? 'Rejected' : 'In review',
    }));
  }
  return VERIFICATION.documents;
};

/* Signed in: GET /recruiter/company kyb { status, verified, verifiedAt, rejectionReason, documents[{ id, label, status }] }. */
const LIVE_DOC_STATUS = {
  verified: 'Verified',
  approved: 'Verified',
  rejected: 'Rejected',
  missing: 'Missing',
};
const liveDocs = (live) =>
  (live.documents || []).map((d) => ({
    id: d.id,
    label: d.label,
    status: LIVE_DOC_STATUS[d.status] || 'In review',
  }));
const liveKybText = (live, docs) => {
  if (live.verified) {
    const on = live.verifiedAt
      ? new Date(live.verifiedAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '';
    return on ? `Organisation verified on ${on}` : 'Organisation verified';
  }
  if (live.status === 'kyb_rejected')
    return live.rejectionReason
      ? `Not approved: ${live.rejectionReason}`
      : 'Not approved. Upload clearer copies.';
  const missing = docs.filter((d) => d.status === 'Missing').length;
  const review = docs.filter((d) => d.status === 'In review').length;
  if (missing)
    return `${review ? 'In review · ' : ''}${missing} document${missing === 1 ? '' : 's'} missing`;
  return review ? 'Documents in review' : 'Not verified yet';
};

const VerificationWidget = ({
  org,
  variant = '',
  readOnly = false,
  onUpload,
  onNotifyOwner,
  live = null,
}) => {
  const kyb = live
    ? {
        title: `KYB · ${org}`,
        chip: live.status === 'kyb_submitted' ? 'In review' : live.label || 'Not verified',
      }
    : VERIFICATION.kyb(org);
  const verified = variant === 'verified';
  const needsAction = !live && (variant === 'rejected' || variant === 'owner');
  // A verified organisation lists only the documents it actually sent (some were verified another way).
  const documents = live
    ? liveDocs(live).filter((d) => !live.verified || d.status !== 'Missing')
    : documentsFor(variant);
  const kybText = live
    ? liveKybText(live, documents)
    : verified
      ? VERIFICATION_STATES.verified.kybText
      : needsAction
        ? VERIFICATION_STATES.rejected.kybText
        : kyb.text;
  const kyc = live
    ? { ...VERIFICATION.kyc, text: 'Your account email is verified' }
    : VERIFICATION.kyc;

  return (
    <WidgetCard
      id="dash-verification"
      icon={dashIcons.tileVerification}
      title={VERIFICATION.title}
      subtitle={VERIFICATION.subtitle}
      controls={readOnly ? <Chip tone="amber">{VERIFICATION.readOnly}</Chip> : null}
      className={classNames(readOnly && 'opacity-90')}
    >
      <div className="flex flex-col gap-[12px]">
        <div className="grid grid-cols-2 gap-[12px] max-sm:grid-cols-1">
          <div className="flex flex-col gap-[6px] rounded-[10px] bg-[#ebf1ec]/50 px-[16px] py-[12px]">
            <div className="flex flex-col gap-[2px]">
              <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
                {kyc.title}
              </span>
              <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                {kyc.text}
              </span>
            </div>
            <Chip tone="outline-success" className="self-start py-[4px]">
              {kyc.chip}
            </Chip>
          </div>
          <div
            className={classNames(
              'flex flex-col gap-[6px] rounded-[10px] px-[16px] py-[12px]',
              verified ? 'bg-[#ebf1ec]/50' : needsAction ? 'bg-[#f9ebea]' : 'bg-[#faf4e8]'
            )}
          >
            <div className="flex flex-col gap-[2px]">
              <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
                {kyb.title}
              </span>
              <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                {kybText}
              </span>
            </div>
            {verified ? (
              <Chip tone="outline-success" className="self-start py-[4px]">
                {VERIFICATION_STATES.verified.kybChip}
              </Chip>
            ) : needsAction ? (
              <Chip
                tone="outline-danger"
                icon={dashIcons.alertMissing}
                className="self-start py-[4px]"
              >
                {VERIFICATION_STATES.rejected.kybChip}
              </Chip>
            ) : (
              <Chip
                tone="outline-amber"
                icon={dashIcons.clockInReview}
                className="self-start py-[4px]"
              >
                {kyb.chip}
              </Chip>
            )}
          </div>
        </div>

        <div className={classNames('flex flex-col gap-[8px]', !documents.length && 'hidden')}>
          <span className="font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#575755]">
            {VERIFICATION.documentsLabel}
          </span>
          <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
            {documents.map((doc) => (
              <li key={doc.id} className="flex flex-col gap-[10px]">
                <div className="flex items-center justify-between gap-[10px]">
                  <span className="flex items-center gap-[10px] font-sans text-[14px] leading-[24px] text-[#111]">
                    <img
                      src={dashIcons.fileDocument}
                      alt=""
                      aria-hidden="true"
                      className="size-[16px]"
                    />
                    {doc.label}
                  </span>
                  <DocStatus status={doc.status} />
                </div>
                {variant === 'rejected' && doc.id === 'tin' ? (
                  <div className="flex flex-col gap-[4px] rounded-[10px] bg-[#f9ebea] p-[12px]">
                    <span className="font-sans text-[12px] leading-[20px] font-semibold text-[#902b20]">
                      {VERIFICATION_STATES.rejected.why.title}
                    </span>
                    <span className="font-sans text-[12px] leading-[20px] text-[#111]">
                      {VERIFICATION_STATES.rejected.why.text}
                    </span>
                    <span className="flex items-center gap-[4px] font-sans text-[10px] leading-[16px] text-[#575755] uppercase max-xl:text-[12px]">
                      <img
                        src={dashIcons.reuploadCooldownClock}
                        alt=""
                        aria-hidden="true"
                        className="size-[12px]"
                      />
                      {VERIFICATION_STATES.rejected.why.cooldown}
                    </span>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        {verified ? (
          <div className="flex items-center gap-[12px] rounded-[10px] bg-[linear-gradient(171.84deg,#387440_0%,#84cc16_100%)] p-[16px]">
            <img
              src={dashIcons.verifiedRecruiterBannerShield}
              alt=""
              aria-hidden="true"
              className="size-[24px] shrink-0"
            />
            <span className="flex flex-col">
              <span className="font-sans text-[14px] leading-[24px] font-semibold text-white">
                {VERIFICATION_STATES.verified.banner.title}
              </span>
              <span className="font-sans text-[12px] leading-[20px] text-white">
                {VERIFICATION_STATES.verified.banner.text}
              </span>
            </span>
          </div>
        ) : (
          <>
            <p className="m-0 flex gap-[8px] font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
              <img
                src={dashIcons.infoNote}
                alt=""
                aria-hidden="true"
                className="mt-[2px] size-[16px] shrink-0"
              />
              {VERIFICATION.note}
            </p>
            {variant === 'owner' ? (
              <div className="flex flex-col gap-[10px] rounded-[10px] bg-[#f9ebea] p-[12px]">
                <div className="flex gap-[10px]">
                  <img
                    src={dashIcons.ownerOnlyLock}
                    alt=""
                    aria-hidden="true"
                    className="mt-[1px] size-[18px] shrink-0"
                  />
                  <span className="flex flex-col">
                    <span className="font-sans text-[12px] leading-[20px] font-semibold text-[#902b20]">
                      {VERIFICATION_STATES.owner.title}
                    </span>
                    <span className="font-sans text-[12px] leading-[20px] text-[#111]">
                      {VERIFICATION_STATES.owner.text}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onNotifyOwner}
                  className="inline-flex h-[40px] cursor-pointer items-center justify-center gap-[8px] rounded-[10px] border border-solid border-[#1c2a21]/30 bg-white px-[14px] font-sans text-[14px] leading-[24px] font-medium text-[#1c2a21] shadow-[0_2px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                >
                  <img
                    src={dashIcons.notifyOwnerSend}
                    alt=""
                    aria-hidden="true"
                    className="size-[16px]"
                  />
                  {VERIFICATION_STATES.owner.action}
                </button>
              </div>
            ) : variant === 'rejected' ? (
              <button
                type="button"
                disabled
                className="inline-flex min-h-[46px] w-full cursor-not-allowed items-center justify-center gap-[6px] rounded-[10px] border-0 bg-transparent px-[18px] py-[11px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#babab7]"
              >
                <img
                  src={dashIcons.reuploadDisabledClock}
                  alt=""
                  aria-hidden="true"
                  className="size-[16px]"
                />
                {VERIFICATION_STATES.rejected.reupload}
              </button>
            ) : (
              <button
                type="button"
                disabled={readOnly}
                onClick={onUpload}
                className="inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-[10px] border-0 bg-[#387440] px-[18px] py-[11px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-white shadow-[0_3px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:cursor-not-allowed disabled:opacity-60"
              >
                <img
                  src={dashIcons.uploadDocuments}
                  alt=""
                  aria-hidden="true"
                  className="size-[16px]"
                />
                {VERIFICATION.upload}
              </button>
            )}
          </>
        )}
      </div>
    </WidgetCard>
  );
};

export default VerificationWidget;
