import { debug } from '../../../utils/debug.js';
import PreApplyDialog from './PreApplyDialog.jsx';
import MessagesA11yPanel from './MessagesA11yPanel.jsx';
import LanguageMenu from './LanguageMenu.jsx';
import LanguageComingSoonModal from './LanguageComingSoonModal.jsx';
import LanguageToast from './LanguageToast.jsx';
import { PRE_APPLY_PREVIEW } from './cards/messageCardsData.js';
import { setMessagesCardState } from './messagesStore.js';
import { useLiveMessagesContext } from './useLiveMessages.js';

const log = debug('MessagesOverlays');

const COMING_SOON_LANGS = ['twi', 'ga', 'ewe', 'dagbani', 'hausa'];

/*
 * MessagesOverlays — mounts the dialogs / panels that sit above the Messages page, chosen by the URL state
 * (messagesState.js): `modal=pre-apply` (Before you apply), `a11y` (accessibility panel), `lang` (language menu,
 * coming-soon modals, "On the list" toast). `modal=not-interested` is NOT an overlay: the thread draws the job card in its
 * Passing state inline (T-MSG-05). The Help me reply panel, read-aloud bar and explain card live inside the conversation
 * column (MessagesInbox). LEAD-OWNED: packages never edit this file.
 */
const MessagesOverlays = ({ messages }) => {
  const { modal, a11yParam, lang, update } = messages;
  const live = useLiveMessagesContext();
  log('render', { modal, a11yParam, lang });
  // Live: the open conversation's job (Before you apply shows its company, role and match).
  const liveId = live?.activeId ?? null;
  const liveJob = liveId ? live.byId[liveId]?.job : null;
  const preApply = liveJob
    ? {
        ...PRE_APPLY_PREVIEW,
        company: liveJob.company,
        role: liveJob.role,
        matchPercent: liveJob.matchPercent ?? '—',
        boostedPercent: null,
        sectionsLabel: `WHAT ${String(liveJob.company || 'THE EMPLOYER').toUpperCase()} SEES`,
        rows: [
          { id: 'info', label: 'Personal info and education', hidden: false },
          { id: 'skills', label: 'Skills', hidden: false },
          { id: 'assessments', label: 'Assessments and badges', hidden: false },
          { id: 'work', label: 'Work experience', hidden: false },
          { id: 'portfolio', label: 'Portfolio', hidden: false },
        ],
      }
    : PRE_APPLY_PREVIEW;

  return (
    <>
      <PreApplyDialog
        open={modal === 'pre-apply'}
        data={preApply}
        onClose={() => update({ modal: null })}
        onSubmit={() => {
          log('pre-apply continue -> applied', { live: Boolean(live), liveId });
          if (live && liveId) {
            setMessagesCardState(liveId, 'applied');
            live.actions.job(liveId, 'apply');
          } else setMessagesCardState('owura', 'applied');
          update({ modal: null });
        }}
      />
      {a11yParam ? (
        <MessagesA11yPanel messages={messages} onClose={() => update({ a11y: null })} />
      ) : null}
      {lang === 'menu' ? (
        <LanguageMenu
          onClose={() => update({ lang: null })}
          onPick={(id) => update({ lang: id })}
        />
      ) : null}
      {COMING_SOON_LANGS.includes(lang) ? (
        <LanguageComingSoonModal
          language={lang}
          onClose={() => update({ lang: null })}
          onNotify={() => update({ lang: 'toast' })}
        />
      ) : null}
      {lang === 'toast' ? (
        <LanguageToast
          onUndo={() => update({ lang: null })}
          onClose={() => update({ lang: null })}
        />
      ) : null}
    </>
  );
};

export default MessagesOverlays;
