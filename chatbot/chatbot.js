'use strict';

const dialogflow = require('dialogflow');
const structjson = require('structjson');
const config = require('../config/key');

const projectId = config.google_project_id;
const sessionId = config.dialogflow_session_id;
const languageCode = config.dialogflow_session_language_code;
const credentials = {
   client_email: config.google_client_email,
   private_key: config.google_private_key,
};

// passing credentials this wy will very beneficial,
// because you dont have to set export export GOOGLE_APPLICATION_CREDENTIALS environment variable in local machine
const sessionClient = new dialogflow.SessionsClient({ projectId, credentials });

module.exports = {
   textQuery: async (text, userId, parameters = {}) => {
      // define session path
      // self = module export, allow us to access another module export method
      const sessionPath = sessionClient.sessionPath(projectId, sessionId + userId);
      const self = module.exports;

      const request = {
         session: sessionPath,
         queryInput: {
            text: {
               text: text,
               languageCode,
            },
         },
         queryParams: {
            payload: {
               data: parameters,
            },
         },
      };

      try {
         let responses = await sessionClient.detectIntent(request);
         responses = await self.handleAction(responses);
         return responses;
      } catch (err) {
         console.error(err);
      }
   },

   eventQuery: async (event, userId, parameters = {}) => {
      // self = module export, allow us to access another module export method
      const sessionPath = sessionClient.sessionPath(projectId, sessionId + userId);
      let self = module.exports;

      const request = {
         session: sessionPath,
         queryInput: {
            event: {
               name: event,
               parameters: structjson.jsonToStructProto(parameters),
               languageCode,
            },
         },
      };

      try {
         let responses = await sessionClient.detectIntent(request);
         responses = await self.handleAction(responses);
         return responses;
      } catch (err) {
         console.error(err);
      }
   },

   // function that will handle actions, **TEMPORARY NOT FINISH**
   handleAction: responses => responses,
};
