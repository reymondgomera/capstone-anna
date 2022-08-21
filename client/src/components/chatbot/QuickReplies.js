import QuickReply from './QuickReply';
import { ChatbotContext } from '../../context/ChatbotContext';
import { useContext } from 'react';

const QuickReplies = ({ replyClick, payload, messages, setMessages }) => {
   const { setDisabledInput } = useContext(ChatbotContext);

   const removeQuickRepliesAfterClick = (messages, setMessages) => {
      const allMessages = messages;
      messages.pop();
      setMessages(allMessages);
   };

   const handleClick = (e, payload, text) => {
      removeQuickRepliesAfterClick(messages, setMessages);
      replyClick(e, payload, text);
      setDisabledInput(false);
   };

   const renderQuickReplies = quickReplies => {
      if (quickReplies) {
         return quickReplies.map((reply, i) => <QuickReply key={i} click={handleClick} reply={reply} />);
      } else return null;
   };

   return (
      <>
         {/* quick replies will now only have quick replies, dont have text */}
         {/* {text && (
            <div className={`message ${speaks !== 'bot' && 'user'}`}>
               {speaks === 'bot' && (
                  <div>
                     <img className='chatbot-avatar message-avatar' src={chatbotAvatar} alt='chathead' />
                  </div>
               )}
               <div className={`message-text ${speaks === 'bot' ? 'bot' : 'user'}`}>{text}</div>
            </div>
         )} */}
         <div className='message-quick-replies'>{payload && renderQuickReplies(payload)}</div>
      </>
   );
};

export default QuickReplies;
