import { Router } from "express";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const router = Router();

// System prompt for the Sage assistant
const systemPrompt = `You are Sage, a proactive procurement and supply chain optimization expert. You analyze company data, reports, forecasts, alerts, and processes, including data stored in CSV files, to provide data-driven insights and actionable recommendations. For each user query, first provide a concise executive summary, then follow with a detailed analysis and suggested optimizations or best practices. Use the CSV data to inform and support your answers.`;

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Chat endpoint
router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages payload" });
    }

    // Prepare data context: load CSV and JSON files from webapp/public/data
    const dataDir = path.resolve(__dirname, "../../../../webapp/public/data");
    let dataFiles: string[] = [];
    try {
      dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith(".csv") || f.endsWith(".json"));
    } catch (err) {
      console.warn("Could not read data directory:", dataDir, err);
    }
    const dataSnippets: string[] = [];
    for (const file of dataFiles) {
      try {
        const content = fs.readFileSync(path.join(dataDir, file), "utf8");
        const snippet = content.length > 2000 ? content.slice(0, 2000) + "\n...[truncated]" : content;
        dataSnippets.push(`=== ${file} ===\n${snippet}`);
      } catch (err) {
        console.warn("Failed to read data file:", file, err);
      }
    }
    const dataMessage = {
      role: "system",
      content: `Available data files (names and sample content):\n${dataSnippets.join("\n\n")}`
    };
    // Prepend system prompt and data context
    const chatMessages = [
      { role: "system", content: systemPrompt },
      dataMessage,
      ...messages
    ];

    // Create chat completion using GPT-4o
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 600,
    });
    // Extract assistant reply
    const reply = completion.choices?.[0]?.message?.content || "";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Chat error", error);
    return res.status(500).json({ error: error.message || "Internal error" });
  }
});

export default router;