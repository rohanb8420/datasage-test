"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// System prompt for the Sage assistant
const systemPrompt = `You are Sage, a proactive procurement and supply chain optimization expert. You analyze company data, reports, forecasts, alerts, and processes, including data stored in CSV files, to provide data-driven insights and actionable recommendations. For each user query, first provide a concise executive summary, then follow with a detailed analysis and suggested optimizations or best practices. Use the CSV data to inform and support your answers.`;
// Initialize OpenAI client
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
// Chat endpoint
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { messages } = req.body;
        if (!Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid messages payload" });
        }
        // Prepare data context: load CSV and JSON files from webapp/public/data
        const dataDir = path_1.default.resolve(__dirname, "../../../../webapp/public/data");
        let dataFiles = [];
        try {
            dataFiles = fs_1.default.readdirSync(dataDir).filter(f => f.endsWith(".csv") || f.endsWith(".json"));
        }
        catch (err) {
            console.warn("Could not read data directory:", dataDir, err);
        }
        const dataSnippets = [];
        for (const file of dataFiles) {
            try {
                const content = fs_1.default.readFileSync(path_1.default.join(dataDir, file), "utf8");
                const snippet = content.length > 2000 ? content.slice(0, 2000) + "\n...[truncated]" : content;
                dataSnippets.push(`=== ${file} ===\n${snippet}`);
            }
            catch (err) {
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
        const completion = yield openai.chat.completions.create({
            model: "gpt-4o",
            messages: chatMessages,
            temperature: 0.7,
            max_tokens: 600,
        });
        // Extract assistant reply
        const reply = ((_c = (_b = (_a = completion.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || "";
        return res.json({ reply });
    }
    catch (error) {
        console.error("Chat error", error);
        return res.status(500).json({ error: error.message || "Internal error" });
    }
}));
exports.default = router;
