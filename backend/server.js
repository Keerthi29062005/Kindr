const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const FRONTEND_ORIGIN = "https://3000-cs-403735516902-default.cs-asia-southeast1-ajrg.cloudshell.dev";
const ADK_BASE = "http://localhost:8000"; // Use localhost — same machine, no auth issues
const APP_NAME = "kindr_agent"; // ← change this to your actual app name from list-apps

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Helper: call ADK agent and get response text
async function callAgent(prompt) {
  // Step 1: Create a new session
  const sessionRes = await axios.post(
    `${ADK_BASE}/apps/${APP_NAME}/users/user1/sessions`,
    {},
    { headers: { "Content-Type": "application/json" } }
  );
  const sessionId = sessionRes.data.id;
  console.log("Created session:", sessionId);

  // Step 2: Send message to agent
  const runRes = await axios.post(
    `${ADK_BASE}/run`,
    {
      app_name: APP_NAME,
      user_id: "user1",
      session_id: sessionId,
      new_message: {
        role: "user",
        parts: [{ text: prompt }]
      }
    },
    { headers: { "Content-Type": "application/json" }, timeout: 30000 }
  );

  console.log("Run response:", JSON.stringify(runRes.data, null, 2));

  // Step 3: Extract the agent's text reply
  const events = runRes.data;
  let agentText = "";

  if (Array.isArray(events)) {
    for (const event of events) {
      if (event.content && event.content.role === "model") {
        const parts = event.content.parts || [];
        for (const part of parts) {
          if (part.text) agentText += part.text;
        }
      }
    }
  } else if (typeof events === "object") {
    // Some ADK versions return a single object
    agentText = events.output || events.text || events.response || JSON.stringify(events);
  }

  console.log("Extracted agent text:", agentText);
  return agentText;
}

// Helper: parse JSON from agent response (handles markdown fences)
function parseAnalysis(text) {
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Could not parse JSON from agent, raw:", text);
    // Return structured fallback so frontend doesn't break
    return {
      summary: text.substring(0, 300) || "Analysis received but could not be parsed.",
      urgencyScore: 5,
      needs: [],
      recommendedActions: ["Please review the raw report manually."],
      volunteerRequirements: { urgentCount: 0, skills: [] }
    };
  }
}

app.post("/api/analyze", async (req, res) => {
  try {
    console.log("Incoming:", req.body);
    const { text, location, reportType } = req.body;

    const prompt = `You are a community needs analyst. Analyze this field report and respond with ONLY a valid JSON object, no markdown, no extra text.

Location: ${location}
Report Type: ${reportType}
Report: ${text}

Respond with exactly this JSON:
{
  "summary": "2-3 sentence summary",
  "urgencyScore": 8,
  "needs": [
    {
      "category": "Water",
      "description": "specific need description",
      "severity": "Critical",
      "estimatedAffected": 500,
      "requiredSkills": ["Logistics"],
      "urgencyRank": 1
    }
  ],
  "recommendedActions": ["action 1", "action 2"],
  "volunteerRequirements": {
    "urgentCount": 10,
    "skills": ["Medical", "Logistics"]
  }
}
Severity must be: Critical, High, Medium, or Low
Category must be: Medical, Water, Food, Education, Shelter, Sanitation, Electricity, Safety, Employment, or Mental Health`;

    const agentText = await callAgent(prompt);
    const analysis = parseAnalysis(agentText);

    res.json({ analysis });

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "AI analysis failed",
      details: error.response?.data || error.message
    });
  }
});

app.post('/api/insights', async (req, res) => {
  try {
    console.log("Insights request received");

    // ⚠️ TEMP: using dummy aggregated data
    // Later replace this with DB data
    const reportsData = `
Location: Dharavi - Water shortage, pipeline leakage
Location: Kharapur - contaminated water, maternal health issues
Location: Delhi slum - food shortage, malnutrition
`;

    const prompt = `
You are analyzing multiple NGO field reports.

DATA:
${reportsData}

Give high-level insights in JSON:

{
  "summary": "...",
  "topLocation": "...",
  "topNeed": "...",
  "trend": "...",
  "recommendation": "..."
}
`;


 const response = await callAgent(prompt);
 console.log("Insights response:", response);
    res.json({
      insights: response
    });

  } catch (err) {
    console.error("INSIGHTS ERROR:", err.message);
    res.status(500).json({ error: "Insights failed" });
  }
});

app.get("/api/reports", (req, res) => res.json({ reports: [] }));
app.get("/api/needs", (req, res) => res.json({ needs: [], locations: [], totalReports: 0 }));
app.get("/api/volunteers", (req, res) => res.json({ volunteers: [] }));
app.post("/api/volunteers", (req, res) => res.json({ success: true, volunteerId: "demo-123" }));
app.post("/api/match", (req, res) => res.json({ success: true, matches: [] }));
app.post("/api/insights", (req, res) => res.json({ insights: [] }));

app.listen(5000, "0.0.0.0", () => {
  console.log("Backend running on port 5000");
});