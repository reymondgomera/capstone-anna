import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState, useRef } from 'react';
import { ChatbotContext } from './context/ChatbotContext';
import { UserContext } from './context/UserContext';

import AdminLogin from './components/pages/AdminLogin';
import LandingPage from './components/pages/LandingPage';
import Admin from './components/pages/Admin';
import Dashboard from './components/pages/Dashboard';
import Feedback from './components/pages/Feedback';
import Conversation from './components/pages/Conversation';
import ConversationDetails from './components/pages/ConversationDetails';
// import VideoMaterial from './components/pages/VideoMaterial';
// import Course from './components/pages/Course';

function App() {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [isAgreeTermsConditions, setIsAgreeTermsConditions] = useState(false);
   const [showBot, setShowbot] = useState(true);
   const inputRef = useRef(null);
   const [disabledInput, setDisabledInput] = useState(false);
   const [isVisibleInput, setIsVisibleInput] = useState(true);
   const [botChatLoading, setBotChatLoading] = useState(false);
   const [isSidebarActive, setIsSidebarActive] = useState(false);
   const [isRecommendationProvided, setIsRecommendationProvided] = useState({ riasec: '', strand: '' });
   const [basis, setBasis] = useState('');

   const varify = async () => {
      try {
         const response = await fetch('/auth/is-varify', { headers: { token: localStorage.getItem('token') } });
         const data = await response.json(response);
         data === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
      } catch (err) {
         console.error(err.message);
      }
   };

   useEffect(() => {
      varify();
   }, []);

   const ChatbotContextValue = {
      isAgreeTermsConditions,
      setIsAgreeTermsConditions,
      showBot,
      setShowbot,
      disabledInput,
      setDisabledInput,
      inputRef,
      isVisibleInput,
      setIsVisibleInput,
      botChatLoading,
      setBotChatLoading,
      isRecommendationProvided,
      setIsRecommendationProvided,
      basis,
      setBasis,
   };

   const UserContextValue = {
      isAuthenticated,
      setIsAuthenticated,
      isSidebarActive,
      setIsSidebarActive,
   };

   return (
      <ChatbotContext.Provider value={ChatbotContextValue}>
         <UserContext.Provider value={UserContextValue}>
            <Router>
               <Routes>
                  <Route path='/' element={<LandingPage />} />
                  <Route path='/admin/*' element={!isAuthenticated ? <Navigate replace to='/admin/login' /> : <Admin />}>
                     {/* /admin will trigger if path starts with /admin - by using asterisk (*) */}
                     <Route path='dashboard' element={<Dashboard />} />
                     <Route path='feedback' element={<Feedback />} />
                     <Route path='conversation' element={<Conversation />} />
                     <Route path='conversation/:conversationId' element={<ConversationDetails />} />
                     {/* <Route path='video-material' element={<VideoMaterial />} /> */}
                     {/* <Route path='course' element={<Course />} /> */}
                  </Route>
                  <Route path='/admin/login' element={!isAuthenticated ? <AdminLogin /> : <Navigate replace to='/admin/dashboard' />} />
               </Routes>
            </Router>
            <ToastContainer theme='light' transition={Flip} autoClose='2000' />
         </UserContext.Provider>
      </ChatbotContext.Provider>
   );
}

export default App;
