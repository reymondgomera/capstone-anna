import { useState } from 'react';
import { MdHome, MdInfo, MdArticle, MdGroup, MdFeedback, MdMenu } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import '../styles/style.css';

const Navigation = () => {
   const [active, setActive] = useState();

   return (
      <nav className={`navbar navbar-expand d-flex flex-column align-items-start sidebar ${active ? 'active' : 'inactive'}`}>
         <div className={`sidebar-brand cursor m-0 mt-3 px-3 w-100 fw-bold d-flex ${active ? 'justify-content-between' : 'justify-content-center'}`}>
            <span>Anna</span>
            <MdMenu className='icon-medium' onClick={() => setActive(prev => !prev)} />
         </div>
         <ul className='navbar-nav d-flex flex-column mt-5 w-100'>
            <li className='nav-item w-100'>
               <NavLink to='/' className={({ isActive }) => (isActive ? 'sidebar-link active-path' : 'sidebar-link')}>
                  <div className={`d-flex align-items-center ${active ? 'active' : 'justify-content-center inactive'}`}>
                     <MdHome className={`icon-medium ${active ? 'me-3 active' : 'inactive'}`} /> <span>Home</span>
                  </div>
               </NavLink>
               <NavLink to='/about' className={({ isActive }) => (isActive ? 'sidebar-link active-path' : 'sidebar-link')}>
                  <div className={`d-flex align-items-center ${active ? 'active' : 'justify-content-center inactive'}`}>
                     <MdInfo className={`icon-medium ${active ? 'me-3 active' : 'inactive'}`} /> <span>About</span>
                  </div>
               </NavLink>
               <NavLink to='/team' className={({ isActive }) => (isActive ? 'sidebar-link active-path' : 'sidebar-link')}>
                  <div className={`d-flex align-items-center ${active ? 'active' : 'justify-content-center inactive'}`}>
                     <MdGroup className={`icon-medium ${active ? 'me-3 active' : 'inactive'}`} /> <span>The Team</span>
                  </div>
               </NavLink>
               <NavLink to='/terms-condition' className={({ isActive }) => (isActive ? 'sidebar-link active-path' : 'sidebar-link')}>
                  <div className={`d-flex align-items-center ${active ? 'active' : 'justify-content-center inactive'}`}>
                     <MdArticle className={`icon-medium ${active ? 'me-3 active' : 'inactive'}`} /> <span>Terms</span>
                     <span className='mx-1' style={{ fontFamily: 'sans-serif' }}>
                        &amp;
                     </span>
                     <span>Conditions</span>
                  </div>
               </NavLink>
               <NavLink to='/feedback' className={({ isActive }) => (isActive ? 'sidebar-link active-path' : 'sidebar-link')}>
                  <div className={`d-flex align-items-center ${active ? 'active' : 'justify-content-center inactive'}`}>
                     <MdFeedback className={`icon-medium ${active ? 'me-3 active' : 'inactive'}`} />
                     <span>Feedback</span>
                  </div>
               </NavLink>
            </li>
         </ul>
      </nav>
   );
};

export default Navigation;
