import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './components/pages/LandingPage';
import Chatbot from './components/chatbot/Chatbot';

import { useState } from 'react';
import { ChatbotContext } from './context/ChatbotContext';

function App() {
   const [isAgreeTermsConditions, setIsAgreeTermsConditions] = useState(false);
   const [showBot, setShowbot] = useState(true);
   const [disabledInput, setDisabledInput] = useState(false);
   const [botChatLoading, setBotChatLoading] = useState(false);

   const ChatbotContextValue = {
      isAgreeTermsConditions,
      setIsAgreeTermsConditions,
      showBot,
      setShowbot,
      disabledInput,
      setDisabledInput,
      botChatLoading,
      setBotChatLoading,
   };

   return (
      <ChatbotContext.Provider value={ChatbotContextValue}>
         <Router>
            {/* apply page transition if possible soon - https://www.youtube.com/watch?v=FdrEjwymzdY&t=13s */}
            <Routes>
               <Route path='/' element={<LandingPage />} />
            </Routes>
            <Chatbot />
         </Router>
      </ChatbotContext.Provider>
   );
}

export default App;
