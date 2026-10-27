import { classNames } from '../../../../utils/classNames.js';
import spinner from '../../../../assets/parent/spinner.svg';

/*
 * ParentHomeLoading — PD-05 "Parent home · Loading" (Figma 10047:147949): the skeleton while the wards load. `ParentLoadingSidebar` is "Sidebar · loading" (280 wide: a profile card with a 72 circle and
 * three bars, a 44 bar, seven 20 bars) and `ParentLoadingMain` the Hero (p36, r28: 160 / 520 / 620 bars and four 150 x 96 blocks) + Columns (left 912: Matches card with three 277 x 220 blocks and an
 * Applications card with three 864 x 64 rows; right 448: three cards with a 160 bar and a 404 block of 180 / 160 / 120) + the "Getting Abena and Elliot's updates…" note under the top bar.
 * Skeleton blocks shimmer (styles/parent.css, `.pd-skeleton`). Role="status" with the note as its label.
 */
const Sk = ({ className }) => (
  <span aria-hidden="true" className={classNames('pd-skeleton block', className)} />
);

const CARD =
  'rounded-[24px] border border-solid border-[#e7e7e7] bg-white drop-shadow-[0_5px_8.5px_rgba(18,38,20,0.03)]';

export const ParentLoadingSidebar = ({ className }) => (
  <aside
    aria-hidden="true"
    className={classNames(
      'flex w-[303px] shrink-0 flex-col gap-[12px] overflow-hidden pt-[22px] pr-[13px] pl-[10px]',
      className
    )}
  >
    <div
      className={classNames(
        CARD,
        'flex flex-col items-center gap-[12px] px-[20px] pt-[22px] pb-[20px]'
      )}
    >
      <Sk className="size-[72px] rounded-[36px]" />
      <Sk className="h-[14px] w-[140px] rounded-[8px]" />
      <Sk className="h-[10px] w-[180px] rounded-[8px]" />
      <Sk className="h-[64px] w-full max-w-[240px] rounded-[14px]" />
    </div>
    <Sk className="h-[44px] w-full rounded-[12px]" />
    {Array.from({ length: 7 }).map((_, i) => (
      <Sk key={i} className="h-[20px] w-[220px] max-w-full rounded-[6px]" />
    ))}
  </aside>
);

const SideCard = ({ h }) => (
  <div className={classNames(CARD, 'flex flex-col gap-[12px] p-[22px]')}>
    <Sk className="h-[18px] w-[160px] rounded-[8px]" />
    <Sk className="w-full rounded-[14px]" style={{ height: h }} />
  </div>
);

export const ParentLoadingMain = () => (
  <div
    role="status"
    aria-label="Getting Abena and Elliot’s updates"
    className="mx-auto flex w-full max-w-[1376px] flex-col gap-[16px]"
  >
    <div
      className={classNames(
        CARD,
        'flex flex-col gap-[14px] rounded-[28px] p-[clamp(20px,2.08vw,36px)]'
      )}
    >
      <Sk className="h-[10px] w-[160px] rounded-[8px]" />
      <Sk className="h-[44px] w-[520px] max-w-full rounded-[10px]" />
      <Sk className="h-[14px] w-[620px] max-w-full rounded-[8px]" />
      <div className="flex flex-wrap gap-[12px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <Sk key={i} className="h-[96px] w-[150px] rounded-[18px]" />
        ))}
      </div>
    </div>
    <div className="flex items-start gap-[16px] max-xl:flex-col">
      <div className="flex min-w-0 flex-1 flex-col gap-[16px] max-xl:w-full xl:max-w-[912px]">
        <div className={classNames(CARD, 'flex flex-col gap-[16px] p-[24px]')}>
          <Sk className="h-[20px] w-[220px] rounded-[8px]" />
          <div className="flex gap-[16px] max-md:flex-col">
            {Array.from({ length: 3 }).map((_, i) => (
              <Sk key={i} className="h-[220px] min-w-0 flex-1 rounded-[20px]" />
            ))}
          </div>
        </div>
        <div className={classNames(CARD, 'flex flex-col gap-[12px] p-[24px]')}>
          <Sk className="h-[20px] w-[200px] rounded-[8px]" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Sk key={i} className="h-[64px] w-full rounded-[16px]" />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-[16px] xl:w-[448px] xl:shrink-0">
        <SideCard h={180} />
        <SideCard h={160} />
        <SideCard h={120} />
      </div>
    </div>
  </div>
);

// The "Getting Abena and Elliot's updates…" pill under the top bar (Figma 10047:148025, left 904.5).
export const ParentLoadingNote = () => (
  <div className="absolute top-[78px] left-[52.34%] z-30 flex items-center gap-[8px] rounded-[100px] border border-solid border-[rgba(28,42,33,0.1)] bg-white px-[14px] py-[10px] max-xl:left-1/2 max-xl:-translate-x-1/2">
    <span className="relative block size-[16px] shrink-0 motion-safe:animate-spin">
      <img src={spinner} alt="" className="absolute top-[2.42%] left-0 block w-full max-w-none" />
    </span>
    <span className="font-sans text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#1c2a21]">
      Getting Abena and Elliot’s updates…
    </span>
  </div>
);
