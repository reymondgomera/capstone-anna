import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

import PieChart from '../PieChart';
import ContentNavbar from './ContentNavbar';
import '../../styles/charts.css';

const Dashboard = () => {
   const [conversations, setConversations] = useState([]);
   const [studentByHighestRiasec, setStudentByHighestRiasec] = useState({
      realistic: 0,
      investigative: 0,
      artistic: 0,
      social: 0,
      enterprising: 0,
      conventional: 0,
   });
   const [studentByRiasec, setStudentByRiasec] = useState({
      realistic: 0,
      investigative: 0,
      artistic: 0,
      social: 0,
      enterprising: 0,
      conventional: 0,
   });

   const [studentBySex, setStudentBySex] = useState({ male: 0, female: 0 });
   const [isLoading, setisLoading] = useState(false);

   const fetchConversations = async () => {
      try {
         setisLoading(true);
         const response = await fetch('/admin/conversations', {
            headers: { token: localStorage.getItem('token') },
         });
         const data = await response.json();

         if (response.status === 200) {
            setConversations(data.conversations);
            setisLoading(false);
         } else toast.error(data.message);
      } catch (err) {
         console.log(err.message);
      }
   };

   const riasecData = {
      labels: ['Realistic', 'Investigaive', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
      datasets: [
         {
            label: 'RIASEC',
            data: Object.entries(studentByRiasec).map(e => e[1]),
            backgroundColor: ['#3E80E4', '#FF3131', '#FFA450', '#DC49E9', '#5BDC47', '#FFC83D'],
            borderColor: '#FFFFFF',
            borderWidth: 5,
         },
      ],
   };

   const riasecOptions = {
      plugins: {
         legend: {
            display: true,
            position: 'bottom',
         },
         responsive: true,
         tooltip: {
            boxPadding: 5,
         },
         title: {
            display: true,
            text: '# of Students by RIASEC Area',
            font: {
               size: 17,
            },
            padding: {
               top: 15,
               bottom: 15,
            },
         },
      },
   };

   const highestRiasecData = {
      labels: ['Realistic', 'Investigaive', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
      datasets: [
         {
            label: 'RIASEC',
            data: Object.entries(studentByHighestRiasec).map(e => e[1]),
            backgroundColor: ['#3E80E4', '#FF3131', '#FFA450', '#DC49E9', '#5BDC47', '#FFC83D'],
            borderColor: '#FFFFFF',
            borderWidth: 5,
         },
      ],
   };

   const highestRiasecOptions = {
      plugins: {
         legend: {
            display: true,
            position: 'bottom',
         },
         responsive: true,
         tooltip: {
            boxPadding: 5,
         },
         title: {
            display: true,
            text: '# of Students by highest/strongest RIASEC Area',
            font: {
               size: 17,
            },
            padding: {
               top: 15,
               bottom: 15,
            },
         },
      },
   };

   const sexData = {
      labels: ['Male', 'Female'],
      datasets: [
         {
            label: '# of Sex',
            data: Object.entries(studentBySex).map(e => e[1]),
            backgroundColor: ['#3E80E4', '#FF3131'],
            borderColor: '#FFFFFF',
            borderWidth: 5,
         },
      ],
   };

   const sexOptions = {
      plugins: {
         legend: {
            display: true,
            position: 'bottom',
         },
         responsive: true,
         tooltip: {
            boxPadding: 5,
         },
         title: {
            display: true,
            text: '# of Students by Sex',
            font: {
               size: 17,
            },
            padding: {
               top: 15,
               bottom: 15,
            },
         },
      },
   };

   useEffect(() => {
      fetchConversations();
   }, []);

   useEffect(() => {
      // adding count to riasec areas only if it is equal to highest score
      // # of student by their Highest/Strongest Score Riasec Aria
      conversations.forEach(conversation => {
         const scoreCode1 = conversation.riasec_code[0];
         const scoreCode2 = conversation.riasec_code[1];
         const scoreCode3 = conversation.riasec_code[2];

         console.log('scoreCode1 = ', scoreCode1);
         console.log('scoreCode2 = ', scoreCode2);
         console.log('scoreCode3 = ', scoreCode3);

         // add +1 in specific area if riasec_code's riasec_area is same as area (riasec area)
         // add +1 in 2nd riasec_code's area if 1st riasec_code's score is equal to 2nd riasec_code's score
         // add +1 in 3nd riasec_code's area if 1st riasec_code's score is equal to 3nd riasec_code's score
         // execute only if 1nd riasec_code's score must not be zero
         if (scoreCode1[1] && scoreCode1[0] === 'realistic') {
            setStudentByHighestRiasec(prev => ({ ...prev, realistic: prev.realistic + 1 }));
            console.log(`if 1 - riasec_code's riasec_area is same as area (riasec area), ${scoreCode1[0]} === realistic || ${scoreCode1[0]}`);
         } else if (scoreCode1[1] && scoreCode1[0] === 'investigative') {
            setStudentByHighestRiasec(prev => ({ ...prev, investigative: prev.investigative + 1 }));
            console.log(`if 1 - riasec_code's riasec_area is same as area (riasec area), ${scoreCode1[0]} === investigative || ${scoreCode1[0]}`);
         } else if (scoreCode1[1] && scoreCode1[0] === 'artistic') {
            setStudentByHighestRiasec(prev => ({ ...prev, artistic: prev.artistic + 1 }));
            console.log(`if 1 - riasec_code's riasec_area is same as area (riasec area), ${scoreCode1[0]} === artistic || ${scoreCode1[0]}`);
         } else if (scoreCode1[1] && scoreCode1[0] === 'social') {
            setStudentByHighestRiasec(prev => ({ ...prev, social: prev.social + 1 }));
            console.log(`if 1 - riasec_code's riasec_area is same as area (riasec area), ${scoreCode1[0]} === social || ${scoreCode1[0]}`);
         } else if (scoreCode1[1] && scoreCode1[0] === 'enterprising') {
            setStudentByHighestRiasec(prev => ({ ...prev, enterprising: prev.enterprising + 1 }));
            console.log(`if 1 - riasec_code's riasec_area is same as area (riasec area), ${scoreCode1[0]} === enterprising || ${scoreCode1[0]}`);
         } else if (scoreCode1[1] && scoreCode1[0] === 'conventional') {
            setStudentByHighestRiasec(prev => ({ ...prev, conventional: prev.conventional + 1 }));
            console.log(`if 1 - riasec_code's riasec_area is same as area (riasec area), ${scoreCode1[0]} === conventional || ${scoreCode1[0]}`);
         }

         if (scoreCode1[1] && scoreCode1[1] === scoreCode2[1]) {
            setStudentByHighestRiasec(prev => ({ ...prev, [scoreCode2[0]]: prev[scoreCode2[0]] + 1 }));
            console.log(
               `if 2 - 1st riasec_code's score is equal to 2nd riasec_code's score, ${scoreCode1[1]} === ${scoreCode2[1]} || ${scoreCode2[0]}`
            );
         }
         if (scoreCode1[1] && scoreCode1[1] === scoreCode3[1]) {
            setStudentByHighestRiasec(prev => ({ ...prev, [scoreCode3[0]]: prev[scoreCode3[0]] + 1 }));
            console.log(
               `if 3 - 1st riasec_code's score is equal to 3nd riasec_code's score, ${scoreCode1[1]} === ${scoreCode3[1]} || ${scoreCode3[0]}`
            );
         }
      });

      // add count riasec area where student belong only if it is not equal to zero
      conversations.forEach((conversation, i) => {
         conversation.riasec_code.forEach((code, i) => {
            console.log(`Riase Code ${i} = `, code);
            if (code[1]) setStudentByRiasec(prev => ({ ...prev, [code[0]]: prev[code[0]] + 1 }));
         });
         console.log('index = ', i);
      });

      // adding to count to male and female
      conversations.forEach(conversation => {
         if (conversation.sex === 'Male') setStudentBySex(prev => ({ ...prev, male: prev.male + 1 }));
         if (conversation.sex === 'Female') setStudentBySex(prev => ({ ...prev, female: prev.female + 1 }));
      });
   }, [conversations]);

   return (
      <div className='admin-contents px-4 pb-4'>
         <ContentNavbar />
         <h1 className='h3 custom-heading mt-3 mb-2'>Dashboard</h1>
         <div className='w-100 d-flex flex-wrap justify-content-center align-items-center'>
            {!isLoading ? (
               <>
                  <div className='chart-container'>
                     <PieChart data={riasecData} options={riasecOptions} />
                  </div>
                  <div className='chart-container'>
                     <PieChart data={highestRiasecData} options={highestRiasecOptions} />
                  </div>
                  <div className='chart   -container'>
                     <PieChart data={sexData} options={sexOptions} />
                  </div>
               </>
            ) : (
               <div className='p-5'>
                  <div className='spinner-border spinner-lg text-primary' role='status'></div>;
               </div>
            )}
         </div>
      </div>
   );
};

export default Dashboard;
