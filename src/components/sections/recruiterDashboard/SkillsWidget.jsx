import { classNames } from '../../../utils/classNames.js';
import Chip from '../../ui/Chip.jsx';
import InlineState from '../../ui/InlineState.jsx';
import WidgetCard from '../../ui/WidgetCard.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { SKILLS, SKILLS_NATIONAL_ROWS, SKILLS_STATES } from './recruiterDashboardData.js';

/*
 * SkillsWidget — "In-demand skills" heat map (Figma 10049:59176, states D60–D64 in section 07): three bands (Hot / Warm / Cooling) of five skill rows with pay range and a trend chip.
 * The Cooling band ends with a privacy row ("< 5 — hidden for privacy").
 * Props: filters (node: region + industry FilterSelects), readOnly, national (D62: the Ghana · National rows),
 *   state ('' | 'sparse' | 'none') replaces the bands with an inline state (D63 Upper West has too little data, D64 no signal for Agriculture in Tamale),
 *   onSwitchNational, onClearIndustry.
 */
const BAND_STYLES = {
  hot: { face: 'bg-[#f9ebea]/50', icon: dashIcons.bandHotFlame },
  warm: { face: 'bg-[#faf4e8]', icon: dashIcons.bandWarmTrend },
  cooling: { face: 'bg-[#eaeffb]', icon: dashIcons.bandCoolingTrend },
};

const Delta = ({ value }) => {
  if (value === 'Stable') {
    return (
      <Chip tone="neutral" icon={dashIcons.minusStable}>
        Stable
      </Chip>
    );
  }
  const falling = value.startsWith('−');
  return (
    <Chip
      tone={falling ? 'danger' : 'success'}
      icon={falling ? dashIcons.trendDownChip : dashIcons.trendUpChip}
    >
      {value}
    </Chip>
  );
};

const bandsFor = (national) =>
  national
    ? SKILLS.bands.map((band) => {
        const swap = SKILLS_NATIONAL_ROWS[band.id];
        return swap ? { ...band, rows: [...swap, ...band.rows.slice(swap.length)] } : band;
      })
    : SKILLS.bands;

const SkillsWidget = ({
  filters,
  readOnly = false,
  national = false,
  state = '',
  footnote = SKILLS.footnote,
  onSwitchNational,
  onClearIndustry,
  // Live: bands from GET /opportunities/stats/demand and its subtitle.
  liveBands = null,
  subtitle = null,
  stateCopy = null,
}) => {
  const bands = liveBands || bandsFor(national);
  const copy = state ? { ...SKILLS_STATES[state], ...(stateCopy || {}) } : null;
  return (
    <WidgetCard
      id="dash-skills"
      radius={16}
      icon={dashIcons.tileSkillsFlame}
      title={SKILLS.title}
      subtitle={copy ? copy.subtitle : subtitle || SKILLS.subtitle}
      controls={
        <>
          {filters}
          {readOnly ? <Chip tone="amber">Read-only</Chip> : null}
        </>
      }
    >
      {copy ? (
        <InlineState
          tone="mint"
          icon={dashIcons[copy.icon]}
          title={copy.title}
          actions={
            state === 'sparse' ? (
              <button
                type="button"
                onClick={onSwitchNational}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-[8px] whitespace-nowrap max-sm:gap-[6px] max-sm:px-[12px] rounded-[10px] border-0 bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-white shadow-[0_3px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                <img
                  src={dashIcons[copy.actionIcon]}
                  alt=""
                  aria-hidden="true"
                  className="size-[16px]"
                />
                {copy.action}
              </button>
            ) : (
              <button
                type="button"
                onClick={onClearIndustry}
                className="inline-flex h-[36px] cursor-pointer items-center rounded-[10px] border border-solid border-[#1c2a21]/30 bg-white px-[14px] font-sans text-[14px] leading-[24px] font-medium text-[#1c2a21] shadow-[0_2px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                {copy.action}
              </button>
            )
          }
        >
          {copy.body}
        </InlineState>
      ) : (
        <div className="flex flex-col gap-[12px]">
          <div className="grid grid-cols-3 items-start gap-[16px] max-lg:grid-cols-1">
            {bands.map((band) => {
              const style = BAND_STYLES[band.tone];
              return (
                <section
                  key={band.id}
                  aria-label={`${band.title} — ${band.note}`}
                  className={classNames(
                    'flex min-w-0 flex-col gap-[4px] rounded-[16px] p-[16px]',
                    style.face
                  )}
                >
                  <header className="flex items-center gap-[8px] pb-[8px]">
                    <img src={style.icon} alt="" aria-hidden="true" className="size-[18px]" />
                    <h3 className="m-0 font-sans text-[16px] leading-[28px] font-semibold tracking-[0.1px] text-[#111]">
                      {band.title}
                    </h3>
                    <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                      {band.note}
                    </span>
                  </header>
                  <ul className="m-0 flex list-none flex-col gap-[4px] p-0">
                    {band.rows.map((row) => (
                      <li
                        key={row.name}
                        className="flex items-center justify-between gap-[10px] rounded-[10px] bg-white px-[12px] py-[10px]"
                      >
                        <span className="flex min-w-0 flex-col gap-[2px]">
                          <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
                            {row.name}
                          </span>
                          <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                            {row.pay}
                          </span>
                        </span>
                        <Delta value={row.delta} />
                      </li>
                    ))}
                    {band.hidden ? (
                      <li className="flex items-center gap-[10px] rounded-[10px] bg-white px-[12px] py-[10px]">
                        <img
                          src={dashIcons.lockHiddenRow}
                          alt=""
                          aria-hidden="true"
                          className="size-[14px]"
                        />
                        <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                          {SKILLS.hiddenRow}
                        </span>
                      </li>
                    ) : null}
                  </ul>
                </section>
              );
            })}
          </div>
          <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {footnote}
          </p>
        </div>
      )}
    </WidgetCard>
  );
};

export default SkillsWidget;
