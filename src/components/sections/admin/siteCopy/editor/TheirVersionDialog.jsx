import { classNames } from '../../../../../utils/classNames.js';
import AgencyDialog from '../../../agency/onboarding/AgencyDialog.jsx';
import EditorButton from './EditorButton.jsx';
import { EditorCloseIcon, EditorUsersIcon } from './EditorIcons.jsx';

/*
 * TheirVersionDialog — "Two versions of Home › Hero" (frame 7.8.2l): scrim #1c2a21 at 55 %, card 700 wide, r24, p28, gap 16, border #1c2a21 at 10 %;
 * header = a 44 px tile (#f9ebea, people icon #387440), the title 24/29 600 and a 30 px close; "Only the headline is different. Pick the one to keep;
 * the other is saved in history."; two columns side by side (Figma draws them collapsed on top of each other, 43 px wide): "Your version · Kofi"
 * on #f8f8f4 and "Ama’s version · 2 min ago" on #ebf1ec at 50 %, each listing Headline and Main button text; then "Keep mine" and "Use Ama’s version".
 * Props: title, you (first name), other ({ name, agoLabel }), rows ([{ label, mine, theirs }]), onKeepMine, onUseTheirs, onClose.
 */
const Column = ({ heading, tone, values }) => (
  <div
    className={classNames(
      'flex min-w-0 flex-col gap-[10px] rounded-[14px] p-[16px]',
      tone === 'mine' ? 'bg-[#f8f8f4]' : 'bg-[#ebf1ec]/50'
    )}
  >
    <p
      className={classNames(
        'm-0 font-sans text-[13px] leading-[16px] font-bold tracking-[0.26px]',
        tone === 'mine' ? 'text-[#575755]' : 'text-[#2a5730]'
      )}
    >
      {heading}
    </p>
    {values.map((v, i) => (
      <div key={v.label} className="flex min-w-0 flex-col gap-[4px]">
        <span className="font-sans text-[12.5px] leading-[15px] font-semibold text-[#575755] max-lg:text-[12px]">
          {v.label}
        </span>
        <span
          className={classNames(
            'font-sans leading-[24px] break-words text-[#1c2a21]',
            i === 0 ? 'text-[17px] font-semibold' : 'text-[15px] leading-[18px]'
          )}
        >
          {v.text}
        </span>
      </div>
    ))}
  </div>
);

const TheirVersionDialog = ({ title, you, other, rows, onKeepMine, onUseTheirs, onClose }) => {
  const first = other.name.split(' ')[0];
  return (
    <AgencyDialog
      label={title}
      onClose={onClose}
      scrimClassName="bg-[#1c2a21]/55"
      panelClassName="w-[min(700px,calc(100vw-24px))]"
    >
      <div className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(16px,2vw,28px)] shadow-[0_2px_8px_rgba(28,42,33,0.12)]">
        <div className="flex items-center gap-[12px]">
          <span className="grid size-[44px] shrink-0 place-items-center rounded-[13px] bg-[#f9ebea]">
            <EditorUsersIcon className="size-[21px] text-[#387440]" />
          </span>
          <h2 className="m-0 min-w-0 grow font-sans text-[clamp(18px,1.4vw,24px)] leading-[1.2] font-semibold tracking-[-0.24px] text-[#1c2a21]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-[30px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#f8f8f4] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <EditorCloseIcon className="size-[10px]" />
          </button>
        </div>
        <p className="m-0 font-sans text-[14px] leading-[20px] text-[#575755]">
          Only the headline is different. Pick the one to keep; the other is saved in history.
        </p>
        <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
          <Column
            heading={`Your version · ${you}`}
            tone="mine"
            values={rows.map((r) => ({ label: r.label, text: r.mine }))}
          />
          <Column
            heading={`${first}’s version · ${other.agoLabel}`}
            tone="theirs"
            values={rows.map((r) => ({ label: r.label, text: r.theirs }))}
          />
        </div>
        <div className="flex flex-col gap-[12px] sm:flex-row [&>*]:flex-1">
          <EditorButton className="min-h-[56px] px-[34px] py-[16px]" onClick={onKeepMine}>
            Keep mine
          </EditorButton>
          <EditorButton
            variant="primary"
            className="min-h-[56px] px-[34px] py-[16px]"
            onClick={onUseTheirs}
          >
            {`Use ${first}’s version`}
          </EditorButton>
        </div>
      </div>
    </AgencyDialog>
  );
};

export default TheirVersionDialog;
