import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { isLoggedIn } from '../../../services/auth.api.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { ProfileBulbGlyph, ProfilePlusGlyph } from '../../shared/assets.jsx';
import {
  EXPERIENCE_ADD,
  EXPERIENCE_EDUCATION,
  EXPERIENCE_GAPS,
  EXPERIENCE_IMPORT,
  EXPERIENCE_TIP,
  EXPERIENCE_WORK,
} from './talentProfileTabsData.js';
import { EditButton, ProfileCard, ProfileChip, Tag, TabLayout } from './ProfileTabsUi.jsx';
import { CARD_PLAIN, GLYPHS, PAD, SHELF, TITLE, TITLE_SM } from './profileTabsStyles.js';

const log = debug('ProfileExperienceTab');

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/* 48px rounded tile: Focused = hairline + soft drop, Playful = ink border + 4px shelf. */
const IconTile = ({ name, bg }) => {
  const Glyph = GLYPHS[name];
  return (
    <span
      aria-hidden="true"
      className={classNames(
        'flex size-[48px] shrink-0 items-center justify-center rounded-[14px]',
        SHELF
      )}
      style={{ background: bg }}
    >
      <Glyph className="size-[23px]" />
    </span>
  );
};

const WorkItem = ({ item, last, onEdit }) => (
  <li className="flex items-start gap-[18px]">
    <div className="flex shrink-0 flex-col items-center self-stretch">
      <IconTile name={item.icon} bg={item.iconBg} />
      {last ? null : <span aria-hidden="true" className="min-h-px w-[2px] flex-1 bg-[#e6e6e6]" />}
    </div>
    <div className="flex min-w-0 flex-1 flex-col items-start gap-[6px] pb-[28px]">
      <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px]">
        <h3 className="text-[17px] leading-[normal] font-semibold text-[#1c2a21]">{item.title}</h3>
        {item.chips.map((c) => (
          <ProfileChip key={c.label} tone={c.tone} icon={c.icon ? 'check' : undefined}>
            {c.label}
          </ProfileChip>
        ))}
      </div>
      <p className="text-[14px] leading-[normal] font-medium text-[#595959]">{item.org}</p>
      <p className="text-[13px] leading-[normal] text-[#737373]">{item.dates}</p>
      <ul className="flex flex-col gap-[4px] pt-[4px] text-[14px] leading-[normal] text-[#595959]">
        {item.bullets.map((b) => (
          <li key={b} className="whitespace-pre-wrap">
            {b}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-[6px] pt-[6px]">
        {item.tags.map((t) => (
          <ProfileChip key={t}>{t}</ProfileChip>
        ))}
      </div>
    </div>
    {onEdit ? <EditButton label={`Edit ${item.title}`} onClick={onEdit} /> : null}
  </li>
);

const EducationItem = ({ item, onEdit }) => (
  <li className="flex items-start gap-[18px]">
    <IconTile name={item.icon} bg={item.iconBg} />
    <div className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
      <h3 className="text-[17px] leading-[normal] font-semibold text-[#1c2a21]">{item.title}</h3>
      <p className="text-[14px] leading-[normal] font-medium text-[#595959]">{item.org}</p>
      <p className="text-[13px] leading-[normal] whitespace-pre-wrap text-[#737373]">{item.meta}</p>
      {/* Education v2 subjects (live data): electives first, ★ = enjoys. */}
      {item.subjects?.length ? (
        <div className="flex flex-wrap gap-[6px] pt-[6px]">
          {[...item.subjects]
            .sort((a, b) => (a.kind === 'elective' ? -1 : 1) - (b.kind === 'elective' ? -1 : 1))
            .map((sub) => (
              <ProfileChip key={sub.name} tone={sub.enjoys ? 'green' : 'white'}>
                {sub.enjoys ? `${sub.name} ★` : sub.name}
              </ProfileChip>
            ))}
        </div>
      ) : null}
    </div>
    {onEdit ? <EditButton label={`Edit ${item.title}`} onClick={onEdit} /> : null}
  </li>
);

const TipCard = ({ onImprove }) => (
  <section
    aria-label={EXPERIENCE_TIP.title}
    className={classNames(
      'flex min-w-0 flex-col items-start gap-[12px] rounded-[20px] bg-[#faf4e8]',
      SHELF,
      PAD
    )}
  >
    <Tag size={12} className="playful:rotate-3">
      {EXPERIENCE_TIP.sticker}
      <ProfileBulbGlyph className="size-[14px] shrink-0" />
    </Tag>
    <h2 className={TITLE_SM}>{EXPERIENCE_TIP.title}</h2>
    <p className="text-[14px] leading-[1.5] text-[#463409]">{EXPERIENCE_TIP.text}</p>
    <Button variant="tertiary" size="sm" onClick={onImprove}>
      {EXPERIENCE_TIP.cta}
    </Button>
  </section>
);

/*
 * ProfileExperienceTab — P-03 (Figma Focused 8110:369265 / Playful 7571:1007). Timeline of work and
 * volunteering, education, and the dashed "add" card on the left; Buddy tip, CV import and gaps note on
 * the right. Anything that adds a role opens the Add experience modal (`modal=experience`).
 * Live (signed in): the modal appends a new role; editing a saved role opens the Work stage, which edits and removes
 * roles. Education has no edit screen after onboarding yet, so its "+ Add" and pencils are demo-only.
 */
const ProfileExperienceTab = ({ profile }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const live = isLoggedIn() && params.get('demo') !== '1';

  useEffect(() => {
    log('mount', { tab: profile?.tab });
  }, [profile?.tab]);

  const openModal = () => {
    log('open experience modal');
    profile?.update?.({ modal: 'experience' });
  };

  const editRole = live ? () => navigate('/profile/filling/work') : openModal;

  const work = EXPERIENCE_WORK;
  const edu = EXPERIENCE_EDUCATION;

  return (
    <TabLayout
      tab="experience"
      left={
        <>
          <ProfileCard title={work.title} link={work.add} onLink={openModal}>
            {work.items.length ? null : (
              <p className="text-[14px] leading-[1.5] text-[#737373]">
                Nothing here yet. Jobs, gigs, apprenticeships, side hustles and volunteering all
                count.
              </p>
            )}
            <ul className="flex flex-col">
              {work.items.map((item, i) => (
                <WorkItem
                  key={item.key}
                  item={item}
                  last={i === work.items.length - 1}
                  onEdit={editRole}
                />
              ))}
            </ul>
          </ProfileCard>

          <ProfileCard title={edu.title} link={live ? '' : edu.add} onLink={openModal}>
            {edu.items.length ? null : (
              <p className="text-[14px] leading-[1.5] text-[#737373]">
                Add your school or college.
              </p>
            )}
            <ul className="flex flex-col gap-[16px]">
              {edu.items.map((item) => (
                <EducationItem key={item.key} item={item} onEdit={live ? undefined : openModal} />
              ))}
            </ul>
          </ProfileCard>

          <button
            type="button"
            onClick={openModal}
            className={classNames(
              'flex w-full cursor-pointer items-center justify-center gap-[12px] rounded-[20px] border-[1.5px] border-dashed border-[#bfbfbf] bg-white p-[20px]',
              FOCUS
            )}
          >
            <ProfilePlusGlyph className="size-[17px] shrink-0" />
            <span className="text-[15px] leading-[normal] font-semibold text-[#2d5d33]">
              {EXPERIENCE_ADD}
            </span>
          </button>
        </>
      }
      right={
        <>
          <TipCard onImprove={() => navigate('/profile/filling/career-buddy')} />

          <section
            aria-label={EXPERIENCE_IMPORT.title}
            className={classNames(CARD_PLAIN, 'flex min-w-0 flex-col items-start gap-[16px]', PAD)}
          >
            <h2 className={TITLE}>{EXPERIENCE_IMPORT.title}</h2>
            <p className="text-[14px] leading-[1.5] text-[#595959]">{EXPERIENCE_IMPORT.text}</p>
            <Button
              variant="tertiary-subtle"
              size="sm"
              onClick={() => navigate('/profile/filling/cv')}
            >
              {EXPERIENCE_IMPORT.cta}
            </Button>
          </section>

          <section
            aria-label={EXPERIENCE_GAPS.title}
            className={classNames(CARD_PLAIN, 'flex min-w-0 flex-col gap-[16px]', PAD)}
          >
            <h2 className={TITLE}>{EXPERIENCE_GAPS.title}</h2>
            <p className="text-[14px] leading-[1.5] text-[#595959]">{EXPERIENCE_GAPS.text}</p>
          </section>
        </>
      }
    />
  );
};

export default ProfileExperienceTab;
