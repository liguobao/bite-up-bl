import { Outlet } from 'react-router-dom';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';

const AppLayout = () => (
  <div className="app-layout">
    <SiteHeader />
    <main className="app-main" role="main">
      <Outlet />
    </main>
    <SiteFooter />
  </div>
);

export default AppLayout;
