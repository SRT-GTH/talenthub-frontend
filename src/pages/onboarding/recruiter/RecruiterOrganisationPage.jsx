import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterOnboardingShell from '../../../components/sections/recruiterOnboarding/RecruiterOnboardingShell.jsx';
import RecruiterOnboardingPanel from '../../../components/sections/recruiterOnboarding/RecruiterOnboardingPanel.jsx';
import OrganisationHeading from '../../../components/sections/recruiterOnboarding/organisation/OrganisationHeading.jsx';
import InfoNote from '../../../components/sections/recruiterOnboarding/organisation/InfoNote.jsx';
import OrgResultRow from '../../../components/sections/recruiterOnboarding/organisation/OrgResultRow.jsx';
import OrganisationResultModal from '../../../components/sections/recruiterOnboarding/organisation/OrganisationResultModal.jsx';
import {
  ArrowRowIcon,
  BuildingIcon,
  DiamondAlertIcon,
  SearchGlyph,
  StatusMailIcon,
} from '../../../components/sections/recruiterOnboarding/organisation/OrganisationIcons.jsx';
import {
  describeOrganisation,
  requestAffiliation,
  searchOrganisations,
} from '../../../components/sections/recruiterOnboarding/organisation/organisationData.js';
import Button from '../../../components/ui/Button.jsx';
import { TextInput, StickyActionBar } from '../../../components/ui/form';
import { ArrowRightIcon, LoadingSpinner } from '../../../components/shared/assets.jsx';
import { RECRUITER_ROUTES } from '../../../components/shared/recruiterOnboardingSteps.js';
import { useRecruiterOnboarding } from '../../../hooks/useRecruiterOnboarding.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterOrganisationPage');

/*
 * RecruiterOrganisationPage - /onboarding/recruiter/organisation  (routeKey "organisation")
 * Figma R04: 7374:4393 search default, 4607 search results, 4844 "Did you mean?" fuzzy match,
 * 5070 selected + request affiliation, 5302 not found, 5519 affiliation request sent (pending).
 *
 * One page, six states driven by real interaction:
 *   idle        empty input, helper text + green Primary-Admin note, CTA disabled
 *   results     typing filters the mock directory (debounced 250 ms); rows + "Can't find it?
 *               Create ..." row form one ARIA listbox (combobox + aria-activedescendant,
 *               Up/Down/Enter/Escape); CTA disabled
 *   suggestion  no direct match but a near-duplicate name -> amber "Did you mean" note,
 *               "Best match" row, "No, ... create it" row; CTA "Yes, Request To Join <org>"
 *   notFound    "No organisation called ..." card, CTA 'Create "<query>"' -> create page
 *   selected    chosen organisation card (+ admin / recruiters / plan when known), note,
 *               CTA "Request Affiliation"
 *   pending     CTA -> fake request (~0.9 s) -> "Request sent." modal -> Continue To Plan
 * Mock data + API-shaped calls: organisation/organisationData.js (searchOrganisations,
 * requestAffiliation).
 *
 * State written through setSection:
 *   data.organisation = { mode: 'existing', id, name, affiliation: 'pending' }
 */

const SEARCH_DEBOUNCE_MS = 250;
const CREATE_PATH = `${RECRUITER_ROUTES.createOrganisation.path}`;

const CARD_CLASSES =
  'flex w-full flex-col gap-1 rounded-2xl border border-[#d9ded9] bg-white p-2 shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_rgba(15,15,10,0.10)]';

const CreateRow = ({ id, label, active, onSelect, onHover }) => (
  <div
    id={id}
    role="option"
    aria-selected={active}
    tabIndex={-1}
    onClick={onSelect}
    onMouseEnter={onHover}
    className={classNames(
      'flex cursor-pointer items-start gap-2 rounded-[10px] px-4 py-3 text-left transition-colors duration-100 hover:bg-brand-green-light/50',
      active &&
        'bg-brand-green-light/50 outline-2 -outline-offset-2 outline-brand-green-light-active'
    )}
  >
    <ArrowRowIcon className="mt-[3px] size-[18px] shrink-0 text-brand-green" />
    <span
      className="font-sans text-[14px] font-medium leading-6 text-brand-green max-md:text-[13px] max-md:leading-5"
      style={{ letterSpacing: '0.2px' }}
    >
      {label}
    </span>
  </div>
);

const RecruiterOrganisationPage = () => {
  const navigate = useNavigate();
  const { setSection } = useRecruiterOnboarding();
  const inputId = useId();
  const listboxId = `${inputId}-listbox`;
  const helperId = `${inputId}-help`;

  const [query, setQuery] = useState('');
  const [search, setSearch] = useState({ status: 'idle', results: [], suggestion: null });
  const [selected, setSelected] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [listClosed, setListClosed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const searchToken = useRef(0);

  log('render', { query, status: search.status, selected: selected?.id, modalOpen });

  // Debounced directory search; stale responses are dropped via the token.
  useEffect(() => {
    if (selected) return undefined;
    const q = query.trim();
    if (!q) {
      searchToken.current += 1;
      return undefined;
    }
    const token = (searchToken.current += 1);
    const timer = setTimeout(() => {
      log('search fire', q);
      searchOrganisations(q).then((res) => {
        if (token !== searchToken.current) {
          log('search stale, dropped', q);
          return;
        }
        log('search result', res.status, res.results.length);
        setSearch(res);
        setActiveIndex(-1);
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, selected]);

  const trimmed = query.trim();
  const mode = selected
    ? 'selected'
    : !trimmed
      ? 'idle'
      : search.status === 'idle'
        ? 'idle'
        : search.status; // results | suggestion | notFound

  const createLabelResults = `Can't find it? Create “${trimmed}” as a new organisation`;
  const createLabelSuggestion = `No, “${trimmed}” is a different organisation create it`;

  // Options exposed to the listbox (order = arrow-key order).
  const options = useMemo(() => {
    if (listClosed) return [];
    if (mode === 'results') {
      return [
        ...search.results.map((org) => ({ kind: 'org', org })),
        { kind: 'create', label: createLabelResults },
      ];
    }
    if (mode === 'suggestion') {
      return [
        { kind: 'org', org: search.suggestion, badge: 'Best match' },
        { kind: 'create', label: createLabelSuggestion },
      ];
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, search, listClosed, trimmed]);

  const expanded = options.length > 0;
  const optionId = (i) => `${listboxId}-opt-${i}`;

  const goCreate = useCallback(() => {
    log('go create', trimmed);
    navigate(CREATE_PATH, { state: { name: trimmed } });
  }, [navigate, trimmed]);

  const chooseOrg = (org) => {
    log('choose org', org.id);
    setSelected(org);
    setQuery(org.name);
    setActiveIndex(-1);
    setListClosed(false);
  };

  const activateOption = (opt) => {
    if (opt.kind === 'create') goCreate();
    else chooseOrg(opt.org);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSelected(null);
    setRequested(false);
    setListClosed(false);
    setActiveIndex(-1);
    if (!e.target.value.trim()) setSearch({ status: 'idle', results: [], suggestion: null });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!options.length) return;
      e.preventDefault();
      const dir = e.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((i) => (i + dir + options.length) % options.length);
    } else if (e.key === 'Enter') {
      if (expanded && activeIndex >= 0) {
        e.preventDefault();
        activateOption(options[activeIndex]);
      }
    } else if (e.key === 'Escape' && expanded) {
      e.preventDefault();
      log('escape closes list');
      setListClosed(true);
      setActiveIndex(-1);
    }
  };

  // ---- CTA ---------------------------------------------------------------
  const target = selected ?? (mode === 'suggestion' ? search.suggestion : null);
  let ctaLabel = 'Request Affiliation';
  let ctaEnabled = false;
  if (mode === 'suggestion') {
    ctaLabel = `Yes, Request To Join ${search.suggestion.name}`;
    ctaEnabled = true;
  } else if (mode === 'notFound') {
    ctaLabel = `Create “${trimmed}”`;
    ctaEnabled = true;
  } else if (mode === 'selected') {
    ctaEnabled = true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ctaEnabled || submitting) return;
    if (mode === 'notFound') {
      goCreate();
      return;
    }
    if (!target) return;
    if (mode === 'suggestion') chooseOrg(target);
    if (requested) {
      setModalOpen(true);
      return;
    }
    log('request affiliation', target.id);
    setSubmitting(true);
    requestAffiliation(target.id)
      .then(() => {
        log('affiliation pending', target.id);
        setSection('organisation', {
          mode: 'existing',
          id: target.id,
          name: target.name,
          affiliation: 'pending',
        });
        setRequested(true);
        setModalOpen(true);
      })
      .finally(() => setSubmitting(false));
  };

  const continueToPlan = () => {
    log('continue to plan');
    setModalOpen(false);
    navigate(RECRUITER_ROUTES.plan.path);
  };

  const adminName = selected?.admin;
  const selectedMeta = selected
    ? [
        selected.admin && ['PRIMARY ADMIN', selected.admin],
        selected.recruiters != null && ['RECRUITERS ON GTH', String(selected.recruiters)],
        selected.plan && ['PLAN', selected.plan],
      ].filter(Boolean)
    : [];

  return (
    <RecruiterOnboardingShell
      routeKey="organisation"
      // Figma 7374:5519 (request sent) swaps the panel chips to the "Fuzzy match on" copy.
      panel={<RecruiterOnboardingPanel variant={modalOpen ? 'affiliation' : 'profile'} />}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[698px] flex-col items-center gap-10 max-md:gap-3"
      >
        <div className="flex w-full flex-col items-center gap-4 max-md:gap-3">
          <OrganisationHeading
            number="04"
            label="Organisation"
            title="Who do you hire for?"
            subtitle="Search for your organisation on GTH. If it's already here, request to join — otherwise create it in under a minute."
          />

          <div className="flex w-full flex-col gap-3 text-left">
            <div className="flex w-full flex-col gap-2">
              <TextInput
                id={inputId}
                label="Organisation Name"
                required
                type="text"
                placeholder="Search organisation e.g. MTN Ghana"
                autoComplete="off"
                spellCheck={false}
                leftIcon={<SearchGlyph variant={query ? 'active' : 'default'} />}
                verified={Boolean(selected)}
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={expanded}
                aria-controls={expanded ? listboxId : undefined}
                aria-activedescendant={
                  expanded && activeIndex >= 0 ? optionId(activeIndex) : undefined
                }
                aria-describedby={mode === 'idle' ? helperId : undefined}
                inputClassName="max-md:text-[16px]!"
              />
              {mode === 'idle' && (
                <div className="flex items-center gap-2 px-2 text-[#575755]">
                  <DiamondAlertIcon className="size-4 shrink-0 text-brand-green" />
                  <p
                    id={helperId}
                    className="font-sans text-[12px] leading-[18px]"
                    style={{ letterSpacing: '0.2px' }}
                  >
                    Search by legal or trading name
                  </p>
                </div>
              )}
            </div>

            {mode === 'idle' && (
              <InfoNote>
                Each organisation has one Primary Admin. If yours is already on GTH, they&apos;ll
                approve your request to join.
              </InfoNote>
            )}

            {mode === 'results' && expanded && (
              <div
                id={listboxId}
                role="listbox"
                aria-label="Organisations"
                className={CARD_CLASSES}
              >
                {search.results.map((org, i) => (
                  <OrgResultRow
                    key={org.id}
                    id={optionId(i)}
                    name={org.name}
                    subline={describeOrganisation(org)}
                    badge="On GTH"
                    active={activeIndex === i}
                    onHover={() => setActiveIndex(i)}
                    onSelect={() => chooseOrg(org)}
                  />
                ))}
                <div aria-hidden="true" className="mx-4 h-px bg-[#fefefe]" />
                <CreateRow
                  id={optionId(search.results.length)}
                  label={createLabelResults}
                  active={activeIndex === search.results.length}
                  onHover={() => setActiveIndex(search.results.length)}
                  onSelect={goCreate}
                />
              </div>
            )}

            {mode === 'suggestion' && (
              <>
                <InfoNote tone="amber" role="status">
                  Did you mean {search.suggestion.name}? Similar names are matched to stop duplicate
                  organisations.
                </InfoNote>
                {expanded && (
                  <div
                    id={listboxId}
                    role="listbox"
                    aria-label="Organisations"
                    className={CARD_CLASSES}
                  >
                    <OrgResultRow
                      id={optionId(0)}
                      name={search.suggestion.name}
                      subline={describeOrganisation(search.suggestion, { withAdmin: true })}
                      badge="Best match"
                      tinted
                      active={activeIndex === 0}
                      onHover={() => setActiveIndex(0)}
                      onSelect={() => chooseOrg(search.suggestion)}
                    />
                    <CreateRow
                      id={optionId(1)}
                      label={createLabelSuggestion}
                      active={activeIndex === 1}
                      onHover={() => setActiveIndex(1)}
                      onSelect={goCreate}
                    />
                  </div>
                )}
              </>
            )}

            {mode === 'notFound' && (
              <div
                className={classNames(
                  CARD_CLASSES,
                  'items-center gap-2 px-8 py-4 text-center max-md:px-4'
                )}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand-green-light text-brand-green"
                >
                  <SearchGlyph variant="empty" className="size-[22px]" />
                </span>
                <p
                  className="mt-4 font-sans text-[16px] font-medium leading-7 text-[#111111]"
                  style={{ letterSpacing: '0.2px' }}
                >
                  No organisation called “{trimmed}” yet
                </p>
                <p
                  className="max-w-[480px] pb-4 font-sans text-[14px] leading-6 text-[#babab7]"
                  style={{ letterSpacing: '0.2px' }}
                >
                  Be the first — create it and you&apos;ll become its Primary Admin, able to approve
                  other recruiters.
                </p>
              </div>
            )}

            {mode === 'selected' && (
              <>
                <div className={CARD_CLASSES}>
                  <OrgResultRow
                    name={selected.name}
                    subline={describeOrganisation(selected, { extended: true })}
                    badge="Selected"
                    tinted
                    selected
                  />
                  {selectedMeta.length > 0 && (
                    <dl className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-2">
                      {selectedMeta.map(([label, value]) => (
                        <div key={label} className="flex flex-col gap-0.5">
                          <dt
                            className="font-sans text-[10px] uppercase leading-4 text-[#babab7] max-lg:text-[12px]"
                            style={{ letterSpacing: '0.2px' }}
                          >
                            {label}
                          </dt>
                          <dd
                            className="font-sans text-[14px] font-medium leading-6 text-[#111111]"
                            style={{ letterSpacing: '0.2px' }}
                          >
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
                <InfoNote>
                  {adminName
                    ? `Your request goes to ${adminName} (Primary Admin). Once approved you'll post under ${selected.name}${
                        selected.plan ? ` and share its ${selected.plan} plan` : ''
                      }. Meanwhile your account stays active.`
                    : `Your request goes to the Primary Admin of ${selected.name}. Once approved you'll post under ${selected.name}. Meanwhile your account stays active.`}
                </InfoNote>
              </>
            )}
          </div>
        </div>

        <StickyActionBar bleed={16}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!ctaEnabled || submitting}
            state={submitting ? 'active' : undefined}
            leftIcon={submitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
            rightIcon={<ArrowRightIcon />}
            className="w-full max-md:text-[14px]"
            aria-busy={submitting}
          >
            {ctaLabel}
          </Button>
        </StickyActionBar>
      </form>

      {modalOpen && selected && (
        <OrganisationResultModal
          title="Request sent."
          caption="Request pending"
          description={`${
            adminName ? `${adminName} (Primary Admin)` : 'The Primary Admin'
          } has been notified. You can start posting under your own name while you wait.`}
          rows={[
            {
              icon: <BuildingIcon className="size-4" />,
              label: 'Organisation',
              value: selected.name,
            },
            {
              icon: <StatusMailIcon className="size-3" />,
              label: 'Status',
              value: 'Pending approval',
            },
          ]}
          ctaLabel="Continue To Plan"
          onContinue={continueToPlan}
          onClose={() => setModalOpen(false)}
        />
      )}
    </RecruiterOnboardingShell>
  );
};

export default RecruiterOrganisationPage;
