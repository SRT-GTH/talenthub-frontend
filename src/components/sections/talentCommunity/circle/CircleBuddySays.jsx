import { BUDDY_AVATAR } from './circlePhotos.js';

/*
 * CircleBuddySays — Figma `Buddy says`: why Buddy picked this person. Focused #f8f8f4, Playful #faf4e8; r10, p7/10/7/8, 20px Buddy
 * avatar + 12/17 text. Props: children (the reason).
 */
const CircleBuddySays = ({ children }) => (
  <div className="flex items-center gap-[8px] rounded-[10px] bg-[#f8f8f4] py-[7px] pl-[8px] pr-[10px] playful:bg-[#faf4e8]">
    <img
      src={BUDDY_AVATAR}
      alt=""
      draggable="false"
      className="size-[20px] shrink-0 rounded-full object-cover"
    />
    <span className="min-w-0 flex-1 font-sans text-[12px] leading-[17px] text-[#1c2a21] max-lg:text-[13px] max-lg:leading-[18px]">
      {children}
    </span>
  </div>
);

export default CircleBuddySays;
