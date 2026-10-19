import { useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import {
  SkillsLabArrowGlyph,
  SkillsLabBulbGlyph,
  SkillsLabCheckGlyph,
  SkillsLabEyeOffGlyph,
  SkillsLabPlayGlyph,
  SkillsLabPlusGlyph,
  SkillsLabSearchGlyph,
  SkillsLabShieldGlyph,
  SkillsLabStopwatchGlyph,
  SkillsLabTargetGlyph,
  SkillsLabUsersGlyph,
} from './SkillsLabDialogIcons.jsx';
import {
  ButtonRow,
  DialogHeader,
  DialogShell,
  PrimaryButton,
  SecondaryButton,
  SkillsLabToast,
} from './SkillsLabDialogParts.jsx';
import {
  SKILLS_LAB_ADD,
  SKILLS_LAB_HOW,
  SKILLS_LAB_SKILL_CATALOG,
  SKILLS_LAB_SUGGEST,
  SKILLS_LAB_WEEKLY,
} from './skillsLabData.js';
import { FOCUS_RING, fill, suggestionDraft, unitFor } from './skillsLabDialogUtils.js';

const log = debug('SkillsLabDialogs');

const STEP_ICONS = {
  play: SkillsLabPlayGlyph,
  target: SkillsLabTargetGlyph,
  eyeoff: SkillsLabEyeOffGlyph,
  search: SkillsLabSearchGlyph,
};

// Header tile colours. Playful = soft tile, Focused = solid green tile on the "how" dialog (the other tiles stay as drawn).
const TILE_SOFT = 'bg-[#ebf1ec]';
const TILE_HOW = 'bg-[#387440] playful:bg-[#ebf1ec]';
const TILE_GOLD = 'bg-[#ffd86b]';

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] py-[7.5px] font-sans text-[13px] font-semibold leading-[16px] text-[#595959]">
    {children}
  </span>
);

/* ---- SL-M1 · How verification works (Playful 7853:12314 / Focused 8110:489651) ---- */
const HowDialog = ({ onClose }) => {
  const titleId = useId();
  const copy = SKILLS_LAB_HOW;
  return (
    <DialogShell width={600} onClose={onClose} labelId={titleId}>
      <DialogHeader
        id={titleId}
        title={copy.title}
        tileClass={TILE_HOW}
        icon={<SkillsLabShieldGlyph className="size-[21px]" />}
        onClose={onClose}
      />
      {copy.steps.map((step) => {
        const Glyph = STEP_ICONS[step.icon];
        return (
          <div
            key={step.id}
            className="flex items-center gap-[14px] rounded-[16px] bg-[#f8f8f4] p-[14px]"
          >
            <span
              aria-hidden="true"
              className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]"
            >
              <Glyph className="size-[19px]" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span className="font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21]">
                {step.title}
              </span>
              <span className="font-sans text-[14px] leading-[20px] text-[#595959]">
                {step.body}
              </span>
            </span>
          </div>
        );
      })}
      <div className="flex items-center gap-[10px] rounded-[14px] bg-[#fbf4e0] p-[14px]">
        <SkillsLabUsersGlyph className="size-[18px] shrink-0 text-[#463409]" />
        <span className="min-w-0 flex-1 font-sans text-[13.5px] font-medium leading-[20px] text-[#463409]">
          {copy.who}
        </span>
      </div>
      <PrimaryButton onClick={onClose}>{copy.cta}</PrimaryButton>
    </DialogShell>
  );
};

/* ---- SL-M2 · Add a skill (Playful 7853:13081 / Focused 8110:490076) ---- */
const SkillRow = ({ skill, selected, onToggle }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={selected}
    onClick={onToggle}
    className={classNames(
      'flex w-full items-center gap-[12px] rounded-[12px] border-0 p-[12px] text-left max-sm:flex-wrap',
      selected ? 'bg-[#ebf1ec]' : 'bg-transparent',
      FOCUS_RING
    )}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'flex size-[22px] shrink-0 items-center justify-center rounded-[6px] border border-solid text-white playful:border-[1.5px]',
        selected
          ? 'border-[#387440] bg-[#387440]'
          : 'border-[rgba(28,42,33,0.1)] bg-white playful:border-[rgba(28,42,33,0.35)]'
      )}
    >
      {selected && <SkillsLabCheckGlyph className="size-[16px]" />}
    </span>
    <span className="min-w-0 flex-1 font-sans text-[15px] font-semibold leading-[18px] whitespace-nowrap text-[#1c2a21]">
      {skill.name}
    </span>
    {skill.lab ? (
      <span
        aria-label={SKILLS_LAB_ADD.chips.available}
        data-count={SKILLS_LAB_ADD.chips.available}
        className="shrink-0 rounded-full bg-[#387440] px-[8px] py-[3px] font-sans text-[11.5px] font-bold leading-[14px] text-[#1c2a21] after:content-[attr(data-count)] max-lg:text-[12px] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)] playful:bg-[#ebf1ec]"
      />
    ) : (
      <span
        aria-label={SKILLS_LAB_ADD.chips.soon}
        data-count={SKILLS_LAB_ADD.chips.soon}
        className="shrink-0 rounded-full bg-[#f8f8f4] px-[8px] py-[3px] font-sans text-[11.5px] font-semibold leading-[14px] text-[#595959] after:content-[attr(data-count)] max-lg:text-[12px] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]"
      />
    )}
  </button>
);

const AddDialog = ({ onClose }) => {
  const titleId = useId();
  const copy = SKILLS_LAB_ADD;
  const [query, setQuery] = useState(copy.initialQuery);
  const [selectedId, setSelectedId] = useState(copy.initialSelected);
  const [level, setLevel] = useState(copy.initialLevel);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? SKILLS_LAB_SKILL_CATALOG.filter((s) => s.name.toLowerCase().includes(q))
      : SKILLS_LAB_SKILL_CATALOG.slice(0, 3);
  }, [query]);
  const selected = SKILLS_LAB_SKILL_CATALOG.find((s) => s.id === selectedId);

  const submit = () => {
    log('add skill', { skill: selectedId, level });
    onClose();
  };

  return (
    <DialogShell width={560} onClose={onClose} labelId={titleId}>
      <DialogHeader
        id={titleId}
        title={copy.title}
        tileClass={TILE_SOFT}
        icon={<SkillsLabPlusGlyph className="size-[21px] text-[#387440]" />}
        onClose={onClose}
      />
      <p className="m-0 font-sans text-[15px] leading-[18px] text-[#595959]">{copy.intro}</p>
      <label className="flex items-center gap-[10px] rounded-[14px] border border-solid border-[#387440] bg-white px-[16px] py-[13px] playful:border-2">
        <SkillsLabSearchGlyph className="size-[20px] shrink-0 text-[#387440]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={copy.searchLabel}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[15px] font-medium leading-[18px] text-[#1c2a21] outline-none"
        />
      </label>
      <div role="group" aria-label={copy.title} className="flex flex-col gap-[4px]">
        {results.map((skill) => (
          <SkillRow
            key={skill.id}
            skill={skill}
            selected={skill.id === selectedId}
            onToggle={() => {
              log('toggle skill', skill.id);
              setSelectedId(skill.id === selectedId ? null : skill.id);
            }}
          />
        ))}
      </div>
      {selected && (
        <div className="flex flex-col gap-[8px]">
          <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
            {fill(copy.levelLabel, { skill: selected.name })}
          </span>
          <div
            role="radiogroup"
            aria-label={fill(copy.levelLabel, { skill: selected.name })}
            className="flex w-fit max-w-full flex-wrap gap-[4px] rounded-[12px] bg-[#f8f8f4] p-[4px]"
          >
            {copy.levels.map((item) => {
              const on = item.id === level;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    log('level', item.id);
                    setLevel(item.id);
                  }}
                  className={classNames(
                    'rounded-[10px] border border-solid px-[14px] py-[8px] font-sans text-[14px] font-semibold leading-[17px]',
                    on
                      ? 'border-[rgba(28,42,33,0.1)] bg-white text-[#387440] playful:border-[rgba(28,42,33,0.15)]'
                      : 'border-transparent bg-transparent text-[#1c2a21]',
                    FOCUS_RING
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <ButtonRow a={260} b={228}>
        <SecondaryButton onClick={onClose}>{copy.cancel}</SecondaryButton>
        <PrimaryButton onClick={submit} disabled={!selected}>
          {copy.submit}
        </PrimaryButton>
      </ButtonRow>
    </DialogShell>
  );
};

/* ---- SL-M3 · Suggest a lab (Playful 7853:13852 / Focused 8110:490506) ---- */
const Field = ({ label, value, onChange }) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-[8px]">
      <label
        htmlFor={id}
        className="font-sans text-[14px] font-medium leading-[21px] tracking-[0.2px] text-[#1c2a21]"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[10px] border border-solid border-[#cccccc] bg-white py-[12.5px] pl-[20px] pr-[16px] font-sans text-[14px] font-medium leading-[24px] tracking-[0.2px] text-[#1c2a21] shadow-[0_4px_16px_rgba(28,42,33,0.06),0_1px_2px_rgba(28,42,33,0.04)] outline-none focus:border-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      />
    </div>
  );
};

const SuggestDialog = ({ onClose, skills }) => {
  const titleId = useId();
  const copy = SKILLS_LAB_SUGGEST;
  const [topic, setTopic] = useState(copy.initialTopic);
  const [use, setUse] = useState(copy.initialUse);

  const send = () => {
    const clean = topic.trim() || copy.initialTopic;
    log('send suggestion', { topic: clean, use });
    suggestionDraft.topic = clean;
    skills.update({ modal: null, toast: 'suggestion' });
  };

  return (
    <DialogShell width={540} onClose={onClose} labelId={titleId}>
      <DialogHeader
        id={titleId}
        title={copy.title}
        tileClass={TILE_GOLD}
        icon={<SkillsLabBulbGlyph className="size-[21px]" />}
        onClose={onClose}
      />
      <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{copy.intro}</p>
      <Field label={copy.topicLabel} value={topic} onChange={setTopic} />
      <Field label={copy.useLabel} value={use} onChange={setUse} />
      <div className="flex flex-col gap-[8px]">
        <span className="font-sans text-[13px] font-semibold leading-[16px] text-[#595959]">
          {copy.popularLabel}
        </span>
        <div className="flex flex-wrap gap-[8px]">
          {copy.popular.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                log('popular topic', item.id);
                setTopic(item.topic);
              }}
              className={classNames(
                'inline-flex items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] py-[7.5px] font-sans text-[13px] font-semibold leading-[16px] text-[#595959]',
                FOCUS_RING
              )}
            >
              {item.topic} · {item.votes} votes
            </button>
          ))}
        </div>
      </div>
      <ButtonRow a={250} b={218}>
        <SecondaryButton onClick={onClose}>{copy.cancel}</SecondaryButton>
        <PrimaryButton onClick={send}>{copy.submit}</PrimaryButton>
      </ButtonRow>
    </DialogShell>
  );
};

/* ---- SL-M4 · Weekly challenge (Playful 7854:13342 / Focused 8110:490918) ---- */
const WeeklyDialog = ({ onClose }) => {
  const titleId = useId();
  const copy = SKILLS_LAB_WEEKLY;
  const { uiStyle } = useUiStyle();
  const navigate = useNavigate();
  const unit = unitFor(uiStyle);

  // ⚠️ ASSUMPTION: the Figma frame has no destination; the Excel speed run opens the Excel game.
  const start = () => {
    log('start weekly challenge', copy.id);
    onClose();
    navigate('/skills-lab/games/formula-rush');
  };

  return (
    <DialogShell width={560} onClose={onClose} labelId={titleId}>
      <DialogHeader
        id={titleId}
        title={copy.title}
        tileClass={TILE_GOLD}
        icon={<SkillsLabStopwatchGlyph className="size-[21px]" />}
        onClose={onClose}
      />
      <div className="flex flex-wrap gap-[8px]">
        {copy.chips.map((chip) => (
          <Pill key={chip}>{fill(chip, { unit })}</Pill>
        ))}
      </div>
      <p className="m-0 font-sans text-[15px] leading-[22px] text-[#1c2a21]">{copy.body}</p>
      <div className="flex flex-col gap-[6px] rounded-[16px] bg-[#f8f8f4] p-[16px]">
        <div className="flex items-center justify-between gap-[8px]">
          <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
            {copy.board.title}
          </span>
          <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
            {copy.board.playing}
          </span>
        </div>
        {copy.board.rows.map((row) => (
          <div
            key={row.name}
            className={classNames(
              'flex items-center gap-[12px] rounded-[10px] px-[10px] py-[8px]',
              row.you && 'bg-[#ffd86b]'
            )}
          >
            <span className="w-[24px] shrink-0 font-sans text-[14px] font-bold leading-[17px] text-[#1c2a21]">
              {row.rank}
            </span>
            <span
              className={classNames(
                'min-w-0 flex-1 font-sans text-[14px] leading-[17px] text-[#1c2a21]',
                row.you ? 'font-bold' : 'font-medium'
              )}
            >
              {row.name}
            </span>
            <span className="shrink-0 font-sans text-[13px] font-medium leading-[16px] text-[#1c2a21]">
              {row.score}
            </span>
          </div>
        ))}
      </div>
      <p className="m-0 font-sans text-[12.5px] leading-[18px] text-[#595959]">{copy.privacy}</p>
      <ButtonRow a={244} b={244}>
        <SecondaryButton onClick={onClose}>{copy.later}</SecondaryButton>
        <PrimaryButton
          size="lg"
          onClick={start}
          rightIcon={<SkillsLabArrowGlyph className="size-[20px]" />}
        >
          {copy.start}
        </PrimaryButton>
      </ButtonRow>
    </DialogShell>
  );
};

/*
 * SkillsLabDialogs — mounts the hub dialogs and toasts from the URL state.
 * Props: skills (useSkillsLabState()). Reads `skills.modal` (how | add | suggest | weekly) and `skills.toast`
 * (suggestion | hidden | reminder | pdf); closing goes through `skills.update({ modal: null })`.
 * `restart` / `leave` (SL-M5 / SL-M6) belong to the lab play screens: use RestartLabDialog / LeaveLabDialog from
 * SkillsLabLabDialogs.jsx there.
 */
const SkillsLabDialogs = ({ skills }) => {
  const close = () => {
    log('close modal', skills.modal);
    skills.update({ modal: null });
  };
  const dismissToast = () => skills.update({ toast: null });
  const Dialog = { how: HowDialog, add: AddDialog, suggest: SuggestDialog, weekly: WeeklyDialog }[
    skills.modal
  ];
  return (
    <>
      {Dialog && <Dialog key={skills.modal} onClose={close} skills={skills} />}
      {skills.toast && (
        <SkillsLabToast
          key={skills.toast}
          kind={skills.toast}
          topic={suggestionDraft.topic}
          onDismiss={dismissToast}
        />
      )}
    </>
  );
};

export default SkillsLabDialogs;
