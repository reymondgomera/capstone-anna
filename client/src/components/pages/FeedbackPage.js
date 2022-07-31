import React from 'react';

const FeedbackPage = () => {
   return (
      <div className='bg-primary px-5 h-100'>
         <h1 className='custom-heading text-center my-5'>FEEDBACK</h1>

         <form className='d-flex flex-column justify-content-center align-items-center'>
            <input className='form-control mb-4' type='email' id='email' placeholder='Email Addres' />
            <textarea className='form-control mb-4' id='feedback' rows='12' placeholder='Tell us how can we improve...'></textarea>
            <button className='btn btn-black' type='button'>
               Submit
            </button>
         </form>
      </div>
   );
};

export default FeedbackPage;
