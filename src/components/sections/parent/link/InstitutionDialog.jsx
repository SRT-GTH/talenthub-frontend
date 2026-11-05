import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import LinkDialogShell, { LinkDialogClose } from './LinkDialogShell.jsx';
import spotSettings from '../../../../assets/parent/spot-settings.svg';
import checkIcon from '../../../../assets/parent/link-check.svg';
import { INSTITUTION_COPY } from './data/linkWardData.js';

const log = debug('InstitutionDialog');

/*
 * InstitutionDialog — PW-07d "Caring for 100 or more children?" (Figma 10052:3470, modal 10052:3751): 540 wide, r24, p28, gap16. Spot · Settings 80 + close 36, 24/600 title, 14/20 body,
 * info card (#ebf1ec, r24, p18, three check rows 13.5/500), then "Keep as a parent" (secondary) + "Register an institution" (primary).
 * Props: onClose, onRegister. "Keep as a parent" and the close button both call onClose.
 */
const InstitutionDialog = ({ onClose, onRegister }) => (
  <LinkDialogShell label={INSTITUTION_COPY.title} onClose={onClose} width={540} gap={16}>
    <div className="flex items-start justify-between">
      <img src={spotSettings} alt="" aria-hidden="true" className="size-[80px] shrink-0" />
      <LinkDialogClose onClose={onClose} />
    </div>
    <h2 className="m-0 text-[24px] leading-normal font-semibold text-[#1c2a21]">
      {INSTITUTION_COPY.title}
    </h2>
    <p className="m-0 text-[14px] leading-[1.45] font-normal text-neutral-darker">
      {INSTITUTION_COPY.body}
    </p>
    <ul className="m-0 flex list-none flex-col gap-[16px] rounded-[24px] bg-brand-green-light p-[18px]">
      {INSTITUTION_COPY.points.map((point) => (
        <li key={point} className="flex items-center gap-[10px]">
          <img src={checkIcon} alt="" aria-hidden="true" className="size-[18px] shrink-0" />
          <span className="text-[13.5px] leading-normal font-medium text-[#1c2a21]">{point}</span>
        </li>
      ))}
    </ul>
    <div className="flex flex-wrap items-center justify-end gap-[12px]">
      <ParentButton variant="secondary" onClick={onClose}>
        {INSTITUTION_COPY.keep}
      </ParentButton>
      <ParentButton
        onClick={() => {
          log('register an institution');
          onRegister?.();
        }}
      >
        {INSTITUTION_COPY.register}
      </ParentButton>
    </div>
  </LinkDialogShell>
);

export default InstitutionDialog;
