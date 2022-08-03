import React, { useEffect, useContext } from 'react';
import { ChatbotContext } from '../../context/ChatbotContext';

const QuickReply = ({ reply, click }) => {
   const { setDisabledInput } = useContext(ChatbotContext);

   useEffect(() => {
      setDisabledInput(true); // when quickReplies rendered not allow user to type text in text input
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
