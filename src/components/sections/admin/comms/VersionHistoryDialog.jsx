import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { Checkbox, Select, TextInput } from '../../../ui/form';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import {
  AdminArrowRightIcon,
  AdminCheckCircleFillIcon,
  AdminClose16Icon,
  AdminDeleteIcon,
  AdminFile22Icon,
} from '../adminIcons.jsx';
import { HISTORY } from './data/adminCommsData.js';

const log = debug('VersionHistoryDialog');

/*
 * VersionHistoryDialog — "Account suspended · v4 vs v5" (Figma 7.4.3d 8666:11839, the talent "Edit certification" modal: 820 wide, r28, p 40/36/40/32, 1px ink, 40 round close):
 * chip "Version history" · title 32/38 600 ("v5" green) · 15/22 #595959 sub · file strip (#f8f8f4: tile, "v5 draft vs v4 live", "2 lines changed · edited by Nana Adjei", mint "Pick
 * versions") · four rows of two fields (v4 live · v5 draft / Removed · Changed text / Added · Variables / Events · Earlier versions) · "Show only changed lines" · green notice
 * "Publishing v5 replaces v4 for every event" · red "Roll back to v3" link, mint "Close" and the green "Publish v5 →".
 * Props: onClose(), onPublish(), onRollback(). ⚠️ ASSUMPTION: the compared lines are read-only values (the frames draw filled inputs); "Pick versions" only logs.
 */

const Row = ({ children }) => (
  <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">{children}</div>
);

const VersionHistoryDialog = ({ onClose, onPublish, onRollback }) => {
  const [only, setOnly] = useState(true);
  const H = HISTORY;
  return (
    <AgencyDialog
      label={H.title}
      onClose={onClose}
      scrimClassName="bg-[#0b1a0f]/55"
      panelClassName="w-[min(820px,calc(100vw-32px))]"
    >
      <div className="relative flex flex-col gap-[24px] rounded-[28px] border border-solid border-[#1c2a21] bg-white px-[clamp(18px,2.1vw,36px)] pt-[clamp(24px,2.3vw,40px)] pb-[clamp(18px,1.85vw,32px)] shadow-[0_24px_64px_rgba(0,0,0,0.2)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-[24px] right-[24px] grid size-[40px] cursor-pointer place-items-center rounded-full border-0 bg-[#f3f3ef] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AdminClose16Icon className="size-[16px]" />
        </button>
        <header className="flex flex-col items-start gap-[8px] pr-[48px]">
          <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#387440]">
            {H.chip}
          </span>
          <h2 className="m-0 font-sans text-[32px] leading-[38px] font-semibold text-[#1c2a21]">
            Account suspended · v4 vs <span className="text-[#387440]">v5</span>
          </h2>
          <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{H.sub}</p>
        </header>

        <div className="flex flex-wrap items-center gap-[14px] rounded-[16px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] py-[14px] pr-[16px] pl-[14px]">
          <span className="grid size-[44px] shrink-0 place-items-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
            <AdminFile22Icon className="size-[22px]" />
          </span>
          <div className="flex min-w-[200px] flex-1 flex-col gap-[2px]">
            <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {H.file.title}
            </p>
            <p className="m-0 flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#387440]">
              <AdminCheckCircleFillIcon className="size-[13px]" />
              {H.file.meta}
            </p>
          </div>
          <button
            type="button"
            onClick={() => log('pick versions (no picker drawn)')}
            className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {H.file.action}
          </button>
        </div>

        <div className="flex flex-col gap-[24px]">
          <Row>
            <TextInput label={H.left.label} required value={H.left.text} readOnly />
            <TextInput label={H.right.label} required value={H.right.text} readOnly />
          </Row>
          <Row>
            <Select
              label={H.removed.label}
              required
              options={[H.removed.value]}
              value={H.removed.value}
              onChange={() => {}}
            />
            <TextInput label={H.changed.label} value={H.changed.value} readOnly />
          </Row>
          <Row>
            <TextInput label={H.added.label} required value={H.added.value} readOnly />
            <TextInput
              label={H.variables.label}
              value={H.variables.value}
              readOnly
              className="[&_input]:bg-[#ebf1ec]"
            />
          </Row>
          <Row>
            <TextInput label={H.events.label} optional value={H.events.value} readOnly />
            <TextInput label={H.earlier.label} optional value={H.earlier.value} readOnly />
          </Row>
        </div>

        <Checkbox
          label={H.only}
          checked={only}
          onChange={(e) => setOnly(e.target.checked)}
          labelClassName="text-[14px] font-medium text-[#1c2a21]"
        />

        <p className="m-0 flex items-center gap-[10px] rounded-[14px] border border-solid border-[#1c2a21] bg-[#e8f2ed] px-[14px] py-[12px] font-sans text-[14px] leading-[17px] font-semibold text-[#165d3a]">
          <AdminCheckCircleFillIcon className="size-[18px] shrink-0" />
          {H.note}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-[12px] pt-[8px]">
          <button
            type="button"
            onClick={onRollback}
            className="inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#902b20] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#902b20]"
          >
            <AdminDeleteIcon className="size-[16px]" />
            {H.rollback}
          </button>
          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-[52px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#165d3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {H.close}
            </button>
            <button
              type="button"
              data-autofocus
              onClick={onPublish}
              className={classNames(
                'inline-flex h-[52px] cursor-pointer items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[28px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]'
              )}
            >
              {H.publish}
              <AdminArrowRightIcon className="size-[20px]" />
            </button>
          </div>
        </div>
      </div>
    </AgencyDialog>
  );
};

export default VersionHistoryDialog;
