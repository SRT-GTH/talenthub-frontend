/*
 * landingLinkClasses — the three link-buttons of the landing hero (Figma 8514:188 / 8514:196, mobile 8515:2684 / 8515:2691). They are <Link>s,
 * not <button>s, so they carry the look of the shared Button (shelf, 2px border, 700 16/24) as classes. Same approach as the sidebar's
 * "Partner sign-in →".
 *   PRIMARY    #387440, border #2a5730 2px, r14, px34 py16 (56 high), shelf 0 4px 0, text in the peach→mint gradient of the shared primary Button
 *   SECONDARY  #e1eae2, border #c1d4c4 2px, r14, px22 py12 (48 high), text #165d3a, soft shadow 0 1 2
 */

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export const PRIMARY_LINK = `inline-flex items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[34px] py-[14px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap shadow-[0_4px_0_#224626] ${FOCUS}`;

export const SECONDARY_LINK = `inline-flex items-center justify-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[22px] py-[10px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#165d3a] shadow-[0_1px_2px_rgba(0,0,0,0.12)] ${FOCUS}`;

/** The gradient text of the primary button (shared Button: Figma 188.377deg peach → mint). */
export const PRIMARY_TEXT_STYLE = {
  backgroundImage: 'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};
