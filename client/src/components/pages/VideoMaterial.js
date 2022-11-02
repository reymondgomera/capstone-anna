import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdSearch, MdRemoveRedEye, MdOutlineAdd, MdEdit, MdDelete } from 'react-icons/md';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

import ContentNavbar from './ContentNavbar';
import DataTableBase from '../DataTableBase';
import '../../styles/datatablebase.css';
import Modal from '../Modal';

const VideoMaterial = () => {
   const isMounted = useRef(false);
   const [videoMaterials, setVideoMaterials] = useState([]);
   const [searchKey, setSearchKey] = useState('');

   const [isLoading, setisLoading] = useState(false);
   const [totalRows, setTotalRows] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [sort, setSort] = useState('');
   const [order, setOrder] = useState('');
   const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
   const sortRef = useRef(null);

   const [inputs, setInputs] = useState({ title: '' });
   const [videos, setVideos] = useState([]);
   const [progress, setProgress] = useState(0);
   const [isUploading, setIsUploading] = useState(false);
   const addVideoMaterialFormRef = useRef();
   const addVideoMaterialFileInputRef = useRef();
   const updateVideoMaterialFormRef = useRef();
   const updateVideoMaterialFileInputRef = useRef();
   const [selectedRow, setSelectedRow] = useState({});
   const { title } = inputs;

   const handleInputChange = e => {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
   };

   const handleSelectedFile = e => {
      setVideos([...e.target.files]);
   };

   const reset = () => {
      setProgress(0);
      setVideos([]);
      setInputs({ title: '' });
      setSelectedRow({});
      addVideoMaterialFileInputRef.current.value = '';
      addVideoMaterialFormRef.current.classList.remove('was-validated');
      updateVideoMaterialFileInputRef.current.value = '';
      updateVideoMaterialFormRef.current.classList.remove('was-validated');
   };

   const handleSelectedRow = row => {
      setSelectedRow(row);
      setInputs(prev => ({ ...prev, title: row.title }));
   };

   const handleDeleteSubmit = async e => {
      e.preventDefault();
      setisLoading(true);

      try {
         if (videoMaterials.length > 1) {
            // delete the file indide the <folder_name> in the storage
            const deleteStorageRef = ref(storage, ref(storage, selectedRow.url).fullPath);

            deleteObject(deleteStorageRef)
               .then(async () => {
                  // after file was deleted, delete document in database
                  const response = await fetch(`/admin/video-materials/${selectedRow._id}`, {
                     method: 'DELETE',
                     headers: { token: localStorage.getItem('token') },
                  });
                  const data = await response.json();

                  if (response.status === 200) {
                     reset();
                     fetchVideoMaterials(1);
                     toast.success(data.message);
                  } else toast.error(data.message);
               })
               .catch(err => console.error(err.message));
         } else {
            setisLoading(false);
            toast.error("Delete operation can't be completed!");
         }
      } catch (err) {
         console.error(err.message);
      }
   };

   const handleUpdateSubmit = async e => {
      e.preventDefault();
      e.target.className += ' was-validated';

      try {
         if (!title) {
            toast.error('Please complete the required field!');
            return;
         }
         if (title && videos.length === 0) {
            try {
               const row = selectedRow;
               const response = await fetch('/admin/video-materials', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
                  body: JSON.stringify({ title, videoMaterialId: selectedRow._id }),
               });
               const data = await response.json();

               if (response.status === 200) {
                  reset();
                  fetchVideoMaterials(1);
                  setSelectedRow({ ...row, title });
                  setInputs(prev => ({ ...prev, title }));
                  toast.success(data.message);
               } else toast.error(data.message);
            } catch (err) {
               console.error(err.message);
            }
         } else if (title && videos.length === 1) {
            if (!videos[0].type.includes('video/')) {
               toast.error('Invalid file type!');
               return;
            }

            const deleteStorageRef = ref(storage, ref(storage, selectedRow.url).fullPath);
            // delete the video file inside the <folder_name> in the storage
            deleteObject(deleteStorageRef)
               .then(() => {
                  // after the file was deleted, upload file
                  setIsUploading(true);
                  const id = selectedRow._id;
                  const videoFile = videos[0];
                  const storageRef = ref(storage, `degree-program-options/${id}/${videoFile.name}`);
                  const uploadTask = uploadBytesResumable(storageRef, videoFile);

                  uploadTask.on(
                     'state_changed',
                     snapshot => setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
                     err => toast.error('Error occured while uploading the file!'),
                     () => {
                        // get the download URL then update the added video material document
                        getDownloadURL(storageRef).then(async downloadURL => {
                           try {
                              const row = selectedRow;
                              const body = {
                                 title: !((selectedRow.title && selectedRow.title.toLowerCase()) === (title && title.toLowerCase()))
                                    ? title
                                    : undefined,
                                 videoMaterialId: id,
                                 url: downloadURL,
                              };
                              const response = await fetch('/admin/video-materials', {
                                 method: 'PUT',
                                 headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
                                 body: JSON.stringify(body),
                              });

                              const data = await response.json();

                              if (response.status === 200) {
                                 reset();
                                 setIsUploading(false);
                                 fetchVideoMaterials(1);
                                 setSelectedRow({ ...row, title, url: downloadURL });
                                 setInputs(prev => ({ ...prev, title }));
                                 toast.success(data.message);
                              } else toast.error(data.message);
                           } catch (err) {
                              console.error(err.message);
                           }
                        });
                     }
                  );
               })
               .catch(err => err.message);
         }
      } catch (err) {
         console.error(err.message);
      }
   };

   const handleAddSubmit = async e => {
      e.preventDefault();
      e.target.className += ' was-validated';

      try {
         if (title && videos.length === 1) {
            if (!videos[0].type.includes('video/')) {
               toast.error('Invalid file type!');
               return;
            }

            // add first the document, after adding make storageRef with the document id
            try {
               const body = { title, url: 'N/A' };
               const response = await fetch('/admin/video-materials', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
                  body: JSON.stringify(body),
               });
               const data = await response.json();

               if (response.status === 200) {
                  // upload file
                  setIsUploading(true);
                  const id = data.videoMaterial._id;
                  const videoFile = videos[0];
                  const storageRef = ref(storage, `degree-program-options/${id}/${videoFile.name}`);
                  const uploadTask = uploadBytesResumable(storageRef, videoFile);

                  uploadTask.on(
                     'state_changed',
                     snapshot => setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
                     err => toast.error('Error occured while uploading the file!'),
                     () => {
                        // get the download URL then update the added video material document
                        getDownloadURL(storageRef).then(async downloadURL => {
                           try {
                              const body = { videoMaterialId: id, url: downloadURL };
                              const response = await fetch('/admin/video-materials', {
                                 method: 'PUT',
                                 headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
                                 body: JSON.stringify(body),
                              });

                              const data = await response.json();

                              if (response.status === 200) {
                                 reset();
                                 setIsUploading(false);
                                 fetchVideoMaterials(1);
                                 toast.success('Video Material created successfully!');
                              } else toast.error(data.message);
                           } catch (err) {
                              console.error(err.message);
                           }
                        });
                     }
                  );
               } else toast.error(data.message);
            } catch (err) {
               console.error(err.message);
            }
         } else toast.error('Please complete all required fields!');
      } catch (err) {
         console.error(err.message);
      }
   };

   const search = e => {
      e.preventDefault();
      fetchVideoMaterials(1);
      setResetPaginationToggle(prev => !prev);
   };

   const handleSort = async (column, sortDirection) => {
      // plus(+) to convert date to timestamp date
      // workaround for react-data-table bug: onChangePage trigger when doing onSort to other page expcept page 1
      sortRef.current = +new Date();

      try {
         setisLoading(true);

         const response = await fetch(
            `/admin/video-materials?page=${1}&size=${rowsPerPage}&search=${searchKey}&sort=${column.sortField}&order=${sortDirection}`,
            {
               headers: { token: localStorage.getItem('token') },
            }
         );
         const data = await response.json();

         if (response.status === 200) {
            setVideoMaterials(data.videoMaterials);
            setTotalRows(data.total);
            setSort(column.sortField);
            setOrder(sortDirection);
            setResetPaginationToggle(prev => !prev);
            setisLoading(false);
         } else toast.error(data.message);
      } catch (err) {
         console.error(err.message);
      }
   };

   const fetchVideoMaterials = async page => {
      try {
         setisLoading(true);

         const response = await fetch(`/admin/video-materials?page=${page}&size=${rowsPerPage}&search=${searchKey}&sort=${sort}&order=${order}`, {
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (isMounted.current && response.status === 200) {
            setVideoMaterials(data.videoMaterials);
            setTotalRows(data.total);
            setisLoading(false);
         } else toast.error(data.message);
      } catch (err) {
         console.error(err.message);
      }
   };

   const handlePageChange = page => {
      // plus(+) to convert date to timestamp date
      // workaround for react-data-table bug: onChangePage trigger when doing onSort to other page expcept page 1
      // only trigger onChangePage when Page change and not other way around
      const now = +new Date();
      if (now - sortRef.current < 500) return;
      fetchVideoMaterials(page);
   };

   const handleRowsPerPageChange = async (newPerPage, page) => {
      try {
         setisLoading(true);

         const response = await fetch(`/admin/video-materials?page=${page}&size=${newPerPage}&search=${searchKey}&sort=${sort}&order=${order}`, {
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (response.status === 200) {
            setVideoMaterials(data.videoMaterials);
            setRowsPerPage(newPerPage);
            setisLoading(false);
         } else toast.error(data.message);
      } catch (err) {
         console.error(err.message);
      }
   };

   const columns = [
      {
         name: 'Date',
         selector: row => row.createdAt,
         format: row => moment(row.createdAt).format('L'),
         sortable: true,
         sortField: 'createdAt',
         maxWidth: '10vw',
      },
      {
         name: 'Title',
         selector: row => row.title,
         sortable: true,
         sortField: 'title',
         maxWidth: '70vw',
      },
      {
         name: 'Actions',
         maxWidth: '20vw',
         center: true,
         cell: row => (
            <>
               <a className='me-1' href={row.url} target='_blank' rel='noopener noreferrer'>
                  <MdRemoveRedEye className='actions-btn' />
               </a>
               <a
                  className='me-1'
                  href='#'
                  data-bs-toggle='modal'
                  data-bs-target='#modal-update-video-material'
                  onClick={() => handleSelectedRow(row)}
               >
                  <MdEdit className='actions-btn' />
               </a>
               <a
                  className='me-1'
                  href='#'
                  data-bs-toggle='modal'
                  data-bs-target='#modal-delete-video-material'
                  onClick={() => handleSelectedRow(row)}
               >
                  <MdDelete className='actions-btn' />
               </a>
            </>
         ),
      },
   ];

   const Loading = () => {
      return (
         <div className='p-5'>
            <div className='spinner-border spinner-lg text-primary' role='status'></div>
         </div>
      );
   };

   useEffect(() => {
      isMounted.current = true;
      fetchVideoMaterials(1);

      return () => {
         isMounted.current = false;
      };
   }, []);

   return (
      <div className='admin-contents px-4 pb-4'>
         <ContentNavbar />
         <h1 className='h3 custom-heading mt-3 mb-2'>Video Material</h1>
         <div className='d-flex justify-content-between align-items-center mb-3'>
            <form onSubmit={search} style={{ width: '38%' }}>
               <div className='input-group flex-nowrap'>
                  <input
                     className='form-control'
                     value={searchKey}
                     type='search'
                     name='search'
                     id='search'
                     placeholder='Search by title (e.g. Sample Title)'
                     onChange={e => setSearchKey(e.target.value)}
                  />
                  <button className='btn btn-primary' type='submit'>
                     <MdSearch className='icon-small' />
                  </button>
               </div>
            </form>

            <button className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#modal-add-video-material'>
               <MdOutlineAdd className='icon-small me-2' />
               Add
            </button>

            {/* add video material modal */}
            <Modal title='Add Video Material' target='modal-add-video-material' size='modal-lg' resetState={reset}>
               <form ref={addVideoMaterialFormRef} className='needs-validation d-flex flex-column' noValidate onSubmit={handleAddSubmit}>
                  <div className='mb-3'>
                     <input
                        className='form-control'
                        value={title}
                        type='text'
                        name='title'
                        id='title'
                        required
                        placeholder='Title'
                        onChange={handleInputChange}
                     />
                     {!title && <div className='invalid-feedback py-1 px-1'>Title can't be empty</div>}
                  </div>

                  <div className='mb-3'>
                     <input
                        className='form-control'
                        accept='video/*'
                        ref={addVideoMaterialFileInputRef}
                        type='file'
                        name='file'
                        id='file'
                        required
                        onChange={handleSelectedFile}
                     />
                     {videos.length === 0 && <div className='invalid-feedback py-1 px-1'>Video file can't be empty</div>}
                  </div>

                  <div className='progress mb-3'>
                     <div className='progress-bar bg-primary' style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className='align-self-end'>
                     <button className='btn btn-black me-2' disabled={isUploading} type='button' data-bs-dismiss='modal' onClick={() => reset()}>
                        Cancel
                     </button>
                     <button className='btn btn-primary' disabled={isUploading} type='submit'>
                        Add
                     </button>
                  </div>
               </form>
            </Modal>

            {/* update video material modal */}
            <Modal title='Update Video Material' target='modal-update-video-material' size='modal-lg' resetState={reset}>
               <form ref={updateVideoMaterialFormRef} className='needs-validation d-flex flex-column' noValidate onSubmit={handleUpdateSubmit}>
                  <div className='mb-3'>
                     <input
                        className='form-control'
                        value={title}
                        type='text'
                        name='title'
                        id='title'
                        required
                        placeholder='Title'
                        onChange={handleInputChange}
                     />
                     {!title && <div className='invalid-feedback py-1 px-1'>Title can't be empty</div>}
                  </div>

                  <div className='mb-3'>
                     <input
                        className='form-control'
                        accept='video/*'
                        ref={updateVideoMaterialFileInputRef}
                        type='file'
                        name='file'
                        id='file'
                        onChange={handleSelectedFile}
                     />
                  </div>

                  <div className='progress mb-3'>
                     <div className='progress-bar bg-primary' style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className='align-self-end'>
                     <button className='btn btn-black me-2' disabled={isUploading} type='button' data-bs-dismiss='modal' onClick={() => reset()}>
                        Cancel
                     </button>
                     <button
                        className='btn btn-primary'
                        disabled={
                           ((selectedRow.title && selectedRow.title.toLowerCase()) === (title && title.toLowerCase()) && videos.length === 0) ||
                           isUploading
                        }
                        type='submit'
                     >
                        Update
                     </button>
                  </div>
               </form>
            </Modal>

            {/* delete video material modal */}
            <Modal title='Delete Video Material | Confirmation Message' target='modal-delete-video-material' size='modal-lg' resetState={reset}>
               <form className='d-flex flex-column' onSubmit={handleDeleteSubmit}>
                  <p className='mb-4'>Are your sure you want to delete this video material entitled "{selectedRow.title}"</p>
                  <div className='align-self-end'>
                     <button className='btn btn-black me-2' type='button' data-bs-dismiss='modal' onClick={() => reset()}>
                        Cancel
                     </button>
                     <button className='btn btn-danger' type='submit' data-bs-dismiss='modal'>
                        Delete
                     </button>
                  </div>
               </form>
            </Modal>
         </div>

         <DataTableBase
            columns={columns}
            data={videoMaterials}
            responsive
            highlightOnHover
            fixedHeader
            persistTableHead
            fixedHeaderScrollHeight='65vh'
            progressPending={isLoading}
            progressComponent={<Loading />}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handleRowsPerPageChange}
            onChangePage={handlePageChange}
            paginationComponentOptions={{ rowsPerPageText: 'Item per page:', selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
            paginationResetDefaultPage={resetPaginationToggle}
            sortServer
            onSort={handleSort}
         />
      </div>
   );
};

export default VideoMaterial;
