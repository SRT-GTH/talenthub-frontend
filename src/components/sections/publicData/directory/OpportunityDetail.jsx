import { Link } from 'react-router-dom';
import { PARTNER_SIGN_IN_ROUTE } from '../publicDataNav.js';
import Breadcrumb from './Breadcrumb.jsx';
import { labelOf, OPPORTUNITY_TYPES, PARTNER_TYPES } from './data/directoryData.js';
import { PublicIconCheck, PublicIconClock, PublicIconShare } from './directoryIcons.jsx';
import LinkButton from './LinkButton.jsx';
import TypePill from './TypePill.jsx';

/*
 * OpportunityDetail — Figma 8.6.2b "Opportunities · Public preview detail" (8498:349295) and the phone frame 8516:330.
 * What a visitor sees before verification: the opportunity, who can apply, and a sign-in prompt. "Apply on GTH" is a LINK to sign-in, never an
 * application form (the public site is read-only); the note under it says so ("This public page is a preview.").
 *   desktop : row gap 32 — details card (p32: pill · posted line, title 34/41, summary 17/28, "Who can apply", "What you get", ticks) +
 *             side column 440 (apply card: deadline box, 4 fields, button, note · share link · "Posted by" card).
 *   phone   : pill, title 26/31, "Partner · Tamale", deadline box, summary, "Who can apply" card, fixed bottom bar with "Apply on GTH".
 * Opportunities Figma does not draw in full (everything except Girls in Data) show the list fields only; sections without data are omitted.
 * ⚠️ ASSUMPTION: "Apply on GTH" -> PARTNER_SIGN_IN_ROUTE (the existing sign-in; Figma draws no destination). "Share with someone who should
 * apply" opens the shared Share dialog (?modal=share) like the top-bar Share button.
 * Props: opportunity, partner, onShare().
 */

const Tick = ({ children }) => (
  <li className="flex items-start gap-[8px] font-sans text-[14px] leading-[17px] text-[#1c2a21] md:gap-[10px] md:text-[16px] md:leading-[24px]">
    <PublicIconCheck className="mt-[0px] size-[18px] shrink-0 text-[#387440] md:mt-[3px]" />
    <span>{children}</span>
  </li>
);

const Field = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-[8px] font-sans text-[14px] leading-[17px]">
    <dt className="font-medium text-[#595959]">{label}</dt>
    <dd className="m-0 text-right font-semibold text-[#1c2a21]">{value}</dd>
  </div>
);

const OpportunityDetail = ({ opportunity: o, partner, onShare }) => {
  const d = o.detail;
  const typeLabel = labelOf(OPPORTUNITY_TYPES, o.type);
  const deadlineLong = d?.closesLong ?? o.closes;
  const deadlineShort = d?.closesShort ?? o.closes;
  const deadlineTone =
    o.closingSoon || d ? 'bg-[#faf4e8] text-[#785910]' : 'bg-[#f2f2ee] text-[#1c2a21]';
  const who = d?.who ?? [o.eligibility];
  const whoShort = d?.whoShort ?? who;
  const fields = [
    { label: 'Location', value: d?.location ?? o.regionLabel },
    d?.format && { label: 'Format', value: d.format },
    d?.cost && { label: 'Cost', value: d.cost },
    typeof d?.places === 'number' && { label: 'Places', value: String(d.places) },
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-[16px] md:gap-[24px]">
      <Breadcrumb
        items={[
          { label: 'Directory', to: '/data/opportunities' },
          { label: 'Opportunities', to: '/data/opportunities' },
          { label: o.title },
        ]}
      />
      <div className="flex flex-col gap-[16px] md:gap-[32px] xl:flex-row xl:items-start">
        <article
          aria-labelledby="opportunity-title"
          className="flex min-w-0 flex-col gap-[16px] md:gap-[18px] md:rounded-[24px] md:border md:border-solid md:border-[#e7e7e7] md:bg-white md:p-[32px] md:shadow-[0_5px_17px_rgba(0,0,0,0.04)] xl:flex-1"
        >
          <div className="flex flex-wrap items-center gap-[10px]">
            <TypePill type={o.type} label={typeLabel} />
            {d && (
              <span className="hidden font-sans text-[13px] leading-[16px] font-medium text-[#595959] md:inline">
                {d.posted} · by {o.partnerName}
              </span>
            )}
          </div>
          <h1
            id="opportunity-title"
            className="m-0 font-sans text-[26px] leading-[31px] font-semibold text-[#1c2a21] md:text-[34px] md:leading-[41px] md:tracking-[-0.34px]"
          >
            {o.title}
          </h1>
          <p className="m-0 font-sans text-[14px] leading-[17px] font-medium text-[#595959] md:hidden">
            {o.partnerName} · {d?.locationShort ?? o.regionLabel}
          </p>
          <p
            className={`m-0 flex items-center gap-[8px] rounded-[12px] px-[14px] py-[10px] font-sans text-[14px] leading-[17px] font-semibold md:hidden ${deadlineTone}`}
          >
            <PublicIconClock className="size-[16px] shrink-0" />
            {deadlineShort}
          </p>
          {d && (
            <>
              <p className="m-0 font-sans text-[15px] leading-[23px] text-[#1c2a21] md:hidden">
                {d.summaryShort}
              </p>
              <p className="m-0 hidden font-sans text-[17px] leading-[28px] text-[#1c2a21] md:block">
                {d.summary}
              </p>
            </>
          )}

          <section
            aria-labelledby="opp-who"
            className="flex flex-col gap-[12px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[16px] shadow-[0_5px_17px_rgba(0,0,0,0.04)] md:contents"
          >
            <h3
              id="opp-who"
              className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21] md:mt-[10px] md:text-[20px] md:leading-[24px]"
            >
              Who can apply
            </h3>
            <ul className="m-0 flex list-none flex-col gap-[12px] p-0 md:hidden">
              {whoShort.map((t) => (
                <Tick key={t}>{t}</Tick>
              ))}
            </ul>
            <ul className="m-0 hidden list-none flex-col gap-[18px] p-0 md:flex">
              {who.map((t) => (
                <Tick key={t}>{t}</Tick>
              ))}
            </ul>
          </section>
          {d?.gets && (
            <section aria-labelledby="opp-gets" className="hidden flex-col gap-[18px] md:flex">
              <h3
                id="opp-gets"
                className="m-0 mt-[10px] font-sans text-[20px] leading-[24px] font-semibold text-[#1c2a21]"
              >
                What you get
              </h3>
              <ul className="m-0 flex list-none flex-col gap-[18px] p-0">
                {d.gets.map((t) => (
                  <Tick key={t}>{t}</Tick>
                ))}
              </ul>
            </section>
          )}
        </article>

        <aside
          aria-label="Apply and organisation"
          className="hidden w-full flex-col gap-[16px] md:flex xl:w-[440px] xl:shrink-0"
        >
          <div className="flex flex-col gap-[14px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[24px] shadow-[0_5px_17px_rgba(0,0,0,0.04)]">
            <p
              className={`m-0 flex items-center gap-[10px] rounded-[12px] px-[14px] py-[12px] font-sans text-[14px] leading-[17px] font-semibold ${deadlineTone}`}
            >
              <PublicIconClock className="size-[18px] shrink-0" />
              {deadlineLong}
            </p>
            <dl className="m-0 flex flex-col gap-[14px]">
              {fields.map((f) => (
                <Field key={f.label} {...f} />
              ))}
            </dl>
            <LinkButton to={PARTNER_SIGN_IN_ROUTE} variant="primary" className="w-full">
              Apply on GTH
            </LinkButton>
            <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959]">
              You’ll sign in or create a free talent account to apply. This public page is a
              preview.
            </p>
          </div>
          <button
            type="button"
            onClick={onShare}
            className="flex w-fit cursor-pointer items-center gap-[10px] rounded-[6px] bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <PublicIconShare className="size-[18px] shrink-0" />
            Share with someone who should apply
          </button>
          {partner && (
            <div className="flex flex-col gap-[8px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white px-[24px] py-[20px] shadow-[0_5px_17px_rgba(0,0,0,0.04)]">
              <p className="m-0 font-sans text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase">
                Posted by
              </p>
              <p className="m-0 font-sans text-[17px] leading-[20px] font-semibold text-[#1c2a21]">
                {partner.name}
              </p>
              <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959]">
                {labelOf(PARTNER_TYPES, partner.type)} · {partner.regionLabel}
              </p>
              <Link
                to={`/data/partners/${partner.id}`}
                className="w-fit rounded-[4px] font-sans text-[14px] leading-[17px] font-semibold text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                View partner →
              </Link>
            </div>
          )}
        </aside>
      </div>

      <div className="fixed right-0 bottom-0 left-0 z-30 flex flex-col gap-[6px] border-t border-solid border-[#e7e7e7] bg-white px-[16px] pt-[14px] pb-[max(14px,env(safe-area-inset-bottom))] md:hidden">
        <LinkButton to={PARTNER_SIGN_IN_ROUTE} variant="primary" className="w-full">
          Apply on GTH
        </LinkButton>
        <p className="m-0 font-sans text-[12px] leading-[14px] text-[#595959]">
          You’ll sign in or create a free talent account.
        </p>
      </div>
    </div>
  );
};

export default OpportunityDetail;
