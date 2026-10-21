import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { MilestoneTrophyIcon } from '../../../shared/assets.jsx';
import Button from '../../../ui/Button.jsx';
import { CARD, CHIP_BORDER, DISPLAY, EYEBROW, FOCUS, GUTTER } from './portfolioStyles.js';
import {
  PortfolioArrowRightIcon,
  PortfolioCalendarIcon,
  PortfolioChartBarIcon,
  PortfolioDragIcon,
  PortfolioEditIcon,
  PortfolioEyeIcon,
  PortfolioFolderIcon,
  PortfolioImageIcon,
  PortfolioImagePlusIcon,
  PortfolioLinkIcon,
  PortfolioPinIcon,
  PortfolioPlusIcon,
  PortfolioStarBigIcon,
  PortfolioTextIcon,
  PortfolioTrendUpIcon,
  PortfolioUserIcon,
  PortfolioUsersIcon,
} from './portfolioIcons.jsx';

const log = debug('PortfolioParts');

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

/* Playful-only sticker (genz:sticker) — tilt in degrees, CSS clockwise (Figma +4 = CSS -4). */
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

/* Playful-only doodle star (genz:doodle star), coloured through the text colour class. */
export const Star = ({ className, color }) => (
  <span
    data-doodle=""
    aria-hidden="true"
    className={classNames('pointer-events-none absolute hidden playful:block', color, className)}
  >
    <PortfolioStarBigIcon className="size-full" />
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

export const SectionEyebrow = ({ children }) => (
  <span className={classNames(EYEBROW, 'text-[#595959]')}>{children}</span>
);

/* ---------- Hero ---------- */
const HERO_ROWS = [
  { Icon: PortfolioLinkIcon, title: 'A live link or repo', sub: 'Recruiters open it first' },
  {
    Icon: PortfolioTrendUpIcon,
    title: 'One result with a number',
    sub: '“Used by 200+ commuters”',
  },
  { Icon: PortfolioUserIcon, title: 'Your exact role', sub: 'Not just “team project”' },
];

export const PortfolioHero = ({ sticker }) => (
  <section
    className={classNames(
      'w-full bg-[linear-gradient(90deg,#ebf1ec_0%,#faf4e8_100%)] pt-[34px] pb-[12px] max-lg:pt-[24px] max-lg:pb-[20px]',
      GUTTER
    )}
    aria-labelledby="portfolio-hero-title"
  >
    <div className="mx-auto flex w-full max-w-[1600px] items-start justify-between gap-[clamp(24px,3.7vw,64px)] max-lg:flex-col">
      <div className="relative flex w-full max-w-[760px] flex-col gap-[12px]">
        <span className={classNames(EYEBROW, 'text-[#387440]')}>PORTFOLIO</span>
        <Sticker rotate={-4} className="self-start lg:!hidden">
          {sticker}
        </Sticker>
        <div className="relative w-fit max-w-full">
          <h1
            id="portfolio-hero-title"
            className={classNames(
              'm-0 font-sans text-[clamp(28px,2.72vw,47px)] leading-[1.107] font-semibold text-[#111]',
              DISPLAY
            )}
          >
            <span className="text-[#1c2a21]">Show, </span>
            <span className="text-[#387440]">don’t just tell.</span>
          </h1>
          <span className="absolute top-[24px] left-[calc(100%-17px)] max-lg:hidden">
            <Sticker rotate={-4} className="!flex">
              {sticker}
            </Sticker>
            <Star
              color="text-[#c8951a]"
              className="top-[-20px] left-[calc(100%+15px)] size-[24px]"
            />
            <Star
              color="text-[#387440]"
              className="top-[22px] left-[calc(100%+41px)] size-[13px]"
            />
          </span>
        </div>
        <p className="m-0 max-w-[660px] font-sans text-[16px] leading-[24px] text-[#595959]">
          Apps, designs, research, data projects, hardware builds: anything you made counts. Add 2–6
          and pin your best one.
        </p>
      </div>
      <div
        className={classNames(
          'flex w-full shrink-0 flex-col gap-[10px] rounded-[24px] bg-white px-[22px] py-[20px] lg:w-[clamp(340px,26.6vw,460px)]',
          CARD
        )}
      >
        <h2 className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          What makes a strong project
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
const RailRow = ({ icon, title, sub }) => (
  <div className="flex items-start gap-[12px]">
    <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec]">
      {icon}
    </span>
    <span className="flex min-w-0 flex-col gap-[2px]">
      <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
        {title}
      </span>
      <span className="font-sans text-[13px] leading-[19px] text-[#595959]">{sub}</span>
    </span>
  </div>
);

export const PortfolioRail = () => (
  <aside className="flex w-full flex-col gap-[20px] self-start">
    <section
      aria-labelledby="portfolio-why"
      className={classNames('flex flex-col gap-[14px] rounded-[24px] bg-white p-[24px]', CARD)}
    >
      <h2
        id="portfolio-why"
        className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]"
      >
        Why portfolio matters
      </h2>
      <RailRow
        icon={<PortfolioEyeIcon className="h-[15px] w-[16px] text-[#387440]" />}
        title="Proof beats claims"
        sub="Recruiters spend the most time on projects."
      />
      <RailRow
        icon={<PortfolioPinIcon className="size-[16px] text-[#387440]" />}
        title="Your pinned project leads"
        sub="It shows first on your card and in search results."
      />
    </section>
    <section
      aria-labelledby="portfolio-close"
      className={classNames('flex flex-col gap-[14px] rounded-[24px] bg-white p-[24px]', CARD)}
    >
      <h2
        id="portfolio-close"
        className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]"
      >
        Top 20% is close
      </h2>
      <RailRow
        icon={<MilestoneTrophyIcon className="size-[16px]" />}
        title="Finish this stage"
        sub="Portfolio is stage 6. It unlocks the Top 20% milestone."
      />
    </section>
  </aside>
);

/* ---------- Project card ---------- */
const TILE_GLYPHS = {
  image: PortfolioImageIcon,
  chartBar: PortfolioChartBarIcon,
  users: PortfolioUsersIcon,
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

const ProjectLink = ({ link }) => {
  const body = (
    <>
      <PortfolioLinkIcon className="size-[14px] shrink-0" />
      {link.label}
    </>
  );
  const cls =
    'inline-flex items-center gap-[5px] font-sans text-[13px] leading-[16px] font-semibold text-[#387440]';
  if (!link.url) return <span className={cls}>{body}</span>;
  const href = /^https?:\/\//i.test(link.url) ? link.url : `https://${link.url}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={classNames(cls, 'min-h-[24px] no-underline', FOCUS)}
    >
      {body}
    </a>
  );
};

export const ProjectCard = ({
  project,
  example = false,
  onEdit,
  dragProps,
  onMove,
  isFirst,
  isLast,
}) => {
  const filled = example ? false : project.pinned;
  const Glyph = TILE_GLYPHS[project.icon] ?? PortfolioImageIcon;
  return (
    <article
      {...(dragProps || {})}
      aria-label={project.title}
      className={classNames(
        'relative flex items-start gap-[16px] rounded-[20px] bg-white py-[20px] pr-[20px] pl-[18px] max-sm:gap-[12px]',
        example
          ? 'border border-solid border-[#c1d4c4] shadow-[0_2px_8px_rgba(18,38,20,0.02)] playful:shadow-[0_4px_12px_rgba(18,38,20,0.04)]'
          : CARD
      )}
    >
      {!example && project.pinned ? (
        <Sticker rotate={4} className="absolute -top-[17px] right-[56px]">
          PINNED
        </Sticker>
      ) : null}
      {example ? null : (
        <button
          type="button"
          aria-label={`Reorder ${project.title}. Drag, or use the up and down arrow keys.`}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp' && !isFirst) {
              e.preventDefault();
              onMove?.(-1);
            } else if (e.key === 'ArrowDown' && !isLast) {
              e.preventDefault();
              onMove?.(1);
            }
          }}
          className={classNames(
            'mt-[1px] flex size-[24px] shrink-0 cursor-grab items-center justify-center border-0 bg-transparent p-0 text-[#babab7] max-sm:hidden',
            FOCUS
          )}
        >
          <PortfolioDragIcon className="size-[18px]" />
        </button>
      )}
      <span
        className={classNames(
          'flex size-[52px] shrink-0 items-center justify-center rounded-[14px]',
          filled ? `bg-[#387440] ${CARD}` : 'bg-[#ebf1ec]'
        )}
      >
        <Glyph className={classNames('size-[24px]', filled ? 'text-white' : 'text-[#387440]')} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[6px] [&_h3]:m-0">
        <div className="flex flex-wrap items-center gap-[10px]">
          <h3 className="font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
            {project.title}
          </h3>
          {example ? (
            <Chip tone="gold" size={11}>
              Example
            </Chip>
          ) : (
            <Chip size={11}>{project.type}</Chip>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[4px]">
          <Meta Icon={PortfolioCalendarIcon}>{project.year}</Meta>
          <Meta Icon={PortfolioUserIcon}>{project.role}</Meta>
        </div>
        {project.description ? (
          <p className="m-0 font-sans text-[14px] leading-[21px] text-[#1c2a21]">
            {project.description}
          </p>
        ) : null}
        {project.tags?.length ? (
          <div className="flex flex-wrap gap-[6px]">
            {project.tags.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        ) : null}
        {project.links?.length ? (
          <div className="flex flex-wrap gap-x-[14px] gap-y-[4px]">
            {project.links.map((l, i) => (
              <ProjectLink key={`${l.label}-${i}`} link={l} />
            ))}
          </div>
        ) : null}
      </div>
      {example ? null : (
        <button
          type="button"
          aria-label={`Edit ${project.title}`}
          onClick={onEdit}
          className={classNames(
            'flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#e7e7e7] bg-white p-0 text-[#1c2a21]',
            FOCUS
          )}
        >
          <PortfolioEditIcon className="size-[16px]" />
        </button>
      )}
    </article>
  );
};

/* ---------- Empty state (PF-01) ---------- */
const HOW = [
  {
    Icon: PortfolioImagePlusIcon,
    title: '1. Add a cover',
    sub: 'A screenshot is enough.',
  },
  { Icon: PortfolioTextIcon, title: '2. Say what you did', sub: 'Your role and one result.' },
  { Icon: PortfolioLinkIcon, title: '3. Link it', sub: 'Live demo, repo, Figma or Notion.' },
];

const SIDE_TILE = classNames(
  'flex size-[64px] items-center justify-center rounded-[22px] bg-[#ebf1ec] playful:size-[72px]',
  CARD
);

export const EmptyState = ({ onAdd, onPasteLink, onSkip }) => (
  <div
    className={classNames(
      'relative flex flex-col items-center gap-[16px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white px-[clamp(16px,2.8vw,48px)] pt-[44px] pb-[36px] shadow-[0_5px_17px_rgba(18,38,20,0.03)] playful:shadow-[0_8px_24px_rgba(18,38,20,0.06)] max-sm:pt-[28px] lg:-mr-[clamp(0px,1.97vw,34px)]'
    )}
  >
    <Star color="text-[#ffd86b]" className="top-[40px] left-[340px] size-[24px] max-xl:hidden" />
    <Star color="text-[#387440]" className="top-[60px] left-[700px] size-[14px] max-xl:hidden" />
    <div className="flex h-[80px] items-center" aria-hidden="true">
      <span className={SIDE_TILE}>
        <PortfolioImageIcon className="size-[28px] text-[#387440] playful:size-[32px]" />
      </span>
      <span
        className={classNames(
          'relative z-10 -mx-[7px] flex size-[80px] items-center justify-center rounded-[22px] bg-[#c8951a]',
          CARD
        )}
      >
        <PortfolioFolderIcon className="size-[36px] text-white" />
      </span>
      <span className={SIDE_TILE}>
        <PortfolioLinkIcon className="size-[28px] text-[#387440] playful:size-[32px]" />
      </span>
    </div>
    <AccentTitle
      as="h2"
      lead="No projects yet. "
      accent="Show us one."
      className="text-center text-[clamp(24px,1.85vw,32px)] leading-[1.2]"
    />
    <p className="m-0 max-w-[640px] text-center font-sans text-[16px] leading-[24px] text-[#595959]">
      A web app, a design case study, a data analysis, a research paper, a hardware build. One
      documented project beats none.
    </p>
    <div className="flex flex-wrap items-center justify-center gap-[12px]">
      <Button
        variant="primary"
        size="md"
        onClick={onAdd}
        rightIcon={<PortfolioArrowRightIcon className="size-full" />}
      >
        Add your first project
      </Button>
      <Button variant="tertiary-subtle" size="lg" onClick={onPasteLink} className="!py-[14px]">
        Paste a link
      </Button>
    </div>
    <button
      type="button"
      onClick={onSkip}
      className={classNames(
        'min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#595959]',
        FOCUS
      )}
    >
      Nothing to show yet? Skip this stage
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
export const AddAnotherProject = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'flex min-h-[60px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[20px] border border-solid border-[#387440] bg-[#ebf1ec] p-[20px] font-sans text-[15px] leading-[18px] font-semibold text-[#387440] playful:border-[1.5px]',
      FOCUS
    )}
  >
    <PortfolioPlusIcon className="size-[18px]" />
    Add another project
  </button>
);

export const ListHeader = ({ count }) => (
  <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
    <h2
      className={classNames(
        'm-0 font-sans text-[clamp(24px,1.68vw,29px)] leading-[1.2] font-semibold text-[#1c2a21]',
        DISPLAY
      )}
    >
      Your projects
    </h2>
    <Chip tone="grey">
      {count} {count === 1 ? 'project' : 'projects'}
    </Chip>
    <span className="ml-auto inline-flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
      <PortfolioDragIcon className="size-[14px]" />
      Drag to reorder
    </span>
  </div>
);

log('module loaded');
