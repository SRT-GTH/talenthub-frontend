import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { ProfileBulbGlyph, ProfileEyeIcon, ProfilePinSolidIcon } from '../../shared/assets.jsx';
import {
  PORTFOLIO_ADD,
  PORTFOLIO_ADD_CARD,
  PORTFOLIO_FILTERS,
  PORTFOLIO_PROJECTS,
  PORTFOLIO_SORT,
  PORTFOLIO_TIP,
} from './talentProfileTabsData.js';
import { EditButton, ProfileChip, ProjectCoverArt, Tag, TabPanel } from './ProfileTabsUi.jsx';
import { LINK_ICONS, SHELF, TITLE_SM, coverBg } from './profileTabsStyles.js';

import ImageDescriptionsCheck, { AltChip } from './ProfileImageDescriptions.jsx';
import { useImageDescriptions } from './ProfileImageDescriptionsData.js';
import ProfileAltTextModal from './ProfileAltTextModal.jsx';

const log = debug('ProfilePortfolioTab');

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const FilterBar = ({ active, onSelect, onAdd }) => (
  <div className="flex flex-wrap items-center gap-[8px]">
    {PORTFOLIO_FILTERS.map((f) => (
      <ProfileChip
        key={f.key}
        as="button"
        type="button"
        aria-pressed={active === f.key}
        tone={active === f.key ? 'ink' : 'white'}
        onClick={() => onSelect(f.key)}
      >
        {f.label}
      </ProfileChip>
    ))}
    <span aria-hidden="true" className="h-px min-w-px flex-1" />
    <span className="text-[13px] leading-[normal] font-medium whitespace-nowrap text-[#595959]">
      {PORTFOLIO_SORT}
    </span>
    <Button variant="primary" size="sm" onClick={onAdd}>
      {PORTFOLIO_ADD}
    </Button>
  </div>
);

const LinkPill = ({ link, project }) => {
  const Icon = LINK_ICONS[link.icon];
  return (
    <button
      type="button"
      onClick={() => log('open link', project, link.label)}
      className={classNames(
        'flex cursor-pointer items-center gap-[6px] rounded-[8px] border border-[rgba(28,42,33,0.35)] bg-[#ebf1ec] px-[10px] py-[6px] text-[12px] leading-[normal] font-semibold whitespace-nowrap text-[#2d5d33]',
        FOCUS
      )}
    >
      <Icon className="size-[14px] shrink-0" />
      {link.label}
    </button>
  );
};

const ProjectCard = ({ project, alt }) => (
  <li
    className={classNames(
      'flex min-w-0 flex-col gap-[12px] overflow-hidden rounded-[20px] bg-white pb-[20px]',
      project.pinned ? SHELF : 'border border-[#e6e6e6]'
    )}
  >
    <div
      className="relative h-[190px] w-full shrink-0 overflow-hidden"
      style={{ background: coverBg(project.cover) }}
    >
      <ProjectCoverArt kind={project.cover} fixed />
      {alt ? (
        <AltChip described={alt.described} title={project.title} onClick={alt.onOpen} />
      ) : null}
      <Tag tone="white" className="absolute top-[12px] left-[11px] playful:rotate-3">
        {project.tag}
      </Tag>
      {project.pinned ? (
        <Tag tone="yellow" className="absolute top-[10px] right-[30px] playful:-rotate-[4deg]">
          <ProfilePinSolidIcon className="size-[13px] shrink-0" />
          Pinned
        </Tag>
      ) : null}
    </div>
    <div className="flex min-w-0 flex-col items-start gap-[10px] px-[20px]">
      <div className="flex w-full items-center gap-[8px]">
        <h3 className="min-w-0 flex-1 text-[18px] leading-[normal] font-semibold text-[#1c2a21]">
          {project.title}
        </h3>
        <EditButton
          label={`Edit ${project.title}`}
          onClick={() => log('edit project', project.key)}
        />
      </div>
      <p className="text-[14px] leading-[1.5] text-[#595959]">{project.text}</p>
      <div className="flex flex-wrap gap-[6px]">
        {project.tags.map((t) => (
          <ProfileChip key={t}>{t}</ProfileChip>
        ))}
      </div>
      <div className="flex w-full flex-wrap items-center gap-x-[10px] gap-y-[8px] pt-[6px]">
        {project.links.map((l) => (
          <LinkPill key={l.label} link={l} project={project.key} />
        ))}
        <span aria-hidden="true" className="h-px min-w-px flex-1" />
        <span className="flex items-center gap-[5px] text-[12px] leading-[normal] whitespace-nowrap text-[#737373]">
          <ProfileEyeIcon className="size-[14px] shrink-0" />
          {project.stats}
        </span>
      </div>
    </div>
  </li>
);

const AddProjectCard = ({ onAdd }) => (
  <li className="min-w-0">
    <button
      type="button"
      onClick={onAdd}
      className={classNames(
        'flex h-[396px] w-full cursor-pointer flex-col items-center justify-center gap-[10px] rounded-[20px] border-[1.5px] border-dashed border-[#bfbfbf] bg-white px-[20px]',
        FOCUS
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          'flex size-[56px] items-center justify-center rounded-full bg-[#ffd86b] text-[28px] leading-[normal] font-bold text-[#1c2a21]',
          SHELF
        )}
      >
        +
      </span>
      <span className={classNames(TITLE_SM, 'whitespace-nowrap')}>{PORTFOLIO_ADD_CARD.title}</span>
      <span className="max-w-[300px] text-center text-[14px] leading-[1.5] text-[#737373]">
        {PORTFOLIO_ADD_CARD.text}
      </span>
    </button>
  </li>
);

/*
 * ProfilePortfolioTab — P-04 (Figma Focused 8110:369743 / Playful 7572:359). Filter chips narrow the
 * project cards locally (pinned first, as the sort label says). Add opens the Portfolio stage (/profile/filling/portfolio).
 */
const ProfilePortfolioTab = ({ profile }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const imageDesc = useImageDescriptions();
  const altMode = profile?.ax === 'images' || profile?.ax === 'alt';

  useEffect(() => {
    log('mount', { tab: profile?.tab });
  }, [profile?.tab]);

  const projects = PORTFOLIO_PROJECTS.filter((p) => filter === 'all' || p.category === filter);
  log('filter', filter, 'projects', projects.length);
  // No add frame of its own: the Portfolio stage adds and saves projects.
  const onAdd = () => navigate('/profile/filling/portfolio');

  return (
    <TabPanel tab="portfolio">
      <FilterBar active={filter} onSelect={setFilter} onAdd={onAdd} />
      {altMode ? <ImageDescriptionsCheck onDescribe={() => profile.update({ ax: 'alt' })} /> : null}
      <ul className="grid grid-cols-1 items-start gap-[clamp(14px,1.16vw,20px)] @3xl:grid-cols-2 @5xl:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard
            key={p.key}
            project={p}
            alt={
              altMode
                ? {
                    described: imageDesc.described.includes(p.key),
                    onOpen: () => profile.update({ ax: 'alt' }),
                  }
                : null
            }
          />
        ))}
        <AddProjectCard onAdd={onAdd} />
      </ul>
      <p
        className={classNames(
          'flex w-fit max-w-full items-center gap-[10px] rounded-[14px] bg-[#faf4e8] px-[16px] py-[12px] text-[14px] leading-[normal] font-medium text-[#463409]'
        )}
      >
        <ProfileBulbGlyph className="size-[17px] shrink-0" />
        {PORTFOLIO_TIP}
      </p>
      {profile?.ax === 'alt' ? (
        <ProfileAltTextModal profile={profile} onDescribed={imageDesc.markDescribed} />
      ) : null}
    </TabPanel>
  );
};

export default ProfilePortfolioTab;
