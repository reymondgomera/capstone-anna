import React from 'react';
import pageNotFound from '../../assets/page-not-found.svg';
import '../../styles/style.css';

const PageNotFound = () => {
   return (
      <div className='page-not-found h-100 container p-2 d-flex flex-column justify-content-center align-items-center'>
         <div className='text-center'>
            <h1 className='m-0 custom-heading' style={{ fontSize: '7rem' }}>
               404
            </h1>
            <h2 className='h3 custom-heading'>Page Not Found</h2>
         </div>
         <img src={pageNotFound} alt='pageNotFound' style={{ width: '45%' }} />
      </div>
   );
};

export default PageNotFound;
