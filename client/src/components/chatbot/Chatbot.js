import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Cookies from 'universal-cookie';

import Message from './Message';
import chathead from '../../assets/Anna_Chathead.svg';
import '../../styles/chatbot.css';
import { MdClose, MdSend } from 'react-icons/md';
import Modal from '../Modal';

const cookies = new Cookies();

const Chatbot = () => {
   const [messages, setMessages] = useState([
      {
         speaks: 'bot',
         keyword: 'terms-conditions',
         msg: {
            text: {
               text: 'Hello. Before we begin, in this session I will take your basic information. You must first read and agreed on the terms presented in the',
            },
         },
      },
   ]);
   const [textMessage, setTextMessage] = useState('');
   const [isAgreeTermsConditions, setIsAgreeTermsConditions] = useState(false);
   const [showBot, setShowbot] = useState(true);
   const messageEnd = useRef(null);

   // if cookies does not exist set cookies else do nothing, cookies path = '/ - accessible to all pages
   if (!cookies.get('userId')) cookies.set('userId', uuid(), { path: '/' });

   const df_text_query = async text => {
      let userSays = {
         speaks: 'user',
         msg: {
            text: {
               text: text,
            },
         },
      };

      setMessages(prev => [...prev, userSays]);

      const body = { text, userId: cookies.get('userId') };
      const response = await fetch('/api/df_text_query', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(body),
      });
      const data = await response.json();

      data.fulfillmentMessages.forEach(msg => {
         const botSays = {
            speaks: 'bot',
            msg: msg,
         };
         setMessages(prev => [...prev, botSays]);
      });
   };

   const df_event_query = async event => {
      const body = { event, userId: cookies.get('userId') };
      const response = await fetch('/api/df_event_query', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(body),
      });
      const data = await response.json();

      data.fulfillmentMessages.forEach(msg => {
         const botSays = {
            speaks: 'bot',
            msg: msg,
         };
         setMessages(prev => [...prev, botSays]);
      });
   };

   const send = e => {
      e.preventDefault();
      df_text_query(textMessage);
      setTextMessage('');
   };

   const renderMessage = (message, i) => {
      if (message.msg && message.msg.text && message.msg.text.text) {
         return (
            <Message key={i} keyword={message.keyword} terms={message.terms && message.terms} speaks={message.speaks} text={message.msg.text.text} />
         );
      }
   };

   const renderMessages = messages => {
      if (messages && messages.length > 0) {
         return messages.map((message, i) => {
            return renderMessage(message, i);
         });
      } else return null;
   };

   const handleTermsConditionAgree = () => {
      df_event_query('Welcome');
      setIsAgreeTermsConditions(true);
   };

   useEffect(() => {
      if (messageEnd.current) messageEnd.current.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   useEffect(() => {
      if (cookies.get('termsCondition') !== '' && cookies.get('termsCondition') !== 'false') setIsAgreeTermsConditions(false);
      else setIsAgreeTermsConditions(true);
   }, []);

   return (
      <>
         {showBot ? (
            <div className='chatbot'>
               {/* chatbot header */}
               <div className='chatbot-header d-flex justify-content-between align-items-center bg-primary'>
                  <div>
                     <img className='chatbot-avatar' src={chathead} alt='chathead' />
                     <h2 className='ms-2 h6 d-inline custom-heading'>Anna</h2>
                  </div>
                  <MdClose className='chatbot-close' onClick={() => setShowbot(false)} />
               </div>
               {/* chatbot messages */}
               <div className='chatbot-messages'>
                  {renderMessages(messages)}
                  <div ref={messageEnd}></div>
               </div>
               {/* text-input */}
               <form className='chatbot-text-input' onSubmit={send}>
                  <input value={textMessage} type='text' placeholder='Your answer here...' onChange={e => setTextMessage(e.target.value)} />
                  <button className='btn p-0 chatbot-send' disabled={!textMessage ? true : false} type='submit'>
                     <MdSend className='chatbot-send text-primary' />
                  </button>
               </form>
            </div>
         ) : (
            <img className='chathead' src={chathead} alt='chathead' onClick={() => setShowbot(true)} />
         )}

         <Modal title='Terms and Conditions' target='modal-terms-conditions' size='modal-lg'>
            <p>Terms and Conditions</p>

            <div className='form-check'>
               <input
                  className='form-check-input'
                  onChange={() => handleTermsConditionAgree()}
                  data-bs-dismiss='modal'
                  type='checkbox'
                  value=''
                  id='terms-conditions-check'
               />
               <label className='form-check-label' htmlFor='terms-conditions-check'>
                  Agree
               </label>
            </div>
         </Modal>
      </>
   );
};

export default Chatbot;
