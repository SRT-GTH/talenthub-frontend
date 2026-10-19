import { useEffect } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import avatarGroup from '../../../../assets/talent-skills-lab/play/group-chat-avatar.png';
import GameCompleteDialog from './personality/PersonalityDialog.jsx';
import GameShell from './personality/PersonalityChrome.jsx';
import {
  PgArrowUpIcon,
  PgCheckCircleFillIcon,
  PgEmojiSadIcon,
  PgEmojiSmileIcon,
  PgFileIcon,
  PgMoreVerticalIcon,
} from './personality/PersonalityIcons.jsx';
import { GameIntro } from './personality/PersonalityParts.jsx';
import { optionCardClass } from './personality/personalityStyles.js';
import { CHAT, speakerColor } from './personality/groupChatDramaData.js';
import { usePersonalityRun } from './personality/usePersonalityRun.js';

const log = debug('GroupChatDrama');

/*
 * Group Chat Drama — personality game "Social" (Figma SL-GP08 Your reply, Playful 7943:10463 / Focused 8110:497617).
 * Route `/skills-lab/games/group-chat-drama?f=GP08`. Props `{ frame }`: GP08 = chat 2 with reply A picked; none = chat 1.
 * Loop: read the chat, pick one of four replies (click or A–D / 1–4), "Send reply" (Enter) -> next chat; after chat 3 the
 * play-style dialog opens. ⚠️ ASSUMPTION: chats 1 and 3 and the result copy (see groupChatDramaData.js).
 * Layout note: Figma lays chat (520) + replies (517) + gap 24 = 1061px inside a 1040px column, so the replies column
 * overhangs the column by 21px from 1180px up; below lg the two stack.
 */
const VIBE_ICONS = { smile: PgEmojiSmileIcon, sad: PgEmojiSadIcon, file: PgFileIcon };
const LETTERS = ['A', 'B', 'C', 'D'];
const SEEDS = { GP08: { index: 1, pick: 0 } };

const Message = ({ message }) => (
  <li className="flex max-w-[440px] flex-col gap-[4px] rounded-[12px] bg-[rgba(229,229,229,0.5)] px-[14px] py-[10px] font-sans">
    <span
      className="text-[13px] leading-[16px] font-bold"
      style={{ color: speakerColor(message.who) }}
    >
      {message.who}
    </span>
    <span className="text-[15px] leading-[21px] font-normal text-[#1c2a21]">{message.text}</span>
    <span className="text-[11.5px] leading-[14px] font-normal text-[#595959] max-lg:text-[12px]">
      {message.time}
    </span>
  </li>
);

const ChatCard = ({ chat }) => (
  <section
    aria-label={`${CHAT.group.name} chat`}
    className="flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-solid border-[rgba(28,42,33,0.12)] bg-white"
  >
    <div className="flex items-center gap-[12px] bg-[#387440] px-[18px] py-[14px]">
      <img
        src={avatarGroup}
        alt=""
        draggable="false"
        className="size-[44px] shrink-0 rounded-full border-2 border-solid border-white object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-[2px] font-sans text-white">
        <span className="text-[16px] leading-[19px] font-semibold">{CHAT.group.name}</span>
        <span className="text-[13px] leading-[16px] font-normal max-lg:text-[13px]">
          {CHAT.group.members}
        </span>
      </div>
      <PgMoreVerticalIcon className="size-[20px] shrink-0 text-white" />
    </div>
    <div className="flex flex-1 flex-col gap-[12px] p-[20px]">
      <p className="m-0 text-center font-sans text-[12px] leading-[14px] font-semibold text-[#1c2a21]">
        Today
      </p>
      <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
        {chat.messages.map((message, i) => (
          <Message key={i} message={message} />
        ))}
      </ul>
      <div className="flex w-fit items-center gap-[8px] rounded-[12px] bg-[rgba(229,229,229,0.5)] px-[14px] py-[10px] font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
        {CHAT.typing}
        <span aria-hidden="true" className="flex gap-[8px]">
          <i className="block size-[7px] rounded-full bg-[rgba(28,42,33,0.3)]" />
          <i className="block size-[7px] rounded-full bg-[rgba(28,42,33,0.5)]" />
          <i className="block size-[7px] rounded-full bg-[rgba(28,42,33,0.7)]" />
        </span>
      </div>
    </div>
    <div className="flex items-center gap-[10px] border-t border-solid border-[rgba(28,42,33,0.1)] bg-white px-[16px] py-[12px] playful:border-[rgba(28,42,33,0.15)]">
      <span className="min-w-0 flex-1 font-sans text-[14px] leading-[17px] text-[#595959]">
        {CHAT.composer}
      </span>
      <span
        aria-hidden="true"
        className="inline-flex size-[40px] shrink-0 items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] text-white playful:border-[1.5px] playful:border-[#1c2a21]"
      >
        <PgArrowUpIcon className="size-[18px]" />
      </span>
    </div>
  </section>
);

const Replies = ({ chat, run, locked }) => (
  <div role="radiogroup" aria-label="Your reply" className="flex min-w-0 flex-col gap-[12px]">
    {chat.replies.map((text, i) => {
      const selected = run.pick === i;
      return (
        <button
          key={LETTERS[i]}
          type="button"
          role="radio"
          aria-checked={selected}
          disabled={locked}
          onClick={() => run.select(i)}
          className={classNames(
            'flex cursor-pointer flex-col gap-[8px] rounded-[18px] px-[18px] py-[14px] font-sans disabled:cursor-default',
            optionCardClass(selected),
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]'
          )}
        >
          <span className="flex items-center gap-[8px]">
            <span
              aria-hidden="true"
              className={classNames(
                'inline-flex h-[20px] items-center rounded-[8px] px-[8px] text-[12px] leading-[14px] font-bold',
                selected ? 'bg-[#387440] text-white' : 'bg-[#f8f8f4] text-[#1c2a21]'
              )}
            >
              {LETTERS[i]}
            </span>
            <span className="min-w-0 flex-1 text-[12.5px] leading-[15px] font-bold text-[#1c2a21]">
              {CHAT.replyNames[i]}
            </span>
            {selected ? (
              <PgCheckCircleFillIcon className="size-[18px] shrink-0 text-[#387440]" />
            ) : null}
          </span>
          <span className="text-[15px] leading-[22px] font-medium text-[#1c2a21]">{text}</span>
        </button>
      );
    })}
  </div>
);

const GroupChatDrama = ({ frame }) => {
  const run = usePersonalityRun({
    total: CHAT.chats.length,
    seed: SEEDS[frame],
    gameId: 'group-chat-drama',
  });
  const chat = CHAT.chats[run.index];

  useEffect(() => {
    log('mount', { frame });
  }, [frame]);

  useEffect(() => {
    const onKey = (event) => {
      if (run.finished || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName)) return;
      const k = event.key.toUpperCase();
      const at = LETTERS.indexOf(k) >= 0 ? LETTERS.indexOf(k) : Number(k) - 1;
      if (at >= 0 && at < LETTERS.length) run.select(at);
      else if (event.key === 'Enter' && event.target?.tagName !== 'BUTTON') run.confirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const done = run.finished;
  const Vibe = VIBE_ICONS[chat.vibe.icon];
  const Meter = VIBE_ICONS[chat.meter.icon];
  return (
    <GameShell
      title={CHAT.title}
      subtitle={done ? CHAT.doneSubtitle : CHAT.subtitle}
      sticker={done ? CHAT.complete.sticker : chat.sticker}
      xp={done ? CHAT.doneXp : CHAT.xp}
      progress={{
        label: `Chat ${done ? run.total : run.round} of ${run.total}`,
        segments: run.segments,
        note: done ? CHAT.doneNote : CHAT.progressNote,
      }}
      footer={
        done
          ? {
              info: CHAT.doneInfo,
              link: { label: 'Replay', onClick: run.restart },
              secondary: { label: 'Back to Arcade', onClick: run.goArcade },
              action: { label: 'Play next game', onClick: run.goNext },
            }
          : {
              info: CHAT.info,
              // ⚠️ ASSUMPTION: "Pause" saves and leaves for the Arcade.
              link: { label: 'Pause', onClick: run.goArcade },
              action: { label: 'Send reply', onClick: run.confirm, disabled: run.pick === null },
            }
      }
      overlay={
        done ? (
          <GameCompleteDialog
            result={CHAT.complete}
            onClose={run.goArcade}
            onSecondary={run.goArcade}
            onPrimary={run.goNext}
            onNext={run.goNext}
          />
        ) : null
      }
    >
      <GameIntro
        eyebrow={chat.eyebrow}
        title={chat.title}
        body={chat.body}
        stats={[
          { icon: Vibe, label: chat.vibe.label },
          { icon: Meter, label: chat.meter.label },
        ]}
        reads={CHAT.reads}
      />
      <div className="grid gap-[24px] lg:grid-cols-[520px_1fr] min-[1180px]:w-[1061px] min-[1180px]:grid-cols-[520px_517px] min-[1180px]:max-w-none">
        <ChatCard chat={chat} />
        <Replies chat={chat} run={run} locked={done} />
      </div>
    </GameShell>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const GAMES = { 'group-chat-drama': GroupChatDrama };

export default GroupChatDrama;
