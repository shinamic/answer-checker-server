require('dotenv').config();
const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { check } = require('./routes');

app.use(cors());
app.use(bodyParser.json());

app.post('/check', check);

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'resultcheck'
});

app.get('/getQuestion', (req, res) => {
    // Fetch 5 questions from the questions table
    pool.query('SELECT question, id FROM questions LIMIT 5', (error, results) => {
     if (error) {
       console.error('Error retrieving questions:', error);
       res.status(500).send('An error occurred');
     } else {
       res.status(200).json(results);
     }
   });
 });

 async function getAnswerFromDatabase(questionid) {
    return new Promise((resolve, reject) => {
      // Acquire a connection from the pool
      pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
          return;
        }
  
        // Perform the database query
        const query = 'SELECT answer FROM questions WHERE id = ?';
        connection.query(query, [questionid], (error, results) => {
          // Release the connection back to the pool
          connection.release();
  
          if (error) {
            reject(error);
            return;
          }
  
          if (results.length > 0) {
            // Retrieve the answer from the query results
            const answer = results[0].answer;
            resolve(answer);
          } else {
            reject(new Error('Answer not found in the database'));
          }
        });
      });
    });
  }

app.post('/saveSubmission', async (req, res) => {
    const { submissions } = req.body;

    console.log('Received submissions:', submissions);
    try {
        // Process each submission
        for (const submission of submissions) {
            const { question, answer, questionid } = submission;

            // // Retrieve the correct answer from the database
            // const dbAnswer = await getAnswerFromDatabase(question);
            const dbAnswer = await getAnswerFromDatabase(questionid);


            console.log(`Question: ${question}`);
            console.log(`Database Answer: ${dbAnswer}`);
            console.log(`Student's Answer: ${answer}`);
            // console.log(`Database Answer: ${dbAnswer}`);
            // console.log(`Comparison Result: ${comparisonResult}`);
            // console.log(`Comparison Result: ${comparisonResult.score}`);
            console.log('---');
        }
        res.status(200).send('Submission saved successfully');
    } catch (error) {
      console.error('Error saving submission:', error);
      res.status(500).send('An error occurred');
    }    
});

// This is to populate just incase you mess up your database
const predefinedQuestions = [
    {
        question: 'What is the capital of France?',
        answer: 'Paris'
    },
    {
        question: 'Who wrote the novel "Pride and Prejudice"?',
        answer: 'Jane Austen'
    },
    {
        question: 'What is the largest planet in our solar system?',
        answer: 'Jupiter'
    },
    {
        question: 'Who painted the Mona Lisa?',
        answer: 'Leonardo da Vinci'
    },
    {
        question: 'What is the formula for calculating the area of a circle?',
        answer: 'π * r^2'
    },
    {
        question: 'Who discovered the theory of general relativity?',
        answer: 'Albert Einstein'
    },
    {
        question: 'What is the chemical symbol for gold?',
        answer: 'Au'
    },
    {
        question: 'Who is the author of "To Kill a Mockingbird"?',
        answer: 'Harper Lee'
    },
    {
        question: 'What is the capital of Japan?',
        answer: 'Tokyo'
    },
    {
        question: 'Who painted the Sistine Chapel ceiling?',
        answer: 'Michelangelo'
    },
    {
        question: 'What is the symbol for the element oxygen?',
        answer: 'O'
    },
    {
        question: 'Who wrote the play "Hamlet"?',
        answer: 'William Shakespeare'
    },
    {
        question: 'What is the largest ocean on Earth?',
        answer: 'Pacific Ocean'
    },
    {
        question: 'Who is the artist of the famous painting "Starry Night"?',
        answer: 'Vincent van Gogh'
    },
    {
        question: 'What is the capital of Australia?',
        answer: 'Canberra'
    },
    {
        question: 'Who developed the theory of evolution by natural selection?',
        answer: 'Charles Darwin'
    },
    {
        question: 'What is the chemical symbol for sodium?',
        answer: 'Na'
    },
    {
        question: 'Who wrote the novel "1984"?',
        answer: 'George Orwell'
    },
    {
        question: 'What is the tallest mountain in the world?',
        answer: 'Mount Everest'
    },
    {
        question: 'Who is the artist of the famous painting "The Last Supper"?',
        answer: 'Leonardo da Vinci'
    },
    {
        question: 'What is the symbol for the element carbon?',
        answer: 'C'
    },
    {
        question: 'Who wrote the play "Romeo and Juliet"?',
        answer: 'William Shakespeare'
    },
    {
        question: 'What is the largest continent?',
        answer: 'Asia'
    },
    {
        question: 'Who is the artist of the famous painting "Girl with a Pearl Earring"?',
        answer: 'Johannes Vermeer'
    },
    {
        question: 'What is the capital of Brazil?',
        answer: 'Brasília'
    },
    {
        question: 'Who is the author of "The Great Gatsby"?',
        answer: 'F. Scott Fitzgerald'
    },
    {
        question: 'What is the deepest ocean trench?',
        answer: 'Mariana Trench'
    },
    {
        question: 'Who is the artist of the famous sculpture "David"?',
        answer: 'Michelangelo'
    },
    {
        question: 'What is the symbol for the element hydrogen?',
        answer: 'H'
    },    
  ];

// Endpoint to populate the questions table
app.get('/populateQuestions', (req, res) => {
    // const randomQuestions = generateRandomQuestions();
  
    // Insert the questions into the database
    pool.query('INSERT INTO questions (question, answer) VALUES ?', [predefinedQuestions.map(q => [q.question, q.answer])], (error, results) => {
      if (error) {
        console.error('Error populating questions table:', error);
        res.status(500).send('An error occurred');
      } else {
        res.status(200).send('Questions table populated successfully');
      }
    });
  });

// start the server
const listener = app.listen(process.env.PORT || 9000, () => {
    console.log(`App listening to port ${listener.address().port}`)
});