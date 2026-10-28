import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import LinkDialogShell, { LinkDialogClose } from './LinkDialogShell.jsx';
import { WARD_LINKED } from './data/linkWardData.js';

const log = debug('WardLinkedDialog');

/*
 * WardLinkedDialog — PW-09 "Elliot linked to your account" (Figma 10035:13112, modal 10035:13761): 560 wide, r24, p32, gap20, over the parent home. Head: 26/600 title (-0.13 tracking) + 15/400 #575755
 * line and a grey 36px close; ward row (avatar 40, 15/600 name · relation over 13/400 line, "Active" pill #ebf1ec / #c1d4c4 / #387440); 14/400 note; "Opt out" (secondary) + "See Elliot" (primary, → the ward page).
 * Props: onClose, onOptOut.
 * ⚠️ ASSUMPTION: "Opt out" only logs and closes (the opt-out result belongs to the My wards flow); "See Elliot" goes to /parent/wards/elliot (the My wards session's ward page).
 */
const WardLinkedDialog = ({ onClose, onOptOut }) => {
  const navigate = useNavigate();
  const { ward } = WARD_LINKED;
  return (
    <LinkDialogShell label={WARD_LINKED.title} onClose={onClose} width={560} padding={32}>
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex min-w-0 flex-col gap-[6px]">
          <h2 className="m-0 text-[26px] leading-[1.25] font-semibold tracking-[-0.13px] text-[#1c2a21]">
            {WARD_LINKED.title}
          </h2>
          <p className="m-0 text-[15px] leading-normal font-normal text-neutral-darker">
            {WARD_LINKED.body}
          </p>
        </div>
        <LinkDialogClose onClose={onClose} tone="grey" />
      </div>
      <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[8px] py-[14px]">
        <img
          src={ward.photo}
          alt=""
          width="40"
          height="40"
          className="size-[40px] shrink-0 rounded-full object-cover"
        />
        <div className="flex min-w-[160px] flex-1 flex-col gap-[3px]">
          <p className="m-0 text-[15px] leading-normal font-semibold text-[#1c2a21]">{ward.name}</p>
          <p className="m-0 text-[13px] leading-normal font-normal text-neutral-darker">
            {ward.line}
          </p>
        </div>
        <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-brand-green-light-active bg-brand-green-light px-[14px] text-[13px] leading-normal font-semibold text-brand-green">
          {ward.status}
        </span>
      </div>
      <p className="m-0 text-[14px] leading-normal font-normal text-neutral-darker">
        {WARD_LINKED.note}
      </p>
      <div className="flex flex-wrap items-center justify-end gap-[12px]">
        <ParentButton
          variant="secondary"
          onClick={() => {
            log('opt out ->', ward.id);
            onOptOut?.();
            navigate(`/parent/wards/${ward.id}?modal=opt-out`); // PO-01, built in the Opt out flow
          }}
        >
          {WARD_LINKED.optOut}
        </ParentButton>
        <ParentButton to={`/parent/wards/${ward.id}`} onClick={() => log('see ward', ward.id)}>
          {WARD_LINKED.see}
        </ParentButton>
      </div>
    </LinkDialogShell>
  );
};

export default WardLinkedDialog;
