import { Outlet } from 'react-router-dom';
import AdminNavigation from '../AdminNavigation';

const Admin = () => {
   return (
      <div className='d-flex h-100 w-100'>
         <AdminNavigation />
         {/* <Outlet /> used to render the child route element */}
         <Outlet />
      </div>
   );
};

export default Admin;
