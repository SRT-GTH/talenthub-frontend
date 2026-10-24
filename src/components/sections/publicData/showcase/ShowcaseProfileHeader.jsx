import {
  PublicIconBook,
  PublicIconCheckCircle,
  PublicIconPin,
  PublicIconUser,
} from './showcaseIcons.jsx';

/*
 * ShowcaseProfileHeader — Figma "Profile header" 8497:1786 (1360x298): white card r24 + shadow, p28, gap 32.
 *   photo 200x240 r20 · info (gap 12): name 36/43 600 -0.36 + "Identity verified" badge (#ebf1ec pill, 12/14 600 #2a5730, check 14 #387440);
 *   meta chips (#f2f2ee pill, p 7/12, pin / book / user icons 16 #70706e, 14/17 500): region · "In-tertiary · Nursing" · "Age 21";
 *   "Aspiration" 12/14 600 caps +0.72 #595959; aspiration 22/30 500; interest tags (white, 1px #c1d4c4, pill, 13/16 600 #2a5730);
 *   stats column 260 (three #f2f2ee r14 tiles, value 22/26 700, label 13/16 500 #595959): Skills verified · Games passed · On GTH since.
 * Tablet (8508:352047) draws no stats column (⚠️ read from the tree: the header holds photo + info only), so the stats show from xl.
 * Mobile (< md, 8508:134-137): photo 358x300 r20 · name 28/33 · one meta line "Volta · In-tertiary · Nursing · Age 21" (13/16 500 #595959) ·
 * aspiration 17/24 500. No badge, no tags, no stats are drawn on the phone frame.
 * Privacy: shows only consented fields (name with initial, region, education, age, aspiration, interests); no contact details exist in the data.
 */

const ShowcaseProfileHeader = ({ profile }) => (
  <>
    <section
      aria-label={`${profile.name} profile`}
      className="hidden gap-[32px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[28px] font-sans shadow-[0_5px_17px_rgba(0,0,0,0.04)] md:flex"
    >
      <img
        src={profile.photo}
        alt={`Portrait of ${profile.name}`}
        width="200"
        height="240"
        className="h-[240px] w-[200px] shrink-0 rounded-[20px] object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 text-[36px] leading-[43px] font-semibold tracking-[-0.36px] text-[#1c2a21]">
            {profile.name}
          </h1>
          <span className="inline-flex items-center gap-[6px] rounded-full bg-[#ebf1ec] px-[10px] py-[5px] text-[12px] leading-[14px] font-semibold text-[#2a5730]">
            <PublicIconCheckCircle className="size-[14px] shrink-0 text-[#387440]" />
            Identity verified
          </span>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
          {[
            {
              id: 'region',
              icon: <PublicIconPin className="size-[16px] shrink-0 text-[#70706e]" />,
              text: profile.region,
            },
            {
              id: 'education',
              icon: <PublicIconBook className="size-[16px] shrink-0 text-[#70706e]" />,
              text: profile.education,
            },
            {
              id: 'age',
              icon: <PublicIconUser className="size-[16px] shrink-0 text-[#70706e]" />,
              text: `Age ${profile.age}`,
            },
          ].map(({ id, icon, text }) => (
            <li
              key={id}
              className="inline-flex items-center gap-[6px] rounded-full bg-[#f2f2ee] px-[12px] py-[7px] text-[14px] leading-[17px] font-medium text-[#1c2a21]"
            >
              {icon}
              {text}
            </li>
          ))}
        </ul>
        <p className="m-0 pt-[6px] text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase">
          Aspiration
        </p>
        <p className="m-0 text-[22px] leading-[30px] font-medium text-[#1c2a21]">
          {profile.aspiration}
        </p>
        <ul aria-label="Interests" className="m-0 flex list-none flex-wrap gap-[8px] p-0 pt-[0px]">
          {profile.interests.map((interest) => (
            <li
              key={interest}
              className="rounded-full border border-solid border-[#c1d4c4] bg-white px-[12px] py-[6px] text-[13px] leading-[16px] font-semibold text-[#2a5730]"
            >
              {interest}
            </li>
          ))}
        </ul>
      </div>
      <dl className="m-0 hidden w-[260px] shrink-0 flex-col gap-[12px] xl:flex">
        {[
          { id: 'skills', value: profile.skillsVerified, label: 'Skills verified' },
          { id: 'games', value: profile.gamesPassed, label: 'Games passed' },
          { id: 'since', value: profile.joinedLabel, label: 'On GTH since' },
        ].map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col-reverse gap-[2px] rounded-[14px] bg-[#f2f2ee] px-[16px] py-[12px]"
          >
            <dt className="text-[13px] leading-[16px] font-medium text-[#595959]">{stat.label}</dt>
            <dd className="m-0 text-[22px] leading-[26px] font-bold text-[#1c2a21]">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
    <section aria-label={`${profile.name} profile`} className="flex flex-col font-sans md:hidden">
      <img
        src={profile.photo}
        alt={`Portrait of ${profile.name}`}
        width="358"
        height="300"
        className="h-[300px] w-full rounded-[20px] object-cover"
      />
      <h1 className="m-0 pt-[16px] text-[28px] leading-[33px] font-semibold text-[#1c2a21]">
        {profile.name}
      </h1>
      <p className="m-0 pt-[6px] text-[13px] leading-[16px] font-medium text-[#595959]">
        {profile.region} · {profile.education} · Age {profile.age}
      </p>
      <p className="m-0 pt-[16px] text-[17px] leading-[24px] font-medium text-[#1c2a21]">
        {profile.aspiration}
      </p>
    </section>
  </>
);

export default ShowcaseProfileHeader;
