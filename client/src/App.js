import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import LandingPage from './components/pages/LandingPage';
import TeamPage from './components/pages/TeamPage';
import TermsConditionPage from './components/pages/TermsConditionPage';
import FeedbackPage from './components/pages/FeedbackPage';
import AboutPage from './components/pages/AboutPage';
import Navigation from './components/Navigation';

function App() {
   useEffect(() => {
      const fetchdata = async () => {
         const body = { text: 'hi', userId: '123' };
         const response = await fetch('/api/df_text_query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
         });
         const data = await response.json();
         console.log(data);
      };
      fetchdata();
   }, []);

   return (
      <div className='d-flex h-100'>
         <Router>
            {/* apply page transition if possible soon - https://www.youtube.com/watch?v=FdrEjwymzdY&t=13s */}
            <Navigation />
            <div className='content'>
               <Routes>
                  <Route path='/' element={<LandingPage />} />
                  <Route path='/about' element={<AboutPage />} />
                  <Route path='/team' element={<TeamPage />} />
                  <Route path='/terms-condition' element={<TermsConditionPage />} />
                  <Route path='/feedback' element={<FeedbackPage />} />
               </Routes>
            </div>
         </Router>
      </div>
   );
}

export default App;
