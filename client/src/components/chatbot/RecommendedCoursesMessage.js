import '../../styles/chatbot.css';
import { useEffect, useState, useContext } from 'react';

import chatbotAvatar from '../../assets/Anna_Chat_Avatar.svg';
import chatloading from '../../assets/chatbot-loading.gif';
import { ChatbotContext } from '../../context/ChatbotContext';

const RecommendedCoursesMessage = ({
   speaks,
   recommendedCourses,
   handleMessagesScrollToBottom,
   dialogflowEventQuery,
   setTextMessage,
   basis,
   strand,
}) => {
   const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
   const { isRecommendationProvided, setIsRecommendationProvided, setDisabledInput, setIsVisibleInput } = useContext(ChatbotContext);
   const [studentStrand] = useState(strand);
   const introductoryText = {
      riasec:
         'With your interest identified, I will show you degree programs that will be suitable for you to take in college. Allow me to show you these degree programs:',
      strand: `Based on your SHS strand which is ${studentStrand}, these are the following degree programs I could recommend you:`,
   };

   useEffect(() => {
      // componenent will rendered immediatelly but do some dalays with isRecommendationLoading
      if (isRecommendationProvided.riasec === 'done') {
         // only trigger once
         setIsRecommendationLoading(true);
         setDisabledInput(true);
         setIsVisibleInput(false);
         setTextMessage('');
         setTimeout(() => {
            setIsRecommendationLoading(false);
            setDisabledInput(false);
            setIsRecommendationProvided(prev => ({ ...prev, riasec: '' })); // empty so that it will not be trigger again
            handleMessagesScrollToBottom();
            dialogflowEventQuery('ISLEARN_RIASEC_RECOMMENDED_COURSES');
         }, 15000); //2000 for testing only  // must be change 15000
      } else if (isRecommendationProvided.strand === 'done') {
         // only trigger once
         setIsRecommendationLoading(true);
         setDisabledInput(true);
         setIsVisibleInput(false);
         setTextMessage('');
         setTimeout(() => {
            setIsRecommendationLoading(false);
            setDisabledInput(false);
            setIsRecommendationProvided(prev => ({ ...prev, strand: '' })); // empty so that it will not be trigger again
            handleMessagesScrollToBottom();
            dialogflowEventQuery('ISLEARN_STRAND_RECOMMENDED_COURSES');
         }, 15000); //2000 for testing only  // must be change 15000
      }
   }, []);

   return (
      <>
         {!isRecommendationLoading ? (
            <div className={`message ${speaks !== 'bot' && 'user'}`}>
               {speaks === 'bot' && (
                  <div>
                     <img className='chatbot-avatar message-avatar' src={chatbotAvatar} alt='chathead' />
                  </div>
               )}
               <div className={`message-text ${speaks === 'bot' ? 'bot' : 'user'}`}>
                  {introductoryText[basis]}
                  <ul className='recommendedCourses'>
                     {recommendedCourses.map((course, i) => (
                        <li key={i}>{course.stringValue}</li>
                     ))}
                  </ul>
               </div>
            </div>
         ) : (
            <div className='message bot'>
               <div>
                  <img className='chatbot-avatar message-avatar' src={chatbotAvatar} alt='chathead' />
               </div>
               <div className='message-text bot'>
                  <img className='message-loading' src={chatloading} alt='loading' />
               </div>
            </div>
         )}
      </>
   );
};

export default RecommendedCoursesMessage;
