import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import {
  EVALUATE_SUB,
  EVALUATE_TITLE,
  EVAL_TYPES,
  EVAL_WARDS,
  RESUME,
} from './data/evaluateData.js';

const log = debug('EvaluateStart');

/*
 * EvaluateStart — PE-01 "Evaluate · Choose ward and type" (Figma 10034:147583) and PE-01b "Continue where you left off" (10042:3332, `resume`): title + #999 sub, the "Start" card (r24, p22, gap 14):
 * "Who are you evaluating?" with two ward cards (Abena · 16 selected: #ebf1ec / #387440 border; Elliot · 15), "What kind of evaluation?" with four type rows (General evaluation selected), "Start evaluation".
 * With `resume` a card sits above it: eyebrow "CONTINUE WHERE YOU LEFT OFF", Abena's avatar, "General evaluation · Abena", "6 of 20 answered · saved automatically 2 days ago", a 6px progress bar (30 %), Discard + Continue and the one-per-ward note.
 * Ward and type are selectable (radio groups, arrow keys). ⚠️ ASSUMPTION: "Start evaluation", "Continue" and "Discard" only log (the question screens and the discard confirm are the next sections of the canvas).
 */
const WardOption = ({ ward, selected, onSelect }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={classNames(
      'flex cursor-pointer items-center gap-[10px] rounded-[16px] border border-solid p-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      selected ? 'border-[#387440] bg-[#ebf1ec]' : 'border-[#e7e7e7] bg-white'
    )}
  >
    <img
      src={ward.photo}
      alt=""
      draggable="false"
      className="size-[36px] shrink-0 rounded-[999px] object-cover"
    />
    <span className="font-sans text-[15px] leading-[normal] font-semibold whitespace-nowrap text-[#1c2a21]">
      {ward.name} · {ward.age}
    </span>
  </button>
);

const TypeOption = ({ type, selected, onSelect }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={classNames(
      'flex w-full cursor-pointer items-center rounded-[16px] border border-solid p-[16px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      selected ? 'border-[#387440] bg-[#ebf1ec]' : 'border-[#e7e7e7] bg-white'
    )}
  >
    <span className="flex min-w-0 flex-1 flex-col gap-[2px] leading-[normal]">
      <span className="font-sans text-[15px] font-semibold text-[#1c2a21]">{type.title}</span>
      <span className="font-sans text-[13px] font-normal text-[#575755]">{type.body}</span>
    </span>
  </button>
);

const CARD = 'rounded-[24px] border border-solid border-[#e7e7e7] bg-white';
const H20 =
  'm-0 font-sans text-[20px] leading-[1.25] font-semibold tracking-[-0.1px] text-[#1c2a21]';

// Arrow keys move the selection inside a radio group (WAI-ARIA radio pattern).
const arrowSelect = (items, current, set) => (e) => {
  if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
  e.preventDefault();
  const i = items.findIndex((x) => x.id === current);
  const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
  const next = items[(i + step + items.length) % items.length];
  set(next.id);
  e.currentTarget.querySelectorAll('[role=radio]')[items.indexOf(next)]?.focus();
};

const EvaluateStart = ({ resume = false }) => {
  const navigate = useNavigate();
  const [ward, setWard] = useState('abena');
  const [type, setType] = useState('general');
  const pct = Math.round((RESUME.done / RESUME.total) * 100);

  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px]">
      <div className="flex flex-col gap-[3px]">
        <h1 className="m-0 font-sans text-[34px] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21] max-sm:text-[28px]">
          {EVALUATE_TITLE}
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999]">
          {EVALUATE_SUB}
        </p>
      </div>

      <div className="flex flex-col gap-[20px]">
        {resume ? (
          <section
            aria-label="Continue where you left off"
            className={`${CARD} flex flex-col gap-[14px] overflow-clip p-[24px] shadow-[0_5px_17px_rgba(28,42,33,0.03)]`}
          >
            <p className="m-0 font-sans text-[10px] leading-[normal] font-bold tracking-[0.8px] whitespace-nowrap text-[#387440] uppercase">
              {RESUME.eyebrow}
            </p>
            <div className="flex min-h-[70px] items-center gap-[14px] max-md:flex-wrap">
              <img
                src={RESUME.ward}
                alt=""
                draggable="false"
                className="size-[48px] shrink-0 rounded-[24px] object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-[6px] max-md:basis-[calc(100%-62px)]">
                <p className="m-0 font-sans text-[17px] leading-[normal] font-semibold text-[#1c2a21]">
                  {RESUME.title}
                </p>
                <p className="m-0 font-sans text-[12.5px] leading-[normal] text-[#575755]">
                  {RESUME.progress}
                </p>
                <div
                  role="progressbar"
                  aria-label="Evaluation progress"
                  aria-valuemin={0}
                  aria-valuemax={RESUME.total}
                  aria-valuenow={RESUME.done}
                  className="h-[6px] w-full overflow-clip rounded-[3px] bg-[#ebf1ec]"
                >
                  <div
                    className="h-[6px] rounded-[3px] bg-[#387440]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <ParentButton
                variant="secondary"
                onClick={() => log('discard (confirm is the next section)')}
              >
                Discard
              </ParentButton>
              <ParentButton
                onClick={() => {
                  log('continue evaluation');
                  navigate('/parent/evaluate/questions');
                }}
              >
                Continue
              </ParentButton>
            </div>
            <p className="m-0 font-sans text-[12px] leading-[normal] text-[#575755]">
              {RESUME.note}
            </p>
          </section>
        ) : null}

        <section
          aria-label="Start an evaluation"
          className={`${CARD} flex flex-col gap-[14px] p-[22px] drop-shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]`}
        >
          <h2 id="eval-who" className={`${H20} whitespace-nowrap`}>
            Who are you evaluating?
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="eval-who"
            onKeyDown={arrowSelect(EVAL_WARDS, ward, setWard)}
            className="flex flex-wrap items-start gap-[12px]"
          >
            {EVAL_WARDS.map((w) => (
              <WardOption
                key={w.id}
                ward={w}
                selected={w.id === ward}
                onSelect={() => setWard(w.id)}
              />
            ))}
          </div>
          <h2 id="eval-kind" className={`${H20} whitespace-nowrap`}>
            What kind of evaluation?
          </h2>
          <div
            role="radiogroup"
            aria-labelledby="eval-kind"
            onKeyDown={arrowSelect(EVAL_TYPES, type, setType)}
            className="flex w-full flex-col gap-[10px]"
          >
            {EVAL_TYPES.map((t) => (
              <TypeOption
                key={t.id}
                type={t}
                selected={t.id === type}
                onSelect={() => setType(t.id)}
              />
            ))}
          </div>
          <div>
            <ParentButton
              onClick={() => {
                log('start evaluation', { ward, type });
                navigate(
                  `/parent/evaluate/questions?state=${type === 'academic' || ward === 'elliot' ? 'academic' : 'general'}`
                );
              }}
            >
              Start evaluation
            </ParentButton>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EvaluateStart;
