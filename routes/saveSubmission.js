const pool = require('../connection/pool');
const gpt = require('../apis/gpt');

async function getAnswersFromDatabase(ids) {
  return new Promise((resolve, reject) => {
    // Acquire a connection from the pool
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
        return;
      }

      // Prepare the list of IDs as a comma-separated string
      const idList = ids.join(',');

      // Perform the database query to retrieve answers and questions for the given IDs
      const query = `SELECT id, question, answer FROM questions WHERE id IN (${idList})`;
      connection.query(query, (error, results) => {
        // Release the connection back to the pool
        connection.release();

        if (error) {
          reject(error);
          return;
        }

        resolve(results);
      });
    });
  });
}

module.exports = async (req, res) => {
    const { submissions } = req.body;
    try {
        const resultsArr = [];
        for (const submission of submissions) {
          const { answer: response, id } = submission;
          resultsArr.push({
            response,
            id
          });
        }
        const ids = resultsArr.map(result => result.id);
        const answersAndQuestions = await getAnswersFromDatabase(ids);

        for (let i = 0; i < resultsArr.length; i++) {
          const result = answersAndQuestions.find(item => item.id === resultsArr[i].id);
          resultsArr[i].answer = result ? result.answer : '';
          resultsArr[i].question = result ? result.question : '';
        }
        const verification = await gpt(resultsArr.reduce((acc, cur) => {
          console.log(`id: ${cur.id}
          question: ${cur.question}
          response: ${cur.response}
          answer: ${cur.answer}`);
          return `${acc}\n
          id: ${cur.id}
          Question: ${cur.question}
          Response: ${cur.response}
          Expert Answer: ${cur.answer}
        `
        }, ''));


        console.log(`Verification: ${verification}`);
        // Insert the verification results into the submissions table
    // pool.getConnection((error, connection) => {
    //   if (error) {
    //     console.error('Error connecting to the database:', error);
    //     res.status(500).send({
    //       error: 'An error occurred'
    //     });
    //     return;
    //   }

    //   const insertQuery = 'INSERT INTO submissions (questionid, response, comment) VALUES (?, ?, ?)';
    //   const values = JSON.parse(verification).map(result => [result.id, result.Response, result.comment]);

    //   connection.query(insertQuery, values, (error, _) => {
    //     connection.release();
    //     if (error) {
    //       console.error('Error inserting into the submissions table:', error);
    //       res.status(500).send({
    //         error: 'An error occurred'
    //       });
    //     } else {
    //       res.status(200).json({
    //         message: JSON.parse(verification),
    //       });
    //     }
    //   });
    // });
    res.status(200).json({
              message: JSON.parse(verification),
            });
    } catch (error) {
      console.error('Error saving submission:', error);
      res.status(500).send({
        error: 'An error occurred'
      });
    }    
}