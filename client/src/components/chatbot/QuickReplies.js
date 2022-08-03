import QuickReply from './QuickReply';
import chatbotAvatar from '../../assets/Anna_Chat_Avatar.svg';
import { ChatbotContext } from '../../context/ChatbotContext';
import { useState, useContext } from 'react';

const QuickReplies = ({ replyClick, speaks, text, payload }) => {
   const [isVisible, setIsVisible] = useState(true); // use toggle visible of quickreply after clicking
   const { setDisabledInput } = useContext(ChatbotContext);

   const handleClick = (e, payload, text) => {
      replyClick(e, payload, text);
      setIsVisible(false);
      setDisabledInput(false);
   };

   const renderQuickReplies = quickReplies => {
      if (quickReplies) {
         return quickReplies.map((reply, i) => <QuickReply key={i} click={handleClick} reply={reply} />);
      } else return null;
   };

   return (
      <>
         {text && (
            <div className={`message ${speaks !== 'bot' && 'user'}`}>
               {speaks === 'bot' && (
                  <div>
                     <img className='chatbot-avatar message-avatar' src={chatbotAvatar} alt='chathead' />
                  </div>
               )}
               <div className={`message-text ${speaks === 'bot' ? 'bot' : 'user'}`}>{text}</div>
            </div>
         )}
         <div className={`message-quick-replies ${!isVisible && 'd-none'}`}>{payload && renderQuickReplies(payload)}</div>
      </>
   );
};

export default QuickReplies;
