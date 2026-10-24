import { useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import {
  CvCallout,
  CvCheckbox,
  CvDialog,
  CvFileCard,
  CvIconTile,
  CvPrimaryButton,
  CvSecondaryButton,
  CvTextRow,
} from './CvParts.jsx';
import {
  CvCameraIcon,
  CvCheckCircleIcon,
  CvClockIcon,
  CvEditIcon,
  CvEyeOffIcon,
  CvHourglassIcon,
  CvInfoIcon,
  CvStarIcon,
  CvUploadIcon,
  CvUsersIcon,
} from './cvIcons.jsx';

const log = debug('CvSteps');

const ACCEPT = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
const LIVE_ACCEPT = '.pdf,.docx';

/* Why a file was turned away (live): wrong type, over 10 MB, or the server said no. */
const unsupportedCopy = (name, reason) => {
  if (reason === 'size') return `“${name}” is bigger than 10 MB. Use a smaller PDF or Word file.`;
  return `“${name}” isn’t supported. Use a PDF or a Word file (.docx), up to 10 MB.`;
};

/*
 * CV-01 Choose a file (8966:99 / 8966:507876) and CV-02b File not supported (8966:3272 / 8966:508960).
 * `live` (signed in): only PDF / .docx are read (no photos yet) and the file is not kept, so the copy says so.
 */
export const CvChooseDialog = ({
  unsupportedName = null,
  unsupportedReason = 'type',
  live = false,
  onFiles,
  onBack,
  onClose,
}) => {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);
  const failed = unsupportedName !== null;
  const browse = () => {
    log('browse');
    inputRef.current?.click();
  };
  return (
    <CvDialog
      title="Upload your CV"
      onClose={onClose}
      noteIcon={failed ? CvInfoIcon : CvClockIcon}
      note={
        failed
          ? 'Password-protected PDFs won’t open either'
          : live
            ? 'Usually under a minute to read'
            : 'About 30 seconds to check'
      }
      buttons={
        <>
          <CvSecondaryButton onClick={onBack}>Back</CvSecondaryButton>
          <CvPrimaryButton onClick={browse}>
            {failed ? 'Choose another file' : 'Choose file'}
          </CvPrimaryButton>
        </>
      }
    >
      {failed ? (
        <CvCallout tone="error" title="We can’t read this file" role="alert">
          {live
            ? unsupportedCopy(unsupportedName, unsupportedReason)
            : `“${unsupportedName}” isn’t supported. Use a PDF, Word file or photos (JPG, PNG), up to 10 MB in total.`}
        </CvCallout>
      ) : (
        <p className="m-0 font-sans text-[14px] leading-[20px] text-[#737373]">
          We’ll read it and suggest your roles, education, skills and certificates. You check
          everything before anything is added.
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple={!live}
        accept={live ? LIVE_ACCEPT : ACCEPT}
        aria-label="Choose your CV file"
        onChange={(e) => {
          const files = e.target.files;
          log('picked', files?.length);
          if (files?.length) onFiles(files);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={browse}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          log('dropped', e.dataTransfer.files?.length);
          if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
        }}
        className={classNames(
          'flex w-full cursor-pointer items-center gap-[14px] rounded-[16px] border-[1.5px] border-dashed border-[#bfbfbf] px-[16px] py-[28px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
          over ? 'bg-[#ebf1ec]' : 'bg-[#f8f8f4]'
        )}
      >
        <span className="inline-flex size-[44px] shrink-0 items-center justify-center rounded-[12px] border-[1.4px] border-solid border-[rgba(28,42,33,0.32)] bg-white text-[#387440] shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]">
          <CvUploadIcon />
        </span>
        <span className="flex min-w-0 flex-col gap-[2px]">
          <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
            {failed
              ? 'Drop another file, or browse'
              : live
                ? 'Drop your CV, or browse'
                : 'Drop your CV, browse, or take a photo'}
          </span>
          <span className="font-sans text-[12px] leading-[14px] text-[#737373]">
            {live
              ? 'PDF or Word (.docx) · 10 MB max'
              : failed
                ? 'PDF, Word, or up to 3 photos · 10 MB max'
                : 'PDF, Word, or up to 3 photos (JPG, PNG) · 10 MB max'}
          </span>
        </span>
      </button>
      {failed ? null : live ? (
        <div className="flex flex-col">
          <CvTextRow
            icon={CvCheckCircleIcon}
            title="A PDF from Word or Google Docs works best"
            sub="Scanned pages and photos can’t be read yet."
          />
          <CvTextRow
            icon={CvEyeOffIcon}
            title="Private: we read it, we don’t keep it"
            sub="Your file is only used to suggest items. Nothing goes on your profile until you add it."
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <CvTextRow
            icon={CvCheckCircleIcon}
            title="Photos work too"
            sub="Lay each page flat in good light. A PDF from Word or Google Docs is quickest."
          />
          <CvTextRow
            icon={CvEyeOffIcon}
            title="Private, and deleted after 12 months"
            sub="Recruiters only see what you add to your profile. We remind you before deleting, and you can delete it sooner in Settings."
          />
        </div>
      )}
    </CvDialog>
  );
};

/* CV-02 Uploading (8966:2714 / 8966:508421). */
export const CvUploadingDialog = ({ file, percent, onCancel, onRead, onClose }) => (
  <CvDialog
    title="Upload your CV"
    onClose={onClose}
    noteIcon={CvCheckCircleIcon}
    note={`${file.type} · ${file.sizeKb} KB`}
    buttons={
      <>
        <CvSecondaryButton onClick={onCancel}>Cancel</CvSecondaryButton>
        <CvPrimaryButton onClick={onRead}>Read my CV</CvPrimaryButton>
      </>
    }
  >
    <p className="m-0 font-sans text-[14px] leading-[20px] text-[#737373]">
      Hang on while your file uploads. You can cancel at any time.
    </p>
    <CvFileCard
      tone="white"
      icon={CvCheckCircleIcon}
      name={file.name}
      status={`${file.sizeKb} KB · uploading ${percent}%`}
      percent={percent}
      onCancel={onCancel}
    />
    <CvCallout title="Nothing is added yet">
      After we read it, you’ll see every role, date and skill we found and choose what to keep.
    </CvCallout>
  </CvDialog>
);

/*
 * CV-03 Reading your CV (8966:3808 / 8966:509494). `active` = index of the step in progress (0-3, 4 = all done).
 * Live: tied to the real request — the bar is the real upload progress, then an indeterminate bar while the server
 * reads; the rows only claim what has happened (sent / reading).
 */
export const CvLiveReadingDialog = ({ file, uploadPercent, onCancel, onClose }) => {
  const sent = uploadPercent >= 100;
  return (
    <CvDialog
      title="Reading your CV"
      onClose={onClose}
      noteIcon={CvClockIcon}
      note="Usually under a minute"
      buttons={<CvSecondaryButton onClick={onCancel}>Cancel</CvSecondaryButton>}
    >
      <CvFileCard
        tone="mint"
        icon={CvCheckCircleIcon}
        name={file.name}
        status={sent ? 'Reading…' : `${file.sizeKb} KB · sending ${uploadPercent}%`}
        percent={sent ? null : uploadPercent}
        onCancel={onCancel}
      />
      <div className="flex flex-col" aria-live="polite">
        <CvTextRow
          icon={sent ? CvCheckCircleIcon : CvHourglassIcon}
          tone={sent ? 'mint' : 'amber'}
          title={sent ? 'Sent your file' : 'Sending your file…'}
          sub={sent ? `${file.type} · ${file.sizeKb} KB` : undefined}
        />
        <CvTextRow
          icon={sent ? CvHourglassIcon : CvStarIcon}
          tone={sent ? 'amber' : 'white'}
          title="Finding roles, education, skills and certificates…"
          dim={!sent}
        />
      </div>
    </CvDialog>
  );
};

export const CvReadingDialog = ({ file, percent, active, secondsLeft, onCancel, onClose }) => {
  const rows = [
    { title: 'Opened your file', sub: `${file.pages} pages, ${file.words} words` },
    { title: 'Found 3 roles and 1 degree' },
    { title: 'Matching dates and employers…' },
    { title: 'Spotting skills and certificates', pendingSub: 'Next' },
  ];
  return (
    <CvDialog
      title="Reading your CV"
      onClose={onClose}
      noteIcon={CvClockIcon}
      note="Usually under 20 seconds"
      buttons={<CvSecondaryButton onClick={onCancel}>Cancel</CvSecondaryButton>}
    >
      <CvFileCard
        tone="mint"
        icon={CvCheckCircleIcon}
        name={file.name}
        status={`Reading · about ${secondsLeft} seconds left`}
        percent={percent}
        onCancel={onCancel}
      />
      <div className="flex flex-col" aria-live="polite">
        {rows.map((r, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <CvTextRow
              key={r.title}
              icon={done ? CvCheckCircleIcon : current ? CvHourglassIcon : CvStarIcon}
              tone={done ? 'mint' : current ? 'amber' : 'white'}
              title={r.title}
              sub={done ? r.sub : !current && i === Math.max(active, 3) ? r.pendingSub : undefined}
              dim={!done && !current}
            />
          );
        })}
      </div>
    </CvDialog>
  );
};

const OPTIONS = [
  {
    id: 'chat',
    icon: CvUsersIcon,
    title: 'Chat with Career Buddy',
    sub: 'She asks about your roles one by one. About 5 minutes.',
  },
  {
    id: 'photo',
    icon: CvCameraIcon,
    title: 'Take a clearer photo',
    sub: 'Or upload a PDF from Word or Google Docs.',
  },
  {
    id: 'manual',
    icon: CvEditIcon,
    title: 'Fill it in myself',
    sub: 'Add each role yourself. About 3 minutes.',
  },
];

/* Live variants: the server could not find text (unreadable) or could not read CVs right now (unavailable). */
const LIVE_FAILURES = {
  unreadable: {
    title: 'We couldn’t read your CV',
    calloutTitle: 'We couldn’t find any text in this file',
    callout:
      'It may be a scan or a photo, which we can’t read yet. Nothing was added. Upload a PDF saved from Word or Google Docs, or a .docx, or pick another way.',
    options: [
      {
        id: 'retry',
        icon: CvCameraIcon,
        title: 'Upload another file',
        sub: 'A PDF saved from Word or Google Docs, or a .docx.',
      },
      OPTIONS[0],
      OPTIONS[2],
    ],
  },
  // 429: the reader allows a few CVs an hour per talent — no "try again" here, it would only fail again.
  limited: {
    title: 'You’ve uploaded a lot of CVs this hour',
    calloutTitle: 'Please wait a bit before trying again',
    callout: 'Nothing was added. Try again in about an hour, or pick another way now.',
    options: [OPTIONS[0], OPTIONS[2]],
  },
  unavailable: {
    title: 'Reading CVs isn’t working right now',
    calloutTitle: 'Our CV reader is unavailable',
    callout: 'Nothing was added. Try again in a moment, or pick another way.',
    options: [
      {
        id: 'retry',
        icon: CvClockIcon,
        title: 'Try again',
        sub: 'Send the same file again.',
      },
      OPTIONS[0],
      OPTIONS[2],
    ],
  },
};

/*
 * CV-03b Couldn’t read it (8966:4372 / 8966:510050). `variant` 'unreadable' | 'unavailable' for live failures;
 * omitted = the drawn demo frame (blurry photo).
 */
export const CvFailedDialog = ({
  variant = null,
  choice,
  onChoice,
  onBack,
  onContinue,
  onClose,
}) => {
  const v = variant ? LIVE_FAILURES[variant] : null;
  const options = v ? v.options : OPTIONS;
  return (
    <CvDialog
      title={v ? v.title : 'We couldn’t read your CV'}
      onClose={onClose}
      noteIcon={CvEyeOffIcon}
      note={v ? 'We don’t keep your file' : 'Your file was deleted straight away'}
      buttons={
        <>
          <CvSecondaryButton onClick={onBack}>Back</CvSecondaryButton>
          <CvPrimaryButton onClick={onContinue}>Continue</CvPrimaryButton>
        </>
      }
    >
      {v ? (
        <CvCallout tone="warn" title={v.calloutTitle} role="status">
          {v.callout}
        </CvCallout>
      ) : (
        <CvCallout tone="warn" title="This photo is too blurry to read">
          We could only read a few words, so nothing was added. Retake it flat, in good light, or
          pick another way.
        </CvCallout>
      )}
      <div role="radiogroup" aria-label="Pick another way" className="flex flex-col gap-[10px]">
        {options.map((o) => {
          const on = choice === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => {
                log('choice', o.id);
                onChoice(o.id);
              }}
              className={classNames(
                'flex w-full cursor-pointer items-center gap-[14px] rounded-[16px] border-solid p-[16px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                on ? 'border-2 border-[#387440] bg-[#ebf1ec]' : 'border border-[#e6e6e6] bg-white'
              )}
            >
              <CvIconTile icon={o.icon} tone={on ? 'white' : 'mint'} />
              <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                  {o.title}
                </span>
                <span className="font-sans text-[13px] leading-[18px] text-[#737373]">{o.sub}</span>
              </span>
              <span
                className={classNames(
                  'inline-flex size-[20px] shrink-0 items-center justify-center rounded-full border-solid',
                  on ? 'border-2 border-[#387440]' : 'border-[1.5px] border-[#e6e6e6]'
                )}
              >
                {on ? <span className="size-[10px] rounded-full bg-[#387440]" /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </CvDialog>
  );
};

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/*
 * CV-05 live: the real counts from the one profile save. summary = { roles, education, skills, certs, certsLeftOut,
 * duplicates }. No "share my CV" box: the file is not kept, so there is nothing to share.
 */
export const CvLiveDoneDialog = ({ summary, onBack, onReview, onClose }) => {
  const stages = [summary.roles, summary.skills, summary.certs].filter((n) => n > 0).length;
  const total = summary.roles + summary.education + summary.skills + summary.certs;
  return (
    <CvDialog
      title={
        total === 0
          ? 'Nothing new to add'
          : stages > 0
            ? `Your CV filled ${plural(stages, 'stage')}`
            : 'Added to your profile'
      }
      onClose={onClose}
      noteIcon={CvStarIcon}
      note="You can still edit anything"
      buttons={
        <>
          <CvSecondaryButton onClick={onBack}>Back to journey</CvSecondaryButton>
          <CvPrimaryButton onClick={onReview}>Review Work</CvPrimaryButton>
        </>
      }
    >
      <div className="flex flex-col">
        <CvTextRow
          icon={CvCheckCircleIcon}
          title={`Work · ${plural(summary.roles, 'role')} added`}
          sub={summary.roles > 0 ? 'Ready to review in Work' : undefined}
          dim={summary.roles === 0}
        />
        <CvTextRow
          icon={CvCheckCircleIcon}
          title={`Skills · ${summary.skills} added`}
          sub={summary.skills > 0 ? 'Verify them in Skills Lab to earn the badge' : undefined}
          dim={summary.skills === 0}
        />
        <CvTextRow
          icon={CvCheckCircleIcon}
          title={`Certifications · ${summary.certs} added`}
          sub={
            summary.certsLeftOut > 0
              ? `${summary.certsLeftOut} left out: no issuer or issue date. Add them in Certifications.`
              : undefined
          }
          dim={summary.certs === 0}
        />
        <CvTextRow
          icon={CvCheckCircleIcon}
          title={`Education · ${summary.education} added`}
          sub={summary.education > 0 ? 'Profile › Education' : undefined}
          dim={summary.education === 0}
        />
      </div>
      {summary.duplicates > 0 ? (
        <CvCallout title={`${plural(summary.duplicates, 'item')} already on your profile`}>
          We skipped them, so nothing was added twice.
        </CvCallout>
      ) : null}
      {summary.roles > 0 ? (
        <CvCallout title="Next: check your Work stage">
          Add what you achieved in each role. A number like “cut load time by 35%” makes recruiters
          stop scrolling.
        </CvCallout>
      ) : null}
    </CvDialog>
  );
};

/* CV-05 Added to your profile (8966:6230 / 8966:511861). */
export const CvDoneDialog = ({ summary, shareCv, onShareCv, onBack, onReview, onClose }) => (
  <CvDialog
    title="Your CV filled 3 stages"
    onClose={onClose}
    noteIcon={CvStarIcon}
    note="You can still edit anything"
    buttons={
      <>
        <CvSecondaryButton onClick={onBack}>Back to journey</CvSecondaryButton>
        <CvPrimaryButton onClick={onReview}>Review Work</CvPrimaryButton>
      </>
    }
  >
    <div className="flex flex-col">
      <CvTextRow
        icon={CvCheckCircleIcon}
        title={`Work · ${summary.roles} roles added`}
        sub="Stage 5 is ready to review"
      />
      <CvTextRow
        icon={CvCheckCircleIcon}
        title={`Skills · ${summary.skills} added`}
        sub="Verify them in Skills Lab to earn the badge"
      />
      <CvTextRow
        icon={CvCheckCircleIcon}
        title={`Certifications · ${summary.certs} added`}
        sub={
          summary.certsLeftOut > 0 ? `${summary.certsLeftOut} left out: add proof later` : undefined
        }
      />
      <CvTextRow
        icon={CvCheckCircleIcon}
        title="Education updated"
        sub="Merged with what you gave at sign-up · Profile › Education"
      />
    </div>
    <CvCallout title="Next: check your Work stage">
      Add what you achieved in each role. A number like “cut load time by 35%” makes recruiters stop
      scrolling.
    </CvCallout>
    <div className="flex flex-col gap-[6px] rounded-[16px] border border-solid border-[#e6e6e6] p-[16px]">
      <div className="flex items-center gap-[10px]">
        <CvCheckbox checked={shareCv} onChange={onShareCv} labelledBy="cv-share-label" />
        <span id="cv-share-label" className="font-sans text-[13px] leading-[19px] text-[#1c2a21]">
          Let verified recruiters download my CV
        </span>
      </div>
      <p className="m-0 font-sans text-[12px] leading-[17px] text-[#737373]">
        Off by default. You’ll see who downloaded it. Under-18s can’t share a CV file.
      </p>
    </div>
  </CvDialog>
);
