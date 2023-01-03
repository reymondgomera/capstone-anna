import '../../styles/chatbot.css';
import chatbotAvatar from '../../assets/Anna_Chat_Avatar.svg';
import { useContext, useEffect } from 'react';
import { ChatbotContext } from '../../context/ChatbotContext';
import ReactHtmlParse from 'html-react-parser';

const Message = ({ keyword, speaks, text }) => {
   const { inputRef } = useContext(ChatbotContext);

   useEffect(() => {
      inputRef.current.focus();
   }, []);

   return (
      <>
         <div className={`message ${speaks !== 'bot' && 'user'}`}>
            {speaks === 'bot' && (
               <div>
                  <img className='chatbot-avatar message-avatar' src={chatbotAvatar} alt='chathead' />
               </div>
            )}
            <div className={`message-text ${speaks === 'bot' ? 'bot' : 'user'}`}>
               {ReactHtmlParse(text.toString())}{' '}
               {keyword === 'terms-conditions' && (
                  <>
                     <button
                        className='btn btn-link p-0 message-text-link'
                        type='button'
                        data-bs-toggle='modal'
                        data-bs-target='#modal-terms-conditions'
                     >
                        terms and conditions.
                     </button>{' '}
                     😊
                  </>
               )}
            </div>
         </div>
      </>
   );
};

export default Message;
