import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  A11yContrastIcon,
  A11yLinkIcon,
  A11yMotionIcon,
  A11yPanelSparkleIcon,
  A11yTextSizeIcon,
} from '../../shared/assets.jsx';
import { Toggle } from '../talentHome/TalentA11yMenu.jsx';
import { findNavButton, useNavPopoverPos } from './MessagesA11yAnchor.js';
import { useMessagesA11yStore } from './MessagesA11yPrefs.js';
import {
  CloudIcon,
  EnterIcon,
  MessageIcon,
  SparkIcon,
  TextSizeIcon,
  VolumeIcon,
} from './dIcons.jsx';

const log = debug('MessagesA11yPanel');

/*
 * MessagesA11yPanel — Figma "GTH · Accessibility mode" (7477:62284) as drawn in the Messages tab: A-01 7489:5819 /
 * 8110:453594, A-01c 8808:456563 / 8808:457245 (collapsed rail, same panel). 320px card under the top-nav
 * accessibility button, scope tabs Everywhere | In Messages, and the Messages options Read messages aloud · Chat text
 * size (A A A) · Explain it simply · Calm chat · Enter adds a new line. Copy verbatim from the node `characters`.
 *
 * Props: messages = useMessagesState() object; onClose(). Toggles write the URL via messages.update({calm, read,
 * explain, large}); size small/medium and "Enter adds a new line" live in MessagesA11yPrefs (in-memory).
 * The "Everywhere" tab is drawn but its content is not, so it is disabled (nothing is invented for it).
 */
const SIZES = [
  { id: 'small', label: 'Small text', cls: 'text-[12px]' },
  { id: 'medium', label: 'Medium text', cls: 'text-[13px]' },
  { id: 'large', label: 'Large text', cls: 'text-[15px]' },
];

const Row = ({ icon, title, sub, children }) => (
  <div className="flex items-center gap-[12px] px-[16px] py-[11px]">
    <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] border border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] text-[#2d5d33] playful:border-[1.2px] playful:border-[#1c2a21]">
      {icon}
    </span>
    <span className="flex min-w-0 flex-1 flex-col leading-[normal]">
      <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">{title}</span>
      <span className="text-[12px] leading-[14px] text-[#737373]">{sub}</span>
    </span>
    {children}
  </div>
);

const MessagesA11yPanel = ({ messages, onClose }) => {
  const ref = useRef(null);
  const pos = useNavPopoverPos('a11y');
  const [snap, setStore] = useMessagesA11yStore();
  const [scope, setScope] = useState('messages');
  const size = messages.large ? 'large' : snap.size;
  const readOn = Boolean(messages.read);
  const explainOn = Boolean(messages.explain);

  useEffect(() => {
    log('mount', { calm: messages.calm, read: messages.read, explain: messages.explain, size });
    const onKey = (e) => {
      if (e.key === 'Escape') {
        log('Esc -> close');
        onClose?.();
      }
    };
    const onDown = (e) => {
      if (ref.current?.contains(e.target)) return;
      if (findNavButton('a11y')?.contains(e.target)) return;
      onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const pickSize = (id) => {
    log('text size', id);
    setStore({ size: id === 'large' ? snap.size : id });
    messages.update({ large: id === 'large' });
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby="messages-a11y-title"
      style={{ top: pos.top, right: pos.right }}
      className="fixed z-50 w-[320px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[24px] border border-[rgba(28,42,33,0.1)] bg-[#fffefc] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_4px_16px_rgba(28,42,33,0.06)]"
    >
      <div className="relative flex flex-col gap-[4px] overflow-hidden bg-[#ebf1ec] px-[20px] pt-[18px] pb-[14px]">
        <div className="flex items-center gap-[10px]">
          <h2
            id="messages-a11y-title"
            className="text-[23px] leading-[28px] font-semibold text-[#1c2a21] playful:font-heading"
          >
            Accessibility
          </h2>
          <span
            aria-hidden="true"
            className="rounded-full border border-[rgba(28,42,33,0.12)] bg-white px-[10px] py-[4px] text-[11.5px] max-lg:text-[12px] leading-[14px] font-bold text-[#1c2a21] playful:rotate-5 playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]"
          >
            your way
          </span>
        </div>
        <p className="text-[12.5px] leading-[15px] text-[#595959]">
          Make chats easier to read, hear and send.
        </p>
        <A11yPanelSparkleIcon className="absolute top-[14px] left-[274px] hidden size-[16px] playful:block" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[-16px] left-[286px] hidden size-[44px] rounded-full border-2 border-[#c1d4c4] playful:block"
        />
      </div>

      <div className="px-[16px] pt-[14px] pb-[6px]">
        <div
          role="tablist"
          aria-label="Where these apply"
          className="flex rounded-full border border-[#e1eae2] bg-[#f8f8f4] p-[3px]"
        >
          {[
            ['everywhere', 'Everywhere'],
            ['messages', 'In Messages'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={scope === id}
              aria-disabled={id === 'everywhere' ? true : undefined}
              onClick={() => {
                if (id === 'everywhere') {
                  log('Everywhere tab: content not drawn in Figma');
                  return;
                }
                log('scope', id);
                setScope(id);
              }}
              className={classNames(
                'flex min-h-[30px] flex-1 cursor-pointer items-center justify-center gap-[6px] rounded-full px-[14px] py-[7px] text-[13px] leading-[16px] font-semibold',
                scope === id
                  ? 'bg-[#1c2a21] text-white playful:shadow-[1.5px_1.5px_0_#1c2a21]'
                  : 'text-[#595959]'
              )}
            >
              {label}
              {id === 'messages' && scope === id ? <MessageIcon className="size-[15px]" /> : null}
            </button>
          ))}
        </div>
      </div>

      {scope === 'messages' ? (
        <>
          <Row
            icon={<VolumeIcon className="size-[16px]" />}
            title="Read messages aloud"
            sub="Tap on any message to hear it"
          >
            <Toggle
              label="Read messages aloud"
              on={readOn}
              onChange={(v) => messages.update({ read: v })}
            />
          </Row>
          <Row
            icon={<TextSizeIcon className="size-[16px]" />}
            title="Chat text size"
            sub="Just the chat bubbles"
          >
            <span
              role="radiogroup"
              aria-label="Chat text size"
              className="flex items-center gap-[2px] rounded-full border border-[#e1eae2] bg-[#f8f8f4] p-[3px]"
            >
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={size === s.id}
                  aria-label={s.label}
                  onClick={() => pickSize(s.id)}
                  className={classNames(
                    'min-h-[24px] min-w-[24px] cursor-pointer rounded-full px-[9px] py-[4px] leading-[normal] font-bold',
                    s.cls,
                    size === s.id
                      ? 'bg-[#1c2a21] text-white playful:shadow-[1.5px_1.5px_0_#387440]'
                      : 'text-[#595959]'
                  )}
                >
                  A
                </button>
              ))}
            </span>
          </Row>
          <Row
            icon={<SparkIcon className="size-[16px]" />}
            title="Explain it simply"
            sub="Buddy adds a plain-words version"
          >
            <Toggle
              label="Explain it simply"
              on={explainOn}
              onChange={(v) => messages.update({ explain: v })}
            />
          </Row>
          <Row
            icon={<CloudIcon className="size-[16px]" />}
            title="Calm chat"
            sub="Hides stickers, reactions & motion"
          >
            <Toggle
              label="Calm chat"
              on={messages.calm}
              onChange={(v) => messages.update({ calm: v })}
            />
          </Row>
          <Row
            icon={<EnterIcon className="size-[16px]" />}
            title="Enter adds a new line"
            sub="Send with ⌘ Enter instead"
          >
            <Toggle
              label="Enter adds a new line"
              on={snap.enterNewLine}
              onChange={(v) => setStore({ enterNewLine: v })}
            />
          </Row>
        </>
      ) : null}

      <div className="h-px w-full bg-[#e1eae2]" />
      <div className="px-[16px] pt-[10px] pb-[12px]">
        <p className="text-[11px] max-lg:text-[12px] leading-[13px] text-[#737373]">
          These only change Messages. Your other GTH settings stay the same.
        </p>
      </div>
    </div>
  );
};

export default MessagesA11yPanel;
