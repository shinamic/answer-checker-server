require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { check, saveSubmission, populateQuestions, getQuestion } = require('./routes');
const { populate } = require('dotenv');

app.use(cors());
app.use(bodyParser.json());

// app.post('/check', check);

app.get('/getQuestion', getQuestion);

app.post('/saveSubmission', saveSubmission);

// Endpoint to populate the questions table
app.get('/populateQuestions', populateQuestions);

// start the server
const listener = app.listen(9000, () => {
    console.log(`App listening to port ${listener.address().port}`)
});