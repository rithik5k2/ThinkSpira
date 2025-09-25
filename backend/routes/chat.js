import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const router = express.Router();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load system prompt safely from backend folder
const systemPromptPath = path.join(__dirname, "../systemPrompt.txt");
let systemPrompt = "";
try {
  systemPrompt = fs.readFileSync(systemPromptPath, "utf-8");
  console.log("✅ systemPrompt.txt loaded successfully");
} catch (err) {
  console.error("❌ Failed to load systemPrompt.txt:", err.message);
  process.exit(1);
}

// IBM Deployment URL
const IBM_DEPLOYMENT_URL =
  "https://us-south.ml.cloud.ibm.com/ml/v1/deployments/748a42eb-1bef-4f1e-a901-45522d947f47/text/chat?version=2021-05-01";

const IBM_API_KEY = process.env.IBM_API_KEY;

if (!IBM_API_KEY) {
  console.error("❌ Error: IBM_API_KEY is not set in environment variables");
  process.exit(1);
}

// Get IBM IAM token
async function getIbmToken() {
  const response = await axios.post(
    "https://iam.cloud.ibm.com/identity/token",
    `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${IBM_API_KEY}`,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return response.data.access_token;
}

// POST /api/chat
router.post("/", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const token = await getIbmToken();

    const payload = {
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${systemPrompt} You are an educational scheduling assistant. Plan tasks strictly in JSON format according to the rules. Input: ${userMessage}`,
            },
          ],
        },
      ],
    };


    const response = await axios.post(IBM_DEPLOYMENT_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    res.json(response.data);
  } catch (err) {
    if (err.response) {
      console.error("❌ Error calling IBM LLM:", JSON.stringify(err.response.data, null, 2));
      return res.status(err.response.status).json(err.response.data);
    } else {
      console.error("❌ Error calling IBM LLM:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }
});

export default router;
