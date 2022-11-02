import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { MdOutlineAdd, MdEdit, MdDelete, MdInfo, MdCheck, MdClose } from 'react-icons/md';

import Modal from '../Modal';

const Strand = ({ fetchStrandsForInputs, fetchCourses }) => {
   const isMounted = useRef(false);
   const [strand, setStrand] = useState([]);

   const [name, setName] = useState('');
   const [updatedName, setUpdatedName] = useState();
   const [isUpdate, setIsUpdate] = useState(false);
   const [isDelete, setIsDelete] = useState(false);

   const [isLoading, setIsLoading] = useState(false);
   const [selectedRow, setSelectedRow] = useState('');

   const reset = () => {
      setName('');
      setSelectedRow('');
      setUpdatedName('');
      setIsDelete(false);
      setIsUpdate(false);
   };

   const handleUpdateClick = strand => {
      setIsUpdate(true);
      setIsDelete(false);
      setSelectedRow(strand);
      setUpdatedName(strand.name);
   };
   const handleDeleteClick = strand => {
      setIsDelete(true);
      setIsUpdate(false);
      setSelectedRow(strand);
   };

   const handleStrandActions = () => {
      if (isUpdate && updatedName && updatedName.toLowerCase() !== selectedRow.name.toLowerCase()) handleUpdateSubmit(selectedRow._id);
      if (isDelete) handleDeleteSubmit(selectedRow._id);
   };

   const handleNameChange = e => {
      if (/^[a-zA-Z\-&\s]*$/.test(e.target.value)) setName(e.target.value.slice(0, 50));
   };
   const handleUpdatedNameChange = e => {
      if (/^[a-zA-Z\-&\s]*$/.test(e.target.value)) setUpdatedName(e.target.value.slice(0, 50));
   };

   const fetchStrand = async () => {
      try {
         setIsLoading(true);
         const DEFAULT_STRAND = ['ABM', 'ARTS & DESIGN', 'HUMSS', 'STEM', 'GAS'];

         const response = await fetch('/admin/strands', {
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (isMounted.current && response.status === 200) {
            setStrand(data.filter(s => !DEFAULT_STRAND.includes(s.name)));
            // setStrand(data);
            setIsLoading(false);
         } else {
            setIsLoading(false);
            toast.error(data.message);
         }
      } catch (err) {
         console.error(err.message);
      }
   };

   const handleAddSubmit = async () => {
      try {
         const response = await fetch('/admin/strands', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
            body: JSON.stringify({ name }),
         });
         const data = await response.json();

         if (response.status === 200 && data.strand) {
            reset();
            fetchStrand();
            fetchStrandsForInputs();
            toast.success(data.message);
         } else toast.error(data.message);
      } catch (err) {
         console.error(err.message);
      }
   };

   const handleDeleteSubmit = async strandId => {
      try {
         const response = await fetch(`/admin/strands/${strandId}`, {
            method: 'DELETE',
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (response.status === 200 && data.strand) {
            reset();
            fetchStrand();
            fetchStrandsForInputs();
            toast.success(data.message);
         } else toast.error(data.message);
      } catch (err) {
         console.error(err.message);
      }
   };

   const handleUpdateSubmit = async strandId => {
      try {
         const body = { name: updatedName, strandId };
         const response = await fetch('/admin/strands', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
            body: JSON.stringify(body),
         });
         const data = await response.json();

         if (response.status === 200) {
            reset();
            fetchStrand();
            fetchStrandsForInputs();
            fetchCourses(1);
            toast.success(data.message);
         } else toast.error(data.message);
      } catch (err) {
         console.error(err.message);
      }
   };

   useEffect(() => {
      isMounted.current = true;
      fetchStrand();

      return () => {
         isMounted.current = false;
      };
   }, []);

   return (
      <Modal title='Manage Strand' target='modal-manage-strand' size='modal-lg' resetState={reset}>
         <div className='position-relative'>
            <div className='mb-3'>
               <div className='d-flex align-items-center mb-1'>
                  <div className='input-group me-2'>
                     <input
                        className='form-control'
                        value={name}
                        type='text'
                        placeholder='Strand Name'
                        id='name'
                        name='name'
                        maxLength='50'
                        onChange={handleNameChange}
                     />
                     <button className='btn btn-primary  me-2' disabled={name ? false : true} onClick={() => handleAddSubmit()}>
                        <MdOutlineAdd className='icon-small' />
                     </button>
                  </div>
                  <small>{name.length}/50</small>
               </div>
               <div className='d-flex flex-column'>
                  <small>
                     <MdInfo className='me-2' style={{ fontSize: '15px', minWidth: '15px' }} />
                     {`Only letters, hyphen(-), ampersand (&) and maximum of 50 characters are allowed for strand's name. `}
                  </small>
                  <small>
                     <MdInfo className='me-2' style={{ fontSize: '15px', minWidth: '15px' }} />
                     {`Chatbot Anna will be able to recognize the added strands.`}
                  </small>
               </div>
            </div>
            {!isLoading ? (
               strand && strand.length > 0 ? (
                  <ul className='list-group list-group-flush overflow-auto' style={{ height: '400px' }}>
                     {strand.map(s => (
                        <li key={s._id} className='w-100 d-flex align-items-center text-wrap list-group-item'>
                           <div style={{ width: '80%' }}>
                              {!isUpdate ? (
                                 s.name
                              ) : selectedRow._id === s._id ? (
                                 <div className='d-flex align-items-center'>
                                    <input
                                       className='form-control me-2'
                                       value={updatedName}
                                       type='text'
                                       placeholder='Strand Name'
                                       id='name'
                                       name='name'
                                       maxLength='50'
                                       onChange={handleUpdatedNameChange}
                                    />
                                    <small>{updatedName.length}/50</small>
                                 </div>
                              ) : (
                                 s.name
                              )}
                           </div>
                           <div className='d-flex justify-content-end' style={{ width: '20%' }}>
                              {!selectedRow ? (
                                 <>
                                    <MdEdit className='icon-small hover-primary me-2 cursor' onClick={() => handleUpdateClick(s)} />
                                    <MdDelete className='icon-small hover-primary cursor' onClick={() => handleDeleteClick(s)} />
                                 </>
                              ) : selectedRow._id === s._id ? (
                                 <>
                                    <MdCheck
                                       className={`icon-small hover-primary me-2 ${
                                          selectedRow.name.toLowerCase() === (updatedName && updatedName.toLowerCase()) || (!updatedName && !isDelete)
                                             ? 'text-grey'
                                             : 'cursor'
                                       }`}
                                       onClick={() => handleStrandActions()}
                                    />
                                    <MdClose className='icon-small hover-primary cursor' onClick={() => reset()} />
                                 </>
                              ) : (
                                 <>
                                    <MdEdit className='icon-small hover-primary me-2 cursor' onClick={() => handleUpdateClick(s)} />
                                    <MdDelete className='icon-small hover-primary cursor' onClick={() => handleDeleteClick(s)} />
                                 </>
                              )}
                           </div>
                        </li>
                     ))}
                  </ul>
               ) : (
                  <div className='text-center py-4'>No data to display</div>
               )
            ) : (
               <div className='text-center py-4'>
                  <div className='spinner-border spinner-sm text-primary' role='status'></div>
               </div>
            )}
         </div>
      </Modal>
   );
};

export default Strand;
