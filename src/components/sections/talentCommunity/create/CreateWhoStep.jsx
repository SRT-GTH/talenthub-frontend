import { useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import {
  CREATE_AGE_OPTIONS,
  CREATE_COPY,
  CREATE_JOIN_OPTIONS,
  CREATE_REGIONS,
} from './createCommunityData.js';
import { FilterChip, FooterBar, Section } from './CreateDialogParts.jsx';
import { ChoiceCard } from './CreateWizardParts.jsx';
import { CcSettingsIcon } from './CreateCommunityIcons.jsx';

const log = debug('CreateWhoStep');

/* ⚠️ ASSUMPTION: "+ More regions" is not drawn open. It reveals the other regions of Ghana so the chip does something real. */
const MORE_REGIONS = [
  'Western',
  'Central',
  'Eastern',
  'Bono',
  'Bono East',
  'Ahafo',
  'Upper East',
  'Upper West',
  'Savannah',
  'North East',
  'Oti',
  'Western North',
];
const ALL = CREATE_REGIONS[0];

/*
 * Step 2 · Who can join — CC-03. Props: draft, patchDraft, onBack(), onNext().
 * Join policy + age rule are radio groups; regions are chips ("All of Ghana" excludes the others, none picked falls back to it).
 */
const CreateWhoStep = ({ draft, patchDraft, onBack, onNext }) => {
  const copy = CREATE_COPY.who;
  const [more, setMore] = useState(() => draft.regions.some((r) => MORE_REGIONS.includes(r)));
  const regions = more ? [...CREATE_REGIONS.slice(0, -1), ...MORE_REGIONS] : CREATE_REGIONS;

  useEffect(() => {
    log('render', draft.joinPolicy, draft.ageRule, draft.regions.length);
  }, [draft.joinPolicy, draft.ageRule, draft.regions]);

  const toggleRegion = (name) => {
    if (name === '+ More regions') {
      setMore(true);
      return;
    }
    if (name === ALL) {
      patchDraft({ regions: [ALL] });
      return;
    }
    const without = draft.regions.filter((r) => r !== ALL);
    const next = without.includes(name) ? without.filter((r) => r !== name) : [...without, name];
    patchDraft({ regions: next.length ? next : [ALL] });
  };

  return (
    <>
      <Section title={copy.joinTitle} className="gap-[10px]">
        <div role="radiogroup" aria-label={copy.joinTitle} className="flex flex-col gap-[10px]">
          {CREATE_JOIN_OPTIONS.map((option) => (
            <ChoiceCard
              key={option.id}
              {...option}
              selected={draft.joinPolicy === option.id}
              onSelect={() => patchDraft({ joinPolicy: option.id })}
            />
          ))}
        </div>
      </Section>
      <Section title={copy.ageTitle} className="gap-[10px]">
        <div role="radiogroup" aria-label={copy.ageTitle} className="flex flex-col gap-[10px]">
          {CREATE_AGE_OPTIONS.map((option) => (
            <ChoiceCard
              key={option.id}
              {...option}
              selected={draft.ageRule === option.id}
              onSelect={() => patchDraft({ ageRule: option.id })}
            />
          ))}
        </div>
      </Section>
      <Section title={copy.regionTitle}>
        <div className="flex flex-wrap gap-[8px]">
          {regions.map((name) => (
            <FilterChip
              key={name}
              on={draft.regions.includes(name)}
              onClick={() => toggleRegion(name)}
            >
              {name}
            </FilterChip>
          ))}
        </div>
      </Section>
      <FooterBar note={copy.note} noteIcon={CcSettingsIcon}>
        <Button variant="tertiary" size="lg" onClick={onBack}>
          {copy.back}
        </Button>
        <Button variant="primary" size="sm" onClick={onNext}>
          {copy.next}
        </Button>
      </FooterBar>
    </>
  );
};

export default CreateWhoStep;
