import { debug } from '../../../../utils/debug.js';

const log = debug('GanttChartVisual');

export default function GanttChartVisual({ visual }) {
  log('rendering gantt chart, tasks:', visual.tasks?.length);

  const { days, tasks, unplacedTasks, conflictMessage } = visual;
  const totalDays = days.length;

  return (
    <div className="bg-white border border-[#e8e8e4] rounded-[12px] p-[clamp(16px,2vw,24px)] mb-[clamp(14px,1.8vw,26px)]">
      {/* Day headers */}
      <div className="flex">
        <div className="w-[clamp(80px,10vw,120px)] shrink-0" />
        <div className="flex-1 flex">
          {days.map((day, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[#959592] text-[10px] font-sans font-medium">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Task rows */}
      <div className="flex flex-col gap-[6px] mt-[8px]">
        {tasks.map((task, i) => (
          <div key={i} className="flex items-center min-h-[28px]">
            <div className="w-[clamp(80px,10vw,120px)] shrink-0 pr-[8px]">
              <span className="text-[#575755] text-[11px] font-sans leading-none">{task.name}</span>
            </div>
            <div className="flex-1 relative h-[24px]">
              {/* Grid lines */}
              {days.map((_, di) => (
                <div
                  key={di}
                  className="absolute top-0 bottom-0 border-l border-[#f0f0f0]"
                  style={{ left: `${(di / totalDays) * 100}%` }}
                />
              ))}
              {/* Task bar */}
              {task.start !== null && task.start !== undefined && (
                <div
                  className="absolute top-[2px] h-[20px] rounded-[4px] flex items-center px-[8px] transition-all"
                  style={{
                    left: `${(task.start / totalDays) * 100}%`,
                    width: `${(task.duration / totalDays) * 100}%`,
                    backgroundColor: task.conflict
                      ? '#c0392b'
                      : task.placeholder
                        ? '#f0f0ec'
                        : task.color,
                    opacity: task.placeholder ? 0.6 : 0.85,
                    border: task.placeholder
                      ? '1px dashed #c8951a'
                      : task.conflict
                        ? '1px solid #a5311f'
                        : 'none',
                  }}
                >
                  <span
                    className="text-[9px] font-sans font-medium whitespace-nowrap"
                    style={{
                      color: task.placeholder ? '#c8951a' : task.conflict ? '#fff' : '#fff',
                    }}
                  >
                    {task.label}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Conflict warning */}
      {conflictMessage && (
        <div className="mt-[12px] bg-[#fff1f2] border border-[#ebc2bd] rounded-[6px] px-[12px] py-[8px]">
          <span className="text-[#c0392b] text-[10px] font-sans font-medium">
            {conflictMessage}
          </span>
        </div>
      )}

      {/* Unplaced tasks */}
      {unplacedTasks && unplacedTasks.length > 0 && (
        <div className="mt-[16px]">
          <p className="text-[#888] text-[10px] font-sans font-bold uppercase tracking-[0.2px] leading-[16px] mb-[8px]">
            Unplaced — click to schedule
          </p>
          <div className="flex gap-[8px] flex-wrap">
            {unplacedTasks.map((task, i) => (
              <div
                key={i}
                className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px] border border-dashed border-[#e8e8e4] bg-[#faf9f6] cursor-default"
              >
                <span className="text-[#575755] text-[11px] font-sans">{task.name}</span>
                <span className="text-[#959592] text-[9px] font-sans">— {task.constraint}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
