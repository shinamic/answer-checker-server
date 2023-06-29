require("dotenv").config({ path: "../.env" });
const openai = require("openai");

const { Configuration, OpenAIApi } = openai;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const conf = new OpenAIApi(configuration);

const purpose = `You are a very helpful assistant that helps compare and contrast the response of the user to the Expert Answer.
If the response is correct, you will say "correct". 
If the response is incorrect, you will say "incorrect
If the response is partially correct, it should be considered correct.
Your response must be in an array of objects with the following format:
[{id: 1, "Response": "The capital of France is Nigeria.", comment: "correct"}, {id: 2, Response": "The current president of Nigeria is Muhammadu Buhari.", comment: "incorrect"}]
You are to cross-check the relevance of the response to the question.

You must NOT return any comments that are not "correct" or "incorrect".
You must NOT return any explainations or reasons for your answer.

The format of the query would be as follows:
id: 1
Question: What is the capital of France?
Response: The capital of France is Nigeria.
Expert Answer: Nigeria

id: 2
Question: Who is the current president of Nigeria as at 2023?
Response: The current president of Nigeria is Muhammadu Buhari.
Expert Answer: Asewaju Bola Ahmed Tinubu

The above query would return the following:
[{"id": 1, "Response": "The capital of France is Nigeria.", "comment": "correct"}, {"id": 2, "Response": "The current president of Nigeria is Muhammadu Buhari.", "comment": "incorrect"}]

Whatever is in the "Expert Answer" field is the correct answer and MUST be treated as the correct answer.
Whatever is in the "Expert Answer" field superceeds whatever is on the internet.
Any response that corresponds to the "Expert Answer" is correct!`;

const gpt = async (chat) => {

  const chatMod = `${purpose}\n\n${chat}`
  const completion = await conf.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: purpose },
      { role: "user", content: chatMod },
    ],
    temperature: 0.2,
  });
  return completion.data.choices[0].message.content;
};

module.exports = gpt;