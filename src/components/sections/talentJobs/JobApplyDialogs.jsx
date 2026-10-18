import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import NotifButton from '../notifications/NotifButton.jsx';
import { KofiAvatar } from './JobDetailParts.jsx';
import {
  JobDetailBuddySparkIcon,
  JobDetailChatIcon,
  JobDetailCheckLgIcon,
  JobDetailCheckSmIcon,
  JobDetailClockIcon,
  JobDetailCloseIcon,
  JobDetailDoodleSparkLg,
  JobDetailDoodleSparkMd,
  JobDetailDoodleSparkSm,
  JobDetailDoodleSquiggleLg,
  JobDetailDoodleSquiggleSm,
  JobDetailEyeOffIcon,
  JobDetailLockIcon,
  JobDetailSendIcon,
  JobDetailTickIcon,
  JobDetailUpIcon,
  JobDetailWifiOffIcon,
} from './JobDetailIcons.jsx';
import { FOCUS_RING, INK_CARD, PILL_OUTLINE, fill } from './jobDetailStyles.js';
import { APPLY_COPY as COPY, PROFILE_PREVIEW } from './talentJobsData.js';

const log = debug('JobApplyDialogs');

/*
 * Apply flow dialogs of the posting detail (Figma J-04 7505:346 / 8110:410690, J-12 7510:1087 / 8110:414623,
 * J-14 7510:1721 / 8110:415147 = profile preview; J-05 7506:419 / 8110:411209 = application sent).
 *   preview   760w, header (mint, "STEP 1 OF 2", score sticker) + hidden-Projects alert + profile preview rows +
 *             Edit profile / Edit visibility + footer (Cancel / Continue application)
 *   projects  same, alert turns green, Projects row "just changed", sticker 88% with the +6% bump
 *   offline   same as preview + the red "didn't send" banner, footer primary = "Send when I'm back online"
 *   sent      560w, green celebration header (tick, "Sent to Ama", Playful doodles) + "what next" list
 * Scrim rgba(28,42,33,.45) (both styles). Esc / scrim click close. Focused: 1px ink-10 border + soft shadow;
 * Playful: 1.5px ink-55 + 4px shelf.
 */

const Shell = ({ onClose, labelId, width, children }) => {
  const ref = useRef(null);
  usePlayfulDialogA11y({
    open: true,
    dialogRef: ref,
    onEscape: onClose,
    lockScroll: true,
    initialFocus: () => ref.current,
  });
  return createPortal(
    <div data-pf-portal="">
      <div
        className="fixed inset-0 z-[60] overflow-y-auto bg-[rgba(28,42,33,0.45)]"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget || e.target.dataset.applyWrap === '') onClose();
        }}
      >
        <div
          data-apply-wrap=""
          className="flex min-h-full items-center justify-center p-[clamp(8px,2vw,32px)]"
        >
          <div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            tabIndex={-1}
            style={{ '--apply-w': `${width}px`, outline: 'none' }}
            className={classNames(
              'relative flex w-full max-w-[var(--apply-w)] flex-col overflow-hidden rounded-[28px] bg-[#fffefc] outline-none',
              INK_CARD
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* Profile preview ------------------------------------------------------------------------------- */
const StatusPill = ({ children, tone = 'mint' }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center rounded-full px-[10px] py-[3px] font-sans text-[12px] leading-[14px] font-semibold max-sm:whitespace-normal sm:whitespace-nowrap',
      tone === 'hidden'
        ? 'border border-dashed border-[#c8951a] bg-white text-[#967014]'
        : tone === 'grey'
          ? classNames('bg-[#f8f8f4] text-[#595959]', PILL_OUTLINE)
          : classNames('bg-[#ebf1ec] text-[#2d5d33]', PILL_OUTLINE)
    )}
  >
    {children}
  </span>
);

const PreviewRow = ({ row, projects, showHidden }) => {
  const isProjects = row.id === 'projects';
  const hidden = isProjects && showHidden && !projects;
  const locked = row.id === 'contact';
  const justChanged = isProjects && projects && showHidden;
  return (
    <li
      className={classNames(
        'flex items-center gap-[12px] border-0 border-t border-solid border-[#e1eae2] px-[18px] py-[12px] max-sm:px-[12px]',
        hidden ? 'bg-[rgba(250,244,232,0.5)]' : null
      )}
    >
      <span
        className={classNames(
          'flex size-[28px] shrink-0 items-center justify-center rounded-full',
          hidden
            ? 'bg-[#faf4e8] text-[#967014]'
            : locked
              ? 'bg-[#f8f8f4] text-[#595959]'
              : 'bg-[#ebf1ec] text-[#387440]'
        )}
      >
        {hidden ? (
          <JobDetailEyeOffIcon className="size-[14px]" />
        ) : locked ? (
          <JobDetailLockIcon className="size-[14px]" />
        ) : (
          <JobDetailCheckSmIcon className="h-[8px] w-[11px]" />
        )}
      </span>
      <span
        className={classNames(
          'min-w-0 flex-1 font-sans text-[14px] leading-[17px] max-lg:text-[14px]',
          hidden ? 'text-[#737373]' : 'font-medium text-[#1c2a21]'
        )}
      >
        {row.label}
      </span>
      {justChanged ? (
        <span className="inline-flex shrink-0 items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[8px] py-[2px] font-sans text-[10.5px] leading-[13px] font-bold text-[#1c2a21] max-lg:text-[12px] max-sm:hidden playful:border-[#1c2a21]">
          {COPY.justChanged}
        </span>
      ) : null}
      <StatusPill tone={hidden ? 'hidden' : locked ? 'grey' : 'mint'}>
        {hidden ? row.hiddenStatus : row.status}
      </StatusPill>
    </li>
  );
};

const PreviewDialog = ({ jobs, view, kind, projects, onClose }) => {
  const navigate = useNavigate();
  const labelId = useId();
  const { job, d } = view;
  const offline = kind === 'offline';
  const flow = Boolean(d.preview && d.boost);
  const base = job.match;
  const raised = d.boost?.to ?? base;
  const pct = projects && flow ? raised : base;
  const vars = { company: view.short, from: base, to: raised, loss: d.preview?.hiddenLoss };

  const cont = () => {
    log('continue application', job.id);
    jobs.update({ apply: 'sent' });
  };
  const tryAgain = () => {
    const online = typeof navigator === 'undefined' || navigator.onLine !== false;
    log('try again', { online });
    if (online) jobs.update({ state: null, apply: 'sent' });
  };
  const sendLater = () => {
    log('queued until online', job.id);
    jobs.update({ apply: null, state: null });
  };

  return (
    <Shell onClose={onClose} labelId={labelId} width={760}>
      <header className="relative flex flex-col gap-[14px] bg-[#ebf1ec] py-[24px] pr-[72px] pb-[22px] pl-[28px] max-sm:pr-[56px] max-sm:pl-[16px] sm:flex-row sm:items-center sm:gap-[18px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <span className="font-sans text-[11.5px] leading-[14px] font-bold text-[#2d5d33] max-lg:text-[12px]">
            {COPY.step}
          </span>
          <h2
            id={labelId}
            className="m-0 font-sans text-[clamp(22px,1.68vw,29px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading"
          >
            {fill(COPY.title, vars)}
          </h2>
          <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959]">{COPY.sub}</p>
        </div>
        <div
          className={classNames(
            'relative flex size-[96px] shrink-0 flex-col overflow-hidden items-center justify-center rounded-full bg-[#ffd86b] border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] max-sm:size-[80px] playful:size-[106px] playful:rotate-[6deg] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] max-sm:playful:size-[84px]'
          )}
        >
          <span className="font-sans text-[29px] leading-[1.2] font-semibold text-[#1c2a21] max-sm:text-[24px] playful:font-heading">
            {pct}%
          </span>
          <span className="font-sans text-[10.5px] leading-[13px] font-bold text-[#1c2a21] max-lg:text-[12px]">
            {COPY.forThisRole}
          </span>
          {projects && flow ? (
            <span className="absolute -top-[2px] left-[64px] inline-flex items-center gap-[3px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] py-[3px] pr-[8px] pl-[6px] font-sans text-[11px] leading-[13px] font-bold text-white max-lg:text-[12px] playful:border-[1.2px] playful:border-[#1c2a21] max-sm:left-[48px]">
              <JobDetailUpIcon className="size-[12px]" />
              {d.boost.delta}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          aria-label={COPY.close}
          onClick={onClose}
          className={classNames(
            'absolute top-[16px] right-[14px] flex size-[36px] cursor-pointer items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white p-0 text-[#1c2a21] playful:top-[18px] playful:border-[1.2px] playful:border-[#1c2a21]',
            FOCUS_RING
          )}
        >
          <JobDetailCloseIcon className="size-[16px]" />
        </button>
      </header>

      <div className="flex flex-col gap-[14px] px-[28px] pt-[22px] pb-[8px] max-sm:px-[16px]">
        {flow ? (
          projects ? (
            <div className="flex items-center gap-[12px] rounded-[16px] border-[1.2px] border-solid border-[#387440] bg-[#ebf1ec] px-[16px] py-[14px]">
              <JobDetailCheckLgIcon className="size-[20px] shrink-0 text-[#387440]" />
              <div className="flex min-w-0 flex-col gap-[2px]">
                <span className="font-sans text-[14.5px] leading-[17px] font-semibold text-[#1c2a21]">
                  {COPY.shownTitle}
                </span>
                <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
                  {fill(COPY.shownNote, vars)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[10px] rounded-[16px] border-[1.2px] border-solid border-[#c8951a] bg-[#faf4e8] px-[16px] py-[14px]">
              <JobDetailEyeOffIcon className="size-[20px] shrink-0 text-[#967014]" />
              <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-[2px]">
                <span className="font-sans text-[14.5px] leading-[17px] font-semibold text-[#1c2a21]">
                  {COPY.hiddenTitle}
                </span>
                <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
                  {fill(COPY.hiddenNote, vars)}
                </span>
              </div>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => {
                  log('show projects for this role');
                  jobs.update({ apply: 'projects' });
                }}
              >
                {COPY.showProjects}
              </Button>
            </div>
          )
        ) : null}

        <div className="overflow-hidden rounded-[20px] border border-solid border-[#e1eae2] bg-white">
          <div className="flex items-center gap-[14px] px-[18px] py-[16px] max-sm:px-[12px]">
            <KofiAvatar />
            <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <span className="font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
                {PROFILE_PREVIEW.name}
              </span>
              <span className="font-sans text-[13px] leading-[16px] text-[#737373]">
                {PROFILE_PREVIEW.line}
              </span>
            </div>
            <StatusPill>{PROFILE_PREVIEW.status}</StatusPill>
          </div>
          <ul
            className={classNames(
              'm-0 flex list-none flex-col gap-[4px] p-0',
              offline && 'sm:gap-[16px] sm:playful:gap-[4px]'
            )}
          >
            {PROFILE_PREVIEW.rows.map((r) => (
              <PreviewRow key={r.id} row={r} projects={projects} showHidden={flow} />
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-[4px]">
          <NotifButton
            size="xs"
            tone="secondary"
            className="!h-[32px] !px-[13px] !text-[13.5px]"
            onClick={() => navigate('/profile')}
          >
            {COPY.editProfile}
          </NotifButton>
          <NotifButton
            size="xs"
            tone="secondary"
            className="!h-[32px] !px-[13px] !text-[13.5px]"
            onClick={() => navigate('/profile?manage=1')}
          >
            {COPY.editVisibility}
          </NotifButton>
        </div>

        {offline ? (
          <div
            role="alert"
            className="mb-[14px] flex flex-wrap items-center gap-x-[12px] gap-y-[10px] rounded-[16px] border-[1.2px] border-solid border-[#c0392b] bg-[#f9ebea] py-[12px] pr-[16px] pl-[14px]"
          >
            <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-white text-[#c0392b]">
              <JobDetailWifiOffIcon className="size-[17px]" />
            </span>
            <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-[2px]">
              <span className="font-sans text-[14.5px] leading-[17px] font-semibold text-[#1c2a21]">
                {COPY.offlineTitle}
              </span>
              <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
                {COPY.offlineNote}
              </span>
            </div>
            <Button variant="tertiary" size="sm" onClick={tryAgain}>
              {COPY.tryAgain}
            </Button>
          </div>
        ) : null}
      </div>

      <footer className="flex flex-wrap items-center gap-x-[10px] gap-y-[12px] border-0 border-t border-solid border-[#e1eae2] pt-[16px] pr-[24px] pb-[22px] pl-[28px] max-sm:px-[16px]">
        <span className="flex min-w-[200px] flex-1 items-center gap-[6px] font-sans text-[13px] leading-[16px] text-[#737373]">
          <JobDetailLockIcon className="size-[14px] shrink-0 text-[#737373]" />
          {COPY.privacy}
        </span>
        <div className="flex flex-wrap items-center gap-[10px]">
          <Button variant="tertiary" size="lg" onClick={onClose}>
            {COPY.cancel}
          </Button>
          <Button variant="primary" size="lg" onClick={offline ? sendLater : cont}>
            {offline ? COPY.sendLater : COPY.cont}
          </Button>
        </div>
      </footer>
    </Shell>
  );
};

/* Sent ------------------------------------------------------------------------------------------- */
/* [x, y, w, h, fill, rotate] in the 557x200 celebration box (Figma confetti; CSS rotate = the Figma value). */
const CONFETTI = [
  [40, 25, 15, 10, '#ffd86b', -20],
  [86, 160, 15, 12, '#ffffff', 30],
  [470, 21, 15, 14, '#ffffff', -40],
  [498, 150, 15, 9, '#ffd86b', 15],
  [180, 157, 12, 15, '#ebf1ec', -60],
  [350, 167, 15, 8, '#ffd86b', -10],
  [16, 120, 15, 14, '#ebf1ec', 40],
  [520, 84, 15, 11, '#ebf1ec', -25],
];

const NEXT_ICONS = [JobDetailClockIcon, JobDetailChatIcon, JobDetailBuddySparkIcon];

const SentDialog = ({ jobs, view, onClose }) => {
  const labelId = useId();
  const { job, d } = view;
  const r = d.recruiter;
  const vars = { company: view.short, title: job.title, recruiter: r?.first ?? 'the recruiter' };
  const rows = COPY.next.filter((_, i) => (i === 0 ? Boolean(r) : true));
  const leave = (extra) => {
    log('leave sent dialog', extra);
    jobs.update({ job: null, apply: null, state: null, ...extra });
  };
  return (
    <Shell onClose={onClose} labelId={labelId} width={560}>
      <div className="relative h-[200px] shrink-0 overflow-hidden bg-[#387440]" aria-hidden="true">
        <div className="absolute top-0 left-1/2 h-[200px] w-[557px] -translate-x-1/2">
          {CONFETTI.map(([x, y, w, h, bg, rot]) => (
            <span
              key={`${x}-${y}`}
              className="absolute rounded-[2px] border border-solid border-[rgba(28,42,33,0.12)] playful:border-[#1c2a21]"
              style={{
                left: x,
                top: y,
                width: w,
                height: h,
                background: bg,
                transform: `rotate(${rot}deg)`,
              }}
            />
          ))}
          <JobDetailDoodleSparkLg className="absolute top-[40px] left-[130px] hidden size-[28px] playful:block" />
          <JobDetailDoodleSparkMd className="absolute top-[128px] left-[400px] hidden size-[16px] playful:block" />
          <JobDetailDoodleSparkSm className="absolute top-[140px] left-[110px] hidden size-[14px] playful:block" />
          <JobDetailDoodleSquiggleLg className="absolute top-[96px] left-[60px] hidden h-[14px] w-[70px] playful:block" />
          <JobDetailDoodleSquiggleSm className="absolute top-[90px] left-[430px] hidden h-[10px] w-[50px] playful:block" />
          <span className="absolute top-[44px] left-[calc(50%-55px)] flex size-[110px] items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-[#ffd86b] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:top-[44px] playful:left-[calc(50%-60.5px)] playful:size-[121px] playful:rotate-[6deg] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]">
            <JobDetailTickIcon className="size-[52px] text-[#1c2a21] playful:size-[57px]" />
          </span>
          <span className="absolute top-[40px] left-[356px] inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white py-[6px] pr-[12px] pl-[10px] font-sans text-[12.5px] leading-[15px] font-bold text-[#1c2a21] playful:top-[27px] playful:rotate-[-6deg] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]">
            <JobDetailSendIcon className="size-[14px]" />
            {fill(COPY.sentSticker, vars)}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-[12px] px-[30px] pt-[24px] pb-[26px] max-sm:px-[16px]">
        <h2
          id={labelId}
          className="m-0 text-center font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading"
        >
          {COPY.sentTitle}
        </h2>
        <p className="m-0 text-center font-sans text-[15px] leading-[21px] text-[#595959]">
          {fill(COPY.sentBody, vars)}
        </p>
        <ul className="m-0 flex list-none flex-col gap-[4px] overflow-hidden rounded-[18px] border border-solid border-[#e1eae2] bg-[#f8f8f4] p-0">
          {rows.map((text) => {
            const Icon = NEXT_ICONS[COPY.next.indexOf(text)];
            return (
              <li
                key={text}
                className="flex items-center gap-[12px] border-0 border-t border-solid border-[#e1eae2] px-[16px] py-[12px] first:border-t-0"
              >
                <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#ebf1ec] text-[#387440]">
                  <Icon className="size-[15px]" />
                </span>
                <span className="font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
                  {text}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap gap-[10px] pt-[6px] [&>*]:flex-[1_1_180px]">
          <Button variant="tertiary" size="lg" onClick={() => leave()}>
            {COPY.backToMatches}
          </Button>
          <Button variant="primary" size="lg" onClick={() => leave({ tab: 'applied' })}>
            {COPY.track}
          </Button>
        </div>
      </div>
    </Shell>
  );
};

/* Entry ------------------------------------------------------------------------------------------ */
const ApplyDialog = ({ jobs, view, kind }) => {
  useEffect(() => {
    log('open', { kind, job: view.job.id });
  }, [kind, view.job.id]);

  const close = () => {
    log('close', kind);
    if (kind === 'sent') jobs.update({ apply: null, state: 'applied' });
    else jobs.update(kind === 'offline' ? { apply: null, state: null } : { apply: null });
  };

  if (kind === 'sent') return <SentDialog jobs={jobs} view={view} onClose={close} />;
  return (
    <PreviewDialog
      jobs={jobs}
      view={view}
      kind={kind}
      projects={jobs.apply === 'projects'}
      onClose={close}
    />
  );
};

export default ApplyDialog;
