import { Link } from 'react-router-dom';
import Button from '../../../../ui/Button.jsx';
import { classNames } from '../../../../../utils/classNames.js';
import CopyChip from './CopyChip.jsx';
import {
  PreviewChevronRightIcon,
  PreviewDesktopIcon,
  PreviewPhoneIcon,
  PreviewTabletIcon,
} from './PreviewIcons.jsx';

/*
 * PreviewToolbar — the bar above the preview stage (Figma 7.8.3a "preview bar", 1329 x 44): "Back to editor" · device toggle (Desktop / Tablet /
 * Phone) · view switch (My draft / What everyone sees now, 7.8.3g) · "N unpublished changes" chip · Publish (only for roles that may publish).
 * ⚠️ ASSUMPTION: the view switch is drawn only in 7.8.3g; it is shown in every state here so "published vs my draft" can be reached from the UI.
 * Props: backTo, device, onDevice, view, onView, unpublished, canPublish, publishTo, isLive (7.8.3g amber label).
 */
const DEVICE_ITEMS = [
  { id: 'desktop', label: 'Desktop', Icon: PreviewDesktopIcon },
  { id: 'tablet', label: 'Tablet', Icon: PreviewTabletIcon },
  { id: 'phone', label: 'Phone', Icon: PreviewPhoneIcon },
];
const VIEW_ITEMS = [
  { id: 'draft', label: 'My draft' },
  { id: 'published', label: 'What everyone sees now' },
];

const segment = (active) =>
  classNames(
    'inline-flex min-h-[32px] shrink-0 cursor-pointer items-center gap-[6px] rounded-[9px] border border-solid px-[14px] py-[8px] font-sans text-[13.5px] leading-[16px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
    active
      ? 'border-[#e7e7e7] bg-white font-semibold text-[#1c2a21]'
      : 'border-transparent bg-transparent font-medium text-[#575755]'
  );

const PreviewToolbar = ({
  backTo,
  device,
  onDevice,
  view,
  onView,
  unpublished,
  canPublish,
  publishTo,
}) => (
  <div className="flex flex-wrap items-center gap-[12px]">
    <Link
      to={backTo}
      className="inline-flex min-h-[36px] items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] py-[9px] pr-[12px] pl-[10px] font-sans text-[13.5px] leading-[16px] font-semibold whitespace-nowrap text-[#1c2a21] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
    >
      <PreviewChevronRightIcon className="size-[16px] text-[#1c2a21]" />
      Back to editor
    </Link>
    <div
      role="group"
      aria-label="Device"
      className="flex max-w-full items-center gap-[4px] overflow-x-auto rounded-[12px] bg-[#f8f8f4] p-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {DEVICE_ITEMS.map((item) => {
        const { id, label } = item;
        const Glyph = item.Icon;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={device === id}
            onClick={() => onDevice(id)}
            className={segment(device === id)}
          >
            <Glyph
              className={classNames(
                'size-[16px]',
                device === id ? 'text-[#1c2a21]' : 'text-[#5f6b63]'
              )}
            />
            {label}
          </button>
        );
      })}
    </div>
    <div
      role="group"
      aria-label="Which text to show"
      className="flex max-w-full items-center gap-[4px] overflow-x-auto rounded-[12px] bg-[#f8f8f4] p-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {VIEW_ITEMS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-pressed={view === id}
          onClick={() => onView(id)}
          className={segment(view === id)}
        >
          {label}
        </button>
      ))}
    </div>
    <div className="hidden min-w-0 flex-1 lg:block" />
    <div className="ml-auto flex items-center gap-[12px] lg:ml-0">
      <CopyChip tone={view === 'published' ? 'unpublishedLive' : 'unpublished'}>
        {`${unpublished} unpublished ${unpublished === 1 ? 'change' : 'changes'}`}
      </CopyChip>
      {canPublish ? (
        <Button to={publishTo} variant="primary" size="sm" className="!py-[10px]">
          Publish
        </Button>
      ) : null}
    </div>
  </div>
);

export default PreviewToolbar;
