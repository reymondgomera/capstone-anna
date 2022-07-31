/* 
   connect server to dialogflow
   1. install  dialogflow package for using dialogflow Nodejs client
   2. create agent
   3. in your agent, create sevice account then give it a permission to dialogflow client
   4. with the service account generate a API key, which will be use for interacting with dialogflow project  
*/
const chatbot = require('../chatbot/chatbot.js');

module.exports = app => {
   app.post('/api/df_text_query', async (req, res) => {
      const { text, userId, parameters } = req.body;

      const responses = await chatbot.textQuery(text, userId, parameters);
      res.json(responses[0].queryResult);
   });

   app.post('/api/df_event_query', async (req, res) => {
      const { event, userId, parameters } = req.body;

      const responses = await chatbot.eventQuery(event, userId, parameters);
      res.json(responses[0].queryResult);
   });
};
