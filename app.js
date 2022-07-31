const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

require('./routes/dialogflowRoutes')(app); // (app) added at the end, to allow app to be accessible in dialogflowRoutes

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
