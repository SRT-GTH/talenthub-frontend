/*
 * QueueHeader — page header of the records / credentials lists (Figma 11.2.3a 8593:17, 11.2.4a): title 34/41 600 -0.68 + count sticker (#ebf1ec, 13/700) + sentence 16/24 #737373.
 * Props: title (the page <h1>), count (sticker text), sentence.
 */
const QueueHeader = ({ title, count, sentence }) => (
  <header className="flex flex-col gap-[3px] font-sans">
    <div className="flex flex-wrap items-center gap-[12px]">
      <h1 className="m-0 text-[28px] leading-[34px] font-semibold tracking-[-0.68px] text-[#1c2a21] md:text-[34px] md:leading-[41px]">
        {title}
      </h1>
      <span className="inline-flex h-[26px] items-center rounded-full bg-[#ebf1ec] px-[11px] text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
        {count}
      </span>
    </div>
    <p className="m-0 pb-[0.59px] text-[16px] leading-[24px] tracking-[0.2px] text-[#737373]">
      {sentence}
    </p>
  </header>
);

export default QueueHeader;
