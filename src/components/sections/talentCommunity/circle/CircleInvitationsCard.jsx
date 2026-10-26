import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY, CIRCLE_PEOPLE } from './circleData.js';
import CircleAvatar from './CircleAvatar.jsx';
import CircleInvitationRow from './CircleInvitationRow.jsx';
import { CARD, FOCUS_RING, HEADING } from './circleStyles.js';

/*
 * CircleInvitationsCard — Figma `Invitations preview` (NW-01: title + "See all 3" + the first two invitations) and `Invitations`
 * (NW-04: the Received · 3 / Sent · 2 chips, "Manage", every invitation, the footnote). Rows come from INVITATIONS_RESPONSE.
 * Props: mode ('preview' | 'full'), received (rows still to answer: [{ id, ago, note }]), accepted (ids accepted this session),
 * sent ([{ id, ago }]), sub ('received' | 'sent'), onSub(sub), total (the "3" of See all / Received), onSeeAll(), onAccept(person),
 * onIgnore(person), onSayHi(person), xpFor (person id wearing the Playful "+5 XP" sticker).
 * ⚠️ ASSUMPTIONS: "Manage" is inert (no destination drawn); the Sent list (not drawn) reuses the row shape without buttons.
 */
const CircleInvitationsCard = ({
  mode,
  received,
  accepted,
  sent,
  sub,
  onSub,
  total,
  onSeeAll,
  onAccept,
  onIgnore,
  onSayHi,
  people = CIRCLE_PEOPLE,
  onWithdraw,
  showManage = true,
}) => {
  const preview = mode === 'preview';
  const rows = preview ? received.slice(0, 2) : received;
  return (
    <section
      className={classNames(CARD, 'flex flex-col py-[18px] pb-[8px]', !preview && 'pt-[16px]')}
    >
      {preview ? (
        <div className="flex items-center justify-between px-[16px] pb-[8px]">
          <h2 className={classNames(HEADING, 'text-[18px] leading-[21px]')}>
            {COPY.invitationsTitle}
          </h2>
          <button
            type="button"
            onClick={onSeeAll}
            className={`cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#387440] ${FOCUS_RING}`}
          >
            {`${COPY.seeAll} ${total}`}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-[8px] px-[16px] pb-[12px]">
          <div role="group" aria-label="Invitations" className="flex items-center gap-[8px]">
            {['received', 'sent'].map((id) => {
              const on = sub === id;
              const label = id === 'received' ? `Received · ${total}` : `Sent · ${sent.length}`;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onSub(id)}
                  className={classNames(
                    'inline-flex h-[22px] cursor-pointer items-center rounded-full border-0 px-[10px] font-sans text-[12px] font-semibold leading-[14px] max-lg:h-[28px]',
                    on ? 'bg-[#1c2a21] text-white' : 'bg-[#f8f8f4] text-[#595959]',
                    'playful:h-[24px] playful:border playful:border-solid',
                    on ? 'playful:border-[#1c2a21]' : 'playful:border-[rgba(28,42,33,0.35)]',
                    FOCUS_RING
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {showManage && (
            <button
              type="button"
              className={`cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#387440] ${FOCUS_RING}`}
            >
              {COPY.manage}
            </button>
          )}
        </div>
      )}
      <ul className="m-0 flex list-none flex-col p-0">
        {!preview && sub === 'sent'
          ? sent
              .filter((item) => people[item.id])
              .map((item, i) => (
                <li
                  key={item.id}
                  className={classNames(
                    'flex items-center gap-[14px] px-[16px] py-[14px]',
                    i > 0 && 'border-t border-solid border-[#e7e7e7]'
                  )}
                >
                  <CircleAvatar
                    id={item.id}
                    size={56}
                    photo={people[item.id]?.photo}
                    name={people[item.id]?.name}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
                    <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                      {people[item.id]?.name}
                    </span>
                    <span className="font-sans text-[13px] leading-[16px] text-[#595959] max-lg:text-[14px]">
                      {people[item.id]?.headline}
                    </span>
                    <span className="font-sans text-[12px] leading-[14px] text-[#737373] max-lg:text-[13px]">
                      {item.ago}
                    </span>
                  </div>
                  {onWithdraw ? (
                    <button
                      type="button"
                      onClick={() => onWithdraw(item)}
                      className={`cursor-pointer rounded-full border border-solid border-[#e7e7e7] bg-white px-[12px] py-[6px] font-sans text-[13px] font-semibold leading-[16px] text-[#595959] max-lg:min-h-[44px] ${FOCUS_RING}`}
                    >
                      Withdraw
                    </button>
                  ) : (
                    <span className="inline-flex h-[22px] items-center rounded-full bg-[#f8f8f4] px-[10px] font-sans text-[12px] font-semibold leading-[14px] text-[#595959]">
                      {COPY.linkUpSent}
                    </span>
                  )}
                </li>
              ))
          : rows
              .filter((invite) => people[invite.id])
              .map((invite, i) => (
                <CircleInvitationRow
                  key={invite.id}
                  person={people[invite.id]}
                  invite={invite}
                  accepted={accepted.includes(invite.id)}
                  divided={!preview && i > 0}
                  onAccept={onAccept}
                  onIgnore={onIgnore}
                  onSayHi={onSayHi}
                />
              ))}
      </ul>
    </section>
  );
};

export default CircleInvitationsCard;
