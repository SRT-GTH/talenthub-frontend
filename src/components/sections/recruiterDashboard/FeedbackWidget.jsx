import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import Chip from '../../ui/Chip.jsx';
import WidgetCard from '../../ui/WidgetCard.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { FEEDBACK, FEEDBACK_WITHDREW } from './recruiterDashboardData.js';

/*
 * FeedbackWidget — "Feedback" inbox (Figma 10049:58998): two tabs (Give feedback · 3 / My feedback · 4.5 ★) and the interviews that still need feedback.
 * Props: tab ('give' | 'mine'), onTabChange, readOnly, onLeaveFeedback(id), mine (node for the My feedback tab), withdrewId (a candidate who withdrew: dimmed, "Closed", D74).
 * The "My feedback" tab body is drawn in section 08 (frames D70–D74); this component renders its list through the `mine` slot.
 */
const FeedbackWidget = ({
  tab = 'give',
  onTabChange,
  readOnly = false,
  onLeaveFeedback,
  mine,
  withdrewId = '',
}) => (
  <WidgetCard
    id="dash-feedback"
    icon={dashIcons.tileFeedback}
    title={FEEDBACK.title}
    subtitle={FEEDBACK.subtitle}
    controls={
      readOnly ? (
        <Chip tone="amber">Read-only</Chip>
      ) : (
        <Link
          to="/recruiter/application-pipeline"
          className="inline-flex h-[32px] items-center gap-[3px] rounded-[10px] px-0 font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {FEEDBACK.viewAll}
          <img src={dashIcons.arrowRightLink} alt="" aria-hidden="true" className="size-[15px]" />
        </Link>
      )
    }
  >
    <div className="flex flex-col gap-[12px]">
      <div
        role="tablist"
        aria-label="Feedback"
        className="flex gap-[4px] rounded-[10px] bg-[#fefefe] p-[3px]"
      >
        {[
          { id: 'give', label: FEEDBACK.tabs.give },
          { id: 'mine', label: FEEDBACK.tabs.mine },
        ].map((item) => {
          const active = item.id === tab;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange?.(item.id)}
              className={classNames(
                'flex-1 cursor-pointer rounded-[6px] border-0 px-[8px] py-[7px] whitespace-nowrap max-sm:px-[2px] font-sans text-[12px] leading-[20px] tracking-[0.2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                active
                  ? 'bg-white font-medium text-[#2a5730] shadow-[0_1px_2px_rgba(15,15,10,0.12)]'
                  : 'bg-transparent text-[#575755]'
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === 'mine' && mine ? (
        mine
      ) : (
        <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
          {FEEDBACK.pending.map((item) => {
            const withdrew = withdrewId === item.id;
            return (
              <li
                key={item.id}
                className={classNames(
                  'flex items-center gap-[10px] rounded-[10px] border border-solid border-[#e5e8e3] p-[12px]',
                  withdrew && 'opacity-60'
                )}
              >
                <span
                  aria-hidden="true"
                  className="flex size-[36px] shrink-0 items-center justify-center rounded-full font-sans text-[12px] leading-[20px] font-semibold tracking-[0.1px]"
                  style={{ background: item.bg, color: item.color }}
                >
                  {item.initials}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className="font-sans text-[12px] leading-[16px] font-medium tracking-[0.2px] text-[#111]">
                    {item.name}
                  </span>
                  <span
                    className={classNames(
                      'font-sans text-[12px] leading-[18px] tracking-[0.2px]',
                      item.overdue && !withdrew ? 'text-[#c0392b]' : 'text-[#575755]'
                    )}
                  >
                    {withdrew ? FEEDBACK_WITHDREW.text : item.due}
                  </span>
                </span>
                {withdrew ? (
                  <span className="inline-flex shrink-0 items-center gap-[4px] font-sans text-[12px] leading-[20px] font-medium text-[#575755]">
                    <img
                      src={dashIcons.feedbackClosedCheck}
                      alt=""
                      aria-hidden="true"
                      className="size-[12px]"
                    />
                    {FEEDBACK_WITHDREW.chip}
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => onLeaveFeedback?.(item.id)}
                    className="inline-flex h-[34px] shrink-0 cursor-pointer items-center rounded-[10px] border border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] whitespace-nowrap text-[#1c2a21] shadow-[0_2px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {FEEDBACK.action}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  </WidgetCard>
);

export default FeedbackWidget;
