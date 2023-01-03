import React, { useContext, useState } from 'react';

import Header from '../Header';
import anna from '../../assets/Anna_1.svg';
import anna2 from '../../assets/Anna_2.svg';
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
      { text: 'Learn RIASEC', link: '/#learn-riasec' },
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
               const response = await fetch('/admin/feedbacks', {
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
            className='section section-first bg-white container d-flex flex-column flex-lg-row align-items-center justify-content-between my-0 px-0'
         >
            <div className='d-flex flex-column align-items-center align-items-lg-start px-4 order-1 order-lg-0' style={{ width: '65%' }}>
               <div>
                  <h1 className='text-wrap custom-heading d-inline-block'>Meet Chatbot,</h1>
                  <h1 className='d-inline-block text-primary custom-heading ms-1'>Anna</h1>
               </div>
               <p className='mb-3'>
                  Anna is a web-based chatbot application that aims to aid senior high school students who will be transitioning to higher education
                  with their career planning by providing them with initial steps to identify their suitable degree programs.
               </p>
               <button className='btn btn-primary btn-lg rounded-pill mb-5 mb-lg-0' onClick={() => setShowbot(true)}>
                  Get Started
               </button>
            </div>
            <div className='order-0 order-lg-1 mb-5 mb-lg-0'>
               <img src={anna} alt='Anna' className='anna-img' />
            </div>
         </section>

         <section id='about' className='section mt-5 mt-md-0 bg-primary'>
            <div className='container px-0 d-flex flex-column flex-md-row align-items-center justify-content-center flex-wrap'>
               <div className='d-flex flex-column align-items-center feature p-3'>
                  <MdRecommend className='icon-large mb-3' />
                  <h2 className='h4 m-0 custom-heading text-center'>RIASEC &amp; Strand</h2>
                  <p className='text-center'>Recommend degree programs based on RIASEC result and based on strand.</p>
               </div>

               <div className='d-flex flex-column  align-items-center feature p-3'>
                  <img className='custom-icon-large mb-3' src={brainstrom} alt='awareness' />
                  <h2 className='h4 m-0 custom-heading text-center'>Provide Awareness</h2>
                  <p className='text-center'>Awareness on different degree programs in college</p>
               </div>

               <div className='d-flex flex-column align-items-center feature p-3'>
                  <FaScroll className='icon-large mb-3' />
                  <h2 className='h4 m-0 custom-heading text-center'>Cooperative Principle</h2>
                  <p className='text-center'>Chatbot Anna is guided by the “Cooperative Principle.”</p>
               </div>
            </div>
            <div className='container d-flex flex-column px-0'>
               <h1 className='custom-heading my-5 text-center'>ABOUT</h1>
               <div className='px-3 mb-3'>
                  <h2 className='h4 custom-heading mb-4'>Anna</h2>
                  <p>
                     This is Anna, a web-based chatbot and degree program recommender chatbot. Anna helps you, a senior high school student who is
                     looking for recommendations on what degree programs to take on college by getting your interest and your senior high school
                     strand and sharing you information about existing degree programs out there. Anna will help you with your queries and feel free
                     to ask Anna for recommendation, she will be very pleased to meeting you.
                  </p>
               </div>
               <div className='px-3'>
                  <h2 className='h4 custom-heading mb-4'>Research Study &amp; Problem</h2>
                  <div>
                     <h3 className='h6 custom-heading'>TITLE OF STUDY:</h3>
                     <p>ANNA: A Web-based Chatbot for Career Planning following Cooperative Principle</p>
                  </div>
                  <div>
                     <h3 className='h6 custom-heading'>FOCUS:</h3>
                     <p>
                        The study will be focusing on one area of career guidance, which is career planning. The term "Career planning" is a process
                        in career guidance. It is the starting point for individuals to plan or foresee their career.
                     </p>
                     <p>
                        It is essential for an individual to undergo career planning because carefully planning what career to take avoids the failure
                        of achieving the career course. Also, it increases the student's confidence on what course they are trying to pursue.
                     </p>
                  </div>
                  <div>
                     <h3 className='h6 custom-heading'>PROBLEM:</h3>
                     <p>
                        Shifting and dropout is one of the prevalent problems faced by college students especially to those who are within the
                        generation Z. One of the reasons why students shift and dropout in college is the poor choice of degree programs. They tend to
                        copy the decisions of others and do not have sufficient career information.
                     </p>
                     <p>
                        There were technological and non-technological solutions proposed, but the researchers found gaps. To fill in those identified
                        gaps, the researchers developed Anna.
                     </p>
                     <div>
                        <h3 className='h6 custom-heading'>OBJECTIVES:</h3>
                        <p>
                           The general objective of this study is to develop ANNA, a chatbot for career planning that would aid senior high school
                           students by providing them with awareness of different degree program options and degree program selection. The specific
                           objectives of the study are as follows:
                        </p>
                        <ul className='m-0 ps-4'>
                           <li>Create a conversational scheme whose main goal is to provide a degree program recommendation to students</li>
                           <li>Develop a chatbot that can provide degree program recommendations to senior high school students</li>
                           <li>Test the application in terms of its acceptability and usability among its targeted users and deploy Anna.</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <section id='learn-riasec' className='section bg-white'>
            <div className='container d-flex flex-column px-0'>
               <h1 className='custom-heading text-primary mb-5 text-center'>LEARN RIASEC</h1>
               <div className='container bg-grey rounded p-5'>
                  <div className='d-flex flex-column flex-lg-row align-items-center align-items-lg-start justify-content-between'>
                     <div>
                        <iframe
                           id='playlist'
                           loading='lazy'
                           src='https://www.youtube.com/embed/fyR6yJifLHI?loop=1&playlist=fyR6yJifLHI'
                           width='480'
                           height='270'
                           title='RIASEC - Personality Type'
                           frameBorder='0'
                           allowFullScreen
                        ></iframe>
                        <div className='text-center bg-primary rounded p-2 mt-1'>
                           Video by <strong>Career Library</strong> on{' '}
                           <a className='text-decoration-none' href='https://www.youtube.com' target='_blank' rel='noreferrer'>
                              YouTube
                           </a>
                        </div>
                     </div>

                     <div className='d-flex flex-column align-items-center align-items-lg-start mt-5 mt-lg-0 ms-lg-5'>
                        <h1 className='custom-heading text-primary'>What is RIASEC test?</h1>
                        <p>
                           The RIASEC test was based on Holland’s theory, in which he proposed that careers can be classified into six areas:
                           Realistic, Investigative, Artistic, Social, Enterprising and Conventional. Thus, these six areas can be used to describe a
                           person's personality, ability, skills, and interests. Also, it is a standardized test that was designed to help students
                           discover the most suitable career for them and has been administered by several universities inside or outside the
                           Philippines and these universities believed that the RIASEC test really serves its purpose of helping students.
                        </p>
                        <p>Watch the video to learn more about the components of RIASEC.</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <section id='team' className='section bg-white'>
            <div className='container d-flex flex-column px-0'>
               <h1 className='custom-heading text-primary mb-5 text-center'>THE TEAM</h1>
               <div className='d-flex flex-column flex-md-row justify-content-center align-items-center'>
                  <div className='d-flex flex-column align-items-center member p-3'>
                     <img className='mb-3' src={reymond} alt='reymond' width='145' />
                     <p className='m-0 custom-heading text-break text-center'>Rey Mond Gomera</p>
                     <p className='m-0 text-break text-center'>rgomera_190000000465@uic.edu.ph</p>
                     <p className='m-0 text-center'>UI/UX DESIGNER | PROGRAMMER </p>
                  </div>
                  <div className='d-flex flex-column align-items-center member p-3'>
                     <img className='mb-3' src={john} alt='reymond' width='145' />
                     <p className='m-0 custom-heading text-break text-center'>John Michael Amto</p>
                     <p className='m-0 text-break text-center'>jamto_190000000229@uic.edu.ph</p>
                     <p className='m-0 text-center'>TECHNICAL WRITER | QA</p>
                  </div>
                  <div className='d-flex flex-column align-items-center member p-3'>
                     <img className='mb-3' src={ryan} alt='reymond' width='145' />
                     <p className='m-0 custom-heading text-break text-center'>Ryan Christian Hibaya</p>
                     <p className='m-0 text-break text-center'>rhibaya_190000001021@uic.edu.ph</p>
                     <p className='m-0 text-center'>PROJECT MANAGER | TECHNICAL WRITER | TESTER</p>
                  </div>
               </div>
            </div>
         </section>

         <section id='terms-conditions' className='section bg-primary'>
            <div className='container d-flex flex-column px-3  '>
               <h1 className='custom-heading mb-5 text-center'>TERMS AND CONDITIONS</h1>
               <div className='bg-grey rounded p-3 mb-3'>
                  <p className='mb-1'>In using Anna, you agree to these terms and conditions:</p>
                  <ol className='m-0' type='A'>
                     <li>All responses and correspondences with Anna will be recorded.</li>
                     <li>
                        Information such as name (required), age (required), sex (required), senior high school strand (required), and related
                        correspondence will be for the exclusive use of this study to continuously improve Anna.
                     </li>
                     <li>The data collected will be used for as long as it is needed for further analysis or investigation.</li>
                     <li>You are free to exit the conversation with Anna if you feel the need to do so.</li>
                  </ol>
               </div>

               <div className='bg-grey rounded p-3 mb-3'>
                  <div>
                     <h3 className='h6 custom-heading'>TITLE OF STUDY:</h3>
                     <p>ANNA: A Web-based Chatbot for Career Planning following Cooperative Principle</p>
                  </div>
                  <div>
                     <h3 className='h6 custom-heading'>RESEARCHERS:</h3>
                     <p>Rey Mond Gomera, John Michael Amto, Ryan Christian Hibaya</p>
                  </div>
                  <div>
                     <h3 className='h6 custom-heading'>USER GUIDELINES:</h3>
                     <p>Anna could only converse in the English language. It is then recommended that your responses be in English.</p>
                     <p>
                        If the user is idle for more than 20 minutes, Anna would end the conversation by replying with phrases like, "I think I lost
                        you there. Please do reach out to me again anytime. I'll be here 😊". If this happens, greeting Anna with words like "Hello",
                        or "Hi", will start a new conversation.
                     </p>
                     <p>
                        If any problems occur during the conversation process, or you have any suggestions or comments you would like to share with
                        the researchers, please leave a feedback
                        <a className='text-primary ms-1' href='/#feedback'>
                           here
                        </a>
                        . Your insights and suggestions would help improve our project.
                     </p>
                  </div>
                  <div>
                     <h3 className='h6 custom-heading'>CONFIDENTIALITY:</h3>
                     <p>
                        The information that Anna will be obtaining throughout the conversation will remain confidential to protect your rights or
                        welfare.
                     </p>
                     <p>
                        RA 10173 or the Data Privacy Act protects individuals from unauthorized processing of personal information. To ensure that
                        your information is protected, the researchers will follow this law to keep your information safe and confidential.
                     </p>
                  </div>
                  <div>
                     <h3 className='h6 custom-heading'>DEFINITIONS:</h3>
                     <p>
                        Throughout the conversation, Anna will be responding to possible jargons. To ensure that you understand Anna, the definition
                        of words will be provided:
                     </p>

                     <div className='ms-4'>
                        <p className='mb-1'>
                           <span className='h6 custom-heading d-inline-block'>Degree Program</span> - A class that a college of university offers to
                           students. (Bachelor of Science in Information Technology, etc..)
                        </p>
                        <p className='mb-1'>
                           <span className='h6 custom-heading d-inline-block'>RIASEC</span> - A personality test that asks about your interest,
                           skills, ability, and aspirations which will help you decide on what career to pursue based on these attributes.
                        </p>
                        <p className='mb-1'>
                           <span className='h6 custom-heading d-inline-block'>Senior high school strand</span> - Disciplines that are offered by
                           schools to senior high school students that would prepare them for college.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <section id='feedback' className='section bg-white'>
            <div className='container d-flex flex-column px-0 '>
               <h1 className='custom-heading mb-5 text-center text-primary'>FEEDBACK</h1>
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

         <footer className='mt-auto bg-primary'>
            <div className='p-5 pb-0 text-center'>
               <div className='row flex-wrap justify-content-center justify-content-md-start'>
                  <div className='col-11 col-md-5 d-flex flex-column'>
                     <a className='text-decoration-none' href='/'>
                        <div className='d-flex align-items-center mb-4'>
                           <img className='anna-logo' src={anna2} alt='anna-logo' />
                           <h1 className='h1 ms-3 custom-heading text-white'>Anna</h1>
                        </div>
                     </a>
                     <small className='text-start'>
                        Anna is a web-based chatbot application that aims to aid senior high school students who will be transitioning to higher
                        education with their career planning by providing them with initial steps to identify their suitable degree programs.
                     </small>
                  </div>
                  <div className='col-11 col-md-2 d-flex flex-column mt-3 mt-md-0'>
                     <h4 className='h5 custom-heading mb-4 text-start'>Useful links</h4>
                     <ul className='footer-links text-start'>
                        <li>
                           <a href='/#home'>
                              <small>Home</small>
                           </a>
                        </li>
                        <li>
                           <a href='/#about'>
                              <small>About</small>
                           </a>
                        </li>
                        <li>
                           <a href='/#team'>
                              <small>The Team</small>
                           </a>
                        </li>
                        <li>
                           <a href='/#terms-conditions'>
                              <small>Terms & Conditions</small>
                           </a>
                        </li>
                        <li>
                           <a href='/#feedback'>
                              <small>Feedback</small>
                           </a>
                        </li>
                        <li>
                           <a href='/admin/login'>
                              <small>Admin</small>
                           </a>
                        </li>
                     </ul>
                  </div>
                  <div className='col-11 col-md-2 d-flex flex-column mt-3 mt-md-0'>
                     <h4 className='h5 custom-heading mb-4 text-start'>Address</h4>
                     <small className='text-start'>
                        University of the Immaculate Conception Father Selga St., Davao City, Davao del Sur Philippines 8000
                     </small>
                  </div>
                  <div className='col-11 col-md-2 d-flex flex-column mt-3 mt-md-0'>
                     <h4 className='h5 custom-heading mb-4 text-start'>Contact Us</h4>
                     <small className='text-start'>anna.capstone24@gmail.com</small>
                  </div>
               </div>
            </div>
            <small className='w-100 d-block mt-5 p-2 text-center bg-primary-dark'>ANNA | Copyright © 2022</small>
         </footer>
      </>
   );
};

export default LandingPage;
