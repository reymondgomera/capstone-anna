const { WebhookClient, Payload } = require('dialogflow-fulfillment');

module.exports = app => {
   app.post('/', async (req, res) => {
      const agent = new WebhookClient({ request: req, response: res });

      console.log('\n intent = ', agent.intent);
      console.log('paramters = ', JSON.stringify(agent.parameters));
      console.log('context = ', JSON.stringify(agent.contexts));
      console.log('messages = ', JSON.stringify(agent.consoleMessages) + '\n');
      // agent.conv().data

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
         const context = agent.contexts.filter(el => el.name === 'riasec_recommendation'); // get the specific context
         const parameters = context[0].parameters;

         console.log('parameters', parameters);

         const riasecAreas = {
            realistic: 'who are often good at mechanical or athletic jobs.',
            investigative: 'who like to watch, learn, analyze and solve problems.',
            artistic: 'like to work in unstructured situations where they can use their creativity',
            social: 'who like to work with other people, rather than things.',
            enterprising: 'who like to work with others and enjoy persuading and and performing.',
            conventional: 'who are very detail oriented,organized and like to work with data.',
         };

         const vowel = ['A', 'E', 'I', 'O', 'U', 'a', 'e', 'i', 'o', 'u'];

         const riasecAreasIdentify = `Now. I already know the things you are interested in. You are ${
            vowel.includes(parameters['0'][0].charAt(0)) ? 'an' : 'a'
         }  “${parameters['0'][0]}”, “${parameters['1'][0]}” and “${parameters['2'][0]}” person.`;

         const riasecAreasDescription = `
         You’re ${vowel.includes(parameters['0'][0].charAt(0)) ? 'an' : 'a'} "${parameters['0'][0]}" person ${riasecAreas[parameters['0'][0]]} 
         You’re also ${vowel.includes(parameters['1'][0].charAt(0)) ? 'an' : 'a'} "${parameters['1'][0]}" person, ${riasecAreas[parameters['1'][0]]} 
         Lastly, I found out that your are ${vowel.includes(parameters['2'][0].charAt(0)) ? 'an' : 'a'} "${parameters['2'][0]}" person, ${
            riasecAreas[parameters['2'][0]]
         } `;

         agent.add(riasecAreasIdentify);
         agent.add(riasecAreasDescription);
      };

      // intents that has fulfillment enable
      // set IntentMap with intent name and a intent function handler to run for that intent
      let intentMap = new Map();
      intentMap.set('Default Welcome Intent', handleWelcome);
      intentMap.set('get-age', handleGetAge);
      intentMap.set('riasec-start', handleRiasecStart);
      intentMap.set('sample-recommend', handleSampleRecommend);
      intentMap.set('riasec-recommendation', handleRiasecRecommendation);
      agent.handleRequest(intentMap);
   });
};
