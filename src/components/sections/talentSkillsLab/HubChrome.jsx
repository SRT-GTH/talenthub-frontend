import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { HubStarIcon } from './HubIcons.jsx';
import { LabArrowLeftIcon } from './LabPlayIcons.jsx';
import { HEADING, HubButton, HubChip, HubSticker } from './HubParts.jsx';
import { useXpWord } from './hubShared.js';
import { HUB_COPY } from './skillsLabData.js';

const log = debug('HubChrome');

/*
 * HubHeader — "Skills Lab" title + sticker, subtitle, and (returning talent only) the "240 XP from labs" chip and
 * "How verification works" button (modal=how). Figma SL-01 7832:8116.
 * Props: sticker (string | null), subtitle, xp (number | null — hides the right side when null), onHow.
 */
export const HubHeader = ({ sticker, subtitle, xp, onHow }) => {
  const word = useXpWord();
  const navigate = useNavigate();
  // Tester feedback F5: no way back. Go back to where the talent came from (in-app history), else to /home.
  const goBack = () => {
    const inApp = (window.history.state?.idx ?? 0) > 0;
    log('back', { inApp });
    if (inApp) navigate(-1);
    else navigate('/home');
  };
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-[24px] gap-y-[12px]">
      <div className="flex min-w-0 flex-col gap-[3px]">
        <button
          type="button"
          onClick={goBack}
          className="mb-[6px] inline-flex min-h-[24px] w-fit cursor-pointer items-center gap-[6px] font-sans text-[15px] leading-[18px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <LabArrowLeftIcon className="size-[18px]" />
          Back
        </button>
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1
            className={classNames(
              HEADING,
              'text-[clamp(26px,1.97vw,34px)] leading-[1.2] tracking-[-0.02em]'
            )}
          >
            {HUB_COPY.title}
          </h1>
          {sticker ? <HubSticker>{sticker}</HubSticker> : null}
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959] max-sm:text-[14px] max-sm:leading-[20px]">
          {subtitle}
        </p>
      </div>
      {xp !== null && xp !== undefined ? (
        <div className="flex flex-wrap items-center gap-[10px]">
          <HubChip
            tone="statFocused"
            icon={<HubStarIcon className="size-[14px] text-white playful:text-[#387440]" />}
          >
            {`${xp} ${word} from labs`}
          </HubChip>
          <HubButton tone="secondary" onClick={onHow}>
            How verification works
          </HubButton>
        </div>
      ) : null}
    </div>
  );
};

/*
 * HubTabs — All labs / In progress / Verified / History / Games. `tabs` = [{ id, label, count? }].
 * The selected tab gets a 2.5px green underline + green label; the count pill is amber on the selected tab only
 * when the Figma frame draws it that way (All labs, Verified), otherwise the quiet green pill.
 */
export const HubTabs = ({ tabs, tab, onTab, disabled }) => (
  <nav
    aria-label="Skills Lab sections"
    className="no-scrollbar max-lg:[mask-image:linear-gradient(to_right,transparent,#000_12px,#000_calc(100%-24px),transparent)] flex gap-[4px] overflow-x-auto border-0 border-b border-solid border-[rgba(28,42,33,0.1)]"
  >
    {tabs.map((t) => {
      const on = t.id === tab;
      return (
        <button
          key={t.id}
          type="button"
          disabled={disabled}
          aria-current={on ? 'page' : undefined}
          aria-label={t.count !== undefined ? `${t.label}, ${t.count}` : t.label}
          onClick={() => {
            log('tab ->', t.id);
            onTab(t.id);
          }}
          className={classNames(
            '-mb-px flex shrink-0 cursor-pointer items-center gap-[8px] whitespace-nowrap border-0 border-b-[2.5px] border-solid bg-transparent px-[14px] py-[10px] font-sans text-[15px] leading-[18px] disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#387440] max-lg:min-h-[44px]',
            on
              ? 'border-b-[#387440] font-semibold text-[#387440]'
              : 'border-b-transparent font-medium text-[#595959]'
          )}
        >
          <span aria-hidden="true">{t.label}</span>
          {t.count !== undefined ? (
            <span
              aria-hidden="true"
              data-count={t.count}
              className={classNames(
                'inline-flex h-[16px] min-w-[20px] items-center justify-center rounded-full px-[7px] font-sans text-[11.5px] font-bold leading-[14px] after:content-[attr(data-count)] max-lg:h-[18px] max-lg:text-[12px]',
                on ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2a5730]'
              )}
            />
          ) : null}
        </button>
      );
    })}
  </nav>
);
