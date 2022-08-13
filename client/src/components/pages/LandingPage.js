import React, { useContext, useState } from 'react';

import Header from '../Header';
import anna from '../../assets/Anna_1.svg';
import brainstrom from '../../assets/brainstorm.svg';
import reymond from '../../assets/Reymond.svg';
import ryan from '../../assets/Ryan.svg';
import john from '../../assets/John.svg';
import { isEmailValid } from '../../utils/validator';
import { FaScroll } from 'react-icons/fa';
import { MdRecommend } from 'react-icons/md';
import { ChatbotContext } from '../../context/ChatbotContext';
import { toast } from 'react-toastify';
import Chatbot from '../chatbot/Chatbot';

const LandingPage = () => {
   const { setShowbot } = useContext(ChatbotContext);
   const navlinks = [
      { text: 'Home', link: '/#home' },
      { text: 'About', link: '/#about' },
      { text: 'The Team', link: '/#team' },
      { text: 'Terms & Conditions', link: '/#terms-conditions' },
      { text: 'Feedback', link: '/#feedback' },
   ];

   const [inputs, setInputs] = useState({ email: '', feedback: '' });
   const { email, feedback } = inputs;

   const handleInputChange = e => {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
   };

   const handleSubmit = async e => {
      e.preventDefault();
      e.target.className += ' was-validated';

      try {
         if (email && feedback) {
            if (isEmailValid(email)) {
               const body = { email, feedback };
               const response = await fetch('/admin/feedback', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body),
               });
               const data = await response.json();

               if (response.status === 200 && data.feedback) {
                  e.target.classList.remove('was-validated');
                  setInputs({ email: '', feedback: '' });
                  toast.success(data.message);
               } else toast.error(data.message);
            } else toast.error('Email is invalid!');
         } else toast.error('Please complete all required fields!');
      } catch (err) {
         console.error(err.message);
      }
   };

   return (
      <>
         <Header navlinks={navlinks} />
         <section
            id='home'
            className='section section-first bg-white container d-flex flex-column flex-lg-row align-items-center justify-content-between mb-4 px-0'
         >
            <div className='d-flex flex-column align-items-center align-items-lg-start px-4 order-1 order-lg-0' style={{ width: '65%' }}>
               <div>
                  <h1 className='text-wrap custom-heading d-inline-block'>Meet Chatbot,</h1>
                  <h1 className='d-inline-block text-primary custom-heading ms-1'>Anna</h1>
               </div>
               <p className='mb-3'>
                  Anna aid senior high school students awareness and recommend various degree programs for college. Are you ready to know what is the
                  recommended degree programs for you?
               </p>
               <button className='btn btn-primary btn-lg rounded-pill mb-5 mb-lg-0' onClick={() => setShowbot(true)}>
                  Get Started
               </button>
            </div>
            <div className='order-0 order-lg-1 mb-5 mb-lg-0'>
               <img src={anna} alt='Anna' className='anna-img' />
            </div>
         </section>

         <section id='about' className='section mt-5 bg-primary py-5'>
            <div className='container px-0 d-flex flex-column flex-md-row align-items-center justify-content-center flex-wrap'>
               <div className='d-flex flex-column align-items-center feature p-3'>
                  <MdRecommend className='icon-large mb-1' />
                  <h2 className='h6 m-0 text-center'>RIASEC &amp; Strand</h2>
                  <small className='thin-text text-center'>Recommend courses based on RIASEC result and based on strand.</small>
               </div>

               <div className='d-flex flex-column  align-items-center feature p-3'>
                  <img className='custom-icon-large mb-1' src={brainstrom} alt='awareness' />
                  <h2 className='h6 m-0 text-center'>Provide Awareness</h2>
                  <small className='thin-text text-center'>Awareness on different degree programs in college</small>
               </div>

               <div className='d-flex flex-column align-items-center feature p-3'>
                  <FaScroll className='icon-large mb-1' />
                  <h2 className='h6 m-0 text-center'>Cooperative Principle</h2>
                  <small className='thin-text text-center'>Chatbot Anna is guided by the “Cooperative Principle.”</small>
               </div>
            </div>
            <div className='container d-flex flex-column px-0'>
               <h1 className='custom-heading my-5 text-center'>ABOUT</h1>
               <div className='px-3'>
                  <h5 className='fw-bold'>Anna</h5>
                  <p>
                     This is Anna, a career recommender chatbot. Anna helps you, a senior high school student who is looking for recommendations on
                     what degree programs to take on college by getting your interest and sharing you information about existing degree programs out
                     there. Anna will help you with your queries and feel free to ask Anna for recommendation, she will be very pleased to meeting
                     you.
                  </p>
               </div>
               <div className='px-3'>
                  <h5 className='fw-bold'>Research Study &amp; Problem</h5>
                  <p>
                     Shifting and dropout is one of the prevalent problems faced by college students especially to those who are within the generation
                     Z.
                  </p>
               </div>
            </div>
         </section>
         <section id='team' className='section bg-white py-5'>
            <div className='container d-flex flex-column px-0'>
               <h1 className='custom-heading text-primary my-5 text-center'>THE TEAM</h1>
               <div className='d-flex flex-column flex-md-row justify-content-center align-items-center'>
                  <div className='d-flex flex-column align-items-center member p-3'>
                     <img className='mb-3' src={reymond} alt='reymond' width='145' />
                     <p className='m-0 fw-bold text-break text-center'>Rey Mond Gomera</p>
                     <p className='m-0 text-break text-center'>rgomera_190000000465@uic.edu.ph</p>
                     <p className='m-0 text-center'>UI/UX DESIGNER | PROGRAMMER | QA | TECHNICAL WRITER</p>
                  </div>
                  <div className='d-flex flex-column align-items-center member p-3'>
                     <img className='mb-3' src={john} alt='reymond' width='145' />
                     <p className='m-0 fw-bold text-break text-center'>John Michael Amto</p>
                     <p className='m-0 text-break text-center'>jamto_190000000229@uic.edu.ph</p>
                     <p className='m-0 text-center'>PROGRAMMER | TECHNICAL WRITER</p>
                  </div>
                  <div className='d-flex flex-column align-items-center member p-3'>
                     <img className='mb-3' src={ryan} alt='reymond' width='145' />
                     <p className='m-0 fw-bold text-break text-center'>Ryan Christian Hibaya</p>
                     <p className='m-0 text-break text-center'>rhibaya_190000001021@uic.edu.ph</p>
                     <p className='m-0 text-center'>PROJECT MANAGER | TECHNICAL WRITER | TESTER</p>
                  </div>
               </div>
            </div>
         </section>

         <section id='terms-conditions' className='section bg-primary py-5'>
            <div className='container d-flex flex-column px-3  '>
               <h1 className='custom-heading my-5 text-center'>TERMS AND CONDITIONS</h1>
               <p className='bg-grey rounded p-3 mb-3'>
                  As you converse with Anna, you are to agree to bounded by these terms and conditions: Your responses to Anna will be recorded and be
                  used for analysis. You agree that the information you provided in this study will include your basic information (Name, Age, Sex)
                  and senior high school strand for these information will be necessary for identification and for the recommendation of degree
                  programs.
               </p>

               <div className='bg-grey rounded p-3 mb-3'>
                  <div>
                     <span className='fw-bold'>TITLE OF STUDY:</span>
                     <p>ANNA: A Web-based Chatbot for Career Planning following Cooperative Principle</p>
                  </div>
                  <div>
                     <span className='fw-bold'>RESEARCHERS:</span>
                     <p>Rey Mond Gomera, John Michael Amto, Ryan Christian Hibaya</p>
                  </div>
                  <div>
                     <span className='fw-bold'>CONFIDENTIALITY:</span>
                     <p>
                        RA 10173 or the Data Privacy Act protects individuals from unauthorized processing of personal information. To ensure that
                        your information protected, The researchers will follow this law to keep your information safe and confidential.
                     </p>
                  </div>
                  <div>
                     <span className='fw-bold'>DEFINITIONS:</span>
                     <p>
                        Throughout the conversation, Anna will be responding to possible jargons. To ensure that you understand Anna, the definition
                        of words will be provided:
                     </p>

                     <div className='ms-4'>
                        <p className='mb-1'>
                           <span className='fw-bold'>Degree Program</span> - A class that a college of university offers to students. (Bachelor in
                           science in Information Technology, etc..)
                        </p>
                        <p className='mb-1'>
                           <span className='fw-bold'>RIASEC</span> - A personality test that asks about your interest, skills, ability, and
                           aspirations which will help you decide on what career to pursue based on these attributes.
                        </p>
                        <p className='mb-1'>
                           <span className='fw-bold'>Senior high school strand</span> - Disciplines that are offered by schools to senior high school
                           students that would prepare them for college.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <section id='feedback' className='section bg-white py-5'>
            <div className='container d-flex flex-column px-0 '>
               <h1 className='custom-heading my-5 text-center text-primary'>TERMS AND CONDITIONS</h1>
               <form className='d-flex flex-column justify-content-center align-items-center px-4' noValidate onSubmit={handleSubmit}>
                  <div className='mb-4 w-100'>
                     <input
                        className='form-control'
                        value={email}
                        type='email'
                        id='email'
                        name='email'
                        required
                        placeholder='Email Addres'
                        onChange={handleInputChange}
                     />
                     {!email && <div className='invalid-feedback py-1 px-1'>Email can't be empty</div>}
                  </div>
                  <div className='mb-4 w-100'>
                     <textarea
                        className='form-control'
                        value={feedback}
                        id='feedback'
                        name='feedback'
                        required
                        rows='12'
                        placeholder='Tell us how can we improve...'
                        onChange={handleInputChange}
                     ></textarea>
                     {!feedback && <div className='invalid-feedback py-1 px-1'>Feedback can't be empty</div>}
                  </div>
                  <button className='btn btn-primary rounded-pill px-3' type='submit'>
                     Submit
                  </button>
               </form>
            </div>
         </section>
         <Chatbot />

         <footer className='mt-auto bg-primary p-2 text-center'>ANNA | Copyright © 2022</footer>
      </>
   );
};

export default LandingPage;
