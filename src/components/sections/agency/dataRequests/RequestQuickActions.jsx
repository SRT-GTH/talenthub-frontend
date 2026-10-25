import { classNames } from '../../../../utils/classNames.js';
import {
  DataRequestIconMapAction,
  DataRequestIconSearch,
  DataRequestIconSuitcase,
  DataRequestIconUserPlus,
} from './dataRequestIcons.jsx';

/*
 * RequestQuickActions — the four action cards under the hero (Figma "Quick actions strip" 8597:1363: 320×88, r16, white 1 border; tones green /
 * blue / green / purple; 44px white icon tile). Open dataset · Run a query · Add a viewer · New request. While the request is not approved the first
 * three read "Opens after approval" and are disabled (aria-disabled, not focusable as links).
 * Props: actions [{ id, label, hint, tone, icon }], locked (bool), onAction(id).
 */

const ICONS = {
  map: [DataRequestIconMapAction, 'text-[#2d5d33]'],
  search: [DataRequestIconSearch, 'text-[#244a9f]'],
  'user-plus': [DataRequestIconUserPlus, 'text-[#2d5d33]'],
  suitcase: [DataRequestIconSuitcase, 'text-[#6d28d9]'],
};
const TONES = { green: 'bg-[#ebf1ec]', blue: 'bg-[#eaeffb]', purple: 'bg-[#f5f3ff]' };

const RequestQuickActions = ({ actions, locked, onAction }) => (
  <ul className="m-0 grid list-none grid-cols-1 gap-[16px] p-0 sm:grid-cols-2 xl:grid-cols-4">
    {actions.map((action) => {
      const [Icon, color] = ICONS[action.icon];
      const disabled = locked && action.id !== 'new';
      return (
        <li key={action.id} className="flex">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onAction(action.id)}
            className={classNames(
              'flex min-h-[88px] w-full items-center gap-[12px] rounded-[16px] border border-solid border-[#fefefe] px-[16px] py-[14px] text-left shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
              TONES[action.tone],
              disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:brightness-[0.98]'
            )}
          >
            <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-white">
              <Icon className={classNames('size-[22px]', color)} />
            </span>
            <span className="flex min-w-0 flex-col gap-[2px]">
              <span className="font-sans text-[14px] leading-[20px] font-semibold tracking-[0.1px] text-[#1c2a21]">
                {action.label}
              </span>
              <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#959592]">
                {action.hint}
              </span>
            </span>
          </button>
        </li>
      );
    })}
  </ul>
);

export default RequestQuickActions;
