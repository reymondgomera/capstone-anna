import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';

import BarChart from '../BarChart';
import ContentNavbar from './ContentNavbar';
import '../../styles/charts.css';

const Dashboard = () => {
   const isMounted = useRef(false);
   const [conversations, setConversations] = useState([]);
   const [conversationsPerStrand, setConversationsPerStrand] = useState([]);
   const [strandOptions, setStrandOptions] = useState([]);
   const [studentByHighestRiasec, setStudentByHighestRiasec] = useState({
      realistic: 0,
      investigative: 0,
      artistic: 0,
      social: 0,
      enterprising: 0,
      conventional: 0,
   });
   const [studentBySex, setStudentBySex] = useState({ male: 0, female: 0 });
   const [studentByStrand, setStudentByStrand] = useState({});
   const [isLoading, setisLoading] = useState(false);

   const [inputs, setInputs] = useState({ strand: 'all' });
   const { strand } = inputs;

   const fetchAllConversations = async () => {
      // convert array distict strand to object assign value to 0(zero), lowercase its property name, remove space and charater that is not letter
      setStudentByStrand(
         strandOptions.reduce(
            (a, v) => ({
               ...a,
               [v
                  .toLowerCase()
                  .replaceAll(' ', '')
                  .replaceAll(/[^a-zA-Z ]/g, '')]: 0,
            }),
            {}
         )
      );

      try {
         setisLoading(true);
         const response = await fetch(`/admin/conversations?strand=all`, {
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (isMounted.current && response.status === 200) {
            setConversationsPerStrand(data.conversations);
            setisLoading(false);
         } else toast.error(data.message);
      } catch (err) {
         console.log(err.message);
      }
   };

   const fetchConversationsByStrand = async strand => {
      setStudentBySex({ male: 0, female: 0 });
      setStudentByHighestRiasec({
         realistic: 0,
         investigative: 0,
         artistic: 0,
         social: 0,
         enterprising: 0,
         conventional: 0,
      });

      try {
         setisLoading(true);
         const response = await fetch(`/admin/conversations?strand=${strand}`, {
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (isMounted.current && response.status === 200) {
            setConversations(data.conversations);
            setisLoading(false);
         } else toast.error(data.message);
      } catch (err) {
         console.log(err.message);
      }
   };

   const fetchDistinctStrand = async () => {
      try {
         const response = await fetch('/admin/courses-distinct-strand', {
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (isMounted.current && response.status === 200) {
            setStrandOptions(data);

            // convert array distict strand to object assign value to 0(zero), lowercase its property name, remove space and charater that is not letter
            setStudentByStrand(
               data.reduce(
                  (a, v) => ({
                     ...a,
                     [v
                        .toLowerCase()
                        .replaceAll(' ', '')
                        .replaceAll(/[^a-zA-Z ]/g, '')]: 0,
                  }),
                  {}
               )
            );
         } else toast.error(data.message);
      } catch (err) {
         console.log(err.message);
      }
   };

   const getOptions = titleText => {
      return {
         responsive: true,
         plugins: {
            legend: {
               display: false, // hide dataset labels
               position: 'bottom',
            },
            tooltip: {
               boxPadding: 5,
            },
            title: {
               display: true,
               text: titleText,
               font: {
                  size: 17,
               },
               padding: {
                  top: 15,
                  bottom: 15,
               },
            },
         },
         scale: {
            ticks: {
               precision: 0,
            },
         },
      };
   };

   const studentByHighestRiasecData = {
      labels: ['Realistic', 'Investigaive', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
      datasets: [
         {
            label: 'Conversation Data',
            data: Object.entries(studentByHighestRiasec).map(e => e[1]),
            backgroundColor: ['#3E80E4', '#FF3131', '#FFA450', '#DC49E9', '#5BDC47', '#FFC83D'],
         },
      ],
   };

   const studentByStrandData = {
      labels: strandOptions,
      datasets: [
         {
            label: 'Conversation Data',
            data: studentByStrand && Object.entries(studentByStrand).map(e => e[1]),
            backgroundColor: ['#FF7C70'],
         },
      ],
   };

   const studentBySexData = {
      labels: ['Male', 'Female'],
      datasets: [
         {
            label: 'Conversation Data',
            data: Object.entries(studentBySex).map(e => e[1]),
            backgroundColor: ['#3E80E4', '#FF3131'],
         },
      ],
   };

   const handleFilterStrandChange = e => {
      const strandValue = e.target.value.includes('&') ? e.target.value.replace('&', '%26') : e.target.value;
      setInputs(prev => ({ ...prev, strand: strandValue }));
      fetchConversationsByStrand(strandValue);
   };

   useEffect(() => {
      isMounted.current = true;
      fetchDistinctStrand();
      fetchConversationsByStrand('all');

      return () => {
         isMounted.current = false;
      };
   }, []);

   useEffect(() => {
      isMounted.current = true;
      fetchAllConversations();

      return () => {
         isMounted.current = false;
      };
   }, [strand]);

   useEffect(() => {
      // adding count to riasec areas only if it is equal to highest score
      // # of student by their Highest/Strongest Score Riasec Aria
      conversations.forEach(conversation => {
         const scoreCode1 = conversation.riasec_code[0];
         const scoreCode2 = conversation.riasec_code[1];
         const scoreCode3 = conversation.riasec_code[2];

         // add +1 in specific area if riasec_code's riasec_area is same as area (riasec area)
         // execute only if 1nd riasec_code's score must not be zero
         if (scoreCode1[1] && scoreCode1[0] === 'realistic') {
            setStudentByHighestRiasec(prev => ({ ...prev, realistic: prev.realistic + 1 }));
         } else if (scoreCode1[1] && scoreCode1[0] === 'investigative') {
            setStudentByHighestRiasec(prev => ({ ...prev, investigative: prev.investigative + 1 }));
         } else if (scoreCode1[1] && scoreCode1[0] === 'artistic') {
            setStudentByHighestRiasec(prev => ({ ...prev, artistic: prev.artistic + 1 }));
         } else if (scoreCode1[1] && scoreCode1[0] === 'social') {
            setStudentByHighestRiasec(prev => ({ ...prev, social: prev.social + 1 }));
         } else if (scoreCode1[1] && scoreCode1[0] === 'enterprising') {
            setStudentByHighestRiasec(prev => ({ ...prev, enterprising: prev.enterprising + 1 }));
         } else if (scoreCode1[1] && scoreCode1[0] === 'conventional') {
            setStudentByHighestRiasec(prev => ({ ...prev, conventional: prev.conventional + 1 }));
         }

         // add +1 in 2nd riasec_code's riasec_area if 1st riasec_code's score is equal to 2nd riasec_code's score
         // add +1 in 3nd riasec_code's riasec_area if 1st riasec_code's score is equal to 3nd riasec_code's score
         // execute only if 1nd riasec_code's score must not be zero
         if (scoreCode1[1] && scoreCode1[1] === scoreCode2[1]) {
            setStudentByHighestRiasec(prev => ({ ...prev, [scoreCode2[0]]: prev[scoreCode2[0]] + 1 }));
         }
         if (scoreCode1[1] && scoreCode1[1] === scoreCode3[1]) {
            setStudentByHighestRiasec(prev => ({ ...prev, [scoreCode3[0]]: prev[scoreCode3[0]] + 1 }));
         }
      });

      // adding to count to male and female
      // # of students by sex
      conversations.forEach(conversation => {
         if (conversation.sex === 'Male') setStudentBySex(prev => ({ ...prev, male: prev.male + 1 }));
         if (conversation.sex === 'Female') setStudentBySex(prev => ({ ...prev, female: prev.female + 1 }));
      });
   }, [conversations]);

   useEffect(() => {
      // iterate over the distict strand, then if conversation strand or strand of student is sanme as the given strand then + 1
      strandOptions.forEach(st => {
         const strand = st
            .toLowerCase()
            .replaceAll(' ', '')
            .replaceAll(/[^a-zA-Z ]/g, '');
         conversationsPerStrand.forEach(conversation => {
            if (conversation.strand === st) {
               setStudentByStrand(prev => ({ ...prev, [strand]: prev[`${strand}`] + 1 }));
            }
         });
      });
   }, [conversationsPerStrand]);

   return (
      <div className='admin-contents px-4 pb-4 position-relative'>
         <ContentNavbar />
         <h1 className='h3 custom-heading mt-3 mb-2'>Dashboard</h1>
         <div className='mb-2 d-flex justify-content-end align-items-center'>
            <span className='me-2'>Filter: </span>
            <select
               className='form-select'
               style={{ width: '15%' }}
               name='strand'
               id='strand'
               onChange={handleFilterStrandChange}
               disabled={isLoading}
            >
               <option value='all'>All</option>
               {strandOptions &&
                  strandOptions.map((strand, i) => (
                     <option className='text-wrap' key={i} value={strand}>
                        {strand}
                     </option>
                  ))}
            </select>
         </div>
         <div className='w-100 d-flex flex-wrap justify-content-center align-items-center'>
            {!isLoading ? (
               <>
                  <div className='chart-container'>
                     <BarChart data={studentByHighestRiasecData} options={getOptions('Number of Students by Highest/Strongest RIASEC Area')} />
                  </div>
                  <div className='chart-container'>
                     <BarChart data={studentBySexData} options={getOptions('Number of Students by Sex')} />
                  </div>
                  <div className='chart-container'>
                     <BarChart data={studentByStrandData} options={getOptions('Number of Students by Strand')} />
                  </div>
               </>
            ) : (
               <div className='position-absolute top-50 start-50 translate-middle p-5'>
                  <div className='spinner-border spinner-lg text-primary' role='status'></div>
               </div>
            )}
         </div>
      </div>
   );
};

export default Dashboard;
