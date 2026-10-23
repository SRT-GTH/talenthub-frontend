import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { STATUS_LABEL } from './certsData.js';
import {
  CertsArrowRightIcon,
  CertsBellIcon,
  CertsCalendarIcon,
  CertsCheckCircleIcon,
  CertsClockIcon,
  CertsCompanyIcon,
  CertsEditIcon,
  CertsEyeIcon,
  CertsFileCheckIcon,
  CertsFileIcon,
  CertsLabelIcon,
  CertsLinkIcon,
  CertsMortarIcon,
  CertsPlusIcon,
  CertsStarDoodle,
  CertsUploadIcon,
  CertsUserIcon,
} from './certsIcons.jsx';

const log = debug('CertsParts');

/* Focused card = 1px ink@.10 + soft shadow; Playful = 1.5px ink@.55 + hard shadow. */
export const CARD =
  'border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';
export const CHIP_BORDER =
  'border border-solid border-[rgba(28,42,33,0.1)] playful:border-[rgba(28,42,33,0.35)]';
export const HEADING = 'playful:font-heading';

/* Heading with the tail in green, as drawn. `plain` = the leading dark part. */
export const TwoTone = ({ text, plain }) => {
  const lead = plain ?? text.slice(0, text.lastIndexOf(' ') + 1);
  return (
    <>
      <span className="text-[#1c2a21]">{lead}</span>
      <span className="text-[#387440]">{text.slice(lead.length)}</span>
    </>
  );
};

/* Yellow Playful-only sticker (tilted) with the two doodle stars beside it. */
export const Sticker = ({ children, tilt = -4, className, stars = true }) => (
  <span aria-hidden="true" className={classNames('relative hidden playful:inline-flex', className)}>
    <span
      style={{ transform: `rotate(${tilt}deg)` }}
      className="inline-flex items-center rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[10px] font-sans text-[12px] leading-[14px] font-bold tracking-[0.4px] whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21]"
    >
      {children}
    </span>
    {stars ? (
      <>
        <CertsStarDoodle className="absolute top-[-20px] left-[calc(100%+15px)] size-[24px] text-[#c8951a] max-lg:hidden" />
        <CertsStarDoodle className="absolute top-[22px] left-[calc(100%+41px)] size-[13px] text-[#387440] max-lg:hidden" />
      </>
    ) : null}
  </span>
);

export const StatusChip = ({ status }) => {
  if (status === 'verified')
    return (
      <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] max-lg:text-[12px]">
        {STATUS_LABEL.verified}
      </span>
    );
  if (status === 'pending')
    return (
      <span
        className={classNames(
          'inline-flex items-center gap-[5px] rounded-full bg-[#faf4e8] py-[5px] pr-[10px] pl-[8px] font-sans text-[11px] leading-[13px] font-semibold text-[#785910] max-lg:text-[12px]',
          CHIP_BORDER
        )}
      >
        <CertsClockIcon className="size-[13px]" />
        {STATUS_LABEL.pending}
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full border border-solid border-[#e7e7e7] bg-[#f7f8f4] px-[10px] py-[4px] font-sans text-[11px] leading-[13px] font-semibold text-[#595959] max-lg:text-[12px]">
      {STATUS_LABEL.self}
    </span>
  );
};

export const SkillChips = ({ skills }) => (
  <div className="flex flex-wrap gap-[6px]">
    {skills.map((s) => (
      <span
        key={s}
        className={classNames(
          'inline-flex items-center rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-sans text-[12px] leading-[14px] font-semibold text-[#387440]',
          CHIP_BORDER
        )}
      >
        {s}
      </span>
    ))}
  </div>
);

const Meta = ({ icon, children }) => {
  const Glyph = icon;
  return (
    <span className="inline-flex items-center gap-[5px] font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-lg:text-[12px]">
      <Glyph className="size-[14px] shrink-0" />
      {children}
    </span>
  );
};

const TILE_ICON = { verified: CertsFileCheckIcon, pending: CertsFileIcon, self: CertsMortarIcon };

const LINK_CLS =
  'inline-flex min-h-[24px] cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0 font-sans text-[13px] leading-[16px] font-semibold text-[#387440] max-lg:text-[12px]';

/* "Credential link" / "Badge link": opens the cert's link in a new tab; without one (the drawn example) it only logs. */
const LinkButton = ({ label, url }) => {
  if (url) {
    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => log('open credential link', href)}
        className={classNames(
          LINK_CLS,
          'no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
        )}
      >
        <CertsLinkIcon className="size-[14px]" />
        {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={() => log('link (no destination)', label)} className={LINK_CLS}>
      <CertsLinkIcon className="size-[14px]" />
      {label}
    </button>
  );
};

const CARD_ROW =
  'flex items-start gap-[16px] rounded-[20px] bg-white py-[20px] pr-[20px] pl-[18px] max-sm:gap-[12px] max-sm:p-[14px]';
const TITLE =
  'm-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21] max-sm:text-[16px]';

/* One certificate card (CE-02 list). */
export const EntryCard = ({ cert, onEdit }) => {
  const Glyph = TILE_ICON[cert.status] ?? CertsFileIcon;
  const verified = cert.status === 'verified';
  return (
    <article className={classNames(CARD_ROW, CARD)}>
      <span
        className={classNames(
          'inline-flex size-[52px] shrink-0 items-center justify-center rounded-[14px] max-sm:size-[40px]',
          verified ? ['bg-[#387440] text-white', CARD] : 'bg-[#ebf1ec] text-[#387440]'
        )}
      >
        <Glyph className="size-[24px] max-sm:size-[20px]" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
        <div className="flex flex-wrap items-center gap-[10px]">
          <h3 className={TITLE}>{cert.title}</h3>
          <StatusChip status={cert.status} />
        </div>
        <div className="flex flex-wrap gap-x-[12px] gap-y-[4px]">
          {cert.issuer ? <Meta icon={CertsCompanyIcon}>{cert.issuer}</Meta> : null}
          {cert.dateLabel ? <Meta icon={CertsCalendarIcon}>{cert.dateLabel}</Meta> : null}
          {cert.credentialId ? <Meta icon={CertsLabelIcon}>ID {cert.credentialId}</Meta> : null}
        </div>
        {cert.skills.length ? <SkillChips skills={cert.skills} /> : null}
        {cert.linkLabel ? (
          <div>
            <LinkButton label={cert.linkLabel} url={cert.link} />
          </div>
        ) : null}
      </div>
      <button
        type="button"
        aria-label={`Edit ${cert.title}`}
        onClick={onEdit}
        className="inline-flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#e7e7e7] bg-white p-0 text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <CertsEditIcon className="size-[16px]" />
      </button>
    </article>
  );
};

/* The drawn example on the empty screen (CE-01). */
export const ExampleCard = ({ cert }) => (
  <article className={classNames(CARD_ROW, CARD)}>
    <span className="inline-flex size-[52px] shrink-0 items-center justify-center rounded-[14px] bg-[#ebf1ec] text-[#387440] max-sm:size-[40px]">
      <CertsFileCheckIcon className="size-[24px] max-sm:size-[20px]" />
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
      <div className="flex flex-wrap items-center gap-[10px]">
        <h3 className={TITLE}>{cert.title}</h3>
        <span className="inline-flex items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[10px] py-[4px] font-sans text-[11px] leading-[13px] font-semibold text-[#1c2a21] playful:border-[#1c2a21] max-lg:text-[12px]">
          Example
        </span>
      </div>
      <div className="flex flex-wrap gap-x-[12px] gap-y-[4px]">
        <Meta icon={CertsCompanyIcon}>{cert.issuer}</Meta>
        <Meta icon={CertsCalendarIcon}>{cert.dateLabel}</Meta>
        <Meta icon={CertsLabelIcon}>{cert.idLine}</Meta>
      </div>
      <SkillChips skills={cert.skills} />
      <div>
        <LinkButton label={cert.linkLabel} />
      </div>
    </div>
  </article>
);

const InfoRow = ({ icon, title, text }) => {
  const Glyph = icon;
  return (
    <div className="flex gap-[12px]">
      <span className="inline-flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440]">
        <Glyph className="size-[16px]" />
      </span>
      <div className="flex min-w-0 flex-col gap-[2px]">
        <p className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
          {title}
        </p>
        <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[12px]">
          {text}
        </p>
      </div>
    </div>
  );
};

const RAIL_CARD = 'flex flex-col gap-[14px] rounded-[24px] bg-white p-[24px] max-sm:p-[16px]';
const RAIL_H = 'm-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]';

export const Rail = ({ reminder }) => (
  <aside className="flex flex-col gap-[20px]">
    <section className={classNames(RAIL_CARD, CARD)}>
      <h2 className={RAIL_H}>How verification works</h2>
      <InfoRow
        icon={CertsCheckCircleIcon}
        title="Verified"
        text="We matched the ID with the issuer. Recruiters see a green badge."
      />
      <InfoRow
        icon={CertsClockIcon}
        title="Pending"
        text="Some issuers take 24–48 hours. Recruiters can still see it."
      />
      <InfoRow
        icon={CertsUserIcon}
        title="Self-reported"
        text="Still counts. Add an ID or link to get it verified."
      />
    </section>
    {reminder ? (
      <section className={classNames(RAIL_CARD, CARD)}>
        <h2 className={RAIL_H}>Expiry reminders</h2>
        <InfoRow icon={CertsBellIcon} title={reminder.title} text={reminder.text} />
      </section>
    ) : null}
  </aside>
);

const CHECK_ROWS = [
  {
    icon: CertsFileCheckIcon,
    title: 'Issuer and credential ID',
    text: 'We verify with the issuer where we can',
  },
  {
    icon: CertsCalendarIcon,
    title: 'Issue and expiry dates',
    text: 'We remind you before anything expires',
  },
  { icon: CertsLabelIcon, title: 'Skills it covers', text: 'They become searchable tags' },
];

export const Hero = ({ sticker }) => (
  <section
    className="px-4 py-5 md:px-[clamp(20px,3.7vw,64px)] lg:pt-[34px] lg:pb-[13px] playful:lg:pb-[12px]"
    style={{ backgroundImage: 'linear-gradient(90deg,#ebf1ec 0%,#faf4e8 100%)' }}
  >
    <div className="flex flex-col gap-[20px] lg:flex-row lg:justify-between lg:gap-[32px]">
      <div className="flex max-w-[660px] flex-col gap-[12px]">
        <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#387440] max-lg:text-[12px]">
          CERTIFICATIONS
        </p>
        <div className="relative">
          <h1
            className={classNames(
              'm-0 inline font-sans text-[clamp(28px,2.72vw,47px)] leading-[1.1] font-semibold',
              HEADING
            )}
          >
            <TwoTone text="Proof with your name on it." plain="Proof with " />
          </h1>
          {sticker ? (
            <Sticker
              className="max-lg:mt-2 max-lg:flex lg:absolute lg:top-[49px] lg:left-[564px]"
              tilt={-4}
            >
              {sticker}
            </Sticker>
          ) : null}
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#595959]">
          Degrees, online courses, licences, bootcamps, WASSCE. Upload a PDF or photo and we fill in
          the details, or add them yourself.
        </p>
      </div>
      <div
        className={classNames(
          'flex w-full shrink-0 flex-col gap-[10px] self-start rounded-[24px] bg-white px-[22px] py-[20px] lg:w-[clamp(340px,26.6vw,460px)]',
          CARD
        )}
      >
        <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          What we check
        </h2>
        {CHECK_ROWS.map((r) => {
          const Glyph = r.icon;
          return (
            <div key={r.title} className="flex items-center gap-[10px]">
              <span className="inline-flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-[#ebf1ec] text-[#387440]">
                <Glyph className="size-[16px]" />
              </span>
              <div className="flex flex-col gap-px">
                <p className="m-0 font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21] max-lg:text-[12px]">
                  {r.title}
                </p>
                <p className="m-0 font-sans text-[12px] leading-[14px] text-[#595959]">{r.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const STEPS = [
  { icon: CertsUploadIcon, title: '1. Upload', text: 'PDF, JPG or PNG up to 10 MB.' },
  { icon: CertsEyeIcon, title: '2. Check the details', text: 'Fix anything we got wrong.' },
  { icon: CertsCheckCircleIcon, title: '3. Get verified', text: 'We confirm with the issuer.' },
];

const TILE_SM =
  'inline-flex size-[64px] items-center justify-center rounded-[22px] bg-[#ebf1ec] text-[#387440] translate-y-[8px] playful:size-[72px]';

export const EmptyState = ({ onUpload, onManual, onSkip }) => (
  <section
    className={classNames(
      'relative flex flex-col items-center gap-[16px] rounded-[24px] bg-white px-[clamp(16px,2.8vw,48px)] pt-[44px] pb-[36px]',
      CARD
    )}
  >
    <CertsStarDoodle className="absolute top-[39px] left-[calc(50%-196px)] hidden size-[24px] text-[#ffd86b] playful:block max-lg:hidden" />
    <CertsStarDoodle className="absolute top-[59px] left-[calc(50%+164px)] hidden size-[14px] text-[#387440] playful:block max-lg:hidden" />
    <div aria-hidden="true" className="flex items-center">
      <span className={classNames(TILE_SM, CARD)}>
        <CertsFileIcon className="size-[28px] playful:size-[32px]" />
      </span>
      <span
        className={classNames(
          'z-[1] -mx-[14px] inline-flex size-[80px] items-center justify-center rounded-[22px] bg-[#c8951a] text-white',
          CARD
        )}
      >
        <CertsFileCheckIcon className="size-[36px]" />
      </span>
      <span className={classNames(TILE_SM, CARD)}>
        <CertsMortarIcon className="size-[28px] playful:size-[32px]" />
      </span>
    </div>
    <h2
      className={classNames(
        'm-0 text-center font-sans text-[clamp(24px,1.85vw,32px)] leading-[1.2] font-semibold',
        HEADING
      )}
    >
      <TwoTone text="No certificates yet. Got one?" plain="No certificates yet. " />
    </h2>
    <p className="m-0 max-w-[640px] text-center font-sans text-[16px] leading-[24px] text-[#595959]">
      Upload a PDF or a photo and we pull out the issuer, dates and ID in a couple of seconds. You
      check everything before it’s saved.
    </p>
    <div className="flex flex-wrap items-center justify-center gap-[12px]">
      <Button size="md" rightIcon={<CertsArrowRightIcon />} onClick={onUpload}>
        Upload a certificate
      </Button>
      <Button
        variant="tertiary-subtle"
        size="md"
        className="rounded-[14px]! px-[34px]!"
        onClick={onManual}
      >
        Add manually
      </Button>
    </div>
    <button
      type="button"
      onClick={onSkip}
      className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#595959]"
    >
      No certificates yet? Skip this stage
    </button>
    <div className="mt-[20px] grid w-full grid-cols-1 gap-[16px] border-t border-solid border-[#e7e7e7] pt-[22px] md:grid-cols-3">
      {STEPS.map((s) => {
        const Glyph = s.icon;
        return (
          <div key={s.title} className="flex items-start gap-[12px]">
            <span className="inline-flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#387440]">
              <Glyph className="size-[18px]" />
            </span>
            <div className="flex flex-col gap-[3px]">
              <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                {s.title}
              </p>
              <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[12px]">
                {s.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export const AddRow = ({ onUpload, onManual }) => (
  <div className="flex flex-col gap-[12px] sm:flex-row">
    {[
      { label: 'Upload a certificate', onClick: onUpload, plus: true },
      { label: 'Add manually', onClick: onManual, plus: false },
    ].map((b) => (
      <button
        key={b.label}
        type="button"
        onClick={b.onClick}
        className="inline-flex min-h-[60px] flex-1 cursor-pointer items-center justify-center gap-[8px] rounded-[20px] border border-solid border-[#387440] bg-[#ebf1ec] p-[20px] font-sans text-[15px] leading-[18px] font-semibold text-[#387440] playful:border-[1.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        {b.plus ? <CertsPlusIcon className="size-[18px]" /> : null}
        {b.label}
      </button>
    ))}
  </div>
);
