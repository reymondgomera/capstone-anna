import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { toast } from 'react-toastify';
import { isEmailValid } from '../../utils/validator';

const AdminLogin = () => {
   const navigate = useNavigate();
   const { setIsAuthenticated } = useContext(UserContext);
   const [inputs, setInputs] = useState({ email: '', password: '' });
   const { email, password } = inputs;

   const handleInputChange = e => {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
   };

   const handleSubmit = async e => {
      e.preventDefault();
      e.target.className += ' was-validated';

      try {
         if (email && password) {
            if (isEmailValid(email)) {
               const body = { email, password };
               const response = await fetch('/auth/signin', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body),
               });
               const data = await response.json();

               if (response.status === 200 && data.token) {
                  localStorage.setItem('token', data.token);
                  e.target.classList.remove('was-validated');
                  setIsAuthenticated(true);
                  toast.success(data.message);

                  navigate('/admin/dashboard');
               } else toast.error(data.message);
            } else toast.error('Email is invalid!');
         } else toast.error('Please complete all required fields!');
      } catch (err) {
         console.error(err.message);
      }
   };

   return (
      <>
         <section className='mt-auto'>
            <form className='needs-validation container' noValidate style={{ width: '55%' }} onSubmit={handleSubmit}>
               <h1 className='custom-heading mb-5 text-center'>Sign In</h1>
               <div className='mb-4'>
                  <input
                     className='form-control py-2'
                     value={email}
                     type='email'
                     id='email'
                     name='email'
                     required
                     placeholder='Email'
                     onChange={handleInputChange}
                  />
                  {!email && <div className='invalid-feedback py-1 px-1'>Email can't be empty</div>}
               </div>
               <div className='mb-4'>
                  <input
                     className='form-control py-2'
                     value={password}
                     type='password'
                     id='password'
                     name='password'
                     required
                     placeholder='Password'
                     onChange={handleInputChange}
                  />
                  {!password && <div className='invalid-feedback py-1 px-1'>Password can't be empty</div>}
               </div>
               <button className='btn btn-primary w-100' type='submit'>
                  Sign in
               </button>
            </form>
         </section>
         <footer className='mt-auto bg-primary p-2 text-center'>ANNA | Copyright © 2022</footer>
      </>
   );
};

export default AdminLogin;
