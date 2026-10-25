import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import AgencyButton from '../../agency/AgencyButton.jsx';
import {
  AdminArrowheadDownIcon,
  AdminAltArrowDownIcon,
  AdminChannelIcon,
  AdminIncludedIcon,
  AdminRegionIcon,
  AdminScheduleIcon,
  AdminStarOffIcon,
  AdminStarOnIcon,
  AdminUnder18Icon,
  AdminUsertypeIcon,
} from './commsIcons.jsx';
import CommsTabs from './CommsTabs.jsx';
import { BULK } from './data/adminCommsData.js';

const log = debug('BulkNotificationView');

/*
 * BulkNotificationView — /admin/comms/bulk (Figma 7.4.2a "Comms · Bulk notification" 8638:540, behind the dialogs 7.4.2b-d): title 32/40 600 ("notification" green) + sub · the
 * Sent / Templates / Bulk notification tabs · Template select (431, required) · AUDIENCE + AUTOMATED chip · the criteria card (862, r14: User type, Region, Channel, each
 * a row with an icon, 16 title, #999 sub, its control and a 44 x 24 toggle) · the Reach card (435, #f3f8f4: audience bar, "will get it", 97 % stars, "Send a test",
 * "Submit for approval") · Schedule and Under-18s cards (300 wide) · DELIVERY with three stat cards.
 * Props: onTest(), onSubmit(). ⚠️ ASSUMPTION: the template select, the audience controls, "+ Add region" and the toggles are local look-and-feel only (the reach numbers are
 * fixed sample figures); only the two reach buttons do something (open the dialogs).
 */

const ICONS = {
  usertype: AdminUsertypeIcon,
  region: AdminRegionIcon,
  channel: AdminChannelIcon,
  schedule: AdminScheduleIcon,
  under18: AdminUnder18Icon,
};

const Toggle = ({ on, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={() => onChange(!on)}
    className={classNames(
      'relative h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-0 p-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      on ? 'bg-[#387440]' : 'bg-[#d5d5d5]'
    )}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'absolute top-[2px] size-[20px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left]',
        on ? 'left-[22px]' : 'left-[2px]'
      )}
    />
  </button>
);

const Control = ({ c }) => {
  if (c.kind === 'region') {
    return (
      <div className="flex flex-wrap items-center gap-[8px] pt-[8px]">
        <span className="inline-flex items-center rounded-[8px] bg-[#ebf1ec] px-[12px] py-[8px] font-sans text-[15px] leading-[18px] text-[#2a5730]">
          {c.label}
        </span>
        <AgencyButton size="xs" onClick={() => log('add region (no picker drawn)')}>
          {c.add}
        </AgencyButton>
      </div>
    );
  }
  if (c.kind === 'select') {
    return (
      <div className="pt-[8px]">
        <button
          type="button"
          onClick={() => log('user type (no menu drawn)')}
          className="inline-flex h-[38px] cursor-pointer items-center gap-[4px] rounded-[8px] border border-solid border-[#e9e9e9] bg-white px-[12px] font-sans text-[16px] leading-[22px] text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {c.label}
          <AdminAltArrowDownIcon className="size-[16px]" />
        </button>
      </div>
    );
  }
  return (
    <div className="pt-[8px]">
      <span className="inline-flex h-[38px] items-center rounded-[8px] border border-solid border-[#e9e9e9] bg-white px-[12px] font-sans text-[16px] leading-[22px] text-[#595959]">
        {c.label}
      </span>
    </div>
  );
};

const Stars = ({ pct }) => (
  <span className="flex items-center gap-[4px]" role="img" aria-label={`${pct}%`}>
    {[0, 1, 2, 3, 4].map((i) => {
      const Star = i < 4 ? AdminStarOnIcon : AdminStarOffIcon;
      return <Star key={i} className="h-[19px] w-[20px] text-[#c8951a]" />;
    })}
    <span className="pl-[8px] font-sans text-[16px] leading-[24px] text-[#1c2a21]">{pct}%</span>
  </span>
);

const BulkNotificationView = ({ onTest, onSubmit }) => {
  const [on, setOn] = useState({
    type: true,
    region: true,
    channel: false,
    schedule: true,
    minors: true,
  });
  const r = BULK.reach;
  const Sched = ICONS[BULK.schedule.icon];
  const Minor = ICONS[BULK.minors.icon];
  return (
    <div className="flex flex-col gap-[28px] pt-[4px]">
      <div className="flex flex-col gap-[16px]">
        <header className="flex flex-col gap-[3px]">
          <h1 className="m-0 font-sans text-[32px] leading-[40px] font-semibold text-[#1c2a21]">
            Bulk <span className="text-[#387440]">notification</span>
          </h1>
          <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999999]">{BULK.sub}</p>
        </header>
        <CommsTabs active="bulk" />
      </div>

      <div className="flex flex-col gap-[32px] pb-[24px]">
        <div className="flex max-w-[431px] flex-col gap-[8px]">
          <span className="font-sans text-[14px] leading-[24px] font-medium text-[#1c2a21]">
            {BULK.templateLabel}
            <span aria-hidden="true" className="text-[14px] font-semibold text-[#1d7c4d]">
              *
            </span>
          </span>
          <button
            type="button"
            onClick={() => log('template select (no menu drawn)')}
            className="flex h-[51px] w-full cursor-pointer items-center justify-between rounded-[10px] border border-solid border-[#cccccc] bg-white px-[16px] text-left font-sans text-[14px] leading-[20px] font-medium text-[#595959] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {BULK.template}
            <AdminArrowheadDownIcon className="size-[20px]" />
          </button>
        </div>

        <section aria-label="Audience" className="flex flex-col gap-[18px]">
          <div className="flex items-center gap-[16px]">
            <h2 className="m-0 font-sans text-[16px] leading-[20px] font-medium text-[#387440]">
              {BULK.audience}
            </h2>
            <span className="inline-flex items-center rounded-[6px] border border-solid border-[#e8e8e4] bg-white px-[12px] py-[4px] font-sans text-[14px] leading-[20px] font-medium text-[#737373]">
              {BULK.automated}
            </span>
          </div>
          <div className="grid grid-cols-1 items-start gap-[32px] xl:grid-cols-[minmax(0,862fr)_minmax(0,435fr)]">
            <div className="flex flex-col gap-[12px] rounded-[14px] border border-solid border-[#e6e2d6] bg-white px-[22px] py-[20px]">
              <ul className="m-0 flex list-none flex-col gap-[24px] p-0">
                {BULK.criteria.map((c) => {
                  const Icon = ICONS[c.icon];
                  const key = c.id;
                  return (
                    <li
                      key={c.id}
                      className="flex items-start gap-[12px] rounded-[12px] px-[12px] py-[16px]"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
                        <div className="flex items-center gap-[8px]">
                          <Icon className="size-[20px] shrink-0 text-[#387440]" />
                          <h3 className="m-0 font-sans text-[16px] leading-[24px] font-normal text-[#1c2a21]">
                            {c.title}
                          </h3>
                        </div>
                        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999999]">
                          {c.sub}
                        </p>
                        <Control c={c.control} />
                      </div>
                      <Toggle
                        on={on[key]}
                        label={c.title}
                        onChange={(v) => setOn((s) => ({ ...s, [key]: v }))}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
            <aside
              aria-label={r.title}
              className="flex flex-col gap-[18px] rounded-[14px] border border-solid border-[#1c2a21]/15 bg-[#f3f8f4] p-[16px]"
            >
              <div className="flex flex-col gap-[16px]">
                <h3 className="m-0 text-center font-sans text-[18px] leading-[24px] font-medium text-[#1c2a21]">
                  {r.title}
                </h3>
                <div className="flex flex-col gap-[16px]">
                  <p className="m-0 flex justify-between font-sans text-[16px] leading-[24px] text-[#595959]">
                    {r.audience[0]}
                    <span className="text-[#1c2a21]">{r.audience[1]}</span>
                  </p>
                  <span
                    aria-hidden="true"
                    className="block h-[7px] overflow-hidden rounded-full bg-[#e6e6e6]"
                  >
                    <span
                      className="block h-full bg-[#387440]"
                      style={{ width: `${r.bar * 100}%` }}
                    />
                  </span>
                  <p className="m-0 flex items-center justify-between font-sans text-[16px] leading-[24px] text-[#595959]">
                    <span className="flex items-center gap-[8px]">
                      <span className="size-[12px] rounded-full bg-[#387440]" />
                      {r.willGet[0]}
                    </span>
                    <span className="text-[#387440]">{r.willGet[1]}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-[12px] border-t border-solid border-[#e6e2d6] pt-[23px]">
                <p className="m-0 font-sans text-[16px] leading-[24px] text-[#1c2a21]">
                  {r.reachable}
                </p>
                <Stars pct={r.rating} />
                <p className="m-0 pt-[4px] text-center font-sans text-[16px] leading-[24px] text-[#999999]">
                  {r.note}
                </p>
              </div>
              <div className="flex flex-col gap-[12px] pt-[16px]">
                <button
                  type="button"
                  onClick={onTest}
                  className="inline-flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[14px] leading-[24px] font-semibold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  {r.test}
                </button>
                <button
                  type="button"
                  onClick={onSubmit}
                  className="inline-flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[18px] font-sans text-[14px] leading-[24px] font-semibold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  {r.submit}
                </button>
              </div>
            </aside>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            <div className="flex w-[300px] max-w-full flex-col gap-[4px] rounded-[14px] border border-solid border-[#e6e2d6] bg-white px-[22px] pt-[22px] pb-[38px]">
              <div className="flex items-center justify-between">
                <Sched className="size-[18px] text-[#387440]" />
                <Toggle
                  on={on.schedule}
                  label={BULK.schedule.title}
                  onChange={(v) => setOn((s) => ({ ...s, schedule: v }))}
                />
              </div>
              <h3 className="m-0 pt-[12px] font-sans text-[16px] leading-[24px] font-normal text-[#1c2a21]">
                {BULK.schedule.title}
              </h3>
              <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999999]">
                {BULK.schedule.sub}
              </p>
              <div className="flex flex-col gap-[8px] pt-[16px]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#f3f8f4] px-[8px] py-[4px] font-sans text-[16px] leading-[24px] text-[#387440]">
                    {BULK.schedule.chip}
                  </span>
                  <span className="font-sans text-[16px] leading-[24px] text-[#387440]">
                    {BULK.schedule.when}
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className="block h-[8px] overflow-hidden rounded-[4px] bg-[#f0eee8]"
                >
                  <span
                    className="block h-full bg-[#387440]"
                    style={{ width: `${BULK.schedule.fill * 100}%` }}
                  />
                </span>
              </div>
            </div>
            <div className="flex w-[300px] max-w-full flex-col gap-[4px] rounded-[14px] border border-solid border-[#e6e2d6] bg-white px-[22px] pt-[22px] pb-[34px]">
              <div className="flex items-center justify-between">
                <Minor className="h-[20px] w-[16px] text-[#387440]" />
                <Toggle
                  on={on.minors}
                  label={BULK.minors.title}
                  onChange={(v) => setOn((s) => ({ ...s, minors: v }))}
                />
              </div>
              <h3 className="m-0 pt-[12px] font-sans text-[16px] leading-[24px] font-normal text-[#1c2a21]">
                {BULK.minors.title}
              </h3>
              <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999999]">
                {BULK.minors.sub}
              </p>
              <p className="m-0 flex items-center gap-[8px] pt-[12px] font-sans text-[16px] leading-[24px] text-[#387440]">
                <AdminIncludedIcon className="size-[12px]" />
                {BULK.minors.included}
              </p>
              <p className="m-0 pt-[4px] font-sans text-[16px] leading-[24px] text-[#959592]">
                {BULK.minors.policy}
              </p>
            </div>
          </div>
        </section>

        <section aria-label="Delivery" className="flex flex-col gap-[18px]">
          <h2 className="m-0 font-sans text-[16px] leading-[20px] font-medium text-[#387440]">
            {BULK.delivery.title}
          </h2>
          <ul className="m-0 flex list-none flex-wrap gap-[24px] p-0">
            {BULK.delivery.cards.map((c) => (
              <li
                key={c.id}
                className="flex w-[276px] max-w-full flex-col gap-[8px] rounded-[12px] border border-solid border-[#e6e2d6] bg-white px-[24px] py-[23px]"
              >
                <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999999]">{c.label}</p>
                <p className="m-0 font-sans text-[32px] leading-[40px] font-semibold text-[#1c2a21]">
                  {c.value}
                </p>
                <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999999]">{c.sub}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default BulkNotificationView;
