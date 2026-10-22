import { Fragment, useState } from 'react';
import Button from '../../../ui/Button.jsx';
import { ArrowRightIcon } from '../../../shared/assets.jsx';
import {
  CsArrowRightIcon,
  CsBoltIcon,
  CsCheckIcon,
  CsErrorIcon,
  CsEyeIcon,
  CsMessageIcon,
  CsTrophyIcon,
} from './ComingSoonIcons.jsx';
import {
  CS_AVATARS,
  CS_COPY,
  CS_ERROR_TEXT,
  CS_JOINED,
  CS_SAMPLE_LOCAL,
  CS_SAMPLE_NAME,
} from './ComingSoonData.js';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('ComingSoonCenter');

const CARD_SHADOW = 'shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]';

const PERK_ICONS = [
  <CsTrophyIcon key="t" />,
  <CsBoltIcon key="b" size={16} />,
  <CsEyeIcon key="e" size={16} />,
];

/* "Register › Get assessed › Get matched" pill (7797:17094): 14/600 white, last step gold, 14px arrows. */
const Steps = () => (
  <ol className="m-0 flex list-none items-center gap-2 rounded-full border border-white bg-white/10 px-[14px] py-2 font-sans text-[14px] font-semibold leading-[16.7px] text-white">
    {CS_COPY.steps.map((s, i) => (
      <Fragment key={s}>
        <li className={i === CS_COPY.steps.length - 1 ? 'text-[#ffd86b]' : undefined}>{s}</li>
        {i < CS_COPY.steps.length - 1 ? (
          <li aria-hidden="true" className="flex">
            <CsArrowRightIcon size={14} />
          </li>
        ) : null}
      </Fragment>
    ))}
  </ol>
);

/* "I’m a" role chips (7797:17102): selected = gold + ink border + check; others white 8% + white border. ⚠️ single-select is local state. */
const RoleChips = ({ role, onChange }) => (
  <div
    role="radiogroup"
    aria-label={CS_COPY.rolePrompt}
    className="flex flex-wrap items-center justify-center gap-2"
  >
    <span className="font-sans text-[14px] font-semibold leading-[16.7px] text-white">
      {CS_COPY.rolePrompt}
    </span>
    {CS_COPY.roles.map((r) => {
      const on = r === role;
      return (
        <button
          key={r}
          type="button"
          role="radio"
          aria-checked={on}
          onClick={() => onChange(r)}
          className={classNames(
            'inline-flex cursor-pointer items-center gap-[6px] rounded-full border-[1.5px] py-[9px] pl-[14px] pr-4 font-sans text-[14px] font-semibold leading-[16.7px]',
            on
              ? 'border-[#1c2a21] bg-[#ffd86b] text-[#1c2a21]'
              : 'border-white bg-white/[0.08] text-white'
          )}
        >
          {on ? <CsCheckIcon size={14} /> : null}
          {r}
        </button>
      );
    })}
  </div>
);

/* Email field (7797:17111, 620x70 r20, ink border + hard shadow, pad 8/8/8/22). Error state (CS-03): 2px #c0392b border + error line below. */
const EmailForm = ({ email, setEmail, isError, onSubmit }) => (
  <form
    onSubmit={onSubmit}
    noValidate
    className="flex w-full max-w-[620px] flex-col items-center gap-[22px] md:max-w-[754px] xl:max-w-[620px]"
  >
    <div
      className={classNames(
        'flex w-full items-center gap-[10px] rounded-[20px] bg-white py-2 pl-[22px] pr-2',
        CARD_SHADOW,
        isError ? 'border-2 border-[#c0392b]' : 'border-[1.4px] border-[#1c2a21]/[.32]'
      )}
    >
      <CsMessageIcon size={20} className="shrink-0 text-[#595959]" />
      <input
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={CS_COPY.emailPlaceholder}
        aria-label={CS_COPY.emailPlaceholder}
        aria-invalid={isError}
        className="w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[16px] leading-[19px] text-[#1c2a21] outline-none placeholder:text-[#595959]"
      />
      <Button type="submit" size="md" rightIcon={<ArrowRightIcon />} className="shrink-0">
        {CS_COPY.cta}
      </Button>
    </div>
    {isError ? (
      <p
        role="alert"
        className="m-0 flex items-center gap-[6px] font-sans text-[14px] font-semibold leading-[16.7px] text-[#ffd2cb]"
      >
        <CsErrorIcon size={16} className="shrink-0 text-[#ffb4a9]" />
        {CS_ERROR_TEXT}
      </p>
    ) : null}
  </form>
);

/* Success card (CS-02, 7797:18480): 640x337 r28 white; green check tile (56, 2px ink ring), title Bricolage 38/600, copy 16/24, share link row, share chips, "+50 SPOTS PER FRIEND" sticker. */
const JoinedCard = ({ name, local }) => (
  <div
    className={classNames(
      'relative flex w-full max-w-[640px] flex-col items-center gap-3 rounded-[28px] border-[1.4px] border-[#1c2a21]/[.32] bg-white px-5 py-6 text-center md:px-7',
      CARD_SHADOW
    )}
  >
    <span className="flex size-14 items-center justify-center rounded-full border-2 border-[#1c2a21] bg-[#387440] text-white">
      <CsCheckIcon size={26} />
    </span>
    <h2 className="m-0 font-heading text-[clamp(28px,calc(20px+1vw),38px)] font-semibold leading-[1.2] text-[#111]">
      {`You’re on the list, ${name}.`}
    </h2>
    <p className="m-0 max-w-[560px] font-sans text-[16px] leading-[24px] text-[#595959]">
      {`We’ll email ${local}@… the day GTH opens. You’re number 1,243. Share your link to move up.`}
    </p>
    <div className="flex w-full max-w-[560px] items-center justify-between gap-[10px] rounded-[16px] bg-[#f1ede2] py-[10px] pl-4 pr-[10px]">
      <span className="min-w-0 truncate text-[15px] leading-[19.8px] text-[#1c2a21] [font-family:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace]">
        {CS_JOINED.shareLink}
      </span>
      <Button
        size="sm"
        className="shrink-0"
        onClick={() => log('copy link clicked (inert: no behaviour drawn)')}
      >
        {CS_JOINED.copy}
      </Button>
    </div>
    <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0">
      {CS_JOINED.share.map((s) => (
        <li key={s}>
          <button
            type="button"
            onClick={() => log('share chip clicked (inert: no behaviour drawn)', { s })}
            className="cursor-pointer rounded-full border border-[#e7e7e7] bg-white px-[10px] py-1 font-sans text-[13px] font-semibold leading-[15.5px] text-[#1c2a21]"
          >
            {s}
          </button>
        </li>
      ))}
    </ul>
    <span className="absolute -top-6 right-5 -rotate-[5deg] whitespace-nowrap rounded-[8px] border-[1.2px] border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[14.3px] tracking-[0.4px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21]">
      {CS_JOINED.sticker}
    </span>
  </div>
);

/* Trust row (7797:17116): 4 overlapping 30px avatars (-10 gap, 2px #1e4a27 ring) + 14/500 copy. Default state only. */
const Trust = () => (
  <div className="flex flex-wrap items-center justify-center gap-3">
    <span className="flex">
      {CS_AVATARS.map((a, i) => (
        <img
          key={a}
          src={a}
          alt=""
          className={classNames(
            'size-[30px] rounded-full border-2 border-[#1e4a27] object-cover',
            i > 0 && '-ml-[10px]'
          )}
        />
      ))}
    </span>
    <span className="font-sans text-[14px] font-medium leading-[16.7px] text-white">
      {CS_COPY.trust}
    </span>
  </div>
);

/* Early-bird perks (7797:17123): gold 14/700 label + three white-10% pills (14/600, icon 16). */
const Perks = () => (
  <div className="flex flex-wrap items-center justify-center gap-[10px]">
    <span className="font-sans text-[14px] font-bold leading-[16.7px] text-[#ffd86b]">
      {CS_COPY.perksLabel}
    </span>
    {CS_COPY.perks.map((p, i) => (
      <span
        key={p}
        className="inline-flex items-center gap-2 rounded-full border border-white bg-white/10 py-2 pl-[10px] pr-[14px] font-sans text-[14px] font-semibold leading-[16.7px] text-white"
      >
        {PERK_ICONS[i]}
        {p}
      </span>
    ))}
  </div>
);

/*
 * ComingSoonCenter — the centred stack (Figma "Center" 7797:17093, gap 22): steps · heading (Bricolage 84/600, tracking -0.02em; tablet 53, mobile 36) ·
 * sub (19/29, max 720) · role chips · email field | success card · trust (default only) · perks.
 * state: 'default' (CS-01) | 'joined' (CS-02) | 'error' (CS-03).
 */
const ComingSoonCenter = ({ state, email, setEmail, joinedEmail, onSubmit }) => {
  const [role, setRole] = useState(CS_COPY.roles[0]);
  const local = joinedEmail ? joinedEmail.split('@')[0] : CS_SAMPLE_LOCAL;
  const lead = (local.match(/[A-Za-z]+/) ?? [''])[0];
  const name = lead ? lead.charAt(0).toUpperCase() + lead.slice(1).toLowerCase() : CS_SAMPLE_NAME;
  log('render', { state, role });
  return (
    <div className="flex w-full flex-col items-center gap-[22px] text-center md:gap-6 xl:gap-[22px]">
      <Steps />
      <h1 className="m-0 max-w-[951px] whitespace-pre-line font-heading text-[clamp(36px,calc(18px+4.2vw),84px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
        {CS_COPY.heading}
      </h1>
      <p className="m-0 max-w-[720px] font-sans text-[17px] leading-[29px] text-white md:text-[19px]">
        {CS_COPY.sub}
      </p>
      <RoleChips
        role={role}
        onChange={(r) => {
          log('role selected', { r });
          setRole(r);
        }}
      />
      {state === 'joined' ? (
        <JoinedCard name={name} local={local} />
      ) : (
        <EmailForm
          email={email}
          setEmail={setEmail}
          isError={state === 'error'}
          onSubmit={onSubmit}
        />
      )}
      {state === 'default' ? <Trust /> : null}
      <Perks />
    </div>
  );
};

export default ComingSoonCenter;
