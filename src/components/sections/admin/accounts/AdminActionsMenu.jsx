import { classNames } from '../../../../utils/classNames.js';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { ACTIONS } from './data/adminAccountDetailData.js';

/*
 * AdminActionsMenu — the "Admin actions" list. ⚠️ ASSUMPTION: Figma draws the flows (suspend, override, merge, delete, message) but not the menu that opens
 * them; this is a small centred card on the shared dialog shell. An action is enabled for the roles the rail copy names ("Suspend, override and merge need
 * Senior Admin or above"; delete is Super Admin only, 7.1.4a): `allowed` maps an action id to a boolean for the signed-in role.
 * Props: allowed, onPick(id), onClose.
 */

const AdminActionsMenu = ({ allowed, onPick, onClose }) => (
  <AgencyDialog
    label="Admin actions"
    onClose={onClose}
    scrimClassName="bg-[#1c2a21]/55"
    panelClassName="w-[min(420px,calc(100vw-32px))]"
  >
    <div className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21] bg-white p-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between gap-[12px]">
        <h2 className="m-0 font-sans text-[22px] leading-[28px] font-semibold text-[#1c2a21]">
          Admin actions
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid size-[30px] cursor-pointer place-items-center rounded-full border-0 bg-[#f8f8f4] text-[18px] leading-none text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          ×
        </button>
      </div>
      <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959]">
        Every action needs a reason and is logged under your name.
      </p>
      <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
        {ACTIONS.map((a) => {
          const ok = allowed[a.id];
          return (
            <li key={a.id}>
              <button
                type="button"
                data-autofocus={a.id === 'message' ? '' : undefined}
                disabled={!ok}
                onClick={() => onPick(a.id)}
                className={classNames(
                  'flex w-full cursor-pointer flex-col items-start gap-[2px] rounded-[12px] border border-solid px-[14px] py-[10px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                  ok
                    ? 'border-[#e1eae2] bg-white hover:bg-[#f3f8f4]'
                    : 'cursor-not-allowed border-[#eeeeee] bg-[#f8f8f4] opacity-60'
                )}
              >
                <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                  {a.label}
                </span>
                <span className="font-sans text-[12px] leading-[15px] text-[#737373]">
                  {a.note}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  </AgencyDialog>
);

export default AdminActionsMenu;
