import { debug } from '../../../../../utils/debug.js';
import stallScene from '../../../../../assets/talent-games-v2/makola-haggle/makola-market-stall-scene.webp';
import { ServerTagIcon } from '../serverGame/ServerGameIcons.jsx';

const log = debug('MakolaStage');

/*
 * MakolaStage — the market picture with its three notes (Figma "Stage": 1040x312, r22.6, hairline; Auntie's speech bubble
 * 396x97 at 26,26 · "You said" bubble 209x38 at the top right · the gold "Item tag" 242x68 turned −3° at the bottom right).
 * From `lg` the notes are laid over the picture in % of the stage; below that they stack over a taller picture.
 *   round  { auntie, you, tag: { title, sub } }
 */
const MakolaStage = ({ round }) => {
  log('render', { tag: round.tag.sub });
  return (
    <div className="relative flex min-h-[340px] flex-col gap-[12px] overflow-hidden rounded-[22.6px] border border-solid border-[rgba(28,42,33,0.12)] bg-white p-[14px] lg:block lg:aspect-[1040/312] lg:min-h-0 lg:p-0">
      <img
        src={stallScene}
        alt="Auntie Akos at her kente stall in Makola market, talking to you"
        draggable="false"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="relative max-w-[396px] rounded-[18.84px_18.84px_18.84px_3.77px] border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[18.84px] py-[15.07px] lg:absolute lg:top-[8.3%] lg:left-[2.5%] lg:w-[38.1%] lg:max-w-none">
        <p className="m-0 font-sans text-[11px] leading-[13px] font-bold text-[#387440] max-lg:text-[12px]">
          AUNTIE AKOS
        </p>
        <p className="mt-[5.65px] mb-0 font-sans text-[16px] leading-[23px] font-medium text-[#1c2a21]">
          {round.auntie}
        </p>
      </div>
      <p className="relative m-0 self-end rounded-[15.07px_3.77px_15.07px_15.07px] border-[1.41px] border-solid border-[#1c2a21] bg-[#387440] px-[15.07px] py-[9.42px] font-sans text-[13.19px] leading-[16px] font-semibold text-white lg:absolute lg:top-[10.9%] lg:right-[3.3%] lg:self-auto">
        {round.you}
      </p>
      <div className="relative mt-auto flex w-fit max-w-full -rotate-[3deg] items-center gap-[9.42px] self-end rounded-[15.07px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[15.07px] py-[11.3px] lg:absolute lg:right-[3.1%] lg:bottom-[9.3%] lg:mt-0 lg:self-auto">
        <ServerTagIcon className="size-[20px] shrink-0 text-[#1c2a21]" />
        <span className="flex min-w-0 flex-col font-sans text-[#1c2a21]">
          <span className="text-[13.19px] leading-[16px] font-semibold">{round.tag.title}</span>
          <span className="text-[12.25px] leading-[15px] font-normal max-lg:text-[12.25px]">
            {round.tag.sub}
          </span>
        </span>
      </div>
    </div>
  );
};

export default MakolaStage;
