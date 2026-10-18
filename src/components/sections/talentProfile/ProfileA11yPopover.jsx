import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  A11yPanelSparkleIcon,
  ProfileA11yColumnsGlyph,
  ProfileA11yCloudGlyph,
  ProfileA11ySparkGlyph,
  ProfileA11yTextSizeGlyph,
  ProfileA11yVolumeGlyph,
} from '../../shared/assets.jsx';
import doodleRing from '../../../assets/talent-home/a11y/a11y-panel-doodle-ring.png';
import { Toggle } from '../talentHome/TalentA11yMenu.jsx';
import { A11Y_PANEL, TEXT_SIZES } from './profileA11yData.js';

const log = debug('ProfileA11yPopover');

/*
 * ProfileA11yPopover — AX-01 "Accessibility · your way" (Figma component 8343:520316; Playful 7590:1952 /
 * Focused 8110:389972). 320px card r24, header #ebf1ec (title Bricolage 23 + white "your way" sticker, sub
 * 12.5px), scope tabs (Everywhere / On Profile, selected = ink pill), six 56px setting rows (34px tinted icon
 * tile, 14px/600 title, 12px sub, 44x26 toggle or the 3-step "A" text-size control) and a 11px footnote.
 * It hangs under the nav's accessibility button (right edge aligned to it, 8px gap — the component draws the
 * 38px trigger at its top-right then an 8px gap). Esc / outside click / the trigger close it (`ax` removed).
 *
 * Props: profile (state object), prefs, setPref (useProfileA11yPrefs).
 */
const ICONS = {
  vol: ProfileA11yVolumeGlyph,
  text: ProfileA11yTextSizeGlyph,
  spark: ProfileA11ySparkGlyph,
  cloud: ProfileA11yCloudGlyph,
  columns: ProfileA11yColumnsGlyph,
};

const Row = ({ row, children }) => {
  const Icon = ICONS[row.icon];
  return (
    <div className="flex items-center gap-[12px] px-[16px] py-[11px]">
      <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] border border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] playful:border-[1.2px] playful:border-[#1c2a21]">
        {Icon ? (
          <Icon className="size-[16px]" />
        ) : (
          <span className="text-[10px] leading-[12px] font-bold text-[#387440]">CC</span>
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col leading-[normal]">
        <span className="text-[14px] font-semibold text-[#1c2a21]">{row.title}</span>
        <span
          className={classNames(
            'text-[12px] text-[#737373]',
            row.subPlayfulOnly ? 'hidden playful:inline' : null
          )}
        >
          {row.sub}
        </span>
      </span>
      {children}
    </div>
  );
};

const ProfileA11yPopover = ({ profile, prefs, setPref }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ top: 74, right: 24 });

  const close = () => {
    log('close');
    profile.update({ ax: null });
  };

  // Hang under the nav accessibility button (Figma: panel 8px below the 38px trigger, right edges aligned).
  useLayoutEffect(() => {
    const place = () => {
      const btn = document.querySelector('button[aria-label="Accessibility mode"]');
      const r = btn?.getBoundingClientRect();
      if (!r) return;
      const next = { top: r.bottom + 8, right: Math.max(12, window.innerWidth - r.right) };
      log('position', next);
      setPos(next);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, []);

  useEffect(() => {
    log('mount', { scope: prefs.scope });
    ref.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    const onDown = (e) => {
      const onTrigger = e.target.closest?.('button[aria-label="Accessibility mode"]');
      if (!ref.current?.contains(e.target) && !onTrigger) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="group"
      aria-labelledby="profile-a11y-title"
      className="fixed z-50 w-[320px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[24px] border border-[rgba(28,42,33,0.1)] bg-[#fffefc] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_11px_rgba(28,42,33,0.03)] outline-none playful:shadow-[0_1px_2px_rgba(28,42,33,0.04),0_4px_16px_rgba(28,42,33,0.06)]"
      style={{ top: pos.top, right: pos.right }}
    >
      <div className="relative flex flex-col gap-[4px] overflow-hidden bg-[#ebf1ec] px-[20px] pt-[18px] pb-[14px]">
        <div className="flex items-center gap-[10px]">
          <h2
            id="profile-a11y-title"
            className="m-0 text-[23px] leading-[1.25] font-semibold text-[#1c2a21] playful:font-heading"
          >
            {A11Y_PANEL.title}
          </h2>
          <span
            aria-hidden="true"
            className="rounded-full border border-[rgba(28,42,33,0.12)] bg-white px-[10px] py-[4px] text-[11.5px] leading-[normal] font-bold text-[#1c2a21] max-lg:text-[12px] playful:rotate-5 playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[1.5px_1.5px_0_rgba(28,42,33,0.9)]"
          >
            {A11Y_PANEL.sticker}
          </span>
        </div>
        <p className="m-0 text-[12.5px] leading-[normal] text-[#595959]">{A11Y_PANEL.sub}</p>
        <A11yPanelSparkleIcon className="absolute top-[14px] left-[274px] hidden size-[16px] playful:block" />
        <img
          src={doodleRing}
          alt=""
          draggable="false"
          className="pointer-events-none absolute top-[-16px] left-[286px] hidden size-[44px] max-w-none playful:block"
        />
      </div>

      <div className="px-[16px] pt-[14px] pb-[6px]">
        <div
          role="tablist"
          aria-label="Where settings apply"
          className="flex rounded-full border border-[#e1eae2] bg-[#f8f8f4] p-[3px]"
        >
          {A11Y_PANEL.scope.map((s) => {
            const on = prefs.scope === s.id;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setPref('scope', s.id)}
                className={classNames(
                  'flex-1 cursor-pointer rounded-full px-[14px] py-[7px] text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                  on
                    ? 'bg-[#1c2a21] text-white shadow-[0_1px_2px_rgba(28,42,33,0.2)]'
                    : 'text-[#595959]'
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {A11Y_PANEL.rows.map((row) => (
        <Row key={row.key} row={row}>
          {row.key === 'size' ? (
            <span
              role="radiogroup"
              aria-label={row.title}
              className="flex items-center gap-[2px] rounded-full border border-[#e1eae2] bg-[#f8f8f4] p-[3px]"
            >
              {TEXT_SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={prefs.size === s.id}
                  aria-label={`${s.id} text`}
                  onClick={() => setPref('size', s.id)}
                  className={classNames(
                    'cursor-pointer rounded-full px-[9px] py-[4px] leading-[normal] font-bold',
                    s.cls,
                    prefs.size === s.id
                      ? 'bg-[#1c2a21] text-white shadow-[0_1px_2px_rgba(28,42,33,0.2)]'
                      : 'text-[#595959]'
                  )}
                >
                  A
                </button>
              ))}
            </span>
          ) : (
            <Toggle
              label={row.title}
              on={Boolean(prefs[row.key])}
              onChange={(v) => setPref(row.key, v)}
            />
          )}
        </Row>
      ))}

      <div className="h-px w-full bg-[#e1eae2]" />
      <p className="m-0 px-[16px] pt-[10px] pb-[12px] text-[11px] leading-[13px] text-[#737373] max-lg:text-[12px]">
        {A11Y_PANEL.note}
      </p>
    </div>
  );
};

export default ProfileA11yPopover;
