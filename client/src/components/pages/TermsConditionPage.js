import React from 'react';

const TermsConditionPage = () => {
   return (
      <div className='px-5 pb-5 h-100'>
         <h1 className='my-5 custom-heading text-center'>TERMS AND CONDITIONS</h1>

         <div className='mb-4'>
            <p>
               You agree to be bound by these terms and conditions: Your responses to the chatbot will be recorded and analyzed. You agree that the
               information provided by you in this study: Include personal identifiable information such as contact details (i.e. name, email
               address), demographic information (i.e. age, gender)
            </p>
         </div>
         <div>
            <div className='mb-4'>
               <h2 className='h5 fw-bold text-primary mb-1'>TITLE OF STUDY:</h2>
               <p>ANNA: A Web-based Chatbot for Career Planning following Cooperative Principle</p>
            </div>
            <div className='mb-4'>
               <h2 className='h5 fw-bold text-primary mb-1'>RESEARCHERS:</h2>
               <ul className='list-group list-group-flush'>
                  <li className='list-group-item'>
                     <div>Rey Mond Gomera</div>
                     <div>rgomera_190000000465@uic.edu.ph</div>
                  </li>
                  <li className='list-group-item'>
                     <div>John Michael Amto</div>
                     <div>jamto_190000000229@uic.edu.ph</div>
                  </li>
                  <li className='list-group-item'>
                     <div>Ryan Christian Hibaya</div>
                     <div>rhibaya_190000001021@uic.edu.ph</div>
                  </li>
               </ul>
            </div>
         </div>
         <div>
            <h2 className='h5 fw-bold text-primary mb-1'>CONFIDENTIALITY:</h2>
            <p>
               Any identifiable information obtained in connection with this study will remain confidential, except if necessary, to protect your
               rights or welfare. RA 10173 or the Data Privacy Act protects individuals from unauthorized processing of personal information. The
               researchers will adhere to this law in order to protect the data privacy and confidentiality of all the respondents. This certificate
               means that the researcher can resist the release of information about your participation to people who are not connected with the
               study. When the research results are published or discussed in conferences, no identifiable information will be used.
            </p>
         </div>
         <div>
            <h2 className='h5 fw-bold text-primary mb-1'>VOLUNTARY PARTICIPATION :</h2>
            <p>
               Your participation in this study is entirely voluntary and you may withdraw at any time by simply abandoning the website. If you choose
               to participate in this research, you will be required to check the box below. Following that, you have the option to withdraw at any
               moment.
            </p>
         </div>
      </div>
   );
};

export default TermsConditionPage;
