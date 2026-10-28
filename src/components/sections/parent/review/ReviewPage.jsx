import { useEffect, useMemo } from 'react';
import { debug } from '../../../../utils/debug.js';
import ActionToast from '../../../ui/ActionToast.jsx';
import UnderlineTabs from '../../../ui/UnderlineTabs.jsx';
import ParentFrame from '../ParentFrame.jsx';
import { useWardFlags } from '../flags/flagsStore.js';
import { WARDS } from '../wards/data/wardsData.js';
import AssessmentResults from './AssessmentResults.jsx';
import CertificateDialog from './CertificateDialog.jsx';
import EvaluationDetail from './EvaluationDetail.jsx';
import HideEvaluationDialog from './HideEvaluationDialog.jsx';
import ReasonNoteDialog from './ReasonNoteDialog.jsx';
import ReviewCaughtUp from './ReviewCaughtUp.jsx';
import ReviewQueue from './ReviewQueue.jsx';
import { useReviewState } from './reviewState.js';
import {
  ASSESSMENT,
  DECLINE,
  FLAG_RESULT,
  REVIEW_INTRO,
  REVIEW_TITLE,
  TABS,
  TOAST,
} from './data/reviewData.js';

const log = debug('ReviewPage');

/*
 * ReviewPage — /parent/review "To review" (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 06 To review and approvals" 10057:66783). One page body (the route supplies the chrome):
 * title + "N waiting" sticker + intro, the five tabs (counts; the active tab's chip is amber), and the tab's content: the queue rows, the teacher evaluation (Evaluations tab), the personality results
 * (`?view=assessment`) or the "all caught up" card. Corrections come from the flags store (`useWardFlags`), so a fix approved on the ward page leaves this queue too.
 * URL contract and frame table: reviewState.js and wiki/parent-review.md. What the parent has dealt with lives in the URL (`done=`), so every frame reproduces from a fresh load.
 * Counts: Certificates / Evaluations / Payments are 1 until dealt with, Corrections = the corrected flags, All = the sum. A zero count is hidden, except when everything is zero (PR-05 draws "0" everywhere).
 */
const ward = WARDS.abena;

const ReviewPage = () => {
  const rv = useReviewState();
  const { update, urlFor } = rv;
  const { flags } = useWardFlags();
  const corrections = flags.filter((f) => f.status === 'corrected');

  /* A toast URL carries the state it shows, so the frame reproduces from a fresh load. */
  const done = useMemo(() => {
    const set = new Set(rv.done);
    if (rv.toast === 'certificate-approved') set.add('certificate');
    if (rv.toast === 'evaluation-sent') set.add('evaluation');
    return [...set];
  }, [rv.done, rv.toast]);
  const certPending = !done.some((d) => d.startsWith('certificate'));
  const evalPending = !done.some((d) => d.startsWith('evaluation'));

  const counts = {
    certificates: rv.caughtUp || !certPending ? 0 : 1,
    evaluations: rv.caughtUp || !evalPending ? 0 : 1,
    corrections: rv.caughtUp ? 0 : corrections.length,
    payments: rv.caughtUp ? 0 : 1,
  };
  const total = counts.certificates + counts.evaluations + counts.corrections + counts.payments;
  const empty = total === 0;
  const detail = !empty && (rv.view === 'assessment' || (rv.tab === 'evaluations' && evalPending));

  useEffect(() => {
    log('render', { tab: rv.tab, view: rv.view || '(queue)', total, modal: rv.modal || '(none)' });
  }, [rv.tab, rv.view, rv.modal, total]);

  const rowsFor = (tab) => {
    const cert = certPending ? [{ kind: 'certificate' }] : [];
    const evaluation = evalPending ? [{ kind: 'evaluation' }] : [];
    const fixes = corrections.map((flag) => ({ kind: 'correction', flag }));
    const payment = [{ kind: 'payment' }];
    if (tab === 'certificates') return cert;
    if (tab === 'evaluations') return evaluation;
    if (tab === 'corrections') return fixes;
    if (tab === 'payments') return payment;
    return [...cert, ...evaluation, ...fixes, ...payment];
  };

  const handleAction = (kind) => {
    if (kind === 'certificate') update({ modal: 'certificate' });
    else if (kind === 'evaluation') update({ tab: 'evaluations' });
    else log('payment decision (no screen drawn)');
  };

  const approveCertificate = () => {
    log('approve certificate');
    update({
      modal: null,
      tab: null,
      done: [...done, 'certificate'],
      toast: 'certificate-approved',
    });
  };
  const approveEvaluation = () => {
    log('approve evaluation');
    update({ tab: null, done: [...done, 'evaluation'], toast: 'evaluation-sent' });
  };
  const undo = (toast) => {
    log('undo', { toast });
    const drop = toast === 'certificate-approved' ? 'certificate' : 'evaluation';
    update({ done: done.filter((d) => d !== drop), toast: null });
  };

  const flagTrait = ASSESSMENT.traits.find((t) => t.id === rv.trait) ?? ASSESSMENT.traits[3];
  const tabs = TABS.map((t) => {
    const count = t.id === 'all' ? total : counts[t.id];
    return {
      id: t.id,
      label: t.label,
      count,
      showZero: empty,
      countTone: t.id === rv.tab && !rv.view ? 'amber' : 'mint',
      to: urlFor({ tab: t.id === 'all' ? null : t.id, view: null, modal: null, toast: null }),
      onClick: () => log('tab', t.id),
    };
  });

  const compactHeader = detail || empty;
  const activeTab = rv.view ? 'all' : rv.tab;

  return (
    <ParentFrame active="review" sidebar={empty ? 'caughtUp' : 'linked'}>
      <div
        className={`mx-auto flex w-full flex-col gap-[24px] pt-[clamp(0px,0.7vw,12px)] ${
          rv.rail ? 'max-w-[1506px]' : 'max-w-[1329px]'
        }`}
      >
        <div className="flex flex-col gap-[3px]">
          <div className="flex flex-wrap items-center gap-[12px]">
            <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
              {REVIEW_TITLE}
            </h1>
            {compactHeader ? null : (
              <span className="rounded-full bg-brand-green-light px-[11px] py-[5px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b] max-lg:text-[12px]">
                {total} waiting
              </span>
            )}
          </div>
          {compactHeader ? null : (
            <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999]">
              {REVIEW_INTRO}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-[20px]">
          <UnderlineTabs label="To review" activeId={activeTab} tabs={tabs} />

          {empty ? (
            <ReviewCaughtUp />
          ) : rv.view === 'assessment' ? (
            <AssessmentResults
              flagged={rv.flagged}
              onFlag={(t) => update({ modal: 'flag-result', trait: t.id })}
            />
          ) : rv.tab === 'evaluations' && evalPending ? (
            <EvaluationDetail
              onApprove={approveEvaluation}
              onHide={() => update({ modal: 'hide' })}
            />
          ) : (
            <ReviewQueue
              rows={rowsFor(rv.tab)}
              ward={ward}
              label={TABS.find((t) => t.id === rv.tab)?.label ?? 'All'}
              hrefFor={(kind, flag) =>
                kind === 'correction'
                  ? `/parent/wards/${ward.id}?tab=flags&modal=recheck&flag=${flag.id}`
                  : undefined
              }
              onAction={handleAction}
            />
          )}
        </div>
      </div>

      {rv.modal === 'certificate' ? (
        <CertificateDialog
          onClose={() => update({ modal: null })}
          onApprove={approveCertificate}
          onDecline={() => update({ modal: 'decline' })}
        />
      ) : null}
      {rv.modal === 'decline' ? (
        <ReasonNoteDialog
          title={DECLINE.title}
          intro={DECLINE.intro}
          reasons={DECLINE.reasons}
          noteLabel={DECLINE.noteLabel}
          noteHelp={DECLINE.noteHelp}
          noteError={DECLINE.noteError}
          cancelLabel={DECLINE.cancel}
          submitLabel={DECLINE.submit}
          initial={{ reason: rv.reason, note: rv.note, check: rv.check }}
          onClose={() => update({ modal: null, reason: null, note: null, check: null })}
          onSubmit={() =>
            update({
              modal: null,
              reason: null,
              note: null,
              check: null,
              done: [...done, 'certificate-declined'],
            })
          }
        />
      ) : null}
      {rv.modal === 'hide' ? (
        <HideEvaluationDialog
          onClose={() => update({ modal: null })}
          onConfirm={() => {
            log('hide evaluation from Elliot');
            update({ modal: null, tab: null, done: [...done, 'evaluation-hidden'] });
          }}
        />
      ) : null}
      {rv.modal === 'flag-result' ? (
        <ReasonNoteDialog
          title={FLAG_RESULT.title(flagTrait)}
          intro={FLAG_RESULT.intro}
          reasons={FLAG_RESULT.reasons}
          noteLabel={FLAG_RESULT.noteLabel}
          noteHelp={FLAG_RESULT.noteHelp}
          noteError={FLAG_RESULT.noteError}
          info={FLAG_RESULT.info}
          cancelLabel={FLAG_RESULT.cancel}
          submitLabel={FLAG_RESULT.submit}
          initial={{ reason: rv.reason, note: rv.note, check: rv.check }}
          onClose={() =>
            update({ modal: null, trait: null, reason: null, note: null, check: null })
          }
          onSubmit={() =>
            update({
              modal: null,
              trait: null,
              reason: null,
              note: null,
              check: null,
              flagged: [...rv.flagged, flagTrait.id],
            })
          }
        />
      ) : null}

      {rv.toast ? (
        <ActionToast
          message={TOAST[rv.toast].message}
          detail={TOAST[rv.toast].detail}
          actionLabel={TOAST[rv.toast].action}
          onAction={() => undo(rv.toast)}
          onClose={() => update({ toast: null }, { replace: true })}
          className="lg:left-[calc(50%+151px)]"
        />
      ) : null}
    </ParentFrame>
  );
};

export default ReviewPage;
