const { WebhookClient } = require('dialogflow-fulfillment');

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
               console.log('low');
               agent.add(' '); // adding dummy text to avoid error -> No responses defined for platform: null
               agent.setFollowupEvent('GET_AGE_LOW_FALLBACK');
            } else if (agent.parameters.age > 200) {
               console.log('high');
               agent.add(' '); // adding dummy text to avoid error -> No responses defined for platform: null
               agent.setFollowupEvent('GET_AGE_HIGH_FALLBACK');
            } else agent.consoleMessages.forEach(message => agent.add(message));
         } else {
            agent.add(' '); // adding dummy text to avoid error -> No responses defined for platform: null
            agent.setFollowupEvent('GET_AGE_FALLBACK');
         }
      };

      const handleRiasecStart = agent => {
         // remove basic-info contenxt
         const basicInfoContext = agent.getContext('basic-info');
         agent.setContext({ name: basicInfoContext.name, lifespan: 0 });
         agent.consoleMessages.forEach(message => agent.add(message));
      };

      // intents that has fulfillment enable
      // set IntentMap with intent name and a intent function handler to run for that intent
      let intentMap = new Map();
      intentMap.set('get-age', handleGetAge);
      intentMap.set('riasec-start', handleRiasecStart);
      agent.handleRequest(intentMap);
   });
};
