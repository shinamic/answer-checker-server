const pool = require('../connection/pool');
const predefinedQuestions = require('../data/testData');

module.exports = (req, res) => {
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

    res.send('Hello, World!')
}