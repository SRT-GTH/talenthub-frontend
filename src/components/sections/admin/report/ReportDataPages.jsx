import school from '../../../../assets/admin/report-school.webp';
import office from '../../../../assets/admin/report-office.webp';
import graduate from '../../../../assets/admin/report-graduate.webp';
import { FOOTER, FUNNEL, GROWTH, SAFETY, STORIES } from './data/adminReportData.js';
import { MAP_LABELS, MAP_REGIONS, MAP_SIZE } from './data/adminReportMapData.js';
import { Bar, Box, GREEN, GREY, INK, PageFoot, PageHead, ReportPage, T } from './ReportParts.jsx';

/*
 * Pages 4-7 of the A4 report kit (Figma 7.3.1 v2: growth 8916:161, trust and safety 8916:291, talent funnel 8916:357, quarter highlights 8916:405).
 * Charts are drawn from the frame geometry: the region map paths, the 330 / 293 px bar widths and the funnel rings are read straight from the Figma layers.
 * Figma quirks kept: layer names disagree with the text in places (e.g. "Eastern" reads "Northern"), the drawn text is used; the funnel arrow layer's path points up but the frame is rotated to point right.
 * Funnel arrows: the Figma layer is a 14 x 16 triangle path; it is drawn pointing right (12 x 14, as the frame render shows) beside the 22 px link line.
 */

const GrowthMap = () => (
  <svg
    role="img"
    aria-label="Map of the 16 regions of Ghana shaded by sign-ups, darker green means more"
    width={MAP_SIZE.width}
    height={MAP_SIZE.height}
    viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`}
    className="absolute block overflow-visible"
    style={{ left: 64, top: 196 }}
  >
    {MAP_REGIONS.map((r) => (
      <path
        key={r.name}
        d={r.d}
        transform={`translate(${r.x} ${r.y})`}
        fill={r.fill}
        stroke="#ffffff"
        strokeWidth={1.85}
        strokeLinejoin="round"
      />
    ))}
    {MAP_LABELS.map((l) => (
      <text
        key={l.text}
        x={l.x + l.w / 2}
        y={l.y + l.size}
        textAnchor="middle"
        fill={l.color}
        fontSize={l.size}
        fontWeight={600}
        className="font-sans"
      >
        {l.text}
      </text>
    ))}
  </svg>
);

export const GrowthPage = () => (
  <ReportPage n={4} label="Growth by region">
    <PageHead eyebrow={GROWTH.eyebrow} title={GROWTH.title} sub={GROWTH.sub} />
    <GrowthMap />
    <T x={400} y={192} w={160} size={10} lh={12} weight={700} ls={0.8} color={GREY} caps nowrap>
      {GROWTH.legendTitle}
    </T>
    {GROWTH.legend.map((l, i) => (
      <div key={l.t}>
        <Box x={400} y={214 + i * 26} w={14} h={14} bg={l.c} r={4} />
        <T x={422} y={214 + i * 26} w={100} size={11} lh={13} nowrap>
          {l.t}
        </T>
      </div>
    ))}
    <T x={640} y={196} w={200} size={18} lh={22} weight={600} heading as="h2" nowrap>
      {GROWTH.topTitle}
    </T>
    {GROWTH.top.map((r, i) => {
      const y = 232 + i * 54;
      return (
        <div key={r.n}>
          <T x={640} y={y} w={40} size={22} lh={26} weight={300} color={GREEN} heading nowrap>
            {r.n}
          </T>
          <T x={684} y={y + 4} w={200} size={12.5} lh={15} weight={600} nowrap>
            {r.name}
          </T>
          <T x={985} y={y + 2} w={90} size={15} lh={18} weight={600} heading align="right" nowrap>
            {r.value}
          </T>
          <Bar x={684} y={y + 26} track={330} fill={r.bar} color={r.tone} />
        </div>
      );
    })}
    <Box x={640} y={512} w={435} h={92} bg="#faf4e8" r={14} />
    <T x={658} y={528} w={200} size={10} lh={12} weight={700} ls={0.8} color="#c8951a" caps nowrap>
      {GROWTH.thinTitle}
    </T>
    <T x={658} y={546} w={400} size={11.5} lh={17}>
      {GROWTH.thin}
    </T>
    <Box x={0} y={664} w={1123} h={130} bg={GREEN} />
    {GROWTH.band.map((b, i) => {
      const x = 48 + i * 210;
      return (
        <div key={b.l}>
          {i > 0 ? <Box x={x - 18} y={690} w={1} h={56} bg="#ffffff" op={0.25} /> : null}
          <T
            x={x}
            y={684}
            w={190}
            size={34}
            lh={41}
            weight={600}
            ls={-0.34}
            color="#ffffff"
            heading
            nowrap
          >
            {b.v}
          </T>
          <T x={x} y={725} w={190} size={11} lh={13} color="#ffffff" op={0.8} nowrap>
            {b.l}
          </T>
        </div>
      );
    })}
    <PageFoot text={FOOTER} no="04" light />
  </ReportPage>
);

export const SafetyPage = () => (
  <ReportPage n={5} label="Trust and safety">
    <PageHead eyebrow={SAFETY.eyebrow} title={SAFETY.title} sub={SAFETY.sub} w={640} />
    {SAFETY.flags.map(([label, value, bar, tone, strong], i) => {
      const y = 196 + i * 44;
      return (
        <div key={label}>
          <T x={48} y={y} w={165} size={12} lh={14} weight={strong ? 600 : 400} nowrap>
            {label}
          </T>
          <Bar x={220} y={y + 4} track={330} fill={bar} h={8} color={tone} />
          <T x={550} y={y} w={80} size={12} lh={14} weight={600} align="right" nowrap>
            {value}
          </T>
        </div>
      );
    })}
    <T x={48} y={650} w={580} size={10.5} lh={13} color={GREY}>
      {SAFETY.note}
    </T>
    <Box x={690} y={196} w={385} h={150} bg={GREEN} r={22} />
    <T
      x={714}
      y={214}
      w={200}
      size={52}
      lh={62}
      weight={600}
      ls={-1.04}
      color="#ffffff"
      heading
      nowrap
    >
      {SAFETY.highlight.value}
    </T>
    <T x={714} y={286} w={330} size={12.5} lh={18} color="#ffffff">
      {SAFETY.highlight.text}
    </T>
    <T x={690} y={378} w={200} size={18} lh={22} weight={600} heading as="h2" nowrap>
      {SAFETY.mixTitle}
    </T>
    {SAFETY.mix.map((m, i) => {
      const y = 416 + i * 78;
      return (
        <div key={m.title}>
          <T
            x={690}
            y={y}
            w={90}
            size={30}
            lh={36}
            weight={600}
            ls={-0.3}
            color={GREEN}
            heading
            nowrap
          >
            {m.pct}
          </T>
          <T x={782} y={y + 4} w={293} size={12.5} lh={15} weight={600} nowrap>
            {m.title}
          </T>
          <T x={782} y={y + 22} w={293} size={11} lh={13} color={GREY} nowrap>
            {m.sub}
          </T>
          <Bar x={782} y={y + 44} track={293} fill={m.bar} />
        </div>
      );
    })}
    <PageFoot text={FOOTER} no="05" />
  </ReportPage>
);

export const FunnelPage = () => (
  <ReportPage n={6} label="The talent funnel">
    <PageHead eyebrow={FUNNEL.eyebrow} title={FUNNEL.title} sub={FUNNEL.sub} w={640} />
    {FUNNEL.steps.map((s, i) => {
      const x = 48 + i * 262;
      return (
        <div key={s.n}>
          <div
            aria-hidden="true"
            className="absolute box-border rounded-full border-[1.2px] border-solid border-[#387440]"
            style={{ left: x, top: 200, width: 196, height: 196 }}
          />
          <Box x={x + 22} y={222} w={152} h={152} bg={s.last ? GREEN : '#ebf1ec'} r="50%" />
          <Box x={x + 93} y={195} w={10} h={10} bg="#c8951a" r="50%" />
          <T
            x={x}
            y={270}
            w={196}
            size={14}
            lh={17}
            weight={300}
            color={s.last ? '#ffffff' : GREEN}
            heading
            align="center"
          >
            {s.n}
          </T>
          <T
            x={x}
            y={290}
            w={196}
            size={23}
            lh={28}
            weight={600}
            color={s.last ? '#ffffff' : INK}
            heading
            align="center"
            as="h2"
          >
            {s.name}
          </T>
          <T
            x={x}
            y={422}
            w={196}
            size={30}
            lh={36}
            weight={600}
            ls={-0.3}
            color={GREEN}
            heading
            align="center"
            nowrap
          >
            {s.value}
          </T>
          <T x={x + 18} y={460} w={160} size={11.5} lh={16} color={GREY} align="center">
            {s.text}
          </T>
          {s.last ? null : (
            <>
              <Box x={x + 202} y={297} w={22} h={2} bg="#c1d4c4" />
              <svg
                aria-hidden="true"
                width={16}
                height={16}
                viewBox="0 0 16 16"
                className="absolute block"
                style={{ left: x + 208, top: 290 }}
              >
                <path d="M3 1L15 8L3 15Z" fill={GREEN} />
              </svg>
            </>
          )}
        </div>
      );
    })}
    <Box x={48} y={600} w={1027} h={128} bg="#f8f8f4" r={18} />
    <T x={72} y={620} w={300} size={10} lh={12} weight={700} ls={0.8} color={GREEN} caps nowrap>
      {FUNNEL.policyTitle}
    </T>
    {FUNNEL.policy.map((p, i) => (
      <div key={p.t}>
        <T x={72 + i * 335} y={644} w={300} size={12.5} lh={15} weight={600} as="h2" nowrap>
          {p.t}
        </T>
        <T x={72 + i * 335} y={664} w={300} size={11} lh={16} color={GREY}>
          {p.b}
        </T>
      </div>
    ))}
    <PageFoot text={FOOTER} no="06" />
  </ReportPage>
);

const PHOTOS = { school, office, graduate };

export const StoriesPage = () => (
  <ReportPage n={7} label="Quarter highlights">
    <T x={48} y={48} w={200} size={10} lh={12} weight={700} ls={1} color={GREEN} caps nowrap>
      {STORIES.eyebrow}
    </T>
    <T x={48} y={70} w={360} size={12.5} lh={19} color={GREY}>
      {STORIES.sub}
    </T>
    <T
      x={515}
      y={36}
      w={560}
      size={46}
      lh={44}
      weight={600}
      ls={-0.46}
      color={GREEN}
      heading
      align="right"
      as="h1"
    >
      {STORIES.title.join('\n')}
    </T>
    {STORIES.cases.map((c) => (
      <div key={c.chip}>
        <Box x={48} y={c.y} w={1027} h={176} bg={c.band} r={18} />
        <img
          src={PHOTOS[c.photo]}
          alt=""
          width={250}
          height={176}
          className="absolute block"
          style={{ left: 48, top: c.y, width: 250, height: 176 }}
        />
        <span
          className="absolute rounded-full bg-white/[0.18] px-[12px] font-sans text-[10px] leading-[22px] font-bold tracking-[0.6px] whitespace-nowrap text-white uppercase"
          style={{ left: 322, top: c.y + 20, height: 22 }}
        >
          {c.chip}
        </span>
        <T
          x={322}
          y={c.y + 52}
          w={380}
          size={17}
          lh={21}
          weight={600}
          color="#ffffff"
          heading
          as="h2"
        >
          {c.title}
        </T>
        <T x={322} y={c.y + 81} w={380} size={11.5} lh={17} color="#ffffff" op={0.85}>
          {c.text}
        </T>
        {c.stats.map(([v, l], i) => {
          const x = 730 + i * 115;
          return (
            <div key={l}>
              <T
                x={x}
                y={c.y + 62}
                w={105}
                size={20}
                lh={24}
                weight={600}
                ls={-0.2}
                color="#ffffff"
                heading
                nowrap
              >
                {v}
              </T>
              <T x={x} y={c.y + 98} w={105} size={10.5} lh={14} color="#ffffff" op={0.8}>
                {l}
              </T>
              {i > 0 ? <Box x={x - 14} y={c.y + 56} w={1} h={70} bg="#ffffff" op={0.25} /> : null}
            </div>
          );
        })}
      </div>
    ))}
    <PageFoot text={FOOTER} no="07" noX={1061} />
  </ReportPage>
);
