
// // if the above doesnt work comment it and uncomment the one below

// const pool = require('../connection/pool');
// const predefinedQuestions = require('../data/testData');

// module.exports = (req, res) => {
//     // const randomQuestions = generateRandomQuestions();
  
//     // Insert the questions into the database
//     pool.query('INSERT INTO questions (question, answer) VALUES ?', [predefinedQuestions.map(q => [q.question, q.answer])], (error, results) => {
//       if (error) {
//         console.error('Error populating questions table:', error);
//         res.status(500).send('An error occurred');
//       } else {
//         res.status(200).send('Questions table populated successfully');
//       }
//     });

//     res.send('Hello, World!')
// }

// ........................ 
const pool = require('../connection/pool');
const predefinedQuestions = require('../data/testData');

module.exports = (req, res) => {
  pool.query('CREATE TABLE IF NOT EXISTS resultcheck.questions (id INT AUTO_INCREMENT PRIMARY KEY, question TEXT, answer TEXT)', (error, results) => {
    if (error) {
      console.error('Error creating questions table:', error);
      res.status(500).send('An error occurred');
    } else {
      pool.query('INSERT INTO resultcheck.questions (question, answer) VALUES ?', [predefinedQuestions.map((q) => [q.question, q.answer])], (error, results) => {
        if (error) {
          console.error('Error populating questions table:', error);
          res.status(500).send('An error occurred');
        } else {
          res.status(200).send('Questions table populated successfully');
        }
      });
    }
  });
};

// ............................... 
// const pool = require('../connection/pool');
// const predefinedQuestions = require('../data/testData');

// module.exports = (req, res) => {
//   pool.query('CREATE DATABASE IF NOT EXISTS resultchecks', (error) => {
//     if (error) {
//       console.error('Error creating database:', error);
//       res.status(500).send('An error occurred');
//     } else {
//       pool.query('USE resultchecks', (error) => {
//         if (error) {
//           console.error('Error using database:', error);
//           res.status(500).send('An error occurred');
//         } else {
//           pool.query('CREATE TABLE IF NOT EXISTS questions (id INT AUTO_INCREMENT PRIMARY KEY, question TEXT, answer TEXT)', (error) => {
//             if (error) {
//               console.error('Error creating questions table:', error);
//               res.status(500).send('An error occurred');
//             } else {
//               pool.query('INSERT INTO questions (question, answer) VALUES ?', [predefinedQuestions.map((q) => [q.question, q.answer])], (error) => {
//                 if (error) {
//                   console.error('Error populating questions table:', error);
//                   res.status(500).send('An error occurred');
//                 } else {
//                   res.status(200).send('Questions table populated successfully');
//                 }
//               });
//             }
//           });
//         }
//       });
//     }
//   });
// };
