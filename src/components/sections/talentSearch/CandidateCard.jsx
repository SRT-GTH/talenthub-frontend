import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  LightbulbIcon,
  SaveHeartIcon,
  MoreDotsIcon,
  ConversationIcon,
} from './talentSearchIcons.jsx';
import { CARD_LABELS } from './talentSearchData.js';

const log = debug('CandidateCard');

/*
 * CandidateCard — one search result. Figma 7249:74364 / :74437 / :74509.
 *
 * Card: 432.33 wide, white, 1px #e6e2d6 border, r12, VERTICAL gap 12,
 * padding 20/16.
 *
 * The match percentage drives BOTH the badge on the avatar and the progress
 * bar. Figma draws Godfred's bar at 128/192 (66.7%) while labelling it 76%,
 * whereas Kofi (174.72/192 = 91%) and Ama (161.28/192 = 84%) are exact — so
 * the bar is computed from `matchPercent` for all three rather than
 * reproducing a bar that disagrees with its own label.
 *
 * Both CTAs use the solid "shelf" shadow Figma specifies (0 Npx 0, no blur),
 * which is a different effect from the theme's blurred --shadow-button-shelf.
 */
const CandidateCard = ({ candidate, avatarSrc, onViewProfile, onStartConversation, className }) => {
  log('render', {
    id: candidate.id,
    matchPercent: candidate.matchPercent,
    available: candidate.available,
  });

  return (
    <article
      className={classNames(
        'flex min-w-0 flex-col gap-[12px] rounded-[12px] border border-border-card bg-white px-[20px] py-[16px]',
        className
      )}
    >
      {/* ── Identity row — Figma 7249:74365, gap 24, py 20 ── */}
      <div className="flex items-center gap-[24px] py-[20px]">
        <div className="relative shrink-0">
          <img
            src={avatarSrc}
            alt={candidate.name}
            className="size-[73.85px] rounded-full border-2 border-[#1f6b3f] object-cover"
          />
          {/* Match badge — 32x32, #387440, 2px white ring */}
          <span className="absolute -bottom-[2px] -right-[2px] grid size-[32px] place-items-center rounded-full border-2 border-white bg-brand-green">
            <span className="font-sans text-[10px] font-bold leading-4 text-white">
              {candidate.matchPercent}%
            </span>
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[9px]">
          <div className="flex flex-col gap-[2px]">
            <h3 className="font-display not-italic text-[20px] leading-[26px] tracking-[-0.5px] text-black">
              {candidate.name}
            </h3>
            <p className="font-sans text-[14px] leading-[16.71px] tracking-[0.2px] text-content-muted">
              {candidate.role}
            </p>
          </div>

          <div className="flex flex-col">
            {/* Figma 7249:74376 — 6px track on #f0eee8 */}
            <span className="h-[6px] w-full overflow-hidden rounded-full bg-[#f0eee8]">
              <span
                className="block h-full rounded-full bg-brand-green"
                style={{ width: `${candidate.matchPercent}%` }}
              />
            </span>
            <span className="pt-[6px] font-sans text-[10px] font-semibold leading-4 text-brand-green">
              {CARD_LABELS.matchScore(candidate.matchPercent)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-[16px]">
          {/* Tags + row actions — Figma 7249:74384 */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-wrap items-center gap-[6px]">
              {candidate.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex h-[26px] items-center rounded-pill border-[1.21px] border-border-pill bg-neutral px-[9.64px] font-sans text-[12px] font-medium leading-[14.32px] text-neutral-dark-active"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-[8px]">
              <button
                type="button"
                aria-label={`Save ${candidate.name}`}
                onClick={() => log('branch', { action: 'save', id: candidate.id, wired: false })}
                className="grid size-[32px] place-items-center rounded-full border border-[#e6e6e6] text-content-helper transition-colors hover:bg-neutral"
              >
                <SaveHeartIcon className="w-[11.67px]" />
              </button>
              <button
                type="button"
                aria-label={`More options for ${candidate.name}`}
                onClick={() => log('branch', { action: 'more', id: candidate.id, wired: false })}
                className="grid size-[32px] place-items-center rounded-full border border-[#e6e6e6] text-content-helper transition-colors hover:bg-neutral"
              >
                <MoreDotsIcon className="w-[9.33px]" />
              </button>
            </div>
          </div>

          {/* Match explanation — Figma 7249:74422, #f3f8f4 on a 1px #00522b border */}
          {/* Figma 7249:74470 — fill #ebf1ec; the 1px #00522b stroke carries
              opacity 0.10, so it reads as almost no border at all. */}
          <div className="flex gap-[12px] rounded-[8px] border border-[#00522b]/10 bg-brand-green-light p-[16px]">
            <LightbulbIcon className="size-[20px] shrink-0 text-brand-green" />
            <div className="flex min-w-0 flex-col gap-[3.13px]">
              <p className="font-sans text-[14px] font-semibold leading-5 text-brand-green">
                {CARD_LABELS.matchExplanation}
              </p>
              {/* whitespace-pre-line keeps Figma's hard line breaks in the body copy */}
              <p className="whitespace-pre-line font-sans text-[14px] leading-5 tracking-[0.2px] text-content-helper">
                {candidate.explanation}
              </p>
            </div>
          </div>

          {/* Top skills + availability — Figma 7249:74440, gap 19 */}
          <div className="flex flex-col gap-[19px]">
            <div className="flex flex-col gap-[10px]">
              <p className="font-sans text-[16px] leading-6 tracking-[0.2px] text-[#999999]">
                {CARD_LABELS.topSkills}
              </p>
              <div className="flex flex-wrap items-center gap-[6px]">
                {candidate.topSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-[6px] border border-border-pill bg-neutral px-[8px] pb-[2.59px] pt-[1px] font-sans text-[14px] leading-6 tracking-[0.2px] text-[#595959]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <p className="font-sans text-[16px] leading-6 tracking-[0.2px] text-neutral-dark-hover">
                {CARD_LABELS.availability}
              </p>
              <div className="flex items-center gap-[8px]">
                {/* Figma: #22c55e when immediately available, #c0392b when not */}
                <span
                  className={classNames(
                    'size-[8px] shrink-0 rounded-full',
                    candidate.available ? 'bg-[#22c55e]' : 'bg-danger'
                  )}
                />
                <span className="font-sans text-[14px] leading-5 tracking-[0.2px] text-black">
                  {candidate.availability}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA row — Figma 7249:74492, right-aligned, gap 11.99, pt 24 */}
        <div className="flex items-center justify-end gap-[11.99px] pt-[24px]">
          <button
            type="button"
            onClick={() => {
              log('branch', { action: 'view-profile', id: candidate.id, wired: false });
              onViewProfile?.(candidate.id);
            }}
            className="inline-flex h-[40px] items-center justify-center rounded-[10.36px] border-[2.07px] border-black/30 bg-white px-[16.58px] font-sans text-[14px] font-medium leading-[16.71px] tracking-[0.1px] text-black shadow-[0_4.14px_0_0_#111111] transition-all duration-300 ease-in active:translate-y-[4px] active:shadow-none"
          >
            {CARD_LABELS.viewProfile}
          </button>
          <button
            type="button"
            onClick={() => {
              log('branch', { action: 'start-conversation', id: candidate.id, wired: false });
              onStartConversation?.(candidate.id);
            }}
            className="inline-flex h-[40px] items-center justify-center gap-[7.17px] rounded-[11.95px] border-[2.39px] border-brand-green-dark bg-brand-green px-[19.12px] font-sans text-[14px] font-medium leading-[16.71px] tracking-[0.12px] text-white shadow-[0_4.78px_0_0_#224626] transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4.78px] active:shadow-none"
          >
            <ConversationIcon className="size-[22px] shrink-0" />
            {CARD_LABELS.startConversation}
          </button>
        </div>
      </div>
    </article>
  );
};

export default CandidateCard;
