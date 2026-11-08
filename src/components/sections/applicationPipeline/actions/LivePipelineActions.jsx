import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findCard, stageOf } from '../pipelineBoardModel.js';
import CandidateDrawer from './CandidateDrawer.jsx';
import { BulkMoveDialog, NotProgressingDialog } from './ActionDialogs.jsx';
import { ExtendOfferDialog, InterviewCompletedDialog } from './OfferInterviewDialogs.jsx';
import PipelineToast from './PipelineToast.jsx';
import { LIVE_FEEDBACK_CRITERIA, STAGE_LABELS, liveExpiryOptions } from './pipelineActionData.js';
import {
  addApplicationNote,
  bulkMoveApplications,
  extendApplicationOffer,
  fetchApplicationNotes,
  moveWithMessage,
  pipelineErrorText,
} from '../../../../services/recruiterPipeline.api.js';
import { snapshotOf } from '../pipelineLive.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('LivePipelineActions');

/*
 * LivePipelineActions - the signed-in counterpart of PipelineActionLayer: the same drawer and dialogs, but every
 * confirm calls the applications API and the board reloads (useLivePipeline.reload).
 *
 *   modal { kind, id | ids }    kind: drawer | bulk-move | not-progressing | extend-offer | interview-completed
 *
 *   drawer            application facts, stage history, Team notes (GET/POST /applications/:id/notes), next-stage move
 *   bulk-move         POST /applications/bulk/change-stage  (screening | shortlisted | interview)
 *   not-progressing   PUT  /applications/:id/stage  { stage: rejected, notes: reason, message }  (message replaces the generic update)
 *   extend-offer      POST /applications/:id/extend-offer  { offerDetails, expiresAt, message }
 *   interview-completed  PUT stage interviewed (closes the open interview) + feedback note, then the chosen next step
 */

const BACKEND_STAGE = {
  applied: 'submitted',
  screening: 'under_review',
  shortlisted: 'shortlisted',
  interview: 'interview_scheduled',
};
const STAGE_NAMES = {
  submitted: 'Applied',
  under_review: 'Screening',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview scheduled',
  interviewed: 'Interviewed',
  offer_pending: 'Offer pending',
  offer_extended: 'Offer extended',
  accepted: 'Hired',
  rejected: 'Not progressed',
  withdrawn: 'Withdrew',
};
const EMPLOYMENT_LABEL = {
  'full-time-remote': 'Full-time · Remote',
  'full-time-onsite': 'Full-time · On-site',
  'full-time-hybrid': 'Full-time · Hybrid',
  'contract-remote': 'Contract · Remote',
};
const VERDICT = { 'strong-no': 'Strong no', no: 'No', yes: 'Yes', 'strong-yes': 'Strong yes' };

const when = (d) =>
  d
    ? new Date(d).toLocaleString('en-GB', {
        timeZone: 'Africa/Accra',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

const detailFor = (app) => {
  const s = snapshotOf(app);
  const where = [s.location?.city || s.city, s.location?.region || s.region]
    .filter(Boolean)
    .join(', ');
  return {
    cardId: String(app._id),
    headline: [s.headline || s.currentRole || s.educationLevel, where].filter(Boolean).join(' · '),
    openedFrom: null,
    appliedAt: when(app.appliedAt || app.createdAt),
    screening: null,
    application: app.coverLetter ? `“${String(app.coverLetter).slice(0, 600)}”` : null,
    links: [{ id: 'conversation', label: 'Open conversation', icon: 'message' }],
    activity: (app.stageHistory || [])
      .slice(-6)
      .reverse()
      .map((h, i) => ({
        id: `${h.stage}-${i}`,
        label: STAGE_NAMES[h.stage]
          ? `${STAGE_NAMES[h.stage]}${h.notes && h.notes.toLowerCase() !== STAGE_NAMES[h.stage].toLowerCase() ? ` · ${h.notes}` : ''}`
          : h.stage,
        at: when(h.enteredAt),
      })),
  };
};

const feedbackText = ({ overall, ratings, notes }, criteria) =>
  [
    `Interview feedback: ${VERDICT[overall] || overall}`,
    ...criteria.map((c) => `${c.label}: ${ratings[c.id]}/5`),
    notes ? `Notes: ${notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

const LivePipelineActions = ({
  board,
  applications,
  jobTitle,
  modal,
  setModal,
  reload,
  onSchedule,
  onError,
}) => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [notes, setNotes] = useState([]);
  const close = () => setModal(null);
  const appOf = (id) => applications.find((a) => String(a._id) === String(id)) || null;

  const drawerId = modal?.kind === 'drawer' ? modal.id : null;
  useEffect(() => {
    if (!drawerId) return undefined;
    let alive = true;
    setNotes([]);
    fetchApplicationNotes(drawerId)
      .then((rows) => alive && setNotes(rows))
      .catch((err) => log.warn('notes not loaded', err?.response?.status));
    return () => {
      alive = false;
    };
  }, [drawerId]);

  const run = async (label, fn, done) => {
    setBusy(true);
    try {
      await fn();
      log('done', label);
      await reload();
      if (done) setToast(done);
      close();
    } catch (err) {
      log.error(label, 'failed:', err?.response?.status, err?.response?.data?.type);
      onError(pipelineErrorText(err));
    } finally {
      setBusy(false);
    }
  };

  let node = null;
  const found = modal?.id ? findCard(board, modal.id) : null;
  const card = found?.card || null;

  if (modal?.kind === 'drawer' && card) {
    const app = appOf(card.id);
    node = (
      <CandidateDrawer
        card={card}
        stageId={found.stage.id}
        detail={app ? detailFor(app) : { headline: '', appliedAt: '', links: [], activity: [] }}
        busy={busy}
        notes={notes.map((n) => ({
          id: String(n._id || n.id),
          content: n.content,
          at: when(n.createdAt),
        }))}
        onAddNote={(text) =>
          addApplicationNote(card.id, text)
            .then(() => fetchApplicationNotes(card.id))
            .then(setNotes)
            .catch((err) => onError(pipelineErrorText(err)))
        }
        onClose={close}
        onNotProgressing={() => setModal({ kind: 'not-progressing', id: card.id })}
        onMove={(to) => {
          if (to === 'interview') {
            close();
            onSchedule(card.id);
          } else if (to === 'offer-extended') setModal({ kind: 'extend-offer', id: card.id });
          else
            run('drawer move', () => moveWithMessage(card.id, BACKEND_STAGE[to]), {
              title: `Success - ${card.name} moved to ${STAGE_LABELS[to]}`,
              message: 'They get a short update in the app.',
            });
        }}
        onLink={(linkId) => {
          if (linkId === 'conversation') navigate('/recruiter/messages');
        }}
      />
    );
  } else if (modal?.kind === 'bulk-move') {
    const cards = (modal.ids || []).map((id) => findCard(board, id)?.card).filter(Boolean);
    if (cards.length) {
      const from = stageOf(board, cards[0].id);
      node = (
        <BulkMoveDialog
          candidates={cards}
          fromLabel={STAGE_LABELS[from] ?? ''}
          jobTitle={jobTitle}
          onCancel={close}
          onConfirm={({ to }) =>
            run(
              'bulk move',
              async () => {
                const out = await bulkMoveApplications(
                  cards.map((c) => c.id),
                  BACKEND_STAGE[to]
                );
                if (out?.failCount) throw Object.assign(new Error('partial'), { partial: out });
              },
              {
                title: `Success - ${cards.length} candidates moved to ${STAGE_LABELS[to]}`,
                message: 'Each of them gets a short update.',
              }
            )
          }
        />
      );
    }
  } else if (modal?.kind === 'not-progressing' && card) {
    node = (
      <NotProgressingDialog
        candidate={card}
        jobTitleShort={jobTitle}
        onCancel={close}
        onConfirm={({ reason, message }) =>
          run(
            'not progressing',
            () => moveWithMessage(card.id, 'rejected', { notes: reason, message }),
            {
              title: `${card.name} moved to Not progressed`,
              message: message ? 'Your message was sent.' : 'No message was sent.',
            }
          )
        }
      />
    );
  } else if (modal?.kind === 'extend-offer' && card) {
    const job = jobTitle || 'this role';
    node = (
      <ExtendOfferDialog
        candidate={card}
        jobTitleShort={job}
        defaults={{
          salary: '',
          startDate: '',
          expires: '7-days',
          employment: 'full-time-onsite',
          expiryOptions: liveExpiryOptions(),
          hideLetter: true,
        }}
        onCancel={close}
        onConfirm={({ salary, startDate, expires, employment, message }) => {
          const days = Number(String(expires).split('-')[0]) || 7;
          run(
            'extend offer',
            () =>
              extendApplicationOffer(card.id, {
                offerDetails: {
                  salary,
                  startDate,
                  employment: EMPLOYMENT_LABEL[employment] || employment,
                },
                expiresAt: new Date(Date.now() + days * 864e5).toISOString(),
                message,
              }),
            {
              title: `Success - Offer sent to ${card.name}`,
              message: 'They can accept or decline in the app.',
            }
          );
        }}
      />
    );
  } else if (modal?.kind === 'interview-completed' && card) {
    const criteria = LIVE_FEEDBACK_CRITERIA;
    const complete = async (payload) => {
      await moveWithMessage(card.id, 'interviewed');
      await addApplicationNote(card.id, feedbackText(payload, criteria), 'interview_feedback');
    };
    node = (
      <InterviewCompletedDialog
        candidate={card}
        criteria={criteria}
        defaultNotes=""
        onCancel={close}
        onSaveForLater={(payload) =>
          run('interview completed', () => complete(payload), {
            title: `Interview with ${card.name} marked as completed`,
            message: 'Your feedback is saved in Team notes.',
          })
        }
        onSave={async (payload) => {
          setBusy(true);
          try {
            await complete(payload);
            await reload();
          } catch (err) {
            onError(pipelineErrorText(err));
            setBusy(false);
            return;
          }
          setBusy(false);
          if (payload.nextStep === 'extend-offer') setModal({ kind: 'extend-offer', id: card.id });
          else if (payload.nextStep === 'another-interview') {
            close();
            onSchedule(card.id);
          } else setModal({ kind: 'not-progressing', id: card.id });
        }}
      />
    );
  }

  return (
    <>
      {node}
      {toast ? (
        <PipelineToast
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={8000}
        />
      ) : null}
    </>
  );
};

export default LivePipelineActions;
