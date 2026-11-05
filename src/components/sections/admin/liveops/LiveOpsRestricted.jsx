import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import AgencyButton from '../../agency/AgencyButton.jsx';
import emptyArt from '../../../../assets/admin/accounts-empty-art.svg';
import {
  AdminArrowRightIcon,
  AdminPlusIcon,
  AdminSparkIcon,
  AdminUserIcon,
} from '../adminIcons.jsx';
import { RESTRICTED } from './data/adminLiveOpsData.js';

const log = debug('LiveOpsRestricted');

/*
 * LiveOpsRestricted — "Live ops isn’t available for your role" (Figma 7.3.3c 8640:420507): title 34/41 600 + "Restricted" sticker · 16/24 sub copy · the empty card of
 * the queue screens (r28: spot art, headline, body, three suggestion rows, a green and a white button). Shown to every role that is not a Senior / Super Admin.
 * The queue counts the frame draws under the first two rows ("11 pending", "42 new today") are not in the backend: left out. ⚠️ ASSUMPTION: "Ask for access" has no
 * endpoint (nothing is sent): it only logs.
 */

const ICONS = { plus: AdminPlusIcon, spark: AdminSparkIcon, user: AdminUserIcon };

const LiveOpsRestricted = () => {
  const navigate = useNavigate();
  log('mount', { steps: RESTRICTED.steps.length });

  return (
    <div className="flex flex-col gap-[24px] pt-[4px]">
      <header className="flex flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 font-sans text-[clamp(26px,2.4vw,34px)] leading-[1.2] font-semibold text-[#1c2a21]">
            {RESTRICTED.heading}
          </h1>
          <span className="inline-flex h-[26px] items-center rounded-full bg-[#ebf1ec] px-[11px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
            {RESTRICTED.sticker}
          </span>
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#737373]">
          {RESTRICTED.subtitle}
        </p>
      </header>

      <section
        aria-label={RESTRICTED.title}
        className="flex flex-col items-center gap-[14px] rounded-[28px] border border-solid border-[#e1eae2] bg-white px-[clamp(16px,3vw,40px)] py-[36px] text-center"
      >
        <img src={emptyArt} alt="" draggable="false" className="size-[150px]" />
        <h2 className="m-0 font-sans text-[clamp(24px,2.4vw,34px)] leading-[1.2] font-semibold text-[#1c2a21]">
          {RESTRICTED.title}
        </h2>
        <p className="m-0 max-w-[560px] font-sans text-[15px] leading-[21px] text-[#595959]">
          {RESTRICTED.body}
        </p>
        <ul className="m-0 flex w-full max-w-[560px] list-none flex-col gap-[4px] overflow-hidden rounded-[18px] border border-solid border-[#e1eae2] bg-[#f8f8f4] p-0 text-left">
          {RESTRICTED.steps.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <li key={s.id} className={i > 0 ? 'border-t border-solid border-[#e1eae2]' : ''}>
                <button
                  type="button"
                  onClick={() => {
                    log('suggestion', s.id);
                    if (s.to) navigate(s.to);
                    else log('ask for access: no endpoint, nothing sent');
                  }}
                  className="flex min-h-[24px] w-full cursor-pointer items-center gap-[12px] border-0 bg-transparent px-[16px] py-[13px] text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]"
                >
                  <span className="grid size-[32px] shrink-0 place-items-center rounded-[10px] border border-solid border-[#1c2a21]/10 bg-[#ebf1ec] text-[#387440]">
                    <Icon className="size-[15px]" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-[4px]">
                    <span className="font-sans text-[14.5px] leading-[17px] font-semibold text-[#1c2a21]">
                      {s.title}
                    </span>
                    {s.meta ? (
                      <span className="font-sans text-[12.5px] leading-[15px] text-[#737373] max-lg:text-[12px]">
                        {s.meta}
                      </span>
                    ) : null}
                  </span>
                  <AdminArrowRightIcon className="size-[16px] shrink-0 text-[#1c2a21]" />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap items-center justify-center gap-[10px] pt-[6px]">
          <button
            type="button"
            onClick={() => navigate(RESTRICTED.primaryTo)}
            className="inline-flex h-[48px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {RESTRICTED.primary}
          </button>
          <AgencyButton
            size="md"
            className="!h-[48px] !px-[18px] !text-[16px] !font-bold"
            onClick={() => navigate(RESTRICTED.secondaryTo)}
          >
            {RESTRICTED.secondary}
          </AgencyButton>
        </div>
      </section>
    </div>
  );
};

export default LiveOpsRestricted;
