import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { AdminCheckIcon } from '../adminIcons.jsx';
import { SettingsDialog } from '../../talentSettings/SettingsBDialogs.jsx';
import {
  AdminCommentIcon,
  AdminCompany28Icon,
  AdminUser28Icon,
  AdminUsers28Icon,
} from './commsIcons.jsx';

const log = debug('ChannelMessageDialog');

/*
 * ChannelMessageDialog — the two channel + message dialogs of Comms, one component (Figma 7.4.1a "Message Kofi Agyekum" and 7.4.3b "Edit template · Account suspended": "Modal ·
 * Send feedback", 540 wide, white, r24, p28, gap 24, 1px ink; the talent feedback modal): gold tile with the comment glyph · 24/600 title · close · "Channel(s)" 15/600 · three
 * 154 x 80 channel cards (In-platform, Email and a third; the selected one is #ebf1ec with a 1px #387440 border) · a 120 high textarea (r14) · a checkbox row · two 56 high
 * buttons (white secondary, green primary).
 * Props: title, channelLabel, channels [{ id, label, icon: 'user' | 'users' | 'company', selected }], text, checkLabel, secondary, primary, onSecondary(), onPrimary(), onClose().
 * ⚠️ ASSUMPTION: the cards are a single-choice radio group (the frames draw one selected card); "Preview" / "Save draft" log (no preview screen is drawn).
 * 7.4.3b draws the third card labelled "In-platform" again (the 7.4.1a label is "SMS · opted out"): kept as drawn.
 */

const ICONS = { user: AdminUser28Icon, users: AdminUsers28Icon, company: AdminCompany28Icon };

const ChannelMessageDialog = ({
  title,
  channelLabel,
  channels,
  text,
  checkLabel,
  secondary,
  primary,
  onSecondary,
  onPrimary,
  onClose,
}) => {
  const [channel, setChannel] = useState(channels.find((c) => c.selected)?.id ?? channels[0].id);
  const [body, setBody] = useState(text);
  const [check, setCheck] = useState(true);
  const submit = (e) => {
    e.preventDefault();
    log('submit', { channel, length: body.length });
    onPrimary();
  };
  return (
    <SettingsDialog
      open
      title={title}
      icon={<AdminCommentIcon className="size-[21px] text-[#1c2a21]" />}
      iconTone="bg-[#ffd86b]"
      onClose={onClose}
      widthClass="w-[540px]"
      gap="gap-[24px]"
    >
      <form onSubmit={submit} className="flex flex-col gap-[24px]">
        <fieldset className="m-0 flex flex-col gap-[24px] border-0 p-0">
          <legend className="p-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
            {channelLabel}
          </legend>
          <div role="radiogroup" aria-label={channelLabel} className="grid grid-cols-3 gap-[10px]">
            {channels.map((c) => {
              const Icon = ICONS[c.icon];
              const on = channel === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setChannel(c.id)}
                  className={classNames(
                    'flex h-[80px] cursor-pointer flex-col items-center justify-center gap-[6px] rounded-[14px] border border-solid px-[8px] font-sans text-[13.5px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                    on
                      ? 'border-[#387440] bg-[#ebf1ec] text-[#2a5730]'
                      : 'border-[#1c2a21]/15 bg-white text-[#1c2a21]'
                  )}
                >
                  <Icon className="size-[28px]" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          aria-label="Message"
          rows={4}
          className="h-[120px] w-full resize-none rounded-[14px] border border-solid border-[#1c2a21]/15 bg-white p-[14px] font-sans text-[15px] leading-[22px] text-[#1c2a21] outline-none focus:border-[#387440]"
        />
        <label className="flex cursor-pointer items-center gap-[10px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
          <input
            type="checkbox"
            checked={check}
            onChange={(e) => setCheck(e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={classNames(
              'grid size-[22px] shrink-0 place-items-center rounded-[6px] border border-solid text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#387440]',
              check ? 'border-[#387440] bg-[#387440]' : 'border-[#cccccc] bg-white'
            )}
          >
            {check ? <AdminCheckIcon className="size-[16px]" /> : null}
          </span>
          {checkLabel}
        </label>
        <div className="grid grid-cols-[1fr_219px] gap-[12px]">
          <button
            type="button"
            onClick={onSecondary}
            className="inline-flex h-[56px] cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {secondary}
          </button>
          <button
            type="submit"
            className="inline-flex h-[56px] cursor-pointer items-center justify-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {primary}
          </button>
        </div>
      </form>
    </SettingsDialog>
  );
};

export default ChannelMessageDialog;
