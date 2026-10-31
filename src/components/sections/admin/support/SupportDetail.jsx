import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import {
  STATUS_ACTION,
  STATUS_LABEL,
  ageOf,
  dateTimeOf,
  listItemOf,
  monogramOf,
  roleLabel,
  timeOf,
} from './supportModel.js';

const log = debug('SupportDetail');

/*
 * SupportDetail — /admin/support/:ref (Figma 7.7.1b "Query detail"; 7.7.1c / 7.7.1d draw the same page behind their dialogs) on live data
 * (GET /api/admin/support/:ref): title + sub · a 371 wide list card (search, Mine / All, the queue's requests) next to the conversation card
 * (monogram + title + "···" actions, the waited pill, the thread, the ACCOUNT card, the reply pill). Cards: white, 1.2px #00522b, r24.
 * Thread: the requester's messages on the left (grey), staff replies on the right (green), internal notes on the right in amber with
 * "Internal note", system lines centred. Internal notes are never shown to the requester (the server filters them out of their view).
 * Props: detail (the /:ref answer), list (queue rows), busy, onClaim, onReply, onNote, onEscalate, onStatus(status).
 */

const CARD = 'rounded-[24px] border border-solid border-[#00522b] bg-white';

const Row = ({ item }) => (
  <li>
    <Link
      to={`/admin/support/${item.id}`}
      aria-current={item.selected ? 'page' : undefined}
      className={classNames(
        'flex items-center gap-[12px] rounded-[12px] px-[10px] py-[12px] no-underline hover:bg-[#f8f8f4] focus-visible:outline-2 focus-visible:outline-[#387440]',
        item.selected && 'border border-solid border-[#00522b] bg-white'
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <span className="truncate font-sans text-[15px] leading-[18px] font-medium text-[#1c2a21]">
          {item.title}
        </span>
        <span className="truncate font-sans text-[13px] leading-[16px] text-[#595959]">
          {item.subject}
        </span>
        <span className="font-sans text-[12.5px] leading-[16px] text-[#737373]">{item.status}</span>
      </div>
      <div className="flex flex-col items-end gap-[6px]">
        <span className="font-sans text-[13px] leading-[16px] text-[#737373]">{item.age}</span>
        {item.overdue ? (
          <span className="rounded-full bg-[#faf4e8] px-[7px] py-px font-sans text-[11px] leading-[13px] font-semibold text-[#8a5a00]">
            Overdue
          </span>
        ) : null}
      </div>
    </Link>
  </li>
);

const Entry = ({ e }) => {
  if (e.by.kind === 'system') {
    return (
      <p className="m-0 self-center rounded-full bg-[#f2f2ee] px-[14px] py-[6px] text-center font-sans text-[13px] leading-[16px] text-[#595959]">
        {e.body} · {timeOf(e.at)}
      </p>
    );
  }
  const fromRequester = e.by.kind === 'requester';
  const internal = e.visibility === 'internal';
  return (
    <div
      className={classNames(
        'flex max-w-[min(520px,90%)] flex-col gap-[4px] rounded-[12px] px-[16px] pt-[12px] pb-[8px]',
        fromRequester
          ? 'self-start bg-[#f2f2ee]'
          : internal
            ? 'self-end border border-dashed border-[#c8951a] bg-[#faf4e8]'
            : 'self-end bg-[#ebf1ec]'
      )}
    >
      <p className="m-0 font-sans text-[12px] leading-[14px] font-semibold text-[#595959]">
        {internal
          ? `Internal note · ${e.by.name}`
          : fromRequester
            ? e.by.name
            : `${e.by.name} · reply`}
        {e.macro ? ' · template' : ''}
      </p>
      <p className="m-0 font-sans text-[14px] leading-[20px] whitespace-pre-wrap text-[#1c2a21]">
        {e.body}
      </p>
      <p className="m-0 text-right font-sans text-[12px] leading-[14px] text-[#737373]">
        {dateTimeOf(e.at)}
      </p>
    </div>
  );
};

const AccountCard = ({ account, typeLabel }) => {
  if (!account) return null;
  return (
    <div className="flex w-full max-w-[320px] flex-col gap-[8px] self-start rounded-[10px] border border-solid border-[#00522b] bg-linear-to-b from-[#f4f9f4] to-[#ebf1ec] px-[18px] pt-[18px] pb-[16px]">
      <span className="text-[12px] leading-[14px] font-medium text-[#387440]">ACCOUNT</span>
      <span className="text-[16px] leading-[19px] font-medium text-[#1c2a21]">{account.name}</span>
      <span className="text-[13px] leading-[18px] text-[#595959]">
        {roleLabel(account.entityType)}
        {account.isMinor ? ' · under 18' : ''}
        {account.region ? ` · ${account.region}` : ''}
      </span>
      <span className="text-[13px] leading-[18px] text-[#595959]">
        {account.status || 'unknown status'}
        {account.lastLogin
          ? ` · last sign-in ${dateTimeOf(account.lastLogin)}`
          : ' · never signed in'}
      </span>
      {account.email ? (
        <span className="text-[13px] leading-[18px] text-[#595959]">{account.email}</span>
      ) : null}
      <Link
        to={`/admin/accounts/${account.userId}`}
        className="text-[13px] leading-[18px] font-semibold text-[#387440]"
      >
        Open account
      </Link>
      <span className="text-[12px] leading-[14px] text-[#737373]">
        {typeLabel}: account changes (suspensions, merges, overrides) go to a Senior Admin.
      </span>
    </div>
  );
};

const SupportDetail = ({ detail, list, busy, onClaim, onReply, onNote, onEscalate, onStatus }) => {
  const d = detail;
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('mine');
  const [q, setQ] = useState('');
  const me = d.me;
  const mine = d.case.assignee && d.case.assignee.userId === me.userId;
  const closed = d.case.status === 'closed';
  const rows = useMemo(() => {
    const all = (list || []).filter((r) =>
      q.trim()
        ? `${r.ref} ${r.subject} ${r.requester.name}`.toLowerCase().includes(q.trim().toLowerCase())
        : true
    );
    const mineRows = all.filter((r) => r.assignee && r.assignee.userId === me.userId);
    return { all, mine: mineRows };
  }, [list, q, me.userId]);
  const shown = (filter === 'mine' ? rows.mine : rows.all).map((r) => listItemOf(r, me, d.ref));

  const actions = [
    !mine && !closed
      ? { id: 'claim', label: d.case.assignee ? 'Take over this request' : 'Claim this request' }
      : null,
    !closed ? { id: 'reply', label: 'Reply (with template)' } : null,
    { id: 'note', label: 'Add internal note' },
    !closed && d.seniors.length && d.case.status !== 'escalated'
      ? { id: 'escalate', label: 'Escalate to Senior Admin' }
      : null,
    ...d.transitions
      .filter((s) => STATUS_ACTION[s] && s !== 'escalated')
      .map((s) => ({
        id: `status:${s}`,
        label:
          s === 'open' && !['resolved', 'closed'].includes(d.case.status)
            ? 'Move back to open'
            : STATUS_ACTION[s],
      })),
  ].filter(Boolean);

  const pick = (id) => {
    setMenu(false);
    log('action', id);
    if (id === 'claim') onClaim();
    else if (id === 'reply') onReply();
    else if (id === 'note') onNote();
    else if (id === 'escalate') onEscalate();
    else if (id.startsWith('status:')) onStatus(id.slice(7));
  };

  const firstAt = d.thread[0]?.at || d.case.createdAt;
  const sla =
    d.case.firstResponseAt || !d.case.firstDueAt
      ? null
      : new Date(d.case.firstDueAt) < new Date()
        ? 'First reply overdue'
        : `First reply due in ${ageOf(Date.now(), new Date(d.case.firstDueAt).getTime())}`;

  return (
    <div className="flex flex-col gap-[24px] font-sans">
      <div className="flex flex-col gap-[3px]">
        <h1 className="m-0 text-[32px] leading-[40px] font-semibold text-[#1c2a21]">
          Query {d.ref}
        </h1>
        <p className="m-0 text-[16px] leading-[24px] text-[#737373]">
          {d.subject} · {d.requester.name} ({roleLabel(d.requester.entityType)}) · sent{' '}
          {dateTimeOf(firstAt)} ·{' '}
          {d.case.assignee
            ? mine
              ? 'claimed by you'
              : `with ${d.case.assignee.name}`
            : 'not claimed yet'}
        </p>
      </div>
      <div className="flex flex-col gap-[10px] lg:flex-row">
        <aside
          aria-label="Queries"
          className={classNames(
            CARD,
            'flex w-full shrink-0 flex-col gap-[16px] px-[22px] py-[28px] lg:w-[371px]'
          )}
        >
          <input
            type="search"
            aria-label="Search queries"
            placeholder="Search queries…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-[45px] rounded-[12px] border border-solid border-[#cccccc] bg-white px-[16px] font-sans text-[13px] outline-none focus:border-[#387440]"
          />
          <div className="flex gap-[6px]">
            {[
              { id: 'mine', label: `Mine (${rows.mine.length})` },
              { id: 'all', label: `All (${rows.all.length})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={classNames(
                  'cursor-pointer rounded-full border border-solid border-[#e1eae2] px-[14px] py-[4px] font-sans text-[14px] leading-[25px] font-semibold',
                  filter === f.id ? 'bg-[#387440] text-white' : 'bg-white text-[#737373]'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          {shown.length ? (
            <ul className="m-0 flex list-none flex-col gap-[4px] p-0">
              {shown.map((it) => (
                <Row key={it.id} item={it} />
              ))}
            </ul>
          ) : (
            <p className="m-0 text-[14px] text-[#737373]">
              {filter === 'mine' ? 'Nothing claimed by you.' : 'No requests match.'}
            </p>
          )}
        </aside>
        <section
          aria-label={`${d.ref} · ${d.subject}`}
          className={classNames(
            CARD,
            'flex min-h-[640px] min-w-0 flex-1 flex-col gap-[20px] px-[22px] py-[18px]'
          )}
        >
          <header className="flex items-center gap-[14px] rounded-full border border-solid border-[#00522b] px-[12px] py-[8px]">
            <span className="grid size-[53px] shrink-0 place-items-center rounded-full bg-[#387440] text-[20px] font-semibold text-white">
              {monogramOf(d.requester.name)}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
              <span className="truncate text-[16px] leading-[19px] font-medium text-[#1c2a21]">
                {d.ref} · {d.typeLabel}
              </span>
              <span className="text-[14px] leading-[17px] text-[#737373]">
                {STATUS_LABEL[d.case.status]} · {d.case.priority} priority
                {d.case.restricted ? ' · restricted' : ''}
                {d.page ? ` · from ${d.page}` : ''}
              </span>
            </div>
            <div className="relative">
              <button
                type="button"
                aria-label="Query actions"
                aria-haspopup="menu"
                aria-expanded={menu}
                disabled={busy}
                onClick={() => setMenu((v) => !v)}
                className="grid h-[28px] w-[44px] cursor-pointer place-items-center rounded-full border border-solid border-[#e1eae2] bg-white text-[#1c2a21] disabled:opacity-50"
              >
                ···
              </button>
              {menu ? (
                <ul
                  role="menu"
                  className="absolute top-[34px] right-0 z-10 m-0 w-[240px] list-none rounded-[12px] border border-solid border-[#e1eae2] bg-white p-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                >
                  {actions.map((m) => (
                    <li key={m.id} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => pick(m.id)}
                        className="w-full cursor-pointer rounded-[8px] border-0 bg-transparent px-[10px] py-[9px] text-left font-sans text-[14px] text-[#1c2a21] hover:bg-[#f8f8f4]"
                      >
                        {m.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </header>
          <div className="flex flex-col gap-[14px]">
            <span className="self-center rounded-full bg-[#e5e5e5]/50 px-[14px] py-[6px] text-[13px] leading-[16px] text-[#595959]">
              Waited {ageOf(firstAt)}
              {sla ? ` · ${sla}` : ''}
            </span>
            {d.thread.map((e, i) => (
              <div key={e.id} className="flex flex-col gap-[14px]">
                <Entry e={e} />
                {i === 0 ? <AccountCard account={d.account} typeLabel={d.typeLabel} /> : null}
              </div>
            ))}
            {d.csat ? (
              <p className="m-0 self-center font-sans text-[13px] text-[#595959]">
                Rated {d.csat.score} / 5{d.csat.comment ? ` · “${d.csat.comment}”` : ''}
              </p>
            ) : null}
          </div>
          {!closed ? (
            <button
              type="button"
              onClick={onReply}
              disabled={busy}
              className="mt-auto flex h-[60px] w-full cursor-pointer items-center justify-between rounded-full border border-solid border-[#00522b] bg-white pr-[12px] pl-[20px] text-left font-sans text-[14px] text-[#737373] disabled:opacity-50"
            >
              Reply to {d.requester.name.split(' ')[0]}…
              <span
                aria-hidden="true"
                className="grid size-[36px] place-items-center rounded-full bg-[#387440] text-white"
              >
                ➤
              </span>
            </button>
          ) : (
            <p className="mt-auto mb-0 text-center font-sans text-[14px] text-[#737373]">
              Closed. Reopen it from the ··· menu to reply.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default SupportDetail;
