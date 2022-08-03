import React from 'react';

const TermsConditionPage = () => {
   return (
      <div className='px-5 pb-5 h-100'>
         <h1 className='my-5 custom-heading text-center'>TERMS AND CONDITIONS</h1>

         <div className='mb-4'>
            <p>
               As you converse with Anna, you are to agree to bounded by these terms and conditions: Your responses to Anna will be recorded and be
               used for analysis. You agree that the information you provided in this study will include your basic information (Name, Age, Sex) and
               senior high school strand for these information will be necessary for identification and for the recommendation of degree programs.
            </p>
         </div>
         <div>
            <div className='mb-4'>
               <h2 className='h5 custom-heading text-primary mb-1'>TITLE OF STUDY:</h2>
               <p>ANNA: A Web-based Chatbot for Career Planning following Cooperative Principle</p>
            </div>
            <div className='mb-4'>
               <h2 className='h5 custom-heading text-primary mb-1'>RESEARCHERS:</h2>
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
            <h2 className='h5 custom-heading text-primary mb-1'>CONFIDENTIALITY:</h2>
            <p>
               RA 10173 or the Data Privacy Act protects individuals from unauthorized processing of personal information. To ensure that your
               information protected, The researchers will follow this law to keep your information safe and confidential.
            </p>
         </div>

         <div>
            <h1 className='h5 custom-heading text-primary mb-1'>DEFINITIONS</h1>
            <p>
               Throughout the conversation, Anna will be responding to possible jargons. To ensure that you understand Anna, the definition of words
               will be provided:
            </p>
            <p className='mb-1'>
               <span className='fw-bold'>Degree Program</span> - A class that a college of university offers to students. (Bachelor in science in
               Information Technology, etc..)
            </p>
            <p className='mb-1'>
               <span className='fw-bold'>RIASEC</span> - A personality test that asks about your interest, skills, ability, and aspirations which will
               help you decide on what career to pursue based on these attributes.
            </p>
            <p className='mb-1'>
               <span className='fw-bold'>Senior high school strand</span> - Disciplines that are offered by schools to senior high school students
               that would prepare them for college.
            </p>
         </div>
      </div>
   );
};

export default TermsConditionPage;
