import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import LandingPage from './components/pages/LandingPage';
import TeamPage from './components/pages/TeamPage';
import TermsConditionPage from './components/pages/TermsConditionPage';
import FeedbackPage from './components/pages/FeedbackPage';
import AboutPage from './components/pages/AboutPage';
import Navigation from './components/Navigation';
import Chatbot from './components/chatbot/Chatbot';

function App() {
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
                  <Route path='/terms-conditions' element={<TermsConditionPage />} />
                  <Route path='/feedback' element={<FeedbackPage />} />
               </Routes>
               <Chatbot />
            </div>
         </Router>
      </div>
   );
}

export default App;
