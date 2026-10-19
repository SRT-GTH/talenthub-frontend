import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  HelpContactChatIcon,
  HelpContactChevronRightIcon,
  HelpContactMailIcon,
  HelpContactPhoneIcon,
  HelpContactWhatsappIcon,
  HelpFaqChevronDownIcon,
  HelpFaqChevronUpIcon,
  HelpSafetyAlertIcon,
  HelpTopicLockIcon,
  HelpTopicMessageIcon,
  HelpTopicShieldIcon,
  HelpTopicSuitcaseIcon,
  HelpTopicUserIcon,
  HelpTopicUsersIcon,
} from '../../shared/assets.jsx';
import { FOCUS_RING, HEADING, HelpButton, HelpChip, PageHeader } from './helpUi.jsx';
import HelpArticleView from './HelpArticleView.jsx';
import HelpContactView from './HelpContactView.jsx';
import {
  HP_DEFAULT_QUERY,
  HS_CONTACTS,
  HS_COPY,
  HS_FAQ,
  HS_REQUESTS,
  HS_SAFETY,
  HS_SEARCH_PLACEHOLDER,
  HS_TOPICS,
  searchHelp,
} from './helpData.js';
import iconSearch from '../../../assets/notifications/help/search.svg';

const log = debug('HelpSupportPage');

/*
 * HelpSupportPage — `/settings/help`, HS-01 "Help and support" (Playful 7857:11670 / Focused 8110:38737).
 * One page, several URL states (Figma frames in wiki/talent-settings.md):
 *   /settings/help                 HS-01
 *   ?help=page|searching|none|shortcuts   HP-01/02/03/08 — the pop-over / modal is the shell's HelpPopover
 *   ?help=article                  HP-04 Help article · Recruiter asked for a fee
 *   ?help=report                   HP-07 Report a problem (modal over the article)
 *   ?help=contact                  HP-05 Contact support
 *   ?help=sent                     HP-06 Request sent (modal over the contact page)
 * Props: settings (useTalentSettingsState): { help, update(patch) }.
 */
const TOPIC_ICONS = {
  user: HelpTopicUserIcon,
  shield: HelpTopicShieldIcon,
  suitcase: HelpTopicSuitcaseIcon,
  message: HelpTopicMessageIcon,
  users: HelpTopicUsersIcon,
  lock: HelpTopicLockIcon,
};
const CONTACT_ICONS = {
  chat: HelpContactChatIcon,
  whatsapp: HelpContactWhatsappIcon,
  mail: HelpContactMailIcon,
  phone: HelpContactPhoneIcon,
};

const CARD = 'rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-white';

const HelpSupportPage = ({ settings }) => {
  const [params] = useSearchParams();
  const help = settings?.help ?? null;
  const q = params.get('q');
  const [openFaq, setOpenFaq] = useState('fit-score');
  log('mount', { help, q });

  if (help === 'article' || help === 'report') {
    return <HelpArticleView settings={settings} reporting={help === 'report'} />;
  }
  if (help === 'contact' || help === 'sent') {
    return <HelpContactView settings={settings} sent={help === 'sent'} />;
  }

  const searchValue = help === 'searching' || help === 'none' ? (q ?? HP_DEFAULT_QUERY[help]) : '';

  const onSearch = (value) => {
    if (!value.trim()) {
      log('search cleared');
      settings.update({ help: null, q: null });
      return;
    }
    const next = searchHelp(value).length > 0 ? 'searching' : 'none';
    log('search', { value, next });
    settings.update({ help: next, q: value });
  };

  const onFaq = (item) => {
    log('faq', item.id);
    if (item.article) {
      settings.update({ help: 'article', q: null });
    } else if (item.answer) {
      setOpenFaq((cur) => (cur === item.id ? null : item.id));
    } else {
      // No answer text is drawn for this question: show it as a search in the Help pop-over.
      settings.update({ help: 'searching', q: item.question });
    }
  };

  return (
    <div className="flex flex-col gap-[clamp(16px,1.39vw,24px)]">
      <PageHeader title={HS_COPY.title} subtitle={HS_COPY.subtitle} />

      <div className="flex flex-col gap-[clamp(16px,1.39vw,24px)]">
        <label className="flex h-[56px] w-full items-center gap-[12px] rounded-[8px] border border-solid border-[#dfdfdc] bg-white py-[10px] pl-[14px] pr-[12px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
          <span className="flex size-[28px] shrink-0 items-center justify-center">
            <img src={iconSearch} alt="" aria-hidden="true" className="size-[20px]" />
          </span>
          <input
            type="search"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={HS_SEARCH_PLACEHOLDER}
            aria-label="Search help"
            className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] outline-none placeholder:text-[#bfbfbf]"
          />
        </label>

        <div className="flex flex-col gap-[clamp(16px,1.39vw,24px)] xl:flex-row xl:items-start">
          {/* left */}
          <div className="flex min-w-0 flex-1 flex-col gap-[clamp(16px,1.39vw,24px)]">
            <div className="@container">
              <div className="grid grid-cols-1 gap-[16px] @min-[480px]:grid-cols-2 @min-[780px]:grid-cols-3">
                {HS_TOPICS.map((t) => {
                  const Icon = TOPIC_ICONS[t.icon];
                  return (
                    <button
                      key={t.id}
                      type="button"
                      aria-label={`${t.title}. ${t.hint}`}
                      onClick={() => {
                        log('topic', t.id);
                        settings.update({ help: 'page', q: null });
                      }}
                      className={classNames(
                        CARD,
                        'flex cursor-pointer flex-col items-start gap-[10px] p-[20px] text-left',
                        FOCUS_RING
                      )}
                    >
                      <span className="flex size-[40px] items-center justify-center rounded-[12px] bg-[#ebf1ec]">
                        <Icon className="size-[19px]" />
                      </span>
                      <span
                        className={classNames(
                          'text-[17px] leading-[1.25] tracking-[-0.17px] text-[#1c2a21]',
                          HEADING
                        )}
                      >
                        {t.title}
                      </span>
                      <span
                        aria-hidden="true"
                        data-count={t.hint}
                        className="font-sans text-[13.5px] leading-[1.2] text-[#595959] after:content-[attr(data-count)]"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <section className={classNames(CARD, 'flex flex-col p-[24px] playful:gap-[8px]')}>
              <h2
                className={classNames(
                  'm-0 text-[19px] leading-[1.25] tracking-[-0.19px] text-[#1c2a21]',
                  HEADING
                )}
              >
                {HS_COPY.popularTitle}
              </h2>
              {HS_FAQ.map((item) => {
                const open = item.answer && openFaq === item.id;
                const Chevron = open ? HelpFaqChevronUpIcon : HelpFaqChevronDownIcon;
                return (
                  <div
                    key={item.id}
                    className={classNames(
                      'flex flex-col border-t border-solid border-[rgba(28,42,33,0.08)] py-[16px]',
                      open && 'gap-[8px]'
                    )}
                  >
                    <button
                      type="button"
                      aria-expanded={item.answer ? Boolean(open) : undefined}
                      onClick={() => onFaq(item)}
                      className={classNames(
                        'flex w-full cursor-pointer items-center gap-[12px] text-left',
                        FOCUS_RING
                      )}
                    >
                      <span className="min-w-0 flex-1 font-sans text-[15px] font-semibold leading-[1.2] text-[#1c2a21]">
                        {item.question}
                      </span>
                      <Chevron className="size-[20px] shrink-0" />
                    </button>
                    {open && (
                      <p className="m-0 font-sans text-[14px] leading-[1.5] text-[#595959]">
                        {item.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </section>

            <section className="flex flex-col items-start gap-[14px] rounded-[20px] bg-[#f9ebea] p-[20px] sm:flex-row sm:items-center">
              <HelpSafetyAlertIcon className="size-[22px] shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-[2px] text-[#902b20]">
                <p className="m-0 font-sans text-[15px] font-semibold leading-[1.2]">
                  {HS_SAFETY.title}
                </p>
                <p className="m-0 font-sans text-[13.5px] leading-[1.45]">{HS_SAFETY.body}</p>
              </div>
              <HelpButton
                size="xl"
                className="!px-[34px]"
                onClick={() => settings.update({ help: 'report', q: null })}
              >
                {HS_SAFETY.action}
              </HelpButton>
            </section>
          </div>

          {/* right */}
          <div className="flex w-full shrink-0 flex-col gap-[16px] xl:w-[340px]">
            <section className={classNames(CARD, 'flex flex-col gap-[16px] p-[22px]')}>
              <h2
                className={classNames(
                  'm-0 text-[18px] leading-[1.25] tracking-[-0.18px] text-[#1c2a21]',
                  HEADING
                )}
              >
                {HS_COPY.talkTitle}
              </h2>
              {HS_CONTACTS.map((c) => {
                const Icon = CONTACT_ICONS[c.icon];
                const href = c.id === 'call' ? 'tel:0302220000' : undefined;
                const Tag = href ? 'a' : 'button';
                return (
                  <Tag
                    key={c.id}
                    {...(href ? { href } : { type: 'button' })}
                    onClick={() => log('contact', c.id)}
                    className={classNames(
                      'flex w-full cursor-pointer items-center gap-[12px] rounded-[14px] bg-[#f8f8f4] p-[12px] text-left no-underline',
                      FOCUS_RING
                    )}
                  >
                    <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[11px] bg-[#ebf1ec]">
                      <Icon className="size-[17px]" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-px leading-[1.2]">
                      <span className="font-sans text-[14.5px] font-semibold text-[#1c2a21]">
                        {c.title}
                      </span>
                      <span className="font-sans text-[12.5px] text-[#595959]">{c.hint}</span>
                    </span>
                    <HelpContactChevronRightIcon className="size-[18px] shrink-0" />
                  </Tag>
                );
              })}
            </section>

            <section
              className={classNames(CARD, 'flex flex-col gap-[10px] p-[22px] playful:gap-[16px]')}
            >
              <h2
                className={classNames(
                  'm-0 text-[18px] leading-[1.25] tracking-[-0.18px] text-[#1c2a21]',
                  HEADING
                )}
              >
                {HS_COPY.requestsTitle}
              </h2>
              {HS_REQUESTS.map((r) => (
                <div key={r.id} className="flex items-center gap-[10px]">
                  <div className="flex min-w-0 flex-1 flex-col gap-[2px] leading-[1.2]">
                    <span className="font-sans text-[14px] font-semibold text-[#1c2a21]">
                      {r.title}
                    </span>
                    <span className="font-sans text-[12.5px] text-[#595959]">{r.meta}</span>
                  </div>
                  <HelpChip tone="status">{r.status}</HelpChip>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
