import { MdHome, MdMessage, MdFeedback, MdVideoLibrary, MdClass } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import useWindowDimensions from '../hooks/useWindowDimensions';
import '../styles/style.css';
import { useEffect } from 'react';

const AdminNavigation = () => {
   const { isSidebarActive, setIsSidebarActive } = useContext(UserContext);
   const { width } = useWindowDimensions();

   useEffect(() => {
      if (width < 768) setIsSidebarActive(true);
   }, [width]);

   return (
      <nav className={`sidebar ${isSidebarActive ? 'active' : ''}`}>
         <ul className='sidebar-links'>
            <li>
               <NavLink to='dashboard' className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
                  <MdHome className='icon-small me-2' />
                  {!isSidebarActive && <span>Dashboard</span>}
               </NavLink>
            </li>
            <li>
               <NavLink to='feedback' className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
                  <MdFeedback className='icon-small me-2' />
                  {!isSidebarActive && <span>Feedback</span>}
               </NavLink>
            </li>
            <li>
               <NavLink to='conversation' className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
                  <MdMessage className='icon-small me-2' />
                  {!isSidebarActive && <span>Conversation</span>}
               </NavLink>
            </li>
            {/* <li>
               <NavLink to='course' className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
                  <MdClass className='icon-small me-2' />
                  {!isSidebarActive && <span>Degree Program</span>}
               </NavLink>
            </li> */}
            {/* <li>
               <NavLink to='video-material' className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
                  <MdVideoLibrary className='icon-small me-2' />
                  {!isSidebarActive && <span>Video Material</span>}
               </NavLink>
            </li> */}
         </ul>
      </nav>
   );
};

export default AdminNavigation;
