import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { RecordsIconArrowr } from '../records/recordsIcons.jsx';
import CredentialModal from './CredentialModal.jsx';

const log = debug('CredentialTableDialog');

/*
 * CredentialTableDialog — the two confirmation dialogs built on the same 820 card with a small table and a note line:
 *   corrected copy "Fix a typo on Kofi’s certificate" (Figma 11.2.4g 8744:436331, modal 8744:436529): table Field · Was · Now, shield note, "Issue corrected copy →"
 *   bulk issue "Issue completion certificates to Form 3" (11.2.4h 8744:436854, modal 8744:437052): three stat tiles (247 / 231 / 16), table Setting · Value, info note, "Issue 231 certificates →"
 * Props: chip, heading, description, stats [{ id, value, label, tone }], head [col, col], rows [{ id, a, b, c? }], note, noteIcon (node), confirmLabel, onConfirm, onClose.
 */
const TONES = {
  plain: { box: 'bg-[#f8f8f4]', value: 'text-[#1c2a21]' },
  green: { box: 'bg-[#ebf1ec]', value: 'text-[#387440]' },
  amber: { box: 'bg-[#faf4e8]', value: 'text-[#967014]' },
};

const CredentialTableDialog = ({
  chip,
  heading,
  description,
  stats,
  head,
  rows,
  note,
  noteIcon,
  confirmLabel,
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    log('open', chip);
  }, [chip]);

  const three = head.length === 3;
  const cols = three
    ? 'grid-cols-[minmax(0,5fr)_minmax(0,7fr)_minmax(0,8fr)]'
    : 'grid-cols-[minmax(0,11fr)_minmax(0,24fr)]';

  return (
    <CredentialModal
      label={chip}
      chip={chip}
      heading={heading}
      description={description}
      descriptionId="credential-table-desc"
      onClose={onClose}
    >
      <div className="flex flex-col gap-[14px]">
        {stats ? (
          <ul className="m-0 grid list-none grid-cols-1 gap-[12px] p-0 sm:grid-cols-3">
            {stats.map((s) => (
              <li
                key={s.id}
                className={`flex flex-col gap-[4px] rounded-[14px] px-[16px] py-[14px] ${TONES[s.tone].box}`}
              >
                <span className={`text-[26px] leading-[31px] font-semibold ${TONES[s.tone].value}`}>
                  {s.value}
                </span>
                <span className="text-[12px] leading-[14px] font-medium text-[#575755]">
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="max-w-[700px] overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left">
            <thead>
              <tr
                className={`grid ${cols} gap-x-[8px] border-0 border-b border-solid border-[#e7e7e7] pb-[10px]`}
              >
                {head.map((h) => (
                  <th key={h} className="text-[12px] leading-[14px] font-medium text-[#575755]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.id}
                  className={`grid ${cols} gap-x-[8px] py-[11px] text-[14px] leading-[17px] text-[#1c2a21] ${
                    i < rows.length - 1
                      ? 'border-0 border-b border-solid border-[#f1f1f1]'
                      : 'border-0'
                  }`}
                >
                  <th scope="row" className="text-left font-medium">
                    {r.a}
                  </th>
                  <td className="m-0 min-w-0 break-words">{r.b}</td>
                  {three ? <td className="m-0 min-w-0 break-words">{r.c}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="m-0 flex items-start gap-[8px] text-[13px] leading-[16px] text-[#575755]">
          <span className="mt-0 size-[16px] shrink-0">{noteIcon}</span>
          {note}
        </p>
      </div>
      <div className="flex flex-wrap justify-end gap-[12px] pt-[8px]">
        <Button variant="tertiary-subtle" size="lg" className="!py-[14px]" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          data-autofocus=""
          rightIcon={<RecordsIconArrowr className="size-[20px]" />}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </CredentialModal>
  );
};

export default CredentialTableDialog;
