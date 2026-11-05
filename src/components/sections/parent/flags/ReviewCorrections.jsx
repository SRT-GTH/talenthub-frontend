import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import UnderlineTabs from '../../../ui/UnderlineTabs.jsx';
import WardChip from '../wards/WardChip.jsx';
import TabRow from '../wards/tabs/TabRow.jsx';
import refreshIcon from '../../../../assets/parent/wards-refresh.svg';
import { REVIEW_COPY } from './data/flagsData.js';

const log = debug('ReviewCorrections');

/*
 * ReviewCorrections — the "To review" page body, PR-08 "To review · Corrections tab (context)" (Figma 10057:893, content column 1329): a title row ("To review" 34/600 + the "4 waiting" sticker #ebf1ec r999,
 * 13/700 #1f4a2b), the 16 #999 line, the five-tab bar (All · Certificates · Evaluations · Corrections · Payments; the active tab has the 3px green underline, the Corrections count chip is amber #c8951a), and the
 * queue card (white r24, p 8 / 22): one row per corrected flag — 40px #eef4ef tile with the refresh icon, "<Field> was corrected" 15/600 over "<Ward> · you flagged it 14 Oct" 13, the ward chip and the green "Check" button.
 * Props: ward ({ firstName, id }), corrections (flags with status "corrected"), tab ('all' | 'corrections'), tabHref(id) — URL of a real tab.
 * Counts: Corrections = the corrected flags, All = Corrections + the three undrawn waiting items, the sticker = All. "Check" opens the Flags tab with the PW-06 dialog.
 * ⚠️ ASSUMPTION: only All and Corrections are drawn with content, so All lists the same corrections; Certificates, Evaluations and Payments have no designed page and only log. With no correction left the card says REVIEW_COPY.empty.
 */
const ReviewCorrections = ({ ward, corrections, tab, tabHref }) => {
  const total = corrections.length + REVIEW_COPY.otherWaiting;
  log('render', { tab, corrections: corrections.length, total });

  const counts = { all: total, corrections: corrections.length };
  const real = { all: true, corrections: true };

  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px] pt-[clamp(0px,0.7vw,12px)]">
      <div className="flex flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
            {REVIEW_COPY.title}
          </h1>
          <span className="rounded-full bg-[#ebf1ec] px-[11px] py-[5px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b] max-lg:text-[12px]">
            {total} waiting
          </span>
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999]">
          {REVIEW_COPY.intro}
        </p>
      </div>

      <div className="flex flex-col gap-[20px]">
        <UnderlineTabs
          label="To review"
          activeId={tab}
          tabs={REVIEW_COPY.tabs.map((t) => ({
            id: t.id,
            label: t.label,
            count: counts[t.id] ?? t.count,
            countTone: t.id === 'corrections' ? 'amber' : 'mint',
            to: real[t.id] ? tabHref(t.id) : undefined,
            onClick: () => log(real[t.id] ? 'tab:' : 'tab (no page designed yet):', t.id),
          }))}
        />

        <section
          aria-label="Corrections"
          className="flex flex-col rounded-[24px] border border-solid border-[#e7e7e7] bg-white px-[22px] py-[8px] shadow-[0_5px_8.5px_rgba(28,42,33,0.03)] max-sm:px-[14px]"
        >
          {corrections.length === 0 ? (
            <p className="m-0 py-[22px] font-sans text-[15px] leading-[18px] text-[#575755]">
              {REVIEW_COPY.empty}
            </p>
          ) : (
            <ul className="m-0 flex list-none flex-col p-0">
              {corrections.map((flag, i) => (
                <TabRow
                  key={flag.id}
                  size="roomy"
                  icon={refreshIcon}
                  title={REVIEW_COPY.rowTitle(flag)}
                  sub={REVIEW_COPY.rowSub(flag, ward)}
                  last={i === corrections.length - 1}
                >
                  <WardChip tone="pending">{ward.firstName}</WardChip>
                  <ParentButton
                    to={`/parent/wards/${ward.id}?tab=flags&modal=recheck&flag=${flag.id}`}
                    className="!rounded-[10px] !px-[18px] !py-[12px]"
                    onClick={() => log('check', { flag: flag.id })}
                  >
                    {REVIEW_COPY.check}
                  </ParentButton>
                </TabRow>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default ReviewCorrections;
