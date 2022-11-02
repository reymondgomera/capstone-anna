import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdArrowBack } from 'react-icons/md';

const ConversationDetails = () => {
   const navigate = useNavigate();
   const isMounted = useRef(false);
   const { conversationId } = useParams();
   const [conversation, setConversation] = useState();
   const [isLoading, setisLoading] = useState(false);

   const fetchConversation = async () => {
      try {
         setisLoading(true);
         const response = await fetch(`/admin/conversations/${conversationId}`, {
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (isMounted.current && response.status === 200) {
            setConversation(data.conversation);
            setisLoading(false);
         } else toast.error(data.message);
      } catch (err) {
         console.error(err.message);
      }
   };

   useEffect(() => {
      isMounted.current = true;
      fetchConversation();

      return () => {
         isMounted.current = false;
      };
   }, []);

   return (
      <div className='admin-contents position-relative w-100 p-4'>
         {!isLoading ? (
            conversation && (
               <div>
                  <MdArrowBack className='icon-medium text-primary cursor' onClick={() => navigate(-1)} />
                  <div className='d-flex mt-4 flex-wrap'>
                     <div className='me-4'>
                        <div className='fs-5'>Student Name</div>
                        <div className='mt-2'>
                           <h2 className='h5 fw-bold'>{conversation.name}</h2>
                        </div>
                     </div>
                     <div className='me-4'>
                        <div className='fs-5'>Age</div>
                        <div className='mt-2'>
                           <h2 className='h5 fw-bold'>{conversation.age}</h2>
                        </div>
                     </div>
                     <div className='me-4'>
                        <div className='fs-5'>Sex</div>
                        <div className='mt-2'>
                           <h2 className='h5 fw-bold'>{conversation.sex}</h2>
                        </div>
                     </div>
                     <div className='me-4'>
                        <div className='fs-5'>Strand</div>
                        <div className='mt-2'>
                           <h2 className='h5 fw-bold'>{conversation.strand}</h2>
                        </div>
                     </div>
                  </div>
                  <div className='d-flex flex-wrap mt-3 align-items-center'>
                     <div className='fs-5 me-4 mt-4'>RIASEC Code</div>
                     <div className='d-flex flex-wrap'>
                        {/* if first riasec_code's score is zero (0) display "N/A" */}
                        {conversation.riasec_code[0][1] && conversation.riasec_code.length > 0 ? (
                           conversation.riasec_code.map((code, i) =>
                              code[1] ? (
                                 <div key={i} className='bg-primary fw-bold rounded p-3 text-center me-4 mt-4'>
                                    <div>{code[0].toUpperCase()}</div>
                                    <div className='h4 mt-2'>{code[1]}</div>
                                 </div>
                              ) : (
                                 <div key={i}></div>
                              )
                           )
                        ) : (
                           <div className='bg-primary fw-bold rounded p-3 text-center'>N/A</div>
                        )}
                     </div>
                  </div>
                  <h1 className='mt-5 h5'>Suggestion of Anna</h1>
                  <div>
                     <div className='d-flex flex-wrap'>
                        <div className='mt-4 me-4'>
                           <div className='fs-5 mb-2'>RIASEC</div>
                           <div className='bg-grey rounded p-3 conversation-recommendation-container'>
                              {conversation.riasec_course_recommendation.length > 0 ? (
                                 <ul className='mb-0 ps-3'>
                                    {conversation.riasec_course_recommendation.map((course, i) => (
                                       <li key={i}>{course}</li>
                                    ))}
                                 </ul>
                              ) : (
                                 'N/A'
                              )}
                           </div>
                        </div>
                        <div className='mt-4'>
                           <div className='fs-5 mb-2'>Strand</div>
                           <div className='bg-grey rounded p-3 conversation-recommendation-container'>
                              {conversation.strand_course_recommendation.length > 0 ? (
                                 <ul className='mb-0 ps-3'>
                                    {conversation.strand_course_recommendation.map((course, i) => (
                                       <li key={i}>{course}</li>
                                    ))}
                                 </ul>
                              ) : (
                                 'N/A'
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )
         ) : (
            <div className='position-absolute top-50 start-50 translate-middle'>
               <div className='spinner-border spinner-lg text-primary' role='status'></div>
            </div>
         )}
      </div>
   );
};

export default ConversationDetails;
