import { useContext } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import { MdAccountCircle } from 'react-icons/md';

const ContentNavbar = () => {
   const { setIsAuthenticated } = useContext(UserContext);

   const signout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      toast.success('User signout successfully!');
   };

   return (
      <div className='d-flex justify-content-end p-3 align-items-center'>
         <MdAccountCircle className='text-primary me-3' style={{ fontSize: '45px' }} />
         <span className='text-danger fw-bold cursor' onClick={signout}>
            Sign out
         </span>
      </div>
   );
};

export default ContentNavbar;
