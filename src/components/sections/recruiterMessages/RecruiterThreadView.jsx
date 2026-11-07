import { useNavigate } from 'react-router-dom';
import { MeatballMenuIcon } from '../jobPostings/jobPostingsIcons.jsx';
import { classNames } from '../../../utils/classNames.js';
import illustration from '../../../assets/recruiter-messages/empty-conversation-illustration.png';
import ThreadOptionsMenu from './ThreadOptionsMenu.jsx';
import {
  APPLICATION_CARD as CARD,
  ARCHIVE_VIEW,
  AUTO_NOTE,
  COMPOSER,
  EMPTY,
  MENU_ITEMS,
  THREADS,
  THREAD_HEADER,
} from './recruiterInboxData.js';
import { Avatar, EmptyTile, InboxGlyph } from './recruiterInboxParts.jsx';
import { ICONS } from './recruiterInboxIcons.js';

/*
 * RecruiterThreadView — the right panel of the recruiter inbox (Figma R-MSG-01 10124:24516, white, r24, 1.2px #00522b/10, pad 18/22/14).
 * Header pill (r100): avatar + name/meta, "84% match" and "Re: job · stage" chips, "…" menu. Body: day pills, the application card (dark green, 537 wide), the auto-message note, bubbles.
 * Footer: composer pill (62px, 1.5px #c1d4c4) with "Help me reply" and the send button. Archived conversations show a banner with "Unarchive" under the header.
 * With no conversation it shows one of four empty states: `select`, `select-archived`, `start`, `live` (R-MSG-02b / -07 / -11 / -08).
 * Props: conversation, archived, menuOpen, onMenu(open), onMenuItem(id), onUnarchive, onBack (below lg), state, onNavigate(to), className.
 */
const ApplicationCard = ({ conversation, onPipeline, onProfile }) => (
  <div
    className="flex w-full max-w-[537px] flex-col gap-[16px] self-start rounded-[16px] px-[16px] py-[20px] shadow-[0_5px_17px_rgba(31,69,38,0.09)]"
    style={{ backgroundImage: 'linear-gradient(135deg, #142916 0%, #2a5730 100%)' }}
  >
    <div className="flex items-center gap-[12px]">
      <Avatar conversation={conversation} size={48} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-sans text-[16px] leading-[24px] font-semibold text-[#f8f8f4]">
          {conversation.name}
        </span>
        <span className="font-sans text-[12px] leading-[16px] text-[#fdfdfc]">{CARD.role}</span>
      </div>
      <span className="inline-flex shrink-0 items-center gap-[4px] rounded-full bg-white/12 px-[14px] py-[8px] font-sans text-[12px] leading-[14px] font-medium text-white max-sm:hidden">
        <InboxGlyph name="briefcase" className="size-[12px]" />
        {CARD.jobPill}
      </span>
    </div>
    <div className="flex flex-wrap gap-[6px]">
      {CARD.facts.map((fact, index) => (
        <span
          key={fact}
          className="inline-flex items-center gap-[4px] rounded-full bg-white/12 px-[14px] py-[8px] font-sans text-[12px] leading-[14px] font-medium text-white"
        >
          <InboxGlyph name={['check', 'calendar', 'user'][index]} className="size-[12px]" />
          {fact}
        </span>
      ))}
    </div>
    <div className="flex flex-col gap-[8px] rounded-[12px] bg-white/8 px-[12px] py-[10px]">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-[6px] font-sans text-[15px] leading-[18px] font-semibold text-white">
          <InboxGlyph name="sparkle-match" className="size-[14px]" />
          {CARD.match}
        </span>
        <span className="font-sans text-[12px] leading-[16px] font-medium text-white">
          {CARD.skills}
        </span>
      </div>
      <div className="h-[6px] w-full overflow-hidden rounded-full bg-white/18">
        <span
          className="block h-full rounded-full bg-[#f3c84b]"
          style={{ width: `${CARD.meter}%` }}
        />
      </div>
    </div>
    <div className="flex gap-[8px]">
      <button
        type="button"
        onClick={onPipeline}
        className="inline-flex h-[35px] min-w-0 flex-1 cursor-pointer items-center justify-center gap-[6px] rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[14px] leading-[20px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]"
      >
        {CARD.primary}
        <InboxGlyph name="arrow-right" className="size-[20px]" />
      </button>
      <button
        type="button"
        onClick={onProfile}
        className="inline-flex h-[37px] shrink-0 cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[16px] font-sans text-[14px] leading-[20px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]"
      >
        {CARD.secondary}
      </button>
    </div>
  </div>
);

const Bubble = ({ item }) => (
  <div
    className={classNames(
      'flex w-fit max-w-[600px] flex-col rounded-[12px] px-[16px] pt-[14px] pb-[8px] max-lg:max-w-[88%]',
      item.own ? 'gap-[2.5px] self-end bg-[#32683a]' : 'gap-[4px] self-start bg-[#e5e5e5]/50'
    )}
  >
    <span
      className={classNames(
        'font-sans text-[14px] leading-[20px]',
        item.own ? 'text-white' : 'text-[#595959]'
      )}
    >
      {item.text}
    </span>
    <span className="flex items-center gap-[4px] self-end font-sans text-[12px] leading-[14px]">
      <span className={item.own ? 'text-[#bfbfbf]' : 'text-[#babab7]'}>{item.time}</span>
      {item.own && item.receipt ? (
        <span className="font-medium text-[#bfbfbf]">{item.receipt}</span>
      ) : null}
    </span>
  </div>
);

const RightEmpty = ({ state, onNavigate }) => {
  if (state === 'start') {
    const c = EMPTY.startRight;
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-[12px] text-center">
        <img src={illustration} alt="" className="h-[203px] w-[275px] object-contain" />
        <h2 className="m-0 font-heading text-[28px] leading-[34px] font-semibold tracking-[-0.56px] text-[#111]">
          {c.title}
        </h2>
        <p className="m-0 max-w-[420px] font-sans text-[14px] leading-[21px] text-[#575755]">
          {c.body}
        </p>
        <div className="mt-[8px] flex flex-wrap justify-center gap-[12px]">
          <button
            type="button"
            onClick={() => onNavigate('/recruiter/job-postings/new')}
            className="inline-flex h-[44px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[18px] font-sans text-[16px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]"
          >
            {c.primary}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/recruiter/talent-search')}
            className="inline-flex h-[44px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] font-bold text-white shadow-[0_4px_0_#2a5730]"
          >
            {c.secondary}
          </button>
        </div>
      </div>
    );
  }
  if (state === 'live') {
    const c = EMPTY.liveRight;
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-[12px] text-center">
        <EmptyTile name={c.icon} />
        <h2 className="m-0 font-heading text-[24px] leading-[29px] font-semibold tracking-[-0.48px] text-[#111]">
          {c.title}
        </h2>
        <p className="m-0 max-w-[420px] font-sans text-[14px] leading-[21px] text-[#575755]">
          {c.body}
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/recruiter/job-postings')}
          className="mt-[8px] inline-flex h-[44px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[18px] font-sans text-[16px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]"
        >
          {c.action}
        </button>
      </div>
    );
  }
  const c = state === 'select-archived' ? EMPTY.selectArchived : EMPTY.selectRight;
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[10px] text-center">
      <img src={illustration} alt="" className="h-[203px] w-[275px] object-contain" />
      <h2 className="m-0 font-heading text-[24px] leading-[29px] font-semibold tracking-[-0.48px] text-[#111]">
        {c.title}
      </h2>
      <p className="m-0 max-w-[420px] font-sans text-[14px] leading-[21px] text-[#575755]">
        {c.body}
      </p>
    </div>
  );
};

const RecruiterThreadView = ({
  conversation,
  archived,
  menuOpen,
  onMenu,
  onMenuItem,
  onUnarchive,
  onBack,
  state,
  className,
}) => {
  const navigate = useNavigate();
  const shell = classNames(
    'flex h-full min-w-0 flex-1 flex-col rounded-[24px] border border-solid border-[#00522b]/10 bg-white px-[22px] pt-[18px] pb-[14px]',
    'max-lg:rounded-none max-lg:border-0 max-lg:px-[12px] max-lg:pt-0',
    className
  );
  if (!conversation) {
    return (
      <section className={shell}>
        <RightEmpty state={state} onNavigate={navigate} />
      </section>
    );
  }
  const thread = THREADS[conversation.thread] ?? THREADS.akosua;
  const showApplicantHeader =
    Boolean(conversation.applicant) || conversation.id === 'akosua-quansah';

  return (
    <section className={shell}>
      <header className="relative flex shrink-0 items-center justify-between gap-[16px] rounded-full border border-solid border-[#00522b]/10 px-[12px] py-[8px] max-lg:rounded-none max-lg:border-0 max-lg:px-0">
        <span className="flex min-w-0 items-center gap-[14px]">
          <button
            type="button"
            aria-label="Back to conversations"
            onClick={onBack}
            className="grid size-[40px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 lg:hidden"
          >
            <InboxGlyph name="undo-back" className="size-[18px]" />
          </button>
          <span className="relative shrink-0">
            <Avatar conversation={conversation} />
            {conversation.online ? (
              <span className="absolute right-[-2px] bottom-[-2px] flex size-[16px] items-center justify-center rounded-full border-2 border-solid border-white bg-[#224626]">
                <InboxGlyph name="verified" className="size-[9px]" />
              </span>
            ) : null}
          </span>
          <span className="flex min-w-0 flex-col gap-[6px]">
            <span className="truncate font-sans text-[16px] leading-[19px] font-medium text-[#1c2a21]">
              {conversation.name}
            </span>
            <span className="truncate font-sans text-[14px] leading-[17px] text-[#737373]">
              {conversation.meta}
            </span>
          </span>
        </span>
        <span className="relative flex shrink-0 items-center gap-[10px]">
          {showApplicantHeader ? (
            <>
              <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#387440] max-md:hidden">
                {THREAD_HEADER.match}
              </span>
              <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] max-xl:hidden">
                {THREAD_HEADER.re}
              </span>
            </>
          ) : null}
          <button
            type="button"
            aria-label="Conversation options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => onMenu(!menuOpen)}
            className="flex size-[36px] cursor-pointer items-center justify-center rounded-full border border-solid border-[#c1d4c4] bg-white p-0 text-[#999]"
          >
            <MeatballMenuIcon className="w-[19px]" />
          </button>
          {menuOpen ? (
            <ThreadOptionsMenu
              items={MENU_ITEMS}
              onSelect={(item) => onMenuItem(item.id)}
              className="absolute top-[44px] right-0"
            />
          ) : null}
        </span>
      </header>

      {archived ? (
        <div className="mt-[16px] flex shrink-0 items-center justify-between gap-[12px] rounded-[12px] border border-solid border-[#dbe7dd] bg-[#f3f6f3] px-[16px] py-[12px]">
          <span className="flex items-start gap-[12px]">
            <InboxGlyph name="archive-tile" className="mt-[2px] size-[20px]" />
            <span className="flex flex-col">
              <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#111]">
                {ARCHIVE_VIEW.banner.title}
              </span>
              <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                {ARCHIVE_VIEW.banner.body}
              </span>
            </span>
          </span>
          <button
            type="button"
            onClick={onUnarchive}
            className="inline-flex h-[36px] shrink-0 cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[16px] font-sans text-[14px] leading-[20px] font-semibold text-white shadow-[0_3px_0_#2a5730]"
          >
            {ARCHIVE_VIEW.banner.action}
          </button>
        </div>
      ) : null}

      <div className="mt-[16px] flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto">
        {thread.groups.map((group) => (
          <div key={group.day} className="flex w-full flex-col gap-[16px]">
            <span className="self-center rounded-full border border-solid border-[#1c2a21]/12 bg-white px-[14px] py-[6px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
              {group.day}
            </span>
            {group.items.map((item, index) => {
              if (item.kind === 'application')
                return conversation.applicant ? (
                  <ApplicationCard
                    key="application"
                    conversation={conversation}
                    onPipeline={() => navigate('/recruiter/application-pipeline')}
                    onProfile={() => navigate('/recruiter/talent-search')}
                  />
                ) : null;
              if (item.kind === 'note')
                return conversation.applicant ? (
                  <p
                    key="note"
                    className="m-0 flex items-start gap-[6px] font-sans text-[12px] leading-[16px] text-[#575755]"
                  >
                    <InboxGlyph name="info" className="size-[18px] shrink-0" />
                    <span className="max-w-[520px]">{AUTO_NOTE}</span>
                  </p>
                ) : null;
              return <Bubble key={`${group.day}-${index}`} item={item} />;
            })}
          </div>
        ))}
      </div>

      <form
        onSubmit={(event) => event.preventDefault()}
        className="mt-[16px] flex h-[62px] shrink-0 items-center justify-between gap-[16px] rounded-full border-[1.5px] border-solid border-[#c1d4c4] bg-white py-[12px] pr-[12px] pl-[20px]"
      >
        <input
          type="text"
          placeholder={COMPOSER.placeholder}
          aria-label="Message"
          className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[18px] text-black outline-none placeholder:text-[#999]"
        />
        <span className="flex shrink-0 items-center gap-[10px]">
          <button
            type="button"
            className="inline-flex h-[36px] cursor-pointer items-center gap-[6px] rounded-full border-0 bg-[#ebf1ec] px-[12px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#2a5730] max-sm:hidden"
          >
            <InboxGlyph name="sparkles-reply" className="size-[14px]" />
            {COMPOSER.help}
          </button>
          <button
            type="submit"
            aria-label="Send message"
            className="relative size-[39px] shrink-0 cursor-pointer overflow-visible rounded-full border-0 bg-transparent p-0"
          >
            {/* Figma exports the button with its shadow padding (88x87, button at 24,14). */}
            <img
              src={ICONS['send-composer']}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute top-[-14px] left-[-24px] h-[87px] w-[88px] max-w-none"
            />
          </button>
        </span>
      </form>
    </section>
  );
};

export default RecruiterThreadView;
