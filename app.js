const config = require('./config/key');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// db connect
mongoose.connect(config.mongo_URI, { useNewUrlParser: true });
mongoose.connection.on('connected', () => console.log('Connected to MongoDB database successfully'));
mongoose.connection.on('error', () => console.log('Error while connecting to MongoDB database: ' + err));
mongoose.connection.on('disconnected', () => console.log('MongoDB connection disconnected'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/auth', require('./routes/authenticationRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
require('./routes/dialogflowRoutes')(app); // (app) added at the end, to allow app to be accessible in dialogflowRoutes
require('./routes/fullfillmentRoutes')(app);

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
