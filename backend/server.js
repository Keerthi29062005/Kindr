const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const ADK_URL = "https://8000-cs-403735516902-default.cs-asia-southeast1-ajrg.cloudshell.dev/dev-ui/run"; // ADK default endpoint

app.post('/api/analyze', async (req, res) => {
  try {
    const { text, location, reportType } = req.body;

    const prompt = `
Analyze this field report:

Location: ${location}
Type: ${reportType}

Report:
${text}
`;

    const response = await axios.post(ADK_URL, {
      input: prompt
    });

    res.json({
      analysis: response.data.output
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});