import { debug } from '../../../../utils/debug.js';
import DialogCard, { DialogCloseButton } from '../../../ui/DialogCard.jsx';
import ParentButton from '../ParentButton.jsx';
import { LOGOUT } from './data/settingsData.js';

const log = debug('SettingsLogoutDialog');

/*
 * LogoutDialog — PS-06 "Log out (confirm)" (Figma 10053:4105, modal 10053:4423): 480 wide, p28, gap16, a 24/600 title with the grey close button, a 14/400 #575755 line and the buttons on the right
 * (Stay secondary, Log out primary). `?modal=logout` over the Account page.
 * Props: onStay (close, Esc and the X too), onConfirm.
 */
const LogoutDialog = ({ onStay, onConfirm }) => (
  <DialogCard label={LOGOUT.title} onClose={onStay} width={480} gap={16}>
    <div className="flex items-start justify-between gap-[16px]">
      <h2 className="m-0 text-[24px] leading-[29px] font-semibold text-[#1c2a21]">
        {LOGOUT.title}
      </h2>
      <DialogCloseButton onClose={onStay} />
    </div>
    <p className="m-0 text-[14px] leading-[20px] text-[#575755]">{LOGOUT.body}</p>
    <div className="flex flex-wrap items-center justify-end gap-[12px] py-[8px]">
      <ParentButton variant="secondary" onClick={onStay}>
        {LOGOUT.stay}
      </ParentButton>
      <ParentButton
        onClick={() => {
          log('log out confirmed');
          onConfirm();
        }}
      >
        {LOGOUT.confirm}
      </ParentButton>
    </div>
  </DialogCard>
);

export default LogoutDialog;
