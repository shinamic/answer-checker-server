const pool = require('../connection/pool');

module.exports = (req, res) => {
    // Fetch 5 questions from the questions table
    pool.query('SELECT question, id FROM questions', (error, results) => {
     if (error) {
       console.error('Error retrieving questions:', error);
       res.status(500).send('An error occurred');
     } else {
       res.status(200).json(results);
     }
   });
}