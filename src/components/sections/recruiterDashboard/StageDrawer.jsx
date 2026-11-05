import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import Chip from '../../ui/Chip.jsx';
import Modal from '../../ui/Modal.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { STAGE_DRAWER } from './recruiterDashboardData.js';

/*
 * StageDrawer — the candidates of one funnel stage (Figma 10195:93923 "Drawer · Interview stage", D42, 758px card on `ui/Modal`):
 * a "Stage" chip, a Bricolage 30px title ("Interview · 8 candidates", the count in green), a subtitle, All / Scheduled / Interviewed filters,
 * one row per candidate (initials, name, role, a status chip, chevron) and "Open in Application Pipeline".
 * ⚠️ ASSUMPTION: Figma draws five rows, "+ 2 more" and an extra "Interviewed Oct 7" row below the button as hidden layers; only the five visible rows are built.
 * Props: stage (a PIPELINE stage), onClose.
 */
const StageDrawer = ({ stage, onClose }) => {
  const [tab, setTab] = useState('all');
  const rows = STAGE_DRAWER.candidates.filter((row) => tab === 'all' || row.status === tab);
  const heading = STAGE_DRAWER.title(stage.label, 8);
  return (
    <Modal
      isOpen
      onClose={onClose}
      size="md"
      ariaLabel={`${stage.label} stage candidates`}
      showClose={false}
      className="!bg-[#0b1a0f]/45 !backdrop-blur-none"
      contentClassName="!max-w-[758px] !rounded-[24px] p-[24px] shadow-[0_24px_64px_rgba(15,15,10,0.18)] max-sm:p-[16px]"
    >
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-start justify-between gap-[16px]">
          <div className="flex min-w-0 flex-col gap-[8px]">
            <Chip tone="mint" icon={dashIcons.drilldownStageTagPipeline} className="self-start">
              {STAGE_DRAWER.chip}
            </Chip>
            <h2 className="m-0 font-['Bricolage_Grotesque',sans-serif] text-[30px] leading-[36px] font-normal text-[#111] max-sm:text-[24px] max-sm:leading-[30px]">
              {heading.stage} · <span className="text-[#387440]">{heading.count}</span>
            </h2>
            <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
              {STAGE_DRAWER.subtitle(`${stage.label} ${stage.sub}`)}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close drawer"
            onClick={onClose}
            className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] border-0 bg-[#fffefc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <img src={dashIcons.dialogCloseX} alt="" aria-hidden="true" className="size-[16px]" />
          </button>
        </div>

        <div role="tablist" aria-label="Candidates" className="flex flex-wrap gap-[8px]">
          {STAGE_DRAWER.tabs.map((item) => {
            const active = item.id === tab;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={classNames(
                  'inline-flex h-[28px] cursor-pointer items-center rounded-full border border-solid px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                  active
                    ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#2a5730]'
                    : 'border-[#e5e8e3] bg-white text-[#111]'
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
          {rows.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-[12px] rounded-[12px] border border-solid border-[#e5e8e3] bg-white px-[16px] py-[12px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                <span
                  aria-hidden="true"
                  className="flex size-[36px] shrink-0 items-center justify-center rounded-full font-sans text-[12px] leading-[20px] font-semibold"
                  style={{ background: row.bg, color: row.color }}
                >
                  {row.initials}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className="font-sans text-[14px] leading-[24px] font-semibold text-[#111]">
                    {row.name}
                  </span>
                  <span className="font-sans text-[12px] leading-[20px] text-[#575755]">
                    {row.role}
                  </span>
                  <Chip
                    tone={row.status === 'interviewed' ? 'success' : 'amber'}
                    icon={
                      row.status === 'interviewed'
                        ? dashIcons.checkActive
                        : dashIcons.drilldownScheduledCalendar
                    }
                    className="self-start"
                  >
                    {row.when}
                  </Chip>
                </span>
                <img
                  src={dashIcons.drilldownRowChevron}
                  alt=""
                  aria-hidden="true"
                  className="size-[18px] shrink-0"
                />
              </button>
            </li>
          ))}
        </ul>

        <Link
          to="/recruiter/application-pipeline"
          className="inline-flex min-h-[44px] items-center justify-center gap-[8px] rounded-[10px] bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-white no-underline shadow-[0_3px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {STAGE_DRAWER.open}
          <img
            src={dashIcons.drilldownOpenPipelineArrow}
            alt=""
            aria-hidden="true"
            className="size-[16px]"
          />
        </Link>
      </div>
    </Modal>
  );
};

export default StageDrawer;
