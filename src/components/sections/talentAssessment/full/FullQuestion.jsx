import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { OptionList } from '../../talentSkillsLab/LabQuestionParts.jsx';

const log = debug('FullQuestion');

/*
 * FullQuestion — the challenge column of the full assessment (Figma MA-05 Playful 7968:326770 / Focused 8110:32330):
 * eyebrow "QUESTION 12 · TYPES AND GENERICS" (11/13 bold, 1.2 tracking, green) · title 34/41 (Bricolage in Playful, SF Pro
 * Rounded in Focused; the last word green) · prompt 15/18 grey · code block (#224626, r16, p20/24, lines white, a lone `}`
 * gold, line numbers #716e65) · four answer cards (A-D, JetBrains Mono 16).
 *
 * Props: question { n, topic, title:[[text, accent?]], prompt, code[], options[] }, eyebrow (already formatted),
 * selected (index|null), removed (option index hidden by the hint, or undefined), locked (results are showing: nothing
 * is selected and nothing can be picked), onSelect(i).
 */
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const CodeBlock = ({ lines }) => (
  <div
    role="group"
    aria-label="Code"
    className="flex flex-col gap-[16px] overflow-x-auto rounded-[16px] bg-[#224626] px-[clamp(16px,1.4vw,24px)] py-[20px]"
  >
    {lines.map((line, i) => (
      <div
        key={i}
        className="flex items-baseline gap-[16px] text-[16px] leading-[21px] max-lg:text-[14px]"
        style={{ fontFamily: MONO }}
      >
        <span
          aria-hidden="true"
          className="w-[9px] shrink-0 text-[15px] leading-[20px] text-[#716e65] max-lg:text-[14px]"
        >
          {i + 1}
        </span>
        <code
          className={classNames('whitespace-pre', line === '}' ? 'text-[#ffd86b]' : 'text-white')}
        >
          {line}
        </code>
      </div>
    ))}
  </div>
);

const FullQuestion = ({ question, eyebrow, selected, removed, locked = false, onSelect }) => {
  log('render', { n: question.n, selected, removed });
  const states = question.options.map((_, i) => ({
    tone: i === removed ? 'dim' : !locked && i === selected ? 'selected' : 'idle',
    chip: null,
  }));
  return (
    <>
      <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#387440] uppercase max-lg:text-[12px]">
        {eyebrow}
      </p>
      <h2 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading">
        {question.title.map(([text, accent], i) => (
          <span key={i} className={accent ? 'text-[#387440]' : undefined}>
            {text}
          </span>
        ))}
      </h2>
      <p className="m-0 font-sans text-[15px] leading-[18px] font-normal text-[#595959]">
        {question.prompt}
      </p>
      <CodeBlock lines={question.code} />
      <OptionList
        options={question.options}
        states={states}
        locked={locked}
        onSelect={(i) => {
          if (i !== removed) onSelect(i);
        }}
        label={`Answers to question ${question.n}`}
      />
    </>
  );
};

export default FullQuestion;
