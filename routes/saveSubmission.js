const pool = require('../connection/pool');
const gpt = require('../apis/gpt');

async function getAnswerFromDatabase(questionid) {
    return new Promise((resolve, reject) => {
      // Acquire a connection from the pool
      pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
          return;
        }
  
        // Perform the database query
        const query = 'SELECT question, answer FROM questions WHERE id = ?';
        connection.query(query, [questionid], (error, results) => {
          // Release the connection back to the pool
          connection.release();
  
          if (error) {
            reject(error);
            return;
          }
  
          if (results.length > 0) {
            resolve(results[0]);
          } else {
            reject(new Error('Answer not found in the database'));
          }
        });
      });
    });
  }

module.exports = async (req, res) => {
  console.log(req.body);
    const { submissions } = req.body;
    try {
        // Process each 
        const resultsArr = [];
        
        // Work on this using SQL UNION.
        for (const submission of submissions) {
          const { answer: response, id } = submission;
          const {question, answer} = await getAnswerFromDatabase(id);
          resultsArr.push({
            question,
            response,
            answer,
            id
          });
        }
        const verification = await gpt(resultsArr.reduce((acc, cur) => `${acc}\n
          id: ${cur.id}
          Question: ${cur.question}
          Response: ${cur.response}
          Answer: ${cur.answer}
        `, ''));
        console.log(verification.trim());
        res.status(200).send({
            message: JSON.parse(JSON.stringify(verification.trim())),
        });
    } catch (error) {
      console.error('Error saving submission:', error);
      res.status(500).send({
        error: 'An error occurred'
      });
    }    
}