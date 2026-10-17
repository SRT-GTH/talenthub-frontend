import { useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import { LIFT, DISPLAY, Sticker } from './TabsParts.jsx';
import { useHomeLayout } from './TabsHomeLayoutStore.js';
import { EDIT_BANNER, ADD_CARD_TRAY, EDIT_CHROME } from './talentHomeTabsData.js';
import {
  EditBannerDragHandleIcon,
  EditCardDragHandleIcon,
  EditCardHideEyeOffIcon,
  EditCardShowEyeIcon,
  AddCardPlusIcon,
  AddCardVerifiedSkillsShieldIcon,
  AddCardPersonalityLightbulbIcon,
  AddCardProfileCompletenessChartIcon,
} from '../../shared/assets.jsx';

const log = debug('EditHomePanel');

/*
 * EditHomePanel — HM-05 "Edit home (customise)". Figma Playful 7747:206563 / Focused 8097:9899.
 * Figma shows the whole home with edit chrome. The cards belong to Core, so this file exports
 * the three edit pieces + the shared store hook and the default panel stacks banner + tray:
 *   <EditHomeBanner home />   — top of the body ("Editing your home", Reset / Done)
 *   <HomeCardChrome id>       — wrap each reorderable card (dashed outline, Drag | Hide/Show,
 *                               "Hidden from your home" ghost, HTML5 drag + ↑/↓ on the Drag button)
 *   <EditHomeTray />          — bottom ("Add a card"; available + user-hidden cards)
 * State: TabsHomeLayoutStore.js (mock; swap for an API). Page wiring is listed in the report.
 */

const TRAY_ICONS = {
  shield: AddCardVerifiedSkillsShieldIcon,
  bulb: AddCardPersonalityLightbulbIcon,
  chart: AddCardProfileCompletenessChartIcon,
};

export const EditHomeBanner = ({ home }) => {
  const layout = useHomeLayout();
  return (
    <section
      aria-label={EDIT_BANNER.title}
      className={classNames(
        'flex flex-wrap items-center gap-x-[14px] gap-y-[12px] rounded-[18px] bg-[#f7efdd] py-[14px] pl-[clamp(14px,1.5vw,20px)] pr-[16px] playful:bg-[#ffd86b]',
        LIFT
      )}
    >
      <EditBannerDragHandleIcon className="size-[22px] shrink-0" />
      <div className="flex min-w-[200px] flex-1 flex-col gap-[2px] text-[#1c2a21]">
        <h2 className="text-[18px] font-bold leading-normal">{EDIT_BANNER.title}</h2>
        <p className="text-[14px] font-medium leading-normal">{EDIT_BANNER.body}</p>
      </div>
      <Button
        variant="tertiary-subtle"
        size="md"
        className="!px-[34px] !py-[14px] max-sm:!px-[20px]"
        onClick={() => {
          log('reset to default');
          layout.reset();
        }}
      >
        {EDIT_BANNER.reset}
      </Button>
      <Button
        size="md"
        onClick={() => {
          log('done');
          home.update({ edit: false });
        }}
      >
        {EDIT_BANNER.done}
      </Button>
    </section>
  );
};

/* Edit controls pill: [Drag] [Hide|Show]. */
const EditControls = ({ id, hidden, layout, onDragKey }) => (
  <div
    className={classNames(
      'absolute right-[17px] top-[-16px] z-[2] flex items-center gap-[2px] rounded-full bg-white p-[4px]',
      LIFT
    )}
  >
    <button
      type="button"
      onKeyDown={onDragKey}
      className="flex cursor-grab items-center gap-[4px] rounded-full py-[6px] pl-[8px] pr-[10px] text-[12px] font-semibold text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-brand-green"
    >
      <EditCardDragHandleIcon className="size-[14px]" />
      {EDIT_CHROME.drag}
    </button>
    <button
      type="button"
      onClick={() => (hidden ? layout.show(id) : layout.hide(id))}
      className="flex cursor-pointer items-center gap-[4px] rounded-full py-[6px] pl-[8px] pr-[10px] text-[12px] font-semibold text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-brand-green"
    >
      {hidden ? (
        <EditCardShowEyeIcon className="h-[13.3px] w-[14px]" />
      ) : (
        <EditCardHideEyeOffIcon className="size-[14px]" />
      )}
      {hidden ? EDIT_CHROME.show : EDIT_CHROME.hide}
    </button>
  </div>
);

export const HomeCardChrome = ({ id, editing, className, children }) => {
  const layout = useHomeLayout();
  const [moving, setMoving] = useState(false);
  const card = layout.cards.find((c) => c.id === id);
  if (!card || card.state === 'available') return null;
  const hidden = card.state === 'hidden';
  if (!editing) return hidden ? null : children;
  const onDragKey = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      layout.moveBy(id, e.key === 'ArrowUp' ? -1 : 1);
    }
  };
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'move';
        setMoving(true);
      }}
      onDragEnd={() => setMoving(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        layout.move(e.dataTransfer.getData('text/plain'), id);
      }}
      className={classNames(
        'relative rounded-[26px] border border-dashed border-[#387440] p-[3px]',
        hidden ? 'opacity-60' : null,
        className
      )}
    >
      <div className={hidden ? 'pointer-events-none select-none' : undefined} aria-hidden={hidden}>
        {children}
      </div>
      <EditControls id={id} hidden={hidden} layout={layout} onDragKey={onDragKey} />
      {hidden ? (
        <span className="absolute left-[20px] top-[-14px] z-[2] inline-flex h-[32px] items-center whitespace-nowrap rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold text-[#595959]">
          {EDIT_CHROME.hiddenChip}
        </span>
      ) : null}
      {moving ? (
        <Sticker rotate="-4deg" className="absolute left-[20px] top-[-14px] z-[3]">
          {EDIT_CHROME.moving}
        </Sticker>
      ) : null}
    </div>
  );
};

export const EditHomeTray = () => {
  const layout = useHomeLayout();
  return (
    <section
      aria-labelledby="eh-tray"
      className="flex flex-col gap-[12px] rounded-[20px] border border-dashed border-[#c1d4c4] bg-white p-[clamp(14px,1.5vw,20px)]"
    >
      <div className="flex flex-wrap items-center gap-[8px] whitespace-nowrap font-semibold">
        <h2
          id="eh-tray"
          className={classNames('text-[19px] leading-[1.25] text-[#1c2a21]', DISPLAY)}
        >
          {ADD_CARD_TRAY.title}
        </h2>
        <span className="text-[12px] text-[#595959]">{ADD_CARD_TRAY.note(layout.tray.length)}</span>
      </div>
      <ul className="flex flex-wrap items-center gap-[24px] playful:gap-[10px]">
        {layout.tray.map((c) => {
          const meta = ADD_CARD_TRAY.items[c.id];
          const Icon = meta ? TRAY_ICONS[meta.icon] : null;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  log('add card', c.id);
                  layout.add(c.id);
                }}
                className="flex cursor-pointer items-center gap-[10px] rounded-[16px] border border-[#e7e7e7] bg-[#f7f8f4] py-[12px] pl-[12px] pr-[14px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                {Icon ? (
                  <span className="flex h-[36px] items-center justify-center rounded-[10px] bg-[#ebf1ec]">
                    <Icon className="size-[18px]" />
                  </span>
                ) : null}
                <span className="flex flex-col gap-[4px] whitespace-nowrap leading-normal playful:gap-px">
                  <span className="text-[14px] font-semibold text-[#1c2a21]">{c.label}</span>
                  {meta ? <span className="text-[12px] text-[#595959]">{meta.sub}</span> : null}
                </span>
                <span className="flex h-[26px] w-[25px] items-center justify-center rounded-[13px] bg-[#387440]">
                  <AddCardPlusIcon className="size-[14px]" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const EditHomePanel = ({ home }) => {
  log('mount');
  return (
    <div className="flex flex-col gap-[clamp(12px,1.2vw,20px)] px-[clamp(12px,1.4vw,24px)] pb-[clamp(12px,1.2vw,20px)]">
      <EditHomeBanner home={home} />
      <EditHomeTray />
    </div>
  );
};

export default EditHomePanel;
