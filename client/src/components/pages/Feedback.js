import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdSearch, MdRemoveRedEye } from 'react-icons/md';

import DataTableBase from '../DataTableBase';
import ContentNavbar from './ContentNavbar';
import Modal from '../Modal';
import '../../styles/datatablebase.css';

const Feedback = () => {
   const isMounted = useRef(false);
   const [feedbacks, setFeedbacks] = useState([]);
   const [searchKey, setSearchKey] = useState('');

   const [isLoading, setisLoading] = useState(false);
   const [totalRows, setTotalRows] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [sort, setSort] = useState('');
   const [order, setOrder] = useState('');
   const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

   const search = e => {
      e.preventDefault();
      fetchFeedbacks(1);
      setResetPaginationToggle(prev => !prev);
   };

   const handleSort = async (column, sortDirection) => {
      try {
         setisLoading(true);

         const response = await fetch(
            `/admin/feedbacks?page=${1}?&size=${rowsPerPage}&search=${searchKey}&sort=${column.sortField}&order=${sortDirection}`,
            {
               headers: { token: localStorage.getItem('token') },
            }
         );
         const data = await response.json();

         if (response.status === 200) {
            setFeedbacks(data.feedbacks);
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

   const fetchFeedbacks = async page => {
      try {
         setisLoading(true);
         const response = await fetch(`/admin/feedbacks?page=${page}?&size=${rowsPerPage}&search=${searchKey}&sort=${sort}&order=${order}`, {
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (isMounted.current && response.status === 200) {
            setFeedbacks(data.feedbacks);
            setTotalRows(data.total);
            setisLoading(false);
         } else toast.error(data.message);
      } catch (err) {
         console.error(err.message);
      }
   };

   const handlePageChange = page => {
      fetchFeedbacks(page);
   };

   const handleRowsPerPageChange = async (newPerPage, page) => {
      try {
         setisLoading(true);

         const response = await fetch(`/admin/feedbacks?page=${page}?&size=${newPerPage}&search=${searchKey}&sort=${sort}&order=${order}`, {
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (response.status === 200) {
            setFeedbacks(data.feedbacks);
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
         name: 'Email',
         selector: row => row.email,
         sortable: true,
         sortField: 'email',
         maxWidth: '20vw',
      },
      {
         name: 'Feedback',
         selector: row => row.feedback,
         maxWidth: '45vw',
      },
      {
         name: 'Action',
         maxWidth: '5vw',
         center: true,
         cell: row => (
            <>
               <span data-bs-toggle='modal' data-bs-target={`#feedback-view-${row._id}`}>
                  <MdRemoveRedEye className='actions-btn' />
               </span>
               <Modal title='Feedback' target={`feedback-view-${row._id}`} size='modal-lg'>
                  <div className='bg-grey rounded p-3 mb-3'>{row.email}</div>
                  <div className='bg-grey rounded p-3 mb-3'>{row.feedback}</div>
               </Modal>
            </>
         ),
      },
   ];

   const Loading = () => {
      return (
         <div className='p-5'>
            <div className='spinner-border spinner-lg text-primary' role='status'></div>;
         </div>
      );
   };

   useEffect(() => {
      isMounted.current = true;
      fetchFeedbacks(1);

      return () => {
         isMounted.current = false;
      };
   }, []);

   return (
      <div className='admin-contents px-4 pb-4'>
         <ContentNavbar />
         <div>
            <h1 className='h3 custom-heading mt-3 mb-2'>Feedback</h1>
            <form className='mb-3' onSubmit={search} style={{ width: '38%' }}>
               <div className='input-group flex-nowrap'>
                  <input
                     className='form-control'
                     value={searchKey}
                     type='search'
                     name='search'
                     id='search'
                     placeholder='Search by email (e.g. example@gmail.com)'
                     onChange={e => setSearchKey(e.target.value)}
                  />
                  <button className='btn btn-primary' type='submit'>
                     <MdSearch className='icon-small' />
                  </button>
               </div>
            </form>

            <DataTableBase
               columns={columns}
               data={feedbacks}
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
      </div>
   );
};

export default Feedback;
