import { Link } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';

/* AdminNotFoundPage — unknown /admin/* path (no Figma frame): a plain card inside the real chrome. */
const AdminNotFoundPage = () => {
  const data = useAdminState();
  return (
    <AdminFrame data={data} title="Page not found">
      <section className="rounded-[16px] border border-solid border-[#e5e5e5] bg-white p-[24px]">
        <h1 className="m-0 font-sans text-[20px] leading-[24px] font-semibold text-[#1c2a21]">
          Page not found
        </h1>
        <p className="mt-[8px] mb-0 font-sans text-[14px] leading-[20px] text-[#595959]">
          That admin page does not exist. <Link to="/admin">Back to your home</Link>
        </p>
      </section>
    </AdminFrame>
  );
};

export default AdminNotFoundPage;
