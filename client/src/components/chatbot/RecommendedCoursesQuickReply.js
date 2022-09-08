import { ChatbotContext } from '../../context/ChatbotContext';
import { useEffect, useContext } from 'react';

const RecommendedCoursesQuickReply = ({ basis, payload }) => {
   const { setDisabledInput, setBasis, setIsVisibleInput } = useContext(ChatbotContext);

   useEffect(() => {
      setDisabledInput(true); // when quickReplies rendered not allow user to type text in text input
      setIsVisibleInput(false);
   }, []);

   return (
      <>
         <div className='message-quick-replies'>
            <button
               className='btn btn-outline-primary message-quick-reply-btn m-1 rounded-pill px-3'
               type='button'
               data-bs-toggle='modal'
               data-bs-target='#modal-recommended-courses-info'
               onClick={() => setBasis(basis === 'riasec' ? 'riasec' : 'strand')}
            >
               {payload[0].structValue.fields.text.stringValue}
            </button>
         </div>
      </>
   );
};

export default RecommendedCoursesQuickReply;
