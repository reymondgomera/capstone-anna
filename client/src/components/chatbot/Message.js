import '../../styles/chatbot.css';
import chathead from '../../assets/Anna_Chat_Avatar.svg';

const Message = ({ keyword, speaks, text }) => {
   return (
      <>
         <div className={`message ${speaks !== 'bot' && 'user'}`}>
            {speaks === 'bot' && (
               <div>
                  <img className='chatbot-avatar message-avatar' src={chathead} alt='chathead' />
               </div>
            )}
            <div className={`message-text ${speaks === 'bot' ? 'bot' : 'user'}`}>
               {text}{' '}
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
