import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import {
  apiMessage,
  createMessage,
  followUpMessage,
  getMessage,
  messageAudiences,
  messageFailures,
  removeMessage,
  retryMessage,
  updateMessage,
} from '../../../../services/institutionPortal.api.js';
import { MESSAGES_COPY, SCHEDULED_SENTENCE, deliveryProblem } from './data/messagesData.js';
import { useInstitutionSession } from '../useInstitutionSession.js';
import ComposeDialog from './ComposeDialog.jsx';
import ConfirmSendDialog from './ConfirmSendDialog.jsx';
import EmptyMessages from './EmptyMessages.jsx';
import FailedNumbersDialog from './FailedNumbersDialog.jsx';
import ThreadBanner from './ThreadBanner.jsx';
import ThreadList from './ThreadList.jsx';
import ThreadPane from './ThreadPane.jsx';
import {
  getStoreThread,
  loadThreads,
  resetDraft,
  startDraft,
  updateDraft,
  useMessagesStore,
} from './useMessagesStore.js';

const log = debug('MessagesView');

/*
 * MessagesView — Figma 11.3.3a-g (canvas 8520:10): "Messages" title + sentence, the thread list (left) and the open thread (right).
 *   /institution/messages[/<id>]          a thread 11.3.3c/d (the first one when no id) · scheduled banner 11.3.3e · guardian-copy problem banner 11.3.3f
 *   /institution/messages/new             "New message" 11.3.3a · ?step=confirm "Send to n students?" 11.3.3b
 *   /institution/messages/<id>?step=edit  finish a draft / edit a scheduled message (same dialog) · ?step=edit-confirm its confirmation
 *   ?modal=failures                        the guardians whose copy failed
 * Live: /api/institution/messages (institutionMessages.service.js). A sent message is in each reachable student's own GTH Messages inbox; their
 * replies come back here. The list is empty (11.3.3g) until the school sends or saves its first message.
 * URL keys of this page: tab=drafts (the Drafts chip) · step=confirm|edit|edit-confirm · modal=failures.
 * Props: data (useInstitutionState()), threadId (route param or undefined), isNew (route /messages/new).
 */

const pad = (n) => String(n).padStart(2, '0');
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** a Date / ISO / "2026-10-26T07:00" → "Monday 26 Oct, 07:00" (local time). */
const formatSchedule = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
/** ISO → the value of a datetime-local input (local time). */
const toLocalInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const MessagesView = ({ data, threadId, isNew }) => {
  const navigate = useNavigate();
  const store = useMessagesStore();
  const session = useInstitutionSession();
  const reloadSession = session.reload;
  const [needle, setNeedle] = useState('');
  const [announce, setAnnounce] = useState('');
  const [thread, setThread] = useState(null);
  const [threadError, setThreadError] = useState('');
  const [audiences, setAudiences] = useState(null);
  const [failures, setFailures] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const filter = data.tab === 'drafts' ? 'drafts' : 'all';
  const step = data.params.get('step');
  const modal = data.modal;
  const { update } = data;
  const base = '/institution/messages';

  useEffect(() => {
    loadThreads();
  }, []);

  const openId = threadId ?? (!isNew ? store.threads[0]?.id : null);

  const loadThread = useCallback(
    async (id) => {
      if (!id) {
        setThread(null);
        return;
      }
      setThreadError('');
      const hadUnread = Boolean(getStoreThread(id)?.unread);
      try {
        setThread(await getMessage(id));
        // opening a thread marks its replies seen: refresh the list and the top-bar Messages badge
        if (hadUnread) {
          loadThreads();
          reloadSession?.();
        }
      } catch (err) {
        setThreadError(apiMessage(err));
      }
    },
    [reloadSession]
  );

  useEffect(() => {
    log('open', { openId });
    loadThread(openId);
  }, [openId, loadThread]);

  // the compose dialogs need the groups
  const composing = isNew || step === 'edit' || step === 'edit-confirm';
  useEffect(() => {
    if (composing && !audiences) {
      messageAudiences()
        .then((a) => {
          setAudiences(a);
          if (!store.draft.choice) {
            const first = a?.[store.draft.type]?.[0] ?? a?.year?.[0];
            if (first)
              updateDraft({
                choice: first.id,
                type: a?.[store.draft.type]?.length ? store.draft.type : 'year',
              });
          }
        })
        .catch((err) => setError(apiMessage(err)));
    }
  }, [composing, audiences, store.draft.choice, store.draft.type]);

  useEffect(() => {
    if (modal === 'failures' && openId) {
      setFailures(null);
      messageFailures(openId)
        .then((r) => setFailures(r.items ?? []))
        .catch(() => setFailures([]));
    }
  }, [modal, openId]);

  const visible = useMemo(
    () =>
      store.threads.filter(
        (t) =>
          (filter === 'all' || t.draft) &&
          (!needle || t.title.toLowerCase().includes(needle.toLowerCase()))
      ),
    [store.threads, filter, needle]
  );

  const draft = store.draft;
  const group = audiences?.[draft.type]?.find((c) => c.id === draft.choice) ?? null;
  const payload = () => ({
    audience: { type: draft.type, choice: draft.choice },
    body: draft.body,
    programmeId:
      draft.type === 'programme' && draft.attach && group?.programmeId ? group.programmeId : null,
    attach: draft.attach,
    sendAt: draft.sendAt ? new Date(draft.sendAt).toISOString() : null,
  });

  const afterSave = async (res, message) => {
    await loadThreads();
    resetDraft();
    setAnnounce(message);
    navigate(`${base}/${res.id}`);
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

  const saveDraft = () =>
    run(async () => {
      const res = store.draftId
        ? await updateMessage(store.draftId, { ...payload(), mode: 'draft' })
        : await createMessage({ ...payload(), mode: 'draft' });
      await afterSave(res, 'Draft saved.');
    });

  const sendOrSchedule = () =>
    run(async () => {
      const mode = draft.sendAt ? 'schedule' : 'send';
      const res = store.draftId
        ? await updateMessage(store.draftId, { ...payload(), mode })
        : await createMessage({ ...payload(), mode });
      await afterSave(
        res,
        mode === 'send'
          ? `Message sent to ${group?.reachable ?? 0} students in GTH.`
          : `Scheduled for ${formatSchedule(draft.sendAt)}.`
      );
    });

  const cancelScheduled = () =>
    run(async () => {
      await removeMessage(thread.id);
      await loadThreads();
      resetDraft();
      setAnnounce('Scheduled message cancelled.');
      navigate(base);
    });

  const editThread = () => {
    startDraft(
      {
        type: thread.audience.type,
        choice: thread.audience.choice,
        body: thread.body ?? '',
        attach: Boolean(thread.programmeId),
        sendAt: toLocalInput(thread.sendAt),
      },
      thread.id
    );
    update({ step: 'edit' }, { replace: true });
  };

  const followUp = async (text) => {
    let ok = false;
    await run(async () => {
      setThread(await followUpMessage(thread.id, text));
      await loadThreads();
      setAnnounce('Follow-up sent.');
      ok = true;
    });
    return ok;
  };

  const banner = (() => {
    if (!thread) return null;
    if (thread.status === 'scheduled') {
      return (
        <ThreadBanner
          tone="scheduled"
          title={`Scheduled for ${formatSchedule(thread.sendAt)}`}
          sentence={SCHEDULED_SENTENCE(thread.audience.label)}
          secondary={{ label: 'Edit', onClick: editThread }}
          primary={{
            label: busy ? 'Sending…' : 'Send now',
            onClick: () =>
              run(async () => {
                const res = await updateMessage(thread.id, { mode: 'send' });
                setThread(res);
                await loadThreads();
                setAnnounce(`Message sent to ${thread.audience.label}.`);
              }),
          }}
        />
      );
    }
    const failed = thread.delivery?.guardiansFailed ?? 0;
    if (thread.status === 'sent' && failed > 0) {
      const p = deliveryProblem(failed);
      return (
        <ThreadBanner
          tone={thread.delivery.retriedAt ? 'retried' : 'problem'}
          title={p.title}
          sentence={p.sentence}
          secondary={{ label: p.see, onClick: () => update({ modal: 'failures' }) }}
          primary={{
            label: busy ? 'Retrying…' : p.retry,
            onClick: () =>
              run(async () => {
                const r = await retryMessage(thread.id);
                await loadThread(thread.id);
                setAnnounce(`Retried ${r.tried}: ${r.delivered} delivered.`);
              }),
          }}
        />
      );
    }
    return null;
  })();

  const composeOpen = (isNew && step !== 'confirm') || step === 'edit';
  const confirmOpen = (isNew && step === 'confirm') || step === 'edit-confirm';
  const editing = step === 'edit' || step === 'edit-confirm' ? (thread?.status ?? null) : null;
  const closeCompose = () => {
    resetDraft();
    setError('');
    if (isNew) navigate(openId ? `${base}/${openId}` : base);
    else update({ step: null }, { replace: true });
  };
  const noThreads = store.loaded && !store.threads.length;

  return (
    <div className="flex min-w-0 flex-col gap-[24px] font-sans">
      <header className="flex flex-col gap-[3px]">
        <h1 className="m-0 text-[28px] leading-[36px] font-semibold tracking-[-0.16px] text-[#1c2a21] md:text-[32px] md:leading-[40px]">
          {MESSAGES_COPY.title}
        </h1>
        <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
          {MESSAGES_COPY.sentence}
        </p>
      </header>
      {announce ? (
        <p
          role="status"
          className="m-0 rounded-[12px] border border-solid border-[#e1eae2] bg-[#f3f8f4] px-[16px] py-[12px] text-[14px] leading-[20px] text-[#224626]"
        >
          {announce}
        </p>
      ) : null}
      {store.error || threadError ? (
        <p role="alert" className="m-0 text-[14px] leading-[20px] text-[#902b20]">
          {store.error || threadError}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-[10px] xl:grid-cols-[371px_minmax(0,1fr)]">
        <ThreadList
          threads={visible}
          activeId={thread?.id}
          filter={filter}
          counts={store.counts}
          needle={needle}
          onNeedle={setNeedle}
          onFilter={(f) => update({ tab: f === 'drafts' ? 'drafts' : null }, { replace: true })}
          onRefresh={async () => {
            await loadThreads();
            await loadThread(openId);
            setAnnounce('Messages are up to date.');
          }}
          onNew={() => {
            resetDraft();
            navigate(`${base}/new`);
          }}
          hrefFor={(t) => `${base}/${t.id}`}
        />
        {!store.loaded ? (
          <p className="m-0 rounded-[24px] border-[1.2px] border-solid border-[#00522b]/10 bg-white p-[24px] text-[14px] text-[#737373]">
            Loading messages…
          </p>
        ) : noThreads || !thread ? (
          noThreads ? (
            <EmptyMessages
              onNew={() => {
                resetDraft();
                navigate(`${base}/new`);
              }}
            />
          ) : (
            <p className="m-0 rounded-[24px] border-[1.2px] border-solid border-[#00522b]/10 bg-white p-[24px] text-[14px] text-[#737373]">
              Loading the conversation…
            </p>
          )
        ) : (
          <ThreadPane
            thread={thread}
            banner={banner}
            busy={busy}
            onFollowUp={followUp}
            onEditDraft={editThread}
          />
        )}
      </div>
      {composeOpen ? (
        <ComposeDialog
          draft={draft}
          audiences={audiences}
          editing={editing}
          busy={busy}
          error={error}
          onChange={updateDraft}
          onClose={closeCompose}
          onSaveDraft={editing === 'scheduled' ? cancelScheduled : saveDraft}
          onPreview={() => {
            setError('');
            if (draft.sendAt && new Date(draft.sendAt).getTime() < Date.now()) {
              setError('Pick a time in the future, or clear “Send later” to send now.');
              return;
            }
            update({ step: isNew ? 'confirm' : 'edit-confirm' });
          }}
        />
      ) : null}
      {confirmOpen && group ? (
        <ConfirmSendDialog
          group={group}
          scheduleLabel={draft.sendAt ? formatSchedule(draft.sendAt) : null}
          busy={busy}
          error={error}
          onCancel={() => update({ step: isNew ? null : 'edit' }, { replace: true })}
          onSend={sendOrSchedule}
        />
      ) : null}
      {modal === 'failures' && thread ? (
        <FailedNumbersDialog
          items={failures}
          onClose={() => update({ modal: null }, { replace: true })}
        />
      ) : null}
    </div>
  );
};

export default MessagesView;
