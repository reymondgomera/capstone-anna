const config = require('./config/key');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// db connect
mongoose.connect(config.mongo_URI, { serverSelectionTimeoutMS: 60000, connectTimeoutMS: 60000, socketTimeoutMS: 60000 });
mongoose.connection.on('connected', () => console.log('Connected to MongoDB database successfully'));
mongoose.connection.on('disconnected', () => console.log('MongoDB connection disconnected'));
mongoose.connection.on('error', err => console.log('Error while connecting to MongoDB database: ' + err.message));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/auth', require('./routes/authenticationRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/user', require('./routes/UserRoutes'));
require('./routes/dialogflowRoutes')(app); // (app) added at the end, to allow app to be accessible in dialogflowRoutes
require('./routes/fullfillmentRoutes')(app);

if (process.env.NODE_ENV === 'production') {
   // js and css files
   // client/build will be our static folder and this will be serve by our server
   app.use(express.static(path.resolve(__dirname, 'client', 'build')));

   // index.html for for all page routes
   app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
   });
}

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
