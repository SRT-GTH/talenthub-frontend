import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  ProfileCheckCircleGlyph,
  ProfilePlusGlyph,
  ProfileVerifiedHeadingCheckIcon,
} from '../../shared/assets.jsx';
import endorserFace1 from '../../../assets/talent-profile/tabs/skill-endorser-face-1.png';
import endorserFace2 from '../../../assets/talent-profile/tabs/skill-endorser-face-2.png';
import endorserFace3 from '../../../assets/talent-profile/tabs/skill-endorser-face-3.png';
import {
  SKILLS_ADD,
  SKILLS_FILTERS,
  SKILLS_IN_DEMAND,
  SKILLS_VERIFICATION,
  SKILL_GROUPS,
} from './talentProfileTabsData.js';
import { GlyphTile, HeadLink, Meter, ProfileChip, TabLayout } from './ProfileTabsUi.jsx';
import { CARD_PLAIN, PAD, SHELF, TITLE, TITLE_SM } from './profileTabsStyles.js';

const log = debug('ProfileSkillsTab');

const FACES = [endorserFace1, endorserFace2, endorserFace3];

const FilterBar = ({ active, onSelect, onAdd }) => (
  <div className="flex flex-wrap items-center gap-[8px]">
    {SKILLS_FILTERS.map((f) => (
      <ProfileChip
        key={f.key}
        as="button"
        type="button"
        aria-pressed={active === f.key}
        tone={active === f.key ? 'ink' : 'white'}
        icon={f.icon}
        onClick={() => onSelect(f.key)}
      >
        {f.label}
      </ProfileChip>
    ))}
    <span aria-hidden="true" className="h-px min-w-px flex-1" />
    <Button variant="primary" size="sm" onClick={onAdd}>
      {SKILLS_ADD}
    </Button>
  </div>
);

const Faces = ({ count }) => (
  <span aria-hidden="true" className="flex shrink-0 items-center">
    {FACES.slice(0, count).map((src, i) => (
      <img
        key={src}
        src={src}
        alt=""
        width={24}
        height={24}
        draggable="false"
        className={classNames(
          'size-[24px] rounded-full object-cover',
          i < count - 1 && '-mr-[8px]'
        )}
      />
    ))}
  </span>
);

const SkillRow = ({ row }) => {
  const navigate = useNavigate();
  return (
    <li className="flex flex-wrap items-center gap-x-[14px] gap-y-[12px] py-[14px]">
      <div className="flex min-w-[220px] flex-1 items-center gap-[14px]">
        <GlyphTile name={row.icon} size={44} glyph={23} />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
          <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px]">
            <span className="text-[16px] leading-[normal] font-semibold whitespace-nowrap text-[#1c2a21]">
              {row.name}
            </span>
            <ProfileChip
              tone={row.chip.tone}
              icon={row.chip.label === 'Self-added' ? undefined : 'check'}
            >
              {row.chip.label}
            </ProfileChip>
          </div>
          <p className="text-[12px] leading-[normal] whitespace-pre-wrap text-[#737373]">
            {row.meta}
          </p>
        </div>
      </div>
      <Meter
        pct={row.pct}
        height={8}
        track={row.self ? '#e6e6e6' : '#e1eae2'}
        fill={row.self ? '#bfbfbf' : '#387440'}
        className="w-[180px] max-w-full shrink-0"
      />
      {row.self ? (
        <div className="flex w-[190px] max-w-full shrink-0 items-center justify-end">
          <HeadLink
            onClick={() => {
              log('prove it in Skills Lab', row.key);
              navigate('/skills-lab');
            }}
          >
            {row.cta}
          </HeadLink>
        </div>
      ) : (
        <div className="flex h-[24px] w-[150px] max-w-full shrink-0 items-center justify-end gap-[8px]">
          {row.faces ? <Faces count={row.faces} /> : null}
          {row.endorsed ? (
            <span className="text-[12px] leading-[normal] font-medium whitespace-nowrap text-[#737373]">
              {row.endorsed}
            </span>
          ) : null}
        </div>
      )}
    </li>
  );
};

const SkillGroup = ({ group }) => (
  <section
    aria-label={group.title}
    className={classNames(CARD_PLAIN, 'flex min-w-0 flex-col gap-[16px] overflow-hidden', PAD)}
  >
    <header className="flex flex-wrap items-center gap-x-[10px] gap-y-[2px]">
      <h2 className={TITLE}>{group.title}</h2>
      {group.titleIcon ? (
        <ProfileVerifiedHeadingCheckIcon className="size-[30px] shrink-0" />
      ) : null}
      <span aria-hidden="true" className="h-px min-w-px flex-1" />
      <p className="text-[13px] leading-[normal] text-[#737373]">{group.hint}</p>
    </header>
    <ul className="flex flex-col">
      {group.rows.map((row, i) => (
        <Fragment key={row.key}>
          {i > 0 ? <li aria-hidden="true" className="h-px w-full bg-[#e6e6e6]" /> : null}
          <SkillRow row={row} />
        </Fragment>
      ))}
    </ul>
  </section>
);

const VerificationCard = () => (
  <section
    aria-label={SKILLS_VERIFICATION.title}
    className={classNames('flex min-w-0 flex-col gap-[12px] rounded-[20px] bg-white', SHELF, PAD)}
  >
    <h2 className={TITLE_SM}>{SKILLS_VERIFICATION.title}</h2>
    <ul className="flex flex-col gap-[12px]">
      {SKILLS_VERIFICATION.rows.map((r) => (
        <li key={r.chip.label} className="flex items-center gap-[10px]">
          <ProfileChip tone={r.chip.tone} icon={r.chip.icon ? 'check' : undefined}>
            {r.chip.label}
          </ProfileChip>
          <span className="min-w-0 text-[13px] leading-[normal] text-[#595959]">{r.text}</span>
        </li>
      ))}
    </ul>
  </section>
);

const InDemandCard = () => {
  const navigate = useNavigate();
  return (
    <section
      aria-label={SKILLS_IN_DEMAND.title}
      className={classNames(CARD_PLAIN, 'flex min-w-0 flex-col gap-[16px] overflow-hidden', PAD)}
    >
      <header className="flex items-center gap-[10px]">
        <h2 className={TITLE}>{SKILLS_IN_DEMAND.title}</h2>
      </header>
      <p className="text-[13px] leading-[normal] text-[#595959]">{SKILLS_IN_DEMAND.sub}</p>
      <ul className="flex flex-col gap-[16px]">
        {SKILLS_IN_DEMAND.rows.map((r) => (
          <li key={r.label} className="flex items-center gap-[10px]">
            {r.have ? (
              <ProfileCheckCircleGlyph className="size-[15px] shrink-0" />
            ) : (
              <ProfilePlusGlyph className="size-[15px] shrink-0" />
            )}
            <span className="min-w-0 flex-1 text-[14px] leading-[normal] font-medium text-[#1c2a21]">
              {r.label}
            </span>
            <span className="text-[12px] leading-[normal] whitespace-nowrap text-[#737373]">
              {r.share}
            </span>
          </li>
        ))}
      </ul>
      <div>
        <HeadLink
          onClick={() => {
            log('in-demand cta -> learning');
            navigate('/learning');
          }}
        >
          {SKILLS_IN_DEMAND.cta}
        </HeadLink>
      </div>
    </section>
  );
};

/*
 * ProfileSkillsTab — P-02 (Figma Focused 8110:368724 / Playful 7571:190). Filter chips narrow the
 * three groups (Verified / Endorsed / Self-added) locally; "+ Add a skill" opens the Skills stage (/profile/filling/skills).
 */
const ProfileSkillsTab = ({ profile }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    log('mount', { tab: profile?.tab });
  }, [profile?.tab]);

  const groups = SKILL_GROUPS.filter((g) => filter === 'all' || g.key === filter);
  log('filter', filter, 'groups', groups.length);

  return (
    <TabLayout
      tab="skills"
      left={
        <>
          <FilterBar
            active={filter}
            onSelect={setFilter}
            // "+ Add a skill" has no frame of its own: it opens the Skills stage, which adds and saves skills.
            onAdd={() => {
              log('add a skill -> skills stage');
              navigate('/profile/filling/skills');
            }}
          />
          {groups.map((g) => (
            <SkillGroup key={g.key} group={g} />
          ))}
          {groups.length === 0 ? (
            <p className="px-[4px] text-[14px] leading-[1.5] text-[#737373]">
              {filter === 'all'
                ? 'No skills yet. Tell Career Buddy what you can do, then prove it in Skills Lab.'
                : 'No skills in this group yet.'}
            </p>
          ) : null}
        </>
      }
      right={
        <>
          <VerificationCard />
          {SKILLS_IN_DEMAND ? <InDemandCard /> : null}
        </>
      }
    />
  );
};

export default ProfileSkillsTab;
