const Card = ({ payload }) => {
   return (
      <div className='card-container'>
         <div className='card'>
            <div className='card-body'>
               <video className='card-video' controls>
                  <source src={payload.fields.link.stringValue} type='video/mp4' />
               </video>
               <h5 className='card-title' title={payload.fields.title.stringValue}>
                  {payload.fields.title.stringValue}
               </h5>
            </div>
         </div>
      </div>
   );
};

export default Card;
