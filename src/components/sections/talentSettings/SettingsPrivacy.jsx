import { useEffect, useState } from 'react';
import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  SettingsAAlertIcon,
  SettingsACompanyChipIcon,
  SettingsAInfoCircleIcon,
  SettingsAPlusIcon,
  SettingsARadioOnIcon,
  SettingsARadioOnPlayfulIcon,
} from '../../shared/assets.jsx';
import { PRIVACY_BLOCKED, PRIVACY_SEE, PRIVACY_VISIBILITY } from './talentSettingsAData.js';
import SettingsABlockedDialog from './SettingsABlockedDialog.jsx';
import { blockSomeone, settingsError, unblock as unblockApi } from '../../../services/settings.api.js';

/* Live privacy (GET /settings/overview `privacy`) -> this screen's local shape, and the blocked list -> dialog rows. */
const fromLive = (p) => ({
  visibility: p.visibility,
  employer: p.see.employer,
  salary: p.see.salary,
  city: p.see.city,
  message: p.see.message,
  companies: [...(p.employerCompanies || [])],
});
const blockedRows = (list = []) =>
  list.map((b) => ({
    id: b.id,
    kind: b.kind === 'company' ? 'company' : 'user',
    name: b.name,
    meta: `${b.kind === 'company' ? 'Company' : 'Recruiter'} · blocked ${new Date(b.blockedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
  }));
import {
  SettingsACard,
  SettingsALink,
  SettingsARow,
  SettingsASaveBar,
  SettingsAToggle,
} from './SettingsAUi.jsx';

const log = debug('SettingsPrivacy');

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

// One visibility option (Figma "option · …"): a radio card.
const VisibilityOption = ({ option, selected, onSelect }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={classNames(
      'flex w-full cursor-pointer items-center gap-[14px] rounded-[16px] border p-[16px] text-left',
      selected
        ? 'border-[#387440] bg-[#ebf1ec] playful:border-[1.5px]'
        : 'border-[rgba(28,42,33,0.12)] bg-white',
      FOCUS
    )}
  >
    {selected ? (
      <>
        <SettingsARadioOnIcon className="block size-[22px] shrink-0 playful:hidden" />
        <SettingsARadioOnPlayfulIcon className="hidden size-[22px] shrink-0 playful:block" />
      </>
    ) : (
      <span
        aria-hidden="true"
        className="block size-[22px] shrink-0 rounded-full border border-[rgba(28,42,33,0.1)] bg-white playful:border-[1.5px] playful:border-[rgba(28,42,33,0.35)]"
      />
    )}
    <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
      <span className="flex flex-wrap items-center gap-[8px]">
        <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          {option.title}
        </span>
        {option.chip ? (
          <span
            className={classNames(
              'rounded-full border border-[rgba(28,42,33,0.12)] bg-[#387440] px-[8px] py-[2px] text-[11px] font-bold whitespace-nowrap max-lg:text-[12px]',
              selected ? 'text-[#e7e7e7]' : 'text-[#1c2a21]',
              'playful:border-[#1c2a21] playful:bg-[#ebf1ec] playful:text-[#1c2a21]'
            )}
          >
            {option.chip}
          </span>
        ) : null}
      </span>
      <span className="text-[13.5px] leading-[1.45] text-[#595959]">{option.desc}</span>
    </span>
  </button>
);

/*
 * SettingsPrivacy — ST-02 Profile and privacy, ST-02b Hidden selected (`?state=hidden`, also reached by
 * choosing that option) and ST-02c Manage blocked (`?state=blocked`: dialog over the page).
 * Local state only; the unsaved bar appears as soon as anything differs from the saved values.
 */
const SettingsPrivacy = ({ settings }) => {
  const urlHidden = settings?.state === 'hidden';
  const blockedOpen = settings?.state === 'blocked';
  // Live (PUT /settings/privacy, /settings/blocked) unless `?demo=1`.
  const live = settings?.live?.overview ? settings.live : null;

  const initial = () =>
    live
      ? fromLive(live.overview.privacy)
      : {
          visibility: 'verified',
          ...PRIVACY_SEE.defaults,
          companies: [...PRIVACY_SEE.employer.companies],
        };
  const [saved, setSaved] = useState(initial);
  const [cur, setCur] = useState(() => ({
    ...initial(),
    visibility: urlHidden ? 'hidden' : initial().visibility,
  }));
  const [people, setPeople] = useState(() =>
    live ? blockedRows(live.overview.privacy.blocked) : PRIVACY_BLOCKED.dialog.people
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [addingCompany, setAddingCompany] = useState(false);
  const [companyDraft, setCompanyDraft] = useState('');

  useEffect(() => {
    log('mount', { state: settings?.state, visibility: cur.visibility });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.state]);

  // Deep link / URL edit into or out of the "hidden" frame keeps the radio in step.
  useEffect(() => {
    setCur((c) => {
      if (urlHidden && c.visibility !== 'hidden') return { ...c, visibility: 'hidden' };
      return c;
    });
  }, [urlHidden]);

  const set = (patch) => setCur((c) => ({ ...c, ...patch }));

  const pickVisibility = (id) => {
    log('visibility ->', id);
    set({ visibility: id });
    if (id === 'hidden' && settings?.state !== 'blocked') settings?.update?.({ state: 'hidden' });
    if (id !== 'hidden' && settings?.state === 'hidden') settings?.update?.({ state: null });
  };

  const changes = [
    cur.visibility !== saved.visibility,
    cur.employer !== saved.employer,
    cur.salary !== saved.salary,
    cur.city !== saved.city,
    cur.message !== saved.message,
    cur.companies.join('|') !== saved.companies.join('|'),
  ].filter(Boolean).length;
  const dirty = changes > 0;

  const discard = () => {
    log('discard');
    setCur(saved);
    setError(null);
    if (settings?.state === 'hidden') settings?.update?.({ state: null });
  };
  const save = async () => {
    log('save', cur);
    if (live) {
      setBusy(true);
      setError(null);
      try {
        const next = fromLive(
          await live.savePrivacy({
            visibility: cur.visibility,
            see: { employer: cur.employer, salary: cur.salary, city: cur.city, message: cur.message },
            employerCompanies: cur.companies,
          })
        );
        setSaved(next);
        setCur(next);
      } catch (err) {
        setError(settingsError(err));
        return;
      } finally {
        setBusy(false);
      }
    } else setSaved(cur);
    if (settings?.state === 'hidden') settings?.update?.({ state: null });
  };

  const addCompany = () => {
    const name = companyDraft.trim();
    if (name && !cur.companies.some((c) => c.toLowerCase() === name.toLowerCase())) {
      set({ companies: [...cur.companies, name].slice(0, 10) });
    }
    setCompanyDraft('');
    setAddingCompany(false);
  };

  const onUnblock = async (id) => {
    if (!live) {
      setPeople((list) => list.filter((p) => p.id !== id));
      return;
    }
    try {
      const blocked = await unblockApi(id);
      setPeople(blockedRows(blocked));
      live.patch('privacy', { ...live.overview.privacy, blocked });
    } catch (err) {
      setError(settingsError(err, 'Could not unblock. Try again.'));
    }
  };

  const onBlockCompany = async (name) => {
    try {
      const blocked = await blockSomeone({ kind: 'company', name });
      setPeople(blockedRows(blocked));
      live.patch('privacy', { ...live.overview.privacy, blocked });
      return true;
    } catch (err) {
      log('block failed', err?.response?.status);
      return false;
    }
  };

  const hiddenSelected = cur.visibility === 'hidden';
  const see = PRIVACY_SEE;

  return (
    <>
      <SettingsACard
        title={PRIVACY_VISIBILITY.title}
        desc={PRIVACY_VISIBILITY.desc}
        gap={hiddenSelected ? 'gap-[4px] focused:gap-[8px]' : 'gap-[4px]'}
      >
        <div
          role="radiogroup"
          aria-label={PRIVACY_VISIBILITY.title}
          className={classNames(
            'flex flex-col playful:gap-[10px]',
            hiddenSelected || blockedOpen ? 'gap-[10px]' : 'gap-[16px]'
          )}
        >
          {PRIVACY_VISIBILITY.options.map((option) => (
            <VisibilityOption
              key={option.id}
              option={option}
              selected={cur.visibility === option.id}
              onSelect={() => pickVisibility(option.id)}
            />
          ))}
          {hiddenSelected ? (
            <div
              role="note"
              className="flex items-center gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px] text-[#463409]"
            >
              <SettingsAAlertIcon className="block size-[20px] shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <p className="text-[15px] leading-[18px] font-semibold">
                  {PRIVACY_VISIBILITY.hiddenWarning.title}
                </p>
                <p className="text-[13.5px] leading-[1.45]">
                  {PRIVACY_VISIBILITY.hiddenWarning.desc}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </SettingsACard>

      <SettingsACard title={see.title}>
        <SettingsARow title={see.employer.title} desc={see.employer.desc}>
          <SettingsAToggle
            on={cur.employer}
            label={see.employer.title}
            onChange={(v) => set({ employer: v })}
          />
        </SettingsARow>
        <div className="flex flex-wrap items-start gap-[8px] pb-[8px]">
          {cur.companies.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                log('remove company', name);
                set({ companies: cur.companies.filter((c) => c !== name) });
              }}
              className={classNames(
                'flex h-[32px] cursor-pointer items-center gap-[6px] rounded-full border border-[#e1eae2] bg-white px-[14px]',
                FOCUS
              )}
            >
              <SettingsACompanyChipIcon className="block size-[14px] shrink-0" />
              <span className="text-[13px] leading-[16px] font-semibold whitespace-pre text-[#595959] max-lg:text-[13px]">{`${name}  ×`}</span>
            </button>
          ))}
          {live && addingCompany ? (
            <input
              autoFocus
              aria-label="Company to hide from"
              placeholder="Company name"
              value={companyDraft}
              maxLength={80}
              onChange={(e) => setCompanyDraft(e.target.value)}
              onBlur={addCompany}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompany())}
              className="h-[32px] w-[200px] rounded-[14px] border border-solid border-[#ccc] bg-white px-[12px] text-[13px] text-[#1c2a21] outline-none focus:border-[#387440]"
            />
          ) : null}
          <Button
            variant="tertiary"
            size="lg"
            className="h-[32px] gap-[6px]! rounded-[14px]! px-[12px]! py-0! text-[13px]!"
            onClick={() => {
              log('add a company');
              if (live) setAddingCompany(true);
              else if (!cur.companies.length) set({ companies: [...see.employer.companies] });
            }}
          >
            <span className="inline-flex items-center gap-[6px]">
              <SettingsAPlusIcon className="block size-[16px] shrink-0" />
              {see.employer.addLabel}
            </span>
          </Button>
        </div>
        {see.toggles.map((row) => (
          <SettingsARow key={row.id} title={row.title} desc={row.desc}>
            <SettingsAToggle
              on={cur[row.id]}
              label={row.title}
              onChange={(v) => set({ [row.id]: v })}
            />
          </SettingsARow>
        ))}
        <SettingsARow title={see.scores.title} desc={see.scores.desc} first>
          <SettingsALink onClick={() => log('choose per skill')}>{see.scores.link}</SettingsALink>
        </SettingsARow>
      </SettingsACard>

      <SettingsACard title={PRIVACY_BLOCKED.title} desc={PRIVACY_BLOCKED.desc} gap="gap-[4px]">
        <SettingsARow
          first
          title={people.length ? `${people.length} blocked` : 'Nobody blocked'}
          desc={people.length ? people.map((p) => p.name).join(' · ') : 'Use Manage to block a company. They are not told.'}
          className="max-sm:flex-wrap"
        >
          <Button
            variant="tertiary"
            size="lg"
            className="shrink-0"
            onClick={() => settings?.update?.({ state: 'blocked' })}
          >
            {PRIVACY_BLOCKED.manage}
          </Button>
        </SettingsARow>
      </SettingsACard>

      {error ? (
        <p role="alert" className="m-0 text-[14px] font-medium text-[#c0392b]">
          {error}
        </p>
      ) : null}

      {dirty && !blockedOpen ? (
        <SettingsASaveBar
          icon={<SettingsAInfoCircleIcon className="block size-[20px] shrink-0" />}
          message={`You have ${changes} unsaved change${changes === 1 ? '' : 's'}`}
          discardLabel={PRIVACY_BLOCKED.discard}
          onDiscard={discard}
          saveLabel={
            <Button variant="primary" size="sm" disabled={busy} onClick={save}>
              {busy ? 'Saving…' : PRIVACY_BLOCKED.save}
            </Button>
          }
        />
      ) : null}

      {blockedOpen ? (
        <SettingsABlockedDialog
          people={people}
          onUnblock={onUnblock}
          onBlockCompany={live ? onBlockCompany : undefined}
          onClose={() => settings?.update?.({ state: null })}
        />
      ) : null}
    </>
  );
};

export default SettingsPrivacy;
