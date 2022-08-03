const Modal = ({ target, title, size, children }) => {
   return (
      <div className='modal' id={target} tabIndex='-1'>
         <div className={`modal-dialog ${size}`}>
            <div className='modal-content'>
               <div className='modal-header bg-primary'>
                  <h5 className='modal-title'>{title}</h5>
               </div>
               <div className='modal-body'>{children}</div>
            </div>
         </div>
      </div>
   );
};

export default Modal;
