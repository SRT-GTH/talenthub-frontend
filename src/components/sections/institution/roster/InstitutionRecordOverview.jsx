import { debug } from '../../../../utils/debug.js';
import InstitutionPortfolioCover from './InstitutionPortfolioCover.jsx';
import InstitutionRecordCard from './InstitutionRecordCard.jsx';
import InstitutionRecordChip from './InstitutionRecordChip.jsx';
import {
  Roster20BulbIcon,
  Roster20ChartBarIcon,
  Roster20DnsIcon,
  Roster20FunctionIcon,
  Roster20HealthIcon,
  Roster20HeartIcon,
  Roster20TrendUpIcon,
  Roster20VoiceIcon,
  RosterCheckIcon,
  RosterGradIcon,
} from './rosterIcons.jsx';
import { AgUsers as Roster20UsersIcon } from '../../agency/home/agencyHomeIcons.jsx';

const log = debug('InstitutionRecordOverview');

/*
 * InstitutionRecordOverview — the left column of the student record Overview tab (Figma 11.2.2j "left" 8744:433619, 880 wide, gap 20): About (text + "My vibe" chips) ·
 * Top skills (2 x 2 grid, each: 40 tile, name 15/18 600, an Assessed / Skills Lab / Endorsed chip, 6 high #e1eae2 meter with a #387440 fill, "B3 · mock") ·
 * Experience (48 tinted icon tile, title 16/19 600, meta 13/16 #737373, text 14/17, tag chips; 1px #e6e6e6 divider) · Portfolio (three 264 x 150 covers with title + meta).
 * Sections without data are not drawn (a student with no skills yet has no "Top skills" card). The "Read more" / "See all" links have no destination drawn: they log the intent
 * ⚠️ ASSUMPTION.
 * Props: record (RECORD_KOFI shape; about / skills / experience / portfolio optional).
 */

const VIBE = {
  bulb: Roster20BulbIcon,
  health: Roster20HealthIcon,
  users: Roster20UsersIcon,
  heart: Roster20HeartIcon,
};
const SKILL = {
  chart: Roster20ChartBarIcon,
  dns: Roster20DnsIcon,
  fn: Roster20FunctionIcon,
  voice: Roster20VoiceIcon,
};
const EXP = { trend: Roster20TrendUpIcon, grad: RosterGradIcon };

const InstitutionRecordOverview = ({ record }) => {
  const { about, skills, experience, portfolio } = record;
  const intent = (what) => () => log('link (no destination drawn)', what);
  return (
    <div className="flex min-w-0 flex-col gap-[20px]">
      {about ? (
        <InstitutionRecordCard
          id="record-about"
          title="About"
          link="Read more →"
          onLink={intent('about')}
        >
          <p className="m-0 font-sans text-[15px] leading-[23px] text-[#595959]">{about.text}</p>
          <div className="flex flex-wrap items-center gap-[8px]">
            <span className="font-sans text-[12px] leading-[14px] font-semibold text-[#737373]">
              My vibe
            </span>
            {about.vibe.map((v) => {
              const Icon = VIBE[v.icon];
              return (
                <InstitutionRecordChip key={v.id} icon={<Icon className="size-[14px]" />}>
                  {v.label}
                </InstitutionRecordChip>
              );
            })}
          </div>
        </InstitutionRecordCard>
      ) : null}
      {skills?.items.length ? (
        <InstitutionRecordCard
          id="record-skills"
          title="Top skills"
          link={skills.more}
          onLink={intent('skills')}
        >
          <ul className="m-0 grid list-none grid-cols-1 gap-[12px] p-0 md:grid-cols-2">
            {skills.items.map((s) => {
              const Icon = SKILL[s.icon];
              return (
                <li
                  key={s.id}
                  className="flex min-w-0 items-center gap-[12px] rounded-[16px] border border-solid border-[#e6e6e6] bg-white p-[14px]"
                >
                  <span className="grid size-[40px] shrink-0 place-items-center rounded-[12px] bg-[#f8f8f4] text-[#1c2a21]">
                    <Icon className="size-[21px]" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
                    <div className="flex flex-wrap items-center gap-[8px]">
                      <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                        {s.name}
                      </span>
                      <InstitutionRecordChip
                        tone={s.chipOn ? 'green' : 'plain'}
                        icon={<RosterCheckIcon className="size-[14px]" />}
                      >
                        {s.chip}
                      </InstitutionRecordChip>
                    </div>
                    <div
                      className="h-[6px] w-full max-w-[300px] overflow-hidden rounded-full bg-[#e1eae2]"
                      aria-hidden="true"
                    >
                      <div
                        className="h-full rounded-full bg-[#387440]"
                        style={{ width: `${(s.bar / 300) * 100}%` }}
                      />
                    </div>
                    <span className="font-sans text-[12px] leading-[14px] text-[#737373]">
                      {s.sub}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </InstitutionRecordCard>
      ) : null}
      {experience?.items.length ? (
        <InstitutionRecordCard
          id="record-experience"
          title="Experience"
          link={experience.more}
          onLink={intent('experience')}
        >
          <ul className="m-0 flex list-none flex-col p-0">
            {experience.items.map((e, i) => {
              const Icon = EXP[e.icon];
              return (
                <li
                  key={e.id}
                  className={
                    i > 0
                      ? 'mt-[16px] flex gap-[16px] border-t border-solid border-[#e6e6e6] pt-[16px]'
                      : 'flex gap-[16px]'
                  }
                >
                  <span
                    style={{ backgroundColor: e.tint }}
                    className="grid size-[48px] shrink-0 place-items-center rounded-[14px] border-[1.5px] border-solid border-[#1c2a21] text-[#1c2a21]"
                  >
                    <Icon className="size-[23px]" />
                  </span>
                  <div className="flex min-w-0 flex-col gap-[4px]">
                    <h3 className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
                      {e.title}
                    </h3>
                    <p className="m-0 font-sans text-[13px] leading-[16px] text-[#737373]">
                      {e.meta}
                    </p>
                    <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959]">
                      {e.text}
                    </p>
                    <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0 pt-[6px]">
                      {e.tags.map((t) => (
                        <li key={t}>
                          <InstitutionRecordChip>{t}</InstitutionRecordChip>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </InstitutionRecordCard>
      ) : null}
      {portfolio?.items.length ? (
        <InstitutionRecordCard
          id="record-portfolio"
          title="Portfolio"
          link={portfolio.more}
          onLink={intent('portfolio')}
        >
          <ul className="m-0 grid list-none grid-cols-1 gap-[16px] p-0 sm:grid-cols-3">
            {portfolio.items.map((p) => (
              <li key={p.id} className="flex min-w-0 flex-col gap-[8px]">
                <InstitutionPortfolioCover
                  kind={p.cover}
                  label={p.kind}
                  name={`${p.kind}: ${p.title}`}
                />
                <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                  {p.title}
                </span>
                <span className="font-sans text-[12px] leading-[14px] text-[#737373]">
                  {p.meta}
                </span>
              </li>
            ))}
          </ul>
        </InstitutionRecordCard>
      ) : null}
    </div>
  );
};

export default InstitutionRecordOverview;
