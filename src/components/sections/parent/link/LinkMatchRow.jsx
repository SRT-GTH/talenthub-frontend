import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import { MATCH, SEARCH_COPY } from './data/linkWardData.js';

const log = debug('LinkMatchRow');

/*
 * LinkMatchRow — the search result (Figma "row · Kwesi M. · 15" 10034:142100): avatar 40, 15/600 title over a 13/400 #575755 line, and the primary "Send link request" button (196 x 56) on the right.
 * Props: onSend. Below sm the button drops under the text at full width.
 */
const LinkMatchRow = ({ onSend }) => (
  <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[12px] py-[14px]">
    <img
      src={MATCH.photo}
      alt=""
      width="40"
      height="40"
      className="size-[40px] shrink-0 rounded-full object-cover"
    />
    <div className="flex min-w-[180px] flex-1 flex-col gap-[3px] font-sans leading-normal">
      <p className="m-0 text-[15px] font-semibold text-[#1c2a21]">{MATCH.title}</p>
      <p className="m-0 text-[13px] font-normal text-neutral-darker">{MATCH.line}</p>
    </div>
    <ParentButton
      className="max-sm:w-full"
      onClick={() => {
        log('send link request', { ward: MATCH.id });
        onSend?.();
      }}
    >
      {SEARCH_COPY.send}
    </ParentButton>
  </div>
);

export default LinkMatchRow;
