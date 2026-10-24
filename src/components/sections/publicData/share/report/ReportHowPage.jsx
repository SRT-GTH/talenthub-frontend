import arrow from '../../../../../assets/public-data/share/report-step-arrow.svg';
import { classNames } from '../../../../../utils/classNames.js';
import { formatCount } from '../../publicDataFormat.js';
import { REPORT_FOOTER, REPORT_HOW } from '../data/shareData.js';
import ReportFooter from './ReportFooter.jsx';
import ReportPageHeader from './ReportPageHeader.jsx';
import ReportSheet from './ReportSheet.jsx';
import { at } from './reportLayout.js';

/*
 * ReportHowPage — report page 6 "Skills that are verified get used" (Figma 8898:483727): four steps (Learn · Verify · Get matched · Earn),
 * each a 196px ring around a core disc with a gold dot, a big number and a caption, joined by arrows; below, the "What it means for policy"
 * strip with three recommendations. The last step is filled green (white text). Props: pages (total).
 */

const D = REPORT_HOW;

const ReportHowPage = ({ pages }) => (
  <ReportSheet page={6} pages={pages}>
    <ReportPageHeader eyebrow={D.eyebrow} title={D.title} sub={D.sub} width={640} />
    <ol className="m-0 list-none p-0">
      {D.steps.map((step, index) => (
        <li key={step.n}>
          <span
            aria-hidden="true"
            className="rounded-full border-[1.2px] border-solid border-[#387440]"
            style={at(step.x, 200, 196, 196)}
          />
          <span
            aria-hidden="true"
            className="rounded-full"
            style={{
              ...at(step.x + 22, 222, 152, 152),
              backgroundColor: step.filled ? '#387440' : '#ebf1ec',
            }}
          />
          <span
            aria-hidden="true"
            className="rounded-full bg-[#c8951a]"
            style={at(step.x + 93, 195, 10, 10)}
          />
          <p
            className={classNames(
              'm-0 text-center font-heading text-[14px] leading-[17px] font-light',
              step.filled ? 'text-white' : 'text-[#387440]'
            )}
            style={at(step.x, 270, 196)}
          >
            {step.n}
          </p>
          <h2
            className={classNames(
              'm-0 text-center font-heading text-[23px] leading-[28px] font-semibold',
              step.filled ? 'text-white' : 'text-[#1c2a21]'
            )}
            style={at(step.x, 290, 196)}
          >
            {step.name}
          </h2>
          <p
            className="m-0 text-center font-heading text-[30px] leading-[36px] font-semibold tracking-[-0.3px] text-[#387440]"
            style={at(step.x, 422, 196)}
          >
            {typeof step.value === 'number' ? formatCount(step.value) : step.value}
          </p>
          <p
            className="m-0 text-center font-sans text-[11.5px] leading-[16px] text-[#575755]"
            style={at(step.x + 18, 460, 160)}
          >
            {step.text}
          </p>
          {index < D.steps.length - 1 ? (
            <>
              <span
                aria-hidden="true"
                className="bg-[#c1d4c4]"
                style={at(step.x + 202, 297, 22, 2)}
              />
              <img
                src={arrow}
                alt=""
                width="11"
                height="14"
                style={at(step.x + 209, 291, 11, 14)}
              />
            </>
          ) : null}
        </li>
      ))}
    </ol>
    <div className="rounded-[18px] bg-[#f8f8f4]" style={at(48, 600, 1027, 128)} />
    <p
      className="m-0 font-sans text-[10px] leading-[12px] font-bold tracking-[0.8px] text-[#387440] uppercase"
      style={at(72, 620)}
    >
      {D.policyEyebrow}
    </p>
    {D.policies.map((policy) => (
      <div key={policy.title}>
        <h3
          className="m-0 font-sans text-[12.5px] leading-[15px] font-semibold"
          style={at(policy.x, 644, 300)}
        >
          {policy.title}
        </h3>
        <p
          className="m-0 font-sans text-[11px] leading-[16px] text-[#575755]"
          style={at(policy.x, 664, 300)}
        >
          {policy.text}
        </p>
      </div>
    ))}
    <ReportFooter text={REPORT_FOOTER} page="06" />
  </ReportSheet>
);

export default ReportHowPage;
