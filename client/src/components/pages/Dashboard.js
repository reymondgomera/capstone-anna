import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';
import { MdFilterAlt, MdDownload } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import randomColor from 'randomcolor';

import BarChart from '../BarChart';
import ContentNavbar from './ContentNavbar';
import '../../styles/charts.css';

const Dashboard = () => {
   const isMounted = useRef(false);
   const initialRender = useRef(false);

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
   const [studentByHighestRiasecPerStrand, setStudentByHighestRiasecPerStrand] = useState({
      realistic: {},
      investigative: {},
      artistic: {},
      social: {},
      enterprising: {},
      conventional: {},
   });
   const [strandBarColors, setStrandBarColors] = useState([
      '#ea7070',
      '#fdc4b6',
      '#e59572',
      '#fff591',
      '#2694ab',
      '#f9bcdd',
      '#587058',
      '#A3CD39',
      '#E5446D',
      '#29aba4',
   ]);
   const [studentBySex, setStudentBySex] = useState({ male: 0, female: 0 });
   const [studentBySexPerStrand, setStudentBySexPerStrand] = useState({ male: {}, female: {} });
   const [studentByStrand, setStudentByStrand] = useState({});

   const [isLoading, setisLoading] = useState(false);
   const [isOverAll, setIsOverAll] = useState(true);

   const [inputs, setInputs] = useState({ strand: 'all' });
   const { strand } = inputs;

   const [schoolYearStart, setSchoolYearStart] = useState(null);
   const [isFilterBySchoolYear, setIsFilterBySchoolYear] = useState(false);

   const studentByHighestRiasecChartRef = useRef(null);
   const studentBySexChartRef = useRef(null);
   const studentByStrandChartRef = useRef(null);

   const [chartsInfo, setChartsInfo] = useState({
      studentByHighestRiasecChart: { filename: 'Number of Students by Strongest RIASEC Area - Overall' },
      studentBySexChart: { filename: 'Number of Students by Sex - Overall' },
      studentByStrandChart: { filename: 'Number of Students by Strand' },
   });

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
         const response = await fetch(`/admin/conversations?strand=all&year=${schoolYearStart ? schoolYearStart.getFullYear() : ''}`, {
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

      // convert array distict strand to object assign value to 0(zero), lowercase its property name, remove space and charater that is not letter
      const value = strandOptions.reduce(
         (a, v) => ({
            ...a,
            [v
               .toLowerCase()
               .replaceAll(' ', '')
               .replaceAll(/[^a-zA-Z ]/g, '')]: 0,
         }),
         {}
      );

      // reset the value
      setStudentByHighestRiasecPerStrand({
         realistic: value,
         investigative: value,
         artistic: value,
         social: value,
         enterprising: value,
         conventional: value,
      });
      setStudentBySexPerStrand({ male: value, female: value });

      try {
         setisLoading(true);
         const response = await fetch(`/admin/conversations?strand=${strand}&year=${schoolYearStart ? schoolYearStart.getFullYear() : ''}`, {
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
            const value = data.reduce(
               (a, v) => ({
                  ...a,
                  [v
                     .toLowerCase()
                     .replaceAll(' ', '')
                     .replaceAll(/[^a-zA-Z ]/g, '')]: 0,
               }),
               {}
            );

            setStudentByStrand(value);
            Object.keys(studentByHighestRiasecPerStrand).map(key => {
               setStudentByHighestRiasecPerStrand(prev => ({ ...prev, [key]: value }));
            });
            Object.keys(studentBySex).map(key => {
               setStudentBySexPerStrand(prev => ({ ...prev, [key]: value }));
            });

            setStrandBarColors(prev => [...prev, ...data.map(s => randomColor({ count: 5 }))]);
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
               display: true,
               position: 'bottom',
               ...(!isOverAll && {
                  onClick: (e, legendItem, legend) => {
                     const index = legend.chart.data.labels.indexOf(legendItem.text);
                     legend.chart.toggleDataVisibility(index);
                     legend.chart.update();
                  },
                  labels: {
                     generateLabels: chart => {
                        const visibility = [];
                        for (let i = 0; i < chart.data.labels.length; i++) {
                           if (chart.getDataVisibility(i) === true) visibility.push(false);
                           else visibility.push(true);
                        }
                        return chart.data.labels.map((label, index) => ({
                           text: label,
                           strokeStyle: 'transparent',
                           fillStyle: chart.data.datasets[0].backgroundColor[index],
                           hidden: visibility[index],
                        }));
                     },
                  },
               }),
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
                  bottom: 20,
               },
            },
            datalabels: {
               display: true,
               align: 'end',
               anchor: 'end',
               font: {
                  size: 12,
                  weight: 'bold',
               },
               offset: -2,
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
      datasets: !isOverAll
         ? [
              {
                 label: 'Conversation Data',
                 data: Object.entries(studentByHighestRiasec).map(e => e[1]),
                 backgroundColor: ['#3E80E4', '#FF3131', '#FFA450', '#DC49E9', '#5BDC47', '#FFC83D'],
              },
           ]
         : [
              {
                 label: 'Total',
                 data: Object.entries(studentByHighestRiasec).map(e => e[1]),
                 backgroundColor: ['#5BDC47'],
              },
              ...strandOptions.map((strand, i) => ({
                 label: strand,
                 data: Object.values(studentByHighestRiasecPerStrand).map(
                    value =>
                       value[
                          strand
                             .toLowerCase()
                             .replaceAll(' ', '')
                             .replaceAll(/[^a-zA-Z ]/g, '')
                       ]
                 ),
                 backgroundColor: [strandBarColors[i]],
              })),
           ],
   };

   const studentByStrandData = {
      labels: strandOptions,
      datasets: [
         {
            label: 'Conversation Data',
            data: studentByStrand && Object.entries(studentByStrand).map(e => e[1]),
            backgroundColor: strandBarColors.slice(0, strandOptions.length),
         },
      ],
   };

   const studentBySexData = {
      labels: ['Male', 'Female'],
      datasets: !isOverAll
         ? [
              {
                 label: 'Conversation Data',
                 data: Object.entries(studentBySex).map(e => e[1]),
                 backgroundColor: ['#3E80E4', '#FF3131'],
              },
           ]
         : [
              {
                 label: 'Total',
                 data: Object.entries(studentBySex).map(e => e[1]),
                 backgroundColor: ['#5BDC47'],
              },
              ...strandOptions.map((strand, i) => ({
                 label: strand,
                 data: Object.values(studentBySexPerStrand).map(
                    value =>
                       value[
                          strand
                             .toLowerCase()
                             .replaceAll(' ', '')
                             .replaceAll(/[^a-zA-Z ]/g, '')
                       ]
                 ),
                 backgroundColor: [strandBarColors[i]],
              })),
           ],
   };

   const handleFilterStrandChange = e => {
      const strandValue = e.target.value.includes('&') ? e.target.value.replace('&', '%26') : e.target.value;
      setInputs(prev => ({ ...prev, strand: strandValue }));
   };

   const filter = () => {
      fetchAllConversations();
      fetchConversationsByStrand(strand);

      if (strand === 'all') setIsOverAll(true);
      else setIsOverAll(false);

      setChartsInfo(prev => ({
         ...prev,
         studentByHighestRiasecChart: {
            filename: `Number of Students by Strongest RIASEC Area${
               schoolYearStart ? `_SY ${schoolYearStart.getFullYear()} - ${schoolYearStart.getFullYear() + 1}` : ''
            }${strand === 'all' ? ' - Overall' : ` - ${strand.replace('%26', '&')}`}.png`,
         },
         studentBySexChart: {
            filename: `Number of Students by Sex${
               schoolYearStart ? `_SY ${schoolYearStart.getFullYear()} - ${schoolYearStart.getFullYear() + 1}` : ''
            }${strand === 'all' ? ' - Overall' : ` - ${strand.replace('%26', '&')}`}.png`,
         },
      }));
   };

   const handleIsFilterByYearChange = e => {
      if (e.target.checked) setIsFilterBySchoolYear(e.target.checked);
      else {
         setIsFilterBySchoolYear(e.target.checked);
         setSchoolYearStart(null);
      }
   };

   const download = () => {
      const studentByHighestRiasecChartLink = document.createElement('a');
      studentByHighestRiasecChartLink.download = chartsInfo.studentByHighestRiasecChart.filename;
      studentByHighestRiasecChartLink.href = studentByHighestRiasecChartRef.current.toBase64Image();
      studentByHighestRiasecChartLink.click();

      const studentBySexChartLink = document.createElement('a');
      studentBySexChartLink.download = chartsInfo.studentBySexChart.filename;
      studentBySexChartLink.href = studentBySexChartRef.current.toBase64Image();
      studentBySexChartLink.click();

      if (!isOverAll) {
         const studentByStrandChartLink = document.createElement('a');
         studentByStrandChartLink.download = chartsInfo.studentByStrandChart.filename;
         studentByStrandChartLink.href = studentByStrandChartRef.current.toBase64Image();
         studentByStrandChartLink.click();
      }
   };

   useEffect(() => {
      isMounted.current = true;
      fetchDistinctStrand();

      return () => {
         isMounted.current = false;
      };
   }, []);

   useEffect(() => {
      isMounted.current = true;
      if (initialRender.current) {
         fetchConversationsByStrand('all');
         fetchAllConversations();
      } else initialRender.current = true;

      return () => {
         isMounted.current = false;
      };
   }, [strandOptions]);

   useEffect(() => {
      // adding count to riasec areas only if it is equal to highest score
      // # of student by their Highest/Strongest Score Riasec Aria
      conversations.forEach(conversation => {
         const strand = conversation.strand
            .toLowerCase()
            .replaceAll(' ', '')
            .replaceAll(/[^a-zA-Z ]/g, '');
         const scoreCode1 = conversation.riasec_code[0];
         const scoreCode2 = conversation.riasec_code[1];
         const scoreCode3 = conversation.riasec_code[2];

         // add +1 in specific area if riasec_code's riasec_area is same as area (riasec area)
         // execute only if 1nd riasec_code's score must not be zero
         // add +1 to the strand
         if (scoreCode1[1] && scoreCode1[0] === 'realistic') {
            setStudentByHighestRiasec(prev => ({ ...prev, realistic: prev.realistic + 1 }));
            if (inputs.strand === 'all') {
               setStudentByHighestRiasecPerStrand(prev => ({ ...prev, realistic: { ...prev.realistic, [strand]: prev.realistic[strand] + 1 } }));
            }
         } else if (scoreCode1[1] && scoreCode1[0] === 'investigative') {
            setStudentByHighestRiasec(prev => ({ ...prev, investigative: prev.investigative + 1 }));
            if (inputs.strand === 'all') {
               setStudentByHighestRiasecPerStrand(prev => ({
                  ...prev,
                  investigative: { ...prev.investigative, [strand]: prev.investigative[strand] + 1 },
               }));
            }
         } else if (scoreCode1[1] && scoreCode1[0] === 'artistic') {
            setStudentByHighestRiasec(prev => ({ ...prev, artistic: prev.artistic + 1 }));
            if (inputs.strand === 'all') {
               setStudentByHighestRiasecPerStrand(prev => ({ ...prev, artistic: { ...prev.artistic, [strand]: prev.artistic[strand] + 1 } }));
            }
         } else if (scoreCode1[1] && scoreCode1[0] === 'social') {
            setStudentByHighestRiasec(prev => ({ ...prev, social: prev.social + 1 }));
            if (inputs.strand === 'all') {
               setStudentByHighestRiasecPerStrand(prev => ({ ...prev, social: { ...prev.social, [strand]: prev.social[strand] + 1 } }));
            }
         } else if (scoreCode1[1] && scoreCode1[0] === 'enterprising') {
            setStudentByHighestRiasec(prev => ({ ...prev, enterprising: prev.enterprising + 1 }));
            if (inputs.strand === 'all') {
               setStudentByHighestRiasecPerStrand(prev => ({
                  ...prev,
                  enterprising: { ...prev.enterprising, [strand]: prev.enterprising[strand] + 1 },
               }));
            }
         } else if (scoreCode1[1] && scoreCode1[0] === 'conventional') {
            setStudentByHighestRiasec(prev => ({ ...prev, conventional: prev.conventional + 1 }));
            if (inputs.strand === 'all') {
               setStudentByHighestRiasecPerStrand(prev => ({
                  ...prev,
                  conventional: { ...prev.conventional, [strand]: prev.conventional[strand] + 1 },
               }));
            }
         }

         // add +1 in 2nd riasec_code's riasec_area if 1st riasec_code's score is equal to 2nd riasec_code's score
         // add +1 in 3nd riasec_code's riasec_area if 1st riasec_code's score is equal to 3nd riasec_code's score
         // execute only if 1nd riasec_code's score must not be zero
         // add +1 to the strand
         if (scoreCode1[1] && scoreCode1[1] === scoreCode2[1]) {
            setStudentByHighestRiasec(prev => ({ ...prev, [scoreCode2[0]]: prev[scoreCode2[0]] + 1 }));
            if (inputs.strand === 'all') {
               setStudentByHighestRiasecPerStrand(prev => ({
                  ...prev,
                  [scoreCode2[0]]: { ...prev[scoreCode2[0]], [strand]: prev[scoreCode2[0]][strand] + 1 },
               }));
            }
         }
         if (scoreCode1[1] && scoreCode1[1] === scoreCode3[1]) {
            setStudentByHighestRiasec(prev => ({ ...prev, [scoreCode3[0]]: prev[scoreCode3[0]] + 1 }));
            if (inputs.strand === 'all') {
               setStudentByHighestRiasecPerStrand(prev => ({
                  ...prev,
                  [scoreCode3[0]]: { ...prev[scoreCode3[0]], [strand]: prev[scoreCode3[0]][strand] + 1 },
               }));
            }
         }

         // adding to count to male and female
         // # of students by sex
         if (conversation.sex === 'Male') {
            setStudentBySex(prev => ({ ...prev, male: prev.male + 1 }));
            if (inputs.strand === 'all') setStudentBySexPerStrand(prev => ({ ...prev, male: { ...prev.male, [strand]: prev.male[strand] + 1 } }));
         }
         if (conversation.sex === 'Female') {
            setStudentBySex(prev => ({ ...prev, female: prev.female + 1 }));
            setStudentBySexPerStrand(prev => ({ ...prev, female: { ...prev.female, [strand]: prev.female[strand] + 1 } }));
         }
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
         <div className='d-flex flex-wrap justify-content-end align-items-center'>
            <div className='d-flex align-items-center me-3 mb-3'>
               <span className='text-sm me-3'>Strand: </span>
               <select className='form-select' name='strand' id='strand' onChange={handleFilterStrandChange} disabled={isLoading}>
                  <option value='all'>Overall</option>
                  {strandOptions &&
                     strandOptions.map((strand, i) => (
                        <option className='text-wrap' key={i} value={strand}>
                           {strand}
                        </option>
                     ))}
               </select>
            </div>

            <div className='d-flex align-items-center me-3 mb-3'>
               <div className='form-check'>
                  <input
                     className='form-check-input me-2'
                     type='checkbox'
                     value={isFilterBySchoolYear}
                     checked={isFilterBySchoolYear}
                     id='isFilterBySchoolYear'
                     name='isFilterBySchoolYear'
                     onChange={handleIsFilterByYearChange}
                  />
                  <span className='text-sm me-2'>School Year:</span>
               </div>
               <div>
                  <DatePicker
                     className='form-control datepicker'
                     disabled={!isFilterBySchoolYear}
                     selected={schoolYearStart}
                     onChange={date => setSchoolYearStart(date)}
                     showYearPicker
                     dateFormat='yyyy'
                  />
               </div>
               <div className='mx-1'>-</div>
               <div>
                  <input
                     type='text'
                     name='end-year'
                     id='year'
                     className='form-control me-2 datepicker'
                     disabled
                     value={schoolYearStart ? schoolYearStart.getFullYear() + 1 : ''}
                  />
               </div>
            </div>

            <button className='btn btn-primary btn-sm me-3 mb-3' onClick={filter} disabled={isLoading}>
               <MdFilterAlt className='icon-small me-1' /> Filter
            </button>

            <button className='btn btn-primary btn-sm me-3 mb-3' onClick={download} disabled={isLoading}>
               <MdDownload className='icon-small me-1' /> Download
            </button>
         </div>
         <div className='w-100 d-flex flex-wrap justify-content-center align-items-center'>
            {!isLoading ? (
               <>
                  <div className='chart-container'>
                     <BarChart
                        ref={studentByHighestRiasecChartRef}
                        data={studentByHighestRiasecData}
                        options={getOptions('Number of Students by Highest/Strongest RIASEC Area')}
                     />
                  </div>
                  <div className='chart-container'>
                     <BarChart ref={studentBySexChartRef} data={studentBySexData} options={getOptions('Number of Students by Sex')} />
                  </div>
                  {!isOverAll && (
                     <div className='chart-container'>
                        <BarChart ref={studentByStrandChartRef} data={studentByStrandData} options={getOptions('Number of Students by Strand')} />
                     </div>
                  )}
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
