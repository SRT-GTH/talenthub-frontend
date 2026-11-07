import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findCard, stageOf } from '../pipelineBoardModel.js';
import CandidateDrawer from './CandidateDrawer.jsx';
import {
  BulkMoveDialog,
  NotProgressingDialog,
  OfferAcceptedDialog,
  OfferDeclinedDialog,
} from './ActionDialogs.jsx';
import { ExtendOfferDialog, InterviewCompletedDialog } from './OfferInterviewDialogs.jsx';
import PipelineToast from './PipelineToast.jsx';
import {
  CANDIDATE_DETAILS,
  INTERVIEW_SCHEDULED_TOAST,
  MOVE_NOTIFY_COPY,
  NOT_PROGRESSED_TOAST,
  OFFER_SENT_TOAST,
  STAGE_LABELS,
  fallbackDetail,
} from './pipelineActionData.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('PipelineActionLayer');

/*
 * PipelineActionLayer — dialogs, candidate drawer and toasts of the Application Pipeline actions, on top of the board. It reads the URL itself; the board section mounts it once with `board` (after the scenario, before filters).
 *
 *   key        values                                                                 frame (Figma page "Recruiter - Application Pipeline", 10172:10101)
 *   ---------  ---------------------------------------------------------------------  -------------------------------------------------------------
 *   drawer     <cardId>                                                               PL-03  ?drawer=ama-boateng
 *   modal      bulk-move (candidate=<id,id,…>)                                        PL-07  ?modal=bulk-move&candidate=ama-boateng,eleanor-fant,marcus-thorne&selected=<same>
 *              not-progressing (candidate=<id>)                                       PL-08  ?modal=not-progressing&candidate=marcus-thorne&selected=ama-boateng,eleanor-fant,marcus-thorne
 *              extend-offer (candidate=<id>)                                          PL-10  ?modal=extend-offer&candidate=sarah-jenkins&selected=<same as PL-08>
 *              offer-accepted (candidate=<id>)                                        PL-12  ?scenario=offer-sent-sarah&scroll=end&modal=offer-accepted&candidate=akosua-quansah
 *              offer-declined (candidate=<id>)                                        PL-13  ?scenario=offer-sent-sarah&scroll=end&modal=offer-declined&candidate=akosua-quansah
 *              interview-completed (candidate=<id>)                                   PL-14  ?scenario=offer-sent-sarah&scroll=end&modal=interview-completed&candidate=sarah-jenkins
 *              move-notify (candidate, to)  -> the "Tell <first>?" toast               PL-05  ?modal=move-notify&candidate=eleanor-fant&from=applied&to=shortlisted&justMoved=eleanor-fant-recent
 *   toast      not-progressed-sent (candidate=<id>)                                   PL-09  ?scenario=marcus-not-progressed&scroll=end&toast=not-progressed-sent&candidate=marcus-thorne
 *              offer-sent (candidate=<id>)                                            PL-11  ?scenario=offer-sent-sarah&scroll=end&toast=offer-sent&candidate=sarah-jenkins
 *              interview-scheduled (candidate=<id>)                                   PL-16  ?scenario=offer-sent-sarah&scroll=end&toast=interview-scheduled&candidate=ella-mensah
 *   candidate  card id(s) the dialog or toast is about        from / to  stage ids of the move prompt
 * Closing removes modal, candidate, from, to, drawer, toast only. Confirming writes the follow-up: `moved=<id>:<stage>` pairs (the board applies them) or a `scenario`, plus a `toast`.
 * ⚠️ ASSUMPTION: Undo / View message / View details / Send update only close the toast or navigate (their results are not drawn); a toast written by an in-app action auto-dismisses after 8 s, a toast opened by URL stays.
 */
const CLOSE_KEYS = ['modal', 'candidate', 'from', 'to', 'drawer', 'toast'];
const JOB_TITLE_SHORT = 'Senior UX Designer';

const parseMoved = (value) =>
  (value ?? '')
    .split(',')
    .map((pair) => pair.split(':'))
    .filter(([id, to]) => id && to);

const PipelineActionLayer = ({ board }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [liveToast, setLiveToast] = useState(false);
  const modal = searchParams.get('modal');
  const drawer = searchParams.get('drawer');
  const toast = searchParams.get('toast');
  const candidateIds = (searchParams.get('candidate') ?? '').split(',').filter(Boolean);
  const to = searchParams.get('to');
  const firstId = candidateIds[0] ?? null;

  const paramsRef = useRef(searchParams);
  useEffect(() => {
    paramsRef.current = searchParams;
  }, [searchParams]);

  const write = useCallback(
    (patch) => {
      const next = new URLSearchParams(paramsRef.current);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === null || value === undefined) next.delete(key);
        else next.set(key, value);
      });
      log('write', patch);
      // Keep the ref current so two writes in one tick (a toast action, then its close) build on each other.
      paramsRef.current = next;
      setSearchParams(next);
    },
    [setSearchParams]
  );
  const closeAll = useCallback(
    (extra = {}) =>
      write({ ...Object.fromEntries(CLOSE_KEYS.map((key) => [key, null])), ...extra }),
    [write]
  );
  const addMoved = (pairs) => {
    const merged = [...parseMoved(paramsRef.current.get('moved')), ...pairs];
    return merged.map((pair) => pair.join(':')).join(',');
  };
  const removeMoved = (id) => {
    const rest = parseMoved(paramsRef.current.get('moved')).filter(([moved]) => moved !== id);
    return rest.length ? rest.map((pair) => pair.join(':')).join(',') : null;
  };

  useEffect(() => {
    log('mount / url', { modal, drawer, toast, candidate: candidateIds, to });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, drawer, toast, searchParams.get('candidate'), to]);

  const found = firstId ? findCard(board, firstId) : null;
  const card = found?.card ?? null;

  // ---- toasts ----
  let toastNode = null;
  if (modal === 'move-notify' && card) {
    const first = card.name.split(' ')[0];
    toastNode = (
      <PipelineToast
        title={MOVE_NOTIFY_COPY.title(card.name, STAGE_LABELS[to] ?? to ?? '')}
        message={MOVE_NOTIFY_COPY.message(first)}
        actionLabel={MOVE_NOTIFY_COPY.action}
        onAction={() => {
          log('branch: send update (no follow-up drawn)', { id: card.id });
          closeAll();
        }}
        onClose={() => closeAll()}
        duration={liveToast ? 8000 : 0}
      />
    );
  } else if (toast === 'not-progressed-sent' && card) {
    toastNode = (
      <PipelineToast
        title={NOT_PROGRESSED_TOAST.title(card.name)}
        message={NOT_PROGRESSED_TOAST.message}
        actionLabel={NOT_PROGRESSED_TOAST.action}
        onAction={() => {
          log('branch: undo not progressing', { id: card.id });
          closeAll({
            scenario:
              searchParams.get('scenario') === 'marcus-not-progressed'
                ? null
                : searchParams.get('scenario'),
            moved: removeMoved(card.id),
          });
        }}
        onClose={() => closeAll()}
        duration={liveToast ? 8000 : 0}
      />
    );
  } else if (toast === 'offer-sent' && card) {
    toastNode = (
      <PipelineToast
        title={OFFER_SENT_TOAST.title(card.name)}
        message={OFFER_SENT_TOAST.message(card.name.split(' ')[0])}
        actionLabel={OFFER_SENT_TOAST.action}
        onAction={() => navigate('/recruiter/messages')}
        onClose={() => closeAll()}
        duration={liveToast ? 8000 : 0}
      />
    );
  } else if (toast === 'interview-scheduled' && card) {
    toastNode = (
      <PipelineToast
        title={INTERVIEW_SCHEDULED_TOAST.title(card.name)}
        message={INTERVIEW_SCHEDULED_TOAST.message}
        actionLabel={INTERVIEW_SCHEDULED_TOAST.action}
        onAction={() => closeAll({ drawer: card.id })}
        onClose={() => closeAll()}
        duration={liveToast ? 8000 : 0}
      />
    );
  }

  // ---- drawer ----
  let drawerNode = null;
  const drawerFound = drawer ? findCard(board, drawer) : null;
  if (drawerFound) {
    const drawerCard = drawerFound.card;
    drawerNode = (
      <CandidateDrawer
        card={drawerCard}
        stageId={drawerFound.stage.id}
        detail={CANDIDATE_DETAILS[drawerCard.id] ?? fallbackDetail(drawerCard)}
        onClose={() => closeAll()}
        onNotProgressing={() => closeAll({ modal: 'not-progressing', candidate: drawerCard.id })}
        onMove={(toStage) => {
          log('branch: drawer move', { id: drawerCard.id, toStage });
          closeAll({
            modal: 'move-notify',
            candidate: drawerCard.id,
            from: drawerFound.stage.id,
            to: toStage,
            moved: addMoved([[drawerCard.id, toStage]]),
          });
        }}
        onLink={(linkId) => {
          if (linkId === 'conversation') navigate('/recruiter/messages');
          else if (linkId === 'profile') navigate(`/recruiter/talent-search/${drawerCard.id}`);
          else log('branch: link has no target in the mock', { linkId });
        }}
      />
    );
  }

  // ---- dialogs ----
  let dialogNode = null;
  if (modal === 'bulk-move') {
    const cards = candidateIds.map((id) => findCard(board, id)?.card).filter(Boolean);
    if (cards.length) {
      const fromStage = stageOf(board, cards[0].id);
      dialogNode = (
        <BulkMoveDialog
          candidates={cards}
          fromLabel={STAGE_LABELS[fromStage] ?? ''}
          jobTitle={JOB_TITLE_SHORT}
          defaultTo={
            to === 'screening' || to === 'shortlisted' || to === 'interview' ? to : undefined
          }
          onCancel={() => closeAll()}
          onConfirm={({ to: target }) =>
            closeAll({
              moved: addMoved(cards.map((item) => [item.id, target])),
              selected: null,
            })
          }
        />
      );
    }
  } else if (modal === 'not-progressing' && card) {
    dialogNode = (
      <NotProgressingDialog
        candidate={card}
        jobTitleShort={JOB_TITLE_SHORT}
        onCancel={() => closeAll()}
        onConfirm={() => {
          setLiveToast(true);
          const isMarcus = card.id === 'marcus-thorne';
          closeAll({
            toast: 'not-progressed-sent',
            candidate: card.id,
            selected: null,
            scroll: 'end',
            ...(isMarcus
              ? { scenario: searchParams.get('scenario') ?? 'marcus-not-progressed' }
              : { moved: addMoved([[card.id, 'not-progressed']]) }),
          });
        }}
      />
    );
  } else if (modal === 'extend-offer' && card) {
    dialogNode = (
      <ExtendOfferDialog
        candidate={card}
        jobTitleShort={JOB_TITLE_SHORT}
        onCancel={() => closeAll()}
        onConfirm={() => {
          setLiveToast(true);
          const isSarah = card.id === 'sarah-jenkins';
          closeAll({
            toast: 'offer-sent',
            candidate: card.id,
            selected: null,
            scroll: 'end',
            ...(isSarah
              ? { scenario: 'offer-sent-sarah' }
              : { moved: addMoved([[card.id, 'offer-extended']]) }),
          });
        }}
      />
    );
  } else if (modal === 'offer-accepted' && card) {
    dialogNode = (
      <OfferAcceptedDialog
        candidate={card}
        jobTitleShort={JOB_TITLE_SHORT}
        onCancel={() => closeAll()}
        onConfirm={() => closeAll({ moved: addMoved([[card.id, 'hired']]), scroll: 'end' })}
      />
    );
  } else if (modal === 'offer-declined' && card) {
    dialogNode = (
      <OfferDeclinedDialog
        candidate={card}
        onCancel={() => closeAll()}
        onMoveToNotProgressed={() => closeAll({ modal: 'not-progressing', candidate: card.id })}
        onStep={(step) => {
          if (step === 'next-candidate')
            closeAll({ modal: 'extend-offer', candidate: 'sarah-jenkins' });
          else if (step === 'review-shortlisted') closeAll({ stage: 'shortlisted' });
          else closeAll();
        }}
      />
    );
  } else if (modal === 'interview-completed' && card) {
    dialogNode = (
      <InterviewCompletedDialog
        candidate={card}
        onCancel={() => closeAll()}
        onSaveForLater={() => closeAll()}
        onSave={({ nextStep }) => {
          if (nextStep === 'extend-offer') closeAll({ modal: 'extend-offer', candidate: card.id });
          else if (nextStep === 'another-interview')
            closeAll({ modal: 'schedule-interview', candidate: card.id });
          else closeAll({ modal: 'not-progressing', candidate: card.id });
        }}
      />
    );
  }

  return (
    <>
      {drawerNode}
      {dialogNode}
      {toastNode}
    </>
  );
};

export default PipelineActionLayer;
