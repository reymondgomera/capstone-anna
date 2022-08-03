import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Cookies from 'universal-cookie';

import Message from './Message';
import Card from './Card';
import chathead from '../../assets/Anna_Chathead.svg';
import chatbotAvatar from '../../assets/Anna_Chat_Avatar.svg';
import '../../styles/chatbot.css';
import { MdClose, MdSend } from 'react-icons/md';
import Modal from '../Modal';
import { ChatbotContext } from '../../context/ChatbotContext';
import QuickReplies from './QuickReplies';

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
   const [disabledInput, setDisabledInput] = useState(false);
   const messagesRef = useRef(null);

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

      data.fulfillmentMessages.forEach(async msg => {
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

      data.fulfillmentMessages.forEach(async msg => {
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

   const renderCards = cards => {
      return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
   };

   const renderMessage = (message, i) => {
      if (message.msg && message.msg.text && message.msg.text.text) {
         return (
            <Message key={i} keyword={message.keyword} terms={message.terms && message.terms} speaks={message.speaks} text={message.msg.text.text} />
         );
      } else if (message.msg && message.msg.payload.fields.cards) {
         return (
            <div className='message-cards' key={i}>
               <img className='chatbot-avatar message-avatar' src={chatbotAvatar} alt='chathead' />
               <div className='cards'>
                  <div style={{ width: message.msg.payload.fields.cards.listValue.values.length * 270 }}>
                     {renderCards(message.msg.payload.fields.cards.listValue.values)}
                  </div>
               </div>
            </div>
         );
      } else if (message.msg && message.msg.payload && message.msg.payload.fields && message.msg.payload.fields.quick_replies) {
         return (
            <QuickReplies
               key={i}
               text={message.msg.payload.fields.text ? message.msg.payload.fields.text.stringValue : null}
               replyClick={handleQuickReplyPayload}
               speaks={message.speaks}
               payload={message.msg.payload.fields.quick_replies.listValue.values}
            />
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

   const handleQuickReplyPayload = (e, payload, text) => {
      e.preventDefault(); // will only work for <a> tag or buttons submit
      e.stopPropagation(); // will only work for <a> tag or buttons submit

      switch (payload) {
         case 'DEGREE_PROGRAMS_OPTIONS_YES':
            let humanSays = {
               speaks: 'user',
               msg: {
                  text: {
                     text: text,
                  },
               },
            };

            setMessages(prev => [...prev, humanSays]);
            df_event_query('DEGREE_PROGRAMS_OPTIONS_YES');
            break;

         default:
            df_text_query(text);
            break;
      }
   };

   const resolveAfterXSeconds = x => {
      return new Promise(resolve => {
         setTimeout(() => {
            resolve(x);
         }, x * 1000);
      });
   };

   const handleTermsConditionAgree = () => {
      df_event_query('Welcome');
      setIsAgreeTermsConditions(true);
   };

   useEffect(() => {
      // element.scrollTop = element.scrollHeight - element is the container of message
      // for automatic scoll when new message -> messagesRef.current.scrollTop = messagesRef.current.scrollHeight
      // for smooth scrolling, added scroll-behavior: smooth in css for chatbot-messaes class
      if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      // if (messagesRef.current) messagesRef.current.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   useEffect(() => {
      if (cookies.get('termsCondition') !== '' && cookies.get('termsCondition') !== 'false') setIsAgreeTermsConditions(false);
      else setIsAgreeTermsConditions(true);
   }, []);

   return (
      <ChatbotContext.Provider value={{ setDisabledInput }}>
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
               <div ref={messagesRef} className='chatbot-messages'>
                  {renderMessages(messages)}
                  {/* <div ref={messageEnd}></div> */}
               </div>
               {/* text-input */}
               <form className='chatbot-text-input' onSubmit={send}>
                  <input
                     disabled={!isAgreeTermsConditions || disabledInput ? true : false}
                     value={textMessage}
                     type='text'
                     placeholder='Your answer here...'
                     onChange={e => setTextMessage(e.target.value)}
                  />
                  <button className='btn p-0 chatbot-send' disabled={!textMessage ? true : false} type='submit'>
                     <MdSend className='chatbot-send text-primary' />
                  </button>
               </form>
            </div>
         ) : (
            <img className='chathead' src={chathead} alt='chathead' onClick={() => setShowbot(true)} />
         )}

         <Modal title='Terms and Conditions' target='modal-terms-conditions' size='modal-lg'>
            <div className='p-2'>
               <p className='mb-1'>
                  As you converse with Anna, you are to agree to bounded by these terms and conditions: Your responses to Anna will be recorded and be
                  used for analysis. You agree that the information you provided in this study will include your basic information (Name, Age, Sex)
                  and senior high school strand for these information will be necessary for identification and for the recommendation of degree
                  programs.
               </p>
            </div>

            <div className='p-2'>
               <h1 className='h5 custom-heading text-primary'>CONFIDENTIALITY</h1>
               <p>
                  The information that Anna will be obtaining througout the conversation will remain confidential to protect your rights or welfare.
               </p>
               <p className='mb-1'>
                  RA 10173 or the Data Privacy Act protects individuals from unauthorized processing of personal information. To ensure that your
                  information protected, The researchers will follow this law to keep your information safe and confidential.
               </p>
            </div>

            <div className='p-2'>
               <h1 className='h5 custom-heading text-primary'>DEFINITIONS</h1>
               <p>
                  Throughout the conversation, Anna will be responding to possible jargons. To ensure that you understand Anna, the definition of
                  words will be provided:
               </p>
               <p className='mb-1'>
                  <span className='fw-bold'>Degree Program</span> - A class that a college of university offers to students. (Bachelor in science in
                  Information Technology, etc..)
               </p>
               <p className='mb-1'>
                  <span className='fw-bold'>RIASEC</span> - A personality test that asks about your interest, skills, ability, and aspirations which
                  will help you decide on what career to pursue based on these attributes.
               </p>
               <p className='mb-1'>
                  <span className='fw-bold'>Senior high school strand</span> - Disciplines that are offered by schools to senior high school students
                  that would prepare them for college.
               </p>
            </div>

            <div></div>

            <div className='form-check m-2'>
               <input
                  className='form-check-input'
                  onChange={() => handleTermsConditionAgree()}
                  data-bs-dismiss='modal'
                  type='checkbox'
                  value=''
                  id='terms-conditions-check'
               />
               <label className='form-check-label fw-bold' htmlFor='terms-conditions-check'>
                  I Agree to the Terms and Conditions
               </label>
            </div>

            <div className='mt-3 float-end'>
               <button className='btn btn-primary' data-bs-dismiss='modal'>
                  Close
               </button>
            </div>
         </Modal>
      </ChatbotContext.Provider>
   );
};

export default Chatbot;
