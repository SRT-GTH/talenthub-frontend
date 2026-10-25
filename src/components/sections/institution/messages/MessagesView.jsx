import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import {
  AUDIENCES,
  DEFAULT_DRAFT,
  DELIVERY_PROBLEM,
  MESSAGES_COPY,
  SCHEDULED_SENTENCE,
} from './data/messagesData.js';
import ComposeDialog from './ComposeDialog.jsx';
import ConfirmSendDialog from './ConfirmSendDialog.jsx';
import EmptyMessages from './EmptyMessages.jsx';
import FailedNumbersDialog from './FailedNumbersDialog.jsx';
import ThreadBanner from './ThreadBanner.jsx';
import ThreadList from './ThreadList.jsx';
import ThreadPane from './ThreadPane.jsx';
import {
  addFollowUp,
  retryDelivery,
  saveDraftThread,
  sendDraft,
  sendScheduledNow,
  setScheduledAt,
  updateDraft,
  useMessagesStore,
} from './useMessagesStore.js';

const log = debug('MessagesView');

/*
 * MessagesView — Figma 11.3.3a-g (canvas 8520:10): "Messages" title + sentence, the thread list (left) and the open thread (right).
 *   /institution/messages[/thread-1]               thread view, sent and delivery 11.3.3c · /thread-2 another thread 11.3.3d
 *   /institution/messages/new                      "New message" dialog over the thread 11.3.3a · ?step=confirm "Send to 64 students?" 11.3.3b
 *   /institution/messages/thread-3?state=scheduled scheduled banner 11.3.3e (?step=edit edits it)
 *   /institution/messages/thread-1?state=delivery-problem  SMS problem banner 11.3.3f (the foundation URL thread-4 resolves to the same thread; ?modal=failures lists the numbers)
 *   /institution/messages?state=empty              empty 11.3.3g
 * URL keys of this page: tab=drafts (the Drafts chip) · state=empty|scheduled|delivery-problem · step=confirm|edit · modal=failures.
 * ⚠️ ASSUMPTIONS: see the component headers (the group choice under "One class" / "Year group", the "Send at" field when editing, the "See the 12" list, the retry result,
 * the ⋯ button without a menu, a draft thread). The mock store is in memory.
 * Props: data (useInstitutionState()), threadId (route param or undefined), isNew (route /messages/new).
 */

const pad = (n) => String(n).padStart(2, '0');
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-10-26T07:00" → "Monday 26 Oct, 07:00" (Figma "Scheduled for Monday 26 Oct, 07:00"). */
const formatSchedule = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const initialsOf = (label) => {
  const form = label.match(/Form (\d)/);
  if (form) return `F${form[1]}`;
  return label
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

const MessagesView = ({ data, threadId, isNew }) => {
  const navigate = useNavigate();
  const store = useMessagesStore();
  const [needle, setNeedle] = useState('');
  const [announce, setAnnounce] = useState('');
  const [edit, setEdit] = useState(null);
  const empty = data.state === 'empty';
  const filter = data.tab === 'drafts' ? 'drafts' : 'all';
  const problemState = data.state === 'delivery-problem';
  const resolvedId = problemState ? 'thread-1' : (threadId ?? 'thread-1');
  const threads = useMemo(() => (empty ? [] : store.threads), [empty, store.threads]);
  const thread = threads.find((t) => t.id === resolvedId) ?? threads[0];
  const step = data.params.get('step');
  const modal = data.modal;

  useEffect(() => {
    log('mount', { resolvedId, state: data.state, step, modal, isNew });
  }, [resolvedId, data.state, step, modal, isNew]);

  const visible = useMemo(
    () =>
      threads.filter(
        (t) =>
          (filter === 'all' || t.draft) &&
          (!needle || t.title.toLowerCase().includes(needle.toLowerCase()))
      ),
    [threads, filter, needle]
  );
  const counts = { all: threads.length, drafts: threads.filter((t) => t.draft).length };

  const scheduled = thread?.id === 'thread-3' && data.state === 'scheduled' && !store.scheduledSent;
  const problem = thread?.id === 'thread-1' && problemState;
  const draft = store.draft;
  const choice =
    AUDIENCES[draft.type].find((c) => c.id === draft.choice) ?? AUDIENCES[draft.type][0];

  const base = '/institution/messages';
  const hrefFor = (t) => `${base}/${t.id}`;
  const toThread = (id, search = '') => navigate(`${base}/${id}${search}`);

  const closeCompose = () => navigate(thread ? hrefFor(thread) : base);

  const banner = (() => {
    if (scheduled) {
      return (
        <ThreadBanner
          tone="scheduled"
          title={`Scheduled for ${formatSchedule(store.scheduledAt)}`}
          sentence={SCHEDULED_SENTENCE}
          secondary={{
            label: 'Edit',
            onClick: () => {
              setEdit({
                ...DEFAULT_DRAFT,
                type: 'year',
                choice: 'form-2',
                body: thread.timeline[0].text,
                sendAt: store.scheduledAt,
              });
              data.update({ step: 'edit' }, { replace: true });
            },
          }}
          primary={{
            label: 'Send now',
            onClick: () => {
              sendScheduledNow();
              setAnnounce('Message sent to Form 2 and their guardians.');
              data.update({ state: null }, { replace: true });
            },
          }}
        />
      );
    }
    if (problem && store.retry === 'idle') {
      return (
        <ThreadBanner
          tone="problem"
          title={DELIVERY_PROBLEM.title}
          sentence={DELIVERY_PROBLEM.sentence}
          secondary={{
            label: DELIVERY_PROBLEM.see,
            onClick: () => data.update({ modal: 'failures' }),
          }}
          primary={{
            label: DELIVERY_PROBLEM.retry,
            onClick: () => {
              retryDelivery();
              setAnnounce('Retrying the 12 SMS.');
            },
          }}
        />
      );
    }
    if (problem && store.retry === 'retrying') {
      return (
        <ThreadBanner
          tone="retrying"
          title="Retrying the 12 SMS…"
          sentence="This takes a moment. You can keep working."
        />
      );
    }
    if (problem && store.retry === 'done') {
      return (
        <ThreadBanner
          tone="retried"
          title="Retried: 9 delivered"
          sentence="3 numbers still look wrong. Fix them on the student record."
          secondary={{ label: 'See the 3', onClick: () => data.update({ modal: 'failures' }) }}
        />
      );
    }
    return null;
  })();

  const items = thread
    ? [...thread.timeline, ...(store.followUps[thread.id] ?? [])].filter(
        (m) => !(m.scheduledOnly && !scheduled) || m.id === 'm2'
      )
    : [];
  // thread-3 card is only drawn on the scheduled frame (⚠️ ASSUMPTION: a sent Form 2 message has no clinic card)
  const shown =
    thread?.id === 'thread-3' && !scheduled ? items.filter((m) => !m.scheduledOnly) : items;

  const header = thread ? (scheduled ? thread.scheduledHeader : thread.header) : '';
  const placeholder = thread
    ? scheduled
      ? (thread.scheduledPlaceholder ?? thread.placeholder)
      : thread.placeholder
    : '';

  const confirmOpen = isNew && step === 'confirm';
  const composeOpen = isNew && step !== 'confirm';
  const editOpen = step === 'edit' && thread?.id === 'thread-3' && edit;
  const failuresOpen = modal === 'failures' && problem;

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
      <div className="grid grid-cols-1 gap-[10px] xl:grid-cols-[371px_minmax(0,1fr)]">
        <ThreadList
          threads={visible}
          activeId={thread?.id}
          filter={filter}
          counts={counts}
          needle={needle}
          onNeedle={setNeedle}
          onFilter={(f) =>
            data.update({ tab: f === 'drafts' ? 'drafts' : null }, { replace: true })
          }
          onRefresh={() => setAnnounce('Messages are up to date.')}
          onNew={() => navigate(`${base}/new`)}
          hrefFor={hrefFor}
        />
        {empty || !thread ? (
          <EmptyMessages onNew={() => navigate(`${base}/new`)} />
        ) : (
          <ThreadPane
            thread={thread}
            header={header}
            banner={banner}
            scheduled={scheduled}
            items={shown}
            placeholder={placeholder}
            onFollowUp={(text) => {
              addFollowUp(thread.id, text);
              setAnnounce('Follow-up sent.');
            }}
          />
        )}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
      {composeOpen ? (
        <ComposeDialog
          draft={draft}
          onChange={updateDraft}
          onClose={closeCompose}
          onSaveDraft={() => {
            saveDraftThread({ title: choice.label });
            setAnnounce('Draft saved.');
            toThread('thread-4');
          }}
          onPreview={() => data.update({ step: 'confirm' })}
        />
      ) : null}
      {confirmOpen ? (
        <ConfirmSendDialog
          students={choice.students}
          who={choice.who}
          guardians={choice.guardians}
          onCancel={() => data.update({ step: null }, { replace: true })}
          onSend={() => {
            const id = sendDraft({
              title: `${choice.label} · new message`,
              stat: `${choice.students} students · 0 opened · 0 replies`,
              header: `${choice.students} students and ${choice.guardians} guardians · sent today`,
              initials: initialsOf(choice.label),
              text: draft.body,
            });
            setAnnounce(`Message sent to ${choice.students} students.`);
            toThread(id);
          }}
        />
      ) : null}
      {editOpen ? (
        <ComposeDialog
          editing
          draft={edit}
          onChange={(patch) => setEdit((d) => ({ ...d, ...patch }))}
          onClose={() => data.update({ step: null }, { replace: true })}
          onSaveDraft={() => {
            setAnnounce('Draft saved.');
            data.update({ step: null }, { replace: true });
          }}
          onPreview={() => {
            if (edit.sendAt) setScheduledAt(edit.sendAt);
            setAnnounce('Schedule updated.');
            data.update({ step: null }, { replace: true });
          }}
        />
      ) : null}
      {failuresOpen ? (
        <FailedNumbersDialog
          count={store.retry === 'done' ? 3 : DELIVERY_PROBLEM.count}
          onClose={() => data.update({ modal: null }, { replace: true })}
        />
      ) : null}
    </div>
  );
};

export default MessagesView;
