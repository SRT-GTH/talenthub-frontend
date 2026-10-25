import { classNames } from '../../../../utils/classNames.js';
import InstitutionDialogActions from './InstitutionDialogActions.jsx';
import InstitutionDialogHeader from './InstitutionDialogHeader.jsx';
import { formatRosterCount } from './rosterFormat.js';
import { Roster20ShieldIcon } from './rosterIcons.jsx';

/*
 * InstitutionUploadReview — "Ready to add 298 students" (Figma 11.2.2h 8744:431402): four stat tiles (176 x 77, r14, p 14/16: 298 Ready to add #ebf1ec / 6 Duplicates skipped #faf4e8 /
 * 5 Need a fix #f9ebea / 3 At another institution #f8f8f4; value 26/31 600, label 12/14 500 #575755), "Needs a fix (5)" with the table (Row · Student · Problem · action, 710 wide,
 * rows 40 high with a #f1f1f1 rule), the shield note about students at another institution, "Back" + "Add 298 students →".
 * "Fix in file" and "Add phone" send the admin back to choose a corrected file (Figma draws no further step) ⚠️ ASSUMPTION.
 * Props: result ({ fileName, ready, duplicates, elsewhere, failing, fixes }), onBack, onAdd, onFix.
 */

const TILES = [
  { id: 'ready', label: 'Ready to add', bg: 'bg-[#ebf1ec]', ink: 'text-[#387440]' },
  { id: 'duplicates', label: 'Duplicates skipped', bg: 'bg-[#faf4e8]', ink: 'text-[#967014]' },
  { id: 'failing', label: 'Need a fix', bg: 'bg-[#f9ebea]', ink: 'text-[#c0392b]' },
  { id: 'elsewhere', label: 'At another institution', bg: 'bg-[#f8f8f4]', ink: 'text-[#1c2a21]' },
];

const InstitutionUploadReview = ({ result, onBack, onAdd, onFix }) => (
  <>
    <InstitutionDialogHeader
      chip="Upload a class list"
      title={`Ready to add ${formatRosterCount(result.ready)} students`}
      text={`${result.fileName} is checked. Review what needs your attention, then add the students. Each student gets an invite to link their GTH profile.`}
    />
    <div className="flex flex-col gap-[14px]">
      <ul className="m-0 grid list-none grid-cols-2 gap-[12px] p-0 md:grid-cols-4">
        {TILES.map((t) => (
          <li
            key={t.id}
            className={classNames(
              'flex flex-col gap-[4px] rounded-[14px] px-[16px] py-[14px]',
              t.bg
            )}
          >
            <span
              className={classNames('font-sans text-[26px] leading-[31px] font-semibold', t.ink)}
            >
              {formatRosterCount(result[t.id])}
            </span>
            <span className="font-sans text-[12px] leading-[14px] font-medium text-[#575755]">
              {t.label}
            </span>
          </li>
        ))}
      </ul>
      {result.fixes.length > 0 ? (
        <>
          <h3 className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
            Needs a fix ({result.fixes.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full max-w-[710px] min-w-[560px] border-collapse font-sans text-[14px] leading-[17px] text-[#1c2a21]">
              <thead>
                <tr className="border-b border-solid border-[#e7e7e7] text-left text-[12px] leading-[14px] font-medium text-[#575755]">
                  <th scope="col" className="w-[60px] pb-[10px] font-medium">
                    Row
                  </th>
                  <th scope="col" className="w-[200px] pb-[10px] font-medium">
                    Student
                  </th>
                  <th scope="col" className="pb-[10px] font-medium">
                    Problem
                  </th>
                  <th scope="col" className="w-[120px] pb-[10px] font-medium">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.fixes.slice(0, 5).map((f) => (
                  <tr
                    key={f.row}
                    className="border-b border-solid border-[#f1f1f1] last:border-b-0"
                  >
                    <td className="py-[11px] font-medium">{f.row}</td>
                    <td className="py-[11px]">{f.student}</td>
                    <td className="py-[11px]">{f.problem}</td>
                    <td className="py-[11px] text-right">
                      <button
                        type="button"
                        onClick={onFix}
                        className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] leading-[16px] font-semibold text-[#387440] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                      >
                        {f.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
      {result.elsewhere > 0 ? (
        <p className="m-0 flex items-start gap-[8px] font-sans text-[13px] leading-[16px] text-[#575755]">
          <Roster20ShieldIcon className="mt-px size-[16px] shrink-0" />
          {result.elsewhere} students are already enrolled at another institution. They need a
          transfer from that school first; we’ve emailed both registrars.
        </p>
      ) : null}
    </div>
    <InstitutionDialogActions
      cancelLabel="Back"
      onCancel={onBack}
      primaryLabel={`Add ${formatRosterCount(result.ready)} students`}
      onPrimary={onAdd}
    />
  </>
);

export default InstitutionUploadReview;
