import { INVITATIONS_RESPONSE } from './circleData.js';
import { CircleInfoIcon } from './circleIcons.jsx';

/* CircleInvitationsFootnote — the grey info line under the Invitations list (NW-04): "Requests you ignore aren’t shown…". */
const CircleInvitationsFootnote = () => (
  <p className="m-0 flex items-center gap-[8px] font-sans text-[13px] leading-[16px] text-[#737373] max-lg:text-[14px]">
    <CircleInfoIcon className="size-[14px] shrink-0" />
    {INVITATIONS_RESPONSE.footnote}
  </p>
);

export default CircleInvitationsFootnote;
