
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Replace with your actual keys
const accountSID = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const fromWhatsAppNumber = 'whatsapp:+14155238886';
const openaiKey = process.env.OPENAI_API_KEY;

const configuration = new Configuration({ apiKey: openaiKey });
const openai = new OpenAIApi(configuration);

app.post('/webhook', async (req, res) => {
  const incomingMsg = req.body.Body;
  const to = req.body.From;

  const gptResponse = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'أنت مساعد ذكي لشركة INNOVATECH المتخصصة في الأنظمة الذكية والبيوت الذكية.',
      },
      { role: 'user', content: incomingMsg },
    ],
  });

  let reply = gptResponse.data.choices[0].message.content;

  if (incomingMsg.toLowerCase().includes('الشارقة') || incomingMsg.includes('فيلا')) {
    reply += '\n\n📞 سيتم تحويلك للمهندسة سالي – 0565154473';
  }

  await axios.post(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSID}/Messages.json`,
    new URLSearchParams({
      To: to,
      From: fromWhatsAppNumber,
      Body: reply,
    }),
    { auth: { username: accountSID, password: authToken } }
  );

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Bot server running on port 3000');
});
