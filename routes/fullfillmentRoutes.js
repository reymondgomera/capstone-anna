const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const Course = require('../models/Course');
const VideoMaterial = require('../models/VideoMaterial');

module.exports = app => {
   app.post('/', async (req, res) => {
      const agent = new WebhookClient({ request: req, response: res });

      console.log('\nintent = ', agent.intent);
      console.log('paramters = ', JSON.stringify(agent.parameters));
      console.log('context = ', JSON.stringify(agent.contexts));
      console.log('messages = ', JSON.stringify(agent.consoleMessages));
      console.log('query = ', agent.query);
      console.log('type of query = ', typeof agent.query + '\n');

      // Utilities funcions
      const capitalizeFirstLetter = string => {
         return string.charAt(0).toUpperCase() + string.slice(1);
      };
      const getAandAn = string => {
         const vowels = ['A', 'E', 'I', 'O', 'U', 'a', 'e', 'i', 'o', 'u'];
         return vowels.includes(string.charAt(0)) ? 'an' : 'a';
      };

      // intent funcions handler
      const handleGetName = agent => {
         const userQuery = agent.query;

         // check if contains digit
         if (/\d/.test(userQuery)) {
            agent.add(' ');
            // You cannot have number in your name. Please tell your name again. Thank you 😊.
            // There can't be a number in your name. Please repeat your name for me. Thank you 😊.
            agent.setFollowupEvent('GET_NAME_WITH_NUMBER_FALLBACK');
         } else {
            const payload = {
               quick_replies: [
                  {
                     text: 'Yes',
                     payload: 'n/a',
                  },
                  {
                     payload: 'n/a',
                     text: 'No',
                  },
               ],
            };
            agent.consoleMessages.forEach(message => agent.add(message));
            agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
         }
      };

      const handleGetAge = agent => {
         if (agent.parameters.hasOwnProperty('age')) {
            if (agent.parameters.age <= 0) {
               agent.add(' '); // adding dummy text to avoid error -> No responses defined for platform: null
               agent.setFollowupEvent('GET_AGE_LOW_FALLBACK');
            } else if (agent.parameters.age > 200) {
               agent.add(' '); // adding dummy text to avoid error -> No responses defined for platform: null
               agent.setFollowupEvent('GET_AGE_HIGH_FALLBACK');
            } else agent.consoleMessages.forEach(message => agent.add(message));
         } else {
            agent.add(' '); // adding dummy text to avoid error -> No responses defined for platform: null
            agent.setFollowupEvent('GET_AGE_FALLBACK');
         }
      };

      const handleGetSex = async agent => {
         const payload = {};

         try {
            const distinctStrand = await Course.distinct('strand');
            payload.quick_replies = distinctStrand.map(strand => ({ payload: 'n/a', text: strand }));

            agent.consoleMessages.forEach(message => agent.add(message));
            agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
         } catch (err) {
            console.error(err.message);

            // when error occur end the conversation, clear all context
            const contexts = agent.contexts;
            const errorPayload = { end_conversation: true };

            // clear all context by setting lifespan to zero (0)
            contexts.forEach(context => {
               agent.setContext({ name: context.name, lifespan: 0 });
            });

            agent.add(
               'Sorry. I am having trouble 🤕. I was unable to look up the distinct strand, which was supposed to be the basis of my recommendation. I need to terminate. Will be back later.'
            );
            agent.add(new Payload(agent.UNSPECIFIED, errorPayload, { rawPayload: true, sendAsMessage: true }));
         }
      };

      const handleCourseOptionsYes = async agent => {
         const payload = {
            cards: [],
            text: '',
            quick_replies: [
               {
                  text: 'Continue',
                  payload: 'RIASEC_START',
               },
            ],
         };

         try {
            const videoMaterials = await VideoMaterial.find({}).sort({ createdAt: 'asc' });
            payload.cards = videoMaterials.map(card => ({ title: card.title, link: card.url }));

            agent.consoleMessages.forEach(message => agent.add(message));
            agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
         } catch (err) {
            console.error(err.message);

            // when error occur end the conversation, clear all context
            const contexts = agent.contexts;
            const errorPayload = { end_conversation: true };

            // clear all context by setting lifespan to zero (0)
            contexts.forEach(context => {
               agent.setContext({ name: context.name, lifespan: 0 });
            });

            agent.add(
               'Sorry. I am having trouble 🤕. I was unable to look up the video materials, which I was supposed to be providing. I need to terminate. Will be back later.'
            );
            agent.add(new Payload(agent.UNSPECIFIED, errorPayload, { rawPayload: true, sendAsMessage: true }));
         }
      };

      const handleWelcome = agent => {
         // clear riasecContext if exist when intent trigger
         const riasecContext = agent.getContext('riasec');
         if (riasecContext) agent.setContext({ name: riasecContext.name, lifespan: 0 });
         agent.consoleMessages.forEach(message => agent.add(message));
      };

      const handleRiasecStart = agent => {
         // remove basic-info contenxt
         const basicInfoContext = agent.getContext('basic-info');
         const payload = {
            quick_replies: [
               {
                  text: 'Yes',
                  payload: 'n/a',
               },
               {
                  payload: 'n/a',
                  text: 'No',
               },
            ],
            isriasec_quick_replies: true,
         };
         if (basicInfoContext) agent.setContext({ name: basicInfoContext.name, lifespan: 0 });

         agent.consoleMessages.forEach(message => agent.add(message));
         agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
      };

      const handleFallbackExceedTriggerLimit = agent => {
         const contexts = agent.contexts;

         // clear all context by setting lifespan to zero (0)
         contexts.forEach(context => {
            agent.setContext({ name: context.name, lifespan: 0 });
         });

         agent.consoleMessages.forEach(message => agent.add(message));
      };

      const handleRiasecRecommendation = async agent => {
         // context based on the event name - ex : sample_recommend, which contains paramaters sent from front end
         // the parameter  passsed  from front-end to dialogflow will be avaiable in the context
         // the agent.parameters is empty because the paramaters passed is in the context
         // dialogflow automatically create context based on the event name which contains the context you passed from front-end
         // dialogflow does not store the context passed from front-end to agent.parameters instead in the agent.context

         const context = agent.contexts.filter(el => el.name === 'riasec_recommendation'); // get the specific context
         const parameters = context[0].parameters;

         console.log(parameters['0'][0], ' = ', parameters['0'][1]);
         console.log(parameters['1'][0], ' = ', parameters['1'][1]);
         console.log(parameters['2'][0], ' = ', parameters['2'][1]);

         if (!parameters['0'][1] && !parameters['1'][1] && !parameters['2'][1]) {
            agent.add(' ');
            agent.setFollowupEvent('NO_RIASEC_RECOMMENDED_COURSES');
         } else {
            // if riasec scores are not all zero
            const riasecAreas = {
               realistic: 'who are often good at mechanical or athletic jobs.',
               investigative: 'who like to watch, learn, analyze and solve problems.',
               artistic: 'like to work in unstructured situations where you can use your creativity.',
               social: 'who like to work with other people, rather than things.',
               enterprising: 'who like to work with others and enjoy persuading and and performing.',
               conventional: 'who are very detail oriented, organized and like to work with data.',
            };

            const riasecAreasIdentify = `
            Now, I already know the things you are interested in. You are ${getAandAn(parameters['0'][0])} 
            “${capitalizeFirstLetter(parameters['0'][0])}” ${!parameters['1'][1] && !parameters['2'][1] ? ' person.' : ''} 
            ${parameters['0'][1] && parameters['1'][1] && !parameters['2'][1] ? ' and ' : ''} ${parameters['2'][1] ? ' ,' : ''}
            ${parameters['1'][1] ? `“${capitalizeFirstLetter(parameters['1'][0])}”${parameters['2'][1] ? ' and ' : ' person.'}` : ''} 
            ${parameters['2'][1] ? `“${capitalizeFirstLetter(parameters['2'][0])}” person.` : ''}`;

            const riasecAreasDescription = `
            You’re ${getAandAn(parameters['0'][0])} "${capitalizeFirstLetter(parameters['0'][0])}" person ${riasecAreas[parameters['0'][0]]} 
            ${parameters['1'][1] && parameters['2'][1] ? "You're also" : ''} 
            ${parameters['1'][1] && !parameters['2'][1] ? 'Lastly, I found out that your are' : ''}
            ${
               parameters['1'][1]
                  ? `${getAandAn(parameters['1'][0])} "${capitalizeFirstLetter(parameters['1'][0])}" person, ${riasecAreas[parameters['1'][0]]}`
                  : ''
            } 
            ${
               parameters['2'][1]
                  ? `Lastly, I found out that your are ${getAandAn(parameters['2'][0])} "${capitalizeFirstLetter(parameters['2'][0])}" person, ${
                       riasecAreas[parameters['2'][0]]
                    }`
                  : ''
            }`;

            const riasec1 = parameters['0'][0].toUpperCase(); // highest score riasec area
            const riasec2 = parameters['1'][0].toUpperCase(); // second or same with higest
            const riasec3 = parameters['2'][0].toUpperCase(); // third or same with higest
            const toFilterRiasecArea = [parameters['0'][0].toUpperCase()];
            const payload = { basis: 'riasec' };

            console.log('\n1.', riasec1);
            console.log('2.', riasec2);
            console.log('3.', riasec3);

            // Add into the toFilterRiasecArea the riasec area that is euqal to the highest score riasec area
            // value of toFilterRiasecArea are the riasec area
            if (parameters['0'][1] === parameters['1'][1]) toFilterRiasecArea.push(riasec2);
            if (parameters['0'][1] === parameters['2'][1]) toFilterRiasecArea.push(riasec3);

            console.log('filterObject = ', toFilterRiasecArea);

            // fetch courses or degree program based on toFilterRiasecArea
            try {
               const riasecBasedRecommendedCourses = await Course.find({ riasec_area: { $in: toFilterRiasecArea } }).sort({ name: 'asc' });
               const riasecBasedRecommendedCoursesNames = riasecBasedRecommendedCourses.map(course => course.name);
               payload.riasec_recommended_courses = riasecBasedRecommendedCoursesNames;

               agent.add(riasecAreasIdentify);
               agent.add(riasecAreasDescription);
               agent.add(
                  `If you want to know more about the components of RIASEC, please navigate <a className='message-text-link' href="/#learn-riasec">here</a>.`
               );
               agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true })); // passed custom payload
            } catch (err) {
               console.error(err.message);

               // when error occur end the conversation, clear all context
               const contexts = agent.contexts;
               const errorPayload = { end_conversation: true };

               // clear all context by setting lifespan to zero (0)
               contexts.forEach(context => {
                  agent.setContext({ name: context.name, lifespan: 0 });
               });

               agent.add(
                  'Sorry. I am having trouble 🤕. I was unable to look up the degree programs, which was supposed to be my recommendation based on your RIASEC result. I need to terminate. Will be back later.'
               );
               agent.add(new Payload(agent.UNSPECIFIED, errorPayload, { rawPayload: true, sendAsMessage: true }));
            }
         }
      };

      const handleStrandRecommendation = async agent => {
         const context = agent.contexts.filter(el => el.name === 'strand_recommendation'); // get the specific context
         const parameters = context[0].parameters;
         const toFilterStrand = [parameters['strand'].toUpperCase()];
         const payload = { basis: 'strand' };

         console.log('toFilterStrand = ', toFilterStrand);

         try {
            const strandBasedRecommendedCourses = await Course.find({ strand: { $in: toFilterStrand } }).sort({ name: 'asc' });
            const strandBasedRecommendedCoursesNames = strandBasedRecommendedCourses.map(course => course.name);

            payload.strand_recommended_courses = strandBasedRecommendedCoursesNames;
            agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true })); // passed custom payload
         } catch (err) {
            console.error(err.message);

            // when error occur end the conversation, clear all context
            const contexts = agent.contexts;
            const errorPayload = { end_conversation: true };

            // clear all context by setting lifespan to zero (0)
            contexts.forEach(context => {
               agent.setContext({ name: context.name, lifespan: 0 });
            });

            agent.add(
               'Sorry. I am having trouble 🤕. I was unable to look up the degree programs, which was supposed to be my recommendation based on your strand. I need to terminate. Will be back later.'
            );
            agent.add(new Payload(agent.UNSPECIFIED, errorPayload, { rawPayload: true, sendAsMessage: true }));
         }
      };

      const handleGetRiasecRecommendationCourseInfo = async agent => {
         const context = agent.contexts.filter(el => el.name === 'get_riasec_recommendation_course_info'); // get the specific context
         const parameters = context[0].parameters;
         const courseToLookup = parameters.course_to_lookup;

         try {
            const course = await Course.findOne({ name: courseToLookup });
            if (course) {
               const payload = {
                  quick_replies: [
                     {
                        text: 'I am satisfied',
                        payload: 'ISWANT_STRAND_RECOMMENDATION',
                     },
                     {
                        text: "I'd like to know other degree programs",
                        payload: 'ISLEARN_RIASEC_RECOMMENDED_COURSES_YES',
                     },
                  ],
               };

               agent.add(course.description);
               agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
            } else {
               agent.add(' ');
               agent.setFollowupEvent('ISLEARN_RIASEC_RECOMMENDED_COURSES_YES');
            }
         } catch (err) {
            console.error(err.message);

            // when error occur end the conversation, clear all context
            const contexts = agent.contexts;
            const errorPayload = { end_conversation: true };

            // clear all context by setting lifespan to zero (0)
            contexts.forEach(context => {
               agent.setContext({ name: context.name, lifespan: 0 });
            });

            agent.add(
               'Sorry. I am having trouble 🤕. I was unable to look up the degree programs information at the moment. I need to terminate. Will be back later.'
            );

            agent.add(new Payload(agent.UNSPECIFIED, errorPayload, { rawPayload: true, sendAsMessage: true }));
         }
      };

      const handleGetStrandRecommendationCourseInfo = async agent => {
         const context = agent.contexts.filter(el => el.name === 'get_strand_recommendation_course_info'); // get the specific context
         const parameters = context[0].parameters;
         const courseToLookup = parameters.course_to_lookup;

         try {
            const course = await Course.findOne({ name: courseToLookup });
            if (course) {
               const payload = {
                  quick_replies: [
                     {
                        text: 'I am satisfied',
                        payload: 'END_CONVERSATION', // temporary value
                     },
                     {
                        text: "I'd like to know other degree programs",
                        payload: 'ISLEARN_STRAND_RECOMMENDED_COURSES_YES',
                     },
                  ],
               };

               agent.add(course.description);
               agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
            } else {
               agent.add(' ');
               agent.setFollowupEvent('ISLEARN_STRAND_RECOMMENDED_COURSES_YES');
            }
         } catch (error) {
            console.error(err.message);

            // when error occur end the conversation, clear all context
            const contexts = agent.contexts;
            const errorPayload = { end_conversation: true };

            // clear all context by setting lifespan to zero (0)
            contexts.forEach(context => {
               agent.setContext({ name: context.name, lifespan: 0 });
            });

            agent.add(
               'Sorry. I am having trouble 🤕. I was unable to look up the degree programs information at the moment. I need to terminate. Will be back later.'
            );

            agent.add(new Payload(agent.UNSPECIFIED, errorPayload, { rawPayload: true, sendAsMessage: true }));
         }
      };

      const handleEndConversation = agent => {
         const contexts = agent.contexts;
         const payload = { end_conversation: true };

         // clear all context by setting lifespan to zero (0)
         contexts.forEach(context => {
            agent.setContext({ name: context.name, lifespan: 0 });
         });

         agent.consoleMessages.forEach(message => agent.add(message));
         agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
      };

      const checkUncertainty = agent => {
         // idea: assign this function to question-qustion-<number>-yes question-qustion-<number>-no question-qustion-<number>-fallback
         // idea: to check if their answer is cotains uncertain words or dont have idea then trigger intent for uncertain then set the context same as fallback to go back
         // idea: assign by iterating/looping 42 times, assign intent names dynamically using number

         const userQuery = agent.query;
         const texts = ['i dont know', "i don't know", 'maybe', 'perhaps', 'probably', 'might be'];

         let isUnsure = false;
         for (let i = 0; i < texts.length; i++) {
            if (userQuery.includes(texts[i])) {
               isUnsure = true;
               break;
            }
         }

         if (isUnsure) agent.add('You are unsure of what you said. Can please provide me an answer that you are sure and not being uncertain.');
         else agent.consoleMessages.forEach(message => agent.add(message));
      };

      // intents that has fulfillment enable
      // set IntentMap with intent name and a intent function handler to run for that intent
      let intentMap = new Map();
      intentMap.set('Default Welcome Intent', handleWelcome);
      intentMap.set('get-name', handleGetName);
      intentMap.set('get-age', handleGetAge);
      intentMap.set('get-sex', handleGetSex);
      intentMap.set('course-options-yes', handleCourseOptionsYes);
      intentMap.set('riasec-start', handleRiasecStart);
      intentMap.set('riasec-recommendation', handleRiasecRecommendation);
      intentMap.set('strand-recommendation', handleStrandRecommendation);
      intentMap.set('fallback-exceed-trigger-limit', handleFallbackExceedTriggerLimit);
      intentMap.set('get-riasec-recommendation-course-info', handleGetRiasecRecommendationCourseInfo);
      intentMap.set('get-strand-recommendation-course-info', handleGetStrandRecommendationCourseInfo);
      intentMap.set('end-conversation', handleEndConversation);

      // intentMap.set('riasec-start-fallback', checkUncertainty);
      agent.handleRequest(intentMap);
   });
};
