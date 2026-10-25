import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import {
  AdminArrowRightIcon,
  AdminBellIcon,
  AdminCalendarIcon,
  AdminCheckCircleFillIcon,
  AdminClockIcon,
  AdminCompanyIcon,
  AdminDocCheckIcon,
  AdminDocIcon,
  AdminLabelIcon,
  AdminLinkIcon,
  AdminPenIcon,
  AdminPlusIcon,
  AdminTimeClockIcon,
  AdminUserIcon,
} from '../adminIcons.jsx';

const log = debug('VerificationReviewView');

/*
 * VerificationReviewView — the document-review screen of Verification and approvals (Figma 7.6.2a KYB, 7.6.3a accreditation, 7.6.3b MoU, 7.6.4a DPO data request,
 * 7.6.5a appeal: one layout, five contents). Title 34/41 600 + sticker, sub copy, cream banner, then "Submitted documents" 29/600 with a "4 checks · 2 matched" chip and the
 * document entries (white, r20: 52 tile — green for a matched document, mint otherwise — 18/600 title + status chip, meta line with 14 icons, tag chips, "View file" link,
 * 38 edit button), two dashed add buttons; on the right two cards (Registry checks / Before you decide, r24, p24) and the decision buttons (green primary with an arrow,
 * two mint buttons).
 * Props: review (REVIEWS[key]), onDecide('primary' | 'info' | 'reject').
 * ⚠️ ASSUMPTION: the edit buttons, "View file" / "Open request" links and the two dashed buttons have no flow drawn: they only log.
 */

const META_ICONS = {
  company: AdminCompanyIcon,
  calendar: AdminCalendarIcon,
  label: AdminLabelIcon,
};
const RAIL_ICONS = {
  'check-circle-fill': AdminCheckCircleFillIcon,
  'time-clock': AdminTimeClockIcon,
  user: AdminUserIcon,
  bell: AdminBellIcon,
};

const Status = ({ tone, children }) => {
  if (tone === 'warn') {
    return (
      <span className="inline-flex h-[25px] items-center gap-[5px] rounded-full border border-solid border-[#1c2a21]/10 bg-[#faf4e8] py-[5px] pr-[10px] pl-[8px] font-sans text-[11px] leading-[13px] font-semibold text-[#785910]">
        <AdminTimeClockIcon className="size-[13px]" />
        {children}
      </span>
    );
  }
  if (tone === 'plain') {
    return (
      <span className="inline-flex h-[23px] items-center rounded-full border border-solid border-[#e7e7e7] bg-[#f8f8f4] px-[10px] py-[4px] font-sans text-[11px] leading-[13px] font-semibold text-[#595959]">
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959]">
      {children}
    </span>
  );
};

const Entry = ({ doc }) => (
  <li className="flex items-start gap-[16px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white py-[18px] pr-[20px] pl-[20px] shadow-[0_1px_2px_rgba(15,15,10,0.04)]">
    <span
      aria-hidden="true"
      className={classNames(
        'grid size-[52px] shrink-0 place-items-center rounded-[14px]',
        doc.strong
          ? 'border border-solid border-[#1c2a21]/20 bg-[#387440] text-white'
          : 'bg-[#ebf1ec] text-[#387440]'
      )}
    >
      {doc.strong ? (
        <AdminDocCheckIcon className="size-[24px]" />
      ) : (
        <AdminDocIcon className="size-[24px]" />
      )}
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
      <div className="flex flex-wrap items-center gap-[10px]">
        <h3 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
          {doc.title}
        </h3>
        <Status tone={doc.tone}>{doc.chip}</Status>
      </div>
      <ul className="m-0 flex list-none flex-wrap items-center gap-x-[12px] gap-y-[4px] p-0">
        {doc.meta.map((m) => {
          const Icon = META_ICONS[m.icon] ?? AdminCompanyIcon;
          return (
            <li
              key={m.text}
              className="flex items-center gap-[5px] font-sans text-[13px] leading-[16px] font-medium text-[#595959]"
            >
              <Icon className="size-[14px] shrink-0" />
              {m.text}
            </li>
          );
        })}
      </ul>
      {doc.tags.length ? (
        <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
          {doc.tags.map((t) => (
            <li
              key={t}
              className="inline-flex h-[24px] items-center rounded-full border border-solid border-[#1c2a21]/10 bg-[#ebf1ec] px-[10px] font-sans text-[12px] leading-[14px] font-semibold text-[#387440]"
            >
              {t}
            </li>
          ))}
        </ul>
      ) : null}
      {doc.link ? (
        <button
          type="button"
          onClick={() => log('open file (no viewer drawn)', doc.title)}
          className="inline-flex w-fit cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0 font-sans text-[13px] leading-[16px] font-semibold text-[#387440] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AdminLinkIcon className="size-[14px]" />
          {doc.link}
        </button>
      ) : null}
    </div>
    <button
      type="button"
      aria-label={`Edit ${doc.title}`}
      onClick={() => log('edit (no flow drawn)', doc.title)}
      className="grid size-[38px] shrink-0 cursor-pointer place-items-center rounded-[10px] border border-solid border-[#e7e7e7] bg-white text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
    >
      <AdminPenIcon className="size-[16px]" />
    </button>
  </li>
);

const VerificationReviewView = ({ review, onDecide }) => (
  <div className="flex flex-col gap-[24px] pt-[4px]">
    <header className="flex flex-col gap-[3px]">
      <div className="flex flex-wrap items-center gap-[12px]">
        <h1 className="m-0 font-sans text-[34px] leading-[41px] font-semibold text-[#1c2a21]">
          {review.title}
        </h1>
        <span className="inline-flex h-[26px] items-center rounded-full bg-[#ebf1ec] px-[11px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
          {review.sticker}
        </span>
      </div>
      <p className="m-0 font-sans text-[16px] leading-[24px] text-[#737373]">{review.subtitle}</p>
    </header>
    <div className="flex flex-col gap-[18px]">
      <p className="m-0 flex items-center gap-[14px] rounded-[20px] border border-solid border-[#eedeb8] bg-[#faf4e8] px-[18px] py-[14px] pl-[14px] font-sans text-[14px] leading-[20px] font-medium text-[#1c2a21]">
        <AdminClockIcon className="size-[18px] shrink-0 text-[#c8951a]" />
        {review.banner}
      </p>
      <div className="grid grid-cols-1 items-start gap-[24px] xl:grid-cols-[minmax(0,885fr)_minmax(0,420fr)]">
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-wrap items-center gap-[12px]">
            <h2 className="m-0 font-sans text-[29px] leading-[35px] font-semibold text-[#1c2a21]">
              {review.section.title}
            </h2>
            <span className="inline-flex h-[24px] items-center rounded-full border border-solid border-[#1c2a21]/10 bg-[#f8f8f4] px-[10px] font-sans text-[12px] leading-[14px] font-semibold text-[#595959]">
              {review.section.badge}
            </span>
          </div>
          <ul className="m-0 flex list-none flex-col gap-[20px] p-0">
            {review.docs.map((d) => (
              <Entry key={d.title} doc={d} />
            ))}
          </ul>
          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
            {review.add.map((a, i) => (
              <button
                key={a}
                type="button"
                onClick={() => log('add (no flow drawn)', a)}
                className="flex h-[60px] cursor-pointer items-center justify-center gap-[8px] rounded-[20px] border border-dashed border-[#387440] bg-[#ebf1ec] px-[20px] font-sans text-[15px] leading-[18px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {i === 0 ? <AdminPlusIcon className="size-[18px]" /> : null}
                {a}
              </button>
            ))}
          </div>
        </div>
        <aside className="flex flex-col gap-[20px]">
          {review.rail.map((card) => (
            <section
              key={card.title}
              aria-label={card.title}
              className="flex flex-col gap-[20px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white p-[24px]"
            >
              <h2 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
                {card.title}
              </h2>
              <ul className="m-0 flex list-none flex-col gap-[20px] p-0">
                {card.rows.map((r) => {
                  const Icon = RAIL_ICONS[r.icon] ?? AdminBellIcon;
                  return (
                    <li key={r.title} className="flex items-start gap-[12px]">
                      <span
                        aria-hidden="true"
                        className="grid size-[32px] shrink-0 place-items-center rounded-[10px] bg-[#ebf1ec] text-[#387440]"
                      >
                        <Icon className="size-[16px]" />
                      </span>
                      <span className="flex min-w-0 flex-col gap-[2px]">
                        <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                          {r.title}
                        </span>
                        <span className="font-sans text-[13px] leading-[19px] text-[#595959]">
                          {r.text}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          <div className="flex flex-col gap-[12px]">
            <button
              type="button"
              onClick={() => onDecide('primary')}
              className="inline-flex h-[44px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-semibold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {review.decisions[0]}
              <AdminArrowRightIcon className="size-[20px]" />
            </button>
            {[
              { id: 'info', label: review.decisions[1] },
              { id: 'reject', label: review.decisions[2] },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onDecide(b.id)}
                className="inline-flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {b.label}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  </div>
);

export default VerificationReviewView;
