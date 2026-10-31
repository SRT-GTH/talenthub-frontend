import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyProfile, saveProfileFields } from '../../../services/profileStages.api.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { Chip, HEAD } from '../talentHome/coreUi.jsx';
import {
  ProfileChipAnalyticalIcon,
  ProfileChipCalmIcon,
  ProfileChipHeartIcon,
  ProfileChipTeamIcon,
  ProfileEyeIcon,
} from '../../shared/assets.jsx';

const log = debug('ProfileEditAbout');

/*
 * ProfileEditAbout — P-08 "Edit About (in place)". Figma Focused 8110:371805 / Playful 7573:1385
 * (card node 8110:371942 / 7573:1540). Replaces the About body when `?edit=about`; Cancel / Save both
 * close it with `profile.update({ edit: null })`. All copy below is verbatim from the frames.
 * Live (signed in, `live`): the bio loads from and saves to profile.professionalBio (PATCH /profiles/fields), then
 * `onSaved` reloads the page data. "My vibe" is derived from the personality quiz and hobby interests, so live mode
 * explains that instead of offering chips it cannot store. Demo: the Figma text and chips, local state only.
 */

export const ABOUT_LIMIT = 400;
const INITIAL_ABOUT =
  "Final-year Statistics student who turns messy data into clear decisions. I build dashboards in Power BI, clean data in Python and SQL, and I'm happiest when a chart finally makes a trotro route make sense. Looking for my first analyst role in Accra";

const VIBES = [
  { id: 'analytical', label: 'Analytical', Icon: ProfileChipAnalyticalIcon },
  { id: 'calm', label: 'Calm under pressure', Icon: ProfileChipCalmIcon },
  { id: 'team', label: 'Team player', Icon: ProfileChipTeamIcon },
  { id: 'sport', label: 'Football · Afrobeats', Icon: ProfileChipHeartIcon },
];
const VIBE_MAX = 5;

const ProfileEditAbout = ({ profile, live = false, onSaved }) => {
  const navigate = useNavigate();
  const [text, setText] = useState(live ? '' : INITIAL_ABOUT);
  // Live: 'loading' until the saved bio is in (a failed load must not let Save wipe it), then 'ready' / 'saving'.
  const [status, setStatus] = useState(live ? 'loading' : 'ready');
  const [error, setError] = useState('');
  const [vibes, setVibes] = useState(VIBES);
  const [removed, setRemoved] = useState([]);
  const areaRef = useRef(null);
  const labelId = useId();

  log('mount', { chars: text.length, vibes: vibes.length, live });

  useEffect(() => {
    if (!live) return undefined;
    let cancelled = false;
    fetchMyProfile()
      .then((p) => {
        if (cancelled) return;
        setText(String(p?.professionalBio || '').slice(0, ABOUT_LIMIT));
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('failed');
        setError('We couldn’t load your bio. Close this and try again.');
      });
    return () => {
      cancelled = true;
    };
  }, [live]);

  // Grow the textarea with its content (Figma: box hugs the text, 46px for two lines).
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const close = (why) => {
    log('branch', { close: why });
    profile.update({ edit: null });
  };
  const save = async () => {
    log('save', { chars: text.length, vibes: vibes.map((v) => v.id), live });
    if (!live) {
      close('save');
      return;
    }
    if (status !== 'ready') return;
    setStatus('saving');
    setError('');
    try {
      await saveProfileFields({ professionalBio: text.trim() });
      onSaved?.();
      close('save');
    } catch (err) {
      log.error('bio save failed:', err?.response?.status || err?.message);
      setStatus('ready');
      setError('Your bio wasn’t saved. Check your connection and try again.');
    }
  };

  // Esc cancels, ⌘↵ / Ctrl↵ saves (the hint line in the frame).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        // Do not steal Esc from an open dialog / drawer above the page.
        if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
        close('esc');
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        save();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, vibes]);

  const dropVibe = (v) => {
    log('vibe removed', v.id);
    setVibes((list) => list.filter((x) => x.id !== v.id));
    setRemoved((list) => [...list, v]);
  };
  const addVibe = () => {
    if (!removed.length || vibes.length >= VIBE_MAX) {
      log('branch', { addVibe: 'nothing to add' });
      return;
    }
    const back = removed[removed.length - 1];
    log('vibe restored', back.id);
    setRemoved((list) => list.slice(0, -1));
    setVibes((list) => [...list, back]);
  };

  return (
    <section
      aria-labelledby={labelId}
      className={classNames(
        'flex flex-col gap-[16px] overflow-hidden rounded-[20px] border border-[#387440] bg-white p-[clamp(14px,1.4vw,24px)]',
        'shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)]',
        'playful:border-[1.5px] playful:shadow-[0_10px_24px_rgba(56,116,64,0.15),4px_4px_0_rgba(56,116,64,0.65)]'
      )}
    >
      <div className="flex items-center gap-[10px]">
        <h2
          id={labelId}
          className={classNames(
            HEAD,
            'text-[23px] leading-[1.25] whitespace-nowrap text-[#1c2a21]'
          )}
        >
          About
        </h2>
        <span className="h-px min-w-px flex-1" aria-hidden="true" />
        <Chip>Editing</Chip>
      </div>

      <div
        className={classNames(
          'flex flex-col gap-[8px] rounded-[10px] border-2 border-[#c1d4c4] bg-white p-[16px]',
          '[filter:drop-shadow(0_2px_4px_rgba(28,42,33,0.04))_drop-shadow(0_1px_1px_rgba(28,42,33,0.04))]',
          'playful:[filter:drop-shadow(0_10px_12px_rgba(28,42,33,0.06))_drop-shadow(4px_4px_0_rgba(28,42,33,0.45))]'
        )}
      >
        <textarea
          ref={areaRef}
          value={text}
          maxLength={ABOUT_LIMIT}
          rows={2}
          aria-label="About"
          placeholder={live ? 'A few lines about what you do and what you want next' : undefined}
          disabled={status === 'loading' || status === 'failed'}
          onChange={(e) => setText(e.target.value)}
          className="block w-full resize-none overflow-hidden bg-transparent text-[15px] leading-[23px] text-[#1c2a21] outline-none"
        />
        <div className="flex flex-wrap items-center gap-[8px]">
          {/* The writing-help chips have no backend yet: demo only. */}
          {!live && (
            <>
              <Chip
                as="button"
                type="button"
                onClick={() => log('chip', 'Make it punchier (no backend)')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                Make it punchier
              </Chip>
              <Chip
                as="button"
                type="button"
                onClick={() => log('chip', 'Add a result (no backend)')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                Add a result
              </Chip>
            </>
          )}
          <span className="h-px min-w-px flex-1" aria-hidden="true" />
          <span
            aria-live="polite"
            className="text-[12px] leading-[normal] font-medium text-[#737373]"
          >
            {text.length} / {ABOUT_LIMIT}
          </span>
        </div>
      </div>

      {live ? (
        <div className="flex flex-wrap items-center gap-[8px]">
          <p className="text-[13px] leading-[normal] text-[#595959]">
            Your vibe comes from your personality quiz and the hobbies in your interests.
          </p>
          <button
            type="button"
            onClick={() => navigate('/profile/filling/personality')}
            className="cursor-pointer text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Take the personality quiz
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-[8px]">
          <p className="text-[13px] leading-[normal] font-semibold text-[#595959]">
            My vibe · pick up to 5
          </p>
          <div className="flex flex-wrap items-start gap-[8px]">
            {vibes.map((v) => (
              <Chip
                key={v.id}
                as="button"
                type="button"
                aria-label={v.label}
                onClick={() => dropVibe(v)}
                icon={<v.Icon />}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {v.label}
              </Chip>
            ))}
            <button
              type="button"
              onClick={addVibe}
              className="cursor-pointer rounded-full border border-dashed border-[#bfbfbf] bg-white px-[12px] py-[6px] text-[12px] leading-[normal] font-semibold whitespace-nowrap text-[#2d5d33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              + Add
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-[8px] rounded-[12px] bg-[#f8f8f4] px-[12px] py-[10px]">
        <ProfileEyeIcon className="size-[14px] shrink-0" />
        <p className="text-[13px] leading-[normal] font-medium text-[#595959]">
          Visible to recruiters and on your public link
        </p>
        <span className="h-px min-w-px flex-1" aria-hidden="true" />
        <button
          type="button"
          onClick={() => profile.update({ manage: true })}
          className="cursor-pointer text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          Change
        </button>
      </div>

      {error ? (
        <p role="alert" className="text-[13px] leading-[normal] font-medium text-[#c0392b]">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-end gap-[10px]">
        <p className="text-[12px] leading-[normal] text-[#737373]">Esc to cancel · ⌘↵ to save</p>
        <span className="h-px min-w-px flex-1" aria-hidden="true" />
        <Button variant="tertiary" size="sm" onClick={() => close('cancel')}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={save}
          disabled={status !== 'ready'}
          aria-busy={status === 'saving' || undefined}
        >
          {status === 'saving' ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </section>
  );
};

export default ProfileEditAbout;
