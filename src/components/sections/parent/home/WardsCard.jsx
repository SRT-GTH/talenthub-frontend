import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import HomeCardHead from './HomeCardHead.jsx';
import allWardsIcon from '../../../../assets/parent/ward-user.svg';
import { WARDS, WARDS_INTRO } from './data/parentHomeData.js';

const log = debug('WardsCard');

/*
 * WardsCard — Figma "Your wards" 10027:1728 (the layer is named "For you · Top matches"): white card r24 pad 24, shadow 0 5px 8.5px rgba(18,38,20,.03).
 * Three ward cards r20 pad 18 (277 wide, gap 16): photo 44 r12 + age 27/600 #387440, name 16/600, relation 13 #595959, two 22px chips, CTA.
 * The first ward (Abena) is the focused card (#f5f9f5 + primary 3D button); the others are white with the light-green button.
 * Props: wards (defaults to WARDS).
 * ⚠️ ASSUMPTION: cards wrap with auto-fit (min 240px) instead of fixed 277px columns.
 */
// Open Abena / Open Elliot go to the ward page; Remind Kwesi resends the request (the "Request sent" screen of the link flow).
const CTA_TO = {
  abena: '/parent/wards/abena',
  elliot: '/parent/wards/elliot',
  kwesi: '/parent/link-ward?step=sent',
};

const CHIP_TONES = {
  green: 'bg-[#ebf1ec] text-[#387440]',
  amber: 'bg-[#faf4e8] text-[#785910]',
  grey: 'bg-[#f8f8f4] text-[#595959]',
};

const WardCard = ({ ward }) => (
  <li
    className={`flex min-w-0 flex-col gap-[12px] rounded-[20px] border border-solid p-[18px] ${
      ward.primary
        ? 'border-[#1c2a21]/10 bg-[#f5f9f5] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)]'
        : 'border-[#e7e7e7] bg-white'
    }`}
  >
    <div className="flex items-center justify-between gap-[10px]">
      <img
        src={ward.photo}
        alt=""
        width="44"
        height="44"
        className="size-[44px] shrink-0 rounded-[12px] object-cover"
      />
      <div className="flex flex-col items-end text-right">
        <span className="font-sans text-[27px] leading-[1.2] font-semibold text-[#387440]">
          {ward.age}
        </span>
        <span className="font-sans text-[12px] leading-normal font-medium text-[#595959]">
          years old
        </span>
      </div>
    </div>
    <h3 className="m-0 font-sans text-[16px] leading-normal font-semibold text-[#1c2a21]">
      {ward.name}
    </h3>
    <p className="m-0 font-sans text-[13px] leading-normal text-[#595959]">{ward.relation}</p>
    <div className="flex gap-[6px]">
      {ward.chips.map((c) => (
        <span
          key={c.label}
          className={`rounded-full px-[10px] py-[4px] font-sans text-[12px] leading-normal font-semibold whitespace-nowrap ${CHIP_TONES[c.tone]}`}
        >
          {c.label}
        </span>
      ))}
    </div>
    <div className="mt-auto">
      {ward.primary ? (
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          to={CTA_TO[ward.id]}
          onClick={() => log('ward cta:', ward.id)}
        >
          {ward.cta}
        </Button>
      ) : (
        <Button
          variant="tertiary-subtle"
          size="lg"
          className="w-full !py-[14px] !text-[#165d3a]"
          to={CTA_TO[ward.id]}
          onClick={() => log('ward cta:', ward.id)}
        >
          {ward.cta}
        </Button>
      )}
    </div>
  </li>
);

const WardsCard = ({ wards = WARDS }) => {
  log('render, wards:', wards.length);
  return (
    <section
      aria-labelledby="parent-wards-title"
      className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[24px] shadow-[0_5px_8.5px_rgba(18,38,20,0.03)]"
    >
      <HomeCardHead
        title={
          <span id="parent-wards-title" className="text-[22px] leading-[1.25]">
            Your <span className="text-[#387440]">wards</span>
          </span>
        }
        linkLabel="All wards"
        linkIcon={allWardsIcon}
        to="/parent/wards"
        onLink={() => log('All wards')}
      />
      <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">{WARDS_INTRO}</p>
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[16px] p-0">
        {wards.map((w) => (
          <WardCard key={w.id} ward={w} />
        ))}
      </ul>
    </section>
  );
};

export default WardsCard;
