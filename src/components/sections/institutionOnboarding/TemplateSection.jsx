import { Link, useNavigate } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import Captions from '../../ui/Captions.jsx';
import { ArrowRightIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('TemplateSection');

/*
 * TemplateSection — Step 4 of the institution bulk-onboarding wizard.
 * Figma frames: 2977:85777 (main screen).
 *
 * Shows a read-only preview spreadsheet (static display only — not editable)
 * so the institution admin can see how the template looks before proceeding.
 *
 * A Download link lets the user grab the .xlsx file for offline fill-in.
 * The CTA "I have my file ready" continues to the Upload step.
 *
 * Route:   /onboarding/institution/template
 * Layout:  InstitutionOnboardingLayout (right panel hidden for this path)
 *
 * Figma nodes referenced:
 *   3002:39084  headline
 *   3002:39086  subtitle
 *   3003:39103  legend row
 *   3003:39106  title bar
 *   3003:39107  spreadsheet window controls
 *   3010:40860  download link row
 *   3002:39051  CTA button
 *
 * Copy rule: ALL text comes verbatim from Figma MCP — never invented.
 */

// ── Download icon (20×20) ─────────────────────────────────────────────────
const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 3.5v8m0 0L7.5 9M10 11.5L12.5 9M4.5 15v1a1 1 0 001 1h9a1 1 0 001-1v-1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Legend swatch + label ─────────────────────────────────────────────────
const LegendItem = ({ swatchClass, children }) => (
  <span className="inline-flex items-center gap-1.5">
    <span
      className={`inline-block shrink-0 rounded-[2px] size-[14px] ${swatchClass}`}
      aria-hidden="true"
    />
    <span
      className="font-sans font-normal text-[#959592]"
      style={{ fontSize: '12px', letterSpacing: '0.2px' }}
    >
      {children}
    </span>
  </span>
);

// ── Column definitions (Figma: header row cells) ──────────────────────────
// type: 'required' | 'optional' | 'minors'
// star: renders ★ in #eedeb8 next to label
// subTag / subTagType: small overlay badge ('white' = semi-transparent white bg,
//                      'amber' = semi-transparent amber bg for Minors cols)
const COLUMNS = [
  { key: 'firstName', label: 'First Name', type: 'required', star: true },
  { key: 'lastName', label: 'Last Name', type: 'required', star: true },
  { key: 'dob', label: 'Date of Birth', type: 'required', star: true },
  { key: 'gender', label: 'Gender', type: 'required', star: true },
  {
    key: 'email',
    label: 'Email',
    type: 'required',
    star: true,
    subTag: 'or Phone',
    subTagType: 'white',
  },
  {
    key: 'phone',
    label: 'Phone',
    type: 'optional',
    star: false,
    subTag: 'or Email',
    subTagType: 'white',
  },
  { key: 'level', label: 'Level', type: 'required', star: true },
  { key: 'grade', label: 'Grade', type: 'required', star: true },
  {
    key: 'parentFirst',
    label: 'Parent First Name',
    type: 'minors',
    star: false,
    subTag: 'Minors',
    subTagType: 'amber',
  },
  {
    key: 'parentLast',
    label: 'Parent Last Name',
    type: 'minors',
    star: false,
    subTag: 'Minors',
    subTagType: 'amber',
  },
  {
    key: 'parentPhone',
    label: 'Parent Email/Phone',
    type: 'minors',
    star: false,
    subTag: 'Minors',
    subTagType: 'amber',
  },
  {
    key: 'relation',
    label: 'Relationship',
    type: 'optional',
    star: false,
    subTag: 'Optional',
    subTagType: 'white',
  },
];

// Column widths (px)
const COL_W = {
  firstName: 100,
  lastName: 100,
  dob: 96,
  gender: 72,
  email: 148,
  phone: 120,
  level: 84,
  grade: 72,
  parentFirst: 152,
  parentLast: 150,
  parentPhone: 170,
  relation: 131,
};

const TOTAL_DATA_W = Object.values(COL_W).reduce((a, b) => a + b, 0); // 1395
const ROW_NUM_W = 36;
const TABLE_W = ROW_NUM_W + TOTAL_DATA_W;

// Cell background + border per column type
const CELL_CLS = {
  required: 'bg-[#ebf1ec] border-[#c1d4c4]',
  optional: 'bg-[#f9f9f9] border-[#d0d0d0]',
  minors: 'bg-[#fff8e6] border-[rgba(0,0,0,0.1)]',
};

// Sample data rows — verbatim from Figma, hint-only cells set to ''
const INITIAL_ROWS = [
  {
    firstName: 'Kofi',
    lastName: 'Mensah',
    dob: '12/03/2001',
    gender: 'Male',
    email: 'k.mensah@gmail.com',
    phone: '',
    level: 'University',
    grade: 'Level 200',
    parentFirst: '',
    parentLast: '',
    parentPhone: '',
    relation: '',
  },
  {
    firstName: 'Ama',
    lastName: 'Boateng',
    dob: '28/07/2000',
    gender: 'Female',
    email: '',
    phone: '0244567890',
    level: 'SHS',
    grade: 'SHS 3',
    parentFirst: '',
    parentLast: '',
    parentPhone: '',
    relation: '',
  },
  {
    firstName: 'Kwame',
    lastName: 'Asante',
    dob: '14/09/2009',
    gender: 'Male',
    email: 'k.asante@student.edu',
    phone: '',
    level: 'JHS',
    grade: 'JHS 2',
    parentFirst: 'Akosua',
    parentLast: 'Asante',
    parentPhone: '0205551234',
    relation: 'Mother',
  },
  {
    firstName: 'Adwoa',
    lastName: 'Frimpong',
    dob: '02/11/2008',
    gender: 'Female',
    email: 'a.frimpong@jhs.edu.gh',
    phone: '',
    level: 'JHS',
    grade: 'JHS 3',
    parentFirst: '',
    parentLast: '',
    parentPhone: '',
    relation: '',
  },
  {
    firstName: 'Yaw',
    lastName: 'Darko',
    dob: '19/04/1999',
    gender: 'Male',
    email: 'yaw.darko@ug.edu.gh',
    phone: '0277123456',
    level: 'University',
    grade: 'Level 300',
    parentFirst: '',
    parentLast: '',
    parentPhone: '',
    relation: '',
  },
  // two blank rows so the sheet looks ready for input
  Object.fromEntries(COLUMNS.map((c) => [c.key, ''])),
  Object.fromEntries(COLUMNS.map((c) => [c.key, ''])),
];

// Tips (verbatim from Figma)
const TIPS = [
  { label: 'Date format:', value: 'DD/MM/YYYY', suffix: '— e.g. 14/09/2009' },
  { label: 'Level values:', value: 'JHS, SHS, University, Technical', suffix: '' },
  { label: 'Max', value: '10,000 rows', suffix: 'per batch · CSV or Excel accepted' },
];

// ── HeaderCell sub-component ──────────────────────────────────────────────
const HeaderCell = ({ col }) => (
  <th
    style={{ width: COL_W[col.key], minWidth: COL_W[col.key] }}
    className="relative h-[38px] bg-[#387440] border border-[rgba(255,255,255,0.2)] p-0 font-normal"
  >
    <div className="flex flex-wrap items-center gap-x-[3px] gap-y-0 px-[7.5px] pt-[10px]">
      <span className="font-sans font-semibold text-[10px] text-white leading-none whitespace-nowrap tracking-[0.2px]">
        {col.label}
      </span>
      {col.star && (
        <span className="font-bold text-[#eedeb8] text-[11px] leading-none" aria-hidden="true">
          ★
        </span>
      )}
      {col.subTag && (
        <span
          className={[
            'inline-flex items-center rounded-[2px] px-[4px] h-[13px]',
            'font-sans font-normal text-[9px] text-white leading-none whitespace-nowrap',
            col.subTagType === 'amber' ? 'bg-[rgba(200,149,26,0.3)]' : 'bg-[rgba(255,255,255,0.2)]',
          ].join(' ')}
        >
          {col.subTag}
        </span>
      )}
    </div>
    {/* Column resize handle — decorative */}
    <div
      className="absolute right-[-0.5px] top-[3.5px] bottom-[3.5px] w-[3px] rounded-[1px] bg-[rgba(255,255,255,0.3)]"
      aria-hidden="true"
    />
  </th>
);

// ── Read-only DataCell ────────────────────────────────────────────────────
const ReadCell = ({ colType, value }) => (
  <td className={`h-[23px] border ${CELL_CLS[colType] ?? CELL_CLS.required} p-0`}>
    <span className="block px-[7.5px] font-sans text-[12px] leading-[22px] text-[#222] truncate">
      {value}
    </span>
  </td>
);

// ── Main component ────────────────────────────────────────────────────────
const TemplateSection = () => {
  const navigate = useNavigate();

  log('mount');
  log('render', { rowCount: INITIAL_ROWS.length });

  // ── CTA ───────────────────────────────────────────────────────────────
  const handleContinue = () => {
    log('CTA clicked — navigating to upload step');
    navigate('/onboarding/institution/upload');
  };

  return (
    <div className="flex flex-1 items-start justify-center px-4 py-10 md:py-16 lg:px-8">
      <div className="flex w-full max-w-[897px] flex-col items-center gap-6">
        {/* ── Step badge ── */}
        <Captions items={[{ index: '04', label: 'Bulk Upload' }]} currentIndex={0} />

        {/* ── Headline (Figma: 3002:39084) ── */}
        <h1
          className="font-display font-normal text-center text-black"
          style={{
            fontSize: 'clamp(2rem, 4.4vw, 4rem)',
            lineHeight: 1.094,
            letterSpacing: '-0.64px',
          }}
        >
          Start with the <span className="italic text-brand-green">template.</span>
        </h1>

        {/* ── Subtitle (Figma: 3002:39086) — verbatim ── */}
        <p
          className="font-sans font-normal text-center text-[#737373]"
          style={{
            fontSize: 'clamp(0.875rem, 1vw, 1rem)',
            lineHeight: '24px',
            letterSpacing: '0.2px',
            maxWidth: '520px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {`Download the official GTH template, fill in students offline, then upload it. Don't create your own  column names must match.`}
        </p>

        {/* ── Wavy divider ── */}
        <WavyDivider />

        {/* ── Legend ── */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          role="list"
          aria-label="Column colour legend"
        >
          <LegendItem swatchClass="bg-[#ebf1ec] border border-[#c1d4c4]">
            Required column
          </LegendItem>
          <LegendItem swatchClass="bg-[#f9f9f9] border border-[#d0d0d0]">
            Optional column
          </LegendItem>
          <LegendItem swatchClass="bg-[#fff8e6] border border-[rgba(0,0,0,0.1)]">
            Minors only
          </LegendItem>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="font-bold text-[#c8951a]"
              style={{ fontSize: '14px', lineHeight: 1 }}
              aria-hidden="true"
            >
              ★
            </span>
            <span
              className="font-sans font-normal text-[#959592]"
              style={{ fontSize: '12px', letterSpacing: '0.2px' }}
            >
              Must fill at least one
            </span>
          </span>
        </div>

        {/* ── Spreadsheet ───────────────────────────────────────────── */}
        <div
          className="w-full overflow-hidden rounded-[10px] border border-[#d0d0d0]"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}
          aria-label="GTH student upload template — preview"
        >
          {/* Title bar */}
          <div className="relative flex h-[30px] items-center bg-[#387440] px-3">
            <div className="mr-3 flex items-center gap-[5px]" aria-hidden="true">
              <span className="inline-block size-[10px] rounded-full bg-white/30" />
              <span className="inline-block size-[10px] rounded-full bg-white/30" />
              <span className="inline-block size-[10px] rounded-full bg-white/30" />
            </div>
            <span className="font-sans font-semibold text-[12px] text-white tracking-[0.1px] leading-none">
              GTH_Student_Upload_Template.xlsx — Excel
            </span>
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-4 font-sans text-[12px] select-none"
              style={{ color: 'rgba(255,255,255,0.8)' }}
              aria-hidden="true"
            >
              <span>─</span>
              <span>□</span>
              <span>✕</span>
            </div>
          </div>

          {/* Ribbon */}
          <div className="flex h-[32px] items-end bg-white border-b border-[#d0d0d0] px-3 gap-5">
            <span className="pb-1.5 font-sans font-bold text-[12px] text-[#217346] tracking-[0.2px]">
              Home
            </span>
            {['Insert', 'Data', 'Review'].map((tab) => (
              <span
                key={tab}
                className="pb-1.5 font-sans font-normal text-[10px] text-[#444] tracking-[0.2px]"
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Formula bar */}
          <div className="flex h-[26px] items-center bg-white border-b border-[#d0d0d0]">
            <div className="flex h-full w-[72px] shrink-0 items-center border-r-2 border-[#d0d0d0] bg-[#f3f3f3] px-2">
              <span className="font-sans font-normal text-[11px] text-[#222]">A1</span>
            </div>
            <div className="flex h-full w-[28px] shrink-0 items-center justify-center border-r border-[#d0d0d0]">
              <span className="font-sans italic text-[11px] text-[#444]">fx</span>
            </div>
            <span className="ml-3 font-sans font-medium text-[10px] text-[#222] tracking-[0.2px]">
              First Name
            </span>
          </div>

          {/* Scrollable grid */}
          <div className="overflow-x-auto bg-white">
            <table
              className="border-collapse table-fixed"
              style={{ width: TABLE_W, minWidth: TABLE_W }}
              aria-label="Student data preview table"
            >
              <colgroup>
                <col style={{ width: ROW_NUM_W, minWidth: ROW_NUM_W }} />
                {COLUMNS.map((col) => (
                  <col key={col.key} style={{ width: COL_W[col.key], minWidth: COL_W[col.key] }} />
                ))}
              </colgroup>

              <thead>
                <tr>
                  <th className="h-[38px] bg-[#d0d0d0] border border-[#aaa] p-0 font-normal" />
                  {COLUMNS.map((col) => (
                    <HeaderCell key={col.key} col={col} />
                  ))}
                </tr>
              </thead>

              <tbody>
                {INITIAL_ROWS.map((row, i) => {
                  log('render row', { rowNum: i + 2 });
                  return (
                    <tr key={i}>
                      {/* Row number */}
                      <td className="h-[23px] border border-[#d0d0d0] bg-[#f3f3f3] p-0 text-center">
                        <span className="font-sans font-normal text-[10px] text-[#666]">
                          {i + 2}
                        </span>
                      </td>
                      {/* Read-only data cells */}
                      {COLUMNS.map((col) => (
                        <ReadCell key={col.key} colType={col.type} value={row[col.key]} />
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Sheet tabs */}
          <div className="flex h-[31px] items-end bg-[#f3f3f3] border-t border-[#c0c0c0] px-2">
            <div className="flex h-[22px] items-center rounded-tl-[2px] rounded-tr-[2px] border-l border-r border-t border-[#c0c0c0] bg-white px-3 -mb-px">
              <span className="font-sans font-bold text-[11px] text-[#217346]">Students▸</span>
            </div>
            {['Instructions', 'Valid Values'].map((tab) => (
              <div key={tab} className="flex h-[22px] items-center px-3 opacity-70">
                <span className="font-sans font-normal text-[11px] text-[#444]">{tab}</span>
              </div>
            ))}
          </div>

          {/* Tips row */}
          <div className="flex flex-wrap items-center justify-around gap-x-2 gap-y-1.5 border-t border-[#e0e0e0] bg-[#f9f9f9] px-4 py-2">
            {TIPS.map((tip) => (
              <span key={tip.label} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-flex size-[11px] shrink-0 items-center justify-center rounded-full border border-[#387440] text-[#387440]"
                  aria-hidden="true"
                >
                  <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                    <path
                      d="M3.5 2.5v2M3.5 5.3h.01"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span
                  className="font-sans text-[11px] text-[#70706e]"
                  style={{ letterSpacing: '0.1px' }}
                >
                  <span className="font-normal">{tip.label} </span>
                  <strong className="font-bold">{tip.value}</strong>
                  {tip.suffix ? ` ${tip.suffix}` : ''}
                </span>
              </span>
            ))}
          </div>
        </div>
        {/* ── end spreadsheet ─────────────────────────────────────────── */}

        {/* ── Download link (Figma: 3010:40860) ── */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            log('download link clicked');
          }}
          className="flex w-full items-center justify-center gap-2 rounded-[8px] border-b border-[#387440] px-[34px] py-4 text-[#387440] transition-opacity duration-100 hover:opacity-80"
          style={{ boxShadow: '0px 2px 0px 0px rgba(17,17,17,0.2)' }}
          aria-label="Download GTH_Student_Upload_Template.xlsx"
        >
          <DownloadIcon />
          <span className="font-sans font-semibold text-[12px] tracking-[0.1px] leading-[24px]">
            Download GTH_Student_Upload_Template.xlsx
          </span>
          <ArrowRightIcon />
        </a>

        {/* ── CTA (Figma: 3002:39051) ── */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          rightIcon={<ArrowRightIcon />}
          onClick={handleContinue}
          className="w-full"
        >
          I have my file ready
        </Button>

        {/* ── Already-have-account footer link ── */}
        <div className="flex items-center justify-center gap-2 text-[14px] leading-6">
          <span className="text-content-helper" style={{ letterSpacing: '0.2px' }}>
            Already Have an account?
          </span>
          <Link
            to="/login"
            className="font-semibold text-brand-green underline-offset-2 hover:underline"
            style={{ letterSpacing: '0.1px' }}
          >
            Log in Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplateSection;
