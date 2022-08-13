import { MdHome, MdMessage, MdFeedback } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

const AdminNavigation = () => {
   return (
      <nav className='sidebar'>
         <ul className='sidebar-links'>
            <li>
               <NavLink to='dashboard' className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
                  <MdHome className='icon-medium me-3' />
                  <span>Dashboard</span>
               </NavLink>
            </li>
            <li>
               <NavLink to='feedback' className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
                  <MdFeedback className='icon-medium me-3' />
                  <span>Feedback</span>
               </NavLink>
            </li>
            <li>
               <NavLink to='conversation' className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
                  <MdMessage className='icon-medium me-3' />
                  <span>Conversation</span>
               </NavLink>
            </li>
         </ul>
      </nav>
   );
};

export default AdminNavigation;
