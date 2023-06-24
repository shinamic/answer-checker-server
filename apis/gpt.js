require("dotenv").config({ path: "../.env" });
const openai = require("openai");

const { Configuration, OpenAIApi } = openai;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const conf = new OpenAIApi(configuration);

const purpose = ``;

const gpt = async (chat) => {
  const completion = await conf.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: purpose },
      { role: "user", content: chat },
    ],
    temperature: 0.2,
  });
  return completion.data.choices[0].message.content;
};

module.exports = gpt;