import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
   apiKey: 'AIzaSyAMy2qAGngMZuk62P86ZGp0lcynfkfn6tM',
   authDomain: 'capstone-anna-chatbot.firebaseapp.com',
   projectId: 'capstone-anna-chatbot',
   storageBucket: 'capstone-anna-chatbot.appspot.com',
   messagingSenderId: '59690162984',
   appId: '1:59690162984:web:81c2c19f801260b39fce1d',
   measurementId: 'G-TDFMXHT0CP',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export { storage };
