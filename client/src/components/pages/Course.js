import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdSearch, MdRemoveRedEye, MdOutlineAdd, MdEdit, MdDelete, MdSettings } from 'react-icons/md';

import ContentNavbar from './ContentNavbar';
import Strand from './Strand';
import DataTableBase from '../DataTableBase';
import '../../styles/datatablebase.css';
import { titleCase } from '../../utils/utilityFunctions';
import Modal from '../Modal';

const Course = () => {
   const isMounted = useRef(false);
   const [courses, setCourses] = useState([]);
   const [searchKey, setSearchKey] = useState('');

   const [isLoading, setisLoading] = useState(false);
   const [totalRows, setTotalRows] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [sort, setSort] = useState('');
   const [order, setOrder] = useState('');
   const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
   const sortRef = useRef(null);

   const [inputs, setInputs] = useState({ name: '', description: '' });
   const [courseRiasecAreas, setCourseRiasecAreas] = useState({
      realistic: false,
      investigative: false,
      artistic: false,
      social: false,
      enterprising: false,
      conventional: false,
   });
   const [courseStrands, setCourseStrands] = useState('');
   const addCourseFormRef = useRef();
   const updateCourseFormRef = useRef();
   const [selectedRow, setSelectedRow] = useState('');
   const { name, description } = inputs;

   const handleInputChange = e => {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
   };

   const handleCheckBoxChange = (e, state, setState) => {
      setState({ ...state, [e.target.name]: e.target.checked });
   };

   const handleUpdateModalClick = row => {
      handleSelectedRow(row);

      const allCoursesRiasecAreas = courseRiasecAreas;
      const allStrands = courseStrands;
      row.riasec_area.forEach(area => (allCoursesRiasecAreas[area.toLowerCase()] = true));
      row.strand.forEach(strand => (allStrands[strand.toLowerCase()] = true));

      setCourseRiasecAreas(allCoursesRiasecAreas);
      setCourseStrands(allStrands);
      setInputs({ name: row.name, description: row.description });
   };

   const reset = () => {
      setInputs({ name: '', description: '' });
      setSelectedRow('');
      setCourseRiasecAreas(Object.keys(courseRiasecAreas).reduce((a, v) => ({ ...a, [v]: false }), {})); // reset the value of all properties to false, only applies to properties with the same value
      setCourseStrands(Object.keys(courseStrands).reduce((a, v) => ({ ...a, [v]: false }), {}));
      addCourseFormRef.current.classList.remove('was-validated');
      updateCourseFormRef.current.classList.remove('was-validated');
   };

   const handleSelectedRow = row => {
      setSelectedRow(row);
   };

   const handleAddSubmit = async e => {
      e.preventDefault();
      e.target.className += ' was-validated';

      try {
         // convert object to array, Ex: {realistic: false, artistic: true} -> [[realistic, false], [artistic, true]]
         // filter out elements with subelement value to true, then map out the riasec area name and uppercase it, Ex: ['ARTISTIC']
         const riasecAreas = Object.entries(courseRiasecAreas);
         const riasecAreasArray = riasecAreas.filter(area => area[1] !== false).map(area => area[0].toUpperCase());
         const strands = Object.entries(courseStrands);
         const strandsArray = strands.filter(strand => strand[1] !== false).map(strand => strand[0].toUpperCase());

         if (name && description && Object.values(courseRiasecAreas).includes(true) && Object.values(courseStrands).includes(true)) {
            const body = { name, description, riasec_area: riasecAreasArray, strand: strandsArray };
            const response = await fetch('/admin/courses', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
               body: JSON.stringify(body),
            });
            const data = await response.json();

            if (response.status === 200 && data.course) {
               reset();
               fetchCourses(1);
               toast.success(data.message);
            } else toast.error(data.message);
         } else toast.error('Please complete all required fields!');
      } catch (err) {
         console.error(err.message);
      }
   };

   const isChange = () => {
      const riasecAreas = Object.entries(courseRiasecAreas);
      const riasecAreasArray = riasecAreas.filter(area => area[1] !== false).map(area => area[0].toUpperCase());
      const strands = Object.entries(courseStrands);
      const strandsArray = strands.filter(strand => strand[1] !== false).map(strand => strand[0].toUpperCase());

      const riasecAreasIsEqual =
         riasecAreasArray.length === selectedRow.riasec_area.length && riasecAreasArray.every(elem => selectedRow.riasec_area.includes(elem));
      const strandsIsEqual = strandsArray.length === selectedRow.strand.length && strandsArray.every(elem => selectedRow.strand.includes(elem));

      return name.toLowerCase() === selectedRow.name.toLowerCase() && description === selectedRow.description && riasecAreasIsEqual && strandsIsEqual;
   };

   const handleUpdateSubmit = async e => {
      e.preventDefault();
      e.target.className += ' was-validated';

      try {
         // convert object to array, Ex: {realistic: false, artistic: true} -> [[realistic, false], [artistic, true]]
         // filter out elements with subelement value to true, then map out the riasec area name and uppercase it, Ex: ['ARTISTIC']
         const riasecAreas = Object.entries(courseRiasecAreas);
         const riasecAreasArray = riasecAreas.filter(area => area[1] !== false).map(area => area[0].toUpperCase());
         const strands = Object.entries(courseStrands);
         const strandsArray = strands.filter(strand => strand[1] !== false).map(strand => strand[0].toUpperCase());

         if (name && description && Object.values(courseRiasecAreas).includes(true) && Object.values(courseStrands).includes(true)) {
            const updatedCourse = { name, description, courseRiasecAreas, courseStrands };
            const body = {
               courseId: selectedRow._id,
               name: !((selectedRow.name && selectedRow.name.toLowerCase()) === (name && name.toLowerCase())) ? name : undefined,
               description,
               riasec_area: riasecAreasArray,
               strand: strandsArray,
            };
            const response = await fetch('/admin/courses', {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json', token: localStorage.getItem('token') },
               body: JSON.stringify(body),
            });
            const data = await response.json();

            if (response.status === 200 && data.course) {
               reset();
               fetchCourses(1);
               setSelectedRow(data.course);
               setInputs({ name: updatedCourse.name, description: updatedCourse.description });
               setCourseRiasecAreas(updatedCourse.courseRiasecAreas);
               setCourseStrands(updatedCourse.courseStrands);
               toast.success(data.message);
            } else toast.error(data.message);
         } else toast.error('Please complete all required fields!');
      } catch (err) {
         console.error(err.message);
      }
   };

   const handleDeleteSubmit = async e => {
      e.preventDefault();

      try {
         const response = await fetch(`/admin/courses/${selectedRow._id}`, {
            method: 'DELETE',
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (response.status === 200 && data.course) {
            reset();
            fetchCourses(1);
            toast.success(data.message);
         } else toast.error(data.message);
      } catch (err) {
         console.error(err.message);
      }
   };

   const search = e => {
      e.preventDefault();
      fetchCourses(1);
      setResetPaginationToggle(prev => !prev);
   };

   const handleSort = async (column, sortDirection) => {
      // plus(+) to convert date to timestamp date
      // workaround for react-data-table bug: onChangePage trigger when doing onSort to other page expcept page 1
      sortRef.current = +new Date();

      try {
         setisLoading(true);

         const response = await fetch(
            `/admin/courses?page=${1}&size=${rowsPerPage}&search=${searchKey}&sort=${column.sortField}&order=${sortDirection}`,
            {
               headers: { token: localStorage.getItem('token') },
            }
         );
         const data = await response.json();

         if (response.status === 200) {
            setCourses(data.courses);
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

   const fetchCourses = async page => {
      try {
         setisLoading(true);
         const response = await fetch(`/admin/courses?page=${page}&size=${rowsPerPage}&search=${searchKey}&sort=${sort}&order=${order}`, {
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (isMounted.current && response.status === 200) {
            setCourses(data.courses);
            setTotalRows(data.total);
            setisLoading(false);
         } else toast.error(data.message);
      } catch (err) {
         console.error(err.message);
      }
   };

   const fetchStrands = async () => {
      try {
         const response = await fetch('/admin/strands', {
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (isMounted.current && response.status === 200) {
            setCourseStrands(data.map(strand => strand.name).reduce((a, v) => ({ ...a, [v.toLowerCase()]: false }), {}));
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
      fetchCourses(page);
   };

   const handleRowsPerPageChange = async (newPerPage, page) => {
      try {
         setisLoading(true);

         const response = await fetch(`/admin/courses?page=${page}&size=${newPerPage}&search=${searchKey}&sort=${sort}&order=${order}`, {
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (response.status === 200) {
            setCourses(data.courses);
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
         name: 'Name',
         selector: row => row.name,
         sortable: true,
         sortField: 'name',
         maxWidth: '25vw',
      },
      {
         name: 'Description',
         selector: row => row.description,
         maxWidth: '20vw',
      },
      {
         name: 'RIASEC Area/s',
         selector: row => row.riasec_area.toString(),
      },
      {
         name: 'Strand/s',
         selector: row => row.strand.toString(),
      },
      {
         name: 'Actions',
         center: true,
         maxWidth: '20vw',
         cell: row => (
            <>
               <a className='me-1' href='#' data-bs-toggle='modal' data-bs-target='#modal-view-course' onClick={() => handleSelectedRow(row)}>
                  <MdRemoveRedEye className='actions-btn' />
               </a>
               <a className='me-1' href='#' data-bs-toggle='modal' data-bs-target='#modal-update-course' onClick={() => handleUpdateModalClick(row)}>
                  <MdEdit className='actions-btn' />
               </a>
               <a className='me-1' href='#' data-bs-toggle='modal' data-bs-target='#modal-delete-course' onClick={() => handleSelectedRow(row)}>
                  <MdDelete className='actions-btn' />
               </a>
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
      fetchCourses(1);
      fetchStrands();

      return () => {
         isMounted.current = false;
      };
   }, []);

   return (
      <div className='admin-contents px-4 pb-4'>
         <ContentNavbar />
         <h1 className='h3 custom-heading mt-3 mb-2'>Degree Program</h1>
         <div className='d-flex flex-wrap justify-content-between align-items-center mb-3'>
            <form onSubmit={search} style={{ width: '38%' }}>
               <div className='input-group flex-nowrap'>
                  <input
                     className='form-control'
                     value={searchKey}
                     type='search'
                     name='search'
                     id='search'
                     placeholder='Search by name (e.g. BS in Information Technology)'
                     onChange={e => setSearchKey(e.target.value)}
                  />
                  <button className='btn btn-primary' type='submit'>
                     <MdSearch className='icon-small' />
                  </button>
               </div>
            </form>

            <div className='mt-3 d-flex'>
               <button className='btn btn-primary me-3' data-bs-toggle='modal' data-bs-target='#modal-manage-strand'>
                  <MdSettings className='icon-small me-2' />
                  Manage Strand
               </button>
               <button className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#modal-add-course'>
                  <MdOutlineAdd className='icon-small me-2' />
                  Add
               </button>
            </div>

            {/* view course modal */}
            <Modal title='View Degree Program' target='modal-view-course' size='modal-lg' resetState={reset}>
               <h2 className='text-sm h6 custom-heading'>Name:</h2>
               <div className='text-sm bg-grey rounded p-3 mb-3'>{selectedRow.name}</div>
               <h2 className='text-sm h6 custom-heading'>Description:</h2>
               <div className='text-sm bg-grey rounded p-3 mb-3'>{selectedRow.description}</div>
               <h2 className='text-sm h6 custom-heading'>RIASEC Area/s:</h2>
               <div className='text-sm d-flex flex-wrap w-100'>
                  {selectedRow.riasec_area &&
                     selectedRow.riasec_area.length > 0 &&
                     selectedRow.riasec_area.map((a, i) => (
                        <div key={i} className='text-sm bg-primary rounded p-3 mb-3 me-3'>
                           {a}
                        </div>
                     ))}
               </div>
               <h2 className='text-sm h6 custom-heading'>Strand/s:</h2>
               <div className='text-sm d-flex flex-wrap'>
                  {selectedRow.strand &&
                     selectedRow.strand.length > 0 &&
                     selectedRow.strand.map((s, i) => (
                        <div key={i} className='text-sm bg-primary rounded p-3 mb-3 me-3'>
                           {s}
                        </div>
                     ))}
               </div>
            </Modal>

            {/* add course modal */}
            <Modal title='Add Degree Program' target='modal-add-course' size='modal-lg' resetState={reset}>
               <form ref={addCourseFormRef} className='needs-validation d-flex flex-column' noValidate onSubmit={handleAddSubmit}>
                  <div className='mb-3'>
                     <input
                        className='form-control'
                        value={name}
                        type='text'
                        name='name'
                        id='name'
                        required
                        placeholder='Name'
                        onChange={handleInputChange}
                     />
                     {!name && <div className='invalid-feedback py-1 px-1'>Name can't be empty</div>}
                  </div>
                  <div className='mb-3'>
                     <textarea
                        className='form-control'
                        name='description'
                        value={description}
                        id='description'
                        rows='8'
                        required
                        placeholder='Description'
                        onChange={handleInputChange}
                     ></textarea>
                     {!description && <div className='invalid-feedback py-1 px-1'>Description can't be empty</div>}
                  </div>
                  <div className='mb-3'>
                     <h2 className='text-sm h6 custom-heading'>RIASEC Area/s</h2>
                     <div className='d-flex flex-wrap'>
                        {courseRiasecAreas &&
                           Object.keys(courseRiasecAreas).map((area, i) => (
                              <div className='form-check mb-2' key={i}>
                                 <input
                                    className='form-check-input me-2'
                                    type='checkbox'
                                    checked={courseRiasecAreas[area]}
                                    id={area}
                                    name={area}
                                    required={Object.values(courseRiasecAreas).includes(true) ? false : true}
                                    onChange={e => handleCheckBoxChange(e, courseRiasecAreas, setCourseRiasecAreas)}
                                 />
                                 <span className='text-sm me-2'>{titleCase(area)}</span>
                              </div>
                           ))}

                        <input className='d-none' type='text' required={Object.values(courseRiasecAreas).includes(true) ? false : true} />
                        {Object.values(courseRiasecAreas).includes(true)
                           ? false
                           : true && <div className='invalid-feedback mt-0 mb-2'>RIASEC Area/s can't be empty, select atleast one</div>}
                     </div>
                     <div className='mb-3'>
                        <h2 className='text-sm h6 custom-heading'>Strand/s</h2>
                        <div className='d-flex flex-wrap'>
                           {courseStrands &&
                              Object.keys(courseStrands).map((strand, i) => (
                                 <div className='form-check mb-2' key={i}>
                                    <input
                                       className='form-check-input me-2'
                                       type='checkbox'
                                       checked={courseStrands[strand]}
                                       id={strand}
                                       name={strand}
                                       required={Object.values(courseStrands).includes(true) ? false : true}
                                       onChange={e => handleCheckBoxChange(e, courseStrands, setCourseStrands)}
                                    />
                                    <span className='text-sm me-2'>{strand.toUpperCase()}</span>
                                 </div>
                              ))}

                           <input className='d-none' type='text' required={Object.values(courseStrands).includes(true) ? false : true} />
                           {Object.values(courseStrands).includes(true)
                              ? false
                              : true && <div className='invalid-feedback mt-0 mb-2'>Strand/s can't be empty, select atleast one</div>}
                        </div>
                     </div>
                  </div>
                  <div className='align-self-end'>
                     <button className='btn btn-black me-2' type='button' data-bs-dismiss='modal' onClick={() => reset()}>
                        Cancel
                     </button>
                     <button className='btn btn-primary' type='submit'>
                        Add
                     </button>
                  </div>
               </form>
            </Modal>

            {/* update course modal */}
            <Modal title='Update Degree Program' target='modal-update-course' size='modal-lg' resetState={reset}>
               <form ref={updateCourseFormRef} className='needs-validation d-flex flex-column' noValidate onSubmit={handleUpdateSubmit}>
                  <div className='mb-3'>
                     <input
                        className='form-control'
                        value={name}
                        type='text'
                        name='name'
                        id='name'
                        required
                        placeholder='Name'
                        onChange={handleInputChange}
                     />
                     {!name && <div className='invalid-feedback py-1 px-1'>Name can't be empty</div>}
                  </div>
                  <div className='mb-3'>
                     <textarea
                        className='form-control'
                        name='description'
                        value={description}
                        id='description'
                        rows='8'
                        required
                        placeholder='Description'
                        onChange={handleInputChange}
                     ></textarea>
                     {!description && <div className='invalid-feedback py-1 px-1'>Description can't be empty</div>}
                  </div>
                  <div className='mb-3'>
                     <h2 className='text-sm h6 custom-heading'>RIASEC Area/s</h2>
                     <div className='d-flex flex-wrap'>
                        {courseRiasecAreas &&
                           Object.keys(courseRiasecAreas).map((area, i) => (
                              <div className='form-check mb-2' key={i}>
                                 <input
                                    className='form-check-input me-2'
                                    type='checkbox'
                                    checked={courseRiasecAreas[area]}
                                    id={area}
                                    name={area}
                                    required={Object.values(courseRiasecAreas).includes(true) ? false : true}
                                    onChange={e => handleCheckBoxChange(e, courseRiasecAreas, setCourseRiasecAreas)}
                                 />
                                 <span className='text-sm me-2'>{titleCase(area)}</span>
                              </div>
                           ))}

                        <input className='d-none' type='text' required={Object.values(courseRiasecAreas).includes(true) ? false : true} />
                        {Object.values(courseRiasecAreas).includes(true)
                           ? false
                           : true && <div className='invalid-feedback mt-0 mb-2'>RIASEC Area/s can't be empty, select atleast one</div>}
                     </div>
                  </div>
                  <div className='mb-3'>
                     <h2 className='text-sm h6 custom-heading'>Strand/s</h2>
                     <div className='d-flex flex-wrap'>
                        {courseStrands &&
                           Object.keys(courseStrands).map((strand, i) => (
                              <div className='form-check mb-2' key={i}>
                                 <input
                                    className='form-check-input me-2'
                                    type='checkbox'
                                    checked={courseStrands[strand]}
                                    id={strand}
                                    name={strand}
                                    required={Object.values(courseStrands).includes(true) ? false : true}
                                    onChange={e => handleCheckBoxChange(e, courseStrands, setCourseStrands)}
                                 />
                                 <span className='text-sm me-2'>{strand.toUpperCase()}</span>
                              </div>
                           ))}

                        <input className='d-none' type='text' required={Object.values(courseStrands).includes(true) ? false : true} />
                        {Object.values(courseStrands).includes(true)
                           ? false
                           : true && <div className='invalid-feedback mt-0 mb-2'>Strand/s can't be empty, select atleast one</div>}
                     </div>
                  </div>
                  <div className='align-self-end'>
                     <button className='btn btn-black me-2' type='button' data-bs-dismiss='modal' onClick={() => reset()}>
                        Cancel
                     </button>
                     <button className='btn btn-primary' type='submit' disabled={selectedRow && isChange()}>
                        Update
                     </button>
                  </div>
               </form>
            </Modal>

            {/* delete course modal */}
            <Modal title='Delete Degree Program | Confirmation Message' target='modal-delete-course' size='modal-lg' resetState={reset}>
               <form className='d-flex flex-column' onSubmit={handleDeleteSubmit}>
                  <p className='mb-4'>Are your sure you want to delete this degree program named "{selectedRow.name}"</p>
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

            {/* manage strand modal */}
            <Strand fetchStrandsForInputs={fetchStrands} fetchCourses={fetchCourses} />
         </div> 

         <DataTableBase
            columns={columns}
            data={courses}
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

export default Course;
