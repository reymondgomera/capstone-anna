import { MdClose } from 'react-icons/md';

const Modal = ({ target, title, size, children, resetState }) => {
   return (
      <div className='modal fade' id={target} data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1'>
         <div className={`modal-dialog modal-dialog-scrollable ${size}`}>
            <div className='modal-content'>
               <div className='modal-header bg-primary'>
                  <h5 className='modal-title'>{title}</h5>
                  <button className='btn-link' data-bs-dismiss='modal' onClick={resetState}>
                     <MdClose className='icon-small text-white' />
                  </button>
               </div>
               <div className='modal-body'>{children}</div>
            </div>
         </div>
      </div>
   );
};

export default Modal;
