import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { CARD, CHIP_BORDER, DISPLAY, EYEBROW, GUTTER } from './workStyles.js';
import {
  WorkArrowRightIcon,
  WorkCalendarIcon,
  WorkCompanyIcon,
  WorkDragIcon,
  WorkEditIcon,
  WorkGameIcon,
  WorkLabelIcon,
  WorkMortarIcon,
  WorkPlusIcon,
  WorkSearchIcon,
  WorkShieldIcon,
  WorkStarIcon,
  WorkSuitcaseIcon,
  WorkTrendUpIcon,
  WorkWorkIcon,
} from './workIcons.jsx';

/* Two-tone heading: `lead` in ink, `accent` in brand green (Figma mixed runs). */
export const AccentTitle = ({ as = 'h2', lead, accent, id, className }) => {
  const Tag = as;
  return (
    <Tag id={id} className={classNames('m-0 font-sans font-semibold', DISPLAY, className)}>
      <span className="text-[#1c2a21]">{lead}</span>
      <span className="text-[#387440]">{accent}</span>
    </Tag>
  );
};

/* Playful-only sticker (genz:sticker) — tilt in degrees, CSS clockwise. */
export const Sticker = ({ children, rotate = -4, className }) => (
  <span
    data-sticker=""
    style={{ transform: `rotate(${rotate}deg)` }}
    className={classNames(
      'hidden items-center rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] leading-[14px] font-bold tracking-[0.4px] whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-flex',
      className
    )}
  >
    {children}
  </span>
);

export const Star = ({ className, color }) => (
  <span
    data-doodle=""
    aria-hidden="true"
    className={classNames('pointer-events-none absolute hidden playful:block', color, className)}
  >
    <WorkStarIcon className="size-full" />
  </span>
);

export const Chip = ({ children, tone = 'green', className, size = 12 }) => (
  <span
    className={classNames(
      'inline-flex items-center rounded-full px-[10px] py-[4px] font-sans font-semibold whitespace-nowrap',
      size === 11 ? 'text-[11px] leading-[13px] max-lg:text-[12px]' : 'text-[12px] leading-[14px]',
      tone === 'green' && `bg-[#ebf1ec] text-[#387440] ${CHIP_BORDER}`,
      tone === 'grey' && `bg-[#f7f8f4] text-[#595959] ${CHIP_BORDER}`,
      tone === 'gold' &&
        'border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] text-[#1c2a21] playful:border-[#1c2a21]',
      className
    )}
  >
    {children}
  </span>
);

/* ---------- Hero ---------- */
const HERO_ROWS = [
  { Icon: WorkCalendarIcon, title: 'Real dates', sub: 'Even 3 months counts' },
  {
    Icon: WorkTrendUpIcon,
    title: 'Impact with a number',
    sub: '“Cut load time by 35%” beats “responsible for”',
  },
  { Icon: WorkLabelIcon, title: 'Tools you used', sub: 'They become searchable tags' },
];

export const WorkHero = ({ sticker }) => (
  <section
    className={classNames(
      'w-full bg-[linear-gradient(90deg,#ebf1ec_0%,#faf4e8_100%)] pt-[34px] pb-[12px] max-lg:pt-[24px] max-lg:pb-[20px]',
      GUTTER
    )}
    aria-labelledby="work-hero-title"
  >
    <div className="mx-auto flex w-full max-w-[1600px] items-start justify-between gap-[clamp(24px,3.7vw,64px)] max-lg:flex-col">
      <div className="relative flex w-full max-w-[760px] flex-col gap-[12px]">
        <span className={classNames(EYEBROW, 'text-[#387440]')}>WORK</span>
        <Sticker rotate={-4} className="self-start lg:!hidden">
          {sticker}
        </Sticker>
        <div className="relative w-fit max-w-full">
          <h1
            id="work-hero-title"
            className={classNames(
              'm-0 font-sans text-[clamp(28px,2.72vw,47px)] leading-[1.107] font-semibold text-[#111]',
              DISPLAY
            )}
          >
            <span className="text-[#1c2a21]">Where you’ve </span>
            <span className="text-[#387440]">actually been.</span>
          </h1>
          <span className="absolute top-[24px] left-[calc(100%-50px)] max-lg:hidden">
            <Sticker rotate={-4} className="!flex">
              {sticker}
            </Sticker>
            <Star color="text-[#c8951a]" className="top-[-44px] left-[161px] size-[24px]" />
            <Star color="text-[#387440]" className="top-[22px] left-[187px] size-[13px]" />
          </span>
        </div>
        <p className="m-0 max-w-[660px] font-sans text-[16px] leading-[24px] text-[#595959]">
          Full-time, internship, freelance, national service, volunteering: it all counts. Add your
          roles with dates and what you achieved.
        </p>
      </div>
      <div
        className={classNames(
          'flex w-full shrink-0 flex-col gap-[10px] rounded-[24px] bg-white px-[22px] py-[20px] lg:w-[clamp(340px,26.6vw,460px)]',
          CARD
        )}
      >
        <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          What makes a strong role
        </h2>
        {HERO_ROWS.map((row) => {
          const Glyph = row.Icon;
          return (
            <div key={row.title} className="flex items-center gap-[10px]">
              <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-[#ebf1ec]">
                <Glyph className="size-[16px] text-[#387440]" />
              </span>
              <span className="flex min-w-0 flex-col gap-[1px]">
                <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
                  {row.title}
                </span>
                <span className="font-sans text-[12px] leading-[14px] text-[#595959]">
                  {row.sub}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ---------- Rail ---------- */
export const WhyRail = () => (
  <aside
    className={classNames(
      'flex w-full flex-col gap-[14px] self-start rounded-[24px] bg-white p-[24px]',
      CARD
    )}
    aria-labelledby="work-why"
  >
    <h2
      id="work-why"
      className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]"
    >
      Why work matters
    </h2>
    {[
      {
        Icon: WorkSearchIcon,
        title: 'Recruiters filter by experience',
        sub: 'Your roles feed seniority and industry matching.',
      },
      {
        Icon: WorkShieldIcon,
        title: 'Your data stays yours',
        sub: 'Manual entry only. Nothing is imported without your say-so.',
      },
    ].map((row) => {
      const Glyph = row.Icon;
      return (
        <div key={row.title} className="flex items-start gap-[12px]">
          <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec]">
            <Glyph className="size-[16px] text-[#387440]" />
          </span>
          <span className="flex min-w-0 flex-col gap-[2px]">
            <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
              {row.title}
            </span>
            <span className="font-sans text-[13px] leading-[19px] text-[#595959]">{row.sub}</span>
          </span>
        </div>
      );
    })}
  </aside>
);

/* ---------- Role card ---------- */
const TypeTile = ({ role, filled }) => {
  const Glyph = role.type === 'National service' ? WorkMortarIcon : WorkWorkIcon;
  return (
    <span
      className={classNames(
        'flex size-[52px] shrink-0 items-center justify-center rounded-[14px]',
        filled ? `bg-[#387440] ${CARD}` : 'bg-[#ebf1ec]'
      )}
    >
      <Glyph className={classNames('size-[24px]', filled ? 'text-white' : 'text-[#387440]')} />
    </span>
  );
};

const Meta = ({ Icon, children }) => {
  const Glyph = Icon;
  return (
    <span className="inline-flex items-center gap-[5px] font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
      <Glyph className="size-[14px] shrink-0" />
      {children}
    </span>
  );
};

export const RoleCard = ({ role, example = false, onEdit, dragProps, onMove, isFirst, isLast }) => {
  const meta = [role.org, role.place].filter(Boolean).join(' · ');
  const showCurrentSticker = !example && role.current;
  return (
    <article
      {...(dragProps || {})}
      className={classNames(
        'relative flex items-start gap-[16px] rounded-[20px] bg-white py-[20px] pr-[20px] pl-[18px] max-sm:gap-[12px]',
        CARD
      )}
      aria-label={role.title}
    >
      {showCurrentSticker ? (
        <Sticker rotate={4} className="absolute -top-[18px] right-[52px]">
          CURRENT
        </Sticker>
      ) : null}
      {example ? null : (
        <button
          type="button"
          aria-label={`Reorder ${role.title}. Drag, or use the up and down arrow keys.`}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp' && !isFirst) {
              e.preventDefault();
              onMove?.(-1);
            } else if (e.key === 'ArrowDown' && !isLast) {
              e.preventDefault();
              onMove?.(1);
            }
          }}
          className="mt-[1px] flex size-[24px] shrink-0 cursor-grab items-center justify-center border-0 bg-transparent p-0 text-[#babab7] max-sm:hidden"
        >
          <WorkDragIcon className="size-[18px]" />
        </button>
      )}
      <TypeTile role={role} filled={showCurrentSticker || example} />
      <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
        <div className="flex flex-wrap items-center gap-[10px]">
          <h3 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
            {role.title}
          </h3>
          {example ? (
            <Chip tone="gold" size={11}>
              Example
            </Chip>
          ) : (
            <Chip size={11}>{role.type}</Chip>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[4px]">
          {meta ? <Meta Icon={WorkCompanyIcon}>{meta}</Meta> : null}
          <Meta Icon={WorkCalendarIcon}>{role.rangeLabel}</Meta>
          {example ? <Meta Icon={WorkSuitcaseIcon}>{role.type}</Meta> : null}
        </div>
        {role.description ? (
          <p className="m-0 font-sans text-[14px] leading-[21px] text-[#1c2a21]">
            {role.description}
          </p>
        ) : null}
        {role.tools?.length ? (
          <div className="flex flex-wrap gap-[6px]">
            {role.tools.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        ) : null}
      </div>
      {example ? null : (
        <button
          type="button"
          aria-label={`Edit ${role.title}`}
          onClick={onEdit}
          className="flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#e7e7e7] bg-white p-0 text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <WorkEditIcon className="size-[16px]" />
        </button>
      )}
    </article>
  );
};

/* ---------- Empty state (WK-01) ---------- */
const HOW = [
  { Icon: WorkPlusIcon, title: '1. Add the role', sub: 'Title, organisation, dates and type.' },
  {
    Icon: WorkTrendUpIcon,
    title: '2. Show the impact',
    sub: '1–3 lines with a number if you can.',
  },
  { Icon: WorkLabelIcon, title: '3. Tag your tools', sub: 'They become searchable skills.' },
];

const SIDE_TILE =
  'flex size-[72px] items-center justify-center rounded-[22px] bg-[#ebf1ec] focused:size-[64px]';

export const EmptyState = ({ onAdd, onImport, onSkip }) => (
  <div
    className={classNames(
      'relative flex flex-col items-center gap-[16px] rounded-[24px] bg-white px-[clamp(16px,2.8vw,48px)] pt-[44px] pb-[36px] max-sm:pt-[28px]',
      CARD
    )}
  >
    <Star color="text-[#ffd86b]" className="top-[40px] left-[340px] size-[24px] max-xl:!hidden" />
    <Star color="text-[#387440]" className="top-[60px] left-[700px] size-[14px] max-xl:!hidden" />
    <div className="flex h-[80px] items-center" aria-hidden="true">
      <span className={classNames(SIDE_TILE, CARD)}>
        <WorkSuitcaseIcon className="size-[32px] text-[#387440] focused:size-[28px]" />
      </span>
      <span
        className={classNames(
          'relative z-10 -mx-[14px] flex size-[80px] items-center justify-center rounded-[22px] bg-[#c8951a]',
          CARD
        )}
      >
        <WorkWorkIcon className="size-[36px] text-white" />
      </span>
      <span className={classNames(SIDE_TILE, CARD)}>
        <WorkCompanyIcon className="size-[32px] text-[#387440] focused:size-[28px]" />
      </span>
    </div>
    <AccentTitle
      as="h2"
      lead="No roles yet. Start with "
      accent="your latest."
      className="text-center text-[clamp(24px,1.85vw,32px)] leading-[1.2]"
    />
    <p className="m-0 max-w-[640px] text-center font-sans text-[16px] leading-[24px] text-[#595959]">
      A job, an internship, your national service posting, a freelance gig, a volunteer role:
      anything where you showed up and did the work.
    </p>
    <div className="flex flex-wrap items-center justify-center gap-[12px]">
      <Button
        variant="primary"
        size="md"
        onClick={onAdd}
        rightIcon={<WorkArrowRightIcon className="size-full" />}
      >
        Add your first role
      </Button>
      <Button variant="tertiary-subtle" size="lg" onClick={onImport} className="!py-[14px]">
        Import from my CV
      </Button>
    </div>
    <button
      type="button"
      onClick={onSkip}
      className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      No work experience yet? Skip this stage
    </button>
    <div className="mt-[4px] grid w-full grid-cols-3 gap-[16px] border-t border-solid border-[#e7e7e7] pt-[22px] max-md:grid-cols-1">
      {HOW.map((step) => {
        const Glyph = step.Icon;
        return (
          <div key={step.title} className="flex items-start gap-[12px]">
            <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec]">
              <Glyph className="size-[18px] text-[#387440]" />
            </span>
            <span className="flex min-w-0 flex-col gap-[3px]">
              <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                {step.title}
              </span>
              <span className="font-sans text-[13px] leading-[19px] text-[#595959]">
                {step.sub}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

/* ---------- List extras ---------- */
export const AddAnotherRole = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex min-h-[60px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[20px] border border-dashed border-[#387440] bg-[#ebf1ec] p-[20px] font-sans text-[15px] leading-[18px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green playful:border-[1.5px]"
  >
    <WorkPlusIcon className="size-[18px]" />
    Add another role
  </button>
);

export const LabNudge = ({ onOpen }) => (
  <div
    className={classNames(
      'flex items-center gap-[14px] rounded-[18px] bg-[#faf4e8] py-[16px] pr-[16px] pl-[18px] max-md:flex-wrap',
      CARD
    )}
  >
    <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#c8951a]">
      <WorkGameIcon className="size-[20px] text-white" />
    </span>
    <span className="flex min-w-0 flex-1 flex-col gap-[2px] max-md:basis-[calc(100%-60px)]">
      <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
        Your roles mention TypeScript and Django
      </span>
      <span className="font-sans text-[13px] leading-[16px] text-[#595959] max-lg:leading-[19px]">
        Verify them in Skills Lab so recruiters see the Verified badge next to this work.
      </span>
    </span>
    <Button
      variant="primary"
      size="sm"
      onClick={onOpen}
      rightIcon={<WorkArrowRightIcon className="size-full" />}
    >
      Open Skills Lab
    </Button>
  </div>
);

export const ListHeader = ({ count }) => (
  <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
    <h2
      className={classNames(
        'm-0 font-sans text-[clamp(24px,1.68vw,29px)] leading-[1.2] font-semibold text-[#1c2a21]',
        DISPLAY
      )}
    >
      Your work experience
    </h2>
    <Chip tone="grey">
      {count} {count === 1 ? 'role' : 'roles'}
    </Chip>
    <span className="ml-auto inline-flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
      <WorkDragIcon className="size-[14px]" />
      Drag to reorder
    </span>
  </div>
);

export const SectionEyebrow = ({ children }) => (
  <span className={classNames(EYEBROW, 'text-[#595959]')}>{children}</span>
);
