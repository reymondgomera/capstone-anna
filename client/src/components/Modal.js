import React from 'react';

const Modal = ({ target, title, size, children }) => {
   return (
      <div className='modal' id={target} tabIndex='-1'>
         <div className={`modal-dialog ${size}`}>
            <div className='modal-content'>
               <div className='modal-header'>
                  <h5 className='modal-title'>{title}</h5>
                  <button type='button' className='btn-close' data-bs-dismiss='modal'></button>
               </div>
               <div className='modal-body'>{children}</div>
            </div>
         </div>
      </div>
   );
};

export default Modal;
