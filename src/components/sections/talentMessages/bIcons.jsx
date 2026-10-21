/*
 * Cards + dialogs (package B) icons — exported from Figma (Talent Messages T-MSG-05…09, 12; instance node ids in each comment)
 * and recoloured through `currentColor`, so the parent sets the Figma colour with a text-* class. White "frame" rects that
 * the export adds behind some icons are dropped.
 */
const Svg = ({ className = '', width, height, viewBox, children }) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox={viewBox}
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

const STROKE = { strokeLinecap: 'round', strokeLinejoin: 'round' };

// 7433:3354;7515:5146 — Farmerline logo mark (44×44, brand colours kept as drawn; not recoloured)
export const FarmerlineMarkIcon = ({ className = '' }) => (
  <Svg className={className} width="44" height="44" viewBox="0 0 44 44">
    <path
      d="M33 0H11C4.92487 0 0 4.92487 0 11V33C0 39.0751 4.92487 44 11 44H33C39.0751 44 44 39.0751 44 33V11C44 4.92487 39.0751 0 33 0Z"
      fill="#2F7A3B"
    />
    <path d="M22 32.9998V20.1665" stroke="#fff" strokeWidth="2.75" strokeLinecap="round" />
    <path
      d="M22 22.0002C22 16.5002 25.6667 12.8335 31.1667 12.8335C31.1667 18.3335 27.5 22.0002 22 22.0002Z"
      fill="#C9F27B"
    />
    <path
      d="M22 25.6667C22 21.0833 18.7917 17.875 13.75 17.875C13.75 22.4583 16.9583 25.6667 22 25.6667Z"
      fill="#fff"
    />
  </Svg>
);

// 7430:3157 — verified-employer shield (13×13, white on the dark card, #387440 on the Closed card)
export const ShieldCheckIcon = ({ className = '' }) => (
  <Svg className={className} width="13" height="13" viewBox="0 0 13 13">
    <path
      d="M6.50033 11.9168C6.50033 11.9168 10.8337 9.75016 10.8337 6.50016V2.7085L6.50033 1.0835L2.16699 2.7085V6.50016C2.16699 9.75016 6.50033 11.9168 6.50033 11.9168Z"
      stroke="currentColor"
      strokeWidth="1.08333"
      {...STROKE}
    />
    <path
      d="M4.875 6.49984L5.95833 7.58317L8.125 5.4165"
      stroke="currentColor"
      strokeWidth="1.08333"
      {...STROKE}
    />
  </Svg>
);

// 7430:3175 — gold sparkle beside "88% match" (14×14 frame, 10×10 glyph, #f3c84b)
export const MatchSparkleIcon = ({ className = '' }) => (
  <Svg className={className} width="14" height="14" viewBox="-2 -2 14 14">
    <path
      d="M4.99956 0.625163L6.18704 3.81261L9.37449 5.00009L6.18704 6.18757L4.99956 9.37501L3.81208 6.18757L0.62464 5.00009L3.81208 3.81261L4.99956 0.625163Z"
      stroke="currentColor"
      strokeWidth="1.24998"
      {...STROKE}
    />
  </Svg>
);

// 7430:3235 — "Track" arrow (14×14, #387440)
export const TrackArrowIcon = ({ className = '' }) => (
  <Svg className={className} width="14" height="14" viewBox="0 0 14 14">
    <path
      d="M2.91699 6.99984H11.0837M7.58366 2.9165L11.667 6.99984L7.58366 11.0832"
      stroke="currentColor"
      strokeWidth="1.16667"
      {...STROKE}
    />
  </Svg>
);

// 8132:381876;2018:12875 — arrow inside the "View and apply" button (20×20 button glyph, #387440)
export const ButtonArrowIcon = ({ className = '' }) => (
  <Svg className={className} width="20" height="20" viewBox="0 0 20 20">
    <path
      d="M11.736 5.20385C12.0376 4.91996 12.5123 4.93435 12.7962 5.23598L16.7962 9.48598C17.068 9.77477 17.068 10.2252 16.7962 10.514L12.7962 14.764C12.5123 15.0657 12.0376 15.08 11.736 14.7962C11.4343 14.5123 11.42 14.0376 11.7038 13.736L14.5142 10.75H3.75C3.33579 10.75 3 10.4142 3 10C3 9.58579 3.33579 9.25 3.75 9.25H14.5142L11.7038 6.26403C11.42 5.9624 11.4343 5.48774 11.736 5.20385Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </Svg>
);

// 7430:3231 — white tick inside the green "applied" disc (12×12)
export const AppliedTickIcon = ({ className = '' }) => (
  <Svg className={className} width="12" height="12" viewBox="0 0 12 12">
    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" {...STROKE} />
  </Svg>
);

// 7421:2796 / 7421:2803 — calendar (14×14; #244a9f on the strip, #595959 on the detail line)
export const CalendarIcon = ({ className = '' }) => (
  <Svg className={className} width="14" height="14" viewBox="0 0 14 14">
    <path
      d="M2.91667 2.33325H11.0833C11.7277 2.33325 12.25 2.85559 12.25 3.49992V11.6666C12.25 12.3109 11.7277 12.8333 11.0833 12.8333H2.91667C2.27233 12.8333 1.75 12.3109 1.75 11.6666V3.49992C1.75 2.85559 2.27233 2.33325 2.91667 2.33325Z"
      stroke="currentColor"
      strokeWidth="1.05"
      {...STROKE}
    />
    <path
      d="M9.33333 1.16675V3.50008M4.66667 1.16675V3.50008M1.75 5.83341H12.25"
      stroke="currentColor"
      strokeWidth="1.05"
      {...STROKE}
    />
  </Svg>
);

// 7421:2808 — video camera (14×14, #595959)
export const VideoCallIcon = ({ className = '' }) => (
  <Svg className={className} width="14" height="14" viewBox="0 0 14 14">
    <path
      d="M12.8334 4.66675L9.33337 7.00008L12.8334 9.33341V4.66675Z"
      stroke="currentColor"
      strokeWidth="1.05"
      {...STROKE}
    />
    <path
      d="M2.33329 3.5H8.16663C8.81096 3.5 9.33329 4.02233 9.33329 4.66667V9.33333C9.33329 9.97767 8.81096 10.5 8.16663 10.5H2.33329C1.68896 10.5 1.16663 9.97767 1.16663 9.33333V4.66667C1.16663 4.02233 1.68896 3.5 2.33329 3.5Z"
      stroke="currentColor"
      strokeWidth="1.05"
      {...STROKE}
    />
  </Svg>
);

// 7421:3355 — check in the "You're confirmed" strip (16×16, #2d5d33)
export const ConfirmedCheckIcon = ({ className = '' }) => (
  <Svg className={className} width="16" height="16" viewBox="0 0 16 16">
    <path
      d="M13.3334 4L6.00008 11.3333L2.66675 8"
      stroke="currentColor"
      strokeWidth="1.2"
      {...STROKE}
    />
  </Svg>
);

// 7420:3593 — row check in "Before you apply" (14×10 glyph, #387440)
export const SeenCheckIcon = ({ className = '' }) => (
  <Svg className={className} width="14" height="10" viewBox="0 0 14 10">
    <path
      d="M13.2035 0.70295L4.60936 9.29705L0.70295 5.39064"
      stroke="currentColor"
      strokeWidth="1.40631"
      {...STROKE}
    />
  </Svg>
);

// 7420:3604 — eye-off on the "Work experience is hidden" row (18×18, #c8951a)
export const EyeOffIcon = ({ className = '' }) => (
  <Svg className={className} width="18" height="18" viewBox="0 0 18 18">
    <path
      d="M7.425 3.15C7.94324 3.04461 8.47118 2.99433 9 3C14.25 3 16.5 9 16.5 9C16.1598 9.72479 15.7315 10.4049 15.225 11.025M4.95 4.95C3.44679 5.95407 2.25232 7.35628 1.5 9C1.5 9 3.75 15 9 15C10.439 15.0093 11.8484 14.5917 13.05 13.8M4.95 4.95L1.5 1.5M4.95 4.95L7.425 7.425M7.425 7.425L10.575 10.575M7.425 7.425C7.10003 7.85829 6.94227 8.39425 6.98066 8.9345C7.01905 9.47475 7.25103 9.98302 7.63401 10.366C8.01698 10.749 8.52525 10.9809 9.0655 11.0193C9.60575 11.0577 10.1417 10.9 10.575 10.575M10.575 10.575L16.5 16.5"
      stroke="currentColor"
      strokeWidth="1.35"
      {...STROKE}
    />
  </Svg>
);

// 7420:3584 — close "x" (18×18, #595959)
export const CloseXIcon = ({ className = '' }) => (
  <Svg className={className} width="18" height="18" viewBox="0 0 18 18">
    <path
      d="M13.5 4.5L9 9M9 9L4.5 13.5M9 9L4.5 4.5M9 9L13.5 13.5"
      stroke="currentColor"
      strokeWidth="1.35"
      {...STROKE}
    />
  </Svg>
);
// icon/pin 7430:3166 — location pin on the first fact chip (outline + inner dot, from the Figma MCP asset server).
export const PinIcon = ({ className = '' }) => (
  <Svg className={className} width="12" height="12" viewBox="0 0 12 12">
    <path
      d="M10 5C10 8 6 11 6 11C6 11 2 8 2 5C2 3.93913 2.42143 2.92172 3.17157 2.17157C3.92172 1.42143 4.93913 1 6 1C7.06087 1 8.07828 1.42143 8.82843 2.17157C9.57857 2.92172 10 3.93913 10 5Z"
      stroke="currentColor"
      {...STROKE}
    />
    <path
      d="M7.5 5C7.5 5.82843 6.82843 6.5 6 6.5C5.17157 6.5 4.5 5.82843 4.5 5C4.5 4.17157 5.17157 3.5 6 3.5C6.82843 3.5 7.5 4.17157 7.5 5Z"
      stroke="currentColor"
      {...STROKE}
    />
  </Svg>
);

/* icon/undo (Figma 7430:3279), exported via the Figma MCP asset server. */
export const UndoIcon = ({ className = '' }) => (
  <Svg className={className} width="14" height="14" viewBox="0 0 14 14">
    <path
      d="M5.25 8.16667L2.33333 5.25L5.25 2.33333"
      stroke="currentColor"
      strokeWidth="1.16667"
      {...STROKE}
    />
    <path
      d="M2.33333 5.25H8.75C9.52355 5.25 10.2654 5.55729 10.8124 6.10427C11.3594 6.65125 11.6667 7.39312 11.6667 8.16667C11.6667 8.94021 11.3594 9.68208 10.8124 10.2291C10.2654 10.776 9.52355 11.0833 8.75 11.0833H7"
      stroke="currentColor"
      strokeWidth="1.16667"
      {...STROKE}
    />
  </Svg>
);
