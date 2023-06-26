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
  // console.log(req.body);
    const { submissions } = req.body;
    console.log('this is the submissions', submissions)
    try {
        // Process each 
        const resultsArr = [];
        console.log("step 1")
        console.log("this is the resultArr !!!!!!!!!", resultsArr)
        // Work on this using SQL UNION. omo boss we dont need union 
        for (const submission of submissions) {
          const { response, id } = submission;
          console.log('consolelogging the answer and id', response, id)
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
        const verification = await gpt(resultsArr.reduce((acc, cur) => `${acc}\n
          id: ${cur.id}
          Question: ${cur.question}
          Response: ${cur.response}
          Answer: ${cur.answer}
        `, ''));
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