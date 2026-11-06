import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterPageHeading');

/*
 * RecruiterPageHeading — the mixed-style page title used on every recruiter
 * dashboard screen (Talent Search 7249:74317, Job Templates 7249:75082,
 * Job Postings, Job Screening, Application Pipeline, Messages).
 *
 * Figma encodes the two-tone treatment with characterStyleOverrides on a
 * single TEXT node: the leading run stays #111111 while the trailing run is
 * italic #387440. Both are Instrument Serif 40/52, -2 letter-spacing. Callers
 * pass the already-split runs so the data stays faithful to Figma while the
 * span structure is explicit.
 *
 *   lead     string — the #111111 run, including its trailing space
 *   accent   string — the italic brand-green run
 *   subtitle string — supporting line, 16/24 #999999
 *   titleStyle 'serif' (default) | 'sans' — see below
 */
const RecruiterPageHeading = ({ lead, accent, subtitle, className, titleStyle = 'serif' }) => {
  log('render', { lead, accent, titleStyle });

  /* titleStyle="sans" (Job prospecting V2.0): Bricolage Grotesque 600, 34/41, -0.68 tracking, #1c2a21 — the
     Messages frames 7249:83993 onwards. Clamped. Default 'serif' = the original Instrument Serif title. */
  /* titleStyle="sans-accent" (Talent Search 7249:74318, Job Templates 7249:75082): Bricolage Grotesque 600
     40/48, -0.8 tracking; lead run #1c2a21, accent run #387440 (same weight, NOT italic). Clamped. */
  if (titleStyle === 'sans-accent') {
    return (
      <div className={classNames('flex min-w-0 flex-col gap-[3px]', className)}>
        <h1
          className="font-heading font-semibold tracking-[-0.02em] text-[#1c2a21]"
          style={{ fontSize: 'clamp(1.75rem, 1.4rem + 1.1vw, 2.5rem)', lineHeight: 1.2 }}
        >
          {lead}
          <span className="text-brand-green">{accent}</span>
        </h1>
        {subtitle && (
          <p className="whitespace-pre-wrap font-sans text-[16px] leading-6 tracking-[0.2px] text-[#999999] max-md:hidden">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  if (titleStyle === 'sans') {
    return (
      <div className={classNames('flex min-w-0 flex-col gap-[3px]', className)}>
        <h1
          className="font-heading font-semibold tracking-[-0.02em] text-[#1c2a21]"
          style={{ fontSize: 'clamp(1.625rem, 1.3rem + 0.9vw, 2.125rem)', lineHeight: 1.2 }}
        >
          {lead}
          {accent}
        </h1>
        {subtitle && (
          <p className="font-sans text-[16px] leading-6 tracking-[0.2px] text-[#999999] max-md:hidden">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={classNames('flex min-w-0 flex-col gap-[3px]', className)}>
      <h1
        className="font-display not-italic tracking-[-2px] max-md:tracking-[-0.5px] max-md:text-[24px]! max-md:leading-[1.2]! text-black"
        /* Figma 40px/52 — clamped per the fluid-sizing rule. */
        style={{ fontSize: 'clamp(1.75rem, 1.4rem + 1.1vw, 2.5rem)', lineHeight: 1.3 }}
      >
        {lead}
        <span className="italic text-brand-green">{accent}</span>
      </h1>
      {subtitle && (
        /* whitespace-pre-wrap preserves the deliberate double spaces Figma
           puts in several of these subtitles. */
        <p className="whitespace-pre-wrap font-sans text-[16px] leading-6 tracking-[0.2px] text-[#999999] max-md:hidden">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default RecruiterPageHeading;
