import { useContext } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import { MdAccountCircle, MdMenu } from 'react-icons/md';

const ContentNavbar = () => {
   const { setIsAuthenticated, setIsSidebarActive } = useContext(UserContext);

   const signout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      toast.success('User signout successfully!');
   };

   return (
      <div className='d-flex pt-2 align-items-center'>
         <button className='btn btn-primary p-1 me-auto' onClick={() => setIsSidebarActive(prev => !prev)}>
            <MdMenu className='icon-small' />
         </button>
         <div>
            <MdAccountCircle className='text-primary me-3' style={{ fontSize: '45px' }} />
            <span className='text-danger fw-bold cursor' onClick={signout}>
               Sign out
            </span>
         </div>
      </div>
   );
};

export default ContentNavbar;
