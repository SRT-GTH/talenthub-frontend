import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import CommunityIcon from '../community/CommunityIcon.jsx';
import { icons } from '../community/communityIcons.js';
import {
  A11yContrastIcon,
  A11yLinkIcon,
  A11yMotionIcon,
  A11yPanelCheckIcon,
  A11yPanelSparkleIcon,
  A11yTextSizeIcon,
} from '../../shared/assets.jsx';
import doodleRing from '../../../assets/talent-home/a11y/a11y-panel-doodle-ring.png';
import { useA11yPrefs } from './useA11yPrefs.js';

const log = debug('TalentA11yMenu');

/*
 * Accessibility mode trigger + panel for the talent top nav (Figma A11Y-02: "GTH · Accessibility mode"
 * 7752:3735 Playful / 8097:12183 Focused, "Active indicator" 7752:3811). The trigger toggles `?a11y=1`;
 * while on, the 46px ink ring surrounds it and the panel hangs under it. Panel flat in Focused,
 * ink borders + shelf + stickers via `playful:` in Playful. Copy is verbatim from the frame.
 */

const Toggle = ({ on, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={() => onChange(!on)}
    className={classNames(
      'relative h-[26px] w-[44px] shrink-0 cursor-pointer rounded-[13px] border border-[rgba(28,42,33,0.12)] transition-colors playful:border-[1.5px] playful:border-[#1c2a21] playful:shadow-[1.5px_1.5px_0_#1c2a21]',
      on ? 'bg-[#387440]' : 'bg-[#e1eae2]'
    )}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'absolute top-[2.6px] size-[18.8px] rounded-full border-[1.2px] border-[#1c2a21] bg-white transition-[left]',
        on ? 'left-[21.6px]' : 'left-[2.6px]'
      )}
    />
  </button>
);

const Row = ({ icon, title, sub, children }) => (
  <div className="flex items-center gap-[12px] px-[16px] py-[11px]">
    <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] border border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] playful:border-[1.2px] playful:border-[#1c2a21]">
      {icon}
    </span>
    <span className="flex min-w-0 flex-1 flex-col leading-[normal]">
      <span className="text-[14px] font-semibold text-[#1c2a21]">{title}</span>
      <span className="text-[12px] text-[#737373]">{sub}</span>
    </span>
    {children}
  </div>
);

const SIZES = [
  { id: 'small', label: 'Small text', cls: 'text-[12px]' },
  { id: 'medium', label: 'Medium text', cls: 'text-[13px]' },
  { id: 'large', label: 'Large text', cls: 'text-[15px]' },
];

const A11yPanel = ({ id, onClose }) => {
  const [prefs, setPref] = useA11yPrefs();

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        log('Esc -> close panel');
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      id={id}
      role="group"
      aria-labelledby={`${id}-title`}
      className="absolute top-[calc(100%+30px)] right-0 z-50 w-[320px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[24px] border border-[rgba(28,42,33,0.1)] bg-[#fffefc] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_11px_rgba(28,42,33,0.03)] playful:shadow-[0_1px_2px_rgba(28,42,33,0.04),0_4px_16px_rgba(28,42,33,0.06)]"
    >
      <div className="relative flex flex-col gap-[4px] overflow-hidden bg-[#ebf1ec] px-[20px] pt-[18px] pb-[14px]">
        <div className="flex items-center gap-[10px]">
          <h2
            id={`${id}-title`}
            className="text-[23px] leading-[1.25] font-semibold text-[#1c2a21] playful:font-heading"
          >
            Accessibility
          </h2>
          <span
            aria-hidden="true"
            className="rotate-5 rounded-full border border-[rgba(28,42,33,0.12)] bg-white px-[10px] py-[4px] text-[11.5px] leading-[normal] font-bold text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[1.5px_1.5px_0_rgba(28,42,33,0.9)]"
          >
            your way
          </span>
        </div>
        <p className="text-[12.5px] leading-[normal] text-[#595959]">
          Make GTH comfy for your eyes and hands.
        </p>
        <A11yPanelSparkleIcon className="absolute top-[14px] left-[274px] hidden size-[16px] playful:block" />
        <img
          src={doodleRing}
          alt=""
          draggable="false"
          className="pointer-events-none absolute top-[-16px] left-[286px] hidden size-[44px] max-w-none playful:block"
        />
      </div>

      <Row icon={<A11yContrastIcon />} title="High contrast" sub="Stronger colours & borders">
        <Toggle
          label="High contrast"
          on={prefs.contrast}
          onChange={(v) => setPref('contrast', v)}
        />
      </Row>
      <Row icon={<A11yTextSizeIcon />} title="Text size" sub="Applies across GTH">
        <span
          role="radiogroup"
          aria-label="Text size"
          className="flex items-center gap-[2px] rounded-full border border-[#e1eae2] bg-[#f8f8f4] p-[3px]"
        >
          {SIZES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={prefs.text === s.id}
              aria-label={s.label}
              onClick={() => setPref('text', s.id)}
              className={classNames(
                'cursor-pointer rounded-full px-[9px] py-[4px] leading-[normal] font-bold',
                s.cls,
                prefs.text === s.id
                  ? 'bg-[#1c2a21] text-white playful:shadow-[1.5px_1.5px_0_#387440]'
                  : 'text-[#595959]'
              )}
            >
              A
            </button>
          ))}
        </span>
      </Row>
      <Row icon={<A11yMotionIcon />} title="Reduce motion" sub="Fewer animations & effects">
        <Toggle label="Reduce motion" on={prefs.motion} onChange={(v) => setPref('motion', v)} />
      </Row>
      <Row icon={<A11yLinkIcon />} title="Underline links" sub="Easier to spot actions">
        <Toggle label="Underline links" on={prefs.links} onChange={(v) => setPref('links', v)} />
      </Row>

      <div className="h-px w-full bg-[#e1eae2]" />
      <div className="flex flex-col items-start gap-[2px] px-[16px] pt-[10px] pb-[12px]">
        <p className="text-[11px] leading-[normal] text-[#737373]">
          Settings save to your account and apply on every device. GTH targets WCAG 2.1 AA.
        </p>
        <span className="inline-flex items-center gap-[4px] rounded-full border border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] px-[10px] py-[4px] text-[10.5px] leading-[normal] font-bold text-[#1c2a21] playful:border-[#1c2a21]">
          WCAG 2.1 AA
          <A11yPanelCheckIcon />
        </span>
      </div>
    </div>
  );
};

const TalentA11yMenu = ({ home }) => {
  const open = Boolean(home.a11yMode);
  const panelId = 'talent-a11y-panel';
  log('render', { open });

  return (
    <div className="relative max-lg:hidden">
      <button
        type="button"
        onClick={() => {
          log('toggle a11y mode ->', !open);
          home.update({ a11y: !open });
        }}
        aria-label="Accessibility mode"
        aria-pressed={open}
        aria-controls={open ? panelId : undefined}
        className="inline-flex size-[38px] items-center justify-center overflow-hidden rounded-[99px] bg-[#f8fafc] transition-colors hover:bg-[#eef2f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <CommunityIcon src={icons.navAccessibility} size={20} />
      </button>
      {open && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 size-[46px] -translate-x-1/2 -translate-y-1/2 rounded-[23px] border-[2.5px] border-solid border-[#1c2a21]"
          />
          <A11yPanel id={panelId} onClose={() => home.update({ a11y: false })} />
        </>
      )}
    </div>
  );
};

export default TalentA11yMenu;
