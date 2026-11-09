import { useState } from 'react';
import Button from '../../../ui/Button.jsx';
import Modal from '../../../ui/Modal.jsx';
import {
  CloseCrossIcon,
  ExternalLinkOutlineIcon,
  MessageBubbleIcon,
  UserOutlineIcon,
} from './actionIcons.jsx';
import { CheckCircle } from '../../recruiterJobs/jobIcons.jsx';
import { DRAWER_COPY, NEXT_STAGE, STAGE_LABELS } from './pipelineActionData.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('CandidateDrawer');

/*
 * CandidateDrawer — "Drawer · Candidate" (Figma PL-03 10173:13566): a 664px white card (24px radius, 32px padding, gap 18) centred on the #0b1a0f 45 % scrim.
 * Head: 56px initials circle (#faf4e8, text #463409), Bricolage 26/600 name, headline, 40px close button. Then "Opened from Messages" chip, Match / Stage / Applied stat boxes,
 * the screening-rules summary with chips, the Application quote and three links, the Activity list, the Team notes box and the Not progressing / Move to <next stage> footer.
 * Props: card (board card), stageId, detail (see `CANDIDATE_DETAILS`), onClose, onNotProgressing, onMove(toStageId), onLink(linkId).
 */
const LINK_ICONS = {
  user: UserOutlineIcon,
  external: ExternalLinkOutlineIcon,
  message: MessageBubbleIcon,
};

const StatBox = ({ label, value }) => (
  <div className="flex min-w-0 flex-col gap-[4px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[12px]">
    <span className="font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
      {label}
    </span>
    <span className="font-['Bricolage_Grotesque',sans-serif] text-[20px] leading-[24px] font-semibold text-[#111]">
      {value}
    </span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="m-0 font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
    {children}
  </h3>
);

/*
 * Live extras: notes ([{ id, content, at }]) and onAddNote(text) -> Promise make Team notes real; busy disables the buttons.
 */
const CandidateDrawer = ({
  card,
  stageId,
  detail,
  onClose,
  onNotProgressing,
  onMove,
  onLink,
  notes,
  onAddNote,
  busy,
}) => {
  const nextStage = NEXT_STAGE[stageId];
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const screening = detail.screening;
  log('render', { card: card.id, stageId, nextStage });

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="lg"
      ariaLabel={card.name}
      showClose={false}
      scrollHint={false}
      initialFocus="dialog"
      className="!bg-[#0b1a0f]/45 !backdrop-blur-none"
      contentClassName="!max-w-[664px] !rounded-[24px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_-6px_rgba(15,15,10,0.1)] max-sm:!rounded-b-none"
    >
      <div className="flex flex-col gap-[18px] p-[32px] max-sm:p-[20px]">
        <div className="flex items-start justify-between gap-[12px]">
          <div className="flex min-w-0 items-center gap-[12px]">
            <span className="flex size-[56px] shrink-0 items-center justify-center rounded-full bg-[#faf4e8] font-sans text-[12px] leading-[20px] font-semibold tracking-[0.1px] text-[#463409]">
              {card.initials}
            </span>
            <div className="flex min-w-0 flex-col gap-[2px]">
              <h2 className="m-0 font-['Bricolage_Grotesque',sans-serif] text-[clamp(22px,2.2vw,26px)] leading-[31px] font-semibold tracking-[-0.52px] text-[#111]">
                {card.name}
              </h2>
              <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                {detail.headline}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label={DRAWER_COPY.close}
            onClick={onClose}
            className="flex size-[40px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#dbded9] bg-white text-[#111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <CloseCrossIcon className="size-[18px]" />
          </button>
        </div>

        {detail.openedFrom ? (
          <span className="inline-flex w-fit items-center gap-[4px] rounded-full bg-[#eaeffb] px-[8px] py-[3px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#244a9f]">
            <MessageBubbleIcon className="size-[12px]" />
            {`Opened from ${detail.openedFrom}`}
          </span>
        ) : null}

        <div className="grid grid-cols-3 gap-[12px] max-sm:grid-cols-1">
          <StatBox
            label={DRAWER_COPY.match}
            value={typeof card.matchPercent === 'number' ? `${card.matchPercent}%` : '—'}
          />
          <StatBox label={DRAWER_COPY.stage} value={STAGE_LABELS[stageId] ?? ''} />
          <StatBox label={DRAWER_COPY.applied} value={detail.appliedAt} />
        </div>

        {screening ? (
          <section className="flex flex-col gap-[8px] rounded-[16px] bg-[#ebf1ec]/50 p-[16px]">
            <p className="m-0 font-sans text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#111]">
              {DRAWER_COPY.screeningLine(screening.met, screening.total, screening.name)}
            </p>
            <ul className="m-0 flex list-none flex-wrap gap-[6px] p-0">
              {screening.rules.map((rule) => (
                <li
                  key={rule}
                  className="inline-flex items-center rounded-full bg-[#e8f2ed] px-[8px] py-[3px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#165d3a]"
                >
                  {rule}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {detail.application ? (
          <>
            <SectionTitle>{DRAWER_COPY.application}</SectionTitle>
            <p className="m-0 font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#111]">
              {detail.application}
            </p>
          </>
        ) : null}
        <div className="flex flex-wrap gap-x-[16px] gap-y-[8px]">
          {detail.links.map((link) => {
            const Icon = LINK_ICONS[link.icon];
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  log('branch: link', { link: link.id });
                  onLink(link.id);
                }}
                className="inline-flex min-h-[24px] cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                <Icon className="size-[16px]" />
                {link.label}
              </button>
            );
          })}
        </div>

        {detail.activity.length ? (
          <>
            <SectionTitle>{DRAWER_COPY.activity}</SectionTitle>
            <ul className="m-0 flex list-none flex-col gap-[18px] p-0">
              {detail.activity.map((entry) => (
                <li key={entry.id} className="flex items-center gap-[8px]">
                  <CheckCircle size={14} className="shrink-0 text-[#387440]" />
                  <span className="min-w-0 flex-1 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#111]">
                    {entry.label}
                  </span>
                  <span className="shrink-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
                    {entry.at}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <label className="flex flex-col gap-[8px]">
          <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
            {DRAWER_COPY.teamNotes}
          </span>
          {notes && notes.length ? (
            <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
              {notes.map((n) => (
                <li
                  key={n.id}
                  className="rounded-[10px] bg-[#f6f6f4] px-[12px] py-[8px] font-sans text-[12px] leading-[20px] text-[#111]"
                >
                  <span className="whitespace-pre-wrap">{n.content}</span>
                  <span className="block text-[#575755]">{n.at}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <textarea
            rows={1}
            {...(onAddNote ? { value: draft, onChange: (e) => setDraft(e.target.value) } : {})}
            placeholder={DRAWER_COPY.notesPlaceholder}
            className="min-h-[60px] w-full resize-none rounded-[10px] border border-solid border-[#dbded9] bg-white px-[16px] py-[12px] font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#111] shadow-[0_3px_0_0_rgba(34,70,38,0.8)] outline-none placeholder:text-[#babab7]"
          />
        </label>
        {onAddNote ? (
          <Button
            variant="tertiary"
            className="!h-[36px] w-fit !py-0"
            disabled={!draft.trim() || saving}
            onClick={() => {
              setSaving(true);
              Promise.resolve(onAddNote(draft.trim()))
                .then(() => setDraft(''))
                .finally(() => setSaving(false));
            }}
          >
            {saving ? 'Saving…' : 'Save note'}
          </Button>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-[10px]">
          <Button
            variant="tertiary"
            className="!h-[40px] !py-0"
            disabled={Boolean(busy)}
            onClick={onNotProgressing}
          >
            {DRAWER_COPY.notProgressing}
          </Button>
          {nextStage ? (
            <Button
              variant="primary"
              size="sm"
              className="!h-[40px] !py-0"
              disabled={Boolean(busy)}
              onClick={() => onMove(nextStage)}
            >
              {DRAWER_COPY.moveTo(STAGE_LABELS[nextStage])}
            </Button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default CandidateDrawer;
