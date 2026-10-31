import { useEffect, useId, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import CareerBuddyAvatar from '../../shared/CareerBuddyAvatar.jsx';
import {
  BuddyIconBook,
  BuddyIconBriefcase,
  BuddyIconCheck,
  BuddyIconChevronLeft,
  BuddyIconChevronRight,
  BuddyIconClock,
  BuddyIconEdit,
  BuddyIconGlobe,
  BuddyIconLock,
  BuddyIconMic,
  BuddyIconSparkle,
  BuddyIconTrash,
  BuddyIconUser,
} from '../../shared/assets.jsx';
import { FOCUS_RING, HelpModal } from '../talentSettings/helpUi.jsx';
import { getVoiceById } from './careerBuddyVoices.js';

const log = debug('CareerBuddyChatParts');

const HEADING = 'font-sans font-semibold playful:font-heading';
const CARD_SHADOW_F = 'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_8px_24px_rgba(28,42,33,0.08)]';
const CARD_SHADOW_P =
  'playful:shadow-[3px_3px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

/* ---- New chat start screen + "saved to History" toast (Figma NC-01 9086:75962 / 9086:81371) ---- */

const SUGGESTIONS = [
  {
    id: 'interview',
    icon: <BuddyIconBriefcase className="size-[20px]" />,
    title: 'Prepare for an interview',
    text: 'Practise the questions Hubtel asks most',
  },
  {
    id: 'opportunities',
    icon: <BuddyIconSparkle className="size-[20px]" />,
    title: 'Find opportunities that fit me',
    text: 'Based on your skills and interests',
  },
  {
    id: 'cv',
    icon: <BuddyIconEdit className="size-[20px]" />,
    title: 'Improve my CV',
    text: 'Get line-by-line feedback',
  },
  {
    id: 'learn',
    icon: <BuddyIconBook className="size-[20px]" />,
    title: 'Plan what to learn next',
    text: 'A 4-week plan for your goal',
  },
];

/*
 * NewChatStart — a fresh chat's empty state: avatar, "FRESH START" sticker (Playful), greeting, four starter cards.
 * Focused and Playful word the greeting differently (Figma), so both lines are kept. Props: name, onPick(prompt).
 */
export const NewChatStart = ({ name, onPick }) => {
  const who = name || 'there';
  return (
    <div className="mx-auto my-auto flex w-full max-w-[760px] flex-col items-center gap-[16px] py-[12px]">
      <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full playful:border-[1.5px] playful:border-solid playful:border-[#1c2a21] playful:shadow-[3px_3px_0_rgba(28,42,33,0.45)]">
        <CareerBuddyAvatar size={72} />
      </span>
      <span className="hidden whitespace-nowrap rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[10px] py-[4px] font-sans text-[11px] font-bold uppercase leading-[18px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block">
        Fresh start
      </span>
      <h2
        className={classNames(
          HEADING,
          'm-0 text-balance text-center text-[clamp(24px,1.74vw,30px)] leading-[1.2] text-[#1c2a21]'
        )}
      >
        <span className="playful:hidden">Hi {who}, what would you like to work on?</span>
        <span className="hidden playful:inline">Hi {who}, what shall we work on today?</span>
      </h2>
      <p className="m-0 text-center font-sans text-[15px] leading-[18px] text-[#595959] max-lg:text-[14px] max-lg:leading-[20px]">
        Ask anything about your career. Your last chat is saved in History.
      </p>
      <div className="mt-[2px] grid w-full grid-cols-2 gap-[12px] max-md:grid-cols-1">
        {SUGGESTIONS.map(({ id, icon, title, text }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              log('branch', { startWith: id });
              onPick?.(title);
            }}
            className={classNames(
              'flex min-w-0 cursor-pointer items-center gap-[12px] rounded-[16px] border border-solid border-[#e7e7e7] bg-white p-[16px] text-left hover:bg-[#f8f8f4] playful:rounded-[20px] playful:border-[1.5px] playful:border-[#1c2a21]/55 playful:hover:bg-white playful:active:translate-x-[3px] playful:active:translate-y-[3px] playful:active:shadow-[0_0_0_rgba(0,0,0,0)] playful:transition-[box-shadow,transform]',
              CARD_SHADOW_F,
              CARD_SHADOW_P,
              FOCUS_RING
            )}
          >
            <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] p-[8px] text-[#387440]">
              {icon}
            </span>
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                {title}
              </span>
              <span className="font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[14px] max-lg:leading-[18px]">
                {text}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* "Your last chat was saved to History · View" — dark pill under the toolbar, centred on the chat pane. */
export const SavedToast = ({ onView, onDismiss }) => {
  useEffect(() => {
    const t = setTimeout(() => onDismiss?.(), 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div
      role="status"
      className="pointer-events-auto absolute left-1/2 top-[72px] z-10 flex -translate-x-1/2 items-center gap-[10px] whitespace-nowrap rounded-full bg-[#1c2a21] py-[10px] pl-[12px] pr-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
    >
      <BuddyIconCheck className="size-[16px] text-white" />
      <span className="font-sans text-[14px] font-medium leading-[17px] text-white">
        Your last chat was saved to History
      </span>
      <button
        type="button"
        onClick={onView}
        className={classNames(
          'cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#ffd86b]',
          FOCUS_RING
        )}
      >
        View
      </button>
    </div>
  );
};

/* ---- Buddy settings (Figma CS-01 9093:80066 / 9093:81889, CS-02 language, CS-03 clear-all confirm) ---- */

const LANGUAGES = [
  { id: 'English (Ghana)', soon: false },
  { id: 'Twi', soon: true },
  { id: 'Ga', soon: true },
  { id: 'Ewe', soon: true },
  { id: 'Fante', soon: true },
  { id: 'Hausa', soon: true },
];

const SectionLabel = ({ children }) => (
  <p className="m-0 px-[10px] pb-[4px] pt-[10px] font-sans text-[12px] font-semibold leading-[14px] text-[#737373]">
    {children}
  </p>
);
const Divider = () => (
  <span className="block h-px w-full shrink-0 bg-[#e7e7e7]" aria-hidden="true" />
);

const IconTile = ({ children }) => (
  <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] p-[7px] text-[#387440]">
    {children}
  </span>
);

const Toggle = ({ on, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={() => onChange(!on)}
    className={classNames(
      'flex h-[24px] w-[42px] shrink-0 cursor-pointer items-center rounded-full border-0 p-[3px] playful:border playful:border-solid playful:border-[#1c2a21] playful:p-[2px]',
      on ? 'justify-end bg-[#387440]' : 'justify-start bg-[#d9dcd6]',
      FOCUS_RING
    )}
  >
    <span className="block size-[18px] rounded-full bg-white playful:border playful:border-solid playful:border-[#1c2a21]" />
  </button>
);

const Row = ({ icon, title, text, right, onClick, as = 'button' }) => {
  const body = (
    <>
      {icon}
      <span className="flex min-w-0 flex-1 flex-col gap-[1px] text-left">
        <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
          {title}
        </span>
        <span className="font-sans text-[12px] leading-[14px] text-[#737373] max-lg:text-[12px]">
          {text}
        </span>
      </span>
      {right}
    </>
  );
  const cls = 'flex w-full items-center gap-[12px] rounded-[12px] p-[10px]';
  return as === 'button' ? (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        cls,
        'cursor-pointer border-0 bg-transparent hover:bg-[#f8f8f4]',
        FOCUS_RING
      )}
    >
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
};

const LengthSegment = ({ value, onChange }) => (
  <div className="flex flex-col gap-[6px] px-[8px] pb-[8px] pt-[2px]">
    <div
      role="radiogroup"
      aria-label="Answer length"
      className="flex gap-[3px] rounded-[12px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] p-[3px] playful:border-[#1c2a21]/35 playful:px-[3px] playful:py-[4px]"
    >
      {[
        ['short', 'Short'],
        ['balanced', 'Balanced'],
        ['detailed', 'Detailed'],
      ].map(([id, label]) => {
        const on = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(id)}
            className={classNames(
              'flex h-[32px] flex-1 cursor-pointer items-center justify-center rounded-[9px] border-0 px-[8px] font-sans text-[13px] leading-[16px]',
              on
                ? 'bg-white font-semibold text-[#387440] shadow-[0_1px_2px_rgba(28,42,33,0.04)] playful:bg-[#387440] playful:text-white playful:shadow-[2px_2px_0_#1c2a21]'
                : 'bg-transparent font-medium text-[#595959]',
              FOCUS_RING
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
    {value === 'balanced' ? (
      <p className="m-0 px-[2px] font-sans text-[12px] leading-[14px] text-[#737373]">
        Balanced: a short answer first, then the steps.
      </p>
    ) : null}
  </div>
);

/* 2026-10-31: which AI model Buddy answers with (sent to the agent as X-Buddy-Model). */
const MODELS = [
  ['claude', 'Claude'],
  ['gpt-oss', 'GPT-OSS 120B'],
];

const ModelSegment = ({ value, onChange }) => (
  <div className="flex flex-col gap-[6px] px-[8px] pb-[8px] pt-[2px]">
    <div
      role="radiogroup"
      aria-label="AI model"
      className="flex gap-[3px] rounded-[12px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] p-[3px] playful:border-[#1c2a21]/35 playful:px-[3px] playful:py-[4px]"
    >
      {MODELS.map(([id, label]) => {
        const on = (value || 'claude') === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(id)}
            className={classNames(
              'flex h-[32px] flex-1 cursor-pointer items-center justify-center rounded-[9px] border-0 px-[8px] font-sans text-[13px] leading-[16px]',
              on
                ? 'bg-white font-semibold text-[#387440] shadow-[0_1px_2px_rgba(28,42,33,0.04)] playful:bg-[#387440] playful:text-white playful:shadow-[2px_2px_0_#1c2a21]'
                : 'bg-transparent font-medium text-[#595959]',
              FOCUS_RING
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
    <p className="m-0 px-[2px] font-sans text-[12px] leading-[14px] text-[#737373]">
      {(value || 'claude') === 'claude'
        ? 'If Claude is unavailable, Buddy switches to GPT-OSS 120B for you.'
        : 'Open-source model. If it is unavailable, Buddy switches to Claude for you.'}
    </p>
  </div>
);

const LanguageView = ({ value, onBack, onPick }) => (
  <>
    <div className="flex items-center gap-[10px] pb-[8px] pl-[8px] pr-[8px]">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to Buddy settings"
        className={classNames(
          'flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#f8f8f4] p-[6px] text-[#1c2a21]',
          FOCUS_RING
        )}
      >
        <BuddyIconChevronLeft className="size-[20px]" />
      </button>
      <div className="flex min-w-0 flex-col gap-[2px]">
        <h3
          className={classNames(
            HEADING,
            'm-0 text-[18px] leading-[21px] text-[#1c2a21] playful:text-[20px] playful:leading-[24px]'
          )}
        >
          Chat language
        </h3>
        <p className="m-0 font-sans text-[12px] leading-[14px] text-[#737373]">
          Buddy replies in the language you pick
        </p>
      </div>
    </div>
    <div
      className="flex flex-col gap-[8px] px-[6px] pb-[6px] pt-[2px]"
      role="radiogroup"
      aria-label="Chat language"
    >
      {LANGUAGES.map((l) => {
        const on = value === l.id;
        return (
          <button
            key={l.id}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={l.soon}
            onClick={() => onPick(l.id)}
            className={classNames(
              'flex w-full items-center gap-[10px] rounded-[10px] border-0 px-[10px] py-[9px] text-left font-sans text-[14px] leading-[17px]',
              on
                ? 'cursor-pointer bg-[#ebf1ec] font-semibold text-[#1c2a21]'
                : 'bg-transparent font-medium text-[#595959]',
              l.soon ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-[#f8f8f4]',
              FOCUS_RING
            )}
          >
            <span className="min-w-0 flex-1">{l.id}</span>
            {on ? <BuddyIconCheck className="size-[16px] text-[#387440]" /> : null}
            {l.soon ? (
              <span className="rounded-full bg-[#faf4e8] px-[8px] py-[2px] font-sans text-[11px] font-semibold leading-[13px] text-[#785910]">
                Coming soon
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
    <p className="m-0 px-[10px] py-[6px] font-sans text-[12px] leading-[17.4px] text-[#737373]">
      Twi, Ga, Ewe, Fante and Hausa are being tested with native speakers. We’ll let you know when
      they’re ready.
    </p>
  </>
);

/*
 * BuddySettingsPopover — opens under the toolbar's settings button (top-right of the chat pane) on a light scrim.
 * Props: open, onClose, settings, onChange(patch), voiceId, onOpenVoice(), onClearAll(), chatCount, onPrivacy().
 */
export const BuddySettingsPopover = ({
  open,
  onClose,
  settings,
  onChange,
  voiceId,
  onOpenVoice,
  onClearAll,
  chatCount = 0,
  onPrivacy,
  initial = null,
}) => {
  const [view, setView] = useState(initial?.settingsView ?? 'main'); // main | language
  const [confirmClear, setConfirmClear] = useState(Boolean(initial?.settingsClear));
  const uid = useId();
  const voice = getVoiceById(voiceId);
  useEffect(() => {
    if (!open) setView('main');
  }, [open]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && !confirmClear) {
        if (view === 'language') setView('main');
        else onClose?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, view, confirmClear, onClose]);
  log('render', { open, view });
  if (!open) return null;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 z-20 bg-[#1c2a21]/[0.06] playful:bg-[#1c2a21]/[0.12]"
      />
      <div
        role="dialog"
        aria-label="Buddy settings"
        className={classNames(
          'absolute right-[19px] top-[66px] z-30 flex max-h-[calc(100%-78px)] w-[380px] max-w-[calc(100%-24px)] flex-col gap-[8px] overflow-y-auto overscroll-contain no-scrollbar rounded-[20px] border border-solid border-[#e7e7e7] bg-white px-[12px] pb-[12px] pt-[16px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_12px_32px_rgba(28,42,33,0.10)] playful:border-[1.5px] playful:border-[#1c2a21]/55 playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] max-lg:right-3',
          view === 'language' && 'gap-[4px]'
        )}
      >
        {view === 'language' ? (
          <LanguageView
            value={settings.language}
            onBack={() => setView('main')}
            onPick={(language) => {
              onChange({ language });
              setView('main');
            }}
          />
        ) : (
          <>
            <div className="flex items-center gap-[10px] pb-[8px] pl-[8px] pr-[8px]">
              <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <h3
                  className={classNames(
                    HEADING,
                    'm-0 text-[18px] leading-[21px] text-[#1c2a21] playful:text-[20px] playful:leading-[24px]'
                  )}
                >
                  Buddy settings
                </h3>
                <p className="m-0 font-sans text-[12px] leading-[14px] text-[#737373]">
                  Applies to all your chats
                </p>
              </div>
              <span className="hidden whitespace-nowrap rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[9px] py-[3px] font-sans text-[10px] font-bold uppercase leading-[12px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block">
                Make it yours
              </span>
            </div>

            <SectionLabel>Voice</SectionLabel>
            <Row
              onClick={onOpenVoice}
              icon={
                <span className="flex size-[34px] shrink-0 items-center justify-center overflow-hidden rounded-full">
                  <CareerBuddyAvatar size={34} />
                </span>
              }
              title="Buddy’s voice"
              text={`${voice.name} · ${voice.tagline}`}
              right={<BuddyIconChevronRight className="size-[16px] shrink-0 text-[#737373]" />}
            />
            <Row
              as="div"
              icon={
                <IconTile>
                  <BuddyIconMic className="size-[18px]" />
                </IconTile>
              }
              title="Read answers aloud"
              text="Buddy speaks each answer as it appears"
              right={
                <Toggle
                  on={settings.readAloud}
                  onChange={(readAloud) => onChange({ readAloud })}
                  label="Read answers aloud"
                />
              }
            />
            {/* Live captions (Figma 9151:1236): words of the call on screen; on by default, kept in careerBuddy.settings.liveCaptions. */}
            <Row
              as="div"
              icon={
                <span className="flex h-[27px] w-[30px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] p-[7px] font-sans text-[11px] font-bold leading-[13px] text-[#387440] max-lg:text-[12px]">
                  CC
                </span>
              }
              title="Live captions"
              text="Show words as you and Buddy speak"
              right={
                <Toggle
                  on={settings.liveCaptions !== false}
                  onChange={(liveCaptions) => onChange({ liveCaptions })}
                  label="Live captions"
                />
              }
            />
            <Divider />
            <SectionLabel>Language</SectionLabel>
            <Row
              onClick={() => setView('language')}
              icon={
                <IconTile>
                  <BuddyIconGlobe className="size-[18px]" />
                </IconTile>
              }
              title="Chat language"
              text={settings.language}
              right={<BuddyIconChevronRight className="size-[16px] shrink-0 text-[#737373]" />}
            />
            <Divider />
            <SectionLabel>Answer length</SectionLabel>
            <LengthSegment
              value={settings.answerLength}
              onChange={(answerLength) => onChange({ answerLength })}
            />
            <Divider />
            <SectionLabel>AI model</SectionLabel>
            <ModelSegment value={settings.model} onChange={(model) => onChange({ model })} />
            <Divider />
            <SectionLabel>What Buddy can use</SectionLabel>
            <Row
              as="div"
              icon={
                <IconTile>
                  <BuddyIconUser className="size-[18px]" />
                </IconTile>
              }
              title="My profile and results"
              text="CV, skills, personality and assessment scores"
              right={
                <Toggle
                  on={settings.useProfile}
                  onChange={(useProfile) => onChange({ useProfile })}
                  label="My profile and results"
                />
              }
            />
            <Row
              as="div"
              icon={
                <IconTile>
                  <BuddyIconClock className="size-[18px]" />
                </IconTile>
              }
              title="Remember past chats"
              text="So you don’t have to repeat yourself"
              right={
                <Toggle
                  on={settings.rememberChats}
                  onChange={(rememberChats) => onChange({ rememberChats })}
                  label="Remember past chats"
                />
              }
            />
            <Divider />
            <div className="flex items-center justify-between gap-[10px] px-[10px] pb-[4px] pt-[10px]">
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className={classNames(
                  'flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#c0392b]',
                  FOCUS_RING
                )}
              >
                <BuddyIconTrash className="size-[16px]" />
                Clear all chats
              </button>
              <button
                type="button"
                onClick={onPrivacy}
                className={classNames(
                  'flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440]',
                  FOCUS_RING
                )}
              >
                <BuddyIconLock className="size-[14px]" />
                Privacy &amp; data
              </button>
            </div>
          </>
        )}
      </div>

      {confirmClear ? (
        <HelpModal
          onClose={() => setConfirmClear(false)}
          labelledBy={`${uid}-t`}
          describedBy={`${uid}-d`}
          scrim="rgba(0,0,0,0.35)"
          cardClassName="max-w-[460px] flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[clamp(20px,1.62vw,28px)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_12px_32px_rgba(28,42,33,0.10)] playful:border-[1.5px] playful:border-[#1c2a21]/55 playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]"
        >
          <span className="flex size-[46px] items-center justify-center rounded-[14px] bg-[#fdecea] text-[#c0392b]">
            <BuddyIconTrash className="size-[22px]" />
          </span>
          <h2
            id={`${uid}-t`}
            className={classNames(HEADING, 'm-0 text-[24px] leading-[1.2] text-[#1c2a21]')}
          >
            Clear all {chatCount} chats?
          </h2>
          <p id={`${uid}-d`} className="m-0 font-sans text-[15px] leading-[1.46] text-[#595959]">
            All your chats with Buddy will be deleted for good, including pinned ones. Your profile,
            CV and results stay as they are.
          </p>
          <div className="flex flex-wrap justify-end gap-[10px]">
            <Button
              type="button"
              variant="tertiary-subtle"
              size="lg"
              onClick={() => setConfirmClear(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="md"
              onClick={() => {
                setConfirmClear(false);
                onClearAll?.();
                onClose?.();
              }}
            >
              Clear all chats
            </Button>
          </div>
        </HelpModal>
      ) : null}
    </>
  );
};
