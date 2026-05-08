import { Outlet } from 'react-router-dom';
import Navbar from '../components/shared/Navbar.jsx';
import Footer from '../components/shared/Footer.jsx';
import { debug } from '../utils/debug.js';

const log = debug('MainLayout');

const MainLayout = () => {
  log('mount');
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
