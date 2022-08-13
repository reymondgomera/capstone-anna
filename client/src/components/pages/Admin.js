import { Outlet } from 'react-router-dom';
import AdminNavigation from '../AdminNavigation';

const Admin = () => {
   return (
      <div className='d-flex'>
         <AdminNavigation />
         {/* <Outlet /> used to render the child route element */}
         <Outlet />
      </div>
   );
};

export default Admin;
