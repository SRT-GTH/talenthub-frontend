/*
 * CardHint — the right-hand aside of a card header (Figma "aside" 12/14 500 #595959) with a shorter text below lg: the phone AND tablet frames (11.4.5o/p) use "Tap a bar to
 * filter" / "Talents per open opportunity" where the desktop says the longer sentence, while Theme 8's CardHeader only switches below md. Pass it through PublicCard headerExtra.
 * Props: full, compact.
 */

const CardHint = ({ full, compact }) => (
  <span className="text-right font-sans text-[12px] leading-[14px] font-medium text-[#595959]">
    <span className="lg:hidden">{compact}</span>
    <span className="max-lg:hidden">{full}</span>
  </span>
);

export default CardHint;
