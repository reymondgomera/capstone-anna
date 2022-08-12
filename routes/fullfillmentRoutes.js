const { WebhookClient, Payload } = require('dialogflow-fulfillment');

module.exports = app => {
   app.post('/', async (req, res) => {
      const agent = new WebhookClient({ request: req, response: res });

      console.log('\n intent = ', agent.intent);
      console.log('paramters = ', JSON.stringify(agent.parameters));
      console.log('context = ', JSON.stringify(agent.contexts));
      console.log('messages = ', JSON.stringify(agent.consoleMessages) + '\n');
      console.log('query = ', agent.query); // user quiery
      console.log('type of query = ', typeof agent.query);
      // Utilities funcions
      const capitalizeFirstLetter = string => {
         return string.charAt(0).toUpperCase() + string.slice(1);
      };
      const getAandAn = string => {
         const vowels = ['A', 'E', 'I', 'O', 'U', 'a', 'e', 'i', 'o', 'u'];
         return vowels.includes(string.charAt(0)) ? 'an' : 'a';
      };

      // intent funcions handler
      const handleGetAge = () => {
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

      const handleWelcome = agent => {
         // clear riasecContext if exist when intent trigger
         const riasecContext = agent.getContext('riasec');
         if (riasecContext) agent.setContext({ name: riasecContext.name, lifespan: 0 });
         agent.consoleMessages.forEach(message => agent.add(message));
      };

      const handleRiasecStart = agent => {
         // remove basic-info contenxt
         const basicInfoContext = agent.getContext('basic-info');
         if (basicInfoContext) agent.setContext({ name: basicInfoContext.name, lifespan: 0 });
         agent.consoleMessages.forEach(message => agent.add(message));
      };

      const handleSampleRecommend = agent => {
         // console.log('parameters = ', agent.parameters);
         // console.log('context = ', JSON.stringify(agent.contexts));

         // context based on the event name - ex : sample_recommend, which contains paramaters sent from front end
         const context = agent.contexts.filter(el => el.name === 'sample_recommend'); // get the specific context
         const parameters = context[0].parameters;
         console.log('context = ', context);
         console.log('paramters = ', context[0].parameters);

         agent.add(
            `what hello ${parameters.name} fullfillment passed paramters , you are a ${parameters.riasec} ${parameters.sampleArray[0]} ${parameters.sampleArray[1]}`
         );
         n;
         // the parameter  passsed  from front to dialogflow will be avaiable in the context
         // the agent.parameters is empty because the paramaters passed is in the context
         // dialogflow automatically create context based on the event name which contains the context you passed from front end
         // dialogflow does not store the context passed from front-end to agent.parameters instead in the agent.context

         // send custom payload
         const payload = {
            sample1: 'value',
            sample2: 2,
         };

         agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }));
      };

      const handleRiasecRecommendation = agent => {
         // context based on the event name - ex : sample_recommend, which contains paramaters sent from front end
         // the parameter  passsed  from front to dialogflow will be avaiable in the context
         // the agent.parameters is empty because the paramaters passed is in the context
         // dialogflow automatically create context based on the event name which contains the context you passed from front-end
         // dialogflow does not store the context passed from front-end to agent.parameters instead in the agent.context

         const context = agent.contexts.filter(el => el.name === 'riasec_recommendation'); // get the specific context
         const parameters = context[0].parameters;

         const riasecAreas = {
            realistic: 'who are often good at mechanical or athletic jobs.',
            investigative: 'who like to watch, learn, analyze and solve problems.',
            artistic: 'like to work in unstructured situations where you can use your creativity.',
            social: 'who like to work with other people, rather than things.',
            enterprising: 'who like to work with others and enjoy persuading and and performing.',
            conventional: 'who are very detail oriented, organized and like to work with data.',
         };

         const riasecAreasIdentify = `
         Now. I already know the things you are interested in. You are ${getAandAn(parameters['0'][0])} “${capitalizeFirstLetter(
            parameters['0'][0]
         )}”, “${capitalizeFirstLetter(parameters['1'][0])}” and “${capitalizeFirstLetter(parameters['2'][0])}” person.`;

         const riasecAreasDescription = `
         You’re ${getAandAn(parameters['0'][0])} "${capitalizeFirstLetter(parameters['0'][0])}" person ${riasecAreas[parameters['0'][0]]} 
         You’re also ${getAandAn(parameters['1'][0])} "${capitalizeFirstLetter(parameters['1'][0])}" person, ${riasecAreas[parameters['1'][0]]} 
         Lastly, I found out that your are ${getAandAn(parameters['2'][0])} "${capitalizeFirstLetter(parameters['2'][0])}" person, ${
            riasecAreas[parameters['2'][0]]
         }`;

         agent.add(riasecAreasIdentify);
         agent.add(riasecAreasDescription);
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
      intentMap.set('get-age', handleGetAge);
      intentMap.set('riasec-start', handleRiasecStart);
      intentMap.set('sample-recommend', handleSampleRecommend);
      intentMap.set('riasec-recommendation', handleRiasecRecommendation);

      // intentMap.set('riasec-start-fallback', checkUncertainty);
      agent.handleRequest(intentMap);
   });
};
