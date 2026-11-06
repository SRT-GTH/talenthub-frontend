import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';

const log = debug('SiteCopySkeleton');

/*
 * SiteCopySkeleton — the loading state of the Site copy list (7.8.1j): the Pages card as seven skeleton rows (16 px square + a bar, p20, gap 14, #f8f8f4 r7) and the
 * editor card as eight bars with "Loading every page and section…" under them. role="status" / aria-busy for assistive tech; the bars do not animate (reduced-motion safe).
 */
const LEFT = [180, 240, 200, 260, 150, 220, 190];
const RIGHT = [
  [220, 22],
  [160, 12],
  [780, 44],
  [160, 12],
  [600, 44],
  [160, 12],
  [780, 44],
  [160, 12],
  [420, 44],
];

const Bar = ({ w, h }) => (
  <span
    aria-hidden="true"
    className="block max-w-full rounded-[7px] bg-[#f8f8f4]"
    style={{ width: w, height: h }}
  />
);

const SiteCopySkeleton = () => {
  useEffect(() => {
    log('render');
  }, []);
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="flex flex-col gap-[24px] lg:flex-row"
    >
      <p className="sr-only">
        Loading site copy… The pages and sections of every portal are loading, one moment please.
      </p>
      <div className="flex w-full flex-col gap-[14px] self-start rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[20px] lg:w-[min(420px,34%)] lg:shrink-0 xl:w-[420px]">
        {LEFT.map((w, i) => (
          <div key={i} className="flex items-center gap-[10px]">
            <span aria-hidden="true" className="size-[16px] shrink-0 rounded-[7px] bg-[#f8f8f4]" />
            <Bar w={w} h={14} />
          </div>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[18px] self-start rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(20px,2.2vw,28px)] max-lg:w-full">
        {RIGHT.map(([w, h], i) => (
          <Bar key={i} w={w} h={h} />
        ))}
        <p className="m-0 pt-[8px] font-sans text-[13px] leading-[16px] font-medium text-[#575755]">
          Loading every page and section…
        </p>
      </div>
    </div>
  );
};

export default SiteCopySkeleton;
