import React from 'react';

const Card = ({ payload }) => {
   return (
      <div className='card-container'>
         <div className='card'>
            <div className='card-body'>
               <video
                  className='card-video'
                  controls
                  poster='https://firebasestorage.googleapis.com/v0/b/capstone-anna-chatbot.appspot.com/o/degree-program-options%2Fthumbnail.png?alt=media&token=6a7b4201-24ef-4ece-971e-d31243110287'
               >
                  <source src={payload.fields.link.stringValue} type='video/mp4' />
               </video>
               <h5 className='card-title'>{payload.fields.title.stringValue}</h5>
            </div>
         </div>
      </div>
   );
};

export default Card;
