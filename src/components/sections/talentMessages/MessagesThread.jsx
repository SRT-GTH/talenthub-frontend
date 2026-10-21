import { useEffect, useRef } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import spotPrivacy from '../../../assets/talent-messages/spot/spot-privacy.svg';
import streakFlame from '../../../assets/talent-messages/inbox/streak-flame.svg';
import { CommunitySticker } from '../talentCommunity/CommunityParts.jsx';
import InterviewCard from './cards/InterviewCard.jsx';
import JobProposalCard from './cards/JobProposalCard.jsx';
import HelpReplyPanel from './HelpReplyPanel.jsx';
import MessagesA11yExplainCard, { EXPLAIN_DEMO_TEXT } from './MessagesA11yExplainCard.jsx';
import MessagesA11yReadBar from './MessagesA11yReadBar.jsx';
import MessagesComposer from './MessagesComposer.jsx';
import MessagesThreadHeader from './MessagesThreadHeader.jsx';
import { MESSAGES_COPY } from './messagesData.js';
import { messagesActions } from './messagesStore.js';
import { interviewCardFor, jobCardFor, threadFor } from './messagesSelect.js';
import { PANE_THREAD } from './messagesStyles.js';
import {
  DatePill,
  Notice,
  OfflineBanner,
  ReceivedBubble,
  RequestBar,
  RoleSummary,
  SentBubble,
  TypingIndicator,
} from './MessagesThreadParts.jsx';

const log = debug('MessagesThread');

/*
 * Conversation pane (Figma "Software Engineer Card", 948 wide): header pill, optional offline banner and request
 * notices, the thread (date pills, received / sent bubbles, job / interview cards, role summary, typing), then — in
 * normal flow, so the thread shrinks — the Help me reply panel, then the composer (or the request actions).
 * Props: messages (useMessagesState()), view (buildInbox()), store (useMessagesStore()), offline, loading, empty,
 * onBack (phone), hidden (phone: list is showing).
 * Cards (package B) are presentational; this file owns `card.state`: pending -> View and apply = ?modal=pre-apply,
 * Not interested = state "passing" + ?modal=not-interested, Pass -> "passed", Cancel -> "pending"; the interview
 * invite's Accept sets ?state=confirmed.
 */
const firstName = (name) => name.replace(/^(Mr|Mrs|Ms|Dr)\.\s+/, '').split(' ')[0];

const EmptyThread = () => (
  <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[14px] px-[16px] text-center">
    <img src={spotPrivacy} alt="" aria-hidden="true" className="size-[168px] max-lg:size-[120px]" />
    <p className="m-0 font-sans text-[20px] font-semibold leading-normal tracking-[0.2px] text-[#1c2a21] max-lg:text-[18px]">
      {MESSAGES_COPY.empty.threadTitle}
    </p>
    <p className="m-0 max-w-[440px] font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#595959]">
      {MESSAGES_COPY.empty.threadText}
    </p>
  </div>
);

const SKELETON_BUBBLES = [
  ['start', 460, 58],
  ['start', 457, 190],
  ['start', 462, 58],
  ['end', 380, 58],
  ['end', 260, 58],
];

const ThreadSkeleton = () => (
  <div
    aria-hidden="true"
    data-msg-deco
    className="flex flex-1 flex-col items-center gap-[16px] overflow-hidden py-[8px]"
  >
    <span className="h-[28px] w-[82px] shrink-0 animate-pulse rounded-full bg-[#efefec]" />
    {SKELETON_BUBBLES.map(([side, w, h]) => (
      <div
        key={`${side}-${w}-${h}`}
        className={classNames(
          'flex w-full shrink-0',
          side === 'end' ? 'justify-end' : 'justify-start'
        )}
      >
        <span
          className="animate-pulse rounded-[12px] bg-[#efefec]"
          style={{ width: w, height: h, maxWidth: '92%' }}
        />
      </div>
    ))}
  </div>
);

const PickedSticker = () => (
  <span data-msg-deco className="absolute left-[60%] top-[6px] z-10 -translate-y-full">
    <CommunitySticker>
      <span>Picked for you</span>
      <img src={streakFlame} alt="" aria-hidden="true" className="ml-[4px] size-[15px]" />
    </CommunitySticker>
  </span>
);

const MessagesThread = ({ messages, view, store, offline, loading, empty, onBack, hidden }) => {
  const { active, pending, acceptedIds } = view;
  const scroller = useRef(null);
  const items = threadFor({ conv: active, store, messages, acceptedIds });
  const accepted = Boolean(active?.request && acceptedIds.includes(active.id));
  const lastReceived = [...items].reverse().find((i) => i.kind === 'received') ?? null;
  const showTyping =
    Boolean(active?.typing) &&
    messages.menu !== 'options' &&
    messages.modal !== 'not-interested' &&
    messages.modal !== 'pre-apply' && // T-MSG-06's background has no typing row
    messages.explain !== 'open' && // A-04 draws none
    messages.read !== 'playing' && // A-03 draws no typing indicator while reading aloud
    !messages.reply && // nor does the Help me reply panel (H-01…H-03)
    !(store.sent[active.id] ?? []).length;

  useEffect(() => {
    log('conversation', { id: active?.id, items: items.length, pending, accepted, offline });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id, pending, accepted, offline]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    // Scroll to the newest message only when the thread clearly overflows (> 24px): when it only just overflows Figma
    // keeps the top date pill whole.
    el.scrollTop = el.scrollHeight - el.clientHeight > 24 ? el.scrollHeight : 0;
  }, [active?.id, items.length, messages.explain, messages.read, messages.reply]);

  // Figma draws "Tap to retry" but not what happens next, so nothing is simulated.
  const retry = (msgId) => {
    log('retry tapped: outcome not drawn in Figma', msgId);
  };

  const onSend = (text) => {
    const id = messagesActions.send(active.id, text, { online: !offline });
    if (id && offline) {
      window.setTimeout(() => {
        if (!navigator.onLine || messages.state === 'offline') return;
        messagesActions.setStatus(id, 'delivered');
      }, 1200);
    }
  };

  // Only the menu itself is drawn: none of its actions has a drawn result, so choosing one just closes the menu.
  const onMenu = (id) => {
    log('menu item chosen: result not drawn in Figma', id);
  };

  const tools =
    messages.read || messages.explain
      ? {
          read: Boolean(messages.read) || messages.explain === 'open',
          explain: Boolean(messages.explain),
        }
      : null;
  // Figma draws the ☆ 1 reaction only in the base frames: not with Help me reply open, Calm chat on, or Explain open.
  const hideReaction = Boolean(messages.reply) || messages.calm || messages.explain === 'open';

  const renderItem = (item, idx) => {
    const key = item.id ?? `${item.kind}-${idx}`;
    switch (item.kind) {
      case 'date':
        return <DatePill key={`${item.label}-${idx}`} label={item.label} />;
      case 'received': {
        const last = lastReceived && item.id === lastReceived.id;
        return (
          <ReceivedBubble
            key={key}
            item={hideReaction && item.reaction ? { ...item, reaction: null } : item}
            tools={
              tools
                ? {
                    ...tools,
                    playing: messages.read === 'playing' && last,
                    explained: messages.explain === 'open' && last,
                  }
                : null
            }
            onListen={() => messages.update({ read: 'playing' })}
            onExplain={() =>
              messages.update({ explain: messages.explain === 'open' ? '1' : 'open' })
            }
          />
        );
      }
      case 'sent':
        return <SentBubble key={key} item={item} onRetry={retry} />;
      case 'jobCard': {
        const card = jobCardFor(active.id, store, messages) ?? item.card;
        return (
          <div
            key={key}
            className="relative w-[min(537px,100%)]"
            style={{ marginTop: item.extraBefore ?? 0 }}
          >
            {item.picked && card.state === 'pending' ? <PickedSticker /> : null}
            <JobProposalCard
              card={card}
              onApply={() => {
                log('apply -> pre-apply');
                messages.update({ modal: 'pre-apply' });
              }}
              onNotInterested={() => {
                log('not interested -> passing');
                messagesActions.setCard(active.id, 'passing');
                messages.update({ modal: 'not-interested' });
              }}
              onPass={(reason) => {
                log('pass', reason);
                messagesActions.setCard(active.id, 'passed');
                messages.update({ modal: null });
              }}
              onCancelPass={() => {
                log('cancel pass');
                messagesActions.setCard(active.id, 'pending');
                messages.update({ modal: null });
              }}
              onUndo={() => messagesActions.setCard(active.id, 'pending')}
            />
          </div>
        );
      }
      case 'interview':
        return (
          <InterviewCard
            key={key}
            card={interviewCardFor(messages)}
            onConfirm={() => {
              log('interview confirm');
              messages.update({ state: 'confirmed' });
            }}
          />
        );
      case 'roleSummary':
        return <RoleSummary key={key} item={item} />;
      default:
        return null;
    }
  };

  const notices = (() => {
    if (!active?.request) return [];
    const set = accepted ? active.notices.accepted : active.notices.pending;
    return (Array.isArray(set) ? set : [set]).map((n) => ({
      ...n,
      soft: active.id === 'request' && !accepted,
    }));
  })();

  return (
    <section
      aria-label={active ? `Conversation with ${active.name}` : 'Conversation'}
      className={classNames(
        PANE_THREAD,
        'relative flex min-h-0 min-w-0 flex-1 flex-col px-[clamp(12px,1.27vw,22px)] pb-[clamp(12px,0.81vw,14px)] pt-[clamp(12px,1.04vw,18px)]',
        hidden && 'max-lg:hidden'
      )}
    >
      {empty ? (
        <EmptyThread />
      ) : (
        <>
          <MessagesThreadHeader
            conv={active ?? { name: '', role: '', label: '' }}
            messages={messages}
            loading={loading}
            onBack={onBack}
            onPick={onMenu}
          />
          {offline && !loading ? (
            <div className="mb-[16px] shrink-0">
              <OfflineBanner />
            </div>
          ) : null}
          {loading ? (
            <ThreadSkeleton />
          ) : (
            <div className="relative flex min-h-0 flex-1 flex-col">
              <div
                ref={scroller}
                className={classNames(
                  'flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden pr-[2px]',
                  // room for the read-aloud bar that overlays the bottom of the thread (A-03)
                  messages.read === 'playing' ? 'pb-[64px]' : 'pb-[4px]'
                )}
              >
                <div
                  className="flex flex-col"
                  style={{ gap: active?.request ? 12 : (active?.gap ?? 12) }}
                >
                  {notices.length ? (
                    <div className="flex flex-col gap-[10px]">
                      {notices.map((n) => (
                        <Notice key={n.tone + (n.bold ?? n.text)} {...n} />
                      ))}
                    </div>
                  ) : null}
                  {items.map(renderItem)}
                  {showTyping ? <TypingIndicator label={active.typing} /> : null}
                  {messages.explain === 'open' && lastReceived ? (
                    <div className="w-[min(560px,100%)] shrink-0">
                      <MessagesA11yExplainCard
                        text={active.id === 'owura' ? EXPLAIN_DEMO_TEXT : lastReceived.text}
                        onHide={() => messages.update({ explain: '1' })}
                        onTwi={() => messages.update({ lang: 'twi' })}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              {messages.read === 'playing' && lastReceived ? (
                <MessagesA11yReadBar
                  speaker={firstName(active.name)}
                  text={lastReceived.text}
                  onStop={() => messages.update({ read: '1' })}
                />
              ) : null}
            </div>
          )}
          <div className="mt-[8px] mb-[12px] shrink-0 empty:hidden">
            <HelpReplyPanel messages={messages} />
          </div>
          {pending && !loading ? (
            <RequestBar
              footnote={active.footnote}
              onAccept={() => {
                // Only the first request (T-MSG-03 -> T-MSG-04) has a drawn accepted state.
                if (active.id !== 'request') {
                  log('accept: no accepted state drawn for', active.id);
                  return;
                }
                messagesActions.accept(active.id);
                messages.update({ state: 'accepted', tab: null });
              }}
              onNotNow={() => {
                log('not now');
                messages.update({ c: null, tab: null });
              }}
              onDecline={() => {
                messagesActions.decline(active.id);
                messages.update({ c: null, state: null });
              }}
              onSpam={() => {
                log('report as spam');
                messagesActions.decline(active.id);
                messages.update({ c: null, state: null });
              }}
            />
          ) : (
            <MessagesComposer messages={messages} onSend={onSend} disabled={loading} />
          )}
        </>
      )}
    </section>
  );
};

export default MessagesThread;
