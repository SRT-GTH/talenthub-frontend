import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { PREVIEW_BANNER } from './talentProfilePreviewData.js';

const log = debug('ProfilePreviewBanner');

/*
 * ProfilePreviewBanner — P-07 "Preview as recruiter" top bar (Figma Playful `preview bar` 7573:1226,
 * Focused 8110:371220; the two styles are identical — diff of the nodes is empty).
 * Copy differs per view (P-07 recruiter vs PR-02 public). Dark #1c2a21 bar, r16, p12/16/12/20, gap 12: [19px eye slot] [title + subtitle] [view-as switch]
 * [Exit preview]. The eye glyph is drawn #1c2a21 on the #1c2a21 bar in Figma (invisible), so only its
 * 19px slot is kept. The "view as" switch is a 2-segment control: Recruiter (selected, #ffd86b) /
 * Public link (#bfbfbf) — choosing Public link opens PR-02 (`?view=public`), Exit preview returns
 * to P-01 (`?view=` removed).
 *
 * Props: profile (useTalentProfileState object).
 */
const ProfilePreviewBanner = ({ profile }) => {
  const current = profile?.view === 'public' ? 'public' : 'recruiter';
  const copy = PREVIEW_BANNER[current];

  useEffect(() => {
    log('mount', { current });
  }, [current]);

  const choose = (id) => {
    log('view as ->', id);
    profile.update({ view: id });
  };

  return (
    <section
      aria-label="Preview as recruiter"
      className="flex flex-wrap items-center gap-[12px] rounded-[16px] bg-[#1c2a21] py-[12px] pr-[16px] pl-[20px] max-md:gap-[10px] max-md:py-[10px] max-md:pl-[14px] max-md:pr-[12px]"
    >
      <span aria-hidden="true" className="h-[19px] w-[19px] shrink-0 max-md:hidden" />
      <div className="flex min-w-[200px] flex-1 flex-col gap-[2px]">
        <p className="m-0 font-sans text-[15px] font-semibold leading-[18px] text-white">
          {copy.title}
        </p>
        <p className="m-0 font-sans text-[12px] leading-[14px] text-[#bfbfbf]">{copy.sub}</p>
      </div>

      <div
        role="radiogroup"
        aria-label="View as"
        className="flex shrink-0 items-center gap-[2px] rounded-[10px] bg-[#1c2a21] p-[3px]"
      >
        {PREVIEW_BANNER.segments.map((s) => {
          const selected = s.id === current;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => !selected && choose(s.id)}
              className={classNames(
                'rounded-[8px] px-[12px] py-[7px] font-sans text-[13px] font-semibold leading-[16px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd86b]',
                selected ? 'bg-[#ffd86b] text-[#1c2a21]' : 'text-[#bfbfbf] hover:text-white'
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <Button
        variant="tertiary"
        size="sm"
        onClick={() => {
          log('exit preview');
          profile.update({ view: null, manage: null, updated: null });
        }}
      >
        {PREVIEW_BANNER.exit}
      </Button>
    </section>
  );
};

export default ProfilePreviewBanner;
