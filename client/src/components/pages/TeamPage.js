import reymond from '../../assets/Reymond.svg';
import ryan from '../../assets/Ryan.svg';
import john from '../../assets/John.svg';

const TeamPage = () => {
   return (
      <>
         <div className='bg-primary h-100'>
            <h1 className='custom-heading text-center my-5'>THE TEAM</h1>
            <div className='d-flex flex-column flex-md-row justify-content-center align-items-center flex-wrap'>
               <div className='d-flex flex-column align-items-center w-25 mx-5 my-2'>
                  <img className='mb-3' src={reymond} alt='reymond' width='145' />
                  <span className='h6 text-break text-center'>Rey Mond Gomera</span>
                  <span className='h6 text-break text-center'>rgomera_190000000465@uic.edu.ph</span>
                  <h2 className='h5 text-center'>UI/UX DESIGNER | SUPPORT PROGRAMMER | QA | TECHNICAL WRITER</h2>
               </div>
               <div className='d-flex flex-column align-items-center w-25 mx-5 my-2'>
                  <img className='mb-3' src={john} alt='reymond' width='145' />
                  <span className='h6 text-break text-center'>John Michael Amto</span>
                  <span className='h6 text-break text-center'>jamto_190000000229@uic.edu.ph</span>
                  <h2 className='h5 text-center'>PROGRAMMER | TECHNICAL WRITER</h2>
               </div>
               <div className='d-flex flex-column align-items-center w-25 mx-5 my-2'>
                  <img className='mb-3' src={ryan} alt='reymond' width='145' />
                  <span className='h6 text-break text-center'>Ryan Christian Hibaya</span>
                  <span className='h6 text-break text-center'>rhibaya_190000001021@uic.edu.ph</span>
                  <h2 className='h5 text-center'>PROJECT MANAGER | TECHNICAL WRITER | TESTER</h2>
               </div>
            </div>
         </div>
         <div className='mt-auto'>
            <div className='wave wave-fill-primary'>
               <svg data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'>
                  <path
                     d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
                     className='shape-fill'
                  ></path>
               </svg>
            </div>
         </div>
      </>
   );
};

export default TeamPage;
