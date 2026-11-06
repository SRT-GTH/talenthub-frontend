import SkeletonBlock from '../../ui/SkeletonBlock.jsx';

/*
 * DashboardSkeleton — the dashboard while an organisation switch loads (Figma 10050:61097, D03 "Switching org – loading (Hubtel Ltd)"):
 * hero (eyebrow, headline, line, four stat tiles), then a wide card of three tiles + three rows, and a column of three cards.
 * Marked busy for assistive tech; the live region says what is loading.
 */
const Card = ({ className, children }) => (
  <div
    className={`rounded-[24px] border border-solid border-[#e5e8e3] bg-white p-[24px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)] max-sm:p-[16px] ${className ?? ''}`}
  >
    {children}
  </div>
);

const DashboardSkeleton = ({ org }) => (
  <div aria-busy="true" className="flex flex-col gap-[16px]">
    <p role="status" className="sr-only">
      Switching to {org}…
    </p>
    <Card className="flex flex-col gap-[14px] rounded-[28px] p-[32px]">
      <SkeletonBlock className="h-[12px] w-[148px] rounded-[6px]" />
      <SkeletonBlock className="h-[40px] w-[min(520px,100%)] rounded-[10px]" />
      <SkeletonBlock className="h-[12px] w-[min(790px,100%)] rounded-[6px]" />
      <div className="mt-[6px] grid grid-cols-4 gap-[12px] max-sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock
            key={i}
            className="h-[76px] max-w-[150px] rounded-[18px] max-sm:max-w-none"
          />
        ))}
      </div>
    </Card>
    <div className="grid grid-cols-[minmax(0,900fr)_minmax(0,413fr)] gap-[16px] max-lg:grid-cols-1">
      <div className="flex flex-col gap-[16px]">
        <Card className="flex flex-col gap-[16px]">
          <SkeletonBlock className="h-[16px] w-[220px] rounded-[6px]" />
          <div className="grid grid-cols-3 gap-[16px] max-sm:grid-cols-1">
            {[0, 1, 2].map((i) => (
              <SkeletonBlock key={i} className="h-[220px] rounded-[16px]" />
            ))}
          </div>
        </Card>
        <Card className="flex flex-col gap-[12px]">
          <SkeletonBlock className="h-[16px] w-[200px] rounded-[6px]" />
          {[0, 1, 2].map((i) => (
            <SkeletonBlock key={i} className="h-[44px] rounded-[12px]" />
          ))}
        </Card>
      </div>
      <div className="flex flex-col gap-[16px]">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="flex flex-col gap-[12px]">
            <SkeletonBlock className="h-[16px] w-[140px] rounded-[6px]" />
            <SkeletonBlock className="h-[120px] rounded-[12px]" />
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
