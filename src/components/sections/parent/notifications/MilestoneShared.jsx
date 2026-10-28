import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import ParentToast from '../wards/dialogs/ParentToast.jsx';
import { MILESTONE } from './data/notificationsData.js';
import { useNotificationsState } from './notificationsState.js';

const log = debug('MilestoneShared');

/*
 * MilestoneShared — PN-03 "Milestone · Abena wanted you to see this" (Figma 10043:913) and PN-03b "Reaction sent to Abena (toast)" (10056:156668): the body of /parent/notifications/milestone.
 * Title 34/600 + "Shared with you" sticker; one white card (p32, gap16, r24): Spot trophy 112 + eyebrow 11/700 caps green, headline 26/600, meta 13/400; a #f8f8f4 quote card with Abena's photo;
 * "Send her a quick reaction" + four chips (the selected one is ink); "View Abena" (secondary) + "Send reaction" (primary). Send shows the toast "Sent to Abena" (`?toast=sent`).
 * URL: `?reaction=<id>` (default well-done), `?toast=sent`. The chips are a radio group (arrow keys move the choice).
 * ⚠️ ASSUMPTION: "Write my own" only selects the chip (no text box is drawn), so sending it uses its label.
 */
const MilestoneShared = () => {
  const { reaction, toast, update } = useNotificationsState();
  const chosen = MILESTONE.reactions.find((r) => r.id === reaction) ?? MILESTONE.reactions[0];

  useEffect(() => {
    log('render', { reaction: chosen.id, toast: toast || '(none)' });
  }, [chosen.id, toast]);

  const send = () => {
    log('send reaction', chosen.id);
    update({ toast: 'sent' }, { replace: false });
  };

  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px]">
      <div className="flex flex-wrap items-center gap-[12px]">
        <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
          {MILESTONE.title}
        </h1>
        <span className="rounded-full bg-brand-green-light px-[11px] py-[5px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
          {MILESTONE.sticker}
        </span>
      </div>

      <section className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[clamp(20px,2.31vw,32px)] font-sans shadow-[0_5px_17px_rgba(28,42,33,0.03)]">
        <div className="flex items-center gap-[20px] max-sm:flex-col max-sm:items-start">
          <img src={MILESTONE.spot} alt="" className="size-[112px] shrink-0" />
          <div className="flex min-w-0 flex-col gap-[6px]">
            <p className="m-0 text-[11px] leading-[13px] font-bold tracking-[0.88px] text-[#387440] uppercase max-lg:text-[12px]">
              {MILESTONE.eyebrow}
            </p>
            <h2 className="m-0 text-[26px] leading-[31px] font-semibold text-[#1c2a21]">
              {MILESTONE.headline}
            </h2>
            <p className="m-0 text-[13px] leading-[16px] text-[#575755]">{MILESTONE.meta}</p>
          </div>
        </div>

        <div className="flex items-center gap-[12px] rounded-[16px] bg-[#f8f8f4] p-[18px]">
          <img
            src={MILESTONE.photo}
            alt=""
            width="36"
            height="36"
            className="size-[36px] shrink-0 rounded-full object-cover"
          />
          <p className="m-0 text-[14px] leading-[17px] font-medium text-[#1c2a21]">
            {MILESTONE.quote}
          </p>
        </div>

        <p
          id="reaction-label"
          className="m-0 text-[13px] leading-[16px] font-semibold text-[#1c2a21]"
        >
          {MILESTONE.reactionsLabel}
        </p>
        <div
          role="radiogroup"
          aria-labelledby="reaction-label"
          className="flex flex-wrap gap-[8px]"
        >
          {MILESTONE.reactions.map((r) => {
            const selected = r.id === chosen.id;
            return (
              <label
                key={r.id}
                className={`inline-flex h-[32px] cursor-pointer items-center rounded-full border border-solid px-[14px] text-[13px] leading-[16px] font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#387440] ${
                  selected
                    ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                    : 'border-[#e1eae2] bg-white text-[#595959]'
                }`}
              >
                <input
                  type="radio"
                  name="reaction"
                  value={r.id}
                  checked={selected}
                  onChange={() => {
                    log('choose reaction', r.id);
                    update({ reaction: r.id === 'well-done' ? null : r.id, toast: null });
                  }}
                  className="sr-only"
                />
                {r.label}
              </label>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-[12px] pt-[4px]">
          <ParentButton variant="secondary" to={MILESTONE.viewTo}>
            {MILESTONE.view}
          </ParentButton>
          <ParentButton onClick={send}>{MILESTONE.send}</ParentButton>
        </div>
      </section>

      {toast === 'sent' ? (
        <ParentToast
          message={MILESTONE.toastTitle}
          detail={MILESTONE.toastDetail(chosen.label)}
          onClose={() => update({ toast: null })}
        />
      ) : null}
    </div>
  );
};

export default MilestoneShared;
