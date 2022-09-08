import React, { useEffect, useContext } from 'react';
import { ChatbotContext } from '../../context/ChatbotContext';

const QuickReply = ({ reply, click, isRiasecQuickReplies }) => {
   const { setDisabledInput, setIsVisibleInput } = useContext(ChatbotContext);

   useEffect(() => {
      // only disable input and make invisible the input and send button when its not a quick_reply of riasec-question
      if (!isRiasecQuickReplies) {
         setDisabledInput(true); // when quickReplies rendered not allow user to type text in text input
         setIsVisibleInput(false);
      }
   }, []);

   return (
      <a
         href='/'
         className='btn btn-outline-primary message-quick-reply-btn m-1 rounded-pill px-3'
         onClick={e => click(e, reply.structValue.fields.payload.stringValue, reply.structValue.fields.text.stringValue)}
      >
         {reply.structValue.fields.text.stringValue}
      </a>
   );
};

export default QuickReply;
