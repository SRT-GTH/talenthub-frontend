import { useEffect, useMemo, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ProfileCloseGlyph,
  ProfileEyeIcon,
  ProfileFileDarkGlyph,
  ProfileGlobeGlyph,
  ProfileImageGlyph,
  ProfileLockSegGlyph,
  ProfilePauseGlyph,
  ProfilePhoneGlyph,
  ProfilePinGlyph,
  ProfileShieldGlyph,
  ProfileTargetGlyph,
  ProfileTrophyIcon,
  ProfileVoiceGlyph,
  ProfileWalletGlyph,
  ProfileWorkGlyph,
} from '../../shared/assets.jsx';
import { StreakMark } from './ProfileTabsUi.jsx';
import { VISIBILITY } from './talentProfilePreviewData.js';
import { DISPLAY } from '../talentHome/TabsParts.jsx';

const log = debug('ManageVisibilityDrawer');

/*
 * ManageVisibilityDrawer — PR-03 "Who sees what" (Figma Playful 7584:2347 / Focused 8110:387950; drawer
 * node 7584:2961, 560 wide, full height, right edge, p28/28/24/28, gap 16) over a dimmed recruiter preview
 * (overlay #1c2a21 @ 45%). Opened with `?manage=1` (the "Manage what's visible →" links).
 *
 * Each setting has a 3-segment audience control: Anyone with link (globe) / Signed-in recruiters
 * (work) / Only me (lock). A selected segment is green (#387440), except "Only me" which is ink
 * (#1c2a21). "Who viewed you" is always private (its other two segments sit at 30% opacity and are
 * disabled). The Figma frame shows ONE pending edit — Pitch video "Changed: was Recruiters" — so the draft
 * starts with that edit applied ("1 unsaved change"). Save with the pitch hidden opens PR-04
 * (`?view=recruiter&updated=1`); Cancel / ✕ / overlay / Esc just closes.
 *
 * Props: profile (useTalentProfileState object).
 */
const AUDIENCE = [
  { id: 'anyone', label: 'Anyone with link', Icon: ProfileGlobeGlyph },
  { id: 'recruiters', label: 'Signed-in recruiters', Icon: ProfileWorkGlyph },
  { id: 'me', label: 'Only me', Icon: ProfileLockSegGlyph },
];

const ICONS = {
  image: ProfileImageGlyph,
  // Figma's `icon/video` is an empty instance (nothing is drawn): keep the 19px slot, no glyph.
  video: null,
  pin: ProfilePinGlyph,
  voice: ProfileVoiceGlyph,
  file: ProfileFileDarkGlyph,
  phone: ProfilePhoneGlyph,
  wallet: ProfileWalletGlyph,
  target: ProfileTargetGlyph,
  trophy: ProfileTrophyIcon,
  streak: StreakMark,
  eye: ProfileEyeIcon,
};

const Segmented = ({ row, value, onChange }) => (
  <div
    role="radiogroup"
    aria-label={`${row.title}: who can see it`}
    className="flex shrink-0 items-center gap-[2px] rounded-[10px] border border-[#e6e6e6] bg-[#f8f8f4] p-[3px]"
  >
    {AUDIENCE.map((opt) => {
      const { id, label } = opt;
      const Glyph = opt.Icon;
      const selected = value === id;
      const locked = row.locked && id !== 'me';
      return (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={selected}
          aria-label={label}
          disabled={Boolean(row.locked)}
          onClick={() => onChange(id)}
          className={classNames(
            'flex h-[28px] w-[44px] items-center justify-center rounded-[8px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            selected
              ? id === 'me'
                ? 'bg-[#1c2a21] text-white'
                : 'bg-[#387440] text-white'
              : 'text-[#595959]',
            locked ? 'opacity-30' : null,
            row.locked ? 'cursor-default' : 'cursor-pointer'
          )}
        >
          <Glyph className="size-[14px]" />
        </button>
      );
    })}
  </div>
);

const Row = ({ row, value, changed, onChange, first }) => {
  const { uiStyle } = useUiStyle();
  const Icon = ICONS[row.icon];
  const title = uiStyle !== 'playful' && row.titleFocused ? row.titleFocused : row.title;
  return (
    <li className="flex flex-col">
      {first ? null : <span aria-hidden="true" className="h-px w-full bg-[#e6e6e6]" />}
      <div
        className={classNames(
          'flex items-center gap-[12px] rounded-[10px] py-[11px]',
          changed ? 'bg-[#faf4e8] px-[10px]' : null
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            'flex size-[19px] shrink-0 items-center justify-center',
            row.icon === 'video' ? 'opacity-[0.45]' : null
          )}
        >
          {Icon ? <Icon className="block size-full" /> : null}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">{title}</span>
          {changed ? (
            <span className="text-[12px] leading-[14px] font-semibold text-[#c8951a]">
              {VISIBILITY.changed(
                AUDIENCE.find((a) => a.id === row.was)?.id === 'recruiters' ? 'Recruiters' : ''
              )}
            </span>
          ) : row.sub ? (
            <span className="text-[12px] leading-[14px] text-[#737373]">{row.sub}</span>
          ) : null}
        </div>
        <Segmented row={row} value={value} onChange={onChange} />
      </div>
    </li>
  );
};

const ManageVisibilityDrawer = ({ profile }) => {
  const ref = useRef(null);
  const initial = useMemo(
    () => Object.fromEntries(VISIBILITY.rows.map((r) => [r.key, r.value])),
    []
  );
  const original = useMemo(
    () => Object.fromEntries(VISIBILITY.rows.map((r) => [r.key, r.was ?? r.value])),
    []
  );
  const [draft, setDraft] = useState(initial);
  const [paused, setPaused] = useState(false);

  const changes =
    VISIBILITY.rows.filter((r) => draft[r.key] !== original[r.key]).length + (paused ? 1 : 0);

  const close = () => {
    log('close');
    profile.update({ manage: null });
  };

  const save = () => {
    const pitchHidden = draft.pitch === 'me' && original.pitch !== 'me';
    log('save', { changes, pitchHidden, paused });
    if (pitchHidden) profile.update({ manage: null, view: 'recruiter', updated: true });
    else profile.update({ manage: null });
  };

  useEffect(() => {
    log('mount', { changes });
    ref.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-[rgba(28,42,33,0.45)]"
      />
      <aside
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={VISIBILITY.title}
        className={classNames(
          'absolute top-0 right-0 flex h-dvh w-[min(560px,100vw)] flex-col gap-[16px] overflow-y-auto border-l border-[rgba(28,42,33,0.1)] bg-white pt-[28px] pr-[28px] pb-[24px] pl-[28px] outline-none',
          'max-md:px-[16px] max-md:pt-[20px] max-md:pb-[16px] shadow-[-6px_0_0_#387440]'
        )}
      >
        <header className="flex items-start gap-[10px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <h2
              className={classNames(
                DISPLAY,
                'm-0 text-[clamp(24px,1.68vw,29px)] leading-[1.2] font-semibold text-[#1c2a21]'
              )}
            >
              {VISIBILITY.title}
            </h2>
            <p className="m-0 text-[14px] leading-[17px] text-[#737373]">{VISIBILITY.sub}</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#e6e6e6] text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <ProfileCloseGlyph className="size-[16px]" />
          </button>
        </header>

        <section
          className={classNames(
            'flex items-center gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px]',
            'border border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
          )}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <p className="m-0 flex items-center gap-[6px] text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              <ProfilePauseGlyph className="size-[17px] shrink-0" />
              {VISIBILITY.pause.title}
            </p>
            <p className="m-0 text-[12px] leading-[14px] text-[#463409]">{VISIBILITY.pause.sub}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={paused}
            aria-label={VISIBILITY.pause.title}
            onClick={() => setPaused((p) => !p)}
            className={classNames(
              'relative h-[24px] w-[40px] shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
              paused ? 'bg-[#387440]' : 'bg-[#e6e6e6]'
            )}
          >
            <span
              className={classNames(
                'absolute top-[3px] size-[18px] rounded-full bg-white transition-all',
                paused ? 'left-[19px]' : 'left-[3px]'
              )}
            />
          </button>
        </section>

        <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0" aria-label="Audience legend">
          {AUDIENCE.map((opt) => {
            const Glyph = opt.Icon;
            return (
              <li
                key={opt.id}
                className="inline-flex h-[32px] items-center gap-[6px] rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[16px] font-semibold text-[#595959]"
              >
                <Glyph className="size-[14px]" />
                {opt.label}
              </li>
            );
          })}
        </ul>

        <ul className="m-0 flex list-none flex-col p-0">
          {VISIBILITY.rows.map((row, i) => (
            <Row
              key={row.key}
              row={row}
              first={i === 0}
              value={draft[row.key]}
              changed={draft[row.key] !== original[row.key]}
              onChange={(v) => {
                log('set', row.key, v);
                setDraft((d) => ({ ...d, [row.key]: v }));
              }}
            />
          ))}
          <li aria-hidden="true" className="h-px w-full bg-[#e6e6e6]" />
        </ul>

        <p className="m-0 flex items-center gap-[10px] rounded-[12px] bg-[#ebf1ec] px-[14px] py-[12px] text-[12px] leading-[14px] font-medium text-[#2d5d33]">
          <ProfileShieldGlyph className="size-[14px] shrink-0" />
          {VISIBILITY.note}
        </p>

        <footer className="mt-auto flex flex-wrap items-center gap-[10px] pt-[8px]">
          <span className="min-w-0 flex-1 text-[12px] leading-[14px] font-semibold text-[#785910]">
            {changes > 0 ? VISIBILITY.unsaved(changes) : ''}
          </span>
          <Button variant="tertiary" size="sm" onClick={close}>
            {VISIBILITY.cancel}
          </Button>
          <Button variant="primary" size="sm" onClick={save}>
            {VISIBILITY.save}
          </Button>
        </footer>
      </aside>
    </div>
  );
};

export default ManageVisibilityDrawer;
