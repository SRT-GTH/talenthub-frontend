import { useId, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  JobsBellGlyph,
  JobsClockGlyph,
  JobsGradGlyph,
  JobsMailGlyph,
  JobsPhoneGlyph,
  JobsPinGlyph,
  JobsSparkGlyph,
  JobsUserGlyph,
} from './JobsDialogIcons.jsx';
import { ActionButton, DialogActions, DialogFrame } from './JobsDialogParts.jsx';
import {
  FOCUS_RING,
  HEADING,
  INK_CHIP,
  fill,
  findJob,
  useAnchor,
  useMount,
} from './jobsDialogUtils.js';
import { JOB_DETAILS, JOB_DIALOGS } from './talentJobsData.js';

const log = debug('JobsPopovers');

const CHANNEL_ICONS = { bell: JobsBellGlyph, mail: JobsMailGlyph, phone: JobsPhoneGlyph };
const FACTOR_ICONS = {
  spark: JobsSparkGlyph,
  grad: JobsGradGlyph,
  pin: JobsPinGlyph,
  user: JobsUserGlyph,
};

/* "Match alerts · 75%+" toolbar button — the popover hangs 21px under it, right edges aligned (J-06: button
 * 1526,327 146x34 -> popover 1252,382 420 wide, right edge 1672). */
const measureAlerts = () => {
  const btn = Array.from(document.querySelectorAll('button')).find((b) =>
    b.textContent.trim().startsWith('Match alerts ·')
  );
  if (!btn) return null;
  const rect = btn.getBoundingClientRect();
  return { top: rect.bottom + 21, right: Math.max(12, window.innerWidth - rect.right) };
};

/* "How is this worked out?" pill in the detail's Match card: popover right edge sits 40px left of the pill
 * (J-15: pill 1316, popover 856..1276), top = 161 (frame y 213 − 52 toolbar). */
const measureHow = () => {
  const pill = Array.from(document.querySelectorAll('button')).find((b) =>
    b.textContent.includes('How is this worked out?')
  );
  const top = 161;
  if (!pill) return { top, right: Math.max(12, window.innerWidth / 2 - 412 + 8) };
  return { top, right: Math.max(12, window.innerWidth - (pill.getBoundingClientRect().left - 40)) };
};

const Toggle = ({ on, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={onChange}
    className={classNames(
      'flex h-[26px] w-[44px] shrink-0 items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] p-[2px] playful:border-[1.5px] playful:border-[#1c2a21]',
      on ? 'justify-end bg-[#387440]' : 'justify-start bg-[#e1eae2]',
      FOCUS_RING
    )}
  >
    <span className="size-[20px] rounded-full border-[1.2px] border-solid border-[#1c2a21] bg-white" />
  </button>
);

/*
 * AlertsPopover — J-06 "Match alerts settings" (Playful 7507:1160 / Focused 8110:412280). 420px card, r24,
 * p22, gap16, under the "Match alerts · 75%+" toolbar button. The slider is a real range input laid
 * invisibly over the Figma track so keyboard / screen readers get a native control.
 * Mock only: Save logs the preference and closes (`modal: null`).
 */
export const AlertsPopover = ({ jobs }) => {
  const copy = JOB_DIALOGS.alerts;
  const uid = useId();
  const [threshold, setThreshold] = useState(copy.threshold);
  const [channels, setChannels] = useState(() =>
    Object.fromEntries(copy.channels.map((c) => [c.id, c.on]))
  );
  const pos = useAnchor(measureAlerts);
  const close = () => jobs.update({ modal: null });
  useMount('AlertsPopover', { threshold });

  const pct = ((threshold - copy.min) / (copy.max - copy.min)) * 100;
  const count = copy.weekCounts[threshold] ?? 0;

  return (
    <DialogFrame
      kind="popover"
      onClose={close}
      labelId={`${uid}-title`}
      cardClassName="max-w-[420px] gap-[16px] rounded-[24px] p-[clamp(16px,1.3vw,22px)] lg:absolute lg:top-[var(--jd-top)] lg:right-[var(--jd-right)] lg:m-0 lg:w-[420px] lg:max-h-[calc(100dvh-var(--jd-top)-12px)] lg:overflow-y-auto"
      cardStyle={{ '--jd-top': `${pos?.top ?? 330}px`, '--jd-right': `${pos?.right ?? 56}px` }}
    >
      <div className="flex flex-col gap-[4px]">
        <div className="flex items-center gap-[10px] playful:items-stretch">
          <h2
            id={`${uid}-title`}
            className={classNames(
              HEADING,
              'm-0 text-[25px] font-semibold leading-[30px] text-[#1c2a21]'
            )}
          >
            {copy.title}
          </h2>
          <span
            className={classNames(
              'inline-flex items-center rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[11.5px] font-bold leading-[14px] text-[#1f4d26] max-lg:text-[12px]',
              'playful:-rotate-[4deg] playful:bg-white playful:text-[#1c2a21]',
              INK_CHIP
            )}
          >
            {copy.sticker}
          </span>
        </div>
        <p className="m-0 font-sans text-[13.5px] leading-[16px] text-[#595959]">{copy.sub}</p>
      </div>

      <div className="flex flex-col gap-[10px] rounded-[18px] bg-[#ebf1ec] px-[16px] pb-[14px] pt-[16px]">
        <div className="flex items-center justify-between gap-[8px]">
          <label
            htmlFor={`${uid}-range`}
            className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]"
          >
            {copy.pingLabel}
          </label>
          <span
            className={classNames(
              HEADING,
              'text-[27px] font-semibold leading-[32px] text-[#1c2a21]'
            )}
            aria-hidden="true"
          >
            {`${threshold}%+`}
          </span>
        </div>
        <div className="relative h-[24px]">
          <span className="absolute inset-x-0 top-[8px] h-[8px] rounded-full border border-solid border-[#c1d4c4] bg-white" />
          <span
            className="absolute left-0 top-[8px] h-[8px] rounded-full bg-[#387440]"
            style={{ width: `${pct}%` }}
          />
          <input
            id={`${uid}-range`}
            type="range"
            min={copy.min}
            max={copy.max}
            step={copy.step}
            value={threshold}
            onChange={(e) => {
              log('threshold', e.target.value);
              setThreshold(Number(e.target.value));
            }}
            aria-valuetext={`${threshold}% and above`}
            className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 size-[24px] -translate-x-1/2 rounded-full border-[1.5px] border-solid border-[#1c2a21] bg-[#ffd86b] playful:shadow-[1.5px_1.5px_0_#1c2a21] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-green"
            style={{ left: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between gap-[8px] font-sans text-[12px] font-medium leading-[14px] text-[#595959]">
          <span>{copy.minLabel}</span>
          <span>{copy.maxLabel}</span>
        </div>
        <p
          aria-live="polite"
          className="m-0 inline-flex w-fit max-w-full items-center gap-[6px] rounded-full bg-white px-[10px] py-[6px] font-sans text-[12.5px] font-semibold leading-[15px] text-[#2d5d33]"
        >
          <JobsSparkGlyph className="size-[13px] shrink-0 text-[#387440]" />
          {`At ${threshold}%+ you’d have got ${count} ${count === 1 ? 'alert' : 'alerts'} this week`}
        </p>
      </div>

      <div className="flex flex-col">
        <span className="font-sans text-[11.5px] font-bold leading-[14px] text-[#737373] max-lg:text-[12px]">
          {copy.channelsLabel}
        </span>
        {copy.channels.map((c) => {
          const Glyph = CHANNEL_ICONS[c.icon];
          return (
            <div key={c.id} className="flex items-center gap-[11px] py-[10px]">
              <Glyph className="size-[17px] shrink-0 text-[#2d5d33]" />
              <span className="min-w-0 flex-1 font-sans text-[14.5px] font-medium leading-[17px] text-[#1c2a21]">
                {c.label}
              </span>
              <Toggle
                on={channels[c.id]}
                label={c.label}
                onChange={() => {
                  log('channel', c.id, !channels[c.id]);
                  setChannels((prev) => ({ ...prev, [c.id]: !prev[c.id] }));
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-[8px] rounded-[14px] bg-[#f8f8f4] px-[12px] py-[10px]">
        <JobsClockGlyph className="size-[15px] shrink-0 text-[#595959]" />
        <p className="m-0 font-sans text-[12.5px] leading-[18px] text-[#595959]">{copy.cap}</p>
      </div>

      <DialogActions pad="playful:py-[7px]">
        <ActionButton onClick={close}>{copy.cancel}</ActionButton>
        <ActionButton
          variant="primary"
          onClick={() => {
            log('save alerts', { threshold, channels });
            close();
          }}
        >
          {copy.save}
        </ActionButton>
      </DialogActions>
    </DialogFrame>
  );
};

const Tag = ({ amber, children }) => (
  <span
    className={classNames(
      'inline-flex h-[18px] items-center rounded-full px-[9px] font-sans text-[11.5px] font-bold leading-[14px] max-lg:text-[12px]',
      'playful:h-[20px] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]',
      amber ? 'bg-[#faf4e8] text-[#967014]' : 'bg-[#ebf1ec] text-[#2d5d33]'
    )}
  >
    {children}
  </span>
);

/*
 * MatchPopover — J-15 "How your 82% works" (Playful 7511:1758 / Focused 8110:416458), popover on the job
 * detail pointing at the Match card. 420px card, r28, p22, gap14; the right-pointing caret is the Figma
 * 12x18 triangle at y120 (hidden when the popover becomes a centred sheet below lg).
 */
export const MatchPopover = ({ jobs }) => {
  const uid = useId();
  const job = findJob(jobs.job, 'data-analyst');
  const data =
    JOB_DETAILS[job.id]?.matchBreakdown ??
    JOB_DIALOGS.matchBreakdown[job.id] ??
    JOB_DIALOGS.matchBreakdown[Object.keys(JOB_DIALOGS.matchBreakdown)[0]];
  const pos = useAnchor(measureHow);
  const close = () => jobs.update({ modal: null });
  useMount('MatchPopover', { job: job.id });

  return (
    <DialogFrame
      kind="popover"
      onClose={close}
      labelId={`${uid}-title`}
      cardClassName="max-w-[420px] gap-[14px] rounded-[28px] p-[clamp(16px,1.3vw,22px)] lg:absolute lg:top-[var(--jd-top)] lg:right-[var(--jd-right)] lg:m-0 lg:w-[420px] lg:max-h-[calc(100dvh-var(--jd-top)-12px)] lg:overflow-y-auto"
      cardStyle={{ '--jd-top': `${pos?.top ?? 161}px`, '--jd-right': `${pos?.right ?? 452}px` }}
    >
      <span
        aria-hidden="true"
        className="absolute -right-[10px] top-[120px] h-[18px] w-[12px] bg-[#fffefc] max-lg:hidden [clip-path:polygon(0_0,100%_50%,0_100%)]"
      />
      <h2
        id={`${uid}-title`}
        className={classNames(
          HEADING,
          'm-0 text-[23px] font-semibold leading-[29px] text-[#1c2a21]'
        )}
      >
        {fill(JOB_DIALOGS.matchTitle, { match: job.match })}
      </h2>
      <p className="m-0 font-sans text-[13.5px] leading-[19px] text-[#595959]">
        {fill(data.intro, { company: data.company })}
      </p>
      {data.factors.map((f) => {
        const Glyph = FACTOR_ICONS[f.icon];
        const amber = f.tone === 'amber';
        return (
          <div
            key={f.id}
            className="flex flex-col gap-[6px] rounded-[16px] bg-[#f8f8f4] px-[14px] py-[12px]"
          >
            <div className="flex items-center gap-[8px]">
              <Glyph className="size-[16px] shrink-0 text-[#2d5d33]" />
              <span className="min-w-0 flex-1 font-sans text-[14.5px] font-semibold leading-[17px] text-[#1c2a21]">
                {f.label}
              </span>
              <Tag amber={amber}>{f.tag}</Tag>
            </div>
            <div
              role="meter"
              aria-label={f.label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={f.pct}
              aria-valuetext={f.note}
              className="h-[8px] overflow-hidden rounded-full bg-[#e1eae2]"
            >
              <span
                className={classNames(
                  'block h-full rounded-full',
                  amber ? 'bg-[#c8951a]' : 'bg-[#387440]'
                )}
                style={{ width: `${f.pct}%` }}
              />
            </div>
            <span className="font-sans text-[12.5px] leading-[15px] text-[#595959]">{f.note}</span>
          </div>
        );
      })}
      <div className="flex items-center gap-[8px] rounded-[14px] bg-[#ebf1ec] px-[12px] py-[10px]">
        <JobsClockGlyph className="size-[15px] shrink-0 text-[#2d5d33]" />
        <p className="m-0 font-sans text-[12.5px] font-medium leading-[15px] text-[#2d5d33]">
          {data.footnote}
        </p>
      </div>
    </DialogFrame>
  );
};
