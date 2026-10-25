import { classNames } from '../../../../utils/classNames.js';
import {
  DataRequestIconAudit,
  DataRequestIconDataset,
  DataRequestIconLockBadge,
  DataRequestIconShieldCheck,
} from './dataRequestIcons.jsx';

/*
 * RequestAccessCards — "Opens when approved" (locked, dashed 1px #387440 border) / "Your access" (open, solid) — three cards: Dataset · Access window ·
 * Audit log (Figma "Unlock feature cards" 8597:1434: 434×192, r16, white at 92 %). Each carries a lock badge (Locked / Open), the text, a 56px mini
 * progress track with its caption and a foot line. On an open request the caption is the live countdown ("6 days left").
 * Props: title, sub, cards [{ id, title, text, icon, badge, value, foot, fill, live }], countdown (label, used by live cards).
 */

const ICONS = {
  dataset: DataRequestIconDataset,
  shield: DataRequestIconShieldCheck,
  audit: DataRequestIconAudit,
};

const RequestAccessCards = ({ title, sub, cards, countdown }) => (
  <section aria-labelledby="dr-access-title" className="flex flex-col gap-[12px]">
    <div className="flex flex-col gap-[2px]">
      <h2
        id="dr-access-title"
        className="m-0 font-sans text-[16px] leading-[28px] font-semibold tracking-[0.1px] text-[#1c2a21]"
      >
        {title}
      </h2>
      <p className="m-0 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#babab7]">
        {sub}
      </p>
    </div>
    <ul className="m-0 grid list-none grid-cols-1 gap-[14px] p-0 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = ICONS[card.icon];
        return (
          <li
            key={card.id}
            className={classNames(
              'flex min-h-[192px] flex-col gap-[12px] rounded-[16px] bg-white/[0.92] p-[16px]',
              card.live
                ? 'border border-solid border-[#387440]'
                : 'border border-dashed border-[#387440]'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="flex size-[44px] items-center justify-center rounded-[12px] border border-solid border-[#fefefe] bg-white text-[#387440]">
                <Icon className="size-[22px]" />
              </span>
              <span className="inline-flex items-center gap-[4px] rounded-full border border-solid border-[#fefefe] bg-white py-[3px] pr-[9px] pl-[8px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#babab7]">
                <DataRequestIconLockBadge className="size-[11px] text-[#70706e]" />
                {card.badge}
              </span>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="flex flex-col gap-[6px]">
                <h3 className="m-0 font-sans text-[14px] leading-[20px] font-semibold tracking-[0.2px] text-[#142916]">
                  {card.title}
                </h3>
                <p className="m-0 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#595959]">
                  {card.text}
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-[8px] rounded-full border border-solid border-[#fefefe] bg-white px-[8px] py-[4px]">
                <span
                  aria-hidden="true"
                  className="block h-[6px] w-[56px] overflow-hidden rounded-full bg-[#e1eae2]"
                >
                  <span
                    className="block h-full rounded-full bg-[#387440]"
                    style={{ width: card.fill }}
                  />
                </span>
                <span className="font-sans text-[12px] leading-[18px] font-semibold tracking-[0.2px] text-[#387440]">
                  {card.live ? countdown : card.value}
                </span>
              </span>
              <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#387440]">
                {card.foot}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  </section>
);

export default RequestAccessCards;
