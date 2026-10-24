import Button from '../../../ui/Button.jsx';
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from './shareButtonClasses.js';
import ShareDialogShell from './ShareDialogShell.jsx';
import ShareRadioCard from './ShareRadioCard.jsx';

/*
 * ShareChooseDialog — Figma 8.8.2a "What do you want to share?" (8500:2387): three radio cards (this view with its filters · the whole
 * national snapshot · the region page) + Cancel / Create link. Shown when the page has filters applied.
 * Props: options [{ id, title, detail, extra }], value (selected id), onChange(id), onCreate(), onClose().
 * ⚠️ ASSUMPTION: the region option is only offered when a region filter is set (Figma draws it for Volta).
 */

const ShareChooseDialog = ({ options, value, onChange, onCreate, onClose }) => (
  <ShareDialogShell
    title="What do you want to share?"
    description="The link will open exactly what you choose."
    onClose={onClose}
    width={600}
    footer={
      <>
        <Button
          type="button"
          variant="tertiary"
          size="md"
          onClick={onClose}
          className={TERTIARY_BUTTON}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          className={PRIMARY_BUTTON}
          onClick={onCreate}
        >
          Create link
        </Button>
      </>
    }
  >
    <fieldset className="m-0 flex min-w-0 flex-col gap-[16px] border-0 p-0">
      <legend className="sr-only">What do you want to share?</legend>
      {options.map((option) => (
        <ShareRadioCard
          key={option.id}
          name="share-scope"
          value={option.id}
          checked={value === option.id}
          onChange={onChange}
          title={option.title}
          detail={option.detail}
          extra={option.extra}
        />
      ))}
    </fieldset>
  </ShareDialogShell>
);

export default ShareChooseDialog;
