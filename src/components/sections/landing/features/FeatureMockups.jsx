import { FcCareerBuddyIcon } from '../../../shared/assets.jsx';
import {
  BulbGlyph,
  ChatGlyph,
  CheckGlyph,
  EditGlyph,
  FireGlyph,
  GameGlyph,
  SearchGlyph,
  ShieldGlyph,
  TargetGlyph,
  WalletGlyph,
} from './FeaturesIcons.jsx';
import { GAMES, TRAITS, WEEK_DAYS } from './FeaturesData.js';

/* Product-preview cards inside the P-02 "Visual" panels (Figma component instances "LP · Feature · …", 7797:27241 etc.). */

const CARD =
  'flex w-full flex-col rounded-[28px] border-[1.4px] border-[#1c2a21]/[.32] bg-[#fffdf7] p-[26px] gap-[14px] shadow-[5px_5px_0_rgba(28,42,33,.2),0_10px_24px_rgba(28,42,33,.06)]';

const Head = (props) => {
  const { tile, Icon, label } = props;
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-[14px] border-[1.5px] border-[#1c2a21] text-[#387440] ${tile}`}
      >
        <Icon className="size-[22px]" />
      </span>
      <span className="font-sans text-[12px] font-bold uppercase leading-[1.19] tracking-[1.2px] text-[#387440]">
        {label}
      </span>
    </div>
  );
};
const Title = ({ children }) => (
  <p className="m-0 font-heading text-[27px] font-semibold leading-[1.2] text-[#1c2a21]">
    {children}
  </p>
);
const Sub = ({ children }) => (
  <p className="m-0 font-sans text-[15px] leading-[23px] text-[#595959]">{children}</p>
);
const Bar = ({ pct, h = 'h-2', r = 'rounded-[4px]' }) => (
  <div className={`${h} w-full overflow-hidden ${r} bg-[#eceee8]`}>
    <div
      className={`${h} ${r} bg-[linear-gradient(90deg,#387440,#84cc16)]`}
      style={{ width: `${pct}%` }}
    />
  </div>
);
/* Outer wrapper carries the 8px top inset the Figma instances have (room for the offset shadow). */
const Wrap = ({ max, children }) => (
  <div className="w-full pt-2" style={{ maxWidth: max }}>
    {children}
  </div>
);

/* Career Buddy mock is drawn at ~0.78 scale in Figma (card 786x283). */
const CareerBuddyMock = () => (
  <div className="w-full max-w-[786px] pt-[6px]">
    <div className="flex w-full flex-col gap-[11px] rounded-[22px] border-[1.4px] border-[#1c2a21]/[.32] bg-[#fffdf7] p-[20px] shadow-[5px_5px_0_rgba(28,42,33,.2),0_10px_24px_rgba(28,42,33,.06)]">
      <div className="flex items-center gap-[9px]">
        <span className="flex size-[34px] items-center justify-center rounded-[11px] border-[1.17px] border-[#1c2a21] bg-[#ebf1ec] text-[#c8951a]">
          <FcCareerBuddyIcon className="h-[15px] w-auto" />
        </span>
        <span className="font-sans text-[9.4px] font-bold leading-[1.19] tracking-[0.94px] text-[#387440]">
          CAREER BUDDY · YOUR AI GUIDE
        </span>
      </div>
      <p className="m-0 font-heading text-[21px] font-semibold leading-[1.25] text-[#1c2a21]">
        Advice that knows you, any time.
      </p>
      <p className="m-0 font-sans text-[11.7px] leading-[1.53] text-[#595959]">
        Ask about roles, pay in Accra, interview prep or your next step. Replies in your language
        where it can.
      </p>
      <div className="flex flex-col items-start gap-[7.8px] rounded-[15.6px] bg-[#f1ede2] p-[12.5px]">
        <span className="rounded-[12.5px] border-[0.78px] border-[#e7e7e7] bg-white px-[11px] py-[7.8px] font-sans text-[10.9px] font-medium leading-[13px] text-[#1c2a21]">
          Your Zeepay interview is Thursday. Want a 10-minute mock?
        </span>
        <span className="rounded-[12.5px] bg-[#387440] px-[11px] py-[7.8px] font-sans text-[10.9px] font-medium leading-[13px] text-white">
          Yes please, React questions
        </span>
        <span className="rounded-[12.5px] border-[0.78px] border-[#e7e7e7] bg-white px-[11px] py-[7.8px] font-sans text-[10.9px] font-medium leading-[13px] text-[#1c2a21]">
          Great. Question 1: what does useEffect’s cleanup do?
        </span>
      </div>
    </div>
  </div>
);

const JobReadinessMock = () => (
  <Wrap max={480}>
    <div className={CARD}>
      <Head tile="bg-[#ffd86b]" Icon={TargetGlyph} label="JOB READINESS" />
      <Title>Know how ready you are.</Title>
      <Sub>One score and the one gap to close next.</Sub>
      <div className="flex items-center gap-3">
        <span className="font-heading text-[67px] font-semibold leading-[1.1] text-[#387440]">
          82
        </span>
        <span className="max-w-[180px] font-sans text-[14px] font-semibold leading-5 text-[#1c2a21]">
          Ahead of 71% of similar talents
        </span>
      </div>
      <Bar pct={82} h="h-3" r="rounded-[6px]" />
    </div>
  </Wrap>
);

const SkillsLabMock = () => (
  <Wrap max={493}>
    <div className={CARD}>
      <Head tile="bg-[#fde7de]" Icon={GameGlyph} label="SKILLS LAB" />
      <Title>Prove it by playing.</Title>
      <Sub>Short challenges turn skills into evidence.</Sub>
      <div className="flex gap-2">
        {GAMES.map(({ name, rank }) => (
          <div
            key={name}
            className="flex min-w-0 flex-1 flex-col gap-[2px] rounded-[14px] bg-[#f1ede2] p-3"
          >
            <span className="font-sans text-[13px] font-semibold leading-[1.19] text-[#1c2a21]">
              {name}
            </span>
            <span className="font-sans text-[12px] font-semibold leading-[1.19] text-[#387440]">
              {rank}
            </span>
          </div>
        ))}
      </div>
    </div>
  </Wrap>
);

const MyAssessmentMock = () => (
  <Wrap max={493}>
    <div className={CARD}>
      <Head tile="bg-[#ebf1ec]" Icon={BulbGlyph} label="MYASSESSMENT" />
      <Title>Know your real strengths.</Title>
      <Sub>15 scenarios from Ghanaian workplaces. One of 9 archetypes.</Sub>
      <div className="flex flex-col gap-[14px]">
        {TRAITS.map(({ label, pct }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="font-sans text-[13px] font-semibold leading-[1.19] text-[#1c2a21]">
              {label}
            </span>
            <Bar pct={pct} />
          </div>
        ))}
      </div>
    </div>
  </Wrap>
);

const VerifiedSkillsMock = () => (
  <Wrap max={494}>
    <div className={CARD}>
      <Head tile="bg-[#ffd86b]" Icon={ShieldGlyph} label="VERIFIED SKILLS" />
      <Title>More than a CV.</Title>
      <Sub>Every skill shows how it was proven, so recruiters trust it.</Sub>
      <div className="flex flex-col items-start gap-2">
        <span className="inline-flex h-[26px] items-center gap-[5px] rounded-full bg-[#387440] py-[5px] pl-2 pr-[10px] font-sans text-[13px] font-semibold text-white">
          <ShieldGlyph className="size-[15px]" />
          Assessment-evidenced
        </span>
        <span className="inline-flex h-[26px] items-center gap-[5px] rounded-full bg-[#e8f2ed] py-[5px] pl-2 pr-[10px] font-sans text-[13px] font-semibold text-[#1d7c4d]">
          <GameGlyph className="size-[15px]" />
          Game-evidenced
        </span>
        <span className="inline-flex h-7 items-center gap-[5px] rounded-full border border-[#c1d4c4] bg-white py-[5px] pl-2 pr-[10px] font-sans text-[13px] font-semibold text-[#387440]">
          <ChatGlyph className="size-[15px]" />
          AI-validated in chat
        </span>
        <span className="inline-flex h-[26px] items-center gap-[5px] rounded-full bg-[#faf4e8] py-[5px] pl-2 pr-[10px] font-sans text-[13px] font-semibold text-[#785910]">
          <EditGlyph className="size-[15px]" />
          Self-reported
        </span>
      </div>
    </div>
  </Wrap>
);

const StreaksMock = () => (
  <Wrap max={740}>
    <div className={CARD}>
      <Head tile="bg-[#fff1e6]" Icon={FireGlyph} label="STREAKS, XP AND QUESTS" />
      <Title>Small wins, every day.</Title>
      <Sub>Keep a streak, finish weekly quests and level up. One free streak freeze a week.</Sub>
      <div className="flex flex-wrap gap-[10px]">
        {WEEK_DAYS.map(({ d, done }, i) => (
          <div key={i} className="flex w-10 flex-col items-center gap-1">
            <span
              className={`flex size-10 items-center justify-center rounded-full border-[1.5px] border-[#1c2a21] text-[#1c2a21] ${done ? 'bg-[#f59638]' : 'border-dashed bg-transparent'}`}
            >
              {done ? <CheckGlyph className="size-4" /> : null}
            </span>
            <span className="font-sans text-[12px] font-semibold leading-[1.19] text-[#1c2a21]">
              {d}
            </span>
          </div>
        ))}
      </div>
    </div>
  </Wrap>
);

const SmartMatchingMock = () => (
  <Wrap max={768}>
    <div className={CARD}>
      <Head tile="bg-[#ebf1ec]" Icon={SearchGlyph} label="SMART MATCHING" />
      <Title>Opportunities find you.</Title>
      <Sub>A fit score on every role, with the reasons. No keyword games.</Sub>
      <div className="flex items-center gap-[14px] rounded-[18px] border border-[#1c2a21]/10 bg-white py-[14px] pl-[14px] pr-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-[#387440] text-white">
          <WalletGlyph className="size-[22px]" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <span className="font-sans text-[15px] font-semibold leading-[1.19] text-[#1c2a21]">
            Data Analyst Intern · MTN Ghana
          </span>
          <span className="font-sans text-[13px] leading-[1.19] text-[#595959]">
            Hybrid · Accra · Analytical, Python
          </span>
        </span>
        <span className="shrink-0 font-heading text-[31px] font-semibold leading-[1.2] text-[#387440]">
          94%
        </span>
      </div>
    </div>
  </Wrap>
);

const MOCKS = {
  careerBuddy: CareerBuddyMock,
  jobReadiness: JobReadinessMock,
  skillsLab: SkillsLabMock,
  myAssessment: MyAssessmentMock,
  verifiedSkills: VerifiedSkillsMock,
  streaks: StreaksMock,
  smartMatching: SmartMatchingMock,
};

const FeatureMock = ({ name }) => {
  const Mock = MOCKS[name];
  return Mock ? <Mock /> : null;
};

export default FeatureMock;
