import cover from '../../../../assets/admin/report-cover.webp';
import opener from '../../../../assets/admin/report-opener.webp';
import seedling from '../../../../assets/admin/report-seedling.webp';
import { COVER, CONTENTS, FOOTER, METHOD, OPENER } from './data/adminReportData.js';
import { Box, GREEN, GREY, Logo, PageFoot, PageHead, Qr, ReportPage, T } from './ReportParts.jsx';

/*
 * Pages 1, 2, 3 and 8 of the A4 report kit (Figma 7.3.1 v2: cover 8916:100, contents 8916:119, section opener 8916:148, how we count 8916:456).
 * ⚠️ ASSUMPTION: the "Contents" outline word is drawn as a 1.2 px #387440 text stroke at 30 % (the layer's opacity is not in the frame data read).
 * Figma quirk kept: on the cover the "Prepared for" line is 548 wide and runs under the photo, which is stacked above it.
 */

export const CoverPage = () => (
  <ReportPage n={1} label="Cover">
    <Logo x={48} y={40} w={48} h={44} />
    <T x={108} y={52} w={160} size={17} lh={20} weight={600} heading nowrap>
      {COVER.brand}
    </T>
    <T x={48} y={176} w={440} size={10} lh={12} weight={700} ls={1} color={GREEN} caps>
      {COVER.eyebrow}
    </T>
    <T x={48} y={206} w={440} size={54} lh={57} weight={600} ls={-1.08} heading as="h1">
      {COVER.title[0]}
      {'\n'}
      <span style={{ color: GREEN }}>{`${COVER.title[1]}\n${COVER.title[2]}`}</span>
    </T>
    <T x={48} y={395} w={440} size={13} lh={20} color={GREY}>
      {COVER.sub}
    </T>
    <Box x={48} y={453} w={3} h={47} bg={GREEN} />
    <T x={67} y={457} w={90} size={9} lh={11} weight={700} ls={0.9} color={GREY} caps>
      {COVER.preparedLabel}
    </T>
    <T x={67} y={472} w={548} size={19} lh={24} weight={500} heading nowrap>
      {COVER.prepared}
    </T>
    <T
      x={48}
      y={582}
      w={260}
      size={68}
      lh={82}
      weight={600}
      ls={-1.36}
      color={GREEN}
      heading
      nowrap
    >
      {COVER.big}
    </T>
    <T x={50} y={666} w={200} size={13} lh={16} nowrap>
      {COVER.bigLabel}
    </T>
    <T x={48} y={758} w={400} size={9} lh={11} color={GREY} nowrap>
      {COVER.footer}
    </T>
    <Box x={500} y={64} w={44} h={44} bg="#ebf1ec" r="22px 6px 22px 6px" />
    <img
      src={cover}
      alt=""
      width={500}
      height={666}
      className="absolute block"
      style={{ left: 560, top: 64, width: 500, height: 666 }}
    />
    <Box x={486} y={556} w={196} h={196} bg={GREEN} r="98px 14px 98px 14px" />
    <T
      x={486}
      y={596}
      w={196}
      size={58}
      lh={70}
      weight={600}
      color="#ffffff"
      heading
      align="center"
      nowrap
    >
      {COVER.stat}
    </T>
    <T x={486} y={672} w={196} size={12} lh={16} color="#ffffff" align="center">
      {COVER.statLabel.join('\n')}
    </T>
    <Box x={1012} y={690} w={40} h={40} bg="#c8951a" r="20px 4px 20px 4px" />
  </ReportPage>
);

export const ContentsPage = () => (
  <ReportPage n={2} label="Contents">
    <Box x={0} y={0} w={360} h={794} bg={GREEN} />
    <h1
      className="font-heading absolute m-0 text-white"
      style={{
        left: 48,
        top: 48,
        width: 55,
        height: 192,
        fontSize: 46,
        lineHeight: '55px',
        fontWeight: 600,
        writingMode: 'vertical-rl',
        transform: 'rotate(180deg)',
        whiteSpace: 'nowrap',
      }}
    >
      {CONTENTS.title}
    </h1>
    <T x={120} y={56} w={200} size={12} lh={14} weight={600} color="#ffffff" nowrap>
      {CONTENTS.label}
    </T>
    <T x={120} y={76} w={220} size={11} lh={16} color="#ffffff" op={0.8}>
      {CONTENTS.meta.join('\n')}
    </T>
    <img
      src={seedling}
      alt=""
      width={360}
      height={364}
      className="absolute block"
      style={{ left: 0, top: 430, width: 360, height: 364 }}
    />
    {CONTENTS.columns.map((c) => (
      <div key={c.n}>
        <Box x={c.x - 16} y={64} w={1} h={380} bg="#c1d4c4" />
        <T x={c.x} y={56} w={120} size={120} lh={120} weight={200} color={GREEN} heading nowrap>
          {c.n}
        </T>
        <T x={c.x} y={206} w={138} size={16} lh={20} weight={600} heading>
          {c.title}
        </T>
        <T x={c.x} y={258} w={140} size={11} lh={19} color={GREY}>
          {c.items.join('\n')}
        </T>
        <T x={c.x} y={410} w={80} size={10} lh={12} weight={700} color={GREEN} nowrap>
          {c.page}
        </T>
      </div>
    ))}
    <T
      x={404}
      y={520}
      w={640}
      size={168}
      lh={202}
      weight={600}
      heading
      nowrap
      op={0.35}
      ls={-3.5}
      className="select-none"
      style={{ color: 'transparent', WebkitTextStroke: '1.2px #387440' }}
    >
      <span aria-hidden="true">{CONTENTS.title}</span>
    </T>
    <PageFoot text={FOOTER} no="02" x={392} />
  </ReportPage>
);

export const OpenerPage = () => (
  <ReportPage n={3} label="Section opener">
    <img
      src={opener}
      alt=""
      width={743}
      height={794}
      className="absolute block"
      style={{ left: 380, top: 0, width: 743, height: 794 }}
    />
    <div
      aria-hidden="true"
      className="absolute"
      style={{
        left: 380,
        top: 0,
        width: 743,
        height: 794,
        background: 'linear-gradient(180deg, rgba(20,41,23,0.55) 0%, rgba(20,41,23,0) 45%)',
      }}
    />
    <T
      x={428}
      y={52}
      w={330}
      size={84}
      lh={81}
      weight={200}
      ls={-1.68}
      color="#ffffff"
      heading
      as="h2"
    >
      {OPENER.headline.join('\n')}
    </T>
    <T x={48} y={64} w={300} size={10} lh={12} weight={700} ls={1} color={GREEN} caps>
      {OPENER.eyebrow}
    </T>
    <T
      x={48}
      y={90}
      w={300}
      size={46}
      lh={48}
      weight={600}
      ls={-0.92}
      color={GREEN}
      heading
      as="h1"
    >
      {OPENER.title}
    </T>
    <T x={48} y={200} w={300} size={18} lh={22} weight={500} heading>
      {OPENER.lead}
    </T>
    <Box x={48} y={258} w={40} h={3} bg="#c8951a" r={2} />
    <T x={48} y={275} w={300} size={12.5} lh={19} color={GREY}>
      {OPENER.body.join('\n\n')}
    </T>
    <T x={48} y={560} w={290} size={17} lh={23} weight={500} color={GREEN} heading>
      {OPENER.quote}
    </T>
    <T x={48} y={640} w={240} size={10} lh={12} color={GREY}>
      {OPENER.by}
    </T>
    <T x={48} y={758} w={200} size={9} lh={11} color={GREY} nowrap>
      {OPENER.footer}
    </T>
    <T x={330} y={755} w={20} size={12} lh={14} weight={600} color={GREEN} heading nowrap>
      03
    </T>
  </ReportPage>
);

export const MethodPage = () => (
  <ReportPage n={8} label="How we count">
    <PageHead eyebrow={METHOD.eyebrow} title={METHOD.title} sub={METHOD.sub} w={600} />
    {METHOD.blocks.map((b) => (
      <div key={b.t}>
        <Box x={b.x} y={b.y} w={300} h={2} bg={b.tone} />
        <T x={b.x} y={b.y + 14} w={290} size={17} lh={20} weight={600} heading as="h2">
          {b.t}
        </T>
        <T x={b.x} y={b.y + 42} w={290} size={11.5} lh={17} color={GREY}>
          {b.b}
        </T>
      </div>
    ))}
    <T x={48} y={672} w={600} size={10.5} lh={13} weight={500} nowrap>
      {METHOD.asOf}
    </T>
    <Box x={743} y={0} w={380} h={794} bg="#142916" />
    <Box x={773} y={48} w={76} h={68} bg="#ffffff" r={12} />
    <Logo x={783} y={56} w={56} h={52} />
    <T x={783} y={122} w={200} size={20} lh={24} weight={600} color="#ffffff" heading nowrap>
      {METHOD.brand}
    </T>
    <T x={783} y={300} w={300} size={22} lh={26} weight={600} color="#ffffff" heading as="h2">
      {METHOD.verifyTitle}
    </T>
    <T x={783} y={336} w={290} size={11.5} lh={17} color="#ffffff" op={0.8}>
      {METHOD.verifyText}
    </T>
    <Qr x={783} y={410} />
    <T x={783} y={578} w={300} size={11} lh={14} color="#ffffff" className="font-mono" nowrap>
      {METHOD.verifyUrl}
    </T>
    <T x={783} y={640} w={240} size={11} lh={16} color="#ffffff" op={0.8}>
      {METHOD.questions.join('\n')}
    </T>
    <T x={1060} y={755} w={30} size={12} lh={14} weight={600} color="#ffffff" heading nowrap>
      08
    </T>
    <T x={48} y={758} w={400} size={9} lh={11} color={GREY} nowrap>
      {FOOTER}
    </T>
  </ReportPage>
);
