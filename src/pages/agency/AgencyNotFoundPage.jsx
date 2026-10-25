import { Link } from 'react-router-dom';
import AgencyFrame from '../../components/sections/agency/AgencyFrame.jsx';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';

/* AgencyNotFoundPage — unknown /agency/* path. ⚠️ ASSUMPTION: Figma draws no agency 404; this is the plain message inside the chrome. */
const AgencyNotFoundPage = () => {
  const data = useAgencyState();
  return (
    <AgencyFrame data={data} title="Page not found">
      <section className="rounded-[16px] border border-solid border-[#e5e5e5] bg-white p-[24px]">
        <h1 className="m-0 font-sans text-[20px] leading-[24px] font-semibold text-[#1c2a21]">
          Page not found
        </h1>
        <p className="mt-[8px] mb-[16px] font-sans text-[14px] leading-[20px] text-[#595959]">
          We could not find that page.
        </p>
        <Link
          to="/agency"
          className="inline-flex min-h-[24px] items-center font-sans text-[14px] leading-[20px] font-semibold text-[#387440] underline"
        >
          Back to Home
        </Link>
      </section>
    </AgencyFrame>
  );
};

export default AgencyNotFoundPage;
