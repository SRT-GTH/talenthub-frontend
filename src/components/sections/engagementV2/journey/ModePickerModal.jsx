import { useEffect } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { MODE_PICKER } from './journeyData.js';
import { AiSparkIcon, CardArrowIcon, PencilEditIcon, UploadIcon } from './JourneyIcons.jsx';
import JourneyDialogShell from './JourneyDialogShell.jsx';

const log = debug('ModePickerModal');

const ICONS = { pencil: PencilEditIcon, ai: AiSparkIcon, upload: UploadIcon };

const Card = ({ card, onPick }) => {
  const Glyph = ICONS[card.icon];
  const hot = Boolean(card.popular);
  return (
    <button
      type="button"
      onClick={() => onPick(card.id)}
      className={classNames(
        'relative flex min-w-0 flex-1 cursor-pointer flex-col gap-[16px] rounded-[16px] border py-[20px] pl-[24px] pr-[16px] text-left font-sans',
        'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]',
        'playful:border-[1.5px] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
        'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
        hot
          ? 'border-[#387440] bg-white'
          : 'border-[rgba(28,42,33,0.1)] bg-[#fffefc] playful:border-[rgba(28,42,33,0.55)]'
      )}
    >
      {hot ? (
        <span className="absolute left-[183px] top-[-6px] flex rounded-[8px] border border-[rgba(28,42,33,0.1)] bg-[#387440] px-[10px] py-[4px] text-[8px] font-medium leading-[10px] tracking-[0.95px] text-white playful:border-[rgba(28,42,33,0.35)] max-lg:text-[12px] max-lg:leading-[14px] max-sm:left-auto max-sm:right-[16px]">
          {card.popular}
        </span>
      ) : null}
      <span
        className={classNames(
          'flex size-[62px] items-center justify-center rounded-[10px]',
          hot ? 'bg-[#ebf1ec]' : 'bg-[#f8f8f4]'
        )}
      >
        <Glyph className={classNames('size-[40px]', hot ? '' : 'text-[#737373]')} />
      </span>
      <span className="flex flex-col gap-[12px]">
        <span className="flex flex-col gap-[8px]">
          <span
            className={classNames(
              'flex w-fit whitespace-pre rounded-[5px] border px-[6px] py-[4px] text-[10px] font-medium leading-[16px] tracking-[0.2px] max-lg:text-[12px]',
              hot
                ? 'border-[#387440] bg-[#ebf1ec] text-[#387440]'
                : 'border-[#b5b5b5] bg-[#fefcf5] text-[#575755]'
            )}
          >
            {card.badge}
          </span>
          <span
            className={classNames(
              'whitespace-pre text-[21px] font-semibold leading-[26px] playful:font-heading',
              hot ? 'text-[#387440]' : 'text-[#1c2a21]'
            )}
          >
            {card.title}
          </span>
        </span>
        <span className="text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#737373]">
          {card.text}
        </span>
      </span>
      <span
        className={classNames(
          'mt-auto flex items-center justify-between border-t border-[#f1f5f9] pt-[8px] text-[12px] font-medium leading-[14px]',
          hot ? 'text-[#387440]' : 'text-[#737373]'
        )}
      >
        {card.action}
        <CardArrowIcon className="size-[16px]" />
      </span>
    </button>
  );
};

/*
 * ModePickerModal — "How would you like to add your details" (Figma J-03; also opened by the nav's gold "Change input mode").
 * onPick(id) with id 'type' | 'chat' | 'cv'; onClose.
 */
const ModePickerModal = ({ onClose, onPick }) => {
  useEffect(() => {
    log('mount');
  }, []);
  const c = MODE_PICKER;
  return (
    <JourneyDialogShell
      labelId="mode-picker-title"
      onClose={onClose}
      className="max-w-[1129px] rounded-[24px] border-[3px] border-[#c1d4c4] bg-white px-[clamp(16px,5.1vw,88px)] pb-[clamp(20px,4.9vw,84px)] pt-[clamp(24px,4.6vw,80px)] shadow-[0_5px_11px_-2px_rgba(27,36,44,0.06),0_2px_2px_-1px_rgba(27,35,44,0.04)] playful:border-[3px] playful:shadow-[0_8px_16px_rgba(27,36,44,0.06),0_2px_2px_rgba(27,35,44,0.04)]"
      closeClass="right-[37px] top-[28px] size-[28px] bg-[#ebf1ec] max-sm:right-[12px] max-sm:top-[12px]"
    >
      <div className="mx-auto flex max-w-[951px] flex-col gap-[20px] font-sans">
        <div className="mx-auto flex max-w-[551px] flex-col items-center gap-[16px] text-center">
          <span className="inline-flex items-center gap-[6px] rounded-[6px] border border-[#c1d4c4] bg-[#ebf1ec] px-[32px] py-[10px] text-[12px] font-normal leading-[18px] tracking-[0.2px] text-[#999999] max-sm:px-[16px]">
            <span className="size-[8px] rounded-full border-[1.5px] border-[#1d7c4d] bg-[#c1d4c4]" />
            {c.chip}
          </span>
          <div className="flex flex-col gap-[4px]">
            <h2
              id="mode-picker-title"
              className="m-0 whitespace-pre-line text-[29px] font-semibold leading-[35px] tracking-[-0.58px] text-[#1c2a21] playful:font-heading max-sm:text-[24px] max-sm:leading-[29px]"
            >
              {c.title}
            </h2>
            <p className="m-0 text-[12px] font-normal leading-[18px] tracking-[0.2px] text-[#959592]">
              {c.lede}
            </p>
          </div>
        </div>
        <div className="flex gap-[30px] py-[8px] max-lg:flex-col max-lg:gap-[16px]">
          {c.cards.map((card) => (
            <Card key={card.id} card={card} onPick={onPick} />
          ))}
        </div>
        <div className="flex items-center justify-center rounded-[10px] border border-[#c1d4c4] bg-[#f8f8f4] px-[20px] py-[16px] text-center text-[12px] font-medium leading-[20px] tracking-[0.2px] text-[#387440]">
          {c.note}
        </div>
      </div>
    </JourneyDialogShell>
  );
};

export default ModePickerModal;
