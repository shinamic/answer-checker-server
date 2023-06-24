require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { check } = require('./routes');

app.use(cors());
app.use(bodyParser.json());

app.post('/check', check);

// start the server
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`App listening to port ${listener.address().port}`)
});