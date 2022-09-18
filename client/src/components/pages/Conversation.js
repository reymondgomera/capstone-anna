import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdSearch, MdRemoveRedEye } from 'react-icons/md';
import { Link } from 'react-router-dom';

import ContentNavbar from './ContentNavbar';
import DataTableBase from '../DataTableBase';
import '../../styles/datatablebase.css';

const Conversation = () => {
   const isMounted = useRef(false);
   const [conversations, setConversations] = useState([]);
   const [searchKey, setSearchKey] = useState('');

   const [isLoading, setisLoading] = useState(false);
   const [totalRows, setTotalRows] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [sort, setSort] = useState('');
   const [order, setOrder] = useState('');
   const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
   const sortRef = useRef(null);

   const search = e => {
      e.preventDefault();
      fetchConversation(1);
      setResetPaginationToggle(prev => !prev);
   };

   const handleSort = async (column, sortDirection) => {
      // plus(+) to convert date to timestamp date
      // workaround for react-data-table bug: onChangePage trigger when doing onSort to other page expcept page 1
      sortRef.current = +new Date();

      try {
         setisLoading(true);
         const response = await fetch(
            `/admin/conversations?page=${1}?&size=${rowsPerPage}&search=${searchKey}&sort=${column.sortField}&order=${sortDirection}&strand=all`,
            {
               headers: { token: localStorage.getItem('token') },
            }
         );
         const data = await response.json();

         if (response.status === 200) {
            setConversations(data.conversations);
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

   const fetchConversation = async page => {
      try {
         setisLoading(true);
         const response = await fetch(
            `/admin/conversations?page=${page}?&size=${rowsPerPage}&search=${searchKey}&sort=${sort}&order=${order}&strand=all`,
            {
               headers: { token: localStorage.getItem('token') },
            }
         );
         const data = await response.json();

         if (isMounted.current && response.status === 200) {
            setConversations(data.conversations);
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
      fetchConversation(page);
   };

   const handleRowsPerPageChange = async (newPerPage, page) => {
      try {
         setisLoading(true);
         const response = await fetch(
            `/admin/conversations?page=${page}?&size=${newPerPage}&search=${searchKey}&sort=${sort}&order=${order}&strand=all`,
            {
               headers: { token: localStorage.getItem('token') },
            }
         );
         const data = await response.json();

         if (response.status === 200) {
            setConversations(data.conversations);
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
      },
      {
         name: 'Student Name',
         selector: row => row.name,
         sortable: true,
         sortField: 'name',
      },
      {
         name: 'Age',
         selector: row => row.age,
         sortable: true,
         sortField: 'age',
      },
      {
         name: 'Sex',
         selector: row => row.sex,
         sortable: true,
         sortField: 'sex',
      },
      {
         name: 'Strand',
         selector: row => row.strand,
      },
      {
         name: 'RIASEC Code',
         selector: row => (
            <h1 className='h6 custom-heading m-0'>
               {row.riasec_code[0][1]
                  ? `${row.riasec_code[0][0].charAt(0)}${row.riasec_code[1][1] ? row.riasec_code[1][0].charAt(0) : ''}${
                       row.riasec_code[2][1] ? row.riasec_code[2][0].charAt(0) : ''
                    }`.toUpperCase()
                  : 'N/A'}
            </h1>
         ),
      },
      {
         name: 'Actions',
         center: true,
         cell: row => (
            <Link to={row._id}>
               <MdRemoveRedEye className='actions-btn' />{' '}
            </Link>
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
      fetchConversation(1);

      return () => {
         isMounted.current = false;
      };
   }, []);

   return (
      <div className='admin-contents px-4 pb-4'>
         <ContentNavbar />
         <div>
            <h1 className='h3 custom-heading mt-3 mb-2'>Conversation</h1>
            <form className='mb-3' onSubmit={search} style={{ width: '38%' }}>
               <div className='input-group flex-nowrap'>
                  <input
                     className='form-control'
                     value={searchKey}
                     type='search'
                     name='search'
                     id='search'
                     placeholder='Search by name (e.g. John Doe)'
                     onChange={e => setSearchKey(e.target.value)}
                  />
                  <button className='btn btn-primary' type='submit'>
                     <MdSearch className='icon-small' />
                  </button>
               </div>
            </form>

            <DataTableBase
               columns={columns}
               data={conversations}
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

export default Conversation;
