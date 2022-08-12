const config = require('./config/key');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
mongoose.connect(config.mongo_URI, { useNewUrlParser: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/auth', require('./routes/authenticationRoutes'));
require('./routes/dialogflowRoutes')(app); // (app) added at the end, to allow app to be accessible in dialogflowRoutes
require('./routes/fullfillmentRoutes')(app);

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
