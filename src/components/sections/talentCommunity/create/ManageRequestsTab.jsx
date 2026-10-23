import Button from '../../../ui/Button.jsx';
import { classNames } from '../../../../utils/classNames.js';
import { fillCopy } from '../communityDialogUtils.js';
import { MANAGE_COPY } from './createCommunityData.js';
import { Callout, PersonRow } from './CreateDialogParts.jsx';
import { FOCUS_RING, TEXT_ACTION } from './createCommunityStyles.js';

/*
 * ManageRequestsTab — Figma CC-14: "{n} people want to join" + "Approve all", one row per request (avatar, name, one-line answer,
 * "Decline" / "Approve"), then the "How requests work" callout. Props: requests, onApprove(request), onDecline(request), onApproveAll().
 */
const ManageRequestsTab = ({ requests, onApprove, onDecline, onApproveAll }) => (
  <>
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center justify-between gap-[8px]">
        <h3 className="m-0 font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
          {requests.length
            ? fillCopy(MANAGE_COPY.requestsCount, { count: String(requests.length) })
            : MANAGE_COPY.requestsNone}
        </h3>
        {requests.length ? (
          <button
            type="button"
            className={classNames(TEXT_ACTION, FOCUS_RING)}
            onClick={onApproveAll}
          >
            {MANAGE_COPY.approveAll}
          </button>
        ) : null}
      </div>
      <div className="flex flex-col">
        {requests.map((request) => (
          <PersonRow
            key={request.id}
            avatar={request.avatar}
            name={request.name}
            detail={request.note}
            trailing={
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-[8px]">
                <Button
                  variant="tertiary"
                  size="lg"
                  aria-label={`${MANAGE_COPY.decline} ${request.name}`}
                  onClick={() => onDecline(request)}
                >
                  {MANAGE_COPY.decline}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  aria-label={`${MANAGE_COPY.approve} ${request.name}`}
                  onClick={() => onApprove(request)}
                >
                  {MANAGE_COPY.approve}
                </Button>
              </div>
            }
          />
        ))}
      </div>
    </div>
    <Callout title={MANAGE_COPY.howTitle}>{MANAGE_COPY.howBody}</Callout>
  </>
);

export default ManageRequestsTab;
