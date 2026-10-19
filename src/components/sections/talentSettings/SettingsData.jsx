import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  SettingsCloseXIcon,
  SettingsInfoCircleIcon,
  SettingsPauseCircleIcon,
  SettingsTrashIcon,
} from '../../shared/assets.jsx';
import { DeleteAccountButton, GroupCard, SettingRow, SettingsToggle } from './SettingsBUi.jsx';
import { SettingsDialog, SettingsToast } from './SettingsBDialogs.jsx';
import { FieldB } from './SettingsBFields.jsx';
import { DATA_COPY, DELETE_COPY, DOWNLOAD_TOAST } from './talentSettingsBData.js';

const log = debug('SettingsData');

const DeleteListItem = ({ children }) => (
  <li className="flex w-full items-center gap-[10px]">
    <SettingsCloseXIcon className="size-[16px] shrink-0 text-[#902b20]" />
    <span className="min-w-0 flex-1 text-[14px] leading-[normal] text-[#1c2a21]">{children}</span>
  </li>
);

// ---- ST-10 Delete account · Confirm ------------------------------------------------------------
const DeleteAccountDialog = ({ onClose, onConfirm }) => {
  // Figma draws the field already filled with DELETE; the button only works while it matches.
  const [typed, setTyped] = useState(DELETE_COPY.confirmWord);
  const keepRef = useRef(null);
  const ready = typed === DELETE_COPY.confirmWord;
  const copy = DELETE_COPY;

  return (
    <SettingsDialog
      open
      title={copy.title}
      icon={<SettingsTrashIcon className="size-[21px] text-[#902b20]" />}
      iconTone="bg-[#f9ebea]"
      onClose={onClose}
      topOffset
      initialFocus={() => keepRef.current}
      testId="delete"
    >
      <p className="w-full text-[15px] leading-[normal] font-semibold text-[#1c2a21]">
        {copy.intro}
      </p>
      <ul className="flex w-full flex-col gap-[16px]">
        {copy.items.map((item) => (
          <DeleteListItem key={item}>{item}</DeleteListItem>
        ))}
        <DeleteListItem>
          <span className="playful:hidden">{copy.streakFocused}</span>
          <span className="hidden playful:inline">{copy.streakPlayful}</span>
        </DeleteListItem>
      </ul>
      <div className="flex w-full items-center gap-[10px] rounded-[12px] bg-[#faf4e8] p-[12px]">
        <SettingsInfoCircleIcon className="size-[18px] shrink-0 text-[#463409]" />
        <p className="min-w-0 flex-[1_0_0] text-[13.5px] leading-[1.45] font-medium text-[#463409]">
          {copy.info}
        </p>
      </div>
      <FieldB
        label={copy.confirmLabel}
        value={typed}
        onChange={setTyped}
        autoComplete="off"
        spellCheck={false}
      />
      <div className="flex w-full items-center gap-[12px]">
        <Button
          ref={keepRef}
          variant="tertiary"
          size="lg"
          className="min-w-0 flex-1"
          onClick={onClose}
        >
          {copy.keep}
        </Button>
        <DeleteAccountButton
          tone="white"
          className="min-w-0 flex-1"
          disabled={!ready}
          onClick={() => {
            log('dispatch delete account', { ready });
            onConfirm?.();
          }}
        >
          {copy.confirm}
        </DeleteAccountButton>
      </div>
    </SettingsDialog>
  );
};

/*
 * SettingsData — ST-07 "Data and account" (Playful 7844:13705 / Focused 8110:46238) and its states:
 * ?state=download (ST-07b toast), ?state=paused (ST-07c banner + toggle on), ?state=delete (ST-10).
 */
const SettingsData = ({ settings }) => {
  const { state, update } = settings;
  const navigate = useNavigate();
  const copy = DATA_COPY;
  const paused = state === 'paused';

  const onPauseToggle = (next) => {
    log('dispatch pause profile', { next });
    update({ state: next ? 'paused' : null });
  };

  return (
    <div className="flex w-full flex-col gap-[20px]" data-settings-section="data">
      {paused && (
        <div
          role="status"
          className="flex w-full flex-wrap items-center gap-x-[14px] gap-y-[10px] rounded-[18px] bg-[#faf4e8] p-[clamp(14px,1.2vw,18px)] text-[#463409]"
        >
          <SettingsPauseCircleIcon className="size-[22px] shrink-0" />
          <div className="flex min-w-0 flex-[1_1_220px] flex-col items-start gap-[2px]">
            <p className="text-[16px] leading-[normal] font-semibold lg:whitespace-nowrap">
              {copy.paused.title}
            </p>
            <p className="text-[13.5px] leading-[1.45]">{copy.paused.description}</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => onPauseToggle(false)}>
            {copy.paused.cta}
          </Button>
        </div>
      )}

      <GroupCard title={copy.yourData.title} description={copy.yourData.description}>
        <SettingRow
          nowrapControl={false}
          title={copy.yourData.download.title}
          description={copy.yourData.download.description}
          control={
            <Button variant="tertiary" size="lg" onClick={() => update({ state: 'download' })}>
              {copy.yourData.download.cta}
            </Button>
          }
        />
        <SettingRow
          top={false}
          nowrapControl={false}
          title={copy.yourData.pdf.title}
          description={copy.yourData.pdf.description}
          control={
            <Button
              variant="tertiary"
              size="lg"
              onClick={() => log('dispatch download verified skills pdf')}
            >
              {copy.yourData.pdf.cta}
            </Button>
          }
        />
      </GroupCard>

      <GroupCard title={copy.takeABreak.title}>
        <SettingRow
          top={false}
          title={copy.takeABreak.pause.title}
          titleId="data-pause"
          description={copy.takeABreak.pause.description}
          control={
            <SettingsToggle labelledBy="data-pause" checked={paused} onChange={onPauseToggle} />
          }
        />
      </GroupCard>

      <GroupCard
        title={copy.danger.title}
        description={copy.danger.description}
        danger={paused ? 'paused' : 'default'}
        gap={paused ? 'gap-[8px]' : 'gap-[4px]'}
      >
        <div className="flex w-full flex-wrap items-center gap-x-[16px] gap-y-[10px] border-t border-[rgba(28,42,33,0.08)] py-[14px]">
          <div className="flex min-w-0 flex-[1_1_240px] flex-col items-start gap-[3px] leading-[normal]">
            <p className="text-[15px] font-semibold text-[#1c2a21]">{copy.danger.rowTitle}</p>
            <p className="text-[13.5px] text-[#595959]">{copy.danger.rowDescription}</p>
          </div>
          <DeleteAccountButton onClick={() => update({ state: 'delete' })}>
            {copy.danger.cta}
          </DeleteAccountButton>
        </div>
      </GroupCard>

      {state === 'delete' && (
        <DeleteAccountDialog
          onClose={() => update({ state: null })}
          onConfirm={() => {
            update({ state: null });
            navigate('/logged-out');
          }}
        />
      )}
      <SettingsToast
        open={state === 'download'}
        title={DOWNLOAD_TOAST.title}
        body={DOWNLOAD_TOAST.body}
        elevated
        onDismiss={() => update({ state: null })}
      />
    </div>
  );
};

export default SettingsData;
