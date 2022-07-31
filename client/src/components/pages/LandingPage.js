import { HiLightBulb } from 'react-icons/hi';
import { FaScroll } from 'react-icons/fa';
import { MdRecommend } from 'react-icons/md';

import Anna from '../../assets/Anna_1.svg';

const LandingPage = () => {
   return (
      <>
         <div className='container d-flex flex-column flex-lg-row align-items-center justify-content-between mt-5 px-3'>
            <div className='d-flex flex-column align-items-start px-4 order-1 order-lg-0' style={{ width: '65%' }}>
               <div className='d-flex w-100'>
                  <h1 className='text-wrap custom-heading'>
                     Meet Chatbot, <span className='text-primary custom-heading h1'>Anna</span>
                  </h1>
               </div>
               <p>
                  Anna aid senior high school students awareness and recommend various degree programs for college. Are you ready to know what is the
                  recommended degree programs for you?
               </p>
               <button className='btn btn-primary btn-lg rounded-pill mb-5 mb-lg-0'>Get Started</button>
            </div>
            <div className='order-0 order-lg-1 mb-5 mb-lg-0'>
               <img src={Anna} alt='Anna' className='anna-img' />
            </div>
         </div>

         <div className='mt-auto bg-primary'>
            <div className='wave wave-fill-white'>
               <svg data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'>
                  <path
                     d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
                     className='shape-fill'
                  ></path>
               </svg>
            </div>

            <div className='d-flex flex-column flex-md-row align-items-center justify-content-center flex-wrap px-5 pb-2'>
               <div className='d-flex flex-column features p-3'>
                  <MdRecommend className='icon-large mb-1' />
                  <div>
                     <h1 className='h6 m-0'>
                        RIASEC
                        <span className='mx-1' style={{ fontFamily: 'sans-serif' }}>
                           &amp;
                        </span>
                        Strand
                     </h1>
                  </div>
                  <small className='thin-text'>Recommend courses based on RIASEC result and based on strand.</small>
               </div>

               <div className='d-flex flex-column features p-3'>
                  <HiLightBulb className='icon-large mb-1' />
                  <div>
                     <h1 className='h6 m-0'>Provide Awareness</h1>
                     <small className='thin-text'>Awareness on different degree programs in college</small>
                  </div>
               </div>

               <div className='d-flex flex-column features p-3'>
                  <FaScroll className='icon-large mb-1' />
                  <div>
                     <h1 className='h6 m-0'>Cooperative Principle</h1>
                     <small className='thin-text'>Chatbot Anna is guided by the “Cooperative Principle.”</small>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default LandingPage;
