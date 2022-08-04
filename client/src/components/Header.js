import '../styles/style.css';
import anna from '../assets/Anna_1.svg';

const Header = ({ navlinks }) => {
   return (
      <nav className='navbar navbar-expand-lg bg-white fixed-top'>
         <div className='container'>
            <a className='navbar-brand d-flex align-items-end' href='/#home'>
               <img className='anna-logo' src={anna} alt='anna-logo' />
               <h1 className='h3 ms-3 custom-heading text-primary'>Anna</h1>
            </a>
            <button
               className='navbar-toggler'
               type='button'
               data-bs-toggle='collapse'
               data-bs-target='#navbarSupportedContent'
               aria-controls='navbarSupportedContent'
               aria-expanded='false'
               aria-label='Toggle navigation'
            >
               <span className='navbar-toggler-icon'></span>
            </button>
            <div className='collapse navbar-collapse' id='navbarSupportedContent'>
               <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
                  {navlinks.length > 0 &&
                     navlinks.map((link, i) => (
                        <li key={i} className='nav-item'>
                           <a className='nav-link' href={link.link}>
                              {link.text}
                           </a>
                        </li>
                     ))}
               </ul>
            </div>
         </div>
      </nav>
   );
};

export default Header;
